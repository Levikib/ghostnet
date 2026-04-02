'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#00ffff'

const steps: LabStep[] = [
  {
    id: 'network-01',
    title: 'ARP Poisoning',
    objective: 'ARP poisoning redirects traffic through your machine for a MITM attack. What tool performs ARP poisoning / spoofing on a LAN?',
    hint: 'A classic MITM tool: arpspoof (from dsniff) or ettercap. Both are valid.',
    answers: ['arpspoof', 'ettercap', 'bettercap', 'arp-scan'],
    xp: 20,
    explanation: 'arpspoof -i eth0 -t victim_ip gateway_ip sends fake ARP replies, poisoning the victim\'s ARP cache so their traffic routes through you. Enable IP forwarding first: echo 1 > /proc/sys/net/ipv4/ip_forward. Capture traffic with Wireshark.'
  },
  {
    id: 'network-02',
    title: 'Packet Capture',
    objective: 'Capture all traffic on your network interface. What tcpdump flag sets the capture interface?',
    hint: 'Short flag, one letter: -i for interface.',
    answers: ['-i', 'tcpdump -i', '-i eth0', '-i interface'],
    xp: 15,
    explanation: 'tcpdump -i eth0 -w capture.pcap captures all traffic to a file. Filters: -i eth0 port 80 (HTTP only), host 192.168.1.1 (specific IP), not port 22 (exclude SSH). Open pcap files in Wireshark for deep analysis.'
  },
  {
    id: 'network-03',
    title: 'DNS Spoofing',
    objective: 'DNS spoofing redirects domain lookups to attacker-controlled IPs. What configuration file in ettercap defines DNS spoof entries?',
    hint: 'The file is in /etc/ettercap/ and ends in .dns',
    answers: ['etter.dns', '/etc/ettercap/etter.dns', 'etter.conf'],
    flag: 'FLAG{dns_spoof_configured}',
    xp: 30,
    explanation: 'Edit /etc/ettercap/etter.dns to add: *.target.com A 10.0.0.1. Then run: ettercap -T -q -i eth0 -P dns_spoof -M arp /victim// /gateway//. Victims querying target.com now resolve to your IP where you serve a phishing page.'
  },
  {
    id: 'network-04',
    title: 'SSL Stripping',
    objective: 'SSL stripping downgrades HTTPS connections to HTTP. What tool combines ARP poisoning and SSL stripping?',
    hint: 'The tool is "bettercap" — it does ARP, DNS, and SSL stripping in one framework.',
    answers: ['bettercap', 'sslstrip', 'mitmproxy', 'ettercap'],
    xp: 25,
    explanation: 'bettercap -iface eth0 then in the interactive shell: net.probe on, arp.spoof on, https.proxy on. bettercap handles SSL stripping via its https.proxy module, automatically downgrading HTTPS to HTTP for intercepted connections.'
  },
  {
    id: 'network-05',
    title: 'Port Knocking Discovery',
    objective: 'Port knocking hides services behind a sequence of connection attempts. What nmap script detects port knocking sequences?',
    hint: 'There\'s no direct nmap script — you use nmap to probe and observe responses, or use "knock" client tool.',
    answers: ['knock', 'knockd', 'nmap', 'hping3'],
    flag: 'FLAG{network_attack_mastered}',
    xp: 35,
    explanation: 'The "knock" client sends the knock sequence: knock target_ip 1234 5678 9012. After the correct sequence, the hidden port opens temporarily. Use nmap before/after to confirm. hping3 can also send knock sequences with precise control.'
  }
]

export default function NetworkAttacksLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#006a6a' }}>
        <Link href="/" style={{ color: '#006a6a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/network-attacks" style={{ color: '#006a6a', textDecoration: 'none' }}>NETWORK ATTACKS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#006a6a', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-08 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>Network Attacks Lab</h1>
        <p style={{ color: '#5a8a8a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          ARP poisoning, packet capture, DNS spoofing, SSL stripping, and port knocking.
          Complete all 5 steps to earn 125 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #00ffff22', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="network-attacks-lab"
        moduleId="network-attacks"
        title="Network Attacks Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
