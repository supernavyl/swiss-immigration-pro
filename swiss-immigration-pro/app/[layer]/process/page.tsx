'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Clock, TrendingUp, Briefcase, FileText, Building2, MapPin, Award, Users, Globe, Search, CheckSquare, Plane, Home, Shield, Zap, Star, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { LAYER_CONTENT } from '@/lib/layerContent'
import type { LayerType } from '@/lib/layerLogic'
import LayerHeader from '@/components/layout/LayerHeader'

// Icon mapping for process steps
const getStepIcon = (stepTitle: string, stepIndex: number) => {
  const titleLower = stepTitle.toLowerCase()
  if (titleLower.includes('job') || titleLower.includes('employer') || titleLower.includes('offer') || titleLower.includes('search')) return Search
  if (titleLower.includes('document') || titleLower.includes('paper') || titleLower.includes('certificate') || titleLower.includes('prepare')) return FileText
  if (titleLower.includes('application') || titleLower.includes('apply') || titleLower.includes('submit') || titleLower.includes('permit')) return CheckSquare
  if (titleLower.includes('embassy') || titleLower.includes('consulate') || titleLower.includes('visa') || titleLower.includes('interview')) return MapPin
  if (titleLower.includes('arrival') || titleLower.includes('arrive') || titleLower.includes('register') || titleLower.includes('moving')) return Plane
  if (titleLower.includes('citizenship') || titleLower.includes('naturalization') || titleLower.includes('permanent') || titleLower.includes('settle')) return Shield
  if (titleLower.includes('approval') || titleLower.includes('approved') || titleLower.includes('receive')) return Zap
  if (titleLower.includes('residence') || titleLower.includes('living') || titleLower.includes('home')) return Home
  // Default icons based on step index
  const defaultIcons = [Search, FileText, CheckSquare, MapPin, Plane, Shield, Home, Zap]
  return defaultIcons[stepIndex % defaultIcons.length]
}

type PageProps = { params: Promise<{ layer: string }> }

export default function ProcessPage({ params }: PageProps) {
  const { layer: layerParam } = use(params)
  // Map new route names to old layer names
  const layerMap: Record<string, LayerType> = {
    'eu': 'europeans',
    'us': 'americans',
    'other': 'others',
    'europeans': 'europeans',
    'americans': 'americans',
    'others': 'others'
  }
  const layer = (layerMap[layerParam] || 'others') as LayerType
  
  const content = LAYER_CONTENT[layer]

  // Map layer names to LayerHeader format
  const layerForHeader = layer === 'europeans' ? 'eu' : layer === 'americans' ? 'us' : 'other'
  const homeHref = `/${layerForHeader}`

  // Layer-specific badge configuration
  const badge = {
    icon: layer === 'europeans' ? <Star className="w-3.5 h-3.5" /> : layer === 'americans' ? <AlertTriangle className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />,
    text: layer === 'europeans' 
      ? 'EU/EFTA Freedom of Movement'
      : layer === 'americans' 
      ? '2025 Quota Alert: Apply Early'
      : 'Global Citizens Pathway',
    bgColor: layer === 'europeans' ? 'bg-blue-600' : layer === 'americans' ? 'bg-slate-900' : 'bg-purple-600',
    textColor: 'text-white'
  }

  return (
    <div className="bg-white min-h-screen">
      <LayerHeader
        layer={layerForHeader as 'eu' | 'us' | 'other'}
        homeHref={homeHref}
        customBadge={badge}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${layer}`} className="inline-flex items-center text-blue-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {content.process.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {content.process.description}
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-200 hidden md:block" />
          <div className="space-y-12">
            {content.process.steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex items-start space-x-6"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl z-10 shadow-lg">
                  {step.step}
                </div>
                <div className="flex-1 bg-white border border-gray-200 rounded-xl p-8">
                  {/* Process Step Image (first step only) or Icon (other steps) */}
                  {idx === 0 ? (
                    <div className="relative mb-6 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden">
                      <img 
                        src={`/images/${layer}/process-${layer === 'europeans' ? 'registration' : layer === 'americans' ? 'embassy' : 'embassy'}.${layer === 'europeans' ? 'png' : 'png'}`}
                        alt={`Step ${step.step}: ${step.title} - ${layer === 'europeans' ? 'EU/EFTA' : layer === 'americans' ? 'US' : 'International'} Swiss Immigration Process`}
                        title={`Step ${step.step}: ${step.title} - Swiss Immigration Process for ${layer === 'europeans' ? 'EU/EFTA Citizens' : layer === 'americans' ? 'US Citizens' : 'International Citizens'}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={800}
                        height={400}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/environment/swiss-alps-panorama.jpg'
                        }}
                      />
                    </div>
                  ) : idx === 1 && layer === 'americans' ? (
                    <div className="relative mb-6 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden">
                      <img 
                        src="/images/americans/process-quota-system.jpeg"
                        alt={`Step ${step.step}: ${step.title} - Quota System Process for US Citizens`}
                        title={`Step ${step.step}: ${step.title} - US Citizens Quota System Process`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={800}
                        height={400}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/environment/swiss-alps-panorama.jpg'
                        }}
                      />
                    </div>
                  ) : idx === 1 && layer === 'others' ? (
                    <div className="relative mb-6 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden">
                      <img 
                        src="/images/others/process-quota-system.jpeg"
                        alt={`Step ${step.step}: ${step.title} - Quota System Process for International Citizens`}
                        title={`Step ${step.step}: ${step.title} - International Citizens Quota System Process`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={800}
                        height={400}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/environment/swiss-alps-panorama.jpg'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="relative mb-6 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                      {(() => {
                        const IconComponent = getStepIcon(step.title, idx)
                        return (
                          <IconComponent className="w-12 h-12 text-blue-600" />
                        )
                      })()}
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {step.title}
                    </h2>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">{step.timeline}</span>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 mb-4">
                    {step.description}
                  </p>
                  {idx < content.process.steps.length - 1 && (
                    <div className="flex items-center text-blue-600 mt-4">
                      <ArrowLeft className="w-4 h-4 mr-2 rotate-[-90deg]" />
                      <span className="text-sm">Next: {content.process.steps[idx + 1].title}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            💡 Pro Tips for {layer.charAt(0).toUpperCase() + layer.slice(1)}
          </h3>
          <ul className="space-y-3">
            {layer === 'europeans' && (
              <>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Register with your commune within 14 days of arrival - it's mandatory!</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You don't need a job offer for the first 3 months - you can search while in Switzerland.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Consider G permit if you live near the border - it offers tax advantages.</span>
                </li>
              </>
            )}
            {layer === 'americans' && (
              <>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Start document apostille process early - it takes 4-6 weeks from the US.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Apply in January-March for best quota availability.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Negotiate salary of CHF 100k+ to be competitive in the quota system.</span>
                </li>
              </>
            )}
            {layer === 'others' && (
              <>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Quota timing is critical - apply early in the year (January-March) for best chances.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Choose cantons with lower competition - Basel, St. Gallen, or Aargau over Zurich/Geneva.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Consider education pathway - study in Switzerland first, then convert to work permit (no quota needed).</span>
                </li>
              </>
            )}
          </ul>
        </motion.div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href={`/${layer}/requirements`} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-block">
            View Requirements Checklist →
          </Link>
        </div>
      </div>
    </div>
  )
}

