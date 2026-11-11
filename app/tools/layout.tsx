import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tool Reference',
  description: '200+ security commands and cheat sheets.',
  alternates: { canonical: '/tools' },
  // Needs an account (or is personal), so keep it out of search results.
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
