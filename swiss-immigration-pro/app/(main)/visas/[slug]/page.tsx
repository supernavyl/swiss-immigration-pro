import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { Calendar, Clock, Tag, FileText, ChevronRight, ArrowRight, BookOpen, Calculator, Users, MessageSquare } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MainHeader from '@/components/layout/MainHeader'
import { generateMetadata as generateMeta, generateFAQSchema, generateArticleSchema, generateBreadcrumbSchema, formatLastUpdated } from '@/lib/seo/meta-helpers'

// Parse frontmatter from markdown
function parseFrontmatter(content: string): {
  frontmatter: Record<string, any>
  body: string
} {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const frontmatterText = match[1]
  const body = match[2]

  const frontmatter: Record<string, string | string[]> = {}
  frontmatterText.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      let value: string | string[] = line.substring(colonIndex + 1).trim()

      // Remove quotes if present
      if (typeof value === 'string' && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
        value = value.slice(1, -1)
      }

      // Parse arrays
      if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map((item) => item.trim().replace(/^["']|["']$/g, ''))
      }

      frontmatter[key] = value
    }
  })

  return { frontmatter, body }
}

// Get all visa markdown files
function getAllVisaSlugs(): string[] {
  try {
    const contentDir = join(process.cwd(), 'content', 'visas')
    const files = readdirSync(contentDir)
    return files
      .filter((file: string) => file.endsWith('.md'))
      .map((file: string) => file.replace('.md', ''))
  } catch {
    return []
  }
}

// Get visa post by slug
function getVisaPost(slug: string): {
  frontmatter: Record<string, any>
  content: string
} | null {
  try {
    const filePath = join(process.cwd(), 'content', 'visas', `${slug}.md`)
    const fileContent = readFileSync(filePath, 'utf-8')
    const { frontmatter, body } = parseFrontmatter(fileContent)
    return { frontmatter, content: body }
  } catch {
    return null
  }
}

