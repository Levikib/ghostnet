'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { C, Decode, Frame, Typed, mono, sans } from '../components/hack/Hack'

/**
 * The visitor gets "profiled": what any site can read about them in a second.
 * Everything is read in the browser and nothing is sent anywhere.
 */

function readDevice() {
  const ua = navigator.userAgent
  const os = /Windows/.test(ua) ? 'WINDOWS' : /Android/.test(ua) ? 'ANDROID' : /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Mac OS X/.test(ua) ? 'macOS' : /CrOS/.test(ua) ? 'CHROME OS' : /Linux/.test(ua) ? 'LINUX' : 'UNKNOWN'
  const br = /Edg\//.test(ua) ? 'EDGE' : /OPR\//.test(ua) ? 'OPERA' : /Firefox\//.test(ua) ? 'FIREFOX' : /Chrome\//.test(ua) ? 'CHROME' : /Safari\//.test(ua) ? 'SAFARI' : 'UNKNOWN'
  const conn = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } }).connection
  let tz = 'UNKNOWN'
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || tz } catch {}
  return {
    os, br,
    screen: window.screen.width + ' x ' + window.screen.height + ' @' + (window.devicePixelRatio || 1) + 'x',
    tz: tz.toUpperCase(),
    lang: (navigator.language || 'unknown').toUpperCase(),
    net: conn?.effectiveType ? conn.effectiveType.toUpperCase() + (conn.downlink ? ' · ~' + conn.downlink + ' MBPS' : '') : 'HIDDEN',
    cores: navigator.hardwareConcurrency ? navigator.hardwareConcurrency + ' CORES' : 'HIDDEN',
    touch: navigator.maxTouchPoints > 0 ? 'TOUCHSCREEN' : 'MOUSE + KEYBOARD',
    mobile: /Mobi|Android|iPhone/.test(ua),
  }
}

