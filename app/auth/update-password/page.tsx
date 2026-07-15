'use client'
import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'

const mono = 'JetBrains Mono, monospace'

function UpdatePasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ready, setReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function init() {
      // Supabase's PKCE recovery link lands here with ?code=... — exchange it for a session
      const code = searchParams.get('code')
      if (code) {
        const { error: err } = await supabase.auth.exchangeCodeForSession(code)
        if (!err) { setHasSession(true); setReady(true); return }
      }
      const { data: { session } } = await supabase.auth.getSession()
      setHasSession(!!session)
      setReady(true)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setHasSession(true)
    })
    return () => subscription.unsubscribe()
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) { setError(err.message); return }
      setDone(true)
      setTimeout(() => router.push('/'), 1800)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: '#0a120a',
    border: '1px solid #1a3a1a',
    borderRadius: '5px',
    padding: '11px 14px',
    color: '#00ff41',
    fontFamily: mono,
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
        <div style={{ width: '40px', height: '40px', border: '1px solid #00ff41', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(0,255,65,0.25)', background: 'rgba(0,255,65,0.05)' }}>
          <span style={{ fontFamily: mono, fontSize: '13px', color: '#00ff41', fontWeight: 700 }}>GN</span>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: mono, fontSize: '1.1rem', color: '#00ff41', fontWeight: 700, letterSpacing: '0.14em', lineHeight: 1, textShadow: '0 0 16px rgba(0,255,65,0.35)' }}>GHOSTNET</div>
          <div style={{ fontFamily: mono, fontSize: '7px', color: '#1a3a1a', letterSpacing: '0.22em', lineHeight: 1, marginTop: '4px' }}>SECURITY RESEARCH PLATFORM</div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '420px', background: '#030a03', border: '1px solid #1a3a1a', borderRadius: '10px', padding: '2rem', boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,255,65,0.04)' }}>

        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontFamily: mono, fontSize: '8px', color: '#1a4a1a', letterSpacing: '0.3em', marginBottom: '6px' }}>
            ⎋ CREDENTIAL RECOVERY
          </div>
          <h1 style={{ fontFamily: mono, fontSize: '1.3rem', color: '#00ff41', margin: 0, fontWeight: 700, letterSpacing: '0.06em', textShadow: '0 0 20px rgba(0,255,65,0.25)' }}>
            SET NEW PASSWORD
          </h1>
        </div>

        {!ready ? (
          <p style={{ fontFamily: mono, fontSize: '0.72rem', color: '#3a7a3a' }}>⟳ Verifying recovery link...</p>
        ) : !hasSession ? (
          <div style={{ background: 'rgba(255,65,54,0.07)', border: '1px solid rgba(255,65,54,0.28)', borderLeft: '3px solid #ff4136', borderRadius: '0 4px 4px 0', padding: '10px 14px', fontFamily: mono, fontSize: '0.72rem', color: '#ff4136', lineHeight: 1.5 }}>
            ✕ This link is invalid or has expired. Request a new one from the{' '}
            <Link href="/auth/forgot-password" style={{ color: '#ff4136', textDecoration: 'underline' }}>reset password page</Link>.
          </div>
        ) : done ? (
          <div style={{ background: 'rgba(0,255,65,0.06)', border: '1px solid rgba(0,255,65,0.25)', borderLeft: '3px solid #00ff41', borderRadius: '0 4px 4px 0', padding: '10px 14px', fontFamily: mono, fontSize: '0.72rem', color: '#00ff41', lineHeight: 1.5 }}>
            ✓ Password updated. Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{ background: 'rgba(255,65,54,0.07)', border: '1px solid rgba(255,65,54,0.28)', borderLeft: '3px solid #ff4136', borderRadius: '0 4px 4px 0', padding: '10px 14px', fontFamily: mono, fontSize: '0.72rem', color: '#ff4136', lineHeight: 1.5 }}>
                ✕ {error}
              </div>
            )}
            <div>
              <label style={{ fontFamily: mono, fontSize: '7.5px', color: '#2a5a2a', letterSpacing: '0.18em', display: 'block', marginBottom: '7px' }}>NEW PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,255,65,0.55)' }}
                onBlur={e => { e.target.style.borderColor = '#1a3a1a' }}
              />
            </div>
            <div>
              <label style={{ fontFamily: mono, fontSize: '7.5px', color: '#2a5a2a', letterSpacing: '0.18em', display: 'block', marginBottom: '7px' }}>CONFIRM PASSWORD</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,255,65,0.55)' }}
                onBlur={e => { e.target.style.borderColor = '#1a3a1a' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '13px',
                background: loading ? 'rgba(0,255,65,0.04)' : 'rgba(0,255,65,0.1)',
                border: '1px solid ' + (loading ? 'rgba(0,255,65,0.15)' : 'rgba(0,255,65,0.45)'),
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                color: loading ? '#1a4a1a' : '#00ff41',
                fontFamily: mono,
                fontSize: '10px',
                letterSpacing: '0.22em',
                fontWeight: 700,
                transition: 'all 0.15s',
                boxShadow: loading ? 'none' : '0 0 12px rgba(0,255,65,0.1)',
              }}
            >
              {loading ? '⟳ UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function UpdatePasswordPage() {
  return (
    <Suspense>
      <UpdatePasswordForm />
    </Suspense>
  )
}
