export type SwissPermitType = 'Citizen' | 'Permit C' | 'Permit B' | 'Permit L' | 'Permit G' | 'Non-EU'
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Partnership'
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native'
export type SkillCategory = 'technical' | 'soft' | 'tools' | 'other'

export interface PersonalInfo {
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  country: string
  dateOfBirth: string
  nationality: string
  maritalStatus: MaritalStatus | ''
  permitType: SwissPermitType
  photoUrl: string | null
  linkedinUrl: string
  githubUrl: string
  websiteUrl: string
}

export interface WorkExperience {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  isCurrent: boolean
  achievements: string[]
  tags: string[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  isCurrent: boolean
  gpa: string
  honors: string[]
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  proficiency: number
}

export interface Language {
  id: string
  name: string
  level: CEFRLevel
  certificate: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiry: string
  url: string
}

export interface Reference {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  relationship: string
}

export interface Project {
  id: string
  name: string
  description: string
  url: string
  technologies: string[]
  startDate: string
  endDate: string
}

export interface CustomSection {
  id: string
  title: string
  items: string[]
}

export interface CVData {
  personalInfo: PersonalInfo
  summary: string
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
  references: Reference[]
  projects: Project[]
  customSections: CustomSection[]
}

export interface TemplateColors {
  primary: string
  secondary: string
  accent: string
  text: string
  muted: string
  background: string
}

export interface TemplateConfig {
  id: string
  name: string
  description: string
  category: string
  previewImage: string
  colors: TemplateColors
  layout: string
  fontFamily: string
  industries: string[]
  isPremium: boolean
}

export interface ATSIssue {
  severity: 'critical' | 'warning' | 'info'
  field: string
  message: string
  suggestion: string
}

export interface ATSResult {
  score: number
  issues: ATSIssue[]
  keywordsFound: string[]
  keywordsMissing: string[]
  suggestions: string[]
}

export interface SavedCV {
  id: string
  name: string
  templateId: string
  updatedAt: string
  createdAt: string
}

export type CVSection =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'references'
  | 'projects'
  | 'custom'

export function createEmptyCVData(): CVData {
  return {
    personalInfo: {
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: '',
      address: '',
      postalCode: '',
      city: '',
      country: 'Switzerland',
      dateOfBirth: '',
      nationality: '',
      maritalStatus: '',
      permitType: 'Permit B',
      photoUrl: null,
      linkedinUrl: '',
      githubUrl: '',
      websiteUrl: '',
    },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    references: [],
    projects: [],
    customSections: [],
  }
}

function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
    if (Array.isArray(value)) {
      result[snakeKey] = value.map((item) =>
        typeof item === 'object' && item !== null ? toSnakeCase(item as Record<string, unknown>) : item
      )
    } else if (typeof value === 'object' && value !== null) {
      result[snakeKey] = toSnakeCase(value as Record<string, unknown>)
    } else {
      result[snakeKey] = value
    }
  }
  return result
}

function toCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    if (Array.isArray(value)) {
      result[camelKey] = value.map((item) =>
        typeof item === 'object' && item !== null ? toCamelCase(item as Record<string, unknown>) : item
      )
    } else if (typeof value === 'object' && value !== null) {
      result[camelKey] = toCamelCase(value as Record<string, unknown>)
    } else {
      result[camelKey] = value
    }
  }
  return result
}

export function cvDataToAPI(data: CVData): Record<string, unknown> {
  return toSnakeCase(data as unknown as Record<string, unknown>)
}

export function apiToCVData(data: Record<string, unknown>): CVData {
  return toCamelCase(data) as unknown as CVData
}
