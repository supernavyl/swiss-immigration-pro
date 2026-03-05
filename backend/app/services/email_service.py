import asyncio
import html as html_mod
import logging

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_resend_client = None


def _get_resend():
    global _resend_client
    if _resend_client is None and settings.resend_api_key:
        import resend

        resend.api_key = settings.resend_api_key
        _resend_client = resend
    return _resend_client


async def send_email(to: str, subject: str, html: str, text: str | None = None) -> dict:
    client = _get_resend()
    if not client:
        logger.warning("Resend API key not configured. Email not sent to: %s", to)
        return {"success": False, "error": "Email service not configured"}

    try:
        await asyncio.to_thread(
            client.Emails.send,
            {
                "from": settings.resend_from_email,
                "to": to,
                "subject": subject,
                "html": html,
                "text": text or "",
            },
        )
        return {"success": True}
    except Exception as e:
        logger.error("Email send error: %s", e)
        return {"success": False, "error": str(e)}


def _base_template(title: str, body_content: str) -> str:
    return f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #0056B3 0%, #007BFF 100%);
    padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">{title}</h1>
  </div>
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    {body_content}
  </div>
  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #999; font-size: 12px;">
    <p>&copy; {__import__("datetime").date.today().year} {settings.app_firm}. All rights reserved.</p>
    <p><a href="{settings.app_url}/privacy" style="color: #0056B3;">Privacy Policy</a></p>
  </div>
</body>
</html>"""


async def send_welcome_email(email: str, name: str | None = None):
    greeting = html_mod.escape(name) if name else "there"
    html = _base_template(
        "Welcome to Swiss Immigration Pro!",
        f"""
    <p style="font-size: 18px;">Hello {greeting},</p>
    <p>Thank you for joining Swiss Immigration Pro! We're excited to help you navigate your journey to Switzerland.</p>
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0056B3;">
      <h2 style="margin-top: 0; color: #0056B3;">What's Next?</h2>
      <ul style="padding-left: 20px;">
        <li>Explore our comprehensive immigration guides</li>
        <li>Chat with our AI assistant (10 free messages daily)</li>
        <li>Access CV templates and resources</li>
        <li>Track your application progress</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{settings.app_url}/dashboard"
        style="background: #0056B3; color: white; padding: 15px 30px;
        text-decoration: none; border-radius: 8px;
        display: inline-block; font-weight: bold;">Go to Dashboard</a>
    </div>""",
    )
    text = (
        f"Welcome to Swiss Immigration Pro!\n\nHello {greeting},"
        f" thank you for joining! Visit {settings.app_url}/dashboard to get started."
    )
    return await send_email(email, "Welcome to Swiss Immigration Pro!", html, text)


async def send_newsletter_welcome_email(email: str):
    html = _base_template(
        "You're Subscribed!",
        f"""
    <p>Thank you for subscribing to Swiss Immigration Pro newsletter! You'll receive:</p>
    <ul>
      <li>Weekly quota alerts and updates</li>
      <li>Policy changes and immigration news</li>
      <li>Exclusive tips and success stories</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{settings.app_url}"
        style="background: #0056B3; color: white; padding: 15px 30px;
        text-decoration: none; border-radius: 8px;
        display: inline-block; font-weight: bold;">Explore Our Platform</a>
    </div>""",
    )
    return await send_email(email, "You're subscribed to Swiss Immigration Updates!", html)


async def send_password_reset_email(email: str, reset_link: str):
    html = _base_template(
        "Password Reset",
        f"""
    <p>We received a request to reset your password for your Swiss Immigration Pro account.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{reset_link}"
        style="background: #0056B3; color: white; padding: 15px 30px;
        text-decoration: none; border-radius: 8px;
        display: inline-block; font-weight: bold;">Reset Password</a>
    </div>
    <p style="font-size: 14px; color: #666;">Or copy: <a href="{reset_link}">{reset_link}</a></p>
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px;
        margin: 20px 0; border-left: 4px solid #ffc107;">
      <p style="margin: 0; font-size: 14px;"><strong>Security Note:</strong> This link expires in 1 hour.</p>
    </div>""",
    )
    return await send_email(email, "Reset Your Password - Swiss Immigration Pro", html)


async def send_subscription_confirmation_email(email: str, pack_name: str, amount: float):
    html = _base_template(
        "Subscription Confirmed!",
        f"""
    <p>Thank you for subscribing to <strong>{pack_name}</strong>!</p>
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
      <h2 style="margin-top: 0; color: #28a745;">Order Summary</h2>
      <p><strong>Plan:</strong> {pack_name}</p>
      <p><strong>Amount:</strong> CHF {amount:.2f}/month</p>
      <p><strong>Status:</strong> Active</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{settings.app_url}/dashboard"
        style="background: #0056B3; color: white; padding: 15px 30px;
        text-decoration: none; border-radius: 8px;
        display: inline-block; font-weight: bold;">Go to Dashboard</a>
    </div>""",
    )
    return await send_email(email, f"Welcome to {pack_name}! - Swiss Immigration Pro", html)


async def send_consultation_confirmation_email(email: str, consultation_id: str | None = None):
    ref = f" (Ref: {consultation_id})" if consultation_id else ""
    html = _base_template(
        "Consultation Booked!",
        f"""
    <p>Your consultation has been successfully booked and paid{ref}.</p>
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
      <h2 style="margin-top: 0; color: #28a745;">What Happens Next</h2>
      <ol style="padding-left: 20px;">
        <li>Our team will review your request within 24 hours</li>
        <li>You'll receive a calendar invite with the video call link</li>
        <li>Prepare any documents you'd like reviewed during the call</li>
      </ol>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{settings.app_url}/dashboard"
        style="background: #0056B3; color: white; padding: 15px 30px;
        text-decoration: none; border-radius: 8px;
        display: inline-block; font-weight: bold;">Go to Dashboard</a>
    </div>""",
    )
    text = "Your consultation has been booked! Our team will reach out within 24 hours with next steps."
    return await send_email(email, "Consultation Confirmed - Swiss Immigration Pro", html, text)


async def send_abandoned_checkout_email(email: str, pack_name: str | None = None) -> dict:
    """Send a recovery email when a Stripe checkout session expires without payment."""
    product_line = f" for <strong>{pack_name}</strong>" if pack_name else ""
    html = _base_template(
        "Did you forget something? 👋",
        f"""
    <p>Hi there,</p>
    <p>You started a checkout{product_line} on Swiss Immigration Pro but didn't complete it.</p>
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;
      border-left: 4px solid #FF6B35;">
      <h2 style="margin-top: 0; color: #FF6B35;">🎁 Special Offer — 10% Off</h2>
      <p>Come back within 24 hours and use code <strong>WELCOME10</strong> at checkout
         to save 10% on any plan.</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{settings.app_url}/pricing?discount=WELCOME10"
        style="background: #0056B3; color: white; padding: 15px 30px;
        text-decoration: none; border-radius: 8px;
        display: inline-block; font-weight: bold;">Complete My Order →</a>
    </div>
    <p style="color: #666; font-size: 14px;">Questions? Reply to this email — we're happy to help.</p>""",
    )
    text = (
        f"You left your checkout{(' for ' + pack_name) if pack_name else ''} incomplete. "
        "Use code WELCOME10 for 10% off when you return: "
        f"{settings.app_url}/pricing?discount=WELCOME10"
    )
    return await send_email(
        email,
        "You left something behind — here's 10% off 🇨🇭",
        html,
        text,
    )


