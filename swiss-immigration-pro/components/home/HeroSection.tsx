'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/lib/i18n/useTranslation'
import { cn } from '@/lib/utils/cn'

function openQuiz(): void {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

const STATS = [
  { value: '31', label: 'Modules' },
  { value: '26', label: 'Cantons' },
  { value: '15', label: 'CV Templates' },
  { value: '4', label: 'Languages' },
]

export default function HeroSection(): React.ReactElement {
  const { t } = useT()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 min-h-[92vh] flex items-center">

      {/* ── Background layer ── */}

      {/* Aurora gradient at the top */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[70%] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,0.14) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)',
          animation: 'aurora-flow 12s ease-in-out infinite',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Blob 1 — large blue, top-right */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '-12%',
          right: '-8%',
          width: '680px',
          height: '680px',
          borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
          background:
            'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(99,102,241,0.10) 50%, transparent 70%)',
          filter: 'blur(72px)',
          animation: 'blob-1 22s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Blob 2 — purple, bottom-left */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          bottom: '-18%',
          left: '-10%',
          width: '580px',
          height: '580px',
          borderRadius: '45% 55% 40% 60% / 55% 45% 60% 40%',
          background:
            'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'blob-2 28s ease-in-out infinite',
          animationDelay: '-8s',
          willChange: 'transform',
        }}
      />

      {/* Blob 3 — indigo, center */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '35%',
          left: '25%',
          width: '440px',
          height: '440px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99,102,241,0.10) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'blob-3 18s ease-in-out infinite',
          animationDelay: '-4s',
          willChange: 'transform',
        }}
      />

      {/* Blob 4 — cyan accent, top-left */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '10%',
          left: '-5%',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(6,182,212,0.09) 0%, rgba(37,99,235,0.06) 50%, transparent 70%)',
          filter: 'blur(64px)',
          animation: 'blob-4 24s ease-in-out infinite',
          animationDelay: '-12s',
          willChange: 'transform',
        }}
      />

      {/* Fine dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.055]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #64748b 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Diagonal mesh lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(45deg, rgba(148,163,184,1) 0.5px, transparent 0.5px), linear-gradient(-45deg, rgba(148,163,184,1) 0.5px, transparent 0.5px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* ── Content layer ── */}
      <div
        className={cn(
          'relative z-10 w-full sip-container pt-28 pb-20 lg:pt-36 lg:pb-28 transition-all duration-700 ease-out',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(239,246,255,0.9) 0%, rgba(238,242,255,0.9) 100%)',
                borderColor: 'rgba(99,102,241,0.25)',
              }}
            >
              {/* shimmer on badge */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'nav-shimmer 3s linear infinite',
                }}
              />
              <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400 relative z-10" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 tracking-wide relative z-10">
                AI trained on Swiss immigration law
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-fluid-hero font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-white mb-6">
              Your Swiss permit,{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 40%, #7c3aed 80%, #c026d3 100%)',
                  backgroundSize: '200% auto',
                  animation: 'nav-shimmer 5s linear infinite',
                }}
              >
                planned by AI.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
              {t('hero.subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={openQuiz}
                className="group inline-flex items-center justify-center gap-2.5 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    'linear-gradient(135deg, #1d4ed8 0%, #2563eb 40%, #4f46e5 100%)',
                  boxShadow: '0 0 28px rgba(37,99,235,0.40), 0 4px 16px rgba(37,99,235,0.20)',
                }}
              >
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-medium px-8 py-3.5 rounded-xl transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:scale-[1.01]"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>

            <p className="text-slate-400 dark:text-slate-500 text-sm">
              No credit card required · Cancel anytime
            </p>

            {/* Stats strip */}
            <div className="mt-10 relative">
              {/* Glow behind stats */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(99,102,241,0.05) 100%)',
                  filter: 'blur(20px)',
                }}
              />
              <div className="relative grid grid-cols-4 gap-px bg-slate-100 dark:bg-slate-800/70 rounded-2xl overflow-hidden ring-1 ring-slate-200/60 dark:ring-slate-700/40">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white dark:bg-slate-950 px-4 py-5 text-center hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
                  >
                    <div
                      className="text-xl font-bold tabular-nums bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          'linear-gradient(135deg, #1e40af 0%, #4f46e5 100%)',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — image */}
          <div className="relative hidden lg:block">
            {/* Glow ring behind image */}
            <div
              className="absolute -inset-6 rounded-3xl pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(37,99,235,0.12) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)',
                filter: 'blur(24px)',
                animation: 'glow-pulse 6s ease-in-out infinite',
              }}
            />

            {/* Image card */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] ring-1 ring-slate-200/40 dark:ring-slate-700/30">
              <Image
                src="/images/family/swiss-family-outdoor.jpeg"
                alt="Family successfully relocated to Switzerland"
                fill
                className="object-cover"
                sizes="50vw"
                priority
              />
              {/* Gradient overlay at bottom of image */}
              <div
                className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 100%)',
                }}
              />
            </div>

            {/* Floating badge — all 26 cantons */}
            <div
              className="absolute -bottom-4 -left-6 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center gap-3"
              style={{ animation: 'float 4s ease-in-out infinite' }}
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-lg">🇨🇭</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  All 26 Swiss Cantons
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Quota data · Processing times
                </p>
              </div>
            </div>

            {/* Floating badge — AI active */}
            <div
              className="absolute -top-4 -right-4 rounded-xl shadow-xl px-4 py-3 flex items-center gap-2.5 text-white"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                animation: 'float 5s ease-in-out infinite',
                animationDelay: '1.5s',
              }}
            >
              <div
                className="w-2 h-2 rounded-full bg-white"
                style={{ animation: 'glow-pulse 2s ease-in-out infinite' }}
              />
              <span className="text-xs font-semibold">AI Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
