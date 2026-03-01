"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import { analytics } from "@/lib/analytics";

interface ExitIntentPopupProps {
  discountCode?: string;
  discountPercent?: number;
  enabled?: boolean;
}

export default function ExitIntentPopup({
  discountCode = "SAVE15",
  discountPercent = 15,
  enabled = true,
}: ExitIntentPopupProps) {
  const { showToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || !enabled) return;

    // Check if already shown in this session
    try {
      const shown = sessionStorage?.getItem("exitIntentShown");
      if (shown === "true") {
        setHasShown(true);
        return;
      }

      // Check if user is logged in (don't show to logged-in users on pricing page)
      const token = localStorage?.getItem("sip_token");
      if (token) {
        return; // Logged-in users see in-app upgrade prompts instead
      }
    } catch (e) {
      // Storage might be blocked by browser
      console.warn("Storage access blocked:", e);
      return;
    }

    // Detect exit intent
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top (not scrolling)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        try {
          sessionStorage?.setItem("exitIntentShown", "true");
        } catch (e) {
          console.warn("Failed to set sessionStorage:", e);
        }
        analytics.exitIntentTriggered();
      }
    };

    // Add event listener
    if (document) {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    // Cleanup
    return () => {
      if (document) {
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [enabled]);

  const handleClose = () => {
    setIsVisible(false);
    analytics.exitIntentDismissed();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email to capture endpoint
      if (typeof window === "undefined") {
        throw new Error("Client-side only operation");
      }

      const response = await fetch("/api/marketing/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "exit_intent_popup",
          discount_code: discountCode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to capture email: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to capture email");
      }

      // Track conversion
      analytics.exitIntentConverted(email);

      // Copy discount code to clipboard (with fallback)
      if (typeof window !== "undefined" && navigator?.clipboard) {
        try {
          await navigator.clipboard.writeText(discountCode);
        } catch (err) {
          console.warn("Failed to copy to clipboard:", err);
          // Fallback: user will see the code in the success message
        }
      }

      // Show success message
      showToast(
        `Success! Your ${discountPercent}% discount code (${discountCode}) has been copied!`,
        "success",
      );

      // Close popup after 2 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    } catch (error) {
      console.error("Exit intent capture error:", error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCtaClick = () => {
    analytics.exitIntentCtaClicked();
    // Discount code is already shown, just close popup
    setIsVisible(false);
    // Scroll to pricing section if on same page
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 mx-4">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close popup"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-xl opacity-50 animate-pulse" />
                  <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-full p-4">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Wait! Don't Leave Empty-Handed
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get{" "}
                  <span className="font-bold text-red-600">
                    {discountPercent}% off
                  </span>{" "}
                  your first 3 months
                </p>
              </div>

              {/* Discount code display */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Exclusive Code:
                  </span>
                </div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 tracking-wider">
                  {discountCode}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Valid for 24 hours · Use at checkout
                </p>
              </div>

              {/* Email capture form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="exit-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="exit-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to save this offer"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5" />
                      Claim My {discountPercent}% Discount
                    </>
                  )}
                </button>
              </form>

              {/* Trust elements */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Join 5,000+ people who successfully moved to Switzerland
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
