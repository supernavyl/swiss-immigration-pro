'use client'

import { TrendingUp, Clock, Zap, CheckCircle } from 'lucide-react'
import { useT } from '@/lib/i18n/useTranslation'
import { SITE_STATS } from '@/lib/pricing'

const ADVANTAGES = [
  {
    icon: TrendingUp,
    title: 'home.successRate',
    description: 'home.successRateDesc',
    stat: SITE_STATS.successRate,
    statLabel: 'Success Rate',
    accent: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  },
  {
    icon: Clock,
    title: 'home.fastProcessing',
    description: 'home.fastProcessingDesc',
    stat: SITE_STATS.avgProcessingWeeks,
    statLabel: 'Average Processing',
    accent: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },
  {
    icon: Zap,
    title: 'home.aiSupport',
    description: 'home.aiSupportDesc',
    stat: '24/7',
    statLabel: 'AI Support',
    accent: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800',
    badge: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  },
]

export default function AdvantagesSection() {
  const { t } = useT()

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
            Why Choose Us
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            {t('home.whyChoose')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('home.whyChooseDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ADVANTAGES.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-xl hover:shadow-slate-100/80 dark:hover:shadow-none transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.accent}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.badge}`}>
                  {item.stat}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t(item.title)}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                {t(item.description)}
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item.statLabel}: <strong>{item.stat}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
