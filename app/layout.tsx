'use client'
import './globals.css'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import GhostAgent from './components/GhostAgent'
import ProgressTracker from './components/ProgressTracker'
import CheatSheet from './components/CheatSheet'
import CVEFeed from './components/CVEFeed'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './components/AuthProvider'
import { createClient } from '../lib/supabase/client'

function NavAuth() {
  const [email, setEmail] = useState<string | null>(null)
  const router = useRouter()
  const mono = 'JetBrains Mono, monospace'

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.user_metadata?.username || data.user?.email || null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.user_metadata?.username || session?.user?.email || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setEmail(null)
    router.push('/')
    router.refresh()
  }

  if (email) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <Link href="/profile" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '7.5px', color: '#00ff41', letterSpacing: '0.08em', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '2px 8px', borderRadius: '3px', border: '1px solid rgba(0,255,65,0.25)', background: 'rgba(0,255,65,0.05)' }}>
          ◈ {email.toUpperCase()}
        </Link>
        <button
          onClick={handleLogout}
          style={{ background: 'transparent', border: '1px solid rgba(255,65,54,0.4)', borderRadius: '3px', padding: '2px 8px', cursor: 'pointer', fontFamily: mono, fontSize: '7px', color: '#ff4136', letterSpacing: '0.1em', transition: 'all 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,65,54,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = '#ff4136' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,65,54,0.4)' }}
        >
          LOGOUT
        </button>
      </div>
    )
  }

  return (
    <Link href="/auth" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '7.5px', letterSpacing: '0.1em', padding: '3px 10px', borderRadius: '3px', color: '#00ff41', border: '1px solid rgba(0,255,65,0.3)', background: 'rgba(0,255,65,0.05)', flexShrink: 0, transition: 'all 0.15s' }}>
      LOGIN
    </Link>
  )
}

const ALL_MODULES = [
  { href: '/modules/tor',                label: 'Tor & Dark Web',          color: '#00ff41', code: '01' },
  { href: '/modules/osint',              label: 'OSINT & Surveillance',     color: '#00d4ff', code: '02' },
  { href: '/modules/crypto',             label: 'Crypto & Blockchain',      color: '#ffb347', code: '03' },
  { href: '/modules/offensive',          label: 'Offensive Security',       color: '#bf5fff', code: '04' },
  { href: '/modules/active-directory',   label: 'Active Directory',         color: '#ff4136', code: '05' },
  { href: '/modules/web-attacks',        label: 'Web Attacks Advanced',     color: '#00d4ff', code: '06' },
  { href: '/modules/malware',            label: 'Malware Analysis',         color: '#00ff41', code: '07' },
  { href: '/modules/network-attacks',    label: 'Network Attacks',          color: '#00ffff', code: '08' },
  { href: '/modules/cloud-security',     label: 'Cloud Security',           color: '#ff9500', code: '09' },
  { href: '/modules/social-engineering', label: 'Social Engineering',       color: '#ff6ec7', code: '10' },
  { href: '/modules/red-team',           label: 'Red Team Ops',             color: '#ff3333', code: '11' },
  { href: '/modules/wireless-attacks',   label: 'Wireless Attacks',         color: '#aaff00', code: '12' },
  { href: '/modules/mobile-security',    label: 'Mobile Security',          color: '#7c4dff', code: '13' },
]

const TOOLS = [
  { href: '/intel',         label: 'THREAT INTEL',     desc: 'Live CVE feed & advisories',      color: '#ff4136' },
  { href: '/tools',         label: 'TOOL REFERENCE',   desc: '200+ commands & cheatsheets',     color: '#00ff41' },
  { href: '/terminal',      label: 'RESEARCH TERMINAL',desc: 'Interactive command runner',       color: '#00d4ff' },
  { href: '/payload',       label: 'PAYLOAD GENERATOR',desc: '40+ attack payloads',             color: '#bf5fff' },
  { href: '/crypto-tracer', label: 'BLOCKCHAIN TRACER', desc: 'Trace transactions on-chain',    color: '#ffb347' },
  { href: '/ctf',             label: 'CTF TOOLKIT',        desc: 'Capture-the-flag resources',      color: '#00ffff' },
  { href: '/report-generator', label: 'REPORT GENERATOR', desc: 'AI pentest report builder',       color: '#00ff41' },
  { href: '/attack-path',    label: 'ATTACK PATH',        desc: 'MITRE ATT&CK kill chain builder', color: '#ff4136' },
  { href: '/shodan',         label: 'SHODAN BUILDER',     desc: 'Shodan query constructor',        color: '#00d4ff' },
  { href: '/auth',           label: 'ACCOUNT',            desc: 'Login or create your account',    color: '#00ff41' },
]

