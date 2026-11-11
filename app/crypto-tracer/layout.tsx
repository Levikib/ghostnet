import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blockchain Tracer',
  description: 'Trace transactions on-chain.',
  alternates: { canonical: '/crypto-tracer' },
  // Needs an account (or is personal), so keep it out of search results.
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
