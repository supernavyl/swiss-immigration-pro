'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, BookOpen, CheckCircle, ArrowRight, Search, X, Sparkles, Filter, Zap, Briefcase, Star, Globe, TrendingUp, Users, MapPin, Grid3x3, List, SortAsc, SortDesc, Settings, Heart, Bookmark, Share2, Eye, Clock, TrendingDown, Award, Lightbulb, Target, BarChart3, Calendar, AlertTriangle, DollarSign, Scale, Shield, Building2, Languages, MessageCircle, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import ExitIntentPopup from '@/components/marketing/ExitIntentPopup'

// Define all resources for search - Enhanced with comprehensive content
const FREE_DOWNLOADS = [
  {
    id: 'immigration-checklist',
    title: 'Complete Swiss Immigration Checklist',
    description: 'Master checklist covering all steps from visa application to permanent residency. Includes document requirements, timelines, and critical deadlines for EU/EFTA, US, and third-country nationals.',
    slug: 'immigration-checklist',
    color: 'blue',
    icon: CheckCircle,
    category: 'Checklist',
    type: 'free',
    downloads: '24.8k',
    updated: '2025'
  },
  {
    id: 'top-10-mistakes',
    title: 'Top 10 Critical Mistakes to Avoid',
    description: 'Learn from real immigration cases. Common errors that delay or reject applications, including document issues, timing mistakes, and legal pitfalls. Save time and money.',
    slug: 'top-10-mistakes',
    color: 'red',
    icon: AlertTriangle,
    category: 'Guide',
    type: 'free',
    downloads: '18.5k',
    updated: '2025'
  },
  {
    id: 'canton-comparison',
    title: 'Complete Canton Comparison Guide',
    description: 'Comprehensive analysis of all 26 Swiss cantons: taxes, cost of living, job markets, schools, healthcare, and quality of life. Find your perfect Swiss home with data-driven insights.',
    slug: 'canton-comparison',
    color: 'purple',
    icon: MapPin,
    category: 'Guide',
    type: 'free',
    downloads: '22.3k',
    updated: '2025'
  },
  {
    id: 'cv-template-pack',
    title: 'Swiss CV Template Pack (5 Templates)',
    description: 'Professional ATS-optimized CV templates designed for Swiss employers. Includes formats for tech, finance, healthcare, and general positions. Follows Swiss CV standards.',
    slug: 'cv-template-pack',
    color: 'green',
    icon: FileText,
    category: 'Template',
    type: 'free',
    downloads: '31.2k',
    updated: '2025'
  },
  {
    id: 'permit-types-guide',
    title: 'Swiss Permit Types Explained',
    description: 'Complete guide to L, B, C, and G permits. Eligibility requirements, application processes, renewal procedures, and pathways to permanent residency for each permit type.',
    slug: 'permit-types-guide',
    color: 'indigo',
    icon: Shield,
    category: 'Guide',
    type: 'free',
    downloads: '19.7k',
    updated: '2025'
  },
  {
    id: 'health-insurance-guide',
    title: 'Swiss Health Insurance Guide',
    description: 'Mandatory health insurance explained: choosing providers, understanding premiums, deductibles, and coverage. Essential for all permit holders and residents.',
    slug: 'health-insurance-guide',
    color: 'teal',
    icon: Building2,
    category: 'Guide',
    type: 'free',
    downloads: '16.4k',
    updated: '2025'
  },
  {
    id: 'tax-guide-basics',
    title: 'Swiss Tax System Basics',
    description: 'Understanding Swiss taxation: income tax, wealth tax, cantonal differences, deductions, and filing requirements. Essential for all residents and permit holders.',
    slug: 'tax-guide-basics',
    color: 'amber',
    icon: DollarSign,
    category: 'Guide',
    type: 'free',
    downloads: '14.9k',
    updated: '2025'
  },
  {
    id: 'language-requirements',
    title: 'Language Requirements Guide',
    description: 'Complete overview of language requirements for permits, citizenship, and integration. A1 to C1 levels explained, recognized certificates, and preparation resources.',
    slug: 'language-requirements',
    color: 'rose',
    icon: Languages,
    category: 'Guide',
    type: 'free',
    downloads: '13.6k',
    updated: '2025'
  }
]

