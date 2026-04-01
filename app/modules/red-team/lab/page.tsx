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
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', marginBottom: '1rem', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href='/' style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link> › <span style={{ color: '#00ff41' }}>LAB</span>
      </div>
      <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: '#00ff41', marginBottom: '1.5rem' }}>HANDS-ON LAB</h1>
      <div style={{ background: '#050805', border: '1px solid #1a3a1a', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem' }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', lineHeight: 1.8 }}>Complete concept module first. Use TryHackMe, HackTheBox, or your own isolated lab to practice. Document everything — writeups are portfolio gold.</p>
      </div>
      <Pre label='// PRACTICE EXERCISES'>{
'# 01 — Set up isolated lab environment (VirtualBox + Kali + targets)
# 02 — Complete TryHackMe room matching this module topic
# 03 — Document your methodology step by step
# 04 — Find and solve a CTF challenge in this category
# 05 — Analyse a real-world incident report using these techniques
# 06 — Build your own vulnerable environment — practice attacking then defending'
      }</Pre>
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1a3a1a', display: 'flex', justifyContent: 'space-between' }}>
        <Link href='/' style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← DASHBOARD</Link>
        <Link href='/ctf' style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00ff41', padding: '8px 20px', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '4px' }}>CTF TOOLKIT →</Link>
      </div>
    </div>
  )
}
