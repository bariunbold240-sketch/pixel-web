import type { MetadataRoute } from 'next'

// Canonical production origin. Keep in sync with app/robots.ts.
const BASE_URL = 'https://pixelmedia.mn'

/**
 * SEO sitemap — served at /sitemap.xml (Next.js App Router metadata route).
 *
 * The public site is a single-page marketing deck at `/` (Hero, Vision, Team,
 * Work, Packages, Contact are anchor sections of that one route, not separate
 * pages). Every other route is a private/utility area — the client portal
 * (`/login`, `/register`, `/forgot-password`, `/dashboard`, `/projects`,
 * `/settings`) and the admin CMS (`/admin/*`) — none of which should be indexed,
 * so they are intentionally excluded here and disallowed in robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
