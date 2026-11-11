import type { MetadataRoute } from 'next'
import { MODULES, SITE_URL } from '../lib/seo'

// Only routes a logged-out visitor (or crawler) can actually open: the landing page,
// the 13 module concept pages and the legal pages. Tools and labs need an account.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: SITE_URL + '/welcome', lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...MODULES.map(m => ({ url: SITE_URL + '/modules/' + m.slug, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: SITE_URL + '/privacy', lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: SITE_URL + '/terms', lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
