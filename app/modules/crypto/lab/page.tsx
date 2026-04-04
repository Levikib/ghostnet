'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#ffb347'
const moduleId = 'crypto'
const moduleName = 'Cryptography & Crypto Forensics'
const moduleNum = '03'

const steps: LabStep[] = [

  // ── SECTION 1: Hash Analysis & Identification ────────────────────────────────
  {
    id: 'crypto-01',
    title: 'Hash Anatomy — Length Tells the Algorithm',
    objective: `A breach dump contains this string:
5f4dcc3b5aa765d61d8327deb882cf99

Before you can crack it you need to identify the algorithm. Count the hex characters in that string. What common hashing algorithm produces exactly 32 hex characters (128 bits)?`,
    hint: 'Count the characters: 32 hex characters = 128 bits. That bit-length is the defining feature.',
    answers: ['md5', 'md5sum', 'MD5'],
    xp: 15,
    explanation: `Hash length (in hex characters) is the fastest identifier:

  MD5        → 32 hex chars  (128 bits)   — collision-broken, never use for passwords
  SHA-1      → 40 hex chars  (160 bits)   — collision-broken, deprecated in TLS/code signing
  SHA-256    → 64 hex chars  (256 bits)   — current standard, safe
  SHA-512    → 128 hex chars (512 bits)   — stronger, used in /etc/shadow type 6
  NTLM       → 32 hex chars  (128 bits)   — same length as MD5, same brokenness, used in Windows AD
  bcrypt     → starts with $2a$ or $2b$   — adaptive, intentionally slow, correct for passwords

The hash above (5f4dcc3b5aa765d61d8327deb882cf99) is the MD5 of the string "password" — one of the most commonly seen hashes in breach databases. Its presence in a leak means the account owner used a trivially guessable password.

A crucial distinction: hashing is one-way (you cannot reverse it mathematically), but precomputed rainbow tables and dictionary attacks mean short or common inputs are reversible in practice. This is why salt (a random prefix appended to the input before hashing) is mandatory — it defeats precomputed tables.`
  },

  {
    id: 'crypto-02',
    title: 'hashid — Automated Hash Recognition',
    objective: `You have a hash file with a mix of unknown hashes. Rather than counting characters manually, you use hashid to identify them automatically.

What command identifies the hash type of a file named hashes.txt using hashid?`,
    hint: 'hashid takes a file path as its argument: hashid followed by the filename.',
    answers: ['hashid hashes.txt', 'hashid', 'hashid -f hashes.txt'],
    xp: 15,
    explanation: `hashid analyses each line in the file and lists candidate algorithms:

  hashid hashes.txt          — identifies hashes in a file
  hashid -m hashes.txt       — also shows the Hashcat -m mode number
  hashid -j hashes.txt       — also shows the John the Ripper format name
  hashid '5f4dcc3b...'       — identify a single hash directly on the command line

hashid works by matching pattern lengths and prefixes. It will often list multiple candidates — for example, a 32-hex-char hash could be MD5 or NTLM. Context matters: Windows environments → NTLM; web apps → MD5. When in doubt, try both modes in Hashcat.

Alternative tool: hash-identifier (Python, offline), which does the same job with a slightly different detection database. For enterprise-scale jobs, hashcat itself can detect many formats with --show.`
  },

  {
    id: 'crypto-03',
    title: 'Hashcat Modes — Mapping Algorithms to Numbers',
    objective: `Hashcat requires a -m mode number that tells it which algorithm to use when cracking.

You have an NTLM hash (Windows domain credential). What is the Hashcat mode number for NTLM?`,
    hint: 'Run: hashcat --help | grep -i ntlm  — or recall that NTLM is mode 1000.',
    answers: ['1000', '-m 1000', 'mode 1000'],
    xp: 20,
    explanation: `Critical mode numbers to memorise for pentesting:

  0     MD5
  100   SHA-1
  400   phpBB/WordPress MD5
  500   md5crypt (Unix $1$)
  900   MD4
  1000  NTLM         ← Windows Active Directory, pass-the-hash attacks
  1400  SHA-256
  1700  SHA-512
  1800  sha512crypt  (Unix $6$) — used in /etc/shadow on modern Linux
  3200  bcrypt       — intentionally slow, require GPU clusters to crack
  5600  NetNTLMv2    ← captured from network with Responder, the most common pentest hash
  13100 Kerberoast (RC4 TGS) ← from AS-REP roasting / Kerberoasting in AD

Full command to crack an NTLM hash:
  hashcat -m 1000 -a 0 ntlm.hash rockyou.txt

Flags:
  -a 0    dictionary attack (default, fastest against weak passwords)
  -a 3    brute-force with mask (e.g. -a 3 ?u?l?l?l?d?d?d?d for 8-char mixed)
  --rules applies transformation rules (capitalise, append year, leet substitutions)

A GPU-equipped machine cracks billions of MD5 hashes per second. bcrypt limits you to thousands. Choose your password storage algorithm accordingly.`
  },

  {
    id: 'crypto-04',
    title: 'Hashcat Dictionary Attack — Cracking in Practice',
    objective: `You have extracted an NTLM hash from a Windows domain controller:
aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c

The second half (after the colon) is the actual NTLM hash. You suspect a weak password. Construct the hashcat command using rockyou.txt. What flag enables rule-based mutations to try common transforms like capitalisation and appending numbers?`,
    hint: 'Rule files transform each word in the wordlist. The flag is -r and a common built-in ruleset is best64.',
    answers: ['-r', '--rules-file', 'hashcat -m 1000 -a 0 -r best64.rule', '-r best64.rule'],
    flag: 'FLAG{hash_cracked_ntlm}',
    xp: 25,
    explanation: `Full cracking command with rules:
  hashcat -m 1000 -a 0 hash.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule

What best64.rule does: applies 64 common mutations to every wordlist entry:
  - Capitalise first letter (password → Password)
  - Append 1-4 digits (password → password1, password123)
  - Leet substitutions (password → p@ssw0rd)
  - Duplicate and reverse (password → passworddrowssap)

This transforms a 14-million-word rockyou.txt into ~900 million effective candidates — while still running at GPU speed.

Password cracking workflow:
  1. Start: dictionary + best64 (catches ~70% of real-world passwords)
  2. Escalate: larger wordlists (crackstation.txt, HIBP) + OneRuleToRuleThemAll.rule
  3. Escalate: hybrid attack (-a 6, wordlist + mask: appending ?d?d?d?d)
  4. Last resort: pure brute-force with incremental mask

For bcrypt, even with a 3090 GPU you get ~10k c/s, so only dictionary attacks are practical. Choose bcrypt or Argon2id for any password you control.

The "empty LM hash" aad3b435b51404eeaad3b435b51404ee means LM hashing was disabled — a good thing. Only the NT hash matters.`
  },

  // ── SECTION 2: Encoding, Obfuscation & Classic Ciphers ─────────────────────
  {
    id: 'crypto-05',
    title: 'Base64 — Encoding Is Not Encryption',
    objective: `During malware triage you find a suspicious PowerShell one-liner in a script:
  powershell -EncodedCommand aQBwAGMAbwBuAGYAaQBnAA==

The argument after -EncodedCommand is Base64-encoded UTF-16LE. Decode it on Linux:
  echo "aQBwAGMAbwBuAGYAaQBnAA==" | base64 -d | strings

What common network diagnostic command does this decode to?`,
    hint: 'The strings output strips null bytes from UTF-16LE. ipconfig is a Windows networking command.',
    answers: ['ipconfig', 'i p c o n f i g'],
    flag: 'FLAG{encoded_command_decoded}',
    xp: 20,
    explanation: `Base64 encodes binary data as printable ASCII. It is NOT encryption — no key, trivially reversible. Attackers use it to:
  - Bypass simple string-match AV signatures
  - Pass binary payloads through text channels (email, HTTP POST)
  - Obfuscate PowerShell payloads from casual inspection

PowerShell -EncodedCommand accepts Base64-encoded UTF-16LE commands. This is extremely common in living-off-the-land (LotL) attacks:
  $cmd = "Get-Process"; [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($cmd))

Defender evasion tip: defenders now decode and scan encoded commands. AV engines decode base64 before signature matching. Attackers layer obfuscation: base64(xor(compress(payload))).

Other encoding schemes to recognise:
  Hex        0x68656c6c6f  — often used in shellcode
  URL        %2F%3A%3A     — URL injection / bypass
  HTML       &#x3C;script  — XSS bypass
  ROT13      uryyb         — trivial Caesar cipher, sometimes seen in CTFs
  XOR        variable key  — very common in malware loaders

The command to decode each:
  base64   echo "..." | base64 -d
  hex      echo "68656c6c6f" | xxd -r -p
  URL      python3 -c "import urllib.parse; print(urllib.parse.unquote('...'))"
  ROT13    echo "uryyb" | tr 'A-Za-z' 'N-ZA-Mn-za-m'`
  },

  {
    id: 'crypto-06',
    title: 'XOR — The Simplest Cipher and Why Malware Loves It',
    objective: `A malware sample's strings are all XOR-encrypted with a single-byte key. You know that "MZ" (0x4D 0x5A) is always the first two bytes of a Windows PE executable.

The first two encrypted bytes are 0x1A and 0x2D. XOR each byte with the corresponding MZ byte to find the key.

0x1A XOR 0x4D = ?  (this is the key — answer in decimal or hex)`,
    hint: 'XOR truth table: 0x1A XOR 0x4D. Work it out bit by bit or use Python: python3 -c "print(hex(0x1A ^ 0x4D))"',
    answers: ['0x57', '87', '57', '0x57 (W)'],
    xp: 25,
    explanation: `0x1A XOR 0x4D = 0x57 (decimal 87, ASCII character 'W')

XOR cipher properties make it popular in malware:
  - Completely symmetric: encrypt(plaintext, key) = ciphertext, decrypt(ciphertext, key) = plaintext
  - Fast (single CPU instruction)
  - No dependencies or libraries needed
  - Key can be any byte value

Known-plaintext attack (used above): if you know what the plaintext should be at a given position, XOR the ciphertext byte with the known plaintext byte to recover the key. PE headers, HTTP headers, and PNG signatures all provide known plaintexts.

For multi-byte XOR keys, use frequency analysis or known-plaintext at multiple offsets. Tools:
  xortool          — identifies key length and key from ciphertext
  CyberChef        — web-based, XOR operation with key in hex
  python3 -c       — quick one-liners for simple keys

Why XOR is not real security: single-byte XOR has only 256 possible keys — brute-forceable instantly. Multi-byte XOR with a short key is also weak (repeating key = Vigenere cipher, broken by Kasiski examination). Real encryption (AES, ChaCha20) uses XOR as one component in a much larger construction.`
  },

  // ── SECTION 3: Symmetric Encryption with OpenSSL ────────────────────────────
  {
    id: 'crypto-07',
    title: 'AES-256-CBC — Encrypting Files with OpenSSL',
    objective: `You need to encrypt a sensitive file before sending it over an untrusted channel. You are using OpenSSL on the command line.

What flag must you add to "openssl enc -aes-256-cbc" to use the modern PBKDF2 key derivation (rather than the legacy, weak EVP_BytesToKey)?`,
    hint: 'The flag name is a common abbreviation for the algorithm name: PBKDF2.',
    answers: ['-pbkdf2', 'pbkdf2', '-pbkdf2 -iter 100000'],
    xp: 20,
    explanation: `Full encrypt command (modern, recommended):
  openssl enc -aes-256-cbc -pbkdf2 -iter 100000 -in plaintext.txt -out encrypted.bin -k "passphrase"

Full decrypt command:
  openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -in encrypted.bin -out decrypted.txt -k "passphrase"

Why -pbkdf2 matters:
  Without it, OpenSSL uses EVP_BytesToKey — a weak 1-round MD5 key derivation designed in the 1990s. A passphrase of "letmein" becomes the AES key after a single MD5 hash, which is cracked in milliseconds with Hashcat mode -m 22000.
  With -pbkdf2 -iter 100000, the passphrase is stretched through 100,000 rounds of HMAC-SHA256, making brute-force ~100,000x slower.

AES-CBC requires a random IV (initialisation vector). OpenSSL generates one automatically and prepends it to the output file — you do not need to manage it manually.

AES modes to know:
  CBC   — standard, block-by-block, IV required, padding needed
  GCM   — authenticated encryption (also checks integrity), preferred for network protocols
  CTR   — stream-cipher mode, no padding, parallelisable
  ECB   — NEVER use, identical plaintext blocks produce identical ciphertext blocks (penguin logo problem)`
  },

  {
    id: 'crypto-08',
    title: 'OpenSSL — Generate and Inspect RSA Keys',
    objective: `Public-key cryptography underpins TLS, SSH, PGP, and code signing. You need to generate a 4096-bit RSA keypair and inspect the modulus size.

After generating the key with:
  openssl genrsa -out private.pem 4096

What OpenSSL subcommand + flag combination displays the key details including modulus, prime factors, and public exponent?`,
    hint: 'The subcommand is "rsa" and the flag to print in human-readable text is -text.',
    answers: ['openssl rsa -in private.pem -text', 'rsa -text', '-text', 'openssl rsa -text -in private.pem'],
    xp: 20,
    explanation: `Key generation and inspection workflow:

  # Generate 4096-bit private key
  openssl genrsa -out private.pem 4096

  # Extract public key
  openssl rsa -in private.pem -pubout -out public.pem

  # Inspect key details (modulus, public exponent, prime factors)
  openssl rsa -in private.pem -text -noout

  # Encrypt a file using the public key (small files only — RSA has size limits)
  openssl rsautl -encrypt -pubin -inkey public.pem -in secret.txt -out secret.enc

  # Decrypt
  openssl rsautl -decrypt -inkey private.pem -in secret.enc -out secret.txt

RSA key size guidance:
  1024 bits — BROKEN (factorable with GNFS in months on commodity hardware)
  2048 bits — current minimum, acceptable until ~2030
  4096 bits — recommended for new keys, provides ~140-bit equivalent security
  8192 bits — very slow key operations, rarely necessary

The public exponent in most RSA keys is 65537 (0x10001). This is a deliberate choice — it makes encryption fast while keeping the math secure.

RSA vs symmetric:
  RSA is ~1000x slower than AES. In practice, RSA encrypts only a random AES key (key encapsulation), then AES encrypts the actual data. This hybrid approach is how TLS, PGP, and SSH all work.`
  },

  {
    id: 'crypto-09',
    title: 'Digital Signatures — Proving Authenticity',
    objective: `You need to sign a binary release so users can verify it was published by you and has not been modified in transit.

Using OpenSSL, what command signs a file called release.tar.gz with your RSA private key and produces a detached signature file?`,
    hint: 'The subcommand is "dgst" (digest), and the flag to sign is -sign followed by the private key path.',
    answers: [
      'openssl dgst -sha256 -sign private.pem -out release.tar.gz.sig release.tar.gz',
      'openssl dgst -sha256 -sign private.pem',
      'dgst -sha256 -sign',
      'openssl dgst -sign private.pem -sha256 -out release.tar.gz.sig release.tar.gz'
    ],
    flag: 'FLAG{digital_signature_created}',
    xp: 20,
    explanation: `Sign:
  openssl dgst -sha256 -sign private.pem -out release.tar.gz.sig release.tar.gz

Verify (anyone with your public key can do this):
  openssl dgst -sha256 -verify public.pem -signature release.tar.gz.sig release.tar.gz
  → "Verified OK" or "Verification Failure"

How it works:
  1. SHA-256 hash of the file is computed (fixed-size digest)
  2. The digest is encrypted with your RSA private key → signature
  3. Verifier decrypts the signature with your public key → recovers digest
  4. Verifier independently hashes the file → if digests match, authentic and unmodified

Security properties:
  Authenticity  — only the private key holder could have signed it
  Integrity     — any modification to the file produces a different hash → signature fails
  Non-repudiation — the signer cannot deny signing if the private key is under their control

Real-world use: GPG-signed software packages (apt, rpm), code signing certificates (Windows Authenticode, Apple notarisation), TLS certificates (CA signs the server's public key).

Note: a signature only proves authenticity if the public key is trustworthy. This is what certificate authorities (CAs) and web of trust (GPG) exist to solve.`
  },

  // ── SECTION 4: TLS, Certificates & PKI ──────────────────────────────────────
  {
    id: 'crypto-10',
    title: 'TLS Certificate Inspection',
    objective: `A server is using an expired or incorrectly issued TLS certificate — a common misconfiguration you need to document during a security assessment.

What OpenSSL command connects to example.com on port 443 and dumps the full certificate details to the terminal?`,
    hint: 'The subcommand is "s_client". The flag to dump to connect to a host is -connect followed by hostname:port.',
    answers: [
      'openssl s_client -connect example.com:443',
      's_client -connect example.com:443',
      'openssl s_client -connect example.com:443 -showcerts'
    ],
    xp: 20,
    explanation: `openssl s_client -connect example.com:443

This opens a raw TLS connection and dumps:
  - Certificate chain (leaf, intermediates, root CA)
  - Subject and issuer fields (CN, SAN, O, OU)
  - Validity dates (Not Before / Not After)
  - TLS version negotiated (TLSv1.2, TLSv1.3)
  - Cipher suite selected
  - Session ticket and HSTS info

Useful variations:
  # Only show certificate info (no raw PEM)
  openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -text

  # Check certificate expiry date only
  openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates

  # Test specific TLS version
  openssl s_client -connect example.com:443 -tls1_2
  openssl s_client -connect example.com:443 -tls1_3

  # Check for SSLv3/TLSv1.0 vulnerabilities (POODLE, BEAST)
  openssl s_client -connect example.com:443 -ssl3    # should fail on secure servers

What to look for in a pentest:
  - Expired certificates (obvious finding, disrupts monitoring tools)
  - Self-signed certificates (no trusted CA — easy to swap with an attacker's cert)
  - Wildcard certs (*.example.com) — one compromised subdomain can impersonate all
  - Weak cipher suites (RC4, 3DES, export ciphers — legacy vulnerabilities)
  - Missing SANs — the hostname you connected to may not actually match the cert`
  },

  {
    id: 'crypto-11',
    title: 'Certificate Transparency — Finding Hidden Subdomains',
    objective: `Certificate Transparency (CT) logs record every TLS certificate ever issued for a domain. This makes them an OSINT goldmine — you can find subdomains that were never publicly advertised.

The public CT aggregator at crt.sh lets you search by domain. What URL pattern would you query (using curl) to retrieve all certificates issued for subdomains of example.com in JSON format?`,
    hint: 'The crt.sh search endpoint accepts ?q= for the domain pattern and &output=json for machine-readable output. Wildcards use % not *.',
    answers: [
      'crt.sh/?q=%.example.com&output=json',
      'https://crt.sh/?q=%.example.com&output=json',
      'curl https://crt.sh/?q=%.example.com&output=json',
      'crt.sh/?q=%25.example.com'
    ],
    xp: 20,
    explanation: `Certificate Transparency was introduced by Google in 2013 and is now mandatory for all publicly-trusted TLS certificates. Every CA must submit new certificates to public CT logs within 24 hours.

From a recon perspective, CT logs expose:
  - All subdomains ever given a TLS certificate (staging.example.com, admin.example.com, vpn-old.example.com)
  - Acquisition history (certificates for example-acquired.com issued by example.com's CA)
  - Infrastructure clues (certificates issued to cloud providers reveal hosted services)
  - Historical snapshots (expired certs show what existed years ago)

Full query with jq processing:
  curl -s "https://crt.sh/?q=%.example.com&output=json" | jq -r '.[].name_value' | sort -u

This returns all common names and SAN values ever issued for the domain. Combine with DNS resolution to find live targets:
  curl -s "https://crt.sh/?q=%.example.com&output=json" | jq -r '.[].name_value' | sort -u | while read sub; do host $sub 2>/dev/null | grep "has address"; done

Tools that automate this: subfinder, amass, assetfinder — all query CT logs as one data source among many.

Defensive note: you cannot opt out of CT logging for publicly-trusted certs. Private/internal PKI certs (self-signed or private CA) do not appear in CT logs.`
  },

  // ── SECTION 5: Blockchain Forensics ─────────────────────────────────────────
  {
    id: 'crypto-12',
    title: 'Bitcoin Address Anatomy',
    objective: `Ransomware typically leaves a Bitcoin payment address in its ransom note. You need to understand the structure to trace the funds.

A legacy Bitcoin address starts with "1", a P2SH address starts with "3", and a native SegWit (bech32) address starts with "bc1".

A victim receives a ransom note containing: bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq

What type of Bitcoin address is this — and can it be traced on the public blockchain without any special tools?`,
    hint: 'bc1 prefix = native SegWit / bech32. All Bitcoin transactions are permanently public on the blockchain.',
    answers: ['yes', 'bech32', 'segwit', 'native segwit', 'bc1 segwit', 'yes publicly traceable'],
    xp: 20,
    explanation: `Yes — all Bitcoin transactions are permanently public. The blockchain is a public ledger.

Bitcoin address types:
  1xxxx   P2PKH (legacy, 34 chars)       — pay to public key hash
  3xxxx   P2SH  (script hash, 34 chars)  — enables multisig, wrapped SegWit
  bc1q..  P2WPKH (native SegWit, bech32) — lower fees, current standard
  bc1p..  Taproot (Schnorr sig, bech32m)  — privacy improvements, newest

Blockchain forensics workflow for ransomware investigation:
  1. Paste the address into a block explorer (Blockchain.com, Blockchair, mempool.space)
  2. View all incoming and outgoing transactions, dates, amounts, counterparty addresses
  3. Track fund movement: address → mixing service → exchange withdrawal
  4. Identify exchange deposits (exchange addresses are publicly known or can be subpoenaed)

Bitcoin is pseudonymous, not anonymous:
  - Every transaction is public
  - Address reuse links multiple transactions to the same entity
  - Most ransomware operators eventually cash out via exchanges that require KYC
  - Chainalysis, Elliptic, TRM Labs provide commercial blockchain analytics for law enforcement

Privacy-enhancing techniques attackers use:
  CoinJoin     — combine multiple users' transactions into one to obscure inputs/outputs
  Mixing services  — pool coins from many users, return different coins
  Monero (XMR)    — privacy coin with ring signatures and stealth addresses (much harder to trace)
  Chain hopping   — convert BTC → XMR → BTC to break the audit trail`
  },

  {
    id: 'crypto-13',
    title: 'Transaction Tracing — Following the Money',
    objective: `Law enforcement has identified a ransomware payment address. Using a public block explorer, they need to follow the money to find where it was cashed out.

When you visit a Bitcoin block explorer and look at an address's transaction history, what key piece of information tells you the address sent funds to a known exchange (potential cashout point)?

Answer: the output __________ that matches known exchange deposit addresses.`,
    hint: 'When BTC moves from address A to address B, address B is the "output address" or destination address.',
    answers: ['address', 'output address', 'destination address', 'receiving address'],
    flag: 'FLAG{blockchain_traced}',
    xp: 20,
    explanation: `Blockchain tracing methodology:

  1. Start address → view all received and sent transactions
  2. Identify "change addresses" — change output returns to a new attacker-controlled address
  3. Follow the primary output (the non-change output) to the next address
  4. Repeat until you reach a known exchange address or a dead end

Identifying exchange addresses:
  - Block explorers tag known exchange addresses (Binance, Kraken, Huobi, etc.)
  - Chainalysis Attribution API maps addresses to entities
  - Large number of incoming transactions from many different addresses = likely exchange hot wallet

UTXO (Unspent Transaction Output) model:
  Bitcoin doesn't have "account balances" like banks. It tracks UTXOs — specific outputs that haven't been spent. When you spend BTC, you reference previous UTXOs as inputs, create new output UTXOs, and get change back as another UTXO.

This model is both a privacy challenge and a forensic advantage:
  - Heuristic #1: inputs in the same transaction are likely controlled by the same entity (common-input ownership heuristic)
  - Heuristic #2: the smaller output is often change; the larger goes to the recipient

Tools used in real investigations:
  Chainalysis Reactor     — commercial, used by FBI, IRS CI, Europol
  Elliptic Navigator      — commercial blockchain analytics
  mempool.space           — free, excellent for manual tracing
  Blockchair              — free, supports multiple blockchains including Monero`
  },

  {
    id: 'crypto-14',
    title: 'GPG — End-to-End Encrypted Communication',
    objective: `A whistleblower wants to send you sensitive documents securely. You need them to encrypt the files to your GPG public key so only you can decrypt them.

What GPG command encrypts a file called report.pdf using the recipient's email address as the key selector?`,
    hint: 'gpg --encrypt takes -r for recipient (their email or key ID) and the filename as the last argument.',
    answers: [
      'gpg --encrypt -r user@example.com report.pdf',
      'gpg -e -r user@example.com report.pdf',
      'gpg --encrypt --recipient user@example.com report.pdf',
      'gpg -e -r email report.pdf'
    ],
    xp: 15,
    explanation: `GPG (GNU Privacy Guard) implements the OpenPGP standard for asymmetric encryption and digital signatures.

Key operations:
  # Generate your keypair
  gpg --full-generate-key

  # Export your public key (share this with senders)
  gpg --export --armor user@example.com > pubkey.asc

  # Import someone else's public key
  gpg --import their_pubkey.asc

  # Encrypt a file to a recipient
  gpg --encrypt -r recipient@example.com --armor plaintext.txt
  → Creates plaintext.txt.asc (ASCII-armored ciphertext)

  # Decrypt (uses your private key automatically)
  gpg --decrypt encrypted.txt.asc > decrypted.txt

  # Sign a file (proves it came from you)
  gpg --detach-sign --armor document.pdf
  → Creates document.pdf.asc (signature file)

  # Verify a signature
  gpg --verify document.pdf.asc document.pdf

Key server and trust:
  gpg --keyserver keys.openpgp.org --recv-keys KEYID   # download key
  gpg --keyserver keys.openpgp.org --send-keys KEYID   # publish your key
  gpg --edit-key user@example.com → trust              # set trust level

Real-world use: SecureDrop (whistleblower platform), encrypted email (Proton Mail uses OpenPGP internally), software package signing (Debian, Fedora), Bitcoin hardware wallets for firmware verification.`
  },

  {
    id: 'crypto-15',
    title: 'Steganography — Hidden Data in Plain Sight',
    objective: `An attacker is hiding C2 commands inside seemingly innocent JPEG images posted to a public forum. This is a classic steganography-based covert channel.

The tool steghide can embed and extract hidden data from image files. What steghide command extracts hidden data from an image named cover.jpg (with no passphrase)?`,
    hint: 'steghide uses "extract" as the operation and -sf for stegofile. For no passphrase, press Enter or use -p "".',
    answers: [
      'steghide extract -sf cover.jpg',
      'steghide extract -sf cover.jpg -p ""',
      'steghide extract -sf cover.jpg -p',
      'steghide extract cover.jpg'
    ],
    flag: 'FLAG{hidden_message_extracted}',
    xp: 25,
    explanation: `Steganography hides data inside other data, as opposed to cryptography which makes data unreadable. A stego'd image looks identical to the naked eye.

steghide operations:
  # Embed data in an image
  steghide embed -cf cover.jpg -sf secret.txt -p "passphrase"
  → Produces a modified cover.jpg with secret.txt hidden inside

  # Extract hidden data
  steghide extract -sf stego.jpg -p "passphrase"

  # Get info about a stego file
  steghide info stego.jpg

How it works: steghide modifies the least-significant bits (LSB) of image pixel values. The human eye cannot distinguish a pixel value of 200 from 201. By systematically choosing which pixels to modify, arbitrary data can be hidden with minimal visual impact.

Detection methods (steganalysis):
  StegExpose       — statistical analysis to detect LSB steganography
  zsteg            — fast steg analysis for PNG and BMP
  binwalk          — extract embedded files and firmware (different technique: file concatenation)
  ExifTool         — check metadata for anomalies
  Compare originals — if you have the original image, a byte-diff reveals modifications

Other steganography techniques:
  Audio (MP3/WAV)  — hide data in audio noise floor using tools like mp3stego
  PDFs             — hide text in white-on-white or zero-opacity layers
  Network covert channels — hide data in TCP timestamp fields, IP TTL values, DNS query padding
  Whitespace steg  — hide data in trailing whitespace in source code

In incident response: if you find exfiltration but cannot identify the channel, steganographic exfiltration is a real possibility in environments that allow image uploads or social media access.`
  },

  // ── PHASE 6: TLS ATTACKS & CRYPTO FAILURES ───────────────────────────────

  {
    id: 'crypto-16',
    title: 'Phase 6 — TLS Attack: BEAST, POODLE, and Downgrade Attacks',
    objective: `TLS has had multiple catastrophic vulnerabilities caused by weak cipher modes and protocol downgrade flaws. POODLE (Padding Oracle On Downgraded Legacy Encryption) exploited SSL 3.0's CBC padding — a protocol from 1996 that could be forced by attackers who manipulate the TLS handshake. Modern TLS 1.3 eliminates entire vulnerability classes by removing CBC, RC4, RSA key exchange, and compression. What TLS version removed all known cryptographic vulnerabilities by mandating AEAD ciphers and forward secrecy?`,
    hint: 'The latest TLS version, released in 2018, removed all legacy cipher suites and is the only version with no known practical attacks.',
    answers: ['tls 1.3', 'TLS 1.3', '1.3', 'tls1.3'],
    xp: 20,
    explanation: `TLS version history and vulnerabilities — knowing these lets you audit servers and understand what still matters.

TLS version attack history:
  SSL 2.0 (1995): DROWN attack - shares key material with SSL 3.0; completely broken
  SSL 3.0 (1996): POODLE - CBC padding oracle allows plaintext recovery of cookies
  TLS 1.0 (1999): BEAST - CBC IV prediction allows chosen-plaintext attacks on cookies
  TLS 1.1 (2006): Partially fixed BEAST, still allows RC4 (biased keystream)
  TLS 1.2 (2008): Safe when configured correctly - but allows weak cipher suites
  TLS 1.3 (2018): Eliminated all weak ciphers, mandatory AEAD, mandatory forward secrecy

What TLS 1.3 removed:
  No RSA key exchange (only ephemeral Diffie-Hellman - forward secrecy mandatory)
  No CBC cipher suites (only AEAD: AES-GCM, ChaCha20-Poly1305)
  No RC4, DES, 3DES, MD5, SHA-1
  No TLS compression (defeats CRIME attack)
  No renegotiation
  Reduced handshake to 1 round-trip (TLS 1.2 took 2)

Testing TLS configuration:
  nmap --script ssl-enum-ciphers -p 443 target.com    Enumerate cipher suites
  testssl.sh target.com                               Comprehensive TLS audit
  sslyze --regular target.com                         Python TLS scanner
  openssl s_client -connect target.com:443            Manual TLS inspection

What to look for in a TLS audit:
  Protocols enabled: reject SSL 2/3, TLS 1.0, TLS 1.1
  Cipher suites: reject RC4, DES, 3DES, EXPORT ciphers, anonymous DH
  Certificate: check expiry, chain, key size (RSA 2048+ or ECDSA P-256+)
  Forward secrecy: ECDHE or DHE key exchange (not static RSA)
  HSTS: HTTP Strict Transport Security header present with long max-age`,
    flag: 'FLAG{tls_audit_complete}'
  },

  {
    id: 'crypto-17',
    title: 'Phase 6 — Padding Oracle Attack: PKCS7 CBC Decryption',
    objective: `A padding oracle attack exploits the way CBC mode validates PKCS7 padding. When decrypting, if the server tells you (via an error, timing, or behaviour change) whether the padding is valid, you can decrypt any ciphertext without knowing the key — purely by sending modified ciphertexts and observing which ones produce valid padding. This is a chosen-ciphertext attack. The padbuster tool automates this. If a CBC block is 16 bytes and you want to decrypt the last byte, how many possible byte values must you try in the worst case?`,
    hint: 'A single byte has 256 possible values (0x00 through 0xFF).',
    answers: ['256', '255', '16', '128'],
    xp: 25,
    explanation: `Padding oracle attacks are devastatingly elegant — the cryptographic key is never needed. Only a yes/no oracle is required.

How PKCS7 CBC padding works:
  Plaintext must be padded to block size (16 bytes for AES)
  Padding byte value = number of padding bytes added
  1 byte padding:  [data][0x01]
  4 bytes padding: [data][0x04][0x04][0x04][0x04]
  Full block pad:  [0x10][0x10]...[0x10]  (16 bytes of 0x10)

How the attack works (decrypting last byte):
  CBC decryption: Plaintext[i] = Decrypt(Ciphertext[i]) XOR Ciphertext[i-1]

  1. Modify last byte of Ciphertext[i-1] (call it C') trying all 256 values 0x00..0xFF
  2. Send modified ciphertext to server
  3. When server says "valid padding": last plaintext byte XOR C' = 0x01
  4. Therefore: last plaintext byte = 0x01 XOR C'
  5. Repeat for each byte working backwards

padbuster tool (automates the entire attack):
  padbuster http://target.com/decrypt ENCRYPTED_COOKIE 16 -encoding 0
  -encoding 0 = base64 (other options: hex, base64url)
  Recovers plaintext byte by byte, then re-encrypts arbitrary plaintext

Real-world impact:
  ASP.NET ViewState oracle (2010) - remote code execution via padding oracle
  JavaServer Faces ViewState encryption - decryptable
  Any application that returns different errors for bad padding vs wrong MAC

Prevention:
  Use authenticated encryption (AES-GCM, ChaCha20-Poly1305) - no separate padding
  MAC-then-encrypt or Encrypt-then-MAC with constant-time comparison
  NEVER reveal padding validity through errors, timing, or behaviour differences`
  },

  {
    id: 'crypto-18',
    title: 'Phase 6 — Side-Channel Attacks: Timing and Power Analysis',
    objective: `Side-channel attacks extract secret information from physical implementation characteristics — not from mathematical weaknesses. Timing attacks measure how long cryptographic operations take, which can leak key bits. RSA private key operations (modular exponentiation) take different amounts of time depending on the key bits being processed. Power analysis (SPA/DPA) measures electricity consumption of hardware during crypto operations. What type of side-channel attack collects thousands of power traces and uses statistical analysis to extract key bits?`,
    hint: 'Simple Power Analysis (SPA) uses one trace. The statistical multi-trace attack is Differential Power Analysis.',
    answers: ['differential power analysis', 'DPA', 'dpa', 'statistical power analysis'],
    xp: 20,
    explanation: `Side-channel attacks bypass mathematically secure algorithms by attacking their physical implementation. They are responsible for breaking countless real-world devices.

Timing attacks:
  RSA square-and-multiply: key bit = 0 -> square only; key bit = 1 -> square + multiply
  Measuring execution time for many operations reveals the key bit pattern
  Defense: constant-time implementations (same operations regardless of key value)

Meltdown and Spectre (CPU timing attacks, 2018):
  Exploit CPU speculative execution + cache timing
  Attacker measures cache access time to determine if data was loaded into cache
  Extracts kernel memory from unprivileged process - breaks OS isolation
  Affected: every Intel CPU from 1995-2018, many AMD and ARM CPUs

Power analysis attacks on smartcards/HSMs:
  Simple Power Analysis (SPA): one power trace, visually identify operations
  Differential Power Analysis (DPA): thousands of traces, statistical correlation
  Correlation Power Analysis (CPA): more efficient version of DPA
  Equipment: oscilloscope, current probe, ChipWhisperer (open source, ~$500)

ChipWhisperer - open hardware for side-channel research:
  Captures power traces via SPI/UART target interface
  Jupyter notebook tutorials from newae.com
  Can break AES on ATmega target in ~100 traces

Real-world targets:
  EMV payment cards (Chip and PIN): power analysis can extract private key
  Passport chips (e-passport): timing attacks on ECDSA nonce reuse
  TPM chips: timing attacks on RSA operations
  Smart meters: differential power analysis to extract billing keys

Countermeasures:
  Constant-time code: eliminate data-dependent branches and memory accesses
  Masking: XOR all intermediate values with a random mask value
  Noise injection: add random delays and dummy operations
  Physical shielding: Faraday cage, power line filtering, decoupling capacitors`
  },

  {
    id: 'crypto-19',
    title: 'Phase 6 — Post-Quantum Cryptography: The Coming Transition',
    objective: `Quantum computers running Shor's algorithm can factor large integers and solve discrete logarithm problems in polynomial time — breaking RSA, ECC, and Diffie-Hellman. A sufficiently powerful quantum computer would render all current public-key cryptography obsolete. NIST finalised its first post-quantum cryptography standards in 2024. What is the name of the NIST-standardised post-quantum key encapsulation mechanism based on lattice cryptography?`,
    hint: 'NIST standardised ML-KEM in FIPS 203 (2024), formerly known as KYBER during the selection process.',
    answers: ['ML-KEM', 'ml-kem', 'kyber', 'KYBER', 'ML-KEM (Kyber)', 'FIPS 203'],
    xp: 20,
    explanation: `The post-quantum cryptography transition is the largest infrastructure change in the history of internet security.

Why quantum computers break current crypto:
  Shor's algorithm (1994): factors N-bit integers in O(N^3) quantum operations
  RSA-2048 security: 2^112 classical operations -> trivial quantum operations
  ECDSA/ECDH: discrete log problem solved by Shor's in polynomial time
  Symmetric crypto (AES, SHA): Grover's algorithm gives quadratic speedup only
    -> AES-256 remains safe against quantum (equivalent to 128-bit classical)
    -> AES-128 weakened to 64-bit effective security -> upgrade to AES-256

NIST Post-Quantum Standards (2024):
  ML-KEM (FIPS 203):  Key Encapsulation Mechanism - replaces RSA/ECDH key exchange
    Based on Module Learning With Errors (M-LWE) lattice problem
    Key sizes: 768 bytes (level 1), 1184 bytes (level 3), 1568 bytes (level 5)

  ML-DSA (FIPS 204):  Digital Signature Algorithm - replaces RSA/ECDSA signatures
    Based on Module Learning With Errors lattice problem

  SLH-DSA (FIPS 205): Hash-based signatures - stateless, conservative choice
    Based on hash function security only - provably secure if SHA-256 is secure

Harvest Now, Decrypt Later (HNDL):
  Adversaries are collecting encrypted traffic today to decrypt once quantum computers exist
  State-level actors are almost certainly doing this for long-lived secrets
  Any data that must remain secret for 10+ years needs post-quantum protection NOW

Migration strategy:
  1. Inventory: what data and systems use public-key crypto?
  2. Prioritise: which are most sensitive and longest-lived?
  3. Hybrid mode: use both classical + PQ in parallel during transition
  4. Update: TLS, SSH, VPN, certificate authorities, code signing

Timeline: Cryptographically relevant quantum computers are estimated 5-15 years away.
NIST recommendation: begin migration planning now, complete transition by 2030.`,
    flag: 'FLAG{post_quantum_ready}'
  },

  {
    id: 'crypto-20',
    title: 'Phase 6 — Real-World Crypto Failures: Case Studies',
    objective: `The most damaging cryptographic failures in history were not caused by mathematical breaks — they were caused by implementation errors, misuse of primitives, or protocol design flaws. Heartbleed (CVE-2014-0160) was a buffer over-read in OpenSSL's heartbeat extension that exposed up to 64KB of server memory per request — leaking private keys, session tokens, and passwords from servers worldwide. What type of vulnerability caused Heartbleed — the server returning more data than it should?`,
    hint: 'Heartbleed read beyond the bounds of a buffer — a specific memory safety error class.',
    answers: ['buffer over-read', 'buffer overread', 'out of bounds read', 'bounds check failure', 'memory disclosure'],
    xp: 20,
    explanation: `Real-world crypto failures teach more than theory. These incidents shaped modern security practices.

Heartbleed (CVE-2014-0160, 2014):
  Vulnerability: OpenSSL heartbeat extension did not validate the payload length claim
  The client says "send back 64KB" but only sends 1 byte - server reads 64KB of heap memory
  Impact: Private keys, session cookies, passwords leaked from ~17% of all HTTPS servers
  Lesson: Never trust client-provided lengths. Validate ALL input including length fields.

DROWN (2016):
  Old SSLv2 handshakes shared the same RSA private key as modern TLS servers
  SSLv2 EXPORT_RSA uses 40-bit keys (deliberately weakened for export laws)
  Attacker: decrypt modern TLS session using SSLv2 as oracle with 40-bit brute force
  Impact: ~33% of HTTPS servers affected
  Lesson: Disable legacy protocol versions even if they appear unused.

Dual EC DRBG NSA Backdoor (revealed 2013):
  NIST standardised a random number generator based on elliptic curves
  Snowden documents confirmed: NSA inserted a backdoor via specific curve constants
  Anyone who knew the discrete log relationship could predict all "random" output
  RSA Security (the company) used it as default in their products
  Lesson: Trapdoor parameters are real. Use audited, well-understood curves (P-256, Curve25519).

Sony PS3 ECDSA Failure (2010):
  ECDSA requires a unique random nonce k for every signature
  Sony used k = constant (same value every time)
  Attackers solved for the private key using two signatures with the same k
  All PS3 firmware signatures cracked, enabling custom firmware
  Lesson: RNG failure is crypto failure. k must be truly random or deterministically derived (RFC 6979).

Nonce Reuse in AES-GCM (practical threat):
  AES-GCM is AEAD - authentication + encryption. But reusing the same (key, nonce) pair:
  Allows recovery of the authentication key
  Allows XOR of two plaintexts if same nonce used with same key
  Used in TLS 1.2 - mitigated by using random nonces or sequence number nonces
  TLS 1.3 mandates sequence-number-based nonces to prevent reuse`
  },
]

