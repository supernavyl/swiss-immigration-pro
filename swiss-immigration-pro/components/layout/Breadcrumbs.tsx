'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const LABEL_MAP: Record<string, string> = {
  // Top-level sections
  about: 'About',
  blog: 'Blog',
  cantons: 'Cantons',
  citizenship: 'Citizenship',
  consultation: 'Consultation',
  contact: 'Contact',
  dashboard: 'Dashboard',
  faq: 'FAQ',
  modules: 'Modules',
  pricing: 'Pricing',
  privacy: 'Privacy Policy',
  products: 'Products',
  profile: 'Profile',
  tools: 'Tools',
  visas: 'Visas',
  quiz: 'Quiz',

  // Auth
  auth: 'Account',
  login: 'Login',
  register: 'Register',
  'reset-password': 'Reset Password',

  // Tools
  'cv-editor': 'CV Editor',
  'cv-templates': 'CV Templates',
  'permit-calculator': 'Permit Calculator',
  'timeline-planner': 'Timeline Planner',
  'apartment-finder': 'Apartment Finder',
  'dossier-generator': 'Dossier Generator',
  'document-checklist': 'Document Checklist',
  'citizenship-timeline': 'Citizenship Timeline',

  // Layers
  eu: 'EU Citizens',
  us: 'US Citizens',
  other: 'Other Nationalities',

  // Admin
  admin: 'Admin',
  newsletter: 'Newsletter',
  settings: 'Settings',

  // Other
  'case-studies': 'Case Studies',
  employment: 'Employment',
  account: 'Account',
  billing: 'Billing',
  notifications: 'Notifications',
  data: 'Data & Privacy',
  referrals: 'Referrals',
  security: 'Security',
  changelog: 'Changelog',
  downloads: 'Downloads',
  b2b: 'For Companies',
  success: 'Success',
  lawyer: 'Virtual Lawyer',
  resources: 'Resources',

  // Legal
  terms: 'Terms of Service',
  'cookie-policy': 'Cookie Policy',
  disclaimer: 'Disclaimer',
  'refund-policy': 'Refund Policy',
  accessibility: 'Accessibility',

  // Module IDs → human-readable
  'imm-01': 'Swiss CV Guide',
  'imm-02': 'Work Permits',
  'imm-03': 'Family Reunification',
  'imm-04': 'Healthcare',
  'imm-05': 'Housing',
  'adv-01': 'B Permit Deep Dive',
  'adv-02': 'C Permit Path',
  'adv-03': 'Tax & Finance',
  'adv-04': 'Banking & Insurance',
  'adv-05': 'Job Market',
  'cit-01': 'Citizenship Basics',
  'cit-02': 'Language Requirements',
  'cit-03': 'Integration Criteria',
  'cit-04': 'Application Process',
  'cit-05': 'Canton Specifics',

  // Visa slugs
  'b-permit': 'B Permit',
  'c-permit': 'C Permit',
  'l-permit': 'L Permit',
  'g-permit': 'G Permit',
}

function toLabel(segment: string): string {
  // Check explicit map first
  const mapped = LABEL_MAP[segment.toLowerCase()]
  if (mapped) return mapped

  // Strip enhanced-module suffixes like "imm-01-enhanced"
  const baseKey = segment.replace(/-enhanced$/, '').toLowerCase()
  if (LABEL_MAP[baseKey]) return LABEL_MAP[baseKey]

  // Fallback: capitalise words
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function Breadcrumbs() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  if (!pathname || pathname === '/' || pathname.startsWith('/auth')) return null

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const crumbs = segments.map((seg, i) => ({
    href: '/' + segments.slice(0, i + 1).join('/'),
    label: toLabel(seg),
  }))

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-3" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 mx-2" />
            {i === crumbs.length - 1 ? (
              <span className="text-gray-900 dark:text-gray-100 font-medium">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
