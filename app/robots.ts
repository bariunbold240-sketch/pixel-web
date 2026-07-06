import type { MetadataRoute } from 'next'

// Canonical production origin. Keep in sync with app/sitemap.ts.
const BASE_URL = 'https://pixelmedia.mn'

/**
 * robots.txt — served at /robots.txt (Next.js App Router metadata route).
 *
 * Allows crawling of the public marketing page while blocking the private
 * areas: the API, the client portal (auth + dashboard) and the admin CMS.
 * Points crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard',
        '/projects',
        '/settings',
        '/login',
        '/register',
        '/forgot-password',
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
