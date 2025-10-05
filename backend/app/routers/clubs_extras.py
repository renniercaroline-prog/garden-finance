from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import text, func
from uuid import UUID

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/clubs-extra", tags=["clubs-extra"])

@router.get("/{club_id}/mini-portfolio")
def club_mini_portfolio(
    club_id: UUID,
    db: Session = Depends(get_db),
    normalize: bool = True,
    topk: int = Query(25, ge=1, le=200),
):
    rows = db.execute(text("""
      with members as (select user_id from public.club_members where club_id = :cid),
      agg as (
        select h.symbol, sum(h.pct_weight)::numeric as total_weight
        from public.holdings h
        join public.portfolios p on p.id = h.portfolio_id
        where p.user_id in (select user_id from members)
        group by h.symbol
      )
      select a.symbol, a.name, a.sector, a.geography, agg.total_weight
      from agg join public.assets a on a.symbol = agg.symbol
      order by agg.total_weight desc
      limit :k
    """), {"cid": str(club_id), "k": topk}).mappings().all()

    if not rows:
        return {"symbols": [], "normalized": False}

    # Convert to dicts so we can add fields
    rows_dict = [dict(r) for r in rows]

    if normalize:
        total = sum(float(r["total_weight"]) for r in rows_dict) or 0.0
        if total > 0:
            symbols = [{**r, "weight_norm": float(r["total_weight"]) / total} for r in rows_dict]
        else:
            symbols = [{**r, "weight_norm": 0.0} for r in rows_dict]
        return {"symbols": symbols, "normalized": True}

    return {"symbols": rows_dict, "normalized": False}

# ----- Goals -----

@router.post("/{club_id}/goals", response_model=schemas.ClubGoalOut, status_code=201)
def create_goal(club_id: UUID, payload: schemas.ClubGoalCreate, db: Session = Depends(get_db)):
    if not db.get(models.Club, club_id):
        raise HTTPException(404, "Club not found")
    g = models.ClubGoal(club_id=club_id, **payload.model_dump())
    db.add(g)
    db.commit()
    db.refresh(g)
    return g

@router.get("/{club_id}/goals", response_model=list[schemas.ClubGoalOut])
def list_goals(club_id: UUID, db: Session = Depends(get_db)):
    return db.query(models.ClubGoal).filter(models.ClubGoal.club_id == club_id).order_by(models.ClubGoal.created_at.desc()).all()

# ----- Contributions & Progress -----

@router.post("/{club_id}/contributions", response_model=schemas.ContributionOut, status_code=201)
def contribute(club_id: UUID, payload: schemas.ContributionCreate, db: Session = Depends(get_db)):
    if not db.get(models.Club, club_id):
        raise HTTPException(404, "Club not found")
    if not db.get(models.Profile, payload.user_id):
        raise HTTPException(404, "User not found")
    if payload.goal_id and not db.get(models.ClubGoal, payload.goal_id):
        raise HTTPException(404, "Goal not found")
    c = models.Contribution(club_id=club_id, **payload.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.get("/{club_id}/progress")
def club_progress(
    club_id: UUID,
    db: Session = Depends(get_db),
    goal_id: UUID | None = None,
    days: int = Query(90, ge=1, le=365),
):
    """
    Return progress toward goal(s): totals, % to target, recent pace.
    """
    if goal_id:
        goals = db.query(models.ClubGoal).filter(models.ClubGoal.id == goal_id, models.ClubGoal.club_id == club_id).all()
    else:
        goals = db.query(models.ClubGoal).filter(models.ClubGoal.club_id == club_id).all()

    # sum contributions
    out = []
    for g in goals:
        total = db.query(func.coalesce(func.sum(models.Contribution.amount_cents), 0)).filter(
            models.Contribution.club_id == club_id,
            models.Contribution.goal_id == g.id
        ).scalar()
        pct = float(total) / float(g.target_amount_cents) if g.target_amount_cents else None

        # recent pace (last N days)
        pace = db.execute(text("""
          select coalesce(sum(amount_cents),0) as cents
          from public.contributions
          where club_id = :cid and goal_id = :gid
            and created_at >= now() - (:days || ' days')::interval
        """), {"cid": str(club_id), "gid": str(g.id), "days": days}).scalar()
        out.append({
            "goal": schemas.ClubGoalOut.model_validate(g),
            "total_cents": int(total),
            "percent_to_target": pct,
            "recent_days": days,
            "recent_cents": int(pace or 0)
        })
    return {"club_id": club_id, "goals": out}

# ----- Club chat -----

@router.get("/{club_id}/chat", response_model=list[schemas.ClubMessageOut])
def get_chat(club_id: UUID, db: Session = Depends(get_db), limit: int = Query(100, ge=1, le=500)):
    msgs = db.query(models.ClubMessage).filter(models.ClubMessage.club_id == club_id)\
        .order_by(models.ClubMessage.created_at.desc()).limit(limit).all()
    return msgs[::-1]  # chronological

@router.post("/{club_id}/chat", response_model=schemas.ClubMessageOut, status_code=201)
def post_chat(club_id: UUID, payload: schemas.ClubMessageCreate, db: Session = Depends(get_db)):
    if not db.get(models.Club, club_id):
        raise HTTPException(404, "Club not found")
    if not db.get(models.Profile, payload.user_id):
        raise HTTPException(404, "User not found")
    m = models.ClubMessage(club_id=club_id, user_id=payload.user_id, message=payload.message)
    db.add(m)
    db.commit()
    db.refresh(m)
    return m