function Nav() {
  const path = usePathname()
  const [modulesOpen, setModulesOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const modulesRef = useRef<HTMLDivElement>(null)
  const toolsRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)

  const activeModule = ALL_MODULES.find(m => path.startsWith(m.href))
  const isLab = path.includes('/lab')
  const isDash = path === '/'

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modulesRef.current && !modulesRef.current.contains(e.target as Node)) setModulesOpen(false)
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false)
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setMobileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => { setMobileOpen(false); setModulesOpen(false); setToolsOpen(false) }, [path])

  return (
    <nav style={{ background: '#030803', borderBottom: '1px solid #0d1f0d', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '4px', height: '54px' }}>

        {/* LOGO */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginRight: '8px', flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', border: '1px solid #00ff41', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(0,255,65,0.25)', background: 'rgba(0,255,65,0.05)' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#00ff41', fontWeight: 700 }}>GN</span>
          </div>
          <div className="nav-logo-text">
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#00ff41', fontWeight: 700, letterSpacing: '0.12em', lineHeight: 1 }}>GHOSTNET</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a6a3a', letterSpacing: '0.18em', lineHeight: 1, marginTop: '3px' }}>SECURITY RESEARCH PLATFORM</div>
          </div>
        </Link>

        {/* DESKTOP NAV — hidden on mobile */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
          {/* SEPARATOR */}
          <div style={{ width: '1px', height: '22px', background: '#0d1f0d', flexShrink: 0, marginRight: '4px' }} />

          {/* DASHBOARD */}
          <Link href="/" style={{
            textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px',
            letterSpacing: '0.12em', padding: '5px 11px', borderRadius: '4px', flexShrink: 0,
            color: isDash ? '#00ff41' : '#4a9a4a',
            background: isDash ? 'rgba(0,255,65,0.07)' : 'transparent',
            border: isDash ? '1px solid rgba(0,255,65,0.25)' : '1px solid transparent',
            transition: 'all 0.15s',
          }}>
            ⌂ DASHBOARD
          </Link>

          {/* LEADERBOARD */}
          <Link href="/leaderboard" style={{
            textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px',
            letterSpacing: '0.12em', padding: '5px 11px', borderRadius: '4px', flexShrink: 0,
            color: '#00d4ff',
            background: 'transparent',
            border: '1px solid transparent',
            transition: 'all 0.15s',
          }}>
            ◈ BOARD
          </Link>

          {/* MODULES DROPDOWN */}
          <div ref={modulesRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button onClick={() => { setModulesOpen(o => !o); setToolsOpen(false) }} style={{
              background: modulesOpen || !!activeModule ? 'rgba(0,255,65,0.07)' : 'transparent',
              border: modulesOpen || !!activeModule ? '1px solid rgba(0,255,65,0.22)' : '1px solid transparent',
              borderRadius: '4px', cursor: 'pointer', padding: '5px 11px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.12em',
              color: modulesOpen || !!activeModule ? '#00ff41' : '#4a9a4a',
              display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s',
            }}>
              ◈ MODULES
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,255,65,0.12)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '3px', padding: '1px 5px', fontSize: '7px', color: '#00ff41', fontWeight: 700 }}>13</span>
              <span style={{ fontSize: '5px', opacity: 0.5, display: 'inline-block', transform: modulesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
            </button>

            {modulesOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: 'min(560px, 95vw)', background: '#040d04', border: '1px solid #1a3a1a', borderRadius: '8px', zIndex: 200, boxShadow: '0 20px 50px rgba(0,0,0,0.85)', padding: '14px', overflow: 'hidden' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.28em', marginBottom: '10px' }}>
                  ALL 13 MODULES — CLICK CONCEPT TO LEARN · LAB TO PRACTICE
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                  {ALL_MODULES.map(m => {
                    const active = path.startsWith(m.href)
                    return (
                      <div key={m.href} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', borderRadius: '5px', border: active ? `1px solid ${m.color}25` : '1px solid #0a170a', background: active ? `${m.color}07` : '#030a03' }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a6a3a', flexShrink: 0, minWidth: '16px' }}>{m.code}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: m.color, flex: 1, letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</span>
                        <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                          <Link href={m.href} onClick={() => setModulesOpen(false)} style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '6.5px', padding: '2px 6px', borderRadius: '2px', letterSpacing: '0.08em', color: !isLab && active ? m.color : '#5a8a5a', background: !isLab && active ? `${m.color}12` : 'transparent', border: `1px solid ${!isLab && active ? `${m.color}28` : '#1a3a1a'}` }}>CONCEPT</Link>
                          <Link href={`${m.href}/lab`} onClick={() => setModulesOpen(false)} style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '6.5px', padding: '2px 6px', borderRadius: '2px', letterSpacing: '0.08em', color: isLab && active ? m.color : '#5a8a5a', background: isLab && active ? `${m.color}12` : 'transparent', border: `1px solid ${isLab && active ? `${m.color}28` : '#1a3a1a'}` }}>LAB</Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* TOOLS DROPDOWN */}
          <div ref={toolsRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button onClick={() => { setToolsOpen(o => !o); setModulesOpen(false) }} style={{
              background: toolsOpen ? 'rgba(0,255,65,0.07)' : 'transparent',
              border: toolsOpen ? '1px solid rgba(0,255,65,0.22)' : '1px solid transparent',
              borderRadius: '4px', cursor: 'pointer', padding: '5px 11px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.12em',
              color: toolsOpen ? '#00ff41' : '#4a9a4a',
              display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s',
            }}>
              ⚡ TOOLS
              <span style={{ fontSize: '5px', opacity: 0.5, display: 'inline-block', transform: toolsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
            </button>

            {toolsOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: '300px', background: '#040d04', border: '1px solid #1a3a1a', borderRadius: '8px', zIndex: 200, boxShadow: '0 20px 50px rgba(0,0,0,0.85)', padding: '12px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.28em', marginBottom: '8px' }}>INTERACTIVE TOOLS</div>
                {TOOLS.map(t => (
                  <Link key={t.href} href={t.href} onClick={() => setToolsOpen(false)} style={{
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 10px', borderRadius: '5px', marginBottom: '2px',
                    background: path === t.href ? `${t.color}08` : 'transparent',
                    border: path === t.href ? `1px solid ${t.color}20` : '1px solid transparent',
                    transition: 'background 0.1s',
                  }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: t.color, boxShadow: `0 0 5px ${t.color}`, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: t.color, letterSpacing: '0.08em', fontWeight: 600 }}>{t.label}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#4a7a4a', marginTop: '1px' }}>{t.desc}</div>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#4a7a4a' }}>→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE MODULE PILL — breadcrumb when inside a module */}
          {activeModule && (
            <>
              <div style={{ width: '1px', height: '20px', background: '#0d1f0d', margin: '0 6px', flexShrink: 0 }} />
              <div className="nav-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a3a1a' }}>MOD-{activeModule.code}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: activeModule.color, letterSpacing: '0.04em', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeModule.label.toUpperCase()}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a3a1a' }}>›</span>
                <Link href={activeModule.href} style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', padding: '2px 8px', borderRadius: '3px', color: !isLab ? activeModule.color : '#5a8a5a', background: !isLab ? `${activeModule.color}10` : 'transparent', border: `1px solid ${!isLab ? `${activeModule.color}28` : '#1a3a1a'}`, letterSpacing: '0.08em' }}>CONCEPT</Link>
                <Link href={`${activeModule.href}/lab`} style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', padding: '2px 8px', borderRadius: '3px', color: isLab ? activeModule.color : '#5a8a5a', background: isLab ? `${activeModule.color}10` : 'transparent', border: `1px solid ${isLab ? `${activeModule.color}28` : '#1a3a1a'}`, letterSpacing: '0.08em' }}>LAB</Link>
              </div>
            </>
          )}

          <div style={{ flex: 1 }} />

          {/* GHOST STATUS + USER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff41', boxShadow: '0 0 8px rgba(0,255,65,0.8)' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a8a3a', letterSpacing: '0.1em' }}>GHOST ONLINE</span>
            </div>
            <NavAuth />
          </div>
        </div>

        {/* MOBILE HAMBURGER — shown only on mobile */}
        <div className="nav-mobile" style={{ display: 'none', marginLeft: 'auto', alignItems: 'center', gap: '8px' }} ref={mobileRef}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00ff41', boxShadow: '0 0 6px rgba(0,255,65,0.8)' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a5a1a' }}>ONLINE</span>
          </div>
          <button
            onClick={() => setMobileOpen(o => !o)}
            style={{ background: mobileOpen ? 'rgba(0,255,65,0.1)' : 'transparent', border: '1px solid rgba(0,255,65,0.25)', borderRadius: '5px', padding: '7px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Toggle navigation"
          >
            <span style={{ display: 'block', width: '16px', height: '1px', background: '#00ff41', transition: 'transform 0.2s', transform: mobileOpen ? 'translateY(5px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: '16px', height: '1px', background: '#00ff41', opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
            <span style={{ display: 'block', width: '16px', height: '1px', background: '#00ff41', transition: 'transform 0.2s', transform: mobileOpen ? 'translateY(-5px) rotate(-45deg)' : 'none' }} />
          </button>

          {/* MOBILE MENU PANEL */}
          {mobileOpen && (
            <div style={{ position: 'fixed', top: '54px', left: 0, right: 0, bottom: 0, background: '#030803', zIndex: 9999, overflowY: 'auto', padding: '1rem', borderTop: '1px solid #0d1f0d' }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '6px', marginBottom: '6px', background: isDash ? 'rgba(0,255,65,0.07)' : 'transparent', border: isDash ? '1px solid rgba(0,255,65,0.2)' : '1px solid #0d1f0d' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00ff41', letterSpacing: '0.1em' }}>⌂ DASHBOARD</span>
              </Link>

              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.28em', padding: '12px 12px 6px', marginTop: '8px' }}>◈ MODULES</div>
              {ALL_MODULES.map(m => {
                const active = path.startsWith(m.href)
                return (
                  <div key={m.href} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '5px', marginBottom: '3px', border: active ? `1px solid ${m.color}22` : '1px solid #0a170a', background: active ? `${m.color}06` : 'transparent' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a3a1a', minWidth: '18px' }}>{m.code}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: m.color, flex: 1 }}>{m.label}</span>
                    <Link href={m.href} style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', padding: '3px 8px', borderRadius: '3px', color: !isLab && active ? m.color : '#253525', border: `1px solid ${!isLab && active ? `${m.color}30` : '#0d1d0d'}` }}>CONCEPT</Link>
                    <Link href={`${m.href}/lab`} style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', padding: '3px 8px', borderRadius: '3px', color: isLab && active ? m.color : '#253525', border: `1px solid ${isLab && active ? `${m.color}30` : '#0d1d0d'}` }}>LAB</Link>
                  </div>
                )
              })}

              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.28em', padding: '12px 12px 6px', marginTop: '8px' }}>⚡ TOOLS</div>
              {TOOLS.map(t => (
                <Link key={t.href} href={t.href} style={{
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '5px', marginBottom: '3px',
                  background: path === t.href ? `${t.color}08` : 'transparent',
                  border: path === t.href ? `1px solid ${t.color}22` : '1px solid #0a170a',
                }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: t.color, letterSpacing: '0.08em', fontWeight: 600 }}>{t.label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a3a1a', marginTop: '2px' }}>{t.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes glow{0%,100%{opacity:1}50%{opacity:0.5}}
        @media(max-width:768px){
          .nav-desktop{display:none!important}
          .nav-mobile{display:flex!important}
        }
        @media(max-width:480px){
          .nav-logo-text{display:none}
        }
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <AuthProvider>
          <OfflineBanner />
          <Nav />
          <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 80px)' }}>
            <ErrorBoundary label="Page">{children}</ErrorBoundary>
          </main>
          <footer style={{ borderTop: '1px solid #0a180a', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#3a6a3a', letterSpacing: '0.25em' }}>
              GHOSTNET // SECURITY RESEARCH PLATFORM // FOR EDUCATIONAL AND AUTHORISED USE ONLY
            </span>
          </footer>
          <ErrorBoundary label="Ghost Agent"><GhostAgent /></ErrorBoundary>
          <ErrorBoundary label="Progress Tracker"><ProgressTracker /></ErrorBoundary>
          <ErrorBoundary label="Cheat Sheet"><CheatSheet /></ErrorBoundary>
          <ErrorBoundary label="CVE Feed"><CVEFeed /></ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  )
}
