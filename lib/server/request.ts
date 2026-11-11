import type { NextRequest } from 'next/server'
import { sha256 } from './crypto'

export function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  return (xff ? xff.split(',')[0].trim() : req.headers.get('x-real-ip')) || '0.0.0.0'
}

export function clientLocation(req: NextRequest): string {
  const city = req.headers.get('x-vercel-ip-city')
  const country = req.headers.get('x-vercel-ip-country')
  const parts = [city ? decodeURIComponent(city) : null, country].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Unknown location'
}

export function userAgent(req: NextRequest): string {
  return (req.headers.get('user-agent') || 'unknown').slice(0, 300)
}

/** "Chrome on Windows" style label from the user agent. */
export function deviceLabel(ua: string): string {
  const browser =
    /Edg\//.test(ua) ? 'Edge' :
    /OPR\/|Opera/.test(ua) ? 'Opera' :
    /Firefox\//.test(ua) ? 'Firefox' :
    /Chrome\//.test(ua) ? 'Chrome' :
    /Safari\//.test(ua) ? 'Safari' : 'Browser'
  const os =
    /Android/.test(ua) ? 'Android' :
    /iPhone|iPad|iPod/.test(ua) ? 'iOS' :
    /Windows/.test(ua) ? 'Windows' :
    /Mac OS X|Macintosh/.test(ua) ? 'macOS' :
    /Linux/.test(ua) ? 'Linux' : 'Unknown OS'
  return browser + ' on ' + os
}

/**
 * Coarse device fingerprint for new-device alerts: browser family + OS +
 * country. Deliberately coarse so a browser update doesn't trigger an alert.
 */
export function deviceHash(req: NextRequest): string {
  const ua = userAgent(req)
  return sha256(deviceLabel(ua) + '|' + (req.headers.get('x-vercel-ip-country') || ''))
}
