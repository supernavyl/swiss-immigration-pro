"""
Virtual Lawyer router -- full CRUD for conversations, cases, document upload,
PDF export, and the streaming SSE endpoint for legal AI analysis.
"""

from __future__ import annotations

import asyncio
import contextlib
import io
import uuid
from datetime import date, datetime
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy import delete, desc, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.redis_pool import get_redis
from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user, get_optional_user
from app.models.lawyer import (
    LawyerCase,
    LawyerConversation,
    LawyerDocument,
    LawyerMessage,
)
from app.models.user import UserLimit
from app.schemas import CamelModel
from app.services import lawyer_service
from app.services.document_processor import extract_text, validate_file

router = APIRouter(prefix="/api/lawyer", tags=["lawyer"])
settings = get_settings()

# ---------------------------------------------------------------------------
# Rate limit helpers
# ---------------------------------------------------------------------------

_PLAN_LIMITS: dict[str, int] = {
    "free": settings.lawyer_free_daily_limit,
    "immigration": settings.lawyer_immigration_daily_limit,
    "advanced": settings.lawyer_advanced_daily_limit,
    "citizenship": 999999,
}


async def _check_anon_lawyer_limit(request: Request) -> None:
    """Enforce IP-based daily limit for anonymous users via Redis."""
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown")
    ip = ip.split(",")[0].strip()
    key = f"lawyer_anon:{ip}:{date.today().isoformat()}"
    limit = settings.lawyer_free_anon_daily_limit

    try:
        r = get_redis()
        count = await r.incr(key)
        if count == 1:
            await r.expire(key, 86400)
    except Exception:
        return  # fail open if Redis is down

    if count > limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "Daily limit reached. Sign up for free to continue.",
                "limit": limit,
                "pack_id": "anonymous",
                "upgrade_url": "/auth/register",
            },
        )


async def _check_lawyer_limit(
    user: CurrentUser | None,
    db: AsyncSession,
    request: Request | None = None,
) -> None:
    """Raise 429 if the user has hit their daily lawyer message limit."""
    if user is None:
        if request is not None:
            await _check_anon_lawyer_limit(request)
        return

    limit = _PLAN_LIMITS.get(user.pack_id, settings.lawyer_free_daily_limit)

    result = await db.execute(
        select(UserLimit).where(UserLimit.user_id == uuid.UUID(user.user_id))
    )
    user_limit = result.scalar_one_or_none()

    if user_limit is None:
        user_limit = UserLimit(
            user_id=uuid.UUID(user.user_id),
            messages_today=0,
            lawyer_messages_today=0,
            last_reset_date=date.today(),
        )
        db.add(user_limit)
        await db.flush()
        return

    if user_limit.last_reset_date < date.today():
        user_limit.messages_today = 0
        user_limit.lawyer_messages_today = 0
        user_limit.last_reset_date = date.today()

    if user_limit.lawyer_messages_today >= limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "Daily lawyer message limit reached",
                "limit": limit,
                "pack_id": user.pack_id,
                "upgrade_url": "/pricing",
            },
        )


