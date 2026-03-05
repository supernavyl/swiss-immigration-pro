'use client'

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { useSession } from '@/lib/auth-client'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils/cn'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PermitCode = 'B' | 'C' | 'F' | 'G' | 'N' | 'L'
type NationalityType = 'eu_efta' | 'third_country'

interface PermitPeriod {
  permitType: PermitCode
  startDate: string
  endDate: string | null
}

interface PlannerInputs {
  arrivalDate: string
  dateOfBirth: string
  nationalityType: NationalityType
  canton: string
  currentPermit: PermitCode
  permitHistory: PermitPeriod[]
}

interface TimelineResult {
  qualifyingYears: number
  totalActualYears: number
  childhoodBonus: number
  earliestApplicationDate: Date
  yearsRemaining: number
  monthsRemaining: number
  canApplyNow: boolean
  currentMilestoneYear: number
  progressPercent: number
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MilestoneStatus {
  [key: string]: 'pending' | 'in-progress' | 'done'
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SWISS_CANTONS = [
  'Aargau',
  'Appenzell Ausserrhoden',
  'Appenzell Innerrhoden',
  'Basel-Landschaft',
  'Basel-Stadt',
  'Bern',
  'Fribourg',
  'Geneve',
  'Glarus',
  'Graubunden',
  'Jura',
  'Luzern',
  'Neuchatel',
  'Nidwalden',
  'Obwalden',
  'Schaffhausen',
  'Schwyz',
  'Solothurn',
  'St. Gallen',
  'Thurgau',
  'Ticino',
  'Uri',
  'Valais',
  'Vaud',
  'Zug',
  'Zurich',
] as const

const PERMIT_LABELS: Record<PermitCode, string> = {
  B: 'B — Residence permit',
  C: 'C — Settlement permit',
  F: 'F — Provisional admission',
  G: 'G — Cross-border commuter',
  N: 'N — Asylum seeker',
  L: 'L — Short-stay',
}

/** Weight each permit type contributes to qualifying years */
const PERMIT_WEIGHT: Record<PermitCode, number> = {
  B: 1,
  C: 1,
  F: 0.5,
  G: 0,
  N: 0.5,
  L: 0,
}

const REQUIRED_YEARS = 10
const MIN_ACTUAL_YEARS = 5
const MAX_CHILDHOOD_BONUS = 5
const COMMUNE_RESIDENCE_YEARS = 2

const STORAGE_KEY_INPUTS = 'cit-planner-inputs'
const STORAGE_KEY_MILESTONES = 'cit-planner-milestones'

// ---------------------------------------------------------------------------
// Milestone definitions
// ---------------------------------------------------------------------------

interface Milestone {
  year: number
  title: string
  items: string[]
}

const MILESTONES: Milestone[] = [
  {
    year: 0,
    title: 'Arrival & Setup',
    items: [
      'Register at commune (Einwohnerkontrolle) within 14 days',
      'Get mandatory health insurance (KVG) within 3 months, back-dated',
      'Open a Swiss bank account',
      'Understand your permit conditions',
    ],
  },
  {
    year: 1,
    title: 'Settling In',
    items: [
      'Establish stable employment',
      'Enroll in language courses (German / French / Italian)',
      'Register with AHV (social insurance)',
      "Learn the commune's administrative procedures",
    ],
  },
  {
    year: 2,
    title: 'Integration Check',
    items: [
      'First integration assessment (if canton requires it)',
      'Language progress: aim for A2 oral + A2 written',
      'Establish stable housing — avoid frequent moves',
      'Understand the Swiss tax system and file correctly',
    ],
  },
  {
    year: 3,
    title: 'Language Certification',
    items: [
      'Get fide B1 oral + A2 written certificate (critical!)',
      'fide is the official Swiss language framework (fide-info.ch)',
      'Without B1 you cannot naturalize — start early',
      'Build community ties: associations, volunteer work',
    ],
  },
  {
    year: 4,
    title: 'Permit Upgrade Review',
    items: [
      'EU/EFTA: eligible to apply for C permit after 5 yrs on B',
      'Review integration: no employment gaps, no social welfare',
      'Prepare document archive: tax returns, pay slips, rental contracts',
    ],
  },
  {
    year: 5,
    title: 'Halfway Milestone',
    items: [
      'EU/EFTA: apply for C permit (Niederlassungsbewilligung)',
      'Non-EU: review B permit renewal',
      'Check for any criminal proceedings or issues',
      'Reassess your timeline and next steps',
    ],
  },
  {
    year: 7,
    title: 'Continuity & Community',
    items: [
      'Avoid extended absences (> 6 months resets the clock)',
      'Maintain same commune residence for continuity',
      'Deepen community integration: associations, local voting',
    ],
  },
  {
    year: 8,
    title: 'Document Preparation',
    items: [
      'Tax returns for the last 3 years',
      'Employment contracts + salary statements',
      'Health insurance proof',
      'Language certificate (must be <= 5 years old at application)',
      'Criminal record extract (Strafregisterauszug)',
      'Residence confirmation (Wohnsitzbestatigung)',
    ],
  },
  {
    year: 9,
    title: 'Pre-Application',
    items: [
      'Pre-application meeting with commune office',
      'Understand commune-specific requirements',
      'Cantonal integration test preparation (if required)',
      'Collect character references if needed',
    ],
  },
  {
    year: 10,
    title: 'Application & Naturalization',
    items: [
      'Submit application at commune (Gemeinde)',
      'Pay application fee (CHF 100-500 depending on commune)',
      'Commune interview and decision (2-12 months)',
      'Canton review (1-6 months)',
      'SEM federal approval (2-4 months)',
      'Oath ceremony and naturalization!',
    ],
  },
]

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or disabled — ignore
  }
}

