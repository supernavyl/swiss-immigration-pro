'use client'

import { ArrowRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'

const PATHWAYS = [
  {
    type: 'EU/EFTA Citizens',
    name: 'Freedom of Movement',
    badge: 'No Quotas',
    desc: 'EU/EFTA nationals skip the permit quota entirely. Your only risk is the paperwork.',
    cta: 'EU pathway',
    link: '/eu',
  },
  {
    type: 'US & Canada',
    name: 'North American',
    badge: '8,500 Quota',
    desc: 'Only 8,500 non-EU permits per year. Cantonal strategy is the difference between approval and a year-long wait.',
    cta: 'US/CA pathway',
    link: '/us',
  },
  {
    type: 'International',
    name: 'Global Citizens',
    badge: 'Strategic',
    desc: 'Non-quota pathways exist but require proving economic value. We build that case end-to-end.',
    cta: 'All pathways',
    link: '/visas',
  },
]

export default function PathwayGrid(): React.ReactElement {
  const { t } = useT()

  return (
    <section className="py-24 bg-[#08080d]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-3">
              Pathways
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {t('home.choosePathway')}
            </h2>
            <p className="text-slate-500">
              Tailored to your nationality and situation.
            </p>
          </div>
          <Link
            href="/visas"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-white transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {PATHWAYS.map((p) => (
            <Link key={p.link} href={p.link} className="group">
              <div className="h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 flex flex-col hover:border-white/[0.12] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    {p.type}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-400/20 bg-indigo-400/[0.06]">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {p.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                  {p.desc}
                </p>

                <div className="flex items-center text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
                  {p.cta}
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/visas"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500"
          >
            View all pathways <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
