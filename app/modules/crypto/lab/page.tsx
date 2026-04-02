'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#ffb347'
const moduleId = 'crypto'
const moduleName = 'Cryptography'
const moduleNum = '03'
const xpTotal = 120

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
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_crypto-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a5a00' }}>
        <Link href="/" style={{ color: '#7a5a00', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/crypto" style={{ color: '#7a5a00', textDecoration: 'none' }}>CRYPTOGRAPHY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/crypto" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #3a2a00', borderRadius: '3px', color: '#7a5a00', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(255,179,71,0.04)', border: '1px solid rgba(255,179,71,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#3a2a00', border: p.active ? '2px solid ' + accent : '1px solid #3a2a00', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#5a4a00', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#3a2a00', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a7a4a' }}>
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
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a4a00', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Cryptography Lab</h1>
          </div>
        </div>

        <p style={{ color: '#8a7a5a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Hash identification and cracking, encoding attacks, AES and RSA with OpenSSL.
          Type real commands, earn XP, and capture flags. Complete all 5 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(255,179,71,0.03)', border: '1px solid rgba(255,179,71,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#3a2a00', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Hash identification', 'MD5/SHA cracking', 'Hashcat modes', 'Base64 encoding', 'AES-256-CBC', 'PBKDF2 key derivation', 'RSA key generation', 'OpenSSL toolchain'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#8a7a3a', background: 'rgba(255,179,71,0.06)', border: '1px solid rgba(255,179,71,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="crypto-lab"
          moduleId={moduleId}
          title="Cryptography Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(255,179,71,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(255,179,71,0.4)' : '#3a2a00'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a4a00', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#8a7a4a' : '#5a4a00', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#5a4a00' }}>Full Cryptography Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(255,179,71,0.04)' : '#080600', border: '1px solid ' + (guidedDone ? 'rgba(255,179,71,0.25)' : '#1a1000'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#8a7a3a' : '#3a2a00', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#5a4a00', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#8a7a4a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Cryptography
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#6a5a30', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['hashcat cracking', 'OpenSSL operations', 'Base64 encode/decode', 'RSA key management', 'Hash identification', 'GPG encryption'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#3a2a00' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#8a7a4a' : '#3a2a00' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(255,179,71,0.6)' : '#3a2a00'), borderRadius: '6px', background: guidedDone ? 'rgba(255,179,71,0.12)' : 'transparent', color: guidedDone ? accent : '#3a2a00', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(255,179,71,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a2a00' }}>Complete all 5 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#080600' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0a0800', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#6a5a30' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any cryptography technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #3a2a00', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#6a5a30', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — CRYPTO COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#080600', border: '1px solid #1a1000', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['hashid hash.txt', 'Identify hash type automatically'],
                ['hashcat -m 0 hash.txt rockyou.txt', 'Crack MD5 with wordlist'],
                ['echo "text" | base64', 'Base64 encode a string'],
                ['echo "dGVzdA==" | base64 -d', 'Base64 decode a string'],
                ['openssl genrsa -out key.pem 4096', 'Generate RSA-4096 private key'],
                ['openssl rsa -in key.pem -pubout -out pub.pem', 'Extract RSA public key'],
                ['openssl enc -aes-256-cbc -pbkdf2 -in f -out f.enc', 'AES-256 encrypt a file'],
                ['openssl enc -d -aes-256-cbc -pbkdf2 -in f.enc', 'AES-256 decrypt a file'],
                ['openssl dgst -sha256 file.txt', 'SHA-256 hash a file'],
                ['gpg --gen-key', 'Generate a GPG keypair'],
                ['john --wordlist=rockyou.txt hashes.txt', 'Crack hashes with John'],
                ['md5sum file.txt', 'Calculate MD5 of a file'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#060400', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#8a7a4a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1a1000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/crypto" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6a5a30' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/offensive/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6a5a30' }}>MOD-04 OFFENSIVE LAB &#8594;</Link>
      </div>
    </div>
  )
}
