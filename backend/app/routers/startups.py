from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas
from uuid import UUID

router = APIRouter(prefix="/startups", tags=["startups"])

@router.post("", response_model=schemas.StartupOut, status_code=201)
def create_startup(payload: schemas.StartupCreate, db: Session = Depends(get_db)):
    s = models.Startup(**payload.model_dump())
    db.add(s); db.commit(); db.refresh(s)
    return s

@router.get("", response_model=list[schemas.StartupOut])
def list_startups(
    db: Session = Depends(get_db),
    q: str | None = None,
    sector: str | None = None,
    open_only: bool = True,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    qy = db.query(models.Startup)
    if q:
        like = f"%{q}%"
        qy = qy.filter((models.Startup.name.ilike(like)) | (models.Startup.slug.ilike(like)) | (models.Startup.sector.ilike(like)))
    if sector:
        qy = qy.filter(models.Startup.sector == sector)
    if open_only:
        qy = qy.filter(models.Startup.open_for_investment == True)
    return qy.order_by(models.Startup.created_at.desc()).offset(offset).limit(limit).all()

@router.get("/{startup_id}", response_model=schemas.StartupOut)
def get_startup(startup_id: UUID, db: Session = Depends(get_db)):
    s = db.get(models.Startup, startup_id)
    if not s: raise HTTPException(404, "Startup not found")
    return s
