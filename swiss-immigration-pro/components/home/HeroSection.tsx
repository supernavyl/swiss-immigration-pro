"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck, Rocket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useT } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils/cn";

function openQuiz() {
  const win = window as Window & { openInitialQuiz?: () => void };
  win.openInitialQuiz?.();
}

export default function HeroSection() {
  const { t } = useT();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[88vh] flex flex-col">
      {/* Background image */}
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

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-700 via-blue-500 to-transparent z-20" />

      {/* Main content */}
      <div
        className={cn(
          "relative z-10 flex-1 flex items-center transition-all duration-700 ease-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
      >
        <div className="sip-container py-28 lg:py-0">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-700 rounded-sm">
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="white">
                  <rect x="3" y="6.5" width="10" height="3" rx="0.5" />
                  <rect x="6.5" y="3" width="3" height="10" rx="0.5" />
                </svg>
              </span>
              <span className="text-sm font-medium tracking-wide text-white/70 uppercase">
                Swiss Immigration Platform
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white mb-6">
              {t("hero.title")}
            </h1>

            {/* Accent rule */}
            <div className="w-16 h-[3px] bg-blue-500 rounded-full mb-6" />

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl mb-10 font-light">
              {t("hero.subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={openQuiz}
                className="group relative inline-flex items-center justify-center gap-2.5 bg-white text-slate-900 font-semibold px-7 py-3.5 rounded-lg overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Rocket className="relative w-4 h-4 text-blue-600" />
                <span className="relative">{t("hero.cta")}</span>
                <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1 text-blue-600" />
              </button>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 text-white/90 font-medium px-7 py-3.5 rounded-lg transition-all border border-white/15 hover:border-white/30 hover:bg-white/5"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>

            {/* Risk reversal */}
            <p className="flex items-center gap-1.5 text-white/40 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70 shrink-0" />
              30-day money-back guarantee · Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
