"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useT } from "@/lib/i18n/useTranslation";

interface VoiceButtonProps {
  isActive: boolean;
  isSpeaking: boolean;
  onClick: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export function VoiceButton({
  isActive,
  isSpeaking,
  onClick,
  disabled = false,
  compact = false,
}: VoiceButtonProps): React.ReactElement {
  const { t } = useT();

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.06 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={cn(
        "relative rounded-full flex items-center gap-2 shrink-0 transition-all duration-300",
        compact ? "p-2.5" : "px-4 py-2.5",
        disabled && "opacity-40 cursor-not-allowed",
      )}
      style={{
        background: isActive
          ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.12))"
          : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: isActive
          ? "1px solid rgba(59,130,246,0.3)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isActive
          ? "0 0 24px rgba(37,99,235,0.25), 0 0 48px rgba(37,99,235,0.1)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        color: isActive ? "#60a5fa" : "#64748b",
      }}
      aria-label={isActive ? t("voice.endCall") : t("voice.startCall")}
      title={isActive ? t("voice.endCall") : t("voice.startCall")}
    >
      {isActive ? (
        <PhoneOff className={cn(compact ? "w-4 h-4" : "w-[18px] h-[18px]")} />
      ) : (
        <>
          <PhoneCall className={cn(compact ? "w-4 h-4" : "w-[18px] h-[18px]")} />
          {!compact && (
            <span className="text-[13px] font-medium hidden sm:inline">
              {t("voice.startCall")}
            </span>
          )}
        </>
      )}

      {/* Active indicator */}
      <AnimatePresence>
        {isActive && (
          <>
            <motion.span
              key="pulse"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 2.8], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: -3,
                right: -3,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: isSpeaking
                  ? "rgba(129,140,248,0.5)"
                  : "rgba(59,130,246,0.5)",
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isSpeaking ? "#818cf8" : "#3b82f6",
                boxShadow: isSpeaking
                  ? "0 0 8px rgba(129,140,248,0.6)"
                  : "0 0 8px rgba(59,130,246,0.6)",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
