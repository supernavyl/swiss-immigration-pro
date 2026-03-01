'use client'

import { motion } from 'framer-motion'
import { Calendar, Globe, BookOpen, CheckCircle } from 'lucide-react'
import MainHeader from '@/components/layout/MainHeader'


export default function CitizenshipPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <MainHeader />
      <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Globe className="w-4 h-4" />
            <span>Swiss Citizenship Journey</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Your Path to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Swiss Citizenship
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Master the 10-year journey to Swiss citizenship with our comprehensive roadmap,
            personalized timelines, and proven strategies for success.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
              <Calendar className="w-4 h-4" />
              <span>10-Year Process</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
              <CheckCircle className="w-4 h-4" />
              <span>Canton-Specific</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
              <BookOpen className="w-4 h-4" />
              <span>Integration Required</span>
            </div>
          </div>
        </motion.div>

        {/* Citizenship Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏛️',
                title: 'Federal System',
                desc: 'Swiss citizenship is granted by individual cantons, not the federal government. Each canton has its own requirements and process.'
              },
              {
                icon: '⏰',
                title: '10-Year Journey',
                desc: 'Most paths require 10 years of continuous residency with a C-permit. Plan ahead and track your progress carefully.'
              },
              {
                icon: '🎯',
                title: 'Integration Focus',
                desc: 'Switzerland emphasizes cultural integration. Language proficiency and knowledge of Swiss values are essential.'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg dark:shadow-none transition-all duration-300"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Citizenship Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Citizenship Pathways
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three main routes to Swiss citizenship, each with specific requirements and timelines
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                type: 'Ordinary Naturalization',
                icon: '🏛️',
                color: 'from-blue-500 to-blue-600',
                bgColor: 'from-blue-50 to-blue-100',
                residency: '10 years (C permit)',
                language: 'B1 German/French/Italian',
                requirements: ['Integration test passed', 'No criminal record', 'Financial stability', 'Swiss values knowledge'],
                timeline: '10-12 years total',
                difficulty: 'Most Common'
              },
              {
                type: 'Facilitated (Spouse)',
                icon: '💍',
                color: 'from-green-500 to-green-600',
                bgColor: 'from-green-50 to-green-100',
                residency: '5 years married + 3 in CH',
                language: 'A2+ conversational',
                requirements: ['Proof of visits', 'Close ties to Switzerland', 'Joint tax declaration', 'Stable relationship'],
                timeline: '6-8 years total',
                difficulty: 'Easier Path'
              },
              {
                type: 'Facilitated (3rd Gen)',
                icon: '👶',
                color: 'from-purple-500 to-purple-600',
                bgColor: 'from-purple-50 to-purple-100',
                residency: 'Born in CH, 5 years residence',
                language: 'B1 level',
                requirements: ['Swiss parent/grandparent', 'Good conduct record', 'Integration demonstrated', 'Education in Switzerland'],
                timeline: '5-7 years total',
                difficulty: 'Youth Advantage'
              },
            ].map((path, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className={`bg-gradient-to-br ${path.bgColor} p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group`}
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${path.color} rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto shadow-lg`}>
                    {path.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{path.type}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${path.color} text-white`}>
                    {path.difficulty}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Residency Required</div>
                    <div className="text-gray-900 font-medium">{path.residency}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Language Level</div>
                    <div className="text-gray-900 font-medium">{path.language}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Timeline</div>
                    <div className="text-gray-900 font-medium">{path.timeline}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Key Requirements</div>
                    <ul className="space-y-1">
                      {path.requirements.map((req, reqIdx) => (
                        <li key={reqIdx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2 flex-shrink-0 mt-1" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Core Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Essential Requirements
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Four fundamental pillars that form the foundation of Swiss citizenship applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Residency',
                color: 'from-blue-500 to-blue-600',
                bgColor: 'from-blue-50 to-blue-100',
                items: ['C permit holder', '10 consecutive years', 'Valid residence documents', 'Continuous presence'],
                description: 'Stable, long-term residency is the cornerstone of Swiss citizenship.'
              },
              {
                icon: BookOpen,
                title: 'Language',
                color: 'from-green-500 to-green-600',
                bgColor: 'from-green-50 to-green-100',
                items: ['B1 level certification', 'German/French/Italian', 'Speaking & writing skills', 'Official examination'],
                description: 'Demonstrate your ability to participate fully in Swiss society.'
              },
              {
                icon: Globe,
                title: 'Integration',
                color: 'from-purple-500 to-purple-600',
                bgColor: 'from-purple-50 to-purple-100',
                items: ['Integration course', 'Cultural knowledge test', 'Swiss values understanding', 'Social participation'],
                description: 'Show your commitment to Swiss society and democratic principles.'
              },
              {
                icon: CheckCircle,
                title: 'Conduct',
                color: 'from-orange-500 to-orange-600',
                bgColor: 'from-orange-50 to-orange-100',
                items: ['Clean criminal record', 'Good reputation', 'Financial responsibility', 'Tax compliance'],
                description: 'Maintain exemplary conduct and contribute positively to society.'
              },
            ].map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className={`bg-gradient-to-br ${section.bgColor} dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 group relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${section.color} rounded-bl-3xl opacity-10 group-hover:opacity-20 transition-opacity`}></div>

                <section.icon className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl p-3 text-white mb-6 shadow-lg`} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {section.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  {section.description}
                </p>
                <ul className="space-y-2">
                  {section.items.map((item, iidx) => (
                    <li key={iidx} className="flex items-start text-sm text-gray-700 dark:text-gray-200">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Citizenship Success CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <CheckCircle className="w-4 h-4" />
              <span>Proven Success System</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Complete Citizenship
              <span className="block text-yellow-300">Success Package</span>
            </h2>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your 10-year citizenship journey into a streamlined success story with our comprehensive
              roadmap, language preparation, and personalized guidance system.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: '📋', title: '10-Year Roadmap', desc: 'Step-by-step timeline with milestones' },
                { icon: '🗣️', title: 'Language Mastery', desc: 'B1 certification preparation course' },
                { icon: '🎯', title: 'Success Coaching', desc: 'Personal advisor + canton strategy' }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-2xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-none"
              >
                Get Your Success Package
                <CheckCircle className="w-5 h-5" />
              </a>
              <a
                href="/consultation"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 border border-white/30"
              >
                Free Consultation
              </a>
            </div>

            <p className="text-blue-200 text-sm mt-6">
              Join 500+ successful citizenship applicants • 94% success rate • Money-back guarantee
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    </div>
  )
}

