'use client'

import { ArrowRight, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'
import { SITE_STATS } from '@/lib/pricing'

function openQuiz() {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

const SOCIAL_PROOF_STATS = [
  { value: SITE_STATS.totalUsers, label: 'Active Users' },
  { value: SITE_STATS.successRate, label: 'Success Rate' },
  { value: '31', label: 'Expert Modules' },
  { value: '4', label: 'Languages' },
]

export default function CTASection() {
  const { t } = useT()

  return (
    <section className="sip-section">
      <div className="sip-container">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
        {/* Dot pattern texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left: copy + buttons */}
          <div>
            <p className="text-blue-200 text-sm font-medium mb-4">
              Trusted by {SITE_STATS.totalUsers} applicants worldwide
            </p>

            <h2 className="text-fluid-3xl font-bold text-white mb-4 leading-tight">
              {t('home.startJourney')}
            </h2>

            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              {t('home.startJourneyDesc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
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

          {/* Right: 2×2 social proof stats */}
          <div className="grid grid-cols-2 gap-3">
            {SOCIAL_PROOF_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center"
              >
                <div className="text-fluid-2xl font-black text-white mb-1 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
