'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle, ChevronDown, Star, Shield,
  FileText, Calculator, Bot, Clock, BookOpen, Users,
  Briefcase, AlertTriangle, MapPin,
} from 'lucide-react'
import { SITE_STATS, PRICING_PACKS } from '@/lib/pricing'
import ExitIntentPopup from '@/components/marketing/ExitIntentPopup'

interface FAQItem {
  question: string
  answer: string
}

const PAIN_POINTS = [
  {
    icon: FileText,
    title: 'Complex Paperwork',
    description: 'Dozens of forms, cantonal requirements, and employer obligations. One missing document means rejection.',
    stat: '47+ documents',
  },
  {
    icon: AlertTriangle,
    title: 'Quota Confusion',
    description: 'Non-EU permits are quota-limited per canton. Apply at the wrong time and wait another year.',
    stat: 'Limited spots',
  },
  {
    icon: Shield,
    title: 'High Rejection Risk',
    description: 'Over half of first-time applicants make avoidable mistakes. Each rejection costs months and hundreds of francs.',
    stat: '57% rejected',
  },
]

const STEPS = [
  {
    number: '1',
    title: 'Take the Quiz',
    description: 'Answer a few questions about your background, nationality, and goals. Our system identifies your best permit pathway.',
  },
  {
    number: '2',
    title: 'Get Your Roadmap',
    description: 'Receive a personalized step-by-step plan with timelines, required documents, and cantonal-specific guidance.',
  },
  {
    number: '3',
    title: 'Apply with Confidence',
    description: 'Use our checklists, AI assistant, and Swiss CV templates to submit a flawless application the first time.',
  },
]

const FEATURES = [
  {
    icon: Calculator,
    title: 'Permit Calculator',
    description: 'Find your optimal permit type based on nationality, employment, and stay duration.',
  },
  {
    icon: FileText,
    title: 'Swiss CV Builder',
    description: '25+ ATS-optimized templates designed for the Swiss job market. Export to PDF instantly.',
  },
  {
    icon: Bot,
    title: 'AI Immigration Assistant',
    description: '24/7 expert guidance powered by SIP-AI. Get instant answers to any work permit question.',
  },
  {
    icon: Clock,
    title: 'Timeline Planner',
    description: 'Track deadlines, quota windows, and renewal dates. Never miss a critical submission window.',
  },
  {
    icon: BookOpen,
    title: 'Learning Modules',
    description: '66,000+ words of expert guides covering every aspect of Swiss work permits and employment.',
  },
  {
    icon: Users,
    title: 'Expert Consultation',
    description: 'Book a session with a Swiss immigration specialist for complex cases or employer sponsorship.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'I was rejected twice before finding SIP. Their checklist caught three missing documents I had no idea about. Third application — approved!',
    author: 'Sarah M.',
    role: 'Marketing Manager, now in Zurich',
    photo: '/images/avatars/sarah-m.jpg',
    rating: 5,
  },
  {
    quote: 'The Swiss CV templates alone are worth the subscription. My old CV format was completely wrong for Swiss employers. Got interview callbacks within a week.',
    author: 'James L.',
    role: 'Software Engineer, moved from London',
    photo: '/images/avatars/james-l.jpg',
    rating: 5,
  },
  {
    quote: 'As a non-EU applicant, the quota system was terrifying. SIP showed me exactly when to apply and which canton had openings. Permit approved in 8 weeks.',
    author: 'Priya K.',
    role: 'Data Scientist, relocated from India',
    photo: '/images/avatars/priya-k.jpg',
    rating: 5,
  },
]

const HERO_STATS = [
  { value: SITE_STATS.successRate, label: 'Success rate' },
  { value: SITE_STATS.totalUsers, label: 'Users helped' },
  { value: SITE_STATS.cvTemplates, label: 'CV templates' },
  { value: SITE_STATS.avgProcessingWeeks, label: 'Avg. processing' },
]

export default function WorkPermitContent({ faqItems }: { faqItems: FAQItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const immigrationPack = PRICING_PACKS.immigration
  const advancedPack = PRICING_PACKS.advanced

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
            href="/auth/register?redirect=/tools/permit-calculator"
            className="text-sm font-semibold bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white pt-20">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-24 sm:pb-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 mb-6">
                <Briefcase className="w-3.5 h-3.5 text-red-400" />
                AI-Powered Work Permit Guidance
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                Get Your Swiss Work Permit{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300">
                  Step by Step
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-red-100/80 font-light leading-relaxed mb-8 max-w-2xl">
                57% of first-time applicants get rejected. Our AI-powered platform guides you through
                every requirement, document, and deadline — so you get approved the first time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/auth/register?redirect=/tools/permit-calculator"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Start Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 font-medium px-8 py-3.5 rounded-lg transition-all"
                >
                  View Plans
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
                  <div className="text-xs text-red-200/60 mt-1">{stat.label}</div>
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
              Why Work Permit Applications Fail
            </h2>
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
              The Swiss work permit system is one of the most complex in Europe.
              Without proper guidance, small mistakes lead to costly rejections.
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
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <point.icon className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-3xl font-extrabold text-red-600 mb-2">{point.stat}</div>
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
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-red-100">
              <ArrowRight className="w-3.5 h-3.5" />
              Simple 3-Step Process
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
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-extrabold shadow-lg shadow-red-500/20">
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
              className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
            >
              Take the Free Quiz
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
              Everything You Need for a Successful Application
            </h2>
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
              From eligibility assessment to approved permit — all the tools in one platform.
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
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-red-600" />
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
              Plans That Fit Your Journey
            </h2>
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
              Start free. Upgrade when you&apos;re ready. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Immigration Pack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200 hover:border-red-300 transition-all hover:-translate-y-1"
            >
              <div className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full w-fit mb-4">
                {immigrationPack.badge}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{immigrationPack.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-slate-900">CHF {immigrationPack.price}</span>
                <span className="text-sm text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {immigrationPack.features.slice(0, 6).map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register?redirect=/tools/permit-calculator"
                className="block w-full py-3.5 rounded-xl font-bold text-sm text-center bg-slate-100 text-slate-900 hover:bg-slate-200 transition-all"
              >
                Start Free Trial
              </Link>
            </motion.div>

            {/* Advanced Pack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative bg-white rounded-2xl p-8 shadow-xl ring-2 ring-red-500 border border-red-500 transition-all hover:-translate-y-1 scale-[1.02]"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                BEST VALUE
              </div>
              <div className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full w-fit mb-4">
                {advancedPack.badge}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{advancedPack.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-slate-900">CHF {advancedPack.price}</span>
                <span className="text-sm text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {advancedPack.features.slice(0, 6).map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register?redirect=/tools/permit-calculator"
                className="block w-full py-3.5 rounded-xl font-bold text-sm text-center bg-gradient-to-r from-red-600 to-orange-600 text-white hover:shadow-lg hover:shadow-red-500/30 transition-all"
              >
                Start Free Trial
              </Link>
            </motion.div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            All plans include a free tier. No credit card required to start.
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
              Trusted by Thousands of Successful Applicants
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
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-md shrink-0">
                    <Image src={t.photo} alt={t.author} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.author}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
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
      <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Briefcase className="w-12 h-12 mx-auto mb-6 text-red-400" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Start Your Swiss Journey Today
            </h2>
            <p className="text-lg text-red-100/80 font-light mb-8 max-w-2xl mx-auto">
              Join {SITE_STATS.totalUsers} people who navigated Swiss immigration successfully.
              Free tier available — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register?redirect=/tools/permit-calculator"
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
            <p className="text-xs text-red-300/50 mt-6">
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
