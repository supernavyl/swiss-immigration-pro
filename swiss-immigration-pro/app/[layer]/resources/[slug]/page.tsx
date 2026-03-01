'use client'

import { useState, use } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Tag, BookOpen, CheckCircle, AlertCircle, FileText, ExternalLink, ChevronDown, ChevronUp, Info, Award, TrendingUp, Users, Calendar, Scale, Briefcase, DollarSign, MapPin, Route, Globe, Star, AlertTriangle } from 'lucide-react'

// Icon mapping for resource categories
const getCategoryIcon = (category: string) => {
  const categoryLower = category.toLowerCase()
  if (categoryLower.includes('permit')) return FileText
  if (categoryLower.includes('comparison')) return Scale
  if (categoryLower.includes('citizenship')) return Users
  if (categoryLower.includes('family')) return Users
  if (categoryLower.includes('legal')) return Scale
  if (categoryLower.includes('strategy')) return TrendingUp
  if (categoryLower.includes('career')) return Briefcase
  if (categoryLower.includes('finance')) return DollarSign
  if (categoryLower.includes('embassy')) return MapPin
  if (categoryLower.includes('country')) return Globe
  if (categoryLower.includes('pathway')) return Route
  return BookOpen // Default icon
}
import Link from 'next/link'
import { LAYER_CONTENT } from '@/lib/layerContent'
import { useLayerContent } from '@/lib/i18n/useTranslation'
import type { LayerType } from '@/lib/layerLogic'
import LayerHeader from '@/components/layout/LayerHeader'

type PageProps = { params: Promise<{ layer: string; slug: string }> }

