'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Building2, Users, Shield, AlertTriangle, FileText, BarChart3,
  CheckCircle, ArrowRight, Globe, Clock, TrendingUp, Zap,
  ChevronDown, Star, Lock, Briefcase,
} from 'lucide-react'
import TrustBar from '@/components/marketing/TrustBar'

const B2B_PLANS = [
  {
    id: 'b2b_starter',
    name: 'Starter',
    price: { monthly: 199, annual: 159 },
    employees: 25,
    description: 'For small teams hiring internationally',
    features: [
      'Up to 25 employee profiles',
      'Permit expiry tracking & alerts',
      'Basic compliance dashboard',
      'Email notifications',
      'CSV report exports',
      'Standard support (48h)',
    ],
  },
  {
    id: 'b2b_business',
    name: 'Business',
    price: { monthly: 499, annual: 399 },
    employees: 100,
    popular: true,
    description: 'For growing companies with active hiring',
    features: [
      'Up to 100 employee profiles',
      'Advanced compliance scoring',
      'Multi-department tracking',
      'Automated alert workflows',
      'Team member roles (Admin, HR, Viewer)',
      'Priority support (24h)',
      'Quarterly compliance review',
      'Audit trail & activity logs',
    ],
  },
  {
    id: 'b2b_enterprise',
    name: 'Enterprise',
    price: { monthly: 999, annual: 799 },
    employees: 10000,
    description: 'For large organizations & multinationals',
    features: [
      'Unlimited employee profiles',
      'Dedicated account manager',
      'Custom compliance rules',
      'API access & integrations',
      'SSO & advanced security',
      'Multi-entity support',
      'On-site onboarding session',
      'SLA guarantee (4h response)',
      'Custom reporting & analytics',
    ],
  },
]

const COMPLIANCE_STATS = [
  { label: 'Average fine per violation', value: 'CHF 10,000', icon: AlertTriangle },
  { label: 'Permit renewals tracked', value: '12,000+', icon: FileText },
  { label: 'Compliance alerts sent', value: '45,000+', icon: Shield },
  { label: 'HR hours saved per month', value: '40+', icon: Clock },
]

const FEATURES = [
  {
    icon: Users,
    title: 'Employee Permit Tracking',
    description: 'Track B, C, L, G, and S permits for every employee. See expiry dates, renewal deadlines, and document status at a glance.',
  },
  {
    icon: AlertTriangle,
    title: 'Automated Compliance Alerts',
    description: 'Receive alerts 90, 60, and 30 days before permit expirations. Never miss a renewal deadline again.',
  },
  {
    icon: Shield,
    title: 'Compliance Scoring',
    description: 'Real-time compliance score across your workforce. Identify risks before they become fines.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Permit distribution, nationality breakdown, department analysis. Export to CSV for audits.',
  },
  {
    icon: Lock,
    title: 'Role-Based Access',
    description: 'Owner, Admin, HR Manager, and Viewer roles. Control who sees what with granular permissions.',
  },
  {
    icon: Globe,
    title: 'Multi-Canton Support',
    description: 'Track cantonal-specific requirements. Different cantons have different rules — we handle the complexity.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'We were spending 2 days per month manually tracking permit renewals. Now it takes 10 minutes.',
    author: 'Sandra K., HR Director',
    company: 'International Trading Company, Zurich',
    photo: '/images/avatars/anna-k.jpg',
    rating: 5,
  },
  {
    quote: 'The compliance alerts saved us from a CHF 15,000 fine when we almost missed a renewal.',
    author: 'Marc D., Head of People',
    company: 'Tech Startup, Lausanne',
    photo: '/images/avatars/david-m.jpg',
    rating: 5,
  },
  {
    quote: 'Finally a tool built for Swiss immigration compliance. The cantonal tracking alone is worth the price.',
    author: 'Claudia R., Operations Manager',
    company: 'Pharmaceutical Company, Basel',
    photo: '/images/avatars/lisa-w.jpg',
    rating: 5,
  },
]

