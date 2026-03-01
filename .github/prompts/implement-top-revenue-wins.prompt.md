---
mode: agent
tools: ["codebase", "fetch", "github"]
---

Review the current codebase and implement the top 3 revenue improvements that are not yet done:

1. **Twint + SEPA payment methods** in `backend/app/services/stripe_service.py`
   - Add `payment_method_types=["card", "twint", "sepa_debit"]` to all `Session.create` calls
   - Update `CheckoutRequest` schema to accept optional `payment_method_types`

2. **Abandoned checkout recovery** in `backend/app/routers/webhooks.py`
   - Add handler for `checkout.session.expired`
   - Send a recovery email via `email_service.py` with a 10% off coupon code within 1 hour
   - Log the abandoned checkout for admin review

3. **Exit-intent discount popup** in `swiss-immigration-pro/`
   - Create `components/pricing/ExitIntentPopup.tsx`
   - Show when mouse leaves the top of the viewport on `/pricing`
   - Offer 15% off with a coupon code input; capture email if user is not logged in
   - Store dismissal in `sessionStorage` so it only shows once per session

For each change:
- Follow the coding conventions in `.github/copilot-instructions.md`
- Add a test for backend changes in `backend/tests/`
- Ensure no Stripe API is called directly in tests (mock it)
