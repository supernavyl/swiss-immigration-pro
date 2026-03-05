"""Quiz-triggered drip email sequence.

Sends a 4-email sequence after quiz completion:
  Day 0: Personalized visa path result
  Day 1: Top 5 mistakes to avoid + module recommendation
  Day 3: Limited offer — Immigration Pack CHF 9 with QUIZ25 code
  Day 7: Final reminder
"""

import logging

from app.celery_app import celery

logger = logging.getLogger(__name__)


@celery.task(name="app.tasks.quiz_drip_emails.trigger_quiz_drip_sequence")
def trigger_quiz_drip_sequence(
    email: str,
    name: str,
    visa_path: str,
    recommended_pack: str,
) -> None:
    """Enqueue all drip emails with staggered delays."""
    # Day 0 — immediate
    send_quiz_drip_email.delay(email, name, visa_path, recommended_pack, step=0)

    # Day 1 — 24 hours
    send_quiz_drip_email.apply_async(
        args=[email, name, visa_path, recommended_pack],
        kwargs={"step": 1},
        countdown=86400,
    )

    # Day 3 — 72 hours
    send_quiz_drip_email.apply_async(
        args=[email, name, visa_path, recommended_pack],
        kwargs={"step": 3},
        countdown=86400 * 3,
    )

    # Day 7 — 168 hours
    send_quiz_drip_email.apply_async(
        args=[email, name, visa_path, recommended_pack],
        kwargs={"step": 7},
        countdown=86400 * 7,
    )

    logger.info("Enqueued quiz drip sequence for %s (path: %s)", email, visa_path)


@celery.task(
    name="app.tasks.quiz_drip_emails.send_quiz_drip_email",
    bind=True,
    max_retries=3,
    default_retry_delay=300,
)
def send_quiz_drip_email(
    self,
    email: str,
    name: str,
    visa_path: str,
    recommended_pack: str,
    step: int = 0,
) -> None:
    """Send a single quiz drip email by step number."""
    import asyncio

    asyncio.run(_send_step(self, email, name, visa_path, recommended_pack, step))


async def _send_step(
    task_self,
    email: str,
    name: str,
    visa_path: str,
    recommended_pack: str,
    step: int,
) -> None:
    from app.services.email_service import (
        send_quiz_offer_email,
        send_quiz_result_email,
        send_quiz_tips_email,
    )

    try:
        if step == 0:
            result = await send_quiz_result_email(email, name, visa_path)
        elif step == 1:
            result = await send_quiz_tips_email(email, name)
        elif step == 3:
            result = await send_quiz_offer_email(email, name, code="QUIZ25", is_final=False)
        elif step == 7:
            result = await send_quiz_offer_email(email, name, code="QUIZ25", is_final=True)
        else:
            logger.warning("Unknown quiz drip step %d for %s", step, email)
            return

        if result.get("success"):
            logger.info("Sent quiz drip step %d to %s", step, email)
        else:
            logger.warning(
                "Quiz drip step %d failed for %s: %s",
                step,
                email,
                result.get("error", "unknown"),
            )

    except Exception as exc:
        logger.error("Quiz drip step %d error for %s: %s", step, email, exc)
        raise task_self.retry(exc=exc) from exc
