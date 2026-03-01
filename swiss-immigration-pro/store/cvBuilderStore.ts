import { create } from 'zustand'
import type {
  CVData,
  CVSection,
  WorkExperience,
  Education,
  Skill,
  Language,
  Certification,
  Reference,
  Project,
  CustomSection,
  ATSResult,
  SavedCV,
  PersonalInfo,
} from '@/types/cv-builder'
import { createEmptyCVData, cvDataToAPI } from '@/types/cv-builder'
import { getAuthHeaderSync } from '@/lib/auth-client'

interface CVBuilderState {
  cvData: CVData
  activeTemplate: string
  activeSection: CVSection
  atsResult: ATSResult | null
  isSaving: boolean
  isExporting: boolean
  isGenerating: boolean
  isDirty: boolean
  currentCVId: string | null
  savedCVs: SavedCV[]

  // Personal info
  updatePersonalInfo: (fields: Partial<PersonalInfo>) => void

  // Summary
  updateSummary: (summary: string) => void

  // Work experience
  addWorkExperience: (item: WorkExperience) => void
  updateWorkExperience: (id: string, fields: Partial<WorkExperience>) => void
  removeWorkExperience: (id: string) => void

  // Education
  addEducation: (item: Education) => void
  updateEducation: (id: string, fields: Partial<Education>) => void
  removeEducation: (id: string) => void

  // Skills
  addSkill: (item: Skill) => void
  updateSkill: (id: string, fields: Partial<Skill>) => void
  removeSkill: (id: string) => void

  // Languages
  addLanguage: (item: Language) => void
  updateLanguage: (id: string, fields: Partial<Language>) => void
  removeLanguage: (id: string) => void

  // Certifications
  addCertification: (item: Certification) => void
  updateCertification: (id: string, fields: Partial<Certification>) => void
  removeCertification: (id: string) => void

  // References
  addReference: (item: Reference) => void
  updateReference: (id: string, fields: Partial<Reference>) => void
  removeReference: (id: string) => void

  // Projects
  addProject: (item: Project) => void
  updateProject: (id: string, fields: Partial<Project>) => void
  removeProject: (id: string) => void

  // Custom sections
  addCustomSection: (item: CustomSection) => void
  updateCustomSection: (id: string, fields: Partial<CustomSection>) => void
  removeCustomSection: (id: string) => void

  // Template & section
  setActiveTemplate: (id: string) => void
  setActiveSection: (section: CVSection) => void

  // Persistence
  saveCVToBackend: (name?: string) => Promise<void>
  loadCVFromBackend: (cvId: string) => Promise<void>
  loadSavedCVs: () => Promise<void>
  deleteSavedCV: (cvId: string) => Promise<void>
  exportPDF: () => Promise<Blob | null>

  // ATS
  runATSAnalysis: (jobDescription?: string) => Promise<void>

  // Reset
  resetCV: () => void
  loadCVData: (data: CVData, templateId?: string) => void
  setATSResult: (result: ATSResult | null) => void
}

function _updateList<T extends { id: string }>(list: T[], id: string, fields: Partial<T>): T[] {
  return list.map((item) => (item.id === id ? { ...item, ...fields } : item))
}

