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

export default function FeaturesGrid(): React.ReactElement {
  return (
    <section className="py-24 bg-[#06060a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-3">
            Platform
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Everything you need to succeed
          </h2>
          <p className="text-slate-500 leading-relaxed">
            Comprehensive tools, templates, and expert guidance — all in one platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
          {FEATURES.map((item) => (
            <div
              key={item.title}
              className="bg-[#06060a] p-6 hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center mb-4">
                <item.icon className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
