FROM python:3.12-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Install core dependencies
COPY requirements.txt requirements-ml.txt ./
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Install ML deps with CPU-only PyTorch (~500MB instead of ~6.7GB)
RUN pip install --no-cache-dir --prefix=/install \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    -r requirements-ml.txt

# ---

FROM python:3.12-slim AS runner

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 tesseract-ocr && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1001 appuser && \
    useradd --uid 1001 --gid appuser --shell /bin/false appuser

COPY --from=builder /install /usr/local

WORKDIR /app
COPY . .

RUN mkdir -p /app/uploads && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD python -c "import httpx; r = httpx.get('http://localhost:8000/api/health'); r.raise_for_status()"

ENV WEB_CONCURRENCY=4

CMD uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers $WEB_CONCURRENCY
