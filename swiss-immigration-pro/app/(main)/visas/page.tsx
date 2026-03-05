import type { Metadata } from 'next'
import { Clock, CheckCircle, TrendingUp, Shield, Badge, Award, FileCheck, ArrowRight, AlertTriangle, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Swiss Visa Types & Permit Requirements — Complete Guide',
  description:
    'Comprehensive guide to Swiss L, B, G, and C permits. Quotas, processing times, salary requirements, and application steps for EU and non-EU citizens.',
  keywords: ['swiss visa', 'work permit switzerland', 'L permit', 'B permit', 'C permit', 'swiss residence permit'],
  alternates: { canonical: '/visas' },
}

/* ────────────────────────────────────────────────
   Permit accent colours
   ──────────────────────────────────────────────── */

const ACCENT = {
  blue: {
    icon: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600',
    detail: 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50',
  },
  emerald: {
    icon: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600',
    detail: 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50',
  },
  violet: {
    icon: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300',
    border: 'border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-600',
    detail: 'bg-violet-50/60 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900/50',
  },
} as const

export default function VisasPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* ── Hero ── */}
      <section className="pt-16 pb-10 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
            Permits &amp; Visas
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Swiss Visa Types &amp;&nbsp;Requirements
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Everything you need to know about Swiss work permits&nbsp;&mdash;
            quotas, processing times, salary thresholds, and step-by-step
            application guides.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['4,500 B permits/year', '96% success with SIP', '26 cantons covered'].map(
              (stat) => (
                <span
                  key={stat}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {stat}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Main Permit Cards ── */}
      <section className="px-5 sm:px-8 pb-12">
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-3">
          {([
            {
              title: 'L Permit',
              subtitle: 'Short-term Residence',
              description: 'Temporary residence for employment contracts up to 12 months. Ideal for project-based work and initial assignments.',
              duration: '< 1 Year',
              icon: Shield,
              accent: ACCENT.blue,
              slug: 'l-permit-guide',
              features: ['Job offer required', 'Subject to annual quotas (non-EU)', 'Renewable up to 24 months total', 'Convertible to B permit'],
              details: { Quota: '4,000/year (non-EU)', Processing: '4–8 weeks', 'Min. salary': 'CHF 65k+', Renewable: 'Once (24 mo max)' },
            },
            {
              title: 'B Permit',
              subtitle: 'Long-term Residence',
              description: 'Standard permit for long-term employment. 5 years for EU/EFTA, 1 year renewable for non-EU. Path to permanent residence.',
              duration: '1–5 Years',
              icon: Badge,
              accent: ACCENT.emerald,
              slug: 'b-permit-guide',
              features: ['Most common work permit', 'EU/EFTA: simplified process', 'Family reunification eligible', 'Path to C permit'],
              details: { Quota: '4,500/year (non-EU)', Processing: '8–14 weeks', 'Min. salary': 'CHF 90k+ typical', Renewable: 'Annually / 5 years' },
            },
            {
              title: 'G Permit',
              subtitle: 'Cross-border Commuter',
              description: 'For workers living in a neighbouring country (France, Germany, Italy, Austria) and commuting daily or weekly to Switzerland.',
              duration: 'Ongoing',
              icon: FileCheck,
              accent: ACCENT.violet,
              slug: null,
              features: ['Live abroad, work in CH', 'Weekly return to home country', 'No quota restrictions', 'Border region requirement'],
              details: { Quota: 'Unlimited', Processing: '4–6 weeks', 'Min. salary': 'No minimum', Renewable: 'Every 5 years' },
            },
          ] as const).map((visa) => {
            const IconComponent = visa.icon
            return (
              <div
                key={visa.title}
                className={`group relative flex flex-col rounded-2xl border bg-white dark:bg-slate-900/50 ${visa.accent.border} hover:shadow-xl hover:shadow-slate-100/80 dark:hover:shadow-none transition-all duration-300 overflow-hidden`}
              >
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <IconComponent className={`w-6 h-6 ${visa.accent.icon}`} />
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${visa.accent.badge}`}>
                      {visa.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {visa.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                    {visa.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                    {visa.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-5">
                    {visa.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Quick stats */}
                  <div className={`rounded-xl p-4 space-y-2.5 border ${visa.accent.detail} mb-5`}>
                    {Object.entries(visa.details).map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{label}</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    {visa.slug ? (
                      <Link
                        href={`/visas/${visa.slug}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors text-sm"
                        prefetch={false}
                      >
                        Read Full Guide <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium rounded-xl text-sm cursor-default">
                        Detailed guide coming soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Other Permit Types ── */}
      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">
            Other Permit Types
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {([
              { title: 'C Permit', subtitle: 'Settlement', description: 'Permanent residence after 5–10 years', icon: Award, slug: 'c-permit-guide' as string | null },
              { title: 'EU Blue Card', subtitle: 'Highly Qualified', description: 'Simplified for high-skilled workers', icon: Badge, slug: null as string | null },
              { title: 'N Permit', subtitle: 'Asylum', description: 'For refugees and asylum seekers', icon: Shield, slug: null as string | null },
              { title: 'CI Permit', subtitle: 'Diplomatic', description: 'International orgs and diplomats', icon: FileCheck, slug: null as string | null },
            ]).map((perm) => {
              const PermIcon = perm.icon
              const cardClass = "group flex flex-col items-center text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-slate-100/80 dark:hover:shadow-none transition-all p-5"
              const inner = (
                <>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <PermIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{perm.title}</div>
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1.5">{perm.subtitle}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{perm.description}</div>
                  {perm.slug && (
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      View guide <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </>
              )
              return perm.slug ? (
                <Link key={perm.title} href={`/visas/${perm.slug}`} prefetch={false} className={cardClass}>
                  {inner}
                </Link>
              ) : (
                <div key={perm.title} className={cardClass}>
                  {inner}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Application Process ── */}
      <section className="px-5 sm:px-8 py-12 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Application Process Overview
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Six steps from job offer to collecting your Swiss residence permit.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {([
              { step: 1, title: 'Secure Job Offer', description: 'Employer initiates application and demonstrates no Swiss/EU candidate available', duration: '2–6 months' },
              { step: 2, title: 'Submit Documents', description: 'Complete package: passport, certificates, employment contract, CV, diplomas', duration: '1–2 weeks' },
              { step: 3, title: 'Cantonal Review', description: 'Canton checks quota availability, salary adequacy, and labour market impact', duration: '4–8 weeks' },
              { step: 4, title: 'Federal SEM Approval', description: 'State Secretariat for Migration reviews quota and national interest', duration: '2–4 weeks' },
              { step: 5, title: 'Embassy Interview', description: 'Attend visa appointment at Swiss embassy or consulate in your home country', duration: '1–2 weeks' },
              { step: 6, title: 'Receive Permit', description: 'Enter Switzerland, register with municipality, collect biometric permit card', duration: '1–3 days' },
            ] as const).map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 hover:shadow-lg hover:shadow-slate-100/80 dark:hover:shadow-none transition-all"
              >
                <span className="absolute top-4 right-4 text-5xl font-black text-slate-100 dark:text-slate-800 select-none">
                  {item.step}
                </span>
                <div className="relative">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 dark:bg-blue-500 px-2.5 py-1 rounded-full mb-3">
                    Step {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <Clock className="w-3.5 h-3.5" />
                    {item.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Common Mistakes ── */}
      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Common Mistakes That Lead to Rejection
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Avoid these pitfalls that cause most Swiss work permit rejections and delays.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {([
              { mistake: 'Insufficient Salary', impact: '60% of rejections', solution: 'Research canton-specific thresholds. CHF 100k+ strongly recommended for non-EU applicants.' },
              { mistake: 'Incomplete Documentation', impact: '30% of delays', solution: 'Use comprehensive checklists. Every document must be certified, translated, and apostilled.' },
              { mistake: 'Wrong Canton Strategy', impact: 'Higher competition', solution: 'Choose cantons with better approval rates. Basel-Stadt (87%) vs Zurich (72%) for non-EU.' },
              { mistake: 'Weak Employer Justification', impact: 'Labour market test fails', solution: 'Employer must demonstrate exhaustive search for Swiss/EU candidates with documented evidence.' },
            ] as const).map((item) => (
              <div
                key={item.mistake}
                className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                    <h3 className="font-bold text-red-900 dark:text-red-300">
                      {item.mistake}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-white bg-red-500 dark:bg-red-600 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    {item.impact}
                  </span>
                </div>
                <p className="text-sm text-red-800 dark:text-red-300/80 leading-relaxed">
                  {item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Success Tips ── */}
      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-7 sm:p-9">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Success Tips from 10,000+ Immigrants
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {([
                { title: 'Negotiate Competitive Salary', desc: 'Higher salary eliminates most objections. Research canton-specific benchmarks.' },
                { title: 'Prepare Complete Documentation', desc: 'Double-check every requirement. Missing docs are the #1 cause of delays.' },
                { title: 'Start Language Learning Early', desc: 'Demonstrates integration commitment. Aim for A2/B1 level before arrival.' },
                { title: 'Choose the Right Canton', desc: 'Canton selection is critical. Avoid over-subscribed areas like Geneva and Zurich.' },
              ] as const).map((tip) => (
                <div key={tip.title} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white text-sm block mb-0.5">{tip.title}</strong>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Need detailed guidance?
            </h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
              Get complete checklists, embassy contacts, and step-by-step guides
              with our Immigration Pack.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Start Free Assessment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
