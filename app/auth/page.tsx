'use client'
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import IdentityScanner, { ScanState } from './IdentityScanner'
import OtpInput from '../components/OtpInput'
import { api } from '../../lib/client/api'

const mono = 'JetBrains Mono, monospace'
const sans = 'DM Sans, system-ui, sans-serif'

type Mode = 'login' | 'register' | 'verify' | 'mfa' | 'forgot' | 'reset' | 'granted'
type SeqLine = { text: string; state: 'wait' | 'run' | 'ok' | 'fail' }

const SEQ = {
  login: ['Opening encrypted channel (TLS 1.3)', 'Hashing credential · scrypt N=32768', 'Matching identity record', 'Checking device fingerprint', 'Issuing session token'],
  register: ['Validating callsign and email', 'Checking mail server (MX record)', 'Hashing credential · scrypt N=32768', 'Sealing identity record', 'Dispatching access code'],
  verify: ['Checking access code', 'Activating identity', 'Fingerprinting device', 'Issuing session token'],
  mfa: ['Verifying one-time code (TOTP)', 'Blocking code replay', 'Issuing session token'],
  forgot: ['Locating identity', 'Dispatching reset code'],
  reset: ['Checking reset code', 'Hashing new credential · scrypt', 'Revoking every session'],
}

function safeFrom(v: string | null): string {
  return v && v.startsWith('/') && !v.startsWith('//') && !v.startsWith('/auth') && !v.startsWith('/welcome') ? v : '/'
}

/** Rough strength estimate for the meter (the server enforces the real policy). */
function strength(pw: string): { score: number; label: string; color: string } {
  let bits = 0
  const pools = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/]
  const pool = [26, 26, 10, 33].reduce((a, n, i) => a + (pools[i].test(pw) ? n : 0), 0)
  if (pool) bits = pw.length * Math.log2(pool)
  if (/(.)\1{2,}/.test(pw)) bits -= 10
  if (/^(?:password|qwerty|letmein|admin|welcome)/i.test(pw)) bits -= 25
  const score = bits < 40 ? 0 : bits < 55 ? 1 : bits < 70 ? 2 : bits < 90 ? 3 : 4
  return { score, label: ['WEAK', 'FAIR', 'GOOD', 'STRONG', 'FORTIFIED'][score], color: ['#ff4136', '#ff9500', '#ffb347', '#00d4ff', '#00ff41'][score] }
}

function Field({ label, children, hint, error }: { label: string; children: React.ReactNode; hint?: React.ReactNode; error?: string | null }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.24em', color: error ? '#ff6b5f' : '#4f9f5f', marginBottom: '7px' }}>{label}</span>
      {children}
      {(error || hint) && <span style={{ display: 'block', fontFamily: mono, fontSize: '0.64rem', color: error ? '#ff6b5f' : '#3f7f4f', marginTop: '6px', lineHeight: 1.5 }}>{error || hint}</span>}
    </label>
  )
}

