'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle, Clock, Shield, FileText, 
  Award, Users, Briefcase, Home, Globe,
  TrendingUp, BadgeCheck, ChevronRight, Star,
  Zap, Target, BarChart3, MapPin, Heart, Building
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import LayerHeader from '@/components/layout/LayerHeader'

export default function EUPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    saveLayerSelection('eu')
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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <LayerHeader
        layer="eu"
        homeHref="/eu"
        customBadge={{
          icon: <Star className="w-3.5 h-3.5" />,
          text: 'EU/EFTA Freedom of Movement',
          bgColor: 'bg-blue-600',
          textColor: 'text-white'
        }}
      />

      {/* Enhanced Hero Section - Cleaner & More Modern */}
      <section className="relative overflow-hidden h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/europeans/hero-eu-freedom.jpeg"
            alt="EU/EFTA Freedom of Movement - Swiss Alps"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-white"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-white/10 text-blue-100"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Bilateral Agreement Benefits</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                EU/EFTA Citizens:
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                  Privileged Access
                </span>
              </h1>

              <p className="text-lg text-slate-200 mb-8 leading-relaxed max-w-xl font-light">
                Enjoy <strong className="text-white font-semibold">freedom of movement rights</strong> that 
                simplify your Swiss immigration journey. Zero quotas, rapid processing, and a 
                direct 5-year path to citizenship.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  href="/eu/visas" 
                  className="group inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-3.5 rounded-lg transition-all hover:bg-blue-50 shadow-lg hover:shadow-xl"
                >
                  Explore Permits
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/eu/process" 
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium px-8 py-3.5 rounded-lg transition-all border border-white/20"
                >
                  View Process
                </Link>
              </div>

              <div className="flex gap-8 pt-8 border-t border-white/10">
                {[
                  { value: '96%', label: 'Success Rate' },
                  { value: '18.5K+', label: 'EU Clients' },
                  { value: '2-4', label: 'Weeks Avg.' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero Floating Cards - Glassmorphism */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value: 'No Quotas', label: 'Work Permits', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
                { value: '5 Years', label: 'To Citizenship', icon: Award, color: 'text-blue-400', bg: 'bg-blue-500/20' },
                { value: 'Immediate', label: 'Work Rights', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/20' },
                { value: 'Simplified', label: 'Procedures', icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-xl font-bold text-white mb-0.5">{stat.value}</div>
                  <div className="text-slate-300 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center divide-x divide-slate-100">
            {[
              { number: '2.4M', label: 'EU Residents', icon: Users },
              { number: '25.7%', label: 'Population Share', icon: BarChart3 },
              { number: '190+', label: 'Nationalities', icon: Globe },
              { number: 'High', label: 'Quality of Life', icon: Heart },
            ].map((stat, idx) => (
              <div key={idx} className="text-center px-4 first:pl-0 last:pr-0 border-none md:border-solid">
                <div className="flex items-center justify-center gap-2 mb-1 text-slate-900 font-bold text-2xl">
                  <stat.icon className="w-5 h-5 text-blue-600 opacity-80" />
                  {stat.number}
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advantages Section - Modern Cards */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Your EU/EFTA Advantages
            </h2>
            <p className="text-slate-600 text-lg font-light">
              The Agreement on the Free Movement of Persons grants you exclusive rights that 
              significantly simplify your immigration process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'No Quota Limits',
                description: 'Unlimited access to work permits. No competition for annual spots like third-country nationals.',
                color: 'bg-emerald-50 text-emerald-600',
                tag: 'Guaranteed Access'
              },
              {
                icon: Clock,
                title: 'Rapid Processing',
                description: 'Applications cleared in 2-4 weeks. Processed locally at the cantonal level for speed.',
                color: 'bg-blue-50 text-blue-600',
                tag: 'Fast Track'
              },
              {
                icon: FileText,
                title: 'Minimal Paperwork',
                description: 'No labor market test needed. Simply prove your citizenship and employment.',
                color: 'bg-purple-50 text-purple-600',
                tag: 'Simplified'
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 border border-slate-100"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section - Split Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="/images/europeans/success-eu-family.jpeg"
                  alt="EU Family in Switzerland"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">Success Story</span>
                  </div>
                  <p className="font-bold text-lg">The Müller Family</p>
                  <p className="text-sm text-white/80">Permit B in 3 weeks • Zurich</p>
                </div>
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Housing & Living</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      EU citizens enjoy equal rights for purchasing property and renting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm mb-4">
                <span className="w-8 h-[2px] bg-blue-600"></span>
                Living in Switzerland
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Experience Excellence <br />
                <span className="text-slate-400">Every Single Day</span>
              </h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed font-light">
                Join thousands of EU/EFTA citizens who have successfully made Switzerland their home. 
                Benefit from world-class infrastructure, safety, and high salaries.
              </p>
              
              <div className="space-y-4 mb-10">
                {[
                  { title: 'Family Reunification', desc: 'Simplified process for bringing spouse and children.' },
                  { title: 'Economic Freedom', desc: 'Start a business or work as a freelancer easily.' },
                  { title: 'Geographic Mobility', desc: 'Live and work in any of the 26 Swiss cantons.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link 
                href="/eu/visas"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
              >
                Explore Living Options
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Permit Types - Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Residence Permits</h2>
              <p className="text-slate-600">Your options as an EU/EFTA citizen</p>
            </div>
            <Link href="/eu/visas" className="hidden md:flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
              View All Permits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                type: 'L Permit',
                name: 'Short-Term',
                duration: '< 1 Year',
                desc: 'For temporary contracts or projects.',
                icon: Clock
              },
              {
                type: 'B Permit',
                name: 'Residence',
                duration: '5 Years',
                desc: 'Standard permit for long-term stays.',
                icon: Home
              },
              {
                type: 'C Permit',
                name: 'Settlement',
                duration: 'Permanent',
                desc: 'Granted after 5 years of residence.',
                icon: Award
              },
              {
                type: 'G Permit',
                name: 'Commuter',
                duration: '5 Years',
                desc: 'For cross-border workers.',
                icon: Globe
              }
            ].map((permit, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <permit.icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">{permit.type}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{permit.name}</h3>
                <div className="text-xs text-slate-400 mb-3 font-medium">{permit.duration}</div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {permit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline - Clean Vertical */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Process</h2>
            <p className="text-slate-600">Streamlined pathway for EU citizens</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block"></div>

            {[
              { step: 1, title: 'Job Offer', desc: 'Secure an employment contract', icon: Briefcase },
              { step: 2, title: 'Registration', desc: 'Register at local commune within 14 days', icon: MapPin },
              { step: 3, title: 'Biometrics', desc: 'Provide photo and fingerprints', icon: Target },
              { step: 4, title: 'Permit Issued', desc: 'Receive your residence card by mail', icon: CheckCircle },
            ].map((item, idx) => (
              <div key={idx} className={`relative flex items-center gap-8 mb-12 last:mb-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 md:text-right">
                  <div className={`hidden md:block ${idx % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
                
                <div className="relative z-10 w-12 h-12 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-blue-600 font-bold text-sm">{item.step}</span>
                </div>

                <div className="flex-1">
                  <div className={`md:hidden`}>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                  <div className={`hidden md:block ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    {/* Spacer for alignment */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
             <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Your Journey Today
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto font-light">
              Use our free tools to check your eligibility or get personalized guidance for a smooth transition.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/eu/tools" 
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-600/20 hover:-translate-y-1"
              >
                Use Free Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
