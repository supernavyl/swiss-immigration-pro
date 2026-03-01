'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, FileText, Calculator, Users, MapPin, Sparkles, TrendingUp, Globe, Brain, Zap, type LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  category: 'page' | 'tool' | 'guide' | 'resource'
  icon: LucideIcon
  keywords: string[]
}

const SEARCH_INDEX: SearchResult[] = [
  // Pages
  { id: '1', title: 'Home', description: 'Swiss Immigration Success Platform', url: '/', category: 'page', icon: Sparkles, keywords: ['home', 'main', 'start', 'overview'] },
  { id: '2', title: 'Visas & Permits', description: 'L, B, G permits and requirements', url: '/visas', category: 'page', icon: FileText, keywords: ['visa', 'permit', 'l permit', 'b permit', 'g permit', 'work permit'] },
  { id: '3', title: 'Employment', description: 'Swiss job market and work guides', url: '/employment', category: 'page', icon: Users, keywords: ['employment', 'job', 'work', 'salary', 'cv', 'resume'] },
  { id: '4', title: 'Citizenship', description: 'Path to Swiss citizenship', url: '/citizenship', category: 'page', icon: TrendingUp, keywords: ['citizenship', 'naturalization', 'passport', '10 years', 'swiss citizen'] },
  { id: '5', title: 'US Citizens Guide', description: 'Complete guide for Americans', url: '/us-citizens', category: 'page', icon: MapPin, keywords: ['usa', 'america', 'us citizens', 'americans', 'chf 3450', 'health insurance'] },
  { id: '6', title: 'Canton Information', description: 'Compare Swiss cantons', url: '/cantons', category: 'page', icon: MapPin, keywords: ['canton', 'zurich', 'geneva', 'basel', 'bern', 'zug', 'vaud'] },
  { id: '7', title: 'Pricing Plans', description: 'Choose your path to success', url: '/pricing', category: 'page', icon: TrendingUp, keywords: ['pricing', 'plans', 'subscription', 'cost', 'price', 'payment'] },
  { id: '8', title: 'Dashboard', description: 'Your personal immigration hub', url: '/dashboard', category: 'page', icon: Users, keywords: ['dashboard', 'profile', 'progress', 'account', 'my content'] },
  { id: '9', title: 'FAQ', description: 'Frequently asked questions', url: '/faq', category: 'page', icon: FileText, keywords: ['faq', 'questions', 'help', 'support', 'answers'] },
  { id: '24', title: 'EU/EFTA Citizens', description: 'Freedom of movement pathway', url: '/europeans', category: 'page', icon: Users, keywords: ['eu', 'efta', 'european', 'freedom of movement', 'no quota', '5 years'] },
  { id: '25', title: 'US & Canadian Citizens', description: 'Quota system pathway', url: '/americans', category: 'page', icon: MapPin, keywords: ['us', 'canada', 'american', 'canadian', 'quota', '8,500'] },
  { id: '26', title: 'Third-Country Nationals', description: 'International citizens pathway', url: '/others', category: 'page', icon: Globe, keywords: ['third country', 'international', 'non-eu', 'quota', '10 years'] },
  
  // Tools
  { id: '10', title: 'Cost Calculator', description: 'Calculate living costs by canton', url: '/tools#cost', category: 'tool', icon: Calculator, keywords: ['calculator', 'cost', 'living', 'salary', 'expenses', 'budget'] },
  { id: '11', title: 'Timeline Planner', description: 'Estimate your immigration timeline', url: '/tools#timeline', category: 'tool', icon: Calculator, keywords: ['timeline', 'planner', 'schedule', 'duration', 'how long', 'time'] },
  { id: '12', title: 'Canton Comparison', description: 'Compare cantons side-by-side', url: '/tools#canton', category: 'tool', icon: Calculator, keywords: ['compare', 'comparison', 'canton', 'which canton', 'best canton'] },
  { id: '13', title: 'Region Settings', description: 'Update your region and language preferences', url: '/profile', category: 'tool', icon: Calculator, keywords: ['region', 'language', 'preferences', 'settings', 'location'] },
  
  // Guides
  { id: '14', title: 'L Permit Guide', description: 'Short-term residence permit', url: '/visas#l-permit', category: 'guide', icon: FileText, keywords: ['l permit', 'short term', '1 year', 'temporary'] },
  { id: '15', title: 'B Permit Guide', description: 'Long-term residence permit', url: '/visas#b-permit', category: 'guide', icon: FileText, keywords: ['b permit', 'long term', '5 years', 'residence'] },
  { id: '16', title: 'G Permit Guide', description: 'Cross-border commuter permit', url: '/visas#g-permit', category: 'guide', icon: FileText, keywords: ['g permit', 'cross border', 'commuter', 'frontier'] },
  { id: '17', title: 'Ordinary Naturalization', description: '10-year path to citizenship', url: '/citizenship#ordinary', category: 'guide', icon: FileText, keywords: ['naturalization', '10 years', 'ordinary', 'citizenship path'] },
  { id: '18', title: 'Simplified Naturalization', description: 'Marriage-based citizenship', url: '/citizenship#simplified', category: 'guide', icon: FileText, keywords: ['simplified', 'marriage', 'spouse', '5 years', 'swiss spouse'] },
  { id: '19', title: 'Third Generation', description: 'Accelerated citizenship for Swiss-born', url: '/citizenship#third-gen', category: 'guide', icon: FileText, keywords: ['third generation', 'born in switzerland', 'accelerated'] },
  { id: '20', title: 'Health Insurance', description: 'Mandatory Swiss health insurance', url: '/us-citizens#health', category: 'guide', icon: FileText, keywords: ['health insurance', 'mandatory', '3 months', 'krankenkasse'] },
  
  // Resources
  { id: '21', title: 'CV Templates', description: '20+ Swiss-style CV templates', url: '/resources#cv', category: 'resource', icon: FileText, keywords: ['cv', 'resume', 'template', 'lebenslauf', 'curriculum vitae'] },
  { id: '22', title: 'Resources Library', description: 'Guides, PDFs, and checklists', url: '/resources', category: 'resource', icon: FileText, keywords: ['resources', 'library', 'pdf', 'download', 'checklist'] },
]

