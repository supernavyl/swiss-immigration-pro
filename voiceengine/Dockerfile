FROM python:3.12-slim AS builder

WORKDIR /build

# System deps for soundfile (libsndfile)
RUN apt-get update && \
    apt-get install -y --no-install-recommends libsndfile1-dev && \
    rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
# Install Python deps (no local ML models — just cloud API clients)
RUN pip install --no-cache-dir --target=/deps .

# ---------------------------------------------------------------------------
FROM python:3.12-slim

WORKDIR /app

# Runtime dep for soundfile
RUN apt-get update && \
    apt-get install -y --no-install-recommends libsndfile1 && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -r -s /bin/false appuser && \
    mkdir -p /app/.cache && \
    chown -R appuser:appuser /app

# Copy deps from builder
COPY --from=builder /deps /usr/local/lib/python3.12/site-packages/

# Copy application code
COPY src/ ./src/
COPY voice_server.py ./

USER appuser

EXPOSE 8421

HEALTHCHECK --interval=15s --timeout=10s --retries=5 --start-period=30s \
    CMD python -c "import httpx; httpx.get('http://localhost:8421/health').raise_for_status()"

CMD ["python", "-m", "uvicorn", "voice_server:app", "--host", "0.0.0.0", "--port", "8421", "--workers", "1"]