export default function B2BLandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const FAQ_ITEMS = [
    {
      q: 'How quickly can we get started?',
      a: 'You can onboard your company and start adding employees within 15 minutes. Import existing employee data via CSV for instant setup.',
    },
    {
      q: 'Is our data secure?',
      a: 'Absolutely. All data is encrypted at rest and in transit. We comply with Swiss data protection laws (nDSG) and GDPR. Data is hosted in Switzerland.',
    },
    {
      q: 'Can we upgrade or downgrade our plan?',
      a: 'Yes, you can change plans at any time. Upgrades take effect immediately, and downgrades apply at the next billing cycle.',
    },
    {
      q: 'Do you offer custom solutions for large enterprises?',
      a: 'Yes. For organizations with 500+ employees, we offer custom pricing, dedicated onboarding, API integrations, and tailored compliance rules. Contact us for a demo.',
    },
    {
      q: 'What permit types do you track?',
      a: 'All Swiss permit types: B (residence), C (settlement), L (short-term), G (cross-border), and S (temporary protection). We also track EU/EFTA notifications.',
    },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent" />

        {/* Nav bar */}
        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-lg font-bold">SIP <span className="text-blue-400 font-normal">Corporate</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hidden sm:block text-sm text-white/70 hover:text-white transition-colors">
              Individual Plans
            </Link>
            <Link
              href="/auth/login?redirect=/b2b/onboarding"
              className="text-sm font-medium bg-white text-slate-900 px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-24 sm:pb-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ opacity: 1 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 mb-6">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Swiss Immigration Compliance for HR Teams
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                Stop Tracking Permits{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
                  in Spreadsheets
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/90 font-light leading-relaxed mb-8 max-w-2xl">
                Automate work permit compliance for your Swiss workforce.
                Track expirations, prevent fines, and keep HR overhead to a minimum.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/auth/register?redirect=/b2b/onboarding"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 font-medium px-8 py-3.5 rounded-lg transition-all"
                >
                  View Pricing
                </a>
              </div>
              <TrustBar className="mb-4 [&_span]:text-white/80 [&_.font-semibold]:text-white" />
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {COMPLIANCE_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
                >
                  <stat.icon className="w-5 h-5 text-blue-400 mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-blue-200/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Pain Points */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Swiss Immigration Compliance is Complex
            </h2>
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
              26 cantons, 6 permit types, different renewal rules. One missed deadline can mean
              a CHF 10,000+ fine and disrupted operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                stat: 'CHF 10K+',
                label: 'Average fine per compliance violation',
                detail: 'Federal & cantonal penalties for expired work permits',
              },
              {
                stat: '40 hours',
                label: 'Monthly HR time spent on manual tracking',
                detail: 'Spreadsheets, email reminders, manual checks',
              },
              {
                stat: '23%',
                label: 'Of companies miss at least one renewal/year',
                detail: 'Source: Swiss Federal Statistical Office',
              },
            ].map((item) => (
              <div
                key={item.stat}
                className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 text-center"
              >
                <div className="text-4xl font-extrabold text-red-600 mb-2">{item.stat}</div>
                <div className="text-base font-semibold text-slate-900 mb-2">{item.label}</div>
                <div className="text-sm text-slate-500">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-blue-100">
              <Zap className="w-3.5 h-3.5" />
              Built for Swiss HR Teams
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for Permit Compliance
            </h2>
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
              From permit tracking to compliance reporting — one platform for your entire workforce.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator / Value Prop */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                The Cost of <em className="not-italic text-red-300">Not</em> Using SIP Corporate
              </h2>
              <div className="space-y-6">
                {[
                  { label: 'One missed permit renewal fine', cost: 'CHF 10,000' },
                  { label: 'HR admin time (40h/mo × CHF 50/h)', cost: 'CHF 24,000/yr' },
                  { label: 'Legal consultation for compliance', cost: 'CHF 5,000/yr' },
                  { label: 'Employee downtime during violations', cost: 'CHF 15,000+' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-2xl font-bold text-yellow-300">{item.cost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-6">Your Annual Savings with SIP</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-blue-100">Avoided fines (avg 1/year)</span>
                  <span className="font-bold text-green-300">+ CHF 10,000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-blue-100">HR time savings</span>
                  <span className="font-bold text-green-300">+ CHF 24,000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-blue-100">Reduced legal costs</span>
                  <span className="font-bold text-green-300">+ CHF 5,000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-blue-100">SIP Corporate (Business plan)</span>
                  <span className="font-bold text-red-300">- CHF 5,988</span>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <div className="text-sm text-blue-200 mb-1">Net Annual Savings</div>
                <div className="text-4xl font-extrabold text-green-300">CHF 33,012</div>
                <div className="text-sm text-blue-200 mt-2">6.5x return on investment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Swiss HR Teams
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
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
                    <div className="text-xs text-slate-500">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto mb-8">
              No hidden fees. No setup costs. Cancel anytime.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className={`w-14 h-7 rounded-full p-0.5 transition-colors ${billingCycle === 'annual' ? 'bg-blue-600' : 'bg-slate-200'}`}
                role="switch"
                aria-checked={billingCycle === 'annual'}
              >
                <motion.div
                  animate={{ x: billingCycle === 'annual' ? 28 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-400'}`}>
                Annual{' '}
                <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full ml-1">
                  Save 20%
                </span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {B2B_PLANS.map((plan) => {
              const price = billingCycle === 'annual' ? plan.price.annual : plan.price.monthly

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl p-8 shadow-xl border transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? 'ring-2 ring-blue-500 border-blue-500 scale-[1.02]'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      MOST POPULAR
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mb-5">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-extrabold text-slate-900">CHF {price}</span>
                    <span className="text-sm text-slate-500">/month</span>
                  </div>
                  <div className="text-xs text-slate-400 mb-6">
                    Up to {plan.employees >= 10000 ? 'unlimited' : plan.employees} employees
                    {billingCycle === 'annual' && (
                      <span className="text-green-600 font-semibold ml-1">
                        (billed CHF {price * 12}/yr)
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-blue-600' : 'text-green-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/auth/register?redirect=/b2b/onboarding"
                    className={`block w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    Start Free Trial
                  </Link>
                </div>
              )
            })}
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-900 text-sm sm:text-base pr-4">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Briefcase className="w-12 h-12 mx-auto mb-6 text-blue-400" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Automate Permit Compliance?
          </h2>
          <p className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto">
            Join Swiss companies who save 40+ hours per month and avoid costly fines
            with automated permit tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?redirect=/b2b/onboarding"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-base"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 font-medium px-8 py-4 rounded-lg transition-all text-base"
            >
              Request a Demo
            </Link>
          </div>
          <p className="text-xs text-blue-300/50 mt-6">
            14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4" />
            <span>Swiss Immigration Pro &mdash; Corporate Portal</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Individual Plans</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
