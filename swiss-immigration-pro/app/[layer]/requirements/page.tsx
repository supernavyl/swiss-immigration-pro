'use client'

import { useState, use } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Circle, Download, FileText, TrendingUp, Star, AlertTriangle, Globe, Target } from 'lucide-react'
import Link from 'next/link'
import { LAYER_CONTENT } from '@/lib/layerContent'
import type { LayerType } from '@/lib/layerLogic'
import LayerHeader from '@/components/layout/LayerHeader'

type PageProps = { params: Promise<{ layer: string }> }

export default function RequirementsPage({ params }: PageProps) {
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
  
  // Dynamic requirements based on layer
  const getRequirements = () => {
    const base = [
      { id: 'passport', label: 'Valid passport (minimum 6 months validity)', required: true },
      { id: 'health', label: 'Health insurance coverage', required: true },
      { id: 'contract', label: 'Employment contract or job offer', required: true },
    ]
    
    if (layer === 'europeans') {
      return [
        ...base,
        { id: 'eu-id', label: 'EU/EFTA identity card or passport', required: true },
        { id: 'registration', label: 'Commune registration form', required: true },
        { id: 'accommodation', label: 'Proof of accommodation', required: true },
        { id: 'financial', label: 'Proof of financial means (if self-employed)', required: false },
      ]
    }
    
    if (layer === 'americans') {
      return [
        ...base,
        { id: 'education', label: 'Educational certificates (apostilled)', required: true },
        { id: 'cv', label: 'Swiss-style CV/resume', required: true },
        { id: 'references', label: 'Professional reference letters', required: true },
        { id: 'criminal', label: 'Criminal background check (if required)', required: false },
        { id: 'salary', label: 'Salary justification (meeting thresholds)', required: true },
      ]
    }
    
    // Others
    return [
      ...base,
      { id: 'education', label: 'Educational certificates (apostilled and translated)', required: true },
      { id: 'cv', label: 'Swiss-style CV/resume', required: true },
      { id: 'references', label: 'Professional reference letters', required: true },
      { id: 'criminal', label: 'Criminal background check', required: true },
      { id: 'salary', label: 'Salary justification (CHF 100k+ recommended)', required: true },
      { id: 'language', label: 'Language certificates (German/French B1+)', required: false },
      { id: 'quota', label: 'Quota availability confirmation', required: true },
    ]
  }
  
  const requirements = getRequirements()
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  
  const handleToggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }
  
  const completedCount = Object.values(checked).filter(Boolean).length
  const progress = (completedCount / requirements.length) * 100

  // Map layer names to LayerHeader format
  const layerForHeader = layer === 'europeans' ? 'eu' : layer === 'americans' ? 'us' : 'other'
  const homeHref = `/${layerForHeader}`

  // Layer-specific badge configuration
  const badge = {
    icon: layer === 'europeans' ? <Star className="w-3.5 h-3.5" /> : layer === 'americans' ? <Target className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />,
    text: layer === 'europeans'
      ? 'EU/EFTA Freedom of Movement'
      : layer === 'americans'
      ? 'US Citizen Priority: Fast-Track Processing'
      : 'Global Citizens Pathway',
    bgColor: layer === 'europeans' ? 'bg-blue-600' : layer === 'americans' ? 'bg-indigo-600' : 'bg-purple-600',
    textColor: 'text-white'
  }

  return (
    <div className="bg-white min-h-screen">
      <LayerHeader
        layer={layerForHeader as 'eu' | 'us' | 'other'}
        homeHref={homeHref}
        customBadge={badge}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${layer}`} className="inline-flex items-center text-blue-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          {/* Requirements Header Image */}
          <div className="relative mb-6 h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden">
            <img 
              src={`/images/${layer}/${layer === 'europeans' ? 'process-registration' : layer === 'americans' ? 'documents-apostille' : 'documents-apostille'}.${layer === 'europeans' ? 'png' : 'png'}`}
              alt={`Swiss Immigration Requirements for ${layer === 'europeans' ? 'EU/EFTA Citizens' : layer === 'americans' ? 'US Citizens' : 'International Citizens'} - Document Checklist`}
              title={`Swiss Immigration Requirements - ${layer === 'europeans' ? 'EU/EFTA' : layer === 'americans' ? 'US' : 'International'} Document Preparation`}
              className="w-full h-full object-cover"
              loading="eager"
              width={1200}
              height={400}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/images/environment/mountains-2982087_1280.jpg'
              }}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Requirements Checklist
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Track your progress preparing for your Swiss immigration application
          </p>
          
          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-4 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-blue-600 h-4 rounded-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{completedCount} of {requirements.length} completed</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-4 mb-8">
          {requirements.map((req, idx) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-6 flex items-start space-x-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => handleToggle(req.id)}
            >
              <div className="flex-shrink-0 mt-1">
                {checked[req.id] ? (
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <label className="text-lg font-semibold text-gray-900 cursor-pointer">
                    {req.label}
                  </label>
                  {req.required && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      Required
                    </span>
                  )}
                </div>
                {layer === 'americans' && req.id === 'education' && (
                  <p className="text-sm text-gray-600 mt-2">
                    💡 US documents need apostille from the Secretary of State. Allow 4-6 weeks for processing.
                  </p>
                )}
                {layer === 'others' && req.id === 'education' && (
                  <p className="text-sm text-gray-600 mt-2">
                    💡 Documents must be apostilled in your home country, then translated if needed. Check embassy requirements.
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Export */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Export Your Checklist
              </h3>
              <p className="text-sm text-gray-600">
                Save your progress and share with your immigration lawyer
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Integration/Language Section for Others Layer */}
        {layer === 'others' && (
          <div className="mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-50">
              <img 
                src="/images/others/integration-language.png"
                alt="Language Integration Requirements for International Citizens - Swiss Immigration"
                title="Language Integration Requirements - International Citizens Swiss Immigration"
                className="w-full h-full object-cover"
                loading="lazy"
                width={1200}
                height={500}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Language Integration</h3>
                  <p className="text-lg opacity-90">B1+ German/French proficiency recommended for better integration and permit approval chances</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Next Steps
          </h3>
          <ol className="space-y-3 list-decimal list-inside text-gray-700">
            <li>Complete all required documents</li>
            <li>Review the <Link href={`/${layer}/process`} className="text-blue-600 hover:underline">application process</Link></li>
            <li>Take the <Link href={`/${layer}/quiz`} className="text-blue-600 hover:underline">follow-up quiz</Link> for personalized recommendations</li>
            <li>Consult with a Swiss immigration lawyer for your specific case</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

