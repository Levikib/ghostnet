import type { Metadata } from 'next'
import { MODULES, SITE_URL, SITE_NAME, moduleDescription, jsonLd } from '../../../lib/seo'
import type { SeoModule } from '../../../lib/seo'

// Server layout: page.tsx is a client component, so metadata and structured data live here.
// Foundations is not in lib/seo MODULES yet; fall back to a local entry until it is added there.
const FALLBACK: SeoModule = {
  slug: 'foundations',
  code: '00',
  title: 'Foundations',
  topics: [
    'How Computers and Operating Systems Work',
    'The Linux Command Line I: Navigation, Files and Pipes',
    'Linux II: Users, Permissions, Processes, Services and Logs',
    'Networking I: Models, Addresses, Subnets and Routing',
    'Networking II: TCP, UDP, Ports, DNS and the Tools',
    'How the Web Works: HTTP, Cookies, Sessions and TLS',
    'Windows Essentials for Security',
    'Core Security Concepts',
    'Your Lab Environment, Safely and Legally',
    'How to Learn Cybersecurity',
  ],
}
const mod = MODULES.find(m => m.slug === 'foundations') ?? FALLBACK

export const metadata: Metadata = {
  title: 'MOD-' + mod.code + ' ' + mod.title,
  description: moduleDescription(mod),
  alternates: { canonical: '/modules/foundations' },
  openGraph: { title: mod.title + ' | ' + SITE_NAME, description: moduleDescription(mod), url: SITE_URL + '/modules/foundations', type: 'article' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: mod.title,
  description: moduleDescription(mod),
  url: SITE_URL + '/modules/foundations',
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
