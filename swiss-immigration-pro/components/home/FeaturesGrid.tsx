'use client'

import { motion } from 'framer-motion'
import { Shield, Target, Briefcase, Clock, Zap, Users, Award, Globe } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Document Templates',
    desc: 'Professional CV templates, cover letters, and application forms tailored for Swiss employers and authorities.',
  },
  {
    icon: Target,
    title: 'Canton Selection',
    desc: 'Strategic guidance on choosing the right canton based on your profession, industry, and personal preferences.',
  },
  {
    icon: Briefcase,
    title: 'Job Market Insights',
    desc: 'Real-time information on job opportunities, salary ranges, and industry trends across Swiss cantons.',
  },
  {
    icon: Clock,
    title: 'Timeline Planning',
    desc: 'Personalized roadmap with deadlines, milestones, and action items to keep your application on track.',
  },
  {
    icon: Zap,
    title: 'AI Assistant',
    desc: '24/7 access to our Swiss Immigration AI for instant answers to your questions and personalized guidance.',
  },
  {
    icon: Users,
    title: 'Community Support',
    desc: 'Connect with other applicants, share experiences, and get advice from those who successfully immigrated.',
  },
  {
    icon: Award,
    title: 'Expert Reviews',
    desc: 'Get your documents reviewed by certified immigration specialists before submission.',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    desc: 'Resources available in English, French, German, and Italian to support your journey.',
  },
]

export default function FeaturesGrid() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="py-24 bg-white dark:bg-gray-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive resources, expert guidance, and proven strategies for your Swiss
            immigration journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-slate-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
