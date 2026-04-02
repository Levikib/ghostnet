'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

export interface LabStep {
  id: string
  title: string
  objective: string
  hint: string
  /** expected answers — any match = pass. Support wildcards via '*' */
  answers: string[]
  /** Optional flag format: FLAG{...} */
  flag?: string
  xp: number
  explanation: string
}

interface Props {
  labId: string
  moduleId: string
  title: string
  accent: string
  steps: LabStep[]
  /** Called when all steps complete */
  onComplete?: (totalXp: number) => void
  /** Called when lab is restarted */
  onRestart?: () => void
}

function normalise(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

function checkAnswer(input: string, answers: string[]): boolean {
  const norm = normalise(input)
  return answers.some(a => {
    if (a === '*') return norm.length > 0
    return normalise(a) === norm || norm.includes(normalise(a))
  })
}

export default function LabTerminal({ labId, moduleId, title, accent, steps, onComplete, onRestart }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<{ text: string; type: 'cmd' | 'out' | 'err' | 'sys' | 'flag' }[]>([])
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [failed, setFailed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [totalXp, setTotalXp] = useState(0)
  const [allDone, setAllDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [xpFlash, setXpFlash] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const mono = 'JetBrains Mono, monospace'

  const step = steps[currentStep]

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lab_' + labId)
    if (saved) {
      const data = JSON.parse(saved)
      setCompleted(new Set(data.completed || []))
      setTotalXp(data.xp || 0)
      if (data.step !== undefined) setCurrentStep(data.step)
      if (data.done) setAllDone(true)
    }
    setLines([
      { text: '╔═══════════════════════════════════════════════╗', type: 'sys' },
      { text: '║  GHOSTNET INTERACTIVE LAB TERMINAL             ║', type: 'sys' },
      { text: '╚═══════════════════════════════════════════════╝', type: 'sys' },
      { text: '', type: 'sys' },
      { text: 'Module: ' + title, type: 'sys' },
      { text: 'Steps: ' + steps.length + ' | Type answers or commands below', type: 'sys' },
      { text: '', type: 'sys' },
    ])
  }, [labId, title, steps.length])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [lines])

  const addLine = useCallback((text: string, type: 'cmd' | 'out' | 'err' | 'sys' | 'flag') => {
    setLines(prev => [...prev, { text, type }])
  }, [])

  const saveProgress = useCallback(async (newCompleted: Set<number>, newXp: number, done: boolean) => {
    // localStorage always
    localStorage.setItem('lab_' + labId, JSON.stringify({
      completed: Array.from(newCompleted),
      xp: newXp,
      step: currentStep,
      done,
    }))

    // Sync to ghostnet_progress so ProgressTracker + Profile stay in sync
    if (done) {
      try {
        const raw = localStorage.getItem('ghostnet_progress')
        const gp = raw ? JSON.parse(raw) : { completedLabs: [], xp: 0, streak: 0, lastActivity: '', notes: {} }
        if (!gp.completedLabs.includes(labId)) {
          gp.completedLabs = [...gp.completedLabs, labId]
          gp.xp = (gp.xp || 0) + newXp
          const todayStr = new Date().toDateString()
          const prevDay = gp.lastActivity ? new Date(gp.lastActivity).toDateString() : ''
          const ystStr = new Date(Date.now() - 86400000).toDateString()
          if (prevDay === ystStr) gp.streak = (gp.streak || 0) + 1
          else if (prevDay !== todayStr) gp.streak = 1
          gp.lastActivity = new Date().toISOString()
          localStorage.setItem('ghostnet_progress', JSON.stringify(gp))
          window.dispatchEvent(new Event('ghostnet_progress_updated'))
        }
      } catch {
        // ignore
      }
    }

    // Supabase if logged in
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && done) {
        setSaving(true)
        const resp = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            lab_id: labId,
            module_id: moduleId,
            xp_earned: newXp,
          }),
        })
        if (resp.ok) setSaved(true)
        setSaving(false)
      }
    } catch {
      // offline — localStorage only
    }
  }, [labId, moduleId, currentStep])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const raw = input.trim()
    if (!raw) return
    setInput('')
    setFailed(false)
    setShowHint(false)
    addLine('ghost@lab:~$ ' + raw, 'cmd')

    if (!step) return

    // Check answer
    const correct = checkAnswer(raw, step.answers)

    if (correct) {
      setAttempts(0)
      // Success path
      addLine('', 'sys')
      addLine('✓ CORRECT — ' + step.explanation, 'out')

      if (step.flag) {
        addLine('', 'sys')
        addLine('  ' + step.flag, 'flag')
        addLine('', 'sys')
      }

      const newXp = totalXp + step.xp
      setTotalXp(newXp)
      setXpFlash(step.xp)
      setTimeout(() => setXpFlash(0), 2000)

      const newCompleted = new Set(completed)
      newCompleted.add(currentStep)
      setCompleted(newCompleted)

      const nextStep = currentStep + 1
      const done = nextStep >= steps.length

      if (done) {
        addLine('', 'sys')
        addLine('█████████████████████████████████████████', 'sys')
        addLine('  LAB COMPLETE — Total XP: +' + newXp, 'sys')
        addLine('█████████████████████████████████████████', 'sys')
        setAllDone(true)
        saveProgress(newCompleted, newXp, true)
        onComplete?.(newXp)
      } else {
        addLine('', 'sys')
        addLine('→ Advancing to step ' + (nextStep + 1) + '/' + steps.length + '...', 'sys')
        addLine('', 'sys')
        setCurrentStep(nextStep)
        saveProgress(newCompleted, newXp, false)
      }
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setFailed(true)
      addLine('✗ Not quite right. Try again.', 'err')
      if (newAttempts >= 2) {
        addLine('  Hint: type "hint" to see a clue.', 'err')
      }
    }
  }, [input, step, completed, currentStep, steps.length, totalXp, attempts, addLine, saveProgress, onComplete])

  const handleKeyword = useCallback((cmd: string) => {
    const lower = cmd.toLowerCase()
    if (lower === 'hint' || lower === 'help') {
      setShowHint(true)
      addLine('ghost@lab:~$ ' + cmd, 'cmd')
      addLine('HINT: ' + step?.hint, 'out')
      setInput('')
      return true
    }
    if (lower === 'skip' && step?.flag) {
      // allow skip but no XP
      addLine('ghost@lab:~$ ' + cmd, 'cmd')
      addLine('⚠ Step skipped (no XP awarded).', 'err')
      const newCompleted = new Set(completed)
      newCompleted.add(currentStep)
      setCompleted(newCompleted)
      const nextStep = currentStep + 1
      if (nextStep >= steps.length) {
        setAllDone(true)
        saveProgress(newCompleted, totalXp, true)
      } else {
        setCurrentStep(nextStep)
        saveProgress(newCompleted, totalXp, false)
      }
      setInput('')
      return true
    }
    if (lower === 'clear') {
      setLines([])
      setInput('')
      return true
    }
    return false
  }, [step, completed, currentStep, steps.length, totalXp, addLine, saveProgress])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (handleKeyword(input)) return
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent
      handleSubmit(fakeEvent)
    }
  }

  const lineColor = (type: string) => {
    if (type === 'cmd') return '#ffffff'
    if (type === 'out') return '#00ff41'
    if (type === 'err') return '#ff4136'
    if (type === 'flag') return accent
    return '#3a6a3a'
  }

  return (
    <div style={{ margin: '2rem 0', fontFamily: mono }}>
      {/* XP flash */}
      {xpFlash > 0 && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 9500, background: 'rgba(0,255,65,0.15)', border: '1px solid rgba(0,255,65,0.5)', borderRadius: '6px', padding: '8px 18px', fontSize: '14px', color: '#00ff41', fontFamily: mono, animation: 'labXpFade 2s ease forwards' }}>
          +{xpFlash} XP
          <style>{`@keyframes labXpFade{0%{opacity:1;transform:translateY(0)}80%{opacity:1}100%{opacity:0;transform:translateY(-28px)}}`}</style>
        </div>
      )}

      {/* Step progress bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: completed.has(i) ? accent : (i === currentStep ? accent + '55' : '#1a2e1e'), transition: 'background 0.3s' }} title={'Step ' + (i + 1) + ': ' + s.title} />
        ))}
      </div>

      {/* Current step card */}
      {!allDone && step && (
        <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid ' + accent + '33', borderRadius: '8px', padding: '16px 20px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '8px', color: accent + '99', letterSpacing: '0.2em', marginBottom: '4px' }}>
                STEP {currentStep + 1}/{steps.length} &nbsp;·&nbsp; +{step.xp} XP
              </div>
              <div style={{ fontSize: '0.9rem', color: accent, fontWeight: 600 }}>{step.title}</div>
            </div>
            <button
              onClick={() => { setShowHint(!showHint); addLine('ghost@lab:~$ hint', 'cmd'); addLine('HINT: ' + step.hint, 'out') }}
              style={{ background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.3)', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontSize: '8px', color: '#ffb347', letterSpacing: '0.12em', fontFamily: mono }}
            >
              HINT
            </button>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#8a9a8a', lineHeight: 1.7 }}>{step.objective}</div>
          {showHint && (
            <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(255,179,71,0.05)', border: '1px solid rgba(255,179,71,0.2)', borderRadius: '4px', fontSize: '0.78rem', color: '#ffb347', lineHeight: 1.6 }}>
              ▸ {step.hint}
            </div>
          )}
        </div>
      )}

      {/* All done */}
      {allDone && (
        <div style={{ background: 'rgba(0,255,65,0.06)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '8px', padding: '24px', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.65rem', color: accent + '88', letterSpacing: '0.25em', marginBottom: '8px' }}>LAB COMPLETE</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: accent, marginBottom: '4px', fontFamily: mono }}>+{totalXp} XP EARNED</div>
            <div style={{ fontSize: '0.75rem', color: '#5a8a5a', marginBottom: '12px' }}>{steps.length}/{steps.length} steps completed</div>
            {saving && <div style={{ fontSize: '0.7rem', color: '#5a7a5a' }}>Saving to profile...</div>}
            {saved && <div style={{ fontSize: '0.7rem', color: accent }}>&#10003; Progress saved to your profile</div>}
            {!saving && !saved && (
              <div style={{ fontSize: '0.7rem', color: '#5a7a5a' }}>
                Progress saved locally. <a href="/auth" style={{ color: accent, textDecoration: 'underline' }}>Sign in</a> to sync across devices.
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <a href="/leaderboard" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#00d4ff', padding: '8px 18px', border: '1px solid rgba(0,212,255,0.35)', borderRadius: '4px', background: 'rgba(0,212,255,0.06)', letterSpacing: '0.1em' }}>
              VIEW LEADERBOARD
            </a>
            <a href="/" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: accent, padding: '8px 18px', border: '1px solid rgba(0,255,65,0.35)', borderRadius: '4px', background: 'rgba(0,255,65,0.06)', letterSpacing: '0.1em' }}>
              NEXT MODULE &#8594;
            </a>
          </div>
        </div>
      )}

      {/* Terminal output */}
      <div
        ref={outputRef}
        onClick={() => inputRef.current?.focus()}
        style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '8px 8px 0 0', padding: '14px 16px', height: '240px', overflowY: 'auto', cursor: 'text' }}
      >
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: mono, fontSize: '0.76rem', color: lineColor(l.type), lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {l.text || '\u00a0'}
          </div>
        ))}
        {!allDone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontFamily: mono, fontSize: '0.76rem', color: '#00ff41' }}>ghost@lab:~$</span>
            <span style={{ fontFamily: mono, fontSize: '0.76rem', color: '#fff' }}>{input}</span>
            <span style={{ display: 'inline-block', width: '8px', height: '14px', background: '#00ff41', animation: 'blink 1s step-end infinite' }} />
            <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
          </div>
        )}
      </div>

      {/* Input bar */}
      {!allDone && (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', background: '#080c08', border: '1px solid #1a2e1e', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}
        >
          <span style={{ padding: '10px 12px', fontFamily: mono, fontSize: '0.76rem', color: '#00ff41', flexShrink: 0 }}>ghost@lab:~$</span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: mono, fontSize: '0.76rem', color: '#fff', padding: '10px 0' }}
            placeholder={failed ? 'Try again… or type "hint"' : 'Type your answer and press Enter'}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="submit"
            style={{ padding: '0 16px', background: 'rgba(0,255,65,0.08)', border: 'none', borderLeft: '1px solid #1a2e1e', cursor: 'pointer', fontFamily: mono, fontSize: '8px', color: '#00ff41', letterSpacing: '0.12em' }}
          >
            RUN
          </button>
        </form>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' as const }}>
        <button
          onClick={() => { setLines([]); addLine('Terminal cleared.', 'sys') }}
          style={{ background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontFamily: mono, fontSize: '7px', color: '#3a6a3a', letterSpacing: '0.1em' }}
        >
          CLEAR
        </button>
        {!allDone && (
          <button
            onClick={() => { setShowHint(true); addLine('HINT: ' + step?.hint, 'out') }}
            style={{ background: 'rgba(255,179,71,0.05)', border: '1px solid rgba(255,179,71,0.2)', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontFamily: mono, fontSize: '7px', color: '#ffb347', letterSpacing: '0.1em' }}
          >
            HINT
          </button>
        )}
        {allDone && (
          <button
            onClick={() => {
              setCurrentStep(0)
              setCompleted(new Set())
              setTotalXp(0)
              setAllDone(false)
              setLines([{ text: 'Lab reset. Starting from step 1...', type: 'sys' }])
              localStorage.removeItem('lab_' + labId)
              // Remove from ghostnet_progress so XP and completedLabs reset
              try {
                const raw = localStorage.getItem('ghostnet_progress')
                if (raw) {
                  const gp = JSON.parse(raw)
                  const removed = gp.completedLabs.includes(labId)
                  gp.completedLabs = gp.completedLabs.filter((id: string) => id !== labId)
                  if (removed) {
                    // Can't reliably subtract XP since we don't know original amount, just leave XP
                    localStorage.setItem('ghostnet_progress', JSON.stringify(gp))
                    window.dispatchEvent(new Event('ghostnet_progress_updated'))
                  }
                }
              } catch {}
              onRestart?.()
            }}
            style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontFamily: mono, fontSize: '7px', color: '#00ff41', letterSpacing: '0.1em' }}
          >
            RESTART
          </button>
        )}
        <div style={{ marginLeft: 'auto', fontFamily: mono, fontSize: '7px', color: '#5a8a5a', alignSelf: 'center' }}>
          {Array.from(completed).length}/{steps.length} steps &nbsp;·&nbsp; {totalXp} XP earned
        </div>
      </div>
    </div>
  )
}
