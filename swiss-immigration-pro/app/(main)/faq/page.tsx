'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, HelpCircle, Sparkles, Filter, X, ChevronUp, BookOpen, MessageCircle, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'Is your platform legitimate? Do you have real immigration lawyers?',
        a: 'Yes! We partner with certified Swiss immigration lawyers and cantonal authorities. Our expert team provides accurate, legally-sound information sourced from SEM, cantonal migration offices, and verified legal sources.'
      },
      {
        q: 'How is this different from free information online?',
        a: 'We compile critical information scattered across 26 cantons into one coherent system. Our AI chatbot answers your specific situation in real-time. We provide exact embassy requirements, current quota data, salary benchmarks, and step-by-step processes that free resources don\'t cover comprehensively.'
      },
      {
        q: 'Do I need to pay a lawyer to use your platform?',
        a: 'No! Our platform is designed for self-service with expert guidance. However, for complex cases (criminal records, unusual circumstances, appeals), we recommend professional legal advice. We can connect you with verified Swiss immigration attorneys.'
      },
      {
        q: 'What if Switzerland changes immigration rules?',
        a: 'We update our content in real-time when SEM publishes changes. Our AI chatbot stays current with the latest regulations, quotas, and cantonal variations. You\'ll receive notifications about changes affecting your visa status.'
      }
    ]
  },
  {
    category: 'Non-EU Quotas & Permits',
    questions: [
      {
        q: 'I\'m from India/China/Russia. Can I really get a Swiss work permit in 2025?',
        a: 'Yes, although quotas are tight each year. Success requires: competitive salary (CHF 120k+), strong employer sponsorship, the right canton strategy, and a complete dossier. Our Advanced Pack shows how to position yourself correctly.'
      },
      {
        q: 'Which cantons are easiest for non-EU applicants?',
        a: 'Basel-Stadt, Canton of Neuchâtel, and Appenzell Ausserrhoden have higher approval rates and lower competition. Avoid Geneva, Zurich, and Zug (most competitive). Our cantonal guide shows exact requirements and success rates per canton.'
      },
      {
        q: 'Do I need a job offer before applying?',
        a: 'For L and B permits, yes - a Swiss employer must initiate the application. For EU Blue Card holders, you can apply pre-employment if you meet salary thresholds. We provide CV templates and networking strategies to land the offer.'
      },
      {
        q: 'How long does permit processing take?',
        a: 'L permits: 4-8 weeks. B permits: 8-12 weeks. Delays occur from incomplete documentation (60% of delays). Our checklists ensure completeness. Cantons like Geneva take longer due to volume; Basel is typically faster.'
      },
      {
        q: 'Can I switch from L to B permit without leaving?',
        a: 'Yes, if you have 12+ months on L permit and your employer extends your contract. Apply for conversion 3 months before L expires. Many cantons allow in-country conversion to B.'
      }
    ]
  },
  {
    category: 'Citizenship',
    questions: [
      {
        q: 'Can I become Swiss citizen as non-EU? What\'s the fastest path?',
        a: 'Yes! Standard path: 10 years C permit + integration test + B1 language. Fastest: Marry Swiss citizen (5 years marriage + 3 in CH), or 3rd generation (born in CH, 5 years residence). Our citizenship module covers all paths.'
      },
      {
        q: 'What does the integration test cover?',
        a: 'Swiss civics, constitution, democracy system, Swiss geography, cantonal specifics, and language fluency. We provide exact test prep materials, sample questions, and passing strategies.'
      },
      {
        q: 'Can I keep dual citizenship?',
        a: 'Yes! Switzerland allows dual nationality since 2022. However, your origin country must also permit it (some don\'t: Denmark, Greece, Japan, etc.). Check your home country\'s laws.'
      },
      {
        q: 'How long until I get citizenship after applying?',
        a: 'Processing varies by canton: 2-4 years typical. Zurich: longer, Thurgau: fastest. Naturalization interviews are rigorous. We provide interview prep and sample questions.'
      }
    ]
  },
  {
    category: 'Employment & Work Life',
    questions: [
      {
        q: 'What salary do I need to qualify?',
        a: 'Minimum varies by canton and job: Geneva CHF 90k+, Basel CHF 85k+, rural areas lower. Generally CHF 100k+ for non-EU reduces objections. Tech/finance can justify CHF 120k+. We provide salary benchmarks by canton and sector.'
      },
      {
        q: 'Can I work remote for a foreign company with a Swiss permit?',
        a: 'Limited. L/B permits are tied to a Swiss employer. You can work 20% for other employers with written consent. Remote work for non-Swiss companies may require separate tax arrangements. Discuss with cantonal authorities.'
      },
      {
        q: 'How many vacation days?',
        a: 'Legal minimum: 20 days (age 20+) or 25 days (age 50+). Most employers offer 25-30. Swiss standard is generous compared to US/Asia.'
      },
      {
        q: 'Is Swiss CV format different?',
        a: 'Yes! Swiss CVs are 1-2 pages, professional photo required, no salary history, education-first, certificates emphasized. ATS-optimized format matters. We provide 20+ templates for every sector.'
      }
    ]
  },
  {
    category: 'Family & Housing',
    questions: [
      {
        q: 'Can I bring my family? What are requirements?',
        a: 'Yes! Spouse and children under 18. Requirements: sufficient income (CHF 2,500-3,500 per person), adequate housing, marriage certificate, children\'s birth certificates. Processing: 6-12 months. We provide family reunification checklists.'
      },
      {
        q: 'How much does housing cost in Switzerland?',
        a: 'Studio: CHF 800-1,500/month. 2-bedroom: CHF 1,500-2,800/month. 4-bedroom: CHF 2,500-5,000/month. Zurich/Geneva most expensive, rural areas cheaper. Landlords require salary 3x rent. We provide housing guides and application tips.'
      },
      {
        q: 'Can family members work?',
        a: 'Spouses from EU/EFTA: unlimited work rights. Spouses from non-EU: need own work permit (same quotas apply, difficult to obtain).'
      },
      {
        q: 'Do children need permits?',
        a: 'Children under 18 included on parent\'s permit, no separate permit. Children 18+ need own permits or must depart unless studying.'
      }
    ]
  },
  {
    category: 'Language & Integration',
    questions: [
      {
        q: 'Which language do I need to learn?',
        a: 'Depends on canton: German (19 cantons), French (4 cantons), Italian (1 canton), Romansh (1 canton). Cities have English speakers, but integration test requires local language. We recommend B1 level minimum for citizenship.'
      },
      {
        q: 'Where can I learn Swiss German/French/Italian?',
        a: 'Language schools: Migros Club School, Inlingua, Berlitz. Universities offer courses. Online: Babbel, Rosetta Stone. Integration courses required for some permits (Aargau, Basel). We provide resource lists and study plans.'
      },
      {
        q: 'Do I need to do military service?',
        a: 'Only if you\'re a male citizen or permanent resident. Most immigrants are exempt. Swiss-born males must serve at age 18-20.'
      },
      {
        q: 'How do I integrate socially in Switzerland?',
        a: 'Join local Vereine (clubs), sports clubs, volunteer organizations, language exchange meetups, religious communities. Swiss are reserved initially; building relationships takes time. Start with work colleagues and hobbies.'
      },
      {
        q: 'What is the best way to learn Swiss German vs High German?',
        a: 'Swiss German is the spoken dialect, but written communication uses High German. Learn High German formally (recognized by employers), then pick up Swiss German through immersion. Most Swiss understand High German, but speaking Swiss German improves integration.',
      },
      {
        q: 'Do I need to pass an integration test for a B permit?',
        a: 'Not initially, but cantons increasingly require integration proof (language, community involvement) for B permit renewal. Some cantons (Aargau, Basel) require integration courses for non-EU applicants. Check your specific canton requirements.',
      }
    ]
  },
  {
    category: 'Taxes & Finances',
    questions: [
      {
        q: 'How much tax will I pay?',
        a: 'Swiss tax is progressive and relatively low. Effective rates: CHF 100k income = ~12-18% total (federal + cantonal + municipal). Zurich: higher tax, better infrastructure. Zug: lower tax. We provide tax calculators and optimization strategies.'
      },
      {
        q: 'Do I need a Swiss bank account?',
        a: 'Yes, for salary and daily life. Major banks: UBS, Credit Suisse, Raiffeisen, PostFinance (easiest for immigrants). Documents needed: passport, permit, proof of address, employment contract.'
      },
      {
        q: 'What about health insurance?',
        a: 'Mandatory for everyone residing in Switzerland. Basic insurance: CHF 300-600/month per adult. You choose your insurer. Children under 18: free or subsidized. We provide comparison tools and selection guide.'
      },
      {
        q: 'Can I get retirement benefits as immigrant?',
        a: 'Yes! BVG (pension system) contributions required for employees. You\'ll receive pension at retirement age if you worked 5+ years in CH. Full benefits after 40 years. Check agreements with your home country for portability.'
      },
      {
        q: 'How much should I save before moving to Switzerland?',
        a: 'Recommended: 3-6 months expenses (CHF 15k-30k). This covers housing deposit (3 months rent), initial expenses, health insurance, and emergency fund. Higher if you have family (CHF 30k-50k).',
      },
      {
        q: 'What is the wealth tax and how much will I pay?',
        a: 'Most cantons tax net wealth above CHF 200k-500k (varies by canton). Rates range 0.05%-0.3% on wealth above threshold. Zurich: 0.15%, Zug: 0.08%, Geneva: 0.2%. Your home country tax treaties may provide relief.',
      },
      {
        q: 'Can I open a Swiss bank account before getting my permit?',
        a: 'Difficult but possible. Some banks (PostFinance, UBS) may open accounts with employment contract and passport. Most require permit for full account access. Credit Suisse and Raiffeisen typically require residence permit.',
      },
      {
        q: 'What is the 3rd pillar pension and should I contribute?',
        a: 'The 3rd pillar is voluntary private pension savings with tax benefits. You can contribute CHF 7,056/year (2025) and deduct from taxable income. Highly recommended for long-term residents. Two types: 3a (locked until retirement) and 3b (flexible).',
      },
      {
        q: 'How do I file taxes in Switzerland as an immigrant?',
        a: 'Tax filing depends on your permit and income. B permit holders file at cantonal level (varies by canton). C permit holders file federal + cantonal. Tax year is calendar year, filing deadline typically March 31. Many cantons offer online filing. Consider tax advisor for first year.',
      },
      {
        q: 'What is the double taxation treaty and how does it affect me?',
        a: 'Switzerland has treaties with 100+ countries preventing double taxation. If you\'re tax resident in Switzerland, you generally pay Swiss taxes. Your home country may tax certain income (rental, investments) but you get credit for Swiss taxes paid. Check your country\'s specific treaty.',
      },
      {
        q: 'Can I transfer my pension from my home country to Switzerland?',
        a: 'Depends on your home country. EU/EFTA countries: Often possible through bilateral agreements. US: Complex, consult tax advisor. Other countries: Check specific agreements. Generally, you can\'t transfer directly but may get credit for years worked abroad.',
      }
    ]
  },
  {
    category: 'Healthcare & Insurance',
    questions: [
      {
        q: 'How do I choose a health insurance provider in Switzerland?',
        a: 'Compare providers on comparis.ch or priminfo.ch. Consider: premium cost, deductible level (CHF 300-2,500), coverage (basic is same, extras vary), customer service, network of doctors. Popular providers: Groupe Mutuel, CSS, Helsana, Swica. Premium varies by canton and age.',
      },
      {
        q: 'What is the deductible (franchise) and how does it work?',
        a: 'Deductible is amount you pay before insurance covers costs. Options: CHF 300 (standard), CHF 500, CHF 1,000, CHF 1,500, CHF 2,500. Higher deductible = lower premium. You pay all costs up to deductible, then insurance covers 90% (you pay 10% up to annual limit).',
      },
      {
        q: 'Do I need supplementary insurance?',
        a: 'Basic insurance covers medical treatment. Supplementary (complementary) covers: private/semi-private hospital rooms, alternative medicine, dental (limited), vision, travel insurance. Not mandatory but recommended if you want more comfort and coverage. Costs CHF 50-200/month extra.',
      },
      {
        q: 'What happens if I can\'t afford health insurance?',
        a: 'Health insurance is mandatory. If you can\'t afford it, apply for premium reduction (Prämienverbilligung) from your canton. Based on income, can reduce premium by 30-90%. Contact cantonal health insurance office for application.',
      },
      {
        q: 'Can I use my home country health insurance?',
        a: 'No, you must have Swiss KVG-compliant insurance. International insurance doesn\'t meet legal requirements. Exception: Short-term visitors (<3 months) may use travel insurance, but residents must have Swiss insurance.',
      }
    ]
  },
  {
    category: 'Technical & Platform',
    questions: [
      {
        q: 'What\'s included in each pricing pack?',
        a: 'Free: Limited access, basic guides. Immigration Pack: Comprehensive visa guides, checklists, CV templates. Employment Pack: Job market strategies, salary negotiations, 20+ CV templates. Advanced Pack: All modules, AI chatbot unlimited, citizenship roadmap, cantonal deep dives.'
      },
      {
        q: 'Can I upgrade my pack?',
        a: 'Yes, anytime! Login to dashboard, click "Upgrade Pack", choose new tier. Prorated billing applies. No need to cancel your current pack.'
      },
      {
        q: 'Is the AI chatbot really unlimited?',
        a: 'Yes! Advanced Pack users get unlimited AI chat questions. We use Groq AI (fast responses) and OpenAI for complex legal queries. Chat history saved in your dashboard.'
      },
      {
        q: 'How accurate is your quota data?',
        a: 'Updated weekly from SEM (State Secretariat for Migration). We source official data from cantonal migration offices. Premium packs show real-time availability and waiting times.'
      },
      {
        q: 'Do you provide legal advice or document review?',
        a: 'No direct legal advice through the platform. We provide comprehensive information and guidance. For legal advice, document review, or complex cases, we can connect you with verified Swiss immigration attorneys.'
      },
      {
        q: 'Can I access content offline?',
        a: 'Guides and checklists can be downloaded as PDFs. AI chatbot requires internet. Mobile app coming Q2 2025.'
      },
      {
        q: 'How do I cancel my subscription?',
        a: 'Login to dashboard, go to account settings, click "Cancel Subscription". Access continues until end of billing period. No penalties or fees. You can reactivate anytime.',
      },
      {
        q: 'What happens to my data if I cancel?',
        a: 'Your account data is retained for 90 days after cancellation. You can export your CVs, progress, and chat history before canceling. After 90 days, data is anonymized per GDPR requirements.',
      }
    ]
  },
  {
    category: 'Education & Children',
    questions: [
      {
        q: 'How does the Swiss school system work?',
        a: 'Swiss education is cantonal (varies by canton). Generally: Kindergarten (age 4-6), Primary (6-12), Secondary (12-15), then Gymnasium (university prep) or Vocational (apprenticeship). Public schools are free and high quality. Language of instruction is local language (German/French/Italian).',
      },
      {
        q: 'Can my children attend international schools?',
        a: 'Yes, but international schools are private and expensive (CHF 15,000-30,000/year). Popular options: Zurich International School, International School of Geneva, Basel International School. Public schools are free and excellent - consider integration benefits.',
      },
      {
        q: 'Do children need to learn the local language?',
        a: 'Yes, children must learn the local language for school. Public schools provide language support (Deutsch als Zweitsprache, Français Langue Seconde). Children typically learn faster than adults. Bilingual programs available in some areas.',
      },
      {
        q: 'What are university options for my children?',
        a: 'Swiss universities are excellent and affordable (CHF 1,000-2,000/year for residents). Top universities: ETH Zurich, EPFL, University of Zurich, University of Geneva. Also consider: University of Basel, University of Bern. International recognition is high.',
      },
      {
        q: 'Can my children work while studying?',
        a: 'Yes, students can work part-time (up to 15 hours/week during school, full-time during holidays) with permit. Common jobs: retail, hospitality, tutoring. Helps with integration and pocket money.',
      }
    ]
  }
]

