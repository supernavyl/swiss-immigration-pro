"""
Email queue processing background tasks.
"""

import logging
from datetime import UTC

from app.celery_app import celery

logger = logging.getLogger(__name__)


@celery.task(name="app.tasks.email.process_email_queue")
def process_email_queue():
    """Process pending onboarding drip emails."""
    import asyncio
    asyncio.run(_process_drip_emails())


async def _process_drip_emails():
    from datetime import datetime

    from sqlalchemy import func, select
    from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

    from app.config import get_settings
    from app.models.content import EmailSequence
    from app.models.user import Profile
    from app.services.drip_emails import ONBOARDING_SEQUENCE, send_drip_email

    settings = get_settings()
    engine = create_async_engine(settings.database_url)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with session_factory() as db:
        try:
            now = datetime.now(UTC)

            for step_def in ONBOARDING_SEQUENCE:
                step_index = step_def["step"]
                delay_days = step_def["delay_days"]

                # Find users who:
                # 1. Signed up at least delay_days ago
                # 2. Are still on free plan
                # 3. Haven't received this step yet
                sent_subquery = (
                    select(EmailSequence.user_id)
                    .where(EmailSequence.sequence_type == "onboarding")
                    .where(EmailSequence.step_index == step_index)
                    .subquery()
                )

                result = await db.execute(
                    select(Profile)
                    .where(Profile.pack_id == "free")
                    .where(
                        func.extract("epoch", now - Profile.created_at) >= delay_days * 86400
                    )
                    .where(Profile.id.notin_(select(sent_subquery.c.user_id)))
                    .limit(50)
                )
                profiles = result.scalars().all()

                for profile in profiles:
                    try:
                        await send_drip_email(
                            email=profile.email,
                            name=profile.full_name or "",
                            template=step_def["template"],
                            subject=step_def["subject"],
                        )

                        record = EmailSequence(
                            user_id=profile.id,
                            email=profile.email,
                            sequence_type="onboarding",
                            step_index=step_index,
                        )
                        db.add(record)
                        logger.info("Sent drip email step %d to %s", step_index, profile.email)
                    except Exception as e:
                        logger.error("Failed to send drip step %d to %s: %s", step_index, profile.email, e)

                await db.commit()

        except Exception as e:
            logger.error("Drip email processing error: %s", e)
            await db.rollback()
        finally:
            await engine.dispose()


@celery.task(name="app.tasks.email.process_dunning_emails")
def process_dunning_emails():
    """Process dunning emails for past-due subscriptions."""
    import asyncio
    asyncio.run(_process_dunning_emails())


async def _process_dunning_emails():
    from datetime import datetime

    from sqlalchemy import select
    from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

    from app.config import get_settings
    from app.models.content import EmailSequence
    from app.models.subscription import Subscription
    from app.models.user import Profile
    from app.services.drip_emails import DUNNING_SEQUENCE, send_drip_email

    settings = get_settings()
    engine = create_async_engine(settings.database_url)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with session_factory() as db:
        try:
            now = datetime.now(UTC)

            # Find all past_due subscriptions
            result = await db.execute(
                select(Subscription).where(Subscription.status == "past_due")
            )
            past_due_subs = result.scalars().all()

            for sub in past_due_subs:
                # Get user profile
                profile_result = await db.execute(
                    select(Profile).where(Profile.id == sub.user_id)
                )
                profile = profile_result.scalar_one_or_none()
                if not profile:
                    continue

                for step_def in DUNNING_SEQUENCE:
                    step_index = step_def["step"]
                    delay_days = step_def["delay_days"]

                    # Check if already sent
                    sent_result = await db.execute(
                        select(EmailSequence)
                        .where(EmailSequence.user_id == profile.id)
                        .where(EmailSequence.sequence_type == "dunning")
                        .where(EmailSequence.step_index == step_index)
                    )
                    already_sent = sent_result.scalar_one_or_none()
                    if already_sent:
                        continue

                    # Check if enough time has passed since subscription went past_due
                    days_past_due = (now - sub.updated_at).total_seconds() / 86400 if sub.updated_at else 0

                    if days_past_due < delay_days:
                        continue

                    try:
                        await send_drip_email(
                            email=profile.email,
                            name=profile.full_name or "",
                            template=step_def["template"],
                            subject=step_def["subject"],
                        )
                        record = EmailSequence(
                            user_id=profile.id,
                            email=profile.email,
                            sequence_type="dunning",
                            step_index=step_index,
                        )
                        db.add(record)
                        logger.info(
                            "Sent dunning email step %d to %s", step_index, profile.email
                        )
                    except Exception as e:
                        logger.error(
                            "Failed to send dunning step %d to %s: %s",
                            step_index, profile.email, e,
                        )

                # After step 3 + 2 extra grace days → downgrade
                sent_step3 = await db.execute(
                    select(EmailSequence)
                    .where(EmailSequence.user_id == profile.id)
                    .where(EmailSequence.sequence_type == "dunning")
                    .where(EmailSequence.step_index == 3)
                )
                step3_record = sent_step3.scalar_one_or_none()
                if step3_record and sub.updated_at:
                    days_past_due = (now - sub.updated_at).total_seconds() / 86400
                    if days_past_due >= 9:  # 7 days dunning + 2 grace
                        profile.pack_id = "free"
                        sub.status = "cancelled"
                        logger.info(
                            "Downgraded user %s to free after dunning exhausted",
                            profile.email,
                        )

            await db.commit()

        except Exception as e:
            logger.error("Dunning email processing error: %s", e)
            await db.rollback()
        finally:
            await engine.dispose()


@celery.task(name="app.tasks.email.send_compliance_alert_email")
def send_compliance_alert_email(company_email: str, alert_message: str):
    """Send a compliance alert email to a company."""
    import asyncio
    asyncio.run(_send_alert_email(company_email, alert_message))


async def _send_alert_email(email: str, message: str):
    from app.services.email_service import send_generic_email
    try:
        await send_generic_email(
            to=email,
            subject="Compliance Alert - Swiss Immigration Pro",
            body=message,
        )
    except Exception:
        logger.warning("Failed to send compliance alert to %s", email, exc_info=True)
