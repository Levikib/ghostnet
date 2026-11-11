import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shodan Query Builder',
  description: 'Build Shodan search queries.',
  alternates: { canonical: '/shodan' },
  // Needs an account (or is personal), so keep it out of search results.
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
