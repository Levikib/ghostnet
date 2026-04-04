'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '@/app/components/ModuleCodex'

const mono = 'JetBrains Mono, monospace'
const accent = '#00ff41'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && (
      <div style={{ fontFamily: mono, fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>
        {label}
      </div>
    )}
    <pre style={{
      background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px',
      padding: '1.25rem', overflow: 'auto', color: accent,
      fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre'
    }}>
      {children}
    </pre>
  </div>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{
    fontFamily: mono, fontSize: '0.85rem', fontWeight: 600,
    color: '#00b32c', marginTop: '2rem', marginBottom: '0.75rem'
  }}>
    &#9658; {children}
  </h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
    {children}
  </p>
)

const Note = ({ type, children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: ['#00ff41', 'rgba(0,255,65,0.05)', 'NOTE'],
    warn: ['#ffb347', 'rgba(255,179,71,0.05)', 'WARNING'],
    danger: ['#ff4136', 'rgba(255,65,54,0.05)', 'CRITICAL'],
    tip: ['#00d4ff', 'rgba(0,212,255,0.05)', 'TIP'],
  }
  const [color, bg, label] = configs[type || 'info']
  return (
    <div style={{
      background: bg, borderLeft: '3px solid ' + color,
      padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0',
      margin: '1.5rem 0', border: '1px solid ' + color + '33', borderLeftColor: color
    }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #1a2e1e' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#00b32c', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #0e1a10', background: i % 2 === 0 ? 'transparent' : 'rgba(0,255,65,0.015)' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'how-tor-works',
    title: 'How Tor Works',
    difficulty: 'BEGINNER',
    readTime: '12 min',
    labLink: '/modules/tor/lab',
    takeaways: [
      'Tor routes traffic through 3 relays (guard, middle, exit) with layered encryption - each relay only knows its immediate neighbours.',
      'Directory authorities (9 hardcoded servers) produce a consensus document that all Tor clients use to discover relays.',
      'Guard nodes are kept stable for months to reduce the window of traffic correlation attacks.',
      'Exit nodes see cleartext traffic to the destination - never trust exit nodes with sensitive unencrypted data.',
      'Tor protects network-layer identity but cannot protect against browser fingerprinting, JS exploits, or user behaviour mistakes.',
    ],
    content: (
      <div>
        <H3>Onion Routing - The Core Concept</H3>
        <P>
          Tor (The Onion Router) was originally developed by the US Naval Research Laboratory and is now maintained by the non-profit Tor Project. The fundamental idea is onion routing: your traffic is wrapped in multiple layers of encryption, like an onion, and each relay in a chain peels exactly one layer before forwarding to the next. No single relay knows both where you came from and where you are going.
        </P>
        <P>
          When you connect through Tor, your client builds a 3-hop circuit: a guard node (entry), a middle relay, and an exit node. Your Tor client negotiates encryption keys separately with each of the three relays using Diffie-Hellman key exchange. The guard node knows your real IP but not your destination. The exit node knows your destination but not your real IP. The middle relay knows neither.
        </P>

        <H3>The Three Hops</H3>
        <Table
          headers={['Relay Position', 'Knows Your IP?', 'Knows Destination?', 'Role']}
          rows={[
            ['Guard (Entry)', 'YES', 'NO', 'First hop - knows who you are, not where you go'],
            ['Middle', 'NO', 'NO', 'Passes encrypted data - knows nothing useful alone'],
            ['Exit', 'NO', 'YES', 'Last hop - connects to clearnet destination on your behalf'],
          ]}
        />

        <H3>Encryption Layers</H3>
        <P>
          Your Tor client encrypts the payload three times - once for each relay - using the key agreed with each relay. The packet sent looks like: Encrypt(guard_key, Encrypt(middle_key, Encrypt(exit_key, actual_data))). The guard strips its layer and sees only an encrypted blob for the middle. The middle strips its layer. The exit strips the final layer and sees the original data in cleartext (if the destination is plain HTTP) or TLS-encrypted data (for HTTPS).
        </P>
        <Pre label="CONCEPTUAL ENCRYPTION LAYERS">
{`Client builds:  [ Guard_Layer [ Middle_Layer [ Exit_Layer [ YOUR DATA ] ] ] ]

Guard  receives: [ Guard_Layer [ ... opaque ... ] ]
Guard  decrypts: [ Middle_Layer [ Exit_Layer [ YOUR DATA ] ] ]  -- forwards to Middle

Middle receives: [ Middle_Layer [ ... opaque ... ] ]
Middle decrypts: [ Exit_Layer [ YOUR DATA ] ]                   -- forwards to Exit

Exit   receives: [ Exit_Layer [ YOUR DATA ] ]
Exit   decrypts: [ YOUR DATA ]                                  -- sends to destination`}
        </Pre>

        <H3>Directory Authorities</H3>
        <P>
          How does your Tor client know which relays exist? There are 9 hardcoded directory authority servers distributed across multiple countries and organisations. Every few hours they vote on a consensus document listing all known relays, their bandwidth, uptime, flags (Fast, Stable, Guard, Exit), and public keys. Your Tor client downloads this consensus and uses it to select relays for circuits. The 9 DAs are intentionally controlled by different parties so no single entity can manipulate the relay list.
        </P>

        <H3>Guard Node Selection and Persistence</H3>
        <P>
          Your Tor client selects a small set of guard nodes and keeps using them for months. This seems counter-intuitive - why not rotate guards? The reason is statistical: if you choose a new guard for every circuit, and an attacker controls even 5% of relays, over time they will eventually be your guard. By sticking to one guard, you either have a compromised guard or you do not - the outcome is decided once and stays fixed, limiting the attacker's opportunity.
        </P>

        <H3>Tor Cells - Wire Format</H3>
        <P>
          Tor uses a fixed-size cell structure of 512 bytes. Fixed-size cells prevent traffic analysis based on packet size variation. Each cell has a circuit ID (identifying which circuit it belongs to), a command byte (RELAY, CREATE, CREATED, DESTROY, etc.), and a payload. Multiple application streams (HTTP requests, etc.) are multiplexed over a single circuit using stream IDs within RELAY cells.
        </P>
        <Pre label="TOR CELL STRUCTURE (512 bytes)">
{`+-----------+----------+-------------------------------------------+
| CircID    | CMD      | Payload (509 bytes)                       |
| (4 bytes) | (1 byte) | StreamID + Digest + Len + Data            |
+-----------+----------+-------------------------------------------+

CMD values:
  0x01  CREATE    -- request to create new circuit
  0x02  CREATED   -- circuit created confirmation
  0x03  RELAY     -- relay cell (carries stream data)
  0x04  DESTROY   -- tear down circuit`}
        </Pre>

        <H3>Latency vs Anonymity Tradeoff</H3>
        <P>
          Tor is slow compared to a VPN or direct connection. Each cell must be encrypted/decrypted three times and hop across three separate servers. Tor also deliberately avoids optimisations like persistent TCP connections that would make traffic correlation easier. This latency is the price of anonymity. High-latency mix networks (like remailers) provide stronger anonymity but are impractical for interactive use.
        </P>

        <H3>Tor vs VPN - Fundamental Differences</H3>
        <Table
          headers={['Property', 'VPN', 'Tor']}
          rows={[
            ['Trust model', 'Trust the VPN provider entirely', 'No single point of trust'],
            ['Who knows your IP', 'VPN server + all destinations', 'Only guard node'],
            ['Who knows destination', 'VPN server', 'Only exit node'],
            ['Speed', 'Near-native speed', 'Significantly slower (3 hops)'],
            ['Anonymity', 'Pseudonymity only', 'Strong if used correctly'],
            ['Hidden services', 'No equivalent', 'Yes (.onion addresses)'],
            ['Exit compromise', 'N/A - VPN sees everything', 'Exit sees your cleartext (if HTTP)'],
          ]}
        />

        <H3>What Tor Does NOT Protect Against</H3>
        <Note type="danger">
          Tor anonymises your network connection - it does not make you magically anonymous. Many deanonymisation vectors exist at the application layer.
        </Note>
        <P>
          Exit nodes see cleartext if you use HTTP (not HTTPS). A malicious exit can modify traffic, inject content, or steal credentials. Even with HTTPS, an attacker who controls both your guard and your exit (end-to-end correlation) can correlate traffic timing to identify you. JavaScript in your browser can leak your real IP via WebRTC, reveal your timezone, canvas fingerprint, font list, screen resolution, and dozens of other identifying properties. Malware or exploits delivered over Tor bypass the anonymity entirely. Finally, your own behaviour - using the same username, writing style, or logging into personal accounts - can deanonymise you regardless of Tor.
        </P>
      </div>
    ),
  },

  {
    id: 'tor-browser-config',
    title: 'Tor Browser & Configuration',
    difficulty: 'BEGINNER',
    readTime: '10 min',
    labLink: '/modules/tor/lab',
    takeaways: [
      'Always verify the Tor Browser GPG signature before installation - the download could be compromised at the CDN level.',
      'Safest security level disables JavaScript entirely - essential for high-risk research but breaks most sites.',
      'Letterboxing rounds your window size to standard increments to prevent window-size fingerprinting.',
      'New Identity tears down all circuits and clears session state - use it when switching contexts entirely.',
      'Proxychains or torsocks can route other tools through Tor but they do not inherit browser-level fingerprinting protections.',
    ],
    content: (
      <div>
        <H3>Download and Signature Verification</H3>
        <P>
          Always download Tor Browser from torproject.org and verify the GPG signature. The Tor Project signs releases with their developer key. An attacker who compromises a CDN mirror could serve a malicious binary - signature verification catches this because they cannot forge the signature without the private key.
        </P>
        <Pre label="VERIFYING TOR BROWSER SIGNATURE (Linux)">
{`# Import Tor Project signing key
gpg --auto-key-locate nodefault,wkd --locate-keys torbrowser@torproject.org

# Verify the downloaded signature file against the installer
gpg --verify tor-browser-linux64-VERSION_ALL.tar.xz.asc \
              tor-browser-linux64-VERSION_ALL.tar.xz

# Expected output contains:
# Good signature from "Tor Browser Developers (signing key) <torbrowser@torproject.org>"
# Primary key fingerprint: EF6E 286D DA85 EA2A 4BA7  DE68 4E2C 6E87 9329 8290`}
        </Pre>

        <H3>Security Levels</H3>
        <P>
          Tor Browser has three security levels accessible via the shield icon. Standard enables all browser features - useful for general browsing but exposes fingerprinting surface. Safer disables JavaScript on non-HTTPS sites and blocks some media types. Safest disables JavaScript everywhere, restricts fonts to a hardcoded list, and blocks WebGL, SVG animations, and other rich content. For sensitive research, use Safest.
        </P>
        <Table
          headers={['Level', 'JS', 'WebGL', 'SVG Animations', 'Use Case']}
          rows={[
            ['Standard', 'ON', 'ON', 'ON', 'General browsing with Tor routing only'],
            ['Safer', 'HTTPS only', 'OFF', 'OFF', 'Moderate risk - most .onion research'],
            ['Safest', 'OFF', 'OFF', 'OFF', 'High risk - malware research, hostile sites'],
          ]}
        />

        <H3>Fingerprinting Protections</H3>
        <P>
          Tor Browser has extensive fingerprinting protections built in. Letterboxing rounds your visible viewport to standard increments (e.g. 1000x800, 1200x900) so your window resize behaviour does not reveal screen resolution. Fonts are restricted to a standard list - custom installed fonts are blocked. Canvas fingerprinting prompts for permission rather than silently returning unique pixel data. WebGL is blocked at Safer/Safest. Timezone is always reported as UTC regardless of your system timezone. Language is always reported as en-US.
        </P>
        <Note type="info">
          All Tor Browser users look identical to websites because they share the same fingerprint. The moment you deviate - resize to an odd window, enable a custom font, change language - you stand out from the crowd.
        </Note>

        <H3>about:config Hardening</H3>
        <Pre label="KEY ABOUT:CONFIG SETTINGS (already set by Tor Browser)">
{`privacy.resistFingerprinting          = true   // master fingerprint resistance
privacy.firstparty.isolate            = true   // isolate cookies per first-party
network.http.referer.hideOnionSource  = true   // do not leak .onion in Referer header
dom.webaudio.enabled                  = false  // audio fingerprint prevention
media.peerconnection.enabled          = false  // WebRTC disabled (IP leak prevention)
webgl.disabled                        = true   // at Safest level
javascript.enabled                    = false  // at Safest level`}
        </Pre>

        <H3>New Identity vs New Circuit</H3>
        <P>
          New Circuit (Tor menu in the toolbar) tears down the circuit for the current site and builds a new one, giving you a new exit node for that site. Your session cookies and other browser state are preserved - the site may still recognise you. New Identity (the broom icon or Ctrl+Shift+U) is more drastic: it closes all tabs, clears all cookies, cache, and session data, and builds entirely new circuits. Use New Identity when switching between completely different personas or contexts.
        </P>

        <H3>SOCKS5 Proxy for Other Tools</H3>
        <P>
          Tor Browser exposes a SOCKS5 proxy on 127.0.0.1:9150 (the Tor daemon itself uses 9050 when running standalone). You can route other command-line tools through this proxy. However, these tools do not benefit from Tor Browser&apos;s fingerprinting protections - they just get Tor routing.
        </P>
        <Pre label="ROUTING TOOLS THROUGH TOR">
{`# curl via Tor SOCKS5
curl --socks5-hostname 127.0.0.1:9050 http://check.torproject.org/api/ip

# wget via Tor
wget -e "https_proxy=socks5://127.0.0.1:9050" https://example.com

# torsocks wrapper (handles DNS through Tor automatically)
torsocks wget https://example.com
torsocks ssh user@HOSTNAME

# proxychains - configure /etc/proxychains4.conf:
# socks5  127.0.0.1 9050
proxychains4 nmap -sT -Pn TARGET_HOST`}
        </Pre>

        <H3>Verifying Tor is Working</H3>
        <Pre label="VERIFY TOR CONNECTION">
{`# Check from Tor Browser - visit:
# https://check.torproject.org/

# From command line with torsocks:
torsocks curl https://check.torproject.org/api/ip
# Response: {"IsTor":true,"IP":"EXIT_NODE_IP"}

# Check your exit IP (should not be your real IP):
torsocks curl https://api.ipify.org`}
        </Pre>

        <H3>Common Mistakes That Break Anonymity</H3>
        <Note type="danger">
          The most common anonymity failures are behavioural, not technical. Tor cannot protect you from yourself.
        </Note>
        <P>
          Logging into personal accounts (email, social media, forums) over Tor immediately links your Tor session to your real identity. Resizing the browser window to non-standard sizes creates a unique fingerprint. Installing browser extensions adds unique identifiers. Downloading files and opening them in external applications (PDF, Word, video) - those applications bypass Tor entirely and connect to the internet with your real IP. Using BitTorrent over Tor leaks your real IP through DHT and tracker protocols. Enabling plugins like Flash or Java (historical but worth knowing) bypasses Tor completely.
        </P>
      </div>
    ),
  },

  {
    id: 'bridges-censorship',
    title: 'Bridges & Censorship Circumvention',
    difficulty: 'INTERMEDIATE',
    readTime: '11 min',
    labLink: '/modules/tor/lab',
    takeaways: [
      'Bridges are unlisted Tor relays - they act as guard nodes that censors cannot easily block because their IPs are not public.',
      'obfs4 disguises Tor traffic as random bytes with no distinguishing header - the most widely used pluggable transport.',
      'Snowflake uses WebRTC and browser-based proxies to make Tor traffic look like video conferencing.',
      'meek uses domain fronting through major CDNs (Akamai, Azure) - blocking meek would mean blocking Microsoft/Akamai.',
      'In highly censored regions (China, Iran, Russia), bridges are often necessary before regular Tor even connects.',
    ],
    content: (
      <div>
        <H3>What Are Bridges?</H3>
        <P>
          Regular Tor relays are listed in the public consensus document that every Tor client downloads. Censors in restrictive countries can simply download this list and block all those IP addresses. Bridges are Tor relays that are not listed in the public consensus. Their IP addresses are kept semi-private and distributed only to users who request them. This makes them much harder to enumerate and block.
        </P>
        <P>
          Bridges function as guard nodes - they are the first hop in your Tor circuit. After the bridge, traffic continues through normal Tor relays. The bridge&apos;s job is purely to be the unlisted entry point that gets you into the Tor network from a censored network.
        </P>

        <H3>Bridge Types and Pluggable Transports</H3>
        <P>
          A vanilla bridge still sends recognisable Tor traffic - a network-level censor using deep packet inspection (DPI) can detect and block it even without knowing the IP. Pluggable transports (PTs) transform the Tor traffic to look like something else entirely.
        </P>
        <Table
          headers={['Transport', 'Disguise Method', 'Best For', 'Status']}
          rows={[
            ['vanilla', 'None - raw Tor TLS', 'IP-based blocking only', 'Limited use'],
            ['obfs4', 'Random bytes, no header', 'Most censored countries', 'Primary PT'],
            ['meek-azure', 'Domain fronting via Microsoft Azure CDN', 'Heavy DPI censorship', 'Active'],
            ['meek-amazon', 'Domain fronting via AWS CloudFront', 'Heavy DPI censorship', 'Active'],
            ['Snowflake', 'WebRTC, looks like video calls', 'China, Russia, Iran', 'Growing'],
            ['WebTunnel', 'HTTPS reverse proxy, mimics web browsing', 'Emerging censors', 'New'],
          ]}
        />

        <H3>obfs4 - The Workhorse Transport</H3>
        <P>
          obfs4 (obfuscation protocol version 4) transforms Tor traffic into a stream of uniformly random bytes. There is no recognisable header, no TLS handshake pattern, and no timing signature that DPI systems can match against a known protocol. The handshake uses an Elligator2-encoded Diffie-Hellman key exchange that is computationally indistinguishable from random data. The obfs4proxy binary (now maintained as lyrebird) handles the transformation before handing off to Tor.
        </P>

        <H3>meek - Domain Fronting</H3>
        <P>
          meek routes Tor traffic through major CDN providers. From the network perspective, you are making HTTPS requests to a CDN (e.g., ajax.aspnetcdn.com on Azure CDN). The TLS SNI and HTTP Host headers point to the CDN domain. The CDN forwards the request to a meek server that decapsulates the Tor traffic. Blocking this would require blocking all of Microsoft Azure or Amazon CloudFront - collateral damage that most censors are unwilling to cause.
        </P>
        <Note type="warn">
          meek is slow because CDN round-trip costs dominate. Use it only when obfs4 and Snowflake fail.
        </Note>

        <H3>Snowflake - WebRTC Proxying</H3>
        <P>
          Snowflake is a clever system where volunteers run browser extensions that act as temporary WebRTC proxies. When you use Snowflake, your Tor client initiates a WebRTC connection to one of these volunteer proxies. From the censor&apos;s perspective, you are doing WebRTC - the same protocol used for video conferencing in Google Meet or Zoom. The volunteer proxy forwards traffic to a Snowflake bridge server that connects into the Tor network. Because WebRTC connections are ephemeral and route through many different volunteer IPs, censors cannot maintain a block list.
        </P>

        <H3>Getting Bridges</H3>
        <Pre label="WAYS TO OBTAIN BRIDGE ADDRESSES">
{`# 1. Tor Browser built-in (Moat - uses domain fronting itself)
Tor Browser -> Connection Settings -> Request a bridge from torproject.org

# 2. Web interface
https://bridges.torproject.org/
Select transport type: obfs4, snowflake, etc.

# 3. Email (works when web is blocked)
Send blank email to: bridges@torproject.org
Subject: get transport obfs4

# 4. Telegram bot
@GetBridgesBot on Telegram`}
        </Pre>

        <H3>Configuring Bridges in torrc</H3>
        <Pre label="TORRC BRIDGE CONFIGURATION">
{`UseBridges 1
ClientTransportPlugin obfs4 exec /usr/bin/obfs4proxy
Bridge obfs4 IP_ADDRESS:PORT FINGERPRINT \
  cert=CERTIFICATE_STRING iat-mode=0

# Multiple bridges for redundancy:
Bridge obfs4 BRIDGE1_IP:PORT FINGERPRINT1 cert=CERT1 iat-mode=0
Bridge obfs4 BRIDGE2_IP:PORT FINGERPRINT2 cert=CERT2 iat-mode=0`}
        </Pre>

        <H3>Pluggable Transport Architecture</H3>
        <P>
          Tor itself does not implement pluggable transports - it delegates to external binaries via a well-defined API (PT spec). The obfs4proxy (lyrebird) binary listens on a local port, transforms traffic, and Tor connects to that local port instead of directly to the bridge. PT_STATE directory stores keys and configuration for the PT binary between sessions.
        </P>

        <H3>Censorship by Country</H3>
        <Table
          headers={['Country', 'Method', 'Recommended PT']}
          rows={[
            ['China (GFW)', 'Active probing + DPI - vanilla Tor blocked since 2009', 'Snowflake or obfs4'],
            ['Russia', 'RKN blocking Tor IPs since Dec 2021, some DPI', 'obfs4 or Snowflake'],
            ['Iran', 'DPI, Tor IPs blocked, throttling', 'obfs4, meek'],
            ['Belarus', 'IP blocking, some DPI', 'obfs4'],
            ['Turkmenistan', 'Nearly total blocking', 'Snowflake + meek combo'],
          ]}
        />
      </div>
    ),
  },

  {
    id: 'hidden-services',
    title: 'Hidden Services (.onion)',
    difficulty: 'INTERMEDIATE',
    readTime: '13 min',
    labLink: '/modules/tor/lab',
    takeaways: [
      '.onion v3 addresses are 56 characters of base32-encoded Ed25519 public key material - the address IS the public key.',
      'Both client and server build 3-hop circuits to a rendezvous point - the total path is 6 hops, keeping both sides anonymous.',
      'v2 .onion addresses (16 chars, SHA-1 based) were deprecated in 2021 and are no longer supported in modern Tor.',
      'The hidden service private key must be protected - losing it means losing your .onion address forever; stealing it means address hijacking.',
      'Client authorisation (v3 auth) allows operators to restrict access to specific Tor Browser users by exchanging x25519 keys.',
    ],
    content: (
      <div>
        <H3>v3 .onion Address Generation</H3>
        <P>
          A v3 .onion address is derived from an Ed25519 keypair. The public key is hashed, version bytes are appended, and the whole thing is base32-encoded to produce the 56-character address you see. Because the address is derived from the public key, it is self-authenticating - when your Tor client connects, it verifies the service&apos;s identity cryptographically. There is no certificate authority involved.
        </P>
        <Pre label="V3 ONION ADDRESS DERIVATION">
{`Ed25519 keypair generation:
  private_key  -> 64 random bytes
  public_key   -> 32 bytes derived from private key

Address construction:
  checksum  = H("3" || public_key || version_byte)[:2]
  address   = base32(public_key || checksum || version_byte) + ".onion"
  length    = 56 characters (+ ".onion" = 62 total)

Example:
  facebookwkhpilnemxj7asber7cybersecurityresearchonion (illustrative)
  Actual Facebook: facebookwkhpilnemxj7asber7cyber<...>.onion`}
        </Pre>

        <H3>Introduction Points and Rendezvous Points</H3>
        <P>
          A hidden service does not listen for connections directly. Instead, it establishes circuits to several introduction points in the Tor network and publishes their addresses in its HS descriptor (uploaded to HSDir relays, which index .onion descriptors). When a client wants to connect, it picks a rendezvous point, builds a circuit to it, and sends the rendezvous cookie to the hidden service via one of the introduction points. The service then builds its own circuit to the rendezvous point. The rendezvous point stitches the two circuits together.
        </P>
        <Pre label="HIDDEN SERVICE CONNECTION SETUP">
{`Hidden Service (HS) side:
  1. HS builds circuits to 3+ introduction points (IPs)
  2. HS publishes descriptor to HSDir relays
     Descriptor contains: IP addresses, public key, signature

Client side:
  3. Client fetches HS descriptor from HSDir
  4. Client picks a rendezvous point (RP) in the Tor network
  5. Client builds circuit to RP, sends rendezvous cookie to RP
  6. Client sends INTRODUCE1 cell to one IP:
       "meet me at RP X, here is the cookie"

  7. IP forwards introduction to HS
  8. HS builds circuit to RP, sends RENDEZVOUS1 with matching cookie
  9. RP stitches client circuit + HS circuit = 6-hop end-to-end path

Total hops: Client -> G1 -> M1 -> RP <- M2 <- G2 <- HS (6 hops)`}
        </Pre>

        <H3>Setting Up a Hidden Service</H3>
        <Pre label="TORRC HIDDEN SERVICE CONFIG">
{`# /etc/tor/torrc

HiddenServiceDir /var/lib/tor/hidden_service/
HiddenServicePort 80 127.0.0.1:8080
# Format: HiddenServicePort VIRTUAL_PORT TARGET_IP:TARGET_PORT
# The .onion address will appear in:
# /var/lib/tor/hidden_service/hostname
# Private key is in:
# /var/lib/tor/hidden_service/hs_ed25519_secret_key`}
        </Pre>
        <Note type="danger">
          Protect hs_ed25519_secret_key like a root password. Anyone with this file can impersonate your .onion address. Back it up securely offline.
        </Note>

        <H3>v2 vs v3 Onion Addresses</H3>
        <Table
          headers={['Property', 'v2 (deprecated)', 'v3 (current)']}
          rows={[
            ['Length', '16 characters', '56 characters'],
            ['Crypto', 'RSA-1024 + SHA-1', 'Ed25519 + SHA-3/BLAKE2'],
            ['Security', 'Broken - SHA-1 preimage feasible', 'Cryptographically strong'],
            ['Status', 'Removed in Tor 0.4.6+ (2021)', 'Required for all new services'],
            ['Self-auth', 'Weak', 'Strong - address IS the public key'],
          ]}
        />

        <H3>Client Authorisation (Stealth Authentication)</H3>
        <P>
          v3 hidden services support client authorisation - only clients with the correct key can decrypt the HS descriptor and connect. This is useful for private services (e.g., a private SecureDrop instance or internal C2). The operator generates x25519 keypairs and distributes the public keys to authorised clients.
        </P>
        <Pre label="CLIENT AUTHORISATION SETUP">
{`# Server side - torrc:
HiddenServiceDir /var/lib/tor/hidden_service/
HiddenServicePort 80 127.0.0.1:8080
HiddenServiceVersion 3
# Create client auth directory:
# /var/lib/tor/hidden_service/authorized_clients/
# Add one file per client: client_name.auth
# File content: descriptor:x25519:BASE32_PUBLIC_KEY

# Client side - add to DataDirectory/onion-auth/:
# Create file: SERVICE_ADDRESS.auth_private
# Content: SERVICE_ADDRESS_WITHOUT_ONION:descriptor:x25519:BASE32_PRIVATE_KEY`}
        </Pre>

        <H3>OPSEC Mistakes for Hidden Service Operators</H3>
        <P>
          Many hidden service operators have been deanonymised not through Tor compromise but through OPSEC failures. Common mistakes: the web server leaks the real IP in error pages or headers (e.g., Apache ServerTokens, default error pages with hostname). The application references clearnet URLs or assets that load in users&apos; browsers. The server timezone or language settings match a specific locale. Uptime patterns correlate with business hours in a specific timezone. File metadata (EXIF in images, document properties) contains real identifying information.
        </P>
        <Pre label="NGINX BEHIND HIDDEN SERVICE - HARDENING">
{`# nginx.conf hardening for hidden service backend

server {
    listen 127.0.0.1:8080;
    server_name localhost;

    server_tokens off;              # Hide nginx version
    more_clear_headers Server;      # Remove Server header entirely

    # Disable access logging or log to memory only
    access_log off;

    # Block requests that include real hostname
    if ($host !~ ^localhost$) { return 444; }
}`}
        </Pre>
      </div>
    ),
  },

  {
    id: 'opsec-tor',
    title: 'Operational Security for Tor Users',
    difficulty: 'INTERMEDIATE',
    readTime: '14 min',
    labLink: '/modules/tor/lab',
    takeaways: [
      'Threat modelling is the foundation of OPSEC - your adversary determines which attacks you need to defend against.',
      'A global passive adversary (ISP/nation-state) can correlate entry and exit traffic timing even without controlling Tor relays.',
      'Tails OS is the gold standard for anonymity - it runs from RAM, leaves no trace, and routes all traffic through Tor.',
      'Compartmentalisation means separate identities, separate machines (or VMs), and zero crossover between personas.',
      'Real-world deanonymisations (Ulbricht, Sabu) were almost always OPSEC failures, not Tor technical vulnerabilities.',
    ],
    content: (
      <div>
        <H3>Threat Modelling for Tor Users</H3>
        <P>
          The first step in any security plan is identifying your adversary. The protections you need against a school network administrator are completely different from what you need against a nation-state intelligence agency. Tor is not one-size-fits-all.
        </P>
        <Table
          headers={['Adversary', 'Capabilities', 'Tor Effectiveness']}
          rows={[
            ['ISP', 'See your traffic, metadata, timing', 'Strong - ISP sees only Tor guard connection'],
            ['Exit node operator', 'Read/modify cleartext traffic', 'Partial - use HTTPS, verify certs'],
            ['Nation-state (passive)', 'Observe large portions of internet traffic', 'Weak against timing correlation'],
            ['Nation-state (active)', 'Compromise relays, inject exploits', 'Weak - use Tails + Whonix'],
            ['Hidden service operator', 'Log your circuit timing, IP of rendezvous', 'Partial - they cannot see your real IP'],
            ['Law enforcement', 'Subpoena ISPs, compromised infrastructure', 'Depends on jurisdiction + HS OPSEC'],
          ]}
        />

        <H3>Global Passive Adversary (GPA) and Traffic Correlation</H3>
        <P>
          The academic threat that Tor explicitly does not defend against is the global passive adversary - an entity that can observe all internet traffic simultaneously. If an adversary can watch traffic entering the Tor network at your guard node and traffic exiting at the exit node, they can correlate the timing and volume patterns to identify your circuit, even without decrypting anything. This is an end-to-end timing attack.
        </P>
        <Note type="warn">
          Nation-state intelligence agencies (NSA, GCHQ, etc.) have access to a significant fraction of internet backbone traffic and have demonstrated traffic correlation capability. If you are targeted by such an adversary, Tor alone is insufficient.
        </Note>

        <H3>Sybil Attacks - Attacker-Controlled Relays</H3>
        <P>
          An attacker who controls both the guard and exit relay in your circuit can perform end-to-end correlation. Running many relays increases the probability of being selected. The Tor network has defences - relays from the same /16 subnet are never used together in a circuit, and bandwidth weights mean that a few high-bandwidth malicious relays gain outsized influence. The guard persistence mechanism limits exposure: if your guard is honest, you are safe even if your exit is malicious.
        </P>

        <H3>Tails OS - Amnesic Live System</H3>
        <P>
          Tails (The Amnesic Incognito Live System) is a live operating system you boot from a USB drive. All traffic goes through Tor by default - applications that try to connect directly are blocked at the firewall level. When you shut down, Tails wipes all RAM, leaving no forensic trace on the computer. There is no persistent disk state unless you explicitly configure an encrypted persistent volume.
        </P>
        <Pre label="TAILS THREAT MODEL PROPERTIES">
{`- Amnesic: RAM cleared on shutdown, no disk writes
- Tor-enforced: all outbound traffic through Tor (iptables rules)
- Application isolation: separate user for Tor Browser
- No swap: prevents sensitive data hitting disk
- MAC address spoofing: randomised on each boot
- Clock sync: adjusted to Tor consensus time to avoid timezone leaks
- Persistent volume: optional, LUKS-encrypted if configured`}
        </Pre>

        <H3>Whonix - Two-VM Model</H3>
        <P>
          Whonix uses a two-VM architecture: a Gateway VM that runs Tor and handles all networking, and a Workstation VM that can only communicate through the Gateway. The Workstation has no direct internet access - it cannot leak your real IP even if fully compromised, because network packets from the Workstation are physically forced through the Tor gateway at the hypervisor level. Whonix runs on any hypervisor (VirtualBox, KVM) and integrates tightly with Qubes OS.
        </P>

        <H3>Compartmentalisation Principles</H3>
        <P>
          Compartmentalisation means treating different identities and activities as completely separate with no crossover. Never use the same username, writing style, email, cryptocurrency wallet, or any identifying detail across compartments. Never access clearnet accounts from the same Tor session as sensitive research. Never post from a persona and then log into personal accounts - even from different browser windows on the same Tor Browser session.
        </P>

        <H3>Metadata Stripping</H3>
        <Pre label="STRIPPING METADATA BEFORE PUBLISHING">
{`# MAT2 (Metadata Anonymisation Toolkit 2)
mat2 document.pdf           # strip PDF metadata
mat2 photo.jpg              # strip EXIF from image
mat2 --inplace document.odt # strip in place

# ExifTool
exiftool -all= photo.jpg          # strip all metadata
exiftool -Author= -Creator= doc.pdf

# Check what metadata exists:
exiftool document.pdf
mat2 --show document.pdf`}
        </Pre>

        <H3>Real-World OPSEC Failures</H3>
        <Table
          headers={['Case', 'Failure', 'Lesson']}
          rows={[
            ['Ross Ulbricht (Silk Road)', 'Used personal Gmail, posted on clearnet forums as "altoid" linking to Silk Road, server IP leaked in CAPTCHA', 'Never mix clearnet identity with .onion operations'],
            ['Hector Monsegur (Sabu/LulzSec)', 'Connected to IRC without Tor once - one session revealed his real IP to FBI', 'One slip without Tor is enough - use Tails to enforce Tor'],
            ['Freedom Hosting operator', 'Server physically seized - no disk encryption on the server itself', 'Encrypt server storage, use offshore hosting'],
            ['Harvard bomb hoax', 'Used campus WiFi with Tor - the guard connection was the only Tor traffic from campus', 'Tor does not hide that you used Tor from your local network'],
          ]}
        />
      </div>
    ),
  },

  {
    id: 'running-relays',
    title: 'Running Tor Relays & Exit Nodes',
    difficulty: 'INTERMEDIATE',
    readTime: '12 min',
    labLink: '/modules/tor/lab',
    takeaways: [
      'Middle relays carry no legal risk - you never see plaintext traffic and are never the origin or destination.',
      'Exit nodes bear the operational complexity - abuse complaints, potential DMCA notices, and ISP policies must be managed.',
      'Guard flags are awarded by bandwidth authorities to stable, high-bandwidth relays that have been running for 8+ days.',
      'Nyx (formerly arm) is the standard terminal monitor for live relay statistics, circuit counts, and bandwidth.',
      'Exit notices (a posted legal disclaimer on your relay&apos;s DirPort) reduce abuse response burden by educating complaining parties.',
    ],
    content: (
      <div>
        <H3>Relay Types</H3>
        <Table
          headers={['Type', 'Position', 'Traffic Access', 'Legal Risk']}
          rows={[
            ['Guard/Middle', 'Entry or middle of circuit', 'Only encrypted blobs', 'Very low'],
            ['Exit', 'Last hop to internet', 'Cleartext (HTTP) or TLS metadata', 'Moderate - abuse complaints'],
            ['Bridge', 'Unlisted entry point', 'Encrypted Tor traffic', 'Low, similar to guard'],
            ['HSDir', 'Stores hidden service descriptors', 'Encrypted HS descriptors only', 'Very low'],
          ]}
        />

        <H3>Relay Requirements</H3>
        <P>
          To be useful to the Tor network, a relay needs consistent bandwidth (at least 100 KB/s committed, 500 KB/s+ to earn the Fast flag), stable uptime (the Stable flag requires median circuit uptime better than the median relay), and a static IP or stable DNS hostname. Most serious relays run on dedicated servers or VPS instances with unmetered bandwidth.
        </P>

        <H3>torrc for a Middle Relay</H3>
        <Pre label="MIDDLE RELAY TORRC CONFIGURATION">
{`# /etc/tor/torrc - Middle relay

Nickname MyMiddleRelay
ContactInfo your-email@example.com
ORPort 9001
DirPort 9030
ExitPolicy reject *:*          # No exit traffic - middle relay only
RelayBandwidthRate 10 MB       # Sustained rate
RelayBandwidthBurst 20 MB      # Burst capacity
AccountingMax 500 GB           # Monthly cap if on metered VPS
AccountingStart month 1 00:00  # Reset on 1st of each month`}
        </Pre>

        <H3>Exit Policy Configuration</H3>
        <P>
          Exit policies control which destinations your exit node will forward traffic to. The default reduced exit policy allows common ports (80, 443, 6667, etc.) while blocking ports commonly abused for spam and port scanning. You can start with the reduced policy and adjust based on your ISP&apos;s tolerance and your own comfort level.
        </P>
        <Pre label="EXIT NODE TORRC WITH REDUCED POLICY">
{`# /etc/tor/torrc - Exit node

Nickname MyExitRelay
ContactInfo your-abuse-email@example.com
ORPort 443                     # Use 443 to avoid port-based blocking
DirPort 80
ExitRelay 1

# Reduced exit policy - allows common ports, blocks abuse vectors:
ExitPolicy accept *:80         # HTTP
ExitPolicy accept *:443        # HTTPS
ExitPolicy accept *:6667       # IRC
ExitPolicy reject *:*          # block everything else

# Full default exit policy (uncomment to use):
# ExitPolicy accept *:*
# ExitPolicy reject *:*   # Tor inserts this automatically - never needed`}
        </Pre>

        <H3>Exit Node Legal Considerations</H3>
        <P>
          Running an exit node means your IP address will appear in server logs as the source of Tor users&apos; traffic. You will receive abuse complaints from hosting providers, copyright notices (DMCA in the US), and occasionally contact from law enforcement inquiring about specific traffic. An exit notice published on your relay&apos;s DirPort (a web page explaining the IP is a Tor exit) educates recipients before they escalate. The Tor Project provides a template exit notice. Most major datacenter providers (Hetzner, OVH, Frantech) are tolerant of exit nodes if you handle abuse responsively.
        </P>

        <H3>Relay Flags and the Consensus</H3>
        <P>
          Bandwidth authorities measure relay capacity directly. The consensus document assigns flags based on measurements and observed behaviour. The Guard flag requires a relay to be Fast, Stable, and have been running for at least 8 days with bandwidth above the median. The consensus weight determines what fraction of circuits use your relay - higher bandwidth equals more selection probability.
        </P>
        <Table
          headers={['Flag', 'Meaning', 'Requirement']}
          rows={[
            ['Fast', 'Above-median bandwidth', 'Measured bandwidth > 100 KB/s'],
            ['Stable', 'Long circuit lifetimes', 'Median circuit uptime above network median'],
            ['Guard', 'Eligible as entry guard', 'Fast + Stable + 8 days uptime'],
            ['Exit', 'Has non-reject-all exit policy', 'ExitPolicy allows some traffic'],
            ['HSDir', 'Stores HS descriptors', 'Stable + 96 hours uptime'],
            ['Running', 'Currently reachable', 'Checked every vote period'],
            ['Valid', 'Not flagged as bad', 'No manual BadExit designation'],
          ]}
        />

        <H3>Relay Monitoring with Nyx</H3>
        <Pre label="NYX RELAY MONITOR">
{`# Install nyx
pip install nyx

# Run (connects to Tor control port 9051)
nyx

# Nyx shows:
# - Real-time bandwidth graphs (upload/download)
# - Circuit count and types (guard/exit/hidden service)
# - Event log (warnings, errors, new circuits)
# - Connection list (relay fingerprints, not user IPs)
# - Tor config viewer

# Metrics and history also available at:
# https://metrics.torproject.org/rs.html
# Search by fingerprint, nickname, or IP`}
        </Pre>
      </div>
    ),
  },

  {
    id: 'dark-web-research',
    title: 'Dark Web Research & Threat Intelligence',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    labLink: '/modules/tor/lab',
    takeaways: [
      'Dark web research requires a strict analyst OPSEC posture - use Tails or a dedicated offline VM, never your daily machine.',
      'Law enforcement dark web takedowns use server misconfiguration, undercover operations, and informants - rarely Tor exploits.',
      'Cryptocurrency tracing tools (Chainalysis, CipherTrace) can de-anonymise Bitcoin transactions even through mixers.',
      'Monero (XMR) uses ring signatures and stealth addresses making blockchain analysis significantly harder than Bitcoin.',
      'Commercial threat intel platforms (Recorded Future, DarkOwl, Flashpoint) index dark web content safely without requiring direct access.',
    ],
    content: (
      <div>
        <H3>Dark Web Search and Discovery</H3>
        <P>
          The dark web is not indexed by Google. Discovering .onion content requires dedicated search engines and curated directories. Quality varies enormously - many links are dead, scams, or honeypots.
        </P>
        <Table
          headers={['Resource', 'Type', 'Notes']}
          rows={[
            ['Ahmia (ahmia.fi)', 'Search engine', 'Indexes only non-abusive .onion, accessible on clearnet'],
            ['Torch', 'Old .onion search engine', 'Large index, low quality filtering'],
            ['Haystak', '.onion search', 'Paid premium tier for full results'],
            ['dark.fail', 'Curated directory', 'Signed PGP links to verified market mirrors'],
            ['OnionScan', 'Crawler/scanner', 'Open source tool for .onion vulnerability research'],
          ]}
        />

        <H3>OnionScan - Dark Web OSINT Tool</H3>
        <Pre label="ONIONSCAN USAGE">
{`# OnionScan crawls .onion services and identifies:
# - Linked clearnet resources (leaking real server IP)
# - Server software version disclosure
# - Email addresses in page content
# - Bitcoin addresses
# - PGP keys
# - SSH key reuse across services

onionscan --torProxyAddress 127.0.0.1:9050 TARGET_ADDRESS.onion

# Output includes:
# - HTTP headers analysis
# - SSL certificate details
# - Related .onion addresses found
# - Potential deanonymisation indicators`}
        </Pre>

        <H3>Historical Market Takedowns - Law Enforcement Methodology</H3>
        <P>
          Understanding how major dark web markets were taken down is valuable threat intelligence for researchers. The pattern is consistent: Tor itself was almost never compromised. Operators were caught through OPSEC failures and traditional investigative techniques.
        </P>
        <Table
          headers={['Market', 'Takedown Method', 'Year']}
          rows={[
            ['Silk Road', 'Server IP leaked via CAPTCHA configuration, operator linked to clearnet forum posts as "altoid"', '2013'],
            ['Silk Road 2.0', 'Undercover FBI agent became an admin', '2014'],
            ['AlphaBay', 'Operator used personal email in welcome message, Tor security issue + Canadian arrest', '2017'],
            ['Hansa Market', 'Dutch police ran the market covertly for 27 days after seizure, collecting buyer/vendor data', '2017'],
            ['Welcome to Video', 'Bitcoin transaction tracing by IRS-CI identified operator wallets', '2019'],
          ]}
        />

        <H3>Cryptocurrency Tracing</H3>
        <P>
          Bitcoin is pseudonymous, not anonymous. The entire transaction history is public on the blockchain. Blockchain analysis companies (Chainalysis, CipherTrace, Elliptic) use cluster analysis (common input ownership heuristic, change address detection) combined with exchange KYC data to trace funds from dark web activity back to real identities. Many dark web arrests in 2018-2023 were driven by IRS Criminal Investigation using Chainalysis Reactor.
        </P>
        <P>
          Monero (XMR) is significantly harder to trace. Ring signatures make it unclear which input in a transaction actually signed it. Stealth addresses ensure each transaction uses a fresh one-time address. RingCT hides transaction amounts. Monero is the preferred currency for operational dark web activity precisely because blockchain analysis is far less effective.
        </P>
        <Pre label="BITCOIN VS MONERO PRIVACY">
{`Bitcoin:
  Transaction graph:  FULLY PUBLIC - every transaction visible
  Amounts:            FULLY PUBLIC
  Address reuse:      COMMON - clusters wallets
  Mixer effectiveness: PARTIAL - heuristics can often break CoinJoin
  LE tracing:         Routine with commercial tools

Monero (XMR):
  Transaction graph:  OBFUSCATED - ring signatures hide real sender
  Amounts:            HIDDEN - RingCT
  Addresses:          ONE-TIME stealth addresses per transaction
  LE tracing:         No known reliable method as of 2024
  IRS bounty:         USD 625K offered for Monero tracing tool (2020)`}
        </Pre>

        <H3>Analyst OPSEC for Dark Web Research</H3>
        <Note type="danger">
          Accessing dark web content on your daily work machine is inadvisable. Malicious content, browser exploits, and accidental downloads can compromise your machine or reveal your identity.
        </Note>
        <P>
          Corporate threat intelligence analysts typically use dedicated virtual machines with no persistent state, air-gapped from production networks. Never download and execute files from dark web sources - open file samples only in offline malware analysis sandboxes (Cuckoo, CAPE, any.run). Screenshots can contain metadata. Do not engage with vendors or forum members as this can constitute entrapment in some jurisdictions and creates an evidence trail.
        </P>

        <H3>Commercial Threat Intelligence Platforms</H3>
        <P>
          For corporate security teams, commercial platforms provide indexed dark web content without requiring direct access. Recorded Future continuously monitors Tor forums, paste sites, and marketplaces. DarkOwl maintains a historical archive of dark web content. Flashpoint focuses on criminal forums (XSS, Exploit, BreachForums). These platforms allow analysts to search for leaked credentials, breach data, and threat actor chatter without risking direct exposure.
        </P>
      </div>
    ),
  },

  {
    id: 'tor-attacks',
    title: 'Tor Attacks & Limitations',
    difficulty: 'ADVANCED',
    readTime: '16 min',
    labLink: '/modules/tor/lab',
    takeaways: [
      'Website fingerprinting attacks use machine learning on circuit traffic patterns to identify which site you are visiting - even over Tor.',
      'The FBI Operation Torpedo exploited a Firefox vulnerability to deploy a NIT (network investigative technique) that extracted real IPs.',
      'Tor + VPN configurations change who knows what about you - VPN before Tor hides Tor usage from ISP; Tor before VPN exits through a fixed IP.',
      'WebRTC, IPv6, and DNS must all be explicitly disabled/routed through Tor - browsers have multiple IP-leaking channels.',
      'OPSEC failures have deanonymised far more operators than technical Tor vulnerabilities - the human layer is the weakest.',
    ],
    content: (
      <div>
        <H3>Traffic Correlation Attacks</H3>
        <P>
          The classic attack against Tor is end-to-end traffic correlation. If an attacker can observe packets entering the Tor network at your guard and packets leaving the Tor network at the exit, statistical analysis of timing and volume can confirm they are the same stream with high confidence. The attacker does not need to decrypt anything. This works because Tor uses low-latency routing - packets must arrive at the destination quickly, limiting how much timing can be obfuscated.
        </P>
        <Pre label="TRAFFIC CORRELATION ATTACK MODEL">
{`Adversary observation points:
  [Your ISP / Guard ISP]  -->  can see: timing, volume of Tor entry
  [Exit ISP / Destination] --> can see: timing, volume of Tor exit

Attack:
  1. Record packet timing at entry (guard connection)
  2. Record packet timing at exit (exit -> destination)
  3. Correlate: if timing patterns match within threshold -> same circuit
  4. Result: your IP is linked to the destination

Defence:
  - High-latency mix networks (impractical for interactive use)
  - Circuit padding (WTF-PAD, Tor circuit padding framework)
  - Using hidden services (exit stays in Tor network)`}
        </Pre>

        <H3>Website Fingerprinting</H3>
        <P>
          Even without seeing both ends of a Tor circuit, an adversary who controls your guard node can perform website fingerprinting. Different websites have characteristic patterns of page size, number of objects, and timing of requests. Machine learning classifiers trained on these patterns can identify which website you are visiting with significant accuracy, even over Tor, because Tor uses fixed-size 512-byte cells (which limits but does not eliminate fingerprinting).
        </P>
        <Note type="warn">
          Defences include circuit padding (sending fake traffic to obscure patterns - partially implemented in Tor) and WTF-PAD (Website Traffic Fingerprinting Protection with Adaptive Padding). Research is ongoing.
        </Note>

        <H3>Guard Discovery Attack</H3>
        <P>
          If an attacker can cause you to use a circuit where they control the middle relay, they can measure the latency to the guard relay and use latency measurements to narrow down which relay is your guard. Combined with active probing, this can reveal your guard node. This attack is mitigated by guard persistence (you use the same guard for months, limiting probing opportunity) and by the three-guard approach in older Tor versions.
        </P>

        <H3>FBI Operation Torpedo - Browser Exploitation</H3>
        <P>
          In 2012, the FBI seized Freedom Hosting, a major hidden services hosting provider. Rather than immediately taking it down, they served a JavaScript exploit to visitors. The exploit (exploiting CVE-2013-1690, a Firefox memory corruption bug) ran code that sent a UDP packet directly to an FBI server, bypassing Tor entirely and revealing the visitor&apos;s real IP. This technique - called a Network Investigative Technique (NIT) - is a court-authorised malware deployment.
        </P>
        <Pre label="NIT EXPLOIT MODEL (OPERATION TORPEDO)">
{`1. FBI controls hidden service host
2. Visitor connects via Tor Browser
3. Page serves malicious JavaScript
4. JS exploits Firefox vulnerability (CVE-2013-1690)
5. Shellcode sends UDP packet to FBI server via real network stack
   (bypasses Tor SOCKS proxy - direct OS network call)
6. FBI server logs real source IP
7. Result: visitor deanonymised despite using Tor

Defence: Tor Browser Safest level (JS disabled) prevents all JS exploits
         Tails runs in a live environment, reducing persistence even if exploited`}
        </Pre>

        <H3>Tor + VPN Configurations</H3>
        <P>
          Combining Tor with a VPN changes the trust model and what information is visible to each party. Neither configuration is universally better - the right choice depends on your threat model.
        </P>
        <Table
          headers={['Configuration', 'ISP sees', 'VPN sees', 'Tor guard sees', 'Best for']}
          rows={[
            ['VPN before Tor (ISP - VPN - Tor)', 'VPN connection only, not Tor', 'Your real IP, Tor usage', 'VPN exit IP, not your real IP', 'Hiding Tor usage from ISP; country where Tor is blocked'],
            ['Tor before VPN (ISP - Tor - VPN)', 'Tor guard connection', 'Tor exit IP (not your real IP)', 'Your real IP', 'Fixed exit IP for services that block Tor exits'],
          ]}
        />
        <Note type="info">
          VPN before Tor is more common. If your VPN provider is trustworthy and your ISP logs Tor usage, this is the better choice. Tor before VPN is rarely needed and adds complexity without clear benefit for most users.
        </Note>

        <H3>IP Leak Vectors in Browsers</H3>
        <Pre label="IP LEAK VECTORS AND MITIGATIONS">
{`WebRTC leaks:
  Problem:  WebRTC STUN requests can bypass SOCKS proxy and expose real IP
  Fix:      about:config -> media.peerconnection.enabled = false
            (Tor Browser does this automatically)

IPv6 leaks:
  Problem:  If system has IPv6 and Tor circuit uses IPv4 exit, IPv6 traffic bypasses Tor
  Fix:      Disable IPv6 at OS level or use Tails (blocks IPv6 in iptables)

DNS leaks:
  Problem:  Applications using system resolver send DNS queries outside Tor
  Fix:      Tor Browser handles DNS internally via Tor
            For other tools: use torsocks (intercepts glibc resolver calls)
            Or: set DNSPort in torrc and configure system DNS to 127.0.0.1:53

Flash/Java (historical):
  Problem:  Plugins bypass browser proxy settings entirely
  Fix:      No modern browser supports NPAPI plugins; non-issue since 2017`}
        </Pre>

        <H3>Tor over Tor - Why It Is a Bad Idea</H3>
        <P>
          Routing Tor inside Tor (e.g., running Tor inside Whonix Gateway which itself routes through Tor) creates a longer circuit but does not improve anonymity. It increases the number of relays that can potentially correlate traffic, increases latency dramatically, and may create circuit conflicts. The Tor design is optimal for three hops - adding more hops does not linearly improve security and may reduce it.
        </P>

        <H3>BitTorrent Over Tor</H3>
        <P>
          BitTorrent over Tor does not provide anonymity and actively harms the Tor network. BitTorrent clients announce your real IP to trackers (via the announce URL query parameter), exchange IPs in DHT, and communicate directly with peers - all bypassing Tor. This has been observed in practice and documented. Additionally, BitTorrent generates high bandwidth that burdens exit nodes inappropriately.
        </P>

        <H3>Hidden Service Deanonymisation</H3>
        <P>
          Beyond the FBI NIT approach, hidden services can be deanonymised through: server misconfiguration leaking real IP (the most common method - error pages, debug endpoints, SSRF vulnerabilities), timing correlation of the 6-hop HS circuit, Sybil attacks against introduction points, HS descriptor correlation (if the same descriptor is seen fetched by a client before a site goes up), and OSINT on the operator (forum posts, cryptocurrency transactions, writing style analysis).
        </P>
      </div>
    ),
  },
]

export default function TorPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem',
        fontFamily: mono, fontSize: '0.7rem', color: '#5a7a5a'
      }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-01 // TOR &amp; DARKNET</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/modules/osint" style={{
            fontFamily: mono, fontSize: '0.65rem', color: '#5a7a5a',
            textDecoration: 'none', letterSpacing: '0.05em'
          }}>
            MOD-02: OSINT &amp; SURVEILLANCE &#8594;
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontFamily: mono, fontSize: '9px', letterSpacing: '0.2em',
          color: '#5a7a5a', textTransform: 'uppercase', marginBottom: '0.5rem'
        }}>
          MODULE 01 &middot; TOR &amp; DARKNET
        </div>
        <h1 style={{
          fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent,
          margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(0,255,65,0.4)'
        }}>
          TOR &amp; THE DARK WEB
        </h1>
        <p style={{ color: '#5a7a5a', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>
          Onion routing &middot; Hidden services &middot; Bridges &middot; OPSEC &middot; Relay operation &middot; Dark web intel &middot; Attacks &amp; limitations
        </p>
      </div>

      {/* Chapter overview stats */}
      <div className="module-stat-grid">
        {[
          ['8', 'CHAPTERS'],
          ['~2.5hr', 'TOTAL READ'],
          ['BEGINNER', 'DIFFICULTY'],
          ['MOD-01', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(0,255,65,0.04)', border: '1px solid rgba(0,255,65,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#1a4a1a', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <ModuleCodex moduleId="tor" accent={accent} chapters={chapters} />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #0a2010' }}>
        <div style={{ background: 'rgba(0,255,65,0.04)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-01 Interactive Lab</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#1a4a1a', marginBottom: '1.5rem' }}>17 steps &middot; 345 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/tor/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(0,255,65,0.6)', borderRadius: '6px', background: 'rgba(0,255,65,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(0,255,65,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/modules/osint" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#1a4a1a' }}>MOD-02: OSINT &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
