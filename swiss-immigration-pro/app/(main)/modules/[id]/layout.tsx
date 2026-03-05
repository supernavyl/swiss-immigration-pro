import type { Metadata } from 'next'
import { getAllModulesForAdmin, getModulePack } from '@/lib/content/pack-content'
import { generateMetadata as seoMeta } from '@/lib/seo/meta-helpers'

const PACK_LABELS: Record<string, string> = {
  free: 'Free',
  immigration: 'Immigration Pack',
  advanced: 'Advanced Pack',
  citizenship: 'Citizenship Pro',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const allModules = getAllModulesForAdmin()
  const mod = allModules.find((m) => m.id === id)

  if (!mod) {
    return seoMeta({
      title: 'Module Not Found',
      description: 'This immigration module could not be found.',
      url: `/modules/${id}`,
    })
  }

  const pack = getModulePack(id)
  const packLabel = PACK_LABELS[pack] ?? pack

  return seoMeta({
    title: mod.title,
    description: mod.description,
    url: `/modules/${id}`,
    keywords: [
      'swiss immigration',
      mod.title.toLowerCase(),
      packLabel.toLowerCase(),
      mod.type,
      'guide',
      'switzerland',
    ],
  })
}

export default function ModuleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
