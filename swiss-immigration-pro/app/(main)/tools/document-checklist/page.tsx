'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  FileCheck,
  CheckCircle,
  Circle,
  Download,
  ChevronDown,
  Shield,
  Briefcase,
  Landmark,
  Scale,
  Home,
  ArrowRight,
  RotateCcw,
  Info,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

/* ────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────── */

type PermitType = 'B' | 'C' | 'L' | 'G' | 'citizenship'

type DocumentCategory = 'Personal' | 'Employment' | 'Financial' | 'Legal' | 'Housing'

interface DocumentItem {
  id: string
  name: string
  description: string
  required: boolean
  category: DocumentCategory
  cantonNote?: string
}

interface PermitConfig {
  label: string
  subtitle: string
  icon: typeof FileCheck
  accent: string
  accentBg: string
  accentBorder: string
}

interface ChecklistState {
  permitType: PermitType
  canton: string
  checked: Record<string, boolean>
}

/* ────────────────────────────────────────────────
   Constants — Swiss cantons
   ──────────────────────────────────────────────── */

const CANTONS = [
  { code: 'AG', name: 'Aargau' },
  { code: 'AI', name: 'Appenzell Innerrhoden' },
  { code: 'AR', name: 'Appenzell Ausserrhoden' },
  { code: 'BE', name: 'Bern' },
  { code: 'BL', name: 'Basel-Landschaft' },
  { code: 'BS', name: 'Basel-Stadt' },
  { code: 'FR', name: 'Fribourg' },
  { code: 'GE', name: 'Geneva' },
  { code: 'GL', name: 'Glarus' },
  { code: 'GR', name: 'Graubunden' },
  { code: 'JU', name: 'Jura' },
  { code: 'LU', name: 'Lucerne' },
  { code: 'NE', name: 'Neuchatel' },
  { code: 'NW', name: 'Nidwalden' },
  { code: 'OW', name: 'Obwalden' },
  { code: 'SG', name: 'St. Gallen' },
  { code: 'SH', name: 'Schaffhausen' },
  { code: 'SO', name: 'Solothurn' },
  { code: 'SZ', name: 'Schwyz' },
  { code: 'TG', name: 'Thurgau' },
  { code: 'TI', name: 'Ticino' },
  { code: 'UR', name: 'Uri' },
  { code: 'VD', name: 'Vaud' },
  { code: 'VS', name: 'Valais' },
  { code: 'ZG', name: 'Zug' },
  { code: 'ZH', name: 'Zurich' },
] as const

/* ────────────────────────────────────────────────
   Constants — permit config
   ──────────────────────────────────────────────── */

const PERMIT_CONFIG: Record<PermitType, PermitConfig> = {
  B: {
    label: 'B Permit',
    subtitle: 'Work / Long-term Residence',
    icon: Briefcase,
    accent: 'text-emerald-600 dark:text-emerald-400',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    accentBorder: 'border-emerald-200 dark:border-emerald-800',
  },
  C: {
    label: 'C Permit',
    subtitle: 'Settlement / Permanent Residence',
    icon: Shield,
    accent: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-50 dark:bg-blue-950/40',
    accentBorder: 'border-blue-200 dark:border-blue-800',
  },
  L: {
    label: 'L Permit',
    subtitle: 'Short-term Residence',
    icon: FileCheck,
    accent: 'text-violet-600 dark:text-violet-400',
    accentBg: 'bg-violet-50 dark:bg-violet-950/40',
    accentBorder: 'border-violet-200 dark:border-violet-800',
  },
  G: {
    label: 'G Permit',
    subtitle: 'Cross-border Commuter',
    icon: Landmark,
    accent: 'text-amber-600 dark:text-amber-400',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    accentBorder: 'border-amber-200 dark:border-amber-800',
  },
  citizenship: {
    label: 'Citizenship',
    subtitle: 'Swiss Naturalization',
    icon: Sparkles,
    accent: 'text-rose-600 dark:text-rose-400',
    accentBg: 'bg-rose-50 dark:bg-rose-950/40',
    accentBorder: 'border-rose-200 dark:border-rose-800',
  },
}

