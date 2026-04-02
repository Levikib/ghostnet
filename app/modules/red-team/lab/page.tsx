'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#ff3333'

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
    objective: 'Red team OPSEC requires C2 traffic to look like legitimate traffic. What Cobalt Strike feature profiles make beacon traffic mimic real applications?',
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
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a1a1a' }}>
        <Link href="/" style={{ color: '#7a1a1a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/red-team" style={{ color: '#7a1a1a', textDecoration: 'none' }}>RED TEAM OPS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#7a1a1a', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-11 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>Red Team Operations Lab</h1>
        <p style={{ color: '#8a6a6a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          C2 frameworks, living-off-the-land techniques, OPSEC, lateral movement, and persistence.
          Complete all 5 steps to earn 135 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #ff333322', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="red-team-lab"
        moduleId="red-team"
        title="Red Team Operations Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
