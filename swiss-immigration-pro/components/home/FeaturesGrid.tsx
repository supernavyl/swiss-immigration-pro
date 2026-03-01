'use client'

import { Shield, Target, Briefcase, Clock, Zap, Users, Award, Globe } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Document Templates',
    desc: 'Professional CV templates, cover letters, and application forms tailored for Swiss employers.',
  },
  {
    icon: Target,
    title: 'Canton Selection',
    desc: 'Strategic guidance on choosing the right canton for your profession and lifestyle.',
  },
  {
    icon: Briefcase,
    title: 'Job Market Insights',
    desc: 'Salary ranges, industry trends, and job opportunities across Swiss cantons.',
  },
  {
    icon: Clock,
    title: 'Timeline Planning',
    desc: 'Personalized roadmap with deadlines and milestones for your application.',
  },
  {
    icon: Zap,
    title: 'AI Assistant',
    desc: '24/7 AI-powered answers to immigration questions and personalized guidance.',
  },
  {
    icon: Users,
    title: 'Community Support',
    desc: 'Connect with other applicants and learn from successful immigrants.',
  },
  {
    icon: Award,
    title: 'Expert Reviews',
    desc: 'Documents reviewed by certified immigration specialists before submission.',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    desc: 'Resources in English, French, German, and Italian for your journey.',
  },
]

export default function FeaturesGrid() {
  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
            Platform Features
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Everything You Need to Succeed
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Comprehensive resources, expert guidance, and proven strategies for your Swiss
            immigration journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg hover:shadow-slate-100/80 dark:hover:shadow-none transition-all duration-300"
            >
              <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">{item.title}</h3>
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