/* ────────────────────────────────────────────────
   Constants — category config
   ──────────────────────────────────────────────── */

const CATEGORY_CONFIG: Record<DocumentCategory, { icon: typeof FileCheck; color: string }> = {
  Personal: { icon: Shield, color: 'text-blue-600 dark:text-blue-400' },
  Employment: { icon: Briefcase, color: 'text-emerald-600 dark:text-emerald-400' },
  Financial: { icon: Landmark, color: 'text-amber-600 dark:text-amber-400' },
  Legal: { icon: Scale, color: 'text-violet-600 dark:text-violet-400' },
  Housing: { icon: Home, color: 'text-rose-600 dark:text-rose-400' },
}

const CATEGORY_ORDER: DocumentCategory[] = ['Personal', 'Employment', 'Financial', 'Housing', 'Legal']

/* ────────────────────────────────────────────────
   Document data
   ──────────────────────────────────────────────── */

const B_PERMIT_DOCS: DocumentItem[] = [
  // Personal
  { id: 'b-passport', name: 'Valid passport', description: 'Must be valid for at least 6 months beyond your planned entry date. Ensure at least 2 blank pages.', required: true, category: 'Personal' },
  { id: 'b-photos', name: 'Passport photos (x2)', description: 'Two recent biometric passport photos (35x45mm), white background, taken within last 6 months.', required: true, category: 'Personal' },
  { id: 'b-birth-cert', name: 'Birth certificate', description: 'Original or certified copy. Must be apostilled or legalized. Translation to German/French/Italian if needed.', required: true, category: 'Personal' },
  { id: 'b-cv', name: 'CV / Resume', description: 'Up-to-date curriculum vitae with complete employment history, education, and qualifications.', required: true, category: 'Personal' },
  // Employment
  { id: 'b-contract', name: 'Signed work contract', description: 'Employment contract signed by both parties, specifying role, salary, start date, and duration.', required: true, category: 'Employment' },
  { id: 'b-employer-letter', name: 'Employer confirmation letter', description: 'Official letter from the employer confirming the position, salary, and justification for hiring a foreign national.', required: true, category: 'Employment' },
  { id: 'b-salary', name: 'Salary details', description: 'Detailed breakdown of gross salary, bonuses, and benefits. Must meet cantonal minimum thresholds.', required: true, category: 'Employment' },
  // Financial
  { id: 'b-bank', name: 'Bank statements (3 months)', description: 'Last 3 months of bank statements showing sufficient financial means for relocation.', required: true, category: 'Financial' },
  { id: 'b-insurance', name: 'Health insurance proof', description: 'Proof of mandatory Swiss health insurance (KVG/LAMal) or confirmation of enrollment.', required: true, category: 'Financial' },
  // Housing
  { id: 'b-housing', name: 'Rental agreement or housing confirmation', description: 'Signed rental contract or letter from landlord confirming accommodation in Switzerland.', required: true, category: 'Housing' },
  // Legal
  { id: 'b-criminal', name: 'Criminal record certificate', description: 'Police clearance certificate from your country of residence, issued within the last 3 months.', required: true, category: 'Legal' },
  { id: 'b-marriage', name: 'Marriage certificate', description: 'If applicable. Required for family reunification. Must be apostilled and translated.', required: false, category: 'Legal' },
]

const C_PERMIT_EXTRAS: DocumentItem[] = [
  { id: 'c-residency', name: 'Proof of 10-year continuous residency', description: 'Documentation proving uninterrupted residence in Switzerland for 10 years (5 years for EU/EFTA nationals).', required: true, category: 'Personal' },
  { id: 'c-language', name: 'A2+ language certificate', description: 'Official certificate proving A2 oral and A1 written proficiency in the national language of your canton (German, French, or Italian).', required: true, category: 'Personal' },
  { id: 'c-integration', name: 'Integration assessment', description: 'Positive integration assessment from your municipality confirming social participation, language skills, and civic understanding.', required: true, category: 'Legal' },
  { id: 'c-tax', name: 'Tax returns (3 years)', description: 'Complete tax returns for the last 3 years, confirming no outstanding tax debts or arrears.', required: true, category: 'Financial' },
]

