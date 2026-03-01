/**
 * Lazy-loads enhanced module content via dynamic import.
 *
 * This keeps the 710KB of educational content OUT of the client bundle.
 * Each module is code-split into its own chunk (~20-30KB each) and
 * loaded on demand — either by the API route (server-side) or by
 * the module page (client-side, one module at a time).
 */
import type { EnhancedModule } from './enhanced-modules/non-free-enhanced-modules'

type Loader = () => Promise<EnhancedModule>

const LOADERS: Record<string, Loader> = {
  // Free pack
  'free-01': () => import('./enhanced-modules/free-modules').then(m => m.freeModule01Enhanced as EnhancedModule),
  'free-02': () => import('./enhanced-modules/free-modules').then(m => m.freeModule02Enhanced as EnhancedModule),
  'free-03': () => import('./enhanced-modules/free-modules').then(m => m.freeModule03Enhanced as EnhancedModule),

  // Immigration pack
  'imm-01': () => import('./enhanced-modules/imm-01-enhanced').then(m => m.imm01Enhanced),
  'imm-02': () => import('./enhanced-modules/imm-02-enhanced').then(m => m.imm02Enhanced),
  'imm-03': () => import('./enhanced-modules/imm-03-enhanced').then(m => m.imm03Enhanced),
  'imm-04': () => import('./enhanced-modules/imm-04-enhanced').then(m => m.imm04Enhanced),
  'imm-05': () => import('./enhanced-modules/imm-05-enhanced').then(m => m.imm05Enhanced),
  'imm-06': () => import('./enhanced-modules/imm-06-enhanced').then(m => m.imm06Enhanced),
  'imm-07': () => import('./enhanced-modules/imm-07-enhanced').then(m => m.imm07Enhanced),
  'imm-08': () => import('./enhanced-modules/imm-08-enhanced').then(m => m.imm08Enhanced),

  // Advanced pack
  'adv-01': () => import('./enhanced-modules/adv-01-enhanced').then(m => m.adv01Enhanced),
  'adv-02': () => import('./enhanced-modules/adv-02-enhanced').then(m => m.adv02Enhanced),
  'adv-03': () => import('./enhanced-modules/adv-03-enhanced').then(m => m.adv03Enhanced),
  'adv-04': () => import('./enhanced-modules/adv-04-enhanced').then(m => m.adv04Enhanced),
  'adv-05': () => import('./enhanced-modules/adv-05-enhanced').then(m => m.adv05Enhanced),
  'adv-06': () => import('./enhanced-modules/adv-06-enhanced').then(m => m.adv06Enhanced),
  'adv-07': () => import('./enhanced-modules/adv-07-enhanced').then(m => m.adv07Enhanced),
  'adv-08': () => import('./enhanced-modules/adv-08-enhanced').then(m => m.adv08Enhanced),
  'adv-09': () => import('./enhanced-modules/adv-09-enhanced').then(m => m.adv09Enhanced),
  'adv-10': () => import('./enhanced-modules/adv-10-enhanced').then(m => m.adv10Enhanced),

  // Citizenship pack
  'cit-01': () => import('./enhanced-modules/cit-01-enhanced').then(m => m.cit01Enhanced),
  'cit-02': () => import('./enhanced-modules/cit-02-enhanced').then(m => m.cit02Enhanced),
  'cit-03': () => import('./enhanced-modules/cit-03-enhanced').then(m => m.cit03Enhanced),
  'cit-04': () => import('./enhanced-modules/cit-04-enhanced').then(m => m.cit04Enhanced),
  'cit-05': () => import('./enhanced-modules/cit-05-enhanced').then(m => m.cit05Enhanced),
  'cit-06': () => import('./enhanced-modules/cit-06-enhanced').then(m => m.cit06Enhanced),
  'cit-07': () => import('./enhanced-modules/cit-07-enhanced').then(m => m.cit07Enhanced),
  'cit-08': () => import('./enhanced-modules/cit-08-enhanced').then(m => m.cit08Enhanced),
  'cit-09': () => import('./enhanced-modules/cit-09-enhanced').then(m => m.cit09Enhanced),
  'cit-10': () => import('./enhanced-modules/cit-10-enhanced').then(m => m.cit10Enhanced),

  // Work permits (used by immigration pack as bonus content)
  'work-permits': () => import('./enhanced-modules/work-permits-enhanced').then(m => ({
    ...m.workPermitsEnhancedModule,
    estimatedReadTime: '90-120 minutes',
    lastUpdated: 'January 2025',
  }) satisfies EnhancedModule),
}

/**
 * Load enhanced module content by module ID.
 * Returns null if the module has no enhanced content.
 */
export async function loadEnhancedModule(moduleId: string): Promise<EnhancedModule | null> {
  const loader = LOADERS[moduleId]
  if (!loader) return null
  return loader()
}

/** Check if a module has enhanced content (without loading it). */
export function hasEnhancedContent(moduleId: string): boolean {
  return moduleId in LOADERS
}
