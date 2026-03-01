'use client'

import { ArrowRight, CheckCircle, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'
import { SITE_STATS } from '@/lib/pricing'

function openQuiz() {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

export default function CTASection() {
  const { t } = useT()

  return (
    <section className="py-16 sm:py-20 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium mb-4">
            Trusted by {SITE_STATS.totalUsers} applicants worldwide
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {t('home.startJourney')}
          </h2>

          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('home.startJourneyDesc')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-white/80 text-sm">
            {[
              'Free Assessment',
              'No Credit Card Required',
              `${SITE_STATS.successRate} Success Rate`,
              '24/7 AI Support',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={openQuiz}
              aria-label="Start your free Swiss immigration assessment"
              className="group bg-white text-blue-700 px-8 py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-900/20 flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              href="/pricing"
              aria-label="View Swiss Immigration Pro pricing plans"
              className="group text-white px-8 py-3.5 rounded-xl font-semibold transition-all border border-white/25 hover:bg-white/10 inline-flex items-center gap-2"
            >
              {t('hero.ctaSecondary')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
