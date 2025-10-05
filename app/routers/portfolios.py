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

    # naive upsert by (portfolio_id, symbol)
    existing = {h.symbol: h for h in p.holdings}
    out = []
    for h in holdings:
        if h.symbol in existing:
            existing[h.symbol].pct_weight = h.pct_weight
            existing[h.symbol].since = h.since
            out.append(existing[h.symbol])
        else:
            new_h = models.Holding(
                portfolio_id=portfolio_id,
                symbol=h.symbol,
                pct_weight=h.pct_weight,
                since=h.since,
            )
            db.add(new_h)
            out.append(new_h)
    db.commit()
    # refresh
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
