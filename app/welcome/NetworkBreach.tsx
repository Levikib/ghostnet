'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { C, Typed, mono } from '../components/hack/Hack'

/**
 * Hold-to-hack: push a data packet from YOU through five defences into the
 * GHOSTNET core. Holding drives the packet; letting go makes it slip back,
 * but a node you have already owned stays owned.
 */

const HOPS = [
  { id: 'YOU', sub: 'ORIGIN', exploit: '' },
  { id: 'RELAY-07', sub: 'PROXY CHAIN', exploit: 'proxychains: 3 hops, origin masked' },
  { id: 'FW-EDGE', sub: 'FIREWALL', exploit: 'rule 443 abused: tunnel over HTTPS' },
  { id: 'IDS-03', sub: 'INTRUSION DETECTION', exploit: 'payload fragmented, signatures evaded' },
  { id: 'GW-CORE', sub: 'AUTH GATEWAY', exploit: 'session token replayed: gateway open' },
  { id: 'GHOSTNET', sub: 'CORE', exploit: 'root shell acquired' },
]
const SPEED = [1.25, 0.8, 0.7, 0.85, 1.15] // per segment: firewalls push back

const WIDE = { vb: '0 0 1000 300', pts: [[70, 160], [250, 80], [430, 215], [610, 85], [790, 210], [930, 140]], decoys: [[160, 250], [340, 40], [520, 270], [700, 30], [870, 270], [120, 50], [560, 160], [960, 40]] }
const TALL = { vb: '0 0 340 640', pts: [[170, 40], [70, 150], [270, 265], [80, 380], [260, 490], [170, 600]], decoys: [[290, 70], [40, 260], [300, 400], [40, 520], [190, 330], [300, 600], [30, 40]] }

