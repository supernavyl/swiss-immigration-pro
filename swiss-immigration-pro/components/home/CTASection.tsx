'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'

function openQuiz(): void {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

export default function CTASection(): React.ReactElement {
  const { t } = useT()

  return (
    <section className="py-24 bg-[#06060a] relative overflow-hidden">
      {/* Subtle gradient */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {t('home.startJourney')}
        </h2>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          {t('home.startJourneyDesc')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={openQuiz}
            className="group inline-flex items-center justify-center gap-2 bg-white text-[#06060a] px-8 py-3.5 rounded-xl font-semibold transition-all hover:bg-slate-100"
          >
            {t('hero.cta')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 text-slate-300 px-8 py-3.5 rounded-xl font-medium border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all"
          >
            {t('hero.ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  )
}
