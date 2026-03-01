# AGENTS.md — Swiss Immigration Pro (SIP)

> Architecture reference for AI agents, background models, and coding assistants
> working in this repository. Keep it up to date as the architecture evolves.

---

## Project Overview

AI-powered Swiss immigration platform with subscription tiers, an AI chatbot backed by Swiss law documents, CV builder tools, learning modules, B2B corporate portal, and a service marketplace. Full-stack: Python/FastAPI backend + Next.js frontend, containerized with Docker Compose.

---

## Repository Layout

```
sip/
├── backend/                  # Python FastAPI backend
│   ├── app/
│   │   ├── main.py           # App factory, 20 routers, CORS, rate limiting
│   │   ├── config.py         # pydantic-settings (DB, JWT, Stripe, AI, email)
│   │   ├── database.py       # Async SQLAlchemy engine (asyncpg, pool_size=20)
│   │   ├── celery_app.py     # Celery task queue (Redis broker)
│   │   ├── middleware/       # JWT auth (auth.py), rate limiting (rate_limit.py)
│   │   ├── migrations/       # Alembic env.py + schema.sql (15+ tables)
│   │   ├── models/           # SQLAlchemy ORM (user, subscription, content, company, marketplace)
│   │   ├── routers/          # 18 API routers + b2b/ (4) + marketplace/ (4)
│   │   ├── services/         # Business logic (ai, auth, stripe, email, drip_emails, compliance)
│   │   └── tasks/            # Celery tasks (email, compliance)
│   ├── tests/                # pytest suite (conftest.py with DB fixtures, test client, auth helpers)
│   ├── pyproject.toml        # ruff config (rules, isort, security lints) + pytest config
│   ├── .dockerignore
│   ├── Dockerfile            # Multi-stage: builder (gcc+deps) → runner (non-root appuser)
│   └── requirements.txt      # 25 packages (FastAPI, SQLAlchemy, Celery, Stripe, AI providers)
│
├── cv-backend/               # CV builder microservice (FastAPI) on :8001
│   ├── main.py               # CV CRUD, template listing, AI suggestions, PDF/DOCX export
│   ├── routers/              # cv.py, pdf.py, ai.py, templates.py
│   ├── services/             # template_engine (Jinja2), pdf_generator (WeasyPrint), ats_analyzer
│   ├── models/               # cv_data.py, templates.py (Pydantic)
│   ├── templates/html/       # 15 Swiss-themed CV templates
│   ├── .dockerignore
│   ├── Dockerfile            # Multi-stage: builder (WeasyPrint deps) → runner (non-root appuser)
│   └── requirements.txt
│
├── swiss-immigration-pro/    # Next.js 16 App Router frontend (TypeScript)
│   ├── app/                  # Route segments — 85 page files
│   │   ├── (main)/           # Main site: home, about, auth, admin, dashboard, tools, visas, modules, blog
│   │   ├── [layer]/          # Dynamic layer routing (eu/us/other nationality contexts)
│   │   ├── b2b/              # B2B corporate portal (dashboard, employees, reports, alerts, settings)
│   │   ├── marketplace/      # Service provider marketplace
│   │   ├── lawyer/           # Virtual Swiss lawyer chat
│   │   └── pricing/          # Pricing page
│   ├── components/           # 89 React components across 15 subdirectories
│   │   ├── chatbot/          # AI chatbot widget (7 files: streaming, typewriter, markdown)
│   │   ├── cv-builder/       # Full CV builder (~30 files: forms, templates, preview, export, ATS)
│   │   ├── layout/           # Header, Footer, LanguageSwitcher, ScrollToTop, FAB (10 files)
│   │   ├── marketing/        # Testimonials, SuccessStories, EmailCapture (5 files)
│   │   ├── modules/          # EnhancedModuleDisplay, AITutorBot, AIInsights
│   │   ├── ui/               # DarkModeToggle, AdvancedSearch, ErrorBoundary, Tooltip
│   │   └── ...               # admin, lawyer, onboarding, policies, pricing, providers, quiz, tools
│   ├── lib/                  # 75 files: config, auth, i18n (EN/FR), hooks, content (30+ modules), SEO, utils
│   ├── store/                # Zustand — cvBuilderStore.ts
│   ├── types/                # index.ts, cv-builder.ts
│   ├── .dockerignore
│   ├── Dockerfile            # 3-stage: deps → builder → runner (non-root nextjs user, standalone)
│   └── package.json          # Next.js 16, React 18, Radix UI, Framer Motion, Zustand 5, Zod 4
│
├── docs/                     # Swiss immigration law reference docs (FR markdown, ~10k lines)
│   ├── hb-bueg20-kap3-f.md   # Ordinary naturalization handbook
│   ├── hb-bueg20-kap4-f.md   # Facilitated naturalization handbook
│   ├── weisungen-aug-f.md    # Foreign Nationals Act directives
│   └── weisungen-aug-kap4-f.md
│
├── nginx/nginx.conf          # Reverse proxy: /api/* → backend, /* → frontend, rate limiting, security headers
├── .github/workflows/
│   ├── ci.yml                # 4 jobs: backend-lint, backend-test, frontend-build, docker-build
│   └── deploy.yml            # SSH deploy to VPS at /opt/sip on push to main
│
├── docker-compose.yml        # 9 services with healthchecks (db, redis, backend, cv-backend, celery-worker/beat, frontend, nginx, db-backup)
├── docker-compose.override.yml  # Local dev overrides (hot reload, volume mounts, debug mode)
├── .env.example              # All required env vars with placeholder values
├── Makefile                  # Standard dev targets (make dev, test, lint, format, db-migrate, admin, clean)
├── .editorconfig             # Consistent formatting (Python 4-space, TS 2-space, LF line endings)
├── .pre-commit-config.yaml   # Pre-commit hooks (ruff, eslint, secret detection, trailing whitespace)
├── .github/
│   ├── workflows/            # CI (lint, test, build, docker) + Deploy (SSH to VPS)
│   ├── dependabot.yml        # Automated dependency updates (pip, npm, docker, actions)
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/       # Bug report + feature request templates
├── .cursor/
│   ├── rules/                # 7 Cursor AI rules (.mdc): api-routes, python-backend, python-tests, react-nextjs, frontend-tests, docker-infra, state-management
│   └── mcp.json              # Context7 + Playwright MCP servers (project-level)
├── .cursorignore             # Exclude build artifacts, images, fonts, lock files from Cursor indexing
└── AGENTS.md                 # This file
```

