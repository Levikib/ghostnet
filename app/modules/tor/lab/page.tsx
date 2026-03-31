'use client'
import React from 'react'
import Link from 'next/link'

const H2 = ({ num, children }: { num: string; children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: '#ffb347', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.3)', padding: '2px 8px', borderRadius: '3px', fontSize: '0.65rem', letterSpacing: '0.15em' }}>LAB-{num}</span>
    {children}
  </h2>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: '#cc7a00', marginTop: '1.75rem', marginBottom: '0.6rem' }}>
    ▸ {children}
  </h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.88rem' }}>{children}</p>
)

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#ffb347', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>
      {children}
    </pre>
  </div>
)

const Alert = ({ type, children }: { type: 'info' | 'warn' | 'objective'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: ['#00d4ff', 'rgba(0,212,255,0.05)', 'INFO'],
    warn: ['#ff4136', 'rgba(255,65,54,0.05)', 'IMPORTANT'],
    objective: ['#ffb347', 'rgba(255,179,71,0.05)', 'OBJECTIVE'],
  }
  const [color, bg, label] = configs[type]
  return (
    <div style={{ background: bg, borderLeft: `3px solid ${color}`, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.25rem 0', border: `1px solid ${color}33`, borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid #0e1a10' }}>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#1a4a1a', marginTop: '2px', flexShrink: 0 }}>[ ]</span>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', lineHeight: 1.6 }}>{children}</span>
  </div>
)

export default function TorLab() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/tor" style={{ color: '#5a7a5a', textDecoration: 'none' }}>MOD-01 // TOR</Link>
        <span>›</span>
        <span style={{ color: '#ffb347' }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/modules/tor" style={{ textDecoration: 'none', padding: '3px 10px', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.15em' }}>← CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.3)', borderRadius: '3px', color: '#ffb347', fontSize: '8px', letterSpacing: '0.15em' }}>LAB</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 01 · LAB ENVIRONMENT</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: '#ffb347', margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(255,179,71,0.3)' }}>
          TOR LAB — PRACTICAL EXERCISES
        </h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', lineHeight: 1.6 }}>
          Hands-on exercises: installation · circuit analysis · hidden service setup · opsec verification · traffic analysis
        </p>
      </div>

      {/* Prerequisites */}
      <div style={{ background: '#0e1410', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>PREREQUISITES</div>
        <CheckItem>Linux environment (Ubuntu 22.04+ recommended) or WSL2 on Windows</CheckItem>
        <CheckItem>Basic terminal familiarity — cd, apt, curl, nano</CheckItem>
        <CheckItem>Read MOD-01 Concept page before starting labs</CheckItem>
        <CheckItem>Python 3 installed (for local server exercises)</CheckItem>
        <CheckItem>Network access (unrestricted — if behind firewall, bridges required)</CheckItem>
      </div>

      <Alert type="warn">
        All exercises in this lab are to be performed in controlled environments on systems you own or have explicit permission to test. The goal is understanding the technology and building security research skills.
      </Alert>

      {/* LAB 01 */}
      <H2 num="01">Installation & Verification</H2>
      <Alert type="objective">
        Install Tor and Tor Browser. Verify traffic is routing through the Tor network. Understand what your ISP can and cannot see.
      </Alert>

      <H3>Step 1: Install Tor Daemon (Linux/WSL)</H3>
      <Pre label="// INSTALL TOR">{String.raw`# Update package list
sudo apt update

# Install Tor and utilities
sudo apt install -y tor torsocks nyx curl

# Start Tor service
sudo systemctl start tor
sudo systemctl enable tor

# Check status — look for "Bootstrapped 100%"
sudo systemctl status tor
# or check logs:
sudo journalctl -u tor -f`}</Pre>

      <H3>Step 2: Verify Traffic Routing</H3>
      <Pre label="// CONFIRM TOR IS WORKING">{String.raw`# Check your real IP (without Tor)
curl https://api.ipify.org
# Note this IP down

# Check your IP through Tor
torsocks curl https://api.ipify.org
# This should show a DIFFERENT IP — a Tor exit node

# Official check endpoint
torsocks curl https://check.torproject.org/api/ip
# Expected output: {"IsTor":true,"IP":"xxx.xxx.xxx.xxx"}

# DNS leak check — ensure DNS queries go through Tor
torsocks curl https://dnsleaktest.com/api/detect
# All DNS servers shown should be Tor exit node DNS, not your ISP's`}</Pre>

      <H3>Step 3: Install Tor Browser (GUI)</H3>
      <Pre label="// TOR BROWSER — GRAPHICAL INTERFACE">{String.raw`# Method 1: Ubuntu/Debian package
sudo apt install torbrowser-launcher
torbrowser-launcher
# → Downloads and verifies the latest Tor Browser automatically

# Method 2: Manual (always verify signature)
# Download from: https://www.torproject.org/download/
# Verify: https://support.torproject.org/tbb/how-to-verify-signature/

# On WSL with X11/WSLg:
export DISPLAY=:0
torbrowser-launcher

# Windows: download .exe installer directly from torproject.org`}</Pre>

      <H3>Step 4: Understand What Your ISP Sees</H3>
      <Pre label="// NETWORK VISIBILITY ANALYSIS">{String.raw`# Your ISP can see:
# ✓ You are connecting to a Tor Guard node (IP + port)
# ✓ Connection timing and data volume
# ✗ What sites you visit
# ✗ Content of your traffic
# ✗ .onion addresses you access

# To hide Tor usage from ISP — use bridges:
# In Tor Browser: Settings → Connection → Use a bridge
# Select "obfs4" — traffic appears as random TLS, not Tor

# Test with Wireshark (if available):
# sudo wireshark &
# Filter: tcp.port == 9001 or tcp.port == 9030
# You'll see encrypted handshakes to Tor relays — no content visible`}</Pre>

      {/* LAB 02 */}
      <H2 num="02">Circuit Analysis with Nyx</H2>
      <Alert type="objective">
        Use Nyx to monitor Tor circuits in real time. Understand guard/middle/exit node selection. Learn to force new circuits.
      </Alert>

      <Pre label="// NYX — TOR MONITOR SETUP">{String.raw`# Install nyx
pip install nyx
# or: sudo apt install nyx

# Enable control port in torrc (required for nyx)
sudo nano /etc/tor/torrc

# Add/uncomment these lines:
ControlPort 9051
CookieAuthentication 1

# Restart Tor
sudo systemctl restart tor

# Launch nyx
nyx
# Requires: sudo or add your user to the debian-tor group
sudo usermod -aG debian-tor $USER`}</Pre>

      <Pre label="// READING NYX OUTPUT">{String.raw`# In Nyx, navigate with arrow keys:

# [1] Graph view: bandwidth in/out over time
# [2] Connection view: THIS IS THE KEY ONE
#   Shows each circuit leg:
#   INBOUND  ← connections from your Guard
#   OUTBOUND → your connections to Guard

# Circuit example display:
  172.xxx.xxx.xxx:9001   # Your Guard node IP:port
  ├── [GUARD]  DE  BandwidthRate: 50MB
  ├── [MIDDLE] NL  BandwidthRate: 30MB
  └── [EXIT]   SE  BandwidthRate: 20MB

# [3] Config editor: live torrc editing
# [4] Log view: Tor event stream

# Force a new circuit while in nyx:
# Press 'n' → NEWNYM signal → new circuit built
# Wait ~10 seconds for circuit to establish`}</Pre>

      <H3>Exercise: Map Your Circuit Geographically</H3>
      <Pre label="// CIRCUIT GEOLOCATION">{String.raw`# Get your current circuit node IPs from nyx
# Then look them up:

# Per IP:
torsocks curl https://ipapi.co/{IP_ADDRESS}/json/
# Returns: country, region, org (usually "Tor Node" or ISP name)

# Full circuit lookup script:
#!/bin/bash
# Save as circuit_map.sh
CIRCUIT_IPS=("IP1" "IP2" "IP3")  # Get from nyx
for ip in "\${CIRCUIT_IPS[@]}"; do
  echo "--- $ip ---"
  curl -s https://ipapi.co/$ip/json/ | python3 -m json.tool | grep -E '"country_name|city|org"'
done

# Goal: understand your circuit spans multiple countries
# Good circuit: DE → NL → SE (different jurisdictions)
# Avoid: All nodes in same country (easier correlation)`}</Pre>

      {/* LAB 03 */}
      <H2 num="03">Deploy a Local Hidden Service</H2>
      <Alert type="objective">
        Create a .onion hidden service running on your local machine. Access it through Tor Browser. Understand the rendezvous protocol in practice.
      </Alert>

      <Pre label="// STEP 1: CONFIGURE HIDDEN SERVICE IN TORRC">{String.raw`# Edit Tor configuration
sudo nano /etc/tor/torrc

# Add these lines (choose a port that isn't in use):
HiddenServiceDir /var/lib/tor/test_service/
HiddenServicePort 80 127.0.0.1:8888

# Version 3 onion addresses are default (56 chars)
# For explicit v3:
HiddenServiceVersion 3

# Save and restart Tor
sudo systemctl restart tor

# Wait ~30 seconds for service to register on the network`}</Pre>

      <Pre label="// STEP 2: GET YOUR .ONION ADDRESS">{String.raw`# Read the generated hostname
sudo cat /var/lib/tor/test_service/hostname
# Output: something like:
# 5cia4a3k7v2mnbc6c3xlbm4znfuvn...onion

# Also generated (keep these PRIVATE):
sudo ls /var/lib/tor/test_service/
# hostname       ← your .onion address
# hs_ed25519_public_key   ← public key
# hs_ed25519_secret_key   ← PRIVATE KEY — backup and protect this`}</Pre>

      <Pre label="// STEP 3: SERVE CONTENT">{String.raw`# Start a simple HTTP server on port 8888
mkdir -p ~/onion_site
echo "<html><body><h1>My Hidden Service</h1><p>Running on Tor</p></body></html>" > ~/onion_site/index.html

# Serve it
cd ~/onion_site
python3 -m http.server 8888
# → Serving HTTP on 0.0.0.0 port 8888

# Your service is now live at your .onion address`}</Pre>

      <Pre label="// STEP 4: ACCESS IT">{String.raw`# Open Tor Browser
# Navigate to: your_address.onion
# (paste the address from step 2)

# It should display your HTML page

# Also test with torsocks:
torsocks curl http://your_address.onion/
# Should return your HTML content

# Verify the circuit in Tor Browser:
# Click the padlock icon beside the address bar
# → Shows the .onion circuit (6 hops — 3 from client, 3 from service)

# Troubleshooting:
# If not loading after 2 min: check Tor is running, port 8888 is listening
sudo netstat -tlnp | grep 8888
systemctl status tor`}</Pre>

      <H3>Exercise: Identify Misconfigurations</H3>
      <Pre label="// COMMON HIDDEN SERVICE OPSEC FAILURES — TEST YOUR OWN">{String.raw`# 1. Check if server leaks IP in headers
torsocks curl -I http://your_address.onion/
# Look for: Server, X-Powered-By headers
# Bad: "Apache/2.4.41 (Ubuntu)" → version fingerprint
# Worse: Any header containing IP addresses

# 2. Check error pages
torsocks curl http://your_address.onion/nonexistent
# Default error pages often reveal: server software, OS, file paths

# 3. Check if Python server logs to stdout
# Look at your terminal — does it log client IPs?
# Python's http.server logs to stdout by default
# In a real service: disable access logs or ensure they only log onion-space

# Fix: custom server that strips identifying headers
# nginx config example:
# server_tokens off;
# proxy_hide_header X-Powered-By;`}</Pre>

      {/* LAB 04 */}
      <H2 num="04">Opsec Verification Exercises</H2>
      <Alert type="objective">
        Actively test your own anonymity setup for leaks. Understand browser fingerprinting, DNS leaks, and WebRTC exposure.
      </Alert>

      <Pre label="// BROWSER FINGERPRINT TEST">{String.raw`# In Tor Browser, visit these sites:
# (these are legitimate research/privacy tools)

# 1. Fingerprint check
https://coveryourtracks.eff.org
# → Shows how unique your browser fingerprint is
# Goal: "Your browser has a nearly-unique fingerprint" is BAD
# Tor Browser should show: "protected against tracking"

# 2. DNS leak test
https://dnsleaktest.com
# Click "Extended Test"
# ALL results should show Tor exit node AS numbers
# If you see your ISP's DNS → you have a DNS leak

# 3. IP leak check
https://browserleaks.com/ip
# Should show only your Tor exit node IP
# Check WebRTC section — WebRTC is DISABLED in Tor Browser by default

# 4. Canvas fingerprint test
https://browserleaks.com/canvas
# Tor Browser should return randomised canvas data each session`}</Pre>

      <Pre label="// COMMAND LINE LEAK TESTS">{String.raw`# Test without Tor (baseline — note your real details)
curl https://ipapi.co/json/ | python3 -m json.tool

# Test WITH torsocks
torsocks curl https://ipapi.co/json/ | python3 -m json.tool
# country, city, org should all be different — Tor exit node location

# Verify no traffic bypasses Tor
# Monitor all DNS queries:
sudo tcpdump -i any port 53
# While running torsocks, no DNS queries should appear here
# (Tor Browser resolves DNS inside Tor — no cleartext DNS)

# Check for IPv6 leaks (Tor only supports IPv4)
# If you have IPv6, disable it to prevent leaks:
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1`}</Pre>

      {/* LAB 05 */}
      <H2 num="05">Traffic Analysis (Defensive Understanding)</H2>
      <Alert type="objective">
        Capture and examine Tor traffic at the network layer to understand what an ISP-level observer sees — and what they don't.
      </Alert>

      <Pre label="// WIRESHARK / TCPDUMP — OBSERVE YOUR OWN TOR TRAFFIC">{String.raw`# Install tcpdump / wireshark
sudo apt install tcpdump wireshark-qt

# Capture traffic while using Tor Browser
sudo tcpdump -i eth0 -w tor_capture.pcap &
# Browse some .onion sites in Tor Browser for 1-2 minutes
sudo kill %1  # stop capture

# Analyse capture
wireshark tor_capture.pcap &

# What you will see:
# ✓ TLS 1.3 handshakes to specific IPs (your Guard nodes)
# ✓ Encrypted application data — CANNOT be read
# ✓ Packet sizes and timing (uniform/padded in some cases)
# ✗ You will NOT see: HTTP requests, URLs, .onion addresses, content

# Filter in Wireshark:
# ssl.handshake.type == 1    → TLS ClientHello (connection initiations)
# tcp.port == 9001           → Common Tor port
# ip.dst == GUARD_IP         → Traffic to your guard only

# Key insight: ISP sees encrypted blobs going to known Tor relay IPs
# That's all — this is what "metadata" exposure looks like in practice`}</Pre>

      <Pre label="// CORRELATION ATTACK SIMULATION (EDUCATIONAL)">{String.raw`# Understand timing correlation — how it works in theory

# Scenario: You visit a site at time T
# An adversary watching entry AND exit can see:
#   Entry:  packet burst at T, T+0.5s, T+1s
#   Exit:   packet burst at T+0.1s, T+0.6s, T+1.1s  (constant ~100ms delay)
# Statistical match → correlation

# Simulate on localhost (safe):
# Terminal 1: run a simple server
python3 -m http.server 9999

# Terminal 2: capture traffic
sudo tcpdump -i lo port 9999 -w local_capture.pcap

# Terminal 3: make timed requests
for i in {1..10}; do
  curl http://127.0.0.1:9999/ -s -o /dev/null
  sleep 0.5
done

# Analyse timing in Wireshark — observe packet timing
# Extrapolate: over a real Tor circuit, an adversary with
# visibility at both ends could run the same analysis at scale`}</Pre>

      {/* Challenge section */}
      <div style={{ marginTop: '3rem', background: '#0e1410', border: '1px solid rgba(255,179,71,0.2)', borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#cc7a00', letterSpacing: '0.2em', marginBottom: '1rem' }}>LAB CHALLENGE — SELF ASSESSMENT</div>
        {[
          'Can you explain why a 3-hop circuit is used and not 2 or 4?',
          'What does your ISP see when you use Tor with obfs4 bridges vs without?',
          'Why does Tor Browser have a fixed window size by default?',
          'What is the difference between a Tor circuit and a Tor stream?',
          'How would you configure a hidden service to have no identifying server headers?',
          'What information does the exit node have access to? How do you mitigate this?',
          'Can you correlate entry and exit traffic on your local machine? What does this prove?',
        ].map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #0a1208', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
            <span style={{ color: '#ffb347', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
            <span style={{ color: '#5a7a5a' }}>{q}</span>
          </div>
        ))}
      </div>

      {/* Footer nav */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/modules/tor" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← BACK TO CONCEPT</Link>
        <Link href="/modules/osint" style={{
          textDecoration: 'none',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          color: '#00ff41',
          padding: '8px 20px',
          border: '1px solid rgba(0,255,65,0.4)',
          borderRadius: '4px',
          background: 'rgba(0,255,65,0.06)',
        }}>
          NEXT MODULE: OSINT & SURVEILLANCE →
        </Link>
      </div>
    </div>
  )
}
