"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, CheckCircle, ArrowRight, PhoneCall } from "lucide-react";
import Link from "next/link";

interface ConsultationUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationUpsellModal({ isOpen, onClose }: ConsultationUpsellModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="consult-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="consult-modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-x-4 top-[15%] z-50 mx-auto max-w-md"
          >
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden">
              <button
                onClick={onClose}
                className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white text-center">
                <PhoneCall className="w-7 h-7 mx-auto mb-2 opacity-90" />
                <h2 className="text-lg font-bold">Daily message limit reached</h2>
                <p className="text-amber-100 text-sm mt-1">
                  Free users get 5 AI messages per day
                </p>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 text-center">
                  Want personalized 1:1 guidance from our immigration specialists?
                  Book a consultation for direct expert advice.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                    Quick Consultation includes:
                  </h3>
                  <ul className="space-y-1.5">
                    {[
                      "30-min video call with immigration expert",
                      "Document review and feedback",
                      "Personalized action plan",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/consultation"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Book a CHF 80 Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/pricing"
                  onClick={onClose}
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-3 font-medium"
                >
                  Or upgrade for unlimited AI messages
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
