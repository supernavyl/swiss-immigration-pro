FROM python:3.12-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpango1.0-dev libpangocairo-1.0-0 libgdk-pixbuf-2.0-dev \
    libffi-dev libcairo2-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ---

FROM python:3.12-slim AS runner

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf-2.0-0 \
    libcairo2 libffi8 fonts-liberation && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1001 appuser && \
    useradd --uid 1001 --gid appuser --shell /bin/false appuser

COPY --from=builder /install /usr/local

WORKDIR /app
COPY . .

RUN mkdir -p /app/storage && chown -R appuser:appuser /app

USER appuser

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "2"]
