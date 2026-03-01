export type PackId = 'free' | 'immigration' | 'advanced' | 'citizenship'

export interface PricingPack {
  id: PackId
  name: string
  price: number
  priceId: string | null
  features: readonly string[]
  // SEO enhancements
  description?: string
  shortDescription?: string
  keywords?: string[]
  valueProposition?: string
  badge?: string
  recommendedFor?: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  pack_id: PackId
  pack_expires_at?: string
  is_admin: boolean
  metadata?: Record<string, any>
}

export interface LiveStat {
  id: string
  stat_key: string
  stat_label: string
  stat_value: string
  stat_source?: string
  display_order: number
  is_active: boolean
}

export interface ChatMessage {
  id: string
  user_id: string
  message: string
  response?: string
  pack_id?: PackId
  tokens_used: number
  created_at: string
}

export interface MasterclassProgress {
  id: string
  user_id: string
  module_id: string
  progress_percent: number
  completed_at?: string
}

export interface QuizResult {
  id: string
  quiz_type: string
  score: number
  total_questions: number
  answers: Record<string, any>
}

export interface CantonalData {
  id: string
  canton_code: string
  canton_name: string
  language: string
  immigration_info: Record<string, any>
  citizenship_info: Record<string, any>
}

export interface CVTemplate {
  id: string
  name: string
  category: string
  description?: string
  template_data: Record<string, any>
}

export interface Subscription {
  id: string
  user_id: string
  pack_id: PackId
  status: string
  current_period_start?: string
  current_period_end?: string
}

