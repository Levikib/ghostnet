'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#ff6ec7'

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
    hint: 'The technique spoofs the caller ID. The technical term involves "CLI spoofing" or the tool used: "SpoofCard" or "asterisk".',
    answers: ['cli spoofing', 'caller id spoofing', 'spoofing', 'asterisk', 'voip spoofing', 'caller id'],
    flag: 'FLAG{vishing_detected}',
    xp: 30,
    explanation: 'CLI (Calling Line Identification) spoofing uses VoIP services or Asterisk PBX to set an arbitrary caller ID. Tools: SpoofCard, Asterisk with CALLERID manipulation. Defense: call back using a number from the official website, never trust inbound caller ID alone.'
  }
]

export default function SocialEngineeringLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a2a5a' }}>
        <Link href="/" style={{ color: '#7a2a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/social-engineering" style={{ color: '#7a2a5a', textDecoration: 'none' }}>SOCIAL ENGINEERING</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#7a2a5a', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-10 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>Social Engineering Lab</h1>
        <p style={{ color: '#8a6a7a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          Email header analysis, SPF records, pretexting techniques, GoPhish setup, and vishing tactics.
          Complete all 5 steps to earn 120 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #ff6ec722', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="social-engineering-lab"
        moduleId="social-engineering"
        title="Social Engineering Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