async def send_churn_recovery_email(email: str, pack_name: str) -> dict:
    """Send a recovery email when a user's subscription is cancelled."""
    html = _base_template(
        "We're sorry to see you go",
        f"""
    <p>Hi there,</p>
    <p>We noticed your <strong>{pack_name}</strong> subscription has ended.
       We hope Swiss Immigration Pro helped you on your journey.</p>
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;
      border-left: 4px solid #FF6B35;">
      <h2 style="margin-top: 0; color: #FF6B35;">Come back and save 20%</h2>
      <p>Use code <strong>COMEBACK20</strong> to get 20% off your next 3 months
         on any plan. This offer expires in 7 days.</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{settings.app_url}/pricing?discount=COMEBACK20"
        style="background: #0056B3; color: white; padding: 15px 30px;
        text-decoration: none; border-radius: 8px;
        display: inline-block; font-weight: bold;">Reactivate My Plan &rarr;</a>
    </div>
    <p style="color: #666; font-size: 14px;">Questions? Reply to this email — we're happy to help.</p>""",
    )
    text = (
        f"Your {pack_name} subscription has ended. "
        "Use code COMEBACK20 for 20% off your next 3 months: "
        f"{settings.app_url}/pricing?discount=COMEBACK20"
    )
    return await send_email(
        email,
        "We're sorry to see you go — here's 20% off to come back",
        html,
        text,
    )


async def send_quiz_result_email(email: str, name: str, visa_path: str) -> dict:
    """Day 0: Send personalized visa path result after quiz completion."""
    greeting = html_mod.escape(name) if name else "there"
    html = _base_template(
        "Your Personalized Visa Path",
        f"""
    <p style="font-size: 18px;">Hello {greeting},</p>
    <p>Thank you for completing the Swiss Immigration Quiz! Based on your answers,
       we've identified your ideal pathway:</p>
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;
      border-left: 4px solid #0056B3;">
      <h2 style="margin-top: 0; color: #0056B3;">{html_mod.escape(visa_path)}</h2>
      <p>This pathway is tailored to your nationality, education, experience, and timeline.
         Our platform has all the resources you need to succeed.</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{settings.app_url}/dashboard"
        style="background: #0056B3; color: white; padding: 15px 30px;
        text-decoration: none; border-radius: 8px;
        display: inline-block; font-weight: bold;">View Your Path &rarr;</a>
    </div>""",
    )
    text = (
        f"Hello {greeting}, your quiz results are in! "
        f"Your recommended pathway: {visa_path}. "
        f"View details at {settings.app_url}/dashboard"
    )
    return await send_email(email, "Your Personalized Swiss Visa Path", html, text)


