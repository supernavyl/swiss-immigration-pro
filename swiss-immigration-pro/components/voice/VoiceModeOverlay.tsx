"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, PhoneOff, X } from "lucide-react";
import { Syne } from "next/font/google";
import { useT } from "@/lib/i18n/useTranslation";

// ---------------------------------------------------------------------------
// Scoped display font (lazy — only loads when overlay renders)
// ---------------------------------------------------------------------------
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["700", "800"],
  display: "swap",
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface VoiceModeOverlayProps {
  isOpen: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  isConnected: boolean;
  transcript: string;
  responseText: string;
  onEndCall: () => void;
  onInterrupt: () => void;
  mode: "lawyer" | "chatbot";
  compact?: boolean;
}

type OverlayState = "connecting" | "listening" | "processing" | "speaking";

// ---------------------------------------------------------------------------
// Design constants
// ---------------------------------------------------------------------------
const STATE_HUE: Record<OverlayState, number> = {
  connecting: 220,
  listening: 160,
  processing: 265,
  speaking: 230,
};

const STATE_GLOW_INTENSITY: Record<OverlayState, number> = {
  connecting: 0.08,
  listening: 0.12,
  processing: 0.15,
  speaking: 0.20,
};

const STATE_BLOB_AMPLITUDE: Record<OverlayState, number> = {
  connecting: 0.06,
  listening: 0.10,
  processing: 0.14,
  speaking: 0.22,
};

const STATUS_COLORS: Record<OverlayState, string> = {
  connecting: "#94a3b8",
  listening: "#34d399",
  processing: "#a78bfa",
  speaking: "#818cf8",
};

const BG = "#06060a";
const PARTICLE_COUNT = 80;
const BLOB_POINTS = 128;
const EQ_BARS = 32;
const PULSE_RING_COUNT = 3;

// ---------------------------------------------------------------------------
// Precomputed particles
// ---------------------------------------------------------------------------
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

function createParticles(w: number, h: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: 1 + Math.random() * 1.5,
    alpha: 0.15 + Math.random() * 0.25,
  }));
}

// ---------------------------------------------------------------------------
// Smooth noise for blob distortion (fast sine-based)
// ---------------------------------------------------------------------------
function blobNoise(angle: number, time: number, amplitude: number): number {
  return (
    Math.sin(angle * 3 + time * 1.2) * 0.45 * amplitude +
    Math.sin(angle * 5 + time * 2.1) * 0.30 * amplitude +
    Math.sin(angle * 7 + time * 0.7) * 0.15 * amplitude +
    Math.sin(angle * 2 + time * 3.0) * 0.10 * amplitude
  );
}

// ---------------------------------------------------------------------------
// Lerp hue around the color wheel
// ---------------------------------------------------------------------------
function lerpHue(from: number, to: number, t: number): number {
  const diff = ((to - from + 540) % 360) - 180;
  return ((from + diff * t) + 360) % 360;
}

