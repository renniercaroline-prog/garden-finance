from sqlalchemy import (
    Column, String, Boolean, DateTime, ForeignKey, Text, Numeric, Date,
    UniqueConstraint, CheckConstraint, BigInteger,
    Integer
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime, date
import uuid

from .db import Base

# ---------- Core Models ----------

class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    display_name: Mapped[str] = mapped_column(String, nullable=False)
    country: Mapped[str | None] = mapped_column(String)
    cohort: Mapped[str | None] = mapped_column(String)
    is_discoverable: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    portfolios: Mapped[list["Portfolio"]] = relationship("Portfolio", back_populates="user", cascade="all,delete-orphan")
    posts: Mapped[list["Post"]] = relationship("Post", back_populates="author", cascade="all,delete-orphan")

    followers: Mapped[list["Follow"]] = relationship(
        "Follow", foreign_keys="Follow.followee_id", back_populates="followee", cascade="all,delete-orphan"
    )
    following: Mapped[list["Follow"]] = relationship(
        "Follow", foreign_keys="Follow.follower_id", back_populates="follower", cascade="all,delete-orphan"
    )

    memberships: Mapped[list["ClubMember"]] = relationship("ClubMember", back_populates="user", cascade="all,delete-orphan")


class Asset(Base):
    __tablename__ = "assets"

    symbol: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    sector: Mapped[str | None] = mapped_column(String)
    geography: Mapped[str | None] = mapped_column(String)
    esg_score: Mapped[Numeric | None] = mapped_column(Numeric)
    women_led: Mapped[bool | None] = mapped_column(Boolean)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    holdings: Mapped[list["Holding"]] = relationship("Holding", back_populates="asset")


class Portfolio(Base):
    __tablename__ = "portfolios"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String, default="Main", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    user: Mapped[Profile] = relationship("Profile", back_populates="portfolios")
    holdings: Mapped[list["Holding"]] = relationship("Holding", back_populates="portfolio", cascade="all,delete-orphan")


class Holding(Base):
    __tablename__ = "holdings"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    portfolio_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False)
    symbol: Mapped[str | None] = mapped_column(String, ForeignKey("assets.symbol", onupdate="CASCADE"))
    startup_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("startups.id", ondelete="CASCADE"))
    pct_weight: Mapped[Numeric] = mapped_column(Numeric, nullable=False)
    since: Mapped[Date | None] = mapped_column(Date)

    portfolio: Mapped["Portfolio"] = relationship("Portfolio", back_populates="holdings")
    asset: Mapped["Asset"] = relationship("Asset", back_populates="holdings", primaryjoin="Holding.symbol==Asset.symbol")
    startup: Mapped["Startup"] = relationship("Startup")


class Club(Base):
    __tablename__ = "clubs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    theme: Mapped[str | None] = mapped_column(String)
    privacy_level: Mapped[str] = mapped_column(String, default="private", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    members: Mapped[list["ClubMember"]] = relationship("ClubMember", back_populates="club", cascade="all,delete-orphan")


class ClubMember(Base):
    __tablename__ = "club_members"

    club_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id", ondelete="CASCADE"), primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    role: Mapped[str] = mapped_column(String, default="member", nullable=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    club: Mapped[Club] = relationship("Club", back_populates="members")
    user: Mapped[Profile] = relationship("Profile", back_populates="memberships")


class Follow(Base):
    __tablename__ = "follows"

    follower_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    followee_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    follower: Mapped[Profile] = relationship("Profile", foreign_keys=[follower_id], back_populates="following")
    followee: Mapped[Profile] = relationship("Profile", foreign_keys=[followee_id], back_populates="followers")


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    referenced_symbols: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    referenced_startups: Mapped[list[uuid.UUID] | None] = mapped_column(ARRAY(UUID(as_uuid=True)))

    author: Mapped[Profile] = relationship("Profile", back_populates="posts")


# ---------- Read-only “models” for MVs (optional typed rows) ----------

from sqlalchemy import Table, MetaData

mv_metadata = MetaData()

# user_owned_assets_mv(user_id uuid, symbol text)
user_owned_assets_mv = Table("user_owned_assets_mv", mv_metadata,
    Column("user_id", UUID(as_uuid=True)),
    Column("symbol", String),
)

# asset_asset_cooccur_mv(a text, b text, coholders int, holders_a int, holders_b int, jaccard numeric, lift numeric)
asset_asset_cooccur_mv = Table("asset_asset_cooccur_mv", mv_metadata,
    Column("a", String), Column("b", String),
    Column("coholders", BigInteger),
    Column("holders_a", BigInteger),
    Column("holders_b", BigInteger),
    Column("jaccard", Numeric),
    Column("lift", Numeric),
)

# user_user_similarity_mv(u uuid, v uuid, intersect_sz int, a_sz int, b_sz int, jaccard numeric)
user_user_similarity_mv = Table("user_user_similarity_mv", mv_metadata,
    Column("u", UUID(as_uuid=True)),
    Column("v", UUID(as_uuid=True)),
    Column("intersect_sz", BigInteger),
    Column("a_sz", BigInteger),
    Column("b_sz", BigInteger),
    Column("jaccard", Numeric),
)

# ---- Role models / inspiration portfolio ----
class RoleModel(Base):
    __tablename__ = "role_models"
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    spotlight_portfolio_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("portfolios.id", ondelete="SET NULL"))
    bio: Mapped[str | None] = mapped_column(Text)
    expertise: Mapped[str | None] = mapped_column(String)  # e.g., "Clean tech, EU quality"
    author: Mapped[Profile] = relationship("Profile")
    spotlight_portfolio: Mapped["Portfolio"] = relationship("Portfolio")

