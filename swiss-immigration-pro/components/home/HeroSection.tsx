"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Clock,
  TrendingUp,
  Zap,
  Rocket,
  Mail,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useT } from "@/lib/i18n/useTranslation";
import { SITE_STATS } from "@/lib/pricing";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils/cn";
import { trackEvent } from "@/lib/analytics";

interface StatItem {
  value: string;
  label: string;
}

function openQuiz() {
  const win = window as Window & { openInitialQuiz?: () => void };
  win.openInitialQuiz?.();
}

export default function HeroSection() {
  const { t } = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const [stats, setStats] = useState<StatItem[]>([
    { value: SITE_STATS.successRate, label: t("stats.successRate") },
    { value: SITE_STATS.totalUsers, label: t("stats.successfulApps") },
    { value: SITE_STATS.avgProcessingWeeks, label: t("stats.avgProcessing") },
    { value: "24/7", label: t("stats.aiSupport") },
  ]);
  const [mounted, setMounted] = useState(false);
  const [heroEmail, setHeroEmail] = useState("");
  const [heroEmailSubmitted, setHeroEmailSubmitted] = useState(false);
  const [heroEmailLoading, setHeroEmailLoading] = useState(false);
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [exitEmail, setExitEmail] = useState("");
  const [exitSubmitted, setExitSubmitted] = useState(false);
  const [exitLoading, setExitLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    api
      .get<StatItem[]>("/api/stats")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const labelMap: Record<string, string> = {
            "Successful Applications": t("stats.successfulApps"),
            "Success Rate": t("stats.successRate"),
            "Average Processing": t("stats.avgProcessing"),
            "AI Support": t("stats.aiSupport"),
          };
          setStats(
            data.map((stat) => ({
              value: stat.value,
              label: labelMap[stat.label] || stat.label,
            })),
          );
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to load hero stats:', err)
      });
  }, [t]);

  // Exit-intent: show popup when mouse leaves viewport toward top
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return;
      if (typeof window === "undefined") return;
      if (localStorage.getItem("sip_exit_intent_shown")) return;

      localStorage.setItem("sip_exit_intent_shown", "1");
      setExitIntentOpen(true);
      trackEvent("exit_intent_shown");
    };

    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleExitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitEmail.trim() || exitLoading) return;
    setExitLoading(true);
    try {
      await api.post("/api/email-capture", {
        email: exitEmail,
        source: "exit_intent",
      });
      trackEvent("exit_intent_captured");
    } catch {
      /* silent */
    }
    setExitSubmitted(true);
    setExitLoading(false);
  };

  const handleHeroEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroEmail.trim() || heroEmailLoading) return;
    setHeroEmailLoading(true);
    try {
      await api.post("/api/email-capture", {
        email: heroEmail,
        source: "hero",
      });
    } catch {
      /* silent */
    }
    setHeroEmailSubmitted(true);
    setHeroEmailLoading(false);
  };

  const statIcons = [TrendingUp, Users, Clock, Zap];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[92vh] flex flex-col"
      suppressHydrationWarning
    >
      {/* Background image — no parallax */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/environment/zurich-city.jpg"
          alt="Zurich cityscape"
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-900/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />
      </div>

      {/* Swiss red accent — top edge */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-transparent z-20" />

      {/* Main content — CSS entrance animation */}
      <div
        className={cn(
          "relative z-10 flex-1 flex items-center transition-all duration-700 ease-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
      >
        <div className="sip-container py-28 lg:py-0">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Left column — copy + CTAs */}
            <div className="lg:col-span-3">
              {/* Badge */}
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-red-600 rounded-sm">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="white">
                    <rect x="3" y="6.5" width="10" height="3" rx="0.5" />
                    <rect x="6.5" y="3" width="3" height="10" rx="0.5" />
                  </svg>
                </span>
                <span className="text-sm font-medium tracking-wide text-white/70 uppercase">
                  #1 Swiss Immigration Platform
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white mb-6">
                {t("hero.title")}
              </h1>

              {/* Red accent rule */}
              <div className="w-16 h-[3px] bg-red-500 rounded-full mb-6" />

              {/* Subtitle */}
              <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl mb-10 font-light">
                {t("hero.subtitle", { count: "18,500+" })}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={openQuiz}
                  className="group relative inline-flex items-center justify-center gap-2.5 bg-white text-slate-900 font-semibold px-7 py-3.5 rounded-lg overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Rocket className="relative w-4 h-4 text-red-600" />
                  <span className="relative">{t("hero.cta")}</span>
                  <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1 text-red-600" />
                </button>
                <button
                  onClick={openQuiz}
                  className="inline-flex items-center justify-center gap-2 text-white/90 font-medium px-7 py-3.5 rounded-lg transition-all border border-white/15 hover:border-white/30 hover:bg-white/5"
                >
                  <Zap className="w-4 h-4" />
                  Take 2-min Quiz
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 text-white/90 font-medium px-7 py-3.5 rounded-lg transition-all border border-white/15 hover:border-white/30 hover:bg-white/5"
                >
                  {t("hero.ctaSecondary")}
                </Link>
              </div>

              {/* Email capture */}
              <div className="mb-8">
                {heroEmailSubmitted ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Free guide sent! Check your inbox.
                  </div>
                ) : (
                  <form
                    onSubmit={handleHeroEmail}
                    className="flex flex-col sm:flex-row gap-2 max-w-md"
                  >
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="email"
                        value={heroEmail}
                        onChange={(e) => setHeroEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-white/30 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-white/25 focus:bg-white/[0.08] transition-colors"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={heroEmailLoading}
                      className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap disabled:opacity-60"
                    >
                      Get Free Guide
                    </button>
                  </form>
                )}
                <p className="text-white/30 text-xs mt-2 tracking-wide">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>

            {/* Right column — floating stats card */}
            <div className="lg:col-span-2 hidden lg:block">
              <div
                className={cn(
                  "bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-700 delay-200",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                )}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Live Platform Stats</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, idx) => {
                    const Icon = statIcons[idx] || TrendingUp;
                    return (
                      <div key={idx} className="bg-white/[0.04] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center">
                            <Icon className="w-3.5 h-3.5 text-red-400" />
                          </div>
                        </div>
                        <div className="text-xl font-bold text-white tracking-tight tabular-nums">
                          {stat.value}
                        </div>
                        <div className="text-[11px] text-white/40 mt-0.5 tracking-wide">
                          {stat.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile stats strip */}
          <div className="lg:hidden mt-8 flex flex-wrap gap-y-4">
            {stats.map((stat, idx) => {
              const Icon = statIcons[idx] || TrendingUp;
              return (
                <div key={idx} className="flex items-center">
                  <div className="flex items-center gap-3 px-1 sm:px-3">
                    <div className="hidden sm:flex w-8 h-8 items-center justify-center rounded-md bg-white/[0.06]">
                      <Icon className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white tracking-tight leading-none tabular-nums">
                        {stat.value}
                      </div>
                      <div className="text-[11px] sm:text-xs text-white/40 mt-0.5 tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                  {idx < stats.length - 1 && (
                    <div className="w-px h-8 bg-white/10 mx-2 sm:mx-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />

      {/* Exit-intent popup — kept for lead gen */}
      {exitIntentOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setExitIntentOpen(false)}
          />
          <div className="absolute inset-x-4 top-[15%] mx-auto max-w-md">
            <div className="relative rounded-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/10 overflow-hidden">
              <button
                onClick={() => setExitIntentOpen(false)}
                className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 text-white text-center">
                <h2 className="text-lg font-bold">Wait — before you go!</h2>
                <p className="text-red-100 text-sm mt-1">
                  Get your free Swiss Immigration Checklist
                </p>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                  A step-by-step checklist covering permits, documents, and
                  timelines — used by 18,500+ expats.
                </p>
                {exitSubmitted ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium py-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>Check your inbox!</span>
                  </div>
                ) : (
                  <form onSubmit={handleExitEmail} className="flex flex-col gap-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={exitEmail}
                        onChange={(e) => setExitEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={exitLoading}
                      className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
                    >
                      Send Me the Free Checklist
                    </button>
                  </form>
                )}
                <p className="text-gray-400 text-xs mt-3 text-center">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
