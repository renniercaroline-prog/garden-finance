# app/routers/community.py
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text, bindparam, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from uuid import UUID

from ..db import get_db

router = APIRouter(prefix="/community", tags=["community"])

@router.get("/components/{user_id}")
def user_component(
    user_id: UUID,
    db: Session = Depends(get_db),
    jaccard_min: float = Query(0.25, ge=0.0, le=1.0),
    max_nodes: int = Query(200, ge=5, le=2000),
):
    """
    Return the connected component for user_id in the thresholded user-user graph.
    """
    sql = text("""
    WITH RECURSIVE
    edges AS (
      SELECT u AS a, v AS b FROM public.user_user_similarity_mv WHERE jaccard >= :thr
      UNION ALL
      SELECT v AS a, u AS b FROM public.user_user_similarity_mv WHERE jaccard >= :thr
    ),
    seed AS (
      SELECT CAST(:uid AS uuid) AS id
    ),
    reach(id) AS (
      SELECT id FROM seed
      UNION
      SELECT e.b FROM edges e JOIN reach r ON e.a = r.id
    )
    SELECT id FROM reach LIMIT :maxn
    """)
    rows = db.execute(sql, {"uid": str(user_id), "thr": jaccard_min, "maxn": max_nodes}).all()
    return {"user_id": user_id, "component_user_ids": [r[0] for r in rows]}

@router.get("/suggest-club/{user_id}")
def suggest_club_for_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    jaccard_min: float = Query(0.25, ge=0.0, le=1.0),
    topk_users: int = Query(10, ge=1, le=100),
    topk_assets: int = Query(8, ge=1, le=50),
):
    # 1) component members (recursive CTE)
    comp_sql = text("""
      WITH RECURSIVE
      edges AS (
        SELECT u AS a, v AS b FROM public.user_user_similarity_mv WHERE jaccard >= :thr
        UNION ALL
        SELECT v AS a, u AS b FROM public.user_user_similarity_mv WHERE jaccard >= :thr
      ),
      seed AS (SELECT CAST(:uid AS uuid) AS id),
      reach(id) AS (
        SELECT id FROM seed
        UNION
        SELECT e.b FROM edges e JOIN reach r ON e.a = r.id
      )
      SELECT id FROM reach
    """)
    comp_users = [r[0] for r in db.execute(comp_sql, {"uid": str(user_id), "thr": jaccard_min}).all()]
    if not comp_users:
        raise HTTPException(404, "No community found")

    # 2) top similar users for invitations
    sims_sql = text("""
      SELECT u, v, jaccard FROM (
        SELECT u, v, jaccard FROM public.user_user_similarity_mv WHERE u = :uid
        UNION ALL
        SELECT v AS u, u AS v, jaccard FROM public.user_user_similarity_mv WHERE v = :uid
      ) s
      WHERE v <> :uid
      ORDER BY jaccard DESC NULLS LAST
      LIMIT :k
    """)
    sims = db.execute(sims_sql, {"uid": str(user_id), "k": topk_users}).mappings().all()

    # 3) dominant assets within the component (typed ARRAY(UUID) + ANY)
    agg_sql = text("""
      WITH uh AS (
        SELECT h.symbol, h.pct_weight
        FROM public.holdings h
        JOIN public.portfolios p ON p.id = h.portfolio_id
        WHERE p.user_id = ANY(:uids)
      )
      SELECT a.symbol, a.name, a.sector, SUM(uh.pct_weight)::numeric AS total_weight
      FROM uh JOIN public.assets a ON a.symbol = uh.symbol
      GROUP BY a.symbol, a.name, a.sector
      ORDER BY total_weight DESC
      LIMIT :ka
    """).bindparams(
        bindparam("uids", type_=ARRAY(PG_UUID(as_uuid=True))),
    )
    agg = db.execute(agg_sql, {"uids": comp_users, "ka": topk_assets}).mappings().all()

    return {
        "suggested_invitees": sims,          # [{u, v, jaccard}]
        "dominant_assets": agg,              # [{symbol, name, sector, total_weight}]
        "suggested_theme": agg[0]["sector"] if agg else None,
    }

@router.get("/club-recos/{club_id}")
def club_recommendations(
    club_id: UUID,
    db: Session = Depends(get_db),
    topk_add: int = Query(10, ge=1, le=50),
    min_coholders: int = Query(2, ge=1, le=50),
):
    # Current symbols owned by club members
    cur_sql = text("""
      WITH members AS (SELECT user_id FROM public.club_members WHERE club_id = :cid),
      syms AS (
        SELECT DISTINCT h.symbol
        FROM public.holdings h
        JOIN public.portfolios p ON p.id = h.portfolio_id
        WHERE p.user_id IN (SELECT user_id FROM members)
      )
      SELECT symbol FROM syms
    """)
    current = [r[0] for r in db.execute(cur_sql, {"cid": str(club_id)}).all()]
    if not current:
        return {"recommendations": []}

    # Recommend via co-occurrence; use ANY(:syms) with typed ARRAY(TEXT)
    rec_sql = text("""
      WITH cand AS (
        SELECT
          CASE WHEN a = ANY(:syms) THEN b ELSE a END AS candidate,
          jaccard, lift, coholders
        FROM public.asset_asset_cooccur_mv
        WHERE (a = ANY(:syms) OR b = ANY(:syms))
          AND coholders >= :minc
      ),
      uniq AS (
        SELECT candidate,
               MAX(lift) AS lift,
               MAX(jaccard) AS jaccard,
               MAX(coholders) AS coholders
        FROM cand
        WHERE NOT (candidate = ANY(:syms))
        GROUP BY candidate
      )
      SELECT u.candidate AS symbol, a.name, a.sector, u.lift, u.jaccard, u.coholders
      FROM uniq u JOIN public.assets a ON a.symbol = u.candidate
      ORDER BY u.lift DESC NULLS LAST, u.jaccard DESC NULLS LAST
      LIMIT :k
    """).bindparams(
        bindparam("syms", type_=ARRAY(String())),
    )
    recs = db.execute(rec_sql, {"syms": current, "minc": min_coholders, "k": topk_add}).mappings().all()
    return {"recommendations": recs}