function msgId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function dateDiffYears(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function pluralize(n: number, singular: string, plural?: string): string {
  return `${n} ${n === 1 ? singular : plural ?? singular + 's'}`
}

// ---------------------------------------------------------------------------
// Calculation engine
// ---------------------------------------------------------------------------

function computeTimeline(inputs: PlannerInputs): TimelineResult | null {
  if (!inputs.arrivalDate || !inputs.dateOfBirth) return null

  const arrival = new Date(inputs.arrivalDate)
  const dob = new Date(inputs.dateOfBirth)
  const now = new Date()

  if (isNaN(arrival.getTime()) || isNaN(dob.getTime())) return null
  if (arrival > now) return null

  const totalActualYears = Math.max(0, dateDiffYears(arrival, now))

  // --- Build effective permit periods ---
  let periods: PermitPeriod[] = []

  if (inputs.permitHistory.length > 0) {
    periods = [...inputs.permitHistory]
  } else {
    periods = [
      {
        permitType: inputs.currentPermit,
        startDate: inputs.arrivalDate,
        endDate: null,
      },
    ]
  }

  // --- Calculate qualifying years from permit periods ---
  let qualifyingYears = 0
  for (const period of periods) {
    const pStart = new Date(period.startDate)
    const pEnd = period.endDate ? new Date(period.endDate) : now
    if (isNaN(pStart.getTime()) || isNaN(pEnd.getTime())) continue
    const effectiveStart = pStart < arrival ? arrival : pStart
    const effectiveEnd = pEnd > now ? now : pEnd
    if (effectiveEnd <= effectiveStart) continue
    const years = dateDiffYears(effectiveStart, effectiveEnd)
    qualifyingYears += years * PERMIT_WEIGHT[period.permitType]
  }

  // --- Childhood bonus ---
  const ageAtArrival = dateDiffYears(dob, arrival)
  let childhoodBonus = 0
  if (ageAtArrival < 18) {
    const eighteenthBirthday = new Date(dob)
    eighteenthBirthday.setFullYear(eighteenthBirthday.getFullYear() + 18)
    const endOfChildhood = eighteenthBirthday < now ? eighteenthBirthday : now
    if (endOfChildhood > arrival) {
      const childhoodYearsInSwitzerland = dateDiffYears(arrival, endOfChildhood)
      // Years under 18 count double, so the bonus is 1x the childhood years (the base is already counted)
      childhoodBonus = Math.min(childhoodYearsInSwitzerland, MAX_CHILDHOOD_BONUS)
    }
  }

  const totalQualifying = qualifyingYears + childhoodBonus
  const progressPercent = Math.min(100, (totalQualifying / REQUIRED_YEARS) * 100)

  // --- Earliest application date ---
  // Need: totalQualifying >= 10 AND totalActualYears >= 5 AND commune >= 2
  const qualifyingDeficit = Math.max(0, REQUIRED_YEARS - totalQualifying)
  const actualDeficit = Math.max(0, MIN_ACTUAL_YEARS - totalActualYears)
  const communeDeficit = Math.max(0, COMMUNE_RESIDENCE_YEARS - totalActualYears) // conservative: assume commune = arrival

  // Determine the effective weight going forward (use current permit)
  const currentWeight = PERMIT_WEIGHT[inputs.currentPermit]
  // Also check if childhood bonus still accruing
  const currentAge = dateDiffYears(dob, now)
  const stillChild = currentAge < 18
  const effectiveRate = stillChild ? currentWeight * 2 : currentWeight

  let yearsNeeded: number
  if (effectiveRate <= 0) {
    // Current permit doesn't count — can't project a date
    yearsNeeded = qualifyingDeficit > 0 ? Infinity : 0
  } else {
    yearsNeeded = qualifyingDeficit / effectiveRate
  }

  // Also need at least 5 actual years and 2 commune years
  yearsNeeded = Math.max(yearsNeeded, actualDeficit, communeDeficit)

  const earliestApplicationDate = new Date(now)
  if (isFinite(yearsNeeded) && yearsNeeded > 0) {
    earliestApplicationDate.setMonth(
      earliestApplicationDate.getMonth() + Math.ceil(yearsNeeded * 12)
    )
  }

  const canApplyNow = yearsNeeded <= 0
  const totalMonthsRemaining = Math.max(0, Math.ceil(yearsNeeded * 12))
  const yearsRemaining = Math.floor(totalMonthsRemaining / 12)
  const monthsRemaining = totalMonthsRemaining % 12

  const currentMilestoneYear = Math.min(10, Math.floor(totalActualYears))

  return {
    qualifyingYears: Math.round(totalQualifying * 10) / 10,
    totalActualYears: Math.round(totalActualYears * 10) / 10,
    childhoodBonus: Math.round(childhoodBonus * 10) / 10,
    earliestApplicationDate,
    yearsRemaining,
    monthsRemaining,
    canApplyNow,
    currentMilestoneYear,
    progressPercent: Math.round(progressPercent * 10) / 10,
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** SVG progress ring */
function ProgressRing({
  percent,
  size = 180,
  stroke = 12,
}: {
  percent: number
  size?: number
  stroke?: number
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference

  const color =
    percent >= 100
      ? 'stroke-emerald-500'
      : percent >= 80
        ? 'stroke-amber-500'
        : 'stroke-sky-500'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn(color, 'transition-[stroke-dashoffset] duration-1000 ease-out')}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {Math.round(percent)}%
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">qualifying</span>
      </div>
    </div>
  )
}

/** Typing indicator dots */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
    </div>
  )
}

