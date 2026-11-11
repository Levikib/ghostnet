// Learning paths: an ordered route through the modules toward a goal.
// Slugs reference modules in lib/learning.ts CATALOG. Foundations (MOD-00) comes
// first on every path; the three "core skill" modules underpin the rest.
// The placement test (lib/assess) can mark early modules as "test out" once a
// learner proves the skill, so experienced people skip ahead.

export type PathStage = {
  title: string
  blurb: string
  modules: string[] // slugs, in order
}

export type LearningPath = {
  id: string
  title: string
  tagline: string
  forWho: string
  color: string
  outcome: string
  cert?: string // real-world certification this path aligns toward
  stages: PathStage[]
}

// Shared foundation every beginner starts from.
const FOUNDATION: PathStage = {
  title: 'Foundations',
  blurb: 'The ground floor: computers, Linux, networking, how the web works, and the rules of the game. Skip what the placement test says you already know.',
  modules: ['foundations', 'scripting'],
}

export const PATHS: LearningPath[] = [
  {
    id: 'pentester',
    title: 'Penetration Tester',
    tagline: 'Break into systems you are paid to break into.',
    forWho: 'You want to find and exploit vulnerabilities professionally, then write them up.',
    color: '#bf5fff',
    outcome: 'Run a full assessment: recon, exploit, escalate, pivot, and report.',
    cert: 'eJPT → OSCP',
    stages: [
      FOUNDATION,
      { title: 'Recon & web', blurb: 'Find the attack surface and break the apps on it.', modules: ['osint', 'network-attacks', 'web-attacks'] },
      { title: 'Exploitation', blurb: 'Turn a foothold into control.', modules: ['offensive', 'active-directory'] },
      { title: 'Operate', blurb: 'Think like a real engagement, end to end.', modules: ['red-team', 'cloud-security'] },
    ],
  },
  {
    id: 'soc-analyst',
    title: 'SOC Analyst / Blue Team',
    tagline: 'Catch the attackers the pentester just taught you about.',
    forWho: 'You want a defender job: triage alerts, hunt threats, respond to incidents.',
    color: '#4dd0e1',
    outcome: 'Read the logs, write the detection, run the incident.',
    cert: 'Security+ → CySA+',
    stages: [
      FOUNDATION,
      { title: 'Know the attacks', blurb: 'You can only detect what you understand.', modules: ['network-attacks', 'web-attacks', 'malware'] },
      { title: 'Defend', blurb: 'SIEM, detection engineering, incident response and forensics.', modules: ['blue-team'] },
      { title: 'Widen', blurb: 'Identity and cloud are where the alerts are.', modules: ['active-directory', 'cloud-security'] },
    ],
  },
  {
    id: 'red-team',
    title: 'Red Teamer',
    tagline: 'Emulate real adversaries against mature defenders.',
    forWho: 'You already pentest and want full-scope adversary emulation and evasion.',
    color: '#ff6b5e',
    outcome: 'Plan and run an adversary emulation that survives a real blue team.',
    cert: 'OSCP → CRTO',
    stages: [
      FOUNDATION,
      { title: 'Offensive core', blurb: 'The exploitation and identity skills a red team runs on.', modules: ['offensive', 'active-directory', 'web-attacks'] },
      { title: 'Tradecraft', blurb: 'C2, OPSEC, social engineering and operating quietly.', modules: ['social-engineering', 'red-team'] },
      { title: 'Know your enemy', blurb: 'Understand detection so you can evade it.', modules: ['blue-team', 'malware'] },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud Security Engineer',
    tagline: 'Secure the infrastructure everything now runs on.',
    forWho: 'You want to attack and defend AWS, Azure and GCP environments.',
    color: '#ff9500',
    outcome: 'Find the misconfig, chain the privilege escalation, and lock it down.',
    cert: 'Security+ → cloud security certs',
    stages: [
      FOUNDATION,
      { title: 'Context', blurb: 'The web, networks and identity that cloud attacks build on.', modules: ['network-attacks', 'web-attacks', 'active-directory'] },
      { title: 'Cloud', blurb: 'IAM, exposed storage, metadata attacks and cloud logging.', modules: ['cloud-security'] },
      { title: 'Defend it', blurb: 'Detection and response for cloud.', modules: ['blue-team'] },
    ],
  },
  {
    id: 'osint',
    title: 'OSINT Investigator',
    tagline: 'Find anything from public data, and know how surveillance really works.',
    forWho: 'You want investigation, recon and surveillance-technique depth.',
    color: '#00d4ff',
    outcome: 'Profile a target from open sources and understand modern tracking end to end.',
    stages: [
      FOUNDATION,
      { title: 'Investigate', blurb: 'Passive recon, people search, geolocation and link analysis.', modules: ['osint'] },
      { title: 'Surveillance & devices', blurb: 'How phones, networks and humans are tracked and targeted.', modules: ['mobile-security', 'wireless-attacks', 'social-engineering'] },
      { title: 'Anonymity', blurb: 'Tor, OPSEC and staying unseen while you work.', modules: ['tor', 'crypto'] },
    ],
  },
  {
    id: 'explorer',
    title: 'Full Spectrum',
    tagline: 'Everything, in a sensible order. Zero to operator.',
    forWho: 'You want the complete journey across all 16 modules.',
    color: '#00ff41',
    outcome: 'Broad, hands-on command of offence and defence across the whole field.',
    stages: [
      FOUNDATION,
      { title: 'Recon & anonymity', blurb: 'Where every operation starts.', modules: ['tor', 'osint', 'crypto'] },
      { title: 'Attack', blurb: 'Networks, web, systems and identity.', modules: ['network-attacks', 'web-attacks', 'offensive', 'active-directory'] },
      { title: 'Specialise', blurb: 'Malware, cloud, wireless, mobile and social.', modules: ['malware', 'cloud-security', 'wireless-attacks', 'mobile-security', 'social-engineering'] },
      { title: 'Operate & defend', blurb: 'Tie it together: red team and blue team.', modules: ['red-team', 'blue-team'] },
    ],
  },
]

export function pathById(id: string): LearningPath | undefined {
  return PATHS.find(p => p.id === id)
}

/** Flat ordered list of module slugs for a path (de-duplicated, first occurrence wins). */
export function pathModules(p: LearningPath): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const stage of p.stages) for (const m of stage.modules) if (!seen.has(m)) { seen.add(m); out.push(m) }
  return out
}
