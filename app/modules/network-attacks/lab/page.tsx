'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#00ffff'
const moduleId = 'network-attacks'
const moduleName = 'Network Attacks'
const moduleNum = '08'
const xpTotal = 125

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
    objective: 'Port knocking hides services behind a sequence of connection attempts. What client tool sends knock sequences to a target?',
    hint: 'There\'s no direct nmap script — you use the "knock" client tool.',
    answers: ['knock', 'knockd', 'nmap', 'hping3'],
    flag: 'FLAG{network_attack_mastered}',
    xp: 35,
    explanation: 'The "knock" client sends the knock sequence: knock target_ip 1234 5678 9012. After the correct sequence, the hidden port opens temporarily. Use nmap before/after to confirm. hping3 can also send knock sequences with precise control.'
  }
]

export default function NetworkAttacksLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#006a6a' }}>
        <Link href="/" style={{ color: '#006a6a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/network-attacks" style={{ color: '#006a6a', textDecoration: 'none' }}>NETWORK ATTACKS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/network-attacks" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #003a3a', borderRadius: '3px', color: '#006a6a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
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
              {i === 0 && <span style={{ fontSize: '7px', color: '#003a3a', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4a8a8a' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP AVAILABLE
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE — LAUNCH FREE LAB BELOW
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
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#005a5a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Network Attacks Lab</h1>
          </div>
        </div>

        <p style={{ color: '#5a8a8a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          ARP poisoning, packet capture, DNS spoofing, SSL stripping, and port knocking.
          Type real commands, earn XP, and capture flags. Complete all 5 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(0,255,255,0.03)', border: '1px solid rgba(0,255,255,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#003a3a', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['ARP poisoning', 'MITM attacks', 'Packet capture', 'DNS spoofing', 'SSL stripping', 'bettercap framework', 'Port knocking', 'HSTS bypass'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#3a7a7a', background: 'rgba(0,255,255,0.06)', border: '1px solid rgba(0,255,255,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
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
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(0,255,255,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(0,255,255,0.4)' : '#003a3a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#005a5a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#4a8a8a' : '#005a5a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#005a5a' }}>Full Network Attacks Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(0,255,255,0.04)' : '#020808', border: '1px solid ' + (guidedDone ? 'rgba(0,255,255,0.25)' : '#001a1a'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#3a7a7a' : '#003a3a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#005a5a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a8a8a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Network Attacks
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#3a7a7a', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['arpspoof MITM', 'bettercap framework', 'Wireshark analysis', 'DNS spoofing', 'SSL stripping', 'VLAN hopping'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#003a3a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#4a8a8a' : '#003a3a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(0,255,255,0.6)' : '#003a3a'), borderRadius: '6px', background: guidedDone ? 'rgba(0,255,255,0.12)' : 'transparent', color: guidedDone ? accent : '#003a3a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(0,255,255,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#003a3a' }}>Complete all 5 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#020808' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#030a0a', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a7a' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any network attack technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #003a3a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a7a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — NETWORK ATTACK COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#020808', border: '1px solid #001a1a', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['echo 1 > /proc/sys/net/ipv4/ip_forward', 'Enable IP forwarding for MITM'],
                ['arpspoof -i eth0 -t victim gateway_ip', 'ARP poison victim to intercept traffic'],
                ['tcpdump -i eth0 -w cap.pcap', 'Capture all network traffic'],
                ['bettercap -iface eth0', 'Start bettercap MITM framework'],
                ['ettercap -T -q -i eth0 -M arp /victim// /gw//', 'ARP MITM with ettercap'],
                ['nmap -sn 192.168.1.0/24', 'Discover hosts on subnet'],
                ['nmap --script broadcast-arp-ping', 'ARP ping sweep'],
                ['scapy', 'Python packet crafting framework'],
                ['hping3 -S -p 80 target', 'Send crafted TCP SYN packets'],
                ['responder -I eth0 -rdwv', 'LLMNR/NBT-NS poisoning'],
                ['impacket-ntlmrelayx -tf targets.txt', 'NTLM relay attack'],
                ['nmap --script dns-brute example.com', 'DNS brute force with nmap'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#010606', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#4a8a8a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #001a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/network-attacks" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a7a7a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/cloud-security/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a7a7a' }}>MOD-09 CLOUD SECURITY LAB &#8594;</Link>
      </div>
    </div>
  )
}
