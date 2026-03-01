'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle, Clock, Shield, FileText, 
  Award, Users, Briefcase, DollarSign,
  TrendingUp, BadgeCheck, ChevronRight, AlertTriangle,
  Target, BarChart3, Zap, MapPin, Building, TrendingDown, Star,
  GraduationCap, PieChart, Home, Globe, Heart
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import LayerHeader from '@/components/layout/LayerHeader'

export default function USPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    saveLayerSelection('us')
  }, [])

  const saveLayerSelection = async (layer: string) => {
    try {
      await fetch('/api/user/save-layer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layer }),
      })
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedLayer', layer)
        localStorage.setItem('layerSelectedAt', new Date().toISOString())
        document.cookie = `selectedLayer=${layer}; path=/; max-age=31536000`
      }
    } catch (error) {
      console.error('Failed to save layer:', error)
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedLayer', layer)
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <LayerHeader
        layer="us"
        homeHref="/us"
        customBadge={{
          icon: <Target className="w-3.5 h-3.5" />,
          text: 'US Citizen Priority: Fast-Track Processing',
          bgColor: 'bg-indigo-600',
          textColor: 'text-white'
        }}
      />

      {/* Hero Section - Dark & Sleek */}
      <section className="relative overflow-hidden h-[85vh] flex items-center bg-slate-950">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/americans/hero-us-switzerland.png"
            alt="US to Switzerland Professional Pathway"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-6 border border-indigo-400/20 text-indigo-200">
                <Target className="w-3.5 h-3.5" />
                <span>Premium US Citizen Route</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                US Citizens:
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-blue-200">
                  Priority Access to Switzerland
                </span>
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl font-light">
                As a US citizen, you enjoy <strong className="text-white font-medium">priority processing</strong> and streamlined pathways.
                Leverage your professional expertise to secure your Swiss work permit and advance your international career.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/us/visas"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-500/25"
                >
                  Start Your Swiss Journey
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/us/requirements"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-medium px-8 py-3.5 rounded-lg transition-all border border-white/10"
                >
                  US Citizen Requirements
                </Link>
              </div>

              <div className="flex gap-10 pt-8 border-t border-white/5">
                {[
                  { value: '92%', label: 'Success Rate' },
                  { value: 'CHF 80k+', label: 'Min Salary' },
                  { value: '8-12', label: 'Weeks Process' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Minimalist Cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value: 'High Salary', label: 'CHF 100k+ Avg', icon: DollarSign, color: 'text-emerald-400' },
                { value: '10 Years', label: 'Citizenship', icon: Award, color: 'text-indigo-400' },
                { value: 'English', label: 'Business Lang', icon: Users, color: 'text-blue-400' },
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="bg-slate-900/50 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                  <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Challenges & Requirements Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wide">
              <Target className="w-3.5 h-3.5" />
              <span>US Citizen Professional Pathway</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Your Professional Advantage
            </h2>
            <p className="text-slate-600 text-lg font-light">
              As a US citizen, you have distinct advantages in the Swiss immigration process. We maximize your opportunities with expert guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 border-l-4 border-rose-500 pl-4 mb-6">Key Requirements</h3>
              {[
                {
                  title: 'Labor Market Test',
                  desc: 'Employer must prove no suitable Swiss/EU/EFTA candidate could fill the role. This requires proper job posting and documentation.',
                  icon: Users,
                  detail: 'Mandatory per VZAE Art. 21'
                },
                { 
                  title: 'Salary Threshold', 
                  desc: 'Minimum CHF 80,000+ for permit approval, but CHF 100k+ recommended for competitive applications. Varies by canton.', 
                  icon: DollarSign,
                  detail: 'Cantonal variations apply'
                },
                {
                  title: 'Qualified Profession',
                  desc: 'University degree or equivalent professional qualification required. Must be recognized and relevant to the position.',
                  icon: GraduationCap,
                  detail: 'Apostilled certificates needed'
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 group bg-white p-5 rounded-xl border border-slate-100 hover:border-rose-200 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 group-hover:bg-rose-100 transition-colors shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-2">{item.desc}</p>
                    <span className="text-xs text-rose-600 font-medium">{item.detail}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Our Winning Strategy</h3>
              </div>
              <div className="space-y-4">
                {[
                  { 
                    strategy: 'CV Optimization for "Specialized Skills"',
                    detail: 'Position your unique expertise to stand out in labor market test'
                  },
                  { 
                    strategy: 'Strategic Timing with Quota Release Dates',
                    detail: 'Apply in Q1 for best availability - we track quota status'
                  },
                  { 
                    strategy: 'Salary Negotiation Benchmarking',
                    detail: 'Industry-specific data to negotiate competitive packages'
                  },
                  { 
                    strategy: 'Employer Support & Documentation',
                    detail: 'Help employers prepare compelling labor market justification'
                  },
                  {
                    strategy: 'Cantonal Strategy Selection',
                    detail: 'Choose cantons with higher approval rates and faster processing'
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 bg-white p-5 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all"
                  >
                    <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm text-slate-900 font-semibold block mb-1">{item.strategy}</span>
                      <span className="text-xs text-slate-500">{item.detail}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* US Journey Video */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Your Journey to Switzerland
          </h2>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/images/environment/zurich-city.jpg"
              className="w-full h-full object-cover"
              src="/images/americans/video-us-journey.mp4"
            />
          </div>
        </div>
      </section>

      {/* Success Stories - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-900/20 blur-3xl rounded-full transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-purple-900/10 blur-3xl rounded-full transform -translate-x-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wide">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>Real Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From US Professionals to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Swiss Residents</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              See how we've helped hundreds of American professionals navigate the quota system successfully
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Story 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-2 text-amber-400 font-medium text-sm mb-4">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>Tech Industry</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                From Silicon Valley to <span className="text-indigo-400">Crypto Valley, Zug</span>
              </h3>
              <blockquote className="text-lg text-slate-300 mb-6 leading-relaxed italic">
                "The quota system was daunting. Swiss Immigration Pro helped position my specialized tech skills perfectly. My B-permit was approved in 9 weeks."
              </blockquote>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold">SC</div>
                <div>
                  <div className="font-bold text-lg">Sarah Chen</div>
                  <div className="text-sm text-indigo-300">Senior Product Manager</div>
                  <div className="text-xs text-slate-400 mt-1">Zug, Switzerland</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">B Permit</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">9 Weeks</span>
                <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">CHF 120k</span>
              </div>
            </motion.div>

            {/* Story 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-2 text-amber-400 font-medium text-sm mb-4">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>Finance Industry</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                From Wall Street to <span className="text-indigo-400">Bahnhofstrasse, Zurich</span>
              </h3>
              <blockquote className="text-lg text-slate-300 mb-6 leading-relaxed italic">
                "The labor market test seemed impossible, but their team helped my employer craft the perfect justification. Approved in Q1!"
              </blockquote>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-lg font-bold">MJ</div>
                <div>
                  <div className="font-bold text-lg">Michael Johnson</div>
                  <div className="text-sm text-indigo-300">Financial Analyst</div>
                  <div className="text-xs text-slate-400 mt-1">Zurich, Switzerland</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">B Permit</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">11 Weeks</span>
                <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">CHF 110k</span>
              </div>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '300+', label: 'US Clients Helped', icon: Users },
              { number: '92%', label: 'Success Rate', icon: TrendingUp },
              { number: '9.5', label: 'Weeks Avg', icon: Clock },
              { number: 'CHF 105k', label: 'Avg Salary', icon: DollarSign },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">{stat.number}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Permit Types - Enhanced Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Residence Permits for US Citizens</h2>
              <p className="text-slate-600">Your options as a third-country national</p>
            </div>
            <Link href="/us/visas" className="hidden md:flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View All Permits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                type: 'L Permit',
                name: 'Short-Term',
                duration: 'Up to 12 Months',
                desc: 'Temporary permit, renewable once. Ideal for project-based work.',
                icon: Clock,
                quota: 'Available',
                salary: 'CHF 70k+'
              },
              {
                type: 'B Permit',
                name: 'Residence',
                duration: 'Annual Renewal',
                desc: 'Standard permit for qualified professionals. Perfect for long-term career development.',
                icon: Home,
                quota: 'Standard',
                salary: 'CHF 100k+'
              },
              {
                type: 'C Permit',
                name: 'Settlement',
                duration: 'Permanent',
                desc: 'Granted after 10 years of continuous residence. Full Swiss citizenship pathway.',
                icon: Award,
                quota: 'No quota',
                salary: 'N/A'
              },
              {
                type: 'Investment',
                name: 'Entrepreneur',
                duration: '5 Years',
                desc: 'For entrepreneurs investing CHF 100k+ and creating jobs for locals.',
                icon: Briefcase,
                quota: 'Limited',
                salary: 'CHF 100k+'
              }
            ].map((permit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <permit.icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wider">{permit.type}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{permit.name}</h3>
                <div className="text-xs text-slate-400 mb-3 font-medium">{permit.duration}</div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {permit.desc}
                </p>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded font-medium">{permit.quota}</span>
                  {permit.salary !== 'N/A' && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-medium">{permit.salary}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wide">
              <Target className="w-3.5 h-3.5" />
              <span>Step-by-Step Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Application Roadmap</h2>
            <p className="text-slate-600 text-lg">Your detailed path from application to arrival in Switzerland</p>
          </div>

          <div className="relative">
            {/* Desktop Line */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-200 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { 
                  step: '01', 
                  title: 'Job Offer & Preparation', 
                  desc: 'Secure employer sponsorship and prepare all documentation (CV, certificates, references)',
                  color: 'bg-slate-900',
                  timeline: '2-4 weeks',
                  icon: Briefcase
                },
                { 
                  step: '02', 
                  title: 'Cantonal Application', 
                  desc: 'Employer submits application to cantonal migration office with labor market justification',
                  color: 'bg-indigo-600',
                  timeline: '1-2 weeks',
                  icon: FileText
                },
                {
                  step: '03',
                  title: 'Federal Review (SEM)',
                  desc: 'State Secretariat for Migration reviews application and provides final approval',
                  color: 'bg-indigo-600',
                  timeline: '4-8 weeks',
                  icon: Shield
                },
                { 
                  step: '04', 
                  title: 'D-Visa & Arrival', 
                  desc: 'Receive D-visa, enter Switzerland, register at commune, and collect permit card',
                  color: 'bg-emerald-500',
                  timeline: '2-4 weeks',
                  icon: CheckCircle
                },
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div className="w-24 h-12 rounded-full bg-blue-500/20 text-blue-700 flex items-center justify-center font-bold text-sm mb-6 mx-auto md:mx-0 z-10 relative border-2 border-blue-200/30">
                    <div className="text-center">
                      <div className="text-xs">{item.step}</div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 group-hover:shadow-xl transition-all text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <item.icon className="w-5 h-5 text-indigo-600" />
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.timeline}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16 bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">Total Timeline: 8-12 Weeks</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The entire process typically takes 8-12 weeks from application submission to permit approval.
                  However, this can vary based on canton processing times and completeness of documentation.
                  Early application significantly improves approval chances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - New */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Switzerland?
            </h2>
            <p className="text-slate-600 text-lg">
              Beyond the permit process, discover what makes Switzerland an exceptional destination for US professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'High Salaries',
                desc: 'Average tech salaries exceed CHF 120k. Finance professionals earn CHF 150k+. Strong purchasing power.',
                color: 'bg-emerald-50 text-emerald-600',
                stat: 'CHF 120k+'
              },
              {
                icon: Shield,
                title: 'Safety & Stability',
                desc: 'World\'s safest country, stable economy, excellent healthcare system, and political neutrality.',
                color: 'bg-blue-50 text-blue-600',
                stat: '#1 Safety'
              },
              {
                icon: Globe,
                title: 'International Hub',
                desc: 'English widely spoken in business. Home to UN, multinationals, and global organizations.',
                color: 'bg-purple-50 text-purple-600',
                stat: '190+ Nationalities'
              },
              {
                icon: Heart,
                title: 'Quality of Life',
                desc: 'Alpine beauty, excellent public transport, work-life balance, and world-class education.',
                color: 'bg-rose-50 text-rose-600',
                stat: 'Top Rated'
              },
              {
                icon: Award,
                title: 'Career Growth',
                desc: 'Access to European markets, innovation hubs, and opportunities in finance, tech, and pharma.',
                color: 'bg-amber-50 text-amber-600',
                stat: 'Global Reach'
              },
              {
                icon: Home,
                title: 'Family Benefits',
                desc: 'Family reunification possible, excellent schools, and comprehensive social security system.',
                color: 'bg-indigo-50 text-indigo-600',
                stat: 'Family Friendly'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.stat}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase tracking-wide">
                <Zap className="w-3.5 h-3.5" />
                <span>Start Your Journey Today</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Make Your Move?
              </h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Don't let bureaucracy stand in the way of your career. With our proven strategies and expert guidance, 
                your Swiss dream is absolutely achievable. Join 300+ successful US professionals.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Link 
                  href="/us/tools" 
                  className="group inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/50 hover:-translate-y-1"
                >
                  <Target className="w-5 h-5" />
                  Free Assessment
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/us/pricing" 
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-semibold transition-all border border-white/20"
                >
                  <Award className="w-5 h-5" />
                  View Plans
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                {[
                  { icon: CheckCircle, text: '92% Success Rate', subtext: 'With proper prep' },
                  { icon: Users, text: '300+ Clients', subtext: 'US professionals' },
                  { icon: Clock, text: '9.5 Weeks Avg', subtext: 'Processing time' },
                  { icon: Star, text: 'Expert Guidance', subtext: 'Proven strategies' },
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <item.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                    <div className="text-white font-semibold text-sm mb-1">{item.text}</div>
                    <div className="text-slate-400 text-xs">{item.subtext}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
