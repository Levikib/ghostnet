'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#00ff41'
const moduleId = 'tor'
const moduleName = 'Tor & Dark Web'
const moduleNum = '01'

const steps: LabStep[] = [
  // ── SECTION 1: Installation & Service Management ──────────────────────────
  {
    id: 'tor-01',
    title: 'Install Tor on Debian/Ubuntu',
    objective: `You are setting up a fresh Kali Linux box for anonymised operations. The Tor package is not installed yet.

What is the correct apt command to install Tor from the official repositories?`,
    hint: 'Use apt-get or apt with the package name "tor". Remember: sudo.',
    answers: ['sudo apt install tor', 'sudo apt-get install tor', 'apt install tor', 'apt-get install tor'],
    xp: 15,
    explanation: `sudo apt install tor installs the Tor daemon plus its dependencies. On Kali/Debian/Ubuntu this also installs the system service automatically.

After install, Tor does NOT auto-start — you must enable it:
  sudo systemctl enable tor   (survive reboots)
  sudo systemctl start tor    (start now)

The package installs:
  /usr/sbin/tor              — the daemon binary
  /etc/tor/torrc             — main config file
  /var/lib/tor/              — data directory (keys, cached consensus)
  /var/log/tor/              — log directory

For the official Tor Project repo (newer builds):
  curl https://deb.torproject.org/torproject.org/A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89.asc | gpg --dearmor | tee /usr/share/keyrings/deb.torproject.org-keyring.gpg
  echo "deb [signed-by=/usr/share/keyrings/deb.torproject.org-keyring.gpg] https://deb.torproject.org/torproject.org $(lsb_release -cs) main" > /etc/apt/sources.list.d/tor.list
  apt update && apt install tor`
  },
  {
    id: 'tor-02',
    title: 'Service Status & Daemon Verification',
    objective: `Tor is installed. Before trusting it with live traffic you need to confirm the daemon is actually running and healthy.

What systemctl command checks the full status of the Tor service, including whether it is active, any recent log lines, and the process ID?`,
    hint: 'systemctl has a "status" verb. The service unit name is "tor" (or "tor.service" — both work).',
    answers: ['systemctl status tor', 'systemctl status tor.service', 'service tor status', 'sudo systemctl status tor'],
    xp: 15,
    explanation: `systemctl status tor gives you:
  ● tor.service - Anonymizing overlay network for TCP
     Loaded: loaded (/lib/systemd/system/tor.service; enabled)
     Active: active (running) since ...
    Process: 1234 ExecStartPre=/usr/bin/tor --defaults-torrc ...
   Main PID: 1235 (tor)

Key things to read:
  "active (running)"    → daemon is healthy
  "failed" or "exited"  → check logs: journalctl -u tor -n 50
  Main PID              → the process handling your traffic

Also useful:
  sudo systemctl restart tor   — reload after config changes
  sudo systemctl reload tor    — send SIGHUP to reload config without restart
  tor --verify-config          — check torrc syntax without starting`
  },
  {
    id: 'tor-03',
    title: 'Locate and Understand torrc',
    objective: `Every Tor behaviour is controlled through its configuration file. Knowing this path is fundamental — it is where you configure proxies, hidden services, bridges, bandwidth limits, and logging.

What is the full absolute path to the main Tor configuration file on Linux?`,
    hint: 'It lives under /etc/tor/ and is named after the Tor daemon itself.',
    answers: ['/etc/tor/torrc', 'etc/tor/torrc'],
    xp: 10,
    explanation: `/etc/tor/torrc is the primary configuration file. The full default file is heavily commented — most directives are commented out with their defaults shown.

Key torrc sections you'll configure:
  ## NETWORK
  SocksPort 9050             — SOCKS5 proxy port (apps connect here)
  SocksPort 9150             — Tor Browser uses 9150
  ControlPort 9051           — programmatic control (stem, nyx)

  ## LOGGING
  Log notice file /var/log/tor/notices.log
  Log debug file /var/log/tor/debug.log   # very verbose

  ## HIDDEN SERVICES
  HiddenServiceDir /var/lib/tor/hidden_service/
  HiddenServicePort 80 127.0.0.1:8080

  ## BRIDGES (censored networks)
  UseBridges 1
  Bridge obfs4 IP:PORT fingerprint

After ANY change to torrc:
  sudo systemctl reload tor    — preferred (no circuit disruption)
  sudo systemctl restart tor   — full restart (drops all circuits)`
  },

  // ── SECTION 2: SOCKS Proxying & Traffic Routing ───────────────────────────
  {
    id: 'tor-04',
    title: 'Verify SOCKS5 Proxy — Exit IP Check',
    objective: `Tor exposes a SOCKS5 proxy at localhost:9050. You need to verify your traffic is actually exiting through a Tor relay and not your real IP.

Write the curl command that routes through the Tor SOCKS5 proxy to check.torproject.org's IP API to confirm you are using Tor.`,
    hint: 'curl has a --socks5 flag. The endpoint is https://check.torproject.org/api/ip',
    answers: [
      'curl --socks5 localhost:9050 https://check.torproject.org/api/ip',
      'curl --socks5 127.0.0.1:9050 https://check.torproject.org/api/ip',
      'curl --socks5-hostname localhost:9050 https://check.torproject.org/api/ip',
      'curl --socks5-hostname 127.0.0.1:9050 https://check.torproject.org/api/ip',
    ],
    flag: 'FLAG{tor_exit_verified}',
    xp: 25,
    explanation: `--socks5 routes the TCP connection through Tor's SOCKS5 proxy. The response:
  {"IsTor":true,"IP":"185.220.101.x"}

CRITICAL — --socks5 vs --socks5-hostname:
  --socks5            resolves DNS locally THEN sends through Tor (DNS LEAK!)
  --socks5-hostname   sends hostname to Tor for remote DNS resolution (safe)

Always use --socks5-hostname for anything sensitive. DNS leaks reveal your targets even if your traffic is Torified.

For tools that don't natively support SOCKS:
  torsocks curl https://target.onion    — LD_PRELOAD wrapper, intercepts syscalls
  proxychains4 nmap -sT target          — chains proxies, TCP only
  torify wget https://example.com       — legacy wrapper (uses torsocks internally)

SocksPort accepts policy flags:
  SocksPort 9050 IsolateDestAddr       — new circuit per destination IP
  SocksPort 9050 IsolateDestPort       — new circuit per destination port`
  },
  {
    id: 'tor-05',
    title: 'torsocks — Transparent Application Proxying',
    objective: `You want to run wget through Tor without modifying wget or using curl's flags. The torsocks wrapper intercepts system calls at the library level to force any application through Tor.

What is the torsocks command to download a file from http://example.com through Tor?`,
    hint: 'Just prepend "torsocks" before your normal command.',
    answers: ['torsocks wget http://example.com', 'torsocks wget example.com', 'torsocks curl http://example.com'],
    xp: 20,
    explanation: `torsocks works by preloading libtorsocks.so which hooks connect(), getaddrinfo(), and other network syscalls, redirecting all TCP through the SOCKS5 proxy.

Practical usage:
  torsocks ssh user@hidden.onion         — SSH to a hidden service
  torsocks git clone http://...          — anonymise git operations
  torsocks python3 script.py             — proxy a whole Python script
  torsocks -i bash                       — interactive shell where everything is Torified

What torsocks CANNOT proxy:
  • UDP traffic (Tor is TCP only) — this causes DNS leaks if not handled
  • Raw sockets (nmap -sS SYN scan requires root raw sockets, won't work)
  • ICMP (ping) — leaks real IP

For torsocks.conf:
  /etc/tor/torsocks.conf               — global config
  TorAddress 127.0.0.1
  TorPort 9050
  AllowInbound 0                        — block inbound connections`
  },
  {
    id: 'tor-06',
    title: 'DNS-over-Tor — Preventing DNS Leaks',
    objective: `Your colleague set up Tor but ran: curl --socks5 localhost:9050 http://target.com

This has a critical opsec flaw. Your ISP and any network observer can see which domain you're querying even though the HTTP traffic goes through Tor.

What is the specific name of this type of leak?`,
    hint: 'When DNS queries leave your machine before going through Tor, what kind of "leak" is it?',
    answers: ['dns leak', 'dns leakage', 'dns query leak'],
    xp: 20,
    explanation: `A DNS leak occurs when hostname resolution happens locally (revealing your query to your ISP) before the TCP connection is forwarded to Tor.

--socks5 = resolve hostname locally → LEAK
--socks5-hostname = send hostname to Tor exit node for resolution → SAFE

To route DNS itself through Tor, configure DNSPort in torrc:
  DNSPort 5300              — Tor listens on port 5300 for DNS queries
  AutomapHostsOnResolve 1   — map .onion to virtual addresses

Then configure your system DNS resolver:
  # /etc/resolv.conf
  nameserver 127.0.0.1
  options port:5300

Verify no DNS leaks:
  torsocks nslookup whoami.akamai.net    — should show Tor exit IP
  wireshark — filter: dns — should see zero outbound DNS on your real interface

DNSPort is also used to enable .onion resolution from non-Tor-Browser apps:
  VirtualAddrNetworkIPv4 10.192.0.0/10
  AutomapHostsOnResolve 1
  DNSPort 5300`
  },

  // ── SECTION 3: Circuit Anatomy & Control ──────────────────────────────────
  {
    id: 'tor-07',
    title: 'Tor Circuit Architecture',
    objective: `Understanding the 3-hop circuit model is essential before building hidden services or analysing Tor traffic.

A standard Tor circuit consists of 3 relay types in order. What is the correct sequence from your machine to the destination?

Type: guard relay, middle relay, exit relay  (in order, comma separated)`,
    hint: 'Think: entry node first, then through the middle, then out to the internet.',
    answers: [
      'guard relay, middle relay, exit relay',
      'guard, middle, exit',
      'entry guard, middle relay, exit relay',
      'entry, middle, exit',
      'guard node, middle node, exit node',
    ],
    xp: 20,
    explanation: `The 3-hop onion routing circuit:

  [You] → [Guard/Entry] → [Middle] → [Exit] → [Destination]

Each hop knows only:
  Guard: knows your real IP + middle relay
  Middle: knows guard + exit, nothing about you or destination
  Exit: knows middle + destination, nothing about you

Why 3 hops specifically?
  • 1 hop: the single relay knows everything
  • 2 hops: entry knows you, exit knows destination — global adversary can correlate
  • 3 hops: balances anonymity vs latency — more hops don't significantly improve security against a global passive adversary (traffic correlation attacks)

Guard nodes are sticky — Tor uses the same guard for 2-3 months to prevent an adversary from rotating you onto a malicious guard via repeated reconnections.

The circuit is built incrementally:
  1. You establish encrypted channel to guard (TLS)
  2. You extend the circuit to middle (you encrypt directly to middle through guard)
  3. You extend to exit (you encrypt directly to exit through guard+middle)

Each relay only decrypts one layer — hence "onion" routing.`
  },
  {
    id: 'tor-08',
    title: 'ControlPort & nyx — Circuit Monitoring',
    objective: `To monitor circuits in real-time, interrogate the Tor daemon, and manually close/build circuits, you use the ControlPort.

What must you add to /etc/tor/torrc to enable the control port on its default port so that local tools like nyx and stem can connect?`,
    hint: 'The directive name is ControlPort and the default port is 9051.',
    answers: ['ControlPort 9051', 'controlport 9051', 'ControlPort 9051\nCookieAuthentication 1'],
    xp: 20,
    explanation: `ControlPort 9051 opens a control socket that tools use to command Tor directly.

Secure it properly in torrc:
  ControlPort 9051
  CookieAuthentication 1      — auth via cookie file (recommended)
  # OR:
  HashedControlPassword ...   — use: tor --hash-password "yourpass"

nyx is the official terminal dashboard:
  sudo apt install nyx
  nyx                          — connects to 127.0.0.1:9051 automatically

nyx shows:
  • All active circuits with guard/middle/exit relay names and countries
  • Bandwidth graphs (real-time)
  • Log stream
  • Connection list (per-circuit)

Using stem (Python) to build a new circuit programmatically:
  from stem import Signal
  from stem.control import Controller
  with Controller.from_port(port=9051) as c:
      c.authenticate()
      c.signal(Signal.NEWNYM)   # request new identity (new circuits)

NEWNYM has a rate limit — by default 10 seconds between requests.`
  },
  {
    id: 'tor-09',
    title: 'New Identity vs New Circuit',
    objective: `You are running a scraping operation through Tor and want to rotate your apparent IP address.

In the Tor ecosystem, what is the difference between NEWNYM and simply closing/rebuilding one circuit?

Type: NEWNYM  to demonstrate you know the correct signal to use.`,
    hint: 'NEWNYM is the Tor control signal. It does more than just rebuild one circuit.',
    answers: ['NEWNYM', 'signal newnym', 'SIGNAL NEWNYM'],
    xp: 15,
    explanation: `NEWNYM (New Identity) vs circuit rebuild:

  New circuit:   replaces one specific path through the Tor network — same guard node
  NEWNYM:        closes ALL circuits, clears DNS cache, creates new circuits — may get new guard

NEWNYM via stem:
  c.signal(Signal.NEWNYM)

NEWNYM via telnet to ControlPort:
  telnet 127.0.0.1 9051
  AUTHENTICATE "password"
  SIGNAL NEWNYM

NEWNYM via torsocks+curl:
  curl -s http://127.0.0.1:9051/ ... (use stem instead)

Rate limit: NEWNYM is enforced every 10 seconds (newidentity-limiter). Spamming it doesn't help — Tor queues at most one pending NEWNYM.

What NEWNYM does NOT do:
  • Clears browser cookies/storage — you must do this yourself
  • Removes fingerprinting identifiers from your browser
  • Guarantees a different exit country

For automation with guaranteed IP rotation, use SocksPort with IsolateDestAddr to get per-destination circuits automatically.`
  },

  // ── SECTION 4: Hidden Services ────────────────────────────────────────────
  {
    id: 'tor-10',
    title: 'Hidden Service Configuration — Required Directives',
    objective: `You are deploying a web service accessible only via .onion. You need to add the minimal configuration to /etc/tor/torrc to create a v3 hidden service that maps port 80 on the .onion address to a local web server on port 8080.

Write the two torrc directives required (one per line).`,
    hint: 'You need HiddenServiceDir (the directory) and HiddenServicePort (the port mapping).',
    answers: [
      'HiddenServiceDir /var/lib/tor/hidden_service/\nHiddenServicePort 80 127.0.0.1:8080',
      'hiddenservicedir /var/lib/tor/hidden_service/\nhiddenserviceport 80 127.0.0.1:8080',
      'HiddenServiceDir\nHiddenServicePort',
      'HiddenServiceDir /var/lib/tor/hidden_service/',
      'HiddenServicePort 80 127.0.0.1:8080',
    ],
    flag: 'FLAG{hidden_service_configured}',
    xp: 30,
    explanation: `Minimal hidden service config:
  HiddenServiceDir /var/lib/tor/hidden_service/
  HiddenServicePort 80 127.0.0.1:8080

On first start after adding this, Tor:
  1. Creates the directory with permissions 700
  2. Generates an Ed25519 keypair (v3 onion)
  3. Derives the 56-character .onion address from the public key
  4. Writes hostname file: /var/lib/tor/hidden_service/hostname
  5. Writes private key: /var/lib/tor/hidden_service/hs_ed25519_secret_key

HiddenServicePort syntax:
  HiddenServicePort <onion-port> <local-addr:local-port>

Multiple ports on one hidden service:
  HiddenServiceDir /var/lib/tor/my_service/
  HiddenServicePort 80 127.0.0.1:8080
  HiddenServicePort 22 127.0.0.1:22
  HiddenServicePort 443 127.0.0.1:443

Multiple separate hidden services:
  HiddenServiceDir /var/lib/tor/service1/
  HiddenServicePort 80 127.0.0.1:8080

  HiddenServiceDir /var/lib/tor/service2/
  HiddenServicePort 80 127.0.0.1:9090

CRITICAL: Never expose the hs_ed25519_secret_key — it IS your .onion identity. Back it up offline.`
  },
  {
    id: 'tor-11',
    title: 'Read Your .onion Address',
    objective: `After restarting Tor with your hidden service config, Tor generates the .onion address and writes it to a file inside your HiddenServiceDir.

What command reads your generated .onion hostname? (Assume HiddenServiceDir is /var/lib/tor/hidden_service/)`,
    hint: 'Use cat on the "hostname" file inside the HiddenServiceDir.',
    answers: [
      'cat /var/lib/tor/hidden_service/hostname',
      'sudo cat /var/lib/tor/hidden_service/hostname',
    ],
    xp: 15,
    explanation: `The hostname file contains your v3 .onion address:
  3g2upl4pq6kufc4m5hfcnfznhqvk3qlnpd2amkhcj3hxb4x57jc5jad.onion

v3 vs v2 onion addresses:
  v2: 16 chars (SHA1-based, RSA1024) — DEPRECATED, removed in Tor 0.4.6+
  v3: 56 chars (Ed25519, SHA3-256)   — current standard, quantum-harder

The v3 address encodes: [public-key][version][checksum] in base32

Directory contents after generation:
  hostname                       — your .onion address (public, shareable)
  hs_ed25519_public_key          — Ed25519 public key
  hs_ed25519_secret_key          — Ed25519 PRIVATE key (NEVER share/expose)

Vanity .onion address generation (custom prefix):
  mkp224o -d /output -n 1 ghost    — mine addresses starting with "ghost"
  This is CPU/GPU-intensive: each character adds ~32x work

Authorised clients (private hidden services):
  Add to torrc: HiddenServiceAuthorizeClient stealth client1,client2
  Generates a client-specific auth cookie — the service is invisible to others`
  },
  {
    id: 'tor-12',
    title: 'v3 Hidden Service — Rendezvous Circuit',
    objective: `When a client connects to your .onion, the connection is established through a 6-hop circuit (not 3). The client and server each build a 3-hop circuit to a mutually agreed point.

What is the name of the relay that both the client and hidden service connect to in order to establish the rendezvous?`,
    hint: 'It is a mutually agreed relay — client proposes it, server connects to it. Think: they meet there.',
    answers: ['rendezvous point', 'rendezvous relay', 'rendezvous node', 'rp'],
    xp: 25,
    explanation: `Hidden service rendezvous circuit (6 hops total):

  Client side (3 hops):
    [Client] → [Guard] → [Middle] → [Rendezvous Point]

  Server side (3 hops):
    [Hidden Service] → [Guard] → [Middle] → [Rendezvous Point]

  Total: 6 hops, 6 encryption layers

The introduction circuit (how client finds the service):
  1. Hidden service registers itself at 3 "introduction points" (relays in the Tor network)
  2. Introduction point addresses are published in the Tor HSDir (distributed hash table)
  3. Client downloads descriptor from HSDir, learns introduction points
  4. Client picks a rendezvous point, sends it via introduction point to the hidden service
  5. Hidden service builds circuit to rendezvous point
  6. Client and service are now connected — neither knows the other's real IP

The onion service descriptor is encrypted with the service's Ed25519 key:
  v3 descriptors: stored at HSDir nodes, encrypted, clients with the .onion address can decrypt

This architecture means:
  • The hidden service never connects directly to any client
  • The client never connects directly to the hidden service
  • Introduction points only see "someone wants to connect" — not who
  • Rendezvous point only sees encrypted traffic — not what`
  },

  // ── SECTION 5: Bridges & Censorship Circumvention ─────────────────────────
  {
    id: 'tor-13',
    title: 'Tor Bridges & Pluggable Transports',
    objective: `You are operating in a country that actively blocks Tor. The ISP does Deep Packet Inspection (DPI) to identify and block Tor's TLS handshake pattern.

What torrc directive enables bridge mode, and what is the name of the most commonly used pluggable transport that obfuscates Tor traffic to look like random bytes?`,
    hint: 'The directive is "UseBridges". The transport that obfuscates to look like random noise starts with "obfs".',
    answers: ['obfs4', 'UseBridges 1\nobfs4', 'obfs4 pluggable transport'],
    xp: 25,
    explanation: `When Tor's IP addresses and TLS patterns are blocked, bridges + pluggable transports bypass censorship.

torrc bridge configuration:
  UseBridges 1
  ClientTransportPlugin obfs4 exec /usr/bin/obfs4proxy
  Bridge obfs4 IP:PORT FINGERPRINT cert=... iat-mode=0

Get bridges from:
  https://bridges.torproject.org    — web form
  Email bridges@torproject.org      — automated response
  Built into Tor Browser            — "Request a Bridge" button

Pluggable transport comparison:
  obfs4      — looks like random bytes, most deployed, fast
  meek       — tunnels Tor over HTTPS to a CDN (Azure, AWS) — hard to block
  snowflake  — uses WebRTC, appears as video conferencing traffic
  webtunnel  — disguises as HTTPS webpage visits (newest, very effective)
  Shadowsocks — proxy protocol popular in China

DPI bypass mechanics (obfs4):
  • Randomises packet sizes and timing
  • Adds random padding
  • The handshake looks like random noise — no identifiable TLS Client Hello pattern
  • The bridge IP is not in the public Tor consensus, so IP-blocklists fail

For the most hostile environments (China, Iran, Russia):
  meek-azure or snowflake are most reliable because they exploit CDN infrastructure
  that cannot be blocked without disrupting legitimate business traffic`
  },

  // ── SECTION 6: Opsec, Failures & Adversarial Scenarios ───────────────────
  {
    id: 'tor-14',
    title: 'Opsec Failure Analysis — The Silk Road Mistake',
    objective: `Ross Ulbricht (Silk Road operator) was identified partly through OPSEC failures unrelated to breaking Tor cryptography. One early mistake: he posted about Silk Road on a public forum using his real email address before switching to his pseudonym.

In terms of Tor threat models, what category of attack does this represent — an attack on the anonymity NETWORK, or an attack on the ENDPOINT (the human operator)?`,
    hint: 'Tor protects the network layer. It cannot protect against mistakes made by the person using it.',
    answers: ['endpoint', 'endpoint attack', 'human error', 'opsec failure', 'endpoint opsec'],
    xp: 20,
    explanation: `Tor is NOT a magic anonymity bullet. The threat model has two attack surfaces:

1. NETWORK attacks (Tor protects against these):
   • Traffic analysis by ISP/NSA seeing your connection
   • Identifying which onion service you're connecting to
   • Correlating sender/receiver at the network level (partially — global adversary is still a threat)

2. ENDPOINT attacks (Tor does NOT protect against these):
   • Browser fingerprinting (canvas, WebGL, fonts, timezone)
   • JavaScript exploits that phone home with your real IP
   • Metadata in files (EXIF GPS in images posted to your hidden service)
   • Linking pseudonymous accounts to real identity (Ulbricht's forum post)
   • Malware on your machine sending data outside Tor
   • Timing attacks if you post at unusual hours consistently

Real cases of Tor deanonymisation:
   Silk Road: real email → linked to DPR identity
   Sabu (LulzSec): forgot to use Tor ONE TIME for IRC, FBI saw real IP
   Hector Monsegur: connected to unprotected IRC from home IP before Tor session
   Operation Onymous (2014): FBI/Europol — likely via server misconfiguration exposing real IPs, not Tor breaking

The rule: Tor protects your network traffic. You must protect everything else.
Tails OS runs entirely in RAM, forces all traffic through Tor, leaves no trace.`
  },
  {
    id: 'tor-15',
    title: 'Traffic Correlation Attacks',
    objective: `A global passive adversary (like the NSA) controls multiple Tor relays and can observe traffic entering and leaving the Tor network at many points.

Even without breaking Tor's encryption, what type of attack can they perform by comparing the TIMING and VOLUME of packets entering the Tor network from you vs packets exiting toward a destination?`,
    hint: 'They correlate the timing patterns of traffic entering and exiting Tor — what is this called?',
    answers: ['traffic correlation', 'correlation attack', 'timing attack', 'traffic analysis', 'end-to-end correlation'],
    xp: 25,
    explanation: `Traffic correlation (end-to-end correlation attack) is the most fundamental threat to Tor anonymity that the network design does not fully solve.

How it works:
  1. Adversary observes: 1000 packets/sec entering Tor from your connection at T=0
  2. Adversary observes: ~1000 packets/sec leaving Tor exit node toward target.com at T=0.3s
  3. Statistical correlation (even with jitter and encryption) can link you to the destination

Tor's 3-hop design prevents an adversary controlling ONE relay from doing this.
But if the adversary controls enough of the network (or can observe at the ISP/IXP level):
  • Sybil attacks: flood the network with attacker-controlled relays
  • AS-level adversary: major ISPs carry both entry and exit traffic globally

Known research:
  RAPTOR attack (2015): BGP hijacking to redirect Tor traffic through AS-level adversary
  Torsocks study: ~20% of circuits in some studies have entry+exit on same AS

Mitigation strategies (and their limits):
  onion services: no exit node → only 6-hop circuit → harder to correlate
  I2P: multi-hop, built for stronger traffic analysis resistance
  Mix networks (Loopix/Nym): add latency + noise → breaks timing correlation
  Tor's guard node stickiness: reduces repeated Sybil exposure

For high-stakes opsec: Tor is necessary but not sufficient. Layer with:
  • High-latency communication (email vs real-time chat)
  • Temporal separation (don't post at your usual active hours)
  • Airgapped machines for the most sensitive operations`
  },
  {
    id: 'tor-16',
    title: 'ExitPolicy — Responsible Relay Operation',
    objective: `You want to run a Tor relay to contribute bandwidth to the network, but you do NOT want to be the exit node (the relay that connects to the actual destination on the internet), since that exposes you to abuse complaints.

What is the single torrc directive that configures your relay to reject ALL outbound exit traffic (middle relay only)?`,
    hint: 'The directive is ExitPolicy. You want to reject everything with a wildcard.',
    answers: ['ExitPolicy reject *:*', 'exitpolicy reject *:*'],
    flag: 'FLAG{tor_relay_configured}',
    xp: 25,
    explanation: `ExitPolicy reject *:* makes your node a middle relay only — it routes traffic between other relays but never connects to the open internet.

Middle relay benefits:
  • No abuse complaints (you're not the exit)
  • Still contributes meaningfully to Tor network capacity
  • Tor needs MORE middle relays than exits

Full relay types:
  Guard relay:   first hop, needs stable uptime (Stable + Fast flags from directory)
  Middle relay:  most relays, ExitPolicy reject *:*
  Exit relay:    connects to the internet, ExitPolicy allow (ports 80, 443 common)
  Bridge:        unlisted, helps censored users, requires BridgeRelay 1

Relay torrc example:
  ORPort 9001                          — relay listens here
  DirPort 9030                         — directory mirror (optional)
  Nickname MyRelay                     — public name in Tor Atlas
  ContactInfo yourname@example.com     — required for Guard flag
  RelayBandwidthRate 100 MB            — bandwidth limit
  RelayBandwidthBurst 200 MB
  ExitPolicy reject *:*                — middle relay only
  Log notice file /var/log/tor/notices.log

Family declaration (if you run multiple relays):
  MyFamily fingerprint1,fingerprint2   — Tor won't use multiple relays in same circuit

Check relay stats: https://metrics.torproject.org/rs.html`
  },
  {
    id: 'tor-17',
    title: 'Tor Browser Isolation & Fingerprinting',
    objective: `Tor Browser is hardened Firefox. One of its most important privacy features is that it presents an identical browser fingerprint to every website — making all Tor Browser users look the same.

What is the term for the technique where a website identifies you across sessions by combining browser attributes like screen resolution, fonts, plugins, and canvas rendering — even without cookies?`,
    hint: 'It is like leaving a unique impression — like your "finger" on a surface. One word + print.',
    answers: ['fingerprinting', 'browser fingerprinting', 'device fingerprinting', 'canvas fingerprinting'],
    xp: 20,
    explanation: `Browser fingerprinting collects dozens of attributes to create a unique identifier:
  • Canvas rendering (GPU-specific patterns)
  • WebGL renderer string
  • Audio context fingerprint
  • Installed fonts list
  • Screen resolution + color depth
  • Timezone
  • Language settings
  • Plugin list
  • HTTP headers (Accept-Language, User-Agent)

Tor Browser mitigations:
  • Canvas: returns blank/noisy canvas (user prompted)
  • Screen: reports standard resolution (1000×800 letterboxing)
  • Fonts: only bundled fonts exposed
  • WebGL: disabled or randomised
  • Timezone: always UTC
  • User-Agent: same for all Tor Browser users (same version)
  • JavaScript: restricted (NoScript via Security Levels)

Security Levels:
  Standard:   JS enabled, most features active
  Safer:      JS disabled on non-HTTPS, some media disabled
  Safest:     JS disabled everywhere — most resistant to exploits

CRITICAL rules for Tor Browser:
  • Never resize the window (reveals screen size)
  • Never install extensions (makes you unique)
  • Never log into personal accounts (defeats anonymity trivially)
  • Never open downloaded files while Tor is active (may connect outside Tor)
  • Use "New Identity" button between different activities`
  },
]

