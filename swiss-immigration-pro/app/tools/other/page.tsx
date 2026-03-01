'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle, Clock, Shield, FileText, MapPin, 
  Award, Users, Briefcase, Home, Heart,
  Globe, TrendingUp, BadgeCheck, ChevronRight,
  GraduationCap, Languages, Scale, Landmark, BookOpen,
  Zap, Building, Target, BarChart3, Plane
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import LayerHeader from '@/components/layout/LayerHeader'

export default function OtherPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    saveLayerSelection('other')
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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-100 selection:text-purple-900">
      <LayerHeader
        layer="other"
        homeHref="/other"
        customBadge={{
          icon: <Globe className="w-3.5 h-3.5" />,
          text: 'Global Citizens Pathway',
          bgColor: 'bg-purple-600',
          textColor: 'text-white'
        }}
      />

      {/* Hero Section - Modern Gradient */}
      <section className="relative overflow-hidden h-[85vh] flex items-center bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/others/hero-international.png"
            alt="Global Path to Switzerland"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-slate-900/90 to-slate-950"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-6 border border-white/10 text-purple-200">
                <Globe className="w-3.5 h-3.5" />
                <span>International Citizens</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                Your Global Path to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                  Switzerland
                </span>
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl font-light">
                From Asia to the Americas, we help <strong className="text-white font-medium">highly qualified professionals</strong> navigate 
                the quota system. Your expertise knows no borders.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  href="/other/visas" 
                  className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-all hover:bg-purple-500 shadow-lg shadow-purple-500/25"
                >
                  Explore Pathways
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/other/requirements" 
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-medium px-8 py-3.5 rounded-lg transition-all border border-white/10"
                >
                  Check Eligibility
                </Link>
              </div>

              <div className="flex gap-10 pt-8 border-t border-white/5">
                {[
                  { value: '190+', label: 'Countries' },
                  { value: '89%', label: 'Success Rate' },
                  { value: '12', label: 'Languages' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Floating Stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value: 'Merit Based', label: 'Qualification System', icon: Scale, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                { value: '8-12 Weeks', label: 'Processing Time', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { value: 'Global', label: 'Talent Pool', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { value: 'Diverse', label: 'Community', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:bg-slate-800/80 transition-all"
                >
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
              { number: '190+', label: 'Countries', icon: Globe },
              { number: '25%', label: 'Foreign Population', icon: Users },
              { number: '8,500', label: 'Annual Permits', icon: FileText },
              { number: '10 Yrs', label: 'To Citizenship', icon: Award },
            ].map((stat, idx) => (
              <div key={idx} className="text-center flex flex-col items-center justify-center">
                <stat.icon className="w-5 h-5 text-purple-600 mb-2 opacity-80" />
                <div className="text-2xl font-bold text-slate-900">{stat.number}</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quota System Explanation */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-purple-600 font-semibold text-sm mb-4">
                <span className="w-8 h-[2px] bg-purple-600"></span>
                Understanding the System
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                The Annual Quota System: Your Key to Success
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed font-light">
                Switzerland allocates <strong className="text-slate-900 font-semibold">8,500 work permits annually</strong> for third-country nationals. 
                These permits are distributed across 26 cantons, with competition highest in Zurich and Geneva.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { title: 'Quota Timing', desc: 'Apply January-March for best availability. Cantons typically exhaust quotas by mid-year.' },
                  { title: 'Canton Strategy', desc: 'Smaller cantons (Basel, St. Gallen, Aargau) have lower competition than major cities.' },
                  { title: 'Salary Thresholds', desc: 'CHF 100,000+ annual salary significantly improves approval chances in quota system.' },
                  { title: 'Industry Priority', desc: 'Tech, finance, pharma, and engineering roles receive priority consideration.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href="/other/requirements"
                className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors group"
              >
                View Complete Requirements
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-purple-600 rounded-3xl transform rotate-2 opacity-10"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="text-3xl font-bold text-purple-600 mb-2">8,500</div>
                    <div className="text-sm text-slate-600">Annual B Permits Available</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="text-3xl font-bold text-purple-600 mb-2">26</div>
                    <div className="text-sm text-slate-600">Cantons Competing</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="text-3xl font-bold text-purple-600 mb-2">Q1</div>
                    <div className="text-sm text-slate-600">Best Application Period</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pathways - Enhanced Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Choose Your Pathway
            </h2>
            <p className="text-slate-600 text-lg font-light">
              Your unique background determines your best route to Switzerland. Each pathway has specific requirements and advantages.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Briefcase,
                title: 'Employment',
                desc: 'Work permit via employer sponsorship. Most common pathway for professionals.',
                details: 'Requires job offer, salary meeting thresholds, and quota availability.',
                color: 'bg-blue-50 text-blue-600'
              },
              {
                icon: GraduationCap,
                title: 'Education',
                desc: 'Study in Switzerland, then convert to work permit. No quota needed for students.',
                details: 'Bachelor\'s or Master\'s degree, then 6-month job search permit after graduation.',
                color: 'bg-purple-50 text-purple-600'
              },
              {
                icon: Heart,
                title: 'Family',
                desc: 'Reunification with Swiss residents or permit holders.',
                details: 'Spouse or children of B/C permit holders. Simplified process, no quota.',
                color: 'bg-pink-50 text-pink-600'
              },
              {
                icon: Landmark,
                title: 'Investment',
                desc: 'Business establishment or significant investment in Swiss economy.',
                details: 'CHF 100,000+ investment, business plan, job creation for Swiss residents.',
                color: 'bg-emerald-50 text-emerald-600'
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all border border-slate-100"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-3 leading-relaxed">{item.desc}</p>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">{item.details}</p>
                <Link href="/other/visas" className="text-sm font-semibold text-slate-900 flex items-center gap-1 hover:gap-2 transition-all">
                  Learn More <ChevronRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry-Specific Guidance */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Industry-Specific Opportunities
            </h2>
            <p className="text-slate-600 text-lg font-light">
              Switzerland prioritizes highly qualified professionals in key sectors. Your industry matters.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Technology & IT',
                desc: 'Software engineers, data scientists, and tech professionals are in high demand.',
                stats: 'Highest approval rates',
                icon: Zap,
                color: 'text-blue-600 bg-blue-50'
              },
              {
                title: 'Finance & Banking',
                desc: 'Banking, asset management, and fintech roles receive priority consideration.',
                stats: 'Strong salary benchmarks',
                icon: TrendingUp,
                color: 'text-emerald-600 bg-emerald-50'
              },
              {
                title: 'Pharmaceuticals',
                desc: 'Research, development, and manufacturing roles in pharma and biotech.',
                stats: 'Canton priority sector',
                icon: Award,
                color: 'text-purple-600 bg-purple-50'
              },
              {
                title: 'Engineering',
                desc: 'Mechanical, electrical, and civil engineers needed across industries.',
                stats: 'Steady demand',
                icon: Building,
                color: 'text-orange-600 bg-orange-50'
              },
              {
                title: 'Healthcare',
                desc: 'Doctors, nurses, and medical professionals with recognized qualifications.',
                stats: 'Language requirements',
                icon: Heart,
                color: 'text-pink-600 bg-pink-50'
              },
              {
                title: 'Consulting',
                desc: 'Management consultants and business advisors for multinational firms.',
                stats: 'International experience valued',
                icon: Briefcase,
                color: 'text-indigo-600 bg-indigo-50'
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-purple-300 transition-all"
              >
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">{item.desc}</p>
                <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{item.stats}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section - Feature */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <div className="absolute inset-0 bg-purple-600 rounded-3xl transform rotate-2 opacity-10"></div>
               <div className="relative rounded-3xl overflow-hidden shadow-xl">
                 <Image
                  src="/images/others/integration-language.png"
                  alt="Language Learning"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                 />
               </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Integration is Key
              </h2>
              <p className="text-lg text-slate-600 mb-8 font-light leading-relaxed">
                For third-country nationals, demonstrating commitment to Swiss society is crucial for long-term residency and citizenship.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Language', desc: 'B1 Oral / A2 Written proficiency required.', icon: Languages },
                  { title: 'Community', desc: 'Active participation in local life.', icon: Users },
                  { title: 'Economy', desc: 'Financial independence & tax compliance.', icon: Building },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Timeline - Enhanced */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Complete Journey to Swiss Citizenship</h2>
            <p className="text-slate-600 text-lg">From work permit to naturalization: a detailed roadmap for third-country nationals</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              { 
                year: 'Year 0', 
                title: 'Arrival & B Permit', 
                desc: 'Initial work permit issued (1-5 years). Begin integration process, register with commune, open bank account, secure housing.',
                milestones: ['Commune registration within 14 days', 'Health insurance activation', 'Language learning begins']
              },
              { 
                year: 'Year 2-3', 
                title: 'Permit Renewal', 
                desc: 'First renewal assessment. Demonstrate employment stability, tax compliance, and integration progress.',
                milestones: ['Employment continuity', 'Tax returns filed', 'Language progress (A2 level)']
              },
              { 
                year: 'Year 5', 
                title: 'Integration Review', 
                desc: 'Comprehensive integration assessment. Language proficiency check (B1 oral, A2 written). Permit renewal decision.',
                milestones: ['Language certificate (B1)', 'Community participation', 'Financial stability proof']
              },
              { 
                year: 'Year 10', 
                title: 'C Permit (Settlement)', 
                desc: 'Eligibility for permanent residence permit. No more renewals needed. Full labor market access.',
                milestones: ['10 years continuous residence', 'Clean criminal record', 'Financial independence', 'Integration confirmed']
              },
              { 
                year: 'Year 12+', 
                title: 'Citizenship Application', 
                desc: 'Naturalization process begins. Requires C permit, language proficiency (B2), integration test, and community approval.',
                milestones: ['B2 language certificate', 'Integration test passed', 'Municipality approval', 'Federal approval']
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 mb-12 last:mb-0 group">
                <div className="w-24 text-right pt-1 shrink-0">
                  <span className="font-bold text-purple-600 text-base">{item.year}</span>
                </div>
                <div className="relative flex-1">
                  <div className="w-4 h-4 bg-purple-200 rounded-full mt-1.5 group-hover:bg-purple-600 transition-colors ring-4 ring-white z-10"></div>
                  {idx !== 4 && <div className="absolute top-7 bottom-[-3rem] left-2 w-0.5 bg-slate-200"></div>}
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">{item.desc}</p>
                  <ul className="space-y-1.5">
                    {item.milestones.map((milestone, midx) => (
                      <li key={midx} className="flex items-start text-xs text-slate-500">
                        <CheckCircle className="w-3.5 h-3.5 text-purple-600 mr-2 shrink-0 mt-0.5" />
                        <span>{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-purple-50/50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Target className="w-4 h-4" />
            <span>Your Swiss Journey Starts Here</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Ready to Make Switzerland
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Your New Home?
            </span>
          </h2>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Take our <strong className="text-purple-600 font-semibold">comprehensive free assessment</strong> and discover your personalized path to Swiss residency.
            No obligations, just clarity for your international move.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Link
              href="/other/tools"
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1"
            >
              <Target className="w-5 h-5" />
              Start Free Assessment
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/other/requirements"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-purple-50 text-purple-700 font-semibold px-8 py-4 rounded-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 shadow-sm"
            >
              <FileText className="w-5 h-5" />
              View Requirements
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Clock, text: '5-Min Assessment', subtext: 'Quick & Comprehensive' },
              { icon: Shield, text: 'Expert Guidance', subtext: 'Personalized Strategy' },
              { icon: CheckCircle, text: 'No Commitment', subtext: '100% Free Service' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-purple-100 shadow-sm">
                <item.icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="font-bold text-slate-900 mb-1">{item.text}</div>
                <div className="text-sm text-slate-600">{item.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
