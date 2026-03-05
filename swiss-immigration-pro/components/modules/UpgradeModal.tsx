"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { useState, useCallback } from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Reason the user hit the gate, e.g. module title */
  feature: string;
}

export default function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.post<{
        checkoutUrl?: string;
        checkout_url?: string;
        url?: string;
      }>("/api/checkout", {
        packId: "advanced",
        cycle: "annual",
      });
      const redirectUrl = data.checkoutUrl ?? data.checkout_url ?? data.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        window.location.href = "/auth/login?redirect=" + encodeURIComponent(window.location.pathname);
        return;
      }
    }
    setLoading(false);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="upgrade-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="upgrade-modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-x-4 top-[12%] z-50 mx-auto max-w-lg"
          >
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden">
              <button
                onClick={onClose}
                className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <h2 className="text-xl font-bold">Unlock Premium Content</h2>
                <p className="text-blue-100 text-sm mt-1.5 max-w-sm mx-auto">
                  Get access to <span className="font-semibold">&ldquo;{feature}&rdquo;</span> and all 31 expert modules
                </p>
              </div>

              {/* Body */}
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {[
                    "All 31 immigration modules with legal references",
                    "AI-powered Virtual Lawyer (unlimited messages)",
                    "Downloadable templates, checklists & calculators",
                    "Interactive progress tracking",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    CHF 29<span className="text-base font-normal text-gray-500">/mo</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    7-day free trial &middot; Cancel anytime
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Redirecting..." : "Start Free Trial"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                <Link
                  href="/pricing"
                  onClick={onClose}
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-3 font-medium"
                >
                  See All Plans
                </Link>

                <p className="text-center text-xs text-gray-400 mt-4">
                  30-day money-back guarantee &middot; No questions asked
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
