'use client'
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import IdentityProfile, { IdStatus } from './IdentityProfile'
import CodeDecrypt, { DecryptStatus } from './CodeDecrypt'
import OtpInput from '../components/OtpInput'
import { api } from '../../lib/client/api'
import CityNet from '../components/hack/CityNet'
import { C, Decode, Frame, HackStyles, TermLines, Typed, mono, sans } from '../components/hack/Hack'

type ScanState = 'idle' | 'typing' | 'scanning' | 'granted' | 'denied'

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
      <span style={{ display: 'block', fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.24em', color: error ? C.red : C.dim, marginBottom: '7px' }}>{label}</span>
      {children}
      {(error || hint) && <span style={{ display: 'block', fontFamily: mono, fontSize: '0.64rem', color: error ? '#ff8f85' : C.dim, marginTop: '6px', lineHeight: 1.5 }}>{error || hint}</span>}
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
  const [dec, setDec] = useState<{ code: string; status: DecryptStatus } | null>(null)
  const [nextHop, setNextHop] = useState('')
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

  const go = (m: Mode) => { setMode(m); setError(null); setErrorField(null); setNotice(null); setCode(''); setSeq(null); setScan('idle'); setDec(null) }

  const shake = () => {
    const el = shakeRef.current
    if (!el) return
    el.classList.remove('hx-shake'); void el.offsetWidth; el.classList.add('hx-shake')
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
    setNextHop(next === 'onboard' ? 'OPERATOR INITIATION' : from === '/' ? 'COMMAND CENTRE' : from.toUpperCase())
    setMode('granted')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(() => router.replace(next === 'onboard' ? '/onboarding' + (from !== '/' ? '?from=' + encodeURIComponent(from) : '') : from), reduce ? 700 : 2600)
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
    setDec({ code: c, status: 'run' })
    const r = await runSequence<{ next?: string }>(SEQ.verify, api('/api/auth/verify', { email: email.trim(), code: c }))
    if (r.ok === false) {
      setDec({ code: c, status: 'fail' })
      await new Promise(res => setTimeout(res, 1300))
      setDec(null); showError(r); setCode(''); return
    }
    setDec({ code: c, status: 'ok' })
    await new Promise(res => setTimeout(res, 1100))
    finish(r.next)
  }

  async function submitMfa(v?: string) {
    const c = (v || code).trim()
    if (busy || (!useBackup && c.length !== 6) || (useBackup && c.replace('-', '').length !== 10)) return
    setDec({ code: c, status: 'run' })
    const r = await runSequence<{ next?: string; restart?: boolean; backupCodesLeft?: number }>(SEQ.mfa, api('/api/auth/mfa', { challenge, code: c }))
    if (r.ok === false) {
      setDec({ code: c, status: 'fail' })
      await new Promise(res => setTimeout(res, 1300))
      setDec(null); showError(r); setCode('')
      if (r.restart) setTimeout(() => go('login'), 1800)
      return
    }
    if (typeof r.backupCodesLeft === 'number') setNotice(r.backupCodesLeft + ' backup codes left.')
    setDec({ code: c, status: 'ok' })
    await new Promise(res => setTimeout(res, 1100))
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
    width: '100%', boxSizing: 'border-box', background: 'rgba(4,7,10,0.8)', border: '1px solid ' + (hasErr ? 'rgba(255,65,54,0.7)' : 'rgba(232,243,246,0.14)'),
    borderRadius: 0, padding: '13px 14px', color: C.white, fontFamily: mono, fontSize: '0.92rem', outline: 'none', transition: 'border-color .15s, box-shadow .15s',
  })

  const title: Record<Mode, [string, string]> = {
    login: ['AUTHENTICATION PORTAL', 'SYSTEM ACCESS'],
    register: ['OPERATOR ENLISTMENT · ' + (regStep + 1) + '/3', ['CHOOSE YOUR CALLSIGN', 'LINK A SECURE INBOX', 'FORGE YOUR ACCESS KEY'][regStep]],
    verify: ['IDENTITY VERIFICATION', 'ENTER THE ACCESS CODE'],
    mfa: ['SECOND FACTOR', 'AUTHENTICATOR CODE'],
    forgot: ['CREDENTIAL RECOVERY', 'RESET ACCESS KEY'],
    reset: ['CREDENTIAL RECOVERY', 'SET A NEW KEY'],
    granted: ['SESSION ESTABLISHED', 'ACCESS GRANTED'],
  }

  const idStatus: IdStatus = mode === 'granted' ? 'active' : busy ? 'working' : scan === 'denied' ? 'denied' : mode === 'verify' ? 'unverified' : mode === 'mfa' ? 'second-factor' : mode === 'register' || email || username ? 'building' : 'locked'
  const keyLabel = !password ? undefined : mode === 'register' || mode === 'reset' ? pw.label + ' · ' + password.length + ' CHARS' : 'SUPPLIED · ' + password.length + ' CHARS'
  const keyColor = !password ? undefined : mode === 'register' || mode === 'reset' ? pw.color : C.white
  const subjectLabel = mode === 'register' ? 'NEW OPERATOR' : mode === 'verify' ? 'CHECK YOUR INBOX' : mode === 'mfa' ? 'OPEN YOUR AUTHENTICATOR' : 'SUBJECT'

  const HELP: Partial<Record<Mode, string>> = {
    login: 'Sign in with the email and password you enlisted with. If you turned on 2FA, we will ask for your authenticator code next.',
    register: ['Your callsign is your public name on the leaderboard. You can change your display name later.', 'We send a 6-digit code to this inbox. Your account only activates once you enter it.', 'Your password is hashed with scrypt before it is stored. Nobody, including us, can read it.'][regStep],
    verify: 'The code expires in 10 minutes. Older codes stop working when you request a new one.',
    mfa: 'Codes change every 30 seconds. Lost your phone? Use one of the backup codes you saved.',
    forgot: 'For your safety we never say whether an email is registered. If it is, a code arrives within a minute.',
  }

  return (
    <div className="au-root">
      <HackStyles />
      <CityNet intensity={busy ? 1.8 : mode === 'granted' ? 2 : 0.8} />
      <div className="hx-vig" aria-hidden="true" />
      <div className="hx-scan" aria-hidden="true" />
      <div className="hx-noise" aria-hidden="true" />

      <header className="au-hud">
        <a href="/welcome" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} aria-label="GHOSTNET home">
          <span className="au-mark">GN</span>
          <span style={{ fontFamily: mono, fontSize: '.72rem', letterSpacing: '.3em', color: C.white, fontWeight: 700 }}>GHOSTNET</span>
        </a>
        <span style={{ fontFamily: mono, fontSize: '.58rem', letterSpacing: '.22em', color: C.dim }} className="au-hide-sm">SECURE CHANNEL · TLS 1.3 · SCRYPT · AES-256-GCM</span>
      </header>

      <div className="au-shell">
        {/* LEFT: identity record */}
        <div className="au-left">
          <IdentityProfile callsign={mode === 'register' || mode === 'granted' ? (username || welcomeName) : ''} email={email} keyLabel={keyLabel} keyColor={keyColor} status={idStatus} trace={seq} label={subjectLabel} />
          {HELP[mode] && (
            <p className="au-help" style={{ fontFamily: sans, fontSize: '.8rem', lineHeight: 1.6, color: C.dim, margin: '14px 2px 0' }}>
              <span style={{ fontFamily: mono, fontSize: '.58rem', letterSpacing: '.2em', color: C.cyan, marginRight: '8px' }}>INTEL</span>{HELP[mode]}
            </p>
          )}
        </div>

        {/* RIGHT: the console */}
        <div ref={shakeRef}>
          <Frame color={error ? C.red : C.cyan} style={{ padding: 'clamp(20px, 5vw, 34px)' }} className="au-in">
            {(mode === 'login' || mode === 'register') && (
              <div role="tablist" style={{ display: 'flex', marginBottom: '22px', borderBottom: '1px solid rgba(232,243,246,.08)' }}>
                <button role="tab" className="au-tab" aria-selected={mode === 'login'} onClick={() => go('login')}>SIGN IN</button>
                <button role="tab" className="au-tab" aria-selected={mode === 'register'} onClick={() => { go('register'); setRegStep(0) }}>ENLIST</button>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: mono, fontSize: '0.58rem', letterSpacing: '0.32em', color: C.cyan }}>// {title[mode][0]}</div>
              <h1 key={mode + regStep} style={{ fontFamily: mono, fontSize: 'clamp(1.2rem, 4.5vw, 1.55rem)', color: C.white, margin: '8px 0 0', letterSpacing: '0.08em', fontWeight: 700 }}>
                <Decode text={title[mode][1]} duration={520} />
              </h1>
            </div>

            {mode === 'register' && (
              <div style={{ display: 'flex', gap: '6px', margin: '-8px 0 18px' }} aria-hidden="true">
                {[0, 1, 2].map(i => <span key={i} style={{ flex: 1, height: '3px', background: i < regStep ? C.white : i === regStep ? C.cyan : 'rgba(232,243,246,.08)', boxShadow: i === regStep ? '0 0 8px ' + C.cyan : 'none', transition: 'all .3s' }} />)}
              </div>
            )}

            {notice && !error && (
              <div role="status" className="hx-flick" style={{ borderLeft: '2px solid ' + C.cyan, background: 'rgba(0,212,255,.06)', padding: '10px 12px', marginBottom: '16px', fontFamily: sans, fontSize: '0.85rem', color: '#bfeaf6', lineHeight: 1.5 }}>{notice}</div>
            )}
            {error && (
              <div role="alert" className="hx-flick" style={{ borderLeft: '2px solid ' + C.red, background: 'rgba(255,65,54,.08)', padding: '10px 12px', marginBottom: '16px', fontFamily: sans, fontSize: '0.85rem', color: '#ffc0b8', lineHeight: 1.5 }}>
                <span style={{ fontFamily: mono, fontSize: '.6rem', letterSpacing: '.2em', color: C.red, marginRight: '8px' }}>DENIED</span>{error}
              </div>
            )}

            {/* ── SIGN IN ─────────────────────────── */}
            {mode === 'login' && (
              <form onSubmit={submitLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
                <Field label="EMAIL"><input style={input(errorField === 'email')} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="operator@domain.com" required disabled={busy} /></Field>
                <Field label="PASSWORD">
                  <div style={{ position: 'relative' }}>
                    <input style={{ ...input(false), paddingRight: '64px' }} type={showPw ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" required disabled={busy} />
                    <button type="button" onClick={() => setShowPw(v => !v)} className="hx-link" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', borderBottom: 'none' }} aria-label={showPw ? 'Hide password' : 'Show password'}>{showPw ? 'HIDE' : 'SHOW'}</button>
                  </div>
                </Field>
                <div style={{ textAlign: 'right', marginTop: '-6px' }}><button type="button" className="hx-link" onClick={() => go('forgot')}>FORGOT PASSWORD?</button></div>
                <button className="hx-btn" disabled={busy || !email || !password}>{busy ? 'AUTHENTICATING…' : 'AUTHENTICATE ▸'}</button>
                <p style={{ fontFamily: sans, fontSize: '.78rem', color: C.dim, margin: 0, textAlign: 'center' }}>New here? <button type="button" className="hx-link" onClick={() => { go('register'); setRegStep(0) }}>ENLIST IN 60 SECONDS</button></p>
              </form>
            )}

            {/* ── ENLIST (3 steps) ────────────────── */}
            {mode === 'register' && (
              <form onSubmit={submitRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
                <div key={regStep} className="hx-in">
                  {regStep === 0 && (
                    <Field label="CALLSIGN" error={errorField === 'username' ? error : null}
                      hint={uname ? (uname.ok ? <span style={{ color: C.green }}>[+] CALLSIGN AVAILABLE</span> : <span style={{ color: C.red }}>[x] {uname.msg || 'TAKEN'}</span>) : '3 to 20 characters: letters, numbers, _ or -.'}>
                      <input style={input(errorField === 'username')} autoFocus autoComplete="username" value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, ''))} placeholder="zero_cool" maxLength={20} disabled={busy} />
                    </Field>
                  )}
                  {regStep === 1 && (
                    <Field label="SECURE INBOX" error={errorField === 'email' ? error : null} hint="Disposable inboxes are refused.">
                      <input style={input(errorField === 'email')} autoFocus type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="operator@domain.com" disabled={busy} />
                    </Field>
                  )}
                  {regStep === 2 && (
                    <Field label="ACCESS KEY (PASSWORD)" error={errorField === 'password' ? error : null}>
                      <div style={{ position: 'relative' }}>
                        <input style={{ ...input(errorField === 'password'), paddingRight: '64px' }} autoFocus type={showPw ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="at least 10 characters" disabled={busy} />
                        <button type="button" onClick={() => setShowPw(v => !v)} className="hx-link" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', borderBottom: 'none' }}>{showPw ? 'HIDE' : 'SHOW'}</button>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', gap: '3px' }} aria-hidden="true">{Array.from({ length: 20 }, (_, i) => <span key={i} style={{ flex: 1, height: '5px', background: password && i < (pw.score + 1) * 4 ? pw.color : 'rgba(232,243,246,.07)', transition: 'background .15s ' + i * 0.01 + 's' }} />)}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontFamily: mono, fontSize: '0.58rem', letterSpacing: '.16em' }}>
                          <span style={{ color: password ? pw.color : C.faint }}>{password ? 'CRACK RESISTANCE: ' + pw.label : 'CRACK RESISTANCE'}</span>
                          <span style={{ color: C.dim }}>{password.length} CHARS</span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '4px 10px', fontFamily: mono, fontSize: '0.62rem' }}>
                          {[['10+ characters', password.length >= 10], ['Upper and lower case', /[a-z]/.test(password) && /[A-Z]/.test(password)], ['A number', /\d/.test(password)], ['A symbol', /[^A-Za-z0-9]/.test(password)]].map(([t, ok]) => (
                            <li key={t as string} style={{ color: ok ? C.green : C.faint }}>{ok ? '[+]' : '[ ]'} {t as string}</li>
                          ))}
                        </ul>
                      </div>
                    </Field>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {regStep > 0 && <button type="button" className="hx-btn-ghost" onClick={() => { setRegStep(s => s - 1); setError(null) }} disabled={busy} aria-label="Back">◂</button>}
                  <button className="hx-btn" style={{ flex: 1 }} disabled={busy || (regStep === 0 && !username) || (regStep === 1 && !email) || (regStep === 2 && !password)}>
                    {busy ? 'SEALING IDENTITY…' : regStep < 2 ? 'CONTINUE ▸' : 'CREATE IDENTITY ▸'}
                  </button>
                </div>
                <p style={{ fontFamily: sans, fontSize: '0.74rem', color: C.dim, margin: 0, lineHeight: 1.6 }}>
                  By enlisting you agree to the <a href="/terms" style={{ color: C.cyan }}>terms</a> and <a href="/privacy" style={{ color: C.cyan }}>privacy policy</a>. Labs are for education and authorised testing only.
                </p>
              </form>
            )}

            {/* ── VERIFY EMAIL ────────────────────── */}
            {mode === 'verify' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {dec ? <CodeDecrypt code={dec.code} status={dec.status} label="ACCESS CODE" /> : (
                  <>
                    <p style={{ fontFamily: sans, fontSize: '0.9rem', color: '#b9cbd2', margin: 0, lineHeight: 1.6 }}>
                      <Typed text={'Code dispatched to ' + email + '. Enter the 6 digits to unlock your identity.'} speed={14} typos={false} cursor={false} />
                    </p>
                    <OtpInput value={code} onChange={v => { setCode(v); setError(null) }} onComplete={submitVerify} disabled={busy} error={!!error} accent={C.cyan} />
                    <button className="hx-btn" onClick={() => submitVerify()} disabled={busy || code.length !== 6}>UNLOCK IDENTITY ▸</button>
                  </>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <button className="hx-link" disabled={cooldown > 0 || busy} onClick={() => resend('verify')}>{cooldown > 0 ? 'RESEND IN ' + cooldown + 'S' : 'RESEND CODE'}</button>
                  <button className="hx-link" disabled={busy} onClick={() => { go('register'); setRegStep(1) }}>WRONG EMAIL?</button>
                </div>
              </div>
            )}

            {/* ── 2FA ─────────────────────────────── */}
            {mode === 'mfa' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {dec ? <CodeDecrypt code={dec.code} status={dec.status} label={useBackup ? 'BACKUP CODE' : 'TOTP'} /> : (
                  <>
                    <p style={{ fontFamily: sans, fontSize: '0.9rem', color: '#b9cbd2', margin: 0, lineHeight: 1.6 }}>
                      {useBackup ? 'Enter one of your backup codes (XXXXX-XXXXX). Each works once.' : 'Open your authenticator app and enter the current 6-digit GHOSTNET code.'}
                    </p>
                    {useBackup ? (
                      <input style={{ ...input(!!error), textAlign: 'center', letterSpacing: '.3em', textTransform: 'uppercase', fontSize: '1.1rem' }} autoFocus value={code} onChange={e => setCode(e.target.value.toUpperCase().slice(0, 11))} placeholder="XXXXX-XXXXX" disabled={busy} onKeyDown={e => { if (e.key === 'Enter') submitMfa() }} />
                    ) : (
                      <OtpInput value={code} onChange={v => { setCode(v); setError(null) }} onComplete={submitMfa} disabled={busy} error={!!error} accent={C.cyan} />
                    )}
                    <button className="hx-btn" onClick={() => submitMfa()} disabled={busy}>CONFIRM ▸</button>
                  </>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <button className="hx-link" disabled={busy} onClick={() => { setUseBackup(v => !v); setCode(''); setError(null) }}>{useBackup ? 'USE AUTHENTICATOR CODE' : 'USE A BACKUP CODE'}</button>
                  <button className="hx-link" disabled={busy} onClick={() => go('login')}>CANCEL</button>
                </div>
              </div>
            )}

            {/* ── FORGOT / RESET ──────────────────── */}
            {mode === 'forgot' && (
              <form onSubmit={submitForgot} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
                <Field label="EMAIL"><input style={input(false)} autoFocus type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="operator@domain.com" disabled={busy} /></Field>
                <button className="hx-btn" disabled={busy || !email}>{busy ? 'DISPATCHING…' : 'SEND RESET CODE ▸'}</button>
                <div><button type="button" className="hx-link" onClick={() => go('login')}>◂ BACK TO SIGN IN</button></div>
              </form>
            )}
            {mode === 'reset' && (
              <form onSubmit={submitReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
                <OtpInput value={code} onChange={v => { setCode(v); setError(null) }} disabled={busy} error={!!error && errorField !== 'password'} accent={C.cyan} />
                <Field label="NEW PASSWORD" error={errorField === 'password' ? error : null} hint={password ? 'CRACK RESISTANCE: ' + pw.label : '10+ characters, mix cases, numbers and symbols.'}>
                  <input style={input(errorField === 'password')} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} disabled={busy} />
                </Field>
                <button className="hx-btn" disabled={busy || code.length !== 6 || !password}>{busy ? 'REKEYING…' : 'SET NEW PASSWORD ▸'}</button>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" className="hx-link" disabled={cooldown > 0} onClick={() => resend('reset')}>{cooldown > 0 ? 'RESEND IN ' + cooldown + 'S' : 'RESEND CODE'}</button>
                  <button type="button" className="hx-link" onClick={() => go('login')}>CANCEL</button>
                </div>
              </form>
            )}

            {mode === 'granted' && <div style={{ minHeight: '120px' }} />}

            {/* ── live verification sequence (non-code steps) ── */}
            {seq && !dec && mode !== 'granted' && mode !== 'verify' && mode !== 'mfa' && (
              <ol aria-live="polite" className="au-seq" style={{ listStyle: 'none', padding: '14px 0 0', margin: '18px 0 0', borderTop: '1px dashed rgba(232,243,246,.1)', fontFamily: mono, fontSize: '0.66rem', lineHeight: 2 }}>
                {seq.map((l, i) => (
                  <li key={i} className={l.state === 'run' ? 'cd-blink' : 'hx-flick'} style={{ color: l.state === 'ok' ? C.green : l.state === 'fail' ? C.red : l.state === 'run' ? C.cyan : C.faint }}>
                    {l.state === 'ok' ? '[+]' : l.state === 'fail' ? '[x]' : l.state === 'run' ? '[>]' : '[ ]'} {l.text}
                  </li>
                ))}
              </ol>
            )}
          </Frame>
        </div>
      </div>

      {/* ── GRANTED takeover ─────────────────── */}
      {mode === 'granted' && (
        <div className="au-granted" role="status" aria-live="assertive">
          <div className="hx-burst" aria-hidden="true" />
          <div style={{ textAlign: 'center', padding: '0 16px', width: '100%', maxWidth: '640px' }}>
            <div style={{ fontFamily: mono, fontSize: '.6rem', letterSpacing: '.5em', color: C.cyan, marginBottom: '14px' }}>SESSION ESTABLISHED</div>
            <div className="hx-glitch au-granted-word" data-text="ACCESS GRANTED">ACCESS GRANTED</div>
            <div style={{ fontFamily: mono, fontSize: 'clamp(.8rem, 3vw, 1rem)', letterSpacing: '.2em', color: C.white, marginTop: '18px' }}>
              <Typed text={welcomeName ? 'WELCOME, ' + welcomeName.toUpperCase() : 'WELCOME BACK, OPERATOR'} speed={30} typos={false} />
            </div>
            <TermLines
              style={{ marginTop: '22px', textAlign: 'left', display: 'inline-block', fontSize: '.68rem' }}
              lines={[
                { t: '[+] session token issued · httpOnly · 14d idle', c: C.green, pause: 700 },
                { t: '[+] device fingerprint stored', c: C.green, pause: 250 },
                { t: '[>] routing to ' + nextHop.toLowerCase() + '…', c: C.cyan, pause: 250 },
              ]}
            />
          </div>
        </div>
      )}

      <style>{`
        .au-root { position: fixed; inset: 0; z-index: 9999; background: #04070a; overflow-y: auto; color: #e8f3f6; }
        .au-hud { position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px clamp(16px, 4vw, 32px); }
        .au-mark { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #04070a; background: #e8f3f6; padding: 5px 6px; clip-path: polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%); }
        .au-shell { position: relative; z-index: 10; min-height: calc(100% - 70px); display: grid; grid-template-columns: minmax(0, 360px) minmax(0, 480px); justify-content: center; align-items: center; gap: clamp(24px, 5vw, 64px); margin: 0 auto; padding: 10px 24px 48px; box-sizing: border-box; }
        @media (max-width: 860px) { .au-shell { grid-template-columns: minmax(0, 1fr); padding: 6px 16px 40px; gap: 16px; align-items: start } .au-help, .au-hide-sm { display: none } }
        .au-in input:focus, .au-in textarea:focus { border-color: #00d4ff !important; box-shadow: 0 0 0 3px rgba(0,212,255,0.12), 0 0 18px rgba(0,212,255,0.12); }
        .au-tab { flex: 1; background: none; border: none; padding: 12px 0; font-family: 'JetBrains Mono', monospace; font-size: .68rem; letter-spacing: .26em; cursor: pointer; border-bottom: 2px solid transparent; color: #7d93a0; transition: all .2s; }
        .au-tab[aria-selected="true"] { color: #e8f3f6; border-color: #00d4ff; }
        .au-tab:hover { color: #e8f3f6; }
        .cd-blink { animation: hxBlink .9s steps(2) infinite; }
        .gn-otp { border-radius: 0 !important; background: rgba(4,7,10,.85) !important; }
        .gn-otp:focus { border-color: #00d4ff !important; box-shadow: 0 0 0 3px rgba(0,212,255,.14), 0 0 20px rgba(0,212,255,.25) !important; transform: translateY(-2px); }
        .gn-otp-err { animation: hxShake .32s steps(4); }
        .au-granted { position: fixed; inset: 0; z-index: 40; display: flex; align-items: center; justify-content: center; background: radial-gradient(ellipse at center, rgba(0,40,20,.55), rgba(4,7,10,.94) 70%); animation: hxIn .35s ease both; }
        .au-granted-word { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(2rem, 9vw, 4.4rem); letter-spacing: .12em; color: #00ff41; text-shadow: 0 0 30px rgba(0,255,65,.55); }
      `}</style>
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
