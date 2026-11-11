import './globals.css'
import type { Metadata, Viewport } from 'next'
import ClientRoot from './ClientRoot'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, jsonLd } from '../lib/seo'

// Server component so Next can emit real <title>, description, canonical, Open Graph and Twitter tags.
// Everything interactive (nav, widgets, auth) lives in ClientRoot.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME + ' | Hands-on Cybersecurity Labs', template: '%s | ' + SITE_NAME },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'cybersecurity training', 'ethical hacking labs', 'OSINT course', 'penetration testing practice',
    'red team training', 'active directory attacks', 'web application security', 'malware analysis',
    'cloud security', 'CTF practice', 'security research platform',
  ],
  authors: [{ name: 'ShanGhost Admin' }],
  creator: 'Levis Kibirie',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME + ': Hands-on Cybersecurity Labs',
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: SITE_NAME + ': Hands-on Cybersecurity Labs', description: SITE_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  icons: { icon: '/icon.svg' },
  category: 'education',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': SITE_URL + '/#org',
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_URL + '/icon.svg',
      founder: { '@type': 'Person', name: 'Levis Kibirie', url: 'https://levis.makejahomes.co.ke' },
    },
    {
      '@type': 'WebSite',
      '@id': SITE_URL + '/#website',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { '@id': SITE_URL + '/#org' },
      inLanguage: 'en',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts: preconnected, non-blocking stylesheet (media="print" until it arrives, then switched to all). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" media="print" crossOrigin="anonymous" data-gn-fonts="" />
        <script
          dangerouslySetInnerHTML={{
            __html: "(function(){var l=document.querySelector('link[data-gn-fonts]');if(!l)return;var on=function(){l.media='all'};if(l.sheet){on()}else{l.addEventListener('load',on)}})();",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteSchema) }} />
      </head>
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  )
}
