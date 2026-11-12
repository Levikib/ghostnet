import type { Metadata } from 'next'
import { MODULES, SITE_URL, SITE_NAME, moduleDescription, jsonLd } from '../../../lib/seo'
import type { SeoModule } from '../../../lib/seo'

// Server layout: page.tsx is a client component, so metadata and structured data live here.
// 'linux' is not in lib/seo MODULES yet; fall back to a local entry until it is added there.
const FALLBACK: SeoModule = {
  slug: 'linux',
  code: '14',
  title: 'Linux Mastery',
  topics: [
    'Why Linux Runs the World',
    'Choosing Your Distribution',
    'Getting Linux Running - Every Option',
    'First Contact: Desktop, Terminal and Getting Help',
    'The Filesystem Hierarchy and Navigation',
    'Working with Files and Text',
    'Permissions, Ownership and Links',
    'Users, Groups and Privilege',
    'Processes, Jobs and Services',
    'Software and Package Management',
    'Networking on Linux',
    'Hardening Your Box and Building Your Hacking Lab',
  ],
}
const mod = MODULES.find(m => m.slug === 'linux') ?? FALLBACK

export const metadata: Metadata = {
  title: 'MOD-' + mod.code + ' ' + mod.title,
  description: moduleDescription(mod),
  alternates: { canonical: '/modules/linux' },
  openGraph: { title: mod.title + ' | ' + SITE_NAME, description: moduleDescription(mod), url: SITE_URL + '/modules/linux', type: 'article' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: mod.title,
  description: moduleDescription(mod),
  url: SITE_URL + '/modules/linux',
  courseCode: 'MOD-' + mod.code,
  provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  teaches: mod.topics,
  educationalLevel: 'Beginner',
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
