"""
Onboarding email drip sequence definitions.

Each sequence is a list of steps with a delay (in days from signup) and email content.
"""

from app.config import get_settings
from app.services.email_service import _base_template, send_email

settings = get_settings()

ONBOARDING_SEQUENCE = [
    {
        "step": 1,
        "delay_days": 1,
        "subject": "Try our AI assistant - it knows Swiss immigration inside out",
        "template": "ai_chatbot",
    },
    {
        "step": 2,
        "delay_days": 3,
        "subject": "Your personalized Swiss immigration checklist",
        "template": "checklist",
    },
    {
        "step": 3,
        "delay_days": 5,
        "subject": "How Maria got her B permit in just 6 weeks",
        "template": "success_story",
    },
    {
        "step": 4,
        "delay_days": 7,
        "subject": "Don't lose access - upgrade your plan today",
        "template": "trial_ending",
    },
]


def _render_drip_email(template: str, name: str) -> tuple[str, str]:
    """Return (html, plaintext) for a drip email template."""
    greeting = name or "there"
    base_url = settings.app_url

    if template == "ai_chatbot":
        html = _base_template("Your AI Immigration Assistant", f"""
        <p style="font-size: 18px;">Hi {greeting},</p>
        <p>Did you know our AI assistant can answer almost any Swiss immigration question instantly?</p>
        <div style="background: white; padding: 20px; border-radius: 8px;
          margin: 20px 0; border-left: 4px solid #0056B3;">
          <h3 style="margin-top: 0; color: #0056B3;">Try asking things like:</h3>
          <ul style="padding-left: 20px;">
            <li>"What documents do I need for a B permit?"</li>
            <li>"How long does it take to get Swiss citizenship?"</li>
            <li>"Which canton has the fastest processing times?"</li>
            <li>"How do I bring my family to Switzerland?"</li>
          </ul>
        </div>
        <p>You have <strong>10 free messages per day</strong> on the free plan.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{base_url}/dashboard"
            style="background: #0056B3; color: white; padding: 15px 30px;
            text-decoration: none; border-radius: 8px;
            display: inline-block; font-weight: bold;">Chat Now</a>
        </div>""")
        text = f"Hi {greeting}, try our AI assistant at {base_url}/dashboard - ask any Swiss immigration question!"
        return html, text

    if template == "checklist":
        html = _base_template("Your Immigration Checklist", f"""
        <p style="font-size: 18px;">Hi {greeting},</p>
        <p>Here's a quick checklist to keep your immigration journey on track:</p>
        <div style="background: white; padding: 20px; border-radius: 8px;
          margin: 20px 0; border-left: 4px solid #28a745;">
          <ol style="padding-left: 20px; line-height: 2;">
            <li>Identify your permit type (L, B, or C)</li>
            <li>Gather required documents (passport, proof of employment, etc.)</li>
            <li>Check cantonal requirements for your target city</li>
            <li>Prepare your Swiss-format CV</li>
            <li>Understand timeline expectations (6-12 weeks typical)</li>
            <li>Register for mandatory health insurance</li>
          </ol>
        </div>
        <p>Our <strong>learning modules</strong> walk you through each step in detail.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{base_url}/dashboard"
            style="background: #0056B3; color: white; padding: 15px 30px;
            text-decoration: none; border-radius: 8px;
            display: inline-block; font-weight: bold;">Explore Modules</a>
        </div>""")
        text = f"Hi {greeting}, here's your immigration checklist. Start at {base_url}/dashboard"
        return html, text

    if template == "success_story":
        html = _base_template("How Maria Got Her B Permit in 6 Weeks", f"""
        <p style="font-size: 18px;">Hi {greeting},</p>
        <p>Meet Maria, a software engineer from Portugal who moved to Zurich:</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px;
          margin: 20px 0; border-left: 4px solid #0056B3;">
          <p style="font-style: italic; margin: 0;">"I was overwhelmed by the Swiss
          immigration process until I found Swiss Immigration Pro. The AI chatbot
          answered all my questions, and the cantonal strategy guide helped me
          choose Zurich over Geneva, which saved me 3 weeks in processing time.
          I had my B permit in just 6 weeks!"</p>
          <p style="margin-top: 10px; font-weight: bold; color: #0056B3;">- Maria S., Software Engineer, Zurich</p>
        </div>
        <p>You can follow the same steps Maria used, all available in our platform.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{base_url}/pricing"
            style="background: #0056B3; color: white; padding: 15px 30px;
            text-decoration: none; border-radius: 8px;
            display: inline-block; font-weight: bold;">See Our Plans</a>
        </div>""")
        text = f"Hi {greeting}, see how Maria got her B permit in 6 weeks. More at {base_url}/pricing"
        return html, text

    if template == "trial_ending":
        html = _base_template("Don't Lose Access", f"""
        <p style="font-size: 18px;">Hi {greeting},</p>
        <p>Your free trial is coming to an end. Here's what you'll miss if you don't upgrade:</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Unlimited AI chat messages</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">25+ Swiss CV templates</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Detailed cantonal strategies</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Progress tracking dashboard</td></tr>
            <tr><td style="padding: 8px;">AI-powered learning modules</td></tr>
          </table>
        </div>
        <p>Plans start at just <strong>CHF 9/month</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{base_url}/pricing"
            style="background: #28a745; color: white; padding: 15px 30px;
            text-decoration: none; border-radius: 8px; display: inline-block;
            font-weight: bold; font-size: 18px;">Upgrade Now</a>
        </div>""")
        text = f"Hi {greeting}, your trial is ending. Upgrade at {base_url}/pricing - plans from CHF 9/mo"
        return html, text

    if template == "dunning_day1":
        html = _base_template("Payment Issue — Action Required", f"""
        <p style="font-size: 18px;">Hi {greeting},</p>
        <p>We were unable to process your latest payment for your
        <strong>Swiss Immigration Pro</strong> subscription.</p>
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px;
          margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0;"><strong>No worries — this happens sometimes.</strong>
          It could be an expired card or insufficient funds. Please update your
          payment method to continue your uninterrupted access.</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{base_url}/dashboard?update_payment=1"
            style="background: #0056B3; color: white; padding: 15px 30px;
            text-decoration: none; border-radius: 8px;
            display: inline-block; font-weight: bold;">Update Payment Method</a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you believe this is an error, simply reply to this email.</p>""")
        text = (
            f"Hi {greeting}, we couldn't process your payment. "
            f"Please update your payment method at {base_url}/dashboard"
        )
        return html, text

    if template == "dunning_day3":
        html = _base_template("Your Access Is at Risk", f"""
        <p style="font-size: 18px;">Hi {greeting},</p>
        <p>We still haven't been able to charge your payment method.
        <strong>Your subscription is currently past due.</strong></p>
        <div style="background: #f8d7da; padding: 20px; border-radius: 8px;
          margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3 style="margin-top: 0; color: #dc3545;">What you'll lose if we can't resolve this:</h3>
          <ul style="padding-left: 20px;">
            <li>Unlimited AI chatbot access</li>
            <li>25+ professional Swiss CV templates</li>
            <li>All learning modules and progress</li>
            <li>Priority email support</li>
          </ul>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{base_url}/dashboard?update_payment=1"
            style="background: #dc3545; color: white; padding: 15px 30px;
            text-decoration: none; border-radius: 8px;
            display: inline-block; font-weight: bold; font-size: 18px;">
            Fix Payment Now</a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Need help? Reply to this email — we're happy to assist.</p>""")
        text = (
            f"Hi {greeting}, your subscription is past due. "
            f"Update your payment at {base_url}/dashboard to avoid losing access."
        )
        return html, text

    if template == "dunning_day7":
        html = _base_template("Last Chance to Keep Your Plan", f"""
        <p style="font-size: 18px;">Hi {greeting},</p>
        <p>This is our final reminder. If we can't process your payment within
        <strong>48 hours</strong>, your account will be downgraded to the Free plan.</p>
        <div style="background: #f8d7da; padding: 20px; border-radius: 8px;
          margin: 20px 0; border-left: 4px solid #dc3545;">
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #dc3545;">
            You'll permanently lose your learning progress, saved CVs, and premium features.</p>
        </div>
        <p>We'd hate to see you go. If cost is a concern, reply to this email — we may
        be able to offer a special rate.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{base_url}/dashboard?update_payment=1"
            style="background: #dc3545; color: white; padding: 18px 35px;
            text-decoration: none; border-radius: 8px;
            display: inline-block; font-weight: bold; font-size: 20px;">
            Save My Account</a>
        </div>""")
        text = (
            f"Hi {greeting}, last chance — update your payment at "
            f"{base_url}/dashboard or your account will be downgraded to Free."
        )
        return html, text

    return "", ""


async def send_drip_email(email: str, name: str, template: str, subject: str):
    """Send a single drip email."""
    html, text = _render_drip_email(template, name)
    if html:
        return await send_email(email, subject, html, text)
    return {"success": False, "error": "Unknown template"}


DUNNING_SEQUENCE = [
    {
        "step": 1,
        "delay_days": 0,
        "subject": "Action required: Your payment didn't go through",
        "template": "dunning_day1",
    },
    {
        "step": 2,
        "delay_days": 3,
        "subject": "Your Swiss Immigration Pro access is at risk",
        "template": "dunning_day3",
    },
    {
        "step": 3,
        "delay_days": 7,
        "subject": "Last chance: Update your payment to keep your plan",
        "template": "dunning_day7",
    },
]


def schedule_drip_sequence(user_id: str, email: str) -> None:
    """Enqueue the drip email processor immediately so the new user is picked up
    on the next Celery worker cycle rather than waiting up to 5 minutes."""
    try:
        from app.tasks.email import process_email_queue  # type: ignore[import]
        process_email_queue.delay()
    except Exception:
        pass  # Celery unavailable in tests / dev — beat will handle it
