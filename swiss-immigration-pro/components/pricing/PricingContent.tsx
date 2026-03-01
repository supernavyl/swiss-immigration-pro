"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle,
  Crown,
  Sparkles,
  Shield,
  Star,
  Zap,
  MessageSquare,
  BookOpen,
  LayoutDashboard,
  Users,
  FileText,
  TrendingUp,
  Award,
} from "lucide-react";
// Award, BookOpen, TrendingUp, Shield also used in add-ons section
import { useToast } from "@/components/providers/ToastProvider";
import { analytics } from "@/lib/analytics";
import { api, ApiError } from "@/lib/api";
import { PRICING_PACKS, ONE_TIME_PRODUCTS, SITE_STATS } from "@/lib/pricing";
import { PricingPack } from "@/types";

// Helper type to extract pack type from PRICING_PACKS
type PackValue = (typeof PRICING_PACKS)[keyof typeof PRICING_PACKS];

// FAQ items - defined as constant to ensure stable rendering and prevent hydration mismatches
const FAQ_ITEMS = [
  {
    id: "switch-plans",
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle, and we'll prorate any differences accordingly.",
    keywords: "change pricing plan, upgrade subscription, switch plans",
  },
  {
    id: "citizenship-one-time",
    q: "Is the Citizenship Pro pack a one-time fee?",
    a: "Yes! The Citizenship Pro Pack is a one-time payment that gives you lifetime access to all current and future citizenship resources, including updates and new content as we add it.",
    keywords: "citizenship pack, one-time payment, lifetime access",
  },
  {
    id: "cancellation-policy",
    q: "What is your cancellation policy?",
    a: "You can cancel your subscription at any time with no penalties. Your access will continue until the end of your current billing period, ensuring you get full value from your purchase.",
    keywords:
      "cancel subscription, subscription cancellation, cancellation policy",
  },
  {
    id: "payment-methods",
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, Twint (Switzerland's leading mobile payment), SEPA Direct Debit for EU bank accounts, and other local payment methods. All payments are processed securely through Stripe. Prices are in CHF.",
    keywords:
      "payment methods, twint, sepa, accepted payments, secure payments",
  },
] as const;

export default function PricingContent({
  layer = "default",
  discountCode,
}: {
  layer?: string;
  discountCode?: string;
}) {
  const { showToast } = useToast();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual",
  );
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Determine layer from localStorage or use provided layer
  const [currentLayer, setCurrentLayer] = useState<"eu" | "us" | "other">(
    "other",
  );
  const [homeHref, setHomeHref] = useState("/");

  useEffect(() => {
    analytics.pricingViewed();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (
        layer &&
        layer !== "default" &&
        (layer === "eu" || layer === "us" || layer === "other")
      ) {
        setCurrentLayer(layer as "eu" | "us" | "other");
        setHomeHref(layer === "eu" ? "/eu" : layer === "us" ? "/us" : "/other");
      } else {
        const stored = localStorage.getItem("userLayer");
        if (stored) {
          try {
            const layerData = JSON.parse(stored);
            if (
              layerData?.layer === "eu" ||
              layerData?.layer === "us" ||
              layerData?.layer === "other"
            ) {
              setCurrentLayer(layerData.layer);
              setHomeHref(
                layerData.layer === "eu"
                  ? "/eu"
                  : layerData.layer === "us"
                    ? "/us"
                    : "/other",
              );
            }
          } catch {
            // Default to other
          }
        }
      }
    }
  }, [layer]);

  // Generate JSON-LD structured data for SEO - lazy evaluation to avoid initialization issues
  const structuredData = useMemo(() => {
    try {
      return {
        "@context": "https://schema.org",
        "@type": "OfferCatalog",
        name: "Swiss Immigration Pricing Plans",
        description:
          "Comprehensive pricing plans for Swiss immigration guidance, from free resources to premium citizenship roadmaps",
        offers: (Object.values(PRICING_PACKS) as PackValue[]).map((pack) => ({
          "@type": pack.price === 0 ? "Offer" : "Product",
          name: pack.name,
          description: pack.description || (pack as any).shortDescription || "",
          price: pack.price,
          priceCurrency: "CHF",
          availability: "https://schema.org/InStock",
          url:
            typeof window !== "undefined"
              ? `${window.location.origin}/pricing`
              : "/pricing",
          category:
            pack.id === "citizenship"
              ? "Citizenship Services"
              : pack.id === "advanced"
                ? "Advanced Immigration Services"
                : pack.id === "immigration"
                  ? "Immigration Services"
                  : "Free Resources",
          offers:
            pack.price > 0
              ? {
                  "@type": "Offer",
                  price: pack.price,
                  priceCurrency: "CHF",
                  priceValidUntil: "2026-12-31",
                  availability: "https://schema.org/InStock",
                  url:
                    typeof window !== "undefined"
                      ? `${window.location.origin}/pricing`
                      : "/pricing",
                }
              : undefined,
        })),
      };
    } catch (error) {
      console.error("Error generating structured data:", error);
      return null;
    }
  }, []);

  const handleCheckout = async (packId: string) => {
    analytics.checkoutStarted(packId);
    try {
      const data = await api.post<{
        checkoutUrl?: string;
        checkout_url?: string;
        url?: string;
      }>("/api/checkout", { packId, cycle: billingCycle, ...(discountCode && { discountCode }) });

      const redirectUrl = data.checkoutUrl || data.checkout_url || data.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        showToast("Failed to initiate checkout. Please try again.", "error");
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        window.location.href =
          "/auth/login?redirect=" +
          encodeURIComponent(window.location.pathname);
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
          "/auth/login?redirect=" +
          encodeURIComponent(window.location.pathname);
        return;
      }
      const message =
        error instanceof ApiError
          ? error.detail
          : "Failed to initiate checkout. Please try again.";
      showToast(message, "error");
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <main
        className={`min-h-screen bg-white font-sans transition-colors duration-300`}
        itemScope
        itemType="https://schema.org/OfferCatalog"
      >
        {/* Discount Code Banner */}
        {discountCode && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-center py-3 px-4 font-semibold text-sm sm:text-base">
            <Zap className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Discount code <span className="font-mono font-bold bg-white/30 px-2 py-0.5 rounded">{discountCode}</span> applied — savings will appear at checkout
          </div>
        )}

        {/* Header Section with Light Background */}
        <header className="relative bg-gradient-to-b from-white via-blue-50/30 to-white pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-24 md:pb-32 overflow-hidden transition-colors duration-300">
          <div
            className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"
            aria-hidden="true"
          ></div>
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-100/20 to-transparent pointer-events-none"
            aria-hidden="true"
          ></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight px-2">
                Swiss Immigration{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Pricing Plans
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-black max-w-2xl mx-auto mb-3 sm:mb-4 font-semibold leading-relaxed px-2">
                Premium guidance, AI-powered tools, and expert resources at a
                fraction of the cost of traditional consultants.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-black max-w-2xl mx-auto mb-4 sm:mb-6 font-light opacity-80 px-2">
                Choose the perfect plan for your Swiss immigration journey -
                from free resources to comprehensive citizenship roadmaps.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-black mb-6 sm:mb-8 px-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                  <span>{SITE_STATS.successRate} Success Rate</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                  <span className="whitespace-nowrap">{SITE_STATS.contentWords} Words</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                  <span className="whitespace-nowrap">Save {SITE_STATS.savingsRange}</span>
                </div>
              </div>

              {/* Billing Toggle */}
              <div
                className="flex items-center justify-center gap-3 sm:gap-4 mb-2 px-2"
                role="group"
                aria-label="Billing cycle selector"
              >
                <span
                  className={`text-xs sm:text-sm font-medium transition-colors ${billingCycle === "monthly" ? "text-black" : "text-black opacity-50"}`}
                >
                  Monthly
                </span>
                <button
                  role="switch"
                  aria-checked={billingCycle === "annual"}
                  onClick={() =>
                    setBillingCycle(
                      billingCycle === "monthly" ? "annual" : "monthly",
                    )
                  }
                  className={`w-14 h-7 sm:w-16 sm:h-8 rounded-full p-0.5 sm:p-1 relative transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${billingCycle === "annual" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-200 hover:bg-gray-300"}`}
                  aria-label={`Switch to ${billingCycle === "monthly" ? "annual" : "monthly"} billing`}
                >
                  <motion.div
                    animate={{
                      x:
                        billingCycle === "annual"
                          ? typeof window !== "undefined" &&
                            window.innerWidth < 640
                            ? 28
                            : 32
                          : 0,
                    }}
                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </button>
                <span
                  className={`text-xs sm:text-sm font-medium transition-colors ${billingCycle === "annual" ? "text-black" : "text-black opacity-50"}`}
                >
                  Annual{" "}
                  <span className="text-green-600 text-[10px] sm:text-xs ml-1 font-bold bg-green-50 px-1.5 py-0.5 rounded-full">
                    Save 20%
                  </span>
                </span>
              </div>
              <p className="text-center text-[11px] text-green-700 font-semibold mb-6 sm:mb-8">
                ⚡ 847 people started their free trial this week
              </p>
            </motion.div>
          </div>
        </header>

        {/* Pricing Cards Section */}
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 md:-mt-20 relative z-20 pb-12 sm:pb-16 md:pb-24"
          aria-label="Pricing plans"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(Object.values(PRICING_PACKS) as PackValue[]).map((pack, idx) => {
              const isPopular = pack.id === "advanced";
              const price =
                billingCycle === "annual" && pack.price > 0
                  ? Math.round(pack.price * 0.8)
                  : pack.price;
              const annualPrice =
                pack.price > 0 ? Math.round(pack.price * 0.8 * 12) : 0;

              return (
                <motion.article
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  itemScope
                  itemType="https://schema.org/Product"
                  className={`relative flex flex-col bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    isPopular
                      ? "ring-2 sm:ring-4 ring-blue-500/30 md:scale-105 z-10 border-blue-500"
                      : "hover:border-blue-300"
                  }`}
                  role="article"
                  aria-labelledby={`pack-${pack.id}-title`}
                >
                  {/* Badge */}
                  {(isPopular || (pack as any).badge) && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap z-20">
                      <Crown
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                        aria-hidden="true"
                      />
                      {(pack as any).badge || "MOST POPULAR"}
                    </div>
                  )}

                  {/* Pack Header */}
                  <div className="mb-4 sm:mb-6">
                    <h2
                      id={`pack-${pack.id}-title`}
                      className="text-lg sm:text-xl font-bold text-gray-900 mb-2 transition-colors"
                      itemProp="name"
                    >
                      {pack.name}
                    </h2>
                    <div
                      className="flex flex-wrap items-baseline gap-1"
                      itemScope
                      itemType="https://schema.org/Offer"
                    >
                      <span
                        className="text-3xl sm:text-4xl font-extrabold text-gray-900 transition-colors"
                        itemProp="price"
                      >
                        {pack.price === 0 ? "Free" : `CHF ${price}`}
                      </span>
                      <meta itemProp="priceCurrency" content="CHF" />
                      {pack.price > 0 && (
                        <>
                          <span
                            className="text-sm sm:text-base text-black font-medium transition-colors opacity-70"
                            aria-label="per month"
                          >
                            /month
                          </span>
                          {billingCycle === "annual" && (
                            <div
                              className="w-full text-[10px] sm:text-xs text-green-600 font-bold mt-1 transition-colors"
                              aria-label={`Billed annually: CHF ${annualPrice} per year`}
                            >
                              Billed CHF {annualPrice} yearly
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {(pack as any).shortDescription && (
                      <p
                        className="text-xs sm:text-sm text-black mt-2 sm:mt-3 font-medium opacity-90 leading-relaxed"
                        itemProp="description"
                      >
                        {(pack as any).shortDescription}
                      </p>
                    )}
                    {pack.recommendedFor && (
                      <p className="text-[10px] sm:text-xs text-blue-600 mt-2 font-semibold flex items-center gap-1 flex-wrap">
                        <TrendingUp
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0"
                          aria-hidden="true"
                        />
                        <span>Best for: {pack.recommendedFor}</span>
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="flex-1 space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        What's Included
                      </h3>
                      <span className="text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        {pack.features.length} Features
                      </span>
                    </div>
                    <ul
                      className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar"
                      role="list"
                    >
                      {pack.features.map((feature, fidx) => (
                        <li
                          key={fidx}
                          className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-black group transition-all hover:bg-blue-50 rounded-lg p-1.5 sm:p-2 -m-1.5 sm:-m-2"
                          onMouseEnter={() => setHoveredFeature(feature)}
                          onMouseLeave={() => setHoveredFeature(null)}
                        >
                          <CheckCircle
                            className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 ${isPopular ? "text-blue-600" : "text-green-500 group-hover:text-blue-600"} transition-colors`}
                            aria-hidden="true"
                            strokeWidth={2.5}
                          />
                          <span className="group-hover:text-black text-black transition-colors leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() =>
                      pack.price === 0
                        ? (window.location.href = "/auth/register")
                        : handleCheckout(pack.id)
                    }
                    className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg touch-manipulation min-h-[44px] ${
                      isPopular
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200 hover:border-blue-300 transition-colors active:bg-gray-200"
                    }`}
                    aria-label={`${pack.price === 0 ? "Start with" : "Get"} ${pack.name} plan`}
                  >
                    {pack.price === 0 ? "Start Free" : "Start 7-Day Free Trial"}
                  </button>
                </motion.article>
              );
            })}
          </div>

          {/* Value Proposition Section */}
          <section
            className="mt-16 sm:mt-24 md:mt-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12"
            aria-label="Value proposition"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
                Save{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  CHF 5,000-15,000
                </span>{" "}
                vs Traditional Consultants
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-black mb-6 sm:mb-8 leading-relaxed px-2">
                Get expert-level guidance, comprehensive resources, and
                AI-powered tools at a fraction of the cost. Traditional
                immigration consultants charge CHF 150-300/hour. Our platform
                gives you everything you need for less than the cost of a single
                consultation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                    {SITE_STATS.successRate}
                  </div>
                  <div className="text-sm sm:text-base text-black font-semibold">
                    Average Success Rate
                  </div>
                  <div className="text-xs sm:text-sm text-black opacity-70 mt-2">
                    Across all permit types
                  </div>
                </div>
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                    {SITE_STATS.contentWords}
                  </div>
                  <div className="text-sm sm:text-base text-black font-semibold">
                    Words of Content
                  </div>
                  <div className="text-xs sm:text-sm text-black opacity-70 mt-2">
                    Comprehensive guides & modules
                  </div>
                </div>
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                    {SITE_STATS.cvTemplates}
                  </div>
                  <div className="text-sm sm:text-base text-black font-semibold">
                    CV Templates
                  </div>
                  <div className="text-xs sm:text-sm text-black opacity-70 mt-2">
                    ATS-optimized for Swiss market
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section
            className="mt-12 sm:mt-16 md:mt-24"
            aria-label="Feature comparison"
          >
            <div className="text-center mb-8 sm:mb-12 px-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors">
                Compare Plans Side-by-Side
              </h2>
              <p className="text-sm sm:text-base text-black max-w-2xl mx-auto transition-colors opacity-80">
                See exactly what's included in each plan to choose the perfect
                fit for your Swiss immigration journey.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="text-xs text-gray-500 mb-2 sm:hidden text-center">
                  ← Scroll to see all plans →
                </div>
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm sticky left-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-10">
                        Features
                      </th>
                      {(Object.values(PRICING_PACKS) as PackValue[]).map(
                        (pack) => (
                          <th
                            key={pack.id}
                            className={`px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold text-xs sm:text-sm ${pack.id === "advanced" ? "bg-white/20" : ""}`}
                          >
                            <div className="font-bold text-sm sm:text-lg">
                              {pack.name}
                            </div>
                            <div className="text-xs sm:text-sm font-normal opacity-90 mt-1">
                              {pack.price === 0
                                ? "Free"
                                : `CHF ${pack.price}/mo`}
                            </div>
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        feature: "AI Chatbot Messages",
                        values: [
                          "10/day",
                          "Unlimited",
                          "Unlimited",
                          "Unlimited",
                        ],
                      },
                      {
                        feature: "Guide Modules",
                        values: [
                          "2 modules",
                          "5 modules",
                          "10 modules",
                          "10 modules + extras",
                        ],
                      },
                      {
                        feature: "CV Templates",
                        values: [
                          "Basic samples",
                          "25+ templates",
                          "25+ templates",
                          "25+ templates",
                        ],
                      },
                      {
                        feature: "Cantonal Strategies",
                        values: [
                          "Overview",
                          "Complete guides",
                          "Deep dive + optimization",
                          "Complete + coaching",
                        ],
                      },
                      {
                        feature: "Email Support",
                        values: [
                          "Community only",
                          "48h response",
                          "24h response",
                          "24h priority",
                        ],
                      },
                      {
                        feature: "Progress Tracking",
                        values: [
                          "Basic",
                          "Dashboard",
                          "Advanced dashboard",
                          "Advanced + reviews",
                        ],
                      },
                      {
                        feature: "Language Test Prep",
                        values: [
                          "Basic info",
                          "Guides",
                          "Complete toolkit",
                          "Complete + practice tests",
                        ],
                      },
                      {
                        feature: "Citizenship Roadmap",
                        values: [
                          "Overview",
                          "Basic guide",
                          "Comprehensive",
                          "Complete + coaching",
                        ],
                      },
                      {
                        feature: "Document Review",
                        values: [
                          "Self-service",
                          "Templates",
                          "AI assistance",
                          "Expert review (3 docs)",
                        ],
                      },
                      {
                        feature: "Content Updates",
                        values: [
                          "Limited",
                          "All updates",
                          "All updates",
                          "Lifetime access",
                        ],
                      },
                    ].map((row, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 text-xs sm:text-sm sticky left-0 bg-inherit z-10 whitespace-nowrap">
                          {row.feature}
                        </td>
                        {Object.values(PRICING_PACKS).map((pack, pidx) => {
                          const value = row.values[pidx];
                          const isCheckmark =
                            value.includes("Unlimited") ||
                            value.includes("Complete") ||
                            value.includes("Advanced") ||
                            value.includes("All updates") ||
                            value.includes("Lifetime");
                          const isEmpty =
                            value === "Community only" ||
                            value === "Basic" ||
                            value === "Basic info" ||
                            value === "Overview" ||
                            value === "Self-service" ||
                            value === "Limited";

                          return (
                            <td
                              key={pack.id}
                              className="px-3 sm:px-6 py-3 sm:py-4 text-center"
                            >
                              <div className="flex items-center justify-center">
                                {isCheckmark ? (
                                  <CheckCircle
                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${pidx === 1 ? "text-green-600" : pidx === 2 ? "text-blue-600" : "text-purple-600"}`}
                                  />
                                ) : isEmpty && pidx === 0 ? (
                                  <span className="text-gray-400 text-xs sm:text-sm">
                                    —
                                  </span>
                                ) : (
                                  <span className="text-xs sm:text-sm text-black whitespace-nowrap">
                                    {value}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Feature Deep Dive Grid */}
          <section
            className="mt-12 sm:mt-16 md:mt-32"
            aria-label="Platform features"
          >
            <div className="text-center mb-8 sm:mb-12 md:mb-16 px-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors">
                Everything You Need to Succeed in Switzerland
              </h2>
              <p className="text-sm sm:text-base text-black max-w-2xl mx-auto transition-colors opacity-80">
                We've built the most comprehensive Swiss immigration platform
                with AI-powered tools, expert guidance, and step-by-step
                roadmaps for every stage of your journey.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: "AI Immigration Assistant",
                  desc: "Get instant, accurate answers to your Swiss immigration questions 24/7. Our AI assistant provides personalized guidance based on your nationality, visa type, and specific situation.",
                  color: "bg-purple-100 text-purple-600",
                  keywords:
                    "swiss immigration chatbot, ai immigration assistant, swiss visa questions",
                },
                {
                  icon: BookOpen,
                  title: "Interactive Learning Modules",
                  desc: "Comprehensive step-by-step guides that adapt to your nationality and immigration goals. Master Swiss work permits, residence permits, and citizenship requirements through interactive content.",
                  color: "bg-blue-100 text-blue-600",
                  keywords:
                    "swiss immigration course, immigration modules, swiss visa guides",
                },
                {
                  icon: LayoutDashboard,
                  title: "Application Dashboard",
                  desc: "Track your documents, deadlines, and application progress in one secure, organized place. Never miss an important date or document again.",
                  color: "bg-emerald-100 text-emerald-600",
                  keywords:
                    "immigration tracker, visa application dashboard, swiss visa tracking",
                },
                {
                  icon: Users,
                  title: "Expert Community Access",
                  desc: "Connect with other professionals navigating Swiss immigration. Share experiences, get advice, and learn from those who have successfully completed the process.",
                  color: "bg-amber-100 text-amber-600",
                  keywords:
                    "swiss immigration community, expat community switzerland",
                },
                {
                  icon: FileText,
                  title: "ATS-Optimized Templates",
                  desc: "Professional CVs and motivation letters specifically designed for the Swiss job market. Our templates are optimized for Applicant Tracking Systems used by Swiss employers.",
                  color: "bg-rose-100 text-rose-600",
                  keywords:
                    "swiss cv templates, ats optimized cv, swiss job application templates",
                },
                {
                  icon: Shield,
                  title: "Expert Document Review",
                  desc: "Get your critical immigration documents reviewed by experienced professionals. Ensure your applications are complete, accurate, and optimized for success.",
                  color: "bg-indigo-100 text-indigo-600",
                  keywords:
                    "immigration document review, visa application review, swiss visa help",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                  itemScope
                  itemType="https://schema.org/Service"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${feature.color} flex items-center justify-center mb-4 sm:mb-6`}
                    aria-hidden="true"
                  >
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 transition-colors"
                    itemProp="name"
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm sm:text-base text-black leading-relaxed transition-colors opacity-80"
                    itemProp="description"
                  >
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* FAQ Section with Schema Markup */}
          <section
            className="mt-12 sm:mt-16 md:mt-32 max-w-3xl mx-auto px-4 sm:px-6"
            aria-label="Frequently asked questions"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-12 text-center transition-colors">
              Frequently Asked Questions
            </h2>
            <div
              className="space-y-3 sm:space-y-4"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              {FAQ_ITEMS.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  <h3
                    className="font-bold text-gray-900 mb-2 text-base sm:text-lg transition-colors"
                    itemProp="name"
                  >
                    {item.q}
                  </h3>
                  <div itemScope itemType="https://schema.org/Answer">
                    <p
                      className="text-sm sm:text-base text-black transition-colors opacity-80 leading-relaxed"
                      itemProp="text"
                    >
                      {item.a}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* One-Time Premium Add-Ons */}
          <section
            className="mt-12 sm:mt-16 md:mt-24"
            aria-label="Premium add-ons"
          >
            <div className="text-center mb-8 sm:mb-12 px-2">
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-amber-200">
                <Award className="w-3.5 h-3.5" />
                Premium Add-Ons — One-Time Purchase
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Need More? Go Premium
              </h2>
              <p className="text-sm sm:text-base text-black max-w-2xl mx-auto opacity-80">
                Standalone products to complement any subscription plan. Pay once, keep forever.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  id: ONE_TIME_PRODUCTS.citizenship_roadmap.id,
                  name: ONE_TIME_PRODUCTS.citizenship_roadmap.name,
                  price: 'CHF 97',
                  type: 'PDF Guide',
                  description: ONE_TIME_PRODUCTS.citizenship_roadmap.description,
                  features: ONE_TIME_PRODUCTS.citizenship_roadmap.features,
                  icon: BookOpen,
                  color: 'bg-blue-50 text-blue-600',
                  badge: null,
                },
                {
                  id: ONE_TIME_PRODUCTS.masterclass.id,
                  name: ONE_TIME_PRODUCTS.masterclass.name,
                  price: 'CHF 497',
                  type: 'Video Course',
                  description: ONE_TIME_PRODUCTS.masterclass.description,
                  features: ONE_TIME_PRODUCTS.masterclass.features,
                  icon: TrendingUp,
                  color: 'bg-purple-50 text-purple-600',
                  badge: 'Best Value',
                },
                {
                  id: ONE_TIME_PRODUCTS.application_support.id,
                  name: ONE_TIME_PRODUCTS.application_support.name,
                  price: 'CHF 1,500',
                  type: 'Expert Service',
                  description: ONE_TIME_PRODUCTS.application_support.description,
                  features: ONE_TIME_PRODUCTS.application_support.features,
                  icon: Shield,
                  color: 'bg-green-50 text-green-600',
                  badge: 'Highest Success Rate',
                },
              ].map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-lg hover:shadow-xl transition-all relative"
                >
                  {product.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow whitespace-nowrap">
                      {product.badge}
                    </div>
                  )}
                  <div className={`w-11 h-11 ${product.color} rounded-xl flex items-center justify-center mb-4`}>
                    <product.icon className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{product.type}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                  <div className="text-2xl font-extrabold text-gray-900 mb-3">
                    {product.price} <span className="text-sm font-normal text-gray-400">one-time</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleProductCheckout(product.id)}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-gray-900 hover:bg-gray-800 text-white transition-all shadow active:scale-[0.98] touch-manipulation"
                    aria-label={`Purchase ${product.name}`}
                  >
                    Buy Now — {product.price}
                  </button>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Trust Strip */}
          <aside
            className="mt-12 sm:mt-16 md:mt-24 py-8 sm:py-12 border-t border-gray-200 px-4"
            aria-label="Trusted organizations"
          >
            <p className="text-center text-gray-400 font-semibold uppercase tracking-widest text-xs sm:text-sm mb-6 sm:mb-8">
              Trusted by professionals from leading organizations
            </p>
            <div
              className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12"
              role="list"
            >
              {["Google", "Novartis", "Roche", "UBS", "CERN"].map((logo) => (
                <span
                  key={logo}
                  className="text-lg sm:text-xl md:text-2xl font-bold text-gray-300 hover:text-gray-500 transition-colors"
                  role="listitem"
                >
                  {logo}
                </span>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
