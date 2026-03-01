'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CreditCard,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  ExternalLink,
  Crown,
  Zap,
  RefreshCcw,
  FileText,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import MainHeader from '@/components/layout/MainHeader'
import { useSession } from '@/lib/auth-client'
import { api, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils/cn'
import { PRICING_PACKS, type PackId } from '@/lib/pricing'

// ─── Types ────────────────────────────────────────────────────────────────────

type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing' | 'unpaid'

interface BillingInfo {
  plan_name: string
  pack_id: PackId
  price_chf: number
  billing_cycle: 'monthly' | 'annual'
  current_period_end: string
  status: SubscriptionStatus
  cancel_at_period_end: boolean
  stripe_customer_id: string | null
}

interface Invoice {
  id: string
  date: string
  amount_chf: number
  status: 'paid' | 'open' | 'void' | 'uncollectible'
  description: string
  pdf_url: string | null
  hosted_invoice_url: string | null
}

interface BillingResponse {
  subscription: BillingInfo
  invoices: Invoice[]
}

type PageState =
  | { kind: 'loading' }
  | { kind: 'free' }
  | { kind: 'loaded'; data: BillingResponse }
  | { kind: 'error'; message: string }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-CH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatCHF(amount: number): string {
  return `CHF ${amount.toFixed(2)}`
}

const STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; classes: string; icon: typeof CheckCircle }
> = {
  active: {
    label: 'Active',
    classes: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle,
  },
  trialing: {
    label: 'Trial',
    classes: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    icon: CheckCircle,
  },
  past_due: {
    label: 'Past Due',
    classes: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    icon: AlertTriangle,
  },
  unpaid: {
    label: 'Unpaid',
    classes: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
    icon: AlertTriangle,
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
    icon: XCircle,
  },
}

const INVOICE_STATUS_CONFIG: Record<
  Invoice['status'],
  { label: string; classes: string }
> = {
  paid: {
    label: 'Paid',
    classes: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
  },
  open: {
    label: 'Open',
    classes: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
  },
  void: {
    label: 'Void',
    classes: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
  },
  uncollectible: {
    label: 'Failed',
    classes: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300',
  },
}

const UPGRADE_PACKS: PackId[] = ['immigration', 'advanced', 'citizenship']

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 animate-pulse">
      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-5" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-3 bg-slate-200 dark:bg-slate-700 rounded mb-3',
            i === lines - 1 ? 'w-1/2' : 'w-full',
          )}
        />
      ))}
    </div>
  )
}

function PastDueBanner() {
  return (
    <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-5 py-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-amber-900 dark:text-amber-300 text-sm">
          Payment past due — action required
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-400/80 mt-0.5">
          Your latest payment could not be collected. Please update your payment method to
          keep access to your plan.
        </p>
      </div>
    </div>
  )
}

function CancelledBanner({ endDate }: { endDate: string }) {
  return (
    <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-5 py-4 flex items-start gap-3">
      <XCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
          Subscription cancelled
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
          You have access until <span className="font-medium">{formatDate(endDate)}</span>.
          Resubscribe anytime to continue your immigration journey.
        </p>
      </div>
    </div>
  )
}

function FreePlanCard() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white text-lg">Free Plan</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">No active subscription</p>
        </div>
        <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          Free
        </span>
      </div>

      <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-4 space-y-2.5 mb-6">
        {[
          '2 guide modules',
          'Immigration eligibility quiz',
          'AI chatbot (10 messages/day)',
          'Basic permit information',
        ].map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        Upgrade to unlock unlimited AI guidance, professional Swiss CV templates, and
        comprehensive work permit checklists.
      </p>

      <Link
        href="/pricing"
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all text-sm"
      >
        <Crown className="w-4 h-4" />
        View Upgrade Options
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

interface SubscriptionCardProps {
  data: BillingResponse
  onManage: () => Promise<void>
  managing: boolean
}

function SubscriptionCard({ data, onManage, managing }: SubscriptionCardProps) {
  const { subscription } = data
  const statusCfg = STATUS_CONFIG[subscription.status] ?? STATUS_CONFIG.cancelled
  const StatusIcon = statusCfg.icon

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
              {subscription.plan_name}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subscription.billing_cycle === 'annual' ? 'Annual billing' : 'Monthly billing'}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full shrink-0',
            statusCfg.classes,
          )}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {statusCfg.label}
        </span>
      </div>

      {/* Plan details grid */}
      <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-4 space-y-3 mb-6">
        {[
          {
            label: 'Amount',
            value: `${formatCHF(subscription.price_chf)} / ${subscription.billing_cycle === 'annual' ? 'year' : 'month'}`,
          },
          {
            label: 'Next billing date',
            value: subscription.cancel_at_period_end
              ? `Access until ${formatDate(subscription.current_period_end)}`
              : formatDate(subscription.current_period_end),
          },
          {
            label: 'Billing cycle',
            value: subscription.billing_cycle === 'annual' ? 'Annual (20% discount)' : 'Monthly',
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{label}</span>
            <span className="text-slate-900 dark:text-white font-semibold">{value}</span>
          </div>
        ))}
      </div>

      {/* Manage button */}
      <button
        onClick={onManage}
        disabled={managing}
        className={cn(
          'flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all',
          managing
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100',
        )}
      >
        {managing ? (
          <>
            <RefreshCcw className="w-4 h-4 animate-spin" />
            Opening portal…
          </>
        ) : (
          <>
            <ExternalLink className="w-4 h-4" />
            Manage Subscription
          </>
        )}
      </button>

      <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-3">
        Update payment method, cancel, or change plan via Stripe's secure portal.
      </p>
    </div>
  )
}