async def _increment_lawyer_count(user_id: str, db: AsyncSession) -> None:
    await db.execute(
        update(UserLimit)
        .where(UserLimit.user_id == uuid.UUID(user_id))
        .values(lawyer_messages_today=UserLimit.lawyer_messages_today + 1)
    )


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class LawyerChatRequest(CamelModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversation_id: str | None = None
    conversation_history: list[dict] = Field(default=[], max_length=20)
    language: str = Field("en", pattern=r"^[a-z]{2}$")
    document_context: str = Field("", max_length=10000)


class CaseCreate(BaseModel):
    title: str
    category: str = "other"


class CaseUpdate(BaseModel):
    title: str | None = None
    status: str | None = None
    category: str | None = None


class ConversationCreate(BaseModel):
    title: str = "New Consultation"
    case_id: str | None = None


class ConversationUpdate(BaseModel):
    title: str | None = None
    case_id: str | None = None


# ---------------------------------------------------------------------------
# Streaming endpoint (enhanced)
# ---------------------------------------------------------------------------

@router.post("/stream")
async def lawyer_stream(
    body: LawyerChatRequest,
    request: Request,
    user: CurrentUser | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    if not body.message or not body.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    await _check_lawyer_limit(user, db, request)

    conversation_db_id: uuid.UUID | None = None
    if user and body.conversation_id:
        with contextlib.suppress(ValueError):
            conversation_db_id = uuid.UUID(body.conversation_id)

    if user and not conversation_db_id:
        convo = LawyerConversation(
            user_id=uuid.UUID(user.user_id),
            title=body.message[:60],
        )
        db.add(convo)
        await db.flush()
        conversation_db_id = convo.id

    if user and conversation_db_id:
        user_msg = LawyerMessage(
            conversation_id=conversation_db_id,
            role="user",
            content=body.message.strip(),
        )
        db.add(user_msg)
        await db.flush()

    async def event_generator():
        full_response = ""
        metadata: dict = {}

        async for event in lawyer_service.stream_lawyer_response(
            message=body.message,
            conversation_history=body.conversation_history,
            language=body.language,
            document_context=body.document_context,
        ):
            if event.startswith("data: "):
                import json
                try:
                    data = json.loads(event[6:].strip())
                    if data.get("done"):
                        metadata = data
                        full_response = data.get("fullResponse", full_response)
                        if conversation_db_id:
                            data["conversationId"] = str(conversation_db_id)
                        yield f"data: {json.dumps(data)}\n\n"
                        continue
                    if data.get("token"):
                        full_response += data["token"]
                except (json.JSONDecodeError, KeyError):
                    pass

            yield event

        if user and conversation_db_id and full_response:
            assistant_msg = LawyerMessage(
                conversation_id=conversation_db_id,
                role="assistant",
                content=full_response,
                legal_basis=metadata.get("legalBasis"),
                next_steps=metadata.get("nextSteps"),
                deadlines=metadata.get("deadlines"),
                complexity=metadata.get("complexity"),
                sources=metadata.get("sources"),
            )
            db.add(assistant_msg)
            await _increment_lawyer_count(user.user_id, db)
            await db.commit()

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ---------------------------------------------------------------------------
# Conversations CRUD
# ---------------------------------------------------------------------------

@router.get("/conversations")
async def list_conversations(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = 50,
    offset: int = 0,
):
    result = await db.execute(
        select(LawyerConversation)
        .where(LawyerConversation.user_id == uuid.UUID(user.user_id))
        .order_by(desc(LawyerConversation.updated_at))
        .limit(limit)
        .offset(offset)
    )
    convos = result.scalars().all()

    count_result = await db.execute(
        select(func.count())
        .select_from(LawyerConversation)
        .where(LawyerConversation.user_id == uuid.UUID(user.user_id))
    )
    total = count_result.scalar() or 0

    return {
        "conversations": [
            {
                "id": str(c.id),
                "title": c.title,
                "case_id": str(c.case_id) if c.case_id else None,
                "metadata": c.metadata_,
                "created_at": c.created_at.isoformat() if c.created_at else None,
                "updated_at": c.updated_at.isoformat() if c.updated_at else None,
            }
            for c in convos
        ],
        "total": total,
    }


@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        cid = uuid.UUID(conversation_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid conversation ID") from None

    result = await db.execute(
        select(LawyerConversation)
        .where(
            LawyerConversation.id == cid,
            LawyerConversation.user_id == uuid.UUID(user.user_id),
        )
    )
    convo = result.scalar_one_or_none()
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")

    msgs_result = await db.execute(
        select(LawyerMessage)
        .where(LawyerMessage.conversation_id == cid)
        .order_by(LawyerMessage.created_at)
    )
    messages = msgs_result.scalars().all()

    return {
        "id": str(convo.id),
        "title": convo.title,
        "case_id": str(convo.case_id) if convo.case_id else None,
        "metadata": convo.metadata_,
        "created_at": convo.created_at.isoformat() if convo.created_at else None,
        "updated_at": convo.updated_at.isoformat() if convo.updated_at else None,
        "messages": [
            {
                "id": str(m.id),
                "role": m.role,
                "content": m.content,
                "legal_basis": m.legal_basis,
                "next_steps": m.next_steps,
                "deadlines": m.deadlines,
                "complexity": m.complexity,
                "sources": m.sources,
                "created_at": m.created_at.isoformat() if m.created_at else None,
            }
            for m in messages
        ],
    }


@router.post("/conversations")
async def create_conversation(
    body: ConversationCreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    case_uuid = None
    if body.case_id:
        try:
            case_uuid = uuid.UUID(body.case_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid case ID") from None

    convo = LawyerConversation(
        user_id=uuid.UUID(user.user_id),
        case_id=case_uuid,
        title=body.title,
    )
    db.add(convo)
    await db.flush()

    return {
        "id": str(convo.id),
        "title": convo.title,
        "case_id": str(convo.case_id) if convo.case_id else None,
        "created_at": convo.created_at.isoformat() if convo.created_at else None,
    }


@router.put("/conversations/{conversation_id}")
async def update_conversation(
    conversation_id: str,
    body: ConversationUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        cid = uuid.UUID(conversation_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid conversation ID") from None

    values: dict = {}
    if body.title is not None:
        values["title"] = body.title
    if body.case_id is not None:
        try:
            values["case_id"] = uuid.UUID(body.case_id) if body.case_id else None
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid case ID") from None

    if values:
        await db.execute(
            update(LawyerConversation)
            .where(
                LawyerConversation.id == cid,
                LawyerConversation.user_id == uuid.UUID(user.user_id),
            )
            .values(**values)
        )

    return {"ok": True}


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        cid = uuid.UUID(conversation_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid conversation ID") from None

    await db.execute(
        delete(LawyerConversation)
        .where(
            LawyerConversation.id == cid,
            LawyerConversation.user_id == uuid.UUID(user.user_id),
        )
    )
    return {"ok": True}


# ---------------------------------------------------------------------------
# Cases CRUD
# ---------------------------------------------------------------------------

@router.get("/cases")
async def list_cases(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(LawyerCase)
        .where(LawyerCase.user_id == uuid.UUID(user.user_id))
        .order_by(desc(LawyerCase.updated_at))
    )
    cases = result.scalars().all()

    return {
        "cases": [
            {
                "id": str(c.id),
                "title": c.title,
                "status": c.status,
                "category": c.category,
                "created_at": c.created_at.isoformat() if c.created_at else None,
                "updated_at": c.updated_at.isoformat() if c.updated_at else None,
            }
            for c in cases
        ]
    }


@router.post("/cases")
async def create_case(
    body: CaseCreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    case = LawyerCase(
        user_id=uuid.UUID(user.user_id),
        title=body.title,
        category=body.category,
    )
    db.add(case)
    await db.flush()

    return {
        "id": str(case.id),
        "title": case.title,
        "status": case.status,
        "category": case.category,
        "created_at": case.created_at.isoformat() if case.created_at else None,
    }


@router.put("/cases/{case_id}")
async def update_case(
    case_id: str,
    body: CaseUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        cid = uuid.UUID(case_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid case ID") from None

    values: dict = {}
    if body.title is not None:
        values["title"] = body.title
    if body.status is not None:
        if body.status not in ("open", "in_progress", "resolved", "archived"):
            raise HTTPException(status_code=400, detail="Invalid status")
        values["status"] = body.status
    if body.category is not None:
        values["category"] = body.category

    if values:
        await db.execute(
            update(LawyerCase)
            .where(
                LawyerCase.id == cid,
                LawyerCase.user_id == uuid.UUID(user.user_id),
            )
            .values(**values)
        )

    return {"ok": True}


@router.delete("/cases/{case_id}")
async def delete_case(
    case_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        cid = uuid.UUID(case_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid case ID") from None

    await db.execute(
        delete(LawyerCase)
        .where(
            LawyerCase.id == cid,
            LawyerCase.user_id == uuid.UUID(user.user_id),
        )
    )
    return {"ok": True}


# ---------------------------------------------------------------------------
# Document upload
# ---------------------------------------------------------------------------

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    conversation_id: str | None = None,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    content = await file.read()
    file_size = len(content)
    ext = Path(file.filename).suffix.lower()

    error = validate_file(file.filename, file_size)
    if error:
        raise HTTPException(status_code=400, detail=error)

    conv_uuid: uuid.UUID | None = None
    if conversation_id:
        try:
            conv_uuid = uuid.UUID(conversation_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid conversation ID") from None

        # Verify the conversation belongs to this user
        ownership = await db.execute(
            select(LawyerConversation).where(
                LawyerConversation.id == conv_uuid,
                LawyerConversation.user_id == uuid.UUID(user.user_id),
            )
        )
        if not ownership.scalar_one_or_none():
            raise HTTPException(status_code=403, detail="Conversation not found")

    if not conv_uuid:
        convo = LawyerConversation(
            user_id=uuid.UUID(user.user_id),
            title="Document Analysis",
        )
        db.add(convo)
        await db.flush()
        conv_uuid = convo.id

    upload_dir = Path("/app/uploads/lawyer") / user.user_id / str(conv_uuid)
    if not upload_dir.exists():
        upload_dir = (
            Path(__file__).parent.parent.parent / "uploads" / "lawyer" / user.user_id / str(conv_uuid)
        )
    await asyncio.to_thread(upload_dir.mkdir, parents=True, exist_ok=True)

    file_id = str(uuid.uuid4())
    file_path = upload_dir / f"{file_id}{ext}"
    await asyncio.to_thread(file_path.write_bytes, content)

    extracted_text = await extract_text(file_path, ext)

    doc = LawyerDocument(
        conversation_id=conv_uuid,
        user_id=uuid.UUID(user.user_id),
        filename=file.filename,
        file_type=ext,
        file_size=file_size,
        extracted_text=extracted_text[:50000] if extracted_text else None,
        storage_path=str(file_path),
    )
    db.add(doc)
    await db.flush()

    return {
        "id": str(doc.id),
        "filename": file.filename,
        "file_type": ext,
        "file_size": file_size,
        "extracted_text_preview": extracted_text[:300] if extracted_text else "",
        "extracted_length": len(extracted_text) if extracted_text else 0,
        "conversation_id": str(conv_uuid),
    }


# ---------------------------------------------------------------------------
# PDF export
# ---------------------------------------------------------------------------

@router.post("/conversations/{conversation_id}/export")
async def export_conversation_pdf(
    conversation_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        cid = uuid.UUID(conversation_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid conversation ID") from None

    result = await db.execute(
        select(LawyerConversation)
        .where(
            LawyerConversation.id == cid,
            LawyerConversation.user_id == uuid.UUID(user.user_id),
        )
    )
    convo = result.scalar_one_or_none()
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")

    msgs_result = await db.execute(
        select(LawyerMessage)
        .where(LawyerMessage.conversation_id == cid)
        .order_by(LawyerMessage.created_at)
    )
    messages = msgs_result.scalars().all()

    pdf_bytes = _generate_pdf(convo, messages)

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="legal-consultation-{date.today().isoformat()}.pdf"'
        },
    )


def _generate_pdf(
    convo: LawyerConversation,
    messages: list[LawyerMessage],
) -> bytes:
    """Generate a PDF of the conversation using reportlab."""
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import cm
    from reportlab.platypus import (
        Paragraph,
        SimpleDocTemplate,
        Spacer,
    )

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2 * cm, bottomMargin=2 * cm)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontSize=18,
        spaceAfter=12,
        textColor=colors.HexColor("#1e3a5f"),
    )
    header_style = ParagraphStyle(
        "Header",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=20,
    )
    user_style = ParagraphStyle(
        "UserMsg",
        parent=styles["Normal"],
        fontSize=10,
        leftIndent=20,
        spaceBefore=8,
        spaceAfter=4,
        textColor=colors.HexColor("#333333"),
    )
    assistant_style = ParagraphStyle(
        "AssistantMsg",
        parent=styles["Normal"],
        fontSize=10,
        leftIndent=20,
        spaceBefore=8,
        spaceAfter=4,
        textColor=colors.HexColor("#1a1a2e"),
    )
    role_style = ParagraphStyle(
        "RoleLabel",
        parent=styles["Normal"],
        fontSize=9,
        textColor=colors.HexColor("#666666"),
        spaceBefore=12,
    )
    disclaimer_style = ParagraphStyle(
        "Disclaimer",
        parent=styles["Normal"],
        fontSize=8,
        textColor=colors.grey,
        spaceBefore=20,
    )

    elements = []

    elements.append(Paragraph("SIP-AI Legal — Consultation Record", title_style))
    created = convo.created_at.strftime("%B %d, %Y") if convo.created_at else "N/A"
    elements.append(Paragraph(
        f"Case: {convo.title}<br/>Date: {created}<br/>Generated: {datetime.now().strftime('%B %d, %Y %H:%M')}",
        header_style,
    ))
    elements.append(Spacer(1, 12))

    for msg in messages:
        role_label = "You" if msg.role == "user" else "SIP-AI Legal"
        ts = msg.created_at.strftime("%H:%M") if msg.created_at else ""
        elements.append(Paragraph(f"<b>{role_label}</b> — {ts}", role_style))

        content = msg.content.replace("\n", "<br/>")
        content = content.replace("**", "<b>").replace("**", "</b>")
        style = user_style if msg.role == "user" else assistant_style
        elements.append(Paragraph(content[:5000], style))

        if msg.legal_basis:
            bases = msg.legal_basis if isinstance(msg.legal_basis, list) else []
            if bases:
                elements.append(Paragraph("<b>Legal Basis:</b>", role_style))
                for basis in bases[:8]:
                    elements.append(Paragraph(f"• {basis}", assistant_style))

        if msg.next_steps:
            steps = msg.next_steps if isinstance(msg.next_steps, list) else []
            if steps:
                elements.append(Paragraph("<b>Next Steps:</b>", role_style))
                for i, step in enumerate(steps[:6], 1):
                    elements.append(Paragraph(f"{i}. {step}", assistant_style))

    elements.append(Spacer(1, 30))
    elements.append(Paragraph(
        "DISCLAIMER: This consultation record is generated by SIP-AI Legal, an AI legal assistant. "
        "It does not constitute formal legal advice. For binding legal opinions, consult a "
        "licensed Swiss immigration attorney. Swiss Immigration Pro accepts no liability for "
        "decisions made based on this AI-generated analysis.",
        disclaimer_style,
    ))

    doc.build(elements)
    return buffer.getvalue()
