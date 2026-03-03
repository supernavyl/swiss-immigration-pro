"""
Chatbot router -- non-streaming and streaming (SSE) endpoints.

POST /api/chatbot        -> JSON response (backward-compatible)
POST /api/chatbot/stream -> Server-Sent Events with token-by-token streaming
"""

from __future__ import annotations

import logging
import uuid
from datetime import date, datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import Field
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.middleware.auth import CurrentUser, get_optional_user
from app.models.content import ChatMessage
from app.models.user import User, UserLimit
from app.redis_pool import get_redis
from app.schemas import CamelModel
from app.services.ai_service import get_chatbot_response, stream_chatbot_response

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])
settings = get_settings()
logger = logging.getLogger(__name__)


async def _check_anon_chatbot_limit(request: Request) -> str | None:
    """Enforce IP-based daily limit for anonymous chatbot users via Redis."""
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown")
    ip = ip.split(",")[0].strip()
    key = f"chatbot_anon:{ip}:{date.today().isoformat()}"
    limit = settings.free_daily_message_limit

    try:
        r = get_redis()
        count = await r.incr(key)
        if count == 1:
            await r.expire(key, 86400)
    except Exception:
        logger.warning("Redis unavailable for anonymous rate limiting")
        return "Service temporarily unavailable. Please try again later."

    if count > limit:
        return f"Daily limit of {limit} messages reached. Sign up for unlimited access!"
    return None


class ChatRequest(CamelModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversation_history: list[dict[str, Any]] = Field(default=[], max_length=20)
    language: str = Field("en", pattern=r"^[a-z]{2}$")


# -------------------------------------------------------------------
# Helpers -- limit checking & message persistence
# -------------------------------------------------------------------

async def _check_and_increment_limit(
    user: CurrentUser | None,
    db: AsyncSession,
) -> str | None:
    """
    Check daily message limit for free-tier users.
    Returns an error string if limit exceeded, else None.
    Increments the counter on success.
    """
    if user is None:
        # Anonymous users are rate-limited server-side via Redis (see chat endpoint)
        return None

    if user.pack_id and user.pack_id != "free":
        # Paid users have unlimited messages
        return None

    user_uuid = uuid.UUID(user.user_id)
    result = await db.execute(select(UserLimit).where(UserLimit.user_id == user_uuid))
    limits = result.scalar_one_or_none()

    today = date.today()

    if limits is None:
        # First time -- create a row
        limits = UserLimit(
            user_id=user_uuid,
            messages_today=1,
            last_reset_date=datetime.combine(today, datetime.min.time()),
        )
        db.add(limits)
        return None

    # Reset counter if it's a new day (atomic to prevent TOCTOU race)
    if limits.last_reset_date is None or limits.last_reset_date.date() < today:
        await db.execute(
            update(UserLimit)
            .where(UserLimit.user_id == user_uuid)
            .values(
                messages_today=1,
                last_reset_date=datetime.combine(today, datetime.min.time()),
            )
        )
        await db.flush()
        return None

    if limits.messages_today >= settings.free_daily_message_limit:
        return f"Daily limit of {settings.free_daily_message_limit} messages reached. Upgrade for unlimited access!"

    # Atomic increment to prevent TOCTOU race under concurrent requests
    await db.execute(
        update(UserLimit)
        .where(UserLimit.user_id == user_uuid)
        .values(messages_today=UserLimit.messages_today + 1)
    )
    return None


async def _save_message(
    user: CurrentUser | None,
    message: str,
    response: str,
    db: AsyncSession,
) -> None:
    """Persist a chat exchange for authenticated users."""
    if user is None:
        return
    try:
        chat_msg = ChatMessage(
            user_id=uuid.UUID(user.user_id),
            message=message,
            response=response,
            pack_id=user.pack_id or "free",
            tokens_used=len(response.split()),  # rough estimate
        )
        db.add(chat_msg)
    except Exception:
        logger.warning("Failed to persist chat message", exc_info=True)


# -------------------------------------------------------------------
# POST /api/chatbot  (non-streaming, backward-compatible)
# -------------------------------------------------------------------

@router.post("")
async def chat(
    body: ChatRequest,
    request: Request,
    user: CurrentUser | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    if not body.message or not body.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    # Check daily limit (server-side for both anon and authenticated)
    if user is None:
        anon_error = await _check_anon_chatbot_limit(request)
        if anon_error:
            raise HTTPException(status_code=429, detail=anon_error)
    else:
        # Require email verification for authenticated users
        user_uuid = uuid.UUID(user.user_id)
        db_user_result = await db.execute(select(User).where(User.id == user_uuid))
        db_user = db_user_result.scalar_one_or_none()
        if db_user is not None and not db_user.email_verified:
            raise HTTPException(
                status_code=403,
                detail="Please verify your email to use the AI assistant",
            )

        limit_error = await _check_and_increment_limit(user, db)
        if limit_error:
            raise HTTPException(status_code=429, detail=limit_error)

    result = await get_chatbot_response(
        message=body.message,
        conversation_history=body.conversation_history,
        language=body.language,
    )

    # Persist message and commit
    await _save_message(user, body.message, result.get("response", ""), db)
    await db.commit()

    return result


# -------------------------------------------------------------------
# POST /api/chatbot/stream  (SSE streaming)
# -------------------------------------------------------------------

@router.post("/stream")
async def chat_stream(
    body: ChatRequest,
    request: Request,
    user: CurrentUser | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    if not body.message or not body.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    # Check daily limit (server-side for both anon and authenticated)
    if user is None:
        anon_error = await _check_anon_chatbot_limit(request)
        if anon_error:
            raise HTTPException(status_code=429, detail=anon_error)
    else:
        limit_error = await _check_and_increment_limit(user, db)
        if limit_error:
            raise HTTPException(status_code=429, detail=limit_error)

    async def event_generator():
        import json as _json
        full_response = ""
        async for event in stream_chatbot_response(
            message=body.message,
            conversation_history=body.conversation_history,
            language=body.language,
        ):
            yield event
            try:
                if event.startswith("data: "):
                    data = _json.loads(event[6:].strip())
                    if data.get("done") and "fullResponse" in data:
                        full_response = data["fullResponse"]
            except Exception:
                logger.debug("SSE event parse error", exc_info=True)

        if full_response and user:
            from app.database import async_session
            async with async_session() as session:
                try:
                    await _save_message(user, body.message, full_response, session)
                    await session.commit()
                except Exception:
                    await session.rollback()

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
