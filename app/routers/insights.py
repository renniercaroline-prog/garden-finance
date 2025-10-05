from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, text
from uuid import UUID

from ..db import get_db
from ..models import asset_asset_cooccur_mv, user_user_similarity_mv
from ..schemas import AssetCooccurOut, SimilarUserOut

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/asset-cooccur", response_model=list[AssetCooccurOut])
def asset_cooccur(
    db: Session = Depends(get_db),
    min_coholders: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    order_by: str = Query("jaccard", pattern="^(jaccard|lift|coholders)$"),
    desc: bool = True,
):
    stmt = select(
        asset_asset_cooccur_mv.c.a,
        asset_asset_cooccur_mv.c.b,
        asset_asset_cooccur_mv.c.coholders,
        asset_asset_cooccur_mv.c.holders_a,
        asset_asset_cooccur_mv.c.holders_b,
        asset_asset_cooccur_mv.c.jaccard,
        asset_asset_cooccur_mv.c.lift,
    ).where(asset_asset_cooccur_mv.c.coholders >= min_coholders)

    col = getattr(asset_asset_cooccur_mv.c, order_by)
    stmt = stmt.order_by(col.desc() if desc else col.asc()).limit(limit)
    rows = db.execute(stmt).all()
    return [AssetCooccurOut(**dict(r._mapping)) for r in rows]

@router.get("/similar-users/{user_id}", response_model=list[SimilarUserOut])
def similar_users(
    user_id: UUID,
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=200),
):
    # user_user_similarity_mv stores pairs (u < v). We need both perspectives.
    sql = text("""
        SELECT u, v, jaccard, intersect_sz, a_sz, b_sz
        FROM public.user_user_similarity_mv
        WHERE u = :uid
        UNION ALL
        SELECT v AS u, u AS v, jaccard, intersect_sz, a_sz, b_sz
        FROM public.user_user_similarity_mv
        WHERE v = :uid
        ORDER BY jaccard DESC NULLS LAST
        LIMIT :lim
    """)
    rows = db.execute(sql, {"uid": str(user_id), "lim": limit}).all()
    return [SimilarUserOut(**dict(r._mapping)) for r in rows]
