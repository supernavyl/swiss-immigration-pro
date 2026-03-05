"""Quiz submission endpoint — accepts answers, returns visa path, triggers drip emails."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_optional_user
from app.models.content import QuizResult

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


class QuizAnswer(BaseModel):
    question_id: str
    answer: str


class QuizSubmitRequest(BaseModel):
    answers: list[QuizAnswer]
    email: str | None = None


class QuizSubmitResponse(BaseModel):
    visa_path: str
    visa_path_label: str
    recommended_pack: str
    route: str


def _determine_visa_path(answers: dict[str, str]) -> tuple[str, str, str, str]:
    """Determine visa path from quiz answers.

    Returns (path_id, label, recommended_pack, route).
    """
    nationality = answers.get("nationality", "")
    location = answers.get("current-location", "")
    intent = answers.get("immigration-intent", "")
    education = answers.get("education", "")
    experience = answers.get("experience", "")

    # EU/EFTA citizens — simplest path
    if nationality == "EU/EFTA Citizen":
        return "europeans", "European Pathway", "immigration", "/eu"

    # US/Canadian citizens
    if nationality == "US/Canadian Citizen":
        pack = "advanced"
        if education in ("PhD / Doctorate", "Master's Degree") or experience in ("5–10 years", "10+ years"):
            pack = "citizenship"
        return "americans", "American Pathway", pack, "/us"

    # Location fallback
    if location == "Europe (EU/EFTA)":
        return "europeans", "European Pathway", "immigration", "/eu"
    if location == "United States/Canada":
        return "americans", "American Pathway", "advanced", "/us"

    # International pathway — recommend based on complexity signals
    pack = "advanced"
    if intent == "Investment/Business" or (
        education in ("PhD / Doctorate", "Master's Degree") and experience in ("5–10 years", "10+ years")
    ):
        pack = "citizenship"

    return "others", "International Pathway", pack, "/other"


@router.post("/submit", response_model=QuizSubmitResponse)
async def submit_quiz(
    body: QuizSubmitRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: CurrentUser | None = Depends(get_optional_user),
) -> QuizSubmitResponse:
    """Accept quiz answers, store result, trigger drip emails, return recommendation."""
    answers_dict = {a.question_id: a.answer for a in body.answers}
    path_id, label, recommended_pack, route = _determine_visa_path(answers_dict)

    # Store quiz result if user is authenticated
    if user:
        quiz_result = QuizResult(
            user_id=user.id,
            quiz_type="immigration_assessment",
            score=0,
            total_questions=len(body.answers),
            answers=answers_dict,
        )
        db.add(quiz_result)
        await db.flush()

    # Trigger drip email sequence
    email = body.email or (user.email if user else None)
    if email:
        try:
            from app.tasks.quiz_drip_emails import trigger_quiz_drip_sequence

            trigger_quiz_drip_sequence.delay(
                email=email,
                name=user.full_name if user and hasattr(user, "full_name") else "",
                visa_path=label,
                recommended_pack=recommended_pack,
            )
        except Exception as exc:
            logger.warning("Failed to enqueue quiz drip emails: %s", exc)

    return QuizSubmitResponse(
        visa_path=path_id,
        visa_path_label=label,
        recommended_pack=recommended_pack,
        route=route,
    )
