'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#aaff00'

const steps: LabStep[] = [
  {
    id: 'wireless-01',
    title: 'Monitor Mode',
    objective: 'To capture wireless packets you need monitor mode. What aircrack-ng command puts a wireless interface into monitor mode?',
    hint: 'The tool is "airmon-ng" followed by "start" and the interface name.',
    answers: ['airmon-ng start wlan0', 'airmon-ng start', 'airmon-ng'],
    xp: 20,
    explanation: 'airmon-ng start wlan0 creates a monitor-mode interface (usually wlan0mon). Kill interfering processes first: airmon-ng check kill. Monitor mode lets you capture all 802.11 frames, not just those addressed to your MAC.'
  },
  {
    id: 'wireless-02',
    title: 'WPA2 Handshake Capture',
    objective: 'Capture a WPA2 4-way handshake for offline cracking. What airodump-ng flag filters capture to a specific BSSID?',
    hint: 'The flag is --bssid followed by the access point MAC address.',
    answers: ['--bssid', 'airodump-ng --bssid', '--bssid <mac>'],
    xp: 25,
    explanation: 'airodump-ng --bssid AA:BB:CC:DD:EE:FF -c 6 -w capture wlan0mon captures only traffic for the target AP on channel 6. A handshake appears when a client connects or re-authenticates. Force one with: aireplay-ng --deauth 5 -a BSSID wlan0mon.'
  },
  {
    id: 'wireless-03',
    title: 'Hashcat WPA Cracking',
    objective: 'Crack a captured WPA2 handshake with hashcat. What hashcat mode cracks WPA/WPA2 PMKID and handshakes?',
    hint: 'The mode number is 22000 for the modern hcwpax format, or 2500 for older .cap format.',
    answers: ['22000', '-m 22000', '2500', '-m 2500'],
    flag: 'FLAG{wpa2_cracked}',
    xp: 30,
    explanation: 'Convert: hcxpcapngtool capture.cap -o hash.hcwpax, then: hashcat -m 22000 hash.hcwpax wordlist.txt. Add rules: -r /usr/share/hashcat/rules/best64.rule. GPU cracking speed: RTX 4090 = ~3.5 million WPA2 hashes/second, making weak passwords (<10 chars) crackable quickly.'
  },
  {
    id: 'wireless-04',
    title: 'Evil Twin Attack',
    objective: 'An evil twin AP mimics a legitimate network to capture credentials. What tool creates a fake AP and captive portal?',
    hint: 'Tools include hostapd-wpe for WPA-Enterprise, or airbase-ng, or the modern "wifiphisher".',
    answers: ['wifiphisher', 'hostapd-wpe', 'airbase-ng', 'hostapd'],
    xp: 25,
    explanation: 'wifiphisher -e "TargetSSID" -aI wlan0mon -kI wlan1 automates: deauth clients from real AP, broadcast identical SSID, serve a captive portal that harvests credentials or delivers payloads. Success depends on signal strength — stay closer to victim than the real AP.'
  },
  {
    id: 'wireless-05',
    title: 'Bluetooth Reconnaissance',
    objective: 'Scan for nearby Bluetooth devices in discovery mode. What Linux command-line tool scans for Bluetooth devices?',
    hint: 'The tool is "hcitool" — part of the bluez package. Command: hcitool scan',
    answers: ['hcitool scan', 'hcitool', 'btscanner', 'bluetooth scan', 'bluetoothctl'],
    flag: 'FLAG{wireless_recon_complete}',
    xp: 35,
    explanation: 'hcitool scan discovers discoverable Bluetooth Classic devices. For BLE: hcitool lescan. bluetoothctl is the modern interactive alternative. Ubertooth-one can capture BLE advertising packets from non-discoverable devices. Found MACs feed into bluejacking or MITM attacks.'
  }
]

export default function WirelessAttacksLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#4a6a00' }}>
        <Link href="/" style={{ color: '#4a6a00', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/wireless-attacks" style={{ color: '#4a6a00', textDecoration: 'none' }}>WIRELESS ATTACKS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#4a6a00', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-12 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>Wireless Attacks Lab</h1>
        <p style={{ color: '#6a7a4a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          Monitor mode, WPA2 handshake capture, hashcat cracking, evil twin attacks, and Bluetooth recon.
          Complete all 5 steps to earn 135 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #aaff0022', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="wireless-attacks-lab"
        moduleId="wireless-attacks"
        title="Wireless Attacks Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