export default function FAQPage() {
  const router = useRouter()
  const [openItems, setOpenItems] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAISuggestions, setShowAISuggestions] = useState(false)

  const toggleItem = (idx: number) => {
    setOpenItems(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  const expandAll = () => {
    const allIndices: number[] = []
    faqs.forEach((category, catIdx) => {
      category.questions.forEach((_, qIdx) => {
        allIndices.push(catIdx * 1000 + qIdx)
      })
    })
    setOpenItems(allIndices)
  }

  const collapseAll = () => {
    setOpenItems([])
  }

  // Get all categories
  const allCategories = useMemo(() => faqs.map(cat => cat.category), [])

  // AI-powered suggestions based on search query
  const aiSuggestions = useMemo(() => {
    const suggestions = []
    const queryLower = searchQuery.toLowerCase()
    
    if (!queryLower || queryLower.includes('permit') || queryLower.includes('visa')) {
      suggestions.push({
        icon: BookOpen,
        title: 'Permit & Visa Questions',
        description: 'Find answers about L, B, G permits and visa requirements',
        category: 'Non-EU Quotas & Permits',
        action: () => {
          setSearchQuery('permit')
          setSelectedCategory('Non-EU Quotas & Permits')
        }
      })
    }
    
    if (!queryLower || queryLower.includes('citizenship') || queryLower.includes('naturalization')) {
      suggestions.push({
        icon: Zap,
        title: 'Citizenship Paths',
        description: 'Learn about the 10-year path and faster options',
        category: 'Citizenship',
        action: () => {
          setSearchQuery('citizenship')
          setSelectedCategory('Citizenship')
        }
      })
    }
    
    if (!queryLower || queryLower.includes('job') || queryLower.includes('employment') || queryLower.includes('work')) {
      suggestions.push({
        icon: MessageCircle,
        title: 'Employment Questions',
        description: 'Salary requirements, CV format, and work permits',
        category: 'Employment & Work Life',
        action: () => {
          setSearchQuery('employment')
          setSelectedCategory('Employment & Work Life')
        }
      })
    }

    if (!queryLower || queryLower.includes('family') || queryLower.includes('spouse') || queryLower.includes('children')) {
      suggestions.push({
        icon: HelpCircle,
        title: 'Family & Housing',
        description: 'Bringing family members and housing requirements',
        category: 'Family & Housing',
        action: () => {
          setSearchQuery('family')
          setSelectedCategory('Family & Housing')
        }
      })
    }

    return suggestions.slice(0, 3)
  }, [searchQuery])

  // Filter FAQs by search and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqs

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(cat => cat.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    }

    return filtered
  }, [searchQuery, selectedCategory])

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-gray-900 dark:text-white px-1 rounded">{part}</mark>
      ) : part
    )
  }

  const totalQuestions = filteredFAQs.reduce((sum, cat) => sum + cat.questions.length, 0)

  return (
    <div className="min-h-screen page-with-fluid-bg dark:bg-gray-950">
      <div className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Exit Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 rounded-full shadow-lg flex items-center justify-center transition-all group"
          aria-label="Exit FAQs"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors" />
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl mb-6 shadow-lg">
            <HelpCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Everything you need to know about Swiss immigration, citizenship, and our platform
          </p>

          {/* Enhanced Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search questions or topics..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowAISuggestions(e.target.value.length > 0)
                }}
                onFocus={() => setShowAISuggestions(searchQuery.length > 0)}
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 shadow-sm hover:shadow-md transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setShowAISuggestions(false)
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
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
                  className="mt-3 bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-blue-100 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900 dark:text-blue-200">AI-Powered Suggestions</span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {aiSuggestions.map((suggestion, idx) => {
                      const Icon = suggestion.icon
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            suggestion.action()
                            setShowAISuggestions(false)
                          }}
                          className="w-full p-4 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-start space-x-3 group"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                              {suggestion.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion.description}</p>
                            <span className="inline-block mt-2 text-xs text-blue-600 font-medium">
                              {suggestion.category}
                            </span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter by Category:</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All Categories
              </button>
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Count & Expand/Collapse */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between max-w-2xl mx-auto mb-6"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Found <span className="font-semibold text-blue-600">{totalQuestions}</span> question{totalQuestions !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategory && ` in ${selectedCategory}`}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
                Collapse All
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* FAQ Items */}
        {filteredFAQs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl"
          >
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No questions found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
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
          <div className="space-y-8">
            {filteredFAQs.map((category, catIdx) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-blue-200 dark:border-gray-600 flex items-center gap-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                  {category.category}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                    ({category.questions.length} {category.questions.length === 1 ? 'question' : 'questions'})
                  </span>
                </h2>
                
                <div className="space-y-3">
                  {category.questions.map((faq, idx) => {
                    const itemId = catIdx * 1000 + idx
                    const isOpen = openItems.includes(itemId)
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group"
                        >
                          <span className="font-semibold text-gray-900 dark:text-white pr-4 group-hover:text-blue-600 transition-colors">
                            {searchQuery ? highlightText(faq.q, searchQuery) : faq.q}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {searchQuery ? highlightText(faq.a, searchQuery) : faq.a}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid md:grid-cols-2 gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">
                AI Chatbot
              </h2>
            </div>
            <p className="text-lg mb-6 opacity-90">
              Get instant answers to your questions with our AI-powered chatbot
            </p>
            <Link 
              href="/#chat" 
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition-all"
            >
              <span>Try AI Chat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">
                Contact Support
              </h2>
            </div>
            <p className="text-lg mb-6 opacity-90">
              Need personalized help? Our team is here to assist you
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-lg transition-all"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Related Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/visas"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all group"
            >
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Visa Guides
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Learn about permits</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all ml-auto" />
            </Link>
            <Link
              href="/citizenship"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all group"
            >
              <Zap className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Citizenship
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Path to citizenship</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all ml-auto" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all group"
            >
              <Sparkles className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Pricing Plans
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">View all features</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all ml-auto" />
            </Link>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  )
}

