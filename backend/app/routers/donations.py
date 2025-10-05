# app/routers/donations.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text, func, select
from uuid import UUID
from datetime import datetime, timedelta

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/donations", tags=["donations"])

# ----- Causes -----

@router.post("/causes", response_model=schemas.CauseOut, status_code=201)
def create_cause(payload: schemas.CauseCreate, db: Session = Depends(get_db)):
    c = models.Cause(**payload.model_dump())
    db.add(c); db.commit(); db.refresh(c)
    return c

@router.get("/causes", response_model=list[schemas.CauseOut])
def list_causes(db: Session = Depends(get_db), active: bool | None = None, q: str | None = None, limit: int = Query(50, ge=1, le=200), offset: int = 0):
    # Join with stats view for richer cards
    sql = """
      select s.*
      from public.cause_donation_stats s
      where (:active is null or s.active = :active)
        and (:q is null or s.name ilike '%'||:q||'%' or s.category ilike '%'||:q||'%' or s.country ilike '%'||:q||'%')
      order by coalesce(s.progress_ratio, 0) desc, s.created_at desc
      limit :limit offset :offset
    """
    rows = db.execute(text(sql), {"active": active, "q": q, "limit": limit, "offset": offset}).mappings().all()
    return [schemas.CauseOut(**dict(r)) for r in rows]

@router.get("/causes/{cause_id}", response_model=schemas.CauseOut)
def get_cause(cause_id: UUID, db: Session = Depends(get_db)):
    row = db.execute(text("select * from public.cause_donation_stats where id = :cid"), {"cid": str(cause_id)}).mappings().first()
    if not row: raise HTTPException(404, "Cause not found")
    return schemas.CauseOut(**dict(row))

# ----- One-off donations -----

@router.post("", response_model=schemas.DonationOut, status_code=201)
def donate(payload: schemas.DonationCreate, db: Session = Depends(get_db)):
    if not db.get(models.Cause, payload.cause_id):
        raise HTTPException(404, "Cause not found")
    if not db.get(models.Profile, payload.user_id):
        raise HTTPException(404, "User not found")
    d = models.Donation(
        user_id=payload.user_id,
        cause_id=payload.cause_id,
        club_id=payload.club_id,
        amount_cents=payload.amount_cents,
        currency=payload.currency,
        message=payload.message,
        status='succeeded'  # NOTE: in production set 'pending' before PSP confirmation
    )
    db.add(d); db.commit(); db.refresh(d)
    return d

@router.get("/user/{user_id}", response_model=list[schemas.DonationOut])
def user_donations(user_id: UUID, db: Session = Depends(get_db), limit: int = Query(100, ge=1, le=500)):
    rows = db.query(models.Donation).filter(models.Donation.user_id == user_id)\
        .order_by(models.Donation.created_at.desc()).limit(limit).all()
    return rows

# ----- Leaderboards & progress -----

@router.get("/causes/{cause_id}/progress")
def cause_progress(cause_id: UUID, db: Session = Depends(get_db)):
    row = db.execute(text("select * from public.cause_donation_stats where id = :cid"), {"cid": str(cause_id)}).mappings().first()
    if not row: raise HTTPException(404, "Cause not found")
    # top donors (last 30d)
    top = db.execute(text("""
      select d.user_id, p.display_name, sum(d.amount_cents)::bigint as cents
      from public.donations d
      join public.profiles p on p.id = d.user_id
      where d.cause_id = :cid and d.status='succeeded'
        and d.created_at >= now() - interval '30 days'
      group by d.user_id, p.display_name
      order by cents desc
      limit 10
    """), {"cid": str(cause_id)}).mappings().all()
    return {
      "cause": dict(row),
      "top_donors_30d": [dict(r) for r in top]
    }

@router.get("/leaderboard")
def global_leaderboard(db: Session = Depends(get_db), limit: int = 10):
    rows = db.execute(text("""
      select c.slug, c.name, s.total_cents, s.donors, s.progress_ratio
      from public.cause_donation_stats s
      join public.causes c on c.id = s.id
      order by s.total_cents desc
      limit :k
    """), {"k": limit}).mappings().all()
    return [dict(r) for r in rows]

# ----- Recurring pledges (app-level) -----

@router.post("/recurring", response_model=schemas.RecurringDonationOut, status_code=201)
def create_recurring(payload: schemas.RecurringDonationCreate, db: Session = Depends(get_db)):
    if not db.get(models.Cause, payload.cause_id):
        raise HTTPException(404, "Cause not found")
    if not db.get(models.Profile, payload.user_id):
        raise HTTPException(404, "User not found")

    next_charge = None
    if payload.interval == "monthly":
        next_charge = datetime.utcnow() + timedelta(days=30)
    elif payload.interval == "weekly":
        next_charge = datetime.utcnow() + timedelta(days=7)
    elif payload.interval == "quarterly":
        next_charge = datetime.utcnow() + timedelta(days=90)
    elif payload.interval == "yearly":
        next_charge = datetime.utcnow() + timedelta(days=365)

    r = models.RecurringDonation(
        user_id=payload.user_id,
        cause_id=payload.cause_id,
        amount_cents=payload.amount_cents,
        currency=payload.currency,
        interval=payload.interval,
        start_date=payload.start_date or datetime.utcnow().date(),
        next_charge_at=next_charge
    )
    db.add(r); db.commit(); db.refresh(r)
    return r

@router.post("/recurring/{recurring_id}/cancel")
def cancel_recurring(recurring_id: UUID, db: Session = Depends(get_db)):
    r = db.get(models.RecurringDonation, recurring_id)
    if not r: raise HTTPException(404, "Recurring donation not found")
    r.active = False
    r.end_date = datetime.utcnow().date()
    db.commit()
    return {"ok": True}
