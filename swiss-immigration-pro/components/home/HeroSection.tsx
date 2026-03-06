'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'

function openQuiz(): void {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

const STATS = [
  { value: '31+', label: 'Modules' },
  { value: '26', label: 'Cantons' },
  { value: '15', label: 'CV Templates' },
  { value: '24/7', label: 'AI Access' },
]

const LOGOS = [
  'Permit B', 'Permit L', 'Permit C', 'Permit G',
  'Citizenship', 'Family Reunion', 'Work Visa', 'EU/EFTA',
]

export default function HeroSection(): React.ReactElement {
  const { t } = useT()

  return (
    <section className="relative min-h-[100vh] flex items-center bg-[#06060a] overflow-hidden">
      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Top gradient accent — very subtle */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-slate-400 tracking-wide">
              AI trained on Swiss immigration law
            </span>
          </div>
        </div>

        {/* Headline — centered */}
        <h1 className="text-center text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-white mb-6">
          Your Swiss permit,
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            planned by AI.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-center text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={openQuiz}
            className="group inline-flex items-center justify-center gap-2.5 text-white font-semibold px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            {t('hero.cta')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 text-slate-300 font-medium px-8 py-3.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all"
          >
            {t('hero.ctaSecondary')}
          </Link>
        </div>

        <p className="text-center text-slate-600 text-sm mb-16">
          No credit card required · Cancel anytime
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden max-w-2xl mx-auto mb-20">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-[#06060a] px-6 py-5 text-center">
              <div className="text-2xl font-bold text-white tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scrolling logo strip — trust signal */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#06060a] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#06060a] to-transparent z-10" />
          <div className="flex gap-8 animate-[marquee_20s_linear_infinite]">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-5 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs font-medium text-slate-500 whitespace-nowrap"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
