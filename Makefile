.DEFAULT_GOAL := help
COMPOSE := docker compose
BACKEND := $(COMPOSE) exec backend
CELERY_WORKER := $(COMPOSE) exec celery-worker

.PHONY: help dev up down build restart logs clean \
        lint lint-back lint-front format test test-back test-e2e \
        db-migrate db-shell admin shell-back shell-front

## ── Development ──────────────────────────────────────────────

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

dev: ## Start all services (hot reload via override)
	$(COMPOSE) up --build

up: ## Start all services (detached)
	$(COMPOSE) up -d --build

down: ## Stop all services
	$(COMPOSE) down

build: ## Rebuild all images (no cache)
	$(COMPOSE) build --no-cache

restart: ## Restart all services
	$(COMPOSE) restart

prod: ## Start in production mode (skip override)
	$(COMPOSE) -f docker-compose.yml up -d --build

## ── Logs ─────────────────────────────────────────────────────

logs: ## Tail all service logs
	$(COMPOSE) logs -f

logs-back: ## Tail backend logs
	$(COMPOSE) logs -f backend celery-worker celery-beat

logs-front: ## Tail frontend logs
	$(COMPOSE) logs -f frontend

## ── Lint & Format ────────────────────────────────────────────

lint: lint-back lint-front ## Run all linters

lint-back: ## Lint Python backend with ruff
	cd backend && ruff check app/ && ruff format --check app/

lint-front: ## Lint frontend with eslint
	cd swiss-immigration-pro && npx eslint .

format: ## Auto-format backend code
	cd backend && ruff check --fix app/ && ruff format app/

## ── Test ─────────────────────────────────────────────────────

test: test-back test-e2e ## Run all tests

test-back: ## Run backend pytest suite
	cd backend && python -m pytest tests/ -v --tb=short

test-e2e: ## Run Playwright E2E tests
	cd swiss-immigration-pro && npx playwright test

## ── Database ─────────────────────────────────────────────────

db-migrate: ## Run Alembic migrations
	$(BACKEND) alembic upgrade head

db-shell: ## Open psql shell
	$(COMPOSE) exec db psql -U $${DB_USER:-postgres} -d $${DB_NAME:-swiss_immigration}

## ── Admin ────────────────────────────────────────────────────

admin: ## Create admin user (usage: make admin EMAIL=x PASS=y)
	$(BACKEND) python -c "import asyncio,httpx;asyncio.run(httpx.AsyncClient(base_url='http://localhost:8000').post('/api/admin/create-admin',json={'email':'$(EMAIL)','password':'$(PASS)','fullName':'Admin'}))"

## ── Shell Access ─────────────────────────────────────────────

shell-back: ## Shell into backend container
	$(BACKEND) /bin/bash

shell-front: ## Shell into frontend container
	$(COMPOSE) exec frontend /bin/sh

## ── Cleanup ──────────────────────────────────────────────────

clean: ## Remove all containers, volumes, and orphans
	$(COMPOSE) down -v --remove-orphans

prune: ## Remove dangling Docker images
	docker image prune -f
