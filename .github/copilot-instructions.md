# GitHub Copilot Instructions — Swiss Immigration Pro (SIP)

> These instructions are loaded automatically by GitHub Copilot for every chat
> and code-generation request in this workspace. They give Copilot full project
> context so suggestions are accurate and revenue-aware from the start.

---

## 🏗️ Project Overview

**Swiss Immigration Pro** is an AI-powered SaaS platform that guides people through
Swiss immigration, work permits, and citizenship applications.

- **Business model**: Freemium subscription (CHF 0 / 9 / 29 / 79 /mo) + one-time products + B2B
- **Primary revenue goal**: maximise MRR and conversion from free → paid tiers
- **Stack**: Python/FastAPI backend · Next.js 14 App Router frontend · PostgreSQL · Redis/Celery · Docker Compose
- **Payments**: Stripe (subscriptions + one-time + consultations) — currency CHF
- **AI providers**: Groq, Google Gemini, OpenAI, xAI, HuggingFace (routed by `ai_service.py`)
- **Email**: Resend API (`email_service.py`, `drip_emails.py`)
- **Auth**: JWT (30-day expiry), stored in `localStorage` as `sip_token`

---

## 📁 Repository Layout (key paths)

```
backend/app/
  config.py              ← pydantic-settings (all env vars)
  main.py                ← FastAPI app factory, 20+ routers
  routers/
    payments.py          ← POST /api/checkout, POST /api/products/checkout
    webhooks.py          ← POST /api/webhooks/stripe  (Stripe event handler)
    auth.py              ← register / login / refresh
    user.py              ← profile management
    consultations.py     ← consultation booking
    lawyer.py            ← AI lawyer chat
    chatbot.py           ← AI chatbot
    modules.py           ← learning modules
    referrals.py         ← referral programme
    b2b/                 ← B2B corporate portal routes
    marketplace/         ← marketplace routes
  services/
    stripe_service.py    ← ALL Stripe logic (checkout sessions, consultation payments)
    ai_service.py        ← AI provider routing & fallback
    email_service.py     ← transactional emails via Resend
    drip_emails.py       ← drip campaign sequences
    auth_service.py
    lawyer_service.py
    compliance_service.py
  models/
    user.py              ← Profile (pack_id, pack_expires_at, email, …)
    subscription.py      ← Subscription + Payment (stripe_* columns)
    content.py           ← Consultation, Module
    marketplace.py       ← Marketplace listings
    company.py           ← B2B company records

swiss-immigration-pro/
  app/
    (main)/              ← home, about, auth, dashboard, tools, modules, blog
    [layer]/             ← eu / us / other geo-targeted pages
    pricing/             ← pricing page
    b2b/                 ← B2B portal
    marketplace/         ← marketplace
    lawyer/              ← AI lawyer UI
    quiz/                ← eligibility quiz
  components/
    pricing/PricingContent.tsx   ← main pricing UI — calls POST /api/checkout
    chatbot/                     ← streaming AI chatbot widget
    cv-builder/                  ← full CV builder (~30 files)
    marketing/                   ← Testimonials, SuccessStories, EmailCapture
    layout/                      ← Header, Footer
  lib/
    pricing.ts           ← PRICING_PACKS constants (frontend source of truth)
    api.ts               ← centralized fetch client with JWT auth headers
    analytics.ts         ← analytics helpers
    drip_emails.py       ← drip sequences
```

---

## 💰 Pricing Tiers

| Plan | Price | Type |
|---|---|---|
| Free | CHF 0 | — |
| Immigration Pack | CHF 9/mo | Subscription |
| Advanced Pack | CHF 29/mo | Subscription |
| Citizenship Pro | CHF 79/mo | Subscription |
| Swiss Immigration Masterclass | CHF 497 | One-time |
| Citizenship Roadmap PDF | CHF 97 | One-time |
| Application Support Package | CHF 1 500 | One-time |
| Quick Consultation (30 min) | CHF 80 | One-time |
| Full Consultation (60 min) | CHF 200 | One-time |
| Support Package | CHF 600 | One-time |

Annual plans offer a discount (configured via Stripe price IDs).

---

## 🧠 Coding Conventions

### Python (FastAPI backend)
- Python 3.11+, full type annotations on every function signature
- Route handlers are **thin**: validate → call service layer → return response
- Business logic lives in `services/`, never in `routers/`
- All async I/O — blocking calls go in `asyncio.to_thread(...)`
- Raise `HTTPException` with structured `{"detail": "..."}` — never return raw error dicts
- Pydantic `BaseModel` for all request/response schemas; separate request vs response schemas
- Imports: stdlib → third-party → local, separated by blank lines

### TypeScript / Next.js (frontend)
- No `any` — use `unknown` + type narrowing, or define a proper type
- Functional components only; one component per file (PascalCase filename)
- Default to **React Server Components**; add `"use client"` only when needed
- Use `cn()` (clsx + tailwind-merge) for all conditional class names
- `next/image` for all images, `next/font` for fonts — never raw `<img>`
- API calls go through `lib/api.ts` — never raw `fetch` in components

### Database
- SQLAlchemy async (`asyncpg` driver), migrations via Alembic
- Always `await db.flush()` before reading back generated IDs in the same transaction
- Use `select(Model).where(...)` — never string-based queries

---

## 🔐 Auth & Security
- JWT tokens in `localStorage` key `sip_token`
- Backend dependency: `Annotated[CurrentUser, Depends(get_current_user)]`
- Rate limiting via `slowapi` middleware — do not add per-route rate limiting
- Webhook secrets must be verified before processing (Stripe signature check)
- Never log request bodies containing PII or credentials

