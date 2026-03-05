import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLint is run separately via `npm run lint`; pre-existing warnings don't block builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "react-markdown",
    "remark-gfm",
    "remark-parse",
    "remark-rehype",
    "rehype-raw",
    "rehype-sanitize",
    "unified",
    "unist-util-visit",
    "mdast-util-to-hast",
    "mdast-util-from-markdown",
    "micromark",
  ],
  typescript: {
    ignoreBuildErrors: false,
  },
  // Performance optimizations
  compress: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 75, 90],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "swissimmigrationpro.com",
      },
      {
        protocol: "https",
        hostname: "*.swissimmigrationpro.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "files.stripe.com",
      },
    ],
    // Cloudflare Pages cannot run Next.js image optimization server
    unoptimized: !!process.env.CLOUDFLARE_PAGES,
  },

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "date-fns",
      "recharts",
    ],
    // Optimize server components
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Turbopack configuration - Removed to fix framer-motion HMR issues
  // Using webpack instead (--webpack flag in dev script)
  // Note: framer-motion removed from optimizePackageImports to fix HMR issues

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js App Router requires unsafe-inline for hydration scripts; framer-motion needs unsafe-eval
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://translate.google.com https://translate.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://translate.googleapis.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://files.stripe.com https://*.swissimmigrationpro.com https://translate.google.com https://www.gstatic.com",
              "font-src 'self' https://fonts.gstatic.com",
              // wss: for VoiceEngine WebSocket; https://ipapi.co for geolocation
              "connect-src 'self' https://api.stripe.com https://ipapi.co wss://*.swissimmigrationpro.com https://translate.googleapis.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com https://translate.google.com",
              // blob: required for AudioWorklet (voice feature) and PDF generation
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=()",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Proxy API requests to Python backend
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

  // React strict mode for better development
  reactStrictMode: true,

  // Use 'standalone' for Docker/VPS only — Vercel and Cloudflare Pages handle their own output
  output: process.env.CLOUDFLARE_PAGES || process.env.VERCEL ? undefined : "standalone",

  // Power optimization
  poweredByHeader: false,

  // Allow development origins for cross-origin requests (including tunnels)
  allowedDevOrigins: [
    "localhost:5050",
    "127.0.0.1:5050",
    "*.trycloudflare.com",
    "*.loca.lt",
  ],
};

export default nextConfig;
