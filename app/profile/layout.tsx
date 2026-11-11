import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Profile',
  description: 'Rank, XP and lab history.',
  alternates: { canonical: '/profile' },
  // Needs an account (or is personal), so keep it out of search results.
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
