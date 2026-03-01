import logging
import re
import secrets
from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.middleware.rate_limit import limiter
from app.models.user import PasswordReset, Profile, User, UserLimit
from app.schemas import CamelModel
from app.services.auth_service import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from app.services.email_service import send_password_reset_email, send_welcome_email

DbSession = Annotated[AsyncSession, Depends(get_db)]
AuthUser = Annotated[CurrentUser, Depends(get_current_user)]

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()
logger = logging.getLogger(__name__)


def validate_password(password: str) -> str | None:
    """Validate password strength. Returns error message or None if valid."""
    if len(password) < 8:
        return "Password must be at least 8 characters"
    if not re.search(r"[A-Z]", password):
        return "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return "Password must contain at least one digit"
    return None


class RegisterRequest(CamelModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    referral_code: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr


class ChangePasswordRequest(CamelModel):
    current_password: str
    new_password: str


@router.post("/register")
@limiter.limit("3/minute")
async def register(request: Request, body: RegisterRequest, db: DbSession):
    pw_error = validate_password(body.password)
    if pw_error:
        raise HTTPException(status_code=400, detail=pw_error)

    # Check existing user
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Create user — auto-verified for MVP. Future: send verification email
    # before unlocking premium features (purchase, B2B, consultations).
    user = User(email=body.email, password_hash=hash_password(body.password), email_verified=True)
    db.add(user)
    await db.flush()

    # Handle referral code
    referred_by = None
    if body.referral_code:
        ref_result = await db.execute(select(Profile).where(Profile.referral_code == body.referral_code))
        referrer = ref_result.scalar_one_or_none()
        if referrer:
            referred_by = referrer.id

    profile = Profile(id=user.id, email=body.email, full_name=body.full_name, pack_id="free", referred_by=referred_by)
    db.add(profile)

    limits = UserLimit(user_id=user.id, messages_today=0)
    db.add(limits)

    # Track referral
    if referred_by:
        from app.models.user import Referral
        referral = Referral(referrer_id=referred_by, referred_id=user.id, status="pending")
        db.add(referral)

    await db.flush()

    try:
        await send_welcome_email(body.email, body.full_name)
    except Exception:
        logger.warning("Failed to send welcome email to %s", body.email, exc_info=True)

    from app.services.drip_emails import schedule_drip_sequence
    schedule_drip_sequence(str(user.id), body.email)

    token = create_access_token(str(user.id), user.email, "free", False)
    refresh = create_refresh_token(str(user.id))

    return {"success": True, "token": token, "refreshToken": refresh, "user": {"id": str(user.id), "email": user.email}}


@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, body: LoginRequest, db: DbSession):
    # Find user
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Get profile
    result = await db.execute(select(Profile).where(Profile.id == user.id))
    profile = result.scalar_one_or_none()
    pack_id = profile.pack_id if profile else "free"
    is_admin = profile.is_admin if profile else False

    # Verify password -- try bcrypt first, then PostgreSQL crypt
    is_valid = verify_password(body.password, user.password_hash)
    if not is_valid:
        try:
            crypt_result = await db.execute(
                text("SELECT crypt(:password, :hash) = :hash AS valid"),
                {"password": body.password, "hash": user.password_hash},
            )
            row = crypt_result.first()
            is_valid = row and row.valid
        except Exception:
            logger.debug("PostgreSQL crypt fallback unavailable", exc_info=True)

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(str(user.id), user.email, pack_id, is_admin)
    refresh = create_refresh_token(str(user.id))

    return {
        "success": True,
        "token": token,
        "refreshToken": refresh,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": profile.full_name if profile else user.email,
            "packId": pack_id,
            "isAdmin": is_admin,
        },
    }


@router.post("/reset-password")
@limiter.limit("3/minute")
async def reset_password(request: Request, body: ResetPasswordRequest, db: DbSession):
    safe_response = {"message": "If an account with that email exists, we've sent a password reset link."}

    result = await db.execute(select(User).where(User.email == body.email.lower().strip()))
    user = result.scalar_one_or_none()
    if not user:
        return safe_response

    # Generate reset token
    reset_token = secrets.token_hex(32)
    expires_at = datetime.now(UTC) + timedelta(hours=1)

    reset = PasswordReset(user_id=user.id, token=reset_token, expires_at=expires_at, used=False)
    db.add(reset)
    await db.flush()

    reset_link = f"{settings.app_url}/auth/reset-password?token={reset_token}"
    try:
        await send_password_reset_email(body.email, reset_link)
    except Exception:
        logger.warning("Failed to send password reset email to %s", body.email, exc_info=True)

    return safe_response


@router.post("/change-password")
async def change_password(
    body: ChangePasswordRequest,
    user: AuthUser,
    db: DbSession,
):
    pw_error = validate_password(body.new_password)
    if pw_error:
        raise HTTPException(status_code=400, detail=pw_error)

    result = await db.execute(select(User).where(User.id == user.user_id))
    db_user = result.scalar_one_or_none()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(body.current_password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    db_user.password_hash = hash_password(body.new_password)
    await db.flush()

    return {"success": True, "message": "Password updated successfully"}


@router.get("/me")
async def get_me(
    user: AuthUser,
    db: DbSession,
):
    result = await db.execute(select(Profile).where(Profile.id == user.user_id))
    profile = result.scalar_one_or_none()

    return {
        "id": user.user_id,
        "email": user.email,
        "name": profile.full_name if profile else None,
        "packId": user.pack_id,
        "isAdmin": user.is_admin,
    }


# --- Refresh Token ---
class RefreshRequest(CamelModel):
    refresh_token: str


@router.post("/refresh")
@limiter.limit("10/minute")
async def refresh_token(request: Request, body: RefreshRequest, db: DbSession):
    payload = decode_refresh_token(body.refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user_id = payload["sub"]
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    result = await db.execute(select(Profile).where(Profile.id == user.id))
    profile = result.scalar_one_or_none()
    pack_id = profile.pack_id if profile else "free"
    is_admin = profile.is_admin if profile else False

    new_access = create_access_token(str(user.id), user.email, pack_id, is_admin)
    new_refresh = create_refresh_token(str(user.id))

    return {
        "success": True,
        "token": new_access,
        "refreshToken": new_refresh,
    }


# --- Password Reset Confirm ---
class ResetPasswordConfirmRequest(CamelModel):
    token: str
    new_password: str


@router.post("/reset-password/confirm")
@limiter.limit("5/minute")
async def reset_password_confirm(
    request: Request,
    body: ResetPasswordConfirmRequest,
    db: DbSession,
):
    pw_error = validate_password(body.new_password)
    if pw_error:
        raise HTTPException(status_code=400, detail=pw_error)

    result = await db.execute(
        select(PasswordReset).where(
            PasswordReset.token == body.token,
            PasswordReset.used == False,  # noqa: E712
            PasswordReset.expires_at > datetime.now(UTC),
        )
    )
    reset = result.scalar_one_or_none()
    if not reset:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    # Update user password
    user_result = await db.execute(select(User).where(User.id == reset.user_id))
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    user.password_hash = hash_password(body.new_password)
    reset.used = True
    await db.flush()

    return {"success": True, "message": "Password has been reset successfully"}
