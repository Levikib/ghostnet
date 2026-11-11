'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const mono = 'JetBrains Mono, monospace'
const HOLD_MS = 1900
const RINGS = [
  { r: 176, dash: '38 14', w: 3, speed: 28, dir: 1, label: 'FIREWALL' },
  { r: 146, dash: '6 6 22 6', w: 6, speed: 18, dir: -1, label: 'IDS' },
  { r: 116, dash: '64 18', w: 2.5, speed: 12, dir: 1, label: 'ENCRYPTION' },
  { r: 88, dash: '3 5', w: 9, speed: 8, dir: -1, label: 'KERNEL' },
]

/**
 * The breach portal: hold the core to crack four security rings one by one.
 * Release early and the rings re-seal. On the last ring: flash, shards, ACCESS GRANTED.
 */
export default function PortalBreach({ onBreached, reduced }: { onBreached: () => void; reduced: boolean }) {
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const [breached, setBreached] = useState(false)
  const holdRef = useRef(false)
  const progRef = useRef(0)
  const lastStage = useRef(0)
  const raf = useRef<number | null>(null)
  const last = useRef<number>(0)
  // The parent re-renders often (blinking cursor); keep the loop independent of its callbacks.
  const onBreachedRef = useRef(onBreached)
  onBreachedRef.current = onBreached
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced
  const breachedRef = useRef(false)

  const stage = Math.min(4, Math.floor(progress * 4 + 0.0001))

  const shards = useMemo(() => Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2 + (i % 3) * 0.2
    const d = 38 + (i * 37) % 30
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, rot: (i * 73) % 360, s: 0.6 + ((i * 29) % 10) / 10, delay: (i % 5) * 30 }
  }), [])

  const tick = useCallback((t: number) => {
    const reduced = reducedRef.current
    const dt = Math.min(64, last.current ? t - last.current : 16)
    last.current = t
    let p = progRef.current
    p = holdRef.current ? p + dt / (reduced ? HOLD_MS * 0.5 : HOLD_MS) : p - dt / (HOLD_MS * 0.7)
    p = Math.max(0, Math.min(1, p))
    progRef.current = p
    setProgress(p)
    const st = Math.floor(p * 4 + 0.0001)
    if (st > lastStage.current && typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(st === 4 ? [30, 40, 90] : 18)
    lastStage.current = st
    if (p >= 1) {
      holdRef.current = false
      setHolding(false)
      setBreached(true)
      breachedRef.current = true
      raf.current = null
      setTimeout(() => onBreachedRef.current(), reduced ? 500 : 1700)
      return
    }
    if (p > 0 || holdRef.current) raf.current = requestAnimationFrame(tick)
    else { raf.current = null; last.current = 0 }
  }, [])

  const start = useCallback(() => {
    if (breachedRef.current) return
    holdRef.current = true
    setHolding(true)
    if (!raf.current) { last.current = 0; raf.current = requestAnimationFrame(tick) }
  }, [tick])

  const stop = useCallback(() => {
    holdRef.current = false
    setHolding(false)
    if (!raf.current && progRef.current > 0 && !breachedRef.current) { last.current = 0; raf.current = requestAnimationFrame(tick) }
  }, [tick])

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start() } }
    const up = (e: KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') stop() }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [start, stop])
  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = null }, [])

  const C = 2 * Math.PI * 194
  const statusText = breached ? 'ACCESS GRANTED' : holding ? (stage < 4 ? 'CRACKING ' + RINGS[Math.min(3, stage)].label + '...' : 'BREACHING...') : progress > 0 ? 'RINGS RE-SEALING' : 'HOLD THE CORE TO BREACH'

  return (
    <div className={'pb-wrap' + (breached && !reduced ? ' pb-shake' : '')} style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        .pb-ring { transform-origin: 200px 200px; animation: pbSpin var(--spd) linear infinite; animation-direction: var(--dir); transition: stroke .25s, opacity .4s, transform .6s cubic-bezier(.2,.9,.2,1.2); }
        .pb-ring.cracked { animation-play-state: paused; }
        .pb-holding .pb-ring:not(.cracked) { animation-duration: calc(var(--spd) / 4); }
        @keyframes pbSpin { to { transform: rotate(360deg); } }
        @keyframes pbPulse { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
        @keyframes pbFlash { 0% { opacity: 0 } 12% { opacity: .95 } 100% { opacity: 0 } }
        @keyframes pbShard { 0% { transform: translate(-50%,-50%) rotate(0) scale(.2); opacity: 1 } 100% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(var(--r)) scale(var(--s)); opacity: 0 } }
        @keyframes pbSlam { 0% { transform: scale(2.6); opacity: 0; letter-spacing: .6em; filter: blur(6px) } 55% { transform: scale(.94); opacity: 1; filter: blur(0) } 70% { transform: scale(1.04) } 100% { transform: scale(1); opacity: 1; letter-spacing: .22em } }
        @keyframes pbShake { 0%,100% { transform: translate(0,0) } 15% { transform: translate(-6px,3px) } 30% { transform: translate(5px,-4px) } 45% { transform: translate(-4px,-2px) } 60% { transform: translate(3px,4px) } 75% { transform: translate(-2px,1px) } }
        @keyframes pbBurst { from { transform: scale(1); opacity: 1 } to { transform: scale(2.4); opacity: 0 } }
        @keyframes pbGlitch { 0%,100% { text-shadow: -2px 0 #ff4136, 2px 0 #00d4ff } 50% { text-shadow: 2px 0 #ff4136, -2px 0 #00d4ff } }
        .pb-shake { animation: pbShake .5s ease-out .05s; }
        .pb-core { cursor: pointer; -webkit-tap-highlight-color: transparent; touch-action: none; }
        .pb-core:focus-visible { outline: 2px solid #00d4ff; outline-offset: 6px; border-radius: 50%; }
        @media (prefers-reduced-motion: reduce) { .pb-ring { animation: none !important } .pb-shake { animation: none } }
      `}</style>

      <div style={{ position: 'relative', width: 'min(86vw, 420px)', aspectRatio: '1' }}>
        <svg viewBox="0 0 400 400" width="100%" height="100%" className={holding ? 'pb-holding' : ''} aria-hidden="true"
          style={{ overflow: 'visible', transform: breached && !reduced ? 'scale(1.08)' : 'scale(1)', transition: 'transform .6s ease' }}>
          <defs>
            <radialGradient id="pbCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={breached ? '#ffffff' : '#00ff41'} stopOpacity={0.35 + progress * 0.5} />
              <stop offset="60%" stopColor={breached ? '#00ff41' : '#003a10'} stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <filter id="pbGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>

          {/* ticks */}
          <g opacity="0.5">
            {Array.from({ length: 72 }, (_, i) => {
              const a = (i / 72) * Math.PI * 2
              const r1 = 188, r2 = i % 6 === 0 ? 198 : 193
              return <line key={i} x1={200 + Math.cos(a) * r1} y1={200 + Math.sin(a) * r1} x2={200 + Math.cos(a) * r2} y2={200 + Math.sin(a) * r2} stroke={i / 72 < progress ? '#ff4136' : '#1f5f2f'} strokeWidth={i % 6 === 0 ? 2 : 1} />
            })}
          </g>

          {/* progress ring */}
          <circle cx="200" cy="200" r="194" fill="none" stroke="#082a10" strokeWidth="3" />
          <circle cx="200" cy="200" r="194" fill="none" stroke={breached ? '#ffffff' : '#ff4136'} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - progress)} transform="rotate(-90 200 200)" filter="url(#pbGlow)" />

          {/* security rings, cracked from the outside in */}
          {RINGS.map((ring, i) => {
            const cracked = stage > i
            return (
              <g key={ring.label}>
                <circle className={'pb-ring' + (cracked ? ' cracked' : '')} cx="200" cy="200" r={ring.r} fill="none"
                  stroke={cracked ? (breached ? '#ffffff' : '#ff4136') : i % 2 ? '#00d4ff' : '#00ff41'}
                  strokeOpacity={cracked ? 0.95 : 0.7} strokeWidth={ring.w} strokeDasharray={ring.dash}
                  style={{ ['--spd' as string]: ring.speed + 's', ['--dir' as string]: ring.dir > 0 ? 'normal' : 'reverse', transform: breached && !reduced ? 'scale(' + (1.6 + i * 0.25) + ')' : undefined, opacity: breached && !reduced ? 0 : 1 } as React.CSSProperties} />
                <text x="200" y={200 - ring.r - 6} textAnchor="middle" fontFamily={mono} fontSize="7" letterSpacing="2"
                  fill={cracked ? '#ff4136' : '#2f7f3f'} opacity={breached ? 0 : 0.85}>{(cracked ? '✕ ' : '') + ring.label}</text>
              </g>
            )
          })}

          {/* core */}
          <circle cx="200" cy="200" r="70" fill="url(#pbCore)" />
          <polygon points="200,150 243,175 243,225 200,250 157,225 157,175" fill="#010801" stroke={breached ? '#ffffff' : holding ? '#ff4136' : '#00ff41'} strokeWidth="2" filter="url(#pbGlow)" style={{ transition: 'stroke .2s' }} />
          {/* lock */}
          <g transform="translate(200 202)" style={{ transition: 'transform .4s' }}>
            <path d={breached ? 'M -11 -6 v -10 a 11 11 0 0 1 22 0 v -4' : 'M -11 -6 v -8 a 11 11 0 0 1 22 0 v 8'} fill="none" stroke={breached ? '#ffffff' : '#00ff41'} strokeWidth="4" strokeLinecap="round" style={{ transition: 'd .3s' }} />
            <rect x="-16" y="-6" width="32" height="24" rx="3" fill={breached ? '#ffffff' : holding ? '#ff4136' : '#00ff41'} opacity={0.9} />
            <circle cx="0" cy="5" r="3" fill="#010801" />
          </g>
          {breached && !reduced && <circle cx="200" cy="200" r="80" fill="none" stroke="#fff" strokeWidth="3" style={{ transformOrigin: '200px 200px', animation: 'pbBurst .9s ease-out forwards' }} />}
        </svg>

        {/* invisible hold target over the core */}
        <button
          type="button"
          className="pb-core"
          aria-label="Hold to breach the network. Press and hold, or hold Space."
          onPointerDown={e => { e.preventDefault(); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); start() }}
          onPointerUp={stop}
          onPointerCancel={stop}
          onPointerLeave={stop}
          onContextMenu={e => e.preventDefault()}
          style={{ position: 'absolute', left: '50%', top: '50%', width: '44%', height: '44%', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'transparent', border: 'none' }}
        />

        {breached && !reduced && shards.map((s, i) => (
          <span key={i} aria-hidden="true" style={{
            position: 'absolute', left: '50%', top: '50%', width: 14 + (i % 4) * 6 + 'px', height: 22 + (i % 3) * 10 + 'px',
            background: i % 4 === 0 ? '#ffffff' : i % 4 === 1 ? '#00ff41' : i % 4 === 2 ? '#ff4136' : '#00d4ff',
            clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', opacity: 0,
            ['--x' as string]: s.x + 'vmin', ['--y' as string]: s.y + 'vmin', ['--r' as string]: s.rot + 'deg', ['--s' as string]: String(s.s),
            animation: 'pbShard 1.1s cubic-bezier(.15,.8,.3,1) ' + s.delay + 'ms forwards',
          } as React.CSSProperties} />
        ))}
      </div>

      {breached && !reduced && <div aria-hidden="true" style={{ position: 'fixed', inset: 0, background: '#fff', pointerEvents: 'none', animation: 'pbFlash .7s ease-out forwards', zIndex: 50 }} />}

      <div role="status" aria-live="polite" style={{ marginTop: '1.4rem', minHeight: '3.2rem', textAlign: 'center' }}>
        {breached ? (
          <div style={{ fontFamily: mono, fontWeight: 800, fontSize: 'clamp(1.6rem, 6vw, 2.6rem)', color: '#fff', letterSpacing: '.22em', animation: reduced ? 'none' : 'pbSlam .7s cubic-bezier(.2,.8,.2,1) both, pbGlitch .25s steps(2) .7s 4' }}>
            ACCESS GRANTED
          </div>
        ) : (
          <>
            <div style={{ fontFamily: mono, fontSize: '0.78rem', letterSpacing: '0.3em', color: holding ? '#ff4136' : '#00ff41', animation: holding ? 'none' : 'pbPulse 2s ease-in-out infinite' }}>{statusText}</div>
            <div style={{ fontFamily: mono, fontSize: '0.62rem', letterSpacing: '0.18em', color: '#2f6f3f', marginTop: '8px' }}>
              {Math.round(progress * 100)}% · {stage}/4 RINGS CRACKED · PRESS AND HOLD (OR HOLD SPACE)
            </div>
          </>
        )}
      </div>
    </div>
  )
}
