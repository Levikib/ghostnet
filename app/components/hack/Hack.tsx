'use client'
import React, { useEffect, useRef, useState } from 'react'

/**
 * GHOSTNET "hack" kit: human-feeling typing (with the odd typo and backspace),
 * scramble-decode headings, terminal line runners and the shared glitch styles.
 * Palette: ink #04070a, white #e8f3f6, signal cyan #00d4ff, owned green #00ff41,
 * firewall red #ff4136, warning amber #ffb347.
 */

export const mono = 'JetBrains Mono, ui-monospace, monospace'
export const sans = 'DM Sans, system-ui, sans-serif'
export const C = { ink: '#04070a', white: '#e8f3f6', dim: '#7d93a0', faint: '#33444f', cyan: '#00d4ff', green: '#00ff41', red: '#ff4136', amber: '#ffb347' }

const GLYPHS = 'ABCDEF0123456789#$%&@<>/\\|=+*'
export const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
export const hex = (n: number) => Array.from({ length: n }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')

export function useReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setR(m.matches)
    const on = () => setR(m.matches)
    m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  }, [])
  return r
}

type TypeOpts = { speed?: number; delay?: number; start?: boolean; typos?: boolean; instant?: boolean; onDone?: () => void }

/** Types `text` like a person at a keyboard: uneven rhythm, pauses after punctuation, and a rare typo that gets backspaced. */
export function useTyped(text: string, { speed = 26, delay = 0, start = true, typos = true, instant = false, onDone }: TypeOpts = {}) {
  const [out, setOut] = useState(instant ? text : '')
  const [done, setDone] = useState(instant)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (!start) return
    if (instant) { setOut(text); setDone(true); doneRef.current?.(); return }
    setOut(''); setDone(false)
    // Build a key-stroke script: '+c' types c, '-' is a backspace.
    const script: string[] = []
    for (const ch of text) {
      if (typos && /[a-z]/i.test(ch) && Math.random() < 0.025) {
        script.push('+' + glyph().toLowerCase(), '-')
      }
      script.push('+' + ch)
    }
    let i = 0
    let buf = ''
    let t: ReturnType<typeof setTimeout>
    const step = () => {
      const op = script[i++]
      if (op === undefined) { setDone(true); doneRef.current?.(); return }
      if (op === '-') buf = buf.slice(0, -1)
      else buf += op.slice(1)
      setOut(buf)
      const last = op === '-' ? '' : op.slice(1)
      let wait = speed * (0.45 + Math.random() * 1.1)
      if (op === '-' || script[i] === '-') wait = speed * 3.5
      if (/[.,:;!?]/.test(last)) wait += speed * 6
      if (last === ' ' && Math.random() < 0.15) wait += speed * 3
      t = setTimeout(step, wait)
    }
    t = setTimeout(step, delay)
    return () => clearTimeout(t)
  }, [text, speed, delay, start, typos, instant])

  return { out, done }
}

export function Cursor({ color = C.cyan, show = true }: { color?: string; show?: boolean }) {
  if (!show) return null
  return <span className="hx-cursor" style={{ background: color }} aria-hidden="true" />
}