export default function Profiler({ onDone, onSkip, instant }: { onDone: () => void; onSkip: () => void; instant?: boolean }) {
  const [d, setD] = useState<ReturnType<typeof readDevice> | null>(null)
  const [shown, setShown] = useState(0)
  const [time, setTime] = useState('')
  const [outro, setOutro] = useState(false)
  const [ready, setReady] = useState(false)
  const [t0] = useState(() => Date.now())
  const [elapsed, setElapsed] = useState('')

  useEffect(() => { setD(readDevice()) }, [])
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const rows = useMemo(() => d ? [
    ['DEVICE', d.os + ' · ' + (d.mobile ? 'MOBILE' : 'DESKTOP')],
    ['BROWSER', d.br],
    ['DISPLAY', d.screen],
    ['TIMEZONE', d.tz],
    ['LOCAL TIME', '__time__'],
    ['LANGUAGE', d.lang],
    ['NETWORK', d.net],
    ['HARDWARE', d.cores],
    ['INPUT', d.touch],
  ] : [], [d])

  useEffect(() => {
    if (!d) return
    if (instant) { setShown(rows.length); setOutro(true); return }
    if (shown >= rows.length) { setElapsed(((Date.now() - t0) / 1000).toFixed(1)); const t = setTimeout(() => setOutro(true), 350); return () => clearTimeout(t) }
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 500 : 210)
    return () => clearTimeout(t)
  }, [d, shown, rows.length, instant, t0])

  return (
    <div className="hx-in" style={{ width: '100%', maxWidth: '760px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: mono, fontSize: '.62rem', letterSpacing: '.36em', color: C.red }}>
          <span className="pf-dot" /> TARGET ACQUIRED
        </div>
        <button className="hx-link" onClick={onSkip}>SKIP INTRO ▸</button>
      </div>

      <Frame color={C.white} className="pf-grid" style={{ padding: 'clamp(16px, 4vw, 26px)' }} label="PROFILER v4.1">
        {/* Photo / silhouette */}
        <div className="pf-photo" aria-hidden="true">
          <svg viewBox="0 0 120 140" width="100%" height="100%">
            <defs>
              <pattern id="pfpx" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="rgba(232,243,246,.16)" /></pattern>
            </defs>
            <rect width="120" height="140" fill="rgba(0,212,255,.04)" />
            <path d="M60 22c15 0 25 12 25 28 0 12-6 22-13 26v6c18 4 32 14 36 30v28H12v-28c4-16 18-26 36-30v-6c-7-4-13-14-13-26 0-16 10-28 25-28z" fill="url(#pfpx)" stroke="rgba(232,243,246,.35)" strokeWidth="1" />
            <rect className="pf-scanbar" x="0" y="0" width="120" height="3" fill="#00d4ff" opacity=".8" />
          </svg>
          <div style={{ position: 'absolute', bottom: 6, left: 6, right: 6, fontFamily: mono, fontSize: '.5rem', letterSpacing: '.2em', color: C.amber, textAlign: 'center' }}>NO FACE ON FILE</div>
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: mono, fontSize: '.56rem', letterSpacing: '.3em', color: C.dim }}>NAME</div>
          <Decode as="div" text="UNKNOWN OPERATOR" duration={900} style={{ fontFamily: mono, fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: 700, color: C.white, letterSpacing: '.08em', margin: '4px 0 2px' }} />
          <div style={{ fontFamily: mono, fontSize: '.62rem', letterSpacing: '.18em', color: C.amber }}>OCCUPATION: NOT YET DECIDED · THREAT LEVEL: <span style={{ color: C.green }}>LOW</span></div>

          <dl style={{ margin: '16px 0 0', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '8px 18px' }} className="pf-rows">
            {rows.slice(0, shown).map(([k, v]) => (
              <div key={k} className="hx-flick" style={{ borderLeft: '2px solid rgba(0,212,255,.5)', paddingLeft: '10px', minWidth: 0 }}>
                <dt style={{ fontFamily: mono, fontSize: '.52rem', letterSpacing: '.26em', color: C.dim }}>{k}</dt>
                <dd style={{ margin: '2px 0 0', fontFamily: mono, fontSize: '.74rem', color: C.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {v === '__time__' ? time : <Decode text={v} duration={380} instant={instant} />}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Frame>

      <div style={{ minHeight: '120px', marginTop: '18px', fontFamily: sans, fontSize: 'clamp(.9rem, 2.4vw, 1rem)', lineHeight: 1.65, color: C.white }}>
        {outro && (
          <>
            <Typed instant={instant} speed={18} text={'That took ' + (elapsed || '2') + ' seconds, and you clicked nothing. Every site you visit can read this much. Attackers start here.'} onDone={() => setReady(true)} />
            {(ready || instant) && (
              <div className="hx-in" style={{ marginTop: '10px', color: C.dim, fontSize: '.88rem' }}>
                <span style={{ color: C.green, fontFamily: mono, fontSize: '.7rem', letterSpacing: '.2em' }}>[ PRIVATE ]</span> Nothing above left your browser. GHOSTNET teaches you how this works, and how to defend against it.
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px', minHeight: '50px' }}>
        {(ready || instant) && <button className="hx-btn hx-in" onClick={onDone}>READ THE BRIEFING ▸</button>}
      </div>

      <style>{`
        .pf-grid { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 22px; align-items: start; }
        .pf-photo { position: relative; width: 120px; height: 140px; border: 1px solid rgba(232,243,246,.18); overflow: hidden; }
        .pf-scanbar { animation: pfScan 2.2s linear infinite; }
        @keyframes pfScan { from { transform: translateY(0) } to { transform: translateY(137px) } }
        .pf-dot { display: inline-block; width: 7px; height: 7px; background: #ff4136; border-radius: 50%; margin-right: 6px; animation: hxBlink 1s steps(2) infinite; box-shadow: 0 0 8px #ff4136; }
        @media (max-width: 560px) {
          .pf-grid { grid-template-columns: 76px minmax(0, 1fr); gap: 14px; }
          .pf-photo { width: 76px; height: 90px; }
          .pf-rows { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
