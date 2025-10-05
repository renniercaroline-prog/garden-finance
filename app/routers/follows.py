from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/follows", tags=["follows"])

@router.post("/{follower_id}/follow/{followee_id}", response_model=schemas.FollowOut, status_code=201)
def follow(follower_id: UUID, followee_id: UUID, db: Session = Depends(get_db)):
    if follower_id == followee_id:
        raise HTTPException(400, "Cannot follow yourself")
    follower = db.get(models.Profile, follower_id)
    followee = db.get(models.Profile, followee_id)
    if not follower or not followee:
        raise HTTPException(404, "User(s) not found")
    existing = db.get(models.Follow, {"follower_id": follower_id, "followee_id": followee_id})
    if existing:
        return existing
    f = models.Follow(follower_id=follower_id, followee_id=followee_id)
    db.add(f)
    db.commit()
    db.refresh(f)
    return f

@router.delete("/{follower_id}/unfollow/{followee_id}", status_code=204)
def unfollow(follower_id: UUID, followee_id: UUID, db: Session = Depends(get_db)):
    f = db.query(models.Follow).filter_by(follower_id=follower_id, followee_id=followee_id).first()
    if not f:
        raise HTTPException(404, "Follow relation not found")
    db.delete(f)
    db.commit()