---

## 🚀 Revenue-Maximising Priorities

When suggesting code improvements, **always prefer changes that directly increase revenue**.
Rank suggestions by expected revenue impact:

### 🥇 Highest Impact (implement first)
1. **Twint payment integration** — Switzerland's #1 mobile payment (40%+ of Swiss digital payments).
   Add via Stripe's `payment_method_types: ["twint"]` in checkout sessions.
2. **SEPA Direct Debit** — Reduce friction for EU users.
   Add `"sepa_debit"` to Stripe payment method types.
3. **Abandoned checkout recovery** — Handle `checkout.session.expired` Stripe webhook
   to send a reminder email with a discount code within 1 hour.
4. **Annual plan as default** — Switch `billingCycle` default from `'monthly'` to `'annual'`
   in `PricingContent.tsx`. Show "Save 20%" badge. Annual plans = 12× upfront cash.
5. **Exit-intent discount popup** — Show a 15% off coupon when mouse leaves viewport
   on the pricing page. Capture email if not logged in.

### 🥈 High Impact
6. **In-app upgrade prompts** — When a free user hits a gated feature (chatbot limit,
   module lock), show a contextual upgrade modal, not a toast. Include the exact feature
   they tried to access and a direct CTA to the cheapest tier that unlocks it.
7. **Subscription winback emails** — On `customer.subscription.deleted` webhook,
   trigger a 3-email sequence (day 0, day 3, day 7) offering 20% off for 3 months.
8. **Referral reward activation** — `referrals.py` router exists but rewards are not
   displayed in the dashboard. Surface "Give CHF 10, Get CHF 10" prominently.
9. **B2B per-seat pricing** — Add a `seats` field to `Company` model and charge per seat
   (CHF 25/seat/mo). Add seat management UI to the B2B portal.
10. **Consultation upsell after AI chat** — After 5 AI lawyer messages, offer a
    "Speak to a real lawyer — CHF 80 for 30 min" CTA inline in the chat.

### 🥉 Medium Impact
11. **Lifetime Deal (LTD) for Citizenship Pro** — Add a one-time CHF 299 lifetime option
    (currently only monthly). Promote on AppSumo / LTD marketplaces.
12. **Marketplace commission** — Take 15% commission on marketplace transactions.
    Add `commission_rate` and `commission_paid` to marketplace models.
13. **Document review service** — New one-time product: "Document Review" at CHF 150.
    AI-first with human fallback.
14. **PDF upsells inside modules** — At the end of each free module, offer a "Download
    this guide as PDF" for CHF 9 (one-time) — lowest-friction upsell.
15. **Progress-based upgrade nudges** — When a user completes 80% of a free module,
    show "You're almost there — unlock the rest for CHF 9/mo".

---

## 📧 Email Sequences to Implement / Improve

| Trigger | Sequence | Goal |
|---|---|---|
| Register (free) | Day 0: welcome, Day 1: quiz CTA, Day 3: feature highlight, Day 7: upgrade offer | Free→paid |
| Trial started | Day 0: onboard, Day 5: check-in, Day 6 (before expiry): urgent upgrade | Trial→paid |
| Subscription cancelled | Day 0: confirm + survey, Day 3: objection handling, Day 7: 20% off offer | Winback |
| Checkout abandoned | 1h: reminder, 24h: discount code | Recover revenue |
| Consultation booked | Immediate: confirmation + prep guide | Retention |

---

## 🔧 Technical Debt / Quick Wins

- `stripe_service.py` → extract `CONSULTATION_TYPES` to `config.py` so prices can be set via env
- `webhooks.py` → add `checkout.session.expired` handler for abandoned cart emails
- `PricingContent.tsx` → the `billingCycle` default is `'annual'` — already set, keep it
- `subscription.py` model → rename `stripe_customer_id` / `stripe_subscription_id` to
  `payment_customer_id` / `payment_subscription_id` if adding a second payment provider
- Add `conversion_source` column to `Profile` to track which page/flow drove signup
- Add `utm_source`, `utm_campaign` to checkout session metadata for attribution

---

## 🌍 Localisation & SEO

- Site targets: EU nationals moving to Switzerland, US nationals, "other" (rest of world)
- Dynamic routing: `/eu/`, `/us/`, `/other/` with geo-targeted content
- All prices in CHF — do not convert or change currency
- Language: English primary, French secondary (`lib/i18n/`)
- Every new page needs: `metadata` export, JSON-LD structured data, `sitemap.ts` entry

---

## 🐳 Infrastructure

- `docker-compose.yml` — 9 services: db, redis, backend, cv-backend, celery-worker,
  celery-beat, frontend, nginx, db-backup
- Nginx reverse proxy: `/api/*` → backend:8000, `/*` → frontend:3000
- CI: `.github/workflows/ci.yml` — lint → test → build → docker
- Deploy: `.github/workflows/deploy.yml` — SSH to VPS at `/opt/sip` on push to `main`
- Never hardcode secrets — all config via env vars; use `.env.example` for reference

---

## ✅ When Writing Tests

- Backend: `pytest` + `pytest-asyncio`, `httpx.AsyncClient`, fixtures in `conftest.py`
- Frontend: Vitest + React Testing Library for unit/component, Playwright for E2E
- Always mock Stripe calls in tests — never call Stripe API in test suite
- Test file naming: `test_<module>.py` (backend), `<Component>.test.tsx` (frontend)

---

*Last updated: 2026-02-28 — keep this file current as the architecture evolves.*
