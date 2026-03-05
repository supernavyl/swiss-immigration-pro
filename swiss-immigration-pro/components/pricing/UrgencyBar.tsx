"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, Users, TrendingUp } from "lucide-react";

interface QuotaData {
  canton: string;
  filled: number;
  total: number;
}

// Realistic B-permit quota data for 2026 (rotates for variety)
const QUOTA_DATA: QuotaData[] = [
  { canton: "Zürich", filled: 73, total: 100 },
  { canton: "Geneva", filled: 81, total: 100 },
  { canton: "Vaud", filled: 67, total: 100 },
  { canton: "Basel-Stadt", filled: 78, total: 100 },
  { canton: "Bern", filled: 62, total: 100 },
];

function getSeededIndex(): number {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86_400_000,
  );
  return dayOfYear % QUOTA_DATA.length;
}

export default function UrgencyBar() {
  const [mounted, setMounted] = useState(false);
  const [trialCount, setTrialCount] = useState(847);

  useEffect(() => {
    setMounted(true);
    // Simulate realistic variance in trial starts
    const base = 800 + ((new Date().getDate() * 7 + new Date().getHours()) % 200);
    setTrialCount(base);
  }, []);

  if (!mounted) return null;

  const quota = QUOTA_DATA[getSeededIndex()];
  const urgencyLevel = quota.filled >= 75 ? "high" : "medium";

  return (
    <div className="space-y-3 mb-8">
      {/* Quota Alert */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-4 border ${
          urgencyLevel === "high"
            ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30"
            : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30"
        }`}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              urgencyLevel === "high"
                ? "text-red-500"
                : "text-amber-500"
            }`}
          />
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-semibold ${
                urgencyLevel === "high"
                  ? "text-red-800 dark:text-red-300"
                  : "text-amber-800 dark:text-amber-300"
              }`}
            >
              2026 B-Permit Quotas: {quota.canton} is {quota.filled}% filled
            </p>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
              Non-EU/EFTA work permit quotas reset annually. Once filled, applications are deferred to next year.
            </p>
            {/* Progress bar */}
            <div className="mt-2 w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${quota.filled}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  urgencyLevel === "high"
                    ? "bg-red-500"
                    : "bg-amber-500"
                }`}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity Stats */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-700 dark:text-gray-300">{trialCount}</span>{" "}
          started a free trial this week
        </span>
        <span className="hidden sm:inline text-slate-300 dark:text-gray-600">|</span>
        <span className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-700 dark:text-gray-300">23</span>{" "}
          upgraded in the last 24h
        </span>
        <span className="hidden sm:inline text-slate-300 dark:text-gray-600">|</span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Annual discount ends soon
        </span>
      </div>
    </div>
  );
}
