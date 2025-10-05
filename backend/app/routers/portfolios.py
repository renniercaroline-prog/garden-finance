from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from uuid import UUID

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/portfolios", tags=["portfolios"])

@router.get("/{portfolio_id}", response_model=schemas.PortfolioOut)
def get_portfolio(portfolio_id: UUID, db: Session = Depends(get_db)):
    p = db.query(models.Portfolio)\
        .options(selectinload(models.Portfolio.holdings))\
        .filter(models.Portfolio.id == portfolio_id).first()
    if not p:
        raise HTTPException(404, "Portfolio not found")
    return p

@router.post("", response_model=schemas.PortfolioOut, status_code=201)
def create_portfolio(payload: schemas.PortfolioCreate, db: Session = Depends(get_db)):
    # Optional: enforce one "Main" per user initially
    p = models.Portfolio(user_id=payload.user_id, name=payload.name)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@router.post("/{portfolio_id}/holdings", response_model=list[schemas.HoldingOut])
def upsert_holdings(
    portfolio_id: UUID,
    holdings: list[schemas.HoldingIn],
    db: Session = Depends(get_db),
):
    p = db.get(models.Portfolio, portfolio_id)
    if not p:
        raise HTTPException(404, "Portfolio not found")

    existing = {(h.symbol, h.startup_id): h for h in p.holdings}
    out = []

    for h in holdings:
        # validate target
        if not ((h.symbol is None) ^ (h.startup_id is None)):
            raise HTTPException(400, "Provide either symbol OR startup_id (not both).")

        key = (h.symbol, h.startup_id)

        if key in existing:
            row = existing[key]
            row.pct_weight = h.pct_weight
            row.since = h.since
            out.append(row)
        else:
            row = models.Holding(
                portfolio_id=portfolio_id,
                symbol=h.symbol,
                startup_id=h.startup_id,
                pct_weight=h.pct_weight,
                since=h.since,
            )
            db.add(row)
            out.append(row)

    db.commit()
    # reload
    p = db.query(models.Portfolio).options(selectinload(models.Portfolio.holdings)).get(portfolio_id)
    return p.holdings

@router.delete("/{portfolio_id}/holdings/{symbol}", status_code=204)
def delete_holding(portfolio_id: UUID, symbol: str, db: Session = Depends(get_db)):
    h = db.query(models.Holding).filter(
        models.Holding.portfolio_id == portfolio_id,
        models.Holding.symbol == symbol
    ).first()
    if not h:
        raise HTTPException(404, "Holding not found")
    db.delete(h)
    db.commit()
