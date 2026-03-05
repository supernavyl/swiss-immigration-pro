'use client'

import { ArrowRight, Users, MapPin, Globe, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'

const PATHWAYS = [
  {
    type: 'EU/EFTA Citizens',
    name: 'Freedom of Movement',
    duration: 'No Quotas',
    desc: 'EU/EFTA nationals skip the permit quota lottery entirely. Your only risk is the paperwork — we eliminate it.',
    cta: 'See EU pathway',
    icon: Users,
    link: '/eu',
    accent: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-600',
    iconColor: 'text-emerald-600 dark:text-emerald-400 group-hover:text-white',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  },
  {
    type: 'US & Canada',
    name: 'North American',
    duration: '8,500 Quota',
    desc: 'Only 8,500 non-EU permits are issued per year. Cantonal strategy is the difference between approval and a year-long wait.',
    cta: 'See US/CA pathway',
    icon: MapPin,
    link: '/us',
    accent: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-600 dark:group-hover:bg-blue-600',
    iconColor: 'text-blue-600 dark:text-blue-400 group-hover:text-white',
    badgeBg: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },
  {
    type: 'International',
    name: 'Global Citizens',
    duration: 'Strategic',
    desc: 'Non-quota pathways exist — but require proving economic value. We build that case: employer letters, salary benchmarks, cantonal fit.',
    cta: 'See all pathways',
    icon: Globe,
    link: '/other',
    accent: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-900/20 group-hover:bg-violet-600 dark:group-hover:bg-violet-600',
    iconColor: 'text-violet-600 dark:text-violet-400 group-hover:text-white',
    badgeBg: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  },
]

export default function PathwayGrid() {
  const { t } = useT()

  return (
    <section className="sip-section bg-white dark:bg-slate-950">
      <div className="sip-container">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
              Immigration Pathways
            </p>
            <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t('home.choosePathway')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Personalized solutions tailored to your background
            </p>
          </div>
          <Link
            href="/visas"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            View All Options <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PATHWAYS.map((pathway, idx) => (
            <Link key={idx} href={pathway.link} className="group">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-xl hover:shadow-slate-100/80 dark:hover:shadow-none transition-all duration-300 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${pathway.iconBg}`}>
                    <pathway.icon className={`w-6 h-6 transition-colors duration-300 ${pathway.iconColor}`} />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${pathway.badgeBg}`}>
                    {pathway.duration}
                  </span>
                </div>

                <p className={`text-xs font-semibold tracking-wider uppercase mb-1 ${pathway.accent}`}>
                  {pathway.type}
                </p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {pathway.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 flex-1">
                  {pathway.desc}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
                  <span className="text-slate-400 dark:text-slate-500">From CHF 9/mo</span>
                  <span className={`font-semibold flex items-center gap-1 group-hover:gap-2 transition-all ${pathway.accent}`}>
                    {pathway.cta} <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/visas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400"
          >
            View All Options <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
