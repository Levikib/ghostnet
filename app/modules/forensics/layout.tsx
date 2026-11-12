import type { Metadata } from 'next'
import { MODULES, SITE_URL, SITE_NAME, moduleDescription, jsonLd, SeoModule } from '../../../lib/seo'

// Server layout: page.tsx is a client component, so metadata and structured data live here.
// 'forensics' is a newer module that may not yet be registered in lib/seo's MODULES catalogue,
// so fall back to a local SeoModule definition when it is absent.
const fallback: SeoModule = {
  slug: 'forensics',
  code: '18',
  title: 'Digital Forensics',
  topics: [
    'Forensic Principles and Process',
    'Evidence Acquisition and Imaging',
    'Filesystem Forensics',
    'Windows Artifacts: Execution and Persistence',
    'Windows Artifacts: User Activity',
    'Memory Forensics with Volatility 3',
    'Timeline Analysis and Super-Timelines',
    'Network and Log Forensics',
    'Mobile and Cloud Forensics',
    'Reporting, the Courtroom and the DFIR Career',
  ],
}

const mod = MODULES.find(m => m.slug === 'forensics') || fallback

export const metadata: Metadata = {
  title: 'MOD-' + mod.code + ' ' + mod.title,
  description: moduleDescription(mod),
  alternates: { canonical: '/modules/forensics' },
  openGraph: { title: mod.title + ' | ' + SITE_NAME, description: moduleDescription(mod), url: SITE_URL + '/modules/forensics', type: 'article' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: mod.title,
  description: moduleDescription(mod),
  url: SITE_URL + '/modules/forensics',
  courseCode: 'MOD-' + mod.code,
  provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  teaches: mod.topics,
  educationalLevel: 'Advanced',
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
