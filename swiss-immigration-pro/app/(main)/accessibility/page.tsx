'use client'

import { motion } from 'framer-motion'
import { Accessibility, Eye, MousePointerClick, Keyboard, Volume2, CheckCircle2, Mail, Globe, Monitor } from 'lucide-react'
import Link from 'next/link'
import MainHeader from '@/components/layout/MainHeader'

const features = [
  {
    icon: Keyboard,
    title: 'Keyboard Navigation',
    description: 'Full keyboard accessibility for all interactive elements. Use Tab to navigate, Enter/Space to activate.'
  },
  {
    icon: Eye,
    title: 'Screen Reader Support',
    description: 'Compatible with screen readers including JAWS, NVDA, VoiceOver, and TalkBack.'
  },
  {
    icon: MousePointerClick,
    title: 'Clear Focus Indicators',
    description: 'Visible focus states on all interactive elements for easy navigation.'
  },
  {
    icon: Volume2,
    title: 'Alternative Text',
    description: 'All images include descriptive alt text for users with visual impairments.'
  },
  {
    icon: Monitor,
    title: 'Responsive Design',
    description: 'Works seamlessly across all devices and screen sizes, from mobile to desktop.'
  },
  {
    icon: Globe,
    title: 'Language Options',
    description: 'Content available in multiple languages with proper language attributes.'
  }
]

const standards = [
  {
    name: 'WCAG 2.1',
    level: 'Level AA',
    description: 'We strive to meet WCAG 2.1 Level AA standards for web accessibility.'
  },
  {
    name: 'Section 508',
    description: 'Compliant with Section 508 accessibility requirements.'
  },
  {
    name: 'EN 301 549',
    description: 'Adheres to European accessibility standard EN 301 549.'
  }
]

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <MainHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 shadow-lg"
          >
            <Accessibility className="w-10 h-10 text-blue-600" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Accessibility Statement
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            We are committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
        </motion.div>

        {/* Commitment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Commitment
            </h2>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-6">
              Swiss Immigration Pro is committed to providing a website that is accessible to the widest possible audience, 
              regardless of technology or ability. We actively work to increase the accessibility and usability of our website 
              and adhere to many of the available standards and guidelines.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {standards.map((standard, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="font-semibold text-lg mb-1">{standard.name}</div>
                  {standard.level && (
                    <div className="text-blue-200 text-sm mb-2">{standard.level}</div>
                  )}
                  <div className="text-blue-100 text-sm">{standard.description}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Accessibility Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Accessibility Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Known Issues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Known Issues & Ongoing Improvements
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              We are aware that some parts of our website may not be fully accessible. We are actively working to improve 
              accessibility in the following areas:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    Enhancing form labels and error messages for better screen reader compatibility
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    Improving color contrast ratios for better visibility
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    Adding skip navigation links for keyboard users
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    Enhancing video content with captions and transcripts
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              We Value Your Feedback
            </h2>
            <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
              If you encounter any accessibility barriers on Swiss Immigration Pro, or if you have suggestions 
              for improving accessibility, we want to hear from you. Your feedback helps us make our platform 
              more inclusive for everyone.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Contact Our Accessibility Team</h3>
                  <p className="text-indigo-100 mb-4">
                    Email:{' '}
                    <a 
                      href="mailto:accessibility@swissimmigrationpro.com" 
                      className="text-white hover:text-indigo-200 underline font-medium"
                    >
                      accessibility@swissimmigrationpro.com
                    </a>
                  </p>
                  <p className="text-indigo-100 text-sm">
                    We aim to respond to all accessibility inquiries within 48 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Additional Resources
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Browser Accessibility Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Most browsers offer built-in accessibility features like zoom, text size adjustment, and high contrast modes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Check your browser's accessibility settings for options that can enhance your experience</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assistive Technologies</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Screen readers: JAWS, NVDA, VoiceOver, TalkBack</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Voice recognition software: Dragon, Windows Speech Recognition</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Keyboard navigation and shortcuts are fully supported</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Update Date */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-600"
        >
          <p className="text-sm">
            This accessibility statement was last updated on January 5, 2025.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
