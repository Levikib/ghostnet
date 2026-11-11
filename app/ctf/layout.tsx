import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CTF Toolkit',
  description: 'Capture-the-flag tools and resources.',
  alternates: { canonical: '/ctf' },
  // Needs an account (or is personal), so keep it out of search results.
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
