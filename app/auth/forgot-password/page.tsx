'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'

const mono = 'JetBrains Mono, monospace'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const redirectTo = window.location.origin + '/auth/update-password'
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (err) { setError(err.message); return }
      setSent(true)
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

        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontFamily: mono, fontSize: '8px', color: '#1a4a1a', letterSpacing: '0.3em', marginBottom: '6px' }}>
            ⎋ CREDENTIAL RECOVERY
          </div>
          <h1 style={{ fontFamily: mono, fontSize: '1.3rem', color: '#00ff41', margin: 0, fontWeight: 700, letterSpacing: '0.06em', textShadow: '0 0 20px rgba(0,255,65,0.25)' }}>
            RESET PASSWORD
          </h1>
          <p style={{ fontFamily: mono, fontSize: '0.7rem', color: '#2a5a2a', marginTop: '6px', lineHeight: 1.6 }}>
            Enter your operator email. We will send a link to reset your password.
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,65,54,0.07)', border: '1px solid rgba(255,65,54,0.28)', borderLeft: '3px solid #ff4136', borderRadius: '0 4px 4px 0', padding: '10px 14px', marginBottom: '1.25rem', fontFamily: mono, fontSize: '0.72rem', color: '#ff4136', lineHeight: 1.5 }}>
            ✕ {error}
          </div>
        )}

        {sent ? (
          <div style={{ background: 'rgba(0,255,65,0.06)', border: '1px solid rgba(0,255,65,0.25)', borderLeft: '3px solid #00ff41', borderRadius: '0 4px 4px 0', padding: '10px 14px', fontFamily: mono, fontSize: '0.72rem', color: '#00ff41', lineHeight: 1.5 }}>
            ✓ If an account exists for that email, a reset link has been sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              {loading ? '⟳ SENDING...' : 'SEND RESET LINK'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/auth" style={{ fontFamily: mono, fontSize: '0.7rem', color: '#00ff41', textDecoration: 'underline' }}>
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
