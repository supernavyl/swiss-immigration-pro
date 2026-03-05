"use client";

import { useState, use, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  CreditCard,
  Video,
  FileText,
  Users,
  Shield,
  Clock,
  Star,
  Award,
  TrendingUp,
  ArrowRight,
  Play,
  BookOpen,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ONE_TIME_PRODUCTS, SITE_STATS } from "@/lib/pricing";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import { analytics } from "@/lib/analytics";

interface ProductTestimonial {
  name: string;
  role: string;
  origin: string;
  quote: string;
  result: string;
}

const TESTIMONIALS: Record<string, ProductTestimonial[]> = {
  masterclass: [
    {
      name: "Michael R.",
      role: "Pharma Researcher",
      origin: "USA",
      quote:
        "The masterclass covered everything I needed. Got my B permit in 6 weeks after completing it.",
      result: "B Permit approved",
    },
    {
      name: "Priya P.",
      role: "Finance Professional",
      origin: "India",
      quote:
        "Worth every franc. The cantonal strategy section alone saved me 4 weeks of processing time.",
      result: "CHF 145K offer accepted",
    },
    {
      name: "Sofia M.",
      role: "Marketing Director",
      origin: "Spain",
      quote:
        "I watched the whole course in a weekend. The document templates saved me from hiring a CHF 300/hr consultant.",
      result: "Full family relocation",
    },
  ],
  citizenship_roadmap: [
    {
      name: "Ahmed H.",
      role: "Tech Professional",
      origin: "Jordan",
      quote:
        "The 10-year timeline helped me plan every step. I'm on track for naturalization 2 years early.",
      result: "C Permit → Citizenship track",
    },
    {
      name: "Marie D.",
      role: "Banking Executive",
      origin: "France",
      quote:
        "The cantonal variations guide was eye-opening. Vaud vs Zürich requirements are completely different.",
      result: "Citizenship application filed",
    },
  ],
  application_support: [
    {
      name: "Sarah C.",
      role: "Software Engineer",
      origin: "Singapore",
      quote:
        "The strategy call identified 3 issues with my application that would have caused rejection. Money well spent.",
      result: "B Permit in 5 weeks",
    },
    {
      name: "Chen W.",
      role: "Startup Founder",
      origin: "China",
      quote:
        "The expert review caught a critical missing document. Without it, my application would have been returned.",
      result: "Self-employment permit approved",
    },
  ],
};

