"""
Celery application for background tasks.
"""

import os

from celery import Celery
from celery.schedules import crontab

redis_url = os.environ.get("REDIS_URL", "redis://redis:6379")

celery = Celery(
    "sip",
    broker=redis_url,
    backend=redis_url,
    include=[
        "app.tasks.compliance",
        "app.tasks.email",
    ],
)

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Europe/Zurich",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)

# Scheduled tasks
celery.conf.beat_schedule = {
    "check-compliance-daily": {
        "task": "app.tasks.compliance.check_all_compliance",
        "schedule": crontab(hour=6, minute=0),  # 6 AM Zurich time daily
    },
    "send-pending-emails": {
        "task": "app.tasks.email.process_email_queue",
        "schedule": crontab(minute="*/5"),  # Every 5 minutes
    },
    "process-dunning-emails": {
        "task": "app.tasks.email.process_dunning_emails",
        "schedule": crontab(hour=9, minute=0),  # 9 AM Zurich time daily
    },
}