export default function CryptoLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

  const sections = [
    { num: '01-04', title: 'Hash Analysis & Cracking', color: accent },
    { num: '05-06', title: 'Encoding & Obfuscation', color: accent },
    { num: '07-09', title: 'Symmetric & Asymmetric Crypto', color: accent },
    { num: '10-11', title: 'TLS, Certs & PKI', color: accent },
    { num: '12-15', title: 'Blockchain Forensics & Steganography', color: accent },
  ]

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
              {i === 0 && <span style={{ fontSize: '7px', color: '#3a2a00', margin: '0 2px' }}>&#8212;</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a7a4a' }}>
          MOD-{moduleNum} &nbsp;&#183;&nbsp; {moduleName.toUpperCase()} &nbsp;&#183;&nbsp; {xpTotal} XP AVAILABLE
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
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a4a00', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 &#8212; GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Cryptography &amp; Crypto Forensics Lab</h1>
          </div>
        </div>

        <p style={{ color: '#8a7a5a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Hash cracking, encoding attacks, AES and RSA with OpenSSL, TLS certificate forensics, blockchain tracing, and steganography.
          Complete all {steps.length} steps to unlock Phase 2.
        </p>

        {/* Section index */}
        <div style={{ background: 'rgba(255,179,71,0.03)', border: '1px solid rgba(255,179,71,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#3a2a00', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS ({steps.length} STEPS &#183; {xpTotal} XP)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '6px' }}>
            {sections.map((s) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', background: 'rgba(255,179,71,0.04)', borderRadius: '4px', border: '1px solid rgba(255,179,71,0.08)' }}>
                <span style={{ fontSize: '7px', color: s.color, fontWeight: 700, minWidth: '32px' }}>{s.num}</span>
                <span style={{ fontSize: '7.5px', color: '#8a7a4a' }}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="crypto-lab"
          moduleId={moduleId}
          title="Cryptography &amp; Crypto Forensics Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(255,179,71,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(255,179,71,0.4)' : '#3a2a00'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a4a00', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#8a7a4a' : '#5a4a00', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 &#8212; FREE LAB ENVIRONMENT</div>
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
              Free-form terminal sandbox for Cryptography &amp; Crypto Forensics
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#6a5a30', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;&#183;&nbsp; Tab autocomplete &nbsp;&#183;&nbsp; Real command simulation &nbsp;&#183;&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['hashcat cracking', 'OpenSSL operations', 'GPG encryption', 'Blockchain tracing', 'Steganography', 'TLS inspection'].map(feat => (
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
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a2a00' }}>Complete all {steps.length} guided steps above to unlock the free lab environment</div>}
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
          {showKeywords ? '&#9660;' : '&#9658;'} QUICK REFERENCE &#8212; CRYPTO COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#080600', border: '1px solid #1a1000', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['hashid -m hashes.txt', 'Identify hash type + hashcat mode number'],
                ['hashcat -m 1000 -a 0 hash.txt rockyou.txt', 'Crack NTLM with dictionary'],
                ['hashcat -m 0 -a 0 -r best64.rule hash.txt wl.txt', 'Crack MD5 with rule mutations'],
                ['echo "..." | base64 -d', 'Base64 decode a string'],
                ['echo "text" | xxd', 'Hex dump a string'],
                ['python3 -c "print(hex(0x1A ^ 0x4D))"', 'XOR two bytes (key recovery)'],
                ['openssl enc -aes-256-cbc -pbkdf2 -in f -out f.enc', 'AES-256 encrypt a file'],
                ['openssl enc -d -aes-256-cbc -pbkdf2 -in f.enc', 'AES-256 decrypt a file'],
                ['openssl genrsa -out private.pem 4096', 'Generate RSA-4096 private key'],
                ['openssl rsa -in private.pem -pubout -out pub.pem', 'Extract RSA public key'],
                ['openssl dgst -sha256 -sign key.pem -out sig file', 'Sign a file with RSA'],
                ['openssl dgst -sha256 -verify pub.pem -signature sig file', 'Verify RSA signature'],
                ['openssl s_client -connect host:443', 'Inspect TLS certificate live'],
                ['openssl x509 -in cert.pem -text -noout', 'Parse a PEM certificate'],
                ['gpg --encrypt -r user@example.com file', 'GPG encrypt to recipient'],
                ['gpg --decrypt file.gpg', 'GPG decrypt a file'],
                ['steghide extract -sf image.jpg', 'Extract hidden data from image'],
                ['curl "https://crt.sh/?q=%.example.com&output=json"', 'CT log subdomain enum'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#060400', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.68rem', flexShrink: 0, whiteSpace: 'pre' }}>{cmd}</code>
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
