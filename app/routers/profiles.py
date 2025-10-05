from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.get("", response_model=list[schemas.ProfileOut])
def list_profiles(
    db: Session = Depends(get_db),
    q: str | None = Query(None, description="Search by display_name (ILIKE)"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    query = db.query(models.Profile)
    if q:
        query = query.filter(models.Profile.display_name.ilike(f"%{q}%"))
    return query.order_by(models.Profile.created_at.desc()).offset(offset).limit(limit).all()

@router.get("/{profile_id}", response_model=schemas.ProfileOut)
def get_profile(profile_id: UUID, db: Session = Depends(get_db)):
    prof = db.get(models.Profile, profile_id)
    if not prof:
        raise HTTPException(404, "Profile not found")
    return prof

@router.post("", response_model=schemas.ProfileOut, status_code=201)
def create_profile(payload: schemas.ProfileCreate, db: Session = Depends(get_db)):
    if db.get(models.Profile, payload.id):
        raise HTTPException(409, "Profile already exists")
    prof = models.Profile(**payload.model_dump())
    db.add(prof)
    db.commit()
    db.refresh(prof)
    return prof

@router.patch("/{profile_id}", response_model=schemas.ProfileOut)
def update_profile(profile_id: UUID, payload: schemas.ProfileUpdate, db: Session = Depends(get_db)):
    prof = db.get(models.Profile, profile_id)
    if not prof:
        raise HTTPException(404, "Profile not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(prof, k, v)
    db.commit()
    db.refresh(prof)
    return prof
