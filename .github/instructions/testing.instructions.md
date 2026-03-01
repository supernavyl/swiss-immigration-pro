---
applyTo: "**/{test_*.py,*_test.py,conftest.py,*.test.tsx,*.test.ts,*.spec.ts}"
---

# Testing Rules

## Python (pytest)
- Use `pytest-asyncio` for all async tests; mark with `@pytest.mark.asyncio`
- Fixtures live in `conftest.py` — never redefine them per file
- Mock Stripe with `unittest.mock.AsyncMock` / `pytest-mock` — **never call real Stripe API**
- Mock AI providers — tests must not hit external APIs
- Test happy path + at least one error/edge case per endpoint
- Naming: `test_<action>_<condition>` (e.g. `test_checkout_invalid_pack_returns_400`)

## TypeScript (Vitest + RTL)
- Render components with `@testing-library/react`; query by role/label, never by test-id
- Mock `lib/api.ts` at the module level — never let tests make real HTTP calls
- Snapshots only for leaf UI components that almost never change
- Playwright E2E tests: use `page.getByRole()` and `page.getByText()` — no CSS selectors

## What to always test for payments
- Checkout returns `checkoutUrl` on success
- Checkout raises 400 on unknown `pack_id`
- Webhook signature failure returns 400
- Successful webhook updates `profile.pack_id` and creates `Payment` row
- Subscription deleted downgrades user to `free`
