from pydantic import BaseModel, Field, condecimal, conlist
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID

# ---------- Profiles ----------
class ProfileBase(BaseModel):
    display_name: str
    country: Optional[str] = None
    cohort: Optional[str] = None
    is_discoverable: bool = False

class ProfileCreate(ProfileBase):
    id: UUID

class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    country: Optional[str] = None
    cohort: Optional[str] = None
    is_discoverable: Optional[bool] = None

class ProfileOut(ProfileBase):
    id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

# ---------- Assets ----------
class AssetOut(BaseModel):
    symbol: str
    name: str
    sector: Optional[str]
    geography: Optional[str]
    esg_score: Optional[float]
    women_led: Optional[bool]
    created_at: datetime
    class Config:
        from_attributes = True

# ---------- Portfolios & Holdings ----------
class HoldingIn(BaseModel):
    symbol: str
    pct_weight: condecimal(ge=0)  # >= 0
    since: Optional[date] = None

class HoldingOut(BaseModel):
    id: int
    symbol: str
    pct_weight: float
    since: Optional[date]
    class Config:
        from_attributes = True

class PortfolioCreate(BaseModel):
    user_id: UUID
    name: str = "Main"

class PortfolioOut(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    created_at: datetime
    holdings: List[HoldingOut] = []
    class Config:
        from_attributes = True

# ---------- Clubs ----------
class ClubCreate(BaseModel):
    name: str
    theme: Optional[str] = None
    privacy_level: str = "private"

class ClubOut(BaseModel):
    id: UUID
    name: str
    theme: Optional[str]
    privacy_level: str
    created_at: datetime
    class Config:
        from_attributes = True

class ClubMemberOut(BaseModel):
    club_id: UUID
    user_id: UUID
    role: str
    joined_at: datetime
    class Config:
        from_attributes = True

# ---------- Follows ----------
class FollowOut(BaseModel):
    follower_id: UUID
    followee_id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

# ---------- Posts ----------
class PostCreate(BaseModel):
    user_id: UUID
    text: str
    referenced_symbols: Optional[List[str]] = Field(default_factory=list)

class PostOut(BaseModel):
    id: UUID
    user_id: UUID
    created_at: datetime
    text: str
    referenced_symbols: Optional[List[str]] = None
    class Config:
        from_attributes = True

# ---------- Insights ----------
class AssetCooccurOut(BaseModel):
    a: str
    b: str
    coholders: int
    holders_a: int
    holders_b: int
    jaccard: Optional[float]
    lift: Optional[float]

class SimilarUserOut(BaseModel):
    u: UUID
    v: UUID
    jaccard: Optional[float]
    intersect_sz: Optional[int] = None
    a_sz: Optional[int] = None
    b_sz: Optional[int] = None

# ---- RoleModel / Inspiration ----
class RoleModelCreate(BaseModel):
    user_id: UUID
    spotlight_portfolio_id: UUID | None = None
    bio: str | None = None
    expertise: str | None = None

class RoleModelOut(BaseModel):
    user_id: UUID
    spotlight_portfolio_id: UUID | None
    bio: str | None
    expertise: str | None
    class Config: from_attributes = True

# ---- Club goals / contributions / chat ----
class ClubGoalCreate(BaseModel):
    name: str
    description: str | None = None
    target_amount_cents: int
    start_date: datetime | None = None
    deadline: datetime | None = None

class ClubGoalOut(BaseModel):
    id: UUID
    club_id: UUID
    name: str
    description: str | None
    target_amount_cents: int
    start_date: datetime | None
    deadline: datetime | None
    created_at: datetime
    class Config: from_attributes = True

class ContributionCreate(BaseModel):
    user_id: UUID
    amount_cents: int
    note: str | None = None
    goal_id: UUID | None = None

class ContributionOut(BaseModel):
    id: UUID
    club_id: UUID
    user_id: UUID
    goal_id: UUID | None
    amount_cents: int
    note: str | None
    created_at: datetime
    class Config: from_attributes = True

class ClubMessageCreate(BaseModel):
    user_id: UUID
    message: str

class ClubMessageOut(BaseModel):
    id: UUID
    club_id: UUID
    user_id: UUID
    message: str
    created_at: datetime
    class Config: from_attributes = True

# ---- Inspiration feed (post + author + portfolio snapshot) ----
class FeedItem(BaseModel):
    post: PostOut
    author: ProfileOut
    inspiration_portfolio: PortfolioOut | None = None