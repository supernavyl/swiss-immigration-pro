/**
 * Module Index by Pack
 * 
 * This utility file provides easy access to all modules organized by pack.
 * It serves as a centralized index for module references across the application.
 */

import { PACK_CONTENT, type Module, type PackContent } from './pack-content'

/**
 * Get all module IDs for a specific pack
 */
export function getModuleIdsForPack(packId: string): string[] {
  const pack = PACK_CONTENT[packId]
  if (!pack) return []
  return pack.modules.map(module => module.id)
}

/**
 * Get all modules for a specific pack
 */
export function getModulesForPack(packId: string): Module[] {
  const pack = PACK_CONTENT[packId]
  if (!pack) return []
  return pack.modules
}

/**
 * Get module by ID across all packs
 */
export function getModuleById(moduleId: string): Module | undefined {
  for (const pack of Object.values(PACK_CONTENT)) {
    const module = pack.modules.find(m => m.id === moduleId)
    if (module) return module
  }
  return undefined
}

/**
 * Get pack information for a module
 */
export function getPackForModule(moduleId: string): PackContent | undefined {
  for (const pack of Object.values(PACK_CONTENT)) {
    if (pack.modules.some(m => m.id === moduleId)) {
      return pack
    }
  }
  return undefined
}

/**
 * Module listings by pack
 */
export const MODULES_BY_PACK = {
  free: {
    packId: 'free',
    packName: 'Free Starter Pack',
    moduleIds: ['free-01', 'free-02', 'free-03'],
    moduleCount: 3
  },
  immigration: {
    packId: 'immigration',
    packName: 'Immigration Pack',
    moduleIds: ['imm-01', 'imm-02', 'imm-03', 'imm-04', 'imm-05', 'imm-06', 'imm-07', 'imm-08'],
    moduleCount: 8
  },
  advanced: {
    packId: 'advanced',
    packName: 'Advanced Pack',
    moduleIds: [
      'adv-01', 'adv-02', 'adv-03', 'adv-04', 'adv-05',
      'adv-06', 'adv-07', 'adv-08', 'adv-09', 'adv-10'
    ],
    moduleCount: 10
  },
  citizenship: {
    packId: 'citizenship',
    packName: 'Citizenship Pro Pack',
    moduleIds: [
      'cit-01', 'cit-02', 'cit-03', 'cit-04', 'cit-05',
      'cit-06', 'cit-07', 'cit-08', 'cit-09', 'cit-10'
    ],
    moduleCount: 10
  }
} as const

/**
 * Get all pack IDs
 */
export function getAllPackIds(): string[] {
  return Object.keys(PACK_CONTENT)
}

/**
 * Get total module count across all packs
 */
export function getTotalModuleCount(): number {
  return Object.values(PACK_CONTENT).reduce(
    (total, pack) => total + pack.modules.length,
    0
  )
}

/**
 * Validate that all expected modules exist
 */
export function validateModules(): {
  valid: boolean
  missing: string[]
  extra: string[]
} {
  const expected: string[] = []
  const actual: string[] = []
  
  // Collect expected module IDs
  for (const packInfo of Object.values(MODULES_BY_PACK)) {
    expected.push(...packInfo.moduleIds)
  }
  
  // Collect actual module IDs from PACK_CONTENT
  for (const pack of Object.values(PACK_CONTENT)) {
    pack.modules.forEach(module => actual.push(module.id))
  }
  
  const missing = expected.filter(id => !actual.includes(id))
  const extra = actual.filter(id => !expected.includes(id))
  
  return {
    valid: missing.length === 0 && extra.length === 0,
    missing,
    extra
  }
}

/**
 * Get module statistics
 */
export function getModuleStatistics() {
  const stats = {
    totalModules: getTotalModuleCount(),
    packs: Object.values(PACK_CONTENT).map(pack => ({
      packId: pack.packId,
      packName: pack.packName,
      moduleCount: pack.modules.length,
      modules: pack.modules.map(m => ({
        id: m.id,
        title: m.title,
        type: m.type,
        order: m.order,
        hasEnhancedModule: !!m.enhancedModule
      }))
    }))
  }
  
  return stats
}