async def send_quiz_tips_email(email: str, name: str) -> dict:
    """Day 1: Top 5 mistakes to avoid + module recommendation."""
    greeting = html_mod.escape(name) if name else "there"
    html = _base_template(
        "Top 5 Immigration Mistakes to Avoid",
        f"""
    <p>Hi {greeting},</p>
    <p>Yesterday you took our immigration quiz — great first step!
       Today we're sharing the <strong>top 5 mistakes</strong> that delay or
       reject Swiss immigration applications:</p>
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <ol style="padding-left: 20px; line-height: 1.8;">
        <li><strong>Missing the quota window</strong> — Third-country permits have annual limits</li>
        <li><strong>Incomplete documents</strong> — One missing form = back of the queue</li>
        <li><strong>Wrong canton</strong> — Processing times vary 3-12 months by region</li>
        <li><strong>Ignoring language requirements</strong> — Critical for C permits and citizenship</li>
        <li><strong>No employer sponsorship plan</strong> — Many permits require a Swiss employer</li>
      </ol>
    </div>
    <p>Our Immigration Pack covers all of these in detail with step-by-step checklists.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{settings.app_url}/modules"
        style="background: #0056B3; color: white; padding: 15px 30px;
        text-decoration: none; border-radius: 8px;
        display: inline-block; font-weight: bold;">Explore Modules</a>
    </div>""",
    )
    text = (
        f"Hi {greeting}, here are the top 5 immigration mistakes to avoid. "
        f"Learn more at {settings.app_url}/modules"
    )
    return await send_email(
        email, "Top 5 Swiss Immigration Mistakes (Avoid These!)", html, text
    )


async def send_quiz_offer_email(
    email: str, name: str, code: str, is_final: bool = False
) -> dict:
    """Day 3 or Day 7: Discount offer with coupon code."""
    greeting = html_mod.escape(name) if name else "there"
    safe_code = html_mod.escape(code)
    urgency = "Last chance" if is_final else "Limited time offer"
    subject_prefix = "Final Reminder" if is_final else "Special Offer"

    html = _base_template(
        f"{urgency}: Save on Your Immigration Journey",
        f"""
    <p>Hi {greeting},</p>
    <p>{"This is your last chance to claim this offer. " if is_final else ""}
       We want to help you start your Swiss immigration journey right.</p>
    <div style="background: linear-gradient(135deg, #FF6B35, #FF8F00); padding: 25px;
      border-radius: 10px; margin: 20px 0; text-align: center; color: white;">
      <h2 style="margin: 0 0 10px 0; font-size: 22px;">Immigration Pack — CHF 9/mo</h2>
      <p style="margin: 0 0 15px 0; font-size: 16px;">
        Use code <strong style="font-size: 20px; letter-spacing: 2px;">{safe_code}</strong>
        for 25% off your first 3 months
      </p>
      <a href="{settings.app_url}/pricing?discount={safe_code}"
        style="background: white; color: #FF6B35; padding: 12px 30px;
        text-decoration: none; border-radius: 8px;
        display: inline-block; font-weight: bold;">Claim Your Discount &rarr;</a>
    </div>
    <p style="font-size: 14px; color: #666;">
      30-day money-back guarantee. Cancel anytime. No risk.</p>""",
    )
    text = (
        f"Hi {greeting}, use code {code} for 25% off the Immigration Pack (CHF 9/mo). "
        f"Claim at {settings.app_url}/pricing?discount={code}"
    )
    return await send_email(
        email,
        f"{subject_prefix}: 25% Off Your Immigration Pack",
        html,
        text,
    )


async def send_generic_email(to: str, subject: str, body: str):
    """Send a generic email with plain text body wrapped in the standard template."""
    html = _base_template(subject, f"<p>{body}</p>")
    return await send_email(to, subject, html, body)


async def send_newsletter_email(to: str, subject: str, content: str, unsubscribe_link: str):
    html = _base_template(
        "Swiss Immigration Pro",
        f"""
    {content}
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
      <a href="{unsubscribe_link}" style="color: #0056B3;">Unsubscribe</a>
    </div>""",
    )
    text = content.replace("<", "").replace(">", "")
    return await send_email(to, subject, html, text)
