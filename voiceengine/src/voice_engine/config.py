"""Voice Engine configuration for SIP deployment."""

from __future__ import annotations

import logging

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class VoiceEngineConfig(BaseSettings):
    """Central configuration loaded from environment / .env file."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # ── API Keys ──────────────────────────────────
    groq_api_key: str = Field(default="", description="Groq API key (for Whisper STT)")
    openai_api_key: str = Field(default="", description="OpenAI API key (fallback STT)")

    # ── STT ────────────────────────────────────────
    stt_provider: str = Field(default="groq", description="STT provider: groq | openai")
    stt_model: str = Field(
        default="whisper-large-v3-turbo", description="STT model identifier",
    )

    # ── LLM ────────────────────────────────────────
    llm_provider: str = Field(default="sip", description="LLM provider: sip | groq")
    llm_model: str = Field(default="", description="LLM model (unused for sip provider)")
    llm_base_url: str = Field(
        default="http://backend:8000",
        description="SIP backend base URL",
    )

    # ── TTS ────────────────────────────────────────
    tts_provider: str = Field(default="edge_tts", description="TTS provider: edge_tts")
    tts_voice: str = Field(default="en-US-AriaNeural", description="Edge TTS voice identifier")

    # ── SIP-specific ──────────────────────────────
    sip_mode: str = Field(default="lawyer", description="SIP mode: lawyer or chatbot")
    sip_token: str = Field(default="", description="JWT for SIP backend (set per session)")
    sip_language: str = Field(default="en", description="Language code for SIP")

    # ── Voice Mapping ─────────────────────────────
    lawyer_voice: str = Field(
        default="en-US-AriaNeural", description="TTS voice for virtual lawyer",
    )
    chatbot_voice: str = Field(
        default="en-US-JennyNeural", description="TTS voice for chatbot",
    )

    # ── Concurrency ───────────────────────────────
    max_sessions: int = Field(default=10, description="Max simultaneous voice sessions")
