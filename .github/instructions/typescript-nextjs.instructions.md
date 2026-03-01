---
applyTo: "swiss-immigration-pro/**/*.{ts,tsx}"
---

# TypeScript / Next.js — Coding Rules

## TypeScript
- Zero `any` — use `unknown` + type narrowing or define a proper type
- Props typed with `interface` (not `type`) for extensibility
- Use `satisfies` for config objects to get type-checking without widening

## React / Next.js
- Functional components only; one component per file; filename = component name (PascalCase)
- Default to **React Server Components** — add `"use client"` only when the component
  needs event handlers, browser APIs, or React hooks
- `<Link>` for all internal navigation — never bare `<a>` or `router.push` for standard links
- `next/image` for all images, `next/font` for fonts — never raw `<img>` or `<link>` tags
- Page params typed from `PageProps`, never cast unsafely

## API calls
- All API calls go through `lib/api.ts` — never raw `fetch` in components
- Auth token is in `localStorage` key `sip_token`; `lib/api.ts` injects the `Authorization` header

## Styling
- Tailwind utility classes only — no inline `style={{}}` except for truly dynamic values
- Always use `cn()` (clsx + tailwind-merge) for conditional class names — never string concatenation

## State
- Prefer URL state (`useSearchParams`, `nuqs`) for anything shareable or refresh-safe
- React Query / SWR for server state — never `useEffect` to fetch data
- Zustand only for local UI state (cv-builder store, etc.) — one store per domain

## Performance
- Wrap heavy client components in `<Suspense>` with a meaningful fallback
- `useCallback` / `useMemo` for stable references passed to child components

## Revenue rules
- Feature gates: when a free user hits a locked feature, show an **upgrade modal** (not a toast)
  that names the exact feature and links to `/pricing?highlight=<pack>`
- Pricing page: `billingCycle` default must remain `'annual'`; always show monthly savings
- Every CTA button that triggers a checkout must call `analytics.checkoutStarted(packId)` first