export default function NetworkBreach({ onBreached, reduced }: { onBreached: () => void; reduced: boolean }) {
  const [tall, setTall] = useState(false)
  const [p, setP] = useState(0)
  const [owned, setOwned] = useState(0) // number of hops owned (0..5)
  const [holding, setHolding] = useState(false)
  const [log, setLog] = useState<{ t: string; c: string }[]>([{ t: '> target: ghostnet core · 5 layers of defence', c: C.dim }, { t: '> hold the button (or SPACE) to push your payload', c: C.dim }])
  const [burst, setBurst] = useState(0)
  const [done, setDone] = useState(false)

  const holdRef = useRef(false)
  const pRef = useRef(0)
  const ownedRef = useRef(0)
  const doneRef = useRef(false)
  const cbRef = useRef(onBreached)
  cbRef.current = onBreached
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const m = window.matchMedia('(max-width: 640px)')
    setTall(m.matches)
    const on = () => setTall(m.matches)
    m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  }, [])

  const capture = useCallback((k: number) => {
    const h = HOPS[k]
    setOwned(k)
    setBurst(b => b + 1)
    setLog(l => [...l.slice(-4), { t: '[+] ' + h.id.toLowerCase() + ' · ' + h.exploit, c: k === 5 ? C.green : C.white }])
    const el = stageRef.current
    if (el && !reducedRef.current) { el.classList.remove('hx-shake'); void el.offsetWidth; el.classList.add('hx-shake') }
    if (navigator.vibrate && !reducedRef.current) try { navigator.vibrate(k === 5 ? [30, 40, 60] : 18) } catch {}
  }, [])

  // One animation loop for the lifetime of the component.
  useEffect(() => {
    let raf = 0, last = 0
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000)
      last = now
      if (!doneRef.current) {
        let v = pRef.current
        const seg = Math.min(4, Math.floor(v * 5))
        const floor = ownedRef.current / 5
        if (holdRef.current) v += dt * (reducedRef.current ? 0.9 : 0.29) * SPEED[seg]
        else v -= dt * 0.12
        v = Math.max(floor, Math.min(1, v))
        const k = Math.floor(v * 5 + 1e-6)
        if (k > ownedRef.current) { ownedRef.current = k; capture(k) }
        if (v !== pRef.current) { pRef.current = v; setP(v) }
        if (v >= 1) {
          doneRef.current = true
          setDone(true)
          holdRef.current = false
          setHolding(false)
          setTimeout(() => cbRef.current(), reducedRef.current ? 400 : 1700)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [capture])

  const press = (on: boolean) => {
    if (doneRef.current) return
    holdRef.current = on
    setHolding(on)
    if (on) setLog(l => (l[l.length - 1]?.t.startsWith('> pushing') ? l : [...l.slice(-4), { t: '> pushing payload…', c: C.cyan }]))
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if ((e.code === 'Space' || e.key === ' ') && !e.repeat) { e.preventDefault(); press(true) } }
    const up = (e: KeyboardEvent) => { if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); press(false) } }
    const blur = () => press(false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur) }
  }, [])

  const L = tall ? TALL : WIDE
  const pts = L.pts
  const seg = Math.min(4, Math.floor(p * 5))
  const local = p * 5 - seg
  const a = pts[seg], b = pts[seg + 1]
  const px = a[0] + (b[0] - a[0]) * local, py = a[1] + (b[1] - a[1]) * local
  const pct = Math.round(p * 100)
  const breaching = holding && !done ? Math.min(5, owned + 1) : -1

  return (
    <div style={{ width: '100%', maxWidth: '980px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {burst > 0 && <div key={burst} className="hx-burst" aria-hidden="true" />}

      <div ref={stageRef} style={{ width: '100%', position: 'relative' }}>
        <svg viewBox={L.vb} width="100%" style={{ display: 'block', maxHeight: tall ? '58vh' : '42vh', overflow: 'visible' }} role="img" aria-label={'Breach progress ' + pct + ' percent, ' + owned + ' of 5 defences owned'}>
          <defs>
            <filter id="nbGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>

          {/* decoy network */}
          {L.decoys.map((d, i) => {
            const near = pts[Math.min(5, Math.round((i / L.decoys.length) * 5))]
            return (
              <g key={'d' + i} opacity=".5">
                <line x1={d[0]} y1={d[1]} x2={near[0]} y2={near[1]} stroke="rgba(232,243,246,.08)" strokeDasharray="2 5" />
                <rect x={d[0] - 3} y={d[1] - 3} width="6" height="6" fill="rgba(232,243,246,.25)" />
              </g>
            )
          })}

          {/* path */}
          {pts.slice(0, -1).map((s, i) => {
            const e = pts[i + 1]
            const state = i < owned ? 'own' : i === seg ? 'cur' : 'todo'
            return (
              <g key={'s' + i}>
                <line x1={s[0]} y1={s[1]} x2={e[0]} y2={e[1]} stroke={state === 'own' ? C.green : 'rgba(232,243,246,.16)'} strokeWidth={state === 'own' ? 2 : 1.2} strokeDasharray={state === 'own' ? undefined : '6 6'} filter={state === 'own' ? 'url(#nbGlow)' : undefined} className={state === 'todo' ? 'nb-flow' : undefined} />
                {state === 'cur' && local > 0 && <line x1={s[0]} y1={s[1]} x2={px} y2={py} stroke={C.cyan} strokeWidth="2.4" filter="url(#nbGlow)" />}
              </g>
            )
          })}

          {/* nodes */}
          {pts.map((pt, i) => {
            const isOwned = i === 0 || i <= owned
            const isBreach = i === breaching
            const col = isOwned ? (i === 5 ? C.green : C.white) : isBreach ? C.amber : C.red
            const s = i === 5 ? 15 : 11
            const above = tall ? false : pt[1] > 150
            const lx = tall ? (pt[0] < 170 ? pt[0] + 24 : pt[0] - 24) : pt[0]
            const anchor = tall ? (pt[0] < 170 ? 'start' : 'end') : 'middle'
            const ly = tall ? pt[1] - 4 : above ? pt[1] + s + 22 : pt[1] - s - 26
            return (
              <g key={'n' + i}>
                <rect x={pt[0] - s} y={pt[1] - s} width={s * 2} height={s * 2} fill={isOwned ? 'rgba(0,255,65,.08)' : 'rgba(255,65,54,.06)'} stroke={col} strokeWidth="1.5" transform={'rotate(45 ' + pt[0] + ' ' + pt[1] + ')'} className={isBreach ? 'nb-breach' : undefined} filter={isOwned ? 'url(#nbGlow)' : undefined} />
                <rect x={pt[0] - 3} y={pt[1] - 3} width="6" height="6" fill={col} />
                <text x={lx} y={ly} textAnchor={anchor} fontFamily={mono} fontSize={tall ? 13 : 14} fontWeight="700" fill={col} letterSpacing="2">{HOPS[i].id}</text>
                <text x={lx} y={ly + 15} textAnchor={anchor} fontFamily={mono} fontSize="10" fill={isOwned ? C.green : isBreach ? C.amber : 'rgba(232,243,246,.45)'} letterSpacing="2">
                  {i === 0 ? 'ORIGIN' : isOwned ? 'OWNED' : isBreach ? 'BREACHING…' : HOPS[i].sub}
                </text>
              </g>
            )
          })}

          {/* packet */}
          {!done && (
            <g transform={'translate(' + px + ' ' + py + ')'}>
              <rect x="-6" y="-6" width="12" height="12" fill="none" stroke={C.cyan} className="nb-pkt" />
              <rect x="-2.5" y="-2.5" width="5" height="5" fill="#fff" filter="url(#nbGlow)" />
            </g>
          )}
        </svg>
      </div>

      {/* status + control */}
      <div style={{ width: '100%', maxWidth: '560px', marginTop: tall ? '8px' : '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: '.6rem', letterSpacing: '.24em', color: C.dim, marginBottom: '6px' }}>
          <span>UPLINK</span>
          <span style={{ color: done ? C.green : holding ? C.cyan : C.dim }}>{done ? 'ROOT' : pct + '%'}</span>
        </div>
        <div style={{ display: 'flex', gap: '3px' }} aria-hidden="true">
          {Array.from({ length: 25 }, (_, i) => {
            const on = i < Math.round(p * 25)
            return <span key={i} style={{ flex: 1, height: '6px', background: on ? (done ? C.green : i < owned * 5 ? C.white : C.cyan) : 'rgba(232,243,246,.08)', transition: 'background .1s' }} />
          })}
        </div>

        {!done ? (
          <button
            className={'nb-hold' + (holding ? ' on' : '')}
            onPointerDown={e => { e.preventDefault(); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); press(true) }}
            onPointerUp={() => press(false)}
            onPointerCancel={() => press(false)}
            onLostPointerCapture={() => press(false)}
            onContextMenu={e => e.preventDefault()}
            aria-label="Hold to breach"
          >
            <span className="nb-fill" style={{ transform: 'scaleX(' + p + ')' }} />
            <span style={{ position: 'relative' }}>{holding ? 'BREACHING ' + HOPS[Math.min(5, owned + 1)].id + '…' : owned ? 'HOLD TO CONTINUE' : 'HOLD TO BREACH'}</span>
            <span className="nb-key" style={{ position: 'relative' }}>SPACE</span>
          </button>
        ) : (
          <div className="hx-in" style={{ textAlign: 'center', marginTop: '18px' }}>
            <div className="hx-glitch" data-text="ACCESS GRANTED" style={{ fontFamily: mono, fontWeight: 700, fontSize: 'clamp(1.6rem, 6vw, 2.6rem)', letterSpacing: '.14em', color: C.green, textShadow: '0 0 24px rgba(0,255,65,.5)' }}>ACCESS GRANTED</div>
            <div style={{ fontFamily: mono, fontSize: '.66rem', letterSpacing: '.3em', color: C.dim, marginTop: '8px' }}><Typed text="OPENING IDENTITY CONSOLE…" speed={22} /></div>
          </div>
        )}

        <div style={{ marginTop: '14px', fontFamily: mono, fontSize: '.68rem', lineHeight: 1.7, minHeight: '6.2em' }} aria-live="polite">
          {log.map((l, i) => <div key={i + l.t} className="hx-flick" style={{ color: l.c, opacity: i === log.length - 1 ? 1 : 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.t}</div>)}
        </div>
      </div>

      <style>{`
        .nb-flow { animation: nbFlow 1.2s linear infinite; }
        @keyframes nbFlow { to { stroke-dashoffset: -24 } }
        .nb-breach { animation: nbBreach .3s steps(2) infinite; }
        @keyframes nbBreach { 50% { stroke: #ff4136 } }
        .nb-pkt { animation: nbPkt .8s linear infinite; transform-origin: 0 0; }
        @keyframes nbPkt { to { transform: rotate(90deg) } }
        .nb-hold { position: relative; overflow: hidden; width: 100%; margin-top: 14px; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 18px 20px;
          font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: .8rem; letter-spacing: .28em; color: #e8f3f6; background: rgba(0,212,255,.06); border: 1px solid rgba(0,212,255,.55);
          cursor: pointer; user-select: none; -webkit-user-select: none; touch-action: none; -webkit-touch-callout: none;
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px)); transition: border-color .15s, box-shadow .15s; }
        .nb-hold:hover { border-color: #00d4ff; box-shadow: 0 0 24px rgba(0,212,255,.25) inset; }
        .nb-hold.on { border-color: #fff; box-shadow: 0 0 30px rgba(0,212,255,.35); }
        .nb-fill { position: absolute; inset: 0; background: linear-gradient(90deg, #00d4ff, #e8f3f6); transform-origin: 0 50%; opacity: .22; }
        .nb-hold.on .nb-fill { opacity: .45; }
        .nb-key { font-size: .56rem; letter-spacing: .2em; border: 1px solid currentColor; padding: 3px 6px; opacity: .7; }
        .nb-hold:focus-visible { outline: 2px solid #00d4ff; outline-offset: 3px; }
        @media (hover: none) { .nb-key { display: none } }
        @media (prefers-reduced-motion: reduce) { .nb-flow, .nb-breach, .nb-pkt { animation: none } }
      `}</style>
    </div>
  )
}
