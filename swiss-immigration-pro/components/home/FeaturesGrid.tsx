'use client'

import { Shield, Target, Briefcase, Clock, Zap, Users, Award, Globe } from 'lucide-react'

interface Feature {
  icon: React.ElementType
  title: string
  desc: string
  featured?: boolean
  iconBg: string
  iconColor: string
  cardBg?: string
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: 'AI Assistant',
    desc: '24/7 AI-powered answers to immigration questions, personalized guidance, and real-time document review — available in 4 languages.',
    featured: true,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    cardBg: 'bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/20 border-blue-200/60 dark:border-blue-800/60',
  },
  {
    icon: Shield,
    title: 'Document Templates',
    desc: 'Professional CV templates, cover letters, and application forms tailored for Swiss employers across all major industries and cantons.',
    featured: true,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    cardBg: 'bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/20 border-emerald-200/60 dark:border-emerald-800/60',
  },
  {
    icon: Target,
    title: 'Canton Selection',
    desc: 'Strategic guidance on choosing the right canton for your profession and lifestyle.',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: Briefcase,
    title: 'Job Market Insights',
    desc: 'Salary ranges, industry trends, and job opportunities across Swiss cantons.',
    iconBg: 'bg-violet-50 dark:bg-violet-900/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    icon: Clock,
    title: 'Timeline Planning',
    desc: 'Personalized roadmap with deadlines and milestones for your application.',
    iconBg: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    icon: Award,
    title: 'Expert Reviews',
    desc: 'Documents reviewed by certified immigration specialists before submission.',
    iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: Users,
    title: 'Community Support',
    desc: 'Connect with other applicants and learn from successful immigrants.',
    iconBg: 'bg-sky-50 dark:bg-sky-900/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    desc: 'Resources in English, French, German, and Italian for your journey.',
    iconBg: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
]

const featuredFeatures = FEATURES.filter((f) => f.featured)
const standardFeatures = FEATURES.filter((f) => !f.featured)

export default function FeaturesGrid() {
  return (
    <section className="sip-section bg-white dark:bg-slate-950">
      <div className="sip-container">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
            Platform Features
          </p>
          <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-3">
            Everything You Need to Succeed
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Comprehensive resources, expert guidance, and proven strategies for your Swiss
            immigration journey.
          </p>
        </div>

        {/* Bento layout */}
        <div className="flex flex-col gap-5">
          {/* Featured row */}
          <div className="grid sm:grid-cols-2 gap-5">
            {featuredFeatures.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-7 hover:shadow-xl hover:shadow-slate-100/80 dark:hover:shadow-none transition-all duration-300 ${item.cardBg}`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${item.iconBg}`}>
                  <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Standard grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {standardFeatures.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-slate-100/80 dark:hover:shadow-none transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${item.iconBg}`}>
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
