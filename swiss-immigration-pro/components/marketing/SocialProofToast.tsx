"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

interface ProofEntry {
  name: string;
  city: string;
  country: string;
  action: string;
  timeAgo: string;
}

const PROOF_ENTRIES: ProofEntry[] = [
  { name: "Sarah C.", city: "Zürich", country: "Singapore", action: "signed up for Advanced Pack", timeAgo: "2 minutes ago" },
  { name: "Marco R.", city: "Basel", country: "Italy", action: "started the free assessment", timeAgo: "5 minutes ago" },
  { name: "Priya P.", city: "Geneva", country: "India", action: "upgraded to Citizenship Pro", timeAgo: "8 minutes ago" },
  { name: "James W.", city: "Bern", country: "USA", action: "purchased the Masterclass", timeAgo: "12 minutes ago" },
  { name: "Elena M.", city: "Lausanne", country: "Romania", action: "signed up for Immigration Pack", timeAgo: "15 minutes ago" },
  { name: "Ahmed H.", city: "Zürich", country: "Jordan", action: "completed family reunification module", timeAgo: "18 minutes ago" },
  { name: "Sofia L.", city: "Lugano", country: "Spain", action: "downloaded CV templates", timeAgo: "22 minutes ago" },
  { name: "Chen W.", city: "Winterthur", country: "China", action: "signed up for Advanced Pack", timeAgo: "25 minutes ago" },
  { name: "Marie D.", city: "Zürich", country: "France", action: "booked a consultation", timeAgo: "30 minutes ago" },
  { name: "Tomasz K.", city: "Basel", country: "Poland", action: "started the free assessment", timeAgo: "33 minutes ago" },
  { name: "Aisha N.", city: "Geneva", country: "Nigeria", action: "upgraded to Advanced Pack", timeAgo: "37 minutes ago" },
  { name: "Lucas B.", city: "Bern", country: "Brazil", action: "purchased Citizenship Roadmap", timeAgo: "41 minutes ago" },
];

const SHOW_DURATION_MS = 5_000;
const INTERVAL_MS = 25_000;
const INITIAL_DELAY_MS = 12_000;

export default function SocialProofToast() {
  const [current, setCurrent] = useState<ProofEntry | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  const showNext = useCallback(() => {
    if (dismissed) return;
    const entry = PROOF_ENTRIES[index % PROOF_ENTRIES.length];
    setCurrent(entry);
    setIndex((prev) => prev + 1);

    const hideTimer = setTimeout(() => setCurrent(null), SHOW_DURATION_MS);
    return () => clearTimeout(hideTimer);
  }, [dismissed, index]);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      showNext();
    }, INITIAL_DELAY_MS);

    return () => clearTimeout(initialTimer);
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (index === 0 || dismissed) return;

    const intervalTimer = setTimeout(() => {
      showNext();
    }, INTERVAL_MS);

    return () => clearTimeout(intervalTimer);
  }, [index, dismissed, showNext]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 pr-10"
          >
            <button
              onClick={() => {
                setCurrent(null);
                setDismissed(true);
              }}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Dismiss notifications"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
                  <span className="font-semibold">{current.name}</span>
                  {" "}from {current.country}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
                  {current.action}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {current.timeAgo} · {current.city}, Switzerland
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
