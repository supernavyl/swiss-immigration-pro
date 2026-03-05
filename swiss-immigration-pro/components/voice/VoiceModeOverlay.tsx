"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PhoneOff, Hand } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useT } from "@/lib/i18n/useTranslation";
import { VoiceWaveform } from "./VoiceWaveform";

interface VoiceModeOverlayProps {
  /** Whether the overlay is visible */
  isOpen: boolean;
  /** Current voice state */
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  isConnected: boolean;
  /** User's last transcript */
  transcript: string;
  /** AI's current response text */
  responseText: string;
  /** End the voice call */
  onEndCall: () => void;
  /** Interrupt the AI while speaking */
  onInterrupt: () => void;
  /** Mode label for display */
  mode: "lawyer" | "chatbot";
  /** Use compact layout (for chatbot widget) */
  compact?: boolean;
}

function getStatusLabel(
  t: (key: string) => string,
  isConnected: boolean,
  isListening: boolean,
  isProcessing: boolean,
  isSpeaking: boolean,
): string {
  if (!isConnected) return t("voice.connecting");
  if (isListening) return t("voice.listening");
  if (isProcessing) return t("voice.processing");
  if (isSpeaking) return t("voice.speaking");
  return t("voice.connecting");
}

function getWaveformVariant(
  isListening: boolean,
  isSpeaking: boolean,
): "listening" | "speaking" | "idle" {
  if (isSpeaking) return "speaking";
  if (isListening) return "listening";
  return "idle";
}

/**
 * Full-screen (lawyer) or in-widget (chatbot) voice conversation overlay.
 * Shows animated waveform, live transcript, status, and controls.
 */
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
  mode,
  compact = false,
}: VoiceModeOverlayProps): React.ReactElement | null {
  const { t } = useT();

  const statusLabel = getStatusLabel(t, isConnected, isListening, isProcessing, isSpeaking);
  const waveVariant = getWaveformVariant(isListening, isSpeaking);

  // Audio level simulation based on state (real level would come from worklet RMS)
  const audioLevel = isSpeaking ? 0.6 : isListening ? 0.3 : 0.05;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex flex-col items-center justify-center gap-6",
            compact
              ? "bg-gray-50 dark:bg-gray-900 rounded-xl p-6"
              : "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-8",
          )}
        >
          {/* Mode label */}
          {!compact && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
              <span className="text-white/60 text-sm font-medium uppercase tracking-wider">
                {mode === "lawyer" ? t("nav.consultation") : "Chatbot"} &middot; {t("voice.startCall")}
              </span>
            </div>
          )}

          {/* Waveform */}
          <VoiceWaveform
            audioLevel={audioLevel}
            variant={waveVariant}
            size={compact ? 120 : 160}
          />

          {/* Status */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isListening && "bg-green-500 animate-pulse",
                isSpeaking && "bg-blue-500 animate-pulse",
                isProcessing && "bg-yellow-500 animate-pulse",
                !isConnected && "bg-gray-500",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                compact ? "text-gray-600 dark:text-gray-300" : "text-white/80",
              )}
            >
              {statusLabel}
            </span>
          </div>

          {/* Transcript (user's words) */}
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-center max-w-md",
                compact ? "text-gray-500 dark:text-gray-400 text-sm" : "text-white/50 text-base",
              )}
            >
              <span className="italic">&ldquo;{transcript}&rdquo;</span>
            </motion.div>
          )}

          {/* Response text (AI's words) */}
          {responseText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-center max-w-md leading-relaxed",
                compact ? "text-gray-900 dark:text-gray-100 text-sm" : "text-white text-lg",
              )}
            >
              {responseText}
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4 mt-2">
            {/* Interrupt button (visible during AI speaking) */}
            {isSpeaking && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={onInterrupt}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  compact
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
                    : "bg-white/10 hover:bg-white/20 text-white",
                )}
              >
                <Hand className="w-4 h-4" />
                <span className="text-sm">{t("voice.interrupt")}</span>
              </motion.button>
            )}

            {/* End call */}
            <button
              onClick={onEndCall}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors",
                compact && "px-4 py-2 text-sm",
              )}
            >
              <PhoneOff className={cn(compact ? "w-4 h-4" : "w-5 h-5")} />
              <span>{t("voice.endCall")}</span>
            </button>
          </div>

          {/* Tap to interrupt hint */}
          {isSpeaking && !compact && (
            <p className="text-white/30 text-xs mt-2">
              {t("voice.tapToInterrupt")}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
