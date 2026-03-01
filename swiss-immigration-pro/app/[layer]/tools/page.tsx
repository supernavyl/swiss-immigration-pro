'use client'

import { use } from 'react'
import ToolsContent from '@/components/tools/ToolsContent'
import LayerHeader from '@/components/layout/LayerHeader'
import { Globe, Star, AlertTriangle, Target } from 'lucide-react'

type PageProps = { params: Promise<{ layer: string }> }

export default function LayerToolsPage({ params }: PageProps) {
  const { layer: layerParam } = use(params)
  const layer = (layerParam === 'eu' || layerParam === 'us' || layerParam === 'other') 
    ? layerParam as 'eu' | 'us' | 'other'
    : 'eu' // fallback to eu if invalid

  // Layer-specific badge configuration
  const badge = {
    icon: layer === 'eu' ? <Star className="w-3.5 h-3.5" /> : layer === 'us' ? <Target className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />,
    text: layer === 'eu'
      ? 'EU/EFTA Freedom of Movement'
      : layer === 'us'
      ? 'US Citizen Priority: Fast-Track Processing'
      : 'Global Citizens Pathway',
    bgColor: layer === 'eu' ? 'bg-blue-600' : layer === 'us' ? 'bg-indigo-600' : 'bg-purple-600',
    textColor: 'text-white'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <LayerHeader
        layer={layer}
        homeHref={`/${layer}`}
        customBadge={badge}
      />
      <ToolsContent layer={layer} />
    </div>
  )
}

