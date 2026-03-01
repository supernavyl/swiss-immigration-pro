# CLAUDE.md — Swiss Immigration Pro (SIP)

## Project

AI-powered Swiss immigration SaaS. Freemium subscriptions (CHF 0/9/29/79/mo) + one-time products + B2B corporate portal + marketplace.

## Architecture

- **Backend**: Python 3.12, FastAPI, SQLAlchemy async + asyncpg, PostgreSQL 16, Celery + Redis
- **Frontend**: Next.js 16 App Router, React 18, Tailwind v4, Radix UI, Zustand, TypeScript strict
- **CV Microservice**: FastAPI on :8001, WeasyPrint PDF generation, 15 Swiss templates
- **AI**: Multi-provider fallback: Groq (Llama 3.3 70B) → Gemini 2.0 Flash → DeepSeek → GPT-4o-mini → xAI Grok-2
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

## Domain Architecture (query MCP memory for full graph)
- **4 domains**: Consumer (B2C), B2B Corporate, Marketplace, Virtual Lawyer
- **Pack hierarchy**: free < immigration (CHF 9) < advanced (CHF 29) < citizenship (CHF 79)
- **B2B plans**: starter (CHF 199) < business (CHF 499) < enterprise (CHF 999)
- **Paywall is 3-layer**: frontend PaywallGate → Next.js API JWT → backend middleware
- **AI fallback is 5-deep**: Groq → Gemini → DeepSeek → GPT-4o-mini → xAI
- **Revenue-critical paths**: `/api/checkout`, `/api/products/checkout`, `/api/webhooks/stripe`, `/api/b2b/billing`

## Decision Log (why we chose X over Y)
- **FastAPI over Django**: async-first, lighter, explicit routing, Pydantic native
- **Zustand over Redux**: less boilerplate for 89 components, no provider wrapper needed
- **SQLAlchemy async over Tortoise/Prisma**: mature ecosystem, Alembic migrations, asyncpg
- **Resend over SendGrid**: simpler API, better DX, no bloated SDK
- **Tailwind v4 over CSS modules**: utility-first composability, `cn()` for conditional classes
- **WeasyPrint over Puppeteer for PDFs**: Python-native, no headless browser overhead
- **Multi-AI fallback over single provider**: resilience — no single point of AI failure
- **Content-as-code over CMS**: 27 modules in TypeScript files, no DB dependency for content
- **JWT in localStorage over cookies**: simpler SPA auth, explicit token management via `lib/api.ts`

## Lessons Learned (prevent recurring mistakes)
- zsh doesn't support bash `declare -A` associative arrays — use simple functions or positional args
- Always `Read` a file before `Edit` — the Edit tool requires prior Read in the same session
- One-time products need a SEPARATE checkout endpoint (`/api/products/checkout`) — don't reuse subscription `/api/checkout`
- `next/image` requires explicit `sizes` prop when using `fill` — omitting it causes layout shift
- Frontend content files (LP content, module content) are in TypeScript, not markdown
- `framer-motion` `whileInView` needs `viewport={{ once: true }}` to avoid re-triggering on scroll
- ImageMagick v7 uses `magick` command, not `convert` (deprecated)
- Docker healthchecks on Celery workers should use `celery -A app.celery_app inspect ping`
- Stripe webhook handler must process ALL event types or silently drop unknown ones — never 500
- The `sentence-transformers` package pulls PyTorch/CUDA (7.7GB) — consider lighter alternatives for RAG
