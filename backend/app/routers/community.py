from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
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
    sql = text(f"""
    with edges as (
      select u as a, v as b from public.user_user_similarity_mv where jaccard >= :thr
      union all
      select v as a, u as b from public.user_user_similarity_mv where jaccard >= :thr
    ),
    seed as (
      select :uid::uuid as id
    ),
    reach(id) as (
      select id from seed
      union
      select e.b from edges e join reach r on e.a = r.id
    )
    select id from reach limit :maxn
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
    """
    Suggest a new club: who to invite (top similar users from component)
    and which theme/assets dominate that component.
    """
    # 1) component members
    comp = db.execute(text("""
      with edges as (
        select u as a, v as b from public.user_user_similarity_mv where jaccard >= :thr
        union all
        select v as a, u as b from public.user_user_similarity_mv where jaccard >= :thr
      ),
      seed as ( select :uid::uuid as id ),
      reach(id) as (
        select id from seed
        union
        select e.b from edges e join reach r on e.a = r.id
      )
      select id from reach
    """), {"uid": str(user_id), "thr": jaccard_min}).fetchall()
    comp_users = [r[0] for r in comp]
    if not comp_users:
        raise HTTPException(404, "No community found")

    # 2) top similar users for invitations (exclude self)
    sims = db.execute(text("""
      select u, v, jaccard from (
        select u, v, jaccard from public.user_user_similarity_mv where u = :uid
        union all
        select v as u, u as v, jaccard from public.user_user_similarity_mv where v = :uid
      ) s
      where v <> :uid
      order by jaccard desc nulls last
      limit :k
    """), {"uid": str(user_id), "k": topk_users}).mappings().all()

    # 3) dominant assets in component (aggregate holdings)
    agg = db.execute(text("""
      with comp_users as (select unnest(:uids::uuid[]) as user_id),
      uh as (
        select h.symbol, h.pct_weight
        from public.holdings h
        join public.portfolios p on p.id = h.portfolio_id
        where p.user_id in (select user_id from comp_users)
      )
      select a.symbol, a.name, a.sector, sum(uh.pct_weight)::numeric as total_weight
      from uh join public.assets a on a.symbol = uh.symbol
      group by a.symbol, a.name, a.sector
      order by total_weight desc
      limit :ka
    """), {"uids": comp_users, "ka": topk_assets}).mappings().all()

    return {
        "suggested_invitees": sims,                  # [{u, v, jaccard}]
        "dominant_assets": agg,                      # [{symbol, name, sector, total_weight}]
        "suggested_theme": agg[0]["sector"] if agg else None
    }

@router.get("/club-recos/{club_id}")
def club_recommendations(
    club_id: UUID,
    db: Session = Depends(get_db),
    topk_add: int = Query(10, ge=1, le=50),
    min_coholders: int = Query(2, ge=1, le=50),
):
    """
    Recommend assets for a club: find assets co-occurring with the club's current
    aggregate holdings but underrepresented (diversification).
    """
    # club current symbols
    current = db.execute(text("""
      with members as (select user_id from public.club_members where club_id = :cid),
      syms as (
        select distinct h.symbol
        from public.holdings h
        join public.portfolios p on p.id = h.portfolio_id
        where p.user_id in (select user_id from members)
      )
      select symbol from syms
    """), {"cid": str(club_id)}).fetchall()
    current_syms = [r[0] for r in current]
    if not current_syms:
        return {"recommendations": []}

    # recommend via asset_asset_cooccur_mv: pick pairs touching current, then rank by lift desc
    recs = db.execute(text("""
      with mine as (select unnest(:syms::text[]) as s),
      cand as (
        select case when a in (select s from mine) then b else a end as candidate,
               jaccard, lift, coholders
        from public.asset_asset_cooccur_mv
        where (a in (select s from mine) or b in (select s from mine))
          and coholders >= :minc
      ),
      uniq as (
        select candidate, max(lift) as lift, max(jaccard) as jaccard, max(coholders) as coholders
        from cand
        where candidate <> all(:syms::text[])
        group by candidate
      )
      select u.candidate as symbol, a.name, a.sector, u.lift, u.jaccard, u.coholders
      from uniq u join public.assets a on a.symbol = u.candidate
      order by u.lift desc nulls last, u.jaccard desc nulls last
      limit :k
    """), {"syms": current_syms, "minc": min_coholders, "k": topk_add}).mappings().all()

    return {"recommendations": recs}
