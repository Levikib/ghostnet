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
  modules: ['foundations', 'linux', 'scripting'],
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
      { title: 'Operate', blurb: 'Think like a real engagement, end to end, and report it like a professional.', modules: ['red-team', 'cloud-security', 'grc'] },
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
      { title: 'Defend', blurb: 'SIEM, detection engineering, incident response and deep forensics.', modules: ['blue-team', 'forensics'] },
      { title: 'Widen', blurb: 'Identity, cloud and the governance that frames the job.', modules: ['active-directory', 'cloud-security', 'grc'] },
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
      { title: 'Know your enemy', blurb: 'Understand detection and forensics so you can evade them, and attack the AI systems in scope.', modules: ['blue-team', 'forensics', 'malware', 'ai-security'] },
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
      { title: 'Defend it', blurb: 'Detection, response, compliance and the AI workloads running in cloud.', modules: ['blue-team', 'grc', 'ai-security'] },
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
      { title: 'Surveillance & devices', blurb: 'How phones, networks and humans are tracked, targeted and examined.', modules: ['mobile-security', 'wireless-attacks', 'social-engineering', 'forensics'] },
      { title: 'Anonymity', blurb: 'Tor, OPSEC and staying unseen while you work.', modules: ['tor', 'crypto'] },
    ],
  },
  {
    id: 'ai-security',
    title: 'AI Security Specialist',
    tagline: 'Attack and defend the models everyone is now deploying.',
    forWho: 'You want the newest, fastest-growing specialisation in security.',
    color: '#82aaff',
    outcome: 'Red-team an AI system end to end and architect one that resists it.',
    stages: [
      FOUNDATION,
      { title: 'Web & data', blurb: 'AI apps are web apps with a model inside.', modules: ['web-attacks', 'cloud-security'] },
      { title: 'AI security', blurb: 'Prompt injection, jailbreaks, agent abuse, model theft and the defences.', modules: ['ai-security'] },
      { title: 'Context', blurb: 'Social engineering, detection and the governance around AI.', modules: ['social-engineering', 'blue-team', 'grc'] },
    ],
  },
  {
    id: 'grc',
    title: 'GRC & Security Management',
    tagline: 'Run the security program, pass the audit, brief the board.',
    forWho: 'You want a risk, compliance, audit or security-leadership role, technical or not.',
    color: '#e0af68',
    outcome: 'Build a risk register, map controls to frameworks and lead an audit.',
    cert: 'Security+ → CISA / CRISC / CISSP',
    stages: [
      { title: 'Technical grounding', blurb: 'Enough ground to be credible with engineers.', modules: ['foundations', 'linux'] },
      { title: 'Threat literacy', blurb: 'Understand what you are governing against.', modules: ['social-engineering', 'web-attacks', 'cloud-security'] },
      { title: 'Govern', blurb: 'Risk, frameworks, audits, continuity and leadership.', modules: ['grc'] },
      { title: 'Defend & examine', blurb: 'The operational side you will oversee.', modules: ['blue-team', 'forensics'] },
    ],
  },
  {
    id: 'explorer',
    title: 'Full Spectrum',
    tagline: 'Everything, in a sensible order. Zero to operator.',
    forWho: 'You want the complete journey across all 20 modules.',
    color: '#00ff41',
    outcome: 'Broad, hands-on command of offence and defence across the whole field.',
    stages: [
      FOUNDATION,
      { title: 'Recon & anonymity', blurb: 'Where every operation starts.', modules: ['tor', 'osint', 'crypto'] },
      { title: 'Attack', blurb: 'Networks, web, systems and identity.', modules: ['network-attacks', 'web-attacks', 'offensive', 'active-directory'] },
      { title: 'Specialise', blurb: 'Malware, cloud, wireless, mobile and social.', modules: ['malware', 'cloud-security', 'wireless-attacks', 'mobile-security', 'social-engineering'] },
      { title: 'Operate & defend', blurb: 'Tie it together: red team, blue team and forensics.', modules: ['red-team', 'blue-team', 'forensics'] },
      { title: 'The frontier & the profession', blurb: 'AI security and the governance that makes you hireable.', modules: ['ai-security', 'grc'] },
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
