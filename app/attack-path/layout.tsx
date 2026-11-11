import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Attack Path Builder',
  description: 'MITRE ATT&CK kill chain builder.',
  alternates: { canonical: '/attack-path' },
  // Needs an account (or is personal), so keep it out of search results.
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
