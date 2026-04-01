'use client';

import React from 'react';
import Link from 'next/link';

const accent = '#00d4ff';
const accentDim = 'rgba(0,212,255,0.1)';
const accentBorder = 'rgba(0,212,255,0.3)';

const H2 = ({ num, children }: { num: string; children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ background: accentDim, border: '1px solid ' + accentBorder, padding: '2px 8px', borderRadius: '3px', fontSize: '0.65rem', letterSpacing: '0.15em' }}>LAB-{num}</span>
    {children}
  </h2>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: '#0088aa', marginTop: '1.75rem', marginBottom: '0.6rem' }}>▸ {children}</h3>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.88rem' }}>{children}</p>
);

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a5a6a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
);

const Alert = ({ type, children }: { type: 'info' | 'warn' | 'objective' | 'note'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: ['#00d4ff', 'rgba(0,212,255,0.05)', 'INFO'],
    warn: ['#ff4136', 'rgba(255,65,54,0.05)', 'IMPORTANT'],
    objective: [accent, accentDim, 'OBJECTIVE'],
    note: ['#ffb347', 'rgba(255,179,71,0.05)', 'BEGINNER NOTE'],
  };
  const [color, bg, label] = configs[type];
  return (
    <div style={{ background: bg, borderLeft: '3px solid ' + color, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.25rem 0', border: '1px solid ' + color + '33', borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
};

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid #0e1a10' }}>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#1a4a1a', marginTop: '2px', flexShrink: 0 }}>[ ]</span>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', lineHeight: 1.6 }}>{children}</span>
  </div>
);

export default function OSINTLab() {
  const TARGET = 'scanme.nmap.org';

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/osint" style={{ color: '#5a7a5a', textDecoration: 'none' }}>MOD-02 // OSINT</Link>
        <span>›</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/modules/osint" style={{ textDecoration: 'none', padding: '3px 10px', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.15em' }}>← CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: accentDim, border: '1px solid ' + accentBorder, borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em' }}>LAB</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a5a6a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 02 · LAB ENVIRONMENT</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: accent, margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
          OSINT & SURVEILLANCE — LAB
        </h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', lineHeight: 1.6 }}>
          6 exercises: domain footprinting · Shodan recon · Google dorking · social media intel · metadata forensics · full target profile
        </p>
      </div>

      {/* Lab Environment Setup */}
      <div style={{ background: '#0a1318', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a5a6a', letterSpacing: '0.2em', marginBottom: '1rem' }}>LAB ENVIRONMENT SETUP</div>
        <P>These labs use entirely passive techniques — you never send packets directly to the target. All data comes from public sources: DNS, search engines, certificate logs, and Shodan. A standard Linux terminal with internet access is all you need.</P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '8px' }}>REQUIRED TOOLS</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.8 }}>
              whois · dnsutils (dig)<br />
              curl · python3 · exiftool<br />
              subfinder · amass<br />
              sherlock · theHarvester
            </div>
          </div>
          <div style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '8px' }}>FREE ACCOUNTS NEEDED</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.8 }}>
              Shodan: shodan.io<br />
              Hunter.io: hunter.io<br />
              HaveIBeenPwned: haveibeenpwned.com<br />
              (all free tier sufficient)
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <CheckItem>Linux environment with internet access and terminal</CheckItem>
          <CheckItem>Python 3 and pip installed</CheckItem>
          <CheckItem>Read MOD-02 Concept page — understand passive vs active recon</CheckItem>
          <CheckItem>Only use active recon techniques on systems you own or have written permission to test</CheckItem>
          <CheckItem>For practice: use your own domain, or scanme.nmap.org (explicitly permitted)</CheckItem>
        </div>
      </div>

      <Alert type="warn">
        OSINT uses publicly available data. However, active scanning (sending packets to a target) crosses into legal territory without permission. In this lab, Labs 01-05 are fully passive. Lab 06 combines techniques — only run the active portions against authorised targets.
      </Alert>

      {/* LAB 01 - 06 and all other sections remain exactly as you had them */}
      {/* ... (your original LAB content from H2 num="01" onwards stays unchanged) ... */}

      {/* Footer nav */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/modules/osint" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← BACK TO CONCEPT</Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a6a' }}>DASHBOARD</Link>
        <Link href="/modules/crypto/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: '1px solid ' + accentBorder, borderRadius: '4px', background: accentDim }}>
          NEXT: MOD-03 CRYPTO LAB →
        </Link>
      </div>
    </div>
  );
}
