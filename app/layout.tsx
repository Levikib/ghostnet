'use client'
import './globals.css'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import GhostAgent from './components/GhostAgent'
import ProgressTracker from './components/ProgressTracker'
import CheatSheet from './components/CheatSheet'
import CVEFeed from './components/CVEFeed'

const modules = [
  { href: '/modules/tor',       label: 'TOR & DARKWEB',        code: 'MOD-01', color: '#00ff41' },
  { href: '/modules/osint',     label: 'OSINT & SURVEILLANCE',  code: 'MOD-02', color: '#00d4ff' },
  { href: '/modules/crypto',    label: 'CRYPTO & BLOCKCHAIN',   code: 'MOD-03', color: '#ffb347' },
  { href: '/modules/offensive', label: 'OFFENSIVE SECURITY',    code: 'MOD-04', color: '#bf5fff' },
]

function Nav() {
  const path = usePathname()
  const activeModule = modules.find(m => path.startsWith(m.href))
  const isLab = path.includes('/lab')
  return (
    <nav style={{ background: '#050805', borderBottom: '1px solid #1a2e1e', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', border: '1px solid #00ff41', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(0,255,65,0.35)' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00ff41', fontWeight: 700 }}>GN</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#00ff41', fontWeight: 600, letterSpacing: '0.12em', lineHeight: 1 }}>GHOSTNET</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#2a4a2a', letterSpacing: '0.15em', lineHeight: 1, marginTop: '2px' }}>SECURITY RESEARCH PLATFORM</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '2px' }}>
          {modules.map(m => {
            const active = path.startsWith(m.href)
            return (
              <Link key={m.href} href={m.href} style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '8.5px', letterSpacing: '0.1em', padding: '5px 10px', borderRadius: '3px', color: active ? m.color : '#3a5a3a', background: active ? `${m.color}12` : 'transparent', border: `1px solid ${active ? `${m.color}44` : 'transparent'}`, transition: 'all 0.15s' }}>{m.code}</Link>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/intel" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#ff4136', letterSpacing: '0.1em', padding: '4px 8px', border: '1px solid rgba(255,65,54,0.3)', borderRadius: '3px', background: 'rgba(255,65,54,0.06)' }}>INTEL</Link>
          <Link href="/tools" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#00ff41', letterSpacing: '0.1em', padding: '4px 8px', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '3px', background: 'rgba(0,255,65,0.06)' }}>TOOLS</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff41', boxShadow: '0 0 6px #00ff41' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#2a5a2a', letterSpacing: '0.1em' }}>GHOST ONLINE</span>
          </div>
        </div>
      </div>
      {activeModule && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href={activeModule.href} style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: isLab ? '#3a5a3a' : activeModule.color, letterSpacing: '0.1em' }}>
            {activeModule.code} // {activeModule.label}
          </Link>
          {isLab && <>
            <span style={{ color: '#1a3a1a', fontSize: '10px' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: activeModule.color, letterSpacing: '0.1em' }}>LAB</span>
          </>}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
            <Link href={activeModule.href} style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', padding: '3px 10px', borderRadius: '3px', color: !isLab ? activeModule.color : '#3a5a3a', background: !isLab ? `${activeModule.color}10` : 'transparent', border: `1px solid ${!isLab ? `${activeModule.color}33` : '#1a2e1e'}`, letterSpacing: '0.1em' }}>CONCEPT</Link>
            <Link href={`${activeModule.href}/lab`} style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', padding: '3px 10px', borderRadius: '3px', color: isLab ? activeModule.color : '#3a5a3a', background: isLab ? `${activeModule.color}10` : 'transparent', border: `1px solid ${isLab ? `${activeModule.color}33` : '#1a2e1e'}`, letterSpacing: '0.1em' }}>LAB</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
        <footer style={{ borderTop: '1px solid #1a2e1e', padding: '1.25rem', textAlign: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#1a3a1a', letterSpacing: '0.2em' }}>
            GHOSTNET // SECURITY RESEARCH PLATFORM // EDUCATIONAL USE ONLY
          </span>
        </footer>
        <GhostAgent />
        <ProgressTracker />
        <CheatSheet />
        <CVEFeed />
      </body>
    </html>
  )
}
