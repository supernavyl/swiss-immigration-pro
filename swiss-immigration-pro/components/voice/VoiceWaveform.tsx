"use client";

import { useEffect, useRef } from "react";

interface VoiceWaveformProps {
  /** Audio level from 0 to 1 */
  audioLevel: number;
  /** Whether the AI is speaking (blue) or user is speaking (green) */
  variant: "listening" | "speaking" | "idle";
  /** Diameter in pixels */
  size?: number;
}

const COLORS = {
  listening: { inner: "#22c55e", outer: "rgba(34, 197, 94, 0.2)" },
  speaking: { inner: "#3b82f6", outer: "rgba(59, 130, 246, 0.2)" },
  idle: { inner: "#6b7280", outer: "rgba(107, 114, 128, 0.15)" },
} as const;

/**
 * Circular audio visualizer that pulses based on audio level.
 * Shows green when user is speaking, blue when AI is speaking.
 */
export function VoiceWaveform({ audioLevel, variant, size = 160 }: VoiceWaveformProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const smoothLevelRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const center = size / 2;
    const baseRadius = size * 0.25;
    const colors = COLORS[variant];

    function draw(): void {
      // Smooth the level for fluid animation
      smoothLevelRef.current += (audioLevel - smoothLevelRef.current) * 0.15;
      const level = smoothLevelRef.current;

      ctx!.clearRect(0, 0, size, size);

      // Outer glow ring (scales with level)
      const outerRadius = baseRadius + level * size * 0.15;
      ctx!.beginPath();
      ctx!.arc(center, center, outerRadius + 10, 0, Math.PI * 2);
      ctx!.fillStyle = colors.outer;
      ctx!.fill();

      // Middle ring
      ctx!.beginPath();
      ctx!.arc(center, center, outerRadius, 0, Math.PI * 2);
      ctx!.fillStyle = colors.outer;
      ctx!.fill();

      // Inner solid circle
      const innerRadius = baseRadius + level * size * 0.08;
      ctx!.beginPath();
      ctx!.arc(center, center, innerRadius, 0, Math.PI * 2);
      ctx!.fillStyle = colors.inner;
      ctx!.fill();

      // Bars around the circle (8 bars)
      const barCount = 8;
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
        const barHeight = 4 + level * size * 0.12 * (0.5 + 0.5 * Math.sin(Date.now() / 150 + i));
        const barWidth = 3;
        const startR = outerRadius + 6;

        ctx!.save();
        ctx!.translate(center, center);
        ctx!.rotate(angle);
        ctx!.fillStyle = colors.inner;
        ctx!.globalAlpha = 0.6 + level * 0.4;
        ctx!.fillRect(startR, -barWidth / 2, barHeight, barWidth);
        ctx!.restore();
        ctx!.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [audioLevel, variant, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
