import type { Metadata } from 'next'
import { MODULES, SITE_URL, SITE_NAME, SITE_DESCRIPTION, jsonLd } from '../../lib/seo'

export const metadata: Metadata = {
  title: { absolute: SITE_NAME + ' | Hands-on Cybersecurity Labs: OSINT, Red Team, Cloud & More' },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/welcome' },
}

// Plain answers for search and answer engines (also summarised in /llms.txt).
const FAQ = [
  { q: 'What is GHOSTNET?', a: 'GHOSTNET is a hands-on cybersecurity training platform with 13 modules, from OSINT, Tor and cryptography to Active Directory, cloud security and red team operations. Each module has concept chapters and a guided lab.' },
  { q: 'Do I need an account to learn on GHOSTNET?', a: 'No. All 13 module concept pages can be read without an account. The guided labs, XP tracking and research tools need a free account.' },
  { q: 'Who is GHOSTNET for?', a: 'Beginners through advanced security researchers. Concepts are explained in plain language first, then practised in the labs.' },
  { q: 'What topics does GHOSTNET cover?', a: MODULES.map(m => m.title).join(', ') + '.' },
  { q: 'How does the rank system work?', a: 'Completing labs earns XP. There are 5,450 XP across the 13 labs and five ranks: Ghost, Specter, Phantom, Wraith and Legend.' },
  { q: 'Is the content legal to practise?', a: 'GHOSTNET is for education and authorised testing only. Only practise techniques on systems you own or have written permission to test.' },
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ItemList',
      name: SITE_NAME + ' modules',
      itemListElement: MODULES.map((m, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: SITE_URL + '/modules/' + m.slug,
        name: 'MOD-' + m.code + ' ' + m.title,
      })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
}

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      {children}
      {/* Crawlable summary. The splash itself is an animated client page; this gives search and answer
          engines (and screen readers) the same facts in plain HTML. Visually hidden, not display:none. */}
      <section aria-label="About GHOSTNET" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
        <h1>GHOSTNET: hands-on cybersecurity labs</h1>
        <p>{SITE_DESCRIPTION}</p>
        <h2>Modules</h2>
        <ul>
          {MODULES.map(m => (
            <li key={m.slug}><a href={'/modules/' + m.slug}>{'MOD-' + m.code + ' ' + m.title}</a></li>
          ))}
        </ul>
        <h2>Frequently asked questions</h2>
        {FAQ.map(f => (
          <div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>
        ))}
      </section>
    </>
  )
}