const CURRICULUM: Record<string, { title: string; duration: string }[]> = {
  masterclass: [
    { title: "Swiss Immigration System Overview", duration: "45 min" },
    { title: "Work Permits: L, B, C & Cross-Border", duration: "1h 15min" },
    { title: "The Application Process Step-by-Step", duration: "1h" },
    { title: "Cantonal Strategies & Quota Optimization", duration: "50 min" },
    { title: "Swiss CV & Cover Letter Masterclass", duration: "1h 10min" },
    { title: "Salary Negotiation in Switzerland", duration: "40 min" },
    { title: "Family Reunification & Spouse Permits", duration: "55 min" },
    { title: "Path to Citizenship: The 10-Year Plan", duration: "1h 5min" },
  ],
};

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams?.id;
  const product = productId
    ? ONE_TIME_PRODUCTS[productId as keyof typeof ONE_TIME_PRODUCTS]
    : null;

  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) analytics.pricingViewed();
  }, [productId]);

  const handlePurchase = async () => {
    if (!productId) return;
    setLoading(true);
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
        setLoading(false);
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
          : "Something went wrong. Please try again.";
      showToast(message, "error");
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-slate-600 dark:text-gray-400 mb-8">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/pricing" className="text-blue-600 hover:underline">
            View All Products &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const priceCHF = product.price / 100;
  const iconMap = { course: Video, pdf: FileText, service: Users };
  const Icon = iconMap[product.type] || FileText;
  const testimonials = TESTIMONIALS[productId ?? ""] ?? [];
  const curriculum = CURRICULUM[productId ?? ""];

  const consultantCost =
    product.type === "course"
      ? 4500
      : product.type === "service"
        ? 3000
        : 1500;
  const savingsPercent = Math.round(
    ((consultantCost - priceCHF) / consultantCost) * 100,
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24 sm:pb-0">
      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{product.name}</p>
            <p className="font-bold text-gray-900 dark:text-white">CHF {priceCHF} <span className="text-xs font-normal text-gray-400 line-through">CHF {consultantCost.toLocaleString()}</span></p>
          </div>
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Buy Now
              </>
            )}
          </button>
        </div>
      </div>
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2.5 px-4 text-sm font-semibold">
        <Zap className="w-4 h-4 inline mr-1.5 -mt-0.5" />
        Limited offer: Save {savingsPercent}% vs traditional consultants (CHF{" "}
        {consultantCost.toLocaleString()} → CHF {priceCHF})
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
        <div className="sip-container sip-section relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                  {product.type === "course"
                    ? "Online Course"
                    : product.type === "pdf"
                      ? "Digital Download"
                      : "Service Package"}
                </span>
                {product.type === "course" && (
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                    Best Value
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
                {product.name}
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Social Proof Strip */}
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="ml-1">4.9/5</span>
                </div>
                <span className="text-slate-600">|</span>
                <span>{SITE_STATS.modules} expert modules</span>
                <span className="text-slate-600">|</span>
                <span>{SITE_STATS.cantons} cantons covered</span>
              </div>

              {/* Price + CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold">CHF {priceCHF}</span>
                    <span className="text-lg text-slate-400 line-through">
                      CHF {consultantCost.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    One-time payment ·{" "}
                    {product.type === "service"
                      ? "Full package"
                      : "Lifetime access"}
                  </p>
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className="group bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2.5 text-lg shadow-lg shadow-white/10"
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Get Instant Access
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Right: Preview / Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {product.type === "course" ? (
                <div className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm text-white/70">
                    <span>8 hours of content</span>
                    <span>Preview available</span>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 shadow-2xl">
                  <Icon className="w-16 h-16 text-white/80 mb-6" />
                  <div className="space-y-3">
                    {product.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/90">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-slate-50 dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 py-6">
        <div className="sip-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                icon: Shield,
                label: "30-Day Guarantee",
                desc: "Full refund, no questions",
              },
              {
                icon: Clock,
                label: "Instant Access",
                desc: "Start immediately",
              },
              {
                icon: Award,
                label: SITE_STATS.modules + " Modules",
                desc: "Expert immigration content",
              },
              {
                icon: TrendingUp,
                label: SITE_STATS.cantons + " Cantons",
                desc: "Full Swiss coverage",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <item.icon className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-gray-400">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="sip-container sip-section">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4">
          Everything You Get
        </h2>
        <p className="text-lg text-slate-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          One purchase, lifetime value. Here&apos;s what&apos;s inside.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {product.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-3 bg-slate-50 dark:bg-gray-900 rounded-xl p-4"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700 dark:text-gray-300">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Curriculum (Masterclass only) */}
      {curriculum && (
        <section className="bg-slate-50 dark:bg-gray-900 sip-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4">
              Course Curriculum
            </h2>
            <p className="text-lg text-slate-600 dark:text-gray-400 text-center mb-12">
              8 comprehensive modules · 8 hours of expert content
            </p>

            <div className="space-y-3">
              {curriculum.map((module, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-5 border border-slate-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {module.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    {module.duration}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comparison: Us vs Consultant */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 sip-section">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">
          Why This Beats Hiring a Consultant
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Traditional */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-6">
              Traditional Consultant
            </h3>
            <ul className="space-y-4 text-slate-700 dark:text-gray-300">
              {[
                `CHF ${consultantCost.toLocaleString()}+ total cost`,
                "Limited to office hours",
                "1-2 consultations max",
                "Generic advice, not personalized",
                "No ongoing support after payment",
                "Weeks to schedule first meeting",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <X className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Us */}
          <div className="bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-400 dark:border-emerald-600 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-6 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              BETTER VALUE
            </div>
            <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-6">
              {product.name}
            </h3>
            <ul className="space-y-4 text-slate-700 dark:text-gray-300">
              {[
                `Just CHF ${priceCHF} — one-time payment`,
                "Available 24/7, learn at your pace",
                product.type === "course"
                  ? "8 hours of expert video content"
                  : product.type === "service"
                    ? "60-min call + 3 follow-ups"
                    : "Complete step-by-step roadmap",
                "Tailored to Swiss immigration specifically",
                "Lifetime access to all updates",
                "Start immediately after purchase",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-slate-50 dark:bg-gray-900 sip-section">
          <div className="sip-container">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">
              What Customers Say
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-gray-300 mb-4 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-gray-700">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {t.role} · {t.origin}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                      {t.result}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 sip-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Backed by {SITE_STATS.modules} expert modules covering all {SITE_STATS.cantons} Swiss cantons. Get instant
            access for CHF {priceCHF}.
          </p>

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="group bg-white hover:bg-blue-50 text-blue-700 font-bold py-4 px-10 rounded-xl transition-all disabled:opacity-50 text-lg inline-flex items-center gap-3 shadow-xl shadow-blue-900/30"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Get Instant Access — CHF {priceCHF}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-blue-200">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              30-day guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Instant access
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Secure Stripe checkout
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 sip-section">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Is this a subscription?",
              a: "No. One-time payment, lifetime access. No recurring charges.",
            },
            {
              q: "What payment methods do you accept?",
              a: "All major cards, TWINT (Swiss), and SEPA Direct Debit via Stripe. Prices in CHF.",
            },
            {
              q: "When will I get access?",
              a:
                product.type === "service"
                  ? "You'll receive a confirmation email within 24 hours with scheduling instructions for your strategy call."
                  : "Instantly after payment. You'll be redirected to your content immediately.",
            },
            {
              q: "What if it's not for me?",
              a: "30-day money-back guarantee, no questions asked. Email us and we'll refund you in full.",
            },
            {
              q: "Can I use this alongside a subscription plan?",
              a: "Absolutely. One-time products complement any subscription plan and give you additional depth on specific topics.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="border-b border-slate-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {faq.q}
              </h3>
              <p className="text-slate-600 dark:text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
