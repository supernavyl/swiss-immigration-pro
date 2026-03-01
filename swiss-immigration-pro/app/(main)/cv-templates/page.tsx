'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Star, Sparkles, Zap, FileText, Shield, Globe } from 'lucide-react'
import Link from 'next/link'

const TEMPLATES = [
  { id: 'swiss-classic', name: 'Swiss Classic', desc: 'Traditional Swiss CV with serif fonts and structured sections', category: 'Traditional', color: '#1a1a2e', industries: ['General', 'Government', 'Banking'] },
  { id: 'modern-zurich', name: 'Modern Zürich', desc: 'Clean two-column design with blue accents', category: 'Modern', color: '#1e3a5f', industries: ['Technology', 'Finance'] },
  { id: 'executive-geneva', name: 'Executive Geneva', desc: 'Premium layout with gold accents for senior leadership', category: 'Executive', color: '#c9a84c', industries: ['Executive', 'Finance'] },
  { id: 'tech-startup', name: 'Tech Startup', desc: 'Developer-friendly with monospace touches and skill visualizations', category: 'Tech', color: '#6366f1', industries: ['Technology', 'Startup'] },
  { id: 'creative-portfolio', name: 'Creative Portfolio', desc: 'Bold colors and asymmetric layout for creatives', category: 'Creative', color: '#7c3aed', industries: ['Design', 'Marketing'] },
  { id: 'minimal-basel', name: 'Minimal Basel', desc: 'Ultra-clean design with maximum whitespace', category: 'Minimal', color: '#18181b', industries: ['General', 'Consulting'] },
  { id: 'academic-bern', name: 'Academic Bern', desc: 'Formal layout for academia and research', category: 'Academic', color: '#0369a1', industries: ['Academia', 'Research'] },
  { id: 'finance-lucerne', name: 'Finance Lucerne', desc: 'Conservative layout for financial professionals', category: 'Finance', color: '#0d4f4f', industries: ['Finance', 'Banking'] },
  { id: 'healthcare-pro', name: 'Healthcare Pro', desc: 'Clinical design with prominent certifications', category: 'Healthcare', color: '#0891b2', industries: ['Healthcare', 'Medical'] },
  { id: 'legal-precision', name: 'Legal Precision', desc: 'Formal serif typography for legal professionals', category: 'Legal', color: '#1c1917', industries: ['Legal', 'Compliance'] },
  { id: 'consultant-elite', name: 'Consultant Elite', desc: 'Sidebar layout with key metrics for consultants', category: 'Consulting', color: '#1d4ed8', industries: ['Consulting', 'Strategy'] },
  { id: 'marketing-bold', name: 'Marketing Bold', desc: 'Modern color blocks for marketers', category: 'Marketing', color: '#be123c', industries: ['Marketing', 'Sales'] },
  { id: 'engineering-blue', name: 'Engineering Blue', desc: 'Technical project-focused with skills matrix', category: 'Engineering', color: '#2563eb', industries: ['Engineering', 'Manufacturing'] },
  { id: 'hospitality-warm', name: 'Hospitality Warm', desc: 'Warm tones with prominent language skills', category: 'Hospitality', color: '#b45309', industries: ['Hospitality', 'Tourism'] },
  { id: 'retail-fresh', name: 'Retail Fresh', desc: 'Approachable achievement-focused design', category: 'Retail', color: '#15803d', industries: ['Retail', 'Sales'] },
]

const FEATURES = [
  { icon: Sparkles, title: 'AI-Powered Content', desc: 'Generate tailored CV content from any job description' },
  { icon: Zap, title: 'ATS Optimized', desc: 'Real-time ATS scoring ensures your CV passes automated screening' },
  { icon: FileText, title: 'PDF Export', desc: 'Pixel-perfect A4 PDF generation with embedded fonts' },
  { icon: Shield, title: 'Swiss Standards', desc: 'Built for Swiss job market conventions and expectations' },
  { icon: Globe, title: 'Multilingual', desc: 'Full CEFR language proficiency support' },
  { icon: Star, title: '15+ Templates', desc: 'Industry-specific professional designs' },
]

export default function CVTemplatesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-violet-600/5" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/30 dark:text-blue-300 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered CV Builder
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
              Professional Swiss CV Templates
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
              15 industry-specific templates designed for the Swiss job market. AI-powered content generation, real-time ATS optimization, and pixel-perfect PDF export.
            </p>
            <Link
              href="/tools/cv-editor"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all"
            >
              Start Building <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Template Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEMPLATES.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link href={`/tools/cv-editor?template=${t.id}`} className="group block">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                  <div className="h-48 relative" style={{ background: `linear-gradient(135deg, ${t.color}15, ${t.color}05)` }}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6">
                      <div className="w-20 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                      <div className="w-16 h-1 rounded-full bg-slate-300" />
                      <div className="flex gap-3 mt-2">
                        <div className="w-24 space-y-1">
                          <div className="w-full h-1 rounded-full bg-slate-200" />
                          <div className="w-3/4 h-1 rounded-full bg-slate-200" />
                          <div className="w-full h-1 rounded-full bg-slate-200" />
                        </div>
                        <div className="w-16 space-y-1">
                          <div className="w-full h-1 rounded-full bg-slate-200" />
                          <div className="w-2/3 h-1 rounded-full bg-slate-200" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/80 text-slate-600 backdrop-blur-sm">{t.category}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">{t.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{t.desc}</p>
                    <div className="flex gap-1.5 mt-3">
                      {t.industries.map((ind) => (
                        <span key={ind} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">{ind}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-10">Why Our CV Builder</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Icon className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-500 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Ready to Build Your Swiss CV?</h2>
        <p className="text-slate-500 mt-2">Start free. No account required to try the editor.</p>
        <Link
          href="/tools/cv-editor"
          className="inline-flex items-center gap-2 mt-6 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all text-lg"
        >
          Launch CV Builder <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  )
}
