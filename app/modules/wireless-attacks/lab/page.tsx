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
      <div style={{ fontFamily: 'JetBrains Mono, monospace', marginBottom: '1.5rem', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        {' '}&rsaquo;{' '}
        <span style={{ color: '#00ff41' }}>LAB</span>
      </div>

      <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: '#00ff41', marginBottom: '1.5rem' }}>
        HANDS-ON LAB
      </h1>

      <div style={{ background: '#050805', border: '1px solid #1a3a1a', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '1rem' }}>
          HANDS-ON PRACTICE ENVIRONMENT
        </div>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', lineHeight: 1.8, margin: 0 }}>
          Complete the concept module first. Then use TryHackMe, HackTheBox, or your own isolated lab
          to practice. Document everything you do — writeups are portfolio gold.
        </p>
      </div>

      <Pre label="// LAB EXERCISES — WORK THROUGH THESE IN ORDER">
        {[
          '# 01 - Set up isolated lab (VirtualBox + Kali + target VMs)',
          '# 02 - Complete a TryHackMe room matching this module topic',
          '# 03 - Document your methodology step by step',
          '# 04 - Find and solve a CTF challenge in this category',
          '# 05 - Analyse a real-world incident report using these techniques',
          '# 06 - Build your own vulnerable environment, attack it, then defend it',
        ].join('\n')}
      </Pre>

      <div style={{ background: '#050805', border: '1px solid #1a3a1a', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '1rem' }}>
          SELF ASSESSMENT
        </div>
        {[
          'Can I explain every concept in this module to a non-technical person?',
          'Have I actually run the commands, not just read them?',
          'Can I detect this attack from the defender side?',
          'Have I documented my lab work somewhere?',
          'Do I understand why each technique works at the protocol level?',
        ].map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #0a1a0a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
            <span style={{ color: '#00ff41', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
            <span style={{ color: '#5a7a5a' }}>{q}</span>
          </div>
        ))}
      </div>

      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1a3a1a', display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>
          &larr; DASHBOARD
        </Link>
        <Link href="/ctf" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00ff41', padding: '8px 20px', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '4px', background: 'rgba(0,255,65,0.05)' }}>
          CTF TOOLKIT &rarr;
        </Link>
      </div>
    </div>
  )
}
