'use client'
import React, { useState, useRef, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import GhostAgent from './components/GhostAgent'
import ProgressTracker from './components/ProgressTracker'
import CheatSheet from './components/CheatSheet'
import CVEFeed from './components/CVEFeed'
import RecallPopup from './components/RecallPopup'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider, useAuth } from './components/AuthProvider'
import { CATALOG } from '../lib/learning'
import { accentText } from './components/gx/Gx'

const MobileMenuContext = createContext(false)

const TOOLS_BASE = [
  { href: '/intel', label: 'Threat intel', desc: 'Recent CVEs and advisories', color: '#ff6b5e' },
  { href: '/tools', label: 'Command reference', desc: '180+ commands by category', color: '#00ff41' },
  { href: '/terminal', label: 'Research terminal', desc: 'Practice shell with cheat sheets', color: '#00d4ff' },
  { href: '/payload', label: 'Payload generator', desc: '40+ payload templates for labs', color: '#cf8bff' },
  { href: '/ctf', label: 'CTF toolkit', desc: 'Capture-the-flag techniques', color: '#00ffff' },
  { href: '/attack-path', label: 'Attack path builder', desc: 'MITRE ATT&CK kill chains + AI narrative', color: '#ff6b5e' },
  { href: '/report-generator', label: 'Report generator', desc: 'AI-assisted pentest reports', color: '#00ff41' },
  { href: '/shodan', label: 'Shodan query builder', desc: 'Build search queries', color: '#00d4ff' },
  { href: '/crypto-tracer', label: 'Blockchain tracer', desc: 'Demo of transaction tracing', color: '#ffb347' },
]

