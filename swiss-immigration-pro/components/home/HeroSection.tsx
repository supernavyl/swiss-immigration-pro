'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
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
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
      />

      <div
        className={cn(
          'relative z-10 sip-container pt-24 pb-16 lg:pt-32 lg:pb-24 transition-all duration-700 ease-out',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        )}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300 tracking-wide">
                AI trained on Swiss immigration law
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-fluid-hero font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-white mb-6">
              Your Swiss permit,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
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
                className="group inline-flex items-center justify-center gap-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold px-8 py-3.5 rounded-xl transition-all hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-900/10"
              >
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
              No credit card required · Cancel anytime
            </p>

            {/* Stats strip */}
            <div className="mt-10 grid grid-cols-4 gap-px bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-slate-950 px-4 py-5 text-center"
                >
                  <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="/images/family/swiss-family-outdoor.jpeg"
                alt="Family successfully relocated to Switzerland"
                fill
                className="object-cover"
                sizes="50vw"
                priority
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-6 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-lg">🇨🇭</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">All 26 Swiss Cantons</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Quota data · Processing times</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
