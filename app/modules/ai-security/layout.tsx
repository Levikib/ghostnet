import type { Metadata } from 'next'
import { MODULES, SITE_URL, SITE_NAME, moduleDescription, jsonLd } from '../../../lib/seo'
import type { SeoModule } from '../../../lib/seo'

// Server layout: page.tsx is a client component, so metadata and structured data live here.
// Fallback keeps the page rendering until 'ai-security' is registered in lib/seo.ts MODULES.
const FALLBACK: SeoModule = {
  slug: 'ai-security',
  code: '16',
  title: 'AI & LLM Security',
  topics: [
    'How LLMs and AI Systems Actually Work',
    'Prompt Injection: Direct and Indirect',
    'Jailbreaks and Guardrail Bypass',
    'Data Exfiltration and the RAG/Agent Threat Model',
    'Training-Time Attacks',
    'Model Extraction, Inversion and Membership Inference',
    'Adversarial Examples and Evasion',
    'Defending AI Systems',
    'Securing the AI You Build and Deploy',
    'AI for Attackers and Defenders, and Governance',
  ],
}
const mod: SeoModule = MODULES.find(m => m.slug === 'ai-security') || FALLBACK

export const metadata: Metadata = {
  title: 'MOD-' + mod.code + ' ' + mod.title,
  description: moduleDescription(mod),
  alternates: { canonical: '/modules/ai-security' },
  openGraph: { title: mod.title + ' | ' + SITE_NAME, description: moduleDescription(mod), url: SITE_URL + '/modules/ai-security', type: 'article' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: mod.title,
  description: moduleDescription(mod),
  url: SITE_URL + '/modules/ai-security',
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
