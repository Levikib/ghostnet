'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#ff6ec7'
const moduleId = 'social-engineering'
const moduleName = 'Social Engineering'
const moduleNum = '10'
const xpTotal = 120

const steps: LabStep[] = [
  {
    id: 'se-01',
    title: 'Phishing Email Anatomy',
    objective: 'A phishing email pretends to come from payroll@company.com but was actually sent from a different server. What email header reveals the true sending server?',
    hint: 'The header shows which server actually transmitted the message. It starts with "Received:"',
    answers: ['received', 'received-from', 'x-originating-ip', 'return-path', 'received from'],
    xp: 20,
    explanation: 'The "Received:" headers trace the email\'s path. The bottom-most Received header shows the originating server. "Return-Path:" shows where bounces go — often revealing the real domain. Compare these against the From: address to spot spoofing.'
  },
  {
    id: 'se-02',
    title: 'SPF Record Check',
    objective: 'SPF records define which servers can send email for a domain. What DNS record type stores SPF policy?',
    hint: 'SPF is stored as a TXT record. Check with: dig TXT domain.com',
    answers: ['txt', 'TXT', 'dns txt', 'spf txt record'],
    xp: 20,
    explanation: 'SPF is stored in DNS TXT records: "v=spf1 include:_spf.google.com ~all". The ~all (softfail) is weaker than -all (hardfail). Check SPF with: dig TXT domain.com | grep spf. Domains without SPF can be freely spoofed in many mail configurations.'
  },
  {
    id: 'se-03',
    title: 'Pretexting Scenario',
    objective: 'In social engineering, what term describes the fabricated scenario an attacker uses to build trust and extract information?',
    hint: 'It\'s the false backstory or context the attacker creates. The word starts with "pretext".',
    answers: ['pretext', 'pretexting', 'scenario', 'social pretext'],
    flag: 'FLAG{se_concepts_mastered}',
    xp: 25,
    explanation: 'A pretext is the fake identity and story. Examples: "I\'m from IT support and need your password to fix your account" or "I\'m the CEO\'s assistant, he needs this wire transfer done urgently." Effective pretexts exploit authority, urgency, and familiarity.'
  },
  {
    id: 'se-04',
    title: 'GoPhish Framework',
    objective: 'GoPhish is an open-source phishing framework. What default port does the GoPhish admin panel run on?',
    hint: 'The admin panel uses HTTPS on a non-standard high port. Check GoPhish documentation.',
    answers: ['3333', ':3333', 'port 3333', 'https://localhost:3333'],
    xp: 25,
    explanation: 'GoPhish admin panel runs on https://localhost:3333 by default. From there you create: Sending Profiles (SMTP config), Email Templates (with tracking pixels), Landing Pages (credential capture), and Campaigns that combine all three and track click/submit rates.'
  },
  {
    id: 'se-05',
    title: 'Vishing Recognition',
    objective: 'Voice phishing (vishing) calls impersonate trusted entities. What caller ID spoofing technique makes the attacker\'s number appear as a legitimate number?',
    hint: 'The technique spoofs the caller ID. The technical term involves "CLI spoofing".',
    answers: ['cli spoofing', 'caller id spoofing', 'spoofing', 'asterisk', 'voip spoofing', 'caller id'],
    flag: 'FLAG{vishing_detected}',
    xp: 30,
    explanation: 'CLI (Calling Line Identification) spoofing uses VoIP services or Asterisk PBX to set an arbitrary caller ID. Tools: SpoofCard, Asterisk with CALLERID manipulation. Defense: call back using a number from the official website, never trust inbound caller ID alone.'
  }
]

export default function SocialEngineeringLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_social-engineering-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a2a5a' }}>
        <Link href="/" style={{ color: '#7a2a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/social-engineering" style={{ color: '#7a2a5a', textDecoration: 'none' }}>SOCIAL ENGINEERING</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/social-engineering" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #3a0a2a', borderRadius: '3px', color: '#7a2a5a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(255,110,199,0.1)', border: '1px solid rgba(255,110,199,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(255,110,199,0.04)', border: '1px solid rgba(255,110,199,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#3a0a2a', border: p.active ? '2px solid ' + accent : '1px solid #3a0a2a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#5a2a4a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#3a0a2a', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a4a6a' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP AVAILABLE
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE — LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* PHASE 1 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,110,199,0.1)', border: '1px solid rgba(255,110,199,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a2a4a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Social Engineering Lab</h1>
          </div>
        </div>

        <p style={{ color: '#8a6a7a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Email header analysis, SPF records, pretexting techniques, GoPhish setup, and vishing tactics.
          Type real commands, earn XP, and capture flags. Complete all 5 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(255,110,199,0.03)', border: '1px solid rgba(255,110,199,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#3a0a2a', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Phishing emails', 'Email header analysis', 'SPF/DKIM/DMARC', 'Pretexting', 'GoPhish framework', 'Spear phishing', 'Vishing tactics', 'Physical SE'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#8a4a6a', background: 'rgba(255,110,199,0.06)', border: '1px solid rgba(255,110,199,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="social-engineering-lab"
          moduleId={moduleId}
          title="Social Engineering Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(255,110,199,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(255,110,199,0.4)' : '#3a0a2a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a2a4a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#8a4a6a' : '#5a2a4a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#5a2a4a' }}>Full Social Engineering Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(255,110,199,0.04)' : '#080208', border: '1px solid ' + (guidedDone ? 'rgba(255,110,199,0.25)' : '#1a0515'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#8a4a6a' : '#3a0a2a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#5a2a4a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#8a4a6a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Social Engineering
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a2a4a', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['GoPhish campaigns', 'Email header analysis', 'SPF/DKIM checking', 'SET framework', 'Phishing page creation', 'Domain reputation'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#3a0a2a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#8a4a6a' : '#3a0a2a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(255,110,199,0.6)' : '#3a0a2a'), borderRadius: '6px', background: guidedDone ? 'rgba(255,110,199,0.12)' : 'transparent', color: guidedDone ? accent : '#3a0a2a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(255,110,199,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a0a2a' }}>Complete all 5 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#080208' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0a030a', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a2a4a' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any social engineering technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #3a0a2a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a2a4a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — SE TOOLS & CHECKS
        </button>
        {showKeywords && (
          <div style={{ background: '#080208', border: '1px solid #1a0515', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['dig TXT domain.com | grep spf', 'Check SPF record'],
                ['dig TXT _dmarc.domain.com', 'Check DMARC policy'],
                ['dig TXT default._domainkey.domain.com', 'Check DKIM record'],
                ['gophish', 'Start GoPhish phishing platform (port 3333)'],
                ['setoolkit', 'Social Engineering Toolkit'],
                ['swaks --to target@example.com --from spoof@example.com', 'Test email spoofing'],
                ['mxtoolbox.com', 'Online email header and blacklist checker'],
                ['emailrep.io', 'Email reputation lookup API'],
                ['hunter.io', 'Find email patterns for a domain'],
                ['holehe email@example.com', 'Check if email registered on sites'],
                ['evilginx2', 'Advanced phishing framework with session hijack'],
                ['beef-xss', 'Browser exploitation via XSS hook'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#060106', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#8a4a6a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1a0515', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/social-engineering" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a2a4a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/red-team/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a2a4a' }}>MOD-11 RED TEAM LAB &#8594;</Link>
      </div>
    </div>
  )
}
