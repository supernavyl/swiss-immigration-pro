"use client";

import { useState, useEffect, useCallback } from "react";
import { Tag, X as XIcon } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import { analytics } from "@/lib/analytics";
import { api, ApiError } from "@/lib/api";
import { PRICING_PACKS, SITE_STATS } from "@/lib/pricing";
import PricingCard, { type PricingPlan } from "./PricingCard";
import ComparisonTable from "./ComparisonTable";
import FeatureDeepDive from "./FeatureDeepDive";
import PricingFAQ from "./PricingFAQ";
import AddOnsList from "./AddOnsList";

type PackValue = (typeof PRICING_PACKS)[keyof typeof PRICING_PACKS];

function packToPlan(pack: PackValue): PricingPlan {
  return {
    id: pack.id,
    name: pack.name,
    price: pack.price,
    badge: "badge" in pack ? (pack as { badge: string }).badge : undefined,
    shortDescription:
      "shortDescription" in pack
        ? (pack as { shortDescription: string }).shortDescription
        : undefined,
    recommendedFor:
      "recommendedFor" in pack
        ? (pack as { recommendedFor: string }).recommendedFor
        : undefined,
    features: pack.features,
  };
}

interface CouponResult {
  valid: boolean;
  description: string;
  percentOff: number;
  durationMonths: number;
}

export default function PricingContent({
  discountCode: initialDiscountCode,
}: {
  layer?: string;
  discountCode?: string;
}) {
  const { showToast } = useToast();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [activeCoupon, setActiveCoupon] = useState(initialDiscountCode ?? "");

  const discountCode = activeCoupon || initialDiscountCode;

  const handleCouponSubmit = useCallback(async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code || couponLoading) return;
    setCouponLoading(true);
    try {
      const data = await api.get<CouponResult>(
        `/api/payments/validate-coupon?code=${encodeURIComponent(code)}`,
      );
      setCouponResult(data);
      if (data.valid) setActiveCoupon(code);
    } catch {
      setCouponResult({ valid: false, description: "Failed to validate", percentOff: 0, durationMonths: 0 });
    }
    setCouponLoading(false);
  }, [couponInput, couponLoading]);

  const clearCoupon = useCallback(() => {
    setActiveCoupon("");
    setCouponResult(null);
    setCouponInput("");
    setCouponOpen(false);
  }, []);

  useEffect(() => {
    analytics.pricingViewed();
  }, []);

  const handleCheckout = async (packId: string) => {
    analytics.checkoutStarted(packId);
    try {
      const data = await api.post<{
        checkoutUrl?: string;
        checkout_url?: string;
        url?: string;
      }>("/api/checkout", {
        packId,
        cycle: billingCycle,
        ...(discountCode && { discountCode }),
      });
      const redirectUrl = data.checkoutUrl || data.checkout_url || data.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        showToast("Failed to initiate checkout. Please try again.", "error");
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        window.location.href =
          "/auth/login?redirect=" + encodeURIComponent(window.location.pathname);
        return;
      }
      const message =
        error instanceof ApiError
          ? error.detail
          : "Failed to initiate checkout. Please check your connection and try again.";
      showToast(message, "error");
    }
  };

  const handleProductCheckout = async (productId: string) => {
    analytics.checkoutStarted(productId);
    try {
      const data = await api.post<{
        checkoutUrl?: string;
        checkout_url?: string;
      }>("/api/products/checkout", { productId });
      const redirectUrl = data.checkoutUrl || data.checkout_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        showToast("Failed to initiate checkout. Please try again.", "error");
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        window.location.href =
          "/auth/login?redirect=" + encodeURIComponent(window.location.pathname);
        return;
      }
      const message =
        error instanceof ApiError
          ? error.detail
          : "Failed to initiate checkout. Please try again.";
      showToast(message, "error");
    }
  };

  const packs = Object.values(PRICING_PACKS) as PackValue[];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Discount banner */}
      {discountCode && (
        <div className="bg-blue-600 text-white text-center py-2.5 px-4 text-sm font-medium">
          Code{" "}
          <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
            {discountCode}
          </span>{" "}
          applied — savings appear at checkout
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 pt-16 pb-12">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
            {SITE_STATS.modules} immigration modules, {SITE_STATS.cantons} cantons,{" "}
            {SITE_STATS.cvTemplates} CV templates. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                billingCycle === "annual"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Annual
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
                −20%
              </span>
            </button>
          </div>

          {/* Coupon */}
          <div className="mt-5">
            {activeCoupon && couponResult?.valid ? (
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium px-3 py-1.5 rounded-full">
                <Tag className="w-3.5 h-3.5" />
                {couponResult.percentOff}% off with{" "}
                <span className="font-mono font-bold">{activeCoupon}</span>
                <button
                  onClick={clearCoupon}
                  className="ml-1 p-0.5 hover:bg-emerald-200 dark:hover:bg-emerald-800/40 rounded-full transition-colors"
                  aria-label="Remove coupon"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ) : !couponOpen ? (
              <button
                onClick={() => setCouponOpen(true)}
                className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline underline-offset-2 transition-colors"
              >
                Have a coupon?
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleCouponSubmit()}
                  placeholder="COUPON CODE"
                  className="w-40 px-3 py-2 text-sm font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleCouponSubmit}
                  disabled={!couponInput.trim() || couponLoading}
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
            )}
            {couponResult && !couponResult.valid && (
              <p className="text-sm text-red-600 mt-1.5">Invalid coupon code</p>
            )}
          </div>
        </div>
      </header>

      {/* Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {packs.map((pack, idx) => (
            <PricingCard
              key={pack.id}
              pack={packToPlan(pack)}
              idx={idx}
              billingCycle={billingCycle}
              onCheckout={handleCheckout}
            />
          ))}
        </div>

        <ComparisonTable />
        <FeatureDeepDive />
        <PricingFAQ />
        <AddOnsList onCheckout={handleProductCheckout} />
      </section>
    </main>
  );
}
