'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#aaff00'
const moduleId = 'wireless-attacks'
const moduleName = 'Wireless Attacks'
const moduleNum = '12'
const xpTotal = 455

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
    explanation: 'wifiphisher -e "TargetSSID" -aI wlan0mon -kI wlan1 automates: deauth clients from real AP, broadcast identical SSID, serve a captive portal that harvests credentials or delivers payloads. Success depends on signal strength - stay closer to victim than the real AP.'
  },
  {
    id: 'wireless-05',
    title: 'Bluetooth Reconnaissance',
    objective: 'Scan for nearby Bluetooth devices in discovery mode. What Linux command-line tool scans for Bluetooth devices?',
    hint: 'The tool is "hcitool" - part of the bluez package. Command: hcitool scan',
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
  },
  {
    id: 'wireless-11',
    title: 'WPA Enterprise - PEAP/EAP Credential Capture',
    objective: 'WPA Enterprise (802.1X) uses RADIUS authentication. A rogue AP that accepts PEAP connections can capture MSCHAPv2 challenge/response pairs for offline cracking. What tool creates a rogue WPA Enterprise AP specifically designed to capture PEAP credentials?',
    hint: 'The tool name contains "wpe" which stands for Wireless Pwnage Edition. Two main options exist: one starts with "hostapd" and one starts with "eap".',
    answers: ['hostapd-wpe', 'eaphammer', 'freeradius-wpe', 'hostapd wpe'],
    xp: 30,
    explanation: 'WPA Enterprise uses EAP (Extensible Authentication Protocol) methods: PEAP (Protected EAP, inner MSCHAPv2 - most common in corporate), EAP-TTLS, EAP-TLS (client certs). Attack: hostapd-wpe creates rogue AP accepting any PEAP connection. Client connects (auto-connects to known SSID), sends domain/username + MSCHAPv2 response. hostapd-wpe logs the challenge/response pair. Crack offline: asleap -C challenge -R response -W wordlist.txt. Or use hashcat -m 5500 (NTLMv1) or -m 5600 (NTLMv2). EAPHammer: more modern tool - python3 eaphammer -i wlan0 --channel 6 --auth wpa-eap --essid CorpWifi --creds. Certificates: clients that do NOT validate the RADIUS server certificate are vulnerable - extremely common in enterprise environments. If client validates cert: need a valid cert for the domain (via CA trusted by client). Defence: configure supplicant to validate RADIUS certificate, use EAP-TLS (mutual cert auth), 802.1X Network Policy Server (NPS) with correct cert pinning.'
  },
  {
    id: 'wireless-12',
    title: 'KRACK - Key Reinstallation Attacks',
    objective: 'KRACK (Key Reinstallation Attacks) exploits the WPA2 4-way handshake by replaying handshake messages to force nonce reuse. Which handshake message does KRACK manipulate to trigger key reinstallation on the client?',
    hint: 'The 4-way handshake has 4 messages. KRACK targets the third one sent by the AP to the client.',
    answers: ['message 3', 'msg 3', 'handshake message 3', 'eapol message 3', '4-way handshake message 3'],
    xp: 25,
    explanation: '4-way handshake: M1 (AP sends ANonce), M2 (Client sends SNonce + MIC), M3 (AP sends GTK encrypted, confirms PTK), M4 (Client confirms). KRACK: attacker retransmits M3, causing client to reinstall already-used key and reset nonce to 0. With nonce reuse, attacker can decrypt packets (TKIP: decrypt + forge; CCMP: decrypt only). CVE-2017-13077 through CVE-2017-13088 series. Patched in all major OSes (Android, iOS, Windows, Linux). Unpatched IoT devices remain vulnerable. Group key reinstallation: CVE-2017-13078 (all platforms). Testing: krack-test-client.py from original researchers. wpa_supplicant vulnerability: Linux wpa_supplicant 2.6 was especially vulnerable - installed all-zero key (complete decryption). Modern relevance: legacy industrial and IoT devices with no patch mechanism, embedded systems (medical devices, industrial controllers). Defence: patch all devices, use HTTPS for sensitive traffic (provides transport-layer protection even if WPA2 is broken), WPA3 uses SAE handshake which is not vulnerable to KRACK.'
  },
  {
    id: 'wireless-13',
    title: 'WPA3 SAE (Dragonblood) Attacks',
    objective: 'WPA3 uses SAE (Simultaneous Authentication of Equals) instead of PSK. The Dragonblood attack against WPA3 is a side-channel attack. What type of side-channel does Dragonblood exploit in the SAE handshake?',
    hint: 'The attack measures how long the SAE Confirm message takes to process - the response time varies based on the guess.',
    answers: ['timing attack', 'side channel', 'timing side channel', 'cache timing', 'timing'],
    flag: 'FLAG{wpa3_analysed}',
    xp: 25,
    explanation: 'WPA3-Personal uses SAE (Dragonfly handshake) - provides forward secrecy (compromising PSK does not decrypt past traffic), resistant to offline dictionary attacks. Dragonblood vulnerabilities (CVE-2019-9494, CVE-2019-9496): timing side-channel in the SAE Confirm message processing - response time varies based on password guess correctness. Cache-based side-channel: memory access patterns during elliptic curve operations leak information. Downgrade attack: force WPA3 AP to accept WPA2 connections, then crack WPA2. Denial of Service: anti-clogging tokens help but resource exhaustion is still possible. Patched: Wi-Fi Alliance released WPA3-R2 addressing Dragonblood. WPA3-Enterprise (192-bit): uses Suite-B cryptography (GCMP-256, HMAC-SHA384, ECDHE with 384-bit), provides highest security. WPA3 transition mode: AP accepts both WPA2 and WPA3 - most deployments in this mode, WPA2 attack surface remains. Practical reality: WPA3 significantly raises the bar - focus shifts to enterprise attacks (PEAP, EAP-TLS credential theft), phishing for PSK, and evil twin attacks rather than offline cracking.'
  },
  {
    id: 'wireless-14',
    title: '802.11 Frame Injection and Packet Crafting',
    objective: 'Scapy can craft and inject raw 802.11 frames when a wireless interface is in monitor mode. What Scapy layer represents an 802.11 WiFi frame?',
    hint: 'The Scapy layer name uses the shorthand for the 802.11 standard starting with "Dot".',
    answers: ['Dot11', 'IEEE80211', '802.11', 'dot11', 'scapy Dot11'],
    xp: 20,
    explanation: 'Scapy 802.11 layers: Dot11 (base frame), Dot11Beacon (beacon frames), Dot11ProbeReq/Resp (probe frames), Dot11Auth (authentication), Dot11AssoReq/Resp (association). Craft beacon: pkt = RadioTap() / Dot11(addr1="ff:ff:ff:ff:ff:ff", addr2=SRC_MAC, addr3=SRC_MAC) / Dot11Beacon() / Dot11Elt(ID="SSID", info="FakeAP") / Dot11Elt(ID="Rates"...). Send: sendp(pkt, iface="wlan0mon", inter=0.1). Probe response injection: capture probe requests with sniff(), craft matching probe responses. Disassociation/Deauth frame injection: Dot11Deauth() - without 802.11w PMF these are accepted. Beacon flooding: generate hundreds of SSIDs - causes WiFi scanner slowdown and SSID list pollution. Applications: custom AP simulation, testing client probe behaviour (PineAP captures probes for karma attacks), testing 802.11w (PMF) compliance, FMS/PTW attacks on WEP (historical). RadioTap header required for injection: includes channel and data rate flags. Card support: Atheros (ath9k_htc), Ralink (rt2800usb) chipsets best for injection. aircrack-ng injection test: aireplay-ng -9 wlan0mon.'
  },
  {
    id: 'wireless-15',
    title: 'Zigbee and IoT Wireless Protocol Attacks',
    objective: 'Zigbee is used by smart home devices (Philips Hue, Amazon Echo, etc.) and operates on IEEE 802.15.4. What tool sniffs and analyses Zigbee traffic using a compatible dongle?',
    hint: 'The tool name sounds like something that would harm bees. It is a well-known Zigbee security toolkit.',
    answers: ['killerbee', 'zbdump', 'wireshark zigbee', 'ApiMote', 'zbwireshark'],
    xp: 25,
    explanation: 'Zigbee security model: 128-bit AES, uses network keys and link keys. Default install code: many devices ship with known or derivable install codes. KillerBee toolkit: zbdump -i /dev/ttyUSB0 -w capture.pcap (capture), zbfind (find devices), zbstumbler (discovery), zbreplay (replay attacks), zbid (identify devices). Hardware: ApiMote, RZUSBSTICK, Atmel RZUSBstick. Attacks: key sniffing during device joining (Zigbee 3.0 uses TCLK - trust center link key), replay attacks (no nonce in Zigbee 2006), jamming (simple CW jammer on 2.4GHz disrupts Zigbee and 802.11), touchlink commissioning attack (factory reset devices by sending touchlink scan request at close range to Philips Hue). Z-Wave attacks: Z-Wave S0 security uses static AES key exchanged in plaintext during inclusion - sniff with HackRF + RTL-SDR. Z-Wave S2: ECDH key exchange, more secure. zwave-js-ui for testing. RFID attacks (separate from RF): Proxmark3 for NFC/MIFARE cloning. Flipper Zero: all-in-one RF/NFC/IR/RFID testing device. Practical IoT wireless pentesting: always check for unencrypted Zigbee traffic, weak pairing procedures, and replay attacks on door locks and lights.'
  },
  {
    id: 'wireless-16',
    title: 'RFID and NFC Security Testing',
    objective: 'Mifare Classic cards used in access control systems have a known cryptographic vulnerability. What tool clones Mifare Classic RFID cards by exploiting this weakness?',
    hint: 'The most popular dedicated RFID research tool is named after the fictional character from a sci-fi film and has a version number 3.',
    answers: ['proxmark3', 'proxmark', 'acr122u', 'mfoc', 'mfcuk'],
    flag: 'FLAG{rfid_cloned}',
    xp: 25,
    explanation: 'Mifare Classic uses Crypto-1 cipher - vulnerable to: darkside attack (recover one key from scratch), nested authentication attack (recover all keys once one is known), hardnested attack (improved nested for partially randomised cards). Proxmark3 commands: hf mf autopwn (automated Mifare Classic attack), hf mf dump (dump card after keys recovered), hf mf restore TARGET_UID (write dump to blank card). mfoc: automated nested attack tool. mfcuk: darkside attack implementation. Card types: Mifare Classic 1K (most common for access control), Mifare Ultralight (disposable, transit tickets), Mifare DESFire (AES-based, much more secure). NFC payment attacks: HF 14a (ISO 14443A) - read without authentication for transit cards. Replay/relay attacks: Proxmark3 standalone relay (extend range between reader and legitimate card - bypass physical proximity requirement). Android NFC: many Android phones can read/write NFC (NXP TagInfo app, NFC Tools). Flipper Zero: built-in 125KHz LF RFID reader (EM4100, HID Prox) and 13.56MHz HF NFC - extremely popular for pentesting. Defences: Mifare DESFire EV2/EV3, combined authentication (NFC + PIN), RFID-blocking sleeves for passports, rolling codes for newer access systems.'
  },
  {
    id: 'wireless-17',
    title: 'Software Defined Radio - RF Signal Analysis',
    objective: 'SDR allows capture and analysis of any radio frequency signal with cheap hardware. What popular SDR software is used with RTL-SDR dongles to visualise radio frequency spectrums?',
    hint: 'The most popular Linux/Mac SDR application name sounds like it could be a sound effect.',
    answers: ['gqrx', 'sdrsharp', 'sdr#', 'gnuradio', 'sdrangel', 'rtl_power'],
    xp: 20,
    explanation: 'RTL-SDR: cheap (~$25) USB TV tuner repurposed as SDR receiver. Frequency range: 25MHz - 1.75GHz (with modifications). Software: GQRX (Linux/Mac), SDR# (Windows), GNU Radio (scripting/automation). Captures: AM/FM radio, NOAA weather satellites, aircraft ADS-B (FlightAware), AIS ship tracking, POCSAG pager messages (unencrypted), GSM cell tower downlink, ISM band (433MHz, 868MHz, 915MHz for IoT sensors), baby monitors, garage doors, car key fobs. Replay attacks: use HackRF One (TX capable, ~$350) to replay captured signals. Rolling code bypass: RollJam attack (Samy Kamkar) - jam + record first press, jam + record second press (victim uses first signal), replay second signal later. RTL_FM: rtl_fm -f 162.400M -s 22050 - | aplay -r 22050 -f S16_LE (decode NOAA weather). Decoding protocols: Universal Radio Hacker (URH), rtl_433 (IoT sensor decoding), dump1090 (ADS-B aircraft), gr-gsm (GSM sniffing). Practical pentesting: sub-GHz IoT sensors transmitting plaintext data, keyfob signal capture, pager interception (hospitals still use unencrypted pagers for patient data).'
  },
  {
    id: 'wireless-18',
    title: 'Wireless Pentest - Full Methodology',
    objective: 'During a wireless penetration test you must document all findings. What organisation publishes the Wireless Penetration Testing Framework that categorises wireless attacks?',
    hint: 'This organisation is known for publishing the Web Application Security Testing Guide and many other security frameworks used globally.',
    answers: ['owasp', 'sans', 'ptes', 'nist', 'isecom'],
    flag: 'FLAG{wireless_pentest_complete}',
    xp: 30,
    explanation: 'Full wireless pentest methodology: PHASE 1 - RECONNAISSANCE: Passive survey: airodump-ng all channels, document SSIDs, BSSIDs, clients, signal strength, encryption type, WPS enabled. Identify: corporate SSIDs vs guest vs IoT, hidden SSIDs (still visible in probe responses), rogue APs (SSIDs matching corporate but different BSSID/channel). Tools: Kismet (passive, logs to pcap), WiFi Pineapple (active and passive). PHASE 2 - VULNERABILITY IDENTIFICATION: WEP detection (flag as critical - broken), WPA2 with WPS (reaver/bully attack), weak passphrases (dictionary attack), enterprise with no cert validation (PEAP capture), open networks, default router credentials. PHASE 3 - EXPLOITATION: Ordered by risk: WEP (immediate crack), WPS (pixie dust or PIN brute), WPA2 handshake + weak PSK, WPA Enterprise credential capture, Evil twin for remaining. PHASE 4 - POST-EXPLOITATION: From internal network: scan with nmap, test web interfaces of APs (admin panel), lateral movement. PHASE 5 - REPORTING: Per-AP findings with SSID, BSSID, channel, vulnerability, risk, recommendation. Include signal strength map if physical survey. Regulatory note: always get written authorisation before testing - transmitting on licensed bands without authorisation is illegal. Some attacks (deauth) may be illegal even with authorisation in some jurisdictions - clarify scope. Hardware kit: at minimum 2 adapters (monitor mode + AP creation), ideally Alfa AWUS036ACH (dual-band, high power), Proxmark3, HackRF One, Bluetooth sniffer.'
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
              {i === 0 && <span style={{ fontSize: '7px', color: '#2a3a00', margin: '0 2px' }}>-</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#6a7a40' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP AVAILABLE
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE - LAUNCH FREE LAB BELOW
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
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#3a5a00', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 - GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Wireless Attacks Lab</h1>
          </div>
        </div>

        <p style={{ color: '#6a7a4a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Monitor mode, WPA2 handshake capture, hashcat cracking, evil twin attacks, Bluetooth recon, WPA Enterprise, KRACK, WPA3/SAE, frame injection, Zigbee, RFID, SDR, and full pentest methodology.
          Type real commands, earn XP, and capture flags. Complete all 18 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(170,255,0,0.03)', border: '1px solid rgba(170,255,0,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#2a3a00', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Monitor mode', 'WPA2 handshake', 'PMKID attack', 'Hashcat cracking', 'Evil twin AP', 'Deauth attacks', 'Bluetooth scanning', 'WPS vulnerabilities', 'WPA Enterprise PEAP', 'KRACK nonce reuse', 'WPA3 Dragonblood', '802.11 frame injection', 'Zigbee IoT attacks', 'RFID NFC cloning', 'SDR signal analysis', 'Pentest methodology'].map(c => (
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
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#6a7a40' : '#3a5a00', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 - FREE LAB ENVIRONMENT</div>
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
              {['aircrack-ng suite', 'wifiphisher attacks', 'Bluetooth recon', 'WPS cracking', 'PMKID capture', 'Hashcat GPU cracking', 'WPA Enterprise PEAP', 'SDR signal analysis', 'RFID NFC testing', 'Zigbee IoT attacks'].map(feat => (
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
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#2a3a00' }}>Complete all 18 guided steps above to unlock the free lab environment</div>}
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
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE - WIRELESS COMMANDS
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
                ['hostapd-wpe hostapd-wpe.conf', 'Rogue WPA Enterprise AP for PEAP capture'],
                ['asleap -C CHALLENGE -R RESPONSE -W wordlist.txt', 'Crack MSCHAPv2 from PEAP capture'],
                ['hcxdumptool -i wlan0mon -o pmkid.pcapng', 'Capture PMKID without clients'],
                ['ubertooth-btle -f -A 37', 'Sniff BLE advertising channel 37'],
                ['proxmark3 hf mf autopwn', 'Automated Mifare Classic attack'],
                ['zbdump -i /dev/ttyUSB0 -w capture.pcap', 'Capture Zigbee traffic'],
                ['gqrx', 'Visualise RF spectrum with RTL-SDR'],
                ['rtl_433', 'Decode 433MHz IoT sensor transmissions'],
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
