import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://swissimmigrationpro.com'
const SITE_NAME = 'Swiss Immigration Pro'

export interface MetaHelpersOptions {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

/**
 * Generate comprehensive metadata for SEO
 * Use this helper to create consistent metadata across all pages
 */
export function generateMetadata(options: MetaHelpersOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.jpg',
    url = '',
    type = 'website',
    publishedTime,
    modifiedTime,
    author = 'Swiss Immigration Pro',
    section,
    tags = [],
  } = options

  const fullTitle = `${title} | ${SITE_NAME}`
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: [{ name: author }],
    creator: author,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url || '/',
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  return metadata
}

/**
 * Generate JSON-LD FAQ schema from questions and answers
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate Article JSON-LD schema for blog posts
 */
export function generateArticleSchema(options: {
  title: string
  description: string
  image?: string
  publishedTime: string
  modifiedTime?: string
  author?: string
  url?: string
}) {
  const {
    title,
    description,
    image = '/og-image.jpg',
    publishedTime,
    modifiedTime,
    author = 'Swiss Immigration Pro',
    url = '',
  } = options

  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    datePublished: publishedTime,
    ...(modifiedTime && { dateModified: modifiedTime }),
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
  }
}

/**
 * Format date for last updated badge
 */
export function formatLastUpdated(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - dateObj.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Updated today'
  if (diffDays === 1) return 'Updated yesterday'
  if (diffDays < 7) return `Updated ${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `Updated ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `Updated ${months} ${months === 1 ? 'month' : 'months'} ago`
  }

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Generate BreadcrumbList JSON-LD schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

/**
 * Generate HowTo JSON-LD schema
 */
export function generateHowToSchema(options: {
  name: string
  description: string
  steps: Array<{ name: string; text: string; image?: string }>
  totalTime?: string
  estimatedCost?: { currency: string; value: string }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: options.name,
    description: options.description,
    ...(options.totalTime && { totalTime: options.totalTime }),
    ...(options.estimatedCost && { estimatedCost: options.estimatedCost }),
    step: options.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image.startsWith('http') ? step.image : `${SITE_URL}${step.image}` }),
    })),
  }
}

/**
 * Generate VideoObject JSON-LD schema
 */
export function generateVideoSchema(options: {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string
  contentUrl?: string
  embedUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: options.name,
    description: options.description,
    thumbnailUrl: options.thumbnailUrl.startsWith('http') ? options.thumbnailUrl : `${SITE_URL}${options.thumbnailUrl}`,
    uploadDate: options.uploadDate,
    ...(options.duration && { duration: options.duration }),
    ...(options.contentUrl && { contentUrl: options.contentUrl }),
    ...(options.embedUrl && { embedUrl: options.embedUrl }),
  }
}

/**
 * Generate Product JSON-LD schema for pricing pages
 */
export function generateProductSchema(options: {
  name: string
  description: string
  image?: string
  offers: {
    price: string
    priceCurrency: string
    availability?: string
    url?: string
  }
  aggregateRating?: {
    ratingValue: string
    reviewCount: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: options.name,
    description: options.description,
    ...(options.image && { 
      image: options.image.startsWith('http') ? options.image : `${SITE_URL}${options.image}` 
    }),
    offers: {
      '@type': 'Offer',
      price: options.offers.price,
      priceCurrency: options.offers.priceCurrency,
      availability: options.offers.availability || 'https://schema.org/InStock',
      ...(options.offers.url && { 
        url: options.offers.url.startsWith('http') ? options.offers.url : `${SITE_URL}${options.offers.url}` 
      }),
    },
    ...(options.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: options.aggregateRating.ratingValue,
        reviewCount: options.aggregateRating.reviewCount,
      },
    }),
  }
}

/**
 * Helper to inject common meta tags in <head>
 * For use with Next.js Metadata API (already applied in generateMetadata)
 */
export function getCommonMetaTags(options: MetaHelpersOptions) {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.jpg',
    url = '',
  } = options

  const fullTitle = `${title} | ${SITE_NAME}`
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    ogTitle: fullTitle,
    ogDescription: description,
    ogImage: imageUrl,
    ogUrl: url ? `${SITE_URL}${url}` : SITE_URL,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: imageUrl,
  }
}
