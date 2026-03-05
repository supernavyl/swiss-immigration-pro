'use client'

import { Shield, Target, Briefcase, Clock, Zap, Users, Award, Globe } from 'lucide-react'

interface Feature {
  icon: React.ElementType
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: 'AI Assistant',
    desc: 'Instant answers to Swiss immigration questions — accurate, up-to-date, available 24/7.',
  },
  {
    icon: Shield,
    title: 'Document Templates',
    desc: 'Swiss-format CV and cover letter templates built to pass the first screening filter.',
  },
  {
    icon: Target,
    title: 'Canton Selection',
    desc: 'Data on processing times and quotas across all 26 cantons to maximise approval odds.',
  },
  {
    icon: Briefcase,
    title: 'Job Market Insights',
    desc: 'Salary ranges by role and canton so you negotiate from data, not guesswork.',
  },
  {
    icon: Clock,
    title: 'Timeline Planning',
    desc: 'A personalised roadmap that surfaces every critical deadline months in advance.',
  },
  {
    icon: Award,
    title: 'Expert Reviews',
    desc: 'Specialist document review before submission — one caught error beats months of re-application.',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Connect with people who made the same move — from your country, to your target city.',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    desc: 'Full platform support in English, French, German, and Italian.',
  },
]

export default function FeaturesGrid() {
  return (
    <section className="sip-section bg-slate-50/50 dark:bg-slate-900/30">
      <div className="sip-container">
        <div className="max-w-2xl mb-12">
          <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-3">
            Everything you need to succeed
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Comprehensive tools, templates, and expert guidance — all in one platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden">
          {FEATURES.map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-slate-950 p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <item.icon className="w-5 h-5 text-slate-400 dark:text-slate-500 mb-4" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                {item.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
