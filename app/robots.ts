import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/welcome', '/modules/'],
        // Account, API and lab routes need a login; nothing there for search engines.
        disallow: ['/api/', '/auth', '/profile', '/modules/*/lab'],
      },
    ],
    sitemap: SITE_URL + '/sitemap.xml',
  }
}
