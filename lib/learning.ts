import { MODULES } from './seo'

/**
 * The course catalogue and progress maths, shared by the API and the UI so
 * the numbers a learner sees always match what the server stores.
 *
 * Module progress = 60% reading (chapters opened) + 40% the guided lab (steps completed).
 */

export const MODULE_COLORS: Record<string, string> = {
  foundations: '#7fdbff',
  linux: '#73c991',
  scripting: '#ffd166',
  'blue-team': '#4dd0e1',
  'ai-security': '#82aaff',
  grc: '#e0af68',
  forensics: '#5ccfe0',
  tor: '#00ff41',
  osint: '#00d4ff',
  crypto: '#ffb347',
  offensive: '#bf5fff',
  'active-directory': '#ff4136',
  'web-attacks': '#00d4ff',
  malware: '#00ff41',
  'network-attacks': '#00ffff',
  'cloud-security': '#ff9500',
  'social-engineering': '#ff6ec7',
  'red-team': '#ff3333',
  'wireless-attacks': '#aaff00',
  'mobile-security': '#7c4dff',
}

/** Canonical XP per lab. Server-side source of truth; client-submitted XP is ignored. */
export const LAB_XP: Record<string, number> = {
  'foundations-lab': 300,
  'linux-lab': 330,
  'scripting-lab': 360,
  'blue-team-lab': 450,
  'ai-security-lab': 400,
  'grc-lab': 300,
  'forensics-lab': 420,
  'tor-lab': 345,
  'osint-lab': 305,
  'crypto-lab': 405,
  'offensive-lab': 400,
  'active-directory-lab': 495,
  'web-attacks-lab': 445,
  'malware-lab': 465,
  'network-attacks-lab': 445,
  'cloud-security-lab': 490,
  'social-engineering-lab': 300,
  'red-team-lab': 465,
  'wireless-attacks-lab': 455,
  'mobile-security-lab': 435,
}

/** XP for reading: awarded once per chapter the first time it is opened. */
export const CHAPTER_XP = 5

// Steps in each guided lab (kept in step with each module's lab page).
export const LAB_STEPS: Record<string, number> = {
  'foundations-lab': 20, 'linux-lab': 22, 'scripting-lab': 18, 'blue-team-lab': 20,
  'ai-security-lab': 18, 'grc-lab': 16, 'forensics-lab': 20,
  'tor-lab': 17, 'osint-lab': 16, 'crypto-lab': 20, 'offensive-lab': 20, 'active-directory-lab': 22, 'web-attacks-lab': 21, 'malware-lab': 22,
  'network-attacks-lab': 21, 'cloud-security-lab': 18, 'social-engineering-lab': 16, 'red-team-lab': 18, 'wireless-attacks-lab': 18, 'mobile-security-lab': 18,
}

export type CatalogModule = {
  id: string
  code: string
  title: string
  color: string
  labId: string
  labXp: number
  chapters: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  blurb: string
}

// Real chapter counts in each module's codex (kept in step with app/modules/*/page.tsx).
const CHAPTER_COUNTS: Record<string, number> = {
  foundations: 10, linux: 12, scripting: 9, 'blue-team': 10, 'ai-security': 10, grc: 10, forensics: 10,
  tor: 8, osint: 10, crypto: 9, offensive: 8, 'active-directory': 8, 'web-attacks': 10, malware: 7,
  'network-attacks': 8, 'cloud-security': 8, 'social-engineering': 9, 'red-team': 9, 'wireless-attacks': 9, 'mobile-security': 9,
}

