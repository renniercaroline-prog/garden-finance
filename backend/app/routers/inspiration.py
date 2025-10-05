from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import func, text
from uuid import UUID

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/inspiration", tags=["inspiration"])

@router.get("/role-model-feed", response_model=list[schemas.FeedItem])
def role_model_feed(
    db: Session = Depends(get_db),
    min_followers: int = Query(2, ge=0, le=1000),
    recent_days: int = Query(45, ge=1, le=365),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """
    Posts authored by 'role models' inferred as:
      - discoverable profiles
      - with >= min_followers
    Each item includes the author's spotlight (inspiration) portfolio if exists,
    else their latest portfolio snapshot.
    """
    # compute follower counts
    sub_counts = db.query(
        models.Follow.followee_id.label("uid"),
        func.count(models.Follow.follower_id).label("followers")
    ).group_by(models.Follow.followee_id).subquery()

    # candidate authors
    authors = db.query(models.Profile.id).join(
        sub_counts, sub_counts.c.uid == models.Profile.id, isouter=True
    ).filter(
        models.Profile.is_discoverable == True,
        func.coalesce(sub_counts.c.followers, 0) >= min_followers
    ).subquery()

    # posts by authors in recent window
    posts = db.query(models.Post)\
        .filter(models.Post.user_id.in_(authors))\
        .order_by(models.Post.created_at.desc())\
        .offset(offset).limit(limit).all()

    # preload profiles, role_models, and a portfolio snapshot
    user_ids = list({p.user_id for p in posts})
    profiles = {p.id: p for p in db.query(models.Profile).filter(models.Profile.id.in_(user_ids)).all()}
    role_models = {r.user_id: r for r in db.query(models.RoleModel).filter(models.RoleModel.user_id.in_(user_ids)).all()}

    # pick portfolio: spotlight first; else most recent
    portfolio_by_user: dict[UUID, models.Portfolio | None] = {}
    for uid in user_ids:
        rm = role_models.get(uid)
        if rm and rm.spotlight_portfolio_id:
            port = db.get(models.Portfolio, rm.spotlight_portfolio_id)
        else:
            port = db.query(models.Portfolio).filter(models.Portfolio.user_id == uid)\
                   .order_by(models.Portfolio.created_at.desc()).first()
        if port:
            # eager load holdings
            _ = port.holdings  # lazy load now
        portfolio_by_user[uid] = port

    items: list[schemas.FeedItem] = []
    for p in posts:
        items.append(schemas.FeedItem(
            post=schemas.PostOut.model_validate(p),
            author=schemas.ProfileOut.model_validate(profiles[p.user_id]),
            inspiration_portfolio=schemas.PortfolioOut.model_validate(portfolio_by_user[p.user_id]) if portfolio_by_user[p.user_id] else None
        ))
    return items
