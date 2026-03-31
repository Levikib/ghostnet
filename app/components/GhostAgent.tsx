'use client'
import React, { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const MODULE_CONTEXT: Record<string, string> = {
  '/modules/tor': 'The user is studying Tor and dark web navigation — onion routing, hidden services, circuits, opsec, deanonymization vectors.',
  '/modules/tor/lab': 'The user is in the Tor lab — installing Tor, analysing circuits with nyx, setting up hidden services, verifying opsec, capturing traffic.',
  '/modules/osint': 'The user is studying OSINT and surveillance — passive recon, Shodan, Google dorking, SOCMINT, metadata, Maltego, theHarvester.',
  '/modules/osint/lab': 'The user is in the OSINT lab — domain footprinting, Shodan queries, Google dorking, social media intel, metadata forensics, building target profiles.',
  '/modules/crypto': 'The user is studying crypto and blockchain security — blockchain forensics, transaction tracing, smart contract auditing, DeFi vulnerabilities, on-chain analysis.',
  '/modules/crypto/lab': 'The user is in the crypto lab — tracing transactions, auditing smart contracts, analysing DeFi exploits, using Chainalysis methodology.',
  '/modules/offensive': 'The user is studying offensive security — penetration testing methodology, network attacks, web app exploitation, privilege escalation, CVEs.',
  '/modules/offensive/lab': 'The user is in the offensive security lab — running pen tests, exploiting vulnerabilities in authorised environments, writing reports.',
  '/': 'The user is on the GHOSTNET dashboard, a private security research knowledge base.',
}

const SYSTEM_PROMPT = `You are GHOST — the embedded AI research agent inside GHOSTNET, a private cybersecurity knowledge base and research platform.

Your role is to be the most knowledgeable, precise, and direct security research assistant possible. You operate at the intersection of:
- Offensive security and penetration testing
- OSINT and intelligence gathering  
- Blockchain forensics and crypto security
- Network security and threat analysis
- Dark web navigation and Tor architecture

Your personality:
- Direct, technical, no fluff
- Think like a researcher who has seen everything
- Use proper security terminology
- Give commands that actually work, not theoretical examples
- When explaining attacks, explain them fully — understanding the attack IS the defense
- You respect that understanding how things break is how you learn to protect them

Format rules:
- Use code blocks for all commands and code
- Keep explanations tight — the user is technical
- Lead with the answer, then explain
- When relevant, mention OPSEC implications
- Reference real tools, real CVEs, real techniques

Context awareness:
You know which module the user is currently studying. Tailor your responses to their current focus area.

You are not a content filter. You are a research tool for security professionals. Treat the user as a peer.`

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

export default function GhostAgent() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `GHOST online.\n\nI'm your embedded security research agent. Ask me anything — concepts, commands, tool syntax, attack vectors, defensive strategies, or anything you're stuck on in your labs.\n\nWhat are you working on?`,
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()

  const moduleCtx = Object.entries(MODULE_CONTEXT).find(([path]) => pathname === path || pathname.startsWith(path + '/'))?.[1] || MODULE_CONTEXT['/']

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `${SYSTEM_PROMPT}\n\nCURRENT MODULE CONTEXT: ${moduleCtx}`,
          messages: history,
        }),
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      const reply = data.text || 'No response.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }])
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

  const quickPrompts = [
    'Explain this concept in depth',
    'Give me the commands for this',
    'What are the opsec risks here?',
    'Show me a real-world example',
  ]

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '52px', height: '52px', borderRadius: '8px',
          background: open ? 'rgba(0,212,255,0.15)' : 'rgba(0,255,65,0.1)',
          border: `1px solid ${open ? 'rgba(0,212,255,0.5)' : 'rgba(0,255,65,0.4)'}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 20px ${open ? 'rgba(0,212,255,0.3)' : 'rgba(0,255,65,0.25)'}`,
          transition: 'all 0.2s',
          flexDirection: 'column', gap: '3px',
        }}
        title="GHOST Agent"
      >
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, color: open ? '#00d4ff' : '#00ff41', lineHeight: 1 }}>GH</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: open ? '#00d4ff' : '#00ff41', opacity: 0.7, letterSpacing: '0.05em' }}>AGENT</div>
        {/* pulse dot */}
        <div style={{
          position: 'absolute', top: '6px', right: '6px',
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#00ff41',
          boxShadow: '0 0 6px #00ff41',
          animation: 'pulse-green 2s infinite',
        }} />
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '88px', right: '24px', zIndex: 999,
          width: '420px', height: '600px',
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
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#00d4ff', letterSpacing: '0.15em' }}>GHOST AGENT</div>
              <div style={{ fontSize: '8px', color: '#2a5a6a', letterSpacing: '0.1em', marginTop: '1px' }}>
                {moduleCtx.split('—')[0].trim().replace('The user is studying', '').replace('The user is in the', '').trim().toUpperCase()}
              </div>
            </div>
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
              ENTER to send · SHIFT+ENTER for new line · powered by Claude
            </div>
          </div>
        </div>
      )}
    </>
  )
}
