'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '@/app/components/ModuleCodex'
import { Local, Watch } from '@/app/components/learn/Mtaani'

const mono = 'JetBrains Mono, monospace'
const accent = '#e0af68'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && (
      <div style={{ fontFamily: mono, fontSize: '9px', color: '#8a7a4a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>
        {label}
      </div>
    )}
    <pre style={{
      background: '#0a0803', border: '1px solid #2e261a', borderRadius: '4px',
      padding: '1.25rem', overflow: 'auto', color: accent,
      fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre'
    }}>
      {children}
    </pre>
  </div>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{
    fontFamily: mono, fontSize: '0.85rem', fontWeight: 600,
    color: '#c79a4a', marginTop: '2rem', marginBottom: '0.75rem'
  }}>
    &#9658; {children}
  </h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#9a8a6a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
    {children}
  </p>
)

const Note = ({ type, children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: ['#e0af68', 'rgba(224,175,104,0.05)', 'NOTE'],
    warn: ['#ffb347', 'rgba(255,179,71,0.05)', 'WARNING'],
    danger: ['#ff4136', 'rgba(255,65,54,0.05)', 'CRITICAL'],
    tip: ['#00d4ff', 'rgba(0,212,255,0.05)', 'TIP'],
  }
  const [color, bg, label] = configs[type || 'info']
  return (
    <div style={{
      background: bg, borderLeft: '3px solid ' + color,
      padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0',
      margin: '1.5rem 0', border: '1px solid ' + color + '33', borderLeftColor: color
    }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#9a8a6a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #2e261a' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#c79a4a', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #1a160e', background: i % 2 === 0 ? 'transparent' : 'rgba(224,175,104,0.015)' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '8px 12px', color: '#9a8a6a', verticalAlign: 'top' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'what-grc-is',
    title: 'What GRC Is and Why It Pays',
    difficulty: 'BEGINNER',
    readTime: '14 min',
    labLink: '/modules/grc/lab',
    takeaways: [
      'GRC is three joined disciplines: governance sets direction, risk management decides what to worry about, and compliance proves you meet external rules.',
      'Technical skill breaks in; GRC skill decides what to build, funds it, and keeps the business out of court - that is why GRC roles are paid and in demand.',
      'The CISO translates between the server room and the boardroom; everyone in security eventually has to speak the language of risk and money.',
      'Security exists to let the business take risk safely, not to say no - a security team that only blocks gets routed around.',
      'GRC careers (analyst, auditor, risk manager) are open to people who are organised and clear communicators, not only to deep technical experts.',
      'The same hacker skills you already have make you a far better GRC professional because you know what the controls are actually defending against.',
    ],
    content: (
      <div>
        <Local>
          Think of a <em>chama</em> &mdash; a savings group of neighbours. It survives because of three things working together. There is the written constitution and the elected officials who steer it (that is <strong>governance</strong>). There is the group deciding how much cash is safe to keep, who might run off with it, and what happens if someone defaults (that is <strong>risk</strong>). And there is the yearly check by an outside member confirming the books match the M-Pesa statement and the group followed its own by-laws (that is <strong>compliance</strong>). GRC is simply running an organisation the way a well-led chama runs itself: steer it, watch what could go wrong, and prove you kept your own rules.
        </Local>
        <H3>Three Words, One Job</H3>
        <P>
          GRC stands for Governance, Risk and Compliance. It is the part of security that decides what to protect, how much to spend protecting it, and how to prove to outsiders that you did. A penetration tester finds a hole in a web application. A GRC professional answers a different set of questions: Is this the hole we should care about most? Who owns the decision to fix it? What will a regulator or a customer&apos;s auditor say if we do not? How do we show, on paper, that we manage this kind of problem across the whole company and not just this one app?
        </P>
        <P>
          The three words describe three distinct activities that only work together. Governance is the system of direction and accountability: who decides, who is responsible, what the rules of the house are, and how leadership knows things are working. Risk management is the discipline of finding, measuring and treating the things that could hurt the organisation, and deciding - consciously - which risks to reduce, move, avoid or simply live with. Compliance is meeting obligations that come from outside: laws, regulations, contracts and standards that you did not write but must obey. A mature security program needs all three. Governance without risk management is a rulebook nobody can justify. Risk management without governance is a spreadsheet nobody acts on. Compliance without either is theatre - documents produced for an auditor and ignored the rest of the year.
        </P>
        <Table
          headers={['Discipline', 'Core question', 'Typical output']}
          rows={[
            ['Governance', 'Who decides and who is accountable?', 'Policies, roles, a security steering committee, board reports'],
            ['Risk', 'What could hurt us and what do we do about it?', 'A risk register, risk assessments, treatment plans'],
            ['Compliance', 'What are we legally and contractually required to do?', 'Control mappings, audit evidence, attestations, certifications'],
          ]}
        />

        <H3>Why GRC Pays More Than It Looks Like It Should</H3>
        <P>
          Newcomers often assume the money is in offence - exploit development, red teaming, bug bounties. Those are valuable, but look at who gets hired in a downturn and who sits in the meetings where budgets are set. Organisations spend on security for three reasons: fear of loss, pressure from customers, and pressure from regulators. All three are GRC conversations. A bank in Nairobi, a hospital in Johannesburg, or a SaaS startup selling to US enterprises does not buy a firewall because firewalls are interesting. It buys security because a breach would be expensive, because its biggest customer demands a SOC 2 report before signing, and because the Kenya Data Protection Act or Europe&apos;s GDPR carries real penalties. The person who can turn those pressures into a funded, defensible plan is rare, and rarity is what the market pays for.
        </P>
        <Note type="tip">
          A useful mental model: engineers are paid to build things that work; GRC professionals are paid to make sure the organisation can keep operating, keep selling, and stay out of court. Both matter. In most companies there are ten people who can configure a server for every one who can write a risk assessment a board will sign.
        </Note>

        <H3>The CISO&apos;s World</H3>
        <P>
          The Chief Information Security Officer (CISO) is the executive who owns security. The job is mostly translation. Downward, the CISO turns business goals and risk appetite into technical priorities for engineers. Upward, the CISO turns a messy reality of vulnerabilities, incidents and near-misses into a handful of sentences a board of directors can act on. The board does not want a list of unpatched servers; it wants to know whether the company is more or less exposed than last quarter, whether spending is proportionate to the threat, and whether a headline-making incident is likely. If you want to understand what GRC is for, imagine you have forty minutes with a board once a quarter and you must leave them informed but not panicked, and willing to fund what you need.
        </P>
        <Pre label="HOW A TECHNICAL FINDING BECOMES A BUSINESS DECISION">
{`Engineer:   "The customer database server is missing three
             critical patches and has no multi-factor auth."

Analyst:    Logs a risk. Asset = customer PII database.
            Likelihood = High (internet-exposed, known exploits).
            Impact = High (regulated personal data, 2M records).

Risk mgr:   Scores it Critical. Recommends treatment:
            patch now, add MFA, segment the network.
            Estimated loss if ignored (ALE) = KES 2,000,000/yr.
            Cost to fix = KES 250,000 one-off.

CISO:       Tells the board: "One of our top five risks.
            Cheap to fix, expensive to ignore, and it is in
            scope for our SOC 2 audit. I am funding it."

Board:      Approves. The patch was never the hard part -
            getting it prioritised and paid for was.`}
        </Pre>

        <H3>Security Exists to Enable the Business</H3>
        <P>
          The single most important idea in this whole module is that security is not the opposite of business - it is a condition for doing business safely. A security team whose only word is &quot;no&quot; gets bypassed. People will email spreadsheets of customer data to their personal accounts, spin up unsanctioned cloud servers, and sign contracts with risky vendors, precisely because the official path was too slow or too hostile. The GRC mindset is different: understand what the business is trying to do, find the risk in it, and offer a way to do it with that risk controlled. A good GRC professional is the person who helps the sales team close the enterprise deal by producing the security documentation the customer needs, not the person who slows the deal down.
        </P>

        <H3>The Careers</H3>
        <P>
          GRC is one of the most accessible well-paid areas of cybersecurity because it rewards organisation, clear writing and judgement as much as deep technical skill. The common roles form a ladder.
        </P>
        <Table
          headers={['Role', 'What they do', 'Good first role for']}
          rows={[
            ['GRC / Security Analyst', 'Maintain the risk register, map controls to frameworks, gather audit evidence, run awareness training', 'Entry level - organised, detail-oriented people'],
            ['IT / IS Auditor', 'Independently test whether controls work, write findings, assess against SOC 2 / ISO / PCI', 'People who like structured testing and evidence'],
            ['Risk Manager / Analyst', 'Run risk assessments, quantify exposure, advise on treatment and insurance', 'People who like decisions and numbers'],
            ['Compliance Manager', 'Own obligations to regulators and customers, manage audits and certifications', 'People who like regulation and process'],
            ['Security / GRC Lead, vCISO, CISO', 'Set strategy, own the program, report to leadership and the board', 'Experienced generalists who can communicate'],
          ]}
        />
        <P>
          Here is the advantage you have as someone with hands-on hacking skills. Most GRC people have never exploited a misconfiguration or watched a password spray succeed. You have. When you write that multi-factor authentication is a required control, you know viscerally what happens without it. When an auditor ticks a box for &quot;encryption at rest&quot;, you can tell whether the implementation is real or cosmetic. The strongest GRC professionals are technically literate, and the strongest technical people understand why the paperwork exists. This module turns your offence knowledge into the judgement that makes you hireable for the roles that set direction and sign the budgets.
        </P>
        <Note type="info">
          Throughout this module we use a running example: SafiPay, a fictional Nairobi fintech that moves money for other businesses and is preparing for its first SOC 2 and ISO 27001 audits. It is the kind of company where GRC is not optional - its customers and its regulator both demand proof.
        </Note>
      </div>
    ),
  },

  {
    id: 'security-governance',
    title: 'Security Governance',
    difficulty: 'BEGINNER',
    readTime: '14 min',
    labLink: '/modules/grc/lab',
    takeaways: [
      'Governance documents form a hierarchy: policy (mandatory, high-level), standard (mandatory, specific), procedure (step-by-step), guideline (recommended).',
      'A RACI chart removes the most common failure in security: a control that everyone assumed someone else owned.',
      'Security awareness is a control, not a formality - people are the most-attacked layer and training measurably reduces phishing click rates.',
      'Boards need a few trend-based metrics tied to risk and money, not raw technical counts they cannot interpret.',
      'Good metrics are decision-useful: they change what someone does. A number nobody acts on is noise, however precise.',
      'A security steering committee gives security a seat where business decisions are made, so risk is considered before, not after.',
    ],
    content: (
      <div>
        <Local>
          A chama&apos;s rules come in layers, and security governance is identical. The <strong>constitution</strong> says &quot;members&apos; money must be kept safe&quot; &mdash; it almost never changes and the whole group must vote to amend it (that is a <strong>policy</strong>). Below it, a by-law says &quot;we bank at this specific SACCO, two signatories per withdrawal&quot; &mdash; that can change as circumstances do (a <strong>standard</strong>). At the bottom, the WhatsApp reminder of exactly how to fill the deposit slip is the step-by-step (<strong>procedure</strong>). Mixing the layers is the classic mistake: if you write the bank&apos;s name into the constitution, you must hold a full meeting every time you switch banks.
        </Local>
        <H3>The Document Hierarchy</H3>
        <P>
          Governance is written down, and the writing has a strict hierarchy that newcomers constantly mix up. Getting it right is one of the fastest ways to look competent. At the top sits policy: a short, mandatory, high-level statement of intent approved by leadership. A policy says what must be true and why, but not how. Below it sit standards: mandatory, specific rules that make a policy measurable - exact algorithms, minimum key lengths, required configurations. Below those sit procedures: step-by-step instructions for carrying something out. Alongside them sit guidelines: recommended, non-mandatory good practice that helps people comply when there is no single right way.
        </P>
        <Table
          headers={['Type', 'Mandatory?', 'Specificity', 'Example']}
          rows={[
            ['Policy', 'Yes', 'High-level intent', '"All access to company systems must be authenticated and authorised."'],
            ['Standard', 'Yes', 'Precise and measurable', '"Passwords: minimum 14 characters; MFA required for all remote access."'],
            ['Procedure', 'Yes (as a method)', 'Step-by-step', '"To offboard a leaver: 1) disable account, 2) revoke tokens, 3) collect devices..."'],
            ['Guideline', 'No (recommended)', 'Advisory', '"Prefer a passphrase of four random words where length allows."'],
          ]}
        />
        <Watch
          reads={<>A real access-control policy, trimmed to its bones. Don&apos;t memorise it &mdash; just notice the shape: a header saying who owns and approved it, then purpose, scope, a few plain rules, and enforcement. It reads like a chama constitution: short, firm, and pointing to other documents for the fiddly detail.</>}
          later={<>You&apos;ll draft your own one-page policy in the lab and get it &quot;board approved&quot;.</>}
        >
        <Pre label="ACCESS CONTROL POLICY - EXCERPT (SafiPay)">
{`SafiPay Access Control Policy  v2.1   Owner: CISO   Approved: Board

1. Purpose
   Protect SafiPay systems and customer data by ensuring access
   is granted on a least-privilege, need-to-know basis.

2. Scope
   All employees, contractors, systems and third parties with
   access to SafiPay information assets.

3. Policy statements
   3.1 Access is granted based on documented business need.
   3.2 Multi-factor authentication is required for all remote
       and administrative access.
   3.3 Access rights are reviewed at least quarterly.
   3.4 Access is revoked within 24 hours of a role change or exit.

4. Enforcement
   Violations may result in disciplinary action up to termination.

(Detailed key lengths, MFA methods and review steps live in the
 Access Control Standard and the Joiner-Mover-Leaver Procedure.)`}
        </Pre>
        </Watch>
        <Note type="tip">
          A policy should outlive the technology. Notice the SafiPay policy says &quot;multi-factor authentication is required&quot; but never names a product. The product belongs in the standard, which changes often; the policy, approved by the board, should not need re-approval every time you swap tools.
        </Note>

        <H3>Policy Lifecycle and Exceptions</H3>
        <P>
          Documents that are written once and never revisited quietly become fiction, so governance treats every policy as having a lifecycle: it is drafted by an owner, reviewed by the people it affects, approved by the appropriate authority (the board for top-level policies, the CISO for standards), published where staff can actually find it, reviewed on a fixed cadence - at least annually - and retired when it no longer applies. Each document should carry a version number, an owner, an approval date and a next-review date, because an auditor will ask when a policy was last reviewed and &quot;we are not sure&quot; is itself a finding. A policy nobody has looked at in three years is evidence of a governance process that has stopped breathing.
        </P>
        <P>
          Equally important is a formal exceptions process. There will always be a legitimate business reason why some system cannot immediately meet a standard - a legacy application that cannot support MFA, a vendor tool that stores data in an unexpected region. Without a defined way to request, assess, time-box and approve an exception, people simply ignore the policy quietly, and you lose all visibility of where your real gaps are. A good exception is written down, risk-assessed, approved by an accountable owner, given an expiry date, and recorded in the risk register. That turns a silent violation into a managed, visible, temporary risk - which is the whole point of governance.
        </P>

        <H3>Program Structure and RACI</H3>
        <P>
          A security program is the organised set of people, processes and technology that delivers security. Its structure answers a deceptively hard question: who is responsible for each thing? The most common cause of a failed control is not technical - it is that everyone assumed someone else owned it. The tool for fixing this is the RACI chart, which labels, for each activity, who is Responsible (does the work), Accountable (owns the outcome, exactly one person), Consulted (gives input) and Informed (kept in the loop).
        </P>
        <Table
          headers={['Activity', 'Responsible', 'Accountable', 'Consulted', 'Informed']}
          rows={[
            ['Quarterly access review', 'IT admin', 'CISO', 'System owners', 'Internal audit'],
            ['Patch critical servers', 'Platform engineer', 'Head of Engineering', 'Security analyst', 'CISO'],
            ['Approve a new vendor', 'Procurement', 'CISO', 'Legal, Security', 'Finance'],
            ['Report a breach to the regulator', 'Compliance manager', 'CISO / DPO', 'Legal', 'Executive team'],
          ]}
        />
        <P>
          The rule that saves the most grief is that exactly one role is Accountable for each activity. Two accountable owners means zero accountable owners. When you join a team and a control keeps slipping, the first thing to check is whether its RACI is clear - usually it is not.
        </P>

        <H3>Security Awareness as a Control</H3>
        <P>
          Humans are the most frequently attacked layer in any organisation, and awareness training is a real control with a measurable effect, not a compliance checkbox. A program worth running has recurring short training, simulated phishing campaigns, role-specific content (developers learn secure coding, finance learns invoice fraud), and clear reporting channels so a worried employee knows exactly how to raise an alarm. The metric that matters is behavioural: the phishing simulation click rate and, just as important, the report rate. A workforce that clicks less and reports more is measurably harder to breach. Treat awareness like any other control - set a baseline, intervene, and measure whether the number moved.
        </P>

        <H3>Board Reporting and Metrics</H3>
        <P>
          Reporting to leadership is where many technical people stumble, because they present what is easy to count rather than what is useful to decide. A board does not want 4,312 vulnerabilities; it wants to know whether the trend is improving, whether the most dangerous ones are being closed fast enough, and whether the money is working. The discipline is to choose a small number of metrics that are tied to risk and to money, shown as trends over time, each of which could change a decision. Raw counts without context mislead: &quot;we found 4,312 vulnerabilities&quot; could mean your scanning improved, not that you got less safe, and a board that cannot interpret the number will either panic or tune out. Both outcomes lose you credibility.
        </P>
        <Table
          headers={['Weak metric (raw count)', 'Strong metric (decision-useful)']}
          rows={[
            ['Number of vulnerabilities found', 'Mean time to remediate critical vulnerabilities (trend)'],
            ['Number of phishing emails blocked', 'Phishing simulation click rate and report rate (trend)'],
            ['Number of alerts generated', 'Percentage of incidents detected internally vs by outsiders'],
            ['Number of training courses sent', 'Percentage of staff completing training on time (by department)'],
            ['Firewall is deployed (yes/no)', 'Percentage of top risks with an agreed, funded treatment plan'],
          ]}
        />
        <Note type="info">
          A metric is only worth reporting if you can finish this sentence: &quot;If this number gets worse, we will ______.&quot; If you cannot, it is probably noise. KPIs (key performance indicators) tell you whether a process is working; KRIs (key risk indicators) warn you that a risk is rising. Boards care most about the handful of KRIs that precede real loss.
        </Note>

        <H3>The Steering Committee</H3>
        <P>
          Governance needs a forum. A security steering committee brings together the CISO, senior business leaders, IT, legal and often finance on a regular cadence to set priorities, approve policies, review the top risks and unblock funding. Its real value is cultural: it puts security in the room where business decisions are made, so that risk is weighed before a product launches or a vendor is signed, rather than discovered afterward in an incident. When security has no such seat, it is forever reacting. When it has one, it shapes decisions early, which is cheaper and calmer for everyone.
        </P>
      </div>
    ),
  },

  {
    id: 'risk-fundamentals',
    title: 'Risk Management Fundamentals',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    labLink: '/modules/grc/lab',
    takeaways: [
      'Risk is the combination of likelihood and impact on a valued asset; no asset value means no risk to reason about.',
      'A threat needs a vulnerability to cause harm - risk lives at the intersection of the two with an asset behind it.',
      'Inherent risk is before controls; residual risk is what remains after - you manage residual risk down to your risk appetite.',
      'The four treatments are reduce (mitigate), transfer, avoid and accept - and formally accepting a risk is a legitimate, documented choice.',
      'Qualitative scoring (High/Medium/Low) is fast and communicates well; quantitative scoring (ALE) puts money on risk for hard trade-offs.',
      'ALE = SLE x ARO, where SLE = Asset Value x Exposure Factor - memorise this; it is the one calculation every GRC interview expects.',
    ],
    content: (
      <div>
        <Local>
          A <em>mama mboga</em> deciding how much stock to buy before a long rainy weekend is doing risk management without the jargon. She weighs how <em>likely</em> the rain is to keep customers away against how much it would <em>hurt</em> if a crate of tomatoes rots unsold. Likelihood times impact. If spoilage is unlikely, she stocks up; if the matatus have stopped and the sun is gone, she buys little. And notice: she only worries about the tomatoes because they have <em>value</em>. Nobody frets about a risk to something worthless. Every risk score you&apos;ll ever compute is just her instinct, written down.
        </Local>
        <H3>What Risk Actually Is</H3>
        <P>
          In security, risk is the potential for loss or harm when a threat exploits a vulnerability affecting an asset you value. Strip away the jargon and it is the product of two things: how likely something bad is (likelihood) and how much it would hurt (impact). Everything in risk management is an attempt to estimate, compare and reduce those two numbers across many possible events. Crucially, risk is always about an asset - something with value. If nothing of value is exposed, there is no risk worth your time, no matter how alarming the vulnerability sounds.
        </P>
        <P>
          This gives the foundational relationship: a threat is a potential cause of harm (a criminal group, a careless employee, a flood). A vulnerability is a weakness that the threat can use (an unpatched server, no backups, a single staff member with all the knowledge). Harm only happens when a threat meets a matching vulnerability on a valued asset. A sophisticated threat against a vulnerability you do not have is not your risk. A gaping vulnerability on an asset nobody would ever target is low risk. Risk lives at the intersection.
        </P>
        <Watch
          reads={<>The whole of risk, boiled to one line and then unpacked. Read it as the mama mboga&apos;s instinct: likelihood (how probable) multiplied by impact (how badly it hurts). The worked lines at the bottom show why a scary-sounding threat with no matching weakness is still low risk.</>}
          later={<>In the lab you&apos;ll score real scenarios with this and rank what to fix first.</>}
        >
        <Pre label="THE RISK EQUATION">
{`Risk = Likelihood  x  Impact

   Likelihood is driven by:  Threat  x  Vulnerability
   Impact is driven by:      Asset value  x  Exposure

Worked intuition:
   High threat + no vulnerability      -> low risk
   Low threat  + severe vulnerability  -> moderate risk
   High threat + severe vulnerability
     on a high-value asset             -> this is what you fix first`}
        </Pre>
        </Watch>

        <H3>Asset Valuation</H3>
        <P>
          You cannot manage risk to assets you have not valued, so risk management begins with an inventory and a sense of what each asset is worth. Value is not only the replacement cost of hardware. It includes the sensitivity of the data, the revenue that depends on the asset, the legal consequences if it is exposed, and the reputational damage if it fails. For SafiPay, the customer transaction database is worth far more than the laptop it might leak from, because losing it means regulatory penalties, lost customers and front-page embarrassment. Valuation can be qualitative (critical / high / medium / low) or expressed in money; even a rough figure sharpens every decision that follows.
        </P>

        <H3>Inherent vs Residual Risk and Risk Appetite</H3>
        <P>
          Two words separate people who understand risk from people who recite it: inherent and residual. Inherent risk is the risk before you apply any controls - the raw exposure of the activity itself. Residual risk is what remains after your controls are in place. You can never drive residual risk to zero; controls reduce it, they do not abolish it. The job is to bring residual risk down to a level leadership has agreed to tolerate - the organisation&apos;s risk appetite. Risk appetite is a governance decision, set at the top: how much risk, in which areas, the organisation is willing to accept in pursuit of its goals. A fintech may have almost no appetite for fraud or data-breach risk but a healthy appetite for the risk of trying a new market.
        </P>
        <Pre label="INHERENT -> CONTROLS -> RESIDUAL">
{`Activity: store 2,000,000 customer records online

  Inherent risk   (no controls)         = CRITICAL
      + encryption at rest and in transit
      + multi-factor authentication
      + network segmentation
      + monitoring and backups
  Residual risk   (controls applied)    = MEDIUM

Risk appetite for customer data = LOW
  -> Residual (MEDIUM) is still above appetite (LOW)
  -> Treat further, or formally accept the gap with sign-off`}
        </Pre>
        <Note type="info">
          When residual risk sits above appetite, you have exactly two honest options: add more treatment until it drops, or have an accountable executive formally accept the gap in writing. What you must never do is leave it silently unaddressed. The written risk acceptance is what protects both the organisation and you.
        </Note>

        <H3>The Four Treatments</H3>
        <P>
          Once a risk is assessed, you choose how to treat it. There are exactly four options, and knowing them cold is expected of any GRC professional. Reduce (also called mitigate) means applying controls to lower likelihood or impact - patching, MFA, training. Transfer means shifting the financial consequence to someone else, most commonly through insurance or by contract. Avoid means stopping the activity that creates the risk entirely - not entering a market, not storing a data type. Accept means consciously deciding the risk is within appetite and doing nothing further, documented and signed off.
        </P>
        <Table
          headers={['Treatment', 'What it does', 'SafiPay example']}
          rows={[
            ['Reduce / Mitigate', 'Add controls to lower likelihood or impact', 'Add MFA and patching to the payments server'],
            ['Transfer', 'Move the financial impact to a third party', 'Buy cyber-insurance against breach costs'],
            ['Avoid', 'Stop doing the risky activity', 'Decide not to store full card numbers at all'],
            ['Accept', 'Live with the risk, documented and signed off', 'Accept the minor risk of a legacy internal reporting tool'],
          ]}
        />
        <P>
          Most real risks get a blend: you reduce what you can, transfer some of the residual with insurance, and formally accept whatever is left within appetite. Avoidance is powerful but costly because it usually means giving up something the business wanted to do, so it is reserved for risks that cannot be brought within tolerance any other way.
        </P>

        <H3>Qualitative vs Quantitative</H3>
        <P>
          There are two ways to measure risk and you will use both. Qualitative assessment rates likelihood and impact on ordinal scales - typically a High/Medium/Low or a 1-to-5 matrix - and multiplies them into a severity. It is fast, needs little data, and communicates beautifully to non-technical leaders, which is why it dominates day-to-day work and risk registers. Its weakness is that &quot;High&quot; is not a number you can put in a budget. Quantitative assessment expresses risk in money, which makes trade-offs rigorous - you can compare the cost of a control against the loss it prevents - but it needs data you often do not have and can project false precision.
        </P>
        <Pre label="5x5 QUALITATIVE RISK MATRIX (score = likelihood x impact)">
{`Impact ->     1-Negli  2-Minor  3-Mod   4-Major  5-Severe
Likelihood
5-Almost cert    5        10      15      20       25
4-Likely         4         8      12      16       20
3-Possible       3         6       9      12       15
2-Unlikely       2         4       6       8       10
1-Rare           1         2       3       4        5

Severity bands:  1-4 Low   5-9 Medium   10-14 High   15-25 Critical
Example: Likelihood 4 (Likely) x Impact 5 (Severe) = 20 -> CRITICAL`}
        </Pre>

        <H3>The Numbers: SLE, ARO and ALE</H3>
        <P>
          The quantitative calculation every interviewer tests is the Annualised Loss Expectancy. It is built from three terms. Single Loss Expectancy (SLE) is the money lost from one occurrence of the event. It is Asset Value (AV) multiplied by the Exposure Factor (EF), the fraction of the asset&apos;s value destroyed by one event. Annualised Rate of Occurrence (ARO) is how many times per year you expect the event - 1 means once a year, 0.5 means once every two years, 2 means twice a year. Annualised Loss Expectancy (ALE) is simply SLE multiplied by ARO: the expected yearly cost of this risk. You compare ALE against the annual cost of a control to decide whether the control is worth buying.
        </P>
        <Pre label="ALE WORKED EXAMPLE (SafiPay customer database)">
{`Asset Value (AV)        = KES 10,000,000
Exposure Factor (EF)    = 0.40   (a breach destroys 40% of value)

SLE = AV x EF
    = 10,000,000 x 0.40
    = KES 4,000,000     (loss from ONE breach)

ARO = 0.50              (one breach expected every two years)

ALE = SLE x ARO
    = 4,000,000 x 0.50
    = KES 2,000,000      (expected loss PER YEAR)

Decision:
  A control costing KES 250,000/yr that cuts ARO to near zero
  is clearly worth it: it defends against KES 2,000,000/yr of
  expected loss. If a control cost KES 3,000,000/yr, it would
  cost more than the risk - transfer or partially accept instead.`}
        </Pre>
        <Note type="warn">
          Quantitative numbers are only as good as their inputs, and EF and ARO are often educated guesses. Use ALE to compare options and to justify spending, not to pretend you can predict the future to the shilling. The discipline of the calculation is more valuable than any single output.
        </Note>
      </div>
    ),
  },

  {
    id: 'risk-frameworks',
    title: 'Risk Frameworks',
    difficulty: 'INTERMEDIATE',
    readTime: '14 min',
    labLink: '/modules/grc/lab',
    takeaways: [
      'Frameworks save you from inventing risk management from scratch - they are shared, defensible structures auditors already recognise.',
      'The NIST Risk Management Framework (SP 800-37) is a seven-step lifecycle for authorising systems: Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor.',
      'NIST CSF 2.0 organises outcomes under six functions - Govern, Identify, Protect, Detect, Respond, Recover - and Govern was added in the 2024 release.',
      'ISO 31000 is the principles-based, any-risk management standard; it is about process and culture, not a checklist of controls.',
      'FAIR is the leading method for quantifying cyber risk in money, decomposing risk into loss frequency and loss magnitude.',
      'You often combine frameworks: CSF to describe your posture, 800-37 to authorise systems, ISO 31000 for the overarching process, FAIR when you need dollars.',
    ],
    content: (
      <div>
        <H3>Why Frameworks Exist</H3>
        <P>
          A framework is a reusable, agreed-upon structure for doing something hard so you do not start from a blank page. In risk, frameworks matter for two reasons. First, they encode decades of collective experience, so you are far less likely to miss something important. Second, they are recognised by auditors, regulators and customers, which means that saying &quot;we align to NIST CSF&quot; or &quot;we run an ISO 31000 process&quot; is itself evidence of maturity. The skill is not memorising every framework but knowing what each one is for and when to reach for it.
        </P>

        <H3>NIST Risk Management Framework (SP 800-37)</H3>
        <P>
          The NIST RMF, defined in Special Publication 800-37, is a disciplined lifecycle for managing risk to information systems, heavily used in US government and its contractors but valuable anywhere. It is built around seven steps that take a system from concept to authorised operation and keep it under continuous watch. The key idea is the Authorize step: a named, accountable official formally accepts the residual risk of operating the system before it goes live. That signature is the whole point - risk acceptance made explicit and owned.
        </P>
        <P>
          The step most organisations underinvest in is the last one, Monitor. Authorisation is not a one-time gate; systems change, new vulnerabilities appear, and the risk picture drifts the moment the ink dries. Continuous monitoring means watching the controls and the threat environment so that a material change loops back into earlier steps and, if necessary, a re-authorisation. This is the bridge between the heavyweight, point-in-time world of a formal authorisation and the reality that security is a moving target. A program that authorises a system and then never revisits it has an impressive binder and a false sense of safety.
        </P>
        <Pre label="NIST RMF - SEVEN STEPS (SP 800-37 Rev 2)">
{`1. PREPARE    Set context, roles, risk appetite, resources
2. CATEGORIZE Classify the system and its data by impact
              (low / moderate / high) per FIPS 199
3. SELECT     Choose controls (from SP 800-53) for that category
4. IMPLEMENT  Put the controls in place
5. ASSESS     Test whether the controls actually work
6. AUTHORIZE  A senior official accepts residual risk and signs
              off the system to operate (the ATO)
7. MONITOR    Watch continuously; changes loop back to earlier steps`}
        </Pre>

        <H3>NIST Cybersecurity Framework 2.0</H3>
        <P>
          The NIST Cybersecurity Framework (CSF) is the most widely adopted way to describe and communicate a security posture, and version 2.0, released in 2024, is current. It organises security outcomes under six high-level Functions. The headline change in 2.0 was adding Govern as a new function that wraps around the others, formally recognising that governance - roles, policy, strategy and oversight - sits above day-to-day defence. CSF is deliberately not a rigid checklist; it is a common language that lets a startup and a bank describe their maturity against the same structure and target the same improvements.
        </P>
        <P>
          CSF gives you two more tools beyond the functions. Tiers describe how rigorous and risk-informed your overall approach is, from Tier 1 (Partial, ad hoc) to Tier 4 (Adaptive, continuously improving) - useful for saying where you are and where you want to be. Profiles let you tailor CSF to your context: a Current Profile captures the outcomes you achieve today, a Target Profile captures where you need to be given your business and threats, and the gap between the two becomes your prioritised roadmap. For SafiPay, a Target Profile that emphasises Protect and Detect outcomes around customer data, compared against an honest Current Profile, turns the abstract framework into a concrete, board-ready improvement plan.
        </P>
        <Table
          headers={['Function', 'Purpose', 'Example outcome']}
          rows={[
            ['Govern (new in 2.0)', 'Set and oversee strategy, roles, policy and risk management', 'Roles and responsibilities are defined and resourced'],
            ['Identify', 'Understand assets, risks and context', 'A current inventory of systems and data exists'],
            ['Protect', 'Put safeguards in place', 'Access control and encryption are enforced'],
            ['Detect', 'Find events and anomalies', 'Monitoring alerts on suspicious activity'],
            ['Respond', 'Act on detected incidents', 'An incident response plan is tested and used'],
            ['Recover', 'Restore capability after an incident', 'Backups are tested and recovery times are met'],
          ]}
        />
        <Note type="tip">
          A fast, real exercise: take any security gap and ask which CSF function it belongs to. No asset inventory? Identify. No MFA? Protect. No alerting? Detect. No tested backups? Recover. No defined owner or policy? Govern. This mapping is a staple of GRC work and the lab will drill it.
        </Note>

        <H3>ISO 31000</H3>
        <P>
          ISO 31000 is the international standard for risk management in general - not just cyber, but any risk an organisation faces. It is principles-based rather than prescriptive: it describes a sound risk management framework and process (establish context, assess, treat, monitor, communicate) and a set of principles (risk management should be integrated, structured, inclusive, dynamic). It does not hand you a list of controls or tell you what is acceptable; it tells you how to run the process of deciding. Many organisations use ISO 31000 as the umbrella philosophy for all enterprise risk and then use a cyber-specific framework like CSF or a control set like ISO 27001 underneath it.
        </P>

        <H3>FAIR - Quantifying Risk</H3>
        <P>
          FAIR (Factor Analysis of Information Risk) is the leading open method for expressing cyber risk in financial terms, and it is what organisations reach for when High/Medium/Low is not enough to settle a hard trade-off. FAIR breaks risk into a tree: risk is Loss Event Frequency multiplied by Loss Magnitude. Frequency decomposes into how often threats act and how often they succeed; magnitude decomposes into primary losses (your direct costs) and secondary losses (fines, reputation, customer churn). Instead of single guesses, FAIR uses ranges and runs them through simulation to produce a distribution of possible annual losses. It is more rigorous than a back-of-envelope ALE and is increasingly expected for board-level risk decisions.
        </P>
        <Pre label="FAIR DECOMPOSITION (simplified)">
{`                         RISK
                          |
          +---------------+----------------+
   Loss Event Frequency           Loss Magnitude
          |                              |
   +------+------+              +--------+--------+
 Threat      Vulnerability   Primary loss   Secondary loss
 Event Freq  (% success)     (response,     (fines, legal,
                              replacement)    reputation)

Output: not one number but a range, e.g.
  "90% confidence annual loss is between
   KES 1.2M and KES 6.8M, most likely ~KES 2.5M"`}
        </Pre>

        <H3>Choosing and Combining</H3>
        <P>
          These frameworks are not rivals; mature programs layer them. ISO 31000 or an enterprise risk framework provides the overarching philosophy. NIST CSF 2.0 describes and communicates your posture and drives improvement. NIST RMF (800-37) governs how individual systems are assessed and authorised to operate. FAIR supplies money when a specific decision needs it. For SafiPay, a practical stack is CSF 2.0 as the common language with the board, ISO 27001 as the certifiable control set (next chapter), and FAIR brought out for the two or three biggest risks where the board wants a shilling figure. Knowing which tool fits which job is exactly the judgement that distinguishes a senior GRC professional from someone reciting acronyms.
        </P>
      </div>
    ),
  },

  {
    id: 'control-frameworks',
    title: 'Control Frameworks',
    difficulty: 'INTERMEDIATE',
    readTime: '15 min',
    labLink: '/modules/grc/lab',
    takeaways: [
      'A control is a safeguard that reduces risk; control frameworks are curated, organised catalogues of them.',
      'NIST SP 800-53 is the exhaustive control catalogue (families like AC, IA, SC); CIS Controls v8 is the prioritised, practical starting set.',
      'ISO/IEC 27001 is the certifiable management-system standard; its Annex A (restructured in 2022 into 93 controls across 4 themes) lists the controls.',
      'By function, controls are preventive (stop it), detective (notice it) or corrective (fix it after) - good security needs all three.',
      'By nature, controls are administrative (policy, people), technical (technology) or physical (the real world).',
      'Defence in depth means layering controls of different types so no single failure is catastrophic.',
    ],
    content: (
      <div>
        <H3>What a Control Is</H3>
        <P>
          A control is any measure that reduces risk - that lowers the likelihood of a bad event, reduces its impact, or helps you detect and recover from it. Multi-factor authentication is a control. A locked server room door is a control. A policy requiring background checks is a control. A control framework is a curated, organised catalogue of controls so that you do not have to invent your defences from memory and so that you can demonstrate coverage to an auditor. Three dominate the field, and they serve different purposes.
        </P>

        <H3>NIST SP 800-53 - The Exhaustive Catalogue</H3>
        <P>
          NIST SP 800-53 is the deepest control catalogue in common use, with hundreds of controls organised into families identified by two-letter codes. It is the control set behind US federal systems and the RMF from the previous chapter. You do not read it front to back; you select the subset appropriate to your system&apos;s impact level. Its value is completeness and precision - if a control exists, 800-53 almost certainly has a well-specified version of it - which also makes it heavy for a small company to adopt wholesale.
        </P>
        <Table
          headers={['Family', 'Code', 'Covers']}
          rows={[
            ['Access Control', 'AC', 'Who can do what, least privilege, session rules'],
            ['Identification & Authentication', 'IA', 'Proving identity, MFA, credential management'],
            ['System & Communications Protection', 'SC', 'Encryption, boundary protection, segmentation'],
            ['Audit & Accountability', 'AU', 'Logging, log review, non-repudiation'],
            ['Incident Response', 'IR', 'Detecting, reporting and handling incidents'],
            ['Contingency Planning', 'CP', 'Backups, recovery, continuity'],
          ]}
        />

        <H3>CIS Controls v8 - The Prioritised Start</H3>
        <P>
          The CIS Controls (version 8 is current) are the pragmatic counterweight to 800-53. Instead of exhaustive coverage, CIS gives 18 controls ordered so that the earliest ones stop the most attacks for the least effort, and it splits each into Implementation Groups so a small business (IG1), a mid-sized one (IG2) and a large enterprise (IG3) each know what is expected of them. CIS Control 1 is inventory of hardware, Control 2 is inventory of software - deliberately first, because you cannot protect what you do not know you have. For a startup like SafiPay, CIS v8 IG1 is the ideal place to begin: a concrete, prioritised list rather than a thousand-page catalogue.
        </P>
        <Pre label="CIS CONTROLS v8 - THE FIRST SIX (of 18)">
{`CIS 1  Inventory and control of enterprise assets (hardware)
CIS 2  Inventory and control of software assets
CIS 3  Data protection
CIS 4  Secure configuration of assets and software
CIS 5  Account management
CIS 6  Access control management

Ordering is the point: you cannot protect, detect or recover
what you have not first inventoried (CIS 1 and 2).`}
        </Pre>

        <H3>ISO/IEC 27001 and 27002</H3>
        <P>
          ISO/IEC 27001 is the international standard you actually get certified against, which is why customers ask for it by name. It specifies an Information Security Management System (ISMS) - the governance, risk and improvement machinery around security - and requires you to run a risk assessment and select controls to treat the risks you find. Those controls are listed in Annex A, and the companion standard ISO/IEC 27002 explains how to implement each one. The 2022 revision restructured Annex A from the old 14 domains into 93 controls grouped under four themes, and tagged each control with attributes to make it easier to map.
        </P>
        <Table
          headers={['Annex A theme (2022)', 'Clause range', 'Examples']}
          rows={[
            ['Organizational controls', 'A.5', 'A.5.15 Access control, A.5.19 Supplier relationships'],
            ['People controls', 'A.6', 'A.6.3 Awareness training, A.6.4 Disciplinary process'],
            ['Physical controls', 'A.7', 'A.7.2 Physical entry, A.7.4 Physical monitoring'],
            ['Technological controls', 'A.8', 'A.8.5 Secure authentication, A.8.24 Use of cryptography'],
          ]}
        />
        <Note type="info">
          A common mapping exercise: a gap like &quot;we have no formal access control policy&quot; maps to ISO 27001 Annex A control A.5.15 (Access control). &quot;Staff have never had security training&quot; maps to A.6.3. Knowing the clause number is not trivia - it is how you fill in a Statement of Applicability and how an auditor checks your coverage. The lab drills this directly.
        </Note>

        <H3>Classifying Controls by Function</H3>
        <P>
          Beyond any catalogue, every control can be classified two ways, and these classifications are the backbone of good design. By function, a control is preventive, detective or corrective. Preventive controls stop a bad event before it happens - MFA, encryption, a locked door. Detective controls notice that something has happened or is happening - log monitoring, intrusion detection, CCTV. Corrective controls restore the situation after an event - backups and restore, incident response, patching the exploited flaw. A healthy program has all three, because prevention always eventually fails, detection is how you learn it failed, and correction is how you recover.
        </P>
        <Pre label="CONTROL FUNCTIONS - WORKED FOR ONE RISK">
{`Risk: attacker gains access to the payments server

  Preventive:  MFA, patching, network segmentation, firewall
               -> reduce the chance it happens at all
  Detective:   IDS alerts, log monitoring, file integrity checks
               -> notice quickly WHEN prevention fails
  Corrective:  isolate host, restore from backup, rotate creds
               -> limit damage and recover after the event

Missing a layer is a classic finding:
  firewall but no monitoring  = strong prevention, no detection
  -> the gap is a DETECTIVE control`}
        </Pre>

        <H3>Classifying Controls by Nature</H3>
        <P>
          The second classification is by nature: administrative, technical or physical. Administrative controls are the human-and-paper layer - policies, procedures, training, background checks, segregation of duties. Technical (sometimes called logical) controls are implemented in technology - encryption, access control lists, firewalls, MFA. Physical controls act in the real world - locks, guards, fences, badge readers, fire suppression. The two classifications combine: MFA is a preventive technical control; security awareness training is a preventive administrative control; CCTV is a detective physical control. Being able to place any control into both grids on demand is a core GRC skill and a frequent interview question.
        </P>
        <Table
          headers={['Control', 'By function', 'By nature']}
          rows={[
            ['Multi-factor authentication', 'Preventive', 'Technical'],
            ['Security awareness training', 'Preventive', 'Administrative'],
            ['Server room badge lock', 'Preventive', 'Physical'],
            ['SIEM log monitoring / alerting', 'Detective', 'Technical'],
            ['CCTV camera', 'Detective', 'Physical'],
            ['Backup and restore process', 'Corrective', 'Technical / Administrative'],
          ]}
        />
        <P>
          The practical payoff is defence in depth: deliberately layering controls of different functions and natures so that no single failure is catastrophic. If an attacker beats your preventive technical controls, a detective control should catch them, an administrative process should guide the response, and a corrective control should bring you back. When you assess a system and find only preventive technical controls, you have found a real weakness - you are one failure away from an undetected, unrecoverable incident.
        </P>
        <P>
          One more category earns its own name: the compensating control. Sometimes you genuinely cannot implement the control a standard asks for - a legacy payment terminal that cannot run modern encryption, say - but you can put something else in place that meets the same objective by another route, such as isolating that terminal on its own tightly monitored network segment. Standards like PCI DSS explicitly allow compensating controls provided you document why the original is infeasible, show that the alternative meets the intent and rigour of the requirement, and get it approved. Knowing that compensating controls exist, and that they must be justified rather than merely asserted, is what lets you pass an audit on a system you could not perfectly lock down - and it is a far more honest answer than pretending the gap is not there.
        </P>
      </div>
    ),
  },

  {
    id: 'compliance-regulations',
    title: 'Compliance and Regulations',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    labLink: '/modules/grc/lab',
    takeaways: [
      'Read any framework by finding its scope, its requirements, how conformance is proven, and the penalties for failing - the structure repeats.',
      'PCI DSS 4.0 governs payment card data; SOC 2 reports on service-provider controls against five trust criteria; both are contract-driven.',
      'HIPAA protects US health information; GDPR protects EU personal data with heavy fines and strict breach timelines.',
      'Kenya&apos;s Data Protection Act 2019 mirrors GDPR: lawful processing, data-subject rights, a Data Commissioner, and 72-hour breach notification.',
      'Kenya&apos;s Computer Misuse and Cybercrimes Act 2018 criminalises unauthorised access and related offences - it defines the legal line for your own hacking skills.',
      'Compliance is a floor, not a ceiling: meeting a standard is the minimum, not proof you are actually secure.',
    ],
    content: (
      <div>
        <H3>How to Read Any Framework</H3>
        <P>
          There are dozens of regulations and standards and more appear every year, so the durable skill is not memorising them but reading a new one quickly. Every framework answers the same four questions, and if you hunt for those four things you can orient yourself in any unfamiliar regulation within an hour. First, scope: who and what does it apply to, and when are you in or out? Second, requirements: what must you actually do? Third, conformance: how do you prove you did it - self-assessment, external audit, certification, attestation? Fourth, consequences: what happens if you fail - fines, loss of the ability to process payments, criminal liability, lost contracts? Hold those four questions in mind and every standard below becomes navigable.
        </P>
        <Pre label="THE FOUR QUESTIONS - APPLIED TO SafiPay">
{`Framework   Scope             Prove it by        Penalty for failing
---------   ---------------   ----------------   --------------------
PCI DSS     Card data they    QSA audit / SAQ    Fines, loss of card
            store/process     + quarterly scans   processing rights
SOC 2       Controls for      CPA audit report   No report = enterprise
            SaaS customers    (Type I or II)      customers walk away
Kenya DPA   Personal data of  Register as a       Fines up to KES 5M or
            data subjects     controller; ODPC    1% of turnover; orders
                              oversight`}
        </Pre>

        <H3>PCI DSS 4.0</H3>
        <P>
          The Payment Card Industry Data Security Standard applies to any organisation that stores, processes or transmits payment card data, and version 4.0 is the current baseline. It is not a law but a contractual requirement imposed by the card brands, which gives it real teeth: fail it and you can lose the right to process cards at all. It is organised into twelve requirements covering network security, protecting stored data, encryption in transit, access control, monitoring and testing, and an information security policy. Version 4.0 pushed toward continuous security rather than a once-a-year scramble, strengthened authentication (MFA for all access into the cardholder environment), and added a &quot;customised approach&quot; letting mature organisations meet an objective their own way if they can prove it works. For SafiPay, the single most powerful move is to reduce scope - store as little card data as possible so that fewer systems fall under PCI at all.
        </P>

        <H3>SOC 2</H3>
        <P>
          SOC 2 is the report that SaaS and service companies produce to satisfy their customers&apos; auditors, and it is often the first compliance milestone a startup is forced to reach because an enterprise customer will not sign without it. It is based on the AICPA Trust Services Criteria: Security (always required), plus optionally Availability, Processing Integrity, Confidentiality and Privacy. A SOC 2 engagement is performed by a CPA firm, which examines your controls and issues a report. The crucial distinction, covered fully in the audits chapter, is Type I (controls are suitably designed at a point in time) versus Type II (controls operated effectively over a period, usually 3-12 months). Customers increasingly demand Type II because design without sustained operation proves little.
        </P>

        <H3>HIPAA and GDPR</H3>
        <P>
          Two regulations dominate the data-protection conversation globally. HIPAA, the US Health Insurance Portability and Accountability Act, protects individually identifiable health information and imposes Privacy, Security and Breach Notification rules on healthcare providers and their business associates. GDPR, the EU General Data Protection Regulation, is the most influential privacy law in the world and protects the personal data of people in the EU regardless of where the processing company sits. GDPR grants data subjects strong rights (access, correction, erasure, portability), demands a lawful basis for processing, requires breach notification to a supervisory authority within 72 hours, and backs it with fines up to the greater of 20 million euro or 4% of global annual turnover. Its reach and its penalties made it the template that much of the world, including Kenya, has since copied.
        </P>
        <Table
          headers={['Regulation', 'Protects', 'Headline obligation', 'Penalty ceiling']}
          rows={[
            ['GDPR (EU)', 'Personal data of EU residents', 'Lawful basis; 72-hour breach notice; data-subject rights', 'Up to 20M euro or 4% global turnover'],
            ['HIPAA (US)', 'Health information (PHI)', 'Privacy, Security and Breach Notification rules', 'Tiered civil and criminal penalties'],
            ['Kenya DPA 2019', 'Personal data of data subjects in Kenya', 'Register with ODPC; 72-hour breach notice; rights', 'Up to KES 5M or 1% of annual turnover'],
            ['PCI DSS 4.0', 'Payment card data', '12 requirements; validate annually', 'Fines; loss of card processing'],
          ]}
        />

        <H3>The African and Kenyan Context</H3>
        <P>
          For a professional working in or with the region, two Kenyan laws matter enormously and are increasingly mirrored across the continent. The Data Protection Act, 2019 is Kenya&apos;s GDPR-equivalent. It establishes the Office of the Data Protection Commissioner (ODPC), requires data controllers and processors to register, sets out principles of lawful, fair and transparent processing, grants data subjects rights of access, correction and erasure, restricts transfers of personal data out of Kenya, and - importantly for incident response - requires notification of a personal-data breach to the Data Commissioner, in practice within 72 hours of becoming aware where the breach poses a real risk to data subjects. SafiPay, holding millions of customer records, is squarely a data controller under this Act and must be registered, must appoint someone accountable for data protection, and must be able to execute that breach-notification clock on demand.
        </P>
        <Note type="danger">
          The Computer Misuse and Cybercrimes Act, 2018 is the law that defines the legal boundary around the offensive skills taught elsewhere on GHOSTNET. It criminalises unauthorised access to computer systems, unauthorised interference with data, and related offences, with significant fines and imprisonment. The line is authorisation: the same technique is a paid penetration test with a signed scope, or a serious crime without one. Know this law, get written authorisation before you ever touch a system you do not own, and keep that authorisation on file. This is not optional background - it is the rule that keeps your career legal.
        </Note>
        <P>
          Across Africa, comparable frameworks are spreading - Nigeria&apos;s NDPR and Data Protection Act, South Africa&apos;s POPIA, and the African Union&apos;s Malabo Convention - so the GDPR-style pattern of lawful basis, data-subject rights, a supervisory authority and breach notification is becoming a continental norm. Learn the pattern once and you can read any of them quickly.
        </P>

        <H3>Compliance Is a Floor</H3>
        <P>
          The most important professional attitude about compliance is also the most misunderstood. Passing an audit or earning a certificate means you met a defined minimum - it does not mean you are secure. Attackers do not consult your Statement of Applicability. History is full of certified, compliant organisations that were breached through something the standard did not happen to cover, or covered only on paper. Treat compliance as the floor you must not fall below and real risk reduction as the thing you are actually trying to achieve. The best GRC professionals use compliance deadlines as leverage to fund genuine security improvements, so that the certificate and the safety arrive together rather than the certificate arriving alone.
        </P>
      </div>
    ),
  },

  {
    id: 'audits-assessments',
    title: 'Audits and Assessments',
    difficulty: 'INTERMEDIATE',
    readTime: '15 min',
    labLink: '/modules/grc/lab',
    takeaways: [
      'An assessment is for you to improve; an audit is for an independent party to form an opinion others will rely on.',
      'Internal audit reports to leadership and runs continuously; external audit is independent and produces the report customers and regulators trust.',
      'Evidence is the currency of audit: screenshots, logs, tickets, signed records and configurations that prove a control operated, not just that it exists.',
      'A gap assessment compares where you are against a target framework and produces a prioritised remediation plan before the real audit.',
      'Control testing checks design (is it built right?) and operating effectiveness (did it actually work all period?) through inquiry, observation, inspection and re-performance.',
      'SOC 2 Type I tests design at a point in time; Type II tests operating effectiveness over a period - Type II is the one enterprise customers want.',
    ],
    content: (
      <div>
        <H3>Assessment vs Audit</H3>
        <P>
          People use these words interchangeably, but the distinction is fundamental and worth stating precisely. An assessment is an internal exercise whose purpose is to help you improve: you measure yourself against a standard, find gaps, and fix them, on your own terms and timeline. An audit is a formal examination by an independent party whose purpose is to form an opinion that outsiders will rely on. The audience is the difference. An assessment&apos;s audience is you; an audit&apos;s audience is your customers, your regulator, your board. Because others rely on it, an audit demands independence, evidence and a defined methodology in a way an informal self-assessment does not.
        </P>

        <H3>Internal vs External Audit</H3>
        <P>
          Audit itself comes in two forms. Internal audit is a function inside the organisation - but deliberately independent of the teams it reviews - that reports to leadership or an audit committee and runs continuously, catching problems before they reach an external examiner. External audit is performed by an outside firm with no stake in the outcome, and its independence is precisely what gives its report value. When a customer asks SafiPay for a SOC 2 report, they want the external auditor&apos;s opinion, not SafiPay&apos;s own view of itself. A smart organisation uses internal audit to stay perpetually ready so that the external audit holds no surprises.
        </P>
        <Table
          headers={['Dimension', 'Internal audit', 'External audit']}
          rows={[
            ['Who performs it', 'In-house, independent of the audited team', 'Outside firm (e.g. a CPA firm for SOC 2)'],
            ['Primary audience', 'Management, audit committee, board', 'Customers, regulators, the public'],
            ['Frequency', 'Continuous / scheduled cycles', 'Periodic (often annual)'],
            ['Output', 'Findings and recommendations to fix', 'A formal opinion / report others rely on'],
          ]}
        />

        <H3>Evidence - The Currency of Audit</H3>
        <P>
          If you learn one thing about audits, learn this: auditors do not accept your word, they examine evidence. Evidence is the proof that a control not only exists but operated. &quot;We review access quarterly&quot; is a claim; the dated, signed access-review records for each of the last four quarters are evidence. The maturity of a security program is largely the quality of the evidence it can produce on demand. Strong programs generate evidence automatically as a by-product of operating - ticketing systems that record who approved an access change, logs that show monitoring ran, configuration exports that prove encryption is on - rather than scrambling to manufacture it the week before the auditor arrives.
        </P>
        <Pre label="A CLAIM vs THE EVIDENCE AN AUDITOR WANTS">
{`Control claim                 Evidence that satisfies an auditor
---------------------------   -----------------------------------
"Access is reviewed           Signed quarterly access-review records
 quarterly"                    showing reviewer, date, and actions taken

"We require MFA"              Config export / screenshot of the IdP
                              policy + a sample of user auth logs

"We patch critical servers"   Patch management report + change tickets
                              with dates for a sample of servers

"Staff are trained"          Training completion report with names,
                              dates, and the course content

"We back up and can restore" Backup logs AND a dated successful
                              restore-test record (backups alone
                              are not enough - restoration is the point)`}
        </Pre>
        <Note type="tip">
          The best time to think about evidence is when you design a control, not when the auditor asks. Ask of every control: &quot;What artefact will prove this ran?&quot; If the honest answer is &quot;nothing&quot;, the control is unauditable and probably unmanaged. Build the evidence trail in from the start.
        </Note>

        <H3>The Gap Assessment</H3>
        <P>
          Before any serious audit, you run a gap assessment: a structured comparison of your current state against the target framework (ISO 27001, SOC 2, PCI) to find exactly where you fall short, so you can remediate before the real auditor arrives. The output is a prioritised list of gaps, each mapped to the specific requirement it fails and tagged with an owner and a due date. For SafiPay approaching its first SOC 2 and ISO 27001 audits, the gap assessment is the single most valuable early activity: it converts a vague fear of failing into a concrete, ranked work plan, and it means the audit itself confirms a known-good state rather than discovering nasty surprises.
        </P>

        <H3>Control Testing</H3>
        <P>
          Testing a control means answering two separate questions. Is the control suitably designed - would it actually reduce the risk if it operated as intended? And is it operating effectively - did it in fact run, consistently, across the whole period under review? A beautifully designed control that was switched off for two months fails on operating effectiveness. Auditors gather their proof through four methods, usually in combination, in rough order of strength.
        </P>
        <Table
          headers={['Method', 'What the auditor does', 'Strength']}
          rows={[
            ['Inquiry', 'Asks staff how the control works', 'Weakest - corroborate with more'],
            ['Observation', 'Watches the control being performed', 'Moderate - a point in time only'],
            ['Inspection', 'Examines records, configs, tickets, logs', 'Strong - evidence of past operation'],
            ['Re-performance', 'Independently re-runs the control', 'Strongest - directly proves it works'],
          ]}
        />

        <H3>The Audit Lifecycle and Surviving It</H3>
        <P>
          A typical external audit follows a predictable arc: scoping (what is in and out), planning and a request list, fieldwork (the auditor gathers and tests evidence), findings and clarification (you respond, provide more evidence, agree remediation for anything unresolved), and the final report. Surviving - and passing - an audit is mostly preparation and composure. Keep evidence organised and current all year so fieldwork is a retrieval exercise, not a crisis. Give the auditor a single coordinated point of contact rather than letting them chase individuals. Answer exactly what is asked, provide the evidence, and resist the urge to volunteer unrelated weaknesses. When a finding is valid, acknowledge it and show a credible remediation plan - auditors respond far better to a known issue with an owner and a date than to defensiveness.
        </P>

        <H3>SOC 2 Type I vs Type II</H3>
        <P>
          The distinction that confuses newcomers most, and that interviewers love, is SOC 2 Type I versus Type II. A Type I report assesses whether your controls are suitably designed at a single point in time - a snapshot. A Type II report assesses whether those controls operated effectively over a period, typically three to twelve months - a film, not a photograph. Type II is far more valuable and far harder to fake, which is exactly why enterprise customers increasingly insist on it: it proves your controls did not just exist on audit day but worked for months. A practical path is to earn a Type I first to demonstrate design, then run the observation window and earn a Type II to demonstrate sustained operation.
        </P>
        <Pre label="SOC 2 TYPE I vs TYPE II">
{`TYPE I   "Were the controls suitably DESIGNED on 30 June?"
         A point-in-time snapshot of design.
         Faster, cheaper, proves less.

TYPE II  "Did the controls OPERATE EFFECTIVELY from 1 Jan to 30 June?"
         Tested across the whole period with evidence sampled
         throughout. A film, not a photo.
         Slower, costlier, proves far more.

Enterprise customers almost always require TYPE II:
  design without sustained operation proves nothing about
  whether you were actually secure all year.`}
        </Pre>
      </div>
    ),
  },

  {
    id: 'third-party-risk',
    title: 'Third-Party and Supply-Chain Risk',
    difficulty: 'INTERMEDIATE',
    readTime: '14 min',
    labLink: '/modules/grc/lab',
    takeaways: [
      'Your risk includes your vendors&apos; risk - outsourcing a function never outsources the accountability for it.',
      'Vendor assessment tiers effort by how much the vendor could hurt you: a payroll processor gets deep scrutiny; a stock-photo site does not.',
      'Standardised questionnaires (SIG, CAIQ) and shared reports (SOC 2, ISO 27001 certificates) make assessment efficient and comparable.',
      'The contract is a control: data protection clauses, right-to-audit, breach-notification timelines and security requirements belong in writing.',
      'An SBOM (software bill of materials) lists the components inside software so you can answer "are we affected?" when a library is found vulnerable.',
      'Fourth-party risk is your vendors&apos; vendors - concentration on a shared cloud or library can make a single failure everyone&apos;s failure.',
    ],
    content: (
      <div>
        <H3>Why Your Vendors Are Your Risk</H3>
        <P>
          Modern organisations run on other organisations. SafiPay uses a cloud provider, a KYC-verification API, an email service, a payroll processor and dozens of open-source libraries. Every one of those is a door into SafiPay, and a weakness in any of them can become SafiPay&apos;s breach. The defining principle of third-party risk management is that outsourcing a function does not outsource the accountability. When a vendor leaks your customers&apos; data, your customers and your regulator hold you responsible - you chose the vendor. Some of the largest breaches in history began at a supplier: an HVAC contractor, a software-update mechanism, a widely used logging library. Supply-chain risk is now one of the most important areas of GRC precisely because the attack surface extends far beyond your own walls.
        </P>

        <H3>Tiering and Assessing Vendors</H3>
        <P>
          You cannot assess every vendor to the same depth, so you tier them by the risk they pose - how sensitive the data they touch, how critical the service they provide, and how deeply they integrate with you. A payroll processor that holds every employee&apos;s bank details and national ID is a critical vendor demanding a full assessment; a stock-photo subscription is not. For high-tier vendors you review their security posture before signing and periodically after: you examine their SOC 2 report or ISO 27001 certificate, send a security questionnaire, check how they handle data and incidents, and confirm they can meet your contractual and regulatory obligations.
        </P>
        <Table
          headers={['Vendor tier', 'Example', 'Assessment depth']}
          rows={[
            ['Critical', 'Payment processor, cloud host, KYC provider', 'Full review: SOC 2 / ISO cert, questionnaire, contract, periodic re-review'],
            ['High', 'Email, CRM holding customer PII', 'Questionnaire + evidence review before signing'],
            ['Medium', 'Analytics, support tooling', 'Lightweight questionnaire, certificate check'],
            ['Low', 'Stock images, marketing widgets', 'Minimal - basic due diligence'],
          ]}
        />

        <H3>Standardised Questionnaires: SIG and CAIQ</H3>
        <P>
          If every company invented its own vendor questionnaire, the whole industry would drown in bespoke forms. Two standards fixed this. The SIG (Standardized Information Gathering) questionnaire, from Shared Assessments, is a comprehensive, configurable set of questions covering a vendor&apos;s controls across many domains, with a shorter SIG Lite for lower-risk cases. The CAIQ (Consensus Assessments Initiative Questionnaire), from the Cloud Security Alliance, maps directly to the Cloud Controls Matrix and is tailored to cloud providers. A mature vendor keeps a completed SIG or CAIQ ready to hand out, which lets a buyer assess them quickly and compare them against others on the same questions. Knowing these names - and that they are the standard tools for vendor assessment - marks you as someone who has done the work.
        </P>
        <Pre label="VENDOR ASSESSMENT - WHAT YOU COLLECT">
{`For a CRITICAL vendor, before signing:

  [ ] SOC 2 Type II report (read it - do not just file it)
  [ ] ISO 27001 certificate + Statement of Applicability
  [ ] Completed SIG or CAIQ questionnaire
  [ ] Data flow: what data of ours do they hold, and where?
  [ ] Sub-processors list (their vendors - fourth parties)
  [ ] Breach notification commitment (how fast will they tell us?)
  [ ] Evidence of encryption, access control, backups
  [ ] Penetration test summary / remediation record

Re-collect on a schedule (e.g. annually) - a clean report
from two years ago tells you nothing about today.`}
        </Pre>

        <H3>The Contract as a Control</H3>
        <P>
          The strongest third-party control is often legal, not technical. The contract is where you turn expectations into enforceable obligations. Security-relevant clauses include a data protection or data processing agreement defining how your data may be used and protected, a breach-notification clause with a concrete timeline (you cannot meet your own 72-hour regulatory deadline if your vendor takes two weeks to tell you), a right-to-audit clause letting you verify their controls, specified minimum security requirements, clear data-ownership and deletion-on-termination terms, and liability and indemnity provisions. A GRC professional who can read a contract for these clauses, and insist on them before signing, prevents far more harm than one who only runs scans. Get security into the contract before the pen touches paper, because afterwards you have no leverage.
        </P>
        <Note type="warn">
          The classic failure is the breach-notification mismatch. Kenya&apos;s DPA and GDPR give you roughly 72 hours to notify the regulator of a qualifying breach. If a critical vendor&apos;s contract only obliges them to notify you &quot;without undue delay&quot; and they interpret that as two weeks, your clock has already run out before you even knew. Pin vendor notification timelines down in writing and make them faster than your own obligation.
        </Note>

        <H3>SBOM - Knowing What Is Inside</H3>
        <P>
          Software is assembled from components, most of them open source, and you cannot defend against a vulnerable component you do not know you are running. A Software Bill of Materials (SBOM) is a formal, machine-readable inventory of every component and dependency inside a piece of software, including versions. Its value becomes obvious the day a widely used library is found to be critically vulnerable: organisations with an SBOM answer &quot;are we affected, and where?&quot; in minutes, while those without spend days manually hunting. SBOMs (in standard formats like SPDX or CycloneDX) are increasingly required by regulators and large buyers, and requesting one from your software vendors is now a standard part of supply-chain due diligence.
        </P>

        <H3>Fourth-Party Risk and Concentration</H3>
        <P>
          Your vendors have vendors, and those fourth parties are risk you inherit without ever choosing them. If SafiPay&apos;s KYC provider relies on a particular cloud region, SafiPay is exposed to that cloud region even though it never signed a contract with it. Two patterns deserve attention. First, chained dependency: a failure three links down the chain can still reach you. Second, concentration risk: when many of your vendors - or many companies in your whole sector - depend on the same underlying cloud, CDN or library, a single failure in that shared component becomes everyone&apos;s failure at once. Mapping your critical vendors&apos; key sub-processors, and noticing where the whole chain funnels through one provider, is advanced third-party work that separates a thorough GRC function from a box-ticking one.
        </P>
        <P>
          Third-party risk also does not end when the contract is signed; it needs continuous management across the whole vendor lifecycle. At onboarding you assess and contract. During the relationship you monitor - re-collecting assurance reports on a schedule, watching for news of a vendor breach, and re-assessing when the vendor changes what data it holds or which sub-processors it uses. At offboarding, which is the step teams most often forget, you must ensure the vendor actually deletes or returns your data, revoke the access and integrations you granted them, and record that it was done. A former vendor that still holds a copy of your customer database, or still has a live API key into your systems, is a breach waiting to happen long after anyone remembers the relationship existed. Treating vendor risk as a lifecycle rather than a one-off gate is the mark of a mature program.
        </P>
      </div>
    ),
  },

  {
    id: 'bcdr',
    title: 'Business Continuity and Disaster Recovery',
    difficulty: 'INTERMEDIATE',
    readTime: '15 min',
    labLink: '/modules/grc/lab',
    takeaways: [
      'Business continuity keeps the whole organisation running through disruption; disaster recovery is the IT-focused subset that restores systems and data.',
      'A Business Impact Analysis (BIA) ranks processes by how badly and how fast their loss hurts - it drives every continuity decision.',
      'RTO is how fast a system must be back; RPO is how much data you can afford to lose - they set your recovery architecture and cost.',
      'Backups only count if restoration is tested - an untested backup is a hope, not a control; follow a 3-2-1 strategy.',
      'Tabletop exercises rehearse the plan on paper so gaps surface in a meeting room, not during a real crisis.',
      'An incident is a technical event you handle with a playbook; a crisis threatens the whole organisation and needs executive leadership and communications.',
    ],
    content: (
      <div>
        <H3>Continuity vs Recovery</H3>
        <P>
          When things go badly wrong - a data centre fails, ransomware encrypts your servers, a flood closes the office - two related disciplines keep you alive. Business Continuity Planning (BCP) is the broad one: how the whole organisation keeps delivering its essential functions during a disruption, covering people, premises, processes and communications, not just technology. Disaster Recovery (DRP) is the IT-focused subset: how you restore systems, applications and data after a disruptive event. Continuity is &quot;how does SafiPay keep moving customers&apos; money and answering the phones when the office is unreachable?&quot; Recovery is &quot;how do we get the payments platform and its database back online, and how current will the data be?&quot; You need both; recovery without continuity restores servers to an organisation that has already ground to a halt.
        </P>
        <Table
          headers={['Dimension', 'Business Continuity (BCP)', 'Disaster Recovery (DRP)']}
          rows={[
            ['Scope', 'Whole organisation: people, process, premises, tech', 'IT systems, applications and data'],
            ['Question', 'How do we keep operating?', 'How do we restore technology?'],
            ['Examples', 'Alternate site, staff call tree, manual workarounds', 'Failover, backups, restore procedures'],
            ['Owner', 'Business leadership + BCP coordinator', 'IT / infrastructure teams'],
          ]}
        />

        <H3>The Business Impact Analysis</H3>
        <P>
          Everything in continuity planning rests on the Business Impact Analysis. A BIA systematically identifies the organisation&apos;s processes and asks, for each: how much does it hurt if this stops, and how quickly does that hurt escalate? From that you rank processes by criticality and set recovery priorities, because in a real disaster you cannot restore everything at once and must know what comes first. For SafiPay the BIA would almost certainly rank the live payments-processing engine as most critical - every minute down is lost transactions and furious customers - while the internal analytics dashboard, painful to lose, can wait days. The BIA is what turns &quot;everything is important&quot; into a defensible order of restoration, and it is the input that sets the recovery objectives below.
        </P>

        <H3>RTO and RPO</H3>
        <P>
          Two metrics express recovery requirements, and confusing them is a classic beginner error. The Recovery Time Objective (RTO) is the maximum acceptable time to restore a system after a disruption - a measure of downtime. The Recovery Point Objective (RPO) is the maximum acceptable amount of data, measured in time, that you can afford to lose - a measure of how far back your last usable recovery point can be. RTO answers &quot;how fast must it be back?&quot;; RPO answers &quot;how much recent data can we lose?&quot; They are independent and both flow from the BIA, and together they dictate - and cost - your recovery architecture. A four-hour RTO needs fast failover; a fifteen-minute RPO needs near-continuous replication, not a nightly backup.
        </P>
        <Pre label="RTO vs RPO ON A TIMELINE">
{`           <-------- RPO -------->  [ FAILURE ]  <------ RTO ------>
           last good data point        occurs        system restored

RPO = how much DATA you can lose  (look BACKWARD from the failure)
RTO = how long you can be DOWN    (look FORWARD from the failure)

SafiPay payments engine (from the BIA - the most critical system):
   RTO = 4 hours     -> must be back within 4 hours
   RPO = 15 minutes  -> may lose at most 15 minutes of transactions
   Architecture implied: hot standby + replication every few minutes
                         (a nightly backup alone CANNOT meet a 15-min RPO)

SafiPay internal analytics dashboard (far less critical):
   RTO = 3 days      RPO = 24 hours   -> a nightly backup is fine`}
        </Pre>
        <Note type="info">
          Tighter objectives cost more, so RTO and RPO are business decisions, not technical ones. The job of GRC is to make the trade-off explicit: &quot;a 15-minute RPO on this system costs X per year in replication; a 24-hour RPO costs far less. Which does the business want to pay for?&quot; Setting every system to the tightest objective bankrupts you; the BIA tells you where the tight objectives are actually justified.
        </Note>

        <H3>Backup Strategy</H3>
        <P>
          Backups are the backbone of recovery, but only if they can actually be restored, and the single most common failure in this whole area is the backup that was running faithfully for months and turns out to be unrestorable the day you need it. The durable guideline is the 3-2-1 rule: keep at least three copies of your data, on two different types of media, with one copy off-site. Increasingly a &quot;3-2-1-1&quot; variant adds one immutable or offline copy specifically to survive ransomware, which now deliberately seeks out and encrypts online backups. Above all, test restoration regularly: an untested backup is a hope, not a control, and a restore test is itself a piece of audit evidence that your recovery actually works.
        </P>
        <Pre label="3-2-1 BACKUP RULE (+1 for ransomware)">
{`  3  copies of the data    (the live data + two backups)
  2  different media types  (e.g. disk + cloud object storage)
  1  copy off-site          (survives a site-level disaster)
 +1  immutable or offline    (survives ransomware that hunts backups)

The rule that matters most:  RESTORE-TEST on a schedule.
  A backup you have never restored is an assumption.
  A dated, successful restore test is evidence and assurance.`}
        </Pre>

        <H3>Tabletop Exercises</H3>
        <P>
          A plan that has never been rehearsed fails under pressure. A tabletop exercise gathers the relevant people around a table (or a call) and walks through a realistic scenario - &quot;ransomware has encrypted the payments database at 02:00 on a public holiday&quot; - step by step, with each person describing what they would do. Tabletops are cheap, low-risk and astonishingly effective at surfacing gaps: the contact list is out of date, two people both think they declare the incident, nobody knows who talks to the regulator, the recovery runbook assumes a system that was decommissioned last year. The goal is to find these gaps in a meeting room, where they cost nothing, rather than during a real crisis, where they cost everything. Run them regularly, vary the scenarios, and capture every gap as an action with an owner.
        </P>

        <H3>Incident vs Crisis</H3>
        <P>
          Finally, distinguish an incident from a crisis, because they call for different leadership. An incident is a security or operational event that your teams handle with established playbooks - a malware infection, a service outage, a phishing compromise contained by the response team. A crisis is an event that threatens the organisation as a whole - its survival, its reputation, its legal standing - and demands executive leadership, coordinated external communications, legal and regulatory engagement, and decisions no playbook fully covers. A major breach of millions of SafiPay customer records is not merely an incident for the security team; it is a crisis for the executive team, triggering regulator notification, customer communications, media handling and board involvement. Knowing when an incident has become a crisis - and escalating it to the people who must own that level - is a judgement that defines senior security leadership.
        </P>
      </div>
    ),
  },

  {
    id: 'build-program-career',
    title: 'Building a Security Program and Your GRC Career',
    difficulty: 'ADVANCED',
    readTime: '16 min',
    labLink: '/modules/grc/lab',
    takeaways: [
      'Maturity models (like CMMI levels 1-5) turn "are we any good?" into a shared, trackable answer and a target to aim at.',
      'Building from zero follows an order: inventory and visibility, then quick wins on top risks, then a framework, then evidence and continuous improvement.',
      'A risk register is the operational heart of GRC - a living list of risks, owners, scores, treatments and status that leadership actually uses.',
      'Writing clearly is a security skill: a policy or risk statement that a non-technical executive misreads is a failed control.',
      'Certifications open doors - CISSP for breadth, CISA for audit, CRISC for risk, ISO 27001 Lead Auditor/Implementer for the ISMS.',
      'The senior GRC skill is translating risk into business language and money so executives can decide - not reciting controls.',
    ],
    content: (
      <div>
        <H3>Maturity Models</H3>
        <P>
          You cannot improve what you cannot describe, and a maturity model gives you a shared vocabulary for &quot;how good are we, really?&quot; The best-known pattern, borrowed from CMMI, runs through five levels, and whether you use those exact labels or a framework-specific tier set, the idea is the same: place each capability on a ladder, agree where you are, agree where you want to be, and track the climb. A maturity assessment against NIST CSF 2.0, for example, might rate each of the six functions and reveal that SafiPay is strong on Protect but weak on Detect and barely started on Govern - an instantly actionable picture for a board.
        </P>
        <Table
          headers={['Level', 'Name', 'What it looks like']}
          rows={[
            ['1', 'Initial', 'Ad hoc, heroic individuals, nothing documented'],
            ['2', 'Repeatable', 'Some processes exist but are inconsistent'],
            ['3', 'Defined', 'Standardised, documented processes across the org'],
            ['4', 'Managed', 'Processes measured with metrics and controlled'],
            ['5', 'Optimising', 'Continuous, data-driven improvement'],
          ]}
        />

        <H3>Building a Program From Zero</H3>
        <P>
          Imagine SafiPay hires you as its first security lead with no program at all. The instinct to buy tools is a trap; the right order starts with knowledge, not purchases. First, establish visibility: inventory your assets, data and vendors, because you cannot protect, measure or recover what you have not catalogued - this is why CIS Controls 1 and 2 are first. Second, do a rapid risk assessment and win quick, high-value battles on the top handful of risks (MFA everywhere, patch the internet-facing systems, get backups working and tested). Third, adopt a framework to give structure and a certifiable target - for a fintech, ISO 27001 plus SOC 2, described to the board in CSF 2.0 terms. Fourth, build the evidence and governance machinery - the risk register, policies, awareness training, metrics - so the program is auditable and self-sustaining. Then iterate: reassess, raise the maturity level, repeat.
        </P>
        <Pre label="FIRST 90 DAYS AS SafiPay's SECURITY LEAD">
{`Days 1-30   SEE
  - Inventory assets, data stores, and vendors
  - Identify what is regulated (customer PII, payment data)
  - Draft the first risk register from what you find

Days 31-60  STOP THE BLEEDING
  - Enforce MFA on everything, especially admin + remote
  - Patch internet-facing systems; close obvious exposures
  - Get backups working AND run a restore test

Days 61-90  STRUCTURE
  - Pick frameworks: ISO 27001 + SOC 2, spoken in CSF 2.0
  - Run a gap assessment against them
  - Write core policies; start awareness training
  - Set 3-4 board metrics and report the first trend

Then: iterate. Raise maturity. Prepare for the real audit.`}
        </Pre>

        <H3>Writing a Risk Register</H3>
        <P>
          The risk register is the operational heart of a GRC function - a living document that lists each identified risk with its owner, its likelihood and impact, its score, the chosen treatment and its current status. It is not a one-time deliverable; it is reviewed and updated continually, and it is the single artefact that most directly shows a board that risk is being managed rather than merely feared. A good register row reads as a decision: here is the risk, here is who owns it, here is how bad it is, here is what we are doing, here is where it stands. A weak register is a graveyard of vague entries nobody owns.
        </P>
        <Pre label="RISK REGISTER - SAMPLE ROWS (SafiPay)">
{`ID    Risk                         Owner   L  I  Score  Sev      Treatment              Status
----  --------------------------   -----   -  -  -----  -------  --------------------   --------
R-001 Customer PII DB breach via   CISO    4  5   20    CRITICAL Reduce: MFA, patch,    In progress
      unpatched, no-MFA server                              segment, monitor
R-002 Key payroll vendor leaks     CISO    3  4   12    HIGH     Transfer+Reduce:       Open
      staff data                                             contract clauses, SIG
R-003 Ransomware encrypts backups  IT Lead 3  5   15    CRITICAL Reduce: immutable      In progress
                                                              offline backup copy
R-004 Legacy internal report tool  IT Lead 2  2    4    LOW      Accept (within          Accepted
      lacks modern logging                                  appetite, signed off)

Severity from the 5x5 matrix:  L (likelihood 1-5) x I (impact 1-5).
Score 20 = Likelihood 4 x Impact 5 -> CRITICAL. Every row has ONE owner.`}
        </Pre>
        <Note type="tip">
          Notice R-004: formally accepting a low risk, signed off, is a legitimate and mature entry - not a failure. A register where every risk is &quot;in progress&quot; forever is less credible than one that shows conscious, documented acceptance of the small risks so that effort concentrates on the critical ones.
        </Note>

        <H3>Writing Clearly Is a Security Skill</H3>
        <P>
          The most underrated skill in GRC is plain writing. A policy that a non-technical executive misreads is a failed control. A risk statement that buries the decision in jargon will not get funded. A good risk statement names the asset, the threat, the consequence and the recommendation in language a busy, non-technical leader can act on in thirty seconds. Compare &quot;the EDR agent coverage gap on the DMZ hosts elevates lateral-movement exposure&quot; with &quot;twelve internet-facing servers have no security monitoring, so an attacker who breaks in could move through our network unseen; fixing it costs KES 180,000 and takes two weeks.&quot; Same fact, but only the second one gets funded. Practise writing the second kind.
        </P>
        <P>
          Beyond writing, the soft skills decide how far a GRC career goes, because the entire job is influence without direct authority. You rarely own the servers, the code or the budgets you are trying to protect; you must persuade the people who do. That means listening to the business before prescribing, framing security as an enabler of what a team is trying to achieve rather than an obstacle, negotiating realistic deadlines instead of issuing impossible ones, and staying calm and credible during an incident when everyone else is not. The GRC professionals who plateau are usually technically fine but treat security as a set of rules to enforce; the ones who become trusted advisors treat it as a service they provide to colleagues who have their own pressures. Curiosity, humility and the patience to explain the same idea three different ways are worth as much as any framework.
        </P>

        <H3>Certifications</H3>
        <P>
          Certifications open doors in GRC more reliably than in almost any other security specialism, because the field values demonstrable knowledge of frameworks and process. Choose by where you want to go rather than collecting them all.
        </P>
        <Table
          headers={['Certification', 'Focus', 'Good for']}
          rows={[
            ['CISSP (ISC2)', 'Broad security management across 8 domains', 'The generalist benchmark; security leadership'],
            ['CISA (ISACA)', 'Information systems auditing', 'Auditor and assurance roles'],
            ['CRISC (ISACA)', 'Risk management in IT', 'Risk analyst and risk manager roles'],
            ['ISO 27001 Lead Auditor / Implementer', 'Building or auditing an ISMS', 'Hands-on ISO 27001 work'],
            ['CC / Security+ ', 'Entry-level fundamentals', 'Breaking in with no experience yet'],
          ]}
        />
        <Note type="info">
          Certifications prove knowledge, not judgement. They get your CV past the filter and give you a shared vocabulary, but the professionals who rise are the ones who pair the certificate with real decisions: a risk accepted and justified, an audit passed, a board that funded what you recommended. Use certs to open the door; use delivered outcomes to walk through it.
        </Note>

        <H3>Communicating Risk to Executives</H3>
        <P>
          Everything in this module converges on one senior skill: translating risk into business language and money so that the people who control the budget can decide well. Executives do not want to be security experts; they want to understand their exposure, their options and the cost of each, and then choose. Lead with the business consequence, not the technical cause. Offer options with trade-offs rather than a single demand. Quantify where you honestly can, in shillings and in likelihood, so the decision rests on comparison rather than fear. Tie everything to the organisation&apos;s risk appetite, which they set. Do this well and you become the person leadership trusts to tell them the truth about risk without crying wolf - and that trust, more than any tool or certificate, is what a security career is built on. The hacker who can also do this is rare, valuable, and very hard to replace.
        </P>
      </div>
    ),
  },
]

export default function GrcPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem',
        fontFamily: mono, fontSize: '0.7rem', color: '#8a7a4a'
      }}>
        <Link href="/" style={{ color: '#8a7a4a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-17 // GRC</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/modules/grc/lab" style={{
            fontFamily: mono, fontSize: '0.65rem', color: '#8a7a4a',
            textDecoration: 'none', letterSpacing: '0.05em'
          }}>
            MOD-17 LAB: THE AUDITOR ARRIVES &#8594;
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontFamily: mono, fontSize: '9px', letterSpacing: '0.2em',
          color: '#8a7a4a', textTransform: 'uppercase', marginBottom: '0.5rem'
        }}>
          MODULE 17 &middot; GRC
        </div>
        <h1 style={{
          fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent,
          margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(224,175,104,0.4)'
        }}>
          GOVERNANCE, RISK &amp; COMPLIANCE
        </h1>
        <p style={{ color: '#8a7a4a', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>
          Governance &middot; Risk management &middot; Frameworks &middot; Controls &middot; Compliance &amp; law &middot; Audits &middot; Third-party risk &middot; BC/DR &middot; Building a program &amp; career
        </p>
      </div>

      {/* Chapter overview stats */}
      <div className="module-stat-grid">
        {[
          ['10', 'CHAPTERS'],
          ['~3.5hr', 'TOTAL READ'],
          ['INTERMEDIATE', 'DIFFICULTY'],
          ['MOD-17', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(224,175,104,0.04)', border: '1px solid rgba(224,175,104,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#7a6a3a', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <ModuleCodex moduleId="grc" accent={accent} chapters={chapters} />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #2a2010' }}>
        <div style={{ background: 'rgba(224,175,104,0.04)', border: '1px solid rgba(224,175,104,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#7a6a3a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-17 Interactive Lab</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#7a6a3a', marginBottom: '1.5rem' }}>The Auditor Arrives &middot; 16 steps &middot; 300 XP &middot; Risk, controls, audit &amp; law</div>
          <Link href="/modules/grc/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(224,175,104,0.6)', borderRadius: '6px', background: 'rgba(224,175,104,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(224,175,104,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
      </div>
    </div>
  )
}
