'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#b48ead'
const moduleId = 'iot-security'
const moduleName = 'IoT, ICS & Hardware Security'
const moduleNum = '19'

const steps: LabStep[] = [
  {
    id: 'iot-01',
    title: 'Open the Serial Console',
    objective: `You have a test smart-plug on the bench with four unlabelled pads. A logic analyser shows one pad bursting ASCII at boot — the UART TX, running at 115200 baud. Your USB-TTL adapter enumerated as /dev/ttyUSB0.

What command opens the serial console so you can watch the boot log and look for a shell?`,
    hint: 'screen or picocom, the device node, then the baud rate.',
    answers: ['screen /dev/ttyUSB0 115200', 'picocom -b 115200 /dev/ttyUSB0', 'picocom /dev/ttyUSB0 -b 115200', 'sudo screen /dev/ttyUSB0 115200'],
    xp: 24,
    explanation: `screen /dev/ttyUSB0 115200 attaches to the serial line. On a huge share of consumer IoT, the boot finishes at a root prompt or an unauthenticated BusyBox shell — no exploit required.

This is the highest-value, lowest-effort hardware attack: the manufacturer left the development console enabled. The defence is equally simple — disable the UART shell in production firmware.`
  },
  {
    id: 'iot-02',
    title: 'Dump the SPI Flash',
    objective: `The console is locked, so you go after the firmware directly. You clip a CH341A programmer onto the SOIC-8 SPI flash chip with the board powered off.

What flashrom command reads the entire chip into firmware.bin?`,
    hint: 'flashrom with the ch341a_spi programmer and -r to read to a file.',
    answers: ['flashrom -p ch341a_spi -r firmware.bin', 'flashrom -p ch341a_spi -r firmware_dump.bin', 'sudo flashrom -p ch341a_spi -r firmware.bin'],
    xp: 24,
    explanation: `flashrom -p ch341a_spi -r firmware.bin reads the raw flash contents. Reading the chip directly bypasses every software control on the device — you now hold the whole system as a file.

Defence here is signed and encrypted firmware: if the image is encrypted at rest, a raw dump is far less useful.`
  },
  {
    id: 'iot-03',
    title: 'Identify the Image Contents',
    objective: `You have firmware.bin. Before extracting, you want to see what is inside — kernel, bootloader, and which filesystem type the rootfs uses.

What tool scans the image and identifies its embedded components by signature?`,
    hint: 'The standard firmware analysis tool — it walks the binary looking for known magic bytes.',
    answers: ['binwalk firmware.bin', 'binwalk firmware_dump.bin', 'binwalk ./firmware.bin'],
    xp: 24,
    explanation: `binwalk firmware.bin prints a signature map — you will typically see a uImage kernel header, an LZMA blob, and a SquashFS filesystem offset. That tells you the image is intact and what you are dealing with before you carve it.`
  },
  {
    id: 'iot-04',
    title: 'Extract the Filesystem',
    objective: `binwalk confirmed a SquashFS root filesystem inside the image. Now you want it unpacked to disk so you can browse it like a normal Linux system.

What binwalk flag extracts the identified filesystems automatically?`,
    hint: 'A single flag turns identification into extraction.',
    answers: ['binwalk -e firmware.bin', 'binwalk -e firmware_dump.bin', 'binwalk --extract firmware.bin', 'binwalk -Me firmware.bin'],
    xp: 24,
    explanation: `binwalk -e firmware.bin carves and decompresses the embedded filesystems into _firmware.bin.extracted/. Inside you get the full root filesystem — etc, bin, www — exactly as it runs on the device. From here, firmware analysis becomes ordinary Linux review.`
  },
  {
    id: 'iot-05',
    title: 'Hunt for Hardcoded Secrets',
    objective: `You are in the extracted squashfs-root. Vendors routinely bake credentials, keys and tokens into firmware. You want to sweep the whole tree for obvious secrets in one pass.

What recursive grep surfaces passwords, keys and tokens across the filesystem?`,
    hint: 'grep, recursive (-r), case-insensitive (-i), with an alternation of secret-ish words.',
    answers: ['grep -rniE "password|secret|api_key|private key" .', 'grep -rni "password" .', 'grep -rniE "password|secret|key|token" .', 'grep -riE "password|secret|api_key" .'],
    xp: 24,
    explanation: `grep -rniE "password|secret|api_key|private key" . walks every file and flags the likely secrets. On real firmware this routinely turns up plaintext Wi-Fi keys, API tokens, and the contents of /etc/shadow.

If you can grep a secret out of a downloadable update file, so can every attacker on earth — which is the whole argument for keeping secrets out of firmware.`
  },
  {
    id: 'iot-06',
    title: 'Crack the Admin Hash',
    objective: `etc/shadow contained the line: admin:$1$xyz$HASH:... — an MD5-crypt hash. You have a wordlist.

What GPU-accelerated tool cracks this hash against a wordlist?`,
    hint: 'The most popular GPU password-recovery tool — named for the thing it attacks.',
    answers: ['hashcat', 'hashcat -m 500 hash.txt rockyou.txt', 'hashcat -m 500 hash.txt wordlist.txt', 'hashcat hash.txt rockyou.txt'],
    xp: 24,
    explanation: `hashcat (mode 500 for md5crypt) runs the wordlist against the hash on the GPU. Firmware hashes are frequently weak and reused across an entire product line, so one crack can unlock every device of that model.`
  },
  {
    id: 'iot-07',
    title: 'Find the Baked-In Private Key',
    objective: `You suspect the firmware ships a TLS or SSH private key — meaning every device shares the same key. You want to locate any PEM key files in the rootfs.

What find command lists files whose names end in .pem or .key?`,
    hint: 'find with -name and a wildcard; an -o (or) joins two patterns.',
    answers: ['find . -name "*.pem" -o -name "*.key"', 'find . -name "*.key"', 'find . -name "*.pem"', 'find . -name *.pem -o -name *.key'],
    xp: 24,
    explanation: `find . -name "*.pem" -o -name "*.key" locates baked-in keys. A private key in firmware means it is shared by every unit shipped — an attacker who extracts it from one device can impersonate or decrypt traffic for all of them. Keys must be generated per-device on first boot, never embedded.`
  },
  {
    id: 'iot-08',
    title: 'Confirm Command Injection',
    objective: `The device web UI has a "ping test" field. Reading its cgi handler in the firmware, you saw it builds a shell command by concatenating your input: system("ping -c 4 " + host).

On your own bench device, what host value appended after a separator would also run the 'id' command, confirming RCE?`,
    hint: 'A shell separator (semicolon) ends the ping and starts your own command.',
    answers: ['8.8.8.8; id', '127.0.0.1; id', '8.8.8.8 ; id', '1.1.1.1; id', '; id'],
    xp: 24,
    explanation: `A host of 8.8.8.8; id makes the device run: ping -c 4 8.8.8.8; id — the semicolon terminates the ping and runs 'id' on the device. That proves remote code execution.

The fix is identical to any web app: never pass user input into a shell, use argument arrays or strict allow-list validation, and the diagnostics feature stops being an RCE.`
  },
  {
    id: 'iot-09',
    title: 'Scan for BLE Devices',
    objective: `You pivot to radio. A test smart-lock advertises over Bluetooth Low Energy. You want to list nearby BLE devices and capture the lock's MAC address.

What classic command scans for advertising BLE devices?`,
    hint: 'hcitool with the "lescan" subcommand (LE = Low Energy).',
    answers: ['hcitool lescan', 'sudo hcitool lescan', 'bluetoothctl scan on', 'hcitool lescan --duplicates'],
    xp: 24,
    explanation: `hcitool lescan (or bluetoothctl -> scan on) lists advertising devices and their MACs. Many BLE devices advertise openly and pair without encryption, so simply enumerating them is the first step to reading or writing their characteristics.`
  },
  {
    id: 'iot-10',
    title: 'Enumerate GATT Services',
    objective: `You have the lock's MAC: AA:BB:CC:DD:EE:FF. BLE devices expose their functions as GATT services and characteristics. You want to list the primary services to map what the device exposes.

What gatttool command lists the primary services of that device?`,
    hint: 'gatttool with -b for the MAC and the --primary flag.',
    answers: ['gatttool -b AA:BB:CC:DD:EE:FF --primary', 'gatttool -b * --primary', 'gatttool --primary -b AA:BB:CC:DD:EE:FF'],
    xp: 24,
    explanation: `gatttool -b AA:BB:CC:DD:EE:FF --primary lists the device's GATT services; --characteristics then maps the readable/writable attributes. On a device with no pairing enforcement, you can read and sometimes write these directly — which is exactly how trivial smart-lock bypasses work, and why pairing + encryption are mandatory.`
  },
  {
    id: 'iot-11',
    title: 'Capture a Sub-GHz Signal',
    objective: `A test door sensor transmits around 433.92 MHz. With an RTL-SDR plugged in, you want to decode its transmissions and see whether it uses a fixed code.

What rtl_433 command listens on the 433.92 MHz band?`,
    hint: 'rtl_433 with -f and the frequency in Hz (433920000), or just rtl_433 for its default.',
    answers: ['rtl_433 -f 433920000', 'rtl_433', 'rtl_433 -f 433.92M', 'rtl_433 -f 433920000 -A'],
    xp: 24,
    explanation: `rtl_433 -f 433920000 demodulates common sub-GHz device protocols and prints decoded packets. If the same bits appear on every transmission, the device uses a fixed code and is trivially replayable; rolling codes (which change each press) are what resist capture-and-replay.`
  },
  {
    id: 'iot-12',
    title: 'Discover a Modbus PLC',
    objective: `You move to the ICS bench: an isolated switch with a lab PLC simulator at 10.0.50.10. Modbus runs on TCP port 502. You want to confirm it and read device identification — safely, on the simulator only.

What nmap command discovers Modbus and pulls device info on that target?`,
    hint: 'nmap -p 502 with the modbus-discover NSE script.',
    answers: ['nmap -p 502 --script modbus-discover *', 'nmap -p 502 --script modbus-discover 10.0.50.10', 'nmap --script modbus-discover -p 502 10.0.50.10', 'nmap -p502 --script modbus-discover *'],
    xp: 24,
    explanation: `nmap -p 502 --script modbus-discover 10.0.50.10 confirms Modbus and enumerates unit IDs and device identification. Remember: this is only ever run against a simulator or an isolated bench PLC — the same scan can crash a fragile production controller, and in OT that can move real machinery.`
  },
  {
    id: 'iot-13',
    title: 'Read Holding Registers',
    objective: `Modbus is confirmed on the simulator. Modbus has no authentication, so a read of its holding registers is both a legitimate command and an enumeration of the live process values.

Using mbtget, what command reads 10 holding registers starting at address 0 from 10.0.50.10?`,
    hint: 'mbtget with -r3 (read holding regs), -a 0 (address), -n 10 (count), then the host.',
    answers: ['mbtget -r3 -a 0 -n 10 10.0.50.10', 'mbtget -r3 -a 0 -n 10 *', 'mbtget -r3 -n 10 -a 0 10.0.50.10'],
    xp: 24,
    explanation: `mbtget -r3 -a 0 -n 10 10.0.50.10 reads ten holding registers — the live sensor/setpoint values. Because Modbus trusts anyone who can reach it, the only real defence is reachability: segment the OT network, allow-list the master-slave pairs, and monitor passively.`
  },
  {
    id: 'iot-14',
    title: 'Spot Internet-Exposed Telnet',
    objective: `IoT botnets like Mirai recruit devices by finding exposed Telnet and trying default passwords. As a defender auditing your own IoT VLAN, you want to find any device still exposing Telnet on 23 or 2323.

What nmap command scans your subnet for those Telnet ports?`,
    hint: 'nmap with -p for both ports against the subnet (use * / CIDR for the range).',
    answers: ['nmap -p 23,2323 *', 'nmap -p 23,2323 10.0.60.0/24', 'nmap -p23,2323 *', 'nmap -p 23,2323 192.168.1.0/24'],
    xp: 24,
    explanation: `nmap -p 23,2323 10.0.60.0/24 finds devices exposing Telnet — the exact doorway Mirai brute-forced with default credentials. Any hit is a finding: management services must never be internet-reachable, and defaults must be replaced on first boot.`
  },
  {
    id: 'iot-15',
    title: 'Detect a Compromised Device',
    objective: `One camera on the IoT VLAN may be part of a botnet. IoT devices have predictable traffic, so deviation is the signal. You have a capture, iot.pcap, and want to run it through an IDS to flag scanning and C2 beacons.

What command replays the pcap through Suricata for analysis?`,
    hint: 'suricata with -r to read a pcap file.',
    answers: ['suricata -r iot.pcap', 'suricata -r iot.pcap -S rules', 'zeek -r iot.pcap', 'suricata -r ./iot.pcap'],
    xp: 24,
    explanation: `suricata -r iot.pcap (or zeek -r) analyses the capture offline and flags the three botnet tells: a device suddenly scanning many external IPs, a long-lived connection to an unknown C2 host, and sustained high-volume egress. Detection lives on the network, because the compromised device itself shows its owner nothing.`
  },
  {
    id: 'iot-16',
    title: 'Verify Firmware Is Signed',
    objective: `You are now hardening a product. Before trusting an update, the bootloader should verify the image's signature against a key in a hardware root of trust. You want to check whether update.bin even carries a signature block.

What command prints the file's type and lets you see if it is a signed/packaged image vs a raw blob?`,
    hint: 'The simplest triage: ask the OS what kind of file it is.',
    answers: ['file update.bin', 'binwalk -A update.bin', 'file ./update.bin', 'binwalk update.bin'],
    xp: 24,
    explanation: `file update.bin (and binwalk) reveal whether the image is a signed/packaged update or a raw, unverified blob. Unsigned firmware means an attacker can flash their own image; signed + encrypted images, verified by a hardware root of trust, close that door. Verifying the chain is the difference between a secure device and a brick-your-fleet incident.`
  },
  {
    id: 'iot-17',
    title: 'Segment the Network',
    objective: `The single most effective IoT/ICS defence is architectural: weak devices are fine if nothing dangerous can reach them. Your report's top recommendation isolates IoT and OT from corporate IT and the internet.

What two-word control, implemented with VLANs and firewalls, is this?`,
    hint: 'Dividing the network so one zone cannot freely reach another. Two words.',
    answers: ['network segmentation', 'segmentation', 'microsegmentation', 'network segregation'],
    xp: 24,
    explanation: `Network segmentation — enforced with VLANs and firewalls — keeps an IT compromise from reaching OT and keeps one weak device from reaching another. It is the control that would have blunted Stuxnet's crossover and starved Mirai's spread. In ICS, the segmented DMZ (Purdue Level 3.5) is the only sanctioned bridge between the plant and the enterprise.`
  },
  {
    id: 'iot-18',
    title: 'Capture the Operation Flag',
    objective: `You have run the full IoT/ICS kill chain on the bench — hardware, firmware, radio, industrial protocols — and written the hardening report. The framework that maps the real tactics seen against industrial systems, and turns your findings into an auditable programme, gives you your flag.

Which MITRE framework is purpose-built for industrial control system threats? (format: FLAG{...}, e.g. FLAG{att&ck-for-ics})`,
    hint: 'MITRE ATT&CK, but the variant specifically for Industrial Control Systems.',
    answers: ['FLAG{att&ck-for-ics}', 'att&ck for ics', 'mitre att&ck for ics', 'attack for ics', 'FLAG{attack-for-ics}'],
    flag: 'FLAG{att&ck-for-ics}',
    xp: 32,
    explanation: `MITRE ATT&CK for ICS catalogues the tactics and techniques actually observed against industrial systems — the OT counterpart to enterprise ATT&CK. Paired with IEC 62443 and the NIST CSF, it turns everything you did in this module into a defensible, auditable security programme.

Operation complete: you can open the hardware, read the firmware, sniff the radio, speak the industrial protocols — and, most importantly, close every door you learned to open.`
  },
]

