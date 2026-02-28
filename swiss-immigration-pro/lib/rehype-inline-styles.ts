/**
 * Rehype plugin that transforms hardcoded inline-style color values into
 * CSS custom properties so they automatically respond to dark mode via the
 * `.dark` class on <html>.
 *
 * The corresponding CSS variables are defined in app/globals.css under
 * `:root` and `.dark`.
 */

import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'
import type { Plugin } from 'unified'

// ---------------------------------------------------------------------------
// Color replacement maps
// ---------------------------------------------------------------------------

/** Maps hardcoded hex/named colors to CSS custom property references.
 *  Keys are lowercase for case-insensitive matching. */
const COLOR_MAP: ReadonlyMap<string, string> = new Map([
  // Backgrounds
  ['#ffffff', 'var(--mod-bg)'],
  ['white', 'var(--mod-bg)'],
  ['#f9fafb', 'var(--mod-bg-subtle)'],
  ['#f3f4f6', 'var(--mod-bg-subtle)'],
  ['#eff6ff', 'var(--mod-bg-blue)'],
  ['#e0f2fe', 'var(--mod-bg-blue-light)'],
  ['#1f2937', 'var(--mod-bg-dark)'],

  // Text
  ['#000000', 'var(--mod-text)'],
  ['black', 'var(--mod-text)'],
  ['#374151', 'var(--mod-text)'],
  ['#1e40af', 'var(--mod-text-blue-dark)'],
  ['#3b82f6', 'var(--mod-text-blue)'],
  ['#d1d5db', 'var(--mod-text-muted)'],
  ['#9ca3af', 'var(--mod-text-muted-2)'],

  // Borders
  ['#e5e7eb', 'var(--mod-border)'],
  ['#bfdbfe', 'var(--mod-border-light-blue)'],

  // Additional accent colors used in modules
  ['#2563eb', 'var(--mod-accent-blue)'],
  ['#fb923c', 'var(--mod-accent-orange)'],
  ['#10b981', 'var(--mod-accent-green)'],
  ['#059669', 'var(--mod-accent-green-dark)'],
  ['#bbf7d0', 'var(--mod-border-green)'],
  ['#111827', 'var(--mod-bg-darker)'],
])

// ---------------------------------------------------------------------------
// Gradient replacement patterns
// ---------------------------------------------------------------------------

interface GradientReplacement {
  pattern: RegExp
  replacement: string
}

const GRADIENT_REPLACEMENTS: readonly GradientReplacement[] = [
  // linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)
  {
    pattern:
      /linear-gradient\(\s*135deg\s*,\s*#ffffff\s+0%\s*,\s*#eff6ff\s+100%\s*\)/gi,
    replacement:
      'linear-gradient(135deg, var(--mod-bg) 0%, var(--mod-bg-blue) 100%)',
  },
  // linear-gradient(135deg, #1e40af, #3b82f6)  (table header rows)
  {
    pattern:
      /linear-gradient\(\s*135deg\s*,\s*#1e40af\s*,\s*#3b82f6\s*\)/gi,
    replacement:
      'linear-gradient(135deg, var(--mod-text-blue-dark), var(--mod-text-blue))',
  },
  // linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)
  {
    pattern:
      /linear-gradient\(\s*135deg\s*,\s*#3b82f6\s+0%\s*,\s*#2563eb\s+100%\s*\)/gi,
    replacement:
      'linear-gradient(135deg, var(--mod-text-blue) 0%, var(--mod-accent-blue) 100%)',
  },
  // linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)  (progress bars)
  {
    pattern:
      /linear-gradient\(\s*90deg\s*,\s*#3b82f6\s+0%\s*,\s*#2563eb\s+100%\s*\)/gi,
    replacement:
      'linear-gradient(90deg, var(--mod-text-blue) 0%, var(--mod-accent-blue) 100%)',
  },
  // linear-gradient(135deg, #10b981 0%, #059669 100%)
  {
    pattern:
      /linear-gradient\(\s*135deg\s*,\s*#10b981\s+0%\s*,\s*#059669\s+100%\s*\)/gi,
    replacement:
      'linear-gradient(135deg, var(--mod-accent-green) 0%, var(--mod-accent-green-dark) 100%)',
  },
]

// ---------------------------------------------------------------------------
// Style property-value replacement
// ---------------------------------------------------------------------------

/**
 * The properties whose color values we want to transform.
 * We match the property name so we only replace colors where they are used
 * as color/bg/border values.
 */
const COLOR_PROPERTIES = new Set([
  'color',
  'background',
  'background-color',
  'border',
  'border-color',
  'border-top',
  'border-bottom',
  'border-left',
  'border-right',
  'border-top-color',
  'border-bottom-color',
  'border-left-color',
  'border-right-color',
])

/**
 * Replace hardcoded color values in a single CSS declaration value.
 * Handles both simple values (`color: #1e40af`) and compound values
 * (`border: 2px solid #3b82f6`).
 */
function replaceColorInValue(value: string): string {
  let result = value

  // First handle gradients (before individual colors, since gradients
  // contain colors that would otherwise be replaced individually)
  for (const { pattern, replacement } of GRADIENT_REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }

  // Then replace individual color tokens.
  // Use word-boundary-aware replacement to avoid partial matches.
  for (const [color, variable] of COLOR_MAP) {
    if (color.startsWith('#')) {
      // Case-insensitive hex replacement, avoid matching inside var()
      const escaped = color.replace('#', '\\#')
      const re = new RegExp(`(?<![-\\w])${escaped}(?![-\\w])`, 'gi')
      result = result.replace(re, variable)
    } else {
      // Named colors: whole-word match only
      const re = new RegExp(`\\b${color}\\b`, 'gi')
      result = result.replace(re, variable)
    }
  }

  return result
}

/**
 * Parse a style string into property-value pairs, transform color values,
 * and re-serialize.
 */
function transformStyleString(style: string): string {
  // Split on semicolons, preserving structure
  const declarations = style.split(';').filter((d) => d.trim().length > 0)
  const transformed: string[] = []

  for (const decl of declarations) {
    const colonIndex = decl.indexOf(':')
    if (colonIndex === -1) {
      transformed.push(decl)
      continue
    }

    const prop = decl.slice(0, colonIndex).trim().toLowerCase()
    const val = decl.slice(colonIndex + 1).trim()

    if (COLOR_PROPERTIES.has(prop)) {
      transformed.push(`${prop}: ${replaceColorInValue(val)}`)
    } else {
      // Keep non-color properties untouched
      transformed.push(`${prop}: ${val}`)
    }
  }

  return transformed.join('; ')
}

// ---------------------------------------------------------------------------
// The rehype plugin
// ---------------------------------------------------------------------------

/**
 * A rehype plugin that visits every element node and transforms inline
 * `style` attribute color values into CSS custom property references.
 */
const rehypeInlineStyles: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const props = node.properties
      if (!props || typeof props.style !== 'string') return

      const original = props.style
      const transformed = transformStyleString(original)

      if (transformed !== original) {
        props.style = transformed
      }
    })
  }
}

export default rehypeInlineStyles
