import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Operator initiation',
  description: 'Set up your GHOSTNET operator profile.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