const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

export default function IoTSecurityLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_iot-security-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#6a5a70' }}>
        <Link href="/" style={{ color: '#6a5a70', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/iot-security" style={{ color: '#6a5a70', textDecoration: 'none' }}>IOT, ICS &amp; HARDWARE</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/iot-security" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #2a1e2e', borderRadius: '3px', color: '#6a5a70', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(180,142,173,0.1)', border: '1px solid rgba(180,142,173,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(180,142,173,0.04)', border: '1px solid rgba(180,142,173,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#2a1e2e', border: p.active ? '2px solid ' + accent : '1px solid #2a1e2e', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#5a4a60', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#2a1e2e', margin: '0 2px' }}>&#8212;</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#6a5a70' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP &nbsp;·&nbsp; {steps.length} STEPS
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE &#8212; LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* PHASE 1 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(180,142,173,0.1)', border: '1px solid rgba(180,142,173,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a4a60', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 &#8212; GUIDED OPERATION</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>The Bench</h1>
          </div>
        </div>

        <p style={{ color: '#8a7a90', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          A full hardware-to-report engagement on a bench of test devices: crack a UART console, dump and carve firmware,
          loot its secrets, confirm an embedded-web RCE, sniff BLE and sub-GHz radio, safely enumerate a lab Modbus PLC,
          hunt a botnet-recruited camera, and harden the lot. All {steps.length} steps are simulated and isolated &#8212; read every explanation.
        </p>

        <div style={{ background: 'rgba(180,142,173,0.03)', border: '1px solid rgba(180,142,173,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#3a2e40', letterSpacing: '0.25em', marginBottom: '8px' }}>SKILLS DEVELOPED</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {['UART console access', 'SPI flash dumping', 'Firmware carving (binwalk)', 'Secret hunting', 'Hash cracking', 'Shared-key discovery', 'Embedded web RCE', 'BLE enumeration', 'GATT mapping', 'Sub-GHz capture (rtl_433)', 'Modbus discovery', 'PLC register reads', 'Botnet exposure audit', 'IDS detection (Suricata)', 'Firmware signing checks', 'Network segmentation', 'MITRE ATT&CK for ICS'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#8a6a90', background: 'rgba(180,142,173,0.06)', border: '1px solid rgba(180,142,173,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="iot-security-lab"
          moduleId={moduleId}
          title="The Bench"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(180,142,173,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(180,142,173,0.4)' : '#2a1e2e'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a4a60', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#8a6a90' : '#5a4a60', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 &#8212; FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#5a4a60' }}>Full IoT/ICS Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(180,142,173,0.04)' : '#07050a', border: '1px solid ' + (guidedDone ? 'rgba(180,142,173,0.25)' : '#140e1a'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#8a6a90' : '#3a2e40', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR FREE-FORM TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#5a4a60', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#8a6a90', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for IoT, ICS and hardware security
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: '2rem' }}>
              {['binwalk firmware', 'flashrom dumps', 'gatttool BLE', 'rtl_433 radio', 'nmap modbus', 'suricata IDS'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#3a2e40' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#8a6a90' : '#3a2e40' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(180,142,173,0.6)' : '#2a1e2e'), borderRadius: '6px', background: guidedDone ? 'rgba(180,142,173,0.12)' : 'transparent', color: guidedDone ? accent : '#3a2e40', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(180,142,173,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '▸ LAUNCH FREE LAB ENVIRONMENT' : 'COMPLETE THE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a2e40' }}>Complete all {steps.length} guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#07050a' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0a070c', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a4a60' }}>
                Free practice mode &#8212; bench and simulators only. Ask <span style={{ color: accent }}>GHOST</span> (bottom-right) for a hint on any technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #2a1e2e', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a4a60', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE &#8212; IOT / ICS COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#07050a', border: '1px solid #140e1a', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['screen /dev/ttyUSB0 115200', 'Open a UART serial console'],
                ['flashrom -p ch341a_spi -r firmware.bin', 'Dump an SPI flash chip'],
                ['binwalk -e firmware.bin', 'Carve firmware filesystems'],
                ['grep -rniE "password|secret|key" .', 'Hunt secrets in a rootfs'],
                ['find . -name "*.pem" -o -name "*.key"', 'Find baked-in private keys'],
                ['hcitool lescan', 'Scan for BLE devices'],
                ['gatttool -b MAC --primary', 'Enumerate BLE GATT services'],
                ['rtl_433 -f 433920000', 'Decode sub-GHz radio traffic'],
                ['nmap -p 502 --script modbus-discover TARGET', 'Discover a Modbus PLC (sim only)'],
                ['mbtget -r3 -a 0 -n 10 TARGET', 'Read Modbus holding registers'],
                ['nmap -p 23,2323 SUBNET', 'Audit for exposed Telnet (Mirai doorway)'],
                ['suricata -r iot.pcap', 'Detect botnet behaviour in a capture'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#050308', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#8a6a90', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #140e1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/iot-security" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a4a60' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a4a60' }}>ALL MODULES &#8594;</Link>
      </div>
    </div>
  )
}
