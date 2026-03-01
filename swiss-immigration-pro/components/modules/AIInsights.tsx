'use client'

import { useState } from 'react'
import { Sparkles, Loader2, X, Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AIInsight {
  type: 'tip' | 'warning' | 'success' | 'info'
  title: string
  content: string
  relevance: number
}

interface AIInsightsProps {
  sectionContent: string
  sectionTitle: string
  moduleTitle: string
  onClose?: () => void
}

export default function AIInsights({ sectionContent, sectionTitle, moduleTitle, onClose }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const generateInsights = async () => {
    setLoading(true)
    setIsExpanded(true)

    try {
      // Simulate AI insight generation
      // In production, this would call your AI API
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generate contextual insights based on content
      const generatedInsights: AIInsight[] = [
        {
          type: 'tip',
          title: 'Key Action Item',
          content: 'Based on this section, ensure you have all required documents prepared before applying. Most applications fail due to missing documentation.',
          relevance: 95
        },
        {
          type: 'warning',
          title: 'Important Timeline',
          content: 'Quota applications are time-sensitive. Submit early in the year (January-March) for best chances of approval.',
          relevance: 88
        },
        {
          type: 'success',
          title: 'Success Strategy',
          content: 'Cantons like Basel-Stadt and Zug have higher approval rates (40%+) for non-EU applicants. Consider these if applicable.',
          relevance: 82
        },
        {
          type: 'info',
          title: 'Legal Reference',
          content: 'All requirements are based on AuG (Foreign Nationals Act) and VZAE (Implementation Ordinance). Keep these legal references handy.',
          relevance: 75
        }
      ]

      setInsights(generatedInsights)
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="w-5 h-5" />
      case 'warning':
        return <AlertCircle className="w-5 h-5" />
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'info':
        return <TrendingUp className="w-5 h-5" />
    }
  }

  const getColorClasses = (type: AIInsight['type']) => {
    switch (type) {
      case 'tip':
        return 'bg-yellow-50 border-yellow-600 text-yellow-900'
      case 'warning':
        return 'bg-orange-50 border-orange-600 text-orange-900'
      case 'success':
        return 'bg-green-50 border-green-600 text-green-900'
      case 'info':
        return 'bg-blue-50 border-blue-600 text-blue-900'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-24 left-4 bg-white border-2 border-blue-600 rounded-xl shadow-2xl z-50 max-w-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-sm">AI Insights</h3>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <button
              onClick={generateInsights}
              disabled={loading}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Loading...' : 'Generate'}
            </button>
          )}
          <button
            onClick={() => {
              setIsExpanded(!isExpanded)
              if (!isExpanded && insights.length === 0) {
                generateInsights()
              }
            }}
            className="text-white hover:text-gray-200 transition-colors"
          >
            {isExpanded ? '−' : '+'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 max-h-96 overflow-y-auto space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Analyzing content...</span>
                </div>
              ) : insights.length > 0 ? (
                insights
                  .sort((a, b) => b.relevance - a.relevance)
                  .map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border-2 ${getColorClasses(insight.type)}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">{getIcon(insight.type)}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1">{insight.title}</h4>
                          <p className="text-xs leading-relaxed">{insight.content}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-current rounded-full"
                                style={{ width: `${insight.relevance}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold">{insight.relevance}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Click "Generate" to get AI-powered insights about this section
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}





