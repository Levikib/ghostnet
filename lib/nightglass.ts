// Operation NIGHTGLASS — the GHOSTNET capstone campaign.
// A fully FICTIONAL, simulated authorised-engagement storyline that threads the whole
// curriculum into one operation: recon → foothold → escalation → domain → analysis → report.
// Every target, host and name below is invented. Nothing here points at a real system.

export type Act = {
  id: string
  code: string            // ACT 01, ACT 02...
  title: string
  phase: string           // short HUD label
  modules: string[]       // module ids whose skills this act exercises
  brief: string           // the story + what the operator must do
  objective: string       // the concrete task
  flag: { question: string; answer: string; hint: string } // lowercased answer, loose match
}

export const OPERATION = {
  codename: 'NIGHTGLASS',
  classification: 'SIMULATION // AUTHORISED ENGAGEMENT',
  logline:
    'A shell company, Meridian Logistics, is the cover for a credential-theft crew selling access to hospitals and city utilities. ' +
    'You hold a signed rules-of-engagement for their lab-replica environment. Work the whole kill chain, prove impact, and hand back a report that gets it shut down.',
  rules: [
    'Everything in NIGHTGLASS is a simulation against invented infrastructure. The skills are real; the targets are not.',
    'In the real world, every step here requires written authorisation. No authorisation, no engagement — that is the whole ethic.',
    'The mission is not "break in". The mission is "prove it, then write it up so it gets fixed".',
  ],
} as const

export const ACTS: Act[] = [
  {
    id: 'ng-recon',
    code: 'ACT 01',
    title: 'Open the File',
    phase: 'RECON',
    modules: ['osint', 'foundations'],
    brief:
      'Before you touch anything, you build a picture. Meridian Logistics has a website, a handful of employees on professional networks, ' +
      'and a cloud footprint its intern forgot to lock down. Map the people, the domains, and the exposed services — attackers win on preparation, not luck.',
    objective: 'Profile the target from open sources: enumerate subdomains, employees, tech stack and any exposed assets of the simulated org.',
    flag: {
      question: 'Which free technique finds a target’s subdomains by reading public TLS certificate logs?',
      answer: 'certificate transparency',
      hint: 'Two words: a public, searchable log of every TLS certificate ever issued.',
    },
  },
  {
    id: 'ng-foothold',
    code: 'ACT 02',
    title: 'The Crack in the Wall',
    phase: 'FOOTHOLD',
    modules: ['web-attacks', 'network-attacks'],
    brief:
      'Recon flagged a forgotten staff portal. It takes a username and a password, and it talks to a database. ' +
      'You are not guessing passwords — you are asking the application a question it was never meant to answer, and reading the reply in the error.',
    objective: 'Gain an initial foothold through the exposed web app — identify and exploit the injection flaw that leaks the first set of credentials.',
    flag: {
      question: 'What injection class lets you manipulate a backend database query through unsanitised input?',
      answer: 'sql injection',
      hint: 'The database speaks a query language; the app forgot to separate code from data.',
    },
  },
  {
    id: 'ng-crack',
    code: 'ACT 03',
    title: 'What the Hashes Hide',
    phase: 'CREDENTIALS',
    modules: ['crypto', 'offensive'],
    brief:
      'The portal’s database handed you a table of password hashes. Hashes are not passwords — but weak hashing and reused human habits ' +
      'mean many of them will fall to a wordlist and a good rule set. One of them belongs to a sysadmin.',
    objective: 'Recover usable credentials from the dumped hashes using the right mode and wordlist strategy.',
    flag: {
      question: 'What do you call a fast, parallelised tool that cracks hashes against a wordlist on the GPU?',
      answer: 'hashcat',
      hint: 'The most popular GPU password-recovery tool — named for the thing it attacks.',
    },
  },
  {
    id: 'ng-pivot',
    code: 'ACT 04',
    title: 'Deeper In',
    phase: 'ESCALATION',
    modules: ['linux', 'offensive'],
    brief:
      'The sysadmin credential drops you onto a Linux jump box — but as a low-privilege user. Somewhere on this host is a misconfiguration: ' +
      'a world-writable script a root cron runs, a SUID binary that should not be, a sudo rule too generous. Find the one that lifts you to root.',
    objective: 'Escalate from a standard user to root on the compromised Linux host by abusing a local misconfiguration.',
    flag: {
      question: 'What permission bit, set on a binary, makes it run as its owner (often root) regardless of who launches it?',
      answer: 'suid',
      hint: 'Three letters. "Set User ID" on execution.',
    },
  },
  {
    id: 'ng-domain',
    code: 'ACT 05',
    title: 'Own the Domain',
    phase: 'ACTIVE DIRECTORY',
    modules: ['active-directory', 'red-team'],
    brief:
      'The jump box is domain-joined. Now you are in Meridian’s Active Directory — the real prize. You enumerate paths with a graph, ' +
      'find a service account with a weak password behind a Kerberos ticket, and walk from there toward Domain Admin.',
    objective: 'Move from a domain foothold to Domain Admin: enumerate with BloodHound, roast a service account, and escalate.',
    flag: {
      question: 'What AD attack requests a Kerberos service ticket for any SPN account, then cracks it offline?',
      answer: 'kerberoasting',
      hint: 'It "roasts" Kerberos service tickets offline. One word.',
    },
  },
  {
    id: 'ng-analysis',
    code: 'ACT 06',
    title: 'Follow the Evidence',
    phase: 'FORENSICS',
    modules: ['forensics', 'malware'],
    brief:
      'On a Domain Controller you recover the crew’s own tooling — a loader and a memory image from one of their staging boxes. ' +
      'Now you switch hats: analyse their malware safely, carve the artifacts, and reconstruct what they stole and how.',
    objective: 'Analyse the recovered sample and memory image in an isolated VM; identify the injection and the exfil path.',
    flag: {
      question: 'Which Volatility plugin flags RWX private memory regions that signal injected code?',
      answer: 'malfind',
      hint: 'It "finds" the malicious regions. One word, a Volatility plugin.',
    },
  },
  {
    id: 'ng-report',
    code: 'ACT 07',
    title: 'Make It Count',
    phase: 'REPORTING',
    modules: ['grc', 'blue-team'],
    brief:
      'An operation nobody can act on is a party trick. You write the report: the kill chain in plain language, the business impact, ' +
      'and prioritised, specific fixes — template hygiene, segmentation, logging, MFA. This is the deliverable that actually shuts NIGHTGLASS down.',
    objective: 'Produce a findings report: narrative kill chain, risk-ranked findings, and concrete remediation mapped to each step.',
    flag: {
      question: 'What control, added to logins, would have stopped the stolen sysadmin password from working alone?',
      answer: 'mfa',
      hint: 'Three letters, or "two-factor". Something you have on top of something you know.',
    },
  },
]

export const ACT_IDS = ACTS.map(a => a.id)

/** Loose flag check: lowercase, trim, ignore surrounding punctuation, allow the answer as a substring. */
export function checkFlag(act: Act, input: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
  const a = norm(act.flag.answer)
  const g = norm(input)
  return g === a || g.includes(a)
}
