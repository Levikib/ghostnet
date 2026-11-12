'use client'
// GHOST Drone — a scroll-following guide companion. It drifts down the left margin as you
// read, shows how far through the page you are, surfaces a contextual line about the section
// you're on, and opens the GHOST assistant (seeded with a question about that section) on click.
// It reuses the existing ghostContext channel, so it always knows "where you are".
import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { getGhostContext, openGhost, type GhostSurface } from '../../lib/client/ghostContext'

const BLOCKED = ['/welcome', '/auth', '/assess', '/review', '/onboarding']
const TOP = 120 // px from top the drone can travel to
const BOTTOM_GAP = 230 // keep clear of the bottom-left widget buttons

type Ctx = Omit<GhostSurface, 'path'> | null

const IDLE_LINES = [
  'I’m your guide. Tap me anytime to ask about what’s on screen.',
  'Reading something tricky? I can break it down in plain language.',
  'Want a worked example of this? Just tap.',
]

export default function GhostDrone() {
  const path = usePathname()
  const { profile } = useAuth()
  const [progress, setProgress] = useState(0) // 0..1 scroll through page
  const [top, setTop] = useState(TOP)
  const [ctx, setCtx] = useState<Ctx>(null)
  const [bubble, setBubble] = useState<string | null>(null)
  const [hovering, setHovering] = useState(false)
  const bubbleTimer = useRef<number | null>(null)
  const lastChapter = useRef<string | null>(null)
  const idleIdx = useRef(0)

  const eligible = !!profile && !BLOCKED.some(b => path === b || path.startsWith(b + '/'))

  // Track scroll → vertical position + progress ring.
  useEffect(() => {
    if (!eligible) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const doc = document.documentElement
        const max = (doc.scrollHeight - window.innerHeight) || 1
        const p = Math.min(1, Math.max(0, window.scrollY / max))
        setProgress(p)
        const travel = Math.max(TOP, window.innerHeight - BOTTOM_GAP)
        setTop(TOP + p * (travel - TOP))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [eligible, path])

  // Watch the published context so the drone knows which chapter/section the learner is on.
  useEffect(() => {
    if (!eligible) { setCtx(null); return }
    const read = () => setCtx(getGhostContext(path))
    read()
    window.addEventListener('ghost:context', read)
    return () => window.removeEventListener('ghost:context', read)
  }, [eligible, path])

  const showBubble = (text: string, ms: number) => {
    setBubble(text)
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current)
    bubbleTimer.current = window.setTimeout(() => setBubble(null), ms)
  }

  // When the section changes, greet it. Otherwise drop an occasional idle nudge.
  useEffect(() => {
    if (!eligible) return
    const label = ctx?.section || ctx?.chapter
    if (label && label !== lastChapter.current) {
      lastChapter.current = label
      const lead = ctx?.lab ? 'On the lab' : 'Now reading'
      showBubble(`${lead}: ${label}. Stuck? Tap me.`, 6500)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, eligible])

  useEffect(() => {
    if (!eligible) return
    const t = window.setInterval(() => {
      if (document.hidden) return
      if (!bubble && Math.random() < 0.5) {
        showBubble(IDLE_LINES[idleIdx.current % IDLE_LINES.length], 5500)
        idleIdx.current += 1
      }
    }, 95_000)
    return () => window.clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligible, bubble])

  useEffect(() => () => { if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current) }, [])

  if (!eligible) return null

  const ask = () => {
    const label = ctx?.section || ctx?.chapter
    if (ctx?.lab) openGhost(ctx.lab.objective ? `I’m stuck on this lab step: ${ctx.lab.objective}. Give me a hint without the full answer.` : 'Give me a hint for this lab step without the full answer.')
    else if (label) openGhost(`Explain "${label}" simply, with a concrete example.`)
    else openGhost()
  }

  const pct = Math.round(progress * 100)
  const R = 26
  const C = 2 * Math.PI * R

  return (
    <div className="gd-wrap" style={{ top: top + 'px' }}>
      {bubble && (
        <button className="gd-bubble" onClick={ask} aria-label="Ask GHOST about this">
          {bubble}
          <span className="gd-bubble-tail" />
        </button>
      )}
      <button
        className={'gd-drone' + (hovering ? ' hot' : '')}
        onClick={ask}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        aria-label="GHOST guide — ask about what's on screen"
        title="Ask GHOST about what's on screen"
      >
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
          {/* progress ring */}
          <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(0,212,255,.14)" strokeWidth="2.5" />
          <circle
            cx="32" cy="32" r={R} fill="none" stroke="var(--cyan,#00d4ff)" strokeWidth="2.5"
            strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
            transform="rotate(-90 32 32)" style={{ transition: 'stroke-dashoffset .2s linear' }}
          />
          {/* drone body */}
          <g className="gd-body">
            <ellipse cx="32" cy="33" rx="13" ry="11" fill="#0a1a24" stroke="var(--cyan,#00d4ff)" strokeWidth="1.5" />
            <ellipse cx="32" cy="33" rx="13" ry="11" fill="url(#gdGlow)" opacity="0.5" />
            {/* scanning eye */}
            <circle className="gd-eye" cx="32" cy="32" r="5" fill="var(--cyan,#00d4ff)" />
            <circle cx="32" cy="32" r="2.2" fill="#eafcff" />
            {/* antennae */}
            <line x1="25" y1="24" x2="22" y2="19" stroke="var(--cyan,#00d4ff)" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="39" y1="24" x2="42" y2="19" stroke="var(--cyan,#00d4ff)" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="22" cy="19" r="1.6" fill="#00ff41" />
            <circle cx="42" cy="19" r="1.6" fill="#00ff41" />
          </g>
          <defs>
            <radialGradient id="gdGlow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <span className="gd-pct">{pct}%</span>
      </button>

      <style>{`
        .gd-wrap { position: fixed; left: 16px; z-index: 8700; display: flex; align-items: center; gap: 10px; transition: top .25s cubic-bezier(.2,.8,.2,1); pointer-events: none; }
        .gd-wrap > * { pointer-events: auto; }
        .gd-drone { position: relative; background: none; border: none; cursor: pointer; padding: 0; width: 64px; height: 64px; filter: drop-shadow(0 6px 16px rgba(0,212,255,.25)); animation: gdBob 4s ease-in-out infinite; }
        .gd-drone.hot { animation-play-state: paused; }
        .gd-drone.hot .gd-body { transform-origin: 32px 33px; transform: scale(1.06); }
        .gd-body { transition: transform .2s ease; }
        .gd-eye { animation: gdScan 3.2s ease-in-out infinite; transform-origin: 32px 32px; }
        .gd-pct { position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); font-family: var(--mono, monospace); font-size: 8.5px; letter-spacing: .06em; color: var(--cyan,#00d4ff); background: rgba(4,7,10,.85); padding: 1px 5px; border-radius: 6px; }
        .gd-bubble { position: relative; max-width: 240px; text-align: left; font-family: var(--sans, sans-serif); font-size: 12.5px; line-height: 1.45; color: var(--tx, #e8f3f6); background: #0a131b; border: 1px solid rgba(0,212,255,.28); border-radius: 12px; padding: 10px 13px; cursor: pointer; box-shadow: 0 12px 34px rgba(0,0,0,.5); animation: gdPop .3s cubic-bezier(.2,.8,.2,1); }
        .gd-bubble:hover { border-color: rgba(0,212,255,.55); }
        .gd-bubble-tail { position: absolute; left: -6px; top: 50%; width: 10px; height: 10px; background: #0a131b; border-left: 1px solid rgba(0,212,255,.28); border-bottom: 1px solid rgba(0,212,255,.28); transform: translateY(-50%) rotate(45deg); }
        @keyframes gdBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes gdScan { 0%,100% { transform: translateX(-3px); } 50% { transform: translateX(3px); } }
        @keyframes gdPop { from { opacity: 0; transform: translateX(-6px) scale(.96); } to { opacity: 1; transform: none; } }
        @media (max-width: 980px) { .gd-wrap { display: none; } }
        @media (prefers-reduced-motion: reduce) { .gd-drone, .gd-eye { animation: none; } .gd-wrap { transition: none; } }
      `}</style>
    </div>
  )
}
