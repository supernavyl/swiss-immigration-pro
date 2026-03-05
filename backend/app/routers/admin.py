import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, require_admin
from app.models.content import EmailLead
from app.models.lawyer import LawyerConversation, LawyerMessage
from app.models.subscription import Payment
from app.models.user import Profile, User, UserLimit
from app.schemas import CamelModel
from app.services.auth_service import hash_password

AdminDep = Annotated[CurrentUser, Depends(require_admin)]
DbDep = Annotated[AsyncSession, Depends(get_db)]

router = APIRouter(prefix="/api/admin", tags=["admin"])


# --- Stats ---
@router.get("/stats")
async def get_stats(
    admin: AdminDep,
    db: DbDep,
):
    total_users = (await db.execute(select(func.count()).select_from(Profile))).scalar() or 0

    pack_counts_result = await db.execute(select(Profile.pack_id, func.count()).group_by(Profile.pack_id))
    users_by_pack = {row[0]: row[1] for row in pack_counts_result.all()}

    total_revenue_result = await db.execute(
        select(func.coalesce(func.sum(Payment.amount), 0)).where(Payment.status == "succeeded")
    )
    total_revenue = total_revenue_result.scalar() or 0

    total_subscribers = (
        await db.execute(select(func.count()).select_from(EmailLead).where(EmailLead.subscribed == True))  # noqa: E712
    ).scalar() or 0

    return {
        "totalUsers": total_users,
        "usersByPack": users_by_pack,
        "totalRevenue": total_revenue,
        "totalSubscribers": total_subscribers,
    }


# --- Users ---
@router.get("/users")
async def get_users(
    admin: AdminDep,
    db: DbDep,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
):
    offset = (page - 1) * per_page

    total_result = await db.execute(select(func.count()).select_from(Profile))
    total = total_result.scalar() or 0

    result = await db.execute(select(Profile).order_by(Profile.created_at.desc()).offset(offset).limit(per_page))
    profiles = result.scalars().all()

    return {
        "items": [
            {
                "id": str(p.id),
                "email": p.email,
                "fullName": p.full_name,
                "packId": p.pack_id,
                "isAdmin": p.is_admin,
                "createdAt": p.created_at.isoformat() if p.created_at else None,
            }
            for p in profiles
        ],
        "total": total,
        "page": page,
        "perPage": per_page,
    }


class UpdateUserRequest(CamelModel):
    pack_id: str | None = None
    is_admin: bool | None = None
    full_name: str | None = None
    pack_expires_at: str | None = None


@router.get("/user/{user_id}")
async def get_user(
    user_id: str,
    admin: AdminDep,
    db: DbDep,
):
    result = await db.execute(select(Profile).where(Profile.id == uuid.UUID(user_id)))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(profile.id),
        "email": profile.email,
        "fullName": profile.full_name,
        "packId": profile.pack_id,
        "isAdmin": profile.is_admin,
        "packExpiresAt": profile.pack_expires_at.isoformat() if profile.pack_expires_at else None,
        "metadata": profile.metadata_,
    }


@router.put("/user/{user_id}")
async def update_user(
    user_id: str,
    body: UpdateUserRequest,
    admin: AdminDep,
    db: DbDep,
):
    result = await db.execute(select(Profile).where(Profile.id == uuid.UUID(user_id)))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")

    if body.pack_id is not None:
        profile.pack_id = body.pack_id
    if body.is_admin is not None:
        profile.is_admin = body.is_admin
    if body.full_name is not None:
        profile.full_name = body.full_name
    if body.pack_expires_at is not None:
        profile.pack_expires_at = datetime.fromisoformat(body.pack_expires_at)

    await db.flush()
    return {"success": True}


# --- Create Admin ---
class CreateAdminRequest(CamelModel):
    email: EmailStr
    password: str
    full_name: str | None = None


@router.post("/create-admin")
async def create_admin(
    body: CreateAdminRequest,
    admin: AdminDep,
    db: DbDep,
):
    # Check if user exists
    result = await db.execute(select(User).where(User.email == body.email))
    existing = result.scalar_one_or_none()

    if existing:
        # Update to admin
        result = await db.execute(select(Profile).where(Profile.id == existing.id))
        profile = result.scalar_one_or_none()
        if profile:
            profile.is_admin = True
            if body.full_name:
                profile.full_name = body.full_name
        await db.flush()
        return {"success": True, "message": "User updated to admin"}

    # Create new admin user
    user = User(email=body.email, password_hash=hash_password(body.password), email_verified=True)
    db.add(user)
    await db.flush()

    profile = Profile(
        id=user.id,
        email=body.email,
        full_name=body.full_name,
        pack_id="citizenship",
        is_admin=True,
    )
    db.add(profile)

    limits = UserLimit(user_id=user.id, messages_today=0)
    db.add(limits)

    await db.flush()
    return {"success": True, "message": "Admin user created", "userId": str(user.id)}