const L_PERMIT_DOCS: DocumentItem[] = [
  { id: 'l-passport', name: 'Valid passport', description: 'Must be valid for the entire duration of your stay plus 3 months.', required: true, category: 'Personal' },
  { id: 'l-photo', name: 'Passport photo (x1)', description: 'One recent biometric passport photo (35x45mm), white background.', required: true, category: 'Personal' },
  { id: 'l-contract', name: 'Employment contract (< 1 year)', description: 'Fixed-term employment contract for up to 12 months. Must include start/end dates and salary.', required: true, category: 'Employment' },
  { id: 'l-employer', name: 'Employer letter', description: 'Confirmation from employer detailing the position, project scope, and duration of assignment.', required: true, category: 'Employment' },
  { id: 'l-insurance', name: 'Health insurance proof', description: 'Proof of health insurance coverage for the duration of your stay in Switzerland.', required: true, category: 'Financial' },
]

const G_PERMIT_DOCS: DocumentItem[] = [
  { id: 'g-passport', name: 'Valid passport or national ID', description: 'Must be valid for at least 6 months. National ID card accepted for EU/EFTA citizens.', required: true, category: 'Personal' },
  { id: 'g-photo', name: 'Passport photo (x1)', description: 'One recent biometric passport photo (35x45mm), white background.', required: true, category: 'Personal' },
  { id: 'g-residence', name: 'Proof of residence in border zone', description: 'Confirmation of permanent residence in the border zone of a neighbouring country (FR, DE, IT, AT, LI).', required: true, category: 'Personal' },
  { id: 'g-contract', name: 'Employment contract', description: 'Swiss employment contract specifying work location, salary, and working hours.', required: true, category: 'Employment' },
  { id: 'g-employer', name: 'Employer confirmation', description: 'Letter from Swiss employer confirming the cross-border employment arrangement.', required: true, category: 'Employment' },
  { id: 'g-insurance', name: 'Health insurance proof', description: 'Proof of health insurance valid in Switzerland, or enrollment in Swiss system.', required: true, category: 'Financial' },
  { id: 'g-border-id', name: 'Border zone confirmation', description: 'Official document confirming your residential address falls within the recognized border zone.', required: true, category: 'Housing' },
]

const CITIZENSHIP_EXTRAS: DocumentItem[] = [
  { id: 'cit-language-b1', name: 'B1+ language certificate', description: 'Official certificate proving B1 oral and A2 written proficiency in the national language of your canton. Higher than C permit requirements.', required: true, category: 'Personal' },
  { id: 'cit-residency-12', name: 'Proof of 12-year residency', description: 'Documentation proving 12 years of residence in Switzerland (including 3 of the last 5 years). Years between ages 8-18 count double.', required: true, category: 'Personal' },
  { id: 'cit-community', name: 'Community integration report', description: 'Detailed report from your municipality on community participation, volunteering, local associations, and social integration.', required: true, category: 'Legal' },
  { id: 'cit-civic', name: 'Swiss civic knowledge test proof', description: 'Certificate of passing the civic knowledge exam covering Swiss government structure, history, and political rights.', required: true, category: 'Legal' },
  { id: 'cit-cantonal', name: 'Cantonal-specific application forms', description: 'Additional forms required by your canton of residence. Requirements vary significantly between cantons.', required: true, category: 'Legal', cantonNote: 'Requirements vary by canton' },
  { id: 'cit-no-debt', name: 'Debt enforcement register excerpt', description: 'Recent excerpt (Betreibungsregisterauszug) proving no outstanding debts or enforcement proceedings.', required: true, category: 'Financial' },
  { id: 'cit-social', name: 'Social welfare confirmation', description: 'Confirmation that you have not received social welfare (Sozialhilfe) in the last 3 years.', required: true, category: 'Financial' },
]

/* ────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────── */

