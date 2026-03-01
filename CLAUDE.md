# CLAUDE.md — Swiss Immigration Pro (SIP)

## Project

AI-powered Swiss immigration SaaS. Freemium subscriptions (CHF 0/9/29/79/mo) + one-time products + B2B corporate portal + marketplace.

## Architecture

- **Backend**: Python 3.12, FastAPI, SQLAlchemy async + asyncpg, PostgreSQL 16, Celery + Redis
- **Frontend**: Next.js 16 App Router, React 18, Tailwind v4, Radix UI, Zustand, TypeScript strict
- **CV Microservice**: FastAPI on :8001, WeasyPrint PDF generation, 15 Swiss templates
- **AI**: Multi-provider fallback: Groq (Llama 3.1 70B) → Gemini → OpenAI → xAI → HuggingFace
- **Payments**: Stripe (CHF). Subscriptions + one-time consultations.
- **Infra**: Docker Compose (9 services), nginx reverse proxy, GitHub Actions CI/CD

## Key Paths

```
backend/app/main.py          # FastAPI entry, 20 routers
backend/app/config.py         # pydantic-settings, all env vars
backend/app/routers/          # 18 routers + b2b/ (4) + marketplace/ (4)
backend/app/services/         # Business logic: ai, auth, stripe, email, rag
backend/app/models/           # SQLAlchemy ORM: user, subscription, content, company, marketplace
backend/app/middleware/        # JWT auth, rate limiting
backend/tests/                # pytest + pytest-asyncio, httpx.AsyncClient

cv-backend/                   # CV builder microservice (:8001)

swiss-immigration-pro/app/    # Next.js pages (85 files)
swiss-immigration-pro/components/  # 89 React components
swiss-immigration-pro/lib/    # Config, auth, i18n (EN/FR), hooks, content, SEO

docs/                         # Swiss immigration law docs (FR) — AI knowledge base
nginx/nginx.conf              # Reverse proxy config
docker-compose.yml            # Full stack orchestration
Makefile                      # dev, lint, test, format, db-migrate, admin
```

## Commands

```bash
make dev              # Docker Compose with hot reload
make lint             # Ruff (backend) + ESLint (frontend)
make lint-back        # cd backend && ruff check app/ && ruff format --check app/
make format           # cd backend && ruff check --fix app/ && ruff format app/
make test             # pytest + playwright
make test-back        # cd backend && pytest tests/ -v
make db-migrate       # alembic upgrade head
make admin EMAIL=x PASS=y  # Create admin user
```

## Coding Rules

### Python (backend/)
- Type-annotate ALL function signatures
- Route handlers are thin: validate → service → return. Business logic in `services/`.
- Async everywhere. Blocking calls → `asyncio.to_thread()`
- Raise `HTTPException` with structured detail — no raw dicts
- Pydantic models for all request/response schemas
- Import order: stdlib → third-party → local (blank lines between)
- Use `Annotated[..., Depends()]` for dependency injection

### TypeScript (swiss-immigration-pro/)
- No `any` — use `unknown` + type narrowing
- Default to React Server Components; `"use client"` only when needed
- `cn()` (clsx + tailwind-merge) for conditional classes
- Named exports for components, default exports for page/layout files
- API calls through `lib/api.ts` — never raw `fetch` in components
- `next/image` for images, `next/font` for fonts

### Database
- SQLAlchemy async + asyncpg, Alembic migrations
- `select(Model).where(...)` — never string queries
- `await db.flush()` before reading generated IDs in same transaction

## Auth & Security
- JWT in localStorage key `sip_token`, 30-day expiry
- Backend: `Annotated[CurrentUser, Depends(get_current_user)]`
- Rate limiting via slowapi — don't add per-route rate limiting
- Never log PII or credentials
- Stripe webhooks: always verify signature before processing

## What NOT to Do
- Don't put business logic in route handlers
- Don't use `any` in TypeScript
- Don't commit `.env` files
- Don't use `latest` Docker image tags
- Don't skip healthchecks on dependent services
- Don't do blocking I/O in async functions
- Don't put secrets in docker-compose.yml

## Pricing (CHF)
| Plan | Price | Type |
|------|-------|------|
| Free | 0 | — |
| Immigration Pack | 9/mo | Subscription |
| Advanced Pack | 29/mo | Subscription |
| Citizenship Pro | 79/mo | Subscription |
| Masterclass | 497 | One-time |
| Citizenship Roadmap PDF | 97 | One-time |
| Quick Consultation | 80 | One-time |
| Full Consultation | 200 | One-time |

## Testing
- Backend: pytest + pytest-asyncio, httpx.AsyncClient, fixtures in conftest.py
- Frontend E2E: Playwright (`tests/checkout.spec.ts`)
- Always mock Stripe in tests — never call Stripe API
- Test naming: `test_<module>.py` (Python), `<Component>.test.tsx` (TS)
