'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowLeft, ArrowRight, Shield, Award, Home, Briefcase, Plane, CreditCard, Star, AlertTriangle, Globe } from 'lucide-react'
import Link from 'next/link'
import { LAYER_CONTENT } from '@/lib/layerContent'
import type { LayerType } from '@/lib/layerLogic'
import LayerHeader from '@/components/layout/LayerHeader'

type PageProps = { params: Promise<{ layer: string }> }

export default function VisasPage({ params }: PageProps) {
  const { layer: layerParam } = use(params)
  const layer = (['europeans', 'americans', 'others'].includes(layerParam) 
    ? layerParam 
    : 'others') as LayerType
  
  const content = LAYER_CONTENT[layer]
  const visas = content.visas.types.filter(v => v.applicable)

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
            {content.visas.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            {layer === 'europeans' ? 'Choose the right permit for your situation' : content.visas.description.split('.')[0]}
          </p>
        </div>

        {/* Visa Types */}
        <div className="space-y-8">
          {visas.map((visa, idx) => (
            <motion.div
              key={idx}
              id={visa.name.toLowerCase().replace(/\s+/g, '-')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              {/* Permit Icon */}
              <div className="relative mb-4 h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                {(() => {
                  const name = visa.name.toLowerCase()
                  if (name.includes('b permit') || name.includes('residence')) {
                    return <Home className="w-20 h-20 text-blue-600" />
                  } else if (name.includes('l permit') || name.includes('short-term')) {
                    return <Briefcase className="w-20 h-20 text-blue-600" />
                  } else if (name.includes('g permit') || name.includes('cross-border')) {
                    return <Plane className="w-20 h-20 text-blue-600" />
                  } else if (name.includes('c permit') || name.includes('settlement')) {
                    return <Award className="w-20 h-20 text-blue-600" />
                  } else if (name.includes('blue card')) {
                    return <CreditCard className="w-20 h-20 text-blue-600" />
                  }
                  return <Shield className="w-20 h-20 text-blue-600" />
                })()}
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {visa.name}
                  </h2>
                  <div className="flex items-center space-x-2 text-blue-600 mb-3">
                    {(() => {
                      const name = visa.name.toLowerCase()
                      if (name.includes('b permit') || name.includes('residence')) {
                        return <Home className="w-4 h-4" />
                      } else if (name.includes('l permit') || name.includes('short-term')) {
                        return <Briefcase className="w-4 h-4" />
                      } else if (name.includes('g permit') || name.includes('cross-border')) {
                        return <Plane className="w-4 h-4" />
                      } else if (name.includes('c permit') || name.includes('settlement')) {
                        return <Award className="w-4 h-4" />
                      } else if (name.includes('blue card')) {
                        return <CreditCard className="w-4 h-4" />
                      }
                      return <Shield className="w-4 h-4" />
                    })()}
                    <span className="text-sm font-medium">{visa.timeline}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {visa.description.split('.')[0]}.
                  </p>
                </div>
              </div>

              <div className="mb-4 bg-blue-50 rounded-lg p-3">
                <h3 className="text-xs font-semibold text-blue-900 mb-2 uppercase tracking-wide">Requirements:</h3>
                <ul className="space-y-1.5">
                  {visa.requirements.slice(0, 3).map((req, ridx) => (
                    <li key={ridx} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{req.split('(')[0]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/${layer}/process`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
              >
                View process <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}

