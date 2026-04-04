'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

const mono = 'JetBrains Mono, monospace'

const GLYPHS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*<>/\\|~'

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

// Scramble text effect
function useScramble(target: string, delay: number = 0, speed: number = 40) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let t = setTimeout(() => {
      let iter = 0
      const interval = setInterval(() => {
        setDisplay(
          target.split('').map((char, i) => {
            if (char === ' ') return ' '
            if (i < iter) return target[i]
            return randomGlyph()
          }).join('')
        )
        iter += 0.4
        if (iter >= target.length) {
          setDisplay(target)
          setDone(true)
          clearInterval(interval)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(t)
  }, [target, delay, speed])

  return { display, done }
}

// Rain column
function RainColumn({ x, delay }: { x: number; delay: number }) {
  const [chars, setChars] = useState<{ char: string; opacity: number }[]>([])

  useEffect(() => {
    const len = 8 + Math.floor(Math.random() * 16)
    const initial = Array.from({ length: len }, () => ({
      char: randomGlyph(),
      opacity: Math.random(),
    }))
    setChars(initial)
    const interval = setInterval(() => {
      setChars(prev => prev.map((c, i) => ({
        char: Math.random() > 0.85 ? randomGlyph() : c.char,
        opacity: i === 0 ? 1 : prev[i - 1]?.opacity * 0.82 ?? 0,
      })))
    }, 80 + Math.random() * 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      position: 'absolute',
      left: x + '%',
      top: (-delay * 20) + '%',
      display: 'flex',
      flexDirection: 'column',
      gap: '0px',
      animation: 'rainFall ' + (3 + Math.random() * 4).toFixed(1) + 's linear ' + delay + 's infinite',
      fontFamily: mono,
      fontSize: '13px',
      lineHeight: '1.4',
      userSelect: 'none',
      pointerEvents: 'none',
    }}>
      {chars.map((c, i) => (
        <span key={i} style={{
          color: i === 0 ? '#ffffff' : '#00ff41',
          opacity: c.opacity * (i === 0 ? 1 : 0.6),
          textShadow: i === 0 ? '0 0 8px #00ff41, 0 0 20px #00ff41' : 'none',
        }}>{c.char}</span>
      ))}
    </div>
  )
}

export default function WelcomePage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'boot' | 'logo' | 'tagline' | 'ready'>('boot')
  const [bootLines, setBootLines] = useState<string[]>([])
  const [showCursor, setShowCursor] = useState(true)
  const [rainCols] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      x: (i / 28) * 100 + (Math.random() * 3 - 1.5),
      delay: Math.random() * 4,
    }))
  )

  // If already authenticated with an active session, skip the splash entirely
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') return
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/')
    })
  }, [router])

  const line1 = useScramble('GHOSTNET', 1200, 35)
  const line2 = useScramble('SECURITY RESEARCH PLATFORM', 2600, 28)
  const line3 = useScramble('ENTER THE NETWORK', 4200, 32)

  // Boot sequence lines
  const BOOT_LINES = [
    '> INITIALISING KERNEL...',
    '> LOADING CRYPTOGRAPHIC MODULES... OK',
    '> ESTABLISHING ENCRYPTED TUNNEL... OK',
    '> SCANNING THREAT SURFACE...',
    '> 13 ATTACK VECTORS LOADED',
    '> NEURAL RECON GRID ONLINE',
    '> IDENTITY VERIFICATION REQUIRED',
  ]

  useEffect(() => {
    let i = 0
    const addLine = () => {
      if (i < BOOT_LINES.length) {
        setBootLines(prev => [...prev, BOOT_LINES[i]])
        i++
        setTimeout(addLine, 180 + Math.random() * 140)
      } else {
        setTimeout(() => setPhase('logo'), 300)
      }
    }
    const t = setTimeout(addLine, 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setShowCursor(p => !p), 530)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (line1.done) setPhase('logo')
  }, [line1.done])

  useEffect(() => {
    if (line3.done) setTimeout(() => setPhase('ready'), 600)
  }, [line3.done])

  function handleEnter() {
    router.push('/auth')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000000',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <style>{`
        @keyframes rainFall {
          from { transform: translateY(-100vh) }
          to   { transform: translateY(110vh) }
        }
        @keyframes pulseGlow {
          0%, 100% { text-shadow: 0 0 20px #00ff41, 0 0 60px #00ff41, 0 0 100px #00ff41; }
          50%       { text-shadow: 0 0 40px #00ff41, 0 0 100px #00ff41, 0 0 160px #00ff41; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanline {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(0,255,65,0.4); box-shadow: 0 0 20px rgba(0,255,65,0.1); }
          50%       { border-color: rgba(0,255,65,0.8); box-shadow: 0 0 40px rgba(0,255,65,0.25); }
        }
        @keyframes subtleScan {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }
        .enter-btn:hover {
          background: rgba(0,255,65,0.12) !important;
          border-color: #00ff41 !important;
          color: #00ff41 !important;
          box-shadow: 0 0 30px rgba(0,255,65,0.3) !important;
          transform: translateY(-1px);
        }
        .enter-btn:active {
          transform: translateY(0px);
        }
      `}</style>

      {/* Matrix rain background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.18 }}>
        {rainCols.map((col, i) => (
          <RainColumn key={i} x={col.x} delay={col.delay} />
        ))}
      </div>

      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Moving scan beam */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(0,255,65,0.06), rgba(0,255,65,0.12), rgba(0,255,65,0.06), transparent)',
        animation: 'scanline 6s linear infinite',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '700px', padding: '0 24px', gap: '0' }}>

        {/* Boot terminal — shown during boot phase */}
        {phase === 'boot' && (
          <div style={{
            fontFamily: mono, fontSize: '0.72rem', color: '#00ff41',
            lineHeight: 2, letterSpacing: '0.05em',
            textAlign: 'left', width: '100%', maxWidth: '480px',
            animation: 'fadeSlideUp 0.4s ease both',
          }}>
            {bootLines.map((line, i) => (
              <div key={i} style={{
                opacity: i === bootLines.length - 1 ? 1 : 0.55,
                color: line.includes('OK') ? '#00ff41' : line.includes('REQUIRED') ? '#ffb347' : '#4a8a4a',
                textShadow: i === bootLines.length - 1 ? '0 0 8px rgba(0,255,65,0.4)' : 'none',
              }}>
                {line}{i === bootLines.length - 1 && <span style={{ opacity: showCursor ? 1 : 0 }}>_</span>}
              </div>
            ))}
          </div>
        )}

        {/* Main logo — shown after boot */}
        {phase !== 'boot' && (
          <>
            {/* Corner brackets */}
            <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
              <div style={{
                position: 'absolute', top: '-16px', left: '-20px',
                width: '20px', height: '20px',
                borderTop: '2px solid rgba(0,255,65,0.5)',
                borderLeft: '2px solid rgba(0,255,65,0.5)',
              }} />
              <div style={{
                position: 'absolute', top: '-16px', right: '-20px',
                width: '20px', height: '20px',
                borderTop: '2px solid rgba(0,255,65,0.5)',
                borderRight: '2px solid rgba(0,255,65,0.5)',
              }} />

              {/* GHOSTNET wordmark */}
              <div style={{
                fontFamily: mono,
                fontSize: 'clamp(3.2rem, 10vw, 5.5rem)',
                fontWeight: 700,
                color: '#00ff41',
                letterSpacing: '0.18em',
                lineHeight: 1,
                animation: 'pulseGlow 3s ease-in-out infinite',
                userSelect: 'none',
              }}>
                {line1.display || 'GHOSTNET'}
              </div>

              <div style={{
                position: 'absolute', bottom: '-16px', left: '-20px',
                width: '20px', height: '20px',
                borderBottom: '2px solid rgba(0,255,65,0.5)',
                borderLeft: '2px solid rgba(0,255,65,0.5)',
              }} />
              <div style={{
                position: 'absolute', bottom: '-16px', right: '-20px',
                width: '20px', height: '20px',
                borderBottom: '2px solid rgba(0,255,65,0.5)',
                borderRight: '2px solid rgba(0,255,65,0.5)',
              }} />
            </div>

            {/* Subtitle */}
            <div style={{
              fontFamily: mono,
              fontSize: 'clamp(0.6rem, 2vw, 0.8rem)',
              color: '#00d4ff',
              letterSpacing: '0.45em',
              marginTop: '1.6rem',
              marginBottom: '0.5rem',
              opacity: phase === 'logo' ? 0 : 1,
              transition: 'opacity 0.6s ease 0.2s',
              animation: phase !== 'logo' ? 'fadeSlideUp 0.7s ease 0.1s both' : 'none',
            }}>
              {line2.display}
            </div>

            {/* Divider */}
            <div style={{
              width: '320px', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,255,65,0.4), rgba(0,212,255,0.4), transparent)',
              margin: '1.4rem 0',
              opacity: phase === 'logo' ? 0 : 1,
              transition: 'opacity 0.5s ease 0.8s',
            }} />

            {/* Tagline */}
            <div style={{
              fontFamily: mono,
              fontSize: 'clamp(0.7rem, 2.2vw, 0.9rem)',
              color: '#c0e0c0',
              letterSpacing: '0.25em',
              marginBottom: '0.4rem',
              opacity: phase === 'logo' ? 0 : 1,
              transition: 'opacity 0.5s ease 1s',
              textAlign: 'center',
              lineHeight: 1.7,
            }}>
              {line3.display}
            </div>

            {/* Descriptor line */}
            <div style={{
              fontFamily: mono, fontSize: '0.65rem',
              color: '#3a6a3a', letterSpacing: '0.2em',
              marginBottom: '2rem',
              opacity: phase === 'ready' ? 1 : 0,
              transition: 'opacity 0.8s ease 0.3s',
            }}>
              13 MODULES · INTERACTIVE LABS · LIVE THREAT INTEL
            </div>

            {/* CTA Button */}
            <button
              onClick={handleEnter}
              className="enter-btn"
              style={{
                fontFamily: mono,
                fontSize: '0.8rem',
                letterSpacing: '0.3em',
                color: '#00ff41',
                background: 'rgba(0,255,65,0.05)',
                border: '1px solid rgba(0,255,65,0.5)',
                padding: '14px 48px',
                cursor: 'pointer',
                borderRadius: '3px',
                transition: 'all 0.2s ease',
                animation: phase === 'ready' ? 'fadeSlideUp 0.6s ease both, borderPulse 2.5s ease-in-out 0.6s infinite' : 'none',
                opacity: phase === 'ready' ? 1 : 0,
                display: phase === 'ready' ? 'block' : 'none',
                marginBottom: '2.5rem',
              }}
            >
              ACCESS THE NETWORK
            </button>

            {/* Bottom status */}
            <div style={{
              display: 'flex', gap: '16px', flexWrap: 'wrap' as const, justifyContent: 'center',
              fontFamily: mono, fontSize: '0.58rem',
              color: '#1a4a1a', letterSpacing: '0.15em',
              opacity: phase === 'ready' ? 1 : 0,
              transition: 'opacity 1s ease 0.5s',
            }}>
              <span style={{ color: '#00ff41', opacity: 0.4 }}>◈ SECURE CONNECTION</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ opacity: 0.4 }}>END-TO-END ENCRYPTED</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ opacity: 0.4 }}>AUTHORISED ACCESS ONLY</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