// Generate static params for all visa pages
export async function generateStaticParams() {
  const slugs = getAllVisaSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

// Generate metadata for each visa page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getVisaPost(slug)

  if (!post) {
    return {
      title: 'Visa Guide Not Found',
    }
  }

  const { frontmatter } = post

  // Extract FAQs from content (look for FAQ section)
  const faqs: Array<{ question: string; answer: string }> = []
  const faqSection = post.content.match(/## Frequently Asked Questions\n([\s\S]*?)(?=\n## |$)/)
  if (faqSection) {
    const faqMatches = faqSection[1].matchAll(/### (.+?)\n\n(.+?)(?=\n### |$)/g)
    for (const match of faqMatches) {
      faqs.push({
        question: match[1].trim(),
        answer: match[2].trim(),
      })
    }
  }

  return generateMeta({
    title: frontmatter.title || 'Swiss Visa Guide',
    description: frontmatter.description || '',
    keywords: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    image: frontmatter.ogImage || '/og-image.jpg', // Ensure og:image is always set
    url: `/visas/${slug}`,
    type: 'article',
    publishedTime: frontmatter.publishedAt,
    modifiedTime: frontmatter.updatedAt,
    author: frontmatter.author || 'Swiss Immigration Pro',
    section: frontmatter.category,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
  })
}

export default async function VisaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getVisaPost(slug)

  if (!post) {
    notFound()
  }

  const { frontmatter, content } = post

  // Extract FAQs from content
  const faqs: Array<{ question: string; answer: string }> = []
  const faqSection = content.match(/## Frequently Asked Questions\n([\s\S]*?)(?=\n## |$)/)
  if (faqSection) {
    const faqMatches = Array.from(faqSection[1].matchAll(/### (.+?)\n\n([\s\S]+?)(?=\n### |$)/g))
    for (const match of faqMatches) {
      faqs.push({
        question: match[1].trim(),
        answer: match[2].trim(),
      })
    }
  }

  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null
  const articleSchema = generateArticleSchema({
    title: frontmatter.title || 'Swiss Visa Guide',
    description: frontmatter.description || '',
    image: frontmatter.ogImage || '/og-image.jpg', // Ensure og:image is set
    publishedTime: frontmatter.publishedAt || new Date().toISOString(),
    modifiedTime: frontmatter.updatedAt,
    author: frontmatter.author || 'Swiss Immigration Pro',
    url: `/visas/${slug}`,
  })
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Visas & Permits', url: '/visas' },
    { name: frontmatter.title || 'Swiss Visa Guide', url: `/visas/${slug}` },
  ])

  // Remove FAQ section from content (we'll render it separately)
  const contentWithoutFAQ = content.replace(/## Frequently Asked Questions\n[\s\S]*$/, '')

  // Reading time
  const readingTime = Math.ceil(content.split(/\s+/).length / 200)

  // JSON-LD strings
  const faqSchemaJson = faqSchema ? JSON.stringify(faqSchema) : null
  const articleSchemaJson = JSON.stringify(articleSchema)
  const breadcrumbSchemaJson = JSON.stringify(breadcrumbSchema)

  // Related resources
  const RESOURCES = [
    {
      href: '/tools/permit-calculator',
      icon: Calculator,
      title: 'Permit Calculator',
      description: 'Assess your eligibility for Swiss permits instantly',
      accent: 'blue',
    },
    {
      href: '/consultation',
      icon: MessageSquare,
      title: 'Book Consultation',
      description: 'Get personalized guidance from immigration experts',
      accent: 'emerald',
    },
    {
      href: '/modules/imm-01',
      icon: BookOpen,
      title: 'Learning Modules',
      description: 'Interactive courses covering Swiss immigration law',
      accent: 'violet',
    },
    {
      href: '/tools/cv-editor',
      icon: Users,
      title: 'CV Builder',
      description: 'Swiss-format CV templates optimized for ATS systems',
      accent: 'amber',
    },
  ]

  const accentClasses: Record<string, { bg: string; border: string; hover: string; icon: string }> = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
      hover: 'hover:border-blue-300 dark:hover:border-blue-700',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800',
      hover: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-950/30',
      border: 'border-violet-200 dark:border-violet-800',
      hover: 'hover:border-violet-300 dark:hover:border-violet-700',
      icon: 'text-violet-600 dark:text-violet-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
      hover: 'hover:border-amber-300 dark:hover:border-amber-700',
      icon: 'text-amber-600 dark:text-amber-400',
    },
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MainHeader />

      {/* JSON-LD Structured Data */}
      {faqSchemaJson && (
        <script type="application/ld+json" suppressHydrationWarning>
          {faqSchemaJson}
        </script>
      )}
      <script type="application/ld+json" suppressHydrationWarning>
        {articleSchemaJson}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {breadcrumbSchemaJson}
      </script>

      <article className="max-w-4xl mx-auto px-5 sm:px-8 pt-8 pb-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-8">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/visas" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Visas &amp; Permits
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-none">
            {frontmatter.title || 'Guide'}
          </span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {frontmatter.category || 'Permits & Visas'}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5 leading-[1.15]">
            {frontmatter.title || 'Swiss Visa Guide'}
          </h1>

          {frontmatter.description && (
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mb-6">
              {frontmatter.description}
            </p>
          )}

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-6">
            {frontmatter.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time dateTime={frontmatter.publishedAt}>
                  {new Date(frontmatter.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </span>
            )}

            {frontmatter.updatedAt && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {formatLastUpdated(frontmatter.updatedAt)}
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              {frontmatter.author || 'Swiss Immigration Pro'}
            </span>
          </div>

          {/* Tags */}
          {Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {frontmatter.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-slate-800
          prose-h3:text-xl prose-h3:mt-8
          prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
          prose-strong:text-slate-900 dark:prose-strong:text-white
          prose-li:text-slate-700 dark:prose-li:text-slate-300
          prose-table:text-sm
          prose-th:bg-slate-50 dark:prose-th:bg-slate-800 prose-th:text-slate-900 dark:prose-th:text-white
          prose-td:border-slate-200 dark:prose-td:border-slate-800
          prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:rounded-r-lg prose-blockquote:py-1
          prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {contentWithoutFAQ}
          </ReactMarkdown>
        </div>

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden"
                  {...(index === 0 ? { open: true } : {})}
                >
                  <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors [&::-webkit-details-marker]:hidden">
                    <span>{faq.question}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90 shrink-0" />
                  </summary>
                  <div className="px-6 pb-5 prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-slate-900 dark:prose-strong:text-white
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {faq.answer}
                    </ReactMarkdown>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Resources */}
        <section className="mb-16">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-5">
            Related Resources
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {RESOURCES.map((res) => {
              const ac = accentClasses[res.accent]
              const Icon = res.icon
              return (
                <Link
                  key={res.href}
                  href={res.href}
                  className={`group flex items-start gap-4 p-5 rounded-xl border ${ac.border} ${ac.bg} ${ac.hover} transition-all duration-200`}
                >
                  <div className={`shrink-0 mt-0.5 ${ac.icon}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {res.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {res.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Need help with your permit application?
          </h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Take our free assessment to discover your best immigration pathway
            in under 5&nbsp;minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Start Free Assessment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              View Plans
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
