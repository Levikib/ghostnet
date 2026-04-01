'use client'
import React from 'react'
import Link from 'next/link'
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a3a1a', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#00ff41', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
export default function Lab() {
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const module = path.split('/')[2] || 'module'
  const title = module.replace(/-/g, ' ').toUpperCase()
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href={`/modules/${module}`} style={{ color: '#5a7a5a', textDecoration: 'none' }}>{title}</Link>
        <span>›</span>
        <span style={{ color: '#00ff41' }}>LAB</span>
      </div>
      <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: '#00ff41', margin: '0.5rem 0 1.5rem' }}>{title} — LAB</h1>
      <div style={{ background: '#050805', border: '1px solid #1a3a1a', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '1rem' }}>HANDS-ON PRACTICE ENVIRONMENT</div>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', lineHeight: 1.8 }}>
          Complete the concept module first. Then use TryHackMe, HackTheBox, or your own lab environment to practice these techniques hands-on. Document everything you do — writeups are portfolio gold.
        </p>
      </div>
      <Pre label="// LAB EXERCISES — WORK THROUGH THESE IN ORDER">{`# LAB 01 — Environment Setup
# Set up an isolated lab environment:
# VirtualBox/VMware + Kali Linux + target VMs
# Network: Host-only (isolated from real network)
# Recommended: VulnHub machines for this module topic

# LAB 02 — Guided Walkthrough
# Pick a beginner room on TryHackMe related to this module
# Document your methodology step by step
# Note what worked, what failed, and why

# LAB 03 — CTF Challenge
# Find a CTF challenge from ctftime.org
# Category matching this module
# Write a detailed writeup explaining your solution

# LAB 04 — Build Your Own
# Create a vulnerable environment yourself
# Misconfigure deliberately to practice exploitation
# Then practice defending/detecting the attack

# LAB 05 — Real-World Case Study
# Find a public post-mortem or incident report
# Map the attack to techniques from this module
# Write a technical analysis of what happened`}</Pre>

      <div style={{ background: '#050805', border: '1px solid #1a3a1a', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '1rem' }}>SELF ASSESSMENT — ANSWER THESE BEFORE MOVING ON</div>
        {['Can I explain every concept in this module to a non-technical person?',
          'Have I actually run the commands, not just read them?',
          'Can I detect this attack from the defender side?',
          'Have I documented my lab work somewhere?',
          'Do I understand why each technique works at the protocol level?'
        ].map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #0a1a0a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
            <span style={{ color: '#00ff41', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
            <span style={{ color: '#5a7a5a' }}>{q}</span>
          </div>
        ))}
      </div>

      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1a3a1a', display: 'flex', justifyContent: 'space-between' }}>
        <Link href={`/modules/${module}`} style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← CONCEPT</Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00ff41', padding: '8px 20px', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '4px', background: 'rgba(0,255,65,0.05)' }}>DASHBOARD →</Link>
      </div>
    </div>
  )
}
