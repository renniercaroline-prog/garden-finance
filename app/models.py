from sqlalchemy import (
    Column, String, Boolean, DateTime, ForeignKey, Text, Numeric, Date,
    UniqueConstraint, CheckConstraint, BigInteger
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
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
    symbol: Mapped[str] = mapped_column(String, ForeignKey("assets.symbol", onupdate="CASCADE"), nullable=False)
    pct_weight: Mapped[Numeric] = mapped_column(Numeric, nullable=False)
    since: Mapped[Date | None] = mapped_column(Date)

    __table_args__ = (
        CheckConstraint("pct_weight >= 0", name="ck_holdings_weight_nonneg"),
    )

    portfolio: Mapped[Portfolio] = relationship("Portfolio", back_populates="holdings")
    asset: Mapped[Asset] = relationship("Asset", back_populates="holdings")


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