---

## Docker Compose Services

| Service | Image / Build | Port | Healthcheck | Purpose |
|---|---|---|---|---|
| `db` | `postgres:16-alpine` | 5432 | `pg_isready` | PostgreSQL database |
| `redis` | `redis:7-alpine` | 6379 | `redis-cli ping` | Cache + Celery broker |
| `backend` | `./backend` | 8000 | `GET /api/health` | FastAPI API server |
| `cv-backend` | `./cv-backend` | 8001 | `GET /docs` | CV builder microservice (PDF/DOCX) |
| `celery-worker` | `./backend` | -- | -- | Async task worker (concurrency=2) |
| `celery-beat` | `./backend` | -- | -- | Periodic task scheduler |
| `frontend` | `./swiss-immigration-pro` | 3000 | `wget localhost:3000` | Next.js frontend |
| `nginx` | `nginx:alpine` | 80, 443 | `wget localhost:80` | Reverse proxy |
| `db-backup` | `postgres:16-alpine` | -- | -- | Nightly pg_dump (30-day retention) |

Named volumes: `postgres_data`, `redis_data`, `uploads`, `cv_storage`, `db_backups`

**Local dev:** `docker-compose.override.yml` auto-applies and enables hot reload (backend `--reload`, frontend `npm run dev`), source volume mounts, and `DEBUG=true`.

---

## Key Architectural Decisions