interface InvoiceTableProps {
  invoices: Invoice[]
}

function InvoiceTable({ invoices }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm">No invoices found yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
        {['Date', 'Amount', 'Status', 'Invoice'].map((h) => (
          <span
            key={h}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {invoices.map((inv) => {
          const statusCfg = INVOICE_STATUS_CONFIG[inv.status] ?? INVOICE_STATUS_CONFIG.void
          return (
            <li
              key={inv.id}
              className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 sm:gap-4 items-center px-6 py-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors"
            >
              {/* Date + description */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {inv.description}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(inv.date)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <span className="text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                {formatCHF(inv.amount_chf)}
              </span>

              {/* Status badge */}
              <span
                className={cn(
                  'inline-flex text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap',
                  statusCfg.classes,
                )}
              >
                {statusCfg.label}
              </span>

              {/* Download / view */}
              <div className="flex items-center gap-2">
                {inv.pdf_url && (
                  <a
                    href={inv.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download invoice PDF"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </a>
                )}
                {inv.hosted_invoice_url && (
                  <a
                    href={inv.hosted_invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View invoice in browser"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View</span>
                  </a>
                )}
                {!inv.pdf_url && !inv.hosted_invoice_url && (
                  <span className="text-xs text-slate-400 dark:text-slate-600">—</span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

interface UpgradeCTAProps {
  currentPackId: PackId
}

function UpgradeCTA({ currentPackId }: UpgradeCTAProps) {
  const packOrder: PackId[] = ['free', 'immigration', 'advanced', 'citizenship']
  const currentIndex = packOrder.indexOf(currentPackId)
  const nextPackId = currentIndex < packOrder.length - 1 ? packOrder[currentIndex + 1] : null
  const nextPack = nextPackId ? PRICING_PACKS[nextPackId] : null

  if (!nextPack) return null

  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 p-6 sm:p-7">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">
          Next Level
        </p>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
        Upgrade to {nextPack.name}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        {nextPack.shortDescription}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {nextPack.features.slice(0, 3).map((f) => (
          <span
            key={f}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white dark:bg-slate-900/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
          >
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            {f}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-slate-700 dark:text-slate-300 font-semibold">
          CHF {nextPack.price}
          <span className="text-sm font-normal text-slate-500 dark:text-slate-400"> / month</span>
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          Upgrade Now
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

function ContactSupportFallback() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-5 flex items-start gap-3">
      <CreditCard className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
          Need to change your plan or payment method?
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Contact our support team at{' '}
          <a
            href="mailto:support@swissimmigrationpro.com"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            support@swissimmigrationpro.com
          </a>{' '}
          and we'll help you right away.
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()

  const [pageState, setPageState] = useState<PageState>({ kind: 'loading' })
  const [managing, setManaging] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)

  // ── Fetch billing data ────────────────────────────────────────────────────

  useEffect(() => {
    if (sessionStatus === 'loading') return

    if (sessionStatus === 'unauthenticated' || !session) {
      router.push('/auth/login')
      return
    }

    async function loadBilling() {
      setPageState({ kind: 'loading' })

      try {
        const data = await api.get<BillingResponse>('/api/user/billing')
        setPageState({ kind: 'loaded', data })
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          if (err.status === 404) {
            // No subscription found — free user
            setPageState({ kind: 'free' })
            return
          }
          if (err.status === 401) {
            router.push('/auth/login')
            return
          }
          setPageState({ kind: 'error', message: err.detail })
        } else {
          setPageState({
            kind: 'error',
            message: 'Could not load billing information. Please try again later.',
          })
        }
      }
    }

    loadBilling()
  }, [sessionStatus, session, router])

  // ── Stripe portal ─────────────────────────────────────────────────────────

  const handleManageSubscription = async () => {
    setManaging(true)
    setPortalError(null)

    try {
      const { url } = await api.post<{ url: string }>('/api/checkout/portal', {
        return_url: `${window.location.origin}/account/billing`,
      })
      window.location.href = url
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setPortalError(
          err.status === 404
            ? null // Portal not configured — show contact fallback
            : err.detail,
        )
        // status 404 means endpoint doesn't exist yet — show contact fallback
        if (err.status === 404) {
          setPortalError('__contact_support__')
        }
      } else {
        setPortalError('Could not open the billing portal. Please try again.')
      }
    } finally {
      setManaging(false)
    }
  }

  // ── Derive pack info from session (fallback) ───────────────────────────────

  const currentPackId = (session?.user?.packId ?? 'free') as PackId

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MainHeader />

      {/* ── Hero ── */}
      <section className="pt-16 pb-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-2">
            Account
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Billing &amp; Invoices
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl">
            Manage your subscription, view payment history, and download invoices.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Loading */}
          {pageState.kind === 'loading' && (
            <>
              <SkeletonCard lines={4} />
              <SkeletonCard lines={5} />
            </>
          )}

          {/* Error */}
          {pageState.kind === 'error' && (
            <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-7 sm:p-9">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-300 mb-1">
                    Unable to load billing information
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-400/80">
                    {pageState.message}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Free plan */}
          {pageState.kind === 'free' && (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <FreePlanCard />
                <ContactSupportFallback />
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Upgrade Options
                </p>
                {UPGRADE_PACKS.map((packId) => {
                  const pack = PRICING_PACKS[packId]
                  return (
                    <Link
                      key={packId}
                      href="/pricing"
                      className="group flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:shadow-slate-100/80 dark:hover:shadow-none transition-all p-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                        <Crown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                          {pack.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          CHF {pack.price} / month
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Loaded — active subscriber */}
          {pageState.kind === 'loaded' && (() => {
            const { subscription, invoices } = pageState.data
            const isCancelled = subscription.status === 'cancelled'
            const isPastDue =
              subscription.status === 'past_due' || subscription.status === 'unpaid'

            return (
              <div className="space-y-6">
                {/* Status banners */}
                {isPastDue && <PastDueBanner />}
                {isCancelled && (
                  <CancelledBanner endDate={subscription.current_period_end} />
                )}

                {/* Two-column layout */}
                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                  {/* Left: subscription details */}
                  <div className="space-y-6">
                    <SubscriptionCard
                      data={pageState.data}
                      onManage={handleManageSubscription}
                      managing={managing}
                    />

                    {/* Portal fallback */}
                    {portalError === '__contact_support__' && (
                      <ContactSupportFallback />
                    )}
                    {portalError && portalError !== '__contact_support__' && (
                      <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 px-5 py-4 flex items-start gap-3">
                        <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 dark:text-red-300">{portalError}</p>
                      </div>
                    )}

                    {/* Invoice history */}
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                        Invoice History
                      </h2>
                      <InvoiceTable invoices={invoices} />
                    </div>
                  </div>

                  {/* Right: upgrade CTA */}
                  <div className="space-y-4">
                    <UpgradeCTA currentPackId={subscription.pack_id} />

                    {/* Quick links */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                        Quick Links
                      </p>
                      <ul className="space-y-2">
                        {[
                          { label: 'View all plans', href: '/pricing' },
                          { label: 'Your profile', href: '/profile' },
                          { label: 'Dashboard', href: '/dashboard' },
                          { label: 'Contact support', href: '/contact' },
                        ].map(({ label, href }) => (
                          <li key={href}>
                            <Link
                              href={href}
                              className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                            >
                              {label}
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Trust note */}
                    <div className="rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Payments are processed securely by{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Stripe
                        </span>
                        . Swiss Immigration Pro never stores your card details.
                        All amounts are in CHF.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </section>
    </div>
  )
}