/** Single milestone card in the vertical timeline */
function MilestoneCard({
  milestone,
  status,
  isExpanded,
  onToggle,
  onAskAI,
  milestoneStatuses,
  onToggleItem,
}: {
  milestone: Milestone
  status: 'past' | 'current' | 'future'
  isExpanded: boolean
  onToggle: () => void
  onAskAI: (question: string) => void
  milestoneStatuses: MilestoneStatus
  onToggleItem: (key: string) => void
}) {
  return (
    <div className="relative pl-8">
      {/* Dot on timeline */}
      <div
        className={cn(
          'absolute left-0 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2',
          status === 'past' &&
            'border-emerald-500 bg-emerald-500 text-white',
          status === 'current' &&
            'border-sky-500 bg-sky-500 text-white shadow-[0_0_0_4px_rgba(14,165,233,0.2)]',
          status === 'future' &&
            'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
        )}
      >
        {status === 'past' && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === 'current' && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        )}
      </div>

      {/* Card */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'w-full rounded-xl border p-4 text-left transition-all',
          status === 'current'
            ? 'border-sky-300 bg-sky-50 shadow-md dark:border-sky-700 dark:bg-sky-950/40'
            : 'border-gray-200 bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-800/60',
          status === 'past' && 'opacity-75'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                status === 'past' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
                status === 'current' && 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
                status === 'future' && 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}
            >
              Year {milestone.year}
            </span>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {milestone.title}
            </h3>
          </div>
          <svg
            className={cn(
              'h-4 w-4 text-gray-400 transition-transform',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
            {milestone.items.map((item, idx) => {
              const key = `${milestone.year}-${idx}`
              const itemStatus = milestoneStatuses[key] || 'pending'
              return (
                <label
                  key={key}
                  className="flex cursor-pointer items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <button
                    type="button"
                    onClick={() => onToggleItem(key)}
                    className={cn(
                      'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors',
                      itemStatus === 'done'
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : itemStatus === 'in-progress'
                          ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/40'
                          : 'border-gray-300 dark:border-gray-600'
                    )}
                  >
                    {itemStatus === 'done' && (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {itemStatus === 'in-progress' && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                  <span className={cn(itemStatus === 'done' && 'line-through opacity-60')}>
                    {item}
                  </span>
                </label>
              )
            })}
            <button
              type="button"
              onClick={() =>
                onAskAI(
                  `Tell me more about Year ${milestone.year}: "${milestone.title}". What should I focus on and what are common mistakes?`
                )
              }
              className="mt-2 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ask AI about this
            </button>
          </div>
        )}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Integration requirements checklist items
// ---------------------------------------------------------------------------

const INTEGRATION_ITEMS = [
  { key: 'lang', label: 'Language: fide B1 oral + A2 written certificate' },
  { key: 'criminal', label: 'No criminal record' },
  { key: 'welfare', label: 'No social welfare dependency (last 3 years)' },
  { key: 'values', label: 'Respect for constitutional values' },
  { key: 'economic', label: 'Economic self-sufficiency' },
  { key: 'commune', label: '2+ years continuous commune residence' },
] as const

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CitizenshipTimelinePlanner() {
  const { data: session } = useSession()

  // ---- Form state (persisted to localStorage) ----
  const [inputs, setInputs] = useState<PlannerInputs>(() =>
    loadFromStorage<PlannerInputs>(STORAGE_KEY_INPUTS, {
      arrivalDate: '',
      dateOfBirth: '',
      nationalityType: 'third_country',
      canton: '',
      currentPermit: 'B',
      permitHistory: [],
    })
  )

  const [milestoneStatuses, setMilestoneStatuses] = useState<MilestoneStatus>(() =>
    loadFromStorage<MilestoneStatus>(STORAGE_KEY_MILESTONES, {})
  )

  const [formStep, setFormStep] = useState(0)
  const [showPermitHistory, setShowPermitHistory] = useState(
    () => inputs.permitHistory.length > 0
  )
  const [expandedMilestones, setExpandedMilestones] = useState<Set<number>>(new Set())

  // ---- AI chat state ----
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isAILoading, setIsAILoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ---- Mobile tab ----
  const [activeTab, setActiveTab] = useState<'timeline' | 'ai'>('timeline')

  // ---- Persist inputs ----
  useEffect(() => {
    saveToStorage(STORAGE_KEY_INPUTS, inputs)
  }, [inputs])

  useEffect(() => {
    saveToStorage(STORAGE_KEY_MILESTONES, milestoneStatuses)
  }, [milestoneStatuses])

  // ---- Derived results ----
  const result = useMemo(() => computeTimeline(inputs), [inputs])

  // ---- Auto-expand current milestone ----
  useEffect(() => {
    if (result) {
      setExpandedMilestones((prev) => {
        const next = new Set(prev)
        next.add(result.currentMilestoneYear)
        return next
      })
    }
  }, [result?.currentMilestoneYear]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Welcome message ----
  useEffect(() => {
    if (messages.length > 0) return

    let content: string
    if (result && inputs.arrivalDate) {
      const arrivalFmt = formatDate(new Date(inputs.arrivalDate))
      const yearsAgo = result.totalActualYears.toFixed(1)
      const earliest = formatDate(result.earliestApplicationDate)
      const remaining = result.canApplyNow
        ? 'NOW!'
        : `${pluralize(result.yearsRemaining, 'year')}, ${pluralize(result.monthsRemaining, 'month')} away`

      content = [
        `I'm your Swiss citizenship guide. Based on your profile:`,
        ``,
        `You arrived ${yearsAgo} years ago on ${arrivalFmt}`,
        `Earliest application: ${earliest} (${remaining})`,
        `Canton: ${inputs.canton || 'not set'}`,
        `Current permit: ${inputs.currentPermit}`,
        ``,
        `You're ${Math.round(result.progressPercent)}% of the way there! What would you like to know?`,
      ].join('\n')
    } else {
      content =
        "I'm your Swiss citizenship guide. Fill in your details on the timeline tab and I'll give you personalized guidance on your path to Swiss citizenship!"
    }

    setMessages([
      {
        id: msgId(),
        role: 'assistant',
        content,
        timestamp: new Date(),
      },
    ])
  }, [result, inputs.arrivalDate, inputs.canton, inputs.currentPermit]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Auto-scroll chat ----
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAILoading])

  // ---- Textarea auto-resize ----
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 96)}px`
  }, [])

  // ---- Quick action chips ----
  const quickActions = useMemo(() => {
    if (!result) {
      return [
        'What are the residency requirements?',
        "What's fide certification?",
        'Explain the integration test',
      ]
    }
    if (result.canApplyNow) {
      return [
        'What documents do I need?',
        'How long does the process take?',
        'What happens at the commune interview?',
        "What's fide certification?",
      ]
    }
    return [
      'Am I on track?',
      'What counts as absence?',
      `Tell me about Year ${result.currentMilestoneYear}`,
      'Explain the integration test',
      "What's fide certification?",
      `Canton-specific rules for ${inputs.canton || 'my canton'}`,
    ]
  }, [result, inputs.canton])

  // ---- Send message ----
  const sendMessage = useCallback(
    async (messageContent: string) => {
      const trimmed = messageContent.trim()
      if (!trimmed || isAILoading) return

      const userMsg: ChatMessage = {
        id: msgId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setChatInput('')
      setIsAILoading(true)

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }

      // Build context-aware system prompt
      let contextBlock = ''
      if (result && inputs.arrivalDate) {
        const arrivalFmt = formatDate(new Date(inputs.arrivalDate))
        const dobFmt = inputs.dateOfBirth
          ? formatDate(new Date(inputs.dateOfBirth))
          : 'unknown'
        const ageAtArrival = inputs.dateOfBirth
          ? Math.floor(
              dateDiffYears(
                new Date(inputs.dateOfBirth),
                new Date(inputs.arrivalDate)
              )
            )
          : 'unknown'
        const earliest = formatDate(result.earliestApplicationDate)
        const remaining = result.canApplyNow
          ? 'Eligible now!'
          : `${result.yearsRemaining} years ${result.monthsRemaining} months`

        const currentMs = MILESTONES.find(
          (m) => m.year === result.currentMilestoneYear
        )
        const nextMilestones = MILESTONES.filter(
          (m) => m.year > result.currentMilestoneYear
        ).slice(0, 3)

        contextBlock = `
USER PROFILE:
- Arrived in Switzerland: ${arrivalFmt}
- Date of birth: ${dobFmt}
- Age at arrival: ${ageAtArrival}
- Nationality: ${inputs.nationalityType === 'eu_efta' ? 'EU/EFTA' : 'Third-country national'}
- Current permit: ${inputs.currentPermit}
- Canton: ${inputs.canton || 'not specified'}
- Qualifying years accumulated: ${result.qualifyingYears} years${result.childhoodBonus > 0 ? ` (includes ${result.childhoodBonus} childhood bonus)` : ''}
- Earliest naturalization application date: ${earliest}
- Years/months remaining: ${remaining}

CURRENT MILESTONE: Year ${result.currentMilestoneYear}${currentMs ? ` — ${currentMs.title}` : ''}

RELEVANT MILESTONES AHEAD:
${nextMilestones.map((m) => `- Year ${m.year}: ${m.title}`).join('\n')}
`
      }

      const systemPrompt = `You are a Swiss immigration expert helping someone plan their citizenship journey.
${contextBlock}
You have expert knowledge of:
- Swiss Nationality Act (LN/BuG SR 141.0) and Federal Ordinance (OLN/BuV SR 141.01)
- fide language framework (B1 oral + A2 written requirement)
- Integration criteria (LEI Art. 58a, OASA Art. 62)
- 26 cantonal variations in naturalization requirements
- Three-stage process: commune, canton, SEM federal

Rules:
- Be concise (max 3 paragraphs unless the question requires more)
- Cite specific law articles when making legal claims
- Be encouraging but accurate — don't give false hope
- If asked about specific canton rules, give canton-specific info for ${inputs.canton || 'the user\'s canton'}
- Always use CHF for amounts
- Respond in the same language the user writes in (English or French)

User's question: ${trimmed}`

      try {
        const data = await api.post<{ response: string }>('/api/chat', {
          message: systemPrompt,
          packId: session?.user?.packId || 'free',
          layer: null,
        })

        const assistantText = data.response?.trim() || 'Sorry, I could not generate a response.'

        setMessages((prev) => [
          ...prev,
          {
            id: msgId(),
            role: 'assistant',
            content: assistantText,
            timestamp: new Date(),
          },
        ])
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : 'Connection error. Please try again.'
        setMessages((prev) => [
          ...prev,
          {
            id: msgId(),
            role: 'assistant',
            content: `Sorry, something went wrong: ${errMsg}`,
            timestamp: new Date(),
          },
        ])
      } finally {
        setIsAILoading(false)
      }
    },
    [isAILoading, result, inputs, session]
  )

  // ---- Handlers ----
  const updateInput = useCallback(
    <K extends keyof PlannerInputs>(key: K, value: PlannerInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const addPermitPeriod = useCallback(() => {
    setInputs((prev) => ({
      ...prev,
      permitHistory: [
        ...prev.permitHistory,
        { permitType: 'B', startDate: '', endDate: null },
      ],
    }))
  }, [])

  const updatePermitPeriod = useCallback(
    (index: number, field: keyof PermitPeriod, value: string | null) => {
      setInputs((prev) => {
        const updated = [...prev.permitHistory]
        updated[index] = { ...updated[index], [field]: value }
        return { ...prev, permitHistory: updated }
      })
    },
    []
  )

  const removePermitPeriod = useCallback((index: number) => {
    setInputs((prev) => ({
      ...prev,
      permitHistory: prev.permitHistory.filter((_, i) => i !== index),
    }))
  }, [])

  const toggleMilestoneItem = useCallback((key: string) => {
    setMilestoneStatuses((prev) => {
      const current = prev[key] || 'pending'
      const next =
        current === 'pending'
          ? 'in-progress'
          : current === 'in-progress'
            ? 'done'
            : 'pending'
      return { ...prev, [key]: next }
    })
  }, [])

  const toggleExpandedMilestone = useCallback((year: number) => {
    setExpandedMilestones((prev) => {
      const next = new Set(prev)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }, [])

  const handleChatSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      sendMessage(chatInput)
    },
    [chatInput, sendMessage]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage(chatInput)
      }
    },
    [chatInput, sendMessage]
  )

  const askAIFromTimeline = useCallback(
    (question: string) => {
      setActiveTab('ai')
      sendMessage(question)
    },
    [sendMessage]
  )

  // ---- Today ISO for max attribute ----
  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], [])

  // ---- Status color for earliest date ----
  const dateColor = useMemo(() => {
    if (!result) return ''
    if (result.canApplyNow) return 'text-emerald-600 dark:text-emerald-400'
    if (result.yearsRemaining <= 2) return 'text-amber-600 dark:text-amber-400'
    return 'text-sky-600 dark:text-sky-400'
  }, [result])

  // ---- Render helpers ----
  const hasInputs = inputs.arrivalDate && inputs.dateOfBirth

  // =====================================================================
  //  RENDER
  // =====================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-sky-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-sky-950/20">
      {/* ---- Header ---- */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-lg text-white shadow-lg shadow-blue-500/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                Citizenship Timeline Planner
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your personalized roadmap to Swiss naturalization
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Mobile tab switcher ---- */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/90 lg:hidden">
        <div className="mx-auto flex max-w-7xl">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={cn(
              'flex-1 px-4 py-3 text-center text-sm font-medium transition-colors',
              activeTab === 'timeline'
                ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            )}
          >
            My Timeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={cn(
              'flex-1 px-4 py-3 text-center text-sm font-medium transition-colors',
              activeTab === 'ai'
                ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            )}
          >
            Ask AI
          </button>
        </div>
      </div>

      {/* ---- Two-column layout ---- */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* ================================================================
              LEFT COLUMN: Calculator + Timeline
              ================================================================ */}
          <div
            className={cn(
              'flex-1 space-y-6 lg:max-w-[60%]',
              activeTab !== 'timeline' && 'hidden lg:block'
            )}
          >
            {/* ---- Step Indicators ---- */}
            <div className="flex items-center gap-2">
              {['Basic Info', 'Permit History', 'Results'].map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFormStep(idx)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    formStep === idx
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400'
                      : formStep > idx
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                      formStep === idx
                        ? 'bg-sky-500 text-white'
                        : formStep > idx
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                    )}
                  >
                    {formStep > idx ? (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* ---- Step 1: Basic Info ---- */}
            {formStep === 0 && (
              <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Information
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Arrival date */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Arrival date in Switzerland
                    </label>
                    <input
                      type="date"
                      max={todayISO}
                      value={inputs.arrivalDate}
                      onChange={(e) => updateInput('arrivalDate', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Date of birth */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date of birth
                    </label>
                    <input
                      type="date"
                      max={todayISO}
                      value={inputs.dateOfBirth}
                      onChange={(e) => updateInput('dateOfBirth', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Nationality type */}
                <fieldset>
                  <legend className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nationality
                  </legend>
                  <div className="flex gap-3">
                    {(
                      [
                        ['eu_efta', 'EU / EFTA citizen'],
                        ['third_country', 'Third-country national'],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={cn(
                          'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                          inputs.nationalityType === value
                            ? 'border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-600 dark:bg-sky-900/40 dark:text-sky-400'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700/50'
                        )}
                      >
                        <input
                          type="radio"
                          name="nationality"
                          value={value}
                          checked={inputs.nationalityType === value}
                          onChange={() => updateInput('nationalityType', value)}
                          className="sr-only"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Canton */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current canton
                    </label>
                    <select
                      value={inputs.canton}
                      onChange={(e) => updateInput('canton', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select canton...</option>
                      {SWISS_CANTONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Permit */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current permit type
                    </label>
                    <select
                      value={inputs.currentPermit}
                      onChange={(e) =>
                        updateInput('currentPermit', e.target.value as PermitCode)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      {(Object.entries(PERMIT_LABELS) as [PermitCode, string][]).map(
                        ([code, label]) => (
                          <option key={code} value={code}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                    {PERMIT_WEIGHT[inputs.currentPermit] < 1 && (
                      <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                        {inputs.currentPermit === 'L' || inputs.currentPermit === 'G'
                          ? 'This permit does not count toward the 10-year residency requirement.'
                          : `This permit counts at ${PERMIT_WEIGHT[inputs.currentPermit] * 100}% toward residency.`}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFormStep(1)}
                  disabled={!inputs.arrivalDate || !inputs.dateOfBirth}
                  className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ---- Step 2: Permit History ---- */}
            {formStep === 1 && (
              <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Permit History
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  If you have held different permits, adding your history improves accuracy.
                  Otherwise, skip to results.
                </p>

                <label className="flex cursor-pointer items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showPermitHistory}
                    onClick={() => {
                      setShowPermitHistory((v) => !v)
                      if (showPermitHistory) {
                        updateInput('permitHistory', [])
                      }
                    }}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      showPermitHistory ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                        showPermitHistory ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    I have held different permits
                  </span>
                </label>

                {showPermitHistory && (
                  <div className="space-y-3">
                    {inputs.permitHistory.map((period, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-end gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50"
                      >
                        <div className="min-w-[120px] flex-1">
                          <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                            Permit
                          </label>
                          <select
                            value={period.permitType}
                            onChange={(e) =>
                              updatePermitPeriod(idx, 'permitType', e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          >
                            {(
                              Object.entries(PERMIT_LABELS) as [PermitCode, string][]
                            ).map(([code, label]) => (
                              <option key={code} value={code}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="min-w-[130px]">
                          <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                            Start date
                          </label>
                          <input
                            type="date"
                            max={todayISO}
                            value={period.startDate}
                            onChange={(e) =>
                              updatePermitPeriod(idx, 'startDate', e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div className="min-w-[130px]">
                          <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                            End date
                          </label>
                          <input
                            type="date"
                            max={todayISO}
                            value={period.endDate ?? ''}
                            onChange={(e) =>
                              updatePermitPeriod(
                                idx,
                                'endDate',
                                e.target.value || null
                              )
                            }
                            placeholder="Ongoing"
                            className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePermitPeriod(idx)}
                          className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                          aria-label="Remove period"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addPermitPeriod}
                      className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:border-sky-400 hover:text-sky-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-sky-500 dark:hover:text-sky-400"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add permit period
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormStep(0)}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    className="flex-1 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                  >
                    See My Timeline
                  </button>
                </div>
              </div>
            )}

            {/* ---- Step 3: Results + Timeline ---- */}
            {formStep === 2 && (
              <>
                {/* Results card */}
                {result ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                      {/* Progress ring */}
                      <ProgressRing percent={result.progressPercent} />

                      {/* Stats */}
                      <div className="flex-1 space-y-3 text-center sm:text-left">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Earliest application date
                          </p>
                          <p className={cn('text-2xl font-bold', dateColor)}>
                            {result.canApplyNow
                              ? 'You can apply now!'
                              : formatDate(result.earliestApplicationDate)}
                          </p>
                          {!result.canApplyNow && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {pluralize(result.yearsRemaining, 'year')},{' '}
                              {pluralize(result.monthsRemaining, 'month')} remaining
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {result.qualifyingYears}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              Qualifying yrs
                            </p>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {result.totalActualYears}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              Actual yrs
                            </p>
                          </div>
                          {result.childhoodBonus > 0 && (
                            <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
                              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                +{result.childhoodBonus}
                              </p>
                              <p className="text-[11px] text-amber-600 dark:text-amber-400">
                                Childhood bonus
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Integration checklist */}
                    <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Integration Requirements
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {INTEGRATION_ITEMS.map((item) => {
                          const status =
                            (milestoneStatuses[`int-${item.key}`] as
                              | 'pending'
                              | 'in-progress'
                              | 'done'
                              | undefined) || 'pending'
                          return (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => toggleMilestoneItem(`int-${item.key}`)}
                              className={cn(
                                'flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                                status === 'done'
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                                  : status === 'in-progress'
                                    ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50'
                              )}
                            >
                              <span
                                className={cn(
                                  'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full',
                                  status === 'done' && 'bg-emerald-500 text-white',
                                  status === 'in-progress' && 'bg-amber-500 text-white',
                                  status === 'pending' && 'border-2 border-gray-300 dark:border-gray-600'
                                )}
                              >
                                {status === 'done' && (
                                  <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                {status === 'in-progress' && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                )}
                              </span>
                              {item.label}
                            </button>
                          )
                        })}
                      </div>
                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        Click to toggle: pending &rarr; in progress &rarr; done
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormStep(0)}
                      className="mt-4 text-sm text-sky-600 hover:underline dark:text-sky-400"
                    >
                      Edit my information
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800/80">
                    <p className="text-gray-500 dark:text-gray-400">
                      Please fill in your arrival date and date of birth to see your
                      timeline.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormStep(0)}
                      className="mt-3 text-sm text-sky-600 hover:underline dark:text-sky-400"
                    >
                      Go to Step 1
                    </button>
                  </div>
                )}

                {/* Vertical timeline */}
                {result && (
                  <div className="space-y-0">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                      Year-by-Year Roadmap
                    </h2>
                    <div className="relative space-y-4">
                      {/* Vertical line */}
                      <div className="absolute bottom-0 left-[9px] top-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                      {MILESTONES.map((ms) => {
                        const msStatus: 'past' | 'current' | 'future' =
                          ms.year < result.currentMilestoneYear
                            ? 'past'
                            : ms.year === result.currentMilestoneYear
                              ? 'current'
                              : 'future'

                        return (
                          <MilestoneCard
                            key={ms.year}
                            milestone={ms}
                            status={msStatus}
                            isExpanded={expandedMilestones.has(ms.year)}
                            onToggle={() => toggleExpandedMilestone(ms.year)}
                            onAskAI={askAIFromTimeline}
                            milestoneStatuses={milestoneStatuses}
                            onToggleItem={toggleMilestoneItem}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ================================================================
              RIGHT COLUMN: AI Teacher
              ================================================================ */}
          <div
            className={cn(
              'lg:sticky lg:top-4 lg:w-[40%] lg:self-start',
              activeTab !== 'ai' && 'hidden lg:block'
            )}
          >
            <div className="flex h-[calc(100vh-12rem)] flex-col rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/80 lg:h-[calc(100vh-10rem)]">
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    AI Citizenship Guide
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Personalized expert advice
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                        msg.role === 'user'
                          ? 'rounded-br-md bg-gradient-to-r from-sky-500 to-indigo-500 text-white'
                          : 'rounded-bl-md border border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-200'
                      )}
                    >
                      {msg.content.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < msg.content.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {isAILoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick action chips */}
              <div className="flex flex-wrap gap-1.5 border-t border-gray-100 px-4 py-2 dark:border-gray-700/50">
                {quickActions.slice(0, 4).map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => sendMessage(action)}
                    disabled={isAILoading}
                    className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-600 transition-colors hover:border-sky-400 hover:text-sky-600 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-sky-500 dark:hover:text-sky-400"
                  >
                    {action}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={handleChatSubmit}
                className="flex items-end gap-2 border-t border-gray-200 px-4 py-3 dark:border-gray-700"
              >
                <textarea
                  ref={textareaRef}
                  value={chatInput}
                  onChange={(e) => {
                    setChatInput(e.target.value)
                    resizeTextarea()
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your citizenship journey..."
                  rows={1}
                  className="max-h-24 flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isAILoading}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
