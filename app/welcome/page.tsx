'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { looksSignedIn } from '../../lib/client/api'
import { C, Decode, HackStyles, TermLines, TermLine, Typed, mono, useReducedMotion } from '../components/hack/Hack'
import CityNet from '../components/hack/CityNet'
import Profiler from './Profiler'
import Briefing from './Briefing'
import NetworkBreach from './NetworkBreach'

type Phase = 'intercept' | 'title' | 'profile' | 'briefing' | 'breach'

const INTERCEPT: TermLine[] = [
  { t: 'ssh ghost@relay-07.onion -p 2222', kind: 'cmd', speed: 30 },
  { t: '[*] onion circuit built · 3 hops · 412ms', c: C.dim, pause: 260 },
  { t: '[*] tunnel encrypted · chacha20-poly1305', c: C.dim, pause: 140 },
  { t: './intercept --target visitor --silent', kind: 'cmd', speed: 30 },
  { t: '[+] signal acquired', c: C.green, pause: 380 },
  { t: '[+] fingerprinting device…', c: C.white, pause: 220 },
  { t: '0x7f3a  4748 4f53 544e 4554 2f2f 6e6f 6465 3037', c: C.faint, pause: 40 },
  { t: '0x7f4a  6f70 6572 6174 6f72 2e75 6e6b 6e6f 776e', c: C.faint, pause: 40 },
  { t: '0x7f5a  6163 6365 7373 2e72 6571 7569 7265 6421', c: C.faint, pause: 40 },
  { t: '[!] handshake complete. opening channel', c: C.amber, pause: 420 },
]

const STEPS: { id: Phase; label: string }[] = [
  { id: 'intercept', label: 'INTERCEPT' },
  { id: 'profile', label: 'PROFILE' },
  { id: 'briefing', label: 'BRIEFING' },
  { id: 'breach', label: 'BREACH' },
]

