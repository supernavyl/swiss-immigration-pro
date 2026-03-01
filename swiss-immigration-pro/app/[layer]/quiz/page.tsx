'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, CheckCircle, Star, AlertTriangle, Globe } from 'lucide-react'
import Link from 'next/link'
import { LAYER_CONTENT } from '@/lib/layerContent'
import type { LayerType } from '@/lib/layerLogic'
import LayerHeader from '@/components/layout/LayerHeader'

type PageProps = { params: Promise<{ layer: string }> }

export default function LayerQuizPage({ params }: PageProps) {
  const { layer: layerParam } = use(params)
  const router = useRouter()
  const layer = (['europeans', 'americans', 'others'].includes(layerParam)
    ? layerParam
    : 'others') as LayerType

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

  // Redirect to resources page since quiz is removed
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/${layerForHeader}/resources`)
    }, 3000)

    return () => clearTimeout(timer)
  }, [router, layerForHeader])

  return (
    <div className="min-h-screen bg-white">
      <LayerHeader
        layer={layerForHeader as 'eu' | 'us' | 'other'}
        homeHref={homeHref}
        customBadge={badge}
      />

      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-8">
            <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Quiz Removed
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We've replaced our quiz system with automatic region detection. You'll be redirected to your personalized resources in a moment.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your Region: {layer.charAt(0).toUpperCase() + layer.slice(1)}
            </h3>
            <p className="text-gray-600">
              Based on your location, we've tailored content specifically for your immigration pathway.
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              href={`/${layerForHeader}/resources`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Go to Resources Now</span>
            </Link>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}

