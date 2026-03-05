'use client'

import { useT } from '@/lib/i18n/useTranslation'

const STATS = [
  {
    value: '31',
    label: 'Immigration modules',
    subtext: 'Covering L, B, C, G permits and citizenship',
    accentBar: 'bg-blue-500',
    accentText: 'text-blue-600 dark:text-blue-400',
  },
  {
    value: '15',
    label: 'CV templates',
    subtext: 'Swiss-format, canton-ready, instant download',
    accentBar: 'bg-emerald-500',
    accentText: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    value: '26',
    label: 'Cantons covered',
    subtext: 'Processing times and quota data for each',
    accentBar: 'bg-violet-500',
    accentText: 'text-violet-600 dark:text-violet-400',
  },
]

export default function AdvantagesSection() {
  const { t } = useT()

  return (
    <section className="sip-section bg-white dark:bg-slate-950">
      <div className="sip-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
            Platform Overview
          </p>
          <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-3">
            {t('home.whyChoose')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('home.whyChooseDesc')}
          </p>
        </div>

        {/* Stat strip — verifiable product facts only */}
        <div className="grid md:grid-cols-3 gap-px bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-950 px-8 py-8 text-center"
            >
              <div className={`text-5xl font-black mb-1 tabular-nums ${stat.accentText}`}>
                {stat.value}
              </div>
              <div className={`w-10 h-1 rounded-full mx-auto mb-3 ${stat.accentBar}`} />
              <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                {stat.label}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[180px] mx-auto">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
