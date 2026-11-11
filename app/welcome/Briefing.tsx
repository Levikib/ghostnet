'use client'
import React, { useEffect, useState } from 'react'

const mono = 'JetBrains Mono, monospace'

const DOSSIERS = [
  {
    code: '01',
    tag: 'THE NETWORK',
    color: '#00ff41',
    title: '13 attack surfaces. One operator.',
    body: 'Tor and OSINT to Active Directory, cloud, wireless and red team operations. Every module is a sealed sector of the network, written for beginners and deep enough for professionals.',
    stats: [['13', 'MODULES'], ['100+', 'CHAPTERS'], ['13', 'GUIDED LABS']],
  },
  {
    code: '02',
    tag: 'THE TRAINING',
    color: '#00d4ff',
    title: 'Read the codex. Run the lab. Earn the rank.',
    body: 'Each module pairs concept chapters with a hands-on terminal lab. Every chapter and every lab step earns XP, taking you from Ghost to Specter, Phantom, Wraith and finally Legend.',
    stats: [['5,450', 'XP AVAILABLE'], ['5', 'RANKS'], ['AI', 'FIELD GUIDE']],
  },
  {
    code: '03',
    tag: 'YOUR IDENTITY',
    color: '#ff4136',
    title: 'An operator profile that remembers everything.',
    body: 'Your progress, streak, labs and XP follow your account to any device. Return in three weeks and pick up exactly where you left off. Secured the way we teach: verified email, two-factor and new-device alerts.',
    stats: [['2FA', 'AUTHENTICATOR'], ['SCRYPT', 'PASSWORDS'], ['24/7', 'DEVICE ALERTS']],
  },
]

function Typed({ text, speed = 14 }: { text: string; speed?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setN(text.length); return }
    const t = setInterval(() => setN(v => (v >= text.length ? (clearInterval(t), v) : v + 2)), speed)
    return () => clearInterval(t)
  }, [text, speed])
  return <>{text.slice(0, n)}<span style={{ opacity: n < text.length ? 1 : 0 }}>▌</span></>
}

export default function Briefing({ onDone, onSkip }: { onDone: () => void; onSkip: () => void }) {
  const [i, setI] = useState(0)
  const d = DOSSIERS[i]
  const last = i === DOSSIERS.length - 1

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); last ? onDone() : setI(v => v + 1) }
      if (e.key === 'ArrowLeft' && i > 0) setI(v => v - 1)
      if (e.key === 'Escape') onSkip()
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [i, last, onDone, onSkip])

  return (
    <div style={{ width: '100%', maxWidth: '640px', animation: 'fadeSlideUp .45s ease both' }}>
      <style>{`
        .bf-card { position: relative; padding: clamp(20px, 5vw, 34px); background: linear-gradient(135deg, rgba(4,16,6,0.92), rgba(2,8,3,0.92)); border: 1px solid rgba(0,255,65,0.18);
          clip-path: polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 26px 100%, 0 calc(100% - 26px)); }
        .bf-card::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0 1px, transparent 1px 3px); pointer-events: none; }
        .bf-shard { position: absolute; width: 0; height: 0; border-style: solid; opacity: .5; }
        .bf-btn { font-family: 'JetBrains Mono', monospace; letter-spacing: .25em; font-size: .72rem; cursor: pointer; padding: 12px 26px; border-radius: 2px; transition: all .18s; }
        .bf-btn:hover { transform: translateY(-1px); filter: brightness(1.2); }
        @keyframes bfIn { from { opacity: 0; transform: translateX(18px) skewX(-6deg) } to { opacity: 1; transform: none } }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.3em', color: '#2f6f3f' }}>
        <span>// MISSION BRIEFING</span>
        <span>DOSSIER {d.code} / 03</span>
      </div>

      <div key={i} className="bf-card" style={{ borderColor: d.color + '40', boxShadow: '0 0 60px ' + d.color + '14', animation: 'bfIn .45s cubic-bezier(.2,.8,.2,1) both' }}>
        <div className="bf-shard" style={{ top: 0, right: 0, borderWidth: '0 26px 26px 0', borderColor: 'transparent ' + d.color + ' transparent transparent' }} />
        <div className="bf-shard" style={{ bottom: 0, left: 0, borderWidth: '26px 0 0 26px', borderColor: 'transparent transparent transparent ' + d.color }} />
        <div style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.4em', color: d.color, marginBottom: '10px' }}>◆ {d.tag}</div>
        <h2 style={{ fontFamily: mono, fontSize: 'clamp(1.15rem, 4vw, 1.6rem)', color: '#f0fff0', margin: '0 0 14px', lineHeight: 1.3, fontWeight: 700 }}>{d.title}</h2>
        <p style={{ fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: 'clamp(0.88rem, 2.6vw, 0.98rem)', color: '#a8c8a8', lineHeight: 1.75, margin: 0, minHeight: '5.5em' }}>
          <Typed text={d.body} />
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', marginTop: '22px' }}>
          {d.stats.map(([v, l]) => (
            <div key={l} style={{ borderLeft: '2px solid ' + d.color + '66', padding: '4px 0 4px 10px' }}>
              <div style={{ fontFamily: mono, fontSize: 'clamp(0.95rem, 3.6vw, 1.25rem)', color: d.color, fontWeight: 700 }}>{v}</div>
              <div style={{ fontFamily: mono, fontSize: '0.55rem', letterSpacing: '0.18em', color: '#5f8f5f', marginTop: '3px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }} aria-hidden="true">
          {DOSSIERS.map((x, j) => <span key={j} style={{ width: j === i ? '26px' : '8px', height: '4px', background: j <= i ? x.color : '#123a1a', transition: 'all .3s', borderRadius: '2px' }} />)}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="bf-btn" onClick={onSkip} style={{ background: 'transparent', color: '#4f8f5f', border: '1px solid #164a22' }}>SKIP</button>
          <button className="bf-btn" onClick={() => (last ? onDone() : setI(v => v + 1))} style={{ background: d.color + '1a', color: d.color, border: '1px solid ' + d.color }}>
            {last ? 'ARM BREACH PROTOCOL ▸' : 'NEXT ▸'}
          </button>
        </div>
      </div>
    </div>
  )
}
