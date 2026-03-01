'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Shield, Award, Clock, Globe, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import LayerHeader from '@/components/layout/LayerHeader'

export default function OtherVisasPage() {
  return (
    <div className="min-h-screen bg-white">
      <LayerHeader
        layer="other"
        homeHref="/other"
        customBadge={{
          icon: <Globe className="w-4 h-4" />,
          text: 'Serving Citizens from 190+ Countries • Expert Third-Country Immigration Guidance',
          bgColor: 'bg-blue-600',
          textColor: 'text-white'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/other" className="inline-flex items-center text-blue-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Other Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Third-Country National Visa & Permit Options
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Comprehensive guide for citizens from Asia, Africa, Middle East, South America, and all non-EU/EFTA countries.
          </p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Globe className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Global Immigration Support</h3>
              <p className="text-gray-700">
                We serve citizens from 190+ countries. Annual quotas apply: ~4,500 B permits and ~4,000 L permits. Early application recommended.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'B Permit (Residence)',
              description: 'Annual quota-restricted permit for highly qualified professionals worldwide',
              duration: '1 Year (Renewable)',
              icon: Shield,
              features: ['Quota-dependent (~4,500/year)', 'Annual renewal required', 'CHF 80k+ salary typical', 'Strict labor market test'],
              details: {
                quota: '~4,500 total (2025)',
                processing: '8-16 weeks',
                salary: 'CHF 80k+ minimum',
                requirement: 'Highly qualified specialist only'
              },
              note: 'Competitive - strong qualifications required'
            },
            {
              title: 'L Permit (Short-term)',
              description: 'Temporary permit for project-based employment or training',
              duration: 'Up to 12 months',
              icon: Clock,
              features: ['Quota-dependent (~4,000/year)', 'Project-specific work', 'Generally non-renewable', 'Faster processing'],
              details: {
                quota: '~4,000 total (2025)',
                processing: '4-8 weeks',
                salary: 'CHF 65k+ minimum',
                requirement: 'Temporary employment contract'
              },
              note: 'Limited availability per country'
            },
            {
              title: 'Investor/Entrepreneur Visa',
              description: 'For business owners and investors creating Swiss companies',
              duration: '1-5 Years',
              icon: Award,
              features: ['Business plan required', 'Significant investment', 'Job creation mandatory', 'Economic benefit proven'],
              details: {
                investment: 'CHF 100k-500k+ typical',
                processing: '12-20 weeks',
                requirement: 'Viable business with job creation',
                jobs: 'Must create Swiss jobs'
              },
              note: 'Rigorous business evaluation'
            },
            {
              title: 'Student Permit',
              description: 'For international students enrolled in Swiss universities',
              duration: 'Duration of studies',
              icon: Clock,
              features: ['University enrollment required', 'Part-time work allowed', 'Post-graduation options', 'Path to work permit'],
              details: {
                processing: '4-8 weeks',
                requirement: 'Accepted to Swiss university',
                work: '15 hours/week during studies',
                after: '6 months job search after graduation'
              },
              note: 'Can lead to work permit after graduation'
            },
            {
              title: 'C Permit (Permanent)',
              description: 'Permanent residence after 10 years of continuous residence',
              duration: 'Unlimited',
              icon: Award,
              features: ['10 years continuous B permit', 'Strong integration required', 'Unlimited validity', 'Full work rights'],
              details: {
                processing: '8-12 weeks',
                requirement: '10 years continuous residence',
                language: 'B1 oral, A2 written required',
                integration: 'Strong integration proven'
              },
              note: 'Long-term commitment required'
            },
            {
              title: 'Family Reunification',
              description: 'For family members of Swiss residents and citizens',
              duration: 'Matches sponsor permit',
              icon: Shield,
              features: ['Spouse/children eligible', 'Financial support required', 'Integration mandatory', 'Health insurance required'],
              details: {
                processing: '6-12 weeks',
                requirement: 'Sponsor must have permit',
                support: 'Adequate financial means required',
                language: 'Integration courses recommended'
              },
              note: 'Simpler process for immediate family'
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
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <visa.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{visa.title}</h3>
                    <p className="text-sm text-gray-500">{visa.duration}</p>
                  </div>
                </div>
                {visa.note && (
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold max-w-[120px] text-center">
                    {visa.note}
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-4">{visa.description}</p>

              <div className="space-y-2 mb-4">
                {visa.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
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