/** Typed span with a block cursor while it types. */
export function Typed({ text, speed, delay, start = true, typos, instant, onDone, color, cursor = true, keepCursor = false, style, className }: TypeOpts & {
  text: string; color?: string; cursor?: boolean; keepCursor?: boolean; style?: React.CSSProperties; className?: string
}) {
  const { out, done } = useTyped(text, { speed, delay, start, typos, instant, onDone })
  return (
    <span className={className} style={{ color, ...style }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
      {cursor && start && (!done || keepCursor) && <Cursor color={color} />}
    </span>
  )
}

/** Scramble-decode: characters cycle through glyphs, then lock left to right. */
export function useDecode(text: string, { delay = 0, duration = 700, start = true, instant = false } = {}) {
  const [out, setOut] = useState(instant ? text : text.replace(/[^ ]/g, ' '))
  const [done, setDone] = useState(instant)
  useEffect(() => {
    if (!start) return
    if (instant) { setOut(text); setDone(true); return }
    setDone(false)
    let raf = 0
    let t0 = 0
    const tick = (now: number) => {
      if (!t0) t0 = now
      const p = Math.min(1, (now - t0) / duration)
      const lock = Math.floor(p * text.length)
      setOut(text.split('').map((c, i) => (c === ' ' ? ' ' : i < lock ? c : glyph())).join(''))
      if (p < 1) raf = requestAnimationFrame(tick)
      else { setOut(text); setDone(true) }
    }
    const t = setTimeout(() => { raf = requestAnimationFrame(tick) }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  }, [text, delay, duration, start, instant])
  return { out, done }
}

export function Decode({ text, delay, duration, start, instant, style, className, as = 'span' }: {
  text: string; delay?: number; duration?: number; start?: boolean; instant?: boolean; style?: React.CSSProperties; className?: string; as?: 'span' | 'h1' | 'h2' | 'div'
}) {
  const { out } = useDecode(text, { delay, duration, start, instant })
  const Tag = as as 'span'
  return (
    <Tag className={className} style={style} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  )
}

export type TermLine = { t: string; c?: string; kind?: 'cmd' | 'out' | 'blank'; pause?: number; speed?: number }

/**
 * Runs lines in order: commands ($ ...) are typed by hand, output is dumped
 * the way a real terminal prints it. Calls onDone after the last line.
 */
export function TermLines({ lines, onDone, instant = false, prompt = '$', style, start = true }: {
  lines: TermLine[]; onDone?: () => void; instant?: boolean; prompt?: string; style?: React.CSSProperties; start?: boolean
}) {
  const [idx, setIdx] = useState(instant ? lines.length : 0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => { if (instant) { setIdx(lines.length); doneRef.current?.() } }, [instant, lines.length])

  const advance = (pause = 0) => {
    setTimeout(() => setIdx(i => {
      const n = i + 1
      if (n >= lines.length) setTimeout(() => doneRef.current?.(), 0)
      return n
    }), pause)
  }

  // Output and blank lines print on their own after their pause.
  useEffect(() => {
    if (!start || instant || idx >= lines.length) return
    const l = lines[idx]
    if (l.kind === 'cmd') return
    const t = setTimeout(() => advance(0), l.pause ?? 90)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, start, instant])

  return (
    <div style={{ fontFamily: mono, fontSize: '0.74rem', lineHeight: 1.75, ...style }} aria-live="polite">
      {lines.slice(0, Math.min(idx + 1, lines.length)).map((l, i) => {
        const current = i === idx
        if (l.kind === 'blank') return <div key={i} style={{ height: '0.7em' }} />
        if (l.kind === 'cmd') {
          return (
            <div key={i} style={{ color: l.c || C.white, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <span style={{ color: C.green }}>{prompt} </span>
              {current && !instant
                ? <Typed text={l.t} speed={l.speed ?? 34} onDone={() => advance(l.pause ?? 220)} />
                : l.t}
            </div>
          )
        }
        return (
          <div key={i} className={current && !instant ? 'hx-flick' : ''} style={{ color: l.c || C.dim, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{l.t}</div>
        )
      })}
    </div>
  )
}

/** Thin bracket frame used around panels (profiler look). */
export function Frame({ children, color = C.cyan, style, className, label }: { children: React.ReactNode; color?: string; style?: React.CSSProperties; className?: string; label?: string }) {
  return (
    <div className={'hx-frame ' + (className || '')} style={{ ['--hx-c' as string]: color, ...style }}>
      <i className="hx-c tl" /><i className="hx-c tr" /><i className="hx-c bl" /><i className="hx-c br" />
      {label && <div className="hx-frame-label">{label}</div>}
      {children}
    </div>
  )
}

/** Shared CSS: glitch, cursor, scanlines, noise, frames. Render once per screen. */
export function HackStyles() {
  return (
    <style>{`
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
      .hx-cursor { display: inline-block; width: .55em; height: 1.05em; vertical-align: -0.16em; margin-left: 2px; animation: hxBlink 1s steps(2) infinite; box-shadow: 0 0 8px currentColor; }
      @keyframes hxBlink { 50% { opacity: 0 } }
      .hx-flick { animation: hxFlick .18s steps(3) 1; }
      @keyframes hxFlick { 0% { opacity: 0 } 40% { opacity: 1 } 60% { opacity: .3 } 100% { opacity: 1 } }

      .hx-scan { position: fixed; inset: 0; pointer-events: none; z-index: 3; background: repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 3px); mix-blend-mode: overlay; }
      .hx-vig { position: fixed; inset: 0; pointer-events: none; z-index: 2; background: radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,.85) 100%); }
      .hx-noise { position: fixed; inset: -50%; pointer-events: none; z-index: 3; opacity: .05;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        animation: hxNoise .5s steps(4) infinite; }
      @keyframes hxNoise { 0% { transform: translate(0,0) } 25% { transform: translate(-3%,2%) } 50% { transform: translate(2%,-3%) } 75% { transform: translate(-2%,-1%) } 100% { transform: translate(1%,3%) } }

      /* RGB-split glitch for headings: data-text must equal the text */
      .hx-glitch { position: relative; display: inline-block; }
      .hx-glitch::before, .hx-glitch::after { content: attr(data-text); position: absolute; inset: 0; pointer-events: none; }
      .hx-glitch::before { color: #ff2a6d; transform: translate(-2px, 0); mix-blend-mode: screen; clip-path: inset(0 0 60% 0); animation: hxSliceA 3.2s infinite steps(1); opacity: .8; }
      .hx-glitch::after { color: #00d4ff; transform: translate(2px, 0); mix-blend-mode: screen; clip-path: inset(55% 0 0 0); animation: hxSliceB 2.7s infinite steps(1); opacity: .8; }
      @keyframes hxSliceA { 0%, 86%, 100% { clip-path: inset(0 0 100% 0); transform: none } 87% { clip-path: inset(10% 0 62% 0); transform: translate(-6px, 0) } 90% { clip-path: inset(52% 0 20% 0); transform: translate(5px, 0) } 93% { clip-path: inset(30% 0 48% 0); transform: translate(-3px, 0) } }
      @keyframes hxSliceB { 0%, 80%, 100% { clip-path: inset(100% 0 0 0); transform: none } 81% { clip-path: inset(70% 0 8% 0); transform: translate(6px, 0) } 85% { clip-path: inset(18% 0 66% 0); transform: translate(-5px, 0) } 88% { clip-path: inset(44% 0 34% 0); transform: translate(4px, 0) } }

      /* Full-screen glitch burst */
      .hx-burst { position: fixed; inset: 0; pointer-events: none; z-index: 50; animation: hxBurst .55s steps(6) 1 both; }
      @keyframes hxBurst {
        0% { background: rgba(255,255,255,.0) } 15% { background: linear-gradient(0deg, transparent 20%, rgba(0,212,255,.22) 20% 24%, transparent 24% 61%, rgba(255,42,109,.2) 61% 63%, transparent 63%) }
        35% { background: linear-gradient(0deg, transparent 8%, rgba(255,255,255,.18) 8% 9%, transparent 9% 44%, rgba(0,255,65,.18) 44% 49%, transparent 49%) }
        55% { background: rgba(255,255,255,.08) } 75% { background: linear-gradient(0deg, transparent 70%, rgba(0,212,255,.18) 70% 77%, transparent 77%) } 100% { background: transparent } }
      .hx-shake { animation: hxShake .32s steps(4) 1; }
      @keyframes hxShake { 0% { transform: translate(0) } 25% { transform: translate(-4px, 1px) } 50% { transform: translate(3px, -2px) } 75% { transform: translate(-2px, 2px) } 100% { transform: translate(0) } }

      /* Bracket frame */
      .hx-frame { position: relative; border: 1px solid rgba(232,243,246,.08); background: linear-gradient(180deg, rgba(8,14,18,.86), rgba(4,7,10,.92)); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); }
      .hx-c { position: absolute; width: 14px; height: 14px; border: 0 solid var(--hx-c); pointer-events: none; }
      .hx-c.tl { top: -1px; left: -1px; border-top-width: 2px; border-left-width: 2px }
      .hx-c.tr { top: -1px; right: -1px; border-top-width: 2px; border-right-width: 2px }
      .hx-c.bl { bottom: -1px; left: -1px; border-bottom-width: 2px; border-left-width: 2px }
      .hx-c.br { bottom: -1px; right: -1px; border-bottom-width: 2px; border-right-width: 2px }
      .hx-frame-label { position: absolute; top: -9px; left: 16px; padding: 0 8px; background: #04070a; font-family: 'JetBrains Mono', monospace; font-size: .56rem; letter-spacing: .28em; color: var(--hx-c); }

      .hx-in { animation: hxIn .45s cubic-bezier(.2,.8,.2,1) both; }
      @keyframes hxIn { 0% { opacity: 0; transform: translateY(10px); clip-path: inset(-40px -40px 100% -40px) } 100% { opacity: 1; transform: none; clip-path: inset(-40px -40px -40px -40px) } }
      .hx-tag { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: .56rem; letter-spacing: .2em; padding: 3px 7px; border: 1px solid currentColor; }

      .hx-btn { position: relative; font-family: 'JetBrains Mono', monospace; font-size: .76rem; font-weight: 700; letter-spacing: .3em; padding: 15px 22px; cursor: pointer; color: #04070a; background: #e8f3f6; border: none;
        clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px)); transition: background .15s, box-shadow .15s, transform .15s; }
      .hx-btn:hover:not(:disabled) { background: #00d4ff; transform: translateY(-1px); }
      .hx-btn:disabled { opacity: .45; cursor: not-allowed; }
      .hx-btn-ghost { font-family: 'JetBrains Mono', monospace; font-size: .66rem; letter-spacing: .24em; background: transparent; color: #7d93a0; border: 1px solid rgba(232,243,246,.14); padding: 12px 16px; cursor: pointer; transition: color .15s, border-color .15s; }
      .hx-btn-ghost:hover:not(:disabled) { color: #e8f3f6; border-color: #00d4ff; }
      .hx-link { background: none; border: none; padding: 0; color: #00d4ff; font-family: 'JetBrains Mono', monospace; font-size: .66rem; letter-spacing: .14em; cursor: pointer; text-decoration: none; border-bottom: 1px dashed rgba(0,212,255,.4); }
      .hx-link:disabled { color: #33444f; cursor: default; border-color: transparent; }
      .hx-btn:focus-visible, .hx-btn-ghost:focus-visible, .hx-link:focus-visible { outline: 2px solid #00d4ff; outline-offset: 3px; }

      @media (prefers-reduced-motion: reduce) {
        .hx-noise, .hx-glitch::before, .hx-glitch::after, .hx-cursor { animation: none !important }
        .hx-in, .hx-burst, .hx-shake, .hx-flick { animation-duration: .01s !important }
      }
    `}</style>
  )
}