export default function WelcomePage() {
  const router = useRouter()
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('intercept')
  const [returning, setReturning] = useState(false)
  const [briefed, setBriefed] = useState(false)
  const [cut, setCut] = useState(0)
  const [clock, setClock] = useState('')
  const [titleReady, setTitleReady] = useState(false)

  // Already signed in: skip the splash and go where they were heading.
  useEffect(() => {
    if (looksSignedIn()) {
      const from = new URLSearchParams(window.location.search).get('from')
      router.replace(from && from.startsWith('/') && !from.startsWith('//') ? from : '/')
      return
    }
    try {
      setReturning(localStorage.getItem('gn_operator') === '1')
      setBriefed(localStorage.getItem('gn_briefed_v2') === '1')
    } catch {}
  }, [router])

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const go = (p: Phase) => { setCut(c => c + 1); setPhase(p) }

  function authTarget(mode: 'register' | 'login') {
    const from = new URLSearchParams(window.location.search).get('from')
    return '/auth?mode=' + mode + (from && from.startsWith('/') && !from.startsWith('//') ? '&from=' + encodeURIComponent(from) : '')
  }

  function begin() { go(briefed ? 'breach' : 'profile') }
  function briefingDone() { try { localStorage.setItem('gn_briefed_v2', '1') } catch {} ; setBriefed(true); go('breach') }
  function onBreached() { router.push(authTarget(returning ? 'login' : 'register')) }
  function signIn(e: React.MouseEvent) { e.preventDefault(); router.push(authTarget('login')) }

  const stepIdx = phase === 'title' ? 0 : STEPS.findIndex(s => s.id === phase)

  return (
    <div className="wl-root">
      <HackStyles />
      <CityNet intensity={phase === 'breach' ? 1.6 : phase === 'intercept' ? 0.4 : 1} />
      <div className="hx-vig" aria-hidden="true" />
      <div className="hx-scan" aria-hidden="true" />
      <div className="hx-noise" aria-hidden="true" />
      {!reduced && <div className="wl-crt" aria-hidden="true" />}
      {cut > 0 && <div key={cut} className="hx-burst" aria-hidden="true" />}

      {/* HUD */}
      <header className="wl-hud">
        <a href="/welcome" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} aria-label="GHOSTNET">
          <span className="wl-mark">GN</span>
          <span style={{ fontFamily: mono, fontSize: '.72rem', letterSpacing: '.3em', color: C.white, fontWeight: 700 }}>GHOSTNET</span>
          <span className="wl-hide-sm" style={{ fontFamily: mono, fontSize: '.58rem', letterSpacing: '.2em', color: C.faint }}>// NODE 07</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="wl-hide-sm" style={{ fontFamily: mono, fontSize: '.62rem', letterSpacing: '.2em', color: C.dim }}>{clock}</span>
          <a href="/auth?mode=login" onClick={signIn} className="hx-link">SIGN IN</a>
        </div>
      </header>

      <main className="wl-main">
        {phase === 'intercept' && (
          <div className="hx-in" style={{ width: '100%', maxWidth: '560px' }}>
            <TermLines lines={INTERCEPT} instant={reduced} onDone={() => setTimeout(() => go('title'), reduced ? 0 : 450)} style={{ fontSize: 'clamp(.7rem, 2.6vw, .8rem)' }} />
            <button className="hx-link" style={{ marginTop: '22px' }} onClick={() => go('title')}>SKIP ▸</button>
          </div>
        )}

        {phase === 'title' && (
          <div className="hx-in" style={{ textAlign: 'center', width: '100%', maxWidth: '760px' }}>
            <div style={{ fontFamily: mono, fontSize: '.6rem', letterSpacing: '.5em', color: C.cyan, marginBottom: '14px' }}>CHANNEL OPEN</div>
            <h1 className="hx-glitch" data-text="GHOSTNET" style={{ margin: 0, fontFamily: mono, fontWeight: 800, fontSize: 'clamp(3rem, 13vw, 6.4rem)', letterSpacing: '.14em', color: C.white, lineHeight: 1, textShadow: '0 0 40px rgba(0,212,255,.25)' }}>
              <Decode text="GHOSTNET" duration={reduced ? 1 : 900} instant={reduced} />
            </h1>
            <p style={{ fontFamily: mono, fontSize: 'clamp(.72rem, 2.6vw, .92rem)', letterSpacing: '.18em', color: '#c9d9df', margin: '22px auto 0', minHeight: '3.4em', maxWidth: '560px', lineHeight: 1.7 }}>
              <Typed text="LEARN HOW SYSTEMS BREAK. THEN LEARN TO DEFEND THEM." speed={24} delay={reduced ? 0 : 900} instant={reduced} onDone={() => setTitleReady(true)} />
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', margin: '6px 0 30px', opacity: titleReady ? 1 : 0, transition: 'opacity .5s' }}>
              {['13 MODULES', '13 LABS', '5,450 XP', '5 RANKS'].map(t => <span key={t} className="hx-tag" style={{ color: C.dim }}>{t}</span>)}
            </div>
            <div style={{ minHeight: '110px' }}>
              {titleReady && (
                <div className="hx-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <button className="hx-btn" onClick={begin} autoFocus style={{ padding: '17px 34px' }}>{briefed ? 'BREACH THE GATEWAY ▸' : 'JACK IN ▸'}</button>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {briefed && <button className="hx-link" onClick={() => go('briefing')}>REPLAY BRIEFING</button>}
                    <a href="/auth?mode=login" onClick={signIn} className="hx-link">{returning ? 'WELCOME BACK · SIGN IN' : 'ALREADY AN OPERATOR? SIGN IN'}</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'profile' && <Profiler onDone={() => go('briefing')} onSkip={() => go('briefing')} instant={reduced} />}
        {phase === 'briefing' && <Briefing onDone={briefingDone} onSkip={briefingDone} instant={reduced} />}

        {phase === 'breach' && (
          <div className="hx-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '.6rem', letterSpacing: '.4em', color: C.red, marginBottom: '6px' }}>// BREACH PROTOCOL ARMED</div>
            <h1 style={{ margin: '0 0 6px', fontFamily: mono, fontSize: 'clamp(1.1rem, 4.4vw, 1.7rem)', letterSpacing: '.14em', color: C.white, textAlign: 'center' }}>
              <Decode text="HACK YOUR WAY IN" duration={600} instant={reduced} />
            </h1>
            <NetworkBreach onBreached={onBreached} reduced={reduced} />
          </div>
        )}
      </main>

      {/* progress rail */}
      <footer className="wl-rail" aria-label="Progress">
        {STEPS.map((s, i) => (
          <span key={s.id} style={{ color: i === stepIdx ? C.white : i < stepIdx ? C.cyan : C.faint }}>
            <b style={{ color: i === stepIdx ? C.cyan : 'inherit' }}>{'0' + (i + 1)}</b> {s.label}
          </span>
        ))}
      </footer>

      <style>{`
        .wl-root { position: fixed; inset: 0; z-index: 9999; background: #04070a; color: #e8f3f6; overflow-x: hidden; overflow-y: auto; }
        .wl-hud { position: sticky; top: 0; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 16px clamp(16px, 4vw, 32px); background: rgba(4,7,10,.88); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-bottom: 1px solid rgba(232,243,246,.05); }
        .wl-mark { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #04070a; background: #e8f3f6; padding: 5px 6px; clip-path: polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%); }
        .wl-main { position: relative; z-index: 10; min-height: calc(100% - 120px); display: flex; align-items: center; justify-content: center; padding: 18px 16px 110px; box-sizing: border-box; }
        .wl-main::before { content: ''; position: fixed; inset: 0; z-index: -1; pointer-events: none; background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(4,7,10,.82), rgba(4,7,10,.35) 70%, transparent); }
        .wl-rail { position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; display: flex; justify-content: center; gap: clamp(12px, 4vw, 34px); padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: .56rem; letter-spacing: .24em; background: rgba(4,7,10,.9); border-top: 1px solid rgba(232,243,246,.05); }
        .wl-rail span { transition: color .3s; white-space: nowrap; }
        .wl-crt { position: fixed; inset: 0; z-index: 60; pointer-events: none; background: #e8f3f6; animation: wlCrt .7s cubic-bezier(.7,0,.3,1) both; }
        @keyframes wlCrt { 0% { opacity: 1; transform: scale(1, .004) } 35% { opacity: 1; transform: scale(1, .004) } 60% { opacity: .9; transform: scale(1, 1) } 100% { opacity: 0; transform: scale(1, 1) } }
        @media (max-width: 560px) { .wl-hide-sm { display: none } .wl-rail { font-size: .5rem; letter-spacing: .14em; gap: 10px } }
      `}</style>
    </div>
  )
}
