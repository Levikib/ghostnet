import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Report Generator',
  description: 'AI-assisted penetration test report builder.',
  alternates: { canonical: '/report-generator' },
  // Needs an account (or is personal), so keep it out of search results.
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