const META: Record<string, { level: CatalogModule['level']; blurb: string }> = {
  foundations: { level: 'BEGINNER', blurb: 'Computers, Linux, networking, the web and core security concepts: the ground floor for everything else.' },
  linux: { level: 'BEGINNER', blurb: 'Install, operate, secure and build a lab on Linux: VMs, WSL, dual-boot, the shell and systemd, in depth.' },
  scripting: { level: 'BEGINNER', blurb: 'Automate security work with Bash, Python and PowerShell, from zero to a real tool you can ship.' },
  'blue-team': { level: 'INTERMEDIATE', blurb: 'Defend: SOC work, SIEM, detection engineering, threat hunting, incident response and forensics.' },
  'ai-security': { level: 'ADVANCED', blurb: 'Attack and defend AI: prompt injection, jailbreaks, agent abuse, model theft and the defences.' },
  grc: { level: 'INTERMEDIATE', blurb: 'Governance, risk and compliance: frameworks, audits, risk maths and building a security program.' },
  forensics: { level: 'ADVANCED', blurb: 'Disk, memory, mobile and network forensics: acquire, analyse, build a timeline and report.' },
  tor: { level: 'BEGINNER', blurb: 'Onion routing, hidden services and the OPSEC that keeps you anonymous.' },
  osint: { level: 'BEGINNER', blurb: 'What the public internet reveals about people, companies and infrastructure.' },
  crypto: { level: 'INTERMEDIATE', blurb: 'How encryption, hashing, PKI and TLS work, and how they break.' },
  offensive: { level: 'ADVANCED', blurb: 'Exploit development: buffer overflows, mitigations, ROP, heap and fuzzing.' },
  'active-directory': { level: 'ADVANCED', blurb: 'How Windows domains fall: Kerberos, relays, DCSync and forged tickets.' },
  'web-attacks': { level: 'INTERMEDIATE', blurb: 'Injection, XSS, SSRF and broken auth, and the fixes behind each.' },
  malware: { level: 'INTERMEDIATE', blurb: 'Triage, static and dynamic analysis, persistence and YARA rules.' },
  'network-attacks': { level: 'INTERMEDIATE', blurb: 'Scanning, sniffing and man-in-the-middle, and how defenders spot them.' },
  'cloud-security': { level: 'INTERMEDIATE', blurb: 'IAM, exposed storage, metadata attacks and cloud logging.' },
  'social-engineering': { level: 'BEGINNER', blurb: 'Phishing, pretexting and vishing, and how people learn to resist them.' },
  'red-team': { level: 'ADVANCED', blurb: 'Planning and running adversary emulation: C2, OPSEC and reporting.' },
  'wireless-attacks': { level: 'INTERMEDIATE', blurb: 'WPA handshakes, evil twins, Bluetooth and radio attacks.' },
  'mobile-security': { level: 'INTERMEDIATE', blurb: 'Android and iOS app security: storage, APIs and OWASP MASVS.' },
}

export const CATALOG: CatalogModule[] = MODULES.map(m => ({
  id: m.slug,
  code: m.code,
  title: m.title,
  color: MODULE_COLORS[m.slug] || '#00ff41',
  labId: m.slug + '-lab',
  labXp: LAB_XP[m.slug + '-lab'] || 0,
  chapters: CHAPTER_COUNTS[m.slug] || m.topics.length,
  level: META[m.slug]?.level || 'INTERMEDIATE',
  blurb: META[m.slug]?.blurb || '',
}))

export const MODULE_IDS = new Set(CATALOG.map(m => m.id))
export const LAB_IDS = new Set(Object.keys(LAB_XP))

export function modulePercent(chaptersRead: number, chaptersTotal: number, stepsDone: number, stepsTotal: number, labCompleted: boolean): number {
  const reading = chaptersTotal > 0 ? Math.min(1, chaptersRead / chaptersTotal) : 0
  const lab = labCompleted ? 1 : stepsTotal > 0 ? Math.min(1, stepsDone / stepsTotal) : 0
  return Math.round((reading * 0.6 + lab * 0.4) * 100)
}

export type ModuleProgress = {
  id: string
  code: string
  title: string
  color: string
  percent: number
  chaptersRead: number
  chaptersTotal: number
  lastChapter: number
  labSteps: number
  labTotal: number
  labCompleted: boolean
  labXp: number
  xpEarned: number
  startedAt: string | null
  updatedAt: string | null
}
