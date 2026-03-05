'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Rocket } from 'lucide-react'
import Link from 'next/link'
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

export default function HeroSection() {
  const { t } = useT()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Gradient orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
      />

      <div
        className={cn(
          'relative z-10 sip-container pt-32 pb-20 lg:pt-40 lg:pb-28 transition-all duration-700 ease-out',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        )}
      >
        <div className="max-w-3xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300 tracking-wide">
              Swiss Immigration Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-fluid-hero font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-white mb-6">
            Navigate Swiss immigration{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              with confidence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              onClick={openQuiz}
              className="group inline-flex items-center justify-center gap-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold px-8 py-3.5 rounded-xl transition-all hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-900/10 dark:hover:shadow-white/10"
            >
              <Rocket className="w-4 h-4" />
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-medium px-8 py-3.5 rounded-xl transition-all border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>

          <p className="text-slate-400 dark:text-slate-500 text-sm">
            No credit card required · 30-day money-back guarantee
          </p>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden max-w-2xl mx-auto">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-950 px-6 py-6 text-center"
            >
              <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
