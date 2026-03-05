'use client'

import { ArrowRight, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'

function openQuiz() {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

export default function CTASection() {
  const { t } = useT()

  return (
    <section className="sip-section">
      <div className="sip-container">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-10 sm:p-14 relative overflow-hidden text-center">
          {/* Subtle texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10">
            <h2 className="text-fluid-3xl font-bold text-white mb-4 leading-tight">
              {t('home.startJourney')}
            </h2>

            <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              {t('home.startJourneyDesc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openQuiz}
                aria-label="Start your free Swiss immigration assessment"
                className="group bg-white text-blue-700 px-8 py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-900/20 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Rocket className="w-4 h-4" />
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Link
                href="/pricing"
                aria-label="View Swiss Immigration Pro pricing plans"
                className="group text-white px-8 py-3.5 rounded-xl font-semibold transition-all border border-white/25 hover:bg-white/10 inline-flex items-center justify-center gap-2 min-h-[44px]"
              >
                {t('hero.ctaSecondary')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