# ---- Club goals (supports multiple themed goals per club) ----
class ClubGoal(Base):
    __tablename__ = "club_goals"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    club_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)  # e.g., "Green retirement"
    description: Mapped[str | None] = mapped_column(Text)
    target_amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)  # store in cents
    start_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

# ---- Member contributions toward goals ----
class Contribution(Base):
    __tablename__ = "contributions"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    club_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    goal_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("club_goals.id", ondelete="SET NULL"))
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)  # ≥ 0
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

# ---- Club chat/messages ----
class ClubMessage(Base):
    __tablename__ = "club_messages"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    club_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

from sqlalchemy import Enum

class Startup(Base):
    __tablename__ = "startups"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str | None] = mapped_column(String, unique=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    website: Mapped[str | None] = mapped_column(String)
    sector: Mapped[str | None] = mapped_column(String)
    country: Mapped[str | None] = mapped_column(String)
    description: Mapped[str | None] = mapped_column(Text)
    women_led: Mapped[bool] = mapped_column(Boolean, default=True)
    stage: Mapped[str | None] = mapped_column(Enum('idea','pre-seed','seed','series-a','series-b','growth', name="startup_stage"))
    currency: Mapped[str | None] = mapped_column(String, default="USD")
    min_check_cents: Mapped[int | None] = mapped_column(Integer)
    valuation_cents: Mapped[int | None] = mapped_column(BigInteger)
    open_for_investment: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

class StartupRound(Base):
    __tablename__ = "startup_rounds"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    startup_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("startups.id", ondelete="CASCADE"), nullable=False)
    round_type: Mapped[str] = mapped_column(String, nullable=False)  # mirrors stage values
    target_cents: Mapped[int | None] = mapped_column(BigInteger)
    min_check_cents: Mapped[int | None] = mapped_column(Integer)
    opens_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    closes_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

class Cause(Base):
    __tablename__ = "causes"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str | None] = mapped_column(String, unique=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str | None] = mapped_column(String)
    country: Mapped[str | None] = mapped_column(String)
    sdg_tags: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    image_url: Mapped[str | None] = mapped_column(String)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    target_amount_cents: Mapped[int | None] = mapped_column(BigInteger)
    deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

class Donation(Base):
    __tablename__ = "donations"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    cause_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("causes.id", ondelete="CASCADE"), nullable=False)
    club_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id", ondelete="SET NULL"))
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String, default="GBP", nullable=False)
    message: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(Enum('pending','succeeded','failed','refunded', name="donation_status"), default='succeeded', nullable=False)
    provider_session_id: Mapped[str | None] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

class RecurringDonation(Base):
    __tablename__ = "recurring_donations"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    cause_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("causes.id", ondelete="CASCADE"), nullable=False)
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String, default="GBP", nullable=False)
    interval: Mapped[str] = mapped_column(Enum('weekly','monthly','quarterly','yearly', name="donation_interval"), default='monthly', nullable=False)
    start_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date)
    next_charge_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

class DonationMatch(Base):
    __tablename__ = "donation_matches"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cause_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("causes.id", ondelete="CASCADE"), nullable=False)
    sponsor: Mapped[str] = mapped_column(String, nullable=False)
    match_ratio: Mapped[float] = mapped_column(Numeric, nullable=False)
    cap_cents: Mapped[int | None] = mapped_column(BigInteger)
    opens_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    closes_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)