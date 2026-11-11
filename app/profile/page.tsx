'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth, Operator } from '../components/AuthProvider'
import OperatorAvatar, { AVATAR_COLORS } from '../components/OperatorAvatar'
import OtpInput from '../components/OtpInput'
import { api } from '../../lib/client/api'
import { CATALOG } from '../../lib/learning'
import { RANK_COLORS, RANK_LIST } from '../../lib/supabase'

const mono = 'JetBrains Mono, monospace'
const sans = 'DM Sans, system-ui, sans-serif'
type Tab = 'progress' | 'profile' | 'security'

const panel: React.CSSProperties = { background: 'linear-gradient(160deg,#17242e,#0f1820)', border: '1px solid rgba(232,243,246,.06)', borderRadius: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06), 0 14px 28px -12px rgba(0,0,0,.6)', padding: 'clamp(16px, 4vw, 24px)' }
const label: React.CSSProperties = { display: 'block', fontFamily: mono, fontSize: '.62rem', letterSpacing: '.22em', color: '#93a8b4', marginBottom: '7px' }
const field: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: '#0a1218', border: '1px solid #5b6f7b', borderRadius: '10px', padding: '12px 14px', color: '#e8f3f6', fontFamily: sans, fontSize: '.92rem', outline: 'none' }
const btn = (c = '#00d4ff', solid = false): React.CSSProperties => ({ fontFamily: mono, fontSize: '.66rem', letterSpacing: '.18em', fontWeight: 700, padding: '10px 16px', cursor: 'pointer', borderRadius: '10px', border: '1px solid ' + (solid ? c : 'rgba(232,243,246,.14)'), color: solid ? '#04070a' : '#e8f3f6', background: solid ? c : 'transparent' })

function ago(iso: string | null): string {
  if (!iso) return 'never'
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return Math.floor(s / 60) + ' min ago'
  if (s < 86400) return Math.floor(s / 3600) + ' h ago'
  if (s < 86400 * 30) return Math.floor(s / 86400) + ' days ago'
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function Ring({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = 22, c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(232,243,246,.08)" strokeWidth="5" />
      <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 28 28)" style={{ transition: 'stroke-dashoffset .8s ease', filter: 'drop-shadow(0 0 4px ' + color + '88)' }} />
      <text x="28" y="32" textAnchor="middle" fontFamily={mono} fontSize="12" fontWeight="700" fill={pct ? color : '#7d93a0'}>{pct}%</text>
    </svg>
  )
}

function activityText(a: Operator['recent'][number]): string {
  const m = CATALOG.find(x => x.id === a.module_id)
  if (a.kind === 'lab_complete') return 'Completed the ' + (m?.title || a.module_id) + ' lab'
  if (a.kind === 'chapter') return 'Read chapter ' + (Number(a.ref) + 1) + ' of ' + (m?.title || a.module_id)
  return a.kind
}

