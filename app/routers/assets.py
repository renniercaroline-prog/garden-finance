from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/assets", tags=["assets"])

@router.get("", response_model=list[schemas.AssetOut])
def list_assets(
    db: Session = Depends(get_db),
    sector: str | None = None,
    q: str | None = None,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    query = db.query(models.Asset)
    if sector:
        query = query.filter(models.Asset.sector == sector)
    if q:
        like = f"%{q}%"
        query = query.filter((models.Asset.symbol.ilike(like)) | (models.Asset.name.ilike(like)))
    return query.order_by(models.Asset.symbol.asc()).offset(offset).limit(limit).all()
