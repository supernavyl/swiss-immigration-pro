export interface DashboardUser {
  id: string
  email: string
  name?: string
  packId: string
  isAdmin: boolean
}

export interface DashboardModule {
  id: string
  title: string
  description?: string
  completed?: boolean
  progress?: number
  icon?: string
  lessons?: unknown[]
  quiz?: { questions?: unknown[] }
  exercises?: unknown[]
  enhancedModule?: { sections?: unknown[] }
  duration?: string
}

export interface TabProps {
  user: DashboardUser
  modules: DashboardModule[]
  progress?: number
  isFree?: boolean
  previewModules?: Array<{ module: DashboardModule; packId: string }>
}
