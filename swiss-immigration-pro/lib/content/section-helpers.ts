/** Pure helpers for extracting & organising TOC sections from markdown. */

export interface TocSection {
  id: string
  title: string
  level: number
}

export interface TocCategory {
  title: string
  sections: TocSection[]
}

/** Pull heading ids/titles/levels out of a markdown string. */
export function extractSections(content: string): TocSection[] {
  const sections: TocSection[] = []

  for (const line of content.split('\n')) {
    if (line.startsWith('#')) {
      const level = (line.match(/^#+/)?.[0] ?? '').length
      const title = line.replace(/^#+\s*/, '').trim()
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      sections.push({ id, title, level })
    }
  }

  return sections
}

/** Group flat sections into categories keyed by H1 headings. */
export function organizeSectionsIntoCategories(sections: TocSection[]): TocCategory[] {
  const categories: TocCategory[] = []
  let current: TocCategory | null = null

  for (const section of sections) {
    if (section.level === 1) {
      if (current) categories.push(current)
      current = { title: section.title, sections: [] }
    } else {
      if (!current) current = { title: 'Introduction', sections: [] }
      current.sections.push(section)
    }
  }

  if (current) categories.push(current)
  if (categories.length === 0) categories.push({ title: 'Module Content', sections })

  return categories
}