function getDocumentsForPermit(permitType: PermitType): DocumentItem[] {
  switch (permitType) {
    case 'L':
      return L_PERMIT_DOCS
    case 'B':
      return B_PERMIT_DOCS
    case 'G':
      return G_PERMIT_DOCS
    case 'C':
      return [...B_PERMIT_DOCS, ...C_PERMIT_EXTRAS]
    case 'citizenship':
      return [...B_PERMIT_DOCS, ...C_PERMIT_EXTRAS, ...CITIZENSHIP_EXTRAS]
  }
}

function groupByCategory(docs: DocumentItem[]): Map<DocumentCategory, DocumentItem[]> {
  const groups = new Map<DocumentCategory, DocumentItem[]>()
  for (const cat of CATEGORY_ORDER) {
    const items = docs.filter((d) => d.category === cat)
    if (items.length > 0) {
      groups.set(cat, items)
    }
  }
  return groups
}

function generateMarkdownExport(
  permitType: PermitType,
  canton: string,
  docs: DocumentItem[],
  checked: Record<string, boolean>,
): string {
  const config = PERMIT_CONFIG[permitType]
  const cantonName = CANTONS.find((c) => c.code === canton)?.name ?? 'Not specified'
  const grouped = groupByCategory(docs)
  const completedCount = docs.filter((d) => checked[d.id]).length

  let md = `# Document Checklist: ${config.label}\n`
  md += `**Canton:** ${cantonName} (${canton || 'Any'})\n`
  md += `**Progress:** ${completedCount} of ${docs.length} documents\n`
  md += `**Generated:** ${new Date().toLocaleDateString('en-CH', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`

  for (const [category, items] of grouped) {
    md += `## ${category}\n\n`
    for (const item of items) {
      const check = checked[item.id] ? 'x' : ' '
      const badge = item.required ? '(Required)' : '(Optional)'
      md += `- [${check}] **${item.name}** ${badge}\n`
      md += `  ${item.description}\n`
      if (item.cantonNote) {
        md += `  _Note: ${item.cantonNote}_\n`
      }
      md += '\n'
    }
  }

  md += `---\n`
  md += `Generated by Swiss Immigration Pro (swissimmigrationpro.ch)\n`
  return md
}

const STORAGE_KEY = 'sip-document-checklist'

/* ────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────── */

