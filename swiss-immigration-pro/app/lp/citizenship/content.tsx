'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle, ChevronDown, Star, Shield,
  FileText, Globe, Bot, Clock, BookOpen, Users,
  Award, Languages, Map, MapPin,
} from 'lucide-react'
import { SITE_STATS, PRICING_PACKS, ONE_TIME_PRODUCTS } from '@/lib/pricing'
import ExitIntentPopup from '@/components/marketing/ExitIntentPopup'

interface FAQItem {
  question: string
  answer: string
}

const PAIN_POINTS = [
  {
    icon: Clock,
    title: 'Decade-Long Timeline',
    description: '10 years of residence, multiple milestone deadlines, and changing requirements along the way. Missing one step means starting over.',
    stat: '10+ years',
  },
  {
    icon: Languages,
    title: 'Language Tests',
    description: 'B1 oral, A2 written minimum — but some cantons demand B2. Knowing which level you need before you start studying saves years.',
    stat: '4 languages',
  },
  {
    icon: Map,
    title: 'Cantonal Variations',
    description: '26 cantons with different requirements, fees, and processes. What works in Zurich may fail in Geneva. Local knowledge is everything.',
    stat: '26 cantons',
  },
]

const STEPS = [
  {
    number: '1',
    title: 'Take the Quiz',
    description: 'Answer questions about your residence history, language skills, and family situation. We identify your fastest path to citizenship.',
  },
  {
    number: '2',
    title: 'Study with Modules',
    description: 'Work through targeted learning modules: Swiss history, politics, cantonal requirements, integration criteria, and language prep.',
  },
  {
    number: '3',
    title: 'Track Your Timeline',
    description: 'Use our Timeline Planner to monitor every milestone — residence years, language certifications, integration steps, and application windows.',
  },
]

const FEATURES = [
  {
    icon: FileText,
    title: 'Citizenship Roadmap',
    description: 'Complete 10-year pathway with every milestone, deadline, and requirement mapped out for your specific situation.',
  },
  {
    icon: Languages,
    title: 'Language Preparation',
    description: 'B1/B2 test prep materials, practice exercises, and canton-specific language level requirements at a glance.',
  },
  {
    icon: Map,
    title: 'Canton Guide',
    description: 'Detailed naturalization requirements for all 26 cantons — fees, interview format, residence rules, and approval rates.',
  },
  {
    icon: Bot,
    title: 'AI Legal Advisor',
    description: '24/7 expert AI guidance on Swiss citizenship law, eligibility, shortcuts, and edge cases. Powered by SIP-AI.',
  },
  {
    icon: Shield,
    title: 'Integration Test Prep',
    description: 'Complete question bank with Swiss geography, history, politics, and culture. Practice tests modeled on real canton exams.',
  },
  {
    icon: Users,
    title: 'Expert Consultation',
    description: 'Book a session with a Swiss naturalization specialist for complex cases, dual citizenship, or fast-track options.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'After 8 years in Switzerland, I had no idea where to start with citizenship. SIP mapped out exactly what I needed — I passed the integration test on the first try.',
    author: 'Michael B.',
    role: '12 years in Zurich, now Swiss citizen',
    rating: 5,
  },
  {
    quote: 'The canton guide saved me. I was about to apply in my municipality without realizing they require B2 German, not B1. Would have been rejected and had to wait another year.',
    author: 'Elena R.',
    role: 'Dual Italian-Swiss citizen since 2025',
    rating: 5,
  },
  {
    quote: 'My Swiss spouse and I used the 5-year shortcut path. SIP tracked every deadline and told us exactly when to submit. Smoothest bureaucratic experience I have ever had in Switzerland.',
    author: 'Daniel T.',
    role: 'Naturalized via marriage pathway',
    rating: 5,
  },
]

const HERO_STATS = [
  { value: SITE_STATS.successRate, label: 'Success rate' },
  { value: SITE_STATS.totalUsers, label: 'Users helped' },
  { value: '10+', label: 'Modules on citizenship' },
  { value: '26', label: 'Cantons covered' },
]

