'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Shield, Award, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import LayerHeader from '@/components/layout/LayerHeader'

export default function USVisasPage() {
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
            US Citizen Visa & Permit Options
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            As a US citizen, you're subject to third-country quotas. Navigate the competitive permit system with expert guidance.
          </p>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">2025 Quota Alert</h3>
              <p className="text-gray-700">
                Only ~4,500 B permits and ~4,000 L permits available annually for all third-country nationals. Apply early in the year for best chances.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'B Permit (Residence)',
              description: 'Annual quota-restricted permit for highly qualified professionals',
              duration: '1 Year (Renewable)',
              icon: Shield,
              features: ['Quota-dependent (~4,500/year)', 'Annual renewal required', 'CHF 80k+ salary', 'Labor market test'],
              details: {
                quota: '~4,500 total (2025)',
                processing: '8-12 weeks',
                salary: 'CHF 80k+ minimum',
                requirement: 'Highly qualified specialist'
              },
              warning: 'Competitive - apply early'
            },
            {
              title: 'L Permit (Short-term)',
              description: 'Temporary permit for project-based or temporary employment',
              duration: 'Up to 12 months',
              icon: Clock,
              features: ['Quota-dependent (~4,000/year)', 'Project-specific', 'Non-renewable', 'Fast processing'],
              details: {
                quota: '~4,000 total (2025)',
                processing: '4-8 weeks',
                salary: 'CHF 65k+ minimum',
                requirement: 'Temporary employment only'
              },
              warning: 'Limited availability'
            },
            {
              title: 'Investor Visa',
              description: 'For entrepreneurs and investors establishing businesses',
              duration: '1-5 Years',
              icon: Award,
              features: ['Business plan required', 'Investment minimum', 'Job creation', 'Economic benefit'],
              details: {
                investment: 'CHF 100k+ typical',
                processing: '12-16 weeks',
                requirement: 'Viable business plan',
                jobs: 'Create Swiss jobs required'
              },
              warning: 'Rigorous evaluation'
            },
            {
              title: 'C Permit (Permanent)',
              description: 'Permanent residence after 10 years of continuous residence',
              duration: 'Unlimited',
              icon: Award,
              features: ['10 years continuous B permit', 'Strong integration', 'Unlimited validity', 'Full work rights'],
              details: {
                processing: '8-12 weeks',
                requirement: '10 years continuous residence',
                language: 'B1 oral, A2 written',
                integration: 'Strong integration proven'
              },
              warning: 'Long path ahead'
            }
          ].map((visa, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <visa.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{visa.title}</h3>
                    <p className="text-sm text-gray-500">{visa.duration}</p>
                  </div>
                </div>
                {visa.warning && (
                  <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                    {visa.warning}
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-4">{visa.description}</p>

              <div className="space-y-2 mb-4">
                {visa.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-600 flex-shrink-0" />
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





