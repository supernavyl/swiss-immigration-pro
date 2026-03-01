import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  transpilePackages: [
    'react-markdown',
    'remark-gfm',
    'remark-parse',
    'remark-rehype',
    'rehype-raw',
    'rehype-sanitize',
    'unified',
    'unist-util-visit',
    'mdast-util-to-hast',
    'mdast-util-from-markdown',
    'micromark',
  ],
  typescript: {
    ignoreBuildErrors: false,
  },
  // Performance optimizations
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'swissimmigrationpro.com',
      },
      {
        protocol: 'https',
        hostname: '*.swissimmigrationpro.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
      },
    ],
    // Cloudflare Pages cannot run Next.js image optimization server
    unoptimized: !!process.env.CLOUDFLARE_PAGES,
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      'date-fns',
      'recharts',
      'framer-motion',
    ],
    // Optimize server components
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Turbopack configuration - Removed to fix framer-motion HMR issues
  // Using webpack instead (--webpack flag in dev script)
  // Note: framer-motion removed from optimizePackageImports to fix HMR issues

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Proxy API requests to Python backend
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  },

  // React strict mode for better development
  reactStrictMode: true,

  // Use 'standalone' for Docker/VPS, remove for Cloudflare Pages
  // Cloudflare Pages uses @cloudflare/next-on-pages build pipeline
  output: process.env.CLOUDFLARE_PAGES ? undefined : 'standalone',

  // Power optimization
  poweredByHeader: false,

  // Allow development origins for cross-origin requests (including tunnels)
  allowedDevOrigins: ['localhost:5050', '127.0.0.1:5050', '*.trycloudflare.com', '*.loca.lt'],
};

export default nextConfig;


