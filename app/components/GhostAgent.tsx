'use client'
import React, { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { RANK_LIST } from '../../lib/supabase'
import { getGhostContext } from '../../lib/client/ghostContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}



function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '12px 16px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#00d4ff', opacity: 0.6,
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'

  const formatContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).split('\n')
        const lang = lines[0].trim()
        const code = lines.slice(1).join('\n')
        return (
          <pre key={i} style={{
            background: '#020502', border: '1px solid #1a2e1e',
            borderRadius: '3px', padding: '10px 12px', margin: '8px 0',
            fontSize: '0.72rem', lineHeight: 1.6, overflowX: 'auto',
            color: '#00ff41', fontFamily: 'JetBrains Mono, monospace',
            whiteSpace: 'pre' as const,
          }}>
            {lang && <div style={{ color: '#2a5a2a', fontSize: '9px', marginBottom: '6px', letterSpacing: '0.1em' }}>{lang}</div>}
            {code}
          </pre>
        )
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} style={{ background: '#0a1a0a', border: '1px solid #1a3a1a', borderRadius: '2px', padding: '1px 5px', color: '#00ff41', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>{part.slice(1, -1)}</code>
      }
      return <span key={i} style={{ whiteSpace: 'pre-wrap' as const }}>{part}</span>
    })
  }

  return (
    <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', maxWidth: '92%', flexDirection: isUser ? 'row-reverse' : 'row' }}>
        {/* Avatar */}
        <div style={{
          width: '24px', height: '24px', borderRadius: '3px', flexShrink: 0,
          background: isUser ? 'rgba(0,255,65,0.1)' : 'rgba(0,212,255,0.1)',
          border: `1px solid ${isUser ? 'rgba(0,255,65,0.3)' : 'rgba(0,212,255,0.3)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '8px',
          color: isUser ? '#00ff41' : '#00d4ff', fontWeight: 700,
        }}>
          {isUser ? 'YOU' : 'GH'}
        </div>

        {/* Bubble */}
        <div style={{
          background: isUser ? 'rgba(0,255,65,0.05)' : 'rgba(0,212,255,0.04)',
          border: `1px solid ${isUser ? 'rgba(0,255,65,0.15)' : 'rgba(0,212,255,0.12)'}`,
          borderRadius: isUser ? '8px 2px 8px 8px' : '2px 8px 8px 8px',
          padding: '10px 14px',
          color: '#c8d8c8', fontSize: '0.82rem', lineHeight: 1.7,
          fontFamily: 'JetBrains Mono, monospace',
          maxWidth: '100%', wordBreak: 'break-word' as const,
        }}>
          {formatContent(msg.content)}
        </div>
      </div>
      <div style={{ fontSize: '9px', color: '#2a4a2a', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px', paddingLeft: isUser ? 0 : '32px', paddingRight: isUser ? '32px' : 0 }}>
        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}

function buildWelcomeMessage(username?: string, rank?: string, labsCompleted?: number): Message {
  const handle = username ? username : null
  const greeting = handle ? `GHOST online, ${handle}.` : 'GHOST online.'
  const rankLine = rank && rank !== 'Ghost'
    ? `\nRank detected: **${rank}**. I'll calibrate to your level.`
    : rank === 'Ghost'
    ? `\nFresh operator. I'll build you up from first principles.`
    : ''
  const labsLine = labsCompleted && labsCompleted > 0
    ? `\n${labsCompleted} lab${labsCompleted > 1 ? 's' : ''} completed. I know where you've been — I'll point you to what's next.`
    : ''
  return {
    role: 'assistant',
    content: greeting + rankLine + labsLine + `\n\nAsk me anything — concepts, commands, attack mechanics, lab walkthroughs, tool syntax, or where to go next.\n\nWhat are you working on?`,
    timestamp: new Date(),
  }
}

const WELCOME_MESSAGE: Message = buildWelcomeMessage()


// Use RANK_LIST from lib/supabase as single source of truth
function getRankFromXP(xp: number): string {
  let rank = RANK_LIST[0].title as string
  for (const r of RANK_LIST) {
    if (xp >= r.minXp) rank = r.title
    else break
  }
  return rank
}

function getSkillGuidance(rank: string): string {
  if (rank === 'Ghost')   return 'New operator. Explain concepts from first principles, define all jargon, use analogies. Build their mental model step by step.'
  if (rank === 'Specter') return 'Has some labs done. Explain clearly but assume basic Linux/networking/security knowledge. Focus on technique depth.'
  if (rank === 'Phantom') return 'Solid foundations. Assume working knowledge. Focus on exploit mechanics, edge cases, evasion techniques, and tool internals.'
  if (rank === 'Wraith')  return 'Advanced operator. Adversary simulation focus — OPSEC, evasion, detection bypass, lateral movement. Minimal hand-holding.'
  return 'Legend tier. Peer-level technical exchange. Brief, dense, research-grade. Engage as a collaborator not a teacher.'
}

const HISTORY_KEY = 'ghost_chat_history'
const HISTORY_MAX = 20

function saveHistory(msgs: Message[]) {
  try {
    const toSave = msgs.slice(-HISTORY_MAX).map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp.toISOString(),
    }))
    localStorage.setItem(HISTORY_KEY, JSON.stringify(toSave))
  } catch (_) {}
}