export default function CitizenshipContent({ faqItems }: { faqItems: FAQItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const citizenshipPack = PRICING_PACKS.citizenship
  const citizenshipRoadmap = ONE_TIME_PRODUCTS.citizenship_roadmap

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Minimal Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Swiss Immigration <span className="text-red-600">Pro</span>
            </span>
          </Link>
          <Link
            href="/auth/register?redirect=/tools/timeline-planner"
            className="text-sm font-semibold bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white pt-20">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-24 sm:pb-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 mb-6">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                Complete Naturalization Guide
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                Your Path to Swiss Citizenship{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                  Simplified
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-indigo-100/80 font-light leading-relaxed mb-8 max-w-2xl">
                Swiss naturalization involves 26 different cantonal processes, language tests, and integration
                requirements. Our AI-powered platform maps your exact pathway from resident to citizen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/auth/register?redirect=/tools/timeline-planner"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Start Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 font-medium px-8 py-3.5 rounded-lg transition-all"
                >
                  View Citizenship Pro
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
                >
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-indigo-200/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Swiss Naturalization is So Challenging
            </h2>
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
              Switzerland has one of the most complex citizenship processes in Europe.
              Every canton runs its own system with unique requirements.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 text-center"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <point.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-3xl font-extrabold text-indigo-600 mb-2">{point.stat}</div>
                <div className="text-base font-semibold text-slate-900 mb-2">{point.title}</div>
                <div className="text-sm text-slate-500">{point.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-indigo-100">
              <ArrowRight className="w-3.5 h-3.5" />
              Your Citizenship Journey
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-extrabold shadow-lg shadow-indigo-500/20">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
            >
              Check Your Eligibility
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for Swiss Citizenship
            </h2>
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
              From eligibility assessment to naturalization ceremony — every tool in one platform.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Snippet */}
      <section id="pricing" className="py-20 sm:py-24 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Invest in Your Swiss Future
            </h2>
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
              One subscription that covers your entire citizenship journey. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Citizenship Pro Pack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl p-8 shadow-xl ring-2 ring-indigo-500 border border-indigo-500 transition-all hover:-translate-y-1 scale-[1.02]"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                COMPLETE SOLUTION
              </div>
              <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit mb-4">
                {citizenshipPack.badge}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{citizenshipPack.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-slate-900">CHF {citizenshipPack.price}</span>
                <span className="text-sm text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {citizenshipPack.features.slice(0, 8).map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register?redirect=/tools/timeline-planner"
                className="block w-full py-3.5 rounded-xl font-bold text-sm text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                Start Free Trial
              </Link>
            </motion.div>

            {/* Citizenship Roadmap PDF */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200 hover:border-indigo-300 transition-all hover:-translate-y-1"
            >
              <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit mb-4">
                One-Time Purchase
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{citizenshipRoadmap.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-slate-900">CHF {citizenshipRoadmap.price / 100}</span>
                <span className="text-sm text-slate-500">one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                {citizenshipRoadmap.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="block w-full py-3.5 rounded-xl font-bold text-sm text-center bg-slate-100 text-slate-900 hover:bg-slate-200 transition-all"
              >
                Get the Roadmap
              </Link>
            </motion.div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            All subscriptions include a free tier. No credit card required to start.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Success Stories from New Swiss Citizens
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.author}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-900 text-sm sm:text-base pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award className="w-12 h-12 mx-auto mb-6 text-indigo-400" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Start Your Path to Swiss Citizenship
            </h2>
            <p className="text-lg text-indigo-100/80 font-light mb-8 max-w-2xl mx-auto">
              Join thousands who are using SIP to navigate Swiss naturalization.
              From your first year of residence to your citizenship ceremony.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register?redirect=/tools/timeline-planner"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-base"
              >
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 font-medium px-8 py-4 rounded-lg transition-all text-base"
              >
                Compare Plans
              </Link>
            </div>
            <p className="text-xs text-indigo-300/50 mt-6">
              Free forever tier. No credit card required. Upgrade anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Swiss Immigration Pro</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">All Plans</Link>
          </div>
        </div>
      </footer>

      <ExitIntentPopup />
    </div>
  )
}
