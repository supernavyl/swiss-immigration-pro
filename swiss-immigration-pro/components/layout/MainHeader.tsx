'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  User,
  LogOut,
  Shield,
  ArrowRight,
  ChevronDown,
  Crown,
  Phone,
  HelpCircle,
  Sparkles,
} from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import { useT } from '@/lib/i18n/useTranslation'
import { AnimatePresence, motion } from 'framer-motion'
import AdvancedSearch from '@/components/ui/AdvancedSearch'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import DarkModeToggle from '@/components/ui/DarkModeToggle'
import MobileDrawer from '@/components/layout/MobileDrawer'
import NotificationBell from '@/components/layout/NotificationBell'
import KeyboardShortcutsModal from '@/components/layout/KeyboardShortcutsModal'
import { useHaptic } from '@/lib/hooks/useHaptic'
import { useIsMobile } from '@/lib/hooks/useMediaQuery'
import { cn } from '@/lib/utils/cn'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppUser {
  id?: string
  email?: string | null
  name?: string | null
  isAdmin?: boolean
  packId?: string | null
}

interface MegaLink {
  href: string
  label: string
  desc: string
  badge?: string
}

interface MegaSection {
  heading: string
  links: MegaLink[]
}

interface MegaFeatured {
  href: string
  label: string
  desc: string
  badge: string
}

interface MegaMenuData {
  sections: MegaSection[]
  featured?: MegaFeatured
}

interface NavItem {
  key: string
  href: string
  label: string
  megaKey?: string
}

// ─── Mega-menu data ───────────────────────────────────────────────────────────

