'use client'
import React from 'react'
import Link from 'next/link'

const S = ({ c, children }: { c?: string; children: React.ReactNode }) => (
  <span style={{ color: c || '#c8d8c8' }}>{children}</span>
)

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#5a7a5a', textTransform: 'uppercase' as const }}>{children}</span>
)

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: '#00ff41', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ color: '#1a4a1a', fontSize: '0.8rem' }}>//</span> {children}
  </h2>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: '#00b32c', marginTop: '2rem', marginBottom: '0.75rem' }}>
    ▸ {children}
  </h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)

const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: 'JetBrains Mono, monospace', background: '#050805', border: '1px solid #1a2e1e', borderRadius: '3px', padding: '2px 6px', color: '#00ff41', fontSize: '0.8rem' }}>{children}</code>
)

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#00ff41', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>
      {children}
    </pre>
  </div>
)

const Alert = ({ type, children }: { type: 'info' | 'warn' | 'danger' | 'beginner'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: ['#00ff41', 'rgba(0,255,65,0.05)', 'NOTE'],
    warn: ['#ffb347', 'rgba(255,179,71,0.05)', 'WARNING'],
    danger: ['#ff4136', 'rgba(255,65,54,0.05)', 'CRITICAL'],
    beginner: ['#00d4ff', 'rgba(0,212,255,0.05)', 'BEGINNER NOTE'],
  }
  const [color, bg, label] = configs[type]
  return (
    <div style={{ background: bg, borderLeft: '3px solid ' + color, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.5rem 0', border: '1px solid ' + color + '33', borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #1a2e1e' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#00b32c', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #0e1a10', background: i % 2 === 0 ? 'transparent' : 'rgba(0,255,65,0.015)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default function TorModule() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <span style={{ color: '#00ff41' }}>MOD-01 // TOR & DARK WEB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '3px', color: '#00ff41', fontSize: '8px', letterSpacing: '0.15em' }}>CONCEPT</span>
          <Link href="/modules/tor/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.15em' }}>LAB →</Link>
        </div>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Tag>MODULE 01 · CONCEPT PAGE</Tag>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#00ff41', margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(0,255,65,0.4)' }}>
          TOR & THE DARK WEB
        </h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', lineHeight: 1.6 }}>
          Onion routing architecture · Hidden services · Opsec · Threat model · Deanonymization vectors
        </p>
      </div>

      {/* Contents */}
      <div style={{ background: '#0e1410', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>TABLE OF CONTENTS</div>
        {[
          '01 — What Tor Is (and Isn\'t)',
          '02 — Onion Routing: The Architecture',
          '03 — Circuit Building — Guard, Middle, Exit',
          '04 — Hidden Services (.onion)',
          '05 — The Dark Web — Reality vs Myth',
          '06 — Tor Browser — Setup & Configuration',
          '07 — Operational Security (Opsec)',
          '08 — Deanonymization Vectors',
          '09 — Torsocks & CLI Usage',
          '10 — Tools & Resources',
        ].map((item, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', padding: '3px 0', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#1a4a1a' }}>›</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* SECTION 01 */}
      <H2>01 — What Tor Is (and Isn't)</H2>
      <Alert type="beginner">
        In plain English: Tor is a privacy tool that hides where your internet traffic is coming from. When you use Tor, your traffic bounces through 3 random computers around the world before reaching its destination. Each of those computers only knows the previous and next hop — no single computer knows both who you are AND where you are going. Think of it like passing a letter through 3 strangers, each only knowing who gave it to them and who to pass it to next.
      </Alert>
      <P>
        Tor (The Onion Router) is a free, open-source anonymity network originally developed in the mid-1990s by the United States Naval Research Laboratory for protecting US intelligence communications online. It was publicly released in 2002 and is now maintained by the non-profit Tor Project.
      </P>
      <P>
        Tor achieves anonymity by routing your internet traffic through a series of volunteer-operated servers (nodes/relays) worldwide, encrypting it in multiple layers — like an onion — so that no single node knows both the origin and destination of the traffic.
      </P>

      <Alert type="info">
        Downloading and using Tor Browser is completely legal in most countries. Tor itself is just an anonymity tool — the same technology used by journalists, activists, whistleblowers, and security researchers globally.
      </Alert>

      <H3>What Tor is NOT</H3>
      <Table
        headers={['MISCONCEPTION', 'REALITY']}
        rows={[
          ['Tor makes you 100% anonymous', 'Tor provides strong anonymity but has known attack vectors. No tool guarantees perfect anonymity.'],
          ['Tor is only used for illegal activity', 'Majority of Tor usage is legitimate: privacy, journalism, censorship bypass, research.'],
          ['The dark web is mostly illegal markets', 'Most .onion sites are privacy tools, forums, mirrors of clearweb sites, and whistleblower platforms.'],
          ['Tor encrypts everything end-to-end', 'Tor encrypts traffic between you and the exit node. Traffic from exit node to destination may be unencrypted unless HTTPS is used.'],
          ['Using Tor makes you invisible to everyone', 'Your ISP can see you are connected to Tor (not what you are accessing). Use bridges to mask this.'],
        ]}
      />

      {/* SECTION 02 */}
      <H2>02 — Onion Routing: The Architecture</H2>
      <Alert type="beginner">
        The &quot;onion&quot; metaphor: imagine wrapping a letter in 3 envelopes. The outermost envelope is addressed to Relay 1. Inside is an envelope addressed to Relay 2. Inside that is an envelope addressed to Relay 3. Inside that is the actual message for the website. Each relay only opens one envelope, sees the next address, and forwards — never seeing the full picture. This is exactly what Tor does with encryption.
      </Alert>
      <P>
        Onion routing works by wrapping your data in multiple layers of encryption — one layer for each relay in the circuit. Each relay only decrypts one layer, learns the next hop, and forwards the data. No single relay knows both who you are and where you&apos;re going.
      </P>

      <H3>The Layered Encryption Model</H3>
      <Pre label="// SIMPLIFIED PACKET FLOW">{String.raw`YOU ─── [Encrypted: Layer 3 + Layer 2 + Layer 1 + DATA] ──► GUARD NODE
                                                                    │
                              Strips Layer 3, sees: ─────────────────┘
                              [Encrypted: Layer 2 + Layer 1 + DATA] ──► MIDDLE NODE
                                                                              │
                                        Strips Layer 2, sees: ───────────────┘
                                        [Encrypted: Layer 1 + DATA] ──► EXIT NODE
                                                                              │
                                                  Strips Layer 1, sees: ─────┘
                                                  [DATA] ──► DESTINATION`}</Pre>

      <H3>Key Properties</H3>
      <Table
        headers={['PROPERTY', 'MEANING', 'SECURITY IMPLICATION']}
        rows={[
          ['Forward Secrecy', 'New encryption keys per circuit', 'Past sessions can\'t be decrypted if keys are compromised'],
          ['Circuit Isolation', 'Different circuits for different tabs/streams', 'Prevents correlation across sessions'],
          ['Layered Encryption', '3 layers minimum per packet', 'Each node only sees adjacent hops'],
          ['Volunteer Relays', '~7,000 relays worldwide (2024)', 'Decentralised — no single point of failure or control'],
        ]}
      />

      {/* SECTION 03 */}
      <H2>03 — Circuit Building: Guard, Middle, Exit</H2>
      <Alert type="beginner">
        Think of the three nodes as three different jobs with different amounts of sensitive information. The Guard node is the one that knows your real IP — it is like the front door. The Middle node is a pure relay, the safest role — it knows neither your IP nor your destination. The Exit node connects to the actual website — it sees the destination but not your IP. This separation of knowledge is the core of why Tor works.
      </Alert>
      <P>
        When you open Tor Browser, the Tor client builds a 3-hop circuit through the network. The selection of each relay is not random — it&apos;s weighted by bandwidth, uptime, and flags assigned by directory authorities.
      </P>

      <H3>The Three Node Types</H3>
      <Table
        headers={['NODE TYPE', 'KNOWS', 'DOES NOT KNOW', 'NOTES']}
        rows={[
          ['Guard (Entry)', 'Your real IP address', 'Your destination, what you are accessing', 'Same guard used for 2-3 months to reduce exposure'],
          ['Middle', 'Guard IP, Exit IP', 'Your IP, your destination', 'Pure relay — highest privacy'],
          ['Exit', 'Middle IP, destination', 'Your real IP address', 'Most sensitive role — can see unencrypted traffic if no HTTPS'],
        ]}
      />

      <Alert type="warn">
        The exit node can observe unencrypted traffic between itself and the destination. Always use HTTPS. An adversary running exit nodes is a real attack vector — this is how several criminal operations have been exposed.
      </Alert>

      <H3>Circuit Lifecycle</H3>
      <Pre label="// CIRCUIT BUILD PROCESS">{String.raw`1. Tor client fetches network consensus from directory authorities
   → Signed list of all relays with flags, bandwidth, fingerprints

2. Client selects Guard node (stable, high-bandwidth, Guard flag)
   → Establishes TLS connection
   → Negotiates Tor-specific handshake (ntor protocol)

3. Client extends circuit through Guard to Middle node
   → Encrypted EXTEND cell sent via Guard
   → Guard forwards to Middle, circuit extended

4. Client extends circuit through Middle to Exit node
   → Same process — circuit now 3 hops

5. Traffic flows through established circuit
   → New circuit every 10 minutes for streams
   → NEWNYM signal forces new circuit immediately`}</Pre>

      {/* SECTION 04 */}
      <H2>04 — Hidden Services (.onion)</H2>
      <Alert type="beginner">
        A .onion address is a website that only exists inside the Tor network. There is no DNS (domain name system) involved — the .onion address IS the cryptographic public key of the server. You cannot reach it with a regular browser or find it on Google. Both the visitor and the server remain anonymous, because they connect to a shared meeting point inside Tor rather than directly to each other.
      </Alert>
      <P>
        Hidden services (now called Onion Services) allow servers to host websites and services accessible only through Tor, without revealing the server&apos;s IP address. Both the client and server remain anonymous.
      </P>

      <H3>How .onion Addresses Work</H3>
      <P>
        A .onion address is derived cryptographically from the service's public key. Version 3 onion addresses (current standard) are 56 characters and encode an Ed25519 public key, a version byte, and a checksum.
      </P>

      <Pre label="// V3 ONION ADDRESS ANATOMY">{String.raw`e.g.: 2gzyxa5ihm7nsggfxnu52rck2vv4rvmdlkiu3zzui5du4xyclen53wid.onion

Structure: [ 32-byte Ed25519 pubkey ] + [ 2-byte checksum ] + [ 1-byte version ]
Encoded:   Base32 → 56 characters + .onion TLD

// The address IS the public key — no DNS, no central registry
// You cannot look up who owns an onion address
// The service is only reachable through Tor`}</Pre>

      <H3>Rendezvous Protocol</H3>
      <Pre label="// HOW CLIENT CONNECTS TO HIDDEN SERVICE">{String.raw`1. Service generates keypair → derives .onion address from pubkey
2. Service picks "Introduction Points" in Tor network
3. Service publishes encrypted descriptor to Distributed Hash Table (DHT)
   → Descriptor contains: introduction point list, pubkey, signatures

4. Client downloads descriptor from DHT using .onion address
5. Client picks a "Rendezvous Point" (any Tor relay)
6. Client sends one-time secret to rendezvous point
7. Client sends "Introduce" message to service via introduction point
   → Contains: rendezvous point address, one-time secret, Diffie-Hellman data

8. Service connects to rendezvous point, sends matching DH data
9. Encrypted circuit established: Client ◄──6 hops──► Service
   → Neither party knows the other's IP
   → End-to-end encryption throughout`}</Pre>

      {/* SECTION 05 */}
      <H2>05 — The Dark Web: Reality vs Myth</H2>
      <P>
        The "dark web" refers specifically to content on .onion hidden services. The "deep web" is simply any content not indexed by search engines (your email, banking portals, private databases) — a common confusion in media coverage.
      </P>

      <H3>What's Actually On .onion Networks</H3>
      <Table
        headers={['CATEGORY', 'EXAMPLES', 'NOTES']}
        rows={[
          ['Privacy tools', 'ProtonMail .onion, Signal gateway, secure drop', 'Legitimate — censorship resistance'],
          ['News & journalism', 'NYT, BBC, DW all have .onion mirrors', 'For readers in censored regions'],
          ['Whistleblowing', 'SecureDrop (used by 50+ news orgs)', 'Industry standard for source protection'],
          ['Search engines', 'Ahmia, Torch, Haystak', 'Index publicly accessible .onion content'],
          ['Forums & communities', 'Privacy forums, security research discussion', 'Range from legitimate to grey areas'],
          ['Scams', 'Fake markets, fake services, phishing', 'Majority of "exciting" looking sites are scams'],
          ['Criminal markets', 'Drug markets, stolen data, malware', 'Exist, but actively monitored by law enforcement'],
        ]}
      />

      <Alert type="warn">
        Law enforcement agencies globally (FBI, Europol, NCA) run active operations on dark web markets. Many have been infiltrated for extended periods before takedowns. The Silk Road, AlphaBay, Hansa, Genesis Market takedowns all involved deep undercover access before shutdown.
      </Alert>

      {/* SECTION 06 */}
      <H2>06 — Tor Browser: Setup & Configuration</H2>

      <H3>Installation</H3>
      <Pre label="// OFFICIAL DOWNLOAD — ALWAYS FROM TORPROJECT.ORG ONLY">{String.raw`# Linux (Debian/Ubuntu)
sudo apt install tor torbrowser-launcher
torbrowser-launcher

# Or manual download + verify signature:
wget https://www.torproject.org/dist/torbrowser/13.0.x/tor-browser-linux64-13.0.x.tar.xz
wget https://www.torproject.org/dist/torbrowser/13.0.x/tor-browser-linux64-13.0.x.tar.xz.asc

# Import Tor Project signing key
gpg --auto-key-locate nodefault,wkd --locate-keys torbrowser@torproject.org

# Verify signature
gpg --verify tor-browser-linux64-13.0.x.tar.xz.asc

# Windows/macOS: download installer from torproject.org
# Verify SHA256 hash on download page before running`}</Pre>

      <H3>Security Levels Explained</H3>
      <Table
        headers={['LEVEL', 'JAVASCRIPT', 'MEDIA', 'USE CASE']}
        rows={[
          ['Standard', 'Enabled', 'All media enabled', 'General browsing — most usable'],
          ['Safer', 'HTTP sites only: disabled', 'Some media restricted', 'Recommended baseline'],
          ['Safest', 'Disabled everywhere', 'Fonts/math/audio/video blocked', 'High-risk research, maximum protection'],
        ]}
      />

      <H3>Critical Browser Settings</H3>
      <Pre label="// CONFIGURATION — ABOUT:CONFIG (ADVANCED)">{String.raw`# Never change these — Tor Browser sets them for anonymity:
browser.privatebrowsing.autostart = true
privacy.resistFingerprinting = true
network.proxy.type = 1  (SOCKS5 through Tor)

# Bridges (if Tor is blocked or you want to hide Tor usage from ISP):
# Settings → Connection → Use a bridge
# Built-in options: obfs4 (recommended), meek-azure, snowflake
# Request bridges: bridges.torproject.org or email bridges@torproject.org

# Stream isolation: each tab gets a different Tor circuit
# New Identity: clears all state + new circuits
# New Tor Circuit: new circuit for current tab only`}</Pre>

      {/* SECTION 07 */}
      <H2>07 — Operational Security (Opsec)</H2>
      <Alert type="beginner">
        Opsec (operational security) means not accidentally revealing who you are through your behaviour, even when your technical tools are working correctly. The best lock on your front door does not help if you leave your name and address taped to it. With Tor: the technology can be perfect, but if you log into your Gmail account through Tor, Google (and anyone watching) now knows it is you. Most real Tor-related arrests came from these human mistakes, not from breaking the cryptography.
      </Alert>
      <P>
        Technical anonymity tools fail when operational security fails. Most Tor-related identification comes not from breaking the cryptography, but from user behaviour, metadata, and mistakes.
      </P>

      <H3>Core Opsec Principles</H3>
      <Table
        headers={['RULE', 'REASON', 'COMMON MISTAKE']}
        rows={[
          ['Never resize Tor Browser window', 'Screen size is a fingerprint', 'Maximising window reveals resolution'],
          ['Never log into personal accounts', 'Immediately deanonymises session', 'Logging into Google, social media'],
          ['Use HTTPS only', 'Exit nodes can read unencrypted traffic', 'Assuming Tor encrypts destination traffic'],
          ['Never open documents while online', 'PDFs/docs can ping external servers with real IP', 'Opening .doc files downloaded via Tor'],
          ['Disable JavaScript when possible', 'JS can leak real IP, fingerprint browser', 'Keeping default Standard security level'],
          ['No torrenting over Tor', 'BitTorrent bypasses Tor, leaks real IP', 'Using Tor for "anonymous" torrenting'],
          ['Never mix identities', 'Correlating across sessions breaks anonymity', 'Using same username on Tor and clearweb'],
          ['Tor over VPN vs VPN over Tor', 'Different threat models — understand the difference', 'Assuming VPN + Tor = double security without thinking'],
        ]}
      />

      <H3>Tor over VPN vs VPN over Tor</H3>
      <Pre label="// ARCHITECTURE COMPARISON">{String.raw`TOR OVER VPN (VPN → Tor):
You → [VPN] → [Guard] → [Middle] → [Exit] → Internet
  ✓ VPN hides Tor usage from ISP
  ✓ VPN provider cannot see your Tor traffic
  ✗ VPN provider knows your real IP
  ✗ Exit node can still observe unencrypted traffic
  Best for: hiding Tor usage from ISP/network

VPN OVER TOR (Tor → VPN):
You → [Guard] → [Middle] → [Exit] → [VPN] → Internet
  ✓ VPN server cannot see your real IP
  ✓ Protects against exit node surveillance
  ✗ VPN provider sees all your traffic (decrypted)
  ✗ Complex to configure correctly
  ✗ VPN payment must be anonymous (crypto)
  Best for: accessing VPN-only services anonymously`}</Pre>

      {/* SECTION 08 */}
      <H2>08 — Deanonymization Vectors</H2>
      <P>
        Understanding how Tor users have been identified is the most important knowledge for both opsec and security research. The attacks below are real — most from documented law enforcement operations.
      </P>

      <H3>Traffic Correlation Attacks</H3>
      <P>
        If an adversary can observe both the traffic entering the Tor network (at your Guard node) and the traffic exiting (at the Exit node), they can correlate timing and volume patterns to identify you. This is the most theoretically powerful attack against Tor.
      </P>

      <Pre label="// TRAFFIC CORRELATION — SIMPLIFIED">{String.raw`Adversary observes:
  Entry:  Packets of size X at timestamps T1, T2, T3...
  Exit:   Packets of size X at timestamps T1+Δ, T2+Δ, T3+Δ...

Statistical correlation → high confidence you = the exit traffic

Requirements: Global passive adversary (ISP-level, state-level)
Real examples: Academic research shows ~90% accuracy given enough data
Defense: Low-latency networks like Tor are fundamentally vulnerable to this
          High-latency mixnets (like Nym) resist it better`}</Pre>

      <H3>Known Deanonymization Methods</H3>
      <Table
        headers={['ATTACK VECTOR', 'METHOD', 'REAL-WORLD EXAMPLE']}
        rows={[
          ['Traffic correlation', 'Timing analysis of entry/exit traffic', 'Academic research — requires global adversary'],
          ['Application-layer leaks', 'JS, Flash, WebRTC leaking real IP', 'Playpen operation (FBI, 2015) — 0-day Firefox exploit'],
          ['Operational mistakes', 'Logging into real accounts, consistent style', 'Silk Road — Ross Ulbricht used personal email in early posts'],
          ['Exit node monitoring', 'Running malicious exit nodes, capturing traffic', 'Dan Egerstad (researcher) captured embassy credentials 2007'],
          ['Bad random number generation', 'Weak entropy for key generation', 'Historical Linux entropy issues'],
          ['Social engineering', 'Convincing target to reveal info', 'Many dark web arrests came from undercover agents'],
          ['Server misconfiguration', 'Hidden service revealing real server IP', 'Apache logs, error messages containing IP addresses'],
          ['Bitcoin tracing', 'Blockchain analysis linking payments to identity', 'Many market busts — blockchain is NOT anonymous'],
        ]}
      />

      <Alert type="danger">
        The most common cause of Tor-related arrests is NOT breaking the cryptography. It's operational mistakes: reusing usernames, logging into personal accounts, poor opsec around payment, writing style analysis, and social engineering. Technology rarely fails — humans do.
      </Alert>

      {/* SECTION 09 */}
      <H2>09 — Torsocks & CLI Usage</H2>
      <P>
        Torsocks is a wrapper that forces any application's TCP traffic through Tor's SOCKS5 proxy. Essential for using command-line tools anonymously.
      </P>

      <Pre label="// TORSOCKS — INSTALLATION & BASIC USAGE">{String.raw`# Install
sudo apt install torsocks tor

# Start Tor service
sudo systemctl start tor
sudo systemctl enable tor  # auto-start on boot

# Verify Tor is running
systemctl status tor

# Wrap any command with torsocks
torsocks curl https://check.torproject.org/api/ip
# → Should return a Tor exit node IP, not your real IP

torsocks wget https://example.com
torsocks ssh user@server.com
torsocks git clone https://github.com/...

# Run a shell where all TCP goes through Tor
torsocks bash

# Configure SOCKS5 proxy manually (port 9050)
# For apps that support proxy settings:
Host: 127.0.0.1
Port: 9050
Type: SOCKS5`}</Pre>

      <Pre label="// RUNNING YOUR OWN TOR HIDDEN SERVICE (LOCAL TEST)">{String.raw`# Edit torrc configuration
sudo nano /etc/tor/torrc

# Add these lines:
HiddenServiceDir /var/lib/tor/my_service/
HiddenServicePort 80 127.0.0.1:8080

# Restart Tor
sudo systemctl restart tor

# Get your .onion address
sudo cat /var/lib/tor/my_service/hostname
# → outputs something like: abc123xyz...onion

# Start a local web server on port 8080
python3 -m http.server 8080

# Your site is now accessible via Tor at your .onion address`}</Pre>

      <Pre label="// USEFUL TOR CLI COMMANDS">{String.raw`# Check Tor circuit information
nyx  # (install: pip install nyx)

# Force new circuit (new identity)
# In Tor Browser: Hamburger menu → New Identity
# Via CLI (if control port enabled):
echo -e 'AUTHENTICATE ""\r\nSIGNAL NEWNYM\r\nQUIT' | nc 127.0.0.1 9051

# Check if your IP appears as a Tor exit
curl https://check.torproject.org/api/ip

# DNS over Tor (prevent DNS leaks)
# Tor Browser handles this automatically
# For system Tor: configure /etc/resolv.conf to use 127.0.0.1:9053`}</Pre>

      {/* SECTION 10 */}
      <H2>10 — Tools & Resources</H2>

      <H3>Essential Tools</H3>
      <Table
        headers={['TOOL', 'PURPOSE', 'INSTALL']}
        rows={[
          ['Tor Browser', 'Main browser for .onion + anonymous clearweb', 'torproject.org'],
          ['Torsocks', 'Force CLI apps through Tor', 'apt install torsocks'],
          ['Nyx', 'Tor relay/circuit monitor (terminal UI)', 'pip install nyx'],
          ['OnionScan', 'Scan hidden services for misconfigurations', 'github.com/s-rah/onionscan'],
          ['Ahmia', 'Search engine for .onion sites', 'ahmia.fi (clearweb + .onion)'],
          ['Whonix', 'OS designed for Tor — full system anonymisation', 'whonix.org'],
          ['Tails OS', 'Amnesic OS that routes all traffic through Tor', 'tails.boum.org'],
        ]}
      />

      <H3>Research Resources</H3>
      <Table
        headers={['RESOURCE', 'CONTENT']}
        rows={[
          ['Tor Project documentation (torproject.org/docs)', 'Official technical specs, design papers, protocols'],
          ['tor-design.pdf', 'Original Dingledine/Mathewson/Syverson design paper (2004)'],
          ['Tor Blog (blog.torproject.org)', 'Security advisories, research updates, new features'],
          ['IETF RFC 9000', 'Tor\'s use of QUIC protocol'],
          ['arxiv.org — search "Tor anonymity"', 'Academic research on attacks and defences'],
          ['EFF Surveillance Self-Defense (ssd.eff.org)', 'Practical threat modelling and tool guides'],
        ]}
      />

      {/* Footer nav */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← BACK TO MODULES</Link>
        <Link href="/modules/tor/lab" style={{
          textDecoration: 'none',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          color: '#00ff41',
          padding: '8px 20px',
          border: '1px solid rgba(0,255,65,0.4)',
          borderRadius: '4px',
          background: 'rgba(0,255,65,0.06)',
        }}>
          PROCEED TO LAB → MOD-01-LAB
        </Link>
      </div>
    </div>
  )
}
