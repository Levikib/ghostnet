'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '../../components/ModuleCodex'
import { Local, Watch } from '../../components/learn/Mtaani'

const accent = '#b48ead'

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#9a90a0', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem', fontFamily: 'sans-serif' }}>{children}</p>
)

const H = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: accent, marginTop: '2rem', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>{children}</h3>
)

const Note = ({ label, children }: { label?: string; children: React.ReactNode }) => (
  <div style={{ background: 'rgba(180,142,173,0.06)', border: '1px solid rgba(180,142,173,0.28)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '6px' }}>{label || 'NOTE'}</div>
    <p style={{ color: '#9a90a0', fontSize: '0.82rem', lineHeight: 1.7, margin: 0, fontFamily: 'sans-serif' }}>{children}</p>
  </div>
)

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#7a6a80', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#0a070c', border: '1px solid #2a1e2e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#d8b8e0', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #2a1e2e' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#c08fd0', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #1a1020', background: i % 2 === 0 ? 'transparent' : 'rgba(180,142,173,0.03)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#9a90a0', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'iot-ch1',
    title: 'The IoT and ICS Attack Surface',
    difficulty: 'BEGINNER',
    readTime: '14 min',
    labLink: '/modules/iot-security/lab',
    content: (
      <div>
        <P>Everything with a chip and a network connection is now a target: a smart doorbell, a factory sensor, a hospital infusion pump, a city water valve. These devices were often built for cost and convenience, not security, and many sit in networks nobody patches. This module is about understanding that world well enough to break into a test device in your own lab — and, far more importantly, to defend the ones that matter.</P>

        <Local>
          Look at the <em>prepaid token meter</em> on an estate wall &mdash; the one you top up with a 20-digit code from M-Pesa. It is a tiny, cheap computer bolted outdoors that controls something physical: your power or water. Nobody updates it for 15 years, anyone can walk up and touch it, and the engineer&apos;s default code is often still set. That is the whole story of IoT and ICS security: small computers, built cheap, living in the open, running something real. Break the token meter&apos;s brain and you are not just crashing an app &mdash; you are turning the estate&apos;s water on and off.
        </Local>
        <H>Why IoT and ICS Are Different</H>
        <Table headers={['PROPERTY', 'WHY IT MATTERS FOR SECURITY']} rows={[
          ['Long lifespans (10–25 yrs for ICS)', 'Devices run unpatched, unsupported OSes long after flaws are public'],
          ['Physical access is common', 'An attacker can hold the hardware: open it, solder to it, read its chips'],
          ['Weak or hardcoded credentials', 'Default admin/admin and baked-in backdoor accounts are rampant'],
          ['Minimal update mechanisms', 'Many devices cannot be patched at all, or only via risky manual flashing'],
          ['Safety + availability first', 'In ICS, a crash can stop a turbine or a pump — you cannot just "reboot and test"'],
          ['Obscure protocols', 'Modbus, DNP3, BLE, Zigbee — often with no authentication or encryption by design'],
        ]} />

        <H>The Layers You Can Attack</H>
        <P>Think of an IoT device as a stack, each layer a different discipline you will meet in this module:</P>
        <Table headers={['LAYER', 'EXAMPLE ATTACK', 'CHAPTER']} rows={[
          ['Hardware', 'Solder to a UART header, drop into a root shell', 'Ch 2'],
          ['Firmware', 'Extract the flash, find hardcoded keys and backdoors', 'Ch 3'],
          ['Local services', 'Exploit the embedded web UI or API', 'Ch 4'],
          ['Radio', 'Sniff and replay BLE / Zigbee / sub-GHz RF', 'Ch 5'],
          ['Industrial control', 'Enumerate and understand PLCs over Modbus/DNP3', 'Ch 6–7'],
          ['The internet', 'IoT malware recruiting devices into botnets', 'Ch 8'],
        ]} />

        <Note label="LAB-SAFE RULE">Practise only on hardware you own and on protocols in an isolated bench network. ICS especially: never scan, probe, or send traffic to a live industrial or medical system. The wrong packet to a real PLC can stop a physical process and hurt people. Everything advanced in this module assumes a lab PLC or a simulator — never production.</Note>
      </div>
    ),
    takeaways: [
      'IoT/ICS devices trade security for cost, longevity and physical exposure — unpatched and often credential-weak',
      'Attacks span six layers: hardware, firmware, local services, radio, industrial control, and internet-scale botnets',
      'Availability and physical safety dominate ICS — you cannot just reboot and retry on a live plant',
      'Only ever test hardware you own, on an isolated bench — never touch a live industrial or medical system',
    ]
  },

  {
    id: 'iot-ch2',
    title: 'Hardware Recon: UART, JTAG and SPI',
    difficulty: 'INTERMEDIATE',
    readTime: '20 min',
    labLink: '/modules/iot-security/lab',
    content: (
      <div>
        <P>Open almost any IoT device and you find debug interfaces the manufacturer left on the board. They were there for development — and they are still there for you. UART often drops you straight into a root console; JTAG gives full CPU control; SPI flash chips hold the firmware you will extract in the next chapter.</P>

        <Local>
          When a <em>fundi</em> services a standby generator, he doesn&apos;t rebuild it &mdash; he pops open a little flap and plugs a cable into the diagnostic socket the manufacturer left inside. Circuit boards have the same thing: small metal pads the engineers used while building the device and simply never removed. UART is that service hatch. Clip onto it with a cheap cable and you often land straight inside the device&apos;s brain, no password asked &mdash; exactly the hatch the maker forgot to lock.
        </Local>
        <H>UART — the Easy Win</H>
        <P>A UART (serial console) is usually four pads or pins: VCC, GND, TX, RX. With a USB-to-TTL adapter you watch the boot log and, on a shocking number of devices, land at a shell.</P>
        <Watch
          reads={<>The lines starting with <code>#</code> are just notes to the reader, not commands. The two real commands (<code>screen</code> and <code>picocom</code>) simply open a window onto the device&apos;s service hatch so you can watch it switch on. Read it to see the shape of the task &mdash; find the pads, wire three little cables, open the console.</>}
          later={<>You&apos;ll wire a USB-TTL adapter to a practice board and catch the boot log in the lab.</>}
        >
        <Pre label="// IDENTIFY AND CONNECT TO A UART">{`# Identify the pins: GND by continuity to the shield, then TX shows boot
# text on a logic analyser / multimeter. Baud is usually 115200 or 57600.

# Wire adapter GND->GND, adapter RX->board TX, adapter TX->board RX.
# Then open the serial console (adapter enumerates as /dev/ttyUSB0):
screen /dev/ttyUSB0 115200

# or:
picocom -b 115200 /dev/ttyUSB0

# Watch the bootloader. Interrupting U-Boot often gives a bootloader shell;
# many devices simply present a root login or an unauthenticated shell.`}</Pre>
        </Watch>

        <H>The Interfaces at a Glance</H>
        <Table headers={['INTERFACE', 'GIVES YOU', 'TOOL']} rows={[
          ['UART (serial)', 'Boot log, console, often a root shell', 'USB-TTL adapter + screen/picocom'],
          ['JTAG / SWD', 'Full CPU debug: halt, read/write memory, dump flash', 'Bus Pirate, J-Link, OpenOCD'],
          ['SPI flash', 'Direct read of the firmware image off the chip', 'CH341A programmer, flashrom'],
          ['I2C', 'EEPROMs holding config, keys, calibration', 'Bus Pirate, i2c tools'],
        ]} />

        <H>Reading the SPI Flash Directly</H>
        <Pre label="// DUMP FIRMWARE OFF AN SPI FLASH CHIP">{`# Clip a CH341A programmer onto the SOIC-8 flash chip (power the board off),
# then read the whole chip to a file:
flashrom -p ch341a_spi -r firmware_dump.bin

# Verify you got a sane image (not all 0xFF):
binwalk firmware_dump.bin
#   -> look for 'uImage', 'Squashfs filesystem', 'LZMA', etc.`}</Pre>

        <Note label="FINDING THE PINS">No labels on the board? Use a logic analyser (even a cheap 8-channel one) to watch the pads at boot: the one that bursts human-readable ASCII at a standard baud is TX. JTAGulator and the JTAGenum Arduino sketch automate finding JTAG pinouts on unlabelled headers.</Note>

        <Note label="ATTACK → DEFEND">For a defender, this chapter is the argument for disabling debug interfaces in production, blowing eFuses that lock JTAG, and not shipping a root shell on the UART. You secure what you have watched an attacker walk onto the board and use.</Note>
      </div>
    ),
    takeaways: [
      'UART headers frequently hand you a root console — a USB-TTL adapter and screen at 115200 is often all it takes',
      'JTAG/SWD gives full CPU debug; SPI flash can be read directly off the chip with a CH341A and flashrom',
      'Unlabelled pins yield to a logic analyser (find TX by the ASCII boot burst) and tools like JTAGulator',
      'Defence: disable debug interfaces, lock JTAG via eFuses, and never ship an unauthenticated serial shell',
    ]
  },

  {
    id: 'iot-ch3',
    title: 'Firmware Extraction and Analysis',
    difficulty: 'INTERMEDIATE',
    readTime: '22 min',
    labLink: '/modules/iot-security/lab',
    content: (
      <div>
        <P>Firmware is the whole device in a file: its OS, its services, its secrets. You can get it by dumping the flash (last chapter), by downloading the vendor&apos;s update package, or by pulling it off the device over the network. Once you have it, you carve out the filesystem and read it like any Linux box.</P>

        <Local>
          A cheap <em>duka</em> alarm has a single chip inside that holds everything it knows &mdash; the siren pattern, the secret disarm code, the shop owner&apos;s phone number for alerts. Firmware is that chip&apos;s contents written out as one file. &quot;Carving&quot; it is like carefully prising the alarm open and reading what the factory burned into that chip &mdash; and far too often, the disarm code and a spare key are written right there in plain ink for anyone who opens the box.
        </Local>
        <H>Carving the Image</H>
        <Watch
          reads={<>A four-step walk through opening up the firmware. <code>binwalk -e</code> cracks the single file into its real parts (the mini operating system and its folders); the rest just steps into the result and lists a folder. It reads like exploring a normal computer&apos;s files, because once carved, that is exactly what it is.</>}
          later={<>You&apos;ll carve a real firmware image and hunt its secrets in the lab.</>}
        >
        <Pre label="// EXTRACT A FIRMWARE FILESYSTEM">{`# binwalk identifies and extracts the embedded parts (kernel, rootfs):
binwalk -e firmware.bin

# The extracted SquashFS/JFFS2 rootfs appears under _firmware.bin.extracted/
# Browse it like a normal Linux root:
cd _firmware.bin.extracted/squashfs-root
ls -la etc/`}</Pre>
        </Watch>

        <H>What to Grep For First</H>
        <Table headers={['TARGET', 'WHERE / HOW']} rows={[
          ['Hardcoded credentials', 'etc/passwd, etc/shadow; grep -r for "password", "admin"'],
          ['Private keys / certs', 'find for *.pem *.key; TLS and SSH host keys baked in'],
          ['API tokens and URLs', 'grep -rE "https?://|api_key|token" over the rootfs'],
          ['Backdoor accounts', 'Extra UID 0 lines in passwd; hidden telnet/dropbear startup'],
          ['Vulnerable binaries', 'Old BusyBox/OpenSSL versions with known CVEs'],
          ['Startup scripts', 'etc/init.d, rcS — what listens, as whom'],
        ]} />

        <Pre label="// QUICK SECRET SWEEP">{`# Crack any local hashes you find:
grep root etc/shadow
#   root:HASH:...  -> feed HASH to hashcat with mode for its type

# Hunt secrets across the whole rootfs:
grep -rniE "password|passwd|secret|api_key|private key|BEGIN RSA" . | head

# List the busybox applets and version (old = CVEs):
./bin/busybox | head -1`}</Pre>

        <H>Emulating It</H>
        <P>You do not always need the physical device. Tools like <strong>firmadyne</strong> and <strong>FirmAE</strong> boot the extracted firmware under QEMU so you can poke its web UI and services from your host — fast, repeatable, and safe.</P>

        <Note label="ATTACK → DEFEND">Every finding here is a vendor failure you can turn into a defence: no secrets in firmware, signed and encrypted images, current libraries, and no backdoor accounts. If you can grep a private key out of an update file, so can everyone who downloads it.</Note>
      </div>
    ),
    takeaways: [
      'binwalk -e carves the kernel and root filesystem out of a firmware image to browse like any Linux box',
      'First sweep: hardcoded creds, private keys, API tokens, backdoor UID-0 accounts and outdated vulnerable binaries',
      'firmadyne/FirmAE emulate firmware under QEMU so you can test services without the physical device',
      'Defence: no secrets in firmware, signed+encrypted update images, patched libraries, zero backdoor accounts',
    ]
  },

  {
    id: 'iot-ch4',
    title: 'Embedded Web and API Attacks',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/iot-security/lab',
    content: (
      <div>
        <P>Most IoT devices are administered through a tiny embedded web server. These interfaces are where web-attack skills meet hardware: the same injection, auth-bypass and command-injection flaws you learned for web apps, but written by firmware teams under tight memory budgets — so they are often worse.</P>

        <H>The Usual Suspects</H>
        <Table headers={['FLAW', 'HOW IT SHOWS UP ON IOT']} rows={[
          ['Command injection', 'A "ping" or "diagnostics" field passed straight to system() — the classic IoT RCE'],
          ['Auth bypass', 'Endpoints that check the UI but not the API; hidden .cgi with no session check'],
          ['Hardcoded/default creds', 'admin/admin, or a support account you found in the firmware'],
          ['CSRF', 'No tokens — a malicious page reconfigures the device from the victim browser'],
          ['Information disclosure', 'Unauthenticated endpoints leaking config, Wi-Fi keys, logs'],
        ]} />

        <H>Command Injection — the IoT Signature Bug</H>
        <Pre label="// A TYPICAL VULNERABLE DIAGNOSTIC ENDPOINT">{`# The web UI 'ping' tool builds a shell command from your input:
#   system("ping -c 4 " + user_host)

# So a host value of:
8.8.8.8; id

# runs 'id' on the device. On a test device you confirm RCE, then
# chain a reverse shell back to your lab box. Found by reading the
# cgi-bin handler you carved out of the firmware in Chapter 3.`}</Pre>

        <P>This is why firmware analysis and web testing are the same job on IoT: you read the handler in the extracted rootfs, see the unsanitised <code>system()</code> call, then trigger it over HTTP.</P>

        <Note label="ATTACK → DEFEND">On your own test device this is a clean RCE to study. The fix is the same as any web app: never pass user input to a shell, validate server-side, add CSRF tokens and real session checks on every endpoint including the API, and drop default credentials on first boot.</Note>
      </div>
    ),
    takeaways: [
      'Embedded web UIs carry the same web-app flaws — often worse, due to tight firmware budgets',
      'Command injection into a system() call (ping/diagnostics fields) is the signature IoT RCE',
      'Firmware analysis + web testing are one job: read the vulnerable handler, then trigger it over HTTP',
      'Defence: no user input into shells, server-side validation, CSRF tokens, real auth on every endpoint, no default creds',
    ]
  },

  {
    id: 'iot-ch5',
    title: 'Radio and Protocol Attacks (BLE, Zigbee, RF)',
    difficulty: 'ADVANCED',
    readTime: '22 min',
    labLink: '/modules/iot-security/lab',
    content: (
      <div>
        <P>IoT devices talk over the air: Bluetooth Low Energy for wearables and locks, Zigbee for smart-home meshes, and plain sub-GHz radio for remotes, sensors and some alarms. Many assume nobody is listening. With a cheap radio you can listen — and sometimes replay.</P>

        <H>Bluetooth Low Energy (BLE)</H>
        <Pre label="// ENUMERATE AND READ A BLE DEVICE">{`# Scan for advertising devices:
sudo hcitool lescan
# or the modern way:
sudo bluetoothctl   # then: scan on

# Enumerate GATT services/characteristics of a target you own:
gatttool -b AA:BB:CC:DD:EE:FF --primary
gatttool -b AA:BB:CC:DD:EE:FF --characteristics

# Read a characteristic value:
gatttool -b AA:BB:CC:DD:EE:FF --char-read -a 0x0025

# Sniff live traffic with an nRF52 dongle + Wireshark (btle) to see
# whether pairing/encryption is used at all — many devices skip it.`}</Pre>

        <H>The Radio Toolkit</H>
        <Table headers={['TECH', 'TYPICAL USE', 'GEAR']} rows={[
          ['BLE', 'Wearables, smart locks, beacons', 'nRF52840 dongle, Ubertooth'],
          ['Zigbee / 802.15.4', 'Smart-home meshes (bulbs, sensors)', 'KillerBee + Atmel RZUSBstick'],
          ['Sub-GHz RF (315/433/868 MHz)', 'Remotes, garage doors, sensors, alarms', 'RTL-SDR, HackRF, Flipper Zero'],
          ['Generic SDR', 'Capture/replay unknown signals', 'HackRF One, GNU Radio, Universal Radio Hacker'],
        ]} />

        <H>Capture and Replay (Sub-GHz)</H>
        <Pre label="// INSPECT AN UNKNOWN RF SIGNAL (YOUR OWN REMOTE)">{`# Capture around 433.92 MHz with an RTL-SDR and inspect in URH:
# Universal Radio Hacker -> record -> demodulate -> read the bits.

# Many cheap remotes use fixed codes (same bits every press) -> trivially
# replayable. Better ones use rolling codes (KeeLoq) that change each press.
# Studying the difference is the whole point: fixed = broken, rolling = resists replay.`}</Pre>

        <Note label="LEGAL + LAB-SAFE">Radio is heavily regulated. Only capture and replay signals from devices you own, keep transmit power minimal, and never interfere with alarms, vehicles, medical or safety systems you do not own. Listening to understand is the lesson; jamming or opening someone else&apos;s lock is a crime, full stop.</Note>

        <Note label="ATTACK → DEFEND">The defensive takeaway is loud: require pairing and encryption on BLE, use rolling codes not fixed codes, authenticate Zigbee joins, and treat "nobody will sniff this" as the assumption that gets products broken.</Note>
      </div>
    ),
    takeaways: [
      'BLE, Zigbee and sub-GHz RF often ship with no encryption — a cheap radio can enumerate and sometimes replay them',
      'Core gear: nRF52/Ubertooth for BLE, KillerBee for Zigbee, RTL-SDR/HackRF for sub-GHz',
      'Fixed RF codes are trivially replayable; rolling codes (KeeLoq) resist it — the contrast is the lesson',
      'Only transmit on devices you own; defence is pairing, encryption, authenticated joins and rolling codes',
    ]
  },

  {
    id: 'iot-ch6',
    title: 'ICS and SCADA Fundamentals',
    difficulty: 'INTERMEDIATE',
    readTime: '20 min',
    labLink: '/modules/iot-security/lab',
    content: (
      <div>
        <P>Industrial Control Systems run the physical world: power grids, water treatment, manufacturing lines, building HVAC. SCADA is the supervisory layer that monitors and commands them. The security stakes are not data — they are turbines, valves and safety. Understanding the architecture is step one; respecting it is step zero.</P>

        <H>The Purdue Model (Who Talks to Whom)</H>
        <Table headers={['LEVEL', 'WHAT LIVES THERE']} rows={[
          ['Level 0', 'Physical process: sensors and actuators (the valve, the motor)'],
          ['Level 1', 'PLCs / RTUs — the controllers reading sensors and driving actuators'],
          ['Level 2', 'SCADA / HMI — operators watching and commanding the process'],
          ['Level 3', 'Site operations, historians (the database of process values)'],
          ['Level 3.5', 'The DMZ — the only sanctioned bridge between OT and IT'],
          ['Level 4/5', 'Corporate IT and the internet'],
        ]} />
        <P>Attacks happen when these levels are not segmented — when an office phishing email can reach a PLC because the DMZ is flat or absent.</P>

        <H>The Components</H>
        <Table headers={['TERM', 'MEANING']} rows={[
          ['PLC', 'Programmable Logic Controller — ruggedised computer that runs the process logic'],
          ['RTU', 'Remote Terminal Unit — like a PLC, for geographically spread assets'],
          ['HMI', 'Human-Machine Interface — the operator screen'],
          ['Historian', 'Time-series database of every sensor value — a prime recon target'],
          ['Safety Instrumented System (SIS)', 'Independent system that trips the process to a safe state — the last line'],
        ]} />

        <Note label="WHY STUXNET MATTERED">Stuxnet (2010) is the canonical case: malware crossed from IT into an air-gapped OT network via USB, reprogrammed specific PLCs, and physically damaged centrifuges while showing operators normal readings. It proved cyber can break physical things, and it is why OT defenders obsess over segmentation, integrity of PLC logic, and monitoring for unexpected reprogramming.</Note>

        <Note label="LAB-SAFE RULE">You learn ICS attacks on simulators (Conpot, GRFICS, a lab PLC on an isolated switch) — never on anything connected to a real process. A scan that is harmless to a web server can knock a fragile PLC offline. In OT, "it's just a port scan" is not a defence.</Note>
      </div>
    ),
    takeaways: [
      'ICS/SCADA controls physical processes — the stakes are safety and availability, not data confidentiality',
      'The Purdue model segments Level 0 (process) up to Level 4/5 (IT); flat networks are where attacks cross over',
      'Know the parts: PLC/RTU (control), HMI (operator), historian (data), SIS (the independent safety trip)',
      'Stuxnet showed cyber can cause physical damage — and why you only ever practise on ICS simulators',
    ]
  },

  {
    id: 'iot-ch7',
    title: 'Attacking Industrial Protocols (Modbus, DNP3)',
    difficulty: 'ADVANCED',
    readTime: '20 min',
    labLink: '/modules/iot-security/lab',
    content: (
      <div>
        <P>Industrial protocols were designed in an era of isolated, trusted networks. Modbus (1979) and DNP3 carry no authentication and no encryption by default: any device that can reach a PLC can read its registers and, in many cases, write them. On a lab simulator this makes the risk vivid; on a real plant it is why segmentation is everything.</P>

        <H>Modbus in One Minute</H>
        <P>A Modbus master reads and writes numbered registers on a slave (the PLC): coils (1-bit outputs), discrete inputs, input registers and holding registers. There is no login. A read of a holding register is a legitimate command and an enumeration tool at the same time.</P>
        <Pre label="// ENUMERATE A MODBUS SIMULATOR (LAB ONLY)">{`# Identify Modbus on the standard port against YOUR simulator:
nmap -p 502 --script modbus-discover 10.0.50.10

# Read holding registers with a Python client (pymodbus) on a lab target:
python3 - <<'PY'
from pymodbus.client import ModbusTcpClient
c = ModbusTcpClient('10.0.50.10', port=502)   # your Conpot/GRFICS sim
c.connect()
rr = c.read_holding_registers(address=0, count=10, slave=1)
print(rr.registers)   # the live process values
c.close()
PY`}</Pre>

        <H>Why This Is So Dangerous — and the Defence</H>
        <Table headers={['FACT', 'CONSEQUENCE', 'MITIGATION']} rows={[
          ['No authentication', 'Any reachable host can issue commands', 'Network segmentation; allow-list the master'],
          ['No encryption', 'Values and commands are sniffable and forgeable', 'Encrypted tunnels / Modbus Security (TLS) where supported'],
          ['No integrity', 'A forged write looks identical to a real one', 'Deep-packet-inspection ICS firewalls, anomaly detection'],
          ['Fragile stacks', 'A scan can crash old PLCs', 'Passive monitoring, never active scanning on live OT'],
        ]} />

        <Note label="ATTACK → DEFEND">The entire offensive lesson here collapses into one defensive sentence: because the protocol trusts anyone who can reach it, your job is to make sure almost nothing can reach it. Segment ruthlessly, allow-list the master-slave pairs, monitor passively, and put an ICS-aware firewall at the DMZ.</Note>

        <Note label="LAB-SAFE RULE">Run every command in this chapter against Conpot, GRFICS, or a PLC on a bench switch with nothing else attached. Sending Modbus writes to a real controller can move real machinery. There is no safe way to "just try it" on production, ever.</Note>
      </div>
    ),
    takeaways: [
      'Modbus and DNP3 have no auth, encryption or integrity by default — reachability equals control',
      'A Modbus read is both a legitimate command and an enumeration tool; nmap modbus-discover + pymodbus demonstrate it on a sim',
      'The danger is the trust model, so the defence is reachability: segment, allow-list master-slave pairs, monitor passively',
      'Only ever touch simulators or isolated bench PLCs — a scan can crash a fragile controller',
    ]
  },

  {
    id: 'iot-ch8',
    title: 'IoT Malware and Botnets',
    difficulty: 'ADVANCED',
    readTime: '18 min',
    labLink: '/modules/iot-security/lab',
    content: (
      <div>
        <P>When millions of devices ship with default passwords and an exposed service, someone writes a worm. IoT botnets like Mirai turned home routers and cameras into one of the largest DDoS forces ever seen. Studying how they spread — defensively — teaches exactly which doors to shut.</P>

        <H>How Mirai Spread (and Why It Worked)</H>
        <Table headers={['STAGE', 'WHAT HAPPENED', 'THE LESSON']} rows={[
          ['Scan', 'Swept the internet for open Telnet (23/2323)', 'Do not expose management ports to the internet'],
          ['Brute force', 'Tried ~60 hardcoded default credentials', 'Force a unique password on first boot; no defaults'],
          ['Infect', 'Pulled a small architecture-specific binary onto the device', 'Devices should not fetch and run arbitrary binaries'],
          ['Report + spread', 'Called home to C2, then scanned onward', 'Egress filtering and anomaly detection catch this'],
          ['Attack', 'Launched massive DDoS on command', 'The collective cost of millions of weak devices'],
        ]} />

        <H>Why IoT Is Ideal Botnet Fuel</H>
        <P>Devices are always on, rarely monitored, seldom updated, and numerous. A compromised camera generates no complaints from its owner. That invisibility is the whole problem — and why detection has to happen at the network, not the device.</P>

        <Pre label="// DEFENSIVE: SPOT A COMPROMISED DEVICE ON YOUR NETWORK">{`# IoT devices have predictable talk patterns. Deviation = compromise.
# On your router / IDS, watch for a camera or bulb that suddenly:
#   - scans many external IPs on port 23/2323/22/80   (worming)
#   - opens a long-lived connection to an unknown host (C2 beacon)
#   - sends sustained high-volume egress traffic       (DDoS participation)

# A simple Zeek/Suricata rule set over the IoT VLAN surfaces all three.`}</Pre>

        <Note label="ATTACK → DEFEND">You never build a botnet to learn this — you trace a known one. The payoff is a checklist: no internet-exposed management, no default creds, segmented IoT VLAN, egress filtering, and network-level anomaly detection. Those five controls would have starved Mirai.</Note>
      </div>
    ),
    takeaways: [
      'IoT botnets (Mirai) spread via exposed Telnet + default credentials, then DDoS at massive scale',
      'Devices are perfect bots: always on, unmonitored, unpatched and numerous — compromise is invisible to owners',
      'Detection belongs on the network: watch IoT devices for scanning, unknown C2 beacons and sustained egress',
      'Five controls starve IoT botnets: no exposed management, no defaults, IoT VLAN, egress filtering, anomaly detection',
    ]
  },

  {
    id: 'iot-ch9',
    title: 'Securing and Defending IoT/ICS',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/iot-security/lab',
    content: (
      <div>
        <P>Everything in this module exists to make this chapter concrete. Defending IoT and ICS is not about patching faster — many devices cannot be patched at all. It is about architecture: assume the device is weak, and build the network so that weakness cannot be reached or amplified.</P>

        <H>The Defensive Playbook</H>
        <Table headers={['CONTROL', 'STOPS']} rows={[
          ['Network segmentation + VLANs', 'IT compromise reaching OT; one device reaching another'],
          ['No internet-exposed management', 'Internet-scale scanning and botnet recruitment'],
          ['Unique creds on first boot', 'Default-password worms (Mirai and kin)'],
          ['Signed + encrypted firmware', 'Malicious updates and secret extraction'],
          ['Disable debug interfaces in prod', 'UART/JTAG root shells from physical access'],
          ['Passive OT monitoring (Zeek/Suricata)', 'Catching compromise without risky active scans'],
          ['ICS-aware firewall at the DMZ', 'Forged/unauthorised industrial protocol commands'],
          ['Asset inventory', 'You cannot defend devices you do not know exist'],
        ]} />

        <H>ICS-Specific Principles</H>
        <Table headers={['PRINCIPLE', 'WHY']} rows={[
          ['Availability and safety over confidentiality', 'A stopped process can be dangerous; patch windows are rare and planned'],
          ['Protect the logic, monitor for reprogramming', 'Stuxnet changed PLC logic — integrity of control code is paramount'],
          ['Keep the SIS independent', 'The safety trip must work even if everything else is owned'],
          ['Passive first, active almost never', 'Active scanning can crash fragile controllers'],
        ]} />

        <Note label="FRAMEWORKS WORTH KNOWING">For real programmes: IEC 62443 (the ICS security standard), the NIST Cybersecurity Framework, and the MITRE ATT&CK for ICS matrix, which maps the real tactics seen against industrial systems. These turn the playbook above into an auditable programme.</Note>

        <Note label="THE WHOLE POINT">You learned to open the hardware, read the firmware, sniff the radio and speak the industrial protocols for one reason: to know, precisely, what you are defending against. An attacker only has to find one reachable weak device; a defender has to shut every door. This module gave you the attacker&apos;s map so you can be the defender who closes them.</Note>
      </div>
    ),
    takeaways: [
      'IoT/ICS defence is architecture, not patching — assume the device is weak and make the weakness unreachable',
      'Core controls: segmentation, no exposed management, unique creds, signed firmware, disabled debug, passive monitoring',
      'ICS adds: availability/safety first, protect PLC logic integrity, keep the SIS independent, almost never scan actively',
      'IEC 62443, the NIST CSF and MITRE ATT&CK for ICS turn the playbook into an auditable, real-world programme',
    ]
  },
]

export default function IoTSecurityModule() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#6a5a70' }}>
        <Link href="/" style={{ color: '#6a5a70', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/iot-security" style={{ color: '#6a5a70', textDecoration: 'none' }}>IOT, ICS &amp; HARDWARE</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>CONCEPT</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/modules/iot-security/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(180,142,173,0.1)', border: '1px solid rgba(180,142,173,0.5)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#6a5a70', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MOD-19 · ADVANCED MODULE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: '0 0 20px rgba(180,142,173,0.35)' }}>IOT, ICS &amp; HARDWARE SECURITY</h1>
        <p style={{ color: '#7a6a80', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', lineHeight: 1.6 }}>
          Attack Surface · UART / JTAG / SPI · Firmware · Embedded Web · BLE / Zigbee / RF · ICS &amp; SCADA · Modbus / DNP3 · IoT Botnets · Defence
        </p>
      </div>

      <div className="module-stat-grid">
        {[
          ['9', 'CHAPTERS'],
          ['~2.9hr', 'TOTAL READ'],
          ['ADVANCED', 'DIFFICULTY'],
          ['MOD-19', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(180,142,173,0.04)', border: '1px solid rgba(180,142,173,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#6a5a70', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <ModuleCodex moduleId="iot-security" accent={accent} chapters={chapters} />

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a1020' }}>
        <div style={{ background: 'rgba(180,142,173,0.04)', border: '1px solid rgba(180,142,173,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#6a5a70', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-19 Interactive Lab</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a4a60', marginBottom: '1.5rem' }}>18 steps &middot; 440 XP &middot; Hardware recon &middot; Firmware carving &middot; ICS simulators</div>
          <Link href="/modules/iot-security/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(180,142,173,0.6)', borderRadius: '6px', background: 'rgba(180,142,173,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(180,142,173,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/forensics" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a4a60' }}>&#8592; MOD-18: FORENSICS</Link>
          <Link href="/modules" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a4a60' }}>ALL MODULES &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