export default function DocumentChecklistPage() {
  const [permitType, setPermitType] = useState<PermitType>('B')
  const [canton, setCanton] = useState('')
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [isHydrated, setIsHydrated] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<DocumentCategory>>(
    new Set(CATEGORY_ORDER),
  )

  /* ── Hydrate from localStorage ── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: unknown = JSON.parse(stored)
        if (
          parsed !== null &&
          typeof parsed === 'object' &&
          'permitType' in parsed &&
          'canton' in parsed &&
          'checked' in parsed
        ) {
          const state = parsed as ChecklistState
          setPermitType(state.permitType)
          setCanton(state.canton)
          setChecked(state.checked)
        }
      }
    } catch {
      // Silently handle corrupted localStorage
    }
    setIsHydrated(true)
  }, [])

  /* ── Persist to localStorage ── */
  useEffect(() => {
    if (!isHydrated) return
    const state: ChecklistState = { permitType, canton, checked }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // localStorage full or unavailable
    }
  }, [permitType, canton, checked, isHydrated])

  /* ── Documents for current selection ── */
  const documents = useMemo(() => getDocumentsForPermit(permitType), [permitType])
  const grouped = useMemo(() => groupByCategory(documents), [documents])

  /* ── Progress stats ── */
  const totalDocs = documents.length
  const completedDocs = documents.filter((d) => checked[d.id]).length
  const requiredDocs = documents.filter((d) => d.required)
  const completedRequired = requiredDocs.filter((d) => checked[d.id]).length
  const progressPercent = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0

  /* ── Handlers ── */
  const toggleDocument = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const toggleCategory = useCallback((category: DocumentCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }, [])

  const resetChecklist = useCallback(() => {
    setChecked({})
  }, [])

  const handleExport = useCallback(() => {
    const md = generateMarkdownExport(permitType, canton, documents, checked)
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sip-checklist-${PERMIT_CONFIG[permitType].label.toLowerCase().replace(/\s/g, '-')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [permitType, canton, documents, checked])

  const handlePermitChange = useCallback((type: PermitType) => {
    setPermitType(type)
    // Don't reset checked — user might switch back and forth
  }, [])

  const currentConfig = PERMIT_CONFIG[permitType]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* ── Hero ── */}
      <section className="pt-16 pb-10 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
            Free Tool
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Document Checklist
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Track every document you need for your Swiss immigration application.
            Select your permit type and canton, then check off items as you
            gather&nbsp;them.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['5 permit types', 'Auto-saved progress', '26 cantons'].map((stat) => (
              <span
                key={stat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                {stat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Configuration ── */}
      <section className="px-5 sm:px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Permit type selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Select Permit Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(Object.entries(PERMIT_CONFIG) as [PermitType, PermitConfig][]).map(
                ([type, config]) => {
                  const Icon = config.icon
                  const isActive = permitType === type
                  return (
                    <button
                      key={type}
                      onClick={() => handlePermitChange(type)}
                      className={cn(
                        'group relative flex flex-col items-center gap-2 rounded-2xl border p-4 sm:p-5 transition-all duration-200',
                        isActive
                          ? cn(
                              config.accentBorder,
                              config.accentBg,
                              'shadow-sm ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-950',
                              type === 'B' && 'ring-emerald-400/50 dark:ring-emerald-600/50',
                              type === 'C' && 'ring-blue-400/50 dark:ring-blue-600/50',
                              type === 'L' && 'ring-violet-400/50 dark:ring-violet-600/50',
                              type === 'G' && 'ring-amber-400/50 dark:ring-amber-600/50',
                              type === 'citizenship' && 'ring-rose-400/50 dark:ring-rose-600/50',
                            )
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md',
                      )}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                          isActive
                            ? config.accentBg
                            : 'bg-slate-100 dark:bg-slate-800',
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-5 h-5 transition-colors',
                            isActive ? config.accent : 'text-slate-400 dark:text-slate-500',
                          )}
                        />
                      </div>
                      <div className="text-center">
                        <div
                          className={cn(
                            'text-sm font-bold transition-colors',
                            isActive
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-700 dark:text-slate-300',
                          )}
                        >
                          {config.label}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                          {config.subtitle}
                        </div>
                      </div>
                    </button>
                  )
                },
              )}
            </div>
          </div>

          {/* Canton selector */}
          <div className="mb-8">
            <label
              htmlFor="canton-select"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
            >
              Canton of Residence
            </label>
            <div className="relative max-w-sm">
              <select
                id="canton-select"
                value={canton}
                onChange={(e) => setCanton(e.target.value)}
                className={cn(
                  'w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700',
                  'bg-white dark:bg-slate-900 px-4 py-3 pr-10',
                  'text-sm font-medium text-slate-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500',
                  'transition-colors',
                )}
              >
                <option value="">Any canton (general requirements)</option>
                {CANTONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            {canton && permitType === 'citizenship' && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                Citizenship requirements can vary significantly by canton. Verify with your local
                municipality.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Progress Overview ── */}
      <section className="px-5 sm:px-8 pb-6">
        <div className="max-w-6xl mx-auto">
          <div
            className={cn(
              'rounded-2xl border p-6 sm:p-7',
              currentConfig.accentBorder,
              currentConfig.accentBg,
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {currentConfig.label} Checklist
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {completedDocs} of {totalDocs} documents completed
                  {requiredDocs.length !== totalDocs && (
                    <span className="ml-1.5 text-slate-500 dark:text-slate-500">
                      ({completedRequired} of {requiredDocs.length} required)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetChecklist}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border',
                    'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
                    'text-xs font-semibold text-slate-600 dark:text-slate-300',
                    'hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
                  )}
                  title="Reset all checkboxes"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  onClick={handleExport}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl',
                    'bg-slate-900 dark:bg-white text-white dark:text-slate-900',
                    'text-xs font-semibold',
                    'hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors',
                  )}
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="h-3 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500 ease-out',
                    progressPercent === 100
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                      : progressPercent >= 50
                        ? 'bg-gradient-to-r from-blue-600 to-blue-400'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-500',
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {progressPercent}% complete
                </span>
                {progressPercent === 100 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    All documents ready
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Checklist ── */}
      <section className="px-5 sm:px-8 pb-12">
        <div className="max-w-6xl mx-auto space-y-4">
          {Array.from(grouped.entries()).map(([category, items]) => {
            const catConfig = CATEGORY_CONFIG[category]
            const CatIcon = catConfig.icon
            const isExpanded = expandedCategories.has(category)
            const catCompleted = items.filter((d) => checked[d.id]).length
            const catTotal = items.length

            return (
              <div
                key={category}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden transition-shadow hover:shadow-lg hover:shadow-slate-100/60 dark:hover:shadow-none"
              >
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between gap-3 p-5 sm:p-6 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <CatIcon className={cn('w-5 h-5', catConfig.color)} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {category}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {catCompleted} of {catTotal} completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Mini progress */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            'w-2 h-2 rounded-full transition-colors duration-300',
                            checked[item.id]
                              ? 'bg-emerald-500'
                              : 'bg-slate-200 dark:bg-slate-700',
                          )}
                        />
                      ))}
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-slate-400 transition-transform duration-200',
                        isExpanded && 'rotate-180',
                      )}
                    />
                  </div>
                </button>

                {/* Document items */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800">
                    {items.map((doc, idx) => {
                      const isChecked = checked[doc.id] ?? false
                      return (
                        <div
                          key={doc.id}
                          className={cn(
                            'group flex items-start gap-4 px-5 sm:px-6 py-4 transition-colors',
                            idx !== items.length - 1 &&
                              'border-b border-slate-50 dark:border-slate-800/50',
                            isChecked
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/10'
                              : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20',
                          )}
                        >
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleDocument(doc.id)}
                            className="mt-0.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                            aria-label={`Mark "${doc.name}" as ${isChecked ? 'incomplete' : 'complete'}`}
                          >
                            {isChecked ? (
                              <CheckCircle className="w-6 h-6 text-emerald-500 transition-transform duration-200 scale-110" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors" />
                            )}
                          </button>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={cn(
                                  'text-sm font-semibold transition-colors',
                                  isChecked
                                    ? 'text-slate-400 dark:text-slate-500 line-through'
                                    : 'text-slate-900 dark:text-white',
                                )}
                              >
                                {doc.name}
                              </span>
                              <span
                                className={cn(
                                  'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                                  doc.required
                                    ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
                                )}
                              >
                                {doc.required ? 'Required' : 'Optional'}
                              </span>
                            </div>
                            <p
                              className={cn(
                                'text-sm leading-relaxed transition-colors',
                                isChecked
                                  ? 'text-slate-400 dark:text-slate-600'
                                  : 'text-slate-600 dark:text-slate-400',
                              )}
                            >
                              {doc.description}
                            </p>
                            {doc.cantonNote && (
                              <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <Info className="w-3 h-3 shrink-0" />
                                {doc.cantonNote}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Tips Section ── */}
      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-7 sm:p-9">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Document Tips
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Get Official Translations',
                  desc: 'All documents not in German, French, or Italian must be translated by a certified translator and apostilled.',
                },
                {
                  title: 'Check Validity Dates',
                  desc: 'Criminal record certificates and bank statements should be no older than 3 months at the time of submission.',
                },
                {
                  title: 'Keep Multiple Copies',
                  desc: 'Prepare at least 3 certified copies of each document. The municipality, canton, and SEM may each need originals.',
                },
                {
                  title: 'Start Gathering Early',
                  desc: 'Some documents (criminal records, apostilles) can take 4-8 weeks to obtain. Begin collecting documents as soon as possible.',
                },
              ].map((tip) => (
                <div key={tip.title} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white text-sm block mb-0.5">
                      {tip.title}
                    </strong>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Need help with your application?
            </h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
              Our Immigration Pack includes step-by-step guidance, document
              templates, and expert support for every permit type.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Start Free Assessment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