function Nav({ onMobileMenuChange }: { onMobileMenuChange: (open: boolean) => void }) {
  const path = usePathname()
  const [open, setOpen] = useState<'modules' | 'tools' | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const { profile, signOut } = useAuth()

  function setMobile(v: boolean) { setMobileOpen(v); onMobileMenuChange(v) }

  const activeModule = CATALOG.find(m => path === '/modules/' + m.id || path.startsWith('/modules/' + m.id + '/'))
  const isLab = path.endsWith('/lab')
  const progressFor = (id: string) => profile?.modules.find(m => m.id === id)?.percent ?? 0
  const tools = [...TOOLS_BASE, profile
    ? { href: '/profile', label: 'Profile', desc: 'Rank, progress and security', color: '#00ff41' }
    : { href: '/auth', label: 'Account', desc: 'Sign in or enlist', color: '#00ff41' }]

  useEffect(() => {
    function onDown(e: MouseEvent) { if (barRef.current && !barRef.current.contains(e.target as Node)) setOpen(null) }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') { setOpen(null); if (mobileOpen) setMobile(false) } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setMobile(false); setOpen(null) }, [path])

  const rank = profile ? profile.ghost_rank : null

  return (
    <nav className="gn-nav" aria-label="Main">
      <div ref={barRef} className="gn-nav-bar">
        <Link href="/" className="gn-brand" aria-label="GHOSTNET command centre">
          <span className="gn-mark">GN</span>
          <span className="gn-brand-text">GHOSTNET</span>
        </Link>

        <div className="gn-nav-links">
          <Link href="/" className="gn-link" aria-current={path === '/' ? 'page' : undefined}>Command centre</Link>
          <div style={{ position: 'relative' }}>
            <button className="gn-link" aria-expanded={open === 'modules'} aria-haspopup="true" onClick={() => setOpen(o => (o === 'modules' ? null : 'modules'))} data-active={!!activeModule}>
              Modules <span aria-hidden="true" className="gn-caret">▾</span>
            </button>
            {open === 'modules' && (
              <div className="gn-pop gn-pop-wide" role="menu">
                <div className="gn-pop-head">{CATALOG.length} MODULES · CHAPTERS + GUIDED LAB</div>
                <div className="gn-mod-grid">
                  {CATALOG.map(m => {
                    const p = progressFor(m.id)
                    const here = activeModule?.id === m.id
                    return (
                      <div key={m.id} className="gn-mod" data-here={here} style={{ ['--acc' as string]: accentText(m.color) } as React.CSSProperties}>
                        <Link href={'/modules/' + m.id} role="menuitem" className="gn-mod-main">
                          <span className="gn-mod-code">{m.code}</span>
                          <span className="gn-mod-title">{m.title}</span>
                          <span className="gn-mod-pct">{p > 0 ? p + '%' : ''}</span>
                        </Link>
                        <Link href={'/modules/' + m.id + '/lab'} role="menuitem" className="gn-mod-lab" aria-label={m.title + ' lab'}>LAB</Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <button className="gn-link" aria-expanded={open === 'tools'} aria-haspopup="true" onClick={() => setOpen(o => (o === 'tools' ? null : 'tools'))}>
              Tools <span aria-hidden="true" className="gn-caret">▾</span>
            </button>
            {open === 'tools' && (
              <div className="gn-pop" role="menu">
                {tools.map(t => (
                  <Link key={t.href} href={t.href} role="menuitem" className="gn-tool" aria-current={path === t.href ? 'page' : undefined}>
                    <span className="gn-tool-dot" style={{ background: t.color }} aria-hidden="true" />
                    <span><span className="gn-tool-label">{t.label}</span><span className="gn-tool-desc">{t.desc}</span></span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/paths" className="gn-link" aria-current={path === '/paths' ? 'page' : undefined}>Paths</Link>
          {profile && <Link href="/review" className="gn-link" aria-current={path === '/review' ? 'page' : undefined}>Review</Link>}
          <Link href="/leaderboard" className="gn-link" aria-current={path === '/leaderboard' ? 'page' : undefined}>Leaderboard</Link>

          {activeModule && (
            <div className="gn-crumb" style={{ ['--acc' as string]: accentText(activeModule.color) } as React.CSSProperties}>
              <span className="gn-crumb-code">MOD-{activeModule.code}</span>
              <Link href={'/modules/' + activeModule.id} data-on={!isLab}>Chapters</Link>
              <Link href={'/modules/' + activeModule.id + '/lab'} data-on={isLab}>Lab</Link>
            </div>
          )}
        </div>

        <div className="gn-nav-right">
          {profile ? (
            <>
              <Link href="/profile" className="gn-me" aria-label="Your profile">
                <span className="gn-me-name">{profile.username}</span>
                <span className="gn-me-xp">{rank ? rank.toUpperCase() + ' · ' : ''}{profile.xp.toLocaleString()} XP</span>
              </Link>
              <button className="gn-out" onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <Link href="/auth" className="gn-out">Sign in</Link>
          )}
          <button className="gn-burger" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobile(!mobileOpen)}>
            <span data-open={mobileOpen} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="gn-mobile">
          {profile && (
            <Link href="/profile" className="gn-mobile-me">
              <span className="gn-me-name">{profile.username}</span>
              <span className="gn-me-xp">{(rank || '').toUpperCase()} · {profile.xp.toLocaleString()} XP</span>
            </Link>
          )}
          <Link href="/" className="gn-mobile-link">Command centre</Link>
          <Link href="/paths" className="gn-mobile-link">Paths</Link>
          <Link href="/assess" className="gn-mobile-link">Find your level</Link>
          {profile && <Link href="/review" className="gn-mobile-link">Daily review</Link>}
          <Link href="/leaderboard" className="gn-mobile-link">Leaderboard</Link>
          <div className="gn-pop-head" style={{ marginTop: '18px' }}>MODULES</div>
          {CATALOG.map(m => (
            <div key={m.id} className="gn-mod" style={{ ['--acc' as string]: accentText(m.color) } as React.CSSProperties}>
              <Link href={'/modules/' + m.id} className="gn-mod-main">
                <span className="gn-mod-code">{m.code}</span>
                <span className="gn-mod-title">{m.title}</span>
                <span className="gn-mod-pct">{progressFor(m.id) > 0 ? progressFor(m.id) + '%' : ''}</span>
              </Link>
              <Link href={'/modules/' + m.id + '/lab'} className="gn-mod-lab">LAB</Link>
            </div>
          ))}
          <div className="gn-pop-head" style={{ marginTop: '18px' }}>TOOLS</div>
          {tools.map(t => (
            <Link key={t.href} href={t.href} className="gn-tool">
              <span className="gn-tool-dot" style={{ background: t.color }} aria-hidden="true" />
              <span><span className="gn-tool-label">{t.label}</span><span className="gn-tool-desc">{t.desc}</span></span>
            </Link>
          ))}
          {profile && <button className="gn-out" style={{ marginTop: '18px', width: '100%' }} onClick={() => signOut()}>Sign out</button>}
        </div>
      )}

      <style>{`
        .gn-nav { position: sticky; top: 0; z-index: 100; background: rgba(4,7,10,.86); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(232,243,246,.07); }
        .gn-nav-bar { max-width: 1400px; margin: 0 auto; height: 60px; display: flex; align-items: center; gap: 18px; padding: 0 clamp(16px, 3vw, 24px); }
        .gn-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; flex: none; }
        .gn-mark { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #04070a; background: #e8f3f6; padding: 5px 6px; clip-path: polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%); }
        .gn-brand-text { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; letter-spacing: .28em; color: #e8f3f6; }
        .gn-nav-links { display: flex; align-items: center; gap: 4px; flex: 1; min-width: 0; }
        .gn-link { font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px; font-weight: 500; color: #93a8b4; background: none; border: 0; padding: 8px 12px; border-radius: 10px; cursor: pointer; text-decoration: none; white-space: nowrap; transition: color .15s, background .15s; }
        .gn-link:hover, .gn-link[aria-expanded="true"] { color: #e8f3f6; background: rgba(232,243,246,.05); }
        .gn-link[aria-current="page"], .gn-link[data-active="true"] { color: #e8f3f6; box-shadow: inset 0 -2px 0 #00d4ff; border-radius: 10px 10px 0 0; }
        .gn-link:focus-visible, .gn-out:focus-visible, .gn-burger:focus-visible, .gn-me:focus-visible { outline: 2px solid #00d4ff; outline-offset: 2px; }
        .gn-caret { font-size: 10px; margin-left: 2px; opacity: .7; }
        .gn-pop { position: absolute; top: calc(100% + 10px); left: 0; z-index: 200; width: 320px; padding: 10px; border-radius: 18px; background: linear-gradient(160deg,#17242e,#0f1820); border: 1px solid rgba(232,243,246,.07);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 24px 60px rgba(0,0,0,.7); }
        .gn-pop-wide { width: min(640px, 92vw); }
        .gn-pop-head { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600; letter-spacing: .22em; color: #7d93a0; padding: 6px 8px 10px; }
        .gn-mod-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; }
        .gn-mod { display: flex; align-items: center; gap: 6px; border-radius: 12px; padding: 2px; }
        .gn-mod[data-here="true"] { background: rgba(232,243,246,.05); }
        .gn-mod-main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px; text-decoration: none; transition: background .15s; }
        .gn-mod-main:hover { background: rgba(232,243,246,.06); }
        .gn-mod-code { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: var(--acc); width: 20px; flex: none; }
        .gn-mod-title { font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px; color: #e8f3f6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
        .gn-mod-pct { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #00ff41; flex: none; }
        .gn-mod-lab { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: .14em; color: #93a8b4; text-decoration: none; padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(232,243,246,.1); flex: none; }
        .gn-mod-lab:hover { color: var(--acc); border-color: var(--acc); }
        .gn-tool { display: flex; gap: 12px; align-items: flex-start; padding: 10px; border-radius: 12px; text-decoration: none; transition: background .15s; }
        .gn-tool:hover, .gn-tool[aria-current="page"] { background: rgba(232,243,246,.06); }
        .gn-tool-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex: none; }
        .gn-tool-label { display: block; font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px; font-weight: 600; color: #e8f3f6; }
        .gn-tool-desc { display: block; font-family: 'DM Sans', system-ui, sans-serif; font-size: 12.5px; color: #7d93a0; margin-top: 2px; }
        .gn-crumb { display: flex; align-items: center; gap: 4px; margin-left: 10px; padding: 4px; border-radius: 12px; background: rgba(232,243,246,.04); border: 1px solid rgba(232,243,246,.07); }
        .gn-crumb-code { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: var(--acc); padding: 0 8px; letter-spacing: .1em; }
        .gn-crumb a { font-family: 'DM Sans', system-ui, sans-serif; font-size: 13px; color: #93a8b4; text-decoration: none; padding: 5px 10px; border-radius: 9px; }
        .gn-crumb a[data-on="true"] { color: #04070a; background: var(--acc); font-weight: 600; }
        .gn-nav-right { display: flex; align-items: center; gap: 10px; flex: none; }
        .gn-me { display: flex; flex-direction: column; align-items: flex-end; text-decoration: none; padding: 4px 10px; border-radius: 10px; }
        .gn-me:hover { background: rgba(232,243,246,.05); }
        .gn-me-name { font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px; font-weight: 600; color: #e8f3f6; }
        .gn-me-xp { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #00d4ff; letter-spacing: .08em; }
        .gn-out { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #93a8b4; background: none; border: 1px solid #5b6f7b; padding: 9px 12px; cursor: pointer; text-decoration: none; transition: color .15s, border-color .15s; }
        .gn-out:hover { color: #e8f3f6; border-color: #00d4ff; }
        .gn-burger { display: none; width: 42px; height: 42px; border-radius: 12px; background: rgba(232,243,246,.05); border: 1px solid rgba(232,243,246,.1); cursor: pointer; place-items: center; }
        .gn-burger span, .gn-burger span::before, .gn-burger span::after { display: block; width: 18px; height: 2px; background: #e8f3f6; border-radius: 2px; position: relative; transition: transform .2s; content: ''; }
        .gn-burger span::before { position: absolute; top: -6px; } .gn-burger span::after { position: absolute; top: 6px; }
        .gn-burger span[data-open="true"] { background: transparent; }
        .gn-burger span[data-open="true"]::before { transform: translateY(6px) rotate(45deg); } .gn-burger span[data-open="true"]::after { transform: translateY(-6px) rotate(-45deg); }
        .gn-mobile { position: fixed; top: 61px; left: 0; right: 0; bottom: 0; z-index: 9999; overflow-y: auto; padding: 16px 16px 48px; background: #04070a; }
        .gn-mobile-me { display: flex; flex-direction: column; text-decoration: none; padding: 14px; border-radius: 16px; margin-bottom: 10px; background: linear-gradient(160deg,#1c2a35,#0f1820); }
        .gn-mobile-link { display: block; font-family: 'DM Sans', system-ui, sans-serif; font-size: 16px; font-weight: 500; color: #e8f3f6; text-decoration: none; padding: 12px 10px; border-bottom: 1px solid rgba(232,243,246,.06); }
        @media (max-width: 1080px) { .gn-crumb { display: none } }
        @media (max-width: 860px) { .gn-nav-links, .gn-me, .gn-nav-right > .gn-out { display: none } .gn-burger { display: grid } .gn-nav-bar { justify-content: space-between } }
      `}</style>
    </nav>
  )
}

function OfflineBanner() {
  const [offline, setOffline] = useState(false)
  useEffect(() => {
    const on = () => setOffline(true)
    const off = () => setOffline(false)
    window.addEventListener('offline', on)
    window.addEventListener('online', off)
    setOffline(!navigator.onLine)
    return () => { window.removeEventListener('offline', on); window.removeEventListener('online', off) }
  }, [])
  if (!offline) return null
  return (
    <div style={{ background: 'rgba(255,179,71,0.08)', borderBottom: '1px solid rgba(255,179,71,0.25)', padding: '6px 16px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#ffb347', letterSpacing: '0.1em' }}>
      OFFLINE MODE — AI features and cloud sync unavailable. Progress saves locally.
    </div>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const path = usePathname()

  // Bare-chrome pages — no nav, no floating widgets, no dashboard bleed-through
  const isBareChrome = path === '/welcome' || path.startsWith('/auth')

  if (isBareChrome) {
    return (
      <main style={{ minHeight: '100vh' }}>
        <ErrorBoundary label="Page">{children}</ErrorBoundary>
      </main>
    )
  }

  return (
    <MobileMenuContext.Provider value={mobileMenuOpen}>
      <OfflineBanner />
      <Nav onMobileMenuChange={setMobileMenuOpen} />
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 80px)' }}>
        <ErrorBoundary label="Page">{children}</ErrorBoundary>
      </main>
      <footer style={{ borderTop: '1px solid rgba(232,243,246,.06)', padding: '20px 16px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#7d93a0', letterSpacing: '.18em' }}>
          GHOSTNET · FOR EDUCATION AND AUTHORISED TESTING ONLY · <a href="/privacy" style={{ color: '#93a8b4' }}>PRIVACY</a> · <a href="/terms" style={{ color: '#93a8b4' }}>TERMS</a>
        </span>
      </footer>
      {!mobileMenuOpen && (
        <>
          <ErrorBoundary label="Ghost Agent"><GhostAgent /></ErrorBoundary>
          <ErrorBoundary label="Progress Tracker"><ProgressTracker /></ErrorBoundary>
          <ErrorBoundary label="Cheat Sheet"><CheatSheet /></ErrorBoundary>
          <ErrorBoundary label="CVE Feed"><CVEFeed /></ErrorBoundary>
          <ErrorBoundary label="Recall"><RecallPopup /></ErrorBoundary>
        </>
      )}
    </MobileMenuContext.Provider>
  )
}

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  )
}
