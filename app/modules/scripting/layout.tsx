import type { Metadata } from 'next'
import { MODULES, SITE_URL, SITE_NAME, moduleDescription, jsonLd } from '../../../lib/seo'

// Server layout: page.tsx is a client component, so metadata and structured data live here.
// Fallback keeps the build green until 'scripting' is registered in lib/seo.ts MODULES.
const mod = MODULES.find(m => m.slug === 'scripting') || {
  slug: 'scripting',
  code: '15',
  title: 'Python & Bash for Security',
  topics: [
    'Why Defenders and Attackers Script',
    'Bash Essentials',
    'Text Processing Power Tools',
    'Python Fundamentals for Security',
    'Python for Networks',
    'Python for Parsing and Data',
    'Automating Recon and Defence Safely',
    'PowerShell Essentials',
    'Building and Sharing a Real Tool',
  ],
}

export const metadata: Metadata = {
  title: 'MOD-' + mod.code + ' ' + mod.title,
  description: moduleDescription(mod),
  alternates: { canonical: '/modules/scripting' },
  openGraph: { title: mod.title + ' | ' + SITE_NAME, description: moduleDescription(mod), url: SITE_URL + '/modules/scripting', type: 'article' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: mod.title,
  description: moduleDescription(mod),
  url: SITE_URL + '/modules/scripting',
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
