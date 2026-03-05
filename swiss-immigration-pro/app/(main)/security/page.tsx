import {
  Shield,
  Lock,
  Globe,
  CreditCard,
  EyeOff,
  Server,
  Mail,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security & Privacy | Swiss Immigration Pro',
  description: 'Learn how Swiss Immigration Pro protects your data with enterprise-grade security, GDPR compliance, and Swiss data residency.',
}

const SECTIONS = [
  {
    icon: Lock,
    title: 'Data Encryption',
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
    body: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Your personal information, documents, and conversation history are protected with industry-standard cryptographic protocols.',
  },
  {
    icon: Globe,
    title: 'GDPR Compliant',
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
    body: 'We fully comply with the EU General Data Protection Regulation (GDPR) and the Swiss Federal Act on Data Protection (nFADP). You have the right to access, correct, export, and delete your data at any time.',
  },
  {
    icon: Shield,
    title: 'Swiss Data Residency',
    color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
    body: 'Your data is stored exclusively in Swiss and European data centres. We do not transfer personal data to jurisdictions with inadequate data protection standards without explicit consent.',
  },
  {
    icon: CreditCard,
    title: 'Payment Security',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
    body: 'All payments are processed by Stripe, a PCI-DSS Level 1 certified payment processor. We never store your full credit card number, CVC, or expiry date on our servers.',
  },
  {
    icon: EyeOff,
    title: 'No-Log Policy',
    color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30',
    body: 'We do not log personally identifiable information in our application logs. Analytics are collected in aggregate form only. Your AI conversations are not used for model training.',
  },
  {
    icon: Server,
    title: 'Infrastructure Security',
    color: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
    body: 'Our infrastructure uses containerised deployments with automated security patches, network isolation between services, and regular penetration testing. Access to production systems is restricted with multi-factor authentication.',
  },
] as const

const TRUST_BADGES = [
  { label: 'Swiss Data Protection', icon: Shield },
  { label: 'GDPR Compliant', icon: Globe },
  { label: 'Stripe Secured', icon: CreditCard },
  { label: 'TLS 1.3 Encryption', icon: Lock },
]

export default function SecurityPage() {
  return (
    <div className="sip-container-wide py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/30 mx-auto mb-4">
            <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Security & Privacy</h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Your trust is our priority. We employ enterprise-grade security measures to protect your data throughout your immigration journey.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {SECTIONS.map(({ icon: Icon, title, color, body }) => (
            <section key={title} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-start gap-4">
                <div className={cn('flex items-center justify-center w-10 h-10 rounded-xl shrink-0', color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">{title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRUST_BADGES.map(({ label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 py-4 px-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 text-center bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Security Questions?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            If you have questions about our security practices or want to report a vulnerability, please contact us.
          </p>
          <a
            href="mailto:security@swissimmigrationpro.ch"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <Mail className="w-4 h-4" />
            security@swissimmigrationpro.ch
          </a>
        </div>
      </div>
    </div>
  )
}
