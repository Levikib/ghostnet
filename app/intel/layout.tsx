import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Threat Intel',
  description: 'Live CVE feed and security advisories.',
  alternates: { canonical: '/intel' },
  // Needs an account (or is personal), so keep it out of search results.
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
