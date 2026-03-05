"""Factory for creating provider instances based on configuration."""

from __future__ import annotations

import logging

from src.voice_engine.config import VoiceEngineConfig
from src.voice_engine.providers.base import LLMProvider, STTProvider, TTSProvider

logger = logging.getLogger(__name__)


class ProviderFactory:
    """Lazily instantiate STT / LLM / TTS providers by config name.

    SIP deployment uses:
      STT  = groq  (Groq Whisper API — free, fast)
      LLM  = sip   (SipLLM → SIP backend streaming endpoints)
      TTS  = edge_tts (Microsoft Edge TTS — free, EN + FR)
    """

    @staticmethod
    def create_stt(config: VoiceEngineConfig) -> STTProvider:
        """Create and return an STT provider based on ``config.stt_provider``."""
        name = config.stt_provider.lower().strip()
        logger.info("Creating STT provider: %s (model=%s)", name, config.stt_model)

        if name == "groq":
            from src.voice_engine.providers.stt.groq_stt import GroqSTT

            return GroqSTT(
                api_key=config.groq_api_key,
                model=config.stt_model,
                language=config.sip_language,
            )

        if name == "openai":
            from src.voice_engine.providers.stt.openai_stt import OpenAISTT

            return OpenAISTT(api_key=config.openai_api_key, model=config.stt_model)

        raise ValueError(f"Unknown STT provider: {name!r}")

    @staticmethod
    def create_llm(config: VoiceEngineConfig) -> LLMProvider:
        """Create and return an LLM provider based on ``config.llm_provider``."""
        name = config.llm_provider.lower().strip()
        logger.info("Creating LLM provider: %s", name)

        if name == "sip":
            from src.voice_engine.providers.llm.sip_llm import SipLLM

            return SipLLM(
                backend_url=config.llm_base_url,
                mode=config.sip_mode,
                token=config.sip_token,
                language=config.sip_language,
            )

        if name == "groq":
            from src.voice_engine.providers.llm.groq_llm import GroqLLM

            return GroqLLM(api_key=config.groq_api_key, model=config.llm_model)

        raise ValueError(f"Unknown LLM provider: {name!r}")

    @staticmethod
    def create_tts(config: VoiceEngineConfig) -> TTSProvider:
        """Create and return a TTS provider based on ``config.tts_provider``."""
        name = config.tts_provider.lower().strip()
        logger.info("Creating TTS provider: %s (voice=%s)", name, config.tts_voice)

        if name == "edge_tts":
            from src.voice_engine.providers.tts.edge_tts_provider import EdgeTTSProvider

            return EdgeTTSProvider(voice=config.tts_voice)

        raise ValueError(f"Unknown TTS provider: {name!r}")
