'use client'
import React, { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const PAGE_CONTEXT: Record<string, string> = {

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  '/': `LOCATION: GHOSTNET Dashboard (home page).
GHOSTNET is a private cybersecurity research and training platform built by ShanGhost Admin. It contains 13 security modules, 6+ interactive tools, and AI-powered research utilities.

PLATFORM OVERVIEW — 13 modules in learning order:
MOD-01 Tor & Dark Web (#00ff41) — Tor architecture, onion routing, hidden services, opsec, deanonymisation attacks. Lab: install Tor, circuit analysis with nyx, deploy .onion hidden service, bridge configuration.
MOD-02 OSINT & Surveillance (#00d4ff) — passive recon, Shodan, Google dorking, SOCMINT, metadata forensics, theHarvester, Maltego, subfinder. Lab: domain footprinting, Shodan recon, Google dorks, social media intel, exiftool metadata, full target profile script.
MOD-03 Crypto & Blockchain (#ffb347) — blockchain forensics, Bitcoin/Ethereum transaction tracing, smart contract auditing, DeFi vulnerabilities (reentrancy, flash loans), Slither static analysis, on-chain attribution. Lab: trace BTC/ETH wallets, Foundry smart contract reentrancy exploit, Euler Finance DeFi trace, Slither audit, mini audit report.
MOD-04 Offensive Security (#bf5fff) — pentest methodology (PTES/OWASP), Nmap, Gobuster, Nikto, Metasploit, SQLi, hashcat, hydra, privilege escalation (Linux/Windows), report writing. Lab: Metasploitable 2 recon, DVWA web enum, manual SQLi, password attacks, Metasploit exploit chain (vsftpd CVE-2011-2523 + Samba CVE-2007-2447), privesc + report.
MOD-05 Active Directory (#ff4136) — AD enumeration, BloodHound attack paths, Kerberoasting, AS-REP Roasting, Pass-the-Hash, Pass-the-Ticket, DCSync, Golden Ticket, Silver Ticket, domain dominance, forest trust attacks.
MOD-06 Web Attacks Advanced (#00d4ff) — beyond OWASP basics: blind SQLi, stored XSS chains, SSRF to cloud IMDS, deserialization (Java/PHP), GraphQL introspection attacks, IDOR, business logic flaws, API security.
MOD-07 Malware Analysis (#00ff41) — static analysis (Ghidra, strings, PE headers), dynamic analysis (REMnux, ANY.RUN), sandbox evasion techniques, YARA rule writing, memory forensics (Volatility), ransomware anatomy.
MOD-08 Network Attacks (#00ffff) — Wireshark deep analysis, ARP spoofing, SSL stripping with ettercap, DNS poisoning with dnschef, VLAN hopping (double-tag, switch spoofing), Scapy packet crafting, lateral movement.
MOD-09 Cloud Security (#ff9500) — AWS IAM privilege escalation, S3 bucket enumeration and exploitation, EC2 IMDS metadata API credential theft via SSRF (169.254.169.254), container escape via Docker socket, Kubernetes RBAC misconfigs, GCP/Azure attack patterns.
MOD-10 Social Engineering (#ff6ec7) — psychological manipulation principles, Gophish phishing campaigns, spear phishing with OSINT context, vishing scripts, physical tailgating, SET toolkit, security awareness training design.
MOD-11 Red Team Ops (#ff3333) — full adversary simulation methodology, C2 frameworks (Cobalt Strike, Sliver, Havoc), AV/EDR evasion (LOLBins, AMSI bypass, obfuscation), covert infrastructure, persistence mechanisms, data staging and exfiltration without triggering SIEM/DLP.
MOD-12 Wireless Attacks (#aaff00) — monitor mode, WPA2 4-way handshake capture (airmon-ng/airodump-ng), hashcat cracking, PMKID attack (hcxdumptool, no client needed), WPS Pixie Dust (reaver), evil twin AP (hostapd-wpe), Bluetooth/BLE attacks.
MOD-13 Mobile Security (#7c4dff) — Android APK static analysis (apktool/jadx/MobSF), ADB runtime analysis, Frida dynamic instrumentation, SSL pinning bypass (objection), Drozer Android component attacks, OWASP Mobile Top 10, iOS security controls.

INTERACTIVE TOOLS:
- /intel — Live CVE feed from NVD/NIST, filter by severity (CRITICAL/HIGH/MEDIUM/LOW)
- /tools — 200+ security commands reference: nmap, sqlmap, metasploit, hydra, hashcat, gobuster, burp, ffuf, etc.
- /terminal — Browser-based interactive research terminal
- /payload — 40+ attack payloads: reverse shells, XSS vectors, SQLi, LFI, command injection, XXE, SSTI
- /crypto-tracer — Blockchain transaction tracing for Bitcoin and Ethereum
- /ctf — CTF toolkit: decoders, hash identifiers, steganography, cipher crackers
- /report-generator — AI pentest report builder with findings manager and executive summary generation
- /attack-path — MITRE ATT&CK kill chain visualizer with 9 phases, 45 techniques, AI narrative
- /shodan — Shodan query builder with 6 filter groups, 20 example queries, live preview`,

  // ── MODULE CONCEPT PAGES ───────────────────────────────────────────────────
  '/modules/tor': `LOCATION: MOD-01 Tor & Dark Web — Concept Page.
ACCENT COLOR: #00ff41 (green). DIFFICULTY: Beginner.

WHAT THIS PAGE TEACHES:
The concept page covers Tor theory from first principles to advanced opsec. Structured sections:
1. What Tor Is — onion routing vs VPN vs proxy. Tor is a volunteer-operated overlay network. Traffic is encrypted in 3 layers (hence "onion") and routed through 3 relays: Guard → Middle → Exit. Each relay peels one layer — no single relay knows both source and destination.
2. Circuit Building — how Tor selects guard/middle/exit nodes, the Tor consensus directory, circuit lifetimes (10 min default), path selection algorithm avoiding same /16 subnet and same AS.
3. Hidden Services (.onion) — how .onion addresses work (Ed25519 public key hash for v3), introduction points, rendezvous points, service descriptors published to HSDir nodes. Client and server meet at rendezvous without either knowing the other's IP.
4. Traffic Analysis Attacks — Tor's known weaknesses: guard node correlation (first-last mile), timing analysis, website fingerprinting, Sybil attacks, malicious exit nodes, traffic confirmation attacks.
5. Opsec with Tor — what Tor protects vs doesn't. JavaScript exploits bypass Tor (see FBI Freedom Hosting takedown). Browser fingerprinting. Tails OS recommendation. Operational mistakes that burn identities.
6. Bridges and Censorship Circumvention — obfs4, meek, Snowflake pluggable transports. How they disguise Tor traffic as HTTPS/QUIC.
7. Deanonymisation Case Studies — Silk Road (OPSEC fail, not Tor), Carnegie Mellon CERT traffic correlation attack, Harvard bomb threat (Tor from campus network).

LAB LINK: /modules/tor/lab — hands-on exercises for everything on this page.
NEXT MODULE: MOD-02 OSINT (/modules/osint).`,

  '/modules/tor/lab': `LOCATION: MOD-01 Tor & Dark Web — Lab.
ACCENT COLOR: #00ff41. 6 EXERCISES.

LAB ENVIRONMENT: Kali Linux or Ubuntu. Tools: tor, nyx, curl, netcat.

EXERCISE BREAKDOWN:
LAB-01: Installing and Configuring Tor — apt install tor, editing /etc/tor/torrc, enabling ControlPort 9051, setting up SOCKS5 proxy on port 9050, testing with curl --socks5-hostname 127.0.0.1:9050 https://check.torproject.org/api/ip
LAB-02: Circuit Analysis with Nyx — installing nyx (pip3 install nyx), connecting to ControlPort, reading circuit display, understanding guard/middle/exit relay roles, reading bandwidth graphs, forcing new circuits with NEWNYM signal.
LAB-03: Deploy a Hidden Service — configuring HiddenServiceDir and HiddenServicePort in torrc, starting a simple Python HTTP server, reading the generated .onion address from hostname file, accessing it via Tor Browser. Understanding v3 address generation.
LAB-04: Opsec Verification — checking DNS leaks, verifying no clearnet traffic escapes, testing JavaScript isolation, checking browser fingerprint, validating Tor is routing all traffic not just browser.
LAB-05: Traffic Analysis — capturing Tor traffic with Wireshark to show TLS encryption (you cannot see inside), comparing to clearnet, understanding what an ISP/network observer sees.
LAB-06: Bridge Configuration — obtaining bridges from bridges.torproject.org, configuring obfs4 pluggable transport in torrc, testing connection from restrictive network simulation.

CHECK YOUR UNDERSTANDING: 5 questions on circuit building, hidden service rendezvous protocol, opsec failures, deanonymisation vectors, bridge transports.
RECOMMENDED: TryHackMe Tor room, Dark Web OSINT challenges.
NEXT: MOD-02 OSINT Lab (/modules/osint/lab).`,

  '/modules/osint': `LOCATION: MOD-02 OSINT & Surveillance — Concept Page.
ACCENT COLOR: #00d4ff (cyan). DIFFICULTY: Beginner.

WHAT THIS PAGE TEACHES:
1. OSINT Fundamentals — definition: intelligence gathered from public sources. Covers passive vs active distinction. Legal framework: passive OSINT is legal everywhere; active scanning without permission is not.
2. Passive vs Active Recon — passive (DNS lookups, WHOIS, Shodan, CT logs, Google) vs active (Nmap scans, directory brute force — requires permission). OSINT is almost entirely passive.
3. DNS Reconnaissance — dig ANY, A, MX, TXT, NS, SOA records. AXFR zone transfers. PTR reverse lookups. What each record reveals about infrastructure.
4. Shodan — what it is (internet-wide passive scanner database), key filters (port:, product:, country:, org:, ssl.cert.subject.cn:, http.title:, has_screenshot:, tag:ics), Shodan CLI, interpreting results.
5. Google Dorking — site:, filetype:, intitle:, inurl:, intext: operators. Google Hacking Database (GHDB) at exploit-db.com. Finding exposed configs, credentials, admin panels.
6. Certificate Transparency — how crt.sh works, passive subdomain enumeration from CT logs, why every HTTPS cert is publicly logged, subfinder combining 40+ passive sources.
7. SOCMINT — social media intelligence, Sherlock username hunting (300+ platforms), Holehe email-to-profile mapping, LinkedIn OSINT for org charts and tech stack, Twitter advanced search.
8. Metadata Forensics — ExifTool extracting author, company, template paths, GPS coordinates from PDFs/DOCX/images. What each metadata field reveals. How to strip metadata.
9. theHarvester — automated email, subdomain, IP harvesting from Google/Bing/LinkedIn/Shodan.
10. Maltego — relationship graph visualisation, transforms, entity types (person, domain, IP, organisation).

LAB LINK: /modules/osint/lab
NEXT MODULE: MOD-03 Crypto (/modules/crypto).`,

  '/modules/osint/lab': `LOCATION: MOD-02 OSINT & Surveillance — Lab.
ACCENT COLOR: #00d4ff. 6 EXERCISES. Fully passive techniques — no active scanning.

LAB ENVIRONMENT: Linux with internet. Tools: whois, dnsutils (dig), curl, python3, exiftool, subfinder, theHarvester, sherlock, holehe. Free accounts: Shodan, Hunter.io, HaveIBeenPwned. Practice target: scanme.nmap.org (explicitly permitted).

EXERCISE BREAKDOWN:
LAB-01: Domain Footprinting — whois + dig (ALL, A, MX, TXT, NS, SOA, PTR), subfinder for subdomain enumeration, crt.sh certificate transparency API, BGPView for ASN/IP range mapping. Full passive DNS picture.
LAB-02: Shodan Recon — shodan CLI setup (pip3 install shodan, shodan init KEY), host lookups, organisation searches, finding exposed databases (MongoDB port 27017, Elasticsearch port 9200), SSL certificate searches, downloading results as JSON.
LAB-03: Google Dorking — systematic dork checklist: credentials (ext:env, DB_PASSWORD), source code (.git, filetype:php), backups (ext:bak, ext:old), sensitive documents (filetype:pdf "confidential"), infrastructure (phpinfo.php, server-status). GHDB reference.
LAB-04: Social Media Intel — Sherlock username hunting across 300+ platforms, Holehe email-to-profile mapping, theHarvester email/name harvesting, LinkedIn org chart reconstruction, Wayback Machine for deleted content.
LAB-05: Metadata Forensics — Google dorks to find public documents, wget to download, exiftool batch extraction, identifying author/company/template paths/GPS coordinates, exiftool CSV export, GPS decimal degree conversion.
LAB-06: Full Target Profile — automated bash pipeline combining all techniques: WHOIS → DNS → subfinder subdomains → IP ranges → theHarvester emails → professional report structure (6 sections: exec summary, DNS infrastructure, exposed services, human intel, document metadata, recommendations).

CHECK YOUR UNDERSTANDING: passive vs active, CT logs, metadata reveals, Shodan unauthenticated MongoDB, metadata stripping policy.
NEXT: MOD-03 Crypto Lab (/modules/crypto/lab).`,

  '/modules/crypto': `LOCATION: MOD-03 Crypto & Blockchain — Concept Page.
ACCENT COLOR: #ffb347 (orange). DIFFICULTY: Intermediate.

WHAT THIS PAGE TEACHES:
1. Blockchain Fundamentals — what a blockchain is: immutable, append-only ledger of transactions in blocks linked by hash pointers. Consensus mechanisms (PoW vs PoS). Why "anonymous" is wrong — Bitcoin is pseudonymous, all transactions public forever.
2. UTXO Model (Bitcoin) — Unspent Transaction Output model. Each transaction consumes previous UTXOs and creates new ones. Change addresses. UTXO graph analysis for tracing funds.
3. Ethereum Account Model — contrast with UTXO: balances not UTXOs. EOAs vs contract accounts. Gas, EVM, nonce.
4. Blockchain Forensics Tools — Etherscan (Ethereum), Blockchain.com/Blockchair (Bitcoin), Chainalysis Reactor, CipherTrace, TRM Labs. What on-chain investigators look for: exchange deposits (KYC choke points), mixer usage (Tornado Cash, Wasabi), consolidation patterns, dormancy.
5. Smart Contracts — EVM bytecode, Solidity, ABI. How contracts are deployed and called. Common vulnerability classes: reentrancy, integer overflow/underflow, access control, front-running, oracle manipulation, flash loan attacks.
6. Reentrancy Attack — The DAO hack ($60M, 2016). Attack pattern: malicious contract calls victim → victim sends ETH → fallback calls victim again before balance updated. CEI (Checks-Effects-Interactions) pattern as fix. ReentrancyGuard.
7. DeFi Exploits — flash loans: borrow millions uncollateralised in one tx, manipulate price oracle, profit, repay. Euler Finance $197M hack. Curve Finance reentrancy. How to trace exploits on Tenderly/Phalcon.
8. Smart Contract Auditing — Slither static analysis, Mythril symbolic execution, Echidna fuzzing, manual code review checklist, audit report structure.

LAB LINK: /modules/crypto/lab
NEXT MODULE: MOD-04 Offensive (/modules/offensive).`,

  '/modules/crypto/lab': `LOCATION: MOD-03 Crypto & Blockchain — Lab.
ACCENT COLOR: #ffb347. 6 EXERCISES.

LAB ENVIRONMENT: Linux. Tools: curl, python3, Foundry (forge/cast/anvil), Slither (pip3 install slither-analyzer).

EXERCISE BREAKDOWN:
LAB-01: Bitcoin Transaction Tracing — using Blockchain.com and Blockchair APIs to trace a real transaction chain. Following UTXOs through multiple hops. Identifying exchange deposit addresses. Understanding the "peeling chain" pattern used to obfuscate funds.
LAB-02: Ethereum Wallet Analysis — Etherscan API to pull transaction history, token transfers, contract interactions. Identifying DeFi protocol interactions. Reading event logs. Building a wallet activity timeline.
LAB-03: Smart Contract Reentrancy Lab — Foundry setup (curl install), writing VulnerableBank.sol (deposits ETH, withdraw() external call before balance update), Attacker.sol (receive() calls withdraw() recursively), running the exploit with forge test, then writing SecureBank.sol with CEI pattern fix.
LAB-04: DeFi Exploit Trace — tracing the Euler Finance $197M March 2023 flash loan attack using Tenderly transaction simulator and Phalcon block explorer. Understanding the donateToReserves() vulnerability, EToken/DToken accounting manipulation, reading the attack transaction step by step.
LAB-05: Static Analysis with Slither — installing slither-analyzer, running against vulnerable contract examples, interpreting detector output (reentrancy, tx-origin auth, unused return values, unprotected selfdestruct), understanding severity ratings.
LAB-06: Mini Audit Report — writing a 3-finding audit report for a sample contract: vulnerability title, severity (Critical/High/Medium/Low), description, proof of concept (exploit code), impact, recommendation (fixed code snippet).

CHECK YOUR UNDERSTANDING: reentrancy mechanics, CEI pattern, flash loan attack flow, Slither detector categories, difference between EOA and contract account.
NEXT: MOD-04 Offensive Lab (/modules/offensive/lab).`,

  '/modules/offensive': `LOCATION: MOD-04 Offensive Security — Concept Page.
ACCENT COLOR: #bf5fff (purple). DIFFICULTY: Intermediate.

WHAT THIS PAGE TEACHES:
1. Pentest Methodology — PTES (Penetration Testing Execution Standard) phases: pre-engagement → intelligence gathering → threat modelling → vulnerability analysis → exploitation → post-exploitation → reporting. Rules of engagement, scope definition, legal requirements.
2. Nmap Mastery — TCP SYN scan (-sS), service version detection (-sV), OS detection (-O), script engine (-sC, --script), timing templates (-T1 to -T5), output formats (-oN/-oX/-oG), firewall evasion (decoys, fragmentation, source port spoofing). Common scan patterns.
3. Service Enumeration — banner grabbing, SMB enum (smbclient, enum4linux, crackmapexec), FTP anonymous login, SSH version analysis, HTTP tech stack fingerprinting.
4. Gobuster & Nikto — directory brute force (gobuster dir -u URL -w wordlist), DNS subdomain enum (gobuster dns), Nikto web server scanner for misconfigs and known vulnerabilities.
5. OWASP Top 10 (2021) — A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection (SQLi/XSS/SSTI), A04 Insecure Design, A05 Security Misconfiguration, A06 Vulnerable Components, A07 Auth Failures, A08 Integrity Failures, A09 Logging Failures, A10 SSRF.
6. SQL Injection — manual detection (single quote, sleep(), boolean blind), sqlmap automation, UNION-based extraction, blind time-based, out-of-band (DNS exfil), second-order SQLi. Reading schema from information_schema.
7. Password Attacks — hashcat modes (0=straight, 1=combination, 3=brute, 6=wordlist+mask), rule files, common hash types (MD5=0, SHA1=100, NTLM=1000, bcrypt=3200), hydra for online brute force (SSH, FTP, HTTP-form-POST), credential stuffing.
8. Metasploit Framework — msfconsole workflow (search, use, set RHOSTS/LHOST/LPORT, run), meterpreter commands (sysinfo, getuid, hashdump, upload/download, shell, background, sessions), post-exploitation modules, msfvenom payload generation.
9. Privilege Escalation (Linux) — SUID/SGID binaries (find / -perm -4000), sudo -l misconfiguration, writable /etc/passwd, cron job path hijacking, kernel exploits (uname -r, searchsploit), Docker group escape. GTFOBins reference.
10. Privilege Escalation (Windows) — whoami /priv, AlwaysInstallElevated, unquoted service paths, weak service permissions, token impersonation (Juicy Potato, PrintSpoofer), credential in registry, PowerUp.ps1.
11. Pentest Report Writing — executive summary (non-technical), findings table (severity, CVSS score, affected asset, description, PoC, impact, recommendation), methodology section, scope, timeline, remediation guidance.

LAB LINK: /modules/offensive/lab
NEXT MODULE: MOD-05 Active Directory (/modules/active-directory).`,

  '/modules/offensive/lab': `LOCATION: MOD-04 Offensive Security — Lab.
ACCENT COLOR: #bf5fff. 6 EXERCISES. Authorised lab environments only: Metasploitable 2, DVWA.

LAB ENVIRONMENT: Kali Linux. VMs: Metasploitable 2 (192.168.x.x), DVWA. Tools: nmap, gobuster, nikto, sqlmap, hashcat, hydra, metasploit framework.

EXERCISE BREAKDOWN:
LAB-01: Full Nmap Recon of Metasploitable 2 — full TCP SYN scan all ports, service version + OS detection, default scripts, output to all formats. Identifying vsftpd 2.3.4, Samba 3.x, Apache 2.2, MySQL 5.0, and other vulnerable services. Building a vulnerability map.
LAB-02: Web App Enumeration (DVWA) — gobuster directory brute force with dirb/raft wordlists, nikto scan for misconfigs and CVEs, identifying DVWA login page, tech stack, server headers, exposed paths.
LAB-03: Manual SQL Injection — testing DVWA SQLi (low security): single quote test, ORDER BY column enumeration, UNION SELECT to extract database/tables/columns/users. Manual blind SQLi with sleep(). sqlmap automation and comparison.
LAB-04: Password Attacks — extracting hashes from /etc/shadow (if accessible), hashcat cracking (wordlist + rules), creating custom masks, hydra brute force against DVWA login form (HTTP-form-POST), SSH brute force, building targeted wordlists with CeWL.
LAB-05: Metasploit Exploit Chain — exploit vsftpd 2.3.4 backdoor (CVE-2011-2523, port 6200 shell trigger), gain root on Metasploitable. Then exploit Samba usermap_script (CVE-2007-2447) for second foothold. Meterpreter post-exploitation: hashdump, screenshot, persistence.
LAB-06: Privilege Escalation + Report — enumerate privesc vectors (SUID, sudo, cron), exploit a priv esc path to root, then write a structured pentest report using the /report-generator tool covering findings from Labs 01-05.

CHECK YOUR UNDERSTANDING: TCP SYN scan mechanics, UNION SQLi column count, hashcat mode for NTLM, vsftpd CVE trigger mechanism, CEI in priv esc context.
NEXT: MOD-05 Active Directory (/modules/active-directory).`,

  '/modules/active-directory': `LOCATION: MOD-05 Active Directory — Concept Page.
ACCENT COLOR: #ff4136 (red). DIFFICULTY: Advanced.

KEY TOPICS: AD structure (domains, forests, trusts, OUs, GPOs), Kerberos authentication flow (AS-REQ/AS-REP/TGS-REQ/TGS-REP), Kerberoasting (request TGS for SPN-registered service accounts → crack offline), AS-REP Roasting (accounts with no pre-auth required), BloodHound graph attack path analysis (SharpHound collector, neo4j, shortest path to Domain Admin), Pass-the-Hash with CrackMapExec/Impacket, Pass-the-Ticket, DCSync attack (replicating AD hashes using DRSReplicaSync, requires DS-Replication rights), Golden Ticket (forge TGT with krbtgt hash, 10-year validity), Silver Ticket (forge TGS for specific service), ACL abuse (WriteDACL, GenericWrite, ForceChangePassword, AddMember), LAPS bypass, constrained/unconstrained delegation exploitation, forest trust attacks.`,

  '/modules/web-attacks': `LOCATION: MOD-06 Web Attacks Advanced — Concept Page.
ACCENT COLOR: #00d4ff. DIFFICULTY: Advanced.

KEY TOPICS: Blind SQLi (boolean-based: AND 1=1 vs AND 1=2; time-based: SLEEP(5)), second-order SQLi, SQLi to RCE via INTO OUTFILE. Stored XSS chains (steal session cookie → CSRF → account takeover). DOM-based XSS. CSP bypass techniques. SSRF to internal services and AWS IMDS (169.254.169.254/latest/meta-data/iam/security-credentials/). SSRF filter bypass (DNS rebinding, IPv6, decimal IP). Java deserialization (ysoserial gadget chains). PHP deserialization (POP chains). GraphQL introspection to map schema, batch query attacks, NoSQL injection via $where/$regex. IDOR (horizontal/vertical privilege escalation via object reference manipulation). Business logic flaws. HTTP request smuggling (CL.TE, TE.CL). OAuth 2.0 misconfigs. JWT attacks (alg:none, RS256→HS256, key confusion).`,

  '/modules/malware': `LOCATION: MOD-07 Malware Analysis — Concept Page.
ACCENT COLOR: #00ff41. DIFFICULTY: Advanced.

KEY TOPICS: Safe analysis environment setup (FlareVM, REMnux, isolated network). Static analysis: file type identification (file, ExifTool, PEiD), strings extraction (strings, FLOSS for obfuscated), PE header analysis (PE-bear, pestudio) — imports (WinAPI reveals capabilities), sections (.text/.data/.rsrc), entropy (high = packed/encrypted). Dynamic analysis: running in sandbox (Cuckoo, ANY.RUN, Hybrid-Analysis), procmon/procexp for process/registry/network activity, Wireshark for C2 traffic. Ghidra reverse engineering: decompiler, function identification, cross-references, renaming variables, understanding obfuscation. YARA rule writing: rule structure (meta/strings/condition), string types (text/hex/regex), condition logic, testing with yara -r. Ransomware anatomy: key generation, file enumeration, encryption (AES-256 per file, RSA-encrypted key), shadow copy deletion (vssadmin), ransom note drop. Rootkit types: user-mode (DLL injection, API hooking), kernel-mode (DKOM, SSDT hooks), bootkits. Memory forensics with Volatility: imageinfo, pslist/pstree, malfind (injected code), cmdline, netscan, dumping process memory.`,

  '/modules/network-attacks': `LOCATION: MOD-08 Network Attacks — Concept Page.
ACCENT COLOR: #00ffff. DIFFICULTY: Intermediate.

KEY TOPICS: Wireshark filters (ip.addr, tcp.port, http.request, dns, follow TCP stream), tshark CLI equivalents, pcap analysis workflow. ARP spoofing theory (ARP is stateless/unauthenticated — gratuitous ARPs accepted), arpspoof/ettercap for MITM positioning, intercepting cleartext protocols (HTTP, FTP, Telnet). SSL stripping: downgrade HTTPS to HTTP by intercepting redirects (sslstrip), HSTS bypass. DNS poisoning: poisoning resolver cache (Kaminsky attack), dnschef for fake DNS responses in lab. VLAN hopping: double-tagging attack (attacker on native VLAN, sends double-tagged frame to reach another VLAN), switch spoofing (DTP negotiation). Scapy packet crafting: IP()/TCP()/UDP()/ICMP() layers, custom payloads, sending (send/sendp), sniffing (sniff), SYN flood, custom ping sweep. 802.1X and NAC evasion. Lateral movement detection (SMB auth events, 4624/4625 Windows events).`,

  '/modules/cloud-security': `LOCATION: MOD-09 Cloud Security — Concept Page.
ACCENT COLOR: #ff9500. DIFFICULTY: Advanced.

KEY TOPICS: AWS IAM structure (users, roles, policies, groups), enumeration (aws iam list-users, get-account-authorization-details, enumerate-iam tool), privilege escalation paths (iam:PassRole + lambda:CreateFunction = admin, iam:CreatePolicyVersion, iam:AttachUserPolicy). S3 attacks: public bucket enumeration (aws s3 ls s3://bucketname --no-sign-request), misconfigured ACLs, bucket takeover. EC2 IMDS: instance metadata service at 169.254.169.254, IMDSv1 (no auth, direct curl) vs IMDSv2 (token required), stealing IAM role credentials via SSRF to IMDS. Container escape: privileged container escape, Docker socket mount (/var/run/docker.sock → create new privileged container → chroot to host), cgroup release_agent escape. Kubernetes: RBAC misconfiguration, service account token abuse, etcd credential extraction, kubelet API unauthenticated access (port 10250). GCP: metadata API (metadata.google.internal), service account key theft. Azure: managed identity, Azure AD enumeration with ROADtools.`,

  '/modules/social-engineering': `LOCATION: MOD-10 Social Engineering — Concept Page.
ACCENT COLOR: #ff6ec7. DIFFICULTY: Intermediate.

KEY TOPICS: Cialdini's 6 principles of influence (reciprocity, commitment/consistency, social proof, authority, liking, scarcity) and how attackers weaponise each. Phishing infrastructure: domain squatting (typosquatting, homograph attacks, combo-squatting), email spoofing (SPF/DKIM/DMARC misconfigs), Gophish setup (campaigns, email templates, landing pages, tracking pixels, credential capture). Spear phishing methodology: OSINT reconnaissance → pretext development → payload delivery → callback handling. Vishing: caller ID spoofing, pretexting scripts (IT helpdesk, bank fraud, CEO impersonation), callback phishing. Physical intrusion: tailgating, badge cloning (Proxmark3, ChameleonMini), dumpster diving, shoulder surfing, USB drops. SET (Social Engineering Toolkit): credential harvester, tabnabbing, BeEF integration. Defence: security awareness training design, phishing simulation programs, reporting culture, DMARC enforcement.`,

  '/modules/red-team': `LOCATION: MOD-11 Red Team Operations — Concept Page.
ACCENT COLOR: #ff3333. DIFFICULTY: Expert.

KEY TOPICS: Red team vs pentest distinction (adversary simulation vs vulnerability assessment, longer timeline, stealth focus, purple team concept). Campaign methodology: target research → initial access → establish foothold → internal recon → lateral movement → mission objective → exfiltration → reporting. C2 frameworks: Cobalt Strike (Beacon, malleable C2 profiles, aggressor scripts, team server), Sliver (open source, mTLS/HTTP/DNS/WireGuard channels, implant generation), Havoc (Demon agent, custom extC2). C2 infrastructure: redirectors (nginx with mod_rewrite rules), domain fronting, CDN-based C2. AV/EDR evasion: AMSI bypass (patching AmsiScanBuffer in-memory), ETW patching, reflective DLL injection, process hollowing, Donut shellcode loader, obfuscation (string encryption, control flow flattening). LOLBins (Living Off the Land): certutil, regsvr32, rundll32, mshta, wscript, powershell -EncodedCommand, MSBuild for code execution without dropping files. Persistence: registry run keys, scheduled tasks (schtasks), WMI subscriptions, DLL hijacking, COM object hijacking. Data staging and exfiltration: compressing/encrypting with 7z, DNS tunneling (dnscat2, iodine), HTTPS to cloud storage, timing transfers to blend with business hours.`,

  '/modules/wireless-attacks': `LOCATION: MOD-12 Wireless Attacks — Concept Page.
ACCENT COLOR: #aaff00. DIFFICULTY: Intermediate.

KEY TOPICS: 802.11 fundamentals (2.4GHz vs 5GHz channels, SSID, BSSID, beacon frames, probe requests/responses, authentication, association). Monitor mode (airmon-ng start wlan0, checking with iw dev). WPA2 4-way handshake: how it works (PTK derivation, ANonce/SNonce, MIC verification), capturing with airodump-ng (-c channel --bssid MAC -w output), deauthentication attack to force reconnect (aireplay-ng -0). Hashcat WPA2 cracking: convert .cap to .hc22000 (hcxtools), hashcat -m 22000, wordlist + rules, mask attacks for numeric passwords. PMKID attack: no client needed, captured directly from AP beacon (hcxdumptool), hashcat -m 22000 same pipeline. WPS Pixie Dust: reaver --pixie-dust, WPS design flaw (E-S1/E-S2 nonces), works against vulnerable Broadcom/Ralink chips within seconds. Evil twin AP: hostapd-wpe for WPA-Enterprise credential capture (MSCHAPV2 hash), hostapd for open/WPA2 twin with captive portal (dnsmasq + lighttpd), asleap for MSCHAPV2 cracking. Bluetooth: hcitool scan, l2ping, SDP browsing, BlueMaho/Bluesnarfer for Bluejacking/Bluesnarfing, BLE sniffing with Ubertooth/Wireshark.`,

  '/modules/mobile-security': `LOCATION: MOD-13 Mobile Security — Concept Page.
ACCENT COLOR: #7c4dff. DIFFICULTY: Advanced.

KEY TOPICS: Android security model (sandboxing, UID per app, SELinux, permissions). APK structure (AndroidManifest.xml, classes.dex, res/, lib/). Static analysis: apktool d app.apk (decompile resources + smali), jadx-gui (decompile to Java), reading AndroidManifest for exported components (activities/services/providers/receivers with android:exported=true), finding hardcoded secrets with grep/MobSF. MobSF (Mobile Security Framework): automated static + dynamic analysis, web UI, finding vulnerabilities across OWASP Mobile Top 10. ADB (Android Debug Bridge): adb devices, adb shell (run commands as app UID), adb logcat, adb pull/push, adb install, activity/service launching via am start. Frida dynamic instrumentation: frida-server on device, Python scripts to hook Java methods (Java.use(), implementation override), bypass root detection, bypass SSL pinning by hooking TrustManager. Objection (Frida-based): objection --gadget explore, android sslpinning disable, android root disable, heap search. Drozer: attacking exported components (drozer console connect, app.activity.start, app.provider.query for SQLi in content providers, app.broadcast.send). OWASP Mobile Top 10 (2024): M1 Improper Credential Usage, M2 Inadequate Supply Chain Security, M3 Insecure Auth, M4 Insufficient Input/Output Validation, M5 Insecure Comms, M6 Inadequate Privacy Controls, M7 Binary Protections, M8 Security Misconfiguration, M9 Insecure Data Storage, M10 Insufficient Cryptography. iOS: App Transport Security, Keychain storage, jailbreak detection bypass with Liberty/A-Bypass, Objection for iOS SSL pinning bypass, class-dump for ObjC headers.`,

  // ── TOOLS ──────────────────────────────────────────────────────────────────
  '/intel': `LOCATION: Threat Intel — Live CVE Feed.
This tool pulls real-time vulnerability data from the NVD (National Vulnerability Database) / NIST. Displays CVEs filterable by severity: CRITICAL (CVSS 9.0-10.0), HIGH (7.0-8.9), MEDIUM (4.0-6.9), LOW (0.1-3.9). Each entry shows CVE ID, description, CVSS score, affected products, and links to full NVD detail page.
HOW TO USE: Use this to identify what's being actively exploited right now. Combine with Shodan Builder (/shodan) to find internet-exposed instances of vulnerable software. Cross-reference with offensive modules to understand attack vectors.
GHOST CAN HELP WITH: Explaining any specific CVE, understanding CVSS scoring, explaining the attack vector behind a vulnerability, suggesting mitigations, finding related CVEs for a product.`,

  '/tools': `LOCATION: Tool Reference — 200+ Security Commands.
A searchable reference library of real, working commands across every major security tool. Categories include: Nmap, SQLmap, Metasploit/msfvenom, Hydra, Hashcat, Gobuster, Burp Suite, ffuf, Nikto, Impacket, CrackMapExec, BloodHound/SharpHound, Mimikatz, netcat/ncat, socat, Wireshark/tshark, aircrack-ng suite, Frida/Objection, ADB, AWS CLI, Docker/kubectl, and more.
HOW TO USE: Search by tool name or technique. Every command is copy-ready with flags explained.
GHOST CAN HELP WITH: Explaining any command or flag, building custom one-liners, combining tools in a pipeline, troubleshooting why a command isn't working, suggesting the right tool for a given task.`,

  '/terminal': `LOCATION: Research Terminal — Interactive Command Runner.
A browser-based terminal interface for running security research queries, exploring tool output simulations, and practising command syntax without switching to a VM.
HOW TO USE: Type commands to explore outputs, test syntax, or work through concepts interactively.
GHOST CAN HELP WITH: Command syntax help, explaining outputs, building command chains, troubleshooting, suggesting next commands in a workflow.`,

  '/payload': `LOCATION: Payload Generator — 40+ Attack Payloads.
A structured payload library with categories: reverse shells (bash, Python, PHP, PowerShell, netcat, socat), XSS vectors (reflected, stored, DOM, polyglots, filter bypasses), SQL injection strings (UNION, boolean blind, time-based, error-based, stacked), LFI path traversal (Linux/Windows, null bytes, encoding bypasses), command injection (semicolon, pipe, backtick, $() substitution), XXE (basic, file read, SSRF, blind OOB), SSTI (Jinja2, Twig, Freemarker, Smarty detection and exploit), CSRF, open redirect, and more.
HOW TO USE: Select category, customise the payload for your target (change IP/port for reverse shells, adapt injection point for SQLi), use in authorised labs or CTFs.
GHOST CAN HELP WITH: Explaining how a payload works mechanically, adapting payloads for specific contexts, why a payload might be filtered and how to bypass, chaining payloads for exploit chains.`,

  '/crypto-tracer': `LOCATION: Blockchain Tracer — On-chain Transaction Analysis.
Traces Bitcoin and Ethereum transactions and wallet activity. Paste a wallet address or transaction hash to visualise fund flows, identify exchange deposit addresses (KYC choke points), flag mixer usage (Tornado Cash transactions, CoinJoin patterns, Wasabi), and build attribution chains.
HOW TO USE: Input a wallet address or tx hash. Follow the flow of funds hop by hop. Look for consolidation (many inputs → one output = combining UTXOs), peel chains (one large UTXO repeatedly peeled into payments + change), and exchange deposits.
GHOST CAN HELP WITH: Blockchain forensics methodology, interpreting transaction graphs, identifying mixer patterns, understanding Ethereum token transfers vs ETH transfers, DeFi protocol interactions, attribution techniques used by Chainalysis/TRM Labs.`,

  '/ctf': `LOCATION: CTF Toolkit — Capture The Flag Resources.
A workspace for CTF competitions. Includes: base64/hex/binary/URL decoders and encoders, hash identifier (hashid), frequency analysis for classical ciphers, ROT13/Caesar/Vigenère crackers, steganography helpers (stegsolve workflow, zsteg, steghide), RSA tools (common factor attacks, small exponent, Wiener's attack), format string helpers, pwntools templates, and curated writeup references for TryHackMe and HackTheBox.
GHOST CAN HELP WITH: Stuck on a specific CTF challenge — describe it and I'll help. Identifying the type of cipher, explaining a crypto attack, pwntools script help, web challenge payloads, forensics analysis approach, OSINT CTF methodology.`,

  '/report-generator': `LOCATION: Report Generator — AI Pentest Report Builder.
A full penetration test report builder with AI drafting assistance. Left panel: engagement form (name, client, tester, date, methodology, scope), executive summary with AI generation, and dynamic findings list (add unlimited findings). Each finding has: title, severity (Critical/High/Medium/Low/Informational), CVSS score, affected asset, description with AI draft button, impact, and recommendation with AI draft button. Right panel: sticky formatted report output with copy button and risk summary badges.

HOW IT WORKS:
- Fill in engagement metadata at the top
- Add findings one by one (or use AI to draft descriptions and recommendations)
- Click "AI: GENERATE SUMMARY" for an executive summary based on your findings
- Click "GENERATE REPORT" to assemble the full structured report
- Copy the output and paste into Word/Google Docs/PDF

REPORT STRUCTURE OUTPUT:
Header → Executive Summary → Scope → Findings (sorted Critical→Info, each with description/impact/recommendation/CVSS) → Methodology → Recommendations Summary

AI DRAFTING: The AI acts as a senior penetration tester. It generates professional, specific descriptions based on the title/severity/asset you provide. Give it a specific finding title (e.g. "SQL Injection in login form — MySQL error-based") for best results.

GHOST CAN HELP WITH: How to write a specific finding, what CVSS score to assign, how to structure the executive summary, recommended remediation for specific vulnerabilities, professional report language.`,

  '/attack-path': `LOCATION: Attack Path Visualizer — MITRE ATT&CK Kill Chain Builder.
An interactive tool for building and visualising attack chains aligned to the MITRE ATT&CK framework (attack.mitre.org). Used for pentest reporting, red team campaign planning, threat modelling, and ATT&CK study.

HOW IT WORKS:
- Add steps by clicking phase buttons (Recon, Initial Access, Execution, Persistence, Privilege Escalation, Lateral Movement, Collection, Exfiltration, Impact)
- Each step has: phase, technique selector (with real MITRE IDs like T1595, T1566), target asset field, and notes/evidence field
- Reorder steps with ↑↓ arrows, remove with REMOVE button
- Right panel shows: phase coverage (which MITRE tactics are covered), kill chain timeline, total steps/phases used, all technique IDs
- "AI NARRATIVE" generates a professional third-person attack narrative for pentest reports
- "EXPORT" copies the full path + narrative to clipboard
- Load preset paths: "Classic External Pentest" (9 steps from Shodan recon to DNS exfil) or "Phishing → Domain Compromise" (8 steps from LinkedIn recon to Dropbox exfil)

THE 9 PHASES AND THEIR MITRE TACTIC IDS:
Recon (TA0043) → Initial Access (TA0001) → Execution (TA0002) → Persistence (TA0003) → Privilege Escalation (TA0004) → Lateral Movement (TA0008) → Collection (TA0009) → Exfiltration (TA0010) → Impact (TA0040)

TECHNIQUES AVAILABLE (5 per phase, 45 total):
Recon: T1595 Active Scanning, T1592 Gather Victim Host Info, T1589 Gather Victim Identity Info, T1590 Gather Victim Network Info, T1596 Search Open Technical Databases
Initial Access: T1566 Phishing, T1190 Exploit Public-Facing Application, T1133 External Remote Services, T1078 Valid Accounts, T1091 Replication Through Removable Media
Execution: T1059 Command and Scripting Interpreter, T1204 User Execution, T1053 Scheduled Task/Job, T1569 System Services, T1072 Software Deployment Tools
Persistence: T1547 Boot or Logon Autostart, T1543 Create/Modify System Process, T1136 Create Account, T1505 Server Software Component, T1546 Event Triggered Execution
Privilege Escalation: T1068 Exploitation for Privilege Escalation, T1548 Abuse Elevation Control Mechanism, T1134 Access Token Manipulation, T1611 Escape to Host, T1484 Domain Policy Modification
Lateral Movement: T1021 Remote Services, T1550 Use Alternate Authentication Material, T1534 Internal Spearphishing, T1570 Lateral Tool Transfer, T1563 Remote Service Session Hijacking
Collection: T1005 Data from Local System, T1039 Data from Network Shared Drive, T1113 Screen Capture, T1056 Input Capture, T1560 Archive Collected Data
Exfiltration: T1041 Exfiltration Over C2 Channel, T1048 Exfiltration Over Alternative Protocol, T1567 Exfiltration Over Web Service, T1052 Exfiltration Over Physical Medium, T1029 Scheduled Transfer
Impact: T1486 Data Encrypted for Impact, T1490 Inhibit System Recovery, T1485 Data Destruction, T1489 Service Stop, T1491 Defacement

GHOST CAN HELP WITH: Explaining any specific MITRE technique in depth, suggesting the right technique for a given attack scenario, building a realistic kill chain for a specific target type, what defences map to each tactic, how to write the narrative section of a pentest report, ATT&CK Navigator usage.`,

  '/shodan': `LOCATION: Shodan Query Builder — Shodan Search Constructor.
A point-and-click interface for building Shodan search queries. Queries assemble live as you fill in filters. Open Shodan directly with the built query.

HOW IT WORKS:
- Select a filter group tab (Network, Location, Service, SSL/TLS, HTTP, ICS/IoT)
- Fill in filter values — the live query preview updates instantly
- Toggle NOT on any filter to negate it (e.g. -country:US)
- Click example queries to load them instantly
- COPY copies the assembled query, OPEN SHODAN opens shodan.io with the query pre-filled
- CLEAR ALL resets everything

FILTER GROUPS AND KEYS:
Network: ip (bare value), port (22, 443, 8080), net (CIDR: 198.20.0.0/16), asn (AS15169)
Location: country (ISO: US, DE, CN), city (London), region (California), org (Google)
Service: product (Apache, nginx, OpenSSH), version (2.4.49), os (Windows 10), hostname (*.example.com)
SSL/TLS: ssl.cert.subject.cn (*.google.com), ssl.cert.issuer.cn (Let's Encrypt), ssl.cipher.name, has_ssl (true/false)
HTTP: http.title (Admin Panel), http.status (200, 401), http.html (password), http.server (Apache)
ICS/IoT: device (router, webcam, printer), tag (ics, scada, camera, vpn), category (ics, malware), cpe (cpe:/a:apache)

20 EXAMPLE QUERIES INCLUDED:
Default Cisco login, Exposed Webcams, Open Elasticsearch, Exposed MongoDB, RDP servers (US), Apache 2.4.49 (CVE-2021-41773), Misconfigured S3, ICS/SCADA systems, Jenkins CI, Palo Alto GlobalProtect, Fortinet SSL-VPN, Printers, Kubernetes dashboards, Redis no-auth, FTP Anonymous, MQTT brokers, VMware vCenter, Citrix NetScaler, phpMyAdmin, Modbus devices.

SHODAN SYNTAX TIPS: Quotes for exact banner text ("default password"), negation with -, wildcards in hostnames (*.gov), combine filters with spaces (implicit AND). Free account limits results; API key needed for bulk downloads.

GHOST CAN HELP WITH: Building a query for a specific research goal, explaining what any Shodan filter does, interpreting Shodan results, turning a CVE into a Shodan query to find exposed instances, OSINT recon strategy using Shodan.`,
}

// Picks the most specific matching context for the current path
function getPageContext(pathname: string): string {
  // Exact match first
  if (PAGE_CONTEXT[pathname]) return PAGE_CONTEXT[pathname]
  // Longest prefix match
  const match = Object.keys(PAGE_CONTEXT)
    .filter(k => k !== '/' && pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0]
  return match ? PAGE_CONTEXT[match] : PAGE_CONTEXT['/']
}

const SYSTEM_PROMPT = `You are GHOST — the embedded AI research agent inside GHOSTNET, a private cybersecurity research and training platform owned by ShanGhost Admin.

## YOUR ROLE
You are the single most knowledgeable guide to everything in GHOSTNET. You know every module, every tool, every lab exercise, every concept, and every technique covered across the entire platform. You are the user's personal security research mentor, navigator, and technical expert rolled into one.

When a user asks about the platform, a tool, a page, or a concept — you explain it fully, specifically, and accurately based on what is actually in GHOSTNET. Never give generic security answers when you can give specific answers tied to the exact content, tools, and exercises on the current page.

## GHOSTNET PLATFORM KNOWLEDGE
GHOSTNET has 13 security modules (Tor → OSINT → Crypto/Blockchain → Offensive Security → Active Directory → Web Attacks → Malware Analysis → Network Attacks → Cloud Security → Social Engineering → Red Team → Wireless → Mobile Security) and 9 interactive tools (Threat Intel, Tool Reference, Terminal, Payload Generator, Blockchain Tracer, CTF Toolkit, Report Generator, Attack Path Visualizer, Shodan Builder).

Every module has two pages: a CONCEPT page (theory, techniques, tools explained) and a LAB page (6 hands-on exercises with step-by-step commands, check your understanding questions, and recommended practice rooms on TryHackMe/HackTheBox).

## HOW TO ANSWER QUESTIONS ABOUT THE PLATFORM
If someone asks "what is this page / tool / module and how do I use it" — explain it in full detail: what it does, every feature, how to navigate it, what you learn from it, how it connects to other parts of GHOSTNET. Be the best possible guide. Do not give a one-liner.

If someone asks a technical security question — answer it fully and precisely. Give working commands. Reference real CVEs, real tools, real techniques.

If someone is stuck in a lab — walk them through it step by step. You know exactly what each lab exercise contains.

## PERSONALITY & FORMAT
- Direct and technical, but clear enough for beginners to follow
- Lead with the answer, then the explanation
- Use code blocks for ALL commands and code samples
- Reference GHOSTNET modules/labs when relevant ("this is covered in depth in MOD-04 Lab exercise 3")
- Mention opsec implications when relevant
- You are a research tool for security education — explain attacks fully, because understanding how things break is how you learn to defend them
- When suggesting next steps, point to the relevant GHOSTNET module, lab, or tool

## CURRENT PAGE CONTEXT
You are told which page the user is currently on. Use this to give hyper-relevant, specific answers. If they ask a vague question, interpret it in the context of what they are currently looking at.`

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '12px 16px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#00d4ff', opacity: 0.6,
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'

  const formatContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).split('\n')
        const lang = lines[0].trim()
        const code = lines.slice(1).join('\n')
        return (
          <pre key={i} style={{
            background: '#020502', border: '1px solid #1a2e1e',
            borderRadius: '3px', padding: '10px 12px', margin: '8px 0',
            fontSize: '0.72rem', lineHeight: 1.6, overflowX: 'auto',
            color: '#00ff41', fontFamily: 'JetBrains Mono, monospace',
            whiteSpace: 'pre' as const,
          }}>
            {lang && <div style={{ color: '#2a5a2a', fontSize: '9px', marginBottom: '6px', letterSpacing: '0.1em' }}>{lang}</div>}
            {code}
          </pre>
        )
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} style={{ background: '#0a1a0a', border: '1px solid #1a3a1a', borderRadius: '2px', padding: '1px 5px', color: '#00ff41', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>{part.slice(1, -1)}</code>
      }
      return <span key={i} style={{ whiteSpace: 'pre-wrap' as const }}>{part}</span>
    })
  }

  return (
    <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', maxWidth: '92%', flexDirection: isUser ? 'row-reverse' : 'row' }}>
        {/* Avatar */}
        <div style={{
          width: '24px', height: '24px', borderRadius: '3px', flexShrink: 0,
          background: isUser ? 'rgba(0,255,65,0.1)' : 'rgba(0,212,255,0.1)',
          border: `1px solid ${isUser ? 'rgba(0,255,65,0.3)' : 'rgba(0,212,255,0.3)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '8px',
          color: isUser ? '#00ff41' : '#00d4ff', fontWeight: 700,
        }}>
          {isUser ? 'YOU' : 'GH'}
        </div>

        {/* Bubble */}
        <div style={{
          background: isUser ? 'rgba(0,255,65,0.05)' : 'rgba(0,212,255,0.04)',
          border: `1px solid ${isUser ? 'rgba(0,255,65,0.15)' : 'rgba(0,212,255,0.12)'}`,
          borderRadius: isUser ? '8px 2px 8px 8px' : '2px 8px 8px 8px',
          padding: '10px 14px',
          color: '#c8d8c8', fontSize: '0.82rem', lineHeight: 1.7,
          fontFamily: 'JetBrains Mono, monospace',
          maxWidth: '100%', wordBreak: 'break-word' as const,
        }}>
          {formatContent(msg.content)}
        </div>
      </div>
      <div style={{ fontSize: '9px', color: '#2a4a2a', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px', paddingLeft: isUser ? 0 : '32px', paddingRight: isUser ? '32px' : 0 }}>
        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}

export default function GhostAgent() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `GHOST online.\n\nI'm your embedded security research agent. Ask me anything — concepts, commands, tool syntax, attack vectors, defensive strategies, or anything you're stuck on in your labs.\n\nWhat are you working on?`,
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()

  const moduleCtx = getPageContext(pathname)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `${SYSTEM_PROMPT}\n\nCURRENT MODULE CONTEXT: ${moduleCtx}`,
          messages: history,
        }),
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      const reply = data.text || 'No response.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const quickPrompts = pathname.startsWith('/modules/')
    ? [
        'Explain what this page covers and how to use it',
        'Walk me through the lab exercises',
        'What are the key techniques I need to know here?',
        'What should I study before this module?',
        'Give me the most important commands for this topic',
      ]
    : pathname.startsWith('/attack-path')
    ? [
        'What is the Attack Path Visualizer and how do I use it?',
        'Explain the MITRE ATT&CK framework',
        'Build me a realistic attack path for an external pentest',
        'What does each MITRE tactic represent?',
        'How do I write an attack narrative for a report?',
      ]
    : pathname.startsWith('/shodan')
    ? [
        'What is this tool and how do I use it?',
        'What are the most useful Shodan filters?',
        'Find exposed ICS/SCADA systems with Shodan',
        'How do I use Shodan for OSINT recon?',
        'Show me a query to find a specific vulnerability',
      ]
    : pathname.startsWith('/report-generator')
    ? [
        'How do I use the report generator?',
        'How do I write a good executive summary?',
        'What CVSS score should I assign to SQLi?',
        'Help me write a finding for an exposed admin panel',
        'What sections should a pentest report have?',
      ]
    : pathname.startsWith('/payload')
    ? [
        'Explain how this payload works',
        'What reverse shell should I use for PHP?',
        'How do I bypass XSS filters?',
        'Explain the difference between SSTI and SSRF',
        'What payloads work against Java deserialization?',
      ]
    : [
        'What is GHOSTNET and how do I navigate it?',
        'Where should a beginner start?',
        'What tools does GHOSTNET have?',
        'Give me a learning path for offensive security',
        'What is covered in the labs vs concept pages?',
      ]

  return (
    <>
      <style>{`
        .ghost-btn{position:fixed;bottom:24px;right:24px;z-index:9000}
        .ghost-panel{position:fixed;bottom:70px;right:24px;z-index:9001;width:420px;max-height:60vh}
        @media(max-width:768px){
          .ghost-btn{bottom:12px;right:12px}
          .ghost-panel{bottom:54px;right:8px;left:8px;width:auto;max-height:70vh}
        }
      `}</style>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="ghost-btn"
        style={{
          height: '32px', borderRadius: '6px',
          background: open ? 'rgba(0,212,255,0.12)' : 'rgba(0,255,65,0.08)',
          border: '1px solid ' + (open ? 'rgba(0,212,255,0.5)' : 'rgba(0,255,65,0.35)'),
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '4px 10px', gap: '5px',
          boxSizing: 'border-box' as const,
          transition: 'all 0.2s',
        }}
        title="GHOST Agent"
      >
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00ff41', boxShadow: '0 0 5px #00ff41', animation: 'pulse-green 2s infinite', flexShrink: 0 }} />
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', fontWeight: 700, color: open ? '#00d4ff' : '#00ff41', letterSpacing: '0.1em' }}>GHOST AGENT</div>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="ghost-panel" style={{
          background: '#080c0a',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: '10px',
          boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,212,255,0.1)',
          display: 'flex', flexDirection: 'column',
          fontFamily: 'JetBrains Mono, monospace',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(0,212,255,0.15)',
            background: 'rgba(0,212,255,0.04)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff41', boxShadow: '0 0 8px #00ff41', animation: 'pulse-green 2s infinite', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#00d4ff', letterSpacing: '0.15em' }}>GHOST AGENT</div>
              <div style={{ fontSize: '8px', color: '#2a5a6a', letterSpacing: '0.1em', marginTop: '1px' }}>
                {moduleCtx.split('\n')[0].replace('LOCATION:', '').trim().toUpperCase().slice(0, 50)}
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a5a6a', fontSize: '16px', padding: '0 4px', lineHeight: 1 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            {loading && (
              <div style={{ padding: '4px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '3px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#00d4ff', fontWeight: 700 }}>GH</div>
                <TypingIndicator />
              </div>
            )}
            {error && (
              <div style={{ margin: '8px 16px', padding: '8px 12px', background: 'rgba(255,65,54,0.06)', border: '1px solid rgba(255,65,54,0.2)', borderRadius: '4px', color: '#ff4136', fontSize: '0.72rem' }}>
                Error: {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
              {quickPrompts.map((p, i) => (
                <button key={i} onClick={() => setInput(p)} style={{
                  background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)',
                  borderRadius: '3px', padding: '4px 10px', cursor: 'pointer',
                  color: '#5a9aaa', fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,212,255,0.4)'; (e.target as HTMLElement).style.color = '#00d4ff' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,212,255,0.15)'; (e.target as HTMLElement).style.color = '#5a9aaa' }}
                >{p}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(0,212,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask GHOST anything..."
                rows={2}
                style={{
                  flex: 1, background: 'rgba(0,212,255,0.04)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  borderRadius: '5px', padding: '8px 10px',
                  color: '#c8d8c8', fontSize: '0.78rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  resize: 'none' as const, outline: 'none',
                  lineHeight: 1.5,
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.5)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0,212,255,0.2)' }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim() ? 'rgba(0,212,255,0.05)' : 'rgba(0,212,255,0.15)',
                  border: `1px solid ${loading || !input.trim() ? 'rgba(0,212,255,0.1)' : 'rgba(0,212,255,0.5)'}`,
                  borderRadius: '5px', padding: '8px 14px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  color: loading || !input.trim() ? '#2a5a6a' : '#00d4ff',
                  fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600, letterSpacing: '0.05em',
                  transition: 'all 0.15s', height: '56px',
                }}
              >
                {loading ? '...' : 'SEND'}
              </button>
            </div>
            <div style={{ fontSize: '8px', color: '#1a3a3a', marginTop: '6px', letterSpacing: '0.08em' }}>
              ENTER to send · SHIFT+ENTER for new line · powered by Claude
            </div>
          </div>
        </div>
      )}
    </>
  )
}
