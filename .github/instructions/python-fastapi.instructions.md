---
applyTo: "backend/**/*.py"
---

# Python / FastAPI — Coding Rules

## Style
- Python 3.11+, full type annotations on **every** function signature (parameters + return type)
- Use `from __future__ import annotations` at the top of files with forward references
- Group imports: stdlib → third-party → local, each group separated by a blank line
- Never use mutable default arguments; never use bare `except:`

## FastAPI
- Route handlers must be thin: **validate → call service → return**
- Business logic belongs in `services/`, never in `routers/`
- Every request/response must be a Pydantic `BaseModel` subclass
  - Separate `FooCreate` / `FooRequest` from `FooResponse` — never reuse them
  - Use `Field(description=..., example=...)` for all public-facing fields
- Dependency injection: `Annotated[CurrentUser, Depends(get_current_user)]`
- Raise `HTTPException(status_code=..., detail="...")` — never return raw error dicts
- Every `APIRouter` must have an explicit `prefix` and `tags`

## Async I/O
- All route handlers are `async def`
- Blocking calls (PDF gen, CPU-bound work) go in `asyncio.to_thread(...)`
- Never `await` inside a sync function

## Database (SQLAlchemy async)
- Use `select(Model).where(...)` — never raw SQL strings
- `await db.flush()` before reading back generated IDs in the same transaction
- Alembic handles all schema changes — never call `Base.metadata.create_all()`

## Security
- Never log request bodies that may contain PII or credentials
- Webhook secrets must be verified with signature check before any processing

## Revenue rules
- Any new feature that gates content must check `profile.pack_id` against the required tier
- Chatbot / lawyer message limits: read from `config.py`, never hardcode them
