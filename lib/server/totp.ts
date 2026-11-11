import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/** RFC 6238 TOTP (SHA-1, 6 digits, 30 s), compatible with Google Authenticator, Authy, 1Password. */
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function base32Encode(buf: Buffer): string {
  let bits = 0, value = 0, out = ''
  for (const byte of buf) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31]
  return out
}

export function base32Decode(s: string): Buffer {
  const clean = s.replace(/=+$/, '').replace(/\s+/g, '').toUpperCase()
  let bits = 0, value = 0
  const out: number[] = []
  for (const ch of clean) {
    const idx = B32.indexOf(ch)
    if (idx < 0) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return Buffer.from(out)
}

export function newTotpSecret(): string {
  return base32Encode(randomBytes(20))
}

function hotp(secret: Buffer, counter: number): string {
  const msg = Buffer.alloc(8)
  msg.writeBigUInt64BE(BigInt(counter))
  const h = createHmac('sha1', secret).update(msg).digest()
  const off = h[h.length - 1] & 0x0f
  const bin = ((h[off] & 0x7f) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3]
  return String(bin % 1_000_000).padStart(6, '0')
}

/** Accepts the current step and one either side (clock drift). Returns the matched step, or null. */
export function verifyTotp(secretB32: string, code: string, now = Date.now()): number | null {
  const c = code.replace(/\D/g, '')
  if (c.length !== 6) return null
  const key = base32Decode(secretB32)
  const step = Math.floor(now / 30000)
  for (const d of [0, -1, 1]) {
    const expect = hotp(key, step + d)
    if (timingSafeEqual(Buffer.from(expect), Buffer.from(c))) return step + d
  }
  return null
}

export function otpauthUri(secretB32: string, account: string, issuer = 'GHOSTNET'): string {
  const label = encodeURIComponent(issuer + ':' + account)
  return 'otpauth://totp/' + label + '?secret=' + secretB32 + '&issuer=' + encodeURIComponent(issuer) + '&algorithm=SHA1&digits=6&period=30'
}