const MEGA_MENUS: Record<string, MegaMenuData> = {
  permits: {
    sections: [
      {
        heading: 'Work Permits',
        links: [
          { href: '/visas/l-permit-guide', label: 'L Permit — Short-Stay', desc: 'Up to 12 months, renewable once' },
          { href: '/visas/b-permit-guide', label: 'B Permit — Annual', desc: '1-year renewable residence permit' },
          { href: '/visas/c-permit-guide', label: 'C Permit — Settlement', desc: 'Permanent residence, no renewal' },
          { href: '/visas#g-permit', label: 'G Permit — Frontier Worker', desc: 'Cross-border commuters' },
          { href: '/visas#seasonal', label: 'Seasonal Permit', desc: 'Agriculture & hospitality (9 mo)' },
          { href: '/visas#eu-efta', label: 'EU/EFTA Free Movement', desc: 'Simplified process for EU citizens' },
        ],
      },
      {
        heading: 'Residency & Family',
        links: [
          { href: '/visas#family-reunification', label: 'Family Reunification', desc: 'Bring spouse & children to CH' },
          { href: '/visas#student', label: 'Student Visa', desc: 'Study at Swiss universities' },
          { href: '/visas#investor', label: 'Investor / Art. 30', desc: 'Business & lump-sum taxation' },
          { href: '/visas#asylum', label: 'Asylum & Protection', desc: 'Refugee status & humanitarian' },
          { href: '/cantons', label: 'Cantonal Requirements', desc: 'Rules for all 26 cantons' },
        ],
      },
      {
        heading: 'Citizenship',
        links: [
          { href: '/citizenship', label: 'Ordinary Naturalization', desc: '10-year residency requirement' },
          { href: '/citizenship#simplified', label: 'Simplified Naturalization', desc: 'Spouses & second generation' },
          { href: '/citizenship#dual', label: 'Dual Citizenship', desc: 'Keep your home passport' },
          { href: '/citizenship#reintegration', label: 'Reintegration', desc: 'Former Swiss nationals' },
        ],
      },
    ],
    featured: {
      href: '/lawyer',
      label: 'Ask the AI Immigration Lawyer',
      desc: 'Instant answers trained on Swiss law across all 26 cantons. Available 24/7.',
      badge: 'AI',
    },
  },

  tools: {
    sections: [
      {
        heading: 'AI-Powered Tools',
        links: [
          { href: '/lawyer', label: 'AI Immigration Lawyer', desc: 'Chat — Llama 3.3 70B', badge: 'AI' },
          { href: '/tools/cv-editor', label: 'Swiss CV Builder', desc: '15 professional templates' },
          { href: '/quiz', label: 'Eligibility Checker', desc: 'Find your permit type in 2 min' },
          { href: '/tools/timeline-planner', label: 'Permit Timeline Tracker', desc: 'Step-by-step application view' },
        ],
      },
      {
        heading: 'Calculators',
        links: [
          { href: '/tools/permit-calculator', label: 'Cost Calculator', desc: 'All fees, taxes & cantonal costs' },
          { href: '/tools/citizenship-timeline', label: 'Citizenship Timeline', desc: 'Citizenship readiness assessment' },
          { href: '/tools/document-checklist', label: 'Document Checklist', desc: 'Per permit, per canton' },
          { href: '/tools/dossier-generator', label: 'Dossier Generator', desc: 'Complete application package' },
        ],
      },
      {
        heading: 'Resources & Guides',
        links: [
          { href: '/resources', label: 'Free Downloads', desc: 'Checklists, guides & templates' },
          { href: '/faq', label: 'FAQ', desc: 'Most common permit questions' },
          { href: '/blog', label: 'Expert Guides', desc: 'Weekly immigration insights' },
          { href: '/case-studies', label: 'Success Stories', desc: 'Real journeys, real outcomes' },
        ],
      },
    ],
    featured: {
      href: '/tools/cv-editor',
      label: 'Build Your Swiss CV for Free',
      desc: '15 templates designed for Swiss employers — ATS-optimized, cantonal standards.',
      badge: 'Free',
    },
  },

  learn: {
    sections: [
      {
        heading: 'Guides & Content',
        links: [
          { href: '/blog', label: 'Blog & Expert Guides', desc: 'Weekly immigration insights' },
          { href: '/faq', label: 'FAQ — 200+ Questions', desc: 'Most common permit questions' },
          { href: '/case-studies', label: 'Success Stories', desc: 'Real journeys, real outcomes' },
          { href: '/visas', label: 'Visa Encyclopaedia', desc: 'Complete permit reference library' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { href: '/resources', label: 'Free Downloads & Guides', desc: 'Checklists, templates & more' },
          { href: '/cantons', label: 'Cantonal Guide', desc: 'All 26 cantons compared' },
          { href: '/citizenship', label: 'Citizenship Path', desc: 'Naturalization requirements' },
          { href: '/about', label: 'About SIP', desc: 'Our mission & team' },
        ],
      },
      {
        heading: 'Modules & Courses',
        links: [
          { href: '/pricing', label: 'All Learning Packs', desc: 'Free to CHF 79/month' },
          { href: '/modules/work-permits', label: 'Work Permit Module', desc: 'Free — complete overview' },
          { href: '/modules/naturalization', label: 'Naturalization Path', desc: 'Advanced pack — 12 lessons' },
          { href: '/pricing', label: 'View All Plans', desc: 'Compare features & pricing' },
        ],
      },
    ],
  },

  corporate: {
    sections: [
      {
        heading: 'Plans & Pricing',
        links: [
          { href: '/b2b#starter', label: 'Starter — CHF 199/mo', desc: 'Up to 10 international hires' },
          { href: '/b2b#business', label: 'Business — CHF 499/mo', desc: 'Up to 50 employees, dedicated CSM' },
          { href: '/b2b#enterprise', label: 'Enterprise — CHF 999/mo', desc: 'Unlimited seats + SLA + API access' },
          { href: '/b2b#annual', label: 'Annual Discount — 20% Off', desc: 'Save CHF 478–2,388/year' },
        ],
      },
      {
        heading: 'Platform Features',
        links: [
          { href: '/b2b#hr-portal', label: 'HR Management Portal', desc: 'Centralized employee tracking' },
          { href: '/b2b#compliance', label: 'Compliance Monitoring', desc: 'Permit expiry alerts & reminders' },
          { href: '/b2b#reporting', label: 'Reports & Analytics', desc: 'Workforce immigration dashboard' },
          { href: '/b2b#bulk', label: 'Bulk Hiring Support', desc: 'Mass application management' },
          { href: '/b2b#api', label: 'API Integration', desc: 'Connect to your HRIS / ATS' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { href: '/b2b#case-studies', label: 'Corporate Case Studies', desc: 'How companies use SIP' },
          { href: '/b2b#faq', label: 'B2B FAQ', desc: 'Common corporate questions' },
          { href: '/marketplace', label: 'Find Immigration Lawyers', desc: 'Vetted attorneys for companies' },
        ],
      },
    ],
    featured: {
      href: '/consultation',
      label: 'Book a Free Corporate Demo',
      desc: 'Live walkthrough of the HR portal with our team. 30 minutes, no commitment.',
      badge: 'Free',
    },
  },

  ai: {
    sections: [
      {
        heading: 'AI Advisor',
        links: [
          { href: '/lawyer', label: 'AI Immigration Lawyer', desc: 'Chat with Llama 3.3 70B AI', badge: 'AI' },
          { href: '/chat', label: 'Quick Chatbot', desc: 'Fast answers, free tier' },
          { href: '/lawyer#voice', label: 'Voice Mode', desc: 'Speak to Catherine AI' },
          { href: '/quiz', label: 'Eligibility Quiz', desc: 'Find your permit type in 2 min' },
        ],
      },
      {
        heading: 'AI Features',
        links: [
          { href: '/lawyer', label: 'Canton-Specific Advice', desc: 'All 26 cantonal rules' },
          { href: '/tools/permit-calculator', label: 'Cost Calculator', desc: 'Fees, taxes & cantonal costs' },
          { href: '/tools/citizenship-timeline', label: 'Citizenship Timeline', desc: 'Personalised application plan' },
          { href: '/tools/document-checklist', label: 'Smart Checklist', desc: 'AI-generated document list' },
        ],
      },
      {
        heading: 'Consultations',
        links: [
          { href: '/consultation', label: 'Book Quick Consult — CHF 80', desc: '45-min with immigration expert' },
          { href: '/consultation#full', label: 'Full Consultation — CHF 200', desc: '2h deep-dive session' },
          { href: '/marketplace', label: 'Find a Lawyer', desc: 'Verified immigration attorneys' },
        ],
      },
    ],
    featured: {
      href: '/lawyer',
      label: 'Try the AI Lawyer Now',
      desc: 'No signup needed on free tier. Ask any Swiss immigration question instantly.',
      badge: 'Free',
    },
  },
}

// ─── Top-level nav items ──────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { key: 'permits', href: '/visas', label: 'Visas & Permits', megaKey: 'permits' },
  { key: 'ai', href: '/lawyer', label: 'AI Advisor', megaKey: 'ai' },
  { key: 'tools', href: '/tools', label: 'Tools', megaKey: 'tools' },
  { key: 'learn', href: '/blog', label: 'Learn', megaKey: 'learn' },
  { key: 'corporate', href: '/b2b', label: 'For Companies', megaKey: 'corporate' },
  { key: 'pricing', href: '/pricing', label: 'Pricing' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function MainHeader(): React.ReactElement | null {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const { t } = useT()
  const { haptic } = useHaptic()
  const isMobile = useIsMobile()
  const { data: session, status } = useSession()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = (): void => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 4)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobile && isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobile, isMenuOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') { setActiveMenu(null); setProfileOpen(false) }
      if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault()
        setShortcutsOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const openMenu = useCallback((key: string): void => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current)
    setActiveMenu(key)
  }, [])

  const closeMenuDelayed = useCallback((): void => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 300)
  }, [])

  const cancelClose = useCallback((): void => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current)
  }, [])

  const appUser: AppUser | null = useMemo(() => {
    if (typeof window === 'undefined' || !mounted) return null
    if (status === 'loading' || !session?.user) return null
    const u = session.user as AppUser
    return { id: u.id, email: u.email ?? null, name: u.name ?? null, isAdmin: u.isAdmin ?? false, packId: u.packId ?? null }
  }, [session, status, mounted])

  // Flat items for mobile drawer
  const mobileNavItems = useMemo(() => [
    { href: '/visas', label: 'Visas & Permits' },
    { href: '/lawyer', label: 'AI Advisor' },
    { href: '/tools', label: 'Tools' },
    { href: '/tools/cv-builder', label: 'CV Builder' },
    { href: '/blog', label: 'Blog & Guides' },
    { href: '/faq', label: 'FAQ' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/b2b', label: 'For Companies' },
    { href: '/marketplace', label: 'Find a Lawyer' },
    { href: '/contact', label: 'Contact' },
  ], [])

  const closeMenu = useCallback((): void => {
    setIsMenuOpen(false)
    haptic('light')
  }, [haptic])

  const toggleMenu = useCallback((): void => {
    setIsMenuOpen((prev) => {
      const next = !prev
      haptic(next ? 'medium' : 'light')
      return next
    })
  }, [haptic])

  const handleSignOut = useCallback(async (): Promise<void> => {
    await signOut({ callbackUrl: '/' })
  }, [])

  const isActive = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  if (mounted && pathname?.startsWith('/auth')) return null

  const activeMega = activeMenu ? MEGA_MENUS[activeMenu] : null

  return (
    <header className="sticky top-0 z-50 w-full" onMouseLeave={closeMenuDelayed}>

      {/* ── Top utility strip ───────────────────────────────────────────── */}
      <div className="hidden lg:block bg-[#0f172a] dark:bg-[#060d1f] text-slate-400 text-[11px]">
        <div className="mx-auto max-w-[1520px] px-6 xl:px-10 flex items-center justify-between h-8">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <span className="text-base leading-none">🇨🇭</span>
              <span>Switzerland</span>
            </span>
            <span className="w-px h-3 bg-slate-700" />
            <a href="tel:+41581234567" className="flex items-center gap-1 hover:text-slate-200 transition-colors">
              <Phone className="h-2.5 w-2.5" />
              +41 58 123 45 67
            </a>
            <span className="text-slate-600">Mon–Fri 9–18 CET</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/resources" className="hover:text-slate-200 transition-colors">Resources</Link>
            <Link href="/blog" className="hover:text-slate-200 transition-colors">Expert Guides</Link>
            <Link href="/contact" className="flex items-center gap-1 hover:text-slate-200 transition-colors">
              <HelpCircle className="h-2.5 w-2.5" />
              Help Center
            </Link>
            <span className="w-px h-3 bg-slate-700" />
            <div className="scale-75 origin-right">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ────────────────────────────────────────────────── */}
      <div
        className={cn(
          'w-full border-b transition-all duration-200',
          scrolled
            ? 'bg-white/97 dark:bg-[#0a0f1e]/97 backdrop-blur-2xl border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_16px_0_rgba(0,0,0,0.07)]'
            : 'bg-white dark:bg-[#0a0f1e] border-slate-200 dark:border-slate-800/60',
        )}
      >
        <nav className="mx-auto flex max-w-[1520px] items-stretch justify-between px-4 sm:px-6 xl:px-10 h-[66px]">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 pr-6 group"
            aria-label="Swiss Immigration Pro — Home"
          >
            <div className="relative h-8 w-8 shrink-0">
              <Image
                src="/images/logo-removebg.png"
                alt="Swiss Immigration Pro"
                fill
                className="object-contain transition-opacity group-hover:opacity-75 duration-150"
                sizes="32px"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col gap-px">
              <span
                className="text-[15px] font-extrabold tracking-[-0.03em] text-slate-900 dark:text-white leading-none"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Swiss Immigration
                <span className="text-blue-600 dark:text-blue-400"> Pro</span>
              </span>
              <span
                className="text-[9px] font-semibold tracking-[0.12em] uppercase text-slate-400 dark:text-slate-500 leading-none"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                AI-Powered Platform
              </span>
            </div>
          </Link>

          {/* Desktop nav items */}
          <div className="hidden lg:flex items-stretch flex-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.key}
                className={cn(
                  'relative flex items-stretch transition-colors duration-150',
                  activeMenu === item.megaKey && 'bg-slate-50/80 dark:bg-slate-800/40',
                )}
                onMouseEnter={() => item.megaKey ? openMenu(item.megaKey) : setActiveMenu(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-0.5 px-4 text-[13px] font-semibold tracking-wide transition-colors duration-100',
                    'after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2.5px] after:rounded-full after:transition-all after:duration-150',
                    isActive(item.href) || activeMenu === item.megaKey
                      ? 'text-slate-900 dark:text-white after:bg-blue-600 after:opacity-100'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white after:bg-blue-600 after:opacity-0 hover:after:opacity-100',
                  )}
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  {item.label}
                  {item.megaKey && (
                    <ChevronDown
                      className={cn(
                        'h-3 w-3 transition-transform duration-150 text-slate-400',
                        activeMenu === item.megaKey && 'rotate-180',
                      )}
                    />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            <div className="hidden lg:block">
              <AdvancedSearch />
            </div>
            <div className="hidden lg:block w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
            <div className="hidden sm:block">
              <DarkModeToggle />
            </div>
            {mounted && appUser && (
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
            )}
            <div className="hidden lg:block w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Auth */}
            {mounted && (
              <div className="hidden lg:flex items-center gap-2">
                {appUser ? (
                  <>
                    {appUser.packId === 'free' && (
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-bold text-white rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                        style={{ fontFamily: 'var(--font-jakarta)' }}
                      >
                        Upgrade
                      </Link>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => setProfileOpen((p) => !p)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                        style={{ fontFamily: 'var(--font-jakarta)' }}
                      >
                        {appUser.isAdmin ? <Shield className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                        {appUser.name ?? (appUser.isAdmin ? t('auth.admin') : t('nav.dashboard'))}
                        <ChevronDown className="h-3 w-3 text-slate-400" />
                      </button>
                      <AnimatePresence>
                        {profileOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-0 mt-1.5 w-52 z-50 bg-white dark:bg-slate-900 rounded-lg shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-700/60 py-1 overflow-hidden"
                            >
                              <div className="absolute inset-x-0 top-0 h-[2px] bg-blue-600" />
                              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                                <span className={cn(
                                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase',
                                  appUser.packId === 'citizenship' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                    : appUser.packId === 'advanced' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : appUser.packId === 'immigration' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                                )}>
                                  <Crown className="h-2.5 w-2.5" />
                                  {(appUser.packId ?? 'free').toUpperCase()}
                                </span>
                              </div>
                              <Link
                                href={appUser.isAdmin ? '/admin' : '/dashboard'}
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                {appUser.isAdmin ? <Shield className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                                {appUser.isAdmin ? t('auth.admin') : t('nav.dashboard')}
                              </Link>
                              <button
                                onClick={() => { setProfileOpen(false); void handleSignOut() }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                <LogOut className="h-3.5 w-3.5" />
                                Sign out
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-3.5 py-1.5 text-[13px] font-semibold text-slate-600 dark:text-slate-300 rounded-md hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      style={{ fontFamily: 'var(--font-jakarta)' }}
                    >
                      {t('auth.login')}
                    </Link>
                    <Link
                      href="/consultation"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-bold text-white rounded-md bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                      style={{ fontFamily: 'var(--font-jakarta)' }}
                    >
                      Book Consultation
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={toggleMenu}
              className="ml-1 inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors lg:hidden touch-manipulation"
              aria-label="Toggle navigation menu"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* ── Mega-menu panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeMenu && activeMega && (
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-40 bg-white dark:bg-[#0d1424] border-b border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10"
            onMouseEnter={cancelClose}
            onMouseLeave={closeMenuDelayed}
          >
            {/* Blue accent top line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600" />

            <div className="mx-auto max-w-[1520px] px-6 xl:px-10 py-8">
              <div className={cn(
                'grid gap-8',
                activeMega.featured ? 'grid-cols-[1fr_1fr_1fr_280px]' : 'grid-cols-3',
              )}>
                {/* Sections */}
                {activeMega.sections.map((section) => (
                  <div key={section.heading}>
                    <p
                      className="text-[10px] font-bold tracking-[0.14em] uppercase text-blue-500 dark:text-blue-400 mb-3 pl-3 border-l-2 border-blue-500 dark:border-blue-400"
                      style={{ fontFamily: 'var(--font-jakarta)' }}
                    >
                      {section.heading}
                    </p>
                    <ul className="space-y-0.5">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setActiveMenu(null)}
                            className="group flex items-start gap-2.5 rounded-lg px-3 py-2.5 hover:bg-blue-50/60 dark:hover:bg-slate-800/70 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug"
                                  style={{ fontFamily: 'var(--font-jakarta)' }}
                                >
                                  {link.label}
                                </span>
                                {link.badge && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                    {link.badge}
                                  </span>
                                )}
                                <ArrowRight className="h-3 w-3 ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500 shrink-0" />
                              </div>
                              <span className="text-[12px] text-slate-400 dark:text-slate-500 leading-snug">
                                {link.desc}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Featured card */}
                {activeMega.featured && (
                  <div className="pl-6 border-l border-slate-100 dark:border-slate-800">
                    <p
                      className="text-[10px] font-bold tracking-[0.14em] uppercase text-blue-500 dark:text-blue-400 mb-3 pl-3 border-l-2 border-blue-500 dark:border-blue-400"
                      style={{ fontFamily: 'var(--font-jakarta)' }}
                    >
                      Featured
                    </p>
                    <Link
                      href={activeMega.featured.href}
                      onClick={() => setActiveMenu(null)}
                      className="group block rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 hover:from-blue-500 hover:to-indigo-600 transition-all shadow-lg shadow-blue-500/20"
                    >
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold tracking-widest uppercase mb-3">
                        <Sparkles className="h-2.5 w-2.5" />
                        {activeMega.featured.badge}
                      </span>
                      <p
                        className="text-[15px] font-bold text-white leading-snug mb-2"
                        style={{ fontFamily: 'var(--font-jakarta)' }}
                      >
                        {activeMega.featured.label}
                      </p>
                      <p className="text-[12px] text-blue-100 leading-relaxed mb-4">
                        {activeMega.featured.desc}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white group-hover:gap-2.5 transition-all">
                        Get started <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close mega menu on outside click */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setActiveMenu(null)}
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <MobileDrawer
            appUser={appUser}
            navigationItems={mobileNavItems}
            isActive={isActive}
            onClose={closeMenu}
            onSignOut={handleSignOut}
          />
        )}
      </AnimatePresence>

      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </header>
  )
}
