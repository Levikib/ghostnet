import type { Metadata } from 'next'
import { MODULES, SITE_URL, SITE_NAME, moduleDescription, jsonLd, type SeoModule } from '../../../lib/seo'

// Server layout: page.tsx is a client component, so metadata and structured data live here.
// Local fallback so this module renders correctly before it is registered in lib/seo.ts MODULES.
const fallback: SeoModule = {
  slug: 'grc',
  code: '17',
  title: 'Governance, Risk & Compliance',
  topics: [
    'What GRC Is and Why It Pays',
    'Security Governance',
    'Risk Management Fundamentals',
    'Risk Frameworks',
    'Control Frameworks',
    'Compliance and Regulations',
    'Audits and Assessments',
    'Third-Party and Supply-Chain Risk',
    'Business Continuity and Disaster Recovery',
    'Building a Security Program and Your GRC Career',
  ],
}

const mod = MODULES.find(m => m.slug === 'grc') ?? fallback

export const metadata: Metadata = {
  title: 'MOD-' + mod.code + ' ' + mod.title,
  description: moduleDescription(mod),
  alternates: { canonical: '/modules/grc' },
  openGraph: { title: mod.title + ' | ' + SITE_NAME, description: moduleDescription(mod), url: SITE_URL + '/modules/grc', type: 'article' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: mod.title,
  description: moduleDescription(mod),
  url: SITE_URL + '/modules/grc',
  courseCode: 'MOD-' + mod.code,
  provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  teaches: mod.topics,
  educationalLevel: 'Intermediate',
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
