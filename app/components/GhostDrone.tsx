'use client'
// GHOST Drone — a living companion drone (Watch Dogs style). It hovers and autonomously
// roams around the screen margins, drifting smoothly between anchor points, bobbing as it
// flies, and periodically emitting a soft "scanning beam" sweep. It still reads the published
// ghostContext so it knows which chapter/section the learner is on, surfaces an occasional
// contextual speech bubble, and opens the GHOST assistant (seeded with a question about that
// section) on click. Movement is autonomous — scroll only nudges it slightly.
import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { getGhostContext, openGhost, type GhostSurface } from '../../lib/client/ghostContext'

const BLOCKED = ['/welcome', '/auth', '/assess', '/review', '/onboarding']
const SIZE = 64            // drone footprint (px)
const MARGIN = 20          // keep this far from viewport edges
const WIDGET_GAP = 150     // keep clear of the bottom-left/right widget button stacks

type Ctx = Omit<GhostSurface, 'path'> | null
type Pt = { x: number; y: number }

const IDLE_LINES = [
  'I’m your guide. Tap me anytime to ask about what’s on screen.',
  'Reading something tricky? I can break it down in plain language.',
  'Want a worked example of this? Just tap.',
]

// Build a ring of anchor points around the viewport margins the drone will roam between.
// Avoids the bottom corners where the floating widget buttons live.
function buildAnchors(w: number, h: number): Pt[] {
  const left = MARGIN
  const right = Math.max(MARGIN, w - SIZE - MARGIN)
  const top = MARGIN + 70            // leave room under any top nav
  const bottom = Math.max(top, h - SIZE - WIDGET_GAP)
  const midY = (top + bottom) / 2
  const midX = (left + right) / 2
  return [
    { x: left, y: top },
    { x: midX, y: top },
    { x: right, y: top },
    { x: right, y: midY },
    { x: right, y: bottom },      // bottom-right but lifted above the widget stack
    { x: midX, y: bottom },
    { x: left, y: bottom },
    { x: left, y: midY },
  ]
}

