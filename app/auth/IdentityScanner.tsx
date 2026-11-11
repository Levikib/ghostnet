'use client'
import React, { useMemo } from 'react'

export type ScanState = 'idle' | 'typing' | 'scanning' | 'granted' | 'denied'

const mono = 'JetBrains Mono, monospace'

/** Animated biometric panel: a procedural fingerprint, a scan beam and live status readouts. */
export default function IdentityScanner({ state, label }: { state: ScanState; label?: string }) {
  const ridges = useMemo(() => {
    const out: { d: string; len: number }[] = []
    for (let i = 0; i < 15; i++) {
      const r = 14 + i * 7.2
      const gap = 0.35 + ((i * 37) % 10) / 40
      const start = Math.PI * (0.62 + ((i * 13) % 7) / 60)
      const end = Math.PI * (2.38 - gap)
      const sx = 120 + Math.cos(start) * r * 0.82, sy = 130 + Math.sin(start) * r
      const ex = 120 + Math.cos(end) * r * 0.82, ey = 130 + Math.sin(end) * r
      out.push({ d: 'M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' A ' + (r * 0.82).toFixed(1) + ' ' + r.toFixed(1) + ' 0 1 1 ' + ex.toFixed(1) + ' ' + ey.toFixed(1), len: Math.round(r * 5.4) })
    }
    return out
  }, [])

  const color = state === 'granted' ? '#00ff41' : state === 'denied' ? '#ff4136' : state === 'scanning' ? '#00d4ff' : '#1f8f3f'
  const status =
    state === 'granted' ? 'IDENTITY CONFIRMED' :
    state === 'denied' ? 'ACCESS DENIED' :
    state === 'scanning' ? 'VERIFYING IDENTITY' :
    state === 'typing' ? 'AWAITING CREDENTIALS' : 'SCANNER STANDBY'

  return (
    <div className={'is-wrap is-' + state} style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        .is-ridge { stroke-dasharray: var(--len); stroke-dashoffset: var(--len); transition: stroke .3s; animation: isDraw 2.4s cubic-bezier(.4,0,.2,1) forwards; }
        .is-scanning .is-ridge { animation: isDraw 2.4s ease forwards, isFlicker 1.1s steps(2) infinite; }
        .is-granted .is-ridge { stroke-dashoffset: 0 !important; animation: none; filter: drop-shadow(0 0 4px #00ff41); }
        .is-denied .is-ridge { stroke-dashoffset: 0 !important; animation: isDeny .4s steps(2) 3; }
        .is-beam { animation: isBeam 2.2s ease-in-out infinite; }
        .is-idle .is-beam, .is-granted .is-beam, .is-denied .is-beam { opacity: 0 }
        .is-scanning .is-beam { animation-duration: .9s; }
        @keyframes isDraw { to { stroke-dashoffset: 0 } }
        @keyframes isFlicker { 50% { opacity: .55 } }
        @keyframes isDeny { 50% { transform: translateX(3px) } }
        @keyframes isBeam { 0%,100% { transform: translateY(0) } 50% { transform: translateY(196px) } }
        @keyframes isOrbit { to { transform: rotate(360deg) } }
        @keyframes isPing { 0% { r: 100; opacity: .7 } 100% { r: 150; opacity: 0 } }
        @media (prefers-reduced-motion: reduce) { .is-ridge, .is-beam, .is-orbit { animation: none !important; stroke-dashoffset: 0 } }
      `}</style>
      <svg viewBox="0 0 240 260" width="100%" style={{ maxWidth: '300px', overflow: 'visible' }} aria-hidden="true">
        <g className="is-orbit" style={{ transformOrigin: '120px 130px', animation: 'isOrbit 22s linear infinite' }}>
          <circle cx="120" cy="130" r="118" fill="none" stroke={color} strokeOpacity=".25" strokeDasharray="2 8" />
          <circle cx="120" cy="130" r="108" fill="none" stroke={color} strokeOpacity=".45" strokeDasharray="60 160" strokeWidth="2" />
        </g>
        {state === 'granted' && <circle cx="120" cy="130" r="100" fill="none" stroke="#00ff41" strokeWidth="2" style={{ animation: 'isPing 1.2s ease-out infinite' }} />}
        {/* frame brackets */}
        {[[22, 22, 1, 1], [218, 22, -1, 1], [22, 238, 1, -1], [218, 238, -1, -1]].map(([x, y, sx, sy], i) => (
          <path key={i} d={'M ' + x + ' ' + (y + sy * 18) + ' V ' + y + ' H ' + (x + sx * 18)} fill="none" stroke={color} strokeWidth="2" />
        ))}
        <g fill="none" strokeLinecap="round" strokeWidth="2.6" stroke={color}>
          {ridges.map((r, i) => (
            <path key={i} d={r.d} className="is-ridge" style={{ ['--len' as string]: r.len, animationDelay: (i * 0.06) + 's', opacity: 0.35 + (i % 3) * 0.22 } as React.CSSProperties} />
          ))}
        </g>
        <rect className="is-beam" x="30" y="30" width="180" height="3" fill={color} opacity=".85" style={{ filter: 'drop-shadow(0 0 6px ' + color + ')' }} />
      </svg>
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <div style={{ fontFamily: mono, fontSize: '0.72rem', letterSpacing: '0.32em', color, textShadow: '0 0 12px ' + color + '66' }}>{status}</div>
        {label && <div style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.2em', color: '#3f7f4f', marginTop: '6px' }}>{label}</div>}
      </div>
    </div>
  )
}
