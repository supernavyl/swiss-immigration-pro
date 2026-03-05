'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'

function openQuiz(): void {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

export default function CTASection() {
  const { t } = useT()

  return (
    <section className="sip-section bg-white dark:bg-slate-950">
      <div className="sip-container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-fluid-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {t('home.startJourney')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed">
            {t('home.startJourneyDesc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={openQuiz}
              className="group inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-xl font-semibold transition-all hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow-lg"
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 px-8 py-3.5 rounded-xl font-medium transition-all border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