// ─────────────────────────────────────────────────────────── PROGRESS
function ProgressTab({ p }: { p: Operator }) {
  const started = p.modules.filter(m => m.percent > 0).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
  const next = started.find(m => m.percent < 100) || p.modules.find(m => p.interests.includes(m.id) && m.percent === 0) || p.modules.find(m => m.percent === 0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {next && (
        <Link href={'/modules/' + next.id} style={{ ...panel, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', borderColor: next.color + '55' }}>
          <Ring pct={next.percent} color={next.color} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: mono, fontSize: '.58rem', letterSpacing: '.26em', color: next.color }}>{next.percent ? 'CONTINUE WHERE YOU LEFT OFF' : 'RECOMMENDED NEXT'}</div>
            <div style={{ fontFamily: mono, fontSize: '1rem', color: '#e8f3f6', marginTop: '4px' }}>MOD-{next.code} · {next.title}</div>
            <div style={{ fontFamily: sans, fontSize: '.8rem', color: '#7d93a0', marginTop: '3px' }}>
              {next.chaptersRead}/{next.chaptersTotal} chapters · lab {next.labCompleted ? 'complete' : next.labTotal ? next.labSteps + '/' + next.labTotal + ' steps' : 'not started'}{next.updatedAt ? ' · last active ' + ago(next.updatedAt) : ''}
            </div>
          </div>
          <span style={{ fontFamily: mono, color: next.color, fontSize: '1.2rem' }}>▸</span>
        </Link>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '12px' }}>
        {p.modules.map(m => (
          <div key={m.id} style={{ ...panel, padding: '16px', borderColor: m.percent ? m.color + '40' : 'rgba(232,243,246,.07)', opacity: m.percent ? 1 : 0.78 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Ring pct={m.percent} color={m.color} size={50} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: mono, fontSize: '.56rem', letterSpacing: '.22em', color: m.color }}>MOD-{m.code}{m.labCompleted ? ' · ✓ LAB' : ''}</div>
                <div style={{ fontFamily: sans, fontSize: '.88rem', color: '#e8f3f6', marginTop: '2px', lineHeight: 1.3 }}>{m.title}</div>
              </div>
            </div>
            <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '8px', fontFamily: mono, fontSize: '.6rem', color: '#7d93a0' }}>
              <div>CHAPTERS<div style={{ height: '3px', background: 'rgba(232,243,246,.08)', marginTop: '4px' }}><div style={{ height: '100%', width: (m.chaptersTotal ? (m.chaptersRead / m.chaptersTotal) * 100 : 0) + '%', background: m.color }} /></div><span style={{ color: '#c9d9df' }}>{m.chaptersRead}/{m.chaptersTotal}</span></div>
              <div>LAB<div style={{ height: '3px', background: 'rgba(232,243,246,.08)', marginTop: '4px' }}><div style={{ height: '100%', width: (m.labCompleted ? 100 : m.labTotal ? (m.labSteps / m.labTotal) * 100 : 0) + '%', background: m.color }} /></div><span style={{ color: '#c9d9df' }}>{m.labCompleted ? 'DONE' : m.labTotal ? m.labSteps + '/' + m.labTotal : '—'}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <Link href={'/modules/' + m.id} style={{ ...btn(m.color), textDecoration: 'none', flex: 1, textAlign: 'center', padding: '8px' }}>{m.chaptersRead ? 'READ' : 'START'}</Link>
              <Link href={'/modules/' + m.id + '/lab'} style={{ ...btn(m.color), textDecoration: 'none', flex: 1, textAlign: 'center', padding: '8px' }}>{m.labCompleted ? 'REPLAY' : 'LAB'}</Link>
            </div>
          </div>
        ))}
      </div>

      <div style={panel}>
        <div style={{ fontFamily: mono, fontSize: '.6rem', letterSpacing: '.26em', color: '#93a8b4', marginBottom: '12px' }}>// ACTIVITY LOG</div>
        {p.recent.length === 0 ? (
          <p style={{ fontFamily: sans, color: '#7d93a0', fontSize: '.88rem', margin: 0 }}>Nothing yet. Open any module and your first chapter will show up here.</p>
        ) : (
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {p.recent.map((a, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontFamily: sans, fontSize: '.85rem', color: '#c9d9df', borderBottom: '1px solid rgba(232,243,246,.06)', paddingBottom: '7px' }}>
                <span>{activityText(a)}</span>
                <span style={{ fontFamily: mono, fontSize: '.66rem', color: a.xp ? '#00ff41' : '#7d93a0', whiteSpace: 'nowrap' }}>{a.xp ? '+' + a.xp + ' XP · ' : ''}{ago(a.created_at)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────── PROFILE
function ProfileTab({ p, onSaved }: { p: Operator; onSaved: (u: Operator) => void }) {
  const [f, setF] = useState({ display_name: p.display_name, username: p.username, bio: p.bio || '', country: p.country || '', goal: p.goal || '', skill_level: p.skill_level || 'beginner', avatar_seed: p.avatar_seed || p.username, avatar_color: p.avatar_color || AVATAR_COLORS[0], is_public: p.is_public, interests: p.interests })
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const [busy, setBusy] = useState(false)
  async function save() {
    setBusy(true); setMsg(null)
    const r = await api<{ user?: Operator }>('/api/profile', f, 'PATCH')
    setBusy(false)
    if (r.ok === false) return setMsg({ ok: false, t: r.error || 'Could not save.' })
    if (r.user) onSaved(r.user)
    setMsg({ ok: true, t: 'Profile saved.' })
  }
  return (
    <div style={{ ...panel, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <OperatorAvatar seed={f.avatar_seed} color={f.avatar_color} size={96} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button style={btn('#00d4ff')} onClick={() => setF({ ...f, avatar_seed: p.username + ':' + Math.random().toString(36).slice(2, 8) })}>↻ NEW SIGIL</button>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {AVATAR_COLORS.map(c => <button key={c} aria-label={'Colour ' + c} onClick={() => setF({ ...f, avatar_color: c })} style={{ width: '24px', height: '24px', borderRadius: '50%', background: c, cursor: 'pointer', border: f.avatar_color === c ? '2px solid #fff' : '2px solid transparent' }} />)}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '14px' }}>
        <label><span style={label}>DISPLAY NAME</span><input style={field} value={f.display_name} maxLength={40} onChange={e => setF({ ...f, display_name: e.target.value })} /></label>
        <label><span style={label}>CALLSIGN</span><input style={field} value={f.username} maxLength={20} onChange={e => setF({ ...f, username: e.target.value.replace(/\s/g, '') })} /></label>
        <label><span style={label}>COUNTRY</span><input style={field} value={f.country} maxLength={56} onChange={e => setF({ ...f, country: e.target.value })} /></label>
        <label><span style={label}>CLEARANCE</span>
          <select style={field} value={f.skill_level} onChange={e => setF({ ...f, skill_level: e.target.value })}>
            <option value="beginner">New recruit</option><option value="intermediate">Field agent</option><option value="advanced">Specialist</option><option value="expert">Veteran</option>
          </select>
        </label>
      </div>
      <label><span style={label}>BIO</span><textarea style={{ ...field, minHeight: '80px', fontFamily: sans, resize: 'vertical' }} maxLength={280} value={f.bio} onChange={e => setF({ ...f, bio: e.target.value })} placeholder="What are you working toward?" /></label>
      <label><span style={label}>MISSION</span><input style={{ ...field, fontFamily: sans }} maxLength={160} value={f.goal} onChange={e => setF({ ...f, goal: e.target.value })} placeholder="e.g. Pass OSCP by June" /></label>
      <div>
        <span style={label}>FOCUS SECTORS</span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATALOG.map(m => { const on = f.interests.includes(m.id); return (
            <button key={m.id} onClick={() => setF({ ...f, interests: on ? f.interests.filter(x => x !== m.id) : [...f.interests, m.id] })} style={{ fontFamily: mono, fontSize: '.6rem', padding: '6px 10px', cursor: 'pointer', border: '1px solid ' + (on ? m.color : 'rgba(232,243,246,.08)'), color: on ? m.color : '#7d93a0', background: on ? m.color + '12' : 'transparent' }}>{m.code} {m.title}</button>
          ) })}
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: sans, fontSize: '.88rem', color: '#c9d9df', cursor: 'pointer' }}>
        <input type="checkbox" checked={f.is_public} onChange={e => setF({ ...f, is_public: e.target.checked })} /> Show me on the public leaderboard
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <button style={btn('#00ff41', true)} onClick={save} disabled={busy}>{busy ? 'SAVING…' : 'SAVE PROFILE'}</button>
        {msg && <span role="status" style={{ fontFamily: sans, fontSize: '.85rem', color: msg.ok ? '#00ff41' : '#ff6b5f' }}>{msg.t}</span>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────── SECURITY
type Sess = { id: string; device_label: string; location: string; ip: string; created_at: string; last_seen_at: string; current: boolean }
type Ev = { type: string; location: string; ip: string; created_at: string }
const EVENT_TEXT: Record<string, string> = {
  login: 'Signed in', logout: 'Signed out', new_device: 'Signed in from a new device', login_failed: 'Failed sign-in attempt', mfa_failed: 'Wrong two-factor code',
  mfa_passed: 'Two-factor passed', mfa_challenge: 'Two-factor requested', email_verified: 'Email verified', register: 'Account created', password_reset: 'Password reset',
  reset_requested: 'Password reset requested', '2fa_enabled': 'Two-factor turned on', '2fa_disabled': 'Two-factor turned off', session_revoked: 'A session was signed out',
  sessions_revoked_all: 'Signed out all other sessions', verify_failed: 'Wrong verification code',
}

function SecurityTab({ p, refresh }: { p: Operator; refresh: () => void }) {
  const [sessions, setSessions] = useState<Sess[]>([])
  const [events, setEvents] = useState<Ev[]>([])
  const [setup, setSetup] = useState<{ qr: string; secret: string } | null>(null)
  const [code, setCode] = useState('')
  const [backup, setBackup] = useState<string[] | null>(null)
  const [disable, setDisable] = useState({ open: false, password: '', code: '' })
  const [del, setDel] = useState({ open: false, password: '' })
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const r = await api<{ sessions: Sess[]; events: Ev[] }>('/api/auth/sessions')
    if (r.sessions) { setSessions(r.sessions); setEvents(r.events) }
  }, [])
  useEffect(() => { load() }, [load])

  async function startSetup() { setMsg(null); const r = await api<{ qr: string; secret: string }>('/api/auth/2fa/setup', {}); if (r.ok === false) return setMsg({ ok: false, t: r.error || 'Failed' }); setSetup({ qr: r.qr, secret: r.secret }); setCode('') }
  async function enable(v?: string) {
    const c = v || code; if (c.length !== 6 || busy) return
    setBusy(true); const r = await api<{ backupCodes: string[] }>('/api/auth/2fa/enable', { code: c }); setBusy(false)
    if (r.ok === false) { setCode(''); return setMsg({ ok: false, t: r.error || 'Failed' }) }
    setSetup(null); setBackup(r.backupCodes); setMsg({ ok: true, t: 'Two-factor is on. Other devices were signed out.' }); refresh(); load()
  }
  async function turnOff() {
    setBusy(true); const r = await api('/api/auth/2fa/disable', { password: disable.password, code: disable.code }); setBusy(false)
    if (r.ok === false) return setMsg({ ok: false, t: r.error || 'Failed' })
    setDisable({ open: false, password: '', code: '' }); setMsg({ ok: true, t: 'Two-factor turned off.' }); refresh(); load()
  }
  async function revoke(id?: string) { await api('/api/auth/sessions', id ? { id } : { all: true }, 'DELETE'); load() }
  async function deleteAccount() {
    setBusy(true); const r = await api('/api/account', { password: del.password }, 'DELETE'); setBusy(false)
    if (r.ok === false) return setMsg({ ok: false, t: r.error || 'Failed' })
    window.location.href = '/welcome'
  }
  function downloadCodes() {
    if (!backup) return
    const blob = new Blob(['GHOSTNET backup codes for ' + p.email + '\nEach code works once. Keep them somewhere safe.\n\n' + backup.join('\n') + '\n'], { type: 'text/plain' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ghostnet-backup-codes.txt'; a.click(); URL.revokeObjectURL(a.href)
  }

  return (
    <div id="security" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {msg && <div role="status" style={{ borderLeft: '3px solid ' + (msg.ok ? '#00ff41' : '#ff4136'), padding: '10px 12px', background: msg.ok ? 'rgba(232,243,246,.06)' : 'rgba(255,65,54,.07)', fontFamily: sans, fontSize: '.88rem', color: msg.ok ? '#9fffaf' : '#ffb0a8' }}>{msg.t}</div>}

      <div style={panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: '.6rem', letterSpacing: '.26em', color: '#93a8b4' }}>// TWO-FACTOR AUTHENTICATION</div>
            <div style={{ fontFamily: mono, fontSize: '.95rem', color: p.two_factor ? '#00ff41' : '#ffb347', marginTop: '6px' }}>{p.two_factor ? '● ACTIVE' : '○ NOT SET UP'}</div>
            <p style={{ fontFamily: sans, fontSize: '.85rem', color: '#7faf8f', margin: '6px 0 0', maxWidth: '520px', lineHeight: 1.55 }}>Adds a 6-digit code from an authenticator app (Google Authenticator, Authy, 1Password) every time you sign in.</p>
          </div>
          {!p.two_factor && !setup && <button style={btn('#00ff41', true)} onClick={startSetup}>SET UP 2FA</button>}
          {p.two_factor && !disable.open && <button style={btn('#ff4136')} onClick={() => setDisable({ ...disable, open: true })}>TURN OFF</button>}
        </div>

        {setup && (
          <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'minmax(0, 220px) minmax(0, 1fr)', gap: '22px', alignItems: 'center' }} className="sec-grid">
            <style>{`@media (max-width: 620px) { .sec-grid { grid-template-columns: minmax(0, 1fr) !important; justify-items: center } }`}</style>
            <div style={{ background: '#e9ffe9', padding: '8px', lineHeight: 0, maxWidth: '220px' }} dangerouslySetInnerHTML={{ __html: setup.qr.replace('<svg ', '<svg style="width:100%;height:auto" ') }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              <p style={{ fontFamily: sans, fontSize: '.88rem', color: '#c9d9df', margin: 0, lineHeight: 1.55 }}>1. Scan the code with your authenticator app (or type the key below).<br />2. Enter the 6-digit code it shows.</p>
              <code style={{ fontFamily: mono, fontSize: '.8rem', color: '#00d4ff', background: 'rgba(0,212,255,.06)', padding: '8px 10px', wordBreak: 'break-all' }}>{setup.secret}</code>
              <OtpInput value={code} onChange={setCode} onComplete={enable} disabled={busy} accent="#00d4ff" />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={btn('#00ff41', true)} onClick={() => enable()} disabled={busy || code.length !== 6}>{busy ? 'CHECKING…' : 'ACTIVATE'}</button>
                <button style={btn('#4f8f5f')} onClick={() => setSetup(null)}>CANCEL</button>
              </div>
            </div>
          </div>
        )}

        {backup && (
          <div style={{ marginTop: '18px', border: '1px dashed #ffb347', padding: '16px', background: 'rgba(255,179,71,.05)' }}>
            <div style={{ fontFamily: mono, fontSize: '.66rem', letterSpacing: '.2em', color: '#ffb347' }}>BACKUP CODES · SHOWN ONCE</div>
            <p style={{ fontFamily: sans, fontSize: '.85rem', color: '#d8c8a8', lineHeight: 1.55 }}>If you lose your phone, each of these lets you sign in once. Save them now; we can&apos;t show them again.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px', fontFamily: mono, fontSize: '.9rem', color: '#ffe0b0' }}>{backup.map(c => <span key={c}>{c}</span>)}</div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
              <button style={btn('#ffb347')} onClick={downloadCodes}>DOWNLOAD .TXT</button>
              <button style={btn('#ffb347')} onClick={() => navigator.clipboard?.writeText(backup.join('\n'))}>COPY</button>
              <button style={btn('#4f8f5f')} onClick={() => setBackup(null)}>I SAVED THEM</button>
            </div>
          </div>
        )}

        {disable.open && (
          <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px', alignItems: 'end' }}>
            <label><span style={label}>PASSWORD</span><input type="password" style={field} value={disable.password} onChange={e => setDisable({ ...disable, password: e.target.value })} autoComplete="current-password" /></label>
            <label><span style={label}>AUTHENTICATOR CODE</span><input style={field} inputMode="numeric" maxLength={6} value={disable.code} onChange={e => setDisable({ ...disable, code: e.target.value.replace(/\D/g, '') })} /></label>
            <div style={{ display: 'flex', gap: '8px' }}><button style={btn('#ff4136', true)} onClick={turnOff} disabled={busy}>CONFIRM</button><button style={btn('#4f8f5f')} onClick={() => setDisable({ open: false, password: '', code: '' })}>CANCEL</button></div>
          </div>
        )}
      </div>

      <div style={panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: mono, fontSize: '.6rem', letterSpacing: '.26em', color: '#93a8b4' }}>// ACTIVE SESSIONS</div>
          {sessions.length > 1 && <button style={btn('#ff4136')} onClick={() => revoke()}>SIGN OUT ALL OTHERS</button>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sessions.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '10px 12px', border: '1px solid ' + (s.current ? 'rgba(0,255,65,.35)' : 'rgba(0,255,65,.1)') }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: mono, fontSize: '.8rem', color: '#e8f3f6' }}>{s.device_label}{s.current && <span style={{ color: '#00ff41', fontSize: '.6rem', marginLeft: '8px' }}>● THIS DEVICE</span>}</div>
                <div style={{ fontFamily: sans, fontSize: '.78rem', color: '#7d93a0', marginTop: '3px' }}>{s.location} · {s.ip} · active {ago(s.last_seen_at)}</div>
              </div>
              {!s.current && <button style={btn('#ff4136')} onClick={() => revoke(s.id)}>SIGN OUT</button>}
            </div>
          ))}
        </div>
      </div>

      <div style={panel}>
        <div style={{ fontFamily: mono, fontSize: '.6rem', letterSpacing: '.26em', color: '#93a8b4', marginBottom: '12px' }}>// SECURITY EVENTS</div>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {events.map((e, i) => (
            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontFamily: sans, fontSize: '.84rem', color: /fail|wrong/i.test(EVENT_TEXT[e.type] || '') ? '#ffb0a8' : '#c9d9df' }}>
              <span>{EVENT_TEXT[e.type] || e.type}<span style={{ color: '#4f7f5f' }}> · {e.location}</span></span>
              <span style={{ fontFamily: mono, fontSize: '.64rem', color: '#7d93a0', whiteSpace: 'nowrap' }}>{ago(e.created_at)}</span>
            </li>
          ))}
        </ol>
        <p style={{ fontFamily: sans, fontSize: '.8rem', color: '#7d93a0', margin: '14px 0 0' }}>Need to change your password? <a href="/auth?mode=forgot" style={{ color: '#00d4ff' }}>Reset it with an email code</a>; every session is signed out afterwards.</p>
      </div>

      <div style={{ ...panel, borderColor: 'rgba(255,65,54,.25)' }}>
        <div style={{ fontFamily: mono, fontSize: '.6rem', letterSpacing: '.26em', color: '#ff6b5f' }}>// DANGER ZONE</div>
        {!del.open ? (
          <button style={{ ...btn('#ff4136'), marginTop: '12px' }} onClick={() => setDel({ open: true, password: '' })}>DELETE MY ACCOUNT</button>
        ) : (
          <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'end' }}>
            <label style={{ flex: '1 1 220px' }}><span style={label}>CONFIRM WITH PASSWORD</span><input type="password" style={field} value={del.password} onChange={e => setDel({ ...del, password: e.target.value })} /></label>
            <button style={btn('#ff4136', true)} onClick={deleteAccount} disabled={busy || !del.password}>PERMANENTLY DELETE</button>
            <button style={btn('#4f8f5f')} onClick={() => setDel({ open: false, password: '' })}>CANCEL</button>
            <p style={{ flexBasis: '100%', fontFamily: sans, fontSize: '.8rem', color: '#d89f98', margin: 0 }}>This erases your profile, XP and all progress. It cannot be undone.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────── PAGE
