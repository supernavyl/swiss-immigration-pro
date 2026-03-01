'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Shield, Award, Clock, Euro } from 'lucide-react'
import Link from 'next/link'
import LayerHeader from '@/components/layout/LayerHeader'
import { Star } from 'lucide-react'

export default function EUVisasPage() {
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
            EU/EFTA Visa & Permit Types
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            As an EU/EFTA citizen, you benefit from the Agreement on Free Movement of Persons. No quotas, simplified procedures, and immediate work rights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'B Permit (Residence)',
              description: 'Initial 5-year residence permit for EU/EFTA citizens',
              duration: '5 Years',
              icon: Shield,
              features: ['No quota restrictions', 'Automatic renewal', 'Full work rights', 'Family reunification'],
              details: {
                processing: '2-4 weeks',
                requirement: 'Valid job offer or self-employment',
                extendable: 'Yes, automatically renewable',
                path: 'Direct path to C permit after 5 years'
              }
            },
            {
              title: 'C Permit (Settlement)',
              description: 'Permanent residence after 5 years of continuous residence',
              duration: 'Unlimited',
              icon: Award,
              features: ['Unlimited validity', 'No work restrictions', 'Canton change freedom', 'Simplified family reunification'],
              details: {
                processing: '4-8 weeks',
                requirement: '5 years continuous B permit',
                extendable: 'Unlimited',
                path: 'Eligible for naturalization after 12 years total'
              }
            },
            {
              title: 'L Permit (Short-term)',
              description: 'For temporary employment or project work',
              duration: 'Up to 12 months',
              icon: Clock,
              features: ['No quota limits', 'Fast processing', 'Project-based', 'Renewable if needed'],
              details: {
                processing: '1-3 weeks',
                requirement: 'Employment contract',
                extendable: 'Yes, up to 12 months total',
                path: 'Can convert to B permit'
              }
            },
            {
              title: 'G Permit (Cross-border)',
              description: 'For EU/EFTA citizens living in border zones',
              duration: '5 Years',
              icon: Euro,
              features: ['Border residence required', 'Daily commute', 'EU/EFTA only', 'Simplified taxation'],
              details: {
                processing: '2-3 weeks',
                requirement: 'Residence in border zone',
                extendable: 'Yes, 5-year renewal',
                path: 'Maintains EU residence status'
              }
            }
          ].map((visa, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <visa.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{visa.title}</h3>
                    <p className="text-sm text-gray-500">{visa.duration}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  No Quota
                </div>
              </div>

              <p className="text-gray-600 mb-4">{visa.description}</p>

              <div className="space-y-2 mb-4">
                {visa.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                {Object.entries(visa.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}





