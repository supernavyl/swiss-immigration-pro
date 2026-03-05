"use client";

import { PhoneCall, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useT } from "@/lib/i18n/useTranslation";

interface VoiceButtonProps {
  /** Whether a voice session is active */
  isActive: boolean;
  /** Whether the AI is currently speaking */
  isSpeaking: boolean;
  /** Click handler to toggle voice mode */
  onClick: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Compact mode for chatbot widget */
  compact?: boolean;
}

/**
 * Toggle button for starting/stopping voice mode.
 * Shows mic icon (idle), pulsing phone (active), or speaker wave (AI speaking).
 */
export function VoiceButton({
  isActive,
  isSpeaking,
  onClick,
  disabled = false,
  compact = false,
}: VoiceButtonProps): React.ReactElement {
  const { t } = useT();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative rounded-lg transition-all duration-200 flex items-center gap-2 shrink-0",
        compact ? "p-2" : "px-3 py-2",
        isActive
          ? isSpeaking
            ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20"
            : "bg-red-500/10 text-red-500 dark:bg-red-500/20 animate-pulse"
          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      aria-label={isActive ? t("voice.endCall") : t("voice.startCall")}
      title={isActive ? t("voice.endCall") : t("voice.startCall")}
    >
      {isActive ? (
        <PhoneOff className={cn(compact ? "w-4 h-4" : "w-5 h-5")} />
      ) : (
        <>
          <PhoneCall className={cn(compact ? "w-4 h-4" : "w-5 h-5")} />
          {!compact && (
            <span className="text-sm font-medium hidden sm:inline">
              {t("voice.startCall")}
            </span>
          )}
        </>
      )}
      {isActive && !compact && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
      )}
    </button>
  );
}