export const useCVBuilderStore = create<CVBuilderState>((set, get) => ({
  cvData: createEmptyCVData(),
  activeTemplate: 'swiss-classic',
  activeSection: 'personal',
  atsResult: null,
  isSaving: false,
  isExporting: false,
  isGenerating: false,
  isDirty: false,
  currentCVId: null,
  savedCVs: [],

  updatePersonalInfo: (fields) =>
    set((s) => ({
      cvData: { ...s.cvData, personalInfo: { ...s.cvData.personalInfo, ...fields } },
      isDirty: true,
    })),

  updateSummary: (summary) =>
    set((s) => ({ cvData: { ...s.cvData, summary }, isDirty: true })),

  addWorkExperience: (item) =>
    set((s) => ({
      cvData: { ...s.cvData, workExperience: [...s.cvData.workExperience, item] },
      isDirty: true,
    })),
  updateWorkExperience: (id, fields) =>
    set((s) => ({
      cvData: { ...s.cvData, workExperience: _updateList(s.cvData.workExperience, id, fields) },
      isDirty: true,
    })),
  removeWorkExperience: (id) =>
    set((s) => ({
      cvData: { ...s.cvData, workExperience: s.cvData.workExperience.filter((i) => i.id !== id) },
      isDirty: true,
    })),

  addEducation: (item) =>
    set((s) => ({
      cvData: { ...s.cvData, education: [...s.cvData.education, item] },
      isDirty: true,
    })),
  updateEducation: (id, fields) =>
    set((s) => ({
      cvData: { ...s.cvData, education: _updateList(s.cvData.education, id, fields) },
      isDirty: true,
    })),
  removeEducation: (id) =>
    set((s) => ({
      cvData: { ...s.cvData, education: s.cvData.education.filter((i) => i.id !== id) },
      isDirty: true,
    })),

  addSkill: (item) =>
    set((s) => ({
      cvData: { ...s.cvData, skills: [...s.cvData.skills, item] },
      isDirty: true,
    })),
  updateSkill: (id, fields) =>
    set((s) => ({
      cvData: { ...s.cvData, skills: _updateList(s.cvData.skills, id, fields) },
      isDirty: true,
    })),
  removeSkill: (id) =>
    set((s) => ({
      cvData: { ...s.cvData, skills: s.cvData.skills.filter((i) => i.id !== id) },
      isDirty: true,
    })),

  addLanguage: (item) =>
    set((s) => ({
      cvData: { ...s.cvData, languages: [...s.cvData.languages, item] },
      isDirty: true,
    })),
  updateLanguage: (id, fields) =>
    set((s) => ({
      cvData: { ...s.cvData, languages: _updateList(s.cvData.languages, id, fields) },
      isDirty: true,
    })),
  removeLanguage: (id) =>
    set((s) => ({
      cvData: { ...s.cvData, languages: s.cvData.languages.filter((i) => i.id !== id) },
      isDirty: true,
    })),

  addCertification: (item) =>
    set((s) => ({
      cvData: { ...s.cvData, certifications: [...s.cvData.certifications, item] },
      isDirty: true,
    })),
  updateCertification: (id, fields) =>
    set((s) => ({
      cvData: { ...s.cvData, certifications: _updateList(s.cvData.certifications, id, fields) },
      isDirty: true,
    })),
  removeCertification: (id) =>
    set((s) => ({
      cvData: { ...s.cvData, certifications: s.cvData.certifications.filter((i) => i.id !== id) },
      isDirty: true,
    })),

  addReference: (item) =>
    set((s) => ({
      cvData: { ...s.cvData, references: [...s.cvData.references, item] },
      isDirty: true,
    })),
  updateReference: (id, fields) =>
    set((s) => ({
      cvData: { ...s.cvData, references: _updateList(s.cvData.references, id, fields) },
      isDirty: true,
    })),
  removeReference: (id) =>
    set((s) => ({
      cvData: { ...s.cvData, references: s.cvData.references.filter((i) => i.id !== id) },
      isDirty: true,
    })),

  addProject: (item) =>
    set((s) => ({
      cvData: { ...s.cvData, projects: [...s.cvData.projects, item] },
      isDirty: true,
    })),
  updateProject: (id, fields) =>
    set((s) => ({
      cvData: { ...s.cvData, projects: _updateList(s.cvData.projects, id, fields) },
      isDirty: true,
    })),
  removeProject: (id) =>
    set((s) => ({
      cvData: { ...s.cvData, projects: s.cvData.projects.filter((i) => i.id !== id) },
      isDirty: true,
    })),

  addCustomSection: (item) =>
    set((s) => ({
      cvData: { ...s.cvData, customSections: [...s.cvData.customSections, item] },
      isDirty: true,
    })),
  updateCustomSection: (id, fields) =>
    set((s) => ({
      cvData: { ...s.cvData, customSections: _updateList(s.cvData.customSections, id, fields) },
      isDirty: true,
    })),
  removeCustomSection: (id) =>
    set((s) => ({
      cvData: { ...s.cvData, customSections: s.cvData.customSections.filter((i) => i.id !== id) },
      isDirty: true,
    })),

  setActiveTemplate: (id) => set({ activeTemplate: id, isDirty: true }),
  setActiveSection: (section) => set({ activeSection: section }),

  saveCVToBackend: async (name) => {
    const { cvData, activeTemplate, currentCVId } = get()
    set({ isSaving: true })
    try {
      const res = await fetch('/api/cv/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaderSync() },
        body: JSON.stringify({
          cv_data: cvDataToAPI(cvData),
          template_id: activeTemplate,
          name: name || `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName} CV`.trim() || 'Untitled CV',
          cv_id: currentCVId,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        set({ isDirty: false, currentCVId: data.cv?.id || currentCVId })
      }
    } finally {
      set({ isSaving: false })
    }
  },

  loadCVFromBackend: async (cvId) => {
    try {
      const res = await fetch(`/api/cv/${cvId}`, {
        headers: getAuthHeaderSync(),
      })
      if (res.ok) {
        const { cv } = await res.json()
        if (cv?.cv_data) {
          const { apiToCVData } = await import('@/types/cv-builder')
          set({
            cvData: apiToCVData(cv.cv_data),
            activeTemplate: cv.template_id || 'swiss-classic',
            currentCVId: cvId,
            isDirty: false,
          })
        }
      }
    } catch { /* network error */ }
  },

  loadSavedCVs: async () => {
    try {
      const res = await fetch('/api/cv/list', { headers: getAuthHeaderSync() })
      if (res.ok) {
        const { cvs } = await res.json()
        set({
          savedCVs: (cvs || []).map((c: Record<string, string>) => ({
            id: c.id,
            name: c.name,
            templateId: c.template_id,
            updatedAt: c.updated_at,
            createdAt: c.created_at,
          })),
        })
      }
    } catch { /* network error */ }
  },

  deleteSavedCV: async (cvId) => {
    try {
      await fetch(`/api/cv/${cvId}`, {
        method: 'DELETE',
        headers: getAuthHeaderSync(),
      })
      set((s) => ({ savedCVs: s.savedCVs.filter((c) => c.id !== cvId) }))
    } catch { /* network error */ }
  },

  exportPDF: async () => {
    const { cvData, activeTemplate } = get()
    set({ isExporting: true })
    try {
      const res = await fetch('/api/cv/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv_data: cvDataToAPI(cvData),
          template_id: activeTemplate,
        }),
      })
      if (res.ok) return await res.blob()
      return null
    } finally {
      set({ isExporting: false })
    }
  },

  runATSAnalysis: async (jobDescription) => {
    const { cvData } = get()
    try {
      const res = await fetch('/api/cv/ai/ats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv_data: cvDataToAPI(cvData),
          job_description: jobDescription || null,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const { apiToCVData } = await import('@/types/cv-builder')
        set({
          atsResult: {
            score: data.score,
            issues: (data.issues || []).map((i: Record<string, string>) => ({
              severity: i.severity,
              field: i.field,
              message: i.message,
              suggestion: i.suggestion,
            })),
            keywordsFound: data.keywords_found || [],
            keywordsMissing: data.keywords_missing || [],
            suggestions: data.suggestions || [],
          },
        })
      }
    } catch { /* network error */ }
  },

  resetCV: () =>
    set({
      cvData: createEmptyCVData(),
      activeTemplate: 'swiss-classic',
      activeSection: 'personal',
      atsResult: null,
      isDirty: false,
      currentCVId: null,
    }),

  loadCVData: (data, templateId) =>
    set({
      cvData: data,
      activeTemplate: templateId || get().activeTemplate,
      isDirty: true,
    }),

  setATSResult: (result) => set({ atsResult: result }),
}))
