'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Globe, BookOpen, CheckCircle, Award, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import LayerHeader from '@/components/layout/LayerHeader'

export default function USCitizenshipPage() {
  return (
    <div className="min-h-screen bg-white">
      <LayerHeader
        layer="us"
        homeHref="/us"
        customBadge={{
          icon: <AlertTriangle className="w-4 h-4" />,
          text: '2025 Quota Alert: ~4,500 B Permits for Third-Country Nationals • Apply Early',
          bgColor: 'bg-black',
          textColor: 'text-white'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/us" className="inline-flex items-center text-blue-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to US Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Swiss Citizenship for US Citizens
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            The path to Swiss citizenship for Americans requires patience, integration, and meeting all requirements. Here's your roadmap.
          </p>
        </div>

        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-gray-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Important Timeline</h3>
              <p className="text-gray-700">
                As a third-country national, you need 10 years of continuous residence before applying for citizenship. Plan accordingly.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            {
              path: 'Ordinary Naturalization',
              residency: '10 years continuous (C permit)',
              language: 'B1 oral, A2 written',
              requirements: ['Integration test passed', 'No criminal record', 'Financial independence', 'Respect for Swiss law and values'],
              timeline: '12-24 months processing',
              icon: Award,
              note: 'Standard path for all third-country nationals'
            },
            {
              path: 'Simplified (Spouse)',
              residency: '3 years marriage + 3 in CH',
              language: 'A2+ conversational',
              requirements: ['Married to Swiss citizen', 'Integration test', 'No criminal record', 'Active community participation'],
              timeline: '8-12 months processing',
              icon: BookOpen,
              note: 'Faster path if married to Swiss citizen'
            },
            {
              path: 'Young Adults',
              residency: '5 years (ages 10-20)',
              language: 'School language level',
              requirements: ['Born in Switzerland', 'Attended school in CH', 'Residence since age 10', 'Integration proven'],
              timeline: '4-8 months processing',
              icon: Calendar,
              note: 'For children/young adults'
            },
            {
              path: 'Special Cases',
              residency: 'Varies (5-10 years)',
              language: 'B1+ required',
              requirements: ['Exceptional integration', 'Outstanding contributions', 'Special circumstances', 'Cantonal approval'],
              timeline: '12-18 months processing',
              icon: Globe,
              note: 'Rare exceptions only'
            }
          ].map((path, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <path.icon className="w-6 h-6 text-gray-700" />
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
                        <CheckCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {path.note && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 italic">{path.note}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-3">Key Considerations for US Citizens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">10-Year Timeline</p>
                <p className="text-sm text-gray-600">Plan for a decade of continuous residence before citizenship eligibility</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Dual Citizenship</p>
                <p className="text-sm text-gray-600">Switzerland allows dual citizenship - you can keep your US passport</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Integration Focus</p>
                <p className="text-sm text-gray-600">Strong emphasis on cultural and linguistic integration</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Tax Considerations</p>
                <p className="text-sm text-gray-600">Consult tax advisor regarding US tax obligations while in Switzerland</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}





