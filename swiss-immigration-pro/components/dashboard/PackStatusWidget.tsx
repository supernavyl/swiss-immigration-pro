"use client";

import { Crown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface PackStatusWidgetProps {
  packId: string;
}

const PACK_CONFIG: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  free: {
    label: "FREE",
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
  immigration: {
    label: "IMMIGRATION PACK",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  advanced: {
    label: "ADVANCED PACK",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  citizenship: {
    label: "CITIZENSHIP PRO",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
};

export default function PackStatusWidget({ packId }: PackStatusWidgetProps) {
  const config = PACK_CONFIG[packId] ?? PACK_CONFIG.free;
  const isMaxTier = packId === "citizenship";

  return (
    <div className={cn("rounded-xl border p-4", config.bgColor, config.borderColor)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", config.bgColor)}>
            <Crown className={cn("w-5 h-5", config.color)} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Current Plan</p>
            <p className={cn("text-sm font-bold", config.color)}>{config.label}</p>
          </div>
        </div>
        {!isMaxTier && (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all"
          >
            Upgrade
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
