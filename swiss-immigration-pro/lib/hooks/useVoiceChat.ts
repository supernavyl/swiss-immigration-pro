"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAudioPlayback } from "./useAudioPlayback";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface VoiceMetadata {
  legalBasis?: string[];
  nextSteps?: string[];
  estimatedCost?: string;
  timeline?: string;
  [key: string]: unknown;
}

interface UseVoiceChatOptions {
  mode: "lawyer" | "chatbot";
  language: string;
  conversationId?: string;
  onTranscription?: (text: string) => void;
  onSpeakingStart?: (text: string) => void;
  onSpeakingEnd?: () => void;
  onMetadata?: (metadata: VoiceMetadata) => void;
  onError?: (error: string) => void;
}

interface UseVoiceChatReturn {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  transcript: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  interrupt: () => void;
  isSupported: boolean;
}

type VoiceState = "idle" | "connecting" | "listening" | "processing" | "speaking";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("sip_token") || null;
  } catch {
    return null;
  }
}

function getWsUrl(
  mode: string,
  token: string,
  lang: string,
  conversationId?: string,
): string {
  // Allow configuring voice engine URL via env var (needed for Vercel / external deployments)
  const envUrl = process.env.NEXT_PUBLIC_VOICE_WS_URL;
  let base: string;
  if (envUrl) {
    // External voiceengine: env var should be like "wss://voice.example.com" or "ws://localhost:8421"
    base = `${envUrl.replace(/\/$/, "")}/ws/voice/${mode}?token=${encodeURIComponent(token)}&lang=${encodeURIComponent(lang)}`;
  } else {
    // Same-origin (Docker stack with nginx proxy)
    const protocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = typeof window !== "undefined" ? window.location.host : "localhost";
    base = `${protocol}//${host}/ws/voice/${mode}?token=${encodeURIComponent(token)}&lang=${encodeURIComponent(lang)}`;
  }
  if (!conversationId) return base;
  return `${base}&conversation_id=${encodeURIComponent(conversationId)}`;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useVoiceChat(options: UseVoiceChatOptions): UseVoiceChatReturn {
  const {
    mode,
    language,
    conversationId,
    onTranscription,
    onSpeakingStart,
    onSpeakingEnd,
    onMetadata,
    onError,
  } = options;

  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const playback = useAudioPlayback();

  // Stable callback refs
  const onTranscriptionRef = useRef(onTranscription);
  const onSpeakingStartRef = useRef(onSpeakingStart);
  const onSpeakingEndRef = useRef(onSpeakingEnd);
  const onMetadataRef = useRef(onMetadata);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onTranscriptionRef.current = onTranscription;
    onSpeakingStartRef.current = onSpeakingStart;
    onSpeakingEndRef.current = onSpeakingEnd;
    onMetadataRef.current = onMetadata;
    onErrorRef.current = onError;
  }, [onTranscription, onSpeakingStart, onSpeakingEnd, onMetadata, onError]);

  const isSupported = typeof window !== "undefined"
    && typeof AudioContext !== "undefined"
    && typeof navigator.mediaDevices?.getUserMedia === "function";

  // ── Connect ────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    if (state !== "idle") return;

    const token = getToken();
    setState("connecting");

    try {
      // Request mic permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: { ideal: 48000 },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Init audio playback (needs user gesture context)
      playback.init();

      // Create AudioContext + AudioWorklet
      const audioCtx = new AudioContext({ sampleRate: 48000 });
      audioCtxRef.current = audioCtx;

      await audioCtx.audioWorklet.addModule("/audio-worklet-processor.js");

      const workletNode = new AudioWorkletNode(audioCtx, "voice-capture-processor");
      workletRef.current = workletNode;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(workletNode);

      // Open WebSocket
      const url = getWsUrl(mode, token ?? "", language, conversationId);
      const ws = new WebSocket(url);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = () => {
        setState("listening");
      };

      ws.onmessage = (event: MessageEvent) => {
        if (event.data instanceof ArrayBuffer) {
          // Binary: TTS audio chunk (Int16LE @ 24kHz)
          playback.playChunk(event.data);
          return;
        }

        // Text: JSON control message
        try {
          const msg = JSON.parse(event.data as string) as Record<string, unknown>;
          const msgType = msg.type as string;

          switch (msgType) {
            case "ready":
              setState("listening");
              break;

            case "transcription": {
              const text = (msg.text as string) || "";
              setTranscript(text);
              if (text) {
                onTranscriptionRef.current?.(text);
              }
              setState("processing");
              break;
            }

            case "speaking_start": {
              const text = (msg.text as string) || "";
              setState("speaking");
              onSpeakingStartRef.current?.(text);
              break;
            }

            case "speaking_end":
              setState("listening");
              onSpeakingEndRef.current?.();
              break;

            case "metadata":
              onMetadataRef.current?.(msg as VoiceMetadata);
              break;

            case "error":
              onErrorRef.current?.((msg.message as string) || "Unknown error");
              break;
          }
        } catch {
          // Ignore parse errors
        }
      };

      ws.onclose = () => {
        setState("idle");
        cleanup();
      };

      ws.onerror = () => {
        onErrorRef.current?.("voice.connectionFailed");
        setState("idle");
        cleanup();
      };

      // Worklet -> WebSocket (mic audio)
      workletNode.port.onmessage = (event: MessageEvent) => {
        const msg = event.data as { type: string; data?: ArrayBuffer };
        if (msg.type === "audio" && msg.data && ws.readyState === WebSocket.OPEN) {
          ws.send(new Float32Array(msg.data));
        }
        if (msg.type === "silence" && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "end_of_speech" }));
        }
      };
    } catch (err: unknown) {
      const message = err instanceof DOMException && err.name === "NotAllowedError"
        ? "voice.micPermissionDenied"
        : "voice.connectionFailed";
      onErrorRef.current?.(message);
      setState("idle");
      cleanup();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, mode, language, conversationId]);

  // ── Disconnect ─────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "hangup" }));
    }
    wsRef.current?.close();
    wsRef.current = null;

    workletRef.current?.disconnect();
    workletRef.current = null;

    if (audioCtxRef.current?.state !== "closed") {
      audioCtxRef.current?.close();
    }
    audioCtxRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    playback.stop();
  }, [playback]);

  const disconnect = useCallback(() => {
    cleanup();
    setState("idle");
    setTranscript("");
  }, [cleanup]);

  // ── Interrupt (barge-in) ───────────────────────────────────────────
  const interrupt = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "interrupt" }));
    }
    playback.stop();
    setState("listening");
  }, [playback]);

  // ── Cleanup on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cleanup();
      playback.cleanup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isConnected: state !== "idle" && state !== "connecting",
    isListening: state === "listening",
    isSpeaking: state === "speaking",
    isProcessing: state === "processing",
    transcript,
    connect,
    disconnect,
    interrupt,
    isSupported,
  };
}
