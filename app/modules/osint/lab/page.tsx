'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#00d4ff'
const moduleId = 'osint'
const moduleName = 'OSINT Reconnaissance'
const moduleNum = '02'
const xpTotal = 130

const steps: LabStep[] = [
  {
    id: 'osint-01',
    title: 'DNS Enumeration',
    objective: 'Start reconnaissance by enumerating DNS records for a target domain. What tool performs DNS enumeration and zone transfers?',
    hint: 'The tool is called "dnsenum" or you can use "dig". Try: dnsenum example.com',
    answers: ['dnsenum', 'dig', 'nslookup', 'host', 'fierce'],
    xp: 20,
    explanation: 'DNS enumeration reveals subdomains, mail servers (MX), name servers (NS), and IP ranges. Zone transfers (AXFR) can dump the entire DNS database if misconfigured — a goldmine of targets.'
  },
  {
    id: 'osint-02',
    title: 'Subdomain Discovery',
    objective: 'Find subdomains of a target using passive reconnaissance. What popular subdomain bruteforce/enumeration tool uses a wordlist?',
    hint: 'Starts with "sub" — a Python tool for subdomain enumeration.',
    answers: ['sublist3r', 'subfinder', 'amass', 'gobuster dns', 'gobuster'],
    xp: 25,
    explanation: 'Sublist3r, Subfinder, and Amass use OSINT sources (crt.sh, VirusTotal, Shodan) plus brute force to find subdomains. Subdomains often reveal dev/staging environments with weaker security than production.'
  },
  {
    id: 'osint-03',
    title: 'Shodan Dork',
    objective: 'Shodan indexes internet-connected devices. What Shodan filter would you use to find Apache servers in a specific country (e.g., Germany)?',
    hint: 'Shodan filters use key:value syntax. Product filter is "product:" and country is "country:"',
    answers: ['product:apache country:de', 'apache country:de', 'product:"apache" country:de'],
    flag: 'FLAG{shodan_recon_complete}',
    xp: 30,
    explanation: 'Shodan dorks combine filters to find exposed services. product:apache country:DE org:"Deutsche Telekom" gives you Apache servers in Germany on a specific ISP. Add "vuln:CVE-2021-41773" to find exploitable targets.'
  },
  {
    id: 'osint-04',
    title: 'Email OSINT',
    objective: 'Harvesting email addresses for phishing or credential stuffing. What tool collects emails from public sources for a target domain?',
    hint: 'The "Harvester" — its full name is "theHarvester".',
    answers: ['theharvester', 'theHarvester', 'hunter.io', 'holehe'],
    xp: 25,
    explanation: 'theHarvester queries search engines, LinkedIn, Hunter.io, and other sources to enumerate email addresses and employee names. These feed directly into spear phishing campaigns or password spray attacks.'
  },
  {
    id: 'osint-05',
    title: 'Metadata Extraction',
    objective: 'Documents and images contain hidden metadata (EXIF) that reveals author names, GPS coordinates, and software versions. What tool extracts metadata from files?',
    hint: 'A Perl-based tool starting with "exif" — very widely used.',
    answers: ['exiftool', 'exif', 'mat2', 'metagoofil'],
    flag: 'FLAG{metadata_extracted}',
    xp: 30,
    explanation: 'ExifTool extracts metadata from PDFs, images, Office documents, and more. A Word doc might reveal the author\'s real name, company name, local file path, and creation date — all useful for targeted social engineering.'
  }
]

export default function OsintLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_osint-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#006a7a' }}>
        <Link href="/" style={{ color: '#006a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/osint" style={{ color: '#006a7a', textDecoration: 'none' }}>OSINT</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/osint" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #003a4a', borderRadius: '3px', color: '#006a7a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#003a4a', border: p.active ? '2px solid ' + accent : '1px solid #003a4a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#005a6a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#003a4a', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4a8a9a' }}>
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
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#005a6a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>OSINT Reconnaissance Lab</h1>
          </div>
        </div>

        <p style={{ color: '#5a8a9a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          DNS enumeration, subdomain discovery, Shodan dorking, email harvesting, and metadata extraction.
          Type real commands, earn XP, and capture flags. Complete all 5 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#003a4a', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['DNS enumeration', 'Zone transfers', 'Subdomain brute force', 'Shodan dorking', 'Email harvesting', 'EXIF metadata', 'Passive recon', 'OSINT frameworks'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#3a7a8a', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="osint-lab"
          moduleId={moduleId}
          title="OSINT Reconnaissance Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(0,212,255,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(0,212,255,0.4)' : '#003a4a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#005a6a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#4a8a9a' : '#005a6a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#005a6a' }}>Full OSINT Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(0,212,255,0.04)' : '#020608', border: '1px solid ' + (guidedDone ? 'rgba(0,212,255,0.25)' : '#001a2a'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#3a7a8a' : '#003a4a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#005a6a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a8a9a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for OSINT Reconnaissance
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#3a7a8a', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['dnsenum / dig commands', 'Sublist3r enumeration', 'Shodan CLI queries', 'theHarvester email recon', 'ExifTool metadata', 'Maltego-style pivoting'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#003a4a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#4a8a9a' : '#003a4a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(0,212,255,0.6)' : '#003a4a'), borderRadius: '6px', background: guidedDone ? 'rgba(0,212,255,0.12)' : 'transparent', color: guidedDone ? accent : '#003a4a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(0,212,255,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#003a4a' }}>Complete all 5 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#020608' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#020a0e', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a8a' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any OSINT technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #003a4a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a8a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — OSINT COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#020608', border: '1px solid #001a2a', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['dnsenum example.com', 'DNS enumeration + zone transfer attempt'],
                ['dig axfr @ns1.example.com example.com', 'Manual zone transfer attempt'],
                ['sublist3r -d example.com', 'Passive subdomain enumeration'],
                ['subfinder -d example.com', 'Fast subdomain discovery'],
                ['theHarvester -d example.com -b all', 'Harvest emails and hosts'],
                ['shodan search product:apache country:DE', 'Shodan CLI search'],
                ['exiftool document.pdf', 'Extract metadata from file'],
                ['amass enum -d example.com', 'Comprehensive subdomain enum'],
                ['whois example.com', 'WHOIS domain registration lookup'],
                ['curl -s https://crt.sh/?q=%.example.com&output=json', 'Certificate transparency search'],
                ['maltego', 'GUI OSINT relationship mapping'],
                ['holehe email@example.com', 'Check email against 120+ sites'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#010408', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#4a8a9a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #001a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/osint" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a7a8a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/crypto/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a7a8a' }}>MOD-03 CRYPTO LAB &#8594;</Link>
      </div>
    </div>
  )
}
