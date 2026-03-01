"""
Marketplace models: Lawyers, Agencies, Listings, Referrals, Reviews.
"""

import uuid
from datetime import datetime
from typing import ClassVar

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class LawyerProfile(Base):
    __tablename__ = "lawyer_profiles"
    __table_args__: ClassVar[dict] = {"schema": "public"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("public.users.id", ondelete="CASCADE"), unique=True
    )
    firm_name: Mapped[str] = mapped_column(Text, nullable=False)
    slug: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    specializations: Mapped[list] = mapped_column(JSONB, default=list)
    cantons_served: Mapped[list] = mapped_column(JSONB, default=list)
    languages: Mapped[list] = mapped_column(JSONB, default=list)
    hourly_rate: Mapped[int | None] = mapped_column(Integer)            # in CHF
    bio: Mapped[str | None] = mapped_column(Text)
    photo_url: Mapped[str | None] = mapped_column(Text)
    website: Mapped[str | None] = mapped_column(Text)
    phone: Mapped[str | None] = mapped_column(Text)
    address: Mapped[str | None] = mapped_column(Text)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    stripe_connect_id: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    listings: Mapped[list["ServiceListing"]] = relationship(
        back_populates="lawyer", foreign_keys="ServiceListing.provider_id",
        primaryjoin=(
            "and_(LawyerProfile.id == foreign(ServiceListing.provider_id),"
            " ServiceListing.provider_type == 'lawyer')"
        )
    )


class AgencyProfile(Base):
    __tablename__ = "agency_profiles"
    __table_args__: ClassVar[dict] = {"schema": "public"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("public.users.id", ondelete="CASCADE"), unique=True
    )
    agency_name: Mapped[str] = mapped_column(Text, nullable=False)
    slug: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    services: Mapped[dict] = mapped_column(JSONB, default=list)     # ["relocation", "housing", "school"]
    regions: Mapped[dict] = mapped_column(JSONB, default=list)      # ["ZH", "GE"]
    languages: Mapped[dict] = mapped_column(JSONB, default=list)
    bio: Mapped[str | None] = mapped_column(Text)
    photo_url: Mapped[str | None] = mapped_column(Text)
    website: Mapped[str | None] = mapped_column(Text)
    phone: Mapped[str | None] = mapped_column(Text)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    stripe_connect_id: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class ServiceListing(Base):
    __tablename__ = "service_listings"
    __table_args__: ClassVar[dict] = {"schema": "public"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    provider_type: Mapped[str] = mapped_column(Text, nullable=False)  # "lawyer" or "agency"
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    price: Mapped[int | None] = mapped_column(Integer)  # in CHF cents
    price_type: Mapped[str] = mapped_column(Text, default="fixed")  # fixed, hourly, free_consultation
    category: Mapped[str] = mapped_column(Text, nullable=False)  # work_permit, citizenship, family, relocation, etc.
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    lawyer: Mapped["LawyerProfile | None"] = relationship(
        foreign_keys=[provider_id],
        primaryjoin="and_(ServiceListing.provider_id == LawyerProfile.id, ServiceListing.provider_type == 'lawyer')",
        viewonly=True,
    )


class LeadReferral(Base):
    __tablename__ = "lead_referrals"
    __table_args__: ClassVar[dict] = {"schema": "public"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("public.service_listings.id", ondelete="SET NULL")
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("public.users.id", ondelete="SET NULL")
    )
    provider_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    provider_type: Mapped[str] = mapped_column(Text, nullable=False)
    user_email: Mapped[str | None] = mapped_column(Text)
    user_name: Mapped[str | None] = mapped_column(Text)
    message: Mapped[str | None] = mapped_column(Text)
    source: Mapped[str] = mapped_column(Text, default="marketplace")  # marketplace, quiz, chatbot, calculator
    status: Mapped[str] = mapped_column(Text, default="pending")  # pending, accepted, completed, expired
    referral_fee: Mapped[int] = mapped_column(Integer, default=0)  # platform fee in cents
    stripe_transfer_id: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Review(Base):
    __tablename__ = "marketplace_reviews"
    __table_args__: ClassVar[dict] = {"schema": "public"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    provider_type: Mapped[str] = mapped_column(Text, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("public.users.id", ondelete="CASCADE"))
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5
    comment: Mapped[str | None] = mapped_column(Text)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class MarketplaceTransaction(Base):
    __tablename__ = "marketplace_transactions"
    __table_args__: ClassVar[dict] = {"schema": "public"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    referral_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("public.lead_referrals.id", ondelete="CASCADE")
    )
    amount: Mapped[int] = mapped_column(Integer, nullable=False)  # total in cents
    platform_fee: Mapped[int] = mapped_column(Integer, nullable=False)  # 15% in cents
    provider_payout: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(Text, default="chf")
    status: Mapped[str] = mapped_column(Text, default="pending")  # pending, completed, refunded
    stripe_transfer_id: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
