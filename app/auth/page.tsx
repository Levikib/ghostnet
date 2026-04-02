'use client'
import React, { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'

const mono = 'JetBrains Mono, monospace'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const supabase = createClient()

    try {
      if (mode === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) { setError(err.message); return }
        router.push('/')
        router.refresh()
      } else {
        if (!username.trim()) { setError('Username is required'); return }
        if (password.length < 8) { setError('Password must be at least 8 characters'); return }
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        })
        if (err) { setError(err.message); return }
        setMessage('Account created. Check your email to confirm, then log in.')
      }
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
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
        <div style={{ width: '40px', height: '40px', border: '1px solid #00ff41', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(0,255,65,0.25)', background: 'rgba(0,255,65,0.05)' }}>
          <span style={{ fontFamily: mono, fontSize: '13px', color: '#00ff41', fontWeight: 700 }}>GN</span>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: mono, fontSize: '1.1rem', color: '#00ff41', fontWeight: 700, letterSpacing: '0.14em', lineHeight: 1, textShadow: '0 0 16px rgba(0,255,65,0.35)' }}>GHOSTNET</div>
          <div style={{ fontFamily: mono, fontSize: '7px', color: '#1a3a1a', letterSpacing: '0.22em', lineHeight: 1, marginTop: '4px' }}>SECURITY RESEARCH PLATFORM</div>
        </div>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '420px', background: '#030a03', border: '1px solid #1a3a1a', borderRadius: '10px', padding: '2rem', boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,255,65,0.04)' }}>

        {/* Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontFamily: mono, fontSize: '8px', color: '#1a4a1a', letterSpacing: '0.3em', marginBottom: '6px' }}>
            {mode === 'login' ? '⎋ AUTHENTICATION PORTAL' : '+ OPERATOR REGISTRATION'}
          </div>
          <h1 style={{ fontFamily: mono, fontSize: '1.3rem', color: '#00ff41', margin: 0, fontWeight: 700, letterSpacing: '0.06em', textShadow: '0 0 20px rgba(0,255,65,0.25)' }}>
            {mode === 'login' ? 'SYSTEM ACCESS' : 'INITIALISE ACCOUNT'}
          </h1>
          <p style={{ fontFamily: mono, fontSize: '0.7rem', color: '#2a5a2a', marginTop: '6px', lineHeight: 1.6 }}>
            {mode === 'login'
              ? 'Authenticate to access your operator profile, XP, and lab progress.'
              : 'Create your Ghost operator identity. Track labs, earn XP, unlock ranks.'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(255,65,54,0.07)', border: '1px solid rgba(255,65,54,0.28)', borderLeft: '3px solid #ff4136', borderRadius: '0 4px 4px 0', padding: '10px 14px', marginBottom: '1.25rem', fontFamily: mono, fontSize: '0.72rem', color: '#ff4136', lineHeight: 1.5 }}>
            ✕ {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div style={{ background: 'rgba(0,255,65,0.06)', border: '1px solid rgba(0,255,65,0.25)', borderLeft: '3px solid #00ff41', borderRadius: '0 4px 4px 0', padding: '10px 14px', marginBottom: '1.25rem', fontFamily: mono, fontSize: '0.72rem', color: '#00ff41', lineHeight: 1.5 }}>
            ✓ {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {mode === 'register' && (
            <div>
              <label style={{ fontFamily: mono, fontSize: '7.5px', color: '#2a5a2a', letterSpacing: '0.18em', display: 'block', marginBottom: '7px' }}>OPERATOR CALLSIGN</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="your_handle"
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,255,65,0.55)' }}
                onBlur={e => { e.target.style.borderColor = '#1a3a1a' }}
              />
            </div>
          )}

          <div>
            <label style={{ fontFamily: mono, fontSize: '7.5px', color: '#2a5a2a', letterSpacing: '0.18em', display: 'block', marginBottom: '7px' }}>EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="operator@domain.com"
              required
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,255,65,0.55)' }}
              onBlur={e => { e.target.style.borderColor = '#1a3a1a' }}
            />
          </div>

          <div>
            <label style={{ fontFamily: mono, fontSize: '7.5px', color: '#2a5a2a', letterSpacing: '0.18em', display: 'block', marginBottom: '7px' }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'Min 8 characters' : '••••••••'}
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
            {loading ? '⟳ PROCESSING...' : mode === 'login' ? 'ACCESS SYSTEM' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Toggle */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontFamily: mono, fontSize: '0.7rem', color: '#2a4a2a' }}>
            {mode === 'login' ? 'No account? ' : 'Have an account? '}
          </span>
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage('') }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: mono, fontSize: '0.7rem', color: '#00ff41', textDecoration: 'underline', padding: 0 }}
          >
            {mode === 'login' ? 'Register here' : 'Login'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '2rem', fontFamily: mono, fontSize: '7px', color: '#0f2a0f', letterSpacing: '0.2em', textAlign: 'center' }}>
        GHOSTNET // FOR EDUCATIONAL AND AUTHORISED USE ONLY
      </div>
    </div>
  )
}
