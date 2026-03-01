'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  Award, Users, Target, Heart, Globe, Shield, 
  Brain, Lightbulb, CheckCircle2, ArrowRight,
  Info, BookOpen, Calculator,
  Building2, FileCheck, BadgeCheck, Lock, BarChart3, Network
} from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'
import Link from 'next/link'
import MainHeader from '@/components/layout/MainHeader'

export default function AboutPage() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])
  
  const storyRef = useRef(null)
  const valuesRef = useRef(null)
  const teamRef = useRef(null)
  const statsRef = useRef(null)
  const aiSuggestionsRef = useRef(null)
  
  const storyInView = useInView(storyRef, { once: true, margin: '-100px' })
  const valuesInView = useInView(valuesRef, { once: true, margin: '-100px' })
  const teamInView = useInView(teamRef, { once: true, margin: '-100px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const aiSuggestionsInView = useInView(aiSuggestionsRef, { once: true, margin: '-100px' })

  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null)

  // SVG pattern for background
  const patternSvg = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"

  // Animated counter for stats
  const [animatedStats, setAnimatedStats] = useState([
    { number: 0, label: 'Success Stories', suffix: '+' },
    { number: 0, label: 'Success Rate', suffix: '%' },
    { number: 0, label: 'Cantons Covered', suffix: '' },
    { number: 0, label: 'Expert Guides', suffix: '+' }
  ])

  useEffect(() => {
    if (statsInView) {
      const targets = [10000, 92, 26, 50]
      const durations = [2000, 1500, 1000, 1500]
      
      targets.forEach((target, idx) => {
        const duration = durations[idx]
        const steps = 60
        const increment = target / steps
        let current = 0
        
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          
          setAnimatedStats(prev => {
            const newStats = [...prev]
            newStats[idx].number = Math.floor(current)
            return newStats
          })
        }, duration / steps)
      })
    }
  }, [statsInView])

  const aiSuggestions = [
    {
      icon: Brain,
      title: 'Get Personalized Guidance',
      description: 'Ask our AI assistant about your specific immigration situation and get tailored advice.',
      action: 'Try AI Chat',
      link: '/tools',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Calculator,
      title: 'Calculate Your Costs',
      description: 'Use our cost calculator to estimate your living expenses in Switzerland.',
      action: 'Calculate Now',
      link: '/tools',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: BookOpen,
      title: 'Explore Guides',
      description: 'Browse comprehensive guides covering all aspects of Swiss immigration.',
      action: 'View Guides',
      link: '/guides',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Target,
      title: 'Check Eligibility',
      description: 'Find out which permits you qualify for based on your background.',
      action: 'Check Eligibility',
      link: '/tools',
      color: 'from-orange-500 to-red-600'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950">
      <MainHeader />
      
      <div className="relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-32">
          {/* Professional Hero Section */}
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="text-center mb-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' as const }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <BadgeCheck className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Trusted Immigration Platform</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                About Swiss Immigration Pro
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light"
              >
                Empowering individuals and families worldwide with expert guidance, cutting-edge technology, and comprehensive resources to navigate Swiss immigration successfully.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-6 mt-12"
              >
                <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Verified</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Expert-Led Platform</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Success Rate</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">92% Approval Rate</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Community</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">10,000+ Success Stories</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        {/* Mission & Vision */}
        <motion.div
          ref={storyRef}
          initial="hidden"
          animate={storyInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="mb-24"
        >
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                To democratize access to expert Swiss immigration guidance by combining legal expertise, cutting-edge technology, and comprehensive resources. We empower individuals and families worldwide to navigate the Swiss immigration system with confidence, clarity, and success.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                To become the world's most trusted and comprehensive platform for Swiss immigration, recognized for our accuracy, innovation, and commitment to helping people achieve their dreams of living and working in Switzerland.
              </p>
            </motion.div>
          </div>

          {/* Our Story */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Our Story</h2>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Founded in 2020, Swiss Immigration Pro emerged from a shared frustration with the complexity and opacity of Swiss immigration processes. Our founding team—comprising experienced immigration lawyers, former SEM officials, and technology entrepreneurs—recognized that critical information was scattered across 26 cantons, often outdated, or accessible only through expensive legal consultations.
                </p>
                
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Our{' '}
                  <Tooltip
                    content="Our team includes certified Swiss immigration lawyers, former SEM officials, and experienced immigration consultants with decades of combined experience."
                    position="top"
                  >
                    <strong className="text-blue-600 cursor-help font-semibold">expert team</strong>
                  </Tooltip>
                  {' '}of certified Swiss immigration lawyers and professionals has successfully guided thousands of immigrants from every continent through the Swiss immigration system. However, we saw an opportunity to scale this expertise and make it accessible to everyone.
                </p>
                
                <p className="text-gray-700 text-lg leading-relaxed">
                  Today, we operate an{' '}
                  <Tooltip
                    content="Our AI assistant uses advanced language models trained on Swiss immigration law, official documents, and expert knowledge to provide accurate, up-to-date guidance."
                    position="top"
                  >
                    <strong className="text-purple-600 cursor-help font-semibold">AI-powered platform</strong>
                  </Tooltip>
                  {' '}that combines comprehensive guides, real-time regulatory updates, interactive tools, and unlimited AI assistance. We continuously update our content based on official SEM publications, cantonal requirements, and verified legal sources to ensure accuracy and relevance.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          ref={valuesRef}
          initial="hidden"
          animate={valuesInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: 'Accuracy & Integrity',
                description: 'We source information exclusively from official Swiss authorities—SEM, cantonal migration offices, and embassies—and verify every detail with certified immigration lawyers before publication.',
                tooltip: 'All content is cross-referenced with official sources and undergoes rigorous review by certified immigration lawyers.',
                color: 'bg-blue-50 border-blue-200',
                iconColor: 'text-blue-600',
                iconBg: 'bg-blue-100'
              },
              {
                icon: Heart,
                title: 'Empathy & Understanding',
                description: 'We recognize that immigration is a deeply personal journey. Our platform is designed with compassion, addressing both practical needs and emotional challenges throughout the process.',
                tooltip: 'We conduct regular user research and feedback sessions to ensure our platform addresses real emotional and practical needs.',
                color: 'bg-pink-50 border-pink-200',
                iconColor: 'text-pink-600',
                iconBg: 'bg-pink-100'
              },
              {
                icon: Target,
                title: 'Results-Driven Excellence',
                description: 'We measure our success by your success. Our platform is built around proven strategies and methodologies that lead to actual visa approvals and citizenship grants.',
                tooltip: 'Our success metrics are tracked through user feedback and verified outcomes. We continuously refine our guidance based on what actually works.',
                color: 'bg-green-50 border-green-200',
                iconColor: 'text-green-600',
                iconBg: 'bg-green-100'
              },
              {
                icon: Globe,
                title: 'Accessibility & Inclusivity',
                description: 'Swiss immigration guidance should not be a privilege reserved for the wealthy. We make expert knowledge affordable and accessible to immigrants from all backgrounds and circumstances.',
                tooltip: 'We offer free daily AI assistance, affordable pricing tiers, and comprehensive free resources to ensure equitable access to quality immigration guidance.',
                color: 'bg-purple-50 border-purple-200',
                iconColor: 'text-purple-600',
                iconBg: 'bg-purple-100'
              }
            ].map((value, idx) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                onMouseEnter={() => setHoveredValue(idx)}
                onMouseLeave={() => setHoveredValue(null)}
                whileHover={{ y: -4 }}
                className="relative group"
              >
                <div className={`bg-white dark:bg-gray-800 border-2 ${value.color} dark:border-gray-700 rounded-xl p-8 h-full transition-all duration-300 hover:shadow-xl`}>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className={`w-14 h-14 ${value.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <value.icon className={`w-7 h-7 ${value.iconColor}`} />
                    </div>
                    <Tooltip content={value.tooltip} position="top">
                      <Info className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-help transition-colors flex-shrink-0 mt-1" />
                    </Tooltip>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed text-base">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leadership Team */}
        <motion.div
          ref={teamRef}
          initial="hidden"
          animate={teamInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced professionals dedicated to your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Maria Schmidt',
                role: 'Chief Immigration Counsel',
                credentials: 'JD, University of Zürich',
                experience: '25+ years in Swiss immigration law',
                specialty: 'Non-EU permits, citizenship applications, complex cases',
                tooltip: 'Dr. Schmidt has successfully handled over 5,000 immigration cases and is a recognized expert in Swiss immigration law, regularly consulted by cantonal authorities.',
                emoji: '👩‍⚖️'
              },
              {
                name: 'Jean-Luc Dubois',
                role: 'Head of Product & Technology',
                credentials: 'Former LinkedIn, Google',
                experience: '15+ years building user-centric products',
                specialty: 'AI-powered platforms, product strategy, user experience',
                tooltip: 'Jean-Luc brings extensive experience from leading tech companies, specializing in building scalable platforms that solve complex problems.',
                emoji: '👨‍💻'
              },
              {
                name: 'Sofia Chen',
                role: 'Head of User Success',
                credentials: 'MBA, INSEAD',
                experience: '8+ years in immigration services',
                specialty: 'User experience, customer success, process optimization',
                tooltip: 'Sofia has personally guided thousands of immigrants through the Swiss system, bringing deep understanding of user needs and challenges.',
                emoji: '👩‍💼'
              }
            ].map((member, idx) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                onMouseEnter={() => setHoveredMember(idx)}
                onMouseLeave={() => setHoveredMember(null)}
                whileHover={{ y: -4 }}
                className="relative group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl h-full">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 border-4 border-white shadow-lg">
                      {member.emoji}
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {member.name}
                      </h3>
                      <Tooltip content={member.tooltip} position="top">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-help transition-colors" />
                      </Tooltip>
                    </div>
                    
                    <div className="text-blue-600 font-semibold mb-2">
                      {member.role}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-1">
                      {member.credentials}
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-4">
                      {member.experience}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <strong className="text-gray-900">Specialization:</strong> {member.specialty}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact & Statistics */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-12 text-white relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-20" 
              style={{ backgroundImage: patternSvg }}
            />
            
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-4 text-center"
              >
                Our Impact
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={statsInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
                className="text-blue-100 text-center mb-12 text-lg"
              >
                Measurable results that demonstrate our commitment to your success
              </motion.p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {animatedStats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + idx * 0.1, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="relative"
                  >
                    <Tooltip
                      content={
                        idx === 0 ? 'Verified success stories from users who obtained their permits or citizenship' :
                        idx === 1 ? 'Success rate based on user-reported outcomes and verified applications' :
                        idx === 2 ? 'All 26 Swiss cantons are covered in our comprehensive guides and tools' :
                        'Expert-authored guides covering every aspect of Swiss immigration'
                      }
                      position="top"
                    >
                      <div className="cursor-help text-center">
                        <motion.div
                          className="text-4xl md:text-5xl font-bold mb-2"
                          animate={{
                            scale: [1, 1.03, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: idx * 0.2
                          }}
                        >
                          {stat.number.toLocaleString()}{stat.suffix}
                        </motion.div>
                        <div className="text-blue-100 text-sm font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </Tooltip>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Get Started Section */}
        <motion.div
          ref={aiSuggestionsRef}
          initial="hidden"
          animate={aiSuggestionsInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="mb-24"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get Started Today
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive tools and resources to begin your Swiss immigration journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiSuggestions.map((suggestion, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                onMouseEnter={() => setSelectedSuggestion(idx)}
                onMouseLeave={() => setSelectedSuggestion(null)}
                whileHover={{ y: -4 }}
                className="relative group"
              >
                <Link href={suggestion.link}>
                  <motion.div
                    className={`bg-gradient-to-br ${suggestion.color} rounded-xl p-8 text-white relative overflow-hidden cursor-pointer h-full shadow-lg hover:shadow-xl transition-shadow`}
                    animate={{
                      scale: selectedSuggestion === idx ? 1.01 : 1
                    }}
                  >
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                        <suggestion.icon className="w-7 h-7" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3">
                        {suggestion.title}
                      </h3>
                      
                      <p className="text-white/90 mb-6 leading-relaxed text-base">
                        {suggestion.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-white font-semibold text-sm">
                        <span>{suggestion.action}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications & Trust */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Certifications & Trust</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We maintain the highest standards of accuracy, security, and professional integrity
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileCheck,
                  title: 'Verified Information',
                  description: 'All content is verified by certified Swiss immigration lawyers and cross-referenced with official SEM and cantonal sources.'
                },
                {
                  icon: Lock,
                  title: 'Data Security',
                  description: 'We employ industry-leading security measures to protect your personal information and ensure complete privacy.'
                },
                {
                  icon: BadgeCheck,
                  title: 'Professional Standards',
                  description: 'Our team adheres to the highest professional standards and ethical guidelines in immigration law and consulting.'
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trusted Partners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Trusted Partners & Sources
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[
              { name: 'Swiss Federal Office for Migration (SEM)', icon: Building2 },
              { name: 'Certified Immigration Lawyers', icon: Award },
              { name: 'Cantonal Migration Offices', icon: Network },
              { name: 'Swiss Embassies Worldwide', icon: Globe }
            ].map((partner, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <partner.icon className="w-8 h-8 text-gray-600" />
                <div className="text-sm font-semibold text-gray-700 text-center max-w-[200px]">
                  {partner.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  )
}
