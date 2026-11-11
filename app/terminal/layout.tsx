import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research Terminal',
  description: 'Interactive command runner for security research.',
  alternates: { canonical: '/terminal' },
  // Needs an account (or is personal), so keep it out of search results.
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
