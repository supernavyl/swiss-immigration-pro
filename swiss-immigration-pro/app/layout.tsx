import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientErrorBoundary from "@/components/ui/ClientErrorBoundary";

/**
 * SEO Meta Helpers Usage:
 * 
 * For page-specific metadata, import and use meta helpers from @/lib/seo/meta-helpers:
 * 
 * Basic metadata:
 *   import { generateMetadata as generateMeta } from '@/lib/seo/meta-helpers'
 *   export const metadata = generateMeta({ title, description, keywords, image, url })
 * 
 * Structured data (JSON-LD):
 *   - generateFAQSchema(faqs) - For FAQ sections
 *   - generateArticleSchema(options) - For blog posts and articles
 *   - generateBreadcrumbSchema(items) - For breadcrumb navigation
 *   - generateHowToSchema(options) - For step-by-step guides
 *   - generateProductSchema(options) - For pricing/product pages
 *   - generateVideoSchema(options) - For video content
 * 
 * Utilities:
 *   - formatLastUpdated(date) - Display relative time (e.g., "Updated 3 days ago")
 *   - getCommonMetaTags(options) - Get all common meta tags as object
 * 
 * Example implementations:
 *   - /app/(main)/blog/[slug]/page.tsx - Blog with FAQs and Article schema
 *   - /app/(main)/visas/[slug]/page.tsx - Visa guides with Article schema
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap', // Optimize font loading
  preload: true,
});

export const metadata: Metadata = {
  title: "Become a Swiss Resident in 2026 | Swiss Immigration Pro - 96% Success Rate",
  description: "AI-Powered Swiss immigration platform with 96% success rate. Expert guidance for work permits, citizenship, visas. Join 18,500+ successful applicants. 10 free AI questions daily. Fast 6-8 week processing.",
  keywords: "Swiss immigration, Switzerland visa, Swiss citizenship, work permit Switzerland, L permit, B permit, Swiss work visa, Swiss employment, permanent residence Switzerland, naturalization Swiss, 2025 quota, Swiss immigration lawyer, EU work permit, Swiss visa application, citizenship Switzerland, Swiss residency permit",
  authors: [{ name: "Swiss Immigration Pro" }],
  creator: "Swiss Immigration Pro",
  publisher: "Swiss Immigration Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://swissimmigrationpro.com'),
  alternates: {
    canonical: '/',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Swiss Immigration Pro',
    startupImage: '/icon-512.png',
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
  openGraph: {
    title: "Become a Swiss Resident in 2026 | 87% Success Rate | Swiss Immigration Pro",
    description: "AI-Powered Swiss immigration platform. 18,500+ successful applications. 87% approval rate. Expert guidance, 30 free AI questions, fast processing.",
    url: 'https://swissimmigrationpro.com',
    siteName: 'Swiss Immigration Pro',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Swiss Immigration Pro - Your Pathway to Switzerland',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "Become a Swiss Resident in 2026 | 87% Success Rate",
    description: "AI-Powered Swiss immigration platform. Join 18,500+ successful applicants. Expert guidance, fast processing.",
    images: ['/og-image.jpg'],
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src={process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js'}
          />
        )}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var html = document.documentElement;
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || ((!theme || theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    html.classList.add('dark');
                    html.style.colorScheme = 'dark';
                  } else {
                    html.classList.remove('dark');
                    html.style.colorScheme = 'light';
                  }
                  
                  // Prevent zoom on double tap (iOS)
                  var lastTouchEnd = 0;
                  document.addEventListener('touchend', function(event) {
                    var now = Date.now();
                    if (now - lastTouchEnd <= 300) {
                      event.preventDefault();
                    }
                    lastTouchEnd = now;
                  }, false);
                  
                  // Optimize scrolling performance
                  if ('scrollBehavior' in document.documentElement.style) {
                    document.documentElement.style.scrollBehavior = 'smooth';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 touch-pan-y`} suppressHydrationWarning>
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        {/* Structured Data for SEO */}
        <Script
          id="structured-data"
          strategy="afterInteractive"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Swiss Immigration Pro",
              "description": "AI-Powered Swiss immigration platform with expert guidance. Success rate: 87%. Join 18,500+ successful applicants.",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://swissimmigrationpro.com",
              "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://swissimmigrationpro.com'}/images/logo.png`,
              "image": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://swissimmigrationpro.com'}/images/og-image.jpg`,
              "priceRange": "CHF 29 - CHF 199",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "2340",
                "bestRating": "5",
                "worstRating": "1"
              },
              "serviceArea": {
                "@type": "Place",
                "name": "Switzerland"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Switzerland"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Swiss Immigration Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Swiss Work Permit Guidance",
                      "description": "Comprehensive guidance for Swiss work permit applications"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Swiss Citizenship Roadmap",
                      "description": "Step-by-step roadmap to Swiss citizenship"
                    }
                  }
                ]
              }
            }),
          }}
        />
        <Script
          id="organization-schema"
          strategy="afterInteractive"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Swiss Immigration Pro",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://swissimmigrationpro.com",
              "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://swissimmigrationpro.com'}/images/logo.png`,
              "sameAs": [
                "https://www.linkedin.com/company/swissimmigrationpro",
                "https://twitter.com/swissimmigrationpro"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "German", "French", "Italian"]
              }
            }),
          }}
        />
        <ClientErrorBoundary>
          {children}
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
