'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Award, Users, Target, Heart, Globe, Shield,
  Brain, Lightbulb, CheckCircle2, ArrowRight,
  BookOpen, Calculator,
  Building2, FileCheck, BadgeCheck, Lock, BarChart3, Network
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const CORE_VALUES = [
  {
    icon: Shield,
    title: 'Accuracy & Integrity',
    description: 'We source information exclusively from official Swiss authorities — SEM, cantonal migration offices, and embassies — and verify every detail with certified immigration lawyers before publication.',
    accent: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Heart,
    title: 'Empathy & Understanding',
    description: 'We recognize that immigration is a deeply personal journey. Our platform is designed with compassion, addressing both practical needs and emotional challenges throughout the process.',
    accent: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    icon: Target,
    title: 'Results-Driven Excellence',
    description: 'We measure our success by your success. Our platform is built around proven strategies and methodologies that lead to actual visa approvals and citizenship grants.',
    accent: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Globe,
    title: 'Accessibility & Inclusivity',
    description: 'Swiss immigration guidance should not be a privilege reserved for the wealthy. We make expert knowledge affordable and accessible to immigrants from all backgrounds.',
    accent: 'bg-violet-50 dark:bg-violet-900/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
]

const TEAM = [
  {
    name: 'Dr. Maria Schmidt',
    role: 'Chief Immigration Counsel',
    credentials: 'LL.M in Law, University of Zürich',
    experience: '25+ years in Swiss immigration law',
    specialty: 'Non-EU permits, citizenship applications, complex cases',
    photo: '/images/avatars/maria-schmidt.jpg',
  },
  {
    name: 'Jean-Luc Dubois',
    role: 'Head of Product & Technology',
    credentials: 'Former LinkedIn, Google',
    experience: '15+ years building user-centric products',
    specialty: 'AI-powered platforms, product strategy, user experience',
    photo: '/images/avatars/thomas-weber.jpg',
  },
  {
    name: 'Sofia Chen',
    role: 'Head of User Success',
    credentials: 'MBA, INSEAD',
    experience: '8+ years in immigration services',
    specialty: 'User experience, customer success, process optimization',
    photo: '/images/avatars/sophie-mueller.jpg',
  },
]

const STATS_TARGETS = [
  { target: 18500, label: 'Successful Applicants', suffix: '+' },
  { target: 96, label: 'Success Rate', suffix: '%' },
  { target: 26, label: 'Cantons Covered', suffix: '' },
  { target: 31, label: 'Learning Modules', suffix: '' },
]

const AI_SUGGESTIONS = [
  {
    icon: Brain,
    title: 'Get Personalized Guidance',
    description: 'Ask our AI assistant about your specific immigration situation and get tailored advice.',
    action: 'Try AI Chat',
    link: '/tools',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    icon: Calculator,
    title: 'Calculate Your Costs',
    description: 'Use our cost calculator to estimate your living expenses in Switzerland.',
    action: 'Calculate Now',
    link: '/tools',
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    icon: BookOpen,
    title: 'Explore Guides',
    description: 'Browse comprehensive guides covering all aspects of Swiss immigration.',
    action: 'View Guides',
    link: '/guides',
    gradient: 'from-violet-600 to-purple-700',
  },
  {
    icon: Target,
    title: 'Check Eligibility',
    description: 'Find out which permits you qualify for based on your background.',
    action: 'Check Eligibility',
    link: '/tools',
    gradient: 'from-orange-600 to-red-700',
  },
]

const CERTIFICATIONS = [
  {
    icon: FileCheck,
    title: 'Verified Information',
    description: 'All content is verified by certified Swiss immigration lawyers and cross-referenced with official SEM and cantonal sources.',
  },
  {
    icon: Lock,
    title: 'Data Security',
    description: 'We employ industry-leading security measures to protect your personal information and ensure complete privacy.',
  },
  {
    icon: BadgeCheck,
    title: 'Professional Standards',
    description: 'Our team adheres to the highest professional standards and ethical guidelines in immigration law and consulting.',
  },
]

const PARTNERS = [
  { name: 'Swiss Federal Office for Migration (SEM)', icon: Building2 },
  { name: 'Certified Immigration Lawyers', icon: Award },
  { name: 'Cantonal Migration Offices', icon: Network },
  { name: 'Swiss Embassies Worldwide', icon: Globe },
]

export default function AboutPage() {
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [animatedStats, setAnimatedStats] = useState(
    STATS_TARGETS.map((s) => ({ number: 0, label: s.label, suffix: s.suffix }))
  )

  const animateStats = useCallback(() => {
    STATS_TARGETS.forEach((stat, idx) => {
      const steps = 60
      const increment = stat.target / steps
      const duration = idx === 0 ? 2000 : idx === 2 ? 1000 : 1500
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= stat.target) {
          current = stat.target
          clearInterval(timer)
        }
        setAnimatedStats((prev) => {
          const next = [...prev]
          next[idx] = { ...next[idx], number: Math.floor(current) }
          return next
        })
      }, duration / steps)
    })
  }, [])

  useEffect(() => {
    if (!statsRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true)
          animateStats()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [statsVisible, animateStats])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-white dark:bg-slate-950">
        <div className="sip-container text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-blue-100 dark:border-blue-800">
            <BadgeCheck className="w-3.5 h-3.5" />
            Trusted Immigration Platform
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5">
            About Swiss Immigration Pro
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            Empowering individuals and families worldwide with expert guidance,
            cutting-edge technology, and comprehensive resources to navigate Swiss
            immigration successfully.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Shield, label: 'Expert-Led Platform', sub: 'Verified' },
              { icon: BarChart3, label: '92% Approval Rate', sub: 'Success Rate' },
              { icon: Users, label: '10,000+ Success Stories', sub: 'Community' },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
              >
                <badge.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {badge.sub}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {badge.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="sip-section bg-slate-50/50 dark:bg-slate-900/30">
        <div className="sip-container">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                To democratize access to expert Swiss immigration guidance by combining
                legal expertise, cutting-edge technology, and comprehensive resources. We
                empower individuals and families worldwide to navigate the Swiss immigration
                system with confidence, clarity, and success.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Vision</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                To become the world&apos;s most trusted and comprehensive platform for Swiss
                immigration, recognized for our accuracy, innovation, and commitment to
                helping people achieve their dreams of living and working in Switzerland.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Our Story</h2>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-10">
              <div className="space-y-5 text-slate-500 dark:text-slate-400 leading-relaxed">
                <p>
                  Founded in 2020, Swiss Immigration Pro emerged from a shared frustration
                  with the complexity and opacity of Swiss immigration processes. Our
                  founding team — comprising experienced immigration lawyers, former SEM
                  officials, and technology entrepreneurs — recognized that critical
                  information was scattered across 26 cantons, often outdated, or accessible
                  only through expensive legal consultations.
                </p>
                <p>
                  Our <strong className="text-blue-600 dark:text-blue-400 font-semibold">expert team</strong> of
                  certified Swiss immigration lawyers and professionals has successfully
                  guided thousands of immigrants from every continent through the Swiss
                  immigration system. However, we saw an opportunity to scale this expertise
                  and make it accessible to everyone.
                </p>
                <p>
                  Today, we operate an{' '}
                  <strong className="text-violet-600 dark:text-violet-400 font-semibold">AI-powered platform</strong>{' '}
                  that combines comprehensive guides, real-time regulatory updates,
                  interactive tools, and unlimited AI assistance. We continuously update our
                  content based on official SEM publications, cantonal requirements, and
                  verified legal sources to ensure accuracy and relevance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="sip-section bg-white dark:bg-slate-950">
        <div className="sip-container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
              What We Stand For
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Our Core Values
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CORE_VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 ${value.accent} rounded-xl flex items-center justify-center shrink-0`}>
                    <value.icon className={`w-6 h-6 ${value.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                    {value.title}
                  </h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="sip-section bg-slate-50/50 dark:bg-slate-900/30">
        <div className="sip-container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
              Meet the Team
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Leadership Team
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Experienced professionals dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 ring-3 ring-slate-100 dark:ring-slate-800 shadow-md">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  {member.role}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{member.credentials}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{member.experience}</p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Specialization:</span>{' '}
                    {member.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Statistics */}
      <section className="sip-section bg-white dark:bg-slate-950">
        <div className="sip-container">
          <div
            ref={statsRef}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden"
          >
            {/* Subtle pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Our Impact</h2>
              <p className="text-blue-100 text-center mb-10 max-w-xl mx-auto">
                Measurable results that demonstrate our commitment to your success
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                {animatedStats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl sm:text-4xl font-extrabold mb-1">
                      {stat.number.toLocaleString()}{stat.suffix}
                    </div>
                    <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started */}
      <section className="sip-section bg-slate-50/50 dark:bg-slate-900/30">
        <div className="sip-container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
              Start Your Journey
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Get Started Today
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Explore our comprehensive tools and resources to begin your Swiss immigration journey
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {AI_SUGGESTIONS.map((suggestion) => (
              <Link key={suggestion.title} href={suggestion.link} className="group">
                <div
                  className={`bg-gradient-to-br ${suggestion.gradient} rounded-2xl p-7 text-white relative overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-full`}
                >
                  {/* Subtle decorative circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                      <suggestion.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{suggestion.title}</h3>
                    <p className="text-white/85 text-sm leading-relaxed mb-5">
                      {suggestion.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all">
                      {suggestion.action}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Trust */}
      <section className="sip-section bg-white dark:bg-slate-950">
        <div className="sip-container">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-10">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Certifications & Trust
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                We maintain the highest standards of accuracy, security, and professional integrity
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {CERTIFICATIONS.map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partners */}
      <section className="sip-section bg-slate-50/50 dark:bg-slate-900/30">
        <div className="sip-container text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Trusted Partners & Sources
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col items-center gap-2.5 px-6 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
              >
                <partner.icon className="w-7 h-7 text-slate-500 dark:text-slate-400" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 text-center max-w-[180px]">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
