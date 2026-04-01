'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#00ff41'
const accentDim = 'rgba(0,255,65,0.1)'
const accentBorder = 'rgba(0,255,65,0.3)'

const H2 = ({ num, children }: { num: string; children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ background: accentDim, border: '1px solid ' + accentBorder, padding: '2px 8px', borderRadius: '3px', fontSize: '0.65rem', letterSpacing: '0.15em' }}>LAB-{num}</span>
    {children}
  </h2>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: '#00cc33', marginTop: '1.75rem', marginBottom: '0.6rem' }}>
    ▸ {children}
  </h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.88rem' }}>{children}</p>
)

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a6a3a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>
      {children}
    </pre>
  </div>
)

const Alert = ({ type, children }: { type: 'info' | 'warn' | 'objective' | 'note'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: ['#00d4ff', 'rgba(0,212,255,0.05)', 'INFO'],
    warn: ['#ff4136', 'rgba(255,65,54,0.05)', 'IMPORTANT'],
    objective: [accent, accentDim, 'OBJECTIVE'],
    note: ['#ffb347', 'rgba(255,179,71,0.05)', 'BEGINNER NOTE'],
  }
  const [color, bg, label] = configs[type]
  return (
    <div style={{ background: bg, borderLeft: '3px solid ' + color, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.25rem 0', border: '1px solid ' + color + '33', borderLeftColor: color }}>
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
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/modules/tor" style={{ textDecoration: 'none', padding: '3px 10px', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.15em' }}>← CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: accentDim, border: '1px solid ' + accentBorder, borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em' }}>LAB</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a6a3a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 01 · LAB ENVIRONMENT</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: accent, margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(0,255,65,0.3)' }}>
          TOR & ANONYMITY — LAB
        </h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', lineHeight: 1.6 }}>
          Hands-on exercises: installation · circuit analysis · hidden service deployment · opsec verification · traffic inspection · bridge configuration
        </p>
      </div>

      {/* Lab Environment Setup */}
      <div style={{ background: '#0a130a', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a6a3a', letterSpacing: '0.2em', marginBottom: '1rem' }}>LAB ENVIRONMENT SETUP</div>
        <P>These exercises require a Linux environment. Ubuntu 22.04 LTS (bare metal or VM) is recommended. WSL2 works for most exercises but has limitations with GUI tools like Wireshark.</P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '8px' }}>REQUIRED TOOLS</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.8 }}>
              tor · torsocks · nyx<br />
              curl · python3<br />
              tcpdump · wireshark<br />
              torbrowser-launcher
            </div>
          </div>
          <div style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '8px' }}>ENVIRONMENT OPTIONS</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.8 }}>
              Ubuntu 22.04 VM (VirtualBox)<br />
              Kali Linux (all tools pre-installed)<br />
              WSL2 (partial — no GUI)<br />
              TryHackMe AttackBox
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <CheckItem>Linux environment with sudo access</CheckItem>
          <CheckItem>Internet connection (unrestricted, or use bridges if behind firewall)</CheckItem>
          <CheckItem>Read MOD-01 Concept page — understand onion routing before starting</CheckItem>
          <CheckItem>Python 3 installed — verify with: python3 --version</CheckItem>
          <CheckItem>At least 2GB free disk space for Tor Browser download</CheckItem>
        </div>
      </div>

      <Alert type="warn">
        All exercises are to be performed on systems you own or have explicit permission to test. Do not probe or scan third-party infrastructure. The goal is building understanding of anonymity technology for defensive and research purposes.
      </Alert>

      {/* LAB 01 */}
      <H2 num="01">Installing and Verifying Tor</H2>
      <Alert type="objective">
        Install the Tor daemon and Tor Browser. Confirm traffic is routing through the Tor network. Understand what identifying information is hidden vs. still visible.
      </Alert>
      <Alert type="note">
        The &quot;Tor daemon&quot; (tor) is a background service that routes traffic through the Tor network. It is separate from Tor Browser — the daemon is used by command-line tools, while Tor Browser is a full Firefox-based browser with all privacy settings pre-configured.
      </Alert>

      <H3>Step 1: Install Tor and Utilities</H3>
      <Pre label="// INSTALL TOR DAEMON + TOOLS">{`# Update your package list first
sudo apt update

# Install Tor, torsocks (CLI Tor proxy), nyx (monitor), and curl
sudo apt install -y tor torsocks nyx curl

# Start Tor and enable it on boot
sudo systemctl start tor
sudo systemctl enable tor

# Check that Tor is running — look for "Active: active (running)"
sudo systemctl status tor

# Watch the logs to confirm Tor bootstrapped successfully
# You are looking for the line: "Bootstrapped 100% (done): Done"
sudo journalctl -u tor -f
# Press Ctrl+C to stop following logs once you see 100%`}</Pre>

      <H3>Step 2: Verify Your Traffic Routes Through Tor</H3>
      <P>The key test: your IP address should be different when accessed through Tor. The torsocks command wraps any program and forces its traffic through Tor.</P>
      <Pre label="// CONFIRM TOR IS WORKING — IP CHECK">{`# Step 1: Check your real IP (direct connection)
curl https://api.ipify.org
# Write this IP down — this is your actual public IP

# Step 2: Check your IP through Tor
torsocks curl https://api.ipify.org
# This should show a COMPLETELY DIFFERENT IP — a Tor exit node
# If the IPs match, Tor is not working correctly

# Official Tor Project check — most reliable
torsocks curl https://check.torproject.org/api/ip
# Expected response: {"IsTor":true,"IP":"xxx.xxx.xxx.xxx"}
# If IsTor is false, your traffic is NOT going through Tor

# DNS leak check — confirm DNS queries also go through Tor
torsocks curl https://1.1.1.1/cdn-cgi/trace | grep ip
# The IP shown should be the same Tor exit node IP, not your real IP`}</Pre>

      <H3>Step 3: Install Tor Browser</H3>
      <Pre label="// TOR BROWSER INSTALLATION">{`# Method 1: Ubuntu/Debian package manager (recommended)
sudo apt install torbrowser-launcher
torbrowser-launcher
# This automatically downloads, verifies, and launches Tor Browser

# Method 2: Manual install (if package not available)
# Download the .tar.xz from https://www.torproject.org/download/
# Always verify the signature — see torproject.org/docs/verifying-signatures/

# WSL2 with WSLg (Windows 11) — GUI forwarding
export DISPLAY=:0
torbrowser-launcher

# Windows: download the .exe installer from torproject.org directly
# Mac: download the .dmg from torproject.org

# Verify Tor Browser is using Tor:
# Open https://check.torproject.org in Tor Browser
# You should see: "Congratulations. This browser is configured to use Tor."`}</Pre>

      <H3>Step 4: Understand What Remains Visible to Your ISP</H3>
      <Pre label="// VISIBILITY ANALYSIS — WHAT YOUR ISP CAN SEE">{`# What your ISP CAN see when you use Tor:
# - You are connecting to a Tor Guard node (its IP and port)
# - The timing and size of your encrypted traffic
# - That you are using Tor (unless you use bridges — covered in Lab 06)

# What your ISP CANNOT see:
# - Which websites you visit
# - What .onion addresses you access
# - Any content of your traffic
# - The full path through the Tor network

# To verify using tcpdump (run this while browsing with Tor Browser):
sudo tcpdump -i eth0 -n host YOUR_GUARD_IP
# Replace YOUR_GUARD_IP with the first hop shown in Tor Browser's circuit
# Click the padlock icon in Tor Browser address bar to see your circuit
# You will see encrypted packets — no readable HTTP content`}</Pre>

      {/* LAB 02 */}
      <H2 num="02">Circuit Analysis with Nyx</H2>
      <Alert type="objective">
        Use Nyx to monitor live Tor circuits. Read the guard/middle/exit hop breakdown. Force new circuits on demand and map each hop geographically.
      </Alert>
      <Alert type="note">
        A Tor &quot;circuit&quot; is the 3-hop path your traffic takes: Guard node (knows your IP) → Middle node (anonymous relay) → Exit node (connects to the destination). Each hop only knows the previous and next hop — no single node knows both who you are and what you are accessing.
      </Alert>

      <H3>Step 1: Enable Nyx Control Port</H3>
      <Pre label="// CONFIGURE TOR CONTROL PORT FOR NYX">{`# Nyx connects to Tor via the Control Port
# This port must be enabled in Tor's config file (torrc)

sudo nano /etc/tor/torrc

# Find and uncomment (or add) these two lines:
ControlPort 9051
CookieAuthentication 1

# Save the file (Ctrl+O, Enter, Ctrl+X in nano)

# Restart Tor to apply the changes
sudo systemctl restart tor

# Add your user to the debian-tor group so nyx can authenticate
sudo usermod -aG debian-tor $USER

# Log out and back in for group change to take effect
# Or use: newgrp debian-tor`}</Pre>

      <H3>Step 2: Launch and Navigate Nyx</H3>
      <Pre label="// USING NYX — KEY NAVIGATION">{`# Launch nyx
nyx

# Navigation:
# Arrow keys  — move between items
# Left/Right  — switch between views
# 'n'         — send NEWNYM signal (force new circuit)
# 'q'         — quit

# View 1 (press left/right to reach): Bandwidth graph
# Shows upload/download speed over time as Tor is used

# View 2: Connections — THIS IS THE MOST USEFUL VIEW
# Lists every active Tor circuit with the 3 hops:
#
#   TYPE      IP:PORT             FINGERPRINT
#   INBOUND   172.xx.xx.xx:9001   --- (your guard node)
#     └─ GUARD   [DE] Bandwidth: 50MB
#     └─ MIDDLE  [NL] Bandwidth: 30MB
#     └─ EXIT    [SE] Bandwidth: 20MB
#
# DE/NL/SE = countries of each relay node

# View 3: Config editor — modify torrc settings live
# View 4: Log — real-time Tor event stream`}</Pre>

      <H3>Step 3: Map Your Circuit Geographically</H3>
      <Pre label="// GEOLOCATE YOUR CIRCUIT HOPS">{`# Get the IP addresses of your guard, middle, and exit nodes from nyx
# Then look each one up to see where it is located

# Single IP lookup:
curl https://ipapi.co/THE_IP_HERE/json/ | python3 -m json.tool
# Returns: country_name, city, region, org

# Check all three hops — you want nodes in different countries
# Example of a good circuit (different legal jurisdictions):
#   Guard:  Germany (DE)
#   Middle: Netherlands (NL)
#   Exit:   Sweden (SE)

# Example of a bad circuit (easier to correlate):
#   Guard:  USA
#   Middle: USA
#   Exit:   USA

# Force a new circuit to get different hops:
# In nyx: press 'n'
# Or via the control port:
echo 'AUTHENTICATE ""' | nc 127.0.0.1 9051
echo 'SIGNAL NEWNYM' | nc 127.0.0.1 9051
# Wait ~10 seconds, then check nyx again for the new circuit`}</Pre>

      {/* LAB 03 */}
      <H2 num="03">Deploy a Local Hidden Service</H2>
      <Alert type="objective">
        Configure a Tor hidden service on your local machine. Start a web server and access it exclusively through a .onion address. Understand how hidden services work at the configuration level.
      </Alert>
      <Alert type="note">
        A hidden service lets you host a website or service that is only accessible over Tor, through a .onion address. The server&apos;s real IP is never exposed to visitors. Both the client and server connect to a shared &quot;rendezvous point&quot; inside the Tor network — the server&apos;s location remains hidden.
      </Alert>

      <H3>Step 1: Configure the Hidden Service in torrc</H3>
      <Pre label="// HIDDEN SERVICE CONFIGURATION">{`# Edit the Tor configuration file
sudo nano /etc/tor/torrc

# Add these lines at the bottom of the file:
HiddenServiceDir /var/lib/tor/my_site/
HiddenServicePort 80 127.0.0.1:8888

# Explanation:
# HiddenServiceDir — where Tor stores the .onion address and private key
# HiddenServicePort 80 → maps port 80 (HTTP) to localhost:8888 (your server)
# Visitors connect to your .onion on port 80
# Tor forwards that traffic to your local server on port 8888

# Save and restart Tor
sudo systemctl restart tor

# Wait ~30 seconds for Tor to register your service on the network`}</Pre>

      <H3>Step 2: Get Your .onion Address</H3>
      <Pre label="// READ YOUR GENERATED .ONION ADDRESS">{`# Tor generates your .onion address automatically
# It is based on the cryptographic public key Tor creates for you

sudo cat /var/lib/tor/my_site/hostname
# Output will look like:
# abc123def456ghi789jkl012mno345pqr678stu901vwx234yz.onion
# (56 characters — this is a v3 onion address)

# See all generated files:
sudo ls -la /var/lib/tor/my_site/
# hostname              — your .onion address (public)
# hs_ed25519_public_key — the public key
# hs_ed25519_secret_key — PRIVATE KEY — protect this like a password
#                         losing it = losing your .onion address forever
#                         leaking it = someone can impersonate your service`}</Pre>

      <H3>Step 3: Start a Web Server and Access It</H3>
      <Pre label="// SERVE CONTENT AND ACCESS VIA TOR">{`# Create a simple HTML page to serve
mkdir -p ~/onion_site
cat > ~/onion_site/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>Hidden Service Test</title></head>
<body style="background:#000;color:#0f0;font-family:monospace">
  <h1>// HIDDEN SERVICE ACTIVE</h1>
  <p>You are accessing this via Tor. Your request was routed through
  multiple encrypted hops before reaching this server.</p>
</body>
</html>
EOF

# Start Python's built-in HTTP server on port 8888
cd ~/onion_site
python3 -m http.server 8888
# Output: Serving HTTP on 0.0.0.0 port 8888 ...

# Keep this running — open a new terminal for the next steps

# Open Tor Browser and navigate to your .onion address
# (paste the address from Step 2 — include the .onion suffix)

# Verify with torsocks from command line:
torsocks curl http://YOUR_ONION_ADDRESS.onion/
# Should return your HTML content`}</Pre>

      <H3>Step 4: Identify and Fix Opsec Misconfigurations</H3>
      <Pre label="// TEST YOUR HIDDEN SERVICE FOR INFORMATION LEAKS">{`# Check if your server leaks information in HTTP headers
torsocks curl -I http://YOUR_ONION_ADDRESS.onion/

# Look for dangerous headers:
# Server: Python/3.10 SimpleHTTP    <- version fingerprint
# X-Powered-By: ...                 <- reveals backend technology
# Any header with an IP address     <- direct deanonymisation risk

# Test error pages — do they reveal software details?
torsocks curl http://YOUR_ONION_ADDRESS.onion/nonexistent_page
# Default Python server shows: "Error 404 - File Not Found" and the server name

# Fix: Use a proper web server with header stripping
# Nginx example (in nginx.conf):
# server_tokens off;
# add_header Server "";
# proxy_hide_header X-Powered-By;

# Check access logs — does your server log visitor IPs?
# In this lab the Python server logs to stdout in your terminal
# In production: all visitors arrive via Tor, so logged IPs are Tor relay IPs
# There is no client IP to leak — this is a property of hidden services`}</Pre>

      {/* LAB 04 */}
      <H2 num="04">Opsec Verification — Test Your Own Anonymity</H2>
      <Alert type="objective">
        Actively probe your own setup for leaks. Test for DNS leaks, browser fingerprinting, WebRTC exposure, and IPv6 leaks using legitimate privacy testing tools.
      </Alert>
      <Alert type="note">
        &quot;Opsec&quot; (operational security) means identifying what information you are accidentally revealing. Even with Tor, poor opsec can deanonymise you — for example, logging into a personal account while using Tor defeats the anonymity entirely. This exercise focuses on technical leaks at the network layer.
      </Alert>

      <H3>Step 1: Browser-Based Leak Tests in Tor Browser</H3>
      <Pre label="// RUN THESE TESTS IN TOR BROWSER">{`# Open Tor Browser and visit each of these (all are legitimate privacy tools):

# 1. Browser fingerprint uniqueness
#    https://coveryourtracks.eff.org
#    Click "TEST YOUR BROWSER"
#    Goal: should say "protected against tracking"
#    If it shows a unique fingerprint — your browser stands out in a crowd

# 2. DNS leak test
#    https://dnsleaktest.com
#    Click "Extended Test"
#    ALL results should show Tor exit node AS numbers (not your ISP)
#    If your ISP DNS appears — DNS is leaking outside of Tor

# 3. WebRTC IP leak check
#    https://browserleaks.com/webrtc
#    WebRTC is a browser feature that can reveal your real IP even through VPNs/Tor
#    Tor Browser disables WebRTC — you should see no local or public IPs exposed

# 4. Canvas fingerprint test
#    https://browserleaks.com/canvas
#    Tor Browser randomises canvas output each session
#    You should NOT see a consistent fingerprint across reloads`}</Pre>

      <H3>Step 2: Command-Line Leak Tests</H3>
      <Pre label="// TERMINAL LEAK VERIFICATION">{`# Baseline: check your real connection details (no Tor)
curl https://ipapi.co/json/ | python3 -m json.tool
# Note your: ip, city, country_name, org (your ISP)

# Through Tor: verify all details change
torsocks curl https://ipapi.co/json/ | python3 -m json.tool
# ip       — should be a Tor exit node IP
# city     — should be the exit node's city (not yours)
# org      — should say something like "AS tor-exit" or an unrelated ISP

# Check for DNS leaks at network level
# Start a packet capture in one terminal:
sudo tcpdump -i eth0 port 53 -n
# In another terminal, use torsocks to make a web request:
torsocks curl https://dnsleaktest.com/ -o /dev/null
# In the tcpdump terminal: you should see ZERO DNS packets
# Tor resolves DNS inside the network — no plaintext DNS leaves your machine

# Check for IPv6 leaks
# Tor only supports IPv4 — IPv6 traffic bypasses Tor entirely
ip -6 addr show
# If you have a global IPv6 address, disable it:
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1`}</Pre>

      {/* LAB 05 */}
      <H2 num="05">Traffic Analysis — What an Observer Sees</H2>
      <Alert type="objective">
        Capture Tor traffic at the network layer with tcpdump and Wireshark. Confirm what is visible to an ISP-level observer. Understand the limits of traffic analysis against encrypted onion routing.
      </Alert>
      <Alert type="note">
        This exercise is &quot;defensive&quot; traffic analysis — you are looking at your own traffic to understand what an adversary (your ISP, a network monitor) would see. Understanding the attacker&apos;s perspective is essential for building strong privacy practices.
      </Alert>

      <H3>Step 1: Capture Your Own Tor Traffic</H3>
      <Pre label="// CAPTURE TOR TRAFFIC WITH TCPDUMP">{`# Install Wireshark if not already installed
sudo apt install wireshark-qt tcpdump

# Find your active network interface
ip link show
# Look for: eth0 (VM), ens33, wlan0, or similar
# WSL2: usually eth0

# Start a packet capture (run this BEFORE opening Tor Browser)
sudo tcpdump -i eth0 -w ~/tor_capture.pcap &
# This captures everything in the background

# Now: open Tor Browser and browse several .onion sites for 2 minutes
# Then stop the capture:
sudo kill %1
# Or: fg, then Ctrl+C`}</Pre>

      <H3>Step 2: Analyse in Wireshark</H3>
      <Pre label="// WIRESHARK ANALYSIS — WHAT TO LOOK FOR">{`# Open the capture file
wireshark ~/tor_capture.pcap

# WHAT YOU WILL SEE:
# TLS 1.3 handshakes to 1-3 IP addresses (your Tor guard nodes)
# Encrypted application data — shows as black rows in Wireshark
# Consistent destination: always your Guard node (not the exit or destination)

# WHAT YOU WILL NOT SEE:
# HTTP requests or URLs
# .onion addresses
# Any plaintext content
# The identity of the destination website

# Useful Wireshark display filters to try:
# tls.handshake.type == 1          — show TLS ClientHello packets
# tcp.port == 9001                  — common Tor relay port
# tcp.port == 443                   — also used by Tor (looks like HTTPS)
# ip.dst == GUARD_NODE_IP           — all traffic to your guard

# Key observation: Your ISP sees only encrypted traffic to ONE IP address
# They cannot distinguish between you browsing .onion sites, using Tor for
# legitimate privacy, or doing security research`}</Pre>

      <H3>Step 3: Timing Correlation Demonstration</H3>
      <Pre label="// TIMING CORRELATION — HOW GLOBAL ADVERSARIES THINK">{`# This demonstrates the concept of end-to-end timing correlation
# (a theoretical attack used by nation-state adversaries)

# The attack concept:
# If an adversary watches BOTH your entry AND your exit traffic,
# they can correlate timing patterns to link you to your destination

# Safe local simulation — NO actual Tor involved
# Terminal 1: run a local server
python3 -m http.server 9999

# Terminal 2: capture timing
sudo tcpdump -i lo port 9999 -w ~/timing_test.pcap

# Terminal 3: make requests at known intervals
for i in $(seq 1 10); do
  curl http://127.0.0.1:9999/ -s -o /dev/null
  sleep 1
done

# Stop capture: fg in Terminal 2, then Ctrl+C

# Open in Wireshark, look at packet timing
# wireshark ~/timing_test.pcap
# Observe the ~1-second intervals between requests
# This illustrates how timing patterns survive encryption
# A global adversary seeing both ends could run this at Tor scale`}</Pre>

      {/* LAB 06 */}
      <H2 num="06">Bridge Configuration and Censorship Circumvention</H2>
      <Alert type="objective">
        Configure Tor to use bridges so that Tor usage is not detectable by network observers. Test obfs4 pluggable transport. Understand when bridges are necessary and why they work.
      </Alert>
      <Alert type="note">
        In some countries or networks, ISPs actively block connections to known Tor relay IPs. Bridges are unlisted Tor relays — their IPs are not public, so they are harder to block. Pluggable transports like obfs4 make your traffic look like random data rather than Tor traffic.
      </Alert>

      <H3>Step 1: Obtain Bridge Addresses</H3>
      <Pre label="// GET BRIDGE ADDRESSES">{`# Method 1: Tor Browser built-in bridges
# In Tor Browser: Settings → Connection → Use a bridge
# Select: "Select a built-in bridge" → choose "obfs4"
# Tor Browser automatically uses one of its bundled obfs4 bridges

# Method 2: Request bridges from Tor Project
# Visit: https://bridges.torproject.org/
# Select: obfs4 transport
# Complete the captcha — bridges are distributed carefully
# You receive 3 bridge lines like:
# obfs4 IP:PORT FINGERPRINT cert=... iat-mode=0

# Method 3: Email (for heavily censored regions)
# Send email to: bridges@torproject.org
# Subject: (leave blank)
# Body: get transport obfs4
# Reply contains bridge addresses`}</Pre>

      <H3>Step 2: Configure Bridges in torrc (CLI)</H3>
      <Pre label="// TORRC BRIDGE CONFIGURATION">{`# Edit Tor config
sudo nano /etc/tor/torrc

# Add these lines (use your actual bridge lines from bridges.torproject.org):
UseBridges 1
ClientTransportPlugin obfs4 exec /usr/bin/obfs4proxy

# Then add your bridge lines (one per line), for example:
Bridge obfs4 1.2.3.4:1234 FINGERPRINT cert=CERT_HERE iat-mode=0
Bridge obfs4 5.6.7.8:5678 FINGERPRINT cert=CERT_HERE iat-mode=0

# Install the obfs4 transport:
sudo apt install obfs4proxy

# Restart Tor
sudo systemctl restart tor
sudo journalctl -u tor -f
# Watch for: "Bootstrapped 100%"
# If bridging works, you will connect via the bridge instead of a public guard`}</Pre>

      <H3>Step 3: Verify Bridge Is Being Used</H3>
      <Pre label="// CONFIRM BRIDGE USAGE">{`# After configuring bridges, check your IP:
torsocks curl https://api.ipify.org
# Should still show a Tor exit node IP (not your real IP)

# Check that your traffic no longer goes to a public Tor relay
# Run tcpdump and compare the destination IPs:
sudo tcpdump -i eth0 -n 'tcp[tcpflags] & tcp-syn != 0' -c 20
# Without bridges: connections to well-known Tor relay IPs
# With obfs4 bridge: connections to your specific bridge IP

# The bridge IP is NOT in the public Tor relay list
# An ISP checking against the public Tor relay list will NOT detect Tor usage

# Verify Tor is still working through the bridge:
torsocks curl https://check.torproject.org/api/ip
# Should return: {"IsTor":true,"IP":"..."}
# Even using a bridge, exit traffic still comes from a Tor exit node`}</Pre>

      {/* Check Your Understanding */}
      <div style={{ marginTop: '3rem', background: '#0a130a', border: '1px solid ' + accentBorder, borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.2em', marginBottom: '1rem' }}>CHECK YOUR UNDERSTANDING</div>
        <P>Before moving to the next module, you should be able to answer all of these questions. If you cannot, re-read the relevant lab section and the concept page.</P>
        {[
          'Why does Tor use 3 hops instead of 1 or 2? What does each hop know?',
          'What is the difference between the Tor daemon (tor service) and Tor Browser?',
          'After setting up your hidden service, what does the hs_ed25519_secret_key file contain and why must it be protected?',
          'When you ran tcpdump during Tor traffic capture, what was visible to an ISP-level observer?',
          'What is a pluggable transport (obfs4) and when would you need one?',
        ].map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #0a1208', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
            <span style={{ color: accent, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
            <span style={{ color: '#5a7a5a' }}>{q}</span>
          </div>
        ))}
      </div>

      {/* Recommended Practice */}
      <div style={{ marginTop: '2rem', background: '#0a130a', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a6a3a', letterSpacing: '0.2em', marginBottom: '1rem' }}>RECOMMENDED PRACTICE</div>
        <P>Reinforce these concepts with structured lab environments. These rooms provide guided, legal practice environments.</P>
        {[
          { platform: 'TryHackMe', name: 'Anonymous - Dark Web Operations', note: 'Covers Tor circuits, .onion navigation, and anonymity fundamentals in a guided room' },
          { platform: 'TryHackMe', name: 'Tor for Beginners', note: 'Step-by-step Tor Browser setup, opsec checklist, and practical anonymity verification' },
          { platform: 'TryHackMe', name: 'Network Security', note: 'Covers Wireshark-based traffic analysis — directly applicable to Lab 05 analysis skills' },
          { platform: 'HackTheBox', name: 'Onion Site Challenges', note: 'CTF challenges involving .onion services and Tor-based reconnaissance' },
        ].map((r, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #0a1208' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: accent, background: accentDim, border: '1px solid ' + accentBorder, padding: '1px 6px', borderRadius: '2px' }}>{r.platform}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#8a9a8a', fontWeight: 600 }}>{r.name}</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#3a6a3a', paddingLeft: '4px' }}>{r.note}</div>
          </div>
        ))}
      </div>

      {/* Footer nav */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/modules/tor" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← BACK TO CONCEPT</Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>DASHBOARD</Link>
        <Link href="/modules/osint/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: '1px solid ' + accentBorder, borderRadius: '4px', background: accentDim }}>
          NEXT: MOD-02 OSINT LAB →
        </Link>
      </div>
    </div>
  )
}