// ---------------------------------------------------------------------------
// Simulated audio energy
// ---------------------------------------------------------------------------
function simulateAudio(time: number, state: OverlayState): number {
  const base =
    state === "speaking" ? 0.55
      : state === "processing" ? 0.35
        : state === "listening" ? 0.20
          : 0.08;
  return base + 0.15 * Math.sin(time * 3.5) + 0.10 * Math.sin(time * 7.2) + 0.05 * Math.sin(time * 11.0);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function VoiceModeOverlay({
  isOpen,
  isListening,
  isSpeaking,
  isProcessing,
  isConnected,
  transcript,
  responseText,
  onEndCall,
  onInterrupt,
  mode: _mode,
  compact = false,
}: VoiceModeOverlayProps): React.ReactElement | null {
  const { t } = useT();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const hueRef = useRef(STATE_HUE.connecting);
  const particlesRef = useRef<Particle[]>([]);
  const pulseTimersRef = useRef<number[]>([0, 0.33, 0.66]);

  const [displayHue, setDisplayHue] = useState(STATE_HUE.connecting);

  // Derive state
  const overlayState: OverlayState = !isConnected
    ? "connecting"
    : isSpeaking
      ? "speaking"
      : isProcessing
        ? "processing"
        : "listening";

  const statusLabel = {
    connecting: t("voice.connecting"),
    listening: t("voice.listening"),
    processing: t("voice.processing"),
    speaking: t("voice.speaking"),
  }[overlayState];

  // Shift+V keyboard shortcut
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.shiftKey && (e.key === "V" || e.key === "v")) {
        e.preventDefault();
        onEndCall();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onEndCall]);

  // Sync hue to React state at 10fps
  useEffect(() => {
    if (!isOpen) return undefined;
    const iv = setInterval(() => setDisplayHue(hueRef.current), 100);
    return () => clearInterval(iv);
  }, [isOpen]);

  // Handle interrupt on click anywhere when speaking
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent): void => {
      if (isSpeaking && e.target === e.currentTarget) {
        onInterrupt();
      }
    },
    [isSpeaking, onInterrupt],
  );

  // ── Canvas animation loop ──────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dpr = window.devicePixelRatio || 1;
    const cssW = compact ? 320 : 480;
    const cssH = compact ? 320 : 480;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.scale(dpr, dpr);

    const cx = cssW / 2;
    const cy = cssH / 2;
    const blobRadius = compact ? 80 : 120;

    // Init particles
    if (particlesRef.current.length === 0) {
      particlesRef.current = createParticles(cssW, cssH);
    }

    const stateRef = { current: overlayState };

    const draw = (timestamp: number): void => {
      const tNow = timestamp * 0.001;
      const state = stateRef.current;

      // Smooth hue transition
      hueRef.current = lerpHue(hueRef.current, STATE_HUE[state], 0.035);
      const hue = hueRef.current;

      // Audio simulation
      const energy = simulateAudio(tNow, state);
      const amplitude = STATE_BLOB_AMPLITUDE[state];
      const glowIntensity = STATE_GLOW_INTENSITY[state];

      ctx.clearRect(0, 0, cssW, cssH);

      // ── 1. Ambient particles ────────────────────────────────────
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = cssW;
        if (p.x > cssW) p.x = 0;
        if (p.y < 0) p.y = cssH;
        if (p.y > cssH) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 60%, 70%, ${p.alpha * 0.5})`;
        ctx.fill();
      }

      // ── 2. Pulse rings (expand outward, fade) ──────────────────
      for (let i = 0; i < PULSE_RING_COUNT; i++) {
        pulseTimersRef.current[i] = (pulseTimersRef.current[i] + 0.004 + energy * 0.003) % 1;
        const progress = pulseTimersRef.current[i];
        const ringRadius = blobRadius * (1.2 + progress * 1.8);
        const ringAlpha = (1 - progress) * 0.15 * (0.5 + energy * 0.5);

        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue}, 75%, 60%, ${ringAlpha})`;
        ctx.lineWidth = 1.5 - progress * 0.8;
        ctx.stroke();
      }

      // ── 3. Outer glow (behind blob) ────────────────────────────
      const outerGlow = ctx.createRadialGradient(cx, cy, blobRadius * 0.5, cx, cy, blobRadius * 2.5);
      outerGlow.addColorStop(0, `hsla(${hue}, 80%, 55%, ${glowIntensity + energy * 0.06})`);
      outerGlow.addColorStop(0.5, `hsla(${hue}, 75%, 50%, ${glowIntensity * 0.4})`);
      outerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, cssW, cssH);

      // ── 4. Central morphing blob ───────────────────────────────
      ctx.beginPath();
      for (let i = 0; i <= BLOB_POINTS; i++) {
        const angle = (i / BLOB_POINTS) * Math.PI * 2;
        const distortion = blobNoise(angle, tNow, amplitude + energy * 0.15);
        const r = blobRadius * (1 + distortion);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Blob gradient fill
      const blobGrad = ctx.createRadialGradient(
        cx - blobRadius * 0.2, cy - blobRadius * 0.2, 0,
        cx, cy, blobRadius * 1.3,
      );
      blobGrad.addColorStop(0, `hsla(${hue}, 85%, 75%, 0.95)`);
      blobGrad.addColorStop(0.35, `hsla(${hue + 10}, 80%, 60%, 0.85)`);
      blobGrad.addColorStop(0.7, `hsla(${hue + 20}, 75%, 45%, 0.6)`);
      blobGrad.addColorStop(1, `hsla(${hue + 30}, 70%, 35%, 0.2)`);
      ctx.fillStyle = blobGrad;
      ctx.fill();

      // Blob inner glow (screen composite)
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const innerGlow = ctx.createRadialGradient(
        cx - blobRadius * 0.15, cy - blobRadius * 0.15, 0,
        cx, cy, blobRadius * 0.8,
      );
      innerGlow.addColorStop(0, `hsla(${hue}, 90%, 85%, ${0.35 + energy * 0.15})`);
      innerGlow.addColorStop(0.6, `hsla(${hue}, 85%, 70%, 0.08)`);
      innerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = innerGlow;
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.restore();

      // ── 5. Equalizer bars (circular) ───────────────────────────
      const barInnerR = blobRadius * 1.25;
      const barMaxLen = compact ? 18 : 28;
      for (let i = 0; i < EQ_BARS; i++) {
        const angle = (i / EQ_BARS) * Math.PI * 2 - Math.PI / 2;
        const freq = 2 + i * 0.7;
        const barEnergy = energy * (0.4 + 0.6 * Math.abs(Math.sin(tNow * freq + i * 0.5)));
        const barLen = 3 + barEnergy * barMaxLen;
        const barWidth = compact ? 2 : 2.5;
        const barAlpha = 0.3 + barEnergy * 0.5;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.fillStyle = `hsla(${hue + i * 3}, 80%, 65%, ${barAlpha})`;
        ctx.beginPath();
        ctx.roundRect(barInnerR, -barWidth / 2, barLen, barWidth, barWidth / 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // Keep state ref in sync
    const stateSync = setInterval(() => {
      stateRef.current = !isConnected
        ? "connecting"
        : isSpeaking
          ? "speaking"
          : isProcessing
            ? "processing"
            : "listening";
    }, 50);

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      clearInterval(stateSync);
    };
  }, [isOpen, compact, isConnected, isSpeaking, isProcessing, isListening, overlayState]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={syne.variable}
          onClick={handleBackdropClick}
          style={{
            position: "fixed",
            inset: 0,
            background: BG,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            fontFamily: "var(--font-jakarta), var(--font-inter), system-ui, sans-serif",
          }}
        >
          {/* ── Subtle dot grid ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, rgba(240,244,255,0.03) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              pointerEvents: "none",
            }}
          />

          {/* ── Ambient gradient wash ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse 60% 50% at 50% 45%,
                hsla(${displayHue}, 80%, 50%, 0.06) 0%,
                transparent 70%)`,
              pointerEvents: "none",
              transition: "background 1.5s ease-out",
            }}
          />

          {/* ── Close button ── */}
          <motion.button
            onClick={onEndCall}
            aria-label={t("voice.endCall")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: 8,
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <X className="w-4 h-4" />
          </motion.button>

          {/* ── Catherine identity ── */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 180, damping: 22 }}
            style={{
              textAlign: "center",
              marginBottom: compact ? 12 : 20,
              zIndex: 5,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: compact ? 22 : 28,
                fontWeight: 800,
                color: "#f0f4ff",
                letterSpacing: "-0.02em",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Catherine
            </h2>
            <p
              style={{
                fontSize: compact ? 11 : 12,
                fontWeight: 500,
                color: "#475569",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: "6px 0 0",
              }}
            >
              {_mode === "lawyer" ? "AI Legal Assistant" : "AI Assistant"}
            </p>
          </motion.div>

          {/* ── Central canvas (morphing blob + eq bars + particles) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 120, damping: 20 }}
            style={{ position: "relative", zIndex: 4 }}
          >
            <canvas
              ref={canvasRef}
              style={{
                display: "block",
                width: compact ? 320 : 480,
                height: compact ? 320 : 480,
              }}
            />
          </motion.div>

          {/* ── Status indicator ── */}
          <motion.div
            key={overlayState}
            initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: compact ? -8 : -12,
              zIndex: 5,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: STATUS_COLORS[overlayState],
                boxShadow: `0 0 8px ${STATUS_COLORS[overlayState]}`,
                animation: overlayState === "listening" ? "pulse 2s ease-in-out infinite" : undefined,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: STATUS_COLORS[overlayState],
              }}
            >
              {statusLabel}
            </span>
          </motion.div>

          {/* ── Transcript ── */}
          <div style={{ minHeight: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 16, zIndex: 5 }}>
            <AnimatePresence mode="wait">
              {transcript && (
                <motion.div
                  key="transcript"
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                  style={{
                    maxWidth: compact ? 280 : 440,
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: "10px 18px",
                    fontSize: compact ? 13 : 14,
                    color: "#e2e8f0",
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                    <Mic className="w-3 h-3" style={{ color: "#34d399", flexShrink: 0 }} />
                    {transcript}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {responseText && (
                <motion.div
                  key="response"
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 180, damping: 22 }}
                  style={{
                    maxWidth: compact ? 280 : 440,
                    background: `hsla(${displayHue}, 60%, 50%, 0.04)`,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: `1px solid hsla(${displayHue}, 60%, 50%, 0.08)`,
                    borderRadius: 14,
                    padding: "10px 18px",
                    fontSize: compact ? 12 : 13,
                    color: "#94a3b8",
                    textAlign: "center",
                    lineHeight: 1.55,
                    fontStyle: "italic",
                  }}
                >
                  {responseText}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Bottom control dock ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 150, damping: 20 }}
            style={{
              position: "absolute",
              bottom: compact ? 24 : 40,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px) saturate(1.1)",
              WebkitBackdropFilter: "blur(20px) saturate(1.1)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 9999,
              zIndex: 10,
            }}
          >
            {/* Interrupt button (only when speaking) */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.button
                  initial={{ width: 0, opacity: 0, scale: 0.5 }}
                  animate={{ width: "auto", opacity: 1, scale: 1 }}
                  exit={{ width: 0, opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  onClick={onInterrupt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: 9999,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#cbd5e1",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {t("voice.interrupt")}
                </motion.button>
              )}
            </AnimatePresence>

            {/* End call button */}
            <motion.button
              onClick={onEndCall}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                borderRadius: 9999,
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-syne), sans-serif",
                boxShadow: "0 4px 20px rgba(239,68,68,0.3), 0 0 40px rgba(239,68,68,0.1)",
              }}
            >
              <PhoneOff className="w-4 h-4" />
              <span>{t("voice.endCall")}</span>
            </motion.button>
          </motion.div>

          {/* ── Footer hint ── */}
          {!compact && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                position: "absolute",
                bottom: compact ? 8 : 12,
                color: "rgba(240,244,255,0.15)",
                fontSize: 10,
                zIndex: 5,
              }}
            >
              Shift+V to close
              {isSpeaking ? ` \u00b7 tap anywhere to interrupt` : ""}
            </motion.p>
          )}

          {/* pulse keyframe for status dot */}
          <style jsx global>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.5; transform: scale(1.3); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