const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

export default function TorLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_tor-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#4a7a4a' }}>
        <Link href="/" style={{ color: '#4a7a4a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/tor" style={{ color: '#4a7a4a', textDecoration: 'none' }}>TOR & DARK WEB</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/tor" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #1a3a1a', borderRadius: '3px', color: '#4a7a4a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(0,255,65,0.04)', border: '1px solid rgba(0,255,65,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#1a3a1a', border: p.active ? '2px solid ' + accent : '1px solid #1a3a1a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#2a5a2a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#1a3a1a', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4a7a4a' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP &nbsp;·&nbsp; {steps.length} STEPS
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE — LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* Section index */}
      <div style={{ background: 'rgba(0,255,65,0.02)', border: '1px solid rgba(0,255,65,0.08)', borderRadius: '6px', padding: '12px 16px', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '6px' }}>
          {[
            { section: '01–03', title: 'Installation & Service Management', steps: '3 steps' },
            { section: '04–06', title: 'SOCKS Proxying & DNS Leaks', steps: '3 steps' },
            { section: '07–09', title: 'Circuit Architecture & Control', steps: '3 steps' },
            { section: '10–12', title: 'Hidden Services (v3 Onion)', steps: '3 steps' },
            { section: '13',    title: 'Bridges & Censorship Circumvention', steps: '1 step' },
            { section: '14–15', title: 'Opsec Failures & Correlation Attacks', steps: '2 steps' },
            { section: '16–17', title: 'Relay Operation & Browser Hardening', steps: '2 steps' },
          ].map(s => (
            <div key={s.section} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '7px', color: accent + '66', flexShrink: 0, minWidth: '30px' }}>{s.section}</span>
              <div>
                <div style={{ fontSize: '7.5px', color: '#4a8a4a' }}>{s.title}</div>
                <div style={{ fontSize: '6.5px', color: '#2a5a2a', marginTop: '1px' }}>{s.steps}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHASE 1: Guided Learning ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a5a2a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Tor Anonymity Lab</h1>
          </div>
        </div>

        <p style={{ color: '#6a8a6a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          {steps.length} steps covering installation, SOCKS proxying, DNS leak prevention, circuit anatomy, hidden service deployment,
          bridge configuration, opsec failure patterns, traffic correlation attacks, relay operation, and browser hardening.
          Each explanation goes beyond the answer — read them carefully.
        </p>

        <div style={{ background: 'rgba(0,255,65,0.03)', border: '1px solid rgba(0,255,65,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '8px' }}>SKILLS DEVELOPED</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {[
              'Tor installation & daemon management',
              'torrc configuration mastery',
              'SOCKS5 proxy routing',
              'DNS leak prevention',
              'torsocks transparent proxying',
              'Circuit architecture (3-hop)',
              'ControlPort & nyx monitoring',
              'NEWNYM identity rotation',
              'v3 Hidden service deployment',
              '.onion key management',
              'Rendezvous circuit mechanics',
              'Bridges & obfs4 bypass',
              'Pluggable transports (meek, snowflake)',
              'Opsec failure case studies',
              'Traffic correlation attack theory',
              'Middle relay configuration',
              'Browser fingerprinting defence',
              'Tor Browser hardening',
            ].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#3a7a3a', background: 'rgba(0,255,65,0.06)', border: '1px solid rgba(0,255,65,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="tor-lab"
          moduleId={moduleId}
          title="Tor Anonymity Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* ── PHASE 2: Free Lab ── */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(0,255,65,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(0,255,65,0.4)' : '#1a3a1a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#2a5a2a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#4a8a4a' : '#2a5a2a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#2a5a2a' }}>Full Tor Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(0,255,65,0.04)' : '#020602', border: '1px solid ' + (guidedDone ? 'rgba(0,255,65,0.25)' : '#0a1a0a'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />
            )}
            <div style={{ fontSize: '7px', color: guidedDone ? '#3a7a3a' : '#1a3a1a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#2a5a2a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a7a4a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox — no guided prompts, no restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: '2rem' }}>
              {[
                'Full torrc configuration',
                'Circuit building & NEWNYM',
                'Hidden service deployment',
                'Bridge setup simulation',
                'torsocks / proxychains',
                'nyx circuit monitoring',
              ].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#1a3a1a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#4a8a4a' : '#1a3a1a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em',
                padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(0,255,65,0.6)' : '#1a3a1a'),
                borderRadius: '6px', background: guidedDone ? 'rgba(0,255,65,0.12)' : 'transparent',
                color: guidedDone ? accent : '#1a3a1a', cursor: guidedDone ? 'pointer' : 'not-allowed',
                boxShadow: guidedDone ? '0 0 24px rgba(0,255,65,0.18)' : 'none', transition: 'all 0.2s',
              }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && (
              <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a3a1a' }}>
                Complete all {steps.length} guided steps above to unlock the free lab environment
              </div>
            )}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#020802' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#030a03', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a3a' }}>
                Free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for deeper explanations on any Tor technique or scenario.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowKeywords(!showKeywords)}
          style={{ background: 'transparent', border: '1px solid #1a3a1a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a6a3a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0, transition: 'all 0.15s' }}
        >
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — TOR COMMANDS & CONFIG
        </button>
        {showKeywords && (
          <div style={{ background: '#030a03', border: '1px solid #0d1f0d', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['sudo apt install tor', 'Install Tor daemon'],
                ['sudo systemctl start tor', 'Start Tor service'],
                ['sudo systemctl reload tor', 'Reload config (no circuit drop)'],
                ['tor --verify-config', 'Verify torrc syntax'],
                ['curl --socks5-hostname localhost:9050 <url>', 'Safe SOCKS5 proxy (remote DNS)'],
                ['torsocks <command>', 'Force any app through Tor'],
                ['torsocks -i bash', 'Interactive Torified shell'],
                ['cat /etc/tor/torrc', 'View Tor configuration'],
                ['cat /var/lib/tor/hidden_service/hostname', 'Read .onion address'],
                ['mkp224o ghost /output/', 'Mine vanity .onion prefix'],
                ['nyx', 'Terminal circuit monitor (needs ControlPort 9051)'],
                ['systemctl status tor', 'Check daemon status + recent logs'],
                ['journalctl -u tor -n 100', 'View last 100 Tor log lines'],
                ['tor --hash-password "pass"', 'Generate hashed ControlPort password'],
                ['HiddenServiceDir /var/lib/tor/hs/', 'torrc: set hidden service directory'],
                ['HiddenServicePort 80 127.0.0.1:8080', 'torrc: map .onion:80 to local:8080'],
                ['ExitPolicy reject *:*', 'torrc: middle relay (no exit)'],
                ['UseBridges 1', 'torrc: enable bridge mode'],
                ['DNSPort 5300', 'torrc: route DNS through Tor'],
                ['ControlPort 9051', 'torrc: enable control interface'],
                ['SIGNAL NEWNYM', 'ControlPort: request new identity'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#020602', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.7rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#4a7a4a', fontSize: '0.68rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #0d1f0d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '10px' }}>
        <Link href="/modules/tor" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/osint/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>MOD-02 OSINT LAB &#8594;</Link>
      </div>
    </div>
  )
}