const EMPLOYMENT_CHECKLISTS = [
  { 
    id: 'full-employment-checklist',
    title: 'Complete Employment Permit Application Checklist', 
    type: 'PDF Checklist', 
    downloads: '15.8k',
    color: 'blue',
    category: 'Employment',
    resourceType: 'checklist',
    description: 'Step-by-step checklist for B/L permit applications. All required documents, forms, and procedures for EU/EFTA and third-country nationals.'
  },
  { 
    id: 'employment-document-checklist',
    title: 'Essential Documents Checklist', 
    type: 'PDF Checklist', 
    downloads: '18.4k',
    color: 'purple',
    category: 'Employment',
    resourceType: 'checklist',
    description: 'Complete list of all documents needed: passports, diplomas, employment contracts, health insurance, and certified translations. Never miss a document again.'
  },
  { 
    id: 'employment-permit-renewal-checklist',
    title: 'Permit Renewal & Extension Guide', 
    type: 'PDF Checklist', 
    downloads: '12.7k',
    color: 'green',
    category: 'Employment',
    resourceType: 'checklist',
    description: 'Timeline and requirements for renewing B permits, extending L permits, and transitioning between permit types. Critical deadlines included.'
  },
  { 
    id: 'employment-integration-checklist',
    title: 'Integration Requirements Checklist', 
    type: 'PDF Checklist', 
    downloads: '11.2k',
    color: 'orange',
    category: 'Employment',
    resourceType: 'checklist',
    description: 'Integration requirements for permanent residency and citizenship: language certificates, community participation, and cultural integration steps.'
  },
  { 
    id: 'employment-tax-benefits-checklist',
    title: 'Tax & Social Benefits Guide', 
    type: 'PDF Checklist', 
    downloads: '13.9k',
    color: 'indigo',
    category: 'Employment',
    resourceType: 'checklist',
    description: 'Understanding Swiss social security, unemployment benefits, pension contributions, and tax obligations for employees and self-employed workers.'
  },
  { 
    id: 'job-search-checklist',
    title: 'Swiss Job Search Strategy Checklist', 
    type: 'PDF Checklist', 
    downloads: '16.3k',
    color: 'teal',
    category: 'Employment',
    resourceType: 'checklist',
    description: 'Complete job search guide: Swiss job market insights, application strategies, interview preparation, and networking tips for international candidates.'
  },
  { 
    id: 'salary-negotiation-guide',
    title: 'Salary Negotiation & Benchmarking Guide', 
    type: 'PDF Guide', 
    downloads: '14.1k',
    color: 'amber',
    category: 'Employment',
    resourceType: 'checklist',
    description: 'Swiss salary benchmarks by industry, experience level, and canton. Negotiation strategies and understanding total compensation packages.'
  },
  { 
    id: 'work-permit-quota-guide',
    title: '2025 Quota System & Timing Guide', 
    type: 'PDF Guide', 
    downloads: '19.6k',
    color: 'red',
    category: 'Employment',
    resourceType: 'checklist',
    description: 'Critical guide for third-country nationals: understanding annual quotas, application timing, priority processing, and maximizing approval chances.'
  }
]

const GENERAL_RESOURCES = [
  { 
    id: 'basic-immigration-guide',
    title: 'Complete Swiss Immigration Guide 2025', 
    type: 'PDF Guide', 
    downloads: '28.7k',
    category: 'Guide',
    resourceType: 'general',
    description: 'Comprehensive 80-page guide covering all aspects of Swiss immigration: visa types, permit processes, legal requirements, and step-by-step procedures for all nationalities.'
  },
  { 
    id: 'swiss-salary-benchmarks',
    title: 'Swiss Salary Benchmarks by Industry 2025', 
    type: 'PDF Guide', 
    downloads: '22.4k',
    category: 'Guide',
    resourceType: 'general',
    description: 'Detailed salary data for 50+ professions across all cantons. Includes entry-level to senior positions, bonuses, benefits, and cost of living adjustments.'
  },
  { 
    id: 'visa-types-overview',
    title: 'Complete Visa & Permit Types Guide', 
    type: 'PDF Guide', 
    downloads: '31.5k',
    category: 'Visa',
    resourceType: 'general',
    description: 'Exhaustive guide to all Swiss visa and permit types: tourist, work, family reunification, student, and permanent residency. Eligibility, requirements, and application processes.'
  },
  { 
    id: 'citizenship-pathway-guide',
    title: 'Swiss Citizenship Pathway Guide', 
    type: 'PDF Guide', 
    downloads: '19.8k',
    category: 'Citizenship',
    resourceType: 'general',
    description: 'Complete roadmap to Swiss citizenship: 5-year (EU/EFTA) and 10-year (others) pathways, language requirements, integration tests, and naturalization process.'
  },
  { 
    id: 'family-reunification-guide',
    title: 'Family Reunification Complete Guide', 
    type: 'PDF Guide', 
    downloads: '16.2k',
    category: 'Family',
    resourceType: 'general',
    description: 'Bringing family to Switzerland: spouse, children, and dependent relatives. Requirements, financial thresholds, application procedures, and processing times.'
  },
  { 
    id: 'housing-guide-switzerland',
    title: 'Swiss Housing & Rental Guide', 
    type: 'PDF Guide', 
    downloads: '24.1k',
    category: 'Housing',
    resourceType: 'general',
    description: 'Finding accommodation in Switzerland: rental market insights, required documents, deposits, tenant rights, and tips for securing your first Swiss apartment.'
  },
  { 
    id: 'education-system-guide',
    title: 'Swiss Education System Guide', 
    type: 'PDF Guide', 
    downloads: '13.7k',
    category: 'Education',
    resourceType: 'general',
    description: 'Understanding Swiss education: public vs private schools, international schools, university system, and educational requirements for children of immigrants.'
  },
  { 
    id: 'banking-finance-guide',
    title: 'Swiss Banking & Finance Guide', 
    type: 'PDF Guide', 
    downloads: '17.9k',
    category: 'Finance',
    resourceType: 'general',
    description: 'Opening bank accounts, understanding Swiss banking, credit systems, mortgages, and financial planning for immigrants and new residents.'
  },
  { 
    id: 'healthcare-system-guide',
    title: 'Swiss Healthcare System Explained', 
    type: 'PDF Guide', 
    downloads: '15.6k',
    category: 'Healthcare',
    resourceType: 'general',
    description: 'Complete guide to Swiss healthcare: mandatory insurance, choosing providers, understanding coverage, finding doctors, and navigating the system.'
  },
  { 
    id: 'driving-license-guide',
    title: 'Swiss Driving License Guide', 
    type: 'PDF Guide', 
    downloads: '12.3k',
    category: 'Transport',
    resourceType: 'general',
    description: 'Converting or obtaining a Swiss driving license: requirements by country, exchange procedures, tests, and regulations for international license holders.'
  },
  { 
    id: 'business-startup-guide',
    title: 'Starting a Business in Switzerland', 
    type: 'PDF Guide', 
    downloads: '14.8k',
    category: 'Business',
    resourceType: 'general',
    description: 'Entrepreneurship in Switzerland: business structures, registration, permits for self-employment, tax obligations, and requirements for foreign entrepreneurs.'
  },
  { 
    id: 'retirement-pension-guide',
    title: 'Swiss Retirement & Pension Guide', 
    type: 'PDF Guide', 
    downloads: '11.4k',
    category: 'Retirement',
    resourceType: 'general',
    description: 'Understanding Swiss pension system: AHV/AVS, occupational pensions, pillar 3a, and retirement planning for immigrants and long-term residents.'
  }
]

