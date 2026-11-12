import type { Metadata } from 'next'
import { MODULES, SITE_URL, SITE_NAME, moduleDescription, jsonLd, SeoModule } from '../../../lib/seo'

// Server layout: page.tsx is a client component, so metadata and structured data live here.
const fallback: SeoModule = {
  slug: 'iot-security',
  code: '19',
  title: 'IoT, ICS & Hardware Security',
  topics: [
    'The IoT and ICS Attack Surface',
    'Hardware Recon: UART, JTAG and SPI',
    'Firmware Extraction and Analysis',
    'Embedded Web and API Attacks',
    'Radio and Protocol Attacks (BLE, Zigbee, RF)',
    'ICS and SCADA Fundamentals',
    'Attacking Industrial Protocols (Modbus, DNP3)',
    'IoT Malware and Botnets',
    'Securing and Defending IoT/ICS',
  ],
}

const mod = MODULES.find(m => m.slug === 'iot-security') || fallback

export const metadata: Metadata = {
  title: 'MOD-' + mod.code + ' ' + mod.title,
  description: moduleDescription(mod),
  alternates: { canonical: '/modules/iot-security' },
  openGraph: { title: mod.title + ' | ' + SITE_NAME, description: moduleDescription(mod), url: SITE_URL + '/modules/iot-security', type: 'article' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: mod.title,
  description: moduleDescription(mod),
  url: SITE_URL + '/modules/iot-security',
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