export default function ResourceDetailPage({ params }: PageProps) {
  const { layer: layerParam, slug } = use(params)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  
  const layer = (['europeans', 'americans', 'others'].includes(layerParam)
    ? layerParam
    : 'others') as LayerType

  const content = useLayerContent(layer)

  // Find the resource by slug
  const getResourceSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  const resource = content.resources.posts.find(
    post => getResourceSlug(post.title) === slug
  )

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

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  // Parse markdown-like content and format it professionally
  const formatContent = (text: string) => {
    if (!text) return null
    
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    let currentList: string[] = []
    let inList = false
    let sectionCount = 0
    let currentSectionContent: JSX.Element[] = []
    let currentSectionId = ''

    const closeList = () => {
      if (inList && currentList.length > 0) {
        const listItems = currentList.map((item, i) => {
          const cleanItem = item.replace(/^[-*]\s*/, '').trim()
          const hasBold = cleanItem.includes('**')
          return (
            <li key={i} className="flex items-start space-x-2 py-2">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span 
                className="text-gray-700"
                dangerouslySetInnerHTML={{ 
                  __html: cleanItem
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
                    .replace(/(required|mandatory|obligatory|must|essential)/gi, '<span class="font-bold text-red-600">$1</span>')
                    .replace(/(\d+\s*(?:years?|months?|weeks?|days?))/gi, '<span class="font-semibold text-blue-600">$1</span>')
                    .replace(/(CHF\s*[\d,]+)/gi, '<span class="font-bold text-green-600">$1</span>')
                }} 
              />
            </li>
          )
        })
        currentSectionContent.push(
          <ul key={`list-${sectionCount}`} className="space-y-2 mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
            {listItems}
          </ul>
        )
        currentList = []
        inList = false
      }
    }

    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      
      // Main title
      if (trimmed.startsWith('# ')) {
        closeList()
        if (currentSectionContent.length > 0 && currentSectionId) {
          elements.push(
            <motion.div key={currentSectionId} className="mt-4">
              {currentSectionContent}
            </motion.div>
          )
          currentSectionContent = []
        }
        elements.push(
          <h2 key={idx} className="text-3xl font-bold text-gray-900 mt-10 mb-6 pb-3 border-b-2 border-blue-200">
            {trimmed.substring(2)}
          </h2>
        )
      } 
      // Section headers (interactive)
      else if (trimmed.startsWith('## ')) {
        closeList()
        if (currentSectionContent.length > 0 && currentSectionId) {
          elements.push(
            <motion.div key={currentSectionId} className="mt-4">
              {currentSectionContent}
            </motion.div>
          )
        }
        sectionCount++
        currentSectionId = `section-${sectionCount}`
        currentSectionContent = []
        const isExpanded = expandedSections.has(currentSectionId)
        const sectionTitle = trimmed.substring(3)
        elements.push(
          <div key={idx} className="mt-8 mb-4">
            <button
              onClick={() => toggleSection(currentSectionId)}
              className="w-full flex items-center justify-between text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg p-5 transition-all shadow-sm hover:shadow-md"
            >
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Info className="w-6 h-6 text-blue-600 mr-3" />
                {sectionTitle}
              </h3>
              {isExpanded ? (
                <ChevronUp className="w-6 h-6 text-blue-600" />
              ) : (
                <ChevronDown className="w-6 h-6 text-blue-600" />
              )}
            </button>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                {currentSectionContent}
              </motion.div>
            )}
          </div>
        )
      } 
      // Subsection headers
      else if (trimmed.startsWith('### ')) {
        closeList()
        const subsectionTitle = trimmed.substring(4)
        const content = (
          <h4 key={idx} className="text-xl font-bold text-gray-900 mt-6 mb-4 flex items-center bg-blue-50 p-3 rounded-lg">
            <Award className="w-5 h-5 text-blue-600 mr-2" />
            {subsectionTitle}
          </h4>
        )
        if (currentSectionId && expandedSections.has(currentSectionId)) {
          currentSectionContent.push(content)
        } else {
          elements.push(content)
        }
      } 
      // List items
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) inList = true
        currentList.push(trimmed)
      } 
      // Bold callout
      else if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('[')) {
        closeList()
        const boldText = trimmed.substring(2, trimmed.length - 2)
        const content = (
          <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-lg mb-6 shadow-sm">
            <p className="text-lg font-bold text-gray-900 leading-relaxed">
              {boldText}
            </p>
          </div>
        )
        if (currentSectionId && expandedSections.has(currentSectionId)) {
          currentSectionContent.push(content)
        } else {
          elements.push(content)
        }
      } 
      // Official sources
      else if (trimmed.includes('Official') || trimmed.includes('**Official')) {
        closeList()
        const sourceText = trimmed.replace(/\*\*/g, '').replace(/^[-*]\s*/, '')
        const content = (
          <div key={idx} className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg mb-6 shadow-sm">
            <p className="text-sm font-bold text-blue-900 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Official Sources:
            </p>
            <div 
              className="text-sm text-gray-700 space-y-1"
              dangerouslySetInnerHTML={{ 
                __html: sourceText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline font-medium inline-flex items-center">$1 <svg class="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>') 
              }} 
            />
          </div>
        )
        if (currentSectionId && expandedSections.has(currentSectionId)) {
          currentSectionContent.push(content)
        } else {
          elements.push(content)
        }
      } 
      // Regular paragraphs
      else if (trimmed && !trimmed.startsWith('|')) {
        closeList()
        const formattedText = trimmed
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
          .replace(/(\d+\s*(?:years?|months?|weeks?|days?))/gi, '<span class="font-semibold text-blue-600">$1</span>')
          .replace(/(CHF\s*[\d,]+)/gi, '<span class="font-bold text-green-600">$1</span>')
          .replace(/(required|mandatory|obligatory|must|essential)/gi, '<span class="font-bold text-red-600">$1</span>')
        
        const content = (
          <p 
            key={idx} 
            className="text-gray-700 leading-relaxed mb-4 text-lg" 
            dangerouslySetInnerHTML={{ __html: formattedText }} 
          />
        )
        if (currentSectionId && expandedSections.has(currentSectionId)) {
          currentSectionContent.push(content)
        } else {
          elements.push(content)
        }
      }
    })

    // Close any remaining list and section
    closeList()
    if (currentSectionContent.length > 0 && currentSectionId) {
      if (expandedSections.has(currentSectionId)) {
        elements.push(
          <motion.div key={currentSectionId} className="mt-4">
            {currentSectionContent}
          </motion.div>
        )
      }
    }

    return elements
  }

  if (!resource) {
    return (
      <div className="bg-white min-h-screen">
        <LayerHeader
          layer={layerForHeader as 'eu' | 'us' | 'other'}
          homeHref={homeHref}
          customBadge={badge}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Resource Not Found</h1>
          <p className="text-gray-600 mb-6">The resource you're looking for doesn't exist.</p>
          <Link href={`/${layerForHeader}/resources`} className="text-blue-600 hover:underline">
            ← Back to Resources
          </Link>
        </div>
      </div>
    )
  }

  const formattedContent = resource.content ? formatContent(resource.content) : null

  return (
    <div className="bg-white min-h-screen">
      <LayerHeader
        layer={layerForHeader as 'eu' | 'us' | 'other'}
        homeHref={homeHref}
        customBadge={badge}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href={`/${layerForHeader}/resources`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Resources
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide bg-blue-50 px-3 py-1 rounded-full">
              {resource.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {resource.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-medium">5 min read</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4 text-blue-600" />
              <span>{layer === 'europeans' ? 'EU/EFTA Citizens' : layer === 'americans' ? 'US/Canadian Citizens' : 'International Citizens'}</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Expert Guide</span>
            </div>
          </div>

          {/* Resource Icon */}
          <div className="relative mb-8 h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center shadow-lg">
            {(() => {
              const IconComponent = getCategoryIcon(resource.category)
              return (
                <IconComponent className="w-20 h-20 text-blue-600" />
              )
            })()}
          </div>
        </motion.div>

        {/* Key Highlights Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Key Takeaway</h3>
              <p className="text-blue-50 leading-relaxed">
                {resource.excerpt}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          {formattedContent ? (
            <div className="space-y-6">
              {formattedContent}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-xl text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
                <p className="font-semibold text-gray-900 mb-2">Overview</p>
                {resource.excerpt}
              </div>

              <div className="bg-white border-2 border-blue-100 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-6 h-6 text-blue-600 mr-2" />
                  Comprehensive Information
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This comprehensive guide provides detailed information about <strong className="font-bold text-gray-900">{resource.title.toLowerCase()}</strong> 
                  for <strong className="font-bold text-gray-900">{layer === 'europeans' ? 'EU/EFTA citizens' : layer === 'americans' ? 'US and Canadian citizens' : 'international citizens'}</strong> 
                  seeking to immigrate to Switzerland.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
                  <p className="text-sm font-semibold text-yellow-900 mb-1">Important Note</p>
                  <p className="text-sm text-yellow-800">
                    This information is for general guidance only. <strong className="font-bold">Always consult with a certified Swiss immigration lawyer</strong> for your specific case.
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  For more detailed information and personalized guidance, consider upgrading to our 
                  <Link href="/pricing" className="text-blue-600 hover:underline font-semibold mx-1">Advanced Pack</Link>
                  which includes comprehensive resources, expert support, and step-by-step guidance.
                </p>
              </div>
            </div>
          )}
        </motion.article>

        {/* Interactive Requirements Checklist */}
        {resource.content && resource.content.toLowerCase().includes('requirement') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-white border-2 border-blue-200 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 text-blue-600 mr-2" />
              Quick Checklist
            </h3>
            <div className="space-y-3">
              {resource.content
                .split('\n')
                .filter(line => line.includes('**') || line.includes('-'))
                .slice(0, 5)
                .map((item, idx) => {
                  const cleanItem = item.replace(/^[-*]\s*\*\*|\*\*/g, '').trim()
                  if (!cleanItem) return null
                  return (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        {cleanItem.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')}
                      </span>
                    </div>
                  )
                })}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-blue-600 rounded-full p-3">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Need More Detailed Guidance?
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Get comprehensive guidance, expert support, and personalized assistance with our premium packs. 
                Access detailed step-by-step guides, document templates, and direct support from immigration specialists.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/pricing"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center"
                >
                  View Pricing Plans
                  <TrendingUp className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href={`/${layerForHeader}`}
                  className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-3 rounded-lg transition-all border-2 border-blue-300 shadow-sm hover:shadow-md inline-flex items-center justify-center"
                >
                  Explore {layer === 'europeans' ? 'EU/EFTA' : layer === 'americans' ? 'US/Canadian' : 'International'} Pathway
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
            Related Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.resources.posts
              .filter(post => getResourceSlug(post.title) !== slug)
              .slice(0, 2)
              .map((post, idx) => {
                const postSlug = getResourceSlug(post.title)
                return (
                  <Link
                    key={idx}
                    href={`/${layerForHeader}/resources/${postSlug}`}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <Tag className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium text-sm">
                      Read more
                      <ArrowLeft className="w-4 h-4 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}


