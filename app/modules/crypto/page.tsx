'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '@/app/components/ModuleCodex'

const mono = 'JetBrains Mono, monospace'
const accent = '#ffb347'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && (
      <div style={{ fontFamily: mono, fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>
        {label}
      </div>
    )}
    <pre style={{
      background: '#050805', border: '1px solid #2e1e00', borderRadius: '4px',
      padding: '1.25rem', overflow: 'auto', color: accent,
      fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const
    }}>{children}</pre>
  </div>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: mono, fontSize: '0.9rem', fontWeight: 600, color: '#cc7a00', marginTop: '2rem', marginBottom: '0.75rem' }}>
    ▸ {children}
  </h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem', fontFamily: mono }}>{children}</p>
)

const Note = ({ type = 'info', children }: { type?: 'info' | 'warn' | 'danger' | 'tip' | 'beginner'; children: React.ReactNode }) => {
  const map: Record<string, [string, string, string]> = {
    info:     [accent,     'rgba(255,179,71,0.05)', 'NOTE'],
    warn:     ['#ff4136',  'rgba(255,65,54,0.05)',  'WARNING'],
    danger:   ['#ff4136',  'rgba(255,65,54,0.07)',  'CRITICAL'],
    tip:      ['#00ff41',  'rgba(0,255,65,0.04)',   'PRO TIP'],
    beginner: ['#00d4ff',  'rgba(0,212,255,0.05)',  'BEGINNER NOTE'],
  }
  const [color, bg, label] = map[type]
  return (
    <div style={{
      background: bg, borderLeft: '3px solid ' + color,
      padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0',
      margin: '1.5rem 0', border: '1px solid ' + color + '33', borderLeftColor: color
    }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #2e1e00' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#cc7a00', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #1a1000', background: i % 2 === 0 ? 'transparent' : 'rgba(255,179,71,0.02)' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'fundamentals',
    title: 'Cryptography Fundamentals',
    difficulty: 'BEGINNER',
    readTime: '18 min',
    labLink: '/modules/crypto/lab',
    content: (
      <div>
        <P>Cryptography is the science of securing communication. Before touching any algorithm, you need to understand what goals cryptography actually serves - and what it cannot do.</P>

        <H3>The Four Security Properties (CIA+)</H3>
        <P>Modern cryptographic systems aim to provide four core guarantees:</P>
        <Note type="beginner">
          <strong>Confidentiality</strong> - only authorised parties can read the data. Achieved via encryption.<br/>
          <strong>Integrity</strong> - data has not been altered in transit. Achieved via hash functions and MACs.<br/>
          <strong>Authentication</strong> - you are communicating with who you think you are. Achieved via digital signatures and certificates.<br/>
          <strong>Non-repudiation</strong> - the sender cannot later deny sending a message. Achieved via digital signatures with a private key only the sender holds.
        </Note>

        <H3>Symmetric vs Asymmetric Encryption</H3>
        <P>Symmetric encryption uses the same key to encrypt and decrypt. It is fast and efficient for bulk data, but has a fundamental problem: how do you securely share the key with the other party in the first place? This is called the key distribution problem.</P>
        <P>Asymmetric encryption uses a mathematically linked key pair - a public key (share freely) and a private key (never share). Anyone can encrypt with your public key, but only you can decrypt with your private key. This solves key distribution but is orders of magnitude slower than symmetric encryption.</P>
        <P>In practice, hybrid encryption is used: asymmetric crypto is used to securely exchange a symmetric key, then symmetric crypto handles the actual data. TLS does exactly this.</P>

        <H3>Stream Ciphers vs Block Ciphers</H3>
        <P>A block cipher encrypts fixed-size chunks of data (AES uses 128-bit blocks). Padding is added if plaintext does not fill a block. Block ciphers are used with modes of operation (CBC, GCM, CTR) to handle data larger than one block.</P>
        <P>A stream cipher generates a pseudorandom keystream that is XORed with plaintext one bit or byte at a time. ChaCha20 and RC4 are stream ciphers. They have no padding and are naturally suited to streaming data.</P>

        <H3>Substitution, Permutation, Confusion, and Diffusion</H3>
        <P>Claude Shannon (1949) identified two fundamental operations that strong ciphers must perform:</P>
        <Note type="info">
          <strong>Confusion</strong> - each bit of ciphertext should depend on several parts of the key in a complex, non-linear way. Achieved by substitution (S-boxes in AES). Makes it hard to find the key from ciphertext.<br/><br/>
          <strong>Diffusion</strong> - changing one bit of plaintext should change roughly half of the ciphertext bits. Achieved by permutation (ShiftRows, MixColumns in AES). Hides statistical structure.
        </Note>

        <H3>XOR and the One-Time Pad</H3>
        <P>XOR (exclusive or) is the fundamental operation of most ciphers. Key property: A XOR B XOR B = A. If you XOR plaintext with a random keystream and send it, the recipient XORs with the same keystream to recover the plaintext.</P>
        <P>The one-time pad uses a truly random key the same length as the message, used only once. It is provably unbreakable - but practically useless because the key distribution problem is as hard as just sending the message securely in the first place. Reusing the key destroys security instantly.</P>
        <Pre label="XOR PROPERTY DEMO">{'plaintext  = 0b10110100\nkey        = 0b01101110\nciphertext = 0b11011010  (XOR)\n\nciphertext = 0b11011010\nkey        = 0b01101110\nplaintext  = 0b10110100  (XOR again to recover)'}</Pre>

        <H3>Kerckhoffs Principle</H3>
        <P>A cryptographic system should be secure even if everything about the system, except the key, is public knowledge. Security through obscurity - hiding the algorithm itself - is not security. If your cipher is only safe because attackers do not know the algorithm, you have no real security.</P>
        <P>This is why AES, ChaCha20, and RSA are all fully published. Their security comes from the mathematical hardness of the underlying problem, not from secrecy of the design.</P>

        <H3>Entropy and Randomness</H3>
        <P>Cryptographic security ultimately rests on randomness. Entropy measures unpredictability in bits. A 128-bit random key has 128 bits of entropy - meaning an attacker must try 2^128 keys on average.</P>
        <P>A CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) is seeded from true entropy sources (OS noise, hardware events) and produces output that is computationally indistinguishable from true randomness. A regular PRNG (like rand() in C) is NOT safe for cryptography - its output can often be predicted after observing a few values.</P>
        <Note type="warn">Always use the OS CSPRNG for key generation: /dev/urandom on Linux, CryptGenRandom on Windows, or high-level library functions like secrets.token_bytes() in Python. Never use math.random() or similar.</Note>

        <H3>Bit Security Levels</H3>
        <Table
          headers={['Security Level', 'Operations to Break', 'Symmetric Key Size', 'RSA Key Size', 'ECC Key Size']}
          rows={[
            ['80-bit', '2^80 (~1 sextillion)', '80-bit (obsolete)', '1024-bit (broken)', '160-bit (obsolete)'],
            ['112-bit', '2^112', '112-bit', '2048-bit (minimum)', '224-bit'],
            ['128-bit', '2^128 (currently safe)', '128-bit AES', '3072-bit', '256-bit (P-256)'],
            ['192-bit', '2^192', '192-bit AES', '7680-bit', '384-bit (P-384)'],
            ['256-bit', '2^256 (long-term)', '256-bit AES', '15360-bit', '521-bit (P-521)'],
          ]}
        />

        <H3>Cryptographic Primitives Reference</H3>
        <Table
          headers={['Algorithm', 'Type', 'Key Size', 'Block/Output', 'Notes']}
          rows={[
            ['AES-256-GCM', 'Symmetric AEAD', '256-bit', '128-bit block', 'Gold standard for symmetric encryption'],
            ['ChaCha20-Poly1305', 'Symmetric AEAD', '256-bit', 'Stream', 'Fast without AES hardware, used in TLS 1.3'],
            ['RSA-4096', 'Asymmetric', '4096-bit', 'Variable', 'Slow, avoid for bulk data, use for key exchange'],
            ['ECDH P-256', 'Key Exchange', '256-bit', 'N/A', 'Fast key agreement, 128-bit security'],
            ['Ed25519', 'Signature', '256-bit', '512-bit sig', 'Fast, deterministic, immune to k-reuse bugs'],
            ['SHA-256', 'Hash', 'N/A', '256-bit', 'Merkle-Damgard construction, widely used'],
            ['HMAC-SHA256', 'MAC', 'Variable', '256-bit', 'Authenticated integrity, immune to length extension'],
            ['Argon2id', 'Password KDF', 'Variable', 'Variable', 'Memory-hard, PHC winner, use for passwords'],
            ['HKDF-SHA256', 'Key Derivation', 'Variable', 'Variable', 'Derive multiple keys from one master secret'],
          ]}
        />

        <Note type="tip">Memorise this hierarchy: for bulk data encryption use AES-256-GCM or ChaCha20-Poly1305. For key exchange use ECDH. For signatures use Ed25519. For password storage use Argon2id. For everything else, use a well-audited library like libsodium and do not roll your own.</Note>
      </div>
    ),
    takeaways: [
      'The four cryptographic goals are Confidentiality, Integrity, Authentication, and Non-repudiation - different algorithms serve different goals.',
      'Symmetric encryption solves speed, asymmetric encryption solves key distribution - hybrid systems use both.',
      'Shannon\'s confusion (S-boxes) and diffusion (permutations) are the two operations every strong block cipher must perform.',
      'Security through obscurity is not security - Kerckhoffs\'s principle requires algorithms to be public and security to rest only on the key.',
      'Always use a CSPRNG for key generation - regular PRNGs like rand() or math.random() are predictable and never safe for cryptographic use.',
    ],
  },
  {
    id: 'symmetric',
    title: 'Symmetric Encryption',
    difficulty: 'INTERMEDIATE',
    readTime: '22 min',
    labLink: '/modules/crypto/lab',
    content: (
      <div>
        <P>Symmetric encryption uses the same key for encryption and decryption. Understanding the internals of AES and how different modes of operation work - and fail - is essential for building and breaking secure systems.</P>

        <H3>AES (Rijndael) Internals</H3>
        <P>AES operates on a 4x4 matrix of bytes called the state. Each round applies four transformations in sequence. For AES-128 there are 10 rounds; AES-192 uses 12 rounds; AES-256 uses 14 rounds.</P>
        <Note type="info">
          <strong>SubBytes</strong> - each byte is replaced via a non-linear S-box (substitution table). This provides confusion.<br/>
          <strong>ShiftRows</strong> - rows of the state matrix are cyclically shifted. Row 0 unchanged, row 1 shifts 1, row 2 shifts 2, row 3 shifts 3. This provides diffusion.<br/>
          <strong>MixColumns</strong> - each column is treated as a polynomial over GF(2^8) and multiplied by a fixed matrix. Provides strong diffusion.<br/>
          <strong>AddRoundKey</strong> - the state is XORed with the round key derived from the key schedule. This is where the key material enters.
        </Note>
        <P>The key schedule expands the original key into one round key per round plus one initial key. Breaking the key schedule is one way to attack reduced-round AES, though full AES has no practical attacks beyond brute force.</P>

        <H3>Block Modes of Operation</H3>
        <H3>ECB - Electronic Code Book (Never Use)</H3>
        <P>ECB encrypts each block independently with the same key. Identical plaintext blocks produce identical ciphertext blocks. This is catastrophically bad for anything with repeated structure - like images. The famous "ECB penguin" demonstrates this: encrypting a bitmap image in ECB mode still reveals the shape of the penguin because identical pixel blocks encrypt identically.</P>
        <Note type="danger">ECB mode must never be used. It reveals patterns in plaintext. Some APIs default to ECB - always specify your mode explicitly.</Note>

        <H3>CBC - Cipher Block Chaining</H3>
        <P>CBC XORs each plaintext block with the previous ciphertext block before encrypting. The first block is XORed with an Initialization Vector (IV). This means identical plaintext blocks produce different ciphertext, solving the ECB problem.</P>
        <P>IV requirements: must be random and unpredictable (not reused). Padding is required to fill the last block, which introduces the padding oracle vulnerability. If an attacker can submit arbitrary ciphertext and learn whether the padding was valid, they can decrypt any CBC ciphertext one byte at a time - without the key. This was exploited in the POODLE and Lucky13 attacks.</P>
        <Pre label="CBC PADDING ORACLE CONCEPT">{'Attacker modifies last byte of C[n-1]\nServer decrypts C[n]: D(C[n]) XOR C[n-1]\nIf padding is valid (0x01), attacker learns D(C[n]) XOR 0x01\nRepeating this for all padding values reveals D(C[n])\nXOR with original C[n-1] recovers P[n]'}</Pre>

        <H3>CTR - Counter Mode</H3>
        <P>CTR mode turns a block cipher into a stream cipher. A counter value (nonce + counter) is encrypted to produce a keystream block, which is then XORed with the plaintext. This means no padding is needed and encryption/decryption are the same operation.</P>
        <Note type="danger"><strong>CTR nonce reuse is catastrophic.</strong> If you encrypt two different messages with the same nonce and key, their keystreams are identical. Attacker XORs the two ciphertexts together and gets P1 XOR P2 - the key cancels out entirely. Known-plaintext of either message reveals the other. This destroyed the WEP and early RC4 deployments.</Note>

        <H3>GCM - Galois Counter Mode (AEAD)</H3>
        <P>GCM combines CTR mode encryption with a GHASH polynomial authentication tag. It provides Authenticated Encryption with Associated Data (AEAD) - one operation gives you both confidentiality and integrity. The auth tag covers both the ciphertext and any associated data (like packet headers). This prevents ciphertext tampering.</P>
        <Note type="danger"><strong>GCM nonce reuse reveals the auth key.</strong> If the same nonce is used twice with the same key, an attacker can recover the GHASH authentication key. Once they have the auth key, they can forge authentication tags for arbitrary messages. This means nonce reuse in GCM is worse than in CBC - it breaks both confidentiality and authentication. Nonces must be unique per key, forever.</Note>

        <H3>XTS - XEX-Based Tweaked CodeBook (Disk Encryption)</H3>
        <P>XTS is designed for disk encryption where each sector must be encrypted independently and there is no room for authentication overhead. It uses two AES keys and a "tweak" (sector number) to ensure each sector encrypts differently even for identical content. Used by LUKS, FileVault, and BitLocker.</P>

        <H3>ChaCha20-Poly1305</H3>
        <P>ChaCha20 is a stream cipher designed by Daniel Bernstein. Poly1305 is a one-time MAC. Together they form an AEAD cipher. Google chose ChaCha20-Poly1305 for TLS on mobile devices because: it has no padding oracle risk, it does not require AES hardware acceleration (AES-NI), making it faster on ARM processors without AES-NI, and it is immune to timing attacks that can affect table-based AES implementations.</P>
        <P>TLS 1.3 requires both TLS_AES_128_GCM_SHA256 and TLS_CHACHA20_POLY1305_SHA256. Use whichever the hardware supports fastest.</P>

        <H3>Legacy and Deprecated Ciphers</H3>
        <Table
          headers={['Cipher', 'Status', 'Reason Deprecated', 'Attack']}
          rows={[
            ['RC4', 'Broken', 'Biased output, key scheduling flaws', 'RC4 NOMORE, WEP cracking'],
            ['DES', 'Broken', '56-bit key exhausted by brute force in 1998', 'EFF DES Cracker'],
            ['3DES', 'Deprecated', 'Only 112-bit effective security, SWEET32 attack', 'Birthday attack on 64-bit blocks'],
            ['Blowfish', 'Weak', '64-bit block size vulnerable to birthday attacks', 'SWEET32 (TLS renegotiation)'],
            ['Twofish', 'Safe but unused', 'No practical attacks, lost to Rijndael in AES competition', 'None practical'],
          ]}
        />

        <H3>OpenSSL Symmetric Encryption Commands</H3>
        <Pre label="OPENSSL ENCRYPT / DECRYPT">{'# Encrypt a file with AES-256-CBC using PBKDF2 key derivation\nopenssl enc -aes-256-cbc -pbkdf2 -salt -in plaintext.txt -out encrypted.bin\n\n# Decrypt\nopenssl enc -d -aes-256-cbc -pbkdf2 -in encrypted.bin -out decrypted.txt\n\n# Use AES-256-GCM (better - authenticated)\nopenssl enc -aes-256-gcm -pbkdf2 -salt -in plaintext.txt -out encrypted.bin\n\n# Always use -pbkdf2 to avoid the legacy weak key derivation\n# Always use -salt to prevent identical outputs for same password'}</Pre>

        <H3>Python cryptography Library Examples</H3>
        <Pre label="PYTHON AES-GCM ENCRYPT / DECRYPT">{'from cryptography.hazmat.primitives.ciphers.aead import AESGCM\nimport os\n\nkey = os.urandom(32)        # 256-bit key from CSPRNG\nnonce = os.urandom(12)      # 96-bit nonce - NEVER reuse with same key\nplaintext = b"secret data"\naad = b"authenticated header"  # not encrypted, but authenticated\n\naesgcm = AESGCM(key)\nciphertext = aesgcm.encrypt(nonce, plaintext, aad)\n\n# Decrypt - raises InvalidTag if ciphertext was tampered\nrecovered = aesgcm.decrypt(nonce, ciphertext, aad)'}</Pre>

        <Note type="tip">For new code, always use AEAD modes (GCM or ChaCha20-Poly1305). Never use CBC without a MAC, and never use ECB for anything. The cryptography.io library in Python and libsodium in C/C++ abstract away mode selection to safe defaults.</Note>
      </div>
    ),
    takeaways: [
      'AES applies SubBytes (confusion), ShiftRows, MixColumns (diffusion), and AddRoundKey each round - these four operations are what makes AES secure.',
      'ECB mode leaks plaintext patterns (ECB penguin) and must never be used - always specify a modern mode explicitly.',
      'CBC is vulnerable to padding oracle attacks when the server leaks padding validity - POODLE and Lucky13 exploited this in TLS.',
      'GCM nonce reuse is catastrophic: it exposes the GHASH authentication key, enabling an attacker to forge authentication tags for arbitrary ciphertexts.',
      'ChaCha20-Poly1305 is preferred on hardware without AES-NI instructions because it avoids the timing attack surface of table-based AES implementations.',
    ],
  },
  {
    id: 'asymmetric',
    title: 'Asymmetric Encryption & Key Exchange',
    difficulty: 'INTERMEDIATE',
    readTime: '24 min',
    labLink: '/modules/crypto/lab',
    content: (
      <div>
        <P>Asymmetric cryptography uses mathematically linked key pairs. The security of every asymmetric algorithm rests on a hard mathematical problem - one that is easy to compute in one direction but computationally infeasible to reverse.</P>

        <H3>RSA (Rivest-Shamir-Adleman)</H3>
        <P>RSA security rests on the integer factorisation problem: multiplying two large primes is easy, but factoring their product into the original primes is computationally hard for large enough numbers.</P>
        <Pre label="RSA KEY GENERATION STEPS">{'1. Choose two large distinct primes: p and q\n2. Compute n = p * q  (modulus, part of both keys)\n3. Compute phi(n) = (p-1)(q-1)  (Euler totient)\n4. Choose e: 1 < e < phi(n), gcd(e, phi(n)) = 1  (usually 65537)\n5. Compute d: d*e = 1 mod phi(n)  (modular inverse of e)\n\nPublic key:  (n, e)\nPrivate key: (n, d)\n\nEncrypt: C = M^e mod n\nDecrypt: M = C^d mod n'}</Pre>

        <H3>RSA Padding</H3>
        <P>Raw RSA (textbook RSA) is deterministic and malleable - the same plaintext always produces the same ciphertext, and ciphertexts can be manipulated algebraically. Padding schemes fix this.</P>
        <Note type="danger"><strong>PKCS#1 v1.5 padding is vulnerable to the Bleichenbacher attack (1998).</strong> If the decryption server returns any information about whether padding was valid, an attacker can submit millions of crafted ciphertexts and eventually decrypt any RSA ciphertext. This attack is still exploitable in 2024 via the ROBOT attack, which found 27% of HTTPS servers in 2017 were vulnerable.</Note>
        <Note type="tip"><strong>OAEP (Optimal Asymmetric Encryption Padding)</strong> is the secure choice. It adds randomness (making encryption non-deterministic) and has a security proof. Always use RSA-OAEP for encryption. For signatures, use RSA-PSS.</Note>

        <H3>RSA Key Sizes</H3>
        <Table
          headers={['Key Size', 'Security Level', 'Status', 'Recommendation']}
          rows={[
            ['1024-bit', '~80-bit', 'Broken (factored 2010)', 'Reject immediately'],
            ['2048-bit', '~112-bit', 'Minimum acceptable', 'Use only if 4096 not possible'],
            ['3072-bit', '~128-bit', 'Safe until ~2030', 'Acceptable for medium-term'],
            ['4096-bit', '~140-bit', 'Recommended', 'Use for new systems'],
          ]}
        />

        <H3>Diffie-Hellman Key Exchange</H3>
        <P>DH allows two parties to establish a shared secret over an insecure channel without any pre-shared secret. Security rests on the discrete logarithm problem: given g, p, and g^a mod p, finding a is computationally hard.</P>
        <Pre label="DH KEY EXCHANGE">{'Public params: large prime p, generator g\n\nAlice: pick secret a, send A = g^a mod p\nBob:   pick secret b, send B = g^b mod p\n\nAlice computes: B^a mod p = g^(ab) mod p\nBob computes:   A^b mod p = g^(ab) mod p\n\nShared secret = g^(ab) mod p\nEavesdropper sees A and B but cannot compute g^(ab) without solving DLP'}</Pre>
        <Note type="warn">MODP groups with small prime sizes (512-bit, 768-bit, 1024-bit) are broken or weak. Logjam (2015) showed that 512-bit DH could be broken in real-time and 1024-bit DH was within reach of nation-states. Use at least 2048-bit MODP groups, or better: switch to ECDH.</Note>

        <H3>Elliptic Curve Cryptography (ECC)</H3>
        <P>ECC defines groups over elliptic curves: equations of the form y^2 = x^3 + ax + b over a finite field. Security rests on the elliptic curve discrete logarithm problem (ECDLP): given points P and Q=kP on a curve, finding the scalar k is computationally hard. ECDLP is harder than DLP per bit, giving smaller keys for equivalent security.</P>
        <Pre label="ECC POINT ADDITION (CONCEPTUAL)">{'A point on curve E(Fp): P = (x, y) where y^2 = x^3 + ax + b mod p\n\nPoint addition: P + Q = R  (geometrically: draw line through P and Q, reflect intersection)\nPoint doubling: P + P = 2P\nScalar multiplication: kP = P + P + P + ... (k times)\n\nPublic key = private_key * G  (G is the generator point)\nPrivate key = scalar k (kept secret)'}</Pre>

        <H3>Named Elliptic Curves</H3>
        <Table
          headers={['Curve', 'Field Size', 'Security Level', 'Use Case', 'Notes']}
          rows={[
            ['P-256 (secp256r1)', '256-bit', '128-bit', 'TLS, ECDSA, ECDH', 'NIST curve, widely supported'],
            ['P-384 (secp384r1)', '384-bit', '192-bit', 'High-security TLS', 'Used in NSA Suite B'],
            ['secp256k1', '256-bit', '128-bit', 'Bitcoin/Ethereum', 'Koblitz curve, fast Schnorr'],
            ['Curve25519 (X25519)', '255-bit', '128-bit', 'ECDH key exchange', 'DJB curve, immune to timing attacks, use this'],
            ['Ed25519', '255-bit', '128-bit', 'EdDSA signatures', 'Deterministic, fast, use for SSH/age'],
          ]}
        />

        <H3>OpenSSL Key Generation Commands</H3>
        <Pre label="RSA KEY GENERATION">{'# Generate 4096-bit RSA private key\nopenssl genrsa -out private.pem 4096\n\n# Extract public key\nopenssl rsa -in private.pem -pubout -out public.pem\n\n# View key details\nopenssl rsa -in private.pem -text -noout'}</Pre>
        <Pre label="ECDSA / ECDH KEY GENERATION">{'# Generate EC private key on P-256\nopenssl ecparam -name prime256v1 -genkey -noout -out ec-private.pem\n\n# Extract public key\nopenssl ec -in ec-private.pem -pubout -out ec-public.pem\n\n# Generate Ed25519 key pair\nopenssl genpkey -algorithm ed25519 -out ed25519-private.pem\nopenssl pkey -in ed25519-private.pem -pubout -out ed25519-public.pem'}</Pre>

        <H3>Forward Secrecy</H3>
        <P>With traditional RSA key exchange, a single long-term private key decrypts all past sessions. If an attacker records encrypted traffic today and obtains the private key years later, they can decrypt everything retroactively. Forward secrecy (also called perfect forward secrecy, PFS) prevents this.</P>
        <P>In ephemeral DH (DHE) or ephemeral ECDH (ECDHE), a fresh temporary key pair is generated for each session. The session key is derived from ephemeral keys and then discarded. Even if the long-term identity key is compromised, past sessions cannot be decrypted. TLS 1.3 requires forward secrecy - it only supports ECDHE key exchange.</P>

        <H3>RSA vs ECC Comparison</H3>
        <Table
          headers={['Property', 'RSA', 'ECC']}
          rows={[
            ['Security basis', 'Integer factorisation', 'Elliptic curve DLP'],
            ['128-bit security key size', '3072-bit', '256-bit (P-256)'],
            ['256-bit security key size', '15360-bit', '521-bit (P-521)'],
            ['Speed', 'Slower (large exponentiation)', 'Faster (smaller keys)'],
            ['Quantum vulnerability', 'Broken by Shor\'s algorithm', 'Broken by Shor\'s algorithm'],
            ['Signature algorithm', 'RSA-PSS (secure)', 'ECDSA, EdDSA'],
            ['Key exchange', 'RSA-OAEP (no forward secrecy)', 'ECDHE (forward secrecy)'],
            ['Recommendation', 'Use 4096-bit, legacy compat', 'Prefer for new systems'],
          ]}
        />

        <Note type="tip">For new systems, prefer X25519 for key exchange and Ed25519 for signatures. These Bernstein curves have better security properties than NIST curves (no NIST influence concerns) and are immune to implementation timing attacks.</Note>
      </div>
    ),
    takeaways: [
      'RSA security rests on integer factorisation hardness - 1024-bit RSA is factored, 2048-bit is the minimum, 4096-bit is recommended for new systems.',
      'PKCS#1 v1.5 padding is vulnerable to Bleichenbacher\'s oracle attack - always use OAEP for RSA encryption and PSS for RSA signatures.',
      'ECDH gives the same security as RSA with much smaller keys: a 256-bit ECC key provides the same security as a 3072-bit RSA key.',
      'Ephemeral key exchange (ECDHE) provides forward secrecy - compromising the long-term key does not reveal past sessions because ephemeral keys are discarded.',
      'Prefer Curve25519/X25519 and Ed25519 over NIST curves for new systems - they have no timing attack surface and avoid NIST design concerns.',
    ],
  },
  {
    id: 'hashes',
    title: 'Hash Functions & MACs',
    difficulty: 'INTERMEDIATE',
    readTime: '20 min',
    labLink: '/modules/crypto/lab',
    content: (
      <div>
        <P>Hash functions produce a fixed-size digest from arbitrary input. They underpin digital signatures, MACs, password hashing, and data integrity. Understanding which hash functions are broken - and why - is critical.</P>

        <H3>Required Hash Function Properties</H3>
        <Note type="info">
          <strong>Preimage resistance</strong> - given hash h, it is computationally infeasible to find any message m such that hash(m) = h.<br/>
          <strong>Second preimage resistance</strong> - given message m1, it is computationally infeasible to find a different m2 such that hash(m2) = hash(m1).<br/>
          <strong>Collision resistance</strong> - it is computationally infeasible to find any two distinct messages m1, m2 such that hash(m1) = hash(m2).<br/>
          <strong>Avalanche effect</strong> - changing one bit of input flips approximately half of the output bits.
        </Note>

        <H3>MD5 - Broken</H3>
        <P>MD5 produces 128-bit digests. In 2004, Wang and Yu demonstrated practical collision attacks. By 2008, researchers had created two different executable files with the same MD5 hash. In 2012, the Flame malware used MD5 collision attacks to forge a Windows Update code-signing certificate.</P>
        <Note type="danger">MD5 has no collision resistance. Two different PDF files, SSL certificates, or executables can have the same MD5 hash. Do not use MD5 for any security purpose. It is acceptable only for non-security checksums where collision attacks are irrelevant.</Note>

        <H3>SHA-1 - Broken</H3>
        <P>SHA-1 produces 160-bit digests. Theoretical weaknesses were known since 2005. In 2017, the SHAttered attack (Google/CWI) produced the first practical SHA-1 collision - two different PDF files with identical SHA-1 hashes. The attack cost approximately $110,000 of GPU compute. By 2020, researchers demonstrated chosen-prefix SHA-1 collisions, enabling forged PGP signatures.</P>
        <Note type="danger">SHA-1 must not be used for digital signatures, certificates, or any integrity-critical purpose. All major browsers and CAs rejected SHA-1 certificates from 2017. SSH still allows SHA-1 in some configurations - disable it.</Note>

        <H3>SHA-2 Family</H3>
        <P>SHA-2 (SHA-256, SHA-384, SHA-512, SHA-224, SHA-512/256) is currently secure. It uses the Merkle-Damgard construction: the message is padded and divided into blocks, each block is processed with a compression function that takes the previous output and the current block. This construction introduces the length extension vulnerability.</P>
        <P>SHA-256 is the workhorse of modern cryptography: used in TLS, code signing, Bitcoin, Git, and most certificate chains. SHA-512 is faster than SHA-256 on 64-bit CPUs because it processes larger blocks.</P>

        <H3>SHA-3 / Keccak</H3>
        <P>SHA-3 uses the sponge construction instead of Merkle-Damgard. Message bits are absorbed into a large internal state, then output is squeezed out. The sponge construction is not vulnerable to length extension attacks and has a fundamentally different security proof to SHA-2. SHA-3 was standardised in 2015 after a 5-year NIST competition.</P>
        <P>SHA-3 is slower than SHA-2 in software but easier to implement in hardware without timing channels. SHAKE128 and SHAKE256 are extendable output functions (XOF) based on the same construction.</P>

        <H3>BLAKE2 and BLAKE3</H3>
        <P>BLAKE2 (2012) and BLAKE3 (2020) are faster than SHA-2 and SHA-3 in software while being cryptographically sound. BLAKE3 is parallelisable and can use multiple CPU cores. BLAKE2b is used in Argon2 (password hashing), WireGuard, and many modern tools. Neither has been broken.</P>

        <H3>Length Extension Attacks</H3>
        <P>Merkle-Damgard hash functions (MD5, SHA-1, SHA-2) are vulnerable to length extension attacks. Given hash(message) and the length of message, an attacker can compute hash(message || padding || extension) without knowing message. This breaks naive MAC constructions of the form MAC = hash(key || message).</P>
        <Pre label="LENGTH EXTENSION ATTACK">{'Vulnerable: MAC = SHA256(secret_key || message)\n\nAttacker knows: SHA256(secret_key || "amount=100")\nAttacker can compute: SHA256(secret_key || "amount=100" || padding || "&admin=true")\nwithout knowing secret_key\n\nFix: use HMAC instead of hash(key || message)'}</Pre>

        <H3>HMAC - Hash-based MAC</H3>
        <P>HMAC is constructed as hash(outer_key || hash(inner_key || message)) where inner_key and outer_key are derived from the secret key. This double-hash construction is immune to length extension attacks. HMAC is the standard way to authenticate data with a symmetric key.</P>
        <Pre label="HMAC CONSTRUCTION">{'HMAC(K, m) = H( (K XOR opad) || H( (K XOR ipad) || m ) )\n\nopad = 0x5c repeated (outer padding)\nipad = 0x36 repeated (inner padding)\n\n# Python\nimport hmac, hashlib\ntag = hmac.new(key, message, hashlib.sha256).digest()\n\n# Always use hmac.compare_digest() to compare - not ==\n# == is vulnerable to timing attacks'}</Pre>

        <H3>Hash Cracking with Hashcat</H3>
        <Table
          headers={['Hash Type', 'Hashcat Mode (-m)', 'Example Hash']}
          rows={[
            ['MD5', '0', '5d41402abc4b2a76b9719d911017c592'],
            ['SHA-1', '100', 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d'],
            ['SHA-256', '1400', '2cf24dba...'],
            ['NTLM', '1000', 'b4b9b02e6f09a9bd760f388b67351e2b'],
            ['bcrypt $2*$', '3200', '$2b$12$...'],
            ['Argon2i', '13000', '$argon2i$v=19$m=65536...'],
            ['WPA/WPA2', '22000', 'PMKID or capture file'],
          ]}
        />

        <Pre label="HASHCAT ATTACK MODES">{'# Wordlist attack (mode 0)\nhashcat -m 1400 hashes.txt /usr/share/wordlists/rockyou.txt\n\n# Brute force all 8-char lowercase (mode 3)\nhashcat -m 0 hashes.txt -a 3 ?l?l?l?l?l?l?l?l\n\n# Rule-based attack (transforms wordlist words)\nhashcat -m 1400 hashes.txt rockyou.txt -r rules/best64.rule\n\n# Combination attack (mode 1) - concatenates two wordlists\nhashcat -m 1400 hashes.txt -a 1 words1.txt words2.txt\n\n# Hybrid attack (mode 6) - wordlist + mask\nhashcat -m 1400 hashes.txt -a 6 rockyou.txt ?d?d?d'}</Pre>

        <H3>Rainbow Tables and Salting</H3>
        <P>A rainbow table is a precomputed table mapping hashes back to plaintexts. Without salting, identical passwords produce identical hashes and rainbow tables make cracking instant. A salt is a random value stored alongside the hash and included in the hash computation. This means two users with the same password have different hashes, and precomputed tables are useless.</P>
        <Note type="warn">Salting defeats rainbow tables but NOT brute force. A GPU can still compute billions of SHA-256 hashes per second. For password storage, you need a slow KDF (Argon2id, bcrypt, scrypt) - not a fast hash. Salting alone is not enough.</Note>

        <Note type="tip">Hashcat rule files (best64, d3ad0ne, dive) apply transformations to wordlist entries: capitalise, append numbers, l33tspeak substitutions, add common suffixes. The dive ruleset contains over 99,000 rules and dramatically increases cracking coverage against typical user passwords.</Note>
      </div>
    ),
    takeaways: [
      'MD5 and SHA-1 are broken for any security use - practical collision attacks exist; the SHAttered attack (2017) produced identical-hash PDF files from SHA-1.',
      'Merkle-Damgard hash functions (MD5, SHA-1, SHA-2) are vulnerable to length extension attacks - never use hash(key||message) as a MAC; use HMAC instead.',
      'HMAC\'s double-hash construction is immune to length extension and is the correct way to authenticate data with a symmetric key.',
      'Salting defeats rainbow tables but not brute force - password storage needs a slow KDF (Argon2id, bcrypt) not a fast hash like SHA-256.',
      'Hashcat supports multiple attack modes: wordlist (-a 0), combination (-a 1), brute-force mask (-a 3), and hybrid (-a 6/7) - rule files multiply coverage dramatically.',
    ],
  },
  {
    id: 'passwords',
    title: 'Password Hashing & Key Derivation',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/crypto/lab',
    content: (
      <div>
        <P>Password storage is where cryptographic mistakes most directly harm users. A single algorithm choice determines whether a breach exposes plaintext passwords instantly or gives users days to change credentials.</P>

        <H3>Why SHA-256(password) Is Wrong</H3>
        <P>SHA-256 is designed for speed - a modern GPU computes 10-20 billion SHA-256 hashes per second. An attacker with a single GPU can try the entire rockyou.txt wordlist (14 million passwords) in under a millisecond. Speed is the enemy of password storage. You need an algorithm that is intentionally slow and expensive.</P>
        <Note type="danger">Never store passwords as SHA-256(password), MD5(password), or any unsalted fast hash. This is not password hashing - it is password exposure delayed by minutes at most. Any breach of such a database results in virtually all user passwords being recovered.</Note>

        <H3>bcrypt</H3>
        <P>bcrypt was designed in 1999 by Niels Provos and David Mazieres. It is based on the Blowfish cipher's expensive key schedule. A cost factor parameter (4-31) controls the number of iterations: cost 12 means 2^12 iterations. Increasing cost by 1 doubles the time. bcrypt automatically salts passwords.</P>
        <P>Limitation: bcrypt truncates passwords to 72 characters. Passwords longer than 72 bytes are silently truncated. This can be exploited: "password" and "password" + (63 characters of garbage) would produce the same hash.</P>
        <Pre label="BCRYPT (PYTHON)">{'import bcrypt\n\n# Hash\nhashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))\n\n# Verify\nbcrypt.checkpw(password.encode(), hashed)  # returns True/False\n\n# Output format: $2b$12$saltSALTSALTSALThashHASHHASH'}</Pre>

        <H3>scrypt</H3>
        <P>scrypt (Colin Percival, 2009) is a memory-hard function. It requires large amounts of RAM during computation, making it expensive to parallelise on GPUs and ASICs. A GPU has limited memory per core, so GPU-based cracking is severely limited. scrypt has three parameters: N (CPU/memory cost), r (block size), p (parallelisation).</P>
        <Pre label="SCRYPT PARAMETERS">{'# Recommended minimum (interactive use)\nopenssl kdf -keylen 32 -kdfopt digest:SHA256 \\\n  -kdfopt pass:mypassword -kdfopt salt:randomsalt SCRYPT\n\n# Python\nfrom cryptography.hazmat.primitives.kdf.scrypt import Scrypt\nkdf = Scrypt(salt=salt, length=32, n=2**14, r=8, p=1)\n# n=2^14 for interactive, n=2^20 for offline (2GB RAM)'}</Pre>

        <H3>Argon2 - Password Hashing Competition Winner</H3>
        <P>Argon2 won the Password Hashing Competition in 2015 and is the current recommended standard for password storage. It has three variants:</P>
        <Note type="info">
          <strong>Argon2d</strong> - maximises resistance to GPU cracking, but has data-dependent memory access patterns (vulnerable to side-channel timing attacks in some contexts).<br/>
          <strong>Argon2i</strong> - data-independent memory access (timing attack resistant), but less resistant to GPU cracking than Argon2d.<br/>
          <strong>Argon2id</strong> - hybrid: first half uses Argon2i, second half uses Argon2d. Recommended default. Balances both threat models.
        </Note>
        <P>Parameters: memory (in KB), iterations (time cost), parallelism (threads). Recommended for interactive logins: memory=64MB, iterations=3, parallelism=4.</P>
        <Pre label="ARGON2ID (PYTHON)">{'from argon2 import PasswordHasher\n\nph = PasswordHasher(\n    time_cost=3,          # iterations\n    memory_cost=65536,    # 64 MB RAM\n    parallelism=4,        # threads\n    hash_len=32,\n    salt_len=16\n)\n\n# Hash\nhash_str = ph.hash("user_password")\n\n# Verify - raises VerifyMismatchError if wrong\nph.verify(hash_str, "user_password")\n\n# Check if rehash needed (params changed)\nif ph.check_needs_rehash(hash_str):\n    new_hash = ph.hash("user_password")'}</Pre>

        <H3>PBKDF2</H3>
        <P>PBKDF2 (Password-Based Key Derivation Function 2) is NIST approved and FIPS 140 compliant. It applies a PRF (usually HMAC-SHA256) to the password and salt, iterating many times. Used in WPA2 (4096 iterations of HMAC-SHA1), iOS Keychain, LUKS disk encryption, and Django's default hasher.</P>
        <P>PBKDF2 is not memory-hard, making it much weaker than Argon2 and scrypt against GPU attacks. It is acceptable for compliance requirements (FIPS) but Argon2id is the better choice where possible.</P>

        <H3>Password Cracking Speed Comparison</H3>
        <Table
          headers={['Algorithm', 'GPU (RTX 3090) Speed', 'Practical Resistance', 'Use Case']}
          rows={[
            ['SHA-256', '~20 billion/sec', 'None - exhausted instantly', 'Do not use for passwords'],
            ['MD5', '~50 billion/sec', 'None', 'Do not use for passwords'],
            ['NTLM', '~60 billion/sec', 'None', 'Windows legacy, force migration'],
            ['PBKDF2-SHA256 (600k iter)', '~1 million/sec', 'Moderate', 'FIPS required systems only'],
            ['bcrypt (cost 12)', '~8,000/sec', 'Good', 'Acceptable, watch 72-char limit'],
            ['scrypt (n=2^14)', '~10,000/sec', 'Good', 'Acceptable'],
            ['Argon2id (64MB, 3 iter)', '~1,000/sec', 'Excellent', 'Recommended default'],
          ]}
        />

        <H3>Salt, Pepper, and Secrets</H3>
        <P>A salt is a random value stored in the database alongside the hash, unique per user. It defeats rainbow tables and ensures identical passwords hash differently. Argon2 and bcrypt generate salts automatically.</P>
        <P>A pepper is a secret value stored in application configuration (not the database), added to the password before hashing. If the database is breached but the application server is not, the pepper makes offline cracking impossible. The downside: if you lose the pepper, all passwords are invalidated.</P>
        <Pre label="PEPPER IMPLEMENTATION">{'# Pepper from environment variable (never in code or DB)\npepper = os.environ["PASSWORD_PEPPER"]  # rotate this periodically\n\n# Add pepper before hashing\nph.hash(password + pepper)\n\n# Or use HMAC to combine password and pepper\nimport hmac\npeppered = hmac.new(pepper.encode(), password.encode(), hashlib.sha256).hexdigest()\nhashed = ph.hash(peppered)'}</Pre>

        <H3>HKDF - Key Derivation from Secrets</H3>
        <P>HKDF (HMAC-based Key Derivation Function, RFC 5869) is for deriving multiple cryptographic keys from a single input key material (like a DH shared secret). It is NOT for passwords - it is fast and not memory-hard.</P>
        <Pre label="HKDF USAGE">{'from cryptography.hazmat.primitives.kdf.hkdf import HKDF\nfrom cryptography.hazmat.primitives import hashes\n\nhkdf = HKDF(\n    algorithm=hashes.SHA256(),\n    length=32,\n    salt=None,\n    info=b"encryption key"\n)\nkey = hkdf.derive(shared_secret)\n\n# Derive a second key for a different purpose\nhkdf2 = HKDF(algorithm=hashes.SHA256(), length=32, salt=None, info=b"mac key")\nmac_key = hkdf2.derive(shared_secret)'}</Pre>

        <Note type="tip">Decision tree: storing user passwords? Use Argon2id. Deriving encryption keys from a DH secret? Use HKDF. Compliance requires FIPS? Use PBKDF2 with at least 600,000 iterations of HMAC-SHA256 (NIST SP 800-63B 2023 recommendation). Never use bcrypt without verifying your library handles the 72-char limit.</Note>
      </div>
    ),
    takeaways: [
      'Speed is the enemy of password hashing - a GPU does 20 billion SHA-256 hashes per second, making fast hashes useless for passwords.',
      'Argon2id is the recommended default for new systems: it is memory-hard, has a security proof, and was the Password Hashing Competition winner.',
      'bcrypt has a silent 72-character truncation: passwords longer than 72 bytes are silently truncated to 72, which can be exploited.',
      'A pepper (secret in app config) combined with a strong KDF makes offline cracking impossible even after a database breach.',
      'HKDF is for deriving multiple keys from a shared secret (DH output) - it is fast and NOT suitable for password hashing.',
    ],
  },
  {
    id: 'pki',
    title: 'Digital Signatures & PKI',
    difficulty: 'INTERMEDIATE',
    readTime: '22 min',
    labLink: '/modules/crypto/lab',
    content: (
      <div>
        <P>Digital signatures prove authenticity and non-repudiation. Public Key Infrastructure (PKI) is the system of trust that enables HTTPS, code signing, and email security. Understanding how it works - and how it fails - is essential for any security professional.</P>

        <H3>Digital Signature Schemes</H3>
        <P>Signing uses the private key; verification uses the public key. This is the reverse of encryption. The signature covers a hash of the message, not the message itself (hashing makes the operation feasible for large data).</P>
        <Note type="info">
          <strong>Sign:</strong> sig = sign(private_key, hash(message))<br/>
          <strong>Verify:</strong> valid = verify(public_key, hash(message), sig)<br/><br/>
          This proves: (1) the message was signed by the holder of private_key, and (2) the message has not been altered since signing.
        </Note>

        <H3>RSA-PSS Signatures</H3>
        <P>RSA-PSS (Probabilistic Signature Scheme) is the secure RSA signature scheme. It uses randomised padding, making it non-deterministic and with a provable security reduction. PKCS#1 v1.5 signatures are deterministic and have been subject to various attacks - use PSS for new code.</P>

        <H3>ECDSA and the k-Value Catastrophe</H3>
        <P>ECDSA (Elliptic Curve DSA) requires generating a fresh random nonce k for each signature. The security of ECDSA completely depends on k being unique and secret.</P>
        <Note type="danger"><strong>Reusing k across two signatures exposes the private key.</strong> In 2010, Sony used a fixed k value in the PS3 firmware signing code (reportedly due to not implementing random number generation). Security researchers extracted the PS3 private key from just two signatures, allowing unlimited custom firmware signing. The math: given two signatures (r1,s1) and (r2,s2) with the same k, s1 - s2 = (H1 - H2)/k, so k = (H1 - H2)/(s1 - s2) mod n, then private key = (s1*k - H1)/r1 mod n.</Note>

        <H3>EdDSA / Ed25519 - The Safe Choice</H3>
        <P>EdDSA (Edwards-curve DSA) uses a deterministic nonce derived from the message and private key using a hash function. There is no random k to get wrong - the same message always produces the same signature. This makes EdDSA immune to the k-reuse attack that broke ECDSA in PS3, Android, and numerous other systems.</P>
        <P>Ed25519 is the most common variant (uses Curve25519/Twisted Edwards form). It is used in OpenSSH, age encryption, WireGuard, and modern TLS implementations. It is faster to sign and verify than ECDSA P-256.</P>

        <H3>X.509 Certificate Structure</H3>
        <P>An X.509 v3 certificate is a signed data structure that binds a public key to an identity. Every TLS connection validates one or more X.509 certificates.</P>
        <Pre label="CERTIFICATE FIELDS">{'Version: 3\nSerial Number: unique per CA (must not repeat)\nSignature Algorithm: ecdsa-with-SHA384 (or similar)\nIssuer: CN=Let\'s Encrypt R10, O=Let\'s Encrypt, C=US\nValidity:\n  Not Before: 2024-01-01 00:00:00 UTC\n  Not After:  2024-04-01 00:00:00 UTC\nSubject: CN=example.com\nSubject Public Key Info:\n  Algorithm: id-ecPublicKey (prime256v1)\n  Public Key: 04 3b 7c... (uncompressed EC point)\n\nExtensions:\n  Subject Alternative Name: DNS:example.com, DNS:www.example.com\n  Key Usage: Digital Signature\n  Extended Key Usage: TLS Web Server Authentication\n  Basic Constraints: CA:FALSE\n  CRL Distribution Points: http://crl.letsencrypt.org/...\n  Authority Information Access: OCSP: http://ocsp.letsencrypt.org\n  Certificate Transparency: embedded SCT logs\n\nSignature: (CA\'s signature over all above fields)'}</Pre>

        <H3>Certificate Chain Validation</H3>
        <P>Browsers and OS trust stores contain Root CA certificates. A Root CA signs Intermediate CA certificates. Intermediate CAs sign leaf (end-entity) certificates. This hierarchy limits the blast radius of a compromise and allows CAs to issue certificates without their root key being online.</P>
        <Pre label="CERTIFICATE CHAIN">{'Let\'s Encrypt Certificate Chain:\n\n[Root CA]\nISRG Root X1 (self-signed, in browser trust stores)\n  |\n  signs\n  |\n[Intermediate CA]\nLet\'s Encrypt R10\n  |\n  signs\n  |\n[Leaf Certificate]\nyour-domain.com\n\nValidation: verify each signature up to a trusted root'}</Pre>

        <H3>Certificate Transparency (CT)</H3>
        <P>CT is a public audit log of all certificates issued. Any CA must log certificates to public CT logs, and browsers (via Chrome policy) require proof of CT logging (embedded SCTs) in certificates. This prevents CAs from issuing certificates secretly - any rogue certificate for your domain will appear in CT logs within seconds. Sites like crt.sh let you search CT logs for all certificates ever issued for your domain.</P>

        <H3>Certificate Types and Validation</H3>
        <Table
          headers={['Type', 'Validation', 'Browser Indicator', 'Use Case']}
          rows={[
            ['DV (Domain Validated)', 'Prove control of domain (ACME challenge)', 'Padlock', 'Most websites, Let\'s Encrypt'],
            ['OV (Organization Validated)', 'Domain + organization legal identity', 'Padlock', 'Business sites'],
            ['EV (Extended Validation)', 'Strict org vetting, physical address', 'Padlock (no green bar since 2019)', 'High-value financial sites'],
            ['Code Signing', 'Identity of software publisher', 'Signed executable', 'Software distribution'],
            ['S/MIME', 'Email address ownership', 'Signed email', 'Email encryption/signing'],
          ]}
        />

        <H3>OCSP and Certificate Revocation</H3>
        <P>When a certificate is compromised, it must be revoked. CRL (Certificate Revocation List) is a periodically published list of revoked serial numbers. OCSP (Online Certificate Status Protocol) provides real-time revocation status. OCSP stapling has the server attach a signed OCSP response to the TLS handshake, eliminating privacy leaks from browsers querying the CA directly.</P>

        <H3>CAA DNS Records</H3>
        <P>CAA (Certification Authority Authorization) DNS records specify which CAs are allowed to issue certificates for your domain. For example, a CAA record of "0 issue letsencrypt.org" tells compliant CAs that only Let's Encrypt may issue for your domain. This prevents misissued certificates from rogue or compromised CAs.</P>
        <Pre label="CAA DNS RECORD EXAMPLE">{'example.com.  IN  CAA  0 issue "letsencrypt.org"\nexample.com.  IN  CAA  0 issuewild "letsencrypt.org"\nexample.com.  IN  CAA  0 iodef "mailto:security@example.com"\n\n# Check CAA records\ndig example.com CAA'}</Pre>

        <Note type="tip">For internal PKI, use cfssl (Cloudflare), Step CA (Smallstep), or EJBCA. Let's Encrypt is only for public-facing domains. Certificate pinning in mobile apps (TLS certificate/public key pinning) is still valuable but requires a careful update mechanism - HPKP (HTTP Public Key Pinning) was deprecated due to misconfiguration risk of accidentally bricking your own site.</Note>
      </div>
    ),
    takeaways: [
      'ECDSA requires a unique random k per signature - reusing k exposes the private key (this extracted the PS3 private key in 2010).',
      'Ed25519 uses a deterministic nonce derived from the message and private key, making it immune to k-reuse attacks and faster than ECDSA P-256.',
      'Certificate Transparency logs every certificate publicly - any rogue cert for your domain appears within seconds on crt.sh.',
      'CAA DNS records restrict which CAs can issue for your domain - deploy them as a defence against misissued certificates from compromised CAs.',
      'OCSP stapling lets the server attach a signed revocation status to TLS handshakes, eliminating privacy leaks from browsers querying the CA directly.',
    ],
  },
  {
    id: 'tls',
    title: 'TLS & Network Cryptography',
    difficulty: 'INTERMEDIATE',
    readTime: '20 min',
    labLink: '/modules/crypto/lab',
    content: (
      <div>
        <P>TLS (Transport Layer Security) is the protocol that secures virtually all internet communication. Understanding TLS internals, the evolution from TLS 1.2 to 1.3, and the audit tools available is core knowledge for security engineers.</P>

        <H3>TLS 1.2 vs TLS 1.3</H3>
        <Table
          headers={['Property', 'TLS 1.2', 'TLS 1.3']}
          rows={[
            ['Handshake RTTs', '2-RTT (2 round trips before data)', '1-RTT (one round trip), 0-RTT possible'],
            ['Forward secrecy', 'Optional (depends on cipher suite)', 'Mandatory (only ECDHE key exchange)'],
            ['Cipher suites', 'Hundreds of combinations', '5 standardised suites only'],
            ['RSA key exchange', 'Supported (no forward secrecy)', 'Removed entirely'],
            ['Static DH', 'Allowed', 'Removed'],
            ['RC4, 3DES, MD5', 'Allowed in configs', 'Removed from spec'],
            ['Client cert auth', '2-RTT (extra round trip)', 'Incorporated efficiently'],
            ['Encrypted SNI', 'No (SNI in cleartext)', 'ECH (Encrypted Client Hello) extension'],
          ]}
        />

        <H3>TLS Cipher Suite Anatomy</H3>
        <P>A TLS cipher suite specifies every algorithm used in a connection. In TLS 1.2, suites are named with four components:</P>
        <Pre label="TLS 1.2 CIPHER SUITE ANATOMY">{'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384\n    |      |        |            |\n    |      |        |            +--> MAC/PRF: SHA-384\n    |      |        +----------------> Cipher: AES-256-GCM\n    |      +-------------------------> Auth: RSA (cert signature)\n    +--------------------------------> Key Exchange: ECDHE\n\n# TLS 1.3 simplified suites (key exchange and auth separated)\nTLS_AES_256_GCM_SHA384           # cipher + HKDF hash only\nTLS_CHACHA20_POLY1305_SHA256'}</Pre>

        <H3>SNI Privacy and ECH</H3>
        <P>Server Name Indication (SNI) is a TLS extension that tells the server which hostname the client wants. It is sent in cleartext in the Client Hello, before the encrypted channel is established. This means network observers (ISPs, government) can see exactly which hostname you are connecting to even over HTTPS.</P>
        <P>ECH (Encrypted Client Hello) encrypts the inner Client Hello (containing the real SNI) using a public key published in the server's HTTPS DNS record. The outer Client Hello contains a decoy SNI ("cloudflare-ech.com" for example). ECH was standardised in RFC 9258 and is deployed by Cloudflare.</P>

        <H3>Historic TLS Attack History</H3>
        <Table
          headers={['Attack', 'Year', 'Affects', 'Mechanism']}
          rows={[
            ['BEAST', '2011', 'TLS 1.0 CBC', 'Predictable IV in TLS 1.0, chosen-plaintext CBC decrypt'],
            ['CRIME', '2012', 'TLS compression', 'Compression ratio leaks secret cookies (DEFLATE oracle)'],
            ['BREACH', '2013', 'HTTP compression', 'Same as CRIME but for HTTP-level gzip compression'],
            ['POODLE', '2014', 'SSLv3 CBC', 'Padding oracle on SSLv3, forced by downgrade'],
            ['FREAK', '2015', 'RSA EXPORT', 'Downgrade to 512-bit export RSA, then factor it'],
            ['Logjam', '2015', 'DHE 512-bit', 'Downgrade to 512-bit DH, precompute discrete logs'],
            ['DROWN', '2016', 'SSLv2 servers', 'Cross-protocol attack using SSLv2 to decrypt TLS sessions'],
            ['ROBOT', '2017', 'RSA PKCS#1', 'Bleichenbacher oracle in 27% of HTTPS servers'],
          ]}
        />

        <H3>HSTS - HTTP Strict Transport Security</H3>
        <P>HSTS tells browsers to always use HTTPS for a domain, refusing HTTP connections and invalid certificates. The header instructs browsers to cache this policy for the specified max-age.</P>
        <Pre label="HSTS HEADER">{'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload\n\n# max-age=63072000 = 2 years\n# includeSubDomains: applies to all subdomains\n# preload: submit to browsers\'s hardcoded HSTS preload list\n\n# Preload list: browsers refuse HTTP connections even on first visit\n# Submit at: hstspreload.org'}</Pre>

        <H3>TLS Auditing Tools</H3>
        <Pre label="TESTSSL.SH - COMPREHENSIVE TLS AUDIT">{'# Install\ngit clone --depth 1 https://github.com/drwetter/testssl.sh\n\n# Full audit\n./testssl.sh example.com\n\n# Check specific vulnerabilities\n./testssl.sh --poodle --robot --beast --crime example.com\n\n# JSON output for CI/CD\n./testssl.sh --jsonfile results.json example.com'}</Pre>
        <Pre label="OPENSSL S_CLIENT - MANUAL TLS INSPECTION">{'# Connect and see full cert chain\nopenssl s_client -connect example.com:443 -showcerts\n\n# Test specific TLS version\nopenssl s_client -connect example.com:443 -tls1_2\nopenssl s_client -connect example.com:443 -tls1_3\n\n# Send HTTP request after TLS handshake\necho "GET / HTTP/1.0" | openssl s_client -connect example.com:443 -quiet\n\n# Check cipher suites supported\nnmap --script ssl-enum-ciphers -p 443 example.com'}</Pre>

        <H3>Wireshark TLS Decryption</H3>
        <P>TLS traffic can be decrypted in Wireshark if you have the session keys. Set the SSLKEYLOGFILE environment variable to a file path - Firefox and Chrome will write session keys there. Import it in Wireshark under Preferences &gt; TLS &gt; Pre-Master Secret log filename.</P>
        <Pre label="SSLKEYLOGFILE TLS DECRYPTION">{'# Linux/Mac: set before starting browser\nexport SSLKEYLOGFILE=~/tls-keys.log\nfirefox &\n\n# Capture traffic with tcpdump\ntcpdump -i eth0 -w capture.pcap port 443\n\n# In Wireshark: Edit > Preferences > Protocols > TLS\n# Set "(Pre)-Master-Secret log filename" to ~/tls-keys.log'}</Pre>

        <H3>SSH Cryptography</H3>
        <P>SSH uses a different but related set of cryptographic primitives. Key exchange, host authentication, and session encryption are separate phases.</P>
        <Pre label="SECURE SSH CONFIGURATION (SSHD_CONFIG)">{'# Key exchange algorithms (prefer Curve25519)\nKexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org\n\n# Host key types (prefer Ed25519, disable DSA/RSA-1024)\nHostKeyAlgorithms ssh-ed25519\n\n# Ciphers (prefer ChaCha20 and AES-GCM)\nCiphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com\n\n# MACs (prefer ETM variants)\nMACs hmac-sha2-512-etm@openssh.com,umac-128-etm@openssh.com\n\n# Disable password auth\nPasswordAuthentication no\n\n# Generate new Ed25519 host key\nssh-keygen -t ed25519 -f /etc/ssh/ssh_host_ed25519_key'}</Pre>

        <Note type="tip">For cipher suite prioritisation: ECDHE over DHE (better performance), AES-GCM over AES-CBC (AEAD avoids padding oracle), ChaCha20 for mobile clients. Use Mozilla SSL Configuration Generator (ssl-config.mozilla.org) for battle-tested configs for nginx, Apache, HAProxy, and others.</Note>
      </div>
    ),
    takeaways: [
      'TLS 1.3 mandates forward secrecy (ECDHE only), reduces handshake to 1-RTT, and eliminates weak algorithms - disable TLS 1.0/1.1/1.2 where possible.',
      'SNI leaks the hostname in cleartext in TLS 1.2/1.3 - Encrypted Client Hello (ECH) in RFC 9258 solves this but requires DNS HTTPS records.',
      'Historic attacks (BEAST, POODLE, ROBOT) exploited specific cipher suite weaknesses - each was mitigated by disabling that cipher class.',
      'HSTS preloading instructs browsers to refuse HTTP connections even on first visit - submit to hstspreload.org for domains where HTTPS is permanent.',
      'Set SSLKEYLOGFILE to log TLS session keys for Wireshark decryption - essential for debugging encrypted traffic in test environments.',
    ],
  },
  {
    id: 'attacks',
    title: 'Cryptographic Attacks',
    difficulty: 'ADVANCED',
    readTime: '28 min',
    labLink: '/modules/crypto/lab',
    content: (
      <div>
        <P>Cryptographic attacks exploit gaps between the mathematical ideal and the real-world implementation. Most successful attacks do not break the underlying math - they exploit how the algorithm is used, how implementations handle errors, or how hardware leaks information through side channels.</P>

        <H3>Padding Oracle Attacks</H3>
        <P>A padding oracle attack exploits an application that reveals whether CBC padding is valid. The attacker submits modified ciphertext and observes whether the application throws a "padding error" (different from a "decryption error"). This binary information is enough to decrypt any ciphertext block-by-block without the key.</P>
        <Pre label="CBC PADDING ORACLE DECRYPTION">{'Target: decrypt ciphertext block C[n]\nAttack modifies the preceding block C[n-1] byte by byte\n\nFor each byte position i (right to left):\n  Try all 256 values x for C[n-1][i]\n  When server returns "valid padding":\n    D(C[n])[i] XOR x = desired_padding_byte\n    Therefore: D(C[n])[i] = desired_padding_byte XOR x\n    Therefore: P[n][i] = D(C[n])[i] XOR original_C[n-1][i]\n\nRepeat for each byte = full block decryption\nRepeat for each block = full ciphertext decryption\n\nRequires: ~256 * 16 = 4096 requests per 16-byte block'}</Pre>
        <P>The POODLE attack (2014) exploited this in SSLv3. Lucky13 exploited timing differences in MAC verification order. BEAST exploited predictable IVs. PadBuster is the classic padding oracle automation tool. ASP.NET's MAC-then-encrypt order was exploited in 2010 (Rizzo/Duong).</P>

        <H3>Bleichenbacher's RSA Padding Oracle</H3>
        <P>Bleichenbacher (1998) showed that if an RSA server distinguishes between valid and invalid PKCS#1 v1.5 padding during decryption, an attacker can adaptively query the server with millions of crafted messages and eventually decrypt any RSA ciphertext. The attack requires approximately 1 million queries for a 1024-bit key.</P>
        <Note type="danger"><strong>ROBOT Attack (2017)</strong> - "Return Of Bleichenbacher's Oracle Threat" found that 27% of top HTTPS servers including Facebook, Paypal, and government sites were still vulnerable to variants of the 1998 attack. The fixes were repeatedly implemented incorrectly. The lesson: RSA PKCS#1 v1.5 is fundamentally broken for encryption and should be replaced with ECDHE everywhere.</Note>

        <H3>Timing Side-Channel Attacks</H3>
        <P>The time an operation takes leaks information about secret data. If password comparison stops at the first non-matching byte, the comparison time reveals how many bytes match - allowing character-by-character brute force of the password.</P>
        <Pre label="TIMING ATTACK ON STRING COMPARISON">{'# Vulnerable - returns early on first mismatch\ndef check_token(user_token, real_token):\n    return user_token == real_token  # short-circuit comparison\n\n# Timing attack: try all 256 values for byte 0\n# The one taking slightly longer is the correct byte\n\n# Safe - constant time regardless of input\nimport hmac\ndef check_token_safe(user_token, real_token):\n    return hmac.compare_digest(user_token, real_token)'}</Pre>
        <P>RSA private key operations can be timed to extract the key if no blinding is applied. RSA blinding multiplies the ciphertext by a random value before decryption, making the timing independent of the key bits. All production RSA implementations should include blinding.</P>

        <H3>Cache-Timing Attacks</H3>
        <P>Flush+Reload and Prime+Probe are cache side-channel attacks. Table-based AES implementations use lookup tables indexed by key-dependent values. By monitoring which cache lines are accessed during AES encryption, an attacker sharing a CPU (co-location, hyperthreading) can recover the AES key. This is why ChaCha20 (no lookup tables) is preferred for crypto without AES-NI hardware acceleration.</P>

        <H3>Power Analysis Attacks</H3>
        <P>Physical devices like smart cards and HSMs consume power proportional to the data they process. Simple Power Analysis (SPA) examines a single power trace to identify algorithm operations. Differential Power Analysis (DPA) performs statistical analysis across many traces with different plaintexts to extract the key. DPA can break implementations that are otherwise mathematically sound. Countermeasures include masking (randomising intermediate values) and balanced implementation (same power consumption regardless of key bits).</P>

        <H3>Nonce Reuse Attacks</H3>
        <Pre label="CTR/GCM NONCE REUSE ATTACK">{'# If two messages M1 and M2 are encrypted with same key K and nonce N:\nC1 = M1 XOR keystream(K, N)\nC2 = M2 XOR keystream(K, N)\n\n# Attacker XORs ciphertexts:\nC1 XOR C2 = M1 XOR M2  (keystream cancels)\n\n# With known plaintext M1, attacker recovers M2:\nM2 = C1 XOR C2 XOR M1\n\n# This was exploited in:\n# - WEP (802.11 reused IVs constantly)\n# - Early RC4 in SSL\n# - Many IoT devices with broken RNGs'}</Pre>

        <H3>Weak Random Number Generators</H3>
        <P>In 2013, researchers discovered that hundreds of thousands of Android Bitcoin wallets had generated weak ECDSA signatures due to a bug in Android's SecureRandom (Java). The fix for the entropy pool from a previous bug inadvertently made the RNG deterministic on some devices. Since ECDSA security requires unpredictable k values, and these devices produced predictable k values, the private keys were mathematically extractable from the public blockchain. Millions of dollars in Bitcoin was at risk.</P>
        <Note type="danger">Weak RNG failures are silent and catastrophic. There is no error message - signatures look valid. Always use OS-level CSPRNGs and test entropy availability. On embedded devices and virtual machines, seeding the entropy pool at boot is non-trivial and must be explicitly addressed.</Note>

        <H3>Meet-in-the-Middle Attack on 2DES</H3>
        <P>2DES (applying DES twice with two different keys) provides only 57 bits of effective security, not 112. A meet-in-the-middle attack encrypts a known plaintext with all 2^56 possible K1 values, stores the results, then decrypts the known ciphertext with all 2^56 possible K2 values, and looks for matches. The table lookup reduces the attack to 2^57 operations. This is why 3DES (triple DES) was used instead of 2DES.</P>

        <H3>Birthday Attack - Collision Probability</H3>
        <P>The birthday paradox: in a group of 23 people, there is a 50% chance two share a birthday. Analogously, in a hash with n-bit output, you need only 2^(n/2) random inputs to find a collision with 50% probability. SHA-256 has 256-bit output and thus 128-bit collision resistance. MD5 has 128-bit output and 64-bit collision resistance - a birthday attack requires only 2^64 computations, which was feasible by 2004.</P>

        <H3>Downgrade Attacks</H3>
        <P>FREAK (2015): an MITM attacker could downgrade an RSA key exchange to export-grade 512-bit RSA (required by 1990s US export laws), then factor the 512-bit key in hours and decrypt the session. Logjam (2015): similar attack against DHE, downgrading to 512-bit DH which could be solved with precomputed discrete log tables. Both required that servers still supported these legacy cipher suites decades after they became insecure.</P>

        <H3>Coppersmith's Attack</H3>
        <P>When RSA is used with a small public exponent e=3 and the plaintext m is short (m^3 &lt; n), then the encryption C = m^3 mod n = m^3 exactly (no modular reduction). Taking the cube root of C directly recovers m. This affected early padded RSA when e=3 was common. Always use e=65537 and proper padding.</P>

        <Note type="tip">The common thread in all these attacks: using algorithms outside their specified conditions (nonce reuse), relying on error messages that leak internal state (padding oracles), trusting timing (side channels), or using deprecated parameters (small e, weak DH groups). Cryptographic APIs are designed to prevent misuse - when you find yourself working around an API's constraints, that is a red flag.</Note>
      </div>
    ),
    takeaways: [
      'Padding oracle attacks decode CBC ciphertext byte-by-byte using ~256 * block_count requests - the fix is AEAD (GCM) which detects tampering before decryption.',
      'The ROBOT attack (2017) showed Bleichenbacher\'s 1998 RSA padding oracle still affected 27% of HTTPS servers - RSA PKCS#1 v1.5 is fundamentally broken for key exchange.',
      'Always use constant-time comparison (hmac.compare_digest) for secrets - timing differences in character-by-character comparison allow offline brute force.',
      'CTR and GCM nonce reuse leaks the XOR of plaintexts (CTR) or the authentication key (GCM) - nonces must be unique per key, forever, with no exceptions.',
      'The 2013 Android ECDSA k-reuse bug allowed private key extraction from public blockchain transactions - weak RNGs fail silently and catastrophically.',
    ],
  },
  {
    id: 'pqc',
    title: 'Post-Quantum Cryptography & Modern Cryptography',
    difficulty: 'ADVANCED',
    readTime: '25 min',
    labLink: '/modules/crypto/lab',
    content: (
      <div>
        <P>Quantum computers running Shor's algorithm can break RSA, ECC, and Diffie-Hellman. This is not a future problem - the "harvest now, decrypt later" threat means adversaries may already be storing your encrypted traffic to decrypt once a quantum computer is available.</P>

        <H3>The Quantum Threat</H3>
        <Note type="danger">
          <strong>Shor's Algorithm</strong> - runs on a quantum computer with enough qubits. Efficiently solves integer factorisation (breaks RSA) and discrete logarithm (breaks DH, ECDH, ECDSA). A quantum computer with ~4000 logical qubits could break 2048-bit RSA. Current quantum computers are noisy and small, but the threat timeline is real - NIST estimates "cryptographically relevant quantum computers" within 10-15 years.<br/><br/>
          <strong>Grover's Algorithm</strong> - provides a quadratic speedup for searching. This halves the effective key length of symmetric ciphers: AES-128 would have 64-bit quantum security (broken), AES-256 would have 128-bit quantum security (still safe). The fix for symmetric crypto is simple: use AES-256.
        </Note>
        <P>The "harvest now, decrypt later" attack: an adversary records encrypted traffic today (using classical computers) and stores it. When a quantum computer becomes available, they decrypt the stored traffic. Any data that must remain confidential for more than 10-15 years is at risk TODAY if it is encrypted with RSA or ECC.</P>

        <H3>NIST Post-Quantum Cryptography Standardisation</H3>
        <P>NIST ran a multi-year competition (2016-2024) to standardise post-quantum algorithms. In 2024, NIST published the first PQC standards:</P>
        <Table
          headers={['Standard', 'Algorithm', 'Type', 'Security Basis', 'Key Size']}
          rows={[
            ['FIPS 203', 'ML-KEM (Kyber)', 'Key Encapsulation', 'Module Learning With Errors (MLWE)', 'pk: 800B-1568B'],
            ['FIPS 204', 'ML-DSA (Dilithium)', 'Digital Signature', 'Module Learning With Errors (MLWE)', 'pk: 1312B-2592B'],
            ['FIPS 205', 'SLH-DSA (SPHINCS+)', 'Digital Signature', 'Hash functions only (conservative)', 'pk: 32-64B, sig: 8KB-50KB'],
            ['(Future)', 'FN-DSA (FALCON)', 'Digital Signature', 'NTRU lattice', 'pk: 897B-1793B, sig: 666B-1280B'],
          ]}
        />

        <H3>Lattice-Based Cryptography</H3>
        <P>Most PQC candidates are based on lattice problems. A lattice is a grid of points in high-dimensional space. The hard problems are:</P>
        <Note type="info">
          <strong>LWE (Learning With Errors)</strong> - given many equations of the form a_i * s + e_i = b_i mod q (where s is the secret and e_i is small error), find s. Without the error, this is trivially solved with linear algebra. The error makes it hard.<br/><br/>
          <strong>RLWE (Ring LWE)</strong> - LWE over polynomial rings. More efficient (smaller keys) than plain LWE.<br/><br/>
          <strong>MLWE (Module LWE)</strong> - generalisation of RLWE used in Kyber and Dilithium. Balances efficiency and security with an adjustable module dimension k.
        </Note>

        <H3>CRYSTALS-Kyber (ML-KEM)</H3>
        <P>Kyber is a Key Encapsulation Mechanism (KEM). It does not encrypt data directly - it encapsulates a random shared secret. The encapsulated secret is then used as a symmetric key. This is the replacement for ECDH in key exchange protocols.</P>
        <Pre label="KYBER KEM USAGE (CONCEPTUAL)">{'# Key generation\n(pk, sk) = Kyber.keygen()\n\n# Encapsulation (sender does this)\n(ciphertext, shared_secret) = Kyber.encapsulate(pk)\n\n# Decapsulation (receiver does this)\nshared_secret = Kyber.decapsulate(sk, ciphertext)\n\n# Both parties now have shared_secret for symmetric encryption\n# Use with HKDF to derive encryption keys'}</Pre>

        <H3>CRYSTALS-Dilithium (ML-DSA)</H3>
        <P>Dilithium is a lattice-based signature scheme, the replacement for ECDSA. It is deterministic (like Ed25519), produces larger signatures than Ed25519 (2.4KB vs 64 bytes), but is secure against quantum computers. It uses the "Fiat-Shamir with Aborts" technique to achieve security.</P>

        <H3>SPHINCS+ (SLH-DSA)</H3>
        <P>SPHINCS+ is hash-based - its security rests only on the properties of hash functions, not on any algebraic problem. This makes it extremely conservative: if hash functions remain secure, SPHINCS+ remains secure. The downside: signature sizes are large (8KB to 50KB depending on parameters). It is stateless, unlike XMSS and LMS (stateful hash-based schemes that require tracking which one-time keys have been used).</P>

        <H3>Hybrid Approaches in TLS</H3>
        <P>The recommended migration path is hybrid key exchange: combine a classical algorithm (X25519) with a post-quantum algorithm (Kyber). The shared secret is derived from both. This means: even if Kyber is broken classically, the session is still as secure as X25519. And if a quantum computer breaks X25519, the session is still as secure as Kyber. TLS 1.3 supports this via the X25519Kyber768 key share, deployed by Chrome (2023) and Cloudflare.</P>
        <Pre label="HYBRID TLS KEY EXCHANGE">{'# Chrome (2023+) sends multiple key shares:\nClientHello:\n  supported_groups: [X25519Kyber768, X25519, P-256]\n  key_share: [\n    X25519Kyber768: (x25519_public || kyber768_public),\n    X25519: x25519_fallback\n  ]\n\n# Server responds with combined encapsulation\n# Final shared secret = HKDF(x25519_secret, kyber_secret)'}</Pre>

        <H3>Signal Protocol - Double Ratchet Algorithm</H3>
        <P>Signal's Double Ratchet combines two ratchets for end-to-end encrypted messaging with forward secrecy and break-in recovery:</P>
        <Note type="info">
          <strong>Diffie-Hellman ratchet</strong> - each message exchange includes a new DH key share. As the ratchet advances, past session keys cannot be recomputed. This provides forward secrecy: compromise of current keys does not expose past messages.<br/><br/>
          <strong>Symmetric-key ratchet</strong> - within a DH ratchet step, a chain key is advanced with each message using a KDF. This provides break-in recovery: if an attacker compromises the current state, they lose access after a few more DH ratchet steps as new DH keys are negotiated.
        </Note>
        <P>Signal is used by WhatsApp (Signal Protocol), iMessage (partial), and Signal app itself. The Double Ratchet specification is public. This is the gold standard for encrypted messaging.</P>

        <H3>Modern Practical Tools</H3>
        <Table
          headers={['Tool', 'Use Case', 'Command']}
          rows={[
            ['age', 'File encryption (modern GPG alternative)', 'age -r RECIPIENT_PUBKEY -o out.age plaintext.txt'],
            ['GPG/PGP', 'Email signing and encryption', 'gpg --encrypt --recipient user@example.com file.txt'],
            ['OpenSSL', 'Everything: TLS, certs, keys, hashing', 'openssl enc, genrsa, req, x509, dgst, s_client'],
            ['libsodium', 'Application crypto library (C/many langs)', 'crypto_box_easy(), crypto_secretbox_easy()'],
            ['hashcat', 'GPU-accelerated hash cracking', 'hashcat -m 1400 hashes.txt wordlist.txt'],
            ['john', 'CPU hash cracking, format detection', 'john --wordlist=rockyou.txt hashes.txt'],
          ]}
        />

        <H3>age - Modern File Encryption</H3>
        <P>age (Actually Good Encryption) by Filippo Valsorda is a simple, secure file encryption tool designed as a modern replacement for GPG for file encryption. It uses X25519, ChaCha20-Poly1305, and HKDF. No config files, no key signing, minimal attack surface.</P>
        <Pre label="AGE ENCRYPTION TOOL">{'# Generate key pair\nage-keygen -o key.txt\n\n# Encrypt to recipient (using their public key)\nage -r age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac97 \\\n  plaintext.txt > encrypted.age\n\n# Decrypt\nage -d -i key.txt encrypted.age > decrypted.txt\n\n# Encrypt to SSH key (no separate age key needed)\nage -R ~/.ssh/authorized_keys plaintext.txt > encrypted.age\n\n# Encrypt to multiple recipients\nage -r PUBKEY1 -r PUBKEY2 plaintext.txt > encrypted.age'}</Pre>

        <Note type="tip">For new applications requiring long-term confidentiality (healthcare, legal, government secrets), start deploying hybrid post-quantum algorithms now. X25519Kyber768 for key exchange and a classical signature scheme is the practical choice in 2024. The NIST standards (ML-KEM, ML-DSA) are now final and libraries are available in most languages via the Open Quantum Safe project (liboqs).</Note>
      </div>
    ),
    takeaways: [
      'Shor\'s algorithm breaks RSA, ECC, and DH on a quantum computer - "harvest now decrypt later" means data encrypted today may be decrypted in 10-15 years.',
      'Grover\'s algorithm halves symmetric key security - AES-128 becomes 64-bit quantum security (broken), AES-256 becomes 128-bit (safe) - upgrade to AES-256 now.',
      'NIST PQC standards (FIPS 203/204/205): ML-KEM (Kyber) for key exchange, ML-DSA (Dilithium) for signatures, SLH-DSA (SPHINCS+) as conservative hash-based fallback.',
      'Hybrid TLS key exchange (X25519 + Kyber768) provides security against both classical and quantum attackers - Chrome and Cloudflare deployed this in 2023.',
      'Signal\'s Double Ratchet combines DH ratchet (forward secrecy) with symmetric ratchet (break-in recovery) - the gold standard for end-to-end encrypted messaging.',
    ],
  },
]

export default function CryptoPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem',
        fontFamily: mono, fontSize: '0.7rem', color: '#5a7a5a', flexWrap: 'wrap'
      }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules" style={{ color: '#5a7a5a', textDecoration: 'none' }}>MODULES</Link>
        <span>›</span>
        <span style={{ color: accent }}>MOD-03 // CRYPTOGRAPHY</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/modules/osint" style={{
            textDecoration: 'none', padding: '3px 10px',
            background: 'rgba(255,179,71,0.05)', border: '1px solid rgba(255,179,71,0.2)',
            borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.1em'
          }}>
            ← MOD-02: OSINT
          </Link>
          <Link href="/modules/offensive" style={{
            textDecoration: 'none', padding: '3px 10px',
            background: 'rgba(255,179,71,0.05)', border: '1px solid rgba(255,179,71,0.2)',
            borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.1em'
          }}>
            MOD-04: OFFENSIVE SECURITY →
          </Link>
          <Link href="/modules/crypto/lab" style={{
            textDecoration: 'none', padding: '3px 10px',
            background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.5)',
            borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700
          }}>
            LAB →
          </Link>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: mono, fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>
          MODULE 03 · CRYPTOGRAPHY
        </div>
        <h1 style={{
          fontFamily: mono, fontSize: '2rem', fontWeight: 700,
          color: accent, margin: '0.5rem 0', lineHeight: 1.1,
          textShadow: '0 0 20px rgba(255,179,71,0.35)'
        }}>
          CRYPTOGRAPHY
        </h1>
        <p style={{ color: '#5a7a5a', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>
          Symmetric & asymmetric encryption · Hash functions & MACs · PKI & certificates · TLS internals · Cryptographic attacks · Post-quantum cryptography
        </p>
      </div>

      {/* Codex */}
      <ModuleCodex moduleId="crypto" accent={accent} chapters={chapters} />
    </div>
  )
}
