'use client'
import React, { useEffect, useState } from 'react'
import OperatorAvatar from '../components/OperatorAvatar'
import { C, Frame, Typed, hex, mono } from '../components/hack/Hack'

export type IdStatus = 'locked' | 'building' | 'working' | 'unverified' | 'second-factor' | 'denied' | 'active'
export type TraceLine = { text: string; state: 'wait' | 'run' | 'ok' | 'fail' }

const STATUS: Record<IdStatus, [string, string]> = {
  locked: ['LOCKED', C.red],
  building: ['RECORD OPEN', C.amber],
  working: ['PROCESSING', C.cyan],
  unverified: ['AWAITING CODE', C.amber],
  'second-factor': ['SECOND FACTOR', C.cyan],
  denied: ['ACCESS DENIED', C.red],
  active: ['ACTIVE', C.green],
}

function mask(email: string) {
  const [u, d] = email.split('@')
  if (!u) return '—'
  if (!d) return u.slice(0, 2) + '***'
  return u.slice(0, 2) + '***@' + d
}

/** Left panel: the identity record being built or unlocked, with a live trace of what the server is doing. */
export default function IdentityProfile({ callsign, email, keyLabel, keyColor, status, trace, label }: {
  callsign: string; email: string; keyLabel?: string; keyColor?: string; status: IdStatus; trace: TraceLine[] | null; label?: string
}) {
  const [rid] = useState(() => hex(8).toUpperCase())
  const [dev, setDev] = useState('')
  useEffect(() => {
    const ua = navigator.userAgent
    const os = /Windows/.test(ua) ? 'WINDOWS' : /Android/.test(ua) ? 'ANDROID' : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'LINUX' : 'UNKNOWN'
    const br = /Edg\//.test(ua) ? 'EDGE' : /Firefox\//.test(ua) ? 'FIREFOX' : /Chrome\//.test(ua) ? 'CHROME' : /Safari\//.test(ua) ? 'SAFARI' : 'BROWSER'
    setDev(os + ' · ' + br)
  }, [])
  const [st, stc] = STATUS[status]
  const seed = callsign || email.split('@')[0] || 'unknown'

  const rows: [string, string, string?][] = [
    ['CALLSIGN', callsign || '—'],
    ['INBOX', email ? mask(email) : '—'],
    ['ACCESS KEY', keyLabel || '—', keyColor],
    ['DEVICE', dev || '—'],
  ]

  return (
    <Frame color={stc} style={{ padding: '18px' }} label={'IDENTITY RECORD #' + rid}>
      <div className="ip-top">
        <div className={'ip-photo' + (status === 'working' ? ' scan' : '')}>
          <OperatorAvatar seed={seed} color={status === 'denied' ? C.red : status === 'active' ? C.green : C.cyan} size={86} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: mono, fontSize: '.52rem', letterSpacing: '.28em', color: C.dim }}>{label || 'SUBJECT'}</div>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: '1.05rem', color: C.white, letterSpacing: '.06em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '3px' }}>
            {callsign ? callsign.toUpperCase() : email ? mask(email).toUpperCase() : 'UNIDENTIFIED'}
          </div>
          <div className={status === 'working' ? 'cd-blink' : ''} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontFamily: mono, fontSize: '.58rem', letterSpacing: '.22em', color: stc, border: '1px solid ' + stc, padding: '3px 8px' }}>
            <span style={{ width: 6, height: 6, background: stc, boxShadow: '0 0 6px ' + stc }} /> {st}
          </div>
        </div>
      </div>

      <dl className="ip-more" style={{ margin: '16px 0 0', display: 'grid', gap: '8px' }}>
        {rows.map(([k, v, c]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', borderBottom: '1px dashed rgba(232,243,246,.07)', paddingBottom: '6px' }}>
            <dt style={{ fontFamily: mono, fontSize: '.54rem', letterSpacing: '.24em', color: C.dim }}>{k}</dt>
            <dd style={{ margin: 0, fontFamily: mono, fontSize: '.7rem', color: c || C.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="ip-more" style={{ marginTop: '14px', minHeight: '9.5em', fontFamily: mono, fontSize: '.64rem', lineHeight: 1.85, background: 'rgba(0,0,0,.35)', border: '1px solid rgba(232,243,246,.06)', padding: '10px 12px' }} aria-live="polite">
        <div style={{ color: C.faint, letterSpacing: '.2em', fontSize: '.52rem', marginBottom: '4px' }}>LIVE TRACE</div>
        {trace ? trace.map((l, i) => (
          <div key={i + l.text} className={l.state === 'run' ? 'cd-blink' : ''} style={{ color: l.state === 'ok' ? C.green : l.state === 'fail' ? C.red : l.state === 'run' ? C.cyan : C.faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {l.state === 'ok' ? '[+]' : l.state === 'fail' ? '[x]' : l.state === 'run' ? '[>]' : '[ ]'} {l.text.toLowerCase()}
          </div>
        )) : (
          <div style={{ color: C.dim }}><Typed text={'awaiting credentials'} speed={40} typos={false} keepCursor /></div>
        )}
      </div>

      <style>{`
        .ip-top { display: grid; grid-template-columns: 92px minmax(0, 1fr); gap: 16px; align-items: center; }
        .ip-photo { position: relative; width: 92px; height: 92px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(232,243,246,.14); overflow: hidden; background: rgba(0,212,255,.03); }
        .ip-photo.scan::after { content: ''; position: absolute; left: 0; right: 0; height: 2px; background: #00d4ff; box-shadow: 0 0 10px #00d4ff; animation: ipScan 1s linear infinite; }
        @keyframes ipScan { from { top: 0 } to { top: 100% } }
        .cd-blink { animation: hxBlink .9s steps(2) infinite; }
        @media (max-width: 860px) { .ip-more { display: none !important } .ip-top { grid-template-columns: 64px minmax(0, 1fr); gap: 12px } .ip-photo { width: 64px; height: 64px } .ip-photo svg { width: 58px; height: 58px } }
      `}</style>
    </Frame>
  )
}