### Backend
- **Framework**: FastAPI with async/await throughout
- **Structure**: Routes -> Services -> Models. Business logic in services, never in route handlers.
- **Auth**: JWT-based, injected via `Depends(get_current_user)`. Admin routes require elevated privileges.
- **DB**: PostgreSQL 16 via SQLAlchemy async + asyncpg (pool_size=20), Alembic for migrations. 15+ tables: users, profiles, subscriptions, payments, chat_messages, user_limits, live_stats, masterclass_progress, quiz_results, cv_templates, user_cvs, cantonal_data, admin_logs, email_leads, consultations.
- **AI**: Multi-provider with fallback chain: Groq (Llama 3.1 70B) -> Google Gemini -> OpenAI -> xAI Grok -> HuggingFace. Chatbot uses `docs/` as knowledge base for legally accurate responses.
- **Payments**: Stripe subscriptions (3 tiers: Immigration, Advanced, Citizenship) + one-time consultation bookings. Webhook handler at `/api/webhooks/stripe`.
- **Email**: Resend API with automated drip email sequences via Celery tasks.
- **Task Queue**: Celery + Redis for email delivery, compliance checks, and scheduled jobs (celery-beat).
- **Testing**: pytest + pytest-asyncio, httpx.AsyncClient for endpoint tests. **Note: `backend/tests/` is currently empty -- needs test coverage.**

### Frontend
- **Framework**: Next.js 16.0.7 App Router -- default to React Server Components, use `"use client"` sparingly
- **Ports**: Dev server on `:5050` (webpack), production standalone on `:3000`
- **Styling**: Tailwind CSS v4 + Radix UI primitives + Framer Motion animations
- **State**: Zustand for CV builder state, URL params for navigation/filters, React Query patterns
- **i18n**: English + French via custom translation system (`lib/i18n/`)
- **Layer routing**: `[layer]` dynamic segment serves different content per nationality context (EU/US/Other)
- **Middleware**: JWT auth guard on `/admin/*` and `/b2b/*` routes (`middleware.ts`)
- **API proxy**: `next.config.ts` rewrites `/api/*` to the Python backend
- **Testing**: Playwright for E2E (checkout flow test exists)

### CV Builder
- **89 components** including 15 Swiss-themed template renderers, 10 section forms, live preview, PDF/DOCX export, ATS score analysis
- **cv-backend microservice** handles server-side PDF generation (WeasyPrint + Jinja2) but is **not yet integrated into docker-compose**

### Infrastructure
- **Docker**: Multi-stage builds for both backend (gcc builder -> slim runner) and frontend (deps -> build -> standalone runner). Non-root users in both.
- **Proxy**: nginx with rate limiting (30 req/s burst 50), gzip, security headers (HSTS, X-Frame-Options, CSP-ready). HTTPS config ready for Let's Encrypt.
- **CI/CD**: GitHub Actions -- 4 CI jobs (backend-lint, backend-test, frontend-build, docker-build) + deploy via SSH (`appleboy/ssh-action`).
- **Secrets**: Never committed -- `.env` locally, `${VAR}` references in compose, GitHub Secrets for CI/deploy.
- **Backups**: Automated daily PostgreSQL dumps with 30-day retention via `db-backup` service.

---

## API Routes (20 routers)

All endpoints prefixed with `/api/`:

| Router | Key Endpoints | Auth |
|---|---|---|
| `auth` | POST `/register`, `/login`, `/reset-password`; GET `/me` | Public / JWT |
| `chatbot` | POST `/chatbot` | Optional (rate-limited) |
| `lawyer` | POST `/lawyer` | JWT |
| `cv` | GET `/cv/list`; POST `/cv/save` | JWT |
| `payments` | POST `/checkout`; GET `/subscription` | JWT |
| `modules` | GET/POST `/modules/progress` | JWT |
| `admin` | GET `/admin/stats`, `/admin/users` | Admin JWT |
| `newsletter` | POST `/newsletter/subscribe` | Public |
| `contact` | POST `/contact` | Public |
| `search` | GET `/search` | Public |
| `apartments` | GET `/apartments` | Public |
| `consultations` | POST `/consultations/book` | JWT |
| `stats` | GET `/stats` | Public |
| `translate` | POST `/translate` | Public |
| `referrals` | GET/POST `/referrals` | JWT |
| `webhooks` | POST `/webhooks/stripe` | Stripe signature |
| `user` | GET/PUT `/user/profile` | JWT |
| `b2b/*` | Companies, employees, billing, reports, compliance | B2B JWT |
| `marketplace/*` | Providers, listings, reviews, referrals | Mixed |

