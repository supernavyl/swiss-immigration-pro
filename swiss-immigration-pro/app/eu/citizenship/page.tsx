'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Globe, BookOpen, CheckCircle, Award } from 'lucide-react'
import Link from 'next/link'
import LayerHeader from '@/components/layout/LayerHeader'
import { Star } from 'lucide-react'

export default function EUCitizenshipPage() {
  return (
    <div className="min-h-screen bg-white">
      <LayerHeader
        layer="eu"
        homeHref="/eu"
        customBadge={{
          icon: <Star className="w-4 h-4" />,
          text: 'EU/EFTA Freedom of Movement: No Work Permit Quotas Required',
          bgColor: 'bg-blue-600',
          textColor: 'text-white'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/eu" className="inline-flex items-center text-blue-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to EU Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Swiss Citizenship for EU/EFTA Citizens
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Your accelerated path to Swiss citizenship with simplified naturalization procedures for EU/EFTA nationals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            {
              path: 'Ordinary Naturalization',
              residency: '10 years total (5 years C permit)',
              language: 'B1 oral, A2 written',
              requirements: ['Integration test', 'No criminal record', 'Financial independence', 'Respect for Swiss law'],
              timeline: '12-18 months processing',
              icon: Award
            },
            {
              path: 'Simplified (Spouse)',
              residency: '3 years marriage + 3 in CH',
              language: 'A2+ conversational',
              requirements: ['Married to Swiss citizen', 'Integration test', 'No criminal record', 'Active community participation'],
              timeline: '8-12 months processing',
              icon: BookOpen
            },
            {
              path: 'Accelerated (EU/EFTA)',
              residency: '5-6 years (with B permit)',
              language: 'B1 oral required',
              requirements: ['Continuous residence', 'Strong integration', 'Employment history', 'Community involvement'],
              timeline: '6-12 months processing',
              icon: Calendar
            },
            {
              path: 'Young Adults',
              residency: '5 years (ages 10-20)',
              language: 'School language level',
              requirements: ['Born in Switzerland', 'Attended school in CH', 'Residence since age 10', 'Integration proven'],
              timeline: '4-8 months processing',
              icon: Globe
            }
          ].map((path, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <path.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{path.path}</h3>
                  <p className="text-sm text-gray-500">{path.timeline}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Residency Requirement:</span>
                  <p className="text-gray-900">{path.residency}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Language Level:</span>
                  <p className="text-gray-900">{path.language}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Key Requirements:</span>
                  <ul className="mt-1 space-y-1">
                    {path.requirements.map((req, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-3">EU/EFTA Advantages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Faster C Permit</p>
                <p className="text-sm text-gray-600">Eligible after just 5 years (vs 10 for third-country nationals)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Simplified Integration</p>
                <p className="text-sm text-gray-600">EU citizenship demonstrates European integration</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">No Quota Restrictions</p>
                <p className="text-sm text-gray-600">Work permits available without annual limits</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Family Benefits</p>
                <p className="text-sm text-gray-600">Simplified family reunification procedures</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}





