import type { Metadata } from 'next'
import { MODULES, SITE_URL, SITE_NAME, moduleDescription, jsonLd } from '../../../lib/seo'
import type { SeoModule } from '../../../lib/seo'

// Server layout: page.tsx is a client component, so metadata and structured data live here.
// Fallback keeps the page rendering until 'blue-team' is registered in lib/seo.ts MODULES.
const FALLBACK: SeoModule = {
  slug: 'blue-team',
  code: '14',
  title: 'Blue Team & Incident Response',
  topics: [
    'The SOC and the Defender Mindset',
    'Logs That Matter',
    'SIEM Fundamentals',
    'Detection Engineering',
    'Threat Hunting',
    'Network Defence',
    'Endpoint Defence',
    'The Incident Response Lifecycle',
    'Digital Forensics Essentials',
    'Threat Intelligence and Putting It Together',
  ],
}
const mod: SeoModule = MODULES.find(m => m.slug === 'blue-team') || FALLBACK

export const metadata: Metadata = {
  title: 'MOD-' + mod.code + ' ' + mod.title,
  description: moduleDescription(mod),
  alternates: { canonical: '/modules/blue-team' },
  openGraph: { title: mod.title + ' | ' + SITE_NAME, description: moduleDescription(mod), url: SITE_URL + '/modules/blue-team', type: 'article' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: mod.title,
  description: moduleDescription(mod),
  url: SITE_URL + '/modules/blue-team',
  courseCode: 'MOD-' + mod.code,
  provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  teaches: mod.topics,
  educationalLevel: 'Beginner to Advanced',
  inLanguage: 'en',
  isAccessibleForFree: true,
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online' },
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'Free' },
}

export default function ModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      {children}
    </>
  )
}