# --- Newsletter Subscribers ---
@router.get("/newsletter/subscribers")
async def get_subscribers(
    admin: AdminDep,
    db: DbDep,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
):
    offset = (page - 1) * per_page

    total_result = await db.execute(select(func.count()).select_from(EmailLead))
    total = total_result.scalar() or 0

    result = await db.execute(select(EmailLead).order_by(EmailLead.created_at.desc()).offset(offset).limit(per_page))
    leads = result.scalars().all()

    return {
        "items": [
            {
                "id": str(link.id),
                "email": link.email,
                "source": link.source,
                "subscribed": link.subscribed,
                "createdAt": link.created_at.isoformat() if link.created_at else None,
            }
            for link in leads
        ],
        "total": total,
        "page": page,
        "perPage": per_page,
    }


# --- Payments ---
@router.get("/payments")
async def get_payments(
    admin: AdminDep,
    db: DbDep,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
):
    offset = (page - 1) * per_page

    total_result = await db.execute(select(func.count()).select_from(Payment))
    total = total_result.scalar() or 0

    result = await db.execute(select(Payment).order_by(Payment.created_at.desc()).offset(offset).limit(per_page))
    payments = result.scalars().all()

    return {
        "items": [
            {
                "id": str(p.id),
                "userId": str(p.user_id),
                "packId": p.pack_id,
                "amount": p.amount,
                "currency": p.currency,
                "status": p.status,
                "createdAt": p.created_at.isoformat() if p.created_at else None,
            }
            for p in payments
        ],
        "total": total,
        "page": page,
        "perPage": per_page,
    }


# --- Activity Logs ---
@router.get("/activity-logs")
async def get_activity_logs(
    admin: AdminDep,
    db: DbDep,
):
    # Recent signups
    signups_result = await db.execute(select(Profile).order_by(Profile.created_at.desc()).limit(20))
    signups = [
        {
            "type": "signup",
            "email": p.email,
            "name": p.full_name,
            "timestamp": p.created_at.isoformat() if p.created_at else None,
        }
        for p in signups_result.scalars().all()
    ]

    # Recent payments
    payments_result = await db.execute(select(Payment).order_by(Payment.created_at.desc()).limit(20))
    payments = [
        {
            "type": "payment",
            "amount": p.amount,
            "packId": p.pack_id,
            "status": p.status,
            "timestamp": p.created_at.isoformat() if p.created_at else None,
        }
        for p in payments_result.scalars().all()
    ]

    # Merge and sort
    logs = signups + payments
    logs.sort(key=lambda x: x.get("timestamp", ""), reverse=True)

    return logs[:50]


# --- Analytics ---
@router.get("/analytics")
async def get_analytics(
    admin: AdminDep,
    db: DbDep,
):
    # Revenue by pack
    rev_result = await db.execute(
        select(Payment.pack_id, func.sum(Payment.amount)).where(Payment.status == "succeeded").group_by(Payment.pack_id)
    )
    revenue_by_pack = {row[0]: row[1] for row in rev_result.all()}

    # User growth (count by month)
    growth_result = await db.execute(
        text("""
            SELECT date_trunc('month', created_at) AS month, COUNT(*)
            FROM public.profiles
            GROUP BY month
            ORDER BY month DESC
            LIMIT 12
        """)
    )
    user_growth = [{"month": row[0].isoformat() if row[0] else None, "count": row[1]} for row in growth_result.all()]

    return {
        "revenueByPack": revenue_by_pack,
        "userGrowth": user_growth,
    }


# --- Pack Stats ---
@router.get("/pack-stats")
async def get_pack_stats(
    admin: AdminDep,
    db: DbDep,
):
    pack_result = await db.execute(select(Profile.pack_id, func.count()).group_by(Profile.pack_id))
    pack_stats = {row[0]: row[1] for row in pack_result.all()}

    rev_result = await db.execute(
        select(Payment.pack_id, func.sum(Payment.amount)).where(Payment.status == "succeeded").group_by(Payment.pack_id)
    )
    revenue_by_pack = {row[0]: row[1] for row in rev_result.all()}

    return {"packStats": pack_stats, "revenueByPack": revenue_by_pack}


