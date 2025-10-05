from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("", response_model=schemas.PostOut, status_code=201)
def create_post(payload: schemas.PostCreate, db: Session = Depends(get_db)):
    if not db.get(models.Profile, payload.user_id):
        raise HTTPException(404, "Author not found")
    p = models.Post(**payload.model_dump())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@router.get("/feed/{user_id}", response_model=list[schemas.PostOut])
def feed_for_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    # Simple feed: posts by accounts I follow OR discoverable authors
    sub_followees = db.query(models.Follow.followee_id).filter(models.Follow.follower_id == user_id).subquery()
    q = db.query(models.Post).join(models.Profile, models.Post.user_id == models.Profile.id)\
        .filter((models.Post.user_id.in_(sub_followees)) | (models.Profile.is_discoverable == True))\
        .order_by(models.Post.created_at.desc()).offset(offset).limit(limit)
    return q.all()