export default function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [directAnswer, setDirectAnswer] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [hasAI, setHasAI] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut: Ctrl/Cmd + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // AI-powered search logic
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setAiSuggestion(null)
      setDirectAnswer(null)
      return
    }

    // Debounce search
    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        })

        if (response.ok) {
          const data = await response.json()
          // Map API results back to full SEARCH_INDEX items to get icons
          const resultsWithIcons = (data.results || []).map((apiResult: { id: string }) => {
            const fullItem = SEARCH_INDEX.find(item => item.id === apiResult.id)
            return fullItem || null
          }).filter(Boolean) as SearchResult[]
          setResults(resultsWithIcons)
          setAiSuggestion(data.aiSuggestion || null)
          setDirectAnswer(data.directAnswer || null)
          setHasAI(data.hasAI || false)
        } else {
          // Fallback to keyword search
          const searchTerm = query.toLowerCase()
          const filtered = SEARCH_INDEX.filter((item) => {
            return (
              item.title.toLowerCase().includes(searchTerm) ||
              item.description.toLowerCase().includes(searchTerm) ||
              item.keywords.some((keyword) => keyword.includes(searchTerm))
            )
          })
          setResults(filtered.slice(0, 8))
        }
      } catch (error) {
        console.error('Search error:', error)
        // Fallback to keyword search
        const searchTerm = query.toLowerCase()
        const filtered = SEARCH_INDEX.filter((item) => {
          return (
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.keywords.some((keyword) => keyword.includes(searchTerm))
          )
        })
        setResults(filtered.slice(0, 8))
      } finally {
        setIsSearching(false)
        setSelectedIndex(0)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle navigation with arrow keys
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        window.location.href = results[selectedIndex].url
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'page': return 'bg-blue-100 text-blue-700'
      case 'tool': return 'bg-purple-100 text-purple-700'
      case 'guide': return 'bg-green-100 text-green-700'
      case 'resource': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 100)
        }}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400 text-xs"
        aria-label="Search"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden xl:inline text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Box */}
            <motion.div
              ref={searchRef}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center border-b border-slate-200 dark:border-slate-700 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-900/50">
                  <div className="relative flex-1 flex items-center">
                    {hasAI && (
                      <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 animate-pulse" />
                    )}
                    <Search className={`w-6 h-6 text-slate-400 mr-3 ${isSearching ? 'animate-spin' : ''}`} />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={hasAI ? "Ask anything about Swiss immigration..." : "Search visas, tools, guides, resources..."}
                      className="flex-1 bg-transparent outline-none text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded ml-2"
                      >
                        <X className="w-5 h-5 text-slate-400" />
                      </button>
                    )}
                  </div>
                  <kbd className="ml-2 px-2 py-1 text-xs bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-300 dark:border-slate-600 shadow-sm">
                    ESC
                  </kbd>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  {/* AI Direct Answer */}
                  {directAnswer && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">AI Answer</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{directAnswer}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Suggestion */}
                  {aiSuggestion && (
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-gray-600">Try searching for:</span>
                        <button
                          onClick={() => setQuery(aiSuggestion)}
                          className="text-sm font-semibold text-purple-700 hover:text-purple-800 underline"
                        >
                          {aiSuggestion}
                        </button>
                      </div>
                    </div>
                  )}

                  {isSearching && query.length >= 2 && (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                      <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                        <Brain className="w-12 h-12 text-blue-500 dark:text-blue-400 animate-pulse" />
                      </div>
                      <p className="text-sm">AI is searching...</p>
                    </div>
                  )}

                  {!isSearching && results.length === 0 && query.length >= 2 && (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No results found for &ldquo;{query}&rdquo;</p>
                      <p className="text-sm mt-2">Try searching for visas, tools, or guides</p>
                    </div>
                  )}

                  {results.length === 0 && query.length < 2 && (
                    <div className="p-8">
                      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4">
                        Popular Searches
                      </h3>
                      <div className="space-y-2">
                        {['B Permit', 'Cost Calculator', 'Citizenship', 'US Citizens', 'CV Templates', 'Zurich'].map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="block w-full text-left px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            <Search className="w-4 h-4 inline-block mr-2 text-slate-400" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.map((result, index) => {
                    const Icon = result.icon || FileText // Fallback icon if missing
                    return (
                      <Link
                        key={result.id}
                        href={result.url}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-start p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          index === selectedIndex ? 'bg-blue-50 dark:bg-blue-950/30' : ''
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg ${getCategoryColor(result.category)} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {result.title}
                            </h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(result.category)}`}>
                              {result.category}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {result.description}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* Footer */}
                {(results.length > 0 || directAnswer) && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-800/50 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <kbd className="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-sm">↑↓</kbd>
                        <span className="ml-2">Navigate</span>
                      </span>
                      <span className="flex items-center">
                        <kbd className="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-sm">↵</kbd>
                        <span className="ml-2">Open</span>
                      </span>
                      {hasAI && (
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <Brain className="w-3 h-3" />
                          <span>AI Powered</span>
                        </span>
                      )}
                    </div>
                    <span className="font-medium">{results.length} {results.length === 1 ? 'result' : 'results'}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

