'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Home, 
  Building2, 
  Euro, 
  BedDouble, 
  Maximize, 
  Calendar, 
  ArrowRight, 
  Filter, 
  Loader2,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Heart,
  Share2,
  X,
  SlidersHorizontal,
  Grid3x3,
  List,
  Phone,
  Mail,
  Eye,
  TrendingUp,
  TrendingDown,
  Sparkles,
  PawPrint,
  Wifi,
  Car,
  Accessibility,
  Bath,
  Sofa,
  ShowerHead,
  Trees,
  MapIcon
} from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/components/providers/ToastProvider'

interface Property {
  id: string
  title: string
  city: string
  canton: string
  rent: number
  rooms: number
  type: 'apartment' | 'house'
  sqm: number
  image: string
  link: string
  features: string[]
  availableFrom: string
  furnished?: boolean
  petFriendly?: boolean
  balcony?: boolean
  parking?: boolean
  elevator?: boolean
  wheelchairAccessible?: boolean
}

type ViewMode = 'grid' | 'list' | 'map'
type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc' | 'newest'

export default function ApartmentFinderPage() {
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState('')
  const [minRent, setMinRent] = useState('')
  const [maxRent, setMaxRent] = useState('')
  const [minRooms, setMinRooms] = useState('')
  const [maxRooms, setMaxRooms] = useState('')
  const [minSqm, setMinSqm] = useState('')
  const [maxSqm, setMaxSqm] = useState('')
  const [type, setType] = useState<'all' | 'apartment' | 'house'>('all')
  const [furnished, setFurnished] = useState<boolean | null>(null)
  const [petFriendly, setPetFriendly] = useState(false)
  const [parking, setParking] = useState(false)
  const [balcony, setBalcony] = useState(false)
  const [elevator, setElevator] = useState(false)
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false)
  const [results, setResults] = useState<Property[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set())
  const [showSavedOnly, setShowSavedOnly] = useState(false)

  // Load saved properties from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedProperties')
    if (saved) {
      setSavedProperties(new Set(JSON.parse(saved)))
    }
  }, [])

  const toggleSaveProperty = (id: string) => {
    setSavedProperties(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      localStorage.setItem('savedProperties', JSON.stringify([...newSet]))
      return newSet
    })
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setHasSearched(true)

    const params = new URLSearchParams({
      city,
      minRent,
      maxRent,
      minRooms,
      maxRooms,
      minSqm,
      maxSqm,
      type,
      furnished: furnished === null ? '' : furnished.toString(),
      petFriendly: petFriendly.toString(),
      parking: parking.toString(),
      balcony: balcony.toString(),
      elevator: elevator.toString(),
      wheelchairAccessible: wheelchairAccessible.toString()
    })

    try {
      const res = await fetch(`/api/apartments?${params.toString()}`)
      const data = await res.json()
      setResults(data.properties || [])
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.rent - b.rent
      case 'price-desc':
        return b.rent - a.rent
      case 'size-asc':
        return a.sqm - b.sqm
      case 'size-desc':
        return b.sqm - a.sqm
      case 'newest':
        return a.availableFrom.localeCompare(b.availableFrom)
      default:
        return 0
    }
  })

  // Filter for saved only
  const displayResults = showSavedOnly 
    ? sortedResults.filter(prop => savedProperties.has(prop.id))
    : sortedResults

  const clearAllFilters = () => {
    setCity('')
    setMinRent('')
    setMaxRent('')
    setMinRooms('')
    setMaxRooms('')
    setMinSqm('')
    setMaxSqm('')
    setType('all')
    setFurnished(null)
    setPetFriendly(false)
    setParking(false)
    setBalcony(false)
    setElevator(false)
    setWheelchairAccessible(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
                Find Your Perfect <span className="text-blue-600">Swiss Home</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600">
                Search thousands of verified listings across all Swiss cantons with advanced filters
              </p>
            </motion.div>

            {/* Main Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-3 rounded-2xl shadow-2xl border border-slate-200"
            >
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="City or Canton"
                      className="block w-full pl-10 pr-3 py-3.5 bg-slate-50 border-none rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="relative grid grid-cols-2 gap-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Euro className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        placeholder="Min CHF"
                        className="block w-full pl-9 pr-2 py-3.5 bg-slate-50 border-none rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        value={minRent}
                        onChange={(e) => setMinRent(e.target.value)}
                      />
                    </div>
                    <input
                      type="number"
placeholder="Max CHF"
                        className="block w-full px-3 py-3.5 bg-slate-50 dark:bg-gray-800 border-none rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        value={maxRent}
                      onChange={(e) => setMaxRent(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <BedDouble className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Min rooms"
                      className="block w-full pl-10 pr-3 py-3.5 bg-slate-50 border-none rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all"
                      value={minRooms}
                      onChange={(e) => setMinRooms(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Home className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      className="block w-full pl-10 pr-10 py-3.5 bg-slate-50 border-none rounded-xl text-slate-900 appearance-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                    >
                      <option value="all">All Types</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Advanced Filters
                    {showAdvancedFilters ? <ChevronDown className="w-4 h-4 rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 transition-transform" />}
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    Search
                  </button>
                </div>

                {/* Advanced Filters Panel */}
                <AnimatePresence>
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          {/* Square Meters */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                              <Maximize className="w-3.5 h-3.5" />
                              Square Meters
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                placeholder="Min m²"
                                className="block w-full px-3 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                                value={minSqm}
                                onChange={(e) => setMinSqm(e.target.value)}
                              />
                              <input
                                type="number"
                                placeholder="Max m²"
                                className="block w-full px-3 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                                value={maxSqm}
                                onChange={(e) => setMaxSqm(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Max Rooms */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                              <BedDouble className="w-3.5 h-3.5" />
                              Max Rooms
                            </label>
                            <input
                              type="number"
                              step="0.5"
                              placeholder="Max rooms"
                              className="block w-full px-3 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                              value={maxRooms}
                              onChange={(e) => setMaxRooms(e.target.value)}
                            />
                          </div>

                          {/* Furnished */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-200 mb-2 flex items-center gap-1.5">
                              <Sofa className="w-3.5 h-3.5" />
                              Furnishing
                            </label>
                            <select
                              className="block w-full px-3 py-2 bg-slate-50 dark:bg-gray-800 border-none rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              value={furnished === null ? 'any' : furnished ? 'furnished' : 'unfurnished'}
                              onChange={(e) => setFurnished(e.target.value === 'any' ? null : e.target.value === 'furnished')}
                            >
                              <option value="any">Any</option>
                              <option value="furnished">Furnished</option>
                              <option value="unfurnished">Unfurnished</option>
                            </select>
                          </div>
                        </div>

                        {/* Feature Checkboxes */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                          {[
                            { label: 'Pet Friendly', value: petFriendly, setter: setPetFriendly, icon: PawPrint },
                            { label: 'Parking', value: parking, setter: setParking, icon: Car },
                            { label: 'Balcony', value: balcony, setter: setBalcony, icon: Trees },
                            { label: 'Elevator', value: elevator, setter: setElevator, icon: Building2 },
                            { label: 'Accessible', value: wheelchairAccessible, setter: setWheelchairAccessible, icon: Accessibility },
                          ].map((feature) => (
                            <button
                              key={feature.label}
                              type="button"
                              onClick={() => feature.setter(!feature.value)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                feature.value
                                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                                  : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                              }`}
                            >
                              <feature.icon className="w-3.5 h-3.5" />
                              {feature.label}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={clearAllFilters}
                          className="mt-4 text-sm text-slate-600 hover:text-slate-900 font-medium underline"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>10,000+ verified listings</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Updated daily</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-600" />
                <span>Save favorites</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            <motion.div 
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Search className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to find your dream home?</h2>
              <p className="text-slate-600 mb-8">Use the search filters above to discover available properties</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  { icon: Building2, label: 'Apartments & Houses', desc: 'Wide variety of properties' },
                  { icon: Filter, label: 'Advanced Filters', desc: 'Find exactly what you need' },
                  { icon: Heart, label: 'Save Favorites', desc: 'Keep track of your choices' },
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <feature.icon className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
                    <h3 className="font-semibold text-slate-900 mb-1">{feature.label}</h3>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 overflow-hidden animate-pulse">
                  <div className="h-64 bg-slate-200 dark:bg-gray-700" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="pt-4 flex justify-between">
                      <div className="h-8 bg-slate-200 rounded w-1/4" />
                      <div className="h-8 bg-slate-200 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : displayResults.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Results Header with Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {displayResults.length} {displayResults.length === 1 ? 'Property' : 'Properties'} Found
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                    {showSavedOnly ? 'Showing your saved properties' : 'Showing all matching properties'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Saved Filter Toggle */}
                  <button
                    onClick={() => setShowSavedOnly(!showSavedOnly)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      showSavedOnly
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 border-2 border-red-300 dark:border-gray-600'
                        : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-2 border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${showSavedOnly ? 'fill-red-600' : ''}`} />
                    Saved ({savedProperties.size})
                  </button>

                  {/* View Mode Toggle */}
                  <div className="flex bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-all ${
                        viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Grid view"
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-all ${
viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    title="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`p-2 rounded transition-all ${
viewMode === 'map' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    title="Map view"
                    >
                      <MapIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-slate-700 dark:text-gray-200 hover:border-slate-300 dark:hover:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="relevance">Sort: Relevance</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="size-asc">Size: Smallest First</option>
                      <option value="size-desc">Size: Largest First</option>
                      <option value="newest">Newest First</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Map View */}
              {viewMode === 'map' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-slate-200 dark:border-gray-700 p-8 mb-6">
                  <div className="text-center py-20">
                    <MapIcon className="w-16 h-16 text-slate-300 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Map View Coming Soon</h3>
                    <p className="text-slate-600 dark:text-gray-400">Interactive map with property locations will be available soon</p>
                  </div>
                </div>
              )}

              {/* Grid/List View */}
              {viewMode !== 'map' && (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {displayResults.map((prop, idx) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      viewMode={viewMode}
                      isSaved={savedProperties.has(prop.id)}
                      onToggleSave={() => toggleSaveProperty(prop.id)}
                      delay={idx * 0.05}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="bg-slate-100 dark:bg-gray-800 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-400 dark:text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {showSavedOnly ? 'No saved properties yet' : 'No properties found'}
              </h2>
              <p className="text-slate-600 dark:text-gray-400 mb-8">
                {showSavedOnly 
                  ? 'Start saving properties by clicking the heart icon on listings you like'
                  : 'Try adjusting your filters to find more results'
                }
              </p>
              <button 
                onClick={() => {
                  if (showSavedOnly) {
                    setShowSavedOnly(false)
                  } else {
                    clearAllFilters()
                  }
                }}
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
              >
                <X className="w-4 h-4" />
                {showSavedOnly ? 'Show all properties' : 'Clear all filters'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Trust Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10 text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted Housing Partners</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              We aggregate listings from Switzerland's most trusted real estate platforms to ensure you have access to the highest quality verified properties.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
            {['homegate.ch', 'ImmoScout24', 'flatfox', 'newhome', 'comparis'].map((partner) => (
              <div key={partner} className="text-lg md:text-xl font-bold tracking-tight text-white/90">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// PropertyCard Component
interface PropertyCardProps {
  property: Property
  viewMode: ViewMode
  isSaved: boolean
  onToggleSave: () => void
  delay: number
}

function PropertyCard({ property, viewMode, isSaved, onToggleSave, delay }: PropertyCardProps) {
  const { showToast } = useToast()
  const [showShareMenu, setShowShareMenu] = useState(false)

  const shareProperty = (method: 'copy' | 'email') => {
    const url = property.link
    if (method === 'copy') {
      navigator.clipboard.writeText(url)
      showToast('Link copied to clipboard!', 'success')
    } else if (method === 'email') {
      window.location.href = `mailto:?subject=Check out this property&body=I found this property: ${url}`
    }
    setShowShareMenu(false)
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-slate-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-600 transition-all group"
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 md:h-auto md:w-80 overflow-hidden flex-shrink-0">
            <Image 
              src={property.image} 
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="320px"
            />
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 shadow-sm">
              {property.type === 'apartment' ? <Building2 className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{property.title}</h3>
                <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  {property.city}, {property.canton}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 ml-4">
                <div className="text-3xl font-black text-blue-600">
                  CHF {property.rent.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-gray-400">per month</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 py-4 border-y border-slate-100 dark:border-gray-700 my-4">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{property.rooms} Rooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{property.sqm} m²</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{property.availableFrom}</span>
              </div>
              {property.petFriendly && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/30 rounded-full">
                  <PawPrint className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Pet Friendly</span>
                </div>
              )}
              {property.parking && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                  <Car className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Parking</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {property.features.slice(0, 5).map(feature => (
                <span key={feature} className="px-3 py-1 bg-slate-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-slate-700 dark:text-gray-200">
                  {feature}
                </span>
              ))}
            </div>

            <div className="flex gap-2 mt-auto">
              <button
                onClick={onToggleSave}
                className={`p-3 rounded-xl transition-all ${
                  isSaved
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200'
                    : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save property'}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-600' : ''}`} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-3 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-600 dark:text-gray-300 rounded-xl transition-all"
                  title="Share property"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {showShareMenu && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl p-2 z-10 whitespace-nowrap">
                    <button
                      onClick={() => shareProperty('copy')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 rounded-lg"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => shareProperty('email')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 rounded-lg"
                    >
                      Share via Email
                    </button>
                  </div>
                )}
              </div>

              <a 
                href={property.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              >
                View Full Details
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all group"
    >
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={property.image} 
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1.5 shadow-md">
          {property.type === 'apartment' ? <Building2 className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
          {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
        </div>
        <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1.5 rounded-full text-sm font-bold text-white shadow-lg">
          CHF {property.rent.toLocaleString()}
        </div>
        
        {/* Action buttons overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onToggleSave}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg ${
              isSaved
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save property'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2.5 bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 rounded-full transition-all shadow-lg"
              title="Share property"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {showShareMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl p-2 z-10 whitespace-nowrap">
                <button
                  onClick={() => shareProperty('copy')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 rounded-lg"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => shareProperty('email')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 rounded-lg"
                >
                  Share via Email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">{property.title}</h3>
        
        <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          {property.city}, {property.canton}
        </div>

        <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-100 dark:border-gray-700 mb-4">
          <div className="flex flex-col items-center">
            <BedDouble className="w-5 h-5 text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-900">{property.rooms} Rooms</span>
          </div>
          <div className="flex flex-col items-center">
            <Maximize className="w-5 h-5 text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-900">{property.sqm} m²</span>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="w-5 h-5 text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-900 text-center leading-tight">{property.availableFrom}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[2rem]">
          {property.features.slice(0, 4).map(feature => (
            <span key={feature} className="px-2 py-1 bg-slate-100 rounded text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
              {feature}
            </span>
          ))}
        </div>

        <a 
          href={property.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          View Details
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  )
}
