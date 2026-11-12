'use client'
import React, { useState, useEffect, useRef } from 'react'
import { fetchServerProgress, syncChapter } from '../../lib/client/progress'
import { openGhost, setGhostContext } from '../../lib/client/ghostContext'
import { GxStyles, T, accentText } from './gx/Gx'

const READ_SIZES = { S: 16, M: 17, L: 19, XL: 21 } as const
type ReadSize = keyof typeof READ_SIZES

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
  const [visited, setVisited] = useState<Set<number>>(new Set())
  const [size, setSizeState] = useState<ReadSize>('M')
  useEffect(() => { try { const v = localStorage.getItem('gn_read_size') as ReadSize | null; if (v && v in READ_SIZES) setSizeState(v) } catch {} }, [])
  const setSize = (v: ReadSize) => { setSizeState(v); try { localStorage.setItem('gn_read_size', v) } catch {} }

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const n = parseInt(saved, 10)
      if (n > 0 && n < chapters.length) {
        setResumeFrom(n)
      }
    }
    // Signed in: chapters read on any device count, and the resume point follows the account.
    fetchServerProgress().then(sp => {
      const c = sp?.chapters[moduleId]
      if (!c) return
      setVisited(prev => new Set([...Array.from(prev), ...c.read.filter(i => i < chapters.length)]))
      const local = saved ? parseInt(saved, 10) : 0
      if (c.last > 0 && c.last < chapters.length && c.last > local) setResumeFrom(c.last)
    })
  }, [storageKey, chapters.length, moduleId])

  // A chapter counts as read (and pays XP) after 20 seconds on it AND reaching its end.
  const endRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [dwelt, setDwelt] = useState(false)
  const [reachedEnd, setReachedEnd] = useState(false)

  useEffect(() => {
    localStorage.setItem(storageKey, String(current))
    setDwelt(false)
    setReachedEnd(false)
    const t = setTimeout(() => setDwelt(true), 20000)
    return () => clearTimeout(t)
  }, [current, storageKey])

  useEffect(() => {
    const el = endRef.current
    if (!el) return
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) setReachedEnd(true) }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [current])

  useEffect(() => {
    if (!dwelt || !reachedEnd) return
    syncChapter(moduleId, current, chapters.length)
    setVisited(prev => {
      const next = new Set(prev)
      next.add(current)
      return next
    })
  }, [dwelt, reachedEnd, current, moduleId, chapters.length])

  // Tell GHOST which chapter and section are on screen.
  useEffect(() => {
    const root = contentRef.current
    const title = chapters[current]?.title
    const publish = (section?: string, excerpt?: string) =>
      setGhostContext({ path: window.location.pathname, chapter: (current + 1) + '. ' + title, section, excerpt })
    publish(undefined, root?.innerText.slice(0, 2400))
    if (!root) return
    const heads = Array.from(root.querySelectorAll('h2, h3, h4')) as HTMLElement[]
    if (!heads.length) return
    const io = new IntersectionObserver(entries => {
      const hit = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (!hit) return
      const h = hit.target as HTMLElement
      let text = ''
      let n = h.nextElementSibling as HTMLElement | null
      while (n && !/^H[2-4]$/.test(n.tagName) && text.length < 2400) { text += (n.innerText || '') + '\n'; n = n.nextElementSibling as HTMLElement | null }
      publish(h.innerText, text)
    }, { rootMargin: '-35% 0px -55% 0px' })
    heads.forEach(h => io.observe(h))
    return () => io.disconnect()
  }, [current, chapters])
  useEffect(() => () => setGhostContext(null), [])

  // Copy buttons on every code block (copies commands without the "$ " prompt).
  useEffect(() => {
    const root = contentRef.current
    if (!root) return
    root.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.cx-copy')) return
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'cx-copy'
      b.textContent = 'COPY'
      b.setAttribute('aria-label', 'Copy code')
      b.onclick = () => {
        const raw = Array.from(pre.childNodes).filter(n => n !== b).map(n => n.textContent || '').join('')
        const text = raw.split('\n').map(l => l.replace(/^\s*\$ /, '')).join('\n').trim()
        navigator.clipboard?.writeText(text).then(() => {
          b.textContent = 'COPIED'
          b.dataset.done = 'true'
          setTimeout(() => { b.textContent = 'COPY'; b.dataset.done = 'false' }, 1600)
        }).catch(() => {})
      }
      pre.appendChild(b)
    })
  }, [current])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
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
  const readNow = visited.has(current) && dwelt && reachedEnd
  const acc = accentText(accent)

  return (
    <div className="cx" style={{ ['--accent' as string]: accent, ['--acc' as string]: acc, ['--read' as string]: READ_SIZES[size] + 'px' } as React.CSSProperties}>
      <GxStyles />

      {resumeFrom !== null && !resumed && (
        <div className="gx-clay cx-resume">
          <span style={{ fontFamily: T.sans, fontSize: '15px', color: T.body }}>
            Pick up where you left off: <b style={{ color: T.tx }}>Chapter {resumeFrom + 1}, {chapters[resumeFrom].title}</b>
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="gx-btn gx-btn--secondary" onClick={() => { goTo(resumeFrom!); setResumed(true) }}>RESUME</button>
            <button className="gx-btn gx-btn--ghost" onClick={() => { setResumeFrom(null); setResumed(true) }}>START OVER</button>
          </div>
        </div>
      )}

      {/* Chapter rail */}
      <nav className="codex-nav-strip cx-strip" aria-label="Chapters">
        <div className="cx-dots">
          {chapters.map((c, i) => (
            <button key={i} onClick={() => goTo(i)} className="cx-dot" data-current={i === current} data-read={visited.has(i)} aria-label={'Chapter ' + (i + 1) + ': ' + c.title + (visited.has(i) ? ' (read)' : '')} aria-current={i === current ? 'step' : undefined}>
              {visited.has(i) && i !== current ? '✓' : String(i + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
        <div className="cx-strip-meta">
          <span>{visited.size}/{chapters.length} READ</span>
          <div className="cx-size" role="group" aria-label="Text size">
            {(['S', 'M', 'L', 'XL'] as const).map(k => (
              <button key={k} aria-pressed={size === k} onClick={() => setSize(k)} aria-label={'Text size ' + k}>{k === 'S' ? 'A-' : k === 'M' ? 'A' : k === 'L' ? 'A+' : 'A++'}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* Chapter header */}
      <header className="codex-chapter-header cx-head gx-hud">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="hx-tag" style={{ color: difficultyColor(ch.difficulty) }}>{ch.difficulty}</span>
          <span style={{ fontFamily: T.mono, fontSize: '11.5px', color: T.dimHi, letterSpacing: '.1em' }}>~{ch.readTime} READ</span>
          <span style={{ fontFamily: T.mono, fontSize: '11.5px', color: T.dimHi, letterSpacing: '.1em', marginLeft: 'auto' }}>CHAPTER {current + 1} OF {chapters.length}</span>
        </div>
        <h2 className="codex-chapter-title cx-title">{ch.title}</h2>
      </header>

      {/* Scannable key points — the quick version, before the deep read */}
      {ch.takeaways && ch.takeaways.length > 0 && (
        <section aria-label="Key points at a glance" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid ' + acc + '2e', borderLeft: '3px solid ' + acc, borderRadius: '10px', padding: '14px 18px', margin: '0 0 22px' }}>
          <div style={{ fontFamily: T.mono, fontSize: '10.5px', fontWeight: 700, color: acc, letterSpacing: '.2em', marginBottom: '10px' }}>KEY POINTS · THE QUICK VERSION</div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '7px' }}>
            {ch.takeaways.map((t, i) => <li key={i} style={{ color: T.body, fontSize: '14px', lineHeight: 1.55 }}>{t}</li>)}
          </ul>
          <div style={{ fontFamily: T.sans, fontSize: '12px', color: T.dim, marginTop: '11px' }}>Scan these first, then read below for the depth and examples &mdash; or jump straight to the lab.</div>
        </section>
      )}

      {/* Content */}
      <div ref={contentRef} className="cx-body">{ch.content}</div>
      <div ref={endRef} aria-hidden="true" style={{ height: 1 }} />

      {/* Key takeaways */}
      <section className="codex-takeaways gx-clay cx-take" aria-label="Recap">
        <div style={{ fontFamily: T.mono, fontSize: '11px', fontWeight: 700, color: acc, letterSpacing: '.22em', marginBottom: '12px' }}>RECAP · CHECK YOURSELF</div>
        <ul>
          {ch.takeaways.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
        <div className="cx-read-status" data-done={readNow}>
          {readNow ? '✓ Chapter read · progress saved' : reachedEnd ? 'Almost there: stay a moment longer to count this chapter' : 'Read to the end to count this chapter'}
        </div>
      </section>

      <div className="cx-actions">
        <button className="gx-btn gx-btn--secondary" onClick={() => openGhost('Quiz me with 3 quick questions on this chapter: ' + ch.title)}>QUIZ ME WITH GHOST</button>
        <button className="gx-btn gx-btn--ghost" onClick={() => openGhost('Explain the key idea of "' + ch.title + '" more simply, with a real-world example.')}>EXPLAIN SIMPLER</button>
        {ch.labLink && <a href={ch.labLink} className="gx-btn gx-btn--ghost">PRACTISE IN THE LAB ▸</a>}
      </div>

      {/* Prev / Next */}
      <div className="cx-pn">
        <button className="codex-prev-btn gx-clay gx-hit cx-pn-btn" onClick={() => current > 0 && goTo(current - 1)} disabled={current === 0}>
          <span className="cx-pn-label">◂ PREVIOUS</span>
          <span className="cx-pn-title">{current > 0 ? chapters[current - 1].title : 'Start of module'}</span>
        </button>
        <button className="codex-next-btn gx-clay gx-hit cx-pn-btn" style={{ textAlign: 'right' }} onClick={() => current < chapters.length - 1 && goTo(current + 1)} disabled={current === chapters.length - 1}>
          <span className="cx-pn-label">NEXT ▸</span>
          <span className="cx-pn-title">{current < chapters.length - 1 ? chapters[current + 1].title : 'Module complete'}</span>
        </button>
      </div>

      <style>{`
        .cx { color: var(--tx); }
        .cx-resume { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 16px 20px; margin-bottom: 20px; }
        .cx-strip { position: sticky; top: 60px; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 10px 12px; margin: 0 0 24px; border-radius: 16px;
          background: rgba(10,18,24,.88); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(232,243,246,.06); }
        .cx-dots { display: flex; gap: 6px; flex-wrap: wrap; }
        .cx-dot { min-width: 38px; height: 34px; padding: 0 8px; border-radius: 10px; border: 0; cursor: pointer; font: 700 12px/1 var(--mono); color: var(--tx-dim-hi); background: var(--clay-face); box-shadow: var(--e-clay); transition: transform .15s, color .15s; }
        .cx-dot:hover { transform: translateY(-1px); color: var(--tx); }
        .cx-dot[data-read="true"] { color: #04070a; background: var(--accent); box-shadow: inset 0 1px 0 rgba(255,255,255,.4); }
        .cx-dot[data-current="true"] { color: var(--tx); background: var(--s1); box-shadow: var(--e-pressed), 0 0 0 2px var(--accent); }
        .cx-dot:focus-visible, .cx-size button:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
        .cx-strip-meta { display: flex; align-items: center; gap: 14px; font: 600 11px/1 var(--mono); letter-spacing: .14em; color: var(--tx-dim-hi); }
        .cx-size { display: flex; gap: 2px; padding: 3px; border-radius: 10px; background: var(--s1); box-shadow: var(--e-well); }
        .cx-size button { font: 700 11px/1 var(--mono); color: var(--tx-dim); background: none; border: 0; padding: 6px 8px; border-radius: 8px; cursor: pointer; }
        .cx-size button[aria-pressed="true"] { color: var(--tx); background: var(--s3); }
        .cx-head { padding: clamp(20px, 4vw, 30px); margin-bottom: 32px; }
        .cx-title { font-family: var(--sans); font-weight: 650; font-size: clamp(26px, 4vw, 36px); letter-spacing: -.015em; line-height: 1.2; color: var(--tx); margin: 16px 0 0; }

        /* Reading column: one readable style for every chapter's content */
        .cx-body { max-width: 76ch; }
        .cx-body p, .cx-body li { font-family: var(--sans) !important; font-size: var(--read) !important; line-height: 1.75 !important; color: var(--tx-body) !important; }
        .cx-body p { margin: 0 0 1.1em !important; }
        .cx-body li { margin-bottom: .4em; }
        .cx-body strong, .cx-body b { color: var(--tx) !important; }
        .cx-body a { color: var(--cyan) !important; }
        .cx-body h3, .cx-body h4 { font-family: var(--sans) !important; font-weight: 650 !important; color: var(--tx) !important; letter-spacing: -.01em; line-height: 1.3 !important; text-shadow: none !important; }
        .cx-body h3 { font-size: calc(var(--read) * 1.35) !important; margin: 2.2em 0 .7em !important; padding-left: 14px; border-left: 3px solid var(--accent); }
        .cx-body h4 { font-size: calc(var(--read) * 1.1) !important; margin: 1.6em 0 .5em !important; }
        .cx-body pre { position: relative; font-size: 14px !important; line-height: 1.65 !important; background: #071017 !important; border: 1px solid rgba(232,243,246,.08) !important; border-radius: 0 !important; color: #d6f5e0 !important; padding: 18px 18px 18px 18px !important; max-width: 100%; }
        .cx-body code { font-family: var(--mono); }
        .cx-body table { font-family: var(--sans); font-size: calc(var(--read) * .88) !important; border-collapse: collapse; width: 100%; }
        .cx-body th { color: var(--tx) !important; font-weight: 600 !important; text-align: left; }
        .cx-body td, .cx-body th { border-bottom: 1px solid rgba(232,243,246,.08) !important; padding: 10px 12px !important; color: var(--tx-body) !important; }
        .cx-body div[style*="border-left"] { border-radius: 0 !important; }
        .cx-body div[style*="border-left"] > div:last-child { font-family: var(--sans) !important; font-size: calc(var(--read) * .94) !important; line-height: 1.7 !important; color: var(--tx-body) !important; }
        .cx-copy { position: absolute; top: 8px; right: 8px; font: 700 10.5px/1 var(--mono); letter-spacing: .14em; color: var(--tx-dim-hi); background: rgba(10,18,24,.9); border: 1px solid var(--line-hi); padding: 7px 9px; cursor: pointer; }
        .cx-copy:hover { color: var(--tx); border-color: var(--cyan); }
        .cx-copy[data-done="true"] { color: var(--green); border-color: var(--green); }

        .cx-take { padding: 22px 24px; margin-top: 40px; }
        .cx-take ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
        .cx-take li { position: relative; padding-left: 22px; font-family: var(--sans); font-size: 15.5px; line-height: 1.6; color: var(--tx-body); }
        .cx-take li::before { content: ''; position: absolute; left: 0; top: .6em; width: 8px; height: 8px; border-radius: 2px; background: var(--accent); transform: rotate(45deg); }
        .cx-read-status { margin-top: 18px; padding-top: 14px; border-top: 1px dashed rgba(232,243,246,.1); font: 600 11.5px/1.4 var(--mono); letter-spacing: .08em; color: var(--tx-dim-hi); }
        .cx-read-status[data-done="true"] { color: var(--green); }
        .cx-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 18px; }
        .cx-pn { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; margin-top: 40px; }
        .cx-pn-btn { display: flex; flex-direction: column; gap: 6px; padding: 16px 18px; border: 0; color: inherit; font: inherit; text-align: left; border-radius: 16px; }
        .cx-pn-btn:disabled { opacity: .45; cursor: default; transform: none !important; }
        .cx-pn-label { font: 700 11px/1 var(--mono); letter-spacing: .18em; color: var(--acc); }
        .cx-pn-title { font-family: var(--sans); font-size: 15px; font-weight: 600; color: var(--tx); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        @media (max-width: 640px) { .cx-strip { top: 60px; } .cx-strip-meta > span { display: none } .cx-pn { grid-template-columns: minmax(0, 1fr); } }
      `}</style>
    </div>
  )
}
