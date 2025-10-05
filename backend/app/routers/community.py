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
    Connected component for user_id on the unified instrument graph.
    """
    sql = text("""
    WITH RECURSIVE
    edges AS (
      SELECT u AS a, v AS b
      FROM public.user_user_similarity_instrument_mv
      WHERE jaccard >= :thr
      UNION ALL
      SELECT v AS a, u AS b
      FROM public.user_user_similarity_instrument_mv
      WHERE jaccard >= :thr
    ),
    seed AS (SELECT CAST(:uid AS uuid) AS id),
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
    topk_instruments: int = Query(10, ge=1, le=50),
):
    """
    Suggest invites + dominant instruments (stocks/startups) for a new club,
    based on the user's component on the instrument graph.
    """
    # 1) Component members
    comp_sql = text("""
      WITH RECURSIVE
      edges AS (
        SELECT u AS a, v AS b
        FROM public.user_user_similarity_instrument_mv
        WHERE jaccard >= :thr
        UNION ALL
        SELECT v AS a, u AS b
        FROM public.user_user_similarity_instrument_mv
        WHERE jaccard >= :thr
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

    # 2) Top similar users (instrument similarity)
    sims_sql = text("""
      SELECT u, v, jaccard FROM (
        SELECT u, v, jaccard
        FROM public.user_user_similarity_instrument_mv
        WHERE u = :uid
        UNION ALL
        SELECT v AS u, u AS v, jaccard
        FROM public.user_user_similarity_instrument_mv
        WHERE v = :uid
      ) s
      WHERE v <> :uid
      ORDER BY jaccard DESC NULLS LAST
      LIMIT :k
    """)
    sims = db.execute(sims_sql, {"uid": str(user_id), "k": topk_users}).mappings().all()

    # 3) Dominant instruments by weight across the component.
    #    Sum pct_weight for stocks (symbol) and startups (startup_id) together.
    agg_sql = text("""
      WITH comp AS (SELECT UNNEST(:uids) AS user_id),
      h AS (
        SELECT h.symbol, h.startup_id, h.pct_weight
        FROM public.holdings h
        JOIN public.portfolios p ON p.id = h.portfolio_id
        WHERE p.user_id = ANY(:uids)
      ),
      unified AS (
        -- key = text; label + kind resolved via joins
        SELECT
          h.symbol::text AS key,
          a.name        AS label,
          'STOCK'::text AS kind,
          SUM(h.pct_weight)::numeric AS total_weight
        FROM h JOIN public.assets a ON a.symbol = h.symbol
        WHERE h.symbol IS NOT NULL
        GROUP BY 1,2,3
        UNION ALL
        SELECT
          h.startup_id::text AS key,
          s.name             AS label,
          'STARTUP'::text    AS kind,
          SUM(h.pct_weight)::numeric AS total_weight
        FROM h JOIN public.startups s ON s.id = h.startup_id
        WHERE h.startup_id IS NOT NULL
        GROUP BY 1,2,3
      )
      SELECT key, label, kind, total_weight
      FROM unified
      ORDER BY total_weight DESC
      LIMIT :k
    """).bindparams(
        bindparam("uids", type_=ARRAY(PG_UUID(as_uuid=True))),
    )
    dom = db.execute(agg_sql, {"uids": comp_users, "k": topk_instruments}).mappings().all()

    # Optional "theme": most common sector among top stocks only
    theme_sql = text("""
      WITH comp AS (SELECT UNNEST(:uids) AS user_id),
      h AS (
        SELECT h.symbol, h.pct_weight
        FROM public.holdings h
        JOIN public.portfolios p ON p.id = h.portfolio_id
        WHERE p.user_id = ANY(:uids) AND h.symbol IS NOT NULL
      )
      SELECT a.sector, SUM(h.pct_weight)::numeric AS total_weight
      FROM h JOIN public.assets a ON a.symbol = h.symbol
      GROUP BY a.sector
      ORDER BY total_weight DESC NULLS LAST
      LIMIT 1
    """).bindparams(bindparam("uids", type_=ARRAY(PG_UUID(as_uuid=True))))
    theme_row = db.execute(theme_sql, {"uids": comp_users}).first()
    suggested_theme = theme_row[0] if theme_row and theme_row[0] else None

    return {
        "suggested_invitees": sims,     # [{u, v, jaccard}]
        "dominant_instruments": dom,    # [{key, label, kind, total_weight}]
        "suggested_theme": suggested_theme,
    }

@router.get("/club-recos/{club_id}")
def club_recommendations(
    club_id: UUID,
    db: Session = Depends(get_db),
    topk_add: int = Query(12, ge=1, le=50),
    min_coholders: int = Query(2, ge=1, le=50),
):
    """
    Recommend instruments (stock or startup) for a club using instrument co-occurrence.
    """
    # Current instrument keys for the club (symbol text + startup_id::text)
    cur_sql = text("""
      WITH members AS (SELECT user_id FROM public.club_members WHERE club_id = :cid),
      h AS (
        SELECT h.symbol, h.startup_id
        FROM public.holdings h
        JOIN public.portfolios p ON p.id = h.portfolio_id
        WHERE p.user_id IN (SELECT user_id FROM members)
      )
      SELECT DISTINCT x.key FROM (
        SELECT h.symbol::text AS key FROM h WHERE h.symbol IS NOT NULL
        UNION
        SELECT h.startup_id::text AS key FROM h WHERE h.startup_id IS NOT NULL
      ) x
    """)
    current = [r[0] for r in db.execute(cur_sql, {"cid": str(club_id)}).all()]
    if not current:
        return {"recommendations": []}

    # Rank by lift/jaccard; exclude items already held
    rec_sql = text("""
      WITH cand AS (
        SELECT
          CASE WHEN a_key = ANY(:keys) THEN b_key ELSE a_key END AS candidate,
          a_label, b_label,
          jaccard, lift, coholders
        FROM public.instrument_cooccur_mv
        WHERE (a_key = ANY(:keys) OR b_key = ANY(:keys))
          AND coholders >= :minc
      ),
      uniq AS (
        SELECT candidate,
               MAX(lift) AS lift,
               MAX(jaccard) AS jaccard,
               MAX(coholders) AS coholders
        FROM cand
        WHERE NOT (candidate = ANY(:keys))
        GROUP BY candidate
      )
      SELECT
        u.candidate AS key,
        COALESCE(a.name, s.name)        AS label,
        CASE WHEN a.symbol IS NOT NULL THEN 'STOCK' ELSE 'STARTUP' END AS kind,
        u.lift, u.jaccard, u.coholders
      FROM uniq u
      LEFT JOIN public.assets   a ON a.symbol = u.candidate
      LEFT JOIN public.startups s ON s.id::text = u.candidate
      ORDER BY u.lift DESC NULLS LAST, u.jaccard DESC NULLS LAST
      LIMIT :k
    """).bindparams(bindparam("keys", type_=ARRAY(String())))
    recs = db.execute(rec_sql, {"keys": current, "minc": min_coholders, "k": topk_add}).mappings().all()

    return {"recommendations": [dict(r) for r in recs]}