function AuthInner() {
  const router = useRouter()
  const params = useSearchParams()
  const from = safeFrom(params.get('from'))
  const initial = (params.get('mode') as Mode) || 'login'

  const [mode, setMode] = useState<Mode>(['login', 'register', 'forgot'].includes(initial) ? initial : 'login')
  const [regStep, setRegStep] = useState(0)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [code, setCode] = useState('')
  const [challenge, setChallenge] = useState('')
  const [useBackup, setUseBackup] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorField, setErrorField] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [scan, setScan] = useState<ScanState>('idle')
  const [seq, setSeq] = useState<SeqLine[] | null>(null)
  const [uname, setUname] = useState<{ ok: boolean; msg?: string } | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const [welcomeName, setWelcomeName] = useState('')
  const shakeRef = useRef<HTMLDivElement>(null)

  const pw = useMemo(() => strength(password), [password])

  useEffect(() => { if (cooldown <= 0) return; const t = setTimeout(() => setCooldown(c => c - 1), 1000); return () => clearTimeout(t) }, [cooldown])
  useEffect(() => { setScan(s => (s === 'idle' && (email || password) ? 'typing' : s)) }, [email, password])

  // Live callsign check while registering.
  useEffect(() => {
    if (mode !== 'register' || regStep !== 0 || username.trim().length < 3) { setUname(null); return }
    const t = setTimeout(async () => {
      const r = await api<{ available: boolean; error?: string }>('/api/auth/username?u=' + encodeURIComponent(username.trim()))
      setUname({ ok: !!r.available, msg: r.error })
    }, 350)
    return () => clearTimeout(t)
  }, [username, mode, regStep])

  const go = (m: Mode) => { setMode(m); setError(null); setErrorField(null); setNotice(null); setCode(''); setSeq(null); setScan('idle') }

  const shake = () => {
    const el = shakeRef.current
    if (!el) return
    el.classList.remove('au-shake'); void el.offsetWidth; el.classList.add('au-shake')
  }

  /** Plays the verification sequence while the real request runs, then resolves it. */
  const runSequence = useCallback(async <T,>(lines: string[], request: Promise<unknown>): Promise<T & { ok?: boolean; error?: string; field?: string }> => {
    setBusy(true); setError(null); setErrorField(null); setScan('scanning')
    const state: SeqLine[] = lines.map((t, i) => ({ text: t, state: i === 0 ? 'run' : 'wait' }))
    setSeq([...state])
    let idx = 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = setInterval(() => {
      if (idx < lines.length - 1) {
        state[idx].state = 'ok'; idx++; state[idx].state = 'run'; setSeq([...state])
      }
    }, reduce ? 120 : 420)
    const res = (await request) as T & { ok?: boolean; error?: string; field?: string }
    await new Promise(r => setTimeout(r, reduce ? 150 : Math.max(0, (lines.length - 1 - idx) * 180)))
    clearInterval(timer)
    if (res.ok === false) {
      state[idx].state = 'fail'
      for (let j = idx + 1; j < state.length; j++) state[j].state = 'wait'
      setSeq([...state]); setScan('denied'); shake()
    } else {
      state.forEach(s => (s.state = 'ok')); setSeq([...state])
    }
    setBusy(false)
    return res
  }, [])

  function finish(next: string | undefined, name?: string) {
    try { localStorage.setItem('gn_operator', '1') } catch {}
    window.dispatchEvent(new Event('ghostnet_auth_changed'))
    setWelcomeName(name || username || '')
    setScan('granted')
    setMode('granted')
    setTimeout(() => router.replace(next === 'onboard' ? '/onboarding' + (from !== '/' ? '?from=' + encodeURIComponent(from) : '') : from), 1600)
  }

  function showError(r: { error?: string; field?: string }) {
    setError(r.error || 'Something went wrong.')
    setErrorField(r.field || null)
  }

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    const r = await runSequence<{ next?: string; challenge?: string; email?: string }>(SEQ.login, api('/api/auth/login', { email, password }))
    if (r.ok === false) return showError(r)
    if (r.next === 'mfa') { setChallenge(r.challenge || ''); go('mfa'); return }
    if (r.next === 'verify') { go('verify'); setNotice('Your email is not verified yet. We sent a fresh code to ' + email + '.'); setCooldown(30); return }
    finish(r.next)
  }

  async function submitRegister(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setError(null); setErrorField(null)
    if (regStep === 0) {
      if (!/^[A-Za-z0-9_-]{3,20}$/.test(username.trim())) return showError({ error: 'Callsign: 3 to 20 characters, letters, numbers, _ or -.', field: 'username' })
      if (uname && !uname.ok) return showError({ error: uname.msg || 'That callsign is taken.', field: 'username' })
      setRegStep(1); return
    }
    if (regStep === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return showError({ error: 'Enter a valid email address.', field: 'email' })
      setRegStep(2); return
    }
    if (pw.score < 2) return showError({ error: 'Make it stronger: 10+ characters mixing cases, numbers and symbols, or a long passphrase.', field: 'password' })
    const r = await runSequence<{ next?: string }>(SEQ.register, api('/api/auth/register', { email: email.trim(), username: username.trim(), password }))
    if (r.ok === false) {
      showError(r)
      if (r.field === 'username') setRegStep(0)
      else if (r.field === 'email') setRegStep(1)
      return
    }
    go('verify')
    setNotice('Access code sent to ' + email.trim() + '. Check your inbox (and spam folder).')
    setCooldown(30)
  }

  async function submitVerify(v?: string) {
    const c = v || code
    if (busy || c.length !== 6) return
    const r = await runSequence<{ next?: string }>(SEQ.verify, api('/api/auth/verify', { email: email.trim(), code: c }))
    if (r.ok === false) { showError(r); setCode(''); return }
    finish(r.next)
  }

  async function submitMfa(v?: string) {
    const c = (v || code).trim()
    if (busy || (!useBackup && c.length !== 6) || (useBackup && c.replace('-', '').length !== 10)) return
    const r = await runSequence<{ next?: string; restart?: boolean; backupCodesLeft?: number }>(SEQ.mfa, api('/api/auth/mfa', { challenge, code: c }))
    if (r.ok === false) {
      showError(r); setCode('')
      if (r.restart) setTimeout(() => go('login'), 1800)
      return
    }
    if (typeof r.backupCodesLeft === 'number') setNotice(r.backupCodesLeft + ' backup codes left.')
    finish(r.next)
  }

  async function submitForgot(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    const r = await runSequence(SEQ.forgot, api('/api/auth/forgot', { email: email.trim() }))
    if (r.ok === false) return showError(r)
    go('reset')
    setNotice('If an account exists for ' + email.trim() + ', a reset code is on its way.')
    setCooldown(30)
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    if (pw.score < 2) return showError({ error: 'Choose a stronger password.', field: 'password' })
    const r = await runSequence(SEQ.reset, api('/api/auth/reset', { email: email.trim(), code, password }))
    if (r.ok === false) return showError(r)
    setPassword(''); setCode('')
    go('login')
    setNotice('Password changed and every session signed out. Sign in with your new password.')
  }

  async function resend(purpose: 'verify' | 'reset') {
    if (cooldown > 0) return
    const r = await api('/api/auth/resend', { email: email.trim(), purpose })
    if (r.ok === false) return showError(r)
    setNotice('New code sent. Older codes no longer work.'); setError(null); setCooldown(45)
  }

  const input = (hasErr: boolean): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box', background: 'rgba(0,14,3,0.75)', border: '1px solid ' + (hasErr ? 'rgba(255,65,54,0.65)' : 'rgba(0,255,65,0.22)'),
    borderRadius: '4px', padding: '13px 14px', color: '#d8ffd8', fontFamily: mono, fontSize: '0.92rem', outline: 'none', transition: 'border-color .15s, box-shadow .15s',
  })

  const title: Record<Mode, [string, string]> = {
    login: ['AUTHENTICATION PORTAL', 'SYSTEM ACCESS'],
    register: ['OPERATOR ENLISTMENT', ['CHOOSE YOUR CALLSIGN', 'LINK A SECURE INBOX', 'FORGE YOUR KEY'][regStep]],
    verify: ['IDENTITY VERIFICATION', 'ENTER ACCESS CODE'],
    mfa: ['SECOND FACTOR', 'AUTHENTICATOR CODE'],
    forgot: ['CREDENTIAL RECOVERY', 'RESET ACCESS KEY'],
    reset: ['CREDENTIAL RECOVERY', 'SET A NEW KEY'],
    granted: ['SESSION ESTABLISHED', 'ACCESS GRANTED'],
  }

  const scannerLabel = mode === 'register' ? 'ENLISTMENT ' + (regStep + 1) + ' / 3' : mode === 'verify' ? 'CHECK YOUR INBOX' : mode === 'mfa' ? 'OPEN YOUR AUTHENTICATOR' : undefined

  return (
    <div className="au-root">
      <style>{`
        .au-root { position: fixed; inset: 0; z-index: 9999; background: #000; overflow-y: auto; color: #d8ffd8; }
        .au-grid { position: fixed; inset: -50% -50% 0 -50%; background-image: linear-gradient(rgba(0,255,65,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.07) 1px, transparent 1px);
          background-size: 46px 46px; transform: perspective(600px) rotateX(62deg); transform-origin: 50% 100%; animation: auGrid 3.5s linear infinite; pointer-events: none; mask-image: linear-gradient(to top, #000 10%, transparent 75%); -webkit-mask-image: linear-gradient(to top, #000 10%, transparent 75%); }
        @keyframes auGrid { to { background-position: 0 46px } }
        .au-vignette { position: fixed; inset: 0; background: radial-gradient(ellipse at 50% 40%, transparent 30%, #000 85%); pointer-events: none; }
        .au-scan { position: fixed; inset: 0; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 3px); pointer-events: none; }
        .au-shell { position: relative; min-height: 100%; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: clamp(24px, 5vw, 70px); max-width: 1100px; margin: 0 auto; padding: 40px 24px; box-sizing: border-box; }
        @media (max-width: 860px) { .au-shell { grid-template-columns: minmax(0, 1fr); padding: 28px 16px 40px; gap: 18px } .au-left { order: 0; max-width: 220px; margin: 0 auto } .au-left-meta { display: none } }
        .au-card { position: relative; background: linear-gradient(160deg, rgba(4,18,7,0.94), rgba(1,7,2,0.96)); border: 1px solid rgba(0,255,65,0.2); padding: clamp(22px, 5vw, 36px);
          clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px)); box-shadow: 0 0 80px rgba(0,255,65,0.06); }
        .au-card::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(115deg, transparent 40%, rgba(0,255,65,0.05) 50%, transparent 60%); background-size: 300% 100%; animation: auSheen 6s linear infinite; }
        @keyframes auSheen { from { background-position: 150% 0 } to { background-position: -150% 0 } }
        .au-corner { position: absolute; width: 0; height: 0; border-style: solid; }
        .au-shake { animation: auShake .45s cubic-bezier(.36,.07,.19,.97); }
        @keyframes auShake { 10%,90% { transform: translateX(-2px) } 20%,80% { transform: translateX(4px) } 30%,50%,70% { transform: translateX(-7px) } 40%,60% { transform: translateX(7px) } }
        .au-in input:focus, .au-in textarea:focus { border-color: #00ff41 !important; box-shadow: 0 0 0 3px rgba(0,255,65,0.12), 0 0 18px rgba(0,255,65,0.15); }
        .au-btn { width: 100%; font-family: 'JetBrains Mono', monospace; font-size: .8rem; letter-spacing: .3em; font-weight: 700; padding: 15px; cursor: pointer; border: 1px solid #00ff41; color: #001a05; background: #00ff41;
          clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%); transition: filter .15s, transform .15s; }
        .au-btn:hover:not(:disabled) { filter: brightness(1.15) drop-shadow(0 0 12px rgba(0,255,65,.6)); transform: translateY(-1px); }
        .au-btn:disabled { opacity: .5; cursor: wait; }
        .au-link { background: none; border: none; padding: 0; color: #00d4ff; font-family: 'JetBrains Mono', monospace; font-size: .68rem; letter-spacing: .12em; cursor: pointer; text-decoration: none; border-bottom: 1px dashed rgba(0,212,255,.35); }
        .au-link:disabled { color: #2f5f6f; cursor: default; border-color: transparent; }
        .au-tab { flex: 1; background: none; border: none; padding: 12px 0; font-family: 'JetBrains Mono', monospace; font-size: .68rem; letter-spacing: .26em; cursor: pointer; border-bottom: 2px solid transparent; color: #3f7f4f; transition: all .2s; }
        .au-tab[aria-selected="true"] { color: #00ff41; border-color: #00ff41; text-shadow: 0 0 10px rgba(0,255,65,.5); }
        .au-seq-run { animation: auBlink .7s steps(2) infinite; }
        @keyframes auBlink { 50% { opacity: .35 } }
        @keyframes auStepIn { from { opacity: 0; transform: translateX(14px) } to { opacity: 1; transform: none } }
        @keyframes auGranted { 0% { opacity: 0; transform: scale(1.6); filter: blur(8px) } 60% { opacity: 1; transform: scale(.96); filter: blur(0) } 100% { transform: scale(1) } }
        .gn-otp:focus { border-color: #00ff41 !important; box-shadow: 0 0 0 3px rgba(0,255,65,.14), 0 0 20px rgba(0,255,65,.25) !important; transform: translateY(-2px); }
        .gn-otp-err { animation: auShake .4s; }
        @media (prefers-reduced-motion: reduce) { .au-grid, .au-card::after { animation: none } }
      `}</style>
      <div className="au-grid" aria-hidden="true" />
      <div className="au-vignette" aria-hidden="true" />
      <div className="au-scan" aria-hidden="true" />

      <div className="au-shell">
        {/* LEFT: identity scanner */}
        <div className="au-left">
          <a href="/welcome" aria-label="GHOSTNET home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '28px', justifyContent: 'center' }} className="au-left-meta">
            <span style={{ fontFamily: mono, fontSize: '12px', color: '#00ff41', fontWeight: 700, border: '1px solid #00ff41', padding: '6px 8px', borderRadius: '4px', boxShadow: '0 0 14px rgba(0,255,65,.3)' }}>GN</span>
            <span style={{ fontFamily: mono, fontSize: '1rem', color: '#00ff41', fontWeight: 700, letterSpacing: '.2em' }}>GHOSTNET</span>
          </a>
          <IdentityScanner state={scan} label={scannerLabel} />
          <div className="au-left-meta" style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
            {[['ENCRYPTION', 'AES-256-GCM'], ['HASHING', 'SCRYPT'], ['SESSION', scan === 'granted' ? 'ACTIVE' : 'LOCKED']].map(([k, v]) => (
              <div key={k} style={{ border: '1px solid rgba(0,255,65,.12)', padding: '8px 10px', background: 'rgba(0,20,5,.4)' }}>
                <div style={{ fontFamily: mono, fontSize: '0.52rem', letterSpacing: '.2em', color: '#2f6f3f' }}>{k}</div>
                <div style={{ fontFamily: mono, fontSize: '0.68rem', color: k === 'SESSION' && scan === 'granted' ? '#00ff41' : '#8fcf9f', marginTop: '3px' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: the console */}
        <div ref={shakeRef} className="au-card au-in">
          <span className="au-corner" style={{ top: 0, right: 0, borderWidth: '0 22px 22px 0', borderColor: 'transparent #00ff41 transparent transparent', opacity: .6 }} aria-hidden="true" />
          <span className="au-corner" style={{ bottom: 0, left: 0, borderWidth: '22px 0 0 22px', borderColor: 'transparent transparent transparent #00ff41', opacity: .6 }} aria-hidden="true" />

          {(mode === 'login' || mode === 'register') && (
            <div role="tablist" style={{ display: 'flex', marginBottom: '22px', borderBottom: '1px solid rgba(0,255,65,.1)' }}>
              <button role="tab" className="au-tab" aria-selected={mode === 'login'} onClick={() => go('login')}>SIGN IN</button>
              <button role="tab" className="au-tab" aria-selected={mode === 'register'} onClick={() => { go('register'); setRegStep(0) }}>ENLIST</button>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.32em', color: mode === 'granted' ? '#00ff41' : '#2f8f4f' }}>// {title[mode][0]}</div>
            <h1 style={{ fontFamily: mono, fontSize: 'clamp(1.25rem, 4.5vw, 1.6rem)', color: '#eaffea', margin: '8px 0 0', letterSpacing: '0.08em', fontWeight: 700, animation: mode === 'granted' ? 'auGranted .8s cubic-bezier(.2,.8,.2,1) both' : 'none' }}>{title[mode][1]}</h1>
          </div>

          {notice && !error && (
            <div role="status" style={{ borderLeft: '3px solid #00d4ff', background: 'rgba(0,212,255,.06)', padding: '10px 12px', marginBottom: '16px', fontFamily: sans, fontSize: '0.85rem', color: '#a8e8f8', lineHeight: 1.5 }}>{notice}</div>
          )}
          {error && (
            <div role="alert" style={{ borderLeft: '3px solid #ff4136', background: 'rgba(255,65,54,.07)', padding: '10px 12px', marginBottom: '16px', fontFamily: sans, fontSize: '0.85rem', color: '#ffb0a8', lineHeight: 1.5 }}>✕ {error}</div>
          )}

          {/* ── SIGN IN ─────────────────────────── */}
          {mode === 'login' && (
            <form onSubmit={submitLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
              <Field label="EMAIL"><input style={input(false)} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="operator@domain.com" required disabled={busy} /></Field>
              <Field label="PASSWORD">
                <div style={{ position: 'relative' }}>
                  <input style={{ ...input(false), paddingRight: '64px' }} type={showPw ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" required disabled={busy} />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="au-link" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', borderBottom: 'none' }} aria-label={showPw ? 'Hide password' : 'Show password'}>{showPw ? 'HIDE' : 'SHOW'}</button>
                </div>
              </Field>
              <div style={{ textAlign: 'right', marginTop: '-6px' }}><button type="button" className="au-link" onClick={() => go('forgot')}>FORGOT PASSWORD?</button></div>
              <button className="au-btn" disabled={busy || !email || !password}>{busy ? 'AUTHENTICATING…' : 'AUTHENTICATE ▸'}</button>
            </form>
          )}

          {/* ── ENLIST (3 steps) ────────────────── */}
          {mode === 'register' && (
            <form onSubmit={submitRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
              <div style={{ display: 'flex', gap: '6px', marginTop: '-6px' }} aria-hidden="true">
                {[0, 1, 2].map(i => <span key={i} style={{ flex: 1, height: '3px', background: i <= regStep ? '#00ff41' : '#0f3a18', boxShadow: i <= regStep ? '0 0 8px rgba(0,255,65,.6)' : 'none', transition: 'all .3s' }} />)}
              </div>
              <div key={regStep} style={{ animation: 'auStepIn .35s ease both' }}>
                {regStep === 0 && (
                  <Field label="CALLSIGN" error={errorField === 'username' ? error : null}
                    hint={uname ? (uname.ok ? <span style={{ color: '#00ff41' }}>✓ CALLSIGN AVAILABLE</span> : <span style={{ color: '#ff6b5f' }}>✕ {uname.msg}</span>) : 'Your public operator name on the leaderboard. 3 to 20 characters.'}>
                    <input style={input(errorField === 'username')} autoFocus autoComplete="username" value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, ''))} placeholder="zero_cool" maxLength={20} disabled={busy} />
                  </Field>
                )}
                {regStep === 1 && (
                  <Field label="SECURE INBOX" error={errorField === 'email' ? error : null} hint="We send a 6-digit code here to prove it is yours. Disposable inboxes are refused.">
                    <input style={input(errorField === 'email')} autoFocus type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="operator@domain.com" disabled={busy} />
                  </Field>
                )}
                {regStep === 2 && (
                  <Field label="ACCESS KEY (PASSWORD)" error={errorField === 'password' ? error : null}>
                    <div style={{ position: 'relative' }}>
                      <input style={{ ...input(errorField === 'password'), paddingRight: '64px' }} autoFocus type={showPw ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="at least 10 characters" disabled={busy} />
                      <button type="button" onClick={() => setShowPw(v => !v)} className="au-link" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', borderBottom: 'none' }}>{showPw ? 'HIDE' : 'SHOW'}</button>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', gap: '4px' }} aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <span key={i} style={{ flex: 1, height: '4px', background: password && i <= pw.score ? pw.color : '#0f2a14', transition: 'background .2s' }} />)}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontFamily: mono, fontSize: '0.58rem', letterSpacing: '.16em' }}>
                        <span style={{ color: password ? pw.color : '#2f5f3f' }}>{password ? 'STRENGTH: ' + pw.label : 'STRENGTH'}</span>
                        <span style={{ color: '#2f6f3f' }}>{password.length} CHARS</span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '4px 10px', fontFamily: mono, fontSize: '0.62rem' }}>
                        {[['10+ characters', password.length >= 10], ['Upper and lower case', /[a-z]/.test(password) && /[A-Z]/.test(password)], ['A number', /\d/.test(password)], ['A symbol', /[^A-Za-z0-9]/.test(password)]].map(([t, ok]) => (
                          <li key={t as string} style={{ color: ok ? '#00ff41' : '#3f6f4f' }}>{ok ? '✓' : '·'} {t as string}</li>
                        ))}
                      </ul>
                    </div>
                  </Field>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {regStep > 0 && <button type="button" onClick={() => { setRegStep(s => s - 1); setError(null) }} disabled={busy} style={{ fontFamily: mono, fontSize: '.72rem', letterSpacing: '.2em', background: 'transparent', color: '#4f9f5f', border: '1px solid #164a22', padding: '0 18px', cursor: 'pointer' }}>◂</button>}
                <button className="au-btn" disabled={busy || (regStep === 0 && !username) || (regStep === 1 && !email) || (regStep === 2 && !password)}>
                  {busy ? 'SEALING IDENTITY…' : regStep < 2 ? 'CONTINUE ▸' : 'CREATE IDENTITY ▸'}
                </button>
              </div>
              <p style={{ fontFamily: sans, fontSize: '0.75rem', color: '#4f7f5f', margin: 0, lineHeight: 1.6 }}>
                By enlisting you agree to the <a href="/terms" style={{ color: '#00d4ff' }}>terms</a> and <a href="/privacy" style={{ color: '#00d4ff' }}>privacy policy</a>. Labs are for education and authorised testing only.
              </p>
            </form>
          )}

          {/* ── VERIFY EMAIL ────────────────────── */}
          {mode === 'verify' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <p style={{ fontFamily: sans, fontSize: '0.9rem', color: '#9fcfaf', margin: 0, lineHeight: 1.6 }}>Enter the 6-digit code sent to <b style={{ color: '#eaffea' }}>{email}</b>. It expires in 10 minutes.</p>
              <OtpInput value={code} onChange={v => { setCode(v); setError(null) }} onComplete={submitVerify} disabled={busy} error={!!error} />
              <button className="au-btn" onClick={() => submitVerify()} disabled={busy || code.length !== 6}>{busy ? 'VERIFYING…' : 'VERIFY IDENTITY ▸'}</button>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <button className="au-link" disabled={cooldown > 0} onClick={() => resend('verify')}>{cooldown > 0 ? 'RESEND IN ' + cooldown + 'S' : 'RESEND CODE'}</button>
                <button className="au-link" onClick={() => { go('register'); setRegStep(1) }}>WRONG EMAIL?</button>
              </div>
            </div>
          )}

          {/* ── 2FA ─────────────────────────────── */}
          {mode === 'mfa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <p style={{ fontFamily: sans, fontSize: '0.9rem', color: '#9fcfaf', margin: 0, lineHeight: 1.6 }}>
                {useBackup ? 'Enter one of your backup codes (format XXXXX-XXXXX). Each works once.' : 'Open your authenticator app and enter the current 6-digit GHOSTNET code.'}
              </p>
              {useBackup ? (
                <input style={{ ...input(!!error), textAlign: 'center', letterSpacing: '.3em', textTransform: 'uppercase', fontSize: '1.1rem' }} autoFocus value={code} onChange={e => setCode(e.target.value.toUpperCase().slice(0, 11))} placeholder="XXXXX-XXXXX" disabled={busy} onKeyDown={e => { if (e.key === 'Enter') submitMfa() }} />
              ) : (
                <OtpInput value={code} onChange={v => { setCode(v); setError(null) }} onComplete={submitMfa} disabled={busy} error={!!error} accent="#00d4ff" />
              )}
              <button className="au-btn" onClick={() => submitMfa()} disabled={busy}>{busy ? 'VERIFYING…' : 'CONFIRM ▸'}</button>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <button className="au-link" onClick={() => { setUseBackup(v => !v); setCode(''); setError(null) }}>{useBackup ? 'USE AUTHENTICATOR CODE' : 'USE A BACKUP CODE'}</button>
                <button className="au-link" onClick={() => go('login')}>CANCEL</button>
              </div>
            </div>
          )}

          {/* ── FORGOT / RESET ──────────────────── */}
          {mode === 'forgot' && (
            <form onSubmit={submitForgot} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
              <p style={{ fontFamily: sans, fontSize: '0.9rem', color: '#9fcfaf', margin: 0, lineHeight: 1.6 }}>Enter your account email. We will send a 6-digit reset code.</p>
              <Field label="EMAIL"><input style={input(false)} autoFocus type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="operator@domain.com" disabled={busy} /></Field>
              <button className="au-btn" disabled={busy || !email}>{busy ? 'DISPATCHING…' : 'SEND RESET CODE ▸'}</button>
              <div><button type="button" className="au-link" onClick={() => go('login')}>◂ BACK TO SIGN IN</button></div>
            </form>
          )}
          {mode === 'reset' && (
            <form onSubmit={submitReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
              <OtpInput value={code} onChange={v => { setCode(v); setError(null) }} disabled={busy} error={!!error && errorField !== 'password'} />
              <Field label="NEW PASSWORD" error={errorField === 'password' ? error : null} hint={password ? 'STRENGTH: ' + pw.label : '10+ characters, mix cases, numbers and symbols.'}>
                <input style={input(errorField === 'password')} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} disabled={busy} />
              </Field>
              <button className="au-btn" disabled={busy || code.length !== 6 || !password}>{busy ? 'REKEYING…' : 'SET NEW PASSWORD ▸'}</button>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="au-link" disabled={cooldown > 0} onClick={() => resend('reset')}>{cooldown > 0 ? 'RESEND IN ' + cooldown + 'S' : 'RESEND CODE'}</button>
                <button type="button" className="au-link" onClick={() => go('login')}>CANCEL</button>
              </div>
            </form>
          )}

          {/* ── GRANTED ─────────────────────────── */}
          {mode === 'granted' && (
            <div style={{ textAlign: 'center', padding: '12px 0 6px' }}>
              <p style={{ fontFamily: mono, fontSize: '0.8rem', color: '#9fdfaf', letterSpacing: '.12em', margin: 0 }}>
                {welcomeName ? 'WELCOME, ' + welcomeName.toUpperCase() : 'WELCOME BACK, OPERATOR'}
              </p>
              <p style={{ fontFamily: mono, fontSize: '0.62rem', color: '#2f7f4f', letterSpacing: '.22em', marginTop: '10px' }}>ROUTING YOU INTO THE NETWORK…</p>
            </div>
          )}

          {/* ── live verification sequence ──────── */}
          {seq && mode !== 'granted' && (
            <ol aria-live="polite" style={{ listStyle: 'none', padding: '14px 0 0', margin: '18px 0 0', borderTop: '1px dashed rgba(0,255,65,.14)', fontFamily: mono, fontSize: '0.66rem', lineHeight: 2 }}>
              {seq.map((l, i) => (
                <li key={i} className={l.state === 'run' ? 'au-seq-run' : ''} style={{ color: l.state === 'ok' ? '#00ff41' : l.state === 'fail' ? '#ff4136' : l.state === 'run' ? '#00d4ff' : '#1f4f2a', animation: 'auStepIn .25s ease ' + i * 0.04 + 's both' }}>
                  {l.state === 'ok' ? '[✓]' : l.state === 'fail' ? '[✕]' : l.state === 'run' ? '[»]' : '[ ]'} {l.text}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#000' }} />}>
      <AuthInner />
    </Suspense>
  )
}
