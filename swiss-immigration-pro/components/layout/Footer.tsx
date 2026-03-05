'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { Mail, MapPin, ArrowRight, CheckCircle } from 'lucide-react'
import { CONFIG } from '@/lib/config'
import { useT } from '@/lib/i18n/useTranslation'
import { api } from '@/lib/api'
import { useSession } from '@/lib/auth-client'

export default function Footer() {
  const { t } = useT()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [year, setYear] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  const appUser = useMemo(() => {
    if (typeof window === 'undefined' || !mounted || status === 'loading' || !session?.user)
      return null
    return { packId: (session.user as unknown as Record<string, unknown>)?.packId ?? 'free' }
  }, [session, status, mounted])

  useEffect(() => {
    setYear(new Date().getFullYear())
    setMounted(true)
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || loading) return
    setLoading(true)
    try {
      await api.post('/api/newsletter/subscribe', { email, source: 'footer' })
    } catch {
      // Don't penalise if backend is down
    }
    setSubmitted(true)
    setLoading(false)
  }

  const quickLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/lawyer', label: 'Virtual Lawyer' },
    { href: '/employment', label: 'Employment' },
    { href: '/citizenship', label: t('visa.citizenship') },
    { href: '/pricing', label: t('nav.pricing') },
    { href: '/tools', label: t('nav.tools') },
  ]

  const resourceLinks = [
    { href: '/faq', label: t('nav.faq') },
    { href: '/about', label: t('nav.about') },
    { href: '/resources', label: t('nav.resources') },
    { href: '/cv-templates', label: 'CV Templates' },
    { href: '/contact', label: t('nav.contact') },
    { href: '/consultation', label: t('contact.bookConsultation') },
  ]

  const legalLinks = [
    { href: '/privacy', label: t('footer.privacyPolicy') },
    { href: '/terms', label: t('footer.termsOfService') },
    { href: '/cookie-policy', label: t('footer.cookiePolicy') },
    { href: '/refund-policy', label: t('footer.refundPolicy') },
    { href: '/disclaimer', label: t('footer.disclaimer') },
    { href: '/accessibility', label: t('footer.accessibility') },
  ]

  return (
    <footer className="bg-slate-950 text-slate-400">
      {/* Newsletter */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">
                Weekly Swiss immigration updates
              </h3>
              <p className="text-slate-500 text-sm">
                Permit changes, cantonal strategies, and practical guides.
              </p>
            </div>
            {mounted && submitted ? (
              <div className="flex items-center gap-2 text-blue-400 font-medium text-sm">
                <CheckCircle className="w-4 h-4" />
                Subscribed
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 md:w-56 bg-slate-900 border border-slate-800 text-white placeholder-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="white">
                  <rect x="3" y="6.5" width="10" height="3" rx="0.5" />
                  <rect x="6.5" y="3" width="3" height="10" rx="0.5" />
                </svg>
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">
                Swiss Immigration Pro
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 text-slate-500">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-wider mb-4">
              {t('footer.resources')}
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-wider mb-4">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@swissimmigrationpro.com"
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-slate-600 shrink-0" />
                  info@swissimmigrationpro.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <span>
                  {CONFIG.app.firm}
                  <br />
                  <span className="text-slate-600">Zurich, Switzerland</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        {mounted && (
          <div className="border border-slate-800 rounded-xl px-6 py-5 mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              {appUser?.packId === 'free'
                ? 'Ready to unlock unlimited AI guidance?'
                : 'Start your Swiss immigration journey today.'}
            </p>
            <Link
              href={appUser?.packId === 'free' ? '/pricing' : '/consultation'}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
            >
              {appUser?.packId === 'free' ? 'View plans' : 'Get started'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Bottom */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; {year || '2026'} {CONFIG.app.name}. {t('footer.allRightsReserved')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-600">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-slate-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
