import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
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
import { api } from '@/lib/api'

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

export const useCVBuilderStore = create<CVBuilderState>()(
  immer((set, get) => ({
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
      set((s) => {
        Object.assign(s.cvData.personalInfo, fields)
        s.isDirty = true
      }),

    updateSummary: (summary) =>
      set((s) => {
        s.cvData.summary = summary
        s.isDirty = true
      }),

    addWorkExperience: (item) =>
      set((s) => {
        s.cvData.workExperience.push(item)
        s.isDirty = true
      }),
    updateWorkExperience: (id, fields) =>
      set((s) => {
        const idx = s.cvData.workExperience.findIndex((i: { id: string }) => i.id === id)
        if (idx !== -1) Object.assign(s.cvData.workExperience[idx], fields)
        s.isDirty = true
      }),
    removeWorkExperience: (id) =>
      set((s) => {
        s.cvData.workExperience = s.cvData.workExperience.filter((i: { id: string }) => i.id !== id)
        s.isDirty = true
      }),

    addEducation: (item) =>
      set((s) => {
        s.cvData.education.push(item)
        s.isDirty = true
      }),
    updateEducation: (id, fields) =>
      set((s) => {
        const idx = s.cvData.education.findIndex((i: { id: string }) => i.id === id)
        if (idx !== -1) Object.assign(s.cvData.education[idx], fields)
        s.isDirty = true
      }),
    removeEducation: (id) =>
      set((s) => {
        s.cvData.education = s.cvData.education.filter((i: { id: string }) => i.id !== id)
        s.isDirty = true
      }),

    addSkill: (item) =>
      set((s) => {
        s.cvData.skills.push(item)
        s.isDirty = true
      }),
    updateSkill: (id, fields) =>
      set((s) => {
        const idx = s.cvData.skills.findIndex((i: { id: string }) => i.id === id)
        if (idx !== -1) Object.assign(s.cvData.skills[idx], fields)
        s.isDirty = true
      }),
    removeSkill: (id) =>
      set((s) => {
        s.cvData.skills = s.cvData.skills.filter((i: { id: string }) => i.id !== id)
        s.isDirty = true
      }),

    addLanguage: (item) =>
      set((s) => {
        s.cvData.languages.push(item)
        s.isDirty = true
      }),
    updateLanguage: (id, fields) =>
      set((s) => {
        const idx = s.cvData.languages.findIndex((i: { id: string }) => i.id === id)
        if (idx !== -1) Object.assign(s.cvData.languages[idx], fields)
        s.isDirty = true
      }),
    removeLanguage: (id) =>
      set((s) => {
        s.cvData.languages = s.cvData.languages.filter((i: { id: string }) => i.id !== id)
        s.isDirty = true
      }),

    addCertification: (item) =>
      set((s) => {
        s.cvData.certifications.push(item)
        s.isDirty = true
      }),
    updateCertification: (id, fields) =>
      set((s) => {
        const idx = s.cvData.certifications.findIndex((i: { id: string }) => i.id === id)
        if (idx !== -1) Object.assign(s.cvData.certifications[idx], fields)
        s.isDirty = true
      }),
    removeCertification: (id) =>
      set((s) => {
        s.cvData.certifications = s.cvData.certifications.filter((i: { id: string }) => i.id !== id)
        s.isDirty = true
      }),

    addReference: (item) =>
      set((s) => {
        s.cvData.references.push(item)
        s.isDirty = true
      }),
    updateReference: (id, fields) =>
      set((s) => {
        const idx = s.cvData.references.findIndex((i: { id: string }) => i.id === id)
        if (idx !== -1) Object.assign(s.cvData.references[idx], fields)
        s.isDirty = true
      }),
    removeReference: (id) =>
      set((s) => {
        s.cvData.references = s.cvData.references.filter((i: { id: string }) => i.id !== id)
        s.isDirty = true
      }),

    addProject: (item) =>
      set((s) => {
        s.cvData.projects.push(item)
        s.isDirty = true
      }),
    updateProject: (id, fields) =>
      set((s) => {
        const idx = s.cvData.projects.findIndex((i: { id: string }) => i.id === id)
        if (idx !== -1) Object.assign(s.cvData.projects[idx], fields)
        s.isDirty = true
      }),
    removeProject: (id) =>
      set((s) => {
        s.cvData.projects = s.cvData.projects.filter((i: { id: string }) => i.id !== id)
        s.isDirty = true
      }),

    addCustomSection: (item) =>
      set((s) => {
        s.cvData.customSections.push(item)
        s.isDirty = true
      }),
    updateCustomSection: (id, fields) =>
      set((s) => {
        const idx = s.cvData.customSections.findIndex((i: { id: string }) => i.id === id)
        if (idx !== -1) Object.assign(s.cvData.customSections[idx], fields)
        s.isDirty = true
      }),
    removeCustomSection: (id) =>
      set((s) => {
        s.cvData.customSections = s.cvData.customSections.filter((i: { id: string }) => i.id !== id)
        s.isDirty = true
      }),

    setActiveTemplate: (id) =>
      set((s) => {
        s.activeTemplate = id
        s.isDirty = true
      }),
    setActiveSection: (section) =>
      set((s) => {
        s.activeSection = section
      }),

    saveCVToBackend: async (name) => {
      const { cvData, activeTemplate, currentCVId } = get()
      set((s) => { s.isSaving = true })
      try {
        const data = await api.post<{ cv?: { id?: string } }>('/api/cv/save', {
          cv_data: cvDataToAPI(cvData),
          template_id: activeTemplate,
          name: name || `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName} CV`.trim() || 'Untitled CV',
          cv_id: currentCVId,
        })
        set((s) => {
          s.isDirty = false
          s.currentCVId = data.cv?.id || currentCVId
        })
      } catch (err) {
        console.error('Failed to save CV:', err)
      } finally {
        set((s) => { s.isSaving = false })
      }
    },

    loadCVFromBackend: async (cvId) => {
      try {
        const data = await api.get<{ cv?: { cv_data?: unknown; template_id?: string } }>(`/api/cv/${cvId}`)
        const cvData = data.cv?.cv_data
        if (cvData && typeof cvData === 'object') {
          const { apiToCVData } = await import('@/types/cv-builder')
          set((s) => {
            s.cvData = apiToCVData(cvData as Record<string, unknown>)
            s.activeTemplate = data.cv?.template_id || 'swiss-classic'
            s.currentCVId = cvId
            s.isDirty = false
          })
        }
      } catch (err) {
        console.error('Failed to load CV:', err)
      }
    },

    loadSavedCVs: async () => {
      try {
        const data = await api.get<{ cvs?: Record<string, string>[] }>('/api/cv/list')
        set((s) => {
          s.savedCVs = (data.cvs || []).map((c) => ({
            id: c.id,
            name: c.name,
            templateId: c.template_id,
            updatedAt: c.updated_at,
            createdAt: c.created_at,
          }))
        })
      } catch (err) {
        console.error('Failed to load saved CVs:', err)
      }
    },

    deleteSavedCV: async (cvId) => {
      try {
        await api.delete(`/api/cv/${cvId}`)
        set((s) => {
          s.savedCVs = s.savedCVs.filter((c: { id: string }) => c.id !== cvId)
        })
      } catch (err) {
        console.error('Failed to delete CV:', err)
      }
    },

    exportPDF: async () => {
      const { cvData, activeTemplate } = get()
      set((s) => { s.isExporting = true })
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
        set((s) => { s.isExporting = false })
      }
    },

    runATSAnalysis: async (jobDescription) => {
      const { cvData } = get()
      try {
        const data = await api.post<{
          score: number
          issues?: Array<Record<string, string>>
          keywords_found?: string[]
          keywords_missing?: string[]
          suggestions?: string[]
        }>('/api/cv/ai/ats/analyze', {
          cv_data: cvDataToAPI(cvData),
          job_description: jobDescription || null,
        })
        set((s) => {
          s.atsResult = {
            score: data.score,
            issues: (data.issues || []).map((i) => ({
              // SAFETY: backend guarantees severity is one of these values
              severity: i.severity as 'critical' | 'warning' | 'info',
              field: i.field,
              message: i.message,
              suggestion: i.suggestion,
            })),
            keywordsFound: data.keywords_found || [],
            keywordsMissing: data.keywords_missing || [],
            suggestions: data.suggestions || [],
          }
        })
      } catch (err) {
        console.error('Failed to run ATS analysis:', err)
      }
    },

    resetCV: () =>
      set((s) => {
        s.cvData = createEmptyCVData()
        s.activeTemplate = 'swiss-classic'
        s.activeSection = 'personal'
        s.atsResult = null
        s.isDirty = false
        s.currentCVId = null
      }),

    loadCVData: (data, templateId) =>
      set((s) => {
        s.cvData = data
        s.activeTemplate = templateId || get().activeTemplate
        s.isDirty = true
      }),

    setATSResult: (result) =>
      set((s) => {
        s.atsResult = result
      }),
  }))
)