const PREMIUM_RESOURCES = [
  {
    id: 'premium-cv-templates',
    title: 'Premium CV & Cover Letter Templates',
    icon: FileText,
    pack: 'Career Pro',
    badge: '25+ Templates',
    category: 'Template',
    resourceType: 'premium',
    description: 'Professional Swiss CV templates for every industry, ATS-optimized cover letters, LinkedIn optimization guides, and interview preparation materials.'
  },
  {
    id: 'premium-comprehensive-guides',
    title: 'Advanced Immigration Masterclass',
    icon: BookOpen,
    pack: 'Immigration Pro',
    badge: '15 Comprehensive Modules',
    category: 'Guide',
    resourceType: 'premium',
    description: 'In-depth masterclass covering advanced topics: complex cases, appeals processes, legal strategies, tax optimization, and expert-level immigration knowledge.'
  },
  {
    id: 'premium-citizenship-roadmap',
    title: 'Personalized Citizenship Roadmap',
    icon: CheckCircle,
    pack: 'Citizenship Pro',
    badge: '5 & 10-Year Plans',
    category: 'Citizenship',
    resourceType: 'premium',
    description: 'Customized citizenship pathways with timeline planning, milestone tracking, language learning strategies, and integration optimization for fastest naturalization.'
  },
  {
    id: 'premium-job-search-system',
    title: 'Swiss Job Search Master System',
    icon: Briefcase,
    pack: 'Career Pro',
    badge: 'Complete System',
    category: 'Employment',
    resourceType: 'premium',
    description: 'Proven job search system: networking strategies, hidden job market access, recruiter contacts, interview mastery, and salary negotiation frameworks.'
  },
  {
    id: 'premium-tax-optimization',
    title: 'Tax Optimization & Planning Guide',
    icon: DollarSign,
    pack: 'Finance Pro',
    badge: 'Advanced Strategies',
    category: 'Finance',
    resourceType: 'premium',
    description: 'Advanced tax strategies for immigrants: cantonal optimization, deductions, wealth tax planning, and legal tax minimization strategies for high earners.'
  },
  {
    id: 'premium-business-setup',
    title: 'Complete Business Setup Package',
    icon: TrendingUp,
    pack: 'Business Pro',
    badge: 'Full Package',
    category: 'Business',
    resourceType: 'premium',
    description: 'Everything for starting a business: legal structures, permits, tax setup, accounting systems, and business plan templates tailored for Swiss market.'
  },
  {
    id: 'premium-housing-masterclass',
    title: 'Swiss Real Estate Masterclass',
    icon: MapPin,
    pack: 'Housing Pro',
    badge: 'Buy & Rent Guide',
    category: 'Housing',
    resourceType: 'premium',
    description: 'Complete real estate guide: buying vs renting, mortgage strategies, property investment, rental market analysis, and negotiation tactics.'
  },
  {
    id: 'premium-language-acceleration',
    title: 'Language Learning Acceleration Program',
    icon: Globe,
    pack: 'Integration Pro',
    badge: 'Fast Track to C1',
    category: 'Language',
    resourceType: 'premium',
    description: 'Accelerated language learning system: study plans, exam preparation, conversation practice strategies, and resources for German, French, and Italian.'
  },
  {
    id: 'premium-legal-consultation',
    title: 'Legal Consultation & Document Review',
    icon: Scale,
    pack: 'Legal Pro',
    badge: 'Expert Support',
    category: 'Legal',
    resourceType: 'premium',
    description: 'Access to certified immigration lawyers for document review, application strategy consultation, and personalized legal advice for complex cases.'
  },
  {
    id: 'premium-all-access',
    title: 'All-Access Premium Membership',
    icon: Star,
    pack: 'Elite',
    badge: 'Everything Included',
    category: 'Membership',
    resourceType: 'premium',
    description: 'Complete access to all premium resources, priority support, monthly updates, exclusive webinars, and direct access to immigration experts.'
  }
]

