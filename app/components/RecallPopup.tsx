'use client'
// A quiet, occasional "quick recall" card that surfaces one due flashcard while the
// learner browses. Spaced retrieval is the single best-evidenced driver of long-term
// retention, so we bring the card to them instead of waiting for them to visit /review.
// It is deliberately polite: never on focused pages, never more than once every ~12 min,
// and always dismissible.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { api } from '../../lib/client/api'
import { CATALOG } from '../../lib/learning'
import { T } from './gx/Gx'

type Card = { id: string; moduleId: string; prompt: string; code: string | null; options: string[] }
type Graded = { correct: boolean; answer: number; explain: string; intervalDays: number }

const SNOOZE_KEY = 'gn_recall_snooze'
const ARM_DELAY_MS = 70_000 // settle on a page before interrupting
const SNOOZE_SHOWN_MS = 12 * 60_000
const SNOOZE_DISMISS_MS = 25 * 60_000
const POLL_MS = 25_000

// Pages where a pop quiz would be intrusive or redundant.
const BLOCKED = ['/review', '/assess', '/welcome', '/auth', '/onboarding']

const catTitle = (id: string) => CATALOG.find(m => m.id === id)?.title || id
const catColor = (id: string) => CATALOG.find(m => m.id === id)?.color || T.cyan

function snoozedUntil(): number {
  try { return parseInt(localStorage.getItem(SNOOZE_KEY) || '0', 10) || 0 } catch { return 0 }
}
function setSnooze(ms: number) {
  try { localStorage.setItem(SNOOZE_KEY, String(Date.now() + ms)) } catch { /* private mode */ }
}

