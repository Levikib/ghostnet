import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomInt, scrypt, timingSafeEqual } from 'node:crypto'

/**
 * Passwords: scrypt (memory-hard) with a per-user 16-byte salt.
 * Stored as  scrypt$N$r$p$<salt b64>$<hash b64>  so parameters can be raised later
 * and old hashes still verify (and get rehashed on next login).
 */
const N = 32768, R = 8, P = 1, KEYLEN = 64
const MAXMEM = 64 * 1024 * 1024

function scryptAsync(pw: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(pw.normalize('NFKC'), salt, KEYLEN, { N: n, r, p, maxmem: MAXMEM }, (err, key) => (err ? reject(err) : resolve(key))),
  )
}

export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16)
  const key = await scryptAsync(pw, salt, N, R, P)
  return ['scrypt', N, R, P, salt.toString('base64'), key.toString('base64')].join('$')
}

export async function verifyPassword(pw: string, stored: string): Promise<{ ok: boolean; rehash: boolean }> {
  const parts = stored.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return { ok: false, rehash: false }
  const [, n, r, p, saltB64, hashB64] = parts
  const expected = Buffer.from(hashB64, 'base64')
  const key = await scryptAsync(pw, Buffer.from(saltB64, 'base64'), Number(n), Number(r), Number(p))
  const ok = key.length === expected.length && timingSafeEqual(key, expected)
  return { ok, rehash: ok && Number(n) < N }
}

/** A dummy hash so unknown-email logins cost the same time as real ones. */
let dummy: string | null = null
export async function burnPasswordTime(pw: string): Promise<void> {
  if (!dummy) dummy = await hashPassword('ghostnet-timing-equaliser')
  await verifyPassword(pw, dummy)
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url')
}

export function sha256(s: string): string {
  return createHash('sha256').update(s).digest('hex')
}

/** Keyed hash for short codes (OTP, backup codes) so a DB leak can't be brute-forced offline without the key. */
export function codeHash(code: string): string {
  return createHmac('sha256', authSecret()).update(code).digest('hex')
}

export function safeEqualHex(a: string, b: string): boolean {
  const x = Buffer.from(a, 'hex'), y = Buffer.from(b, 'hex')
  return x.length === y.length && timingSafeEqual(x, y)
}

export function sixDigitCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export function backupCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 10; i++) s += alphabet[randomInt(0, alphabet.length)]
  return s.slice(0, 5) + '-' + s.slice(5)
}

function authSecret(): Buffer {
  const s = process.env.AUTH_SECRET
  if (!s || s.length < 32) throw new Error('AUTH_SECRET is not set (min 32 chars)')
  return createHash('sha256').update(s).digest()
}

/** AES-256-GCM for secrets at rest (TOTP seeds). Output: iv.tag.ciphertext (base64url). */
export function encrypt(plain: string): string {
  const iv = randomBytes(12)
  const c = createCipheriv('aes-256-gcm', authSecret(), iv)
  const enc = Buffer.concat([c.update(plain, 'utf8'), c.final()])
  return [iv.toString('base64url'), c.getAuthTag().toString('base64url'), enc.toString('base64url')].join('.')
}

export function decrypt(blob: string): string {
  const [iv, tag, enc] = blob.split('.')
  const d = createDecipheriv('aes-256-gcm', authSecret(), Buffer.from(iv, 'base64url'))
  d.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([d.update(Buffer.from(enc, 'base64url')), d.final()]).toString('utf8')
}
