'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#ffb347'

const steps: LabStep[] = [
  {
    id: 'crypto-01',
    title: 'Hash Identification',
    objective: 'You find this hash: 5f4dcc3b5aa765d61d8327deb882cf99\nHow many characters is it, and what hashing algorithm produced it?',
    hint: 'Count the characters: 32 hex chars = 128 bits = MD5.',
    answers: ['md5', 'MD5', 'md5sum'],
    xp: 15,
    explanation: 'MD5 produces a 128-bit (32 hex character) hash. This hash is the MD5 of "password" — extremely common in credential dumps. MD5 is cryptographically broken: collision attacks are trivial. Never use it for password storage.'
  },
  {
    id: 'crypto-02',
    title: 'Hashcat Mode for MD5',
    objective: 'Crack MD5 hashes with hashcat. What hashcat -m mode number corresponds to MD5?',
    hint: 'Run "hashcat --help | grep MD5" or check the hashcat wiki. Mode 0 is the first and most common.',
    answers: ['0', '-m 0', 'mode 0'],
    xp: 25,
    explanation: 'hashcat -m 0 hash.txt wordlist.txt attacks MD5. Key modes: 0=MD5, 100=SHA-1, 1000=NTLM, 1400=SHA-256, 1800=sha512crypt, 3200=bcrypt. Always identify the hash algorithm before selecting a mode.'
  },
  {
    id: 'crypto-03',
    title: 'Base64 Decode',
    objective: 'Decode this Base64 string: aGVsbG8gd29ybGQ=\nWhat is the plaintext output?',
    hint: 'Run: echo "aGVsbG8gd29ybGQ=" | base64 -d',
    answers: ['hello world', 'hello world\n'],
    flag: 'FLAG{base64_decoded}',
    xp: 20,
    explanation: 'Base64 is encoding, not encryption — no key, trivially reversible. Attackers use it to obfuscate payloads and bypass simple signature detectors. Always decode suspicious base64 blobs during malware analysis.'
  },
  {
    id: 'crypto-04',
    title: 'OpenSSL AES Encryption',
    objective: 'Encrypt a file using AES-256-CBC with OpenSSL. What flag specifies the output file in "openssl enc"?',
    hint: 'Like many Unix tools, OpenSSL uses -out to specify output.',
    answers: ['-out', '-out filename', '-out encrypted.bin'],
    xp: 25,
    explanation: 'Full command: openssl enc -aes-256-cbc -pbkdf2 -in plain.txt -out encrypted.bin -k "passphrase"\nThe -pbkdf2 flag uses PBKDF2 for key derivation instead of the weak legacy EVP_BytesToKey. Always include it.'
  },
  {
    id: 'crypto-05',
    title: 'RSA Key Generation',
    objective: 'Generate a 4096-bit RSA private key with OpenSSL. Complete: openssl genrsa -out private.pem ___',
    hint: 'The last argument to genrsa is the key size in bits.',
    answers: ['4096', 'openssl genrsa -out private.pem 4096'],
    flag: 'FLAG{rsa_key_generated}',
    xp: 35,
    explanation: 'openssl genrsa -out private.pem 4096 creates the key. Extract the public key with: openssl rsa -in private.pem -pubout -out public.pem\nRSA-4096 provides ~140-bit equivalent security — sufficient well beyond 2030.'
  }
]

export default function CryptoLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a5a00' }}>
        <Link href="/" style={{ color: '#7a5a00', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/crypto" style={{ color: '#7a5a00', textDecoration: 'none' }}>CRYPTOGRAPHY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#7a5a00', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-03 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>Cryptography Lab</h1>
        <p style={{ color: '#8a7a5a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          Hash identification and cracking, encoding attacks, AES and RSA with OpenSSL.
          Complete all 5 steps to earn 120 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #ffb34722', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="crypto-lab"
        moduleId="crypto"
        title="Cryptography Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
