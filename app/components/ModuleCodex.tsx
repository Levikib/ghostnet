'use client'
import React, { useState, useEffect } from 'react'

const mono = 'JetBrains Mono, monospace'

export interface CodexChapter {
  id: string
  title: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  readTime: string
  labLink?: string
  content: React.ReactNode
  takeaways: string[]
}

interface Props {
  moduleId: string
  accent: string
  chapters: CodexChapter[]
}

const difficultyColor = (d: string) => {
  if (d === 'BEGINNER') return '#00ff41'
  if (d === 'INTERMEDIATE') return '#ffb347'
  return '#ff4136'
}

export default function ModuleCodex({ moduleId, accent, chapters }: Props) {
  const storageKey = 'codex-' + moduleId
  const [current, setCurrent] = useState(0)
  const [resumed, setResumed] = useState(false)
  const [resumeFrom, setResumeFrom] = useState<number | null>(null)
  const [visited, setVisited] = useState<Set<number>>(new Set([0]))

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const n = parseInt(saved, 10)
      if (n > 0 && n < chapters.length) {
        setResumeFrom(n)
      }
    }
  }, [storageKey, chapters.length])

  useEffect(() => {
    localStorage.setItem(storageKey, String(current))
    setVisited(prev => {
      const next = new Set(prev)
      next.add(current)
      return next
    })
  }, [current, storageKey])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && current < chapters.length - 1) setCurrent(c => c + 1)
      if (e.key === 'ArrowLeft' && current > 0) setCurrent(c => c - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, chapters.length])

  const goTo = (n: number) => {
    setCurrent(n)
    setResumeFrom(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const ch = chapters[current]
  const pct = Math.round(((current + 1) / chapters.length) * 100)

  return (
    <div>
      {/* Resume banner */}
      {resumeFrom !== null && !resumed && (
        <div style={{
          background: 'rgba(0,0,0,0.6)', border: '1px solid ' + accent + '55',
          borderRadius: '6px', padding: '0.75rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: mono, fontSize: '0.75rem'
        }}>
          <span style={{ color: '#6a8a6a' }}>
            Resume from <span style={{ color: accent }}>Chapter {resumeFrom + 1}: {chapters[resumeFrom].title}</span>?
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { goTo(resumeFrom!); setResumed(true) }}
              style={{ background: accent + '22', border: '1px solid ' + accent + '88', borderRadius: '3px', color: accent, fontFamily: mono, fontSize: '0.7rem', padding: '4px 12px', cursor: 'pointer' }}>
              Resume
            </button>
            <button onClick={() => { setResumeFrom(null); setResumed(true) }}
              style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '3px', color: '#4a4a4a', fontFamily: mono, fontSize: '0.7rem', padding: '4px 12px', cursor: 'pointer' }}>
              Start over
            </button>
          </div>
        </div>
      )}

      {/* Chapter nav strip */}
      <div className="codex-nav-strip" style={{
        background: '#05080a', border: '1px solid #0e1810',
        borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.5rem'
      }}>
        {/* Progress bar */}
        <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
          {chapters.map((_, i) => (
            <div key={i} onClick={() => goTo(i)}
              title={'Ch ' + (i + 1) + ': ' + chapters[i].title}
              style={{
                flex: 1, height: '3px', borderRadius: '2px', cursor: 'pointer',
                background: i === current ? accent : (visited.has(i) ? accent + '44' : '#1a1a1a'),
                transition: 'background 0.2s'
              }} />
          ))}
        </div>
        {/* Chapter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
          {chapters.map((c, i) => (
            <button key={i} onClick={() => goTo(i)} title={c.title}
              style={{
                fontFamily: mono, fontSize: '0.65rem', padding: '3px 10px',
                borderRadius: '3px', cursor: 'pointer', letterSpacing: '0.05em',
                border: '1px solid ' + (i === current ? accent : (visited.has(i) ? accent + '33' : '#1a1a1a')),
                background: i === current ? accent + '18' : 'transparent',
                color: i === current ? accent : (visited.has(i) ? accent + '88' : '#333'),
                transition: 'all 0.15s', whiteSpace: 'nowrap'
              }}>
              {visited.has(i) && i !== current ? '✓ ' : ''}{String(i + 1).padStart(2, '0')}
            </button>
          ))}
          <span style={{ fontFamily: mono, fontSize: '0.6rem', color: '#2a3a2a', marginLeft: 'auto' }}>
            {pct}% — {visited.size}/{chapters.length} read &nbsp;·&nbsp; ← → keys
          </span>
        </div>
      </div>

      {/* Chapter header */}
      <div className="codex-chapter-header" style={{
        border: '1px solid ' + accent + '22', borderRadius: '8px',
        padding: '1.5rem 2rem', marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, ' + accent + '08 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: mono, fontSize: '0.6rem', letterSpacing: '0.2em',
            padding: '2px 8px', borderRadius: '2px',
            background: difficultyColor(ch.difficulty) + '15',
            border: '1px solid ' + difficultyColor(ch.difficulty) + '55',
            color: difficultyColor(ch.difficulty)
          }}>{ch.difficulty}</span>
          <span style={{ fontFamily: mono, fontSize: '0.6rem', color: '#3a4a3a', letterSpacing: '0.1em' }}>~{ch.readTime} read</span>
          <span style={{ fontFamily: mono, fontSize: '0.6rem', color: '#2a3a2a', marginLeft: 'auto' }}>
            CHAPTER {current + 1} OF {chapters.length}
          </span>
        </div>
        <div style={{ fontFamily: mono, fontSize: '0.65rem', color: accent + '66', letterSpacing: '0.2em', marginBottom: '0.4rem' }}>
          // CHAPTER {String(current + 1).padStart(2, '0')}
        </div>
        <h2 className="codex-chapter-title" style={{ fontFamily: mono, fontSize: '1.5rem', fontWeight: 700, color: accent, margin: 0, textShadow: '0 0 20px ' + accent + '44' }}>
          {ch.title}
        </h2>
      </div>

      {/* Content */}
      <div>{ch.content}</div>

      {/* Key takeaways */}
      <div className="codex-takeaways" style={{
        background: accent + '08', border: '1px solid ' + accent + '22',
        borderRadius: '6px', padding: '1.25rem 1.5rem', marginTop: '2.5rem'
      }}>
        <div style={{ fontFamily: mono, fontSize: '0.6rem', color: accent + '88', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
          KEY TAKEAWAYS
        </div>
        {ch.takeaways.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '0.4rem' }}>
            <span style={{ color: accent, fontFamily: mono, fontSize: '0.75rem', flexShrink: 0 }}>›</span>
            <span style={{ color: '#8a9a8a', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>{t}</span>
          </div>
        ))}
      </div>

      {/* Lab link if present */}
      {ch.labLink && (
        <div style={{
          marginTop: '1.5rem', background: accent + '06',
          border: '1px solid ' + accent + '33', borderRadius: '6px',
          padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ fontFamily: mono, fontSize: '0.7rem', color: '#5a7a5a' }}>
            Practice this chapter in the lab
          </div>
          <a href={ch.labLink} style={{
            fontFamily: mono, fontSize: '0.7rem', color: accent,
            textDecoration: 'none', padding: '4px 14px',
            border: '1px solid ' + accent + '55', borderRadius: '3px',
            background: accent + '12', letterSpacing: '0.1em', fontWeight: 700
          }}>
            OPEN LAB &#8594;
          </a>
        </div>
      )}

      {/* Prev / Next */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #0e1810'
      }}>
        <button className="codex-prev-btn" onClick={() => current > 0 && goTo(current - 1)}
          disabled={current === 0}
          style={{
            fontFamily: mono, fontSize: '0.75rem', cursor: current > 0 ? 'pointer' : 'default',
            color: current > 0 ? accent : '#1a1a1a', background: 'transparent',
            border: '1px solid ' + (current > 0 ? accent + '44' : '#111'),
            borderRadius: '4px', padding: '8px 18px', transition: 'all 0.15s'
          }}>
          &#8592; {current > 0 ? chapters[current - 1].title : 'Start'}
        </button>
        <span style={{ fontFamily: mono, fontSize: '0.6rem', color: '#2a3a2a', flexShrink: 0 }}>
          {current + 1} / {chapters.length}
        </span>
        <button className="codex-next-btn" onClick={() => current < chapters.length - 1 && goTo(current + 1)}
          disabled={current === chapters.length - 1}
          style={{
            fontFamily: mono, fontSize: '0.75rem', cursor: current < chapters.length - 1 ? 'pointer' : 'default',
            color: current < chapters.length - 1 ? accent : '#1a1a1a', background: 'transparent',
            border: '1px solid ' + (current < chapters.length - 1 ? accent + '44' : '#111'),
            borderRadius: '4px', padding: '8px 18px', transition: 'all 0.15s'
          }}>
          {current < chapters.length - 1 ? chapters[current + 1].title : 'Complete'} &#8594;
        </button>
      </div>
    </div>
  )
}
