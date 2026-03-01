# Swiss Immigration Pro

AI-powered Swiss immigration platform with subscription tiers, chatbot, CV tools, and learning modules.

## Architecture

```
                    ┌─────────┐
         :80        │  nginx  │
        ────────────│ reverse │
                    │  proxy  │
                    └────┬────┘
                         │
              ┌──────────┴──────────┐
              │                     │
         /api/*               everything else
              │                     │
        ┌─────▼─────┐        ┌─────▼──────┐
        │  FastAPI   │        │  Next.js   │
        │  Python    │        │  React/TS  │
        │  :8000     │        │  :3000     │
        └─────┬──────┘        └────────────┘
              │
        ┌─────▼──────┐
        │ PostgreSQL  │
        │  :5432      │
        └─────────────┘
```

- **Frontend** (`swiss-immigration-pro/`): Next.js 16, React 18, Tailwind CSS, Radix UI
- **Backend** (`backend/`): Python 3.12, FastAPI, SQLAlchemy async, asyncpg
- **Database**: PostgreSQL 16
- **AI**: Groq (Llama 3.1 70B), Google Gemini, OpenAI, xAI Grok
- **Payments**: Stripe (subscriptions + one-time)
- **Email**: Resend
- **Deployment**: Docker Compose + nginx

## Quick Start

```bash
# 1. Clone and configure
cp .env.example .env
# Edit .env with your keys (DB_PASSWORD, SECRET_KEY, GROQ_API_KEY at minimum)

# 2. Launch everything
docker compose up -d

# 3. Create admin user
docker compose exec backend python -c "
import asyncio, httpx
asyncio.run(httpx.AsyncClient(base_url='http://localhost:8000').post('/api/admin/create-admin', json={
    'email': 'admin@example.com',
    'password': 'your-password',
    'fullName': 'Admin'
}).json())
"

# 4. Open http://localhost
```

## Development (without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start PostgreSQL locally, then:
export DB_HOST=localhost DB_PASSWORD=yourpass SECRET_KEY=dev-secret GROQ_API_KEY=gsk_...
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd swiss-immigration-pro
npm install
export NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Frontend runs on `:5050` (dev) or `:3000` (prod). API calls to `/api/*` are proxied to the Python backend.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_PASSWORD` | Yes | PostgreSQL password |
| `SECRET_KEY` | Yes | JWT signing key (generate: `openssl rand -hex 32`) |
| `GROQ_API_KEY` | Yes* | Groq API key for AI chatbot |
| `STRIPE_SECRET_KEY` | No | Stripe secret key for payments |
| `RESEND_API_KEY` | No | Resend API key for emails |
| `GOOGLE_GEMINI_API_KEY` | No | Gemini API key (AI fallback) |
| `OPENAI_API_KEY` | No | OpenAI API key (AI fallback) |
| `APP_URL` | No | Public URL (default: http://localhost) |

*At least one AI provider key is needed for the chatbot to work.

## API Endpoints

All endpoints are prefixed with `/api/`. Key routes:

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/auth/register` | POST | - | Register new user |
| `/api/auth/login` | POST | - | Login, returns JWT |
| `/api/auth/me` | GET | JWT | Current user info |
| `/api/chatbot` | POST | Optional | AI chatbot |
| `/api/checkout` | POST | JWT | Stripe checkout |
| `/api/cv/list` | GET | JWT | User's saved CVs |
| `/api/cv/save` | POST | JWT | Save/update CV |
| `/api/modules/progress` | GET/POST | JWT | Module progress |
| `/api/admin/stats` | GET | Admin | Dashboard stats |
| `/api/stats` | GET | - | Public live stats |
| `/api/health` | GET | - | Health check |

Full API docs available at `/api/docs` when `DEBUG=true`.

## Project Structure

```
sip/
├── backend/                  # Python FastAPI backend
│   ├── app/
│   │   ├── main.py           # App entry point
│   │   ├── config.py         # Settings (pydantic-settings)
│   │   ├── database.py       # Async SQLAlchemy setup
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── routers/          # API route handlers
│   │   ├── services/         # Business logic (AI, email, Stripe)
│   │   └── middleware/       # Auth (JWT), rate limiting
│   ├── requirements.txt
│   └── Dockerfile
├── swiss-immigration-pro/    # Next.js frontend
│   ├── app/                  # Pages and layouts
│   ├── components/           # React components
│   ├── lib/                  # Utilities and config
│   ├── public/               # Static assets
│   └── Dockerfile
├── nginx/                    # Reverse proxy config
├── docker-compose.yml        # Full stack orchestration
├── .env.example              # Environment template
└── *.md                      # Swiss immigration law docs (AI knowledge base)
```