export default function RecallPopup() {
  const path = usePathname()
  const { profile } = useAuth()
  const [card, setCard] = useState<Card | null>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const [graded, setGraded] = useState<Graded | null>(null)
  const [closing, setClosing] = useState(false)
  const armedAt = useRef<number>(Date.now())
  const busy = useRef(false)

  const eligible = !!profile && !BLOCKED.some(b => path === b || path.startsWith(b + '/'))

  // Reset the settle timer whenever we move onto an eligible page with nothing showing.
  useEffect(() => { if (eligible && !card) armedAt.current = Date.now() }, [path, eligible, card])

  const close = useCallback((snooze: number) => {
    setClosing(true)
    setSnooze(snooze)
    window.setTimeout(() => { setCard(null); setPicked(null); setGraded(null); setClosing(false) }, 220)
  }, [])

  const tryShow = useCallback(async () => {
    if (busy.current || card || !eligible) return
    if (Date.now() < snoozedUntil()) return
    if (Date.now() - armedAt.current < ARM_DELAY_MS) return
    busy.current = true
    const r = await api<{ cards: Card[] }>('/api/review?n=1')
    busy.current = false
    const first = r.ok !== false && Array.isArray(r.cards) ? r.cards[0] : null
    if (first) { setCard(first); setPicked(null); setGraded(null); setClosing(false) }
    else setSnooze(SNOOZE_SHOWN_MS) // nothing due — don't re-check for a while
  }, [card, eligible])

  useEffect(() => {
    if (!eligible) return
    const t = window.setInterval(tryShow, POLL_MS)
    return () => window.clearInterval(t)
  }, [eligible, tryShow])

  async function choose(idx: number) {
    if (picked !== null || !card) return
    setPicked(idx)
    const r = await api<Graded>('/api/review', { cardId: card.id, chosenIndex: idx }, 'POST')
    if (r.ok !== false) {
      setGraded(r as unknown as Graded)
      window.setTimeout(() => close(SNOOZE_SHOWN_MS), 7000)
    } else {
      setPicked(null)
    }
  }

  if (!card) return null
  const ac = catColor(card.moduleId)

  return (
    <div className={'rp-shell' + (closing ? ' rp-out' : '')} role="dialog" aria-label="Quick recall">
      <div className="rp-card" style={{ ['--accent' as string]: ac } as React.CSSProperties}>
        <div className="rp-head">
          <span className="rp-tag" style={{ color: ac }}>⚡ QUICK RECALL · {catTitle(card.moduleId)}</span>
          <button className="rp-x" onClick={() => close(SNOOZE_DISMISS_MS)} aria-label="Dismiss">✕</button>
        </div>
        <div className="rp-q">{card.prompt}</div>
        {card.code && <pre className="rp-code">{card.code}</pre>}
        <div className="rp-opts">
          {card.options.map((opt, idx) => {
            const isAns = graded && idx === graded.answer
            const isWrong = graded && idx === picked && !graded.correct
            const cls = 'rp-opt' + (isAns ? ' ok' : '') + (isWrong ? ' no' : '') + (picked !== null && !isAns && !isWrong ? ' dim' : '')
            return (
              <button key={idx} className={cls} onClick={() => choose(idx)} disabled={picked !== null}>
                <span className="rp-k">{String.fromCharCode(65 + idx)}</span>{opt}
              </button>
            )
          })}
        </div>
        {graded && (
          <div className="rp-fb" style={{ color: graded.correct ? T.green : T.red }}>
            <b>{graded.correct ? 'Correct' : 'Not quite'}</b> · back {graded.intervalDays <= 1 ? 'tomorrow' : 'in ' + graded.intervalDays + 'd'}
            <p className="rp-ex">{graded.explain}</p>
            <Link href="/review" className="rp-more" onClick={() => close(SNOOZE_SHOWN_MS)}>Review more →</Link>
          </div>
        )}
      </div>
      <style>{`
        .rp-shell { position: fixed; top: 74px; right: 20px; width: 360px; max-width: calc(100vw - 32px); z-index: 8800;
          animation: rpIn .28s cubic-bezier(.2,.8,.2,1); }
        .rp-out { animation: rpOut .22s ease forwards; }
        @keyframes rpIn { from { opacity: 0; transform: translateY(-10px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes rpOut { to { opacity: 0; transform: translateY(-8px) scale(.98); } }
        .rp-card { background: var(--gx-s2, #0a131b); border: 1px solid color-mix(in srgb, var(--accent) 24%, rgba(232,243,246,.08));
          border-radius: 16px; padding: 15px 16px; box-shadow: 0 18px 50px rgba(0,0,0,.55), 0 0 0 1px rgba(0,0,0,.4); }
        .rp-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 10px; }
        .rp-tag { font-family: var(--mono); font-size: 10.5px; font-weight: 700; letter-spacing: .08em; }
        .rp-x { background: none; border: none; color: var(--tx-dim); cursor: pointer; font-size: 13px; padding: 2px 4px; line-height: 1; }
        .rp-x:hover { color: var(--tx); }
        .rp-q { font-family: var(--sans); font-size: 14.5px; font-weight: 600; line-height: 1.4; color: var(--tx); margin-bottom: 11px; }
        .rp-code { font-family: var(--mono); font-size: 12px; line-height: 1.55; background: #071017; border: 1px solid rgba(232,243,246,.08); color: #d6f5e0; padding: 9px 11px; overflow-x: auto; margin: 0 0 11px; white-space: pre; border-radius: 8px; }
        .rp-opts { display: grid; gap: 7px; }
        .rp-opt { display: flex; gap: 9px; align-items: center; text-align: left; padding: 9px 11px; border-radius: 10px; cursor: pointer;
          font-family: var(--sans); font-size: 13.5px; color: var(--tx-body); background: rgba(232,243,246,.04); border: 1px solid rgba(232,243,246,.06); transition: background .13s, color .13s, box-shadow .13s; }
        .rp-opt:hover:not(:disabled) { background: rgba(232,243,246,.08); color: var(--tx); }
        .rp-opt:disabled { cursor: default; }
        .rp-opt.ok { box-shadow: inset 0 0 0 1.5px rgba(0,255,65,.6); color: var(--tx); }
        .rp-opt.no { box-shadow: inset 0 0 0 1.5px rgba(255,65,54,.55); color: var(--tx); }
        .rp-opt.dim { opacity: .45; }
        .rp-k { flex: none; width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; font-family: var(--mono); font-size: 11px; font-weight: 700; color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent); }
        .rp-fb { font-family: var(--mono); font-size: 11.5px; letter-spacing: .04em; margin-top: 11px; }
        .rp-ex { font-family: var(--sans); font-size: 12.5px; letter-spacing: 0; line-height: 1.5; color: var(--tx-body); margin: 7px 0 0; }
        .rp-more { display: inline-block; margin-top: 8px; font-family: var(--mono); font-size: 11px; color: var(--cyan); text-decoration: none; }
        .rp-more:hover { text-decoration: underline; }
        @media (max-width: 640px) { .rp-shell { top: auto; bottom: 86px; right: 12px; left: 12px; width: auto; } }
        @media (prefers-reduced-motion: reduce) { .rp-shell, .rp-out { animation: none; } }
      `}</style>
    </div>
  )
}