export default function ProfilePage() {
  const { profile, loading, refreshProfile, setProfile } = useAuth()
  const [tab, setTab] = useState<Tab>('progress')

  useEffect(() => { if (window.location.hash === '#security') setTab('security') }, [])
  useEffect(() => { if (!loading && !profile) window.location.href = '/auth?mode=login&from=/profile' }, [loading, profile])

  if (!profile) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: '.7rem', letterSpacing: '.3em', color: '#7d93a0' }}>DECRYPTING OPERATOR FILE…</div>
  }

  const p = profile
  const rankColor = RANK_COLORS[p.ghost_rank] || '#00ff41'
  const cur = RANK_LIST.find(r => r.title === p.ghost_rank)?.minXp ?? 0
  const toNext = p.next_rank ? Math.round(((p.xp - cur) / (p.next_rank.minXp - cur)) * 100) : 100

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header dossier */}
      <div style={{ ...panel, position: 'relative', overflow: 'hidden', borderColor: rankColor + '44', clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 0% 0%, ' + rankColor + '18, transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', gap: 'clamp(16px, 4vw, 28px)', alignItems: 'center', flexWrap: 'wrap' }}>
          <OperatorAvatar seed={p.avatar_seed || p.username} color={p.avatar_color || rankColor} size={104} />
          <div style={{ flex: '1 1 260px', minWidth: 0 }}>
            <div style={{ fontFamily: mono, fontSize: '.58rem', letterSpacing: '.3em', color: rankColor }}>OPERATOR FILE · {p.ghost_rank.toUpperCase()}{p.role !== 'student' ? ' · ' + p.role.toUpperCase().replace('_', ' ') : ''}</div>
            <h1 style={{ fontFamily: mono, fontSize: 'clamp(1.3rem, 5vw, 1.9rem)', color: '#e8f3f6', margin: '6px 0 2px', letterSpacing: '.06em' }}>{p.display_name}</h1>
            <div style={{ fontFamily: mono, fontSize: '.74rem', color: '#7d93a0' }}>@{p.username}{p.country ? ' · ' + p.country : ''} · enlisted {new Date(p.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
            {p.goal && <div style={{ fontFamily: sans, fontSize: '.85rem', color: '#c9d9df', marginTop: '8px' }}>◆ {p.goal}</div>}
            <div style={{ marginTop: '14px', maxWidth: '460px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: '.6rem', color: '#7d93a0', marginBottom: '5px' }}>
                <span style={{ color: rankColor }}>{p.xp.toLocaleString()} XP</span>
                <span>{p.next_rank ? (p.next_rank.minXp - p.xp).toLocaleString() + ' XP TO ' + p.next_rank.title.toUpperCase() : 'MAX RANK'}</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(232,243,246,.08)' }}><div style={{ height: '100%', width: Math.max(2, toNext) + '%', background: 'linear-gradient(90deg, ' + rankColor + ', ' + (p.next_rank?.color || rankColor) + ')', boxShadow: '0 0 10px ' + rankColor, transition: 'width .8s ease' }} /></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', flex: '1 1 240px' }}>
            {[['OVERALL', p.overall_percent + '%', '#00ff41'], ['STREAK', p.streak_days + 'd', '#ffb347'], ['LABS', p.labs_completed + '/13', '#00d4ff'], ['CHAPTERS', String(p.chapters_read), '#bf5fff']].map(([k, v, c]) => (
              <div key={k} style={{ border: '1px solid ' + c + '30', padding: '10px 12px', background: c + '08' }}>
                <div style={{ fontFamily: mono, fontSize: '1.15rem', color: c, fontWeight: 700 }}>{v}</div>
                <div style={{ fontFamily: mono, fontSize: '.54rem', letterSpacing: '.22em', color: '#7d93a0', marginTop: '3px' }}>{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div role="tablist" style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(232,243,246,.1)' }}>
        {(['progress', 'profile', 'security'] as Tab[]).map(t => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} style={{ fontFamily: mono, fontSize: '.66rem', letterSpacing: '.24em', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: tab === t ? '#e8f3f6' : '#7d93a0', borderBottom: '2px solid ' + (tab === t ? '#00d4ff' : 'transparent') }}>
            {t === 'progress' ? 'PROGRESS' : t === 'profile' ? 'PROFILE' : 'SECURITY' + (p.two_factor ? '' : ' ⚠')}
          </button>
        ))}
      </div>

      {tab === 'progress' && <ProgressTab p={p} />}
      {tab === 'profile' && <ProfileTab p={p} onSaved={u => setProfile(u)} />}
      {tab === 'security' && <SecurityTab p={p} refresh={refreshProfile} />}
    </div>
  )
}
