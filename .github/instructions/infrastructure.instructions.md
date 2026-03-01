---
applyTo: "**/{Dockerfile*,docker-compose*.yml,.github/workflows/*.yml,nginx/*.conf}"
---

# Docker / CI / Infrastructure Rules

## Dockerfile
- Multi-stage builds: `builder` (deps/compile) → `runner` (lean final image)
- Pin base image versions exactly — never `latest`
- Run as non-root user in the runner stage
- Copy `requirements.txt` / `package.json` before source code for layer cache

## docker-compose
- Base in `docker-compose.yml`, local dev overrides in `docker-compose.override.yml`
- Never hardcode secrets — use `${VAR}` references
- All persistent data in named volumes — never bind-mount in prod configs
- Every service that others depend on must have a `healthcheck`

## Secrets & Env
- `.env` for local dev only — never commit
- `.env.example` lists all keys with placeholder values — keep it current
- Production secrets in a secrets manager, not env files

## GitHub Actions
- Pin actions to full SHA (e.g. `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af68`) — not a tag
- Cache pip/npm dependencies keyed on the lockfile hash
- Jobs: lint → test → build → deploy with `needs:` dependencies
- Never deploy on branch other than `main`