function loadHistory(): Message[] | null {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    return parsed.map((m: { role: 'user' | 'assistant'; content: string; timestamp: string }) => ({
      role: m.role,
      content: m.content,
      timestamp: new Date(m.timestamp),
    }))
  } catch (_) {
    return null
  }
}

export default function GhostAgent() {
  const { profile } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [initialized, setInitialized] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userRank, setUserRank] = useState<{ rank: string; xp: number; labsCompleted: number; completedLabs: string[] }>({ rank: 'Ghost', xp: 0, labsCompleted: 0, completedLabs: [] })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()

  const placeLabel = pathname === '/' ? 'COMMAND CENTRE' : pathname.replace(/^\//, '').replace(/\//g, ' / ').toUpperCase()

  // Username from the signed-in operator profile
  const username = profile?.username || undefined

  function readProgress() {
    // The server profile is the source of truth for rank and XP.
    if (!profile) return null
    return { rank: getRankFromXP(profile.xp), xp: profile.xp, labsCompleted: profile.labs_completed, completedLabs: [] as string[] }
  }

  // Load history and user progress on mount
  useEffect(() => {
    const saved = loadHistory()
    const progress = readProgress()
    const xpRank = progress ? progress.rank : 'Ghost'
    const xp = progress ? progress.xp : 0
    const labsCompleted = progress ? progress.labsCompleted : 0
    const completedLabs = progress ? progress.completedLabs : []

    if (progress) setUserRank({ rank: xpRank, xp, labsCompleted, completedLabs })

    if (saved && saved.length > 0) {
      setMessages(saved)
    } else {
      // Personalise welcome message once we have user info
      setMessages([buildWelcomeMessage(username, xpRank, labsCompleted)])
    }
    setInitialized(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // When profile loads (async), update welcome message if it's still the first message
  useEffect(() => {
    if (!initialized || !username) return
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [buildWelcomeMessage(username, userRank.rank, userRank.labsCompleted)]
      }
      return prev
    })
  }, [username, initialized]) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for progress updates to keep rank in sync
  useEffect(() => {
    function onProgressUpdate() {
      const progress = readProgress()
      if (progress) setUserRank(progress)
    }
    window.addEventListener('ghostnet_progress_updated', onProgressUpdate)
    return () => window.removeEventListener('ghostnet_progress_updated', onProgressUpdate)
  }, [])

  // Rank and XP follow the server profile.
  useEffect(() => {
    if (profile) setUserRank({ rank: getRankFromXP(profile.xp), xp: profile.xp, labsCompleted: profile.labs_completed, completedLabs: [] })
  }, [profile])

  // Other parts of the app can open GHOST with a prepared question.
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true)
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt
      if (prompt) setInput(prompt)
    }
    window.addEventListener('ghost:open', onOpen)
    return () => window.removeEventListener('ghost:open', onOpen)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const clearHistory = () => {
    try { localStorage.removeItem(HISTORY_KEY) } catch (_) {}
    setMessages([buildWelcomeMessage(username, userRank.rank, userRank.labsCompleted)])
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    try { const k = 'gn_ghost_asks_' + new Date().toISOString().slice(0, 10); localStorage.setItem(k, String(Number(localStorage.getItem(k) || 0) + 1)) } catch {}
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const history = nextMessages.map(m => ({ role: m.role, content: m.content }))




      const res = await fetch('/api/ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.filter(m => !(m.role === 'assistant' && history.indexOf(m) === 0)),
          path: pathname,
          context: getGhostContext(pathname),
        }),
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      const reply = data.text || 'No response.'
      const finalMessages = [...nextMessages, { role: 'assistant' as const, content: reply, timestamp: new Date() }]
      setMessages(finalMessages)
      saveHistory(finalMessages)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const quickPrompts = pathname.startsWith('/modules/')
    ? [
        'Explain what this page covers and how to use it',
        'Walk me through the lab exercises',
        'What are the key techniques I need to know here?',
        'What should I study before this module?',
        'Give me the most important commands for this topic',
      ]
    : pathname.startsWith('/attack-path')
    ? [
        'What is the Attack Path Visualizer and how do I use it?',
        'Explain the MITRE ATT&CK framework',
        'Build me a realistic attack path for an external pentest',
        'What does each MITRE tactic represent?',
        'How do I write an attack narrative for a report?',
      ]
    : pathname.startsWith('/shodan')
    ? [
        'What is this tool and how do I use it?',
        'What are the most useful Shodan filters?',
        'Find exposed ICS/SCADA systems with Shodan',
        'How do I use Shodan for OSINT recon?',
        'Show me a query to find a specific vulnerability',
      ]
    : pathname.startsWith('/report-generator')
    ? [
        'How do I use the report generator?',
        'How do I write a good executive summary?',
        'What CVSS score should I assign to SQLi?',
        'Help me write a finding for an exposed admin panel',
        'What sections should a pentest report have?',
      ]
    : pathname.startsWith('/payload')
    ? [
        'Explain how this payload works',
        'What reverse shell should I use for PHP?',
        'How do I bypass XSS filters?',
        'Explain the difference between SSTI and SSRF',
        'What payloads work against Java deserialization?',
      ]
    : [
        'What is GHOSTNET and how do I navigate it?',
        'Where should a beginner start?',
        'What tools does GHOSTNET have?',
        'Give me a learning path for offensive security',
        'What is covered in the labs vs concept pages?',
      ]

  return (
    <>
      <style>{`
        .ghost-btn{position:fixed;bottom:24px;right:24px;z-index:9000}
        .ghost-panel{position:fixed;bottom:70px;right:24px;z-index:9001;width:420px;max-height:60vh}
        @media(max-width:768px){
          .ghost-btn{bottom:12px;right:12px}
          .ghost-panel{bottom:54px;right:8px;left:8px;width:auto;max-height:70vh}
        }
      `}</style>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="ghost-btn"
        style={{
          height: '32px', borderRadius: '6px',
          background: open ? 'rgba(0,212,255,0.12)' : 'rgba(0,255,65,0.08)',
          border: '1px solid ' + (open ? 'rgba(0,212,255,0.5)' : 'rgba(0,255,65,0.35)'),
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '4px 10px', gap: '5px',
          boxSizing: 'border-box' as const,
          transition: 'all 0.2s',
        }}
        title="GHOST Agent"
      >
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00ff41', boxShadow: '0 0 5px #00ff41', animation: 'pulse-green 2s infinite', flexShrink: 0 }} />
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', fontWeight: 700, color: open ? '#00d4ff' : '#00ff41', letterSpacing: '0.1em' }}>GHOST AGENT</div>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="ghost-panel" style={{
          background: '#080c0a',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: '10px',
          boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,212,255,0.1)',
          display: 'flex', flexDirection: 'column',
          fontFamily: 'JetBrains Mono, monospace',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(0,212,255,0.15)',
            background: 'rgba(0,212,255,0.04)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff41', boxShadow: '0 0 8px #00ff41', animation: 'pulse-green 2s infinite', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#00d4ff', letterSpacing: '0.15em' }}>GHOST AGENT</div>
                <div style={{
                  fontSize: '7px', fontWeight: 700, letterSpacing: '0.08em',
                  padding: '2px 6px', borderRadius: '3px',
                  background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.3)',
                  color: '#00ff41',
                }}>{userRank.rank.toUpperCase()}</div>
              </div>
              <div style={{ fontSize: '8px', color: '#2a5a6a', letterSpacing: '0.1em', marginTop: '1px' }}>
                {username ? username.toUpperCase() + ' · ' : ''}{placeLabel.slice(0, username ? 36 : 50)}
              </div>
            </div>
            <button
              onClick={clearHistory}
              title="Clear chat history"
              style={{ background: 'none', border: '1px solid rgba(255,65,54,0.2)', borderRadius: '3px', cursor: 'pointer', color: '#ff4136', fontSize: '7px', padding: '2px 5px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em', opacity: 0.7 }}
              onMouseEnter={e => { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.borderColor = 'rgba(255,65,54,0.5)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '0.7'; (e.target as HTMLElement).style.borderColor = 'rgba(255,65,54,0.2)' }}
            >CLEAR</button>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a5a6a', fontSize: '16px', padding: '0 4px', lineHeight: 1 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            {loading && (
              <div style={{ padding: '4px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '3px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#00d4ff', fontWeight: 700 }}>GH</div>
                <TypingIndicator />
              </div>
            )}
            {error && (
              <div style={{ margin: '8px 16px', padding: '8px 12px', background: 'rgba(255,65,54,0.06)', border: '1px solid rgba(255,65,54,0.2)', borderRadius: '4px', color: '#ff4136', fontSize: '0.72rem' }}>
                Error: {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
              {quickPrompts.map((p, i) => (
                <button key={i} onClick={() => setInput(p)} style={{
                  background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)',
                  borderRadius: '3px', padding: '4px 10px', cursor: 'pointer',
                  color: '#5a9aaa', fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,212,255,0.4)'; (e.target as HTMLElement).style.color = '#00d4ff' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,212,255,0.15)'; (e.target as HTMLElement).style.color = '#5a9aaa' }}
                >{p}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(0,212,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask GHOST anything..."
                rows={2}
                style={{
                  flex: 1, background: 'rgba(0,212,255,0.04)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  borderRadius: '5px', padding: '8px 10px',
                  color: '#c8d8c8', fontSize: '0.78rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  resize: 'none' as const, outline: 'none',
                  lineHeight: 1.5,
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.5)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0,212,255,0.2)' }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim() ? 'rgba(0,212,255,0.05)' : 'rgba(0,212,255,0.15)',
                  border: `1px solid ${loading || !input.trim() ? 'rgba(0,212,255,0.1)' : 'rgba(0,212,255,0.5)'}`,
                  borderRadius: '5px', padding: '8px 14px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  color: loading || !input.trim() ? '#2a5a6a' : '#00d4ff',
                  fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600, letterSpacing: '0.05em',
                  transition: 'all 0.15s', height: '56px',
                }}
              >
                {loading ? '...' : 'SEND'}
              </button>
            </div>
            <div style={{ fontSize: '8px', color: '#1a3a3a', marginTop: '6px', letterSpacing: '0.08em' }}>
              ENTER to send · SHIFT+ENTER for new line · powered by Groq llama-3.3-70b
            </div>
          </div>
        </div>
      )}
    </>
  )
}
