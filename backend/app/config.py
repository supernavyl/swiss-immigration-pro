from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    app_name: str = "Swiss Immigration Pro"
    app_firm: str = "Alpine Legal Partners"
    app_url: str = "http://localhost:3000"
    admin_email: str = "admin@alpinelegalpartners.ch"
    debug: bool = False

    # Database
    db_host: str = "db"
    db_port: int = 5432
    db_name: str = "swiss_immigration"
    db_user: str = "postgres"
    db_password: str = ""

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

    @property
    def database_url_sync(self) -> str:
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

    # Auth
    secret_key: str = ""
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 43200  # 30 days

    def model_post_init(self, __context: object) -> None:
        """Generate ephemeral secret_key in dev mode to prevent empty-string signing."""
        if not self.secret_key and self.debug:
            import secrets

            object.__setattr__(self, "secret_key", secrets.token_hex(32))

    def validate_production_secrets(self) -> None:
        if not self.debug and not self.secret_key:
            raise ValueError(
                "SECRET_KEY must be set to a secure random value in production. Generate one with: openssl rand -hex 32"
            )
        if not self.debug and not self.db_password:
            raise ValueError("DB_PASSWORD must be set in production.")
        if not self.debug and not self.stripe_secret_key:
            raise ValueError("STRIPE_SECRET_KEY must be set in production.")
        if not self.debug:
            price_fields = [
                ("stripe_price_immigration_monthly", self.stripe_price_immigration_monthly),
                ("stripe_price_immigration_annual", self.stripe_price_immigration_annual),
                ("stripe_price_advanced_monthly", self.stripe_price_advanced_monthly),
                ("stripe_price_advanced_annual", self.stripe_price_advanced_annual),
                ("stripe_price_citizenship_monthly", self.stripe_price_citizenship_monthly),
                ("stripe_price_citizenship_annual", self.stripe_price_citizenship_annual),
            ]
            for field_name, value in price_fields:
                if "test" in value.lower():
                    raise ValueError(f"{field_name.upper()} contains 'test' — set real Stripe price IDs in production.")

    # Stripe
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_immigration_monthly: str = "price_immigration_monthly_test"
    stripe_price_immigration_annual: str = "price_immigration_annual_test"
    stripe_price_advanced_monthly: str = "price_advanced_monthly_test"
    stripe_price_advanced_annual: str = "price_advanced_annual_test"
    stripe_price_citizenship_monthly: str = "price_citizenship_monthly_test"
    stripe_price_citizenship_annual: str = "price_citizenship_annual_test"

    # Email (Resend)
    resend_api_key: str = ""
    resend_from_email: str = "Swiss Immigration Pro <noreply@swissimmigrationpro.com>"

    # AI Providers
    groq_api_key: str = ""
    google_gemini_api_key: str = ""
    deepseek_api_key: str = ""
    openai_api_key: str = ""
    xai_api_key: str = ""
    huggingface_api_key: str = ""

    # AI Config
    ai_max_tokens: int = 1500
    ai_temperature: float = 0.7
    free_daily_message_limit: int = 5

    # Lawyer-specific AI config
    ai_lawyer_max_tokens: int = 3000
    ai_lawyer_temperature: float = 0.3
    lawyer_free_anon_daily_limit: int = 1
    lawyer_free_daily_limit: int = 3
    lawyer_immigration_daily_limit: int = 30
    lawyer_advanced_daily_limit: int = 100

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5050"]

    # Redis
    redis_url: str = "redis://:changeme@redis:6379"

    # Monitoring
    sentry_dsn: str = ""

    # Admin bootstrap
    admin_bootstrap_secret: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.validate_production_secrets()
    return settings