# --- Send Email (admin) ---
class SendEmailRequest(BaseModel):
    recipients: list[str]
    subject: str
    body: str


@router.post("/send-email")
async def send_admin_email(
    body: SendEmailRequest,
    admin: AdminDep,
):
    from app.services.email_service import send_generic_email

    sent = 0
    errors = []
    for recipient in body.recipients:
        result = await send_generic_email(recipient, body.subject, body.body)
        if result.get("success"):
            sent += 1
        else:
            errors.append({"email": recipient, "error": result.get("error", "Unknown")})

    return {
        "success": sent > 0,
        "message": f"Sent {sent}/{len(body.recipients)} emails",
        "errors": errors if errors else None,
    }


# --- Lawyer Analytics ---
@router.get("/lawyer-analytics")
async def get_lawyer_analytics(
    admin: AdminDep,
    db: DbDep,
):
    total_conversations = (await db.execute(select(func.count()).select_from(LawyerConversation))).scalar() or 0

    total_messages = (await db.execute(select(func.count()).select_from(LawyerMessage))).scalar() or 0

    assistant_messages = (
        await db.execute(select(func.count()).select_from(LawyerMessage).where(LawyerMessage.role == "assistant"))
    ).scalar() or 0

    avg_length_result = await db.execute(
        select(func.avg(func.length(LawyerMessage.content))).where(LawyerMessage.role == "assistant")
    )
    avg_response_length = round(avg_length_result.scalar() or 0)

    unique_users = (await db.execute(select(func.count(func.distinct(LawyerConversation.user_id))))).scalar() or 0

    complexity_result = await db.execute(
        select(LawyerMessage.complexity, func.count())
        .where(LawyerMessage.role == "assistant", LawyerMessage.complexity.isnot(None))
        .group_by(LawyerMessage.complexity)
    )
    complexity_distribution = {row[0]: row[1] for row in complexity_result.all()}

    recent_conversations = await db.execute(
        select(
            LawyerConversation.title,
            LawyerConversation.created_at,
        )
        .order_by(LawyerConversation.created_at.desc())
        .limit(10)
    )
    recent = [
        {"title": row[0], "created_at": row[1].isoformat() if row[1] else None} for row in recent_conversations.all()
    ]

    return {
        "totalConversations": total_conversations,
        "totalMessages": total_messages,
        "assistantMessages": assistant_messages,
        "avgResponseLength": avg_response_length,
        "uniqueUsers": unique_users,
        "complexityDistribution": complexity_distribution,
        "recentConversations": recent,
    }


# --- Admin Settings ---

SETTINGS_KEY = "admin_settings"


class AdminSettings(BaseModel):
    """Site-wide admin configuration stored in the admin profile's metadata JSONB field."""

    site_name: str = "Swiss Immigration Pro"
    site_description: str = ""
    maintenance_mode: bool = False
    max_users: int = 10000
    email_notifications: bool = True
    new_user_alerts: bool = True
    payment_alerts: bool = True
    system_alerts: bool = True
    two_factor_enabled: bool = False
    session_timeout: int = 30
    ip_whitelist: str = ""
    stripe_webhook_url: str = ""
    api_rate_limit: int = 100
    enable_analytics: bool = True
    enable_ai_chat: bool = True
    enable_email_marketing: bool = True
    enable_advanced_reports: bool = True
    enable_custom_branding: bool = False
    enable_api_access: bool = False
    enable_webhooks: bool = False
    enable_beta_features: bool = False
    cache_strategy: str = "redis"
    log_level: str = "info"


@router.get("/settings", response_model=AdminSettings)
async def get_admin_settings(
    admin: AdminDep,
    db: DbDep,
) -> AdminSettings:
    """Return the current admin settings, falling back to defaults if not yet configured."""
    profile = await db.get(Profile, admin.id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Admin profile not found")
    stored: dict = (profile.metadata_ or {}).get(SETTINGS_KEY, {})
    return AdminSettings(**stored)


@router.put("/settings", response_model=AdminSettings)
async def update_admin_settings(
    settings: AdminSettings,
    admin: AdminDep,
    db: DbDep,
) -> AdminSettings:
    """Persist admin settings into the admin profile's JSONB metadata column."""
    profile = await db.get(Profile, admin.id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Admin profile not found")

    # Merge into existing metadata so other keys (e.g. drip_email state) are preserved
    current_metadata: dict = dict(profile.metadata_ or {})
    current_metadata[SETTINGS_KEY] = settings.model_dump()
    profile.metadata_ = current_metadata

    await db.flush()
    await db.commit()
    return settings
