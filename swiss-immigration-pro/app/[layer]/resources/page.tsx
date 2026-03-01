'use client'

import { useState, useMemo, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BookOpen, Clock, Tag, ArrowRight, FileText, Scale, Users, TrendingUp, Briefcase, DollarSign, MapPin, Route, Globe, Star, AlertTriangle, Search, X, Sparkles, Filter } from 'lucide-react'
import Link from 'next/link'
import { LAYER_CONTENT } from '@/lib/layerContent'
import { useLayerContent } from '@/lib/i18n/useTranslation'
import type { LayerType } from '@/lib/layerLogic'
import LayerHeader from '@/components/layout/LayerHeader'

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

type PageProps = { params: Promise<{ layer: string }> }

export default function ResourcesPage({ params }: PageProps) {
  const { layer: layerParam } = use(params)
  const layer = (['europeans', 'americans', 'others'].includes(layerParam)
    ? layerParam
    : 'others') as LayerType

  const content = useLayerContent(layer)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAISuggestions, setShowAISuggestions] = useState(false)

  // Generate slug from title
  const getResourceSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  // Map layer names to LayerHeader format
  const layerForHeader = layer === 'europeans' ? 'eu' : layer === 'americans' ? 'us' : 'other'
  const homeHref = `/${layerForHeader}`

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = new Set(content.resources.posts.map(post => post.category))
    return Array.from(categories)
  }, [content.resources.posts])

  // AI-powered suggestions based on layer and search query
  const aiSuggestions = useMemo(() => {
    const suggestions = []
    const queryLower = searchQuery.toLowerCase()
    
    if (layer === 'europeans') {
      if (!queryLower || queryLower.includes('permit') || queryLower.includes('visa')) {
        suggestions.push({
          icon: FileText,
          title: 'EU/EFTA Permit Guide',
          description: 'Complete guide to B and L permits for EU citizens',
          category: 'Permits & Visas',
          relevance: 'high'
        })
      }
      if (!queryLower || queryLower.includes('citizenship') || queryLower.includes('naturalization')) {
        suggestions.push({
          icon: Star,
          title: '5-Year Citizenship Path',
          description: 'Your accelerated path to Swiss citizenship as an EU citizen',
          category: 'Citizenship',
          relevance: 'high'
        })
      }
      if (!queryLower || queryLower.includes('registration') || queryLower.includes('commune')) {
        suggestions.push({
          icon: MapPin,
          title: 'Commune Registration Guide',
          description: 'Step-by-step guide to registering with your local commune',
          category: 'Legal Requirements',
          relevance: 'medium'
        })
      }
    } else if (layer === 'americans') {
      if (!queryLower || queryLower.includes('quota') || queryLower.includes('permit')) {
        suggestions.push({
          icon: AlertTriangle,
          title: '2025 Quota System Guide',
          description: 'Understanding the annual quota limits and application timing',
          category: 'Permits & Visas',
          relevance: 'high'
        })
      }
      if (!queryLower || queryLower.includes('health') || queryLower.includes('insurance')) {
        suggestions.push({
          icon: Briefcase,
          title: 'Health Insurance Requirements',
          description: 'Mandatory health insurance for US citizens in Switzerland',
          category: 'Legal Requirements',
          relevance: 'high'
        })
      }
      if (!queryLower || queryLower.includes('salary') || queryLower.includes('minimum')) {
        suggestions.push({
          icon: DollarSign,
          title: 'Minimum Salary Requirements',
          description: 'CHF 3,450/month minimum for US citizens - complete breakdown',
          category: 'Employment',
          relevance: 'high'
        })
      }
    } else {
      if (!queryLower || queryLower.includes('quota') || queryLower.includes('permit')) {
        suggestions.push({
          icon: Globe,
          title: 'Third-Country National Permits',
          description: 'Complete guide to permits for non-EU citizens',
          category: 'Permits & Visas',
          relevance: 'high'
        })
      }
      if (!queryLower || queryLower.includes('citizenship') || queryLower.includes('10 year')) {
        suggestions.push({
          icon: TrendingUp,
          title: '10-Year Citizenship Path',
          description: 'Your complete roadmap to Swiss citizenship',
          category: 'Citizenship',
          relevance: 'high'
        })
      }
    }

    // General suggestions based on search query
    if (queryLower.includes('document') || queryLower.includes('requirement')) {
      suggestions.push({
        icon: FileText,
        title: 'Document Checklist',
        description: 'Complete list of required documents for your application',
        category: 'Legal Requirements',
        relevance: 'high'
      })
    }

    if (queryLower.includes('job') || queryLower.includes('employment') || queryLower.includes('work')) {
      suggestions.push({
        icon: Briefcase,
        title: 'Employment Guide',
        description: 'Finding work and understanding Swiss employment laws',
        category: 'Employment',
        relevance: 'high'
      })
    }

    return suggestions.slice(0, 3) // Show top 3 suggestions
  }, [layer, searchQuery])

  // Filter resources based on search and category
  const filteredResources = useMemo(() => {
    let filtered = content.resources.posts

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(queryLower) ||
        post.excerpt.toLowerCase().includes(queryLower) ||
        post.category.toLowerCase().includes(queryLower)
      )
    }

    return filtered
  }, [content.resources.posts, selectedCategory, searchQuery])

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
        <div className="mb-12">
          <Link href={`/${layer}`} className="inline-flex items-center text-blue-600 hover:underline mb-4 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
          {/* Resources Header Image */}
          <div className="relative mb-6 h-64 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={`/images/${layer}/lifestyle-${layer === 'europeans' ? 'city' : layer === 'americans' ? 'us-family' : 'integration'}.png`}
              alt={`Swiss Immigration Resources for ${layer === 'europeans' ? 'EU/EFTA Citizens' : layer === 'americans' ? 'US Citizens' : 'International Citizens'} - Guides and Information`}
              title={`Swiss Immigration Resources - ${layer === 'europeans' ? 'EU/EFTA' : layer === 'americans' ? 'US' : 'International'} Immigration Guides`}
              className="w-full h-full object-cover"
              loading="eager"
              width={1200}
              height={500}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {content.resources.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {content.resources.description}
          </p>
        </div>

        {/* Modern Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowAISuggestions(e.target.value.length > 0)
              }}
              onFocus={() => setShowAISuggestions(searchQuery.length > 0)}
              placeholder="Search resources by title, category, or keywords..."
              className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm hover:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setShowAISuggestions(false)
                }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>

          {/* AI Suggestions Dropdown */}
          <AnimatePresence>
            {showAISuggestions && aiSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 bg-white border-2 border-blue-100 rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">AI-Powered Suggestions</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {aiSuggestions.map((suggestion, idx) => {
                    const Icon = suggestion.icon
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(suggestion.title)
                          setShowAISuggestions(false)
                        }}
                        className="w-full p-4 text-left hover:bg-blue-50 transition-colors flex items-start space-x-3 group"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {suggestion.title}
                            </h4>
                            {suggestion.relevance === 'high' && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                Highly Relevant
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{suggestion.description}</p>
                          <span className="inline-block mt-2 text-xs text-blue-600 font-medium">
                            {suggestion.category}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Resources
            </button>
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        {searchQuery || selectedCategory ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-sm text-gray-600"
          >
            Found <span className="font-semibold text-blue-600">{filteredResources.length}</span> resource{filteredResources.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </motion.div>
        ) : null}

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gray-50 rounded-2xl"
          >
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No resources found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory(null)
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((post, idx) => {
            const resourceSlug = getResourceSlug(post.title)
            return (
              <motion.article
                key={idx}
                id={post.title.toLowerCase().replace(/\s+/g, '-')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Available" />
                </div>
                
                {/* Resource Image or Icon */}
                <div className="relative mb-4 h-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl overflow-hidden group-hover:from-blue-100 group-hover:via-indigo-100 group-hover:to-purple-100 transition-all duration-300">
                  {(() => {
                    const categoryLower = post.category.toLowerCase()
                    if (categoryLower.includes('permit') || categoryLower.includes('visa')) {
                      return (
                        <img 
                          src={`/images/${layer}/permits-${layer === 'europeans' ? 'eu-types' : layer === 'americans' ? 'quota-system' : 'international'}.${layer === 'europeans' ? 'png' : layer === 'americans' ? 'jpeg' : 'jpeg'}`}
                          alt={`${post.title} - ${layer === 'europeans' ? 'EU/EFTA' : layer === 'americans' ? 'US' : 'International'} Permits`}
                          className="w-full h-full object-cover opacity-60"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      )
                    }
                    if (categoryLower.includes('document') || categoryLower.includes('requirement')) {
                      return (
                        <img 
                          src={`/images/${layer}/${layer === 'europeans' ? 'process-registration' : 'documents-apostille'}.png`}
                          alt={`${post.title} - Documents`}
                          className="w-full h-full object-cover opacity-60"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      )
                    }
                    const IconComponent = getCategoryIcon(post.category)
                    return (
                      <div className="flex items-center justify-center h-full">
                      <IconComponent className="w-12 h-12 text-blue-600" />
                      </div>
                    )
                  })()}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-6 line-clamp-3 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="pt-4 border-t border-gray-200 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>5 min read</span>
                    </div>
                    <Link
                      href={`/${layer}/resources/${resourceSlug}`}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm flex items-center space-x-2 px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                    >
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            )
          })}
          </div>
        )}

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Official Resources
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li>
                <a href="https://www.sem.admin.ch/sem/en/home.html" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-600 transition-colors group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:underline">State Secretariat for Migration (SEM) - Official Source</span>
                </a>
              </li>
              <li>
                <a href="https://www.fedlex.admin.ch/en/cc/142/142_20_142_201" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-600 transition-colors group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:underline">Foreign Nationals Act (AuG, SR 142.20) on Fedlex</span>
                </a>
              </li>
              <li>
                <a href="https://www.ch.ch" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-600 transition-colors group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:underline">CH.ch - Official Portal</span>
                </a>
              </li>
              <li>
                <a href="https://www.fedlex.admin.ch" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-600 transition-colors group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:underline">Fedlex - Federal Law Database</span>
                </a>
              </li>
              <li>
                <a href="https://www.swisslex.ch" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-600 transition-colors group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:underline">Swisslex - Legal Database</span>
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Get Professional Help
              </h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Consider consulting with a certified Swiss immigration lawyer for personalized advice tailored to your specific situation.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-800 mb-4">
            <strong>Disclaimer:</strong> General information only (updated Nov 2025). Not legal advice. 
            Consult with a certified Swiss immigration lawyer for your specific case. 
            Laws and regulations may change. Verify all information with official sources.
          </p>
          <p className="text-sm text-gray-800">
            <strong>Official Sources:</strong> This information is based on the Foreign Nationals Act (AuG, SR 142.20), 
            the Foreign Nationals and Integration Ordinance (VZAE, SR 142.201), the Agreement on the Free Movement of Persons (FMPA), 
            and the Citizenship Act (StAG, SR 141.0). Always verify current regulations at <a href="https://www.fedlex.admin.ch" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Fedlex.admin.ch</a> and 
            <a href="https://www.sem.admin.ch" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> SEM.admin.ch</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