// Smooth ease for the drift between anchors (ease-in-out).
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function GhostDrone() {
  const path = usePathname()
  const { profile } = useAuth()
  const [progress, setProgress] = useState(0) // 0..1 scroll through page
  const [ctx, setCtx] = useState<Ctx>(null)
  const [bubble, setBubble] = useState<string | null>(null)
  const [hovering, setHovering] = useState(false)
  const [reduced, setReduced] = useState(false)

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const bubbleTimer = useRef<number | null>(null)
  const lastChapter = useRef<string | null>(null)
  const idleIdx = useRef(0)
  const scrollNudge = useRef(0)

  const eligible = !!profile && !BLOCKED.some(b => path === b || path.startsWith(b + '/'))

  // Respect reduced-motion: park the drone and skip roaming/beam.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  // Autonomous roaming: drift between margin anchors with requestAnimationFrame.
  // Writes transform straight to the DOM node (no per-frame React render).
  useEffect(() => {
    if (!eligible) return
    const el = wrapRef.current
    if (!el) return

    let anchors = buildAnchors(window.innerWidth, window.innerHeight)
    let from: Pt = anchors[0]
    let to: Pt = anchors[1 % anchors.length]
    let legStart = performance.now()
    let legDur = 8000 + Math.random() * 4000
    let raf = 0

    const place = (p: Pt) => { el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)` }

    if (reduced) {
      // Parked, pointer still interactive — sit at a calm top-left anchor.
      place(anchors[0])
      return () => {}
    }

    const pickNext = (cur: Pt) => {
      let n = anchors[Math.floor(Math.random() * anchors.length)]
      let guard = 0
      while (n.x === cur.x && n.y === cur.y && guard++ < 6) n = anchors[Math.floor(Math.random() * anchors.length)]
      return n
    }

    const tick = (now: number) => {
      const t = Math.min(1, (now - legStart) / legDur)
      const e = ease(t)
      const bob = Math.sin(now / 900) * 6           // gentle vertical hover
      const sway = Math.sin(now / 1700) * 4          // gentle horizontal sway
      const x = from.x + (to.x - from.x) * e + sway
      const y = from.y + (to.y - from.y) * e + bob + scrollNudge.current
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (t >= 1) {
        from = to
        to = pickNext(from)
        legStart = now
        legDur = 8000 + Math.random() * 4000
      }
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)

    const onResize = () => {
      anchors = buildAnchors(window.innerWidth, window.innerHeight)
      // keep targets valid after a resize
      from = anchors[Math.floor(Math.random() * anchors.length)]
      to = pickNext(from)
      legStart = performance.now()
    }
    window.addEventListener('resize', onResize)
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [eligible, reduced])

  // Track scroll → progress ring + a small autonomous-movement nudge.
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
        scrollNudge.current = (p - 0.5) * 24 // subtle: drifts a touch with reading position
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
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
    <div className="gd-overlay" aria-hidden={false}>
      <div ref={wrapRef} className={'gd-wrap' + (reduced ? ' reduced' : '')}>
        {bubble && (
          <button className="gd-bubble" onClick={ask} aria-label="Ask GHOST about this">
            {bubble}
            <span className="gd-bubble-tail" />
          </button>
        )}

        {/* scanning beam — periodic light sweep emanating from the drone */}
        <span className="gd-beam" aria-hidden="true" />
        {/* ambient hover glow pad beneath the drone */}
        <span className="gd-glowpad" aria-hidden="true" />

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
      </div>

      <style>{`
        /* full-viewport overlay that NEVER blocks the page */
        .gd-overlay { position: fixed; inset: 0; z-index: 8700; pointer-events: none; overflow: hidden; }
        /* the roaming wrapper is moved by rAF via transform; sits at top-left origin */
        .gd-wrap { position: absolute; top: 0; left: 0; width: ${SIZE}px; display: flex; align-items: center; gap: 10px; will-change: transform; pointer-events: none; }
        .gd-wrap.reduced { transition: none; }
        /* only the interactive bits accept pointer events */
        .gd-drone, .gd-bubble { pointer-events: auto; }
        .gd-beam, .gd-glowpad { pointer-events: none; }

        .gd-drone { position: relative; background: none; border: none; cursor: pointer; padding: 0; width: ${SIZE}px; height: ${SIZE}px; filter: drop-shadow(0 6px 16px rgba(0,212,255,.3)); animation: gdBob 4s ease-in-out infinite; z-index: 2; }
        .gd-drone.hot { animation-play-state: paused; }
        .gd-drone.hot .gd-body { transform-origin: 32px 33px; transform: scale(1.06); }
        .gd-body { transition: transform .2s ease; }
        .gd-eye { animation: gdScan 3.2s ease-in-out infinite; transform-origin: 32px 32px; }
        .gd-pct { position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); font-family: var(--mono, monospace); font-size: 8.5px; letter-spacing: .06em; color: var(--cyan,#00d4ff); background: rgba(4,7,10,.85); padding: 1px 5px; border-radius: 6px; }

        /* periodic scanning beam — a soft cone that sweeps out of the drone, then rests */
        .gd-beam {
          position: absolute; left: 50%; top: 50%; width: 320px; height: 320px;
          margin-left: -160px; margin-top: -160px; border-radius: 50%;
          background: conic-gradient(from 0deg,
            rgba(0,212,255,0) 0deg,
            rgba(0,212,255,.16) 10deg,
            rgba(0,255,65,.10) 22deg,
            rgba(0,212,255,0) 40deg);
          opacity: 0; z-index: 0;
          animation: gdBeam 9s cubic-bezier(.33,0,.2,1) infinite;
          mix-blend-mode: screen;
        }
        /* faint ambient ground-glow that pulses so it reads as "hovering/alive" */
        .gd-glowpad {
          position: absolute; left: 50%; top: 50%; width: 120px; height: 120px;
          margin-left: -60px; margin-top: -60px; border-radius: 50%; z-index: 0;
          background: radial-gradient(circle, rgba(0,212,255,.16) 0%, rgba(0,212,255,0) 70%);
          animation: gdPulse 4s ease-in-out infinite;
        }

        .gd-bubble { position: relative; max-width: 240px; text-align: left; font-family: var(--sans, sans-serif); font-size: 12.5px; line-height: 1.45; color: var(--tx, #e8f3f6); background: #0a131b; border: 1px solid rgba(0,212,255,.28); border-radius: 12px; padding: 10px 13px; cursor: pointer; box-shadow: 0 12px 34px rgba(0,0,0,.5); animation: gdPop .3s cubic-bezier(.2,.8,.2,1); z-index: 3; position: absolute; left: ${SIZE + 12}px; top: 50%; transform: translateY(-50%); }
        .gd-bubble:hover { border-color: rgba(0,212,255,.55); }
        .gd-bubble-tail { position: absolute; left: -6px; top: 50%; width: 10px; height: 10px; background: #0a131b; border-left: 1px solid rgba(0,212,255,.28); border-bottom: 1px solid rgba(0,212,255,.28); transform: translateY(-50%) rotate(45deg); }

        @keyframes gdBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes gdScan { 0%,100% { transform: translateX(-3px); } 50% { transform: translateX(3px); } }
        @keyframes gdPop { from { opacity: 0; transform: translateY(-50%) translateX(-6px) scale(.96); } to { opacity: 1; transform: translateY(-50%); } }
        @keyframes gdPulse { 0%,100% { opacity: .35; transform: scale(.9); } 50% { opacity: .7; transform: scale(1.08); } }
        /* beam: mostly dormant, sweeps ~once per cycle then fades out */
        @keyframes gdBeam {
          0%   { opacity: 0; transform: rotate(0deg); }
          6%   { opacity: .55; }
          26%  { opacity: .45; }
          34%  { opacity: 0; transform: rotate(150deg); }
          100% { opacity: 0; transform: rotate(150deg); }
        }

        @media (max-width: 980px) { .gd-overlay { display: none; } }
        @media (prefers-reduced-motion: reduce) {
          .gd-drone, .gd-eye, .gd-beam, .gd-glowpad { animation: none; }
          .gd-beam, .gd-glowpad { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