type ViewMode = 'grid' | 'list'
type SortOption = 'popularity' | 'alphabetical' | 'recent' | 'relevance'
type DisplayDensity = 'comfortable' | 'compact' | 'spacious'

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('popularity')
  const [displayDensity, setDisplayDensity] = useState<DisplayDensity>('comfortable')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [favoriteResources, setFavoriteResources] = useState<Set<string>>(new Set())
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])

  // Load preferences from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('resources-view-mode') as ViewMode
    const savedDensity = localStorage.getItem('resources-display-density') as DisplayDensity
    if (savedViewMode) setViewMode(savedViewMode)
    if (savedDensity) setDisplayDensity(savedDensity)
    
    const savedFavorites = localStorage.getItem('resources-favorites')
    if (savedFavorites) setFavoriteResources(new Set(JSON.parse(savedFavorites)))
    
    const savedRecent = localStorage.getItem('resources-recent')
    if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent))
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('resources-view-mode', viewMode)
    localStorage.setItem('resources-display-density', displayDensity)
    localStorage.setItem('resources-favorites', JSON.stringify(Array.from(favoriteResources)))
    localStorage.setItem('resources-recent', JSON.stringify(recentlyViewed))
  }, [viewMode, displayDensity, favoriteResources, recentlyViewed])

  const toggleFavorite = (resourceId: string) => {
    setFavoriteResources(prev => {
      const newSet = new Set(prev)
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId)
      } else {
        newSet.add(resourceId)
      }
      return newSet
    })
  }

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = new Set([
      ...FREE_DOWNLOADS.map(r => r.category),
      ...EMPLOYMENT_CHECKLISTS.map(r => r.category),
      ...GENERAL_RESOURCES.map(r => r.category),
      ...PREMIUM_RESOURCES.map(r => r.category)
    ])
    return Array.from(categories)
  }, [])

  // Get all resource types
  const resourceTypes = ['free', 'checklist', 'general', 'premium']

  // Enhanced AI-powered suggestions with context awareness
  const aiSuggestions = useMemo(() => {
    const suggestions: Array<{
      icon: LucideIcon
      title: string
      description: string
      category: string
      relevance: 'high' | 'medium' | 'low'
      action: () => void
      reason?: string
      tags?: string[]
    }> = []
    const queryLower = searchQuery.toLowerCase()
    
    // Context-aware suggestions based on search query
    if (!queryLower || queryLower.includes('checklist') || queryLower.includes('check') || queryLower.includes('step')) {
      suggestions.push({
        icon: CheckCircle,
        title: 'Immigration Checklist',
        description: 'Complete step-by-step checklist for your journey',
        category: 'Checklist',
        relevance: 'high',
        reason: 'Most popular starting point',
        tags: ['essential', 'beginner-friendly'],
        action: () => {
          setSearchQuery('checklist')
          setSelectedCategory('Checklist')
        }
      })
    }
    
    if (!queryLower || queryLower.includes('cv') || queryLower.includes('resume') || queryLower.includes('template') || queryLower.includes('job application')) {
      suggestions.push({
        icon: FileText,
        title: 'CV Template Pack',
        description: '5 professional ATS-optimized Swiss CV templates',
        category: 'Template',
        relevance: 'high',
        reason: 'Perfect for job applications',
        tags: ['employment', 'professional'],
        action: () => {
          setSearchQuery('cv template')
          setSelectedCategory('Template')
        }
      })
    }
    
    if (!queryLower || queryLower.includes('employment') || queryLower.includes('job') || queryLower.includes('work') || queryLower.includes('permit')) {
      suggestions.push({
        icon: Briefcase,
        title: 'Employment Checklists',
        description: 'Complete employment and permit application checklists',
        category: 'Employment',
        relevance: 'high',
        reason: 'Essential for work permits',
        tags: ['permit', 'application'],
        action: () => {
          setSearchQuery('employment')
          setSelectedType('checklist')
          setSelectedCategory('Employment')
        }
      })
    }
    
    if (!queryLower || queryLower.includes('citizenship') || queryLower.includes('naturalization') || queryLower.includes('swiss passport')) {
      suggestions.push({
        icon: Star,
        title: 'Citizenship Roadmap',
        description: '10-year plan to Swiss citizenship (Premium)',
        category: 'Citizenship',
        relevance: 'high',
        reason: 'Long-term planning resource',
        tags: ['premium', 'long-term'],
        action: () => {
          setSearchQuery('citizenship')
          setSelectedType('premium')
          setSelectedCategory('Citizenship')
        }
      })
    }
    
    if (!queryLower || queryLower.includes('canton') || queryLower.includes('region') || queryLower.includes('where to live')) {
      suggestions.push({
        icon: MapPin,
        title: 'Canton Comparison Guide',
        description: 'Compare all 26 cantons to find your fit',
        category: 'Guide',
        relevance: 'medium',
        reason: 'Helpful for relocation decisions',
        tags: ['comparison', 'location'],
        action: () => {
          setSearchQuery('canton')
          setSelectedCategory('Guide')
        }
      })
    }

    // Smart suggestions based on user behavior
    if (recentlyViewed.length > 0 && !queryLower) {
      const recentCategory = recentlyViewed[0]
      suggestions.push({
        icon: Clock,
        title: 'Continue Your Journey',
        description: 'Resources related to your recent searches',
        category: 'Personalized',
        relevance: 'medium',
        reason: 'Based on your activity',
        tags: ['personalized'],
        action: () => {
          setSearchQuery(recentCategory)
        }
      })
    }

    // Popular resources suggestion
    if (!queryLower) {
      suggestions.push({
        icon: TrendingUp,
        title: 'Most Popular Resources',
        description: 'Top downloaded resources this month',
        category: 'Trending',
        relevance: 'medium',
        reason: 'Community favorites',
        tags: ['popular', 'trending'],
        action: () => {
          setSortBy('popularity')
        }
      })
    }

    // Mistakes to avoid suggestion
    if (!queryLower || queryLower.includes('mistake') || queryLower.includes('error') || queryLower.includes('avoid')) {
      suggestions.push({
        icon: AlertTriangle,
        title: 'Top 10 Mistakes to Avoid',
        description: 'Learn from others\' common errors',
        category: 'Guide',
        relevance: 'high',
        reason: 'Prevent costly errors',
        tags: ['essential', 'tips'],
        action: () => {
          setSearchQuery('mistakes')
          setSelectedCategory('Guide')
        }
      })
    }

    // Sort by relevance if there's a search query
    if (queryLower) {
      return suggestions
        .sort((a, b) => {
          if (a.relevance === 'high' && b.relevance !== 'high') return -1
          if (a.relevance !== 'high' && b.relevance === 'high') return 1
          return 0
        })
        .slice(0, 4)
    }

    return suggestions.slice(0, 4)
  }, [searchQuery, recentlyViewed])

  // Helper function to sort resources
  const sortResources = <T extends { title: string; downloads?: string }>(resources: T[]): T[] => {
    const sorted = [...resources]
    switch (sortBy) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case 'popularity':
        return sorted.sort((a, b) => {
          const aDownloads = parseInt(a.downloads?.replace('k', '000').replace(/[^\d]/g, '') || '0')
          const bDownloads = parseInt(b.downloads?.replace('k', '000').replace(/[^\d]/g, '') || '0')
          return bDownloads - aDownloads
        })
      case 'relevance':
        if (!searchQuery.trim()) return sorted
        const queryLower = searchQuery.toLowerCase()
        return sorted.sort((a, b) => {
          const aTitleMatch = a.title.toLowerCase().includes(queryLower)
          const bTitleMatch = b.title.toLowerCase().includes(queryLower)
          if (aTitleMatch && !bTitleMatch) return -1
          if (!aTitleMatch && bTitleMatch) return 1
          return 0
        })
      case 'recent':
      default:
        return sorted
    }
  }

  // Filter resources with sorting
  const filteredFreeDownloads = useMemo(() => {
    let filtered = FREE_DOWNLOADS
    
    if (selectedCategory) {
      filtered = filtered.filter(r => r.category === selectedCategory)
    }
    if (selectedType && selectedType !== 'free') {
      return []
    }
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase()
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(queryLower) ||
        r.description.toLowerCase().includes(queryLower) ||
        r.category.toLowerCase().includes(queryLower)
      )
    }
    
    return sortResources(filtered)
  }, [searchQuery, selectedCategory, selectedType, sortBy])

  const filteredEmploymentChecklists = useMemo(() => {
    let filtered = EMPLOYMENT_CHECKLISTS
    
    if (selectedCategory) {
      filtered = filtered.filter(r => r.category === selectedCategory)
    }
    if (selectedType && selectedType !== 'checklist') {
      return []
    }
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase()
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(queryLower) ||
        r.type.toLowerCase().includes(queryLower) ||
        r.category.toLowerCase().includes(queryLower)
      )
    }
    
    return sortResources(filtered)
  }, [searchQuery, selectedCategory, selectedType, sortBy])

  const filteredGeneralResources = useMemo(() => {
    let filtered = GENERAL_RESOURCES
    
    if (selectedCategory) {
      filtered = filtered.filter(r => r.category === selectedCategory)
    }
    if (selectedType && selectedType !== 'general') {
      return []
    }
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase()
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(queryLower) ||
        r.type.toLowerCase().includes(queryLower) ||
        r.category.toLowerCase().includes(queryLower)
      )
    }
    
    return sortResources(filtered)
  }, [searchQuery, selectedCategory, selectedType, sortBy])

  const filteredPremiumResources = useMemo(() => {
    let filtered = PREMIUM_RESOURCES
    
    if (selectedCategory) {
      filtered = filtered.filter(r => r.category === selectedCategory)
    }
    if (selectedType && selectedType !== 'premium') {
      return []
    }
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase()
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(queryLower) ||
        r.badge.toLowerCase().includes(queryLower) ||
        r.category.toLowerCase().includes(queryLower)
      )
    }
    
    return sortResources(filtered)
  }, [searchQuery, selectedCategory, selectedType, sortBy])

  const totalResults = filteredFreeDownloads.length + filteredEmploymentChecklists.length + 
                       filteredGeneralResources.length + filteredPremiumResources.length

  // Get grid classes based on view mode and density
  const getGridClasses = () => {
    if (viewMode === 'list') {
      return 'grid grid-cols-1 gap-4'
    }
    
    const densityMap = {
      spacious: {
        base: 'grid-cols-1',
        md: 'md:grid-cols-2',
        lg: 'lg:grid-cols-3',
        gap: 'gap-8'
      },
      comfortable: {
        base: 'grid-cols-1',
        md: 'md:grid-cols-2',
        lg: 'lg:grid-cols-4',
        gap: 'gap-6'
      },
      compact: {
        base: 'grid-cols-1',
        md: 'md:grid-cols-3',
        lg: 'lg:grid-cols-5',
        gap: 'gap-4'
      }
    }
    
    const density = densityMap[displayDensity]
    return `grid ${density.base} ${density.md} ${density.lg} ${density.gap}`
  }

  // Get card padding based on density
  const getCardPadding = () => {
    const densityMap = {
      spacious: 'p-8',
      comfortable: 'p-6',
      compact: 'p-4'
    }
    return densityMap[displayDensity]
  }

  return (
    <div className="min-h-screen page-with-fluid-bg">
      <div className="py-24">
      <div className="sip-container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Resources & Downloads
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free and premium resources to help you navigate Swiss immigration
          </p>
        </motion.div>

        {/* Modern Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
                          suggestion.action()
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
                          <div className="flex items-center space-x-2 mb-1 flex-wrap">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {suggestion.title}
                            </h4>
                            {suggestion.relevance === 'high' && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                Highly Relevant
                              </span>
                            )}
                            {suggestion.relevance === 'medium' && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                Relevant
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{suggestion.description}</p>
                          {suggestion.reason && (
                            <p className="text-xs text-gray-500 italic mb-2">
                              💡 {suggestion.reason}
                            </p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-block text-xs text-blue-600 font-medium">
                              {suggestion.category}
                            </span>
                            {suggestion.tags && suggestion.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {suggestion.tags.map((tag, tagIdx) => (
                                  <span key={tagIdx} className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
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

        {/* View Controls and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 space-y-4"
        >
          {/* View Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4 flex-wrap">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="relevance">Relevance</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>

              {/* Display Density */}
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" />
                <select
                  value={displayDensity}
                  onChange={(e) => setDisplayDensity(e.target.value as DisplayDensity)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="spacious">Spacious</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showAdvancedFilters
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
            </button>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quick Actions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setSelectedCategory(null)
                          setSelectedType(null)
                        }}
                        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setSortBy('popularity')}
                        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Show Popular
                      </button>
                      <button
                        onClick={() => {
                          const favorites = Array.from(favoriteResources)
                          if (favorites.length > 0) {
                            setSearchQuery('')
                            // Filter to show only favorites
                          }
                        }}
                        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        My Favorites ({favoriteResources.size})
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Display Options
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                        Show descriptions
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                        Show download counts
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Category Filters */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
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
          </div>

          {/* Type Filters */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Type:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedType === null
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setSelectedType('free')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedType === 'free'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Free Downloads
              </button>
              <button
                onClick={() => setSelectedType('checklist')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedType === 'checklist'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Checklists
              </button>
              <button
                onClick={() => setSelectedType('general')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedType === 'general'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setSelectedType('premium')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedType === 'premium'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Premium
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        {(searchQuery || selectedCategory || selectedType) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-sm text-gray-600"
          >
            Found <span className="font-semibold text-blue-600">{totalResults}</span> resource{totalResults !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedCategory && ` in ${selectedCategory}`}
            {selectedType && ` (${selectedType})`}
          </motion.div>
        )}

        {/* Free Lead Magnets */}
        {(filteredFreeDownloads.length > 0 || (!searchQuery && !selectedCategory && !selectedType)) && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Free Downloads
                </h2>
                <p className="text-gray-600">
                  Get started with our free resources. Just enter your email to download.
                </p>
              </div>
            </div>

            {filteredFreeDownloads.length > 0 ? (
              <div className={`${getGridClasses()} mb-12`}>
                {filteredFreeDownloads.map((magnet, idx) => {
              const getColorClasses = (color: string) => {
                switch (color) {
                  case 'blue':
                    return 'from-blue-500 to-blue-600 border-blue-200 bg-blue-50'
                  case 'red':
                    return 'from-blue-500 to-blue-600 border-blue-200 bg-blue-50'
                  case 'purple':
                    return 'from-purple-500 to-purple-600 border-purple-200 bg-purple-50'
                  case 'green':
                    return 'from-green-500 to-green-600 border-green-200 bg-green-50'
                  case 'indigo':
                    return 'from-indigo-500 to-indigo-600 border-indigo-200 bg-indigo-50'
                  case 'teal':
                    return 'from-teal-500 to-teal-600 border-teal-200 bg-teal-50'
                  case 'amber':
                    return 'from-amber-500 to-amber-600 border-amber-200 bg-amber-50'
                  case 'rose':
                    return 'from-rose-500 to-rose-600 border-rose-200 bg-rose-50'
                  default:
                    return 'from-blue-500 to-blue-600 border-blue-200 bg-blue-50'
                }
              }
              const colors = getColorClasses(magnet.color)

              return (
                <motion.div
                  key={magnet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <Link 
                    href={`/downloads/${magnet.slug}`}
                    onClick={() => {
                      setRecentlyViewed(prev => {
                        const updated = [magnet.id, ...prev.filter(id => id !== magnet.id)].slice(0, 10)
                        return updated
                      })
                    }}
                  >
                    <div className={`h-full bg-white rounded-xl border-2 ${colors.split(' ')[2]} overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col ${viewMode === 'list' ? 'flex-row' : ''}`}>
                      <div className={`bg-gradient-to-r ${colors.split(' ')[0]} ${colors.split(' ')[1]} ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''} ${getCardPadding()} text-white`}>
                        <div className={`mb-3 flex items-center ${viewMode === 'list' ? 'justify-start' : 'justify-center'}`}>
                          {(() => {
                            const IconComponent = magnet.icon
                            return <IconComponent className={`${viewMode === 'list' ? 'w-10 h-10' : 'w-12 h-12'}`} />
                          })()}
                        </div>
                        <h4 className={`font-bold ${viewMode === 'list' ? 'text-xl' : 'text-lg'} leading-tight mb-2`}>
                          {magnet.title}
                        </h4>
                        {viewMode === 'list' && (
                          <p className="text-sm opacity-90 mt-2">
                            {magnet.description}
                          </p>
                        )}
                      </div>
                      <div className={`${getCardPadding()} flex-1 flex flex-col justify-between`}>
                        {viewMode !== 'list' && (
                          <p className="text-sm text-gray-600 mb-4">
                            {magnet.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Free Download</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(magnet.id)
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title={favoriteResources.has(magnet.id) ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Heart 
                                className={`w-4 h-4 ${favoriteResources.has(magnet.id) ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} 
                              />
                            </button>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No free downloads match your search criteria.
          </div>
        )}
        </div>
        )}

        {/* Other Free Resources */}
        {(filteredEmploymentChecklists.length > 0 || filteredGeneralResources.length > 0 || (!searchQuery && !selectedCategory && !selectedType)) && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Additional Resources
                </h2>
                <p className="text-gray-600">
                  More downloadable PDFs, checklists, and guides
                </p>
              </div>
            </div>
            
            {/* Employment Checklists Section */}
            {filteredEmploymentChecklists.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Employment Checklists
                  </h3>
                </div>
                <div className={`${getGridClasses()} mb-6`}>
                  {filteredEmploymentChecklists.map((resource, idx) => {
                const getColorClasses = (color: string) => {
                  switch (color) {
                    case 'blue':
                      return {
                        gradient: 'from-blue-500 to-blue-600',
                        border: 'border-blue-200',
                        bg: 'bg-blue-50'
                      }
                    case 'purple':
                      return {
                        gradient: 'from-purple-500 to-purple-600',
                        border: 'border-purple-200',
                        bg: 'bg-purple-50'
                      }
                    case 'green':
                      return {
                        gradient: 'from-green-500 to-green-600',
                        border: 'border-green-200',
                        bg: 'bg-green-50'
                      }
                    case 'orange':
                      return {
                        gradient: 'from-orange-500 to-orange-600',
                        border: 'border-orange-200',
                        bg: 'bg-orange-50'
                      }
                    case 'indigo':
                      return {
                        gradient: 'from-indigo-500 to-indigo-600',
                        border: 'border-indigo-200',
                        bg: 'bg-indigo-50'
                      }
                    default:
                      return {
                        gradient: 'from-blue-500 to-blue-600',
                        border: 'border-blue-200',
                        bg: 'bg-blue-50'
                      }
                  }
                }
                
                const colors = getColorClasses(resource.color)
                
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative"
                  >
                    <div className={`h-full bg-white rounded-xl border-2 ${colors.border} overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col ${viewMode === 'list' ? 'flex-row' : ''}`}>
                      <div className={`bg-gradient-to-r ${colors.gradient} ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''} ${getCardPadding()} text-white`}>
                        <FileText className={`${viewMode === 'list' ? 'w-10 h-10' : 'w-8 h-8'} mb-2`} />
                        <h4 className={`font-bold ${viewMode === 'list' ? 'text-base' : 'text-sm'} leading-tight`}>
                          {resource.title}
                        </h4>
                      </div>
                      <div className={`${getCardPadding()} flex-1 flex flex-col justify-between`}>
                        <div>
                          {resource.description && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {resource.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mb-3">
                            {resource.type}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-500">
                              {resource.downloads} downloads
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(resource.id)
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title={favoriteResources.has(resource.id) ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Heart 
                                className={`w-4 h-4 ${favoriteResources.has(resource.id) ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} 
                              />
                            </button>
                          </div>
                        </div>
                        <a
                          href={`/api/resources/${resource.id}`}
                          download
                          onClick={() => {
                            setRecentlyViewed(prev => {
                              const updated = [resource.id, ...prev.filter(id => id !== resource.id)].slice(0, 10)
                              return updated
                            })
                          }}
                          className={`block w-full bg-gradient-to-r ${colors.gradient} hover:shadow-lg text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 text-center`}
                        >
                          <Download className="w-4 h-4 inline-block mr-1" />
                          Download
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
          )}

          {/* Other Free Resources */}
          {filteredGeneralResources.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-10 bg-gradient-to-b from-indigo-500 via-purple-500 to-blue-500 rounded-full"></div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      General Resources
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Comprehensive guides covering all aspects of Swiss immigration and life
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${getGridClasses()}`}>
                {filteredGeneralResources.map((resource, idx) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`card ${getCardPadding()} hover:shadow-lg transition-all flex flex-col ${viewMode === 'list' ? 'flex-row items-center' : ''}`}
                >
                  <div className={`${viewMode === 'list' ? 'w-16 h-16 mr-4' : 'w-12 h-12 mb-4'} flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg`}>
                    <FileText className={`${viewMode === 'list' ? 'w-10 h-10' : 'w-8 h-8'} text-blue-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`${viewMode === 'list' ? 'text-2xl' : 'text-xl'} font-bold text-gray-900 mb-2`}>
                      {resource.title}
                    </h3>
                    {resource.description && (
                      <p className={`text-sm text-gray-600 mb-3 ${viewMode === 'list' ? '' : 'line-clamp-2'}`}>
                        {resource.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {resource.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {resource.downloads} downloads
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleFavorite(resource.id)
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title={favoriteResources.has(resource.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart 
                          className={`w-4 h-4 ${favoriteResources.has(resource.id) ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} 
                        />
                      </button>
                      <a
                        href={`/api/resources/${resource.id}`}
                        download
                        onClick={() => {
                          setRecentlyViewed(prev => {
                            const updated = [resource.id, ...prev.filter(id => id !== resource.id)].slice(0, 10)
                            return updated
                          })
                        }}
                        className="btn-secondary text-sm inline-flex items-center"
                      >
                        <Download className="w-4 h-4 inline-block mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          )}
        </div>
        )}

        {/* Premium Resources */}
        {(filteredPremiumResources.length > 0 || (!searchQuery && !selectedCategory && !selectedType)) && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    Premium Resources
                  </h2>
                </div>
                <p className="text-gray-600 ml-9">
                  Advanced tools, expert guidance, and exclusive content to accelerate your Swiss immigration journey
                </p>
              </div>
              <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 group bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                <span>Unlock All</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {filteredPremiumResources.length > 0 ? (
              <div className={`${getGridClasses()}`}>
                {filteredPremiumResources.map((resource, idx) => {
                  const ResourceIcon = resource.icon
                  return (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`card ${getCardPadding()} border-2 border-blue-200 relative flex flex-col ${viewMode === 'list' ? 'flex-row items-center' : ''}`}
              >
                <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  {resource.pack}
                </div>
                <div className={`${viewMode === 'list' ? 'w-16 h-16 mr-4' : 'w-12 h-12 mb-4'} flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg`}>
                  <ResourceIcon className={`${viewMode === 'list' ? 'w-10 h-10' : 'w-8 h-8'} text-blue-600`} />
                </div>
                <div className="flex-1">
                  <h3 className={`${viewMode === 'list' ? 'text-2xl' : 'text-xl'} font-bold text-gray-900 mb-2`}>
                    {resource.title}
                  </h3>
                  {resource.description && (
                    <p className={`text-sm text-gray-600 mb-3 ${viewMode === 'list' ? '' : 'line-clamp-2'}`}>
                      {resource.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {resource.badge}
                    </span>
                    <span className="text-xs text-gray-500">
                      Premium
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(resource.id || resource.title)
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title={favoriteResources.has(resource.id || resource.title) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart 
                        className={`w-4 h-4 ${favoriteResources.has(resource.id || resource.title) ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} 
                      />
                    </button>
                    <Link
                      href="/pricing"
                      className="btn-primary flex-1 text-center text-sm"
                    >
                      Upgrade to Access
                    </Link>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No premium resources match your search criteria.
          </div>
        )}
        </div>
        )}

        {/* Empty State */}
        {totalResults === 0 && (searchQuery || selectedCategory || selectedType) && (
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
                setSelectedType(null)
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Quick Links */}
        {/* Personalized Resources CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-white"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Personalized Resources
            </h2>
            <p className="text-xl mb-6 opacity-90">
              We've automatically detected your region and preferences to show you the most relevant immigration information and resources for your situation.
            </p>
            <div className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
              Region-Specific Content Available
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Visa Guide', link: '/visas' },
              { title: 'Employment Hub', link: '/employment' },
              { title: 'Citizenship Paths', link: '/citizenship' },
              { title: 'My Content', link: '/dashboard' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="block text-center bg-white hover:bg-blue-100 p-6 rounded-lg transition-colors"
              >
                <span className="font-semibold text-gray-900">
                  {item.title} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Consultation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Need expert review of your documents?
          </h2>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Book a CHF 80 consultation with our immigration specialists.
            Get personalized feedback on your application, timeline review, and document check.
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Book a Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Exit-intent popup */}
      <ExitIntentPopup
        discountCode="SAVE15"
        discountPercent={15}
      />
    </div>
    </div>
  )
}

