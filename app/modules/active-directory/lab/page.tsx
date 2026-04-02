'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#ff4136'

const steps: LabStep[] = [
  {
    id: 'ad-01',
    title: 'Domain Enumeration',
    objective: 'Enumerate Active Directory users without credentials using anonymous LDAP. What tool performs AD enumeration from Linux?',
    hint: 'Starts with "enum4linux" or "ldapsearch". Both work for unauthenticated enumeration.',
    answers: ['enum4linux', 'ldapsearch', 'enum4linux-ng', 'bloodhound', 'crackmapexec'],
    xp: 20,
    explanation: 'enum4linux -a target_ip dumps users, groups, shares, and password policy via SMB/LDAP. CrackMapExec (cme smb target) does the same with more modern output. These work against misconfigured DCs that allow anonymous binds.'
  },
  {
    id: 'ad-02',
    title: 'Kerberoasting Attack',
    objective: 'Kerberoasting extracts service tickets for offline cracking. What Impacket tool requests service tickets for all SPNs?',
    hint: 'The script is part of Impacket and its name includes "GetUserSPNs".',
    answers: ['getuserspns', 'GetUserSPNs.py', 'impacket-GetUserSPNs', 'GetUserSPNs'],
    xp: 30,
    explanation: 'GetUserSPNs.py domain/user:password -request outputs TGS tickets in hashcat format (-m 13100 for Kerberos 5 TGS-REP). Any domain user can request these tickets — no elevated privileges needed. Weak service account passwords crack in seconds.'
  },
  {
    id: 'ad-03',
    title: 'Pass-the-Hash',
    objective: 'Pass-the-Hash lets you authenticate using NTLM hashes without knowing the plaintext. What tool performs PtH attacks against Windows targets?',
    hint: 'CrackMapExec, Impacket psexec, or mimikatz pth. CrackMapExec is the most versatile.',
    answers: ['crackmapexec', 'cme', 'psexec', 'mimikatz', 'impacket-psexec', 'wmiexec'],
    flag: 'FLAG{pth_attack_ready}',
    xp: 30,
    explanation: 'crackmapexec smb target -u admin -H NTLM_HASH tests PtH authentication. If local admin rights exist: crackmapexec smb target -u admin -H hash -x "whoami". NTLM hashes are dumped with mimikatz sekurlsa::logonpasswords or Impacket secretsdump.'
  },
  {
    id: 'ad-04',
    title: 'BloodHound Attack Paths',
    objective: 'BloodHound maps AD attack paths graphically. What Impacket/SharpHound collector gathers data for BloodHound from Linux?',
    hint: 'The Python-based collector for BloodHound is called "bloodhound-python".',
    answers: ['bloodhound-python', 'bloodhound', 'sharphound', 'python bloodhound'],
    xp: 25,
    explanation: 'bloodhound-python -u user -p pass -d domain.local -dc dc.domain.local -c All collects all AD objects. Import the JSON files into BloodHound, then query "Shortest path to Domain Admins" to visualize attack chains through group memberships and ACLs.'
  },
  {
    id: 'ad-05',
    title: 'DCSync Attack',
    objective: 'DCSync replicates password hashes directly from a Domain Controller. What Impacket script performs a DCSync attack?',
    hint: 'The script dumps secrets from a DC. It\'s called "secretsdump".',
    answers: ['secretsdump', 'secretsdump.py', 'impacket-secretsdump'],
    flag: 'FLAG{dcsync_complete}',
    xp: 40,
    explanation: 'impacket-secretsdump domain/user:password@dc_ip -just-dc-ntlm replicates the NTDS.dit hashes using the MS-DRSR replication protocol. Requires DS-Replication-Get-Changes and DS-Replication-Get-Changes-All rights — typically held by Domain Admins or delegated accounts.'
  }
]

export default function ActiveDirectoryLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a1a1a' }}>
        <Link href="/" style={{ color: '#7a1a1a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/active-directory" style={{ color: '#7a1a1a', textDecoration: 'none' }}>ACTIVE DIRECTORY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#7a1a1a', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-05 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>Active Directory Lab</h1>
        <p style={{ color: '#8a6a6a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          Domain enumeration, Kerberoasting, Pass-the-Hash, BloodHound mapping, and DCSync attacks.
          Complete all 5 steps to earn 145 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #ff413622', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="active-directory-lab"
        moduleId="active-directory"
        title="Active Directory Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
