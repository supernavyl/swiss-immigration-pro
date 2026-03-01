'use client'

import { motion } from 'framer-motion'
import {
  MessageSquare, BookOpen, LayoutDashboard,
  Users, FileText, Shield,
} from 'lucide-react'

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'AI Immigration Assistant',
    desc: 'Get instant, accurate answers to your Swiss immigration questions 24/7. Our AI assistant provides personalized guidance based on your nationality, visa type, and specific situation.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: BookOpen,
    title: 'Interactive Learning Modules',
    desc: 'Comprehensive step-by-step guides that adapt to your nationality and immigration goals. Master Swiss work permits, residence permits, and citizenship requirements through interactive content.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: LayoutDashboard,
    title: 'Application Dashboard',
    desc: 'Track your documents, deadlines, and application progress in one secure, organized place. Never miss an important date or document again.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Users,
    title: 'Expert Community Access',
    desc: 'Connect with other professionals navigating Swiss immigration. Share experiences, get advice, and learn from those who have successfully completed the process.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: FileText,
    title: 'ATS-Optimized Templates',
    desc: 'Professional CVs and motivation letters specifically designed for the Swiss job market. Our templates are optimized for Applicant Tracking Systems used by Swiss employers.',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    icon: Shield,
    title: 'Expert Document Review',
    desc: 'Get your critical immigration documents reviewed by experienced professionals. Ensure your applications are complete, accurate, and optimized for success.',
    color: 'bg-indigo-100 text-indigo-600',
  },
]

export default function FeatureDeepDive() {
  return (
    <section className="mt-12 sm:mt-16 md:mt-32" aria-label="Platform features">
      <div className="text-center mb-8 sm:mb-12 md:mb-16 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors">
          Everything You Need to Succeed in Switzerland
        </h2>
        <p className="text-sm sm:text-base text-black max-w-2xl mx-auto transition-colors opacity-80">
          We&apos;ve built the most comprehensive Swiss immigration platform with AI-powered tools,
          expert guidance, and step-by-step roadmaps for every stage of your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {FEATURES.map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"
            itemScope
            itemType="https://schema.org/Service"
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${feature.color} flex items-center justify-center mb-4 sm:mb-6`}
              aria-hidden="true"
            >
              <feature.icon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3
              className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 transition-colors"
              itemProp="name"
            >
              {feature.title}
            </h3>
            <p
              className="text-sm sm:text-base text-black leading-relaxed transition-colors opacity-80"
              itemProp="description"
            >
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
