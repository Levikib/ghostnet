'use client'
import React, { useEffect, useState } from 'react'
import { C, glyph, hex, mono } from '../components/hack/Hack'

export type DecryptStatus = 'run' | 'ok' | 'fail'

/**
 * Plays while a submitted code is checked on the server: each character is a
 * tumbler that spins through glyphs and locks in place, a keyed hash streams
 * underneath, and the padlock opens (or jams) when the real answer arrives.
 */
export default function CodeDecrypt({ code, status, label = 'ACCESS CODE' }: { code: string; status: DecryptStatus; label?: string }) {
  const chars = code.split('')
  const [locked, setLocked] = useState(0)
  const [spin, setSpin] = useState<string[]>(() => chars.map(() => glyph()))
  const [hash, setHash] = useState(hex(40))

  // Tumblers lock one by one; the last one waits for the server.
  useEffect(() => {
    if (status === 'ok') {
      let i = locked
      const t = setInterval(() => { i++; setLocked(i); if (i >= chars.length) clearInterval(t) }, 70)
      return () => clearInterval(t)
    }
    if (status !== 'run') return
    const t = setInterval(() => setLocked(l => Math.min(chars.length - 1, l + 1)), 190)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  useEffect(() => {
    if (status !== 'run') return
    const t = setInterval(() => { setSpin(chars.map(() => glyph())); setHash(hex(40)) }, 55)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const col = status === 'ok' ? C.green : status === 'fail' ? C.red : C.cyan
  const head = status === 'ok' ? 'KEY ACCEPTED · IDENTITY UNLOCKED' : status === 'fail' ? 'KEY REJECTED · ACCESS DENIED' : 'DECRYPTING ' + label + '…'

  return (
    <div className={'cd-root' + (status === 'fail' ? ' hx-shake' : '')} role="status" aria-live="assertive" aria-label={head}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
        <div style={{ fontFamily: mono, fontSize: '.62rem', letterSpacing: '.24em', color: col }} className={status === 'run' ? 'cd-blink' : 'hx-flick'}>{head}</div>
        <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true" style={{ flex: 'none' }}>
          <path className={'cd-shackle' + (status === 'ok' ? ' open' : '')} d="M9 18v-6a8 8 0 0 1 16 0v6" fill="none" stroke={col} strokeWidth="3" />
          <rect x="4" y="17" width="26" height="20" fill={col} opacity=".14" stroke={col} strokeWidth="2" />
          <rect x="15.5" y="23" width="3" height="7" fill={col} />
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 'clamp(5px, 1.8vw, 9px)', justifyContent: 'center' }}>
        {chars.map((ch, i) => {
          const isLocked = status === 'fail' ? false : i < locked
          const show = status === 'fail' ? '×' : isLocked ? ch : spin[i]
          const c = status === 'fail' ? C.red : isLocked ? (status === 'ok' ? C.green : C.white) : C.cyan
          return (
            <div key={i} className={'cd-cell' + (isLocked ? ' lk' : '')} style={{ borderColor: c, color: c, width: chars.length > 6 ? 'clamp(22px, 7vw, 30px)' : 'clamp(38px, 11vw, 50px)' }}>
              <span className="cd-ghost" aria-hidden="true">{isLocked || status === 'fail' ? '' : spin[(i + 1) % chars.length]}</span>
              <span style={{ position: 'relative' }}>{show}</span>
              <span className="cd-ghost b" aria-hidden="true">{isLocked || status === 'fail' ? '' : spin[(i + 2) % chars.length]}</span>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '14px', fontFamily: mono, fontSize: '.6rem', letterSpacing: '.08em', color: C.dim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        HMAC-SHA256 ▸ <span style={{ color: status === 'fail' ? C.red : status === 'ok' ? C.green : '#4fb8d4' }}>{status === 'fail' ? 'MISMATCH' : hash}</span>
      </div>
      <div style={{ display: 'flex', gap: '3px', marginTop: '8px' }} aria-hidden="true">
        {chars.map((_, i) => <span key={i} style={{ flex: 1, height: '3px', background: status === 'fail' ? C.red : i < locked ? col : 'rgba(232,243,246,.08)', transition: 'background .12s' }} />)}
      </div>

      <style>{`
        .cd-root { padding: 16px; border: 1px solid rgba(232,243,246,.1); background: rgba(0,212,255,.03); }
        .cd-cell { position: relative; height: clamp(54px, 14vw, 66px); display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden;
          border: 1px solid; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(1.2rem, 5vw, 1.6rem); background: rgba(4,7,10,.7); transition: color .1s, border-color .1s, box-shadow .2s; }
        .cd-cell.lk { box-shadow: 0 0 14px currentColor inset, 0 0 10px rgba(0,0,0,.4); }
        .cd-ghost { position: absolute; top: 2px; font-size: .55em; opacity: .25; }
        .cd-ghost.b { top: auto; bottom: 2px; }
        .cd-blink { animation: hxBlink .9s steps(2) infinite; }
        .cd-shackle { transition: transform .35s cubic-bezier(.3,1.6,.5,1); transform-origin: 25px 18px; }
        .cd-shackle.open { transform: translateY(-5px) rotate(-28deg); }
      `}</style>
    </div>
  )
}
