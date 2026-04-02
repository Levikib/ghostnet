'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#00ff41'

const steps: LabStep[] = [
  {
    id: 'tor-01',
    title: 'Install Tor & Check Service',
    objective: 'Install Tor and verify the service is running. Type the command to check Tor service status.',
    hint: 'Use systemctl to check service status. The service name is "tor".',
    answers: ['systemctl status tor', 'systemctl status tor.service', 'service tor status'],
    xp: 20,
    explanation: 'systemctl status tor shows whether the Tor daemon is active. A running Tor service means your traffic can now be routed through the Tor network.'
  },
  {
    id: 'tor-02',
    title: 'Configure torrc',
    objective: 'The main Tor config file controls all settings. What is the full path to the torrc configuration file?',
    hint: 'Tor config lives in /etc/tor/ on most Linux systems.',
    answers: ['/etc/tor/torrc', 'etc/tor/torrc'],
    xp: 20,
    explanation: '/etc/tor/torrc is the primary configuration file. You edit this to set up hidden services, SocksPort, exit policies, and bridge relays.'
  },
  {
    id: 'tor-03',
    title: 'Test SOCKS Proxy',
    objective: 'Tor exposes a SOCKS5 proxy on localhost. Type the curl command to test your external IP via the Tor SOCKS5 proxy on port 9050.',
    hint: 'curl has a --socks5 flag. The check URL is https://check.torproject.org/api/ip',
    answers: [
      'curl --socks5 localhost:9050 https://check.torproject.org/api/ip',
      'curl --socks5 127.0.0.1:9050 https://check.torproject.org/api/ip',
      'curl --socks5-hostname localhost:9050 https://check.torproject.org/api/ip'
    ],
    flag: 'FLAG{socks5_proxy_verified}',
    xp: 30,
    explanation: '--socks5 localhost:9050 routes the curl request through Tor. If IsTor returns true in the JSON response, your traffic is successfully anonymised through the Tor network.'
  },
  {
    id: 'tor-04',
    title: 'Hidden Service Setup',
    objective: 'To create a hidden service, you add directives to torrc. What directive sets the hidden service directory path?',
    hint: 'The directive starts with "HiddenService" and ends with "Dir".',
    answers: ['hiddenservicedir', 'HiddenServiceDir'],
    xp: 25,
    explanation: 'HiddenServiceDir points Tor to where it stores the private key and hostname file for your .onion address. Tor auto-generates the key pair on first start if the directory is empty.'
  },
  {
    id: 'tor-05',
    title: 'Verify .onion Address',
    objective: 'After starting a hidden service, Tor writes the .onion hostname to a file. What command reads that hostname file? (assume HiddenServiceDir is /var/lib/tor/hidden_service/)',
    hint: 'Use cat to read the file. The file is named "hostname".',
    answers: [
      'cat /var/lib/tor/hidden_service/hostname',
      'cat /var/lib/tor/hidden_service/hostname'
    ],
    flag: 'FLAG{onion_service_active}',
    xp: 35,
    explanation: 'The hostname file contains your v3 .onion address — a 56-character base32 string derived from the Ed25519 public key. Share this address to give others access to your hidden service.'
  }
]

export default function TorLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#3a6a3a' }}>
        <Link href="/" style={{ color: '#3a6a3a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/tor" style={{ color: '#3a6a3a', textDecoration: 'none' }}>TOR ANONYMITY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#3a6a3a', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-01 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>Tor Anonymity Lab</h1>
        <p style={{ color: '#6a8a6a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          Hands-on exercises covering Tor service management, SOCKS proxy configuration, and hidden service deployment.
          Complete all 5 steps to earn 130 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,255,65,0.04)', border: '1px solid rgba(0,255,65,0.15)', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="tor-lab"
        moduleId="tor"
        title="Tor Anonymity Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