Health check: `GET /api/health` (checks DB + Redis connectivity)

OpenAPI docs at `/api/docs` when `DEBUG=true`.

---

## Coding Conventions

### Python
- Type-annotate all function signatures (parameters and return types)
- Pydantic models for all data structures crossing boundaries
- Async I/O for all route handlers; blocking code goes in `asyncio.to_thread`
- Errors: raise `HTTPException` with structured `detail` -- no raw dict returns
- Imports: stdlib -> third-party -> local, separated by blank lines
- Use `Annotated[..., Depends()]` for dependency injection

### TypeScript/React
- No `any` -- use `unknown` and narrow it
- Component props typed via `interface`, not `type`
- `cn()` (clsx + tailwind-merge) for all conditional class names
- Named exports for components, default exports only for Next.js page/layout files
- `"use client"` only when necessary (event handlers, browser APIs, hooks)
- Server Actions in co-located `actions.ts` files
- `next/image` for all images, `next/font` for fonts

---

## Running Locally

```bash
# Full stack with hot reload (override file auto-applies)
docker compose up --build

# Production mode (skip override)
docker compose -f docker-compose.yml up --build

# Backend only
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export DB_HOST=localhost DB_PASSWORD=yourpass SECRET_KEY=dev-secret GROQ_API_KEY=gsk_...
uvicorn app.main:app --reload --port 8000

# Frontend only (dev server on :5050)
cd swiss-immigration-pro && npm install
export NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev

# Run Python tests
cd backend && pytest

# Run E2E tests
cd swiss-immigration-pro && npx playwright test

# Create admin user
docker compose exec backend python -c "
import asyncio, httpx
asyncio.run(httpx.AsyncClient(base_url='http://localhost:8000').post('/api/admin/create-admin', json={
    'email': 'admin@example.com', 'password': 'your-password', 'fullName': 'Admin'
}))
"
```

---

## Environment Variables

See `.env.example` for all required variables. Key ones:

| Variable | Required | Description |
|---|---|---|
| `DB_PASSWORD` | Yes | PostgreSQL password |
| `SECRET_KEY` | Yes | JWT signing key (`openssl rand -hex 32`) |
| `GROQ_API_KEY` | Yes* | Groq API key for AI chatbot |
| `STRIPE_SECRET_KEY` | No | Stripe secret key for payments |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signature verification |
| `RESEND_API_KEY` | No | Resend API key for emails |
| `GOOGLE_GEMINI_API_KEY` | No | Gemini API key (AI fallback) |
| `OPENAI_API_KEY` | No | OpenAI API key (AI fallback) |
| `XAI_API_KEY` | No | xAI Grok API key (AI fallback) |
| `SENTRY_DSN` | No | Sentry error tracking |
| `APP_URL` | No | Public URL (default: http://localhost) |
| `ADMIN_EMAIL` | No | Admin notification email |

*At least one AI provider key is needed for the chatbot.

---

## Known Gaps / TODO

- `backend/tests/` has infrastructure (conftest.py, fixtures) but needs real test coverage across all 20 routers
- `main.py` uses deprecated `@app.on_event()` -- should migrate to `lifespan` context manager
- CI uses tag-pinned actions (`@v4`) instead of SHA-pinned as best practice dictates
- No `mypy` type checking in CI pipeline
- No frontend unit tests (only one Playwright E2E spec exists)
- HTTPS in nginx.conf is commented out -- needs Let's Encrypt setup for production
- `middleware.ts` parses JWT without signature verification (relies on backend for real auth)
- `config.py` has insecure defaults for `secret_key` and `db_password` -- should raise in production
- nginx missing `Content-Security-Policy` header and `server_tokens off`

---

## What NOT to Do

- Don't add business logic to API route handlers
- Don't use `any` in TypeScript
- Don't commit `.env` files (check: `backend/.env` and `swiss-immigration-pro/.env.local` exist locally)
- Don't use `latest` Docker image tags
- Don't write tests that assert on implementation internals
- Don't do blocking I/O inside async functions
- Don't put secrets in docker-compose.yml -- use `${VAR}` references
- Don't skip healthchecks on services that others depend on
