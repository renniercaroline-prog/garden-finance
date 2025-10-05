from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/clubs", tags=["clubs"])

@router.get("", response_model=list[schemas.ClubOut])
def list_clubs(
    db: Session = Depends(get_db),
    privacy: str | None = Query(None, regex="^(private|invite|public)$"),
    limit: int = Query(100, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    q = db.query(models.Club)
    if privacy:
        q = q.filter(models.Club.privacy_level == privacy)
    return q.order_by(models.Club.created_at.desc()).offset(offset).limit(limit).all()

@router.post("", response_model=schemas.ClubOut, status_code=201)
def create_club(payload: schemas.ClubCreate, db: Session = Depends(get_db)):
    c = models.Club(name=payload.name, theme=payload.theme, privacy_level=payload.privacy_level)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.post("/{club_id}/join/{user_id}", response_model=schemas.ClubMemberOut)
def join_club(club_id: UUID, user_id: UUID, db: Session = Depends(get_db)):
    club = db.get(models.Club, club_id)
    user = db.get(models.Profile, user_id)
    if not club or not user:
        raise HTTPException(404, "Club or user not found")
    existing = db.query(models.ClubMember).filter_by(club_id=club_id, user_id=user_id).first()
    if existing:
        return existing
    m = models.ClubMember(club_id=club_id, user_id=user_id, role="member")
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

@router.delete("/{club_id}/leave/{user_id}", status_code=204)
def leave_club(club_id: UUID, user_id: UUID, db: Session = Depends(get_db)):
    m = db.query(models.ClubMember).filter_by(club_id=club_id, user_id=user_id).first()
    if not m:
        raise HTTPException(404, "Membership not found")
    db.delete(m)
    db.commit()
