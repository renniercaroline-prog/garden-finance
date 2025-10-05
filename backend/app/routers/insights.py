from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from uuid import UUID

from ..db import get_db

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/instrument-cooccur")
def instrument_cooccur(
    db: Session = Depends(get_db),
    min_coholders: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    order_by: str = Query("lift", pattern="^(jaccard|lift|coholders)$"),
    desc: bool = True,
):
    sql = f"""
      SELECT a_key, a_label, b_key, b_label, coholders, jaccard, lift
      FROM public.instrument_cooccur_mv
      WHERE coholders >= :m
      ORDER BY {order_by} {'DESC' if desc else 'ASC'} NULLS LAST
      LIMIT :k
    """
    rows = db.execute(text(sql), {"m": min_coholders, "k": limit}).mappings().all()
    return [dict(r) for r in rows]

@router.get("/similar-users/{user_id}")
def similar_users_instrument(
    user_id: UUID,
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=200),
):
    sql = text("""
        SELECT u, v, jaccard, intersect_sz, a_sz, b_sz
        FROM public.user_user_similarity_instrument_mv
        WHERE u = :uid
        UNION ALL
        SELECT v AS u, u AS v, jaccard, intersect_sz, a_sz, b_sz
        FROM public.user_user_similarity_instrument_mv
        WHERE v = :uid
        ORDER BY jaccard DESC NULLS LAST
        LIMIT :lim
    """)
    rows = db.execute(sql, {"uid": str(user_id), "lim": limit}).mappings().all()
    return [dict(r) for r in rows]
