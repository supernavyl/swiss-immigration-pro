'use client'

import { motion } from 'framer-motion'
import { Shield, Target, Briefcase, Clock, Zap, Users, Award, Globe } from 'lucide-react'

interface Feature {
  icon: React.ElementType
  title: string
  desc: string
  span: string // tailwind col/row span
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: 'AI Assistant',
    desc: 'Instant answers to Swiss immigration questions — accurate, up-to-date, available 24/7.',
    span: 'sm:col-span-2 sm:row-span-2',
  },
  {
    icon: Shield,
    title: 'Document Templates',
    desc: 'Swiss-format CV and cover letter templates built to pass the first screening filter.',
    span: 'sm:col-span-1',
  },
  {
    icon: Target,
    title: 'Canton Selection',
    desc: 'Data on processing times and quotas across all 26 cantons.',
    span: 'sm:col-span-1',
  },
  {
    icon: Briefcase,
    title: 'Job Market Insights',
    desc: 'Salary ranges by role and canton so you negotiate from data, not guesswork.',
    span: 'sm:col-span-1',
  },
  {
    icon: Clock,
    title: 'Timeline Planning',
    desc: 'A personalised roadmap that surfaces every critical deadline months in advance.',
    span: 'sm:col-span-2',
  },
  {
    icon: Award,
    title: 'Expert Reviews',
    desc: 'Specialist document review before submission — one caught error beats months of re-application.',
    span: 'sm:col-span-1',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Connect with people who made the same move — from your country, to your target city.',
    span: 'sm:col-span-1',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    desc: 'Full platform support in English, French, German, and Italian.',
    span: 'sm:col-span-1',
  },
]

export default function FeaturesGrid(): React.ReactElement {
  return (
    <section className="sip-section bg-slate-50/50 dark:bg-slate-900/30 relative overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="sip-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-3">
            Everything you need to succeed
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Comprehensive tools, templates, and expert guidance — all in one platform.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4">
          {FEATURES.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
              className={`group relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 p-6 hover:border-blue-300/50 dark:hover:border-blue-700/30 transition-all hover:shadow-lg hover:shadow-blue-500/5 ${item.span}`}
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(139,92,246,0.1) 100%)',
                }}
              />

              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
