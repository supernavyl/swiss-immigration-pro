'use client'

import { TrendingUp, Clock, Zap } from 'lucide-react'
import { useT } from '@/lib/i18n/useTranslation'
import { SITE_STATS } from '@/lib/pricing'

const STATS = [
  {
    value: SITE_STATS.successRate,
    label: 'Success Rate',
    subtext: 'Of our users receive a positive immigration decision',
    accentBar: 'bg-emerald-500',
    accentText: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    value: '6–8 Wks',
    label: 'Avg. Processing',
    subtext: 'Average time from application submission to decision',
    accentBar: 'bg-blue-500',
    accentText: 'text-blue-600 dark:text-blue-400',
  },
  {
    value: '24/7',
    label: 'AI Support',
    subtext: 'Round-the-clock guidance from our AI immigration expert',
    accentBar: 'bg-violet-500',
    accentText: 'text-violet-600 dark:text-violet-400',
  },
]

const CARDS = [
  {
    icon: TrendingUp,
    title: 'home.successRate',
    description: 'home.successRateDesc',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Clock,
    title: 'home.fastProcessing',
    description: 'home.fastProcessingDesc',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Zap,
    title: 'home.aiSupport',
    description: 'home.aiSupportDesc',
    iconBg: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
  },
]

export default function AdvantagesSection() {
  const { t } = useT()

  return (
    <section className="sip-section bg-white dark:bg-slate-950">
      <div className="sip-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
            Why Choose Us
          </p>
          <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-3">
            {t('home.whyChoose')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('home.whyChooseDesc')}
          </p>
        </div>

        {/* Big-number stats strip */}
        <div className="grid md:grid-cols-3 gap-px bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden mb-10">
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

        {/* Supporting cards — simplified */}
        <div className="grid md:grid-cols-3 gap-6">
          {CARDS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-xl hover:shadow-slate-100/80 dark:hover:shadow-none transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.iconBg}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {t(item.title)}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(item.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
