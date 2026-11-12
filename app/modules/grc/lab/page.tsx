'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#e0af68'
const moduleId = 'grc'
const moduleName = 'Governance, Risk & Compliance'
const moduleNum = '17'

const steps: LabStep[] = [
  // ── ACT 1: Know what you are protecting ───────────────────────────────────
  {
    id: 'grc-01',
    title: 'Classify the Asset',
    objective: `You are the new security lead at SafiPay, a Nairobi fintech, preparing for your first SOC 2 and ISO 27001 audits. Your first task is to classify SafiPay's core data asset.

The asset is the customer database: full names, national ID numbers, phone numbers and transaction history for 2,000,000 customers. On a standard scheme of Public / Internal / Confidential / Restricted, what classification does this regulated personal and financial data deserve?

Type the classification level.`,
    hint: 'This is the most sensitive data the company holds - regulated PII and financial records. Pick the highest-sensitivity band.',
    answers: ['restricted', 'confidential', 'highly confidential', 'sensitive'],
    xp: 15,
    explanation: `Regulated customer PII and financial records sit in the highest-sensitivity band - Restricted (or Confidential, depending on the scheme's labels). Classification drives everything downstream: Restricted data demands encryption at rest and in transit, strict access control, logging, and tighter recovery objectives.

Why classification matters:
  - You cannot apply "appropriate" controls until you know how sensitive data is.
  - Auditors check that your controls MATCH your classification.
  - Over-classifying everything is as useless as under-classifying - it hides the data that truly matters.

A typical 4-tier scheme:
  Public       Marketing site, press releases - no harm if disclosed
  Internal     Org charts, internal docs - minor harm
  Confidential Business-sensitive, contracts - real harm
  Restricted   Regulated PII, payment data, secrets - severe harm`
  },
  {
    id: 'grc-02',
    title: 'Calculate the SLE',
    objective: `You are quantifying the risk of a breach of that customer database so you can justify spending to the board.

Given numbers:
  Asset Value (AV)     = KES 10,000,000
  Exposure Factor (EF) = 0.40  (a single breach destroys 40% of the asset's value)

The Single Loss Expectancy is the money lost from ONE breach: SLE = AV x EF.

Compute the SLE (in KES).`,
    hint: 'SLE = Asset Value x Exposure Factor = 10,000,000 x 0.40.',
    answers: ['4000000', '4,000,000', 'kes 4,000,000', 'ksh 4,000,000', '4 million', '4000000 kes'],
    xp: 20,
    explanation: `SLE = AV x EF = 10,000,000 x 0.40 = KES 4,000,000.

The SLE is the expected loss from a SINGLE occurrence of the event. The Exposure Factor is the fraction of the asset's value wiped out by one event - here 40%, reflecting that a breach damages reputation, triggers fines and loses customers but does not destroy 100% of the business's value.

SLE is a building block, not the answer. On its own it says nothing about how OFTEN the event happens - that is the next step (ARO), which turns a per-event loss into an annual figure (ALE).`
  },
  {
    id: 'grc-03',
    title: 'Calculate the ALE',
    objective: `Now annualise the risk so you can compare it against the yearly cost of a control.

  SLE  = KES 4,000,000  (from the previous step)
  ARO  = 0.50           (Annualised Rate of Occurrence: one breach expected every two years)

The Annualised Loss Expectancy is the expected cost PER YEAR: ALE = SLE x ARO.

Compute the ALE (in KES).`,
    hint: 'ALE = SLE x ARO = 4,000,000 x 0.50.',
    answers: ['2000000', '2,000,000', 'kes 2,000,000', 'ksh 2,000,000', '2 million', '2000000 kes'],
    flag: 'GHOST{ale_two_million_per_year}',
    xp: 20,
    explanation: `ALE = SLE x ARO = 4,000,000 x 0.50 = KES 2,000,000 per year.

The ARO expresses frequency: 1 = once a year, 0.5 = once every two years, 2 = twice a year. Multiplying SLE by ARO converts a per-event loss into an expected annual loss - the number you compare against annual control costs.

The decision this unlocks:
  A control costing KES 250,000/yr that drives the breach risk
  to near zero defends KES 2,000,000/yr of expected loss - an easy yes.
  A control costing KES 3,000,000/yr would cost MORE than the risk -
  you would transfer (insure) or partially accept instead.

This single calculation - SLE = AV x EF, then ALE = SLE x ARO - is the
most-tested quantitative formula in all of GRC. Know it cold.`
  },
  {
    id: 'grc-04',
    title: 'Name the Risk That Remains',
    objective: `You apply controls to the database: encryption at rest and in transit, multi-factor authentication, network segmentation, monitoring and tested backups. These reduce the breach risk from CRITICAL down to MEDIUM, but not to zero.

What is the term for the risk that REMAINS after controls have been applied?`,
    hint: 'Inherent risk is BEFORE controls. What is the risk left over AFTER controls?',
    answers: ['residual risk', 'residual', 'residual exposure'],
    xp: 20,
    explanation: `Residual risk is what remains after controls are applied. Inherent risk is the raw exposure BEFORE any controls.

The full chain:
  Inherent risk (no controls)  = CRITICAL
      apply controls ->
  Residual risk (with controls) = MEDIUM

You manage residual risk down toward your RISK APPETITE - the level
leadership has formally agreed to tolerate. If SafiPay's appetite for
customer-data risk is LOW and residual sits at MEDIUM, you have two
honest choices:
  1. Add more treatment until residual drops to LOW, or
  2. Have an accountable executive formally ACCEPT the gap in writing.

What you must never do is leave residual-above-appetite silently
unaddressed. The written acceptance protects the organisation and you.`
  },

  // ── ACT 2: Treat, map and classify ────────────────────────────────────────
  {
    id: 'grc-05',
    title: 'Choose the Risk Treatment',
    objective: `For a separate risk - the financial impact of a possible breach's legal and notification costs - SafiPay has reduced likelihood as far as is practical, but the potential financial hit is still large. Leadership decides to shift that remaining financial consequence to an insurer by buying a cyber-insurance policy.

Of the four risk treatments (reduce, transfer, avoid, accept), which one is "buy insurance"?`,
    hint: 'Insurance moves the financial consequence of a risk onto a third party. Which of the four treatments is that?',
    answers: ['transfer', 'risk transfer', 'transference', 'transfer the risk'],
    xp: 20,
    explanation: `Buying insurance is TRANSFER - moving the financial consequence of a risk to a third party. It does not reduce the chance of a breach; it caps what the breach costs you.

The four treatments:
  Reduce / Mitigate  Add controls to lower likelihood or impact (MFA, patching)
  Transfer           Shift the financial impact elsewhere (insurance, contracts)
  Avoid              Stop the risky activity entirely (do not store card numbers)
  Accept             Consciously live with it, documented and signed off

Most real risks get a BLEND: reduce what you can, transfer some of the
residual with insurance, and formally accept whatever is left within
appetite. Transfer never removes accountability - after a breach, your
customers and regulator still hold YOU responsible, insurance or not.`
  },
  {
    id: 'grc-06',
    title: 'Map the Gap to a NIST CSF 2.0 Function',
    objective: `Your gap assessment finds that SafiPay has NO asset inventory - nobody can produce a current list of the servers, databases and cloud accounts the company runs.

NIST CSF 2.0 organises outcomes under six functions: Govern, Identify, Protect, Detect, Respond, Recover. "Maintain an inventory of assets and understand your risk context" belongs to which function?`,
    hint: 'Before you can Protect or Detect anything, you must first know what you have and understand your context. Which function is that?',
    answers: ['identify', 'identify function', 'id'],
    flag: 'GHOST{csf_function_identify}',
    xp: 20,
    explanation: `An asset inventory is a core outcome of the IDENTIFY function. You cannot Protect, Detect, Respond to or Recover what you have not first Identified.

NIST CSF 2.0 - the six functions (Govern was added in the 2024 release):
  Govern    Strategy, roles, policy, oversight (wraps the others)
  Identify  Assets, risks, context  <- asset inventory lives here
  Protect   Safeguards: access control, encryption, training
  Detect    Monitoring, alerting, anomaly detection
  Respond   Incident response and handling
  Recover   Restore capability, backups, recovery times

Fast mapping drill (a GRC staple):
  No asset inventory?  -> Identify
  No MFA?              -> Protect
  No alerting/SIEM?    -> Detect
  No tested backups?   -> Recover
  No owner or policy?  -> Govern`
  },
  {
    id: 'grc-07',
    title: 'Map the Gap to an ISO 27001 Annex A Control',
    objective: `Another gap: SafiPay has no formal access control policy - access is granted informally and never reviewed.

ISO/IEC 27001:2022 lists its controls in Annex A (93 controls across 4 themes). The organisational control titled "Access control" - requiring rules to control physical and logical access based on business need - carries a specific clause number.

Give the Annex A control number (or its title) for Access control.`,
    hint: 'It is an organisational control in the A.5 theme. The clause is A.5.15. The title "access control" is also accepted.',
    answers: ['a.5.15', '5.15', 'a5.15', 'access control'],
    xp: 15,
    explanation: `A gap in access control rules maps to ISO 27001:2022 Annex A control A.5.15 (Access control), an organisational control in the A.5 theme. (Related technical controls include A.8.5 Secure authentication for the MFA mechanism itself.)

ISO 27001:2022 restructured Annex A into 93 controls under 4 themes:
  A.5  Organizational controls  (e.g. A.5.15 Access control,
                                 A.5.19 Supplier relationships)
  A.6  People controls          (e.g. A.6.3 Awareness training)
  A.7  Physical controls        (e.g. A.7.2 Physical entry)
  A.8  Technological controls   (e.g. A.8.5 Secure authentication,
                                 A.8.24 Use of cryptography)

Knowing the clause number is not trivia: it is how you complete a
Statement of Applicability and how an auditor checks coverage. This is
exactly the mapping work a GRC analyst does every day.`
  },
  {
    id: 'grc-08',
    title: 'Identify the Missing Control Type',
    objective: `SafiPay has a firewall and MFA in place - strong measures that STOP attacks before they happen. But there is no log monitoring, no intrusion detection, and no alerting. If an attacker got past the firewall, nobody would NOTICE.

Controls are classed by function as preventive, detective or corrective. Which type of control is MISSING here?`,
    hint: 'Firewall and MFA are preventive (they stop attacks). What type NOTICES an attack that is already happening?',
    answers: ['detective', 'detective control', 'detective controls'],
    xp: 20,
    explanation: `The missing layer is DETECTIVE controls - the ones that NOTICE an event that is happening or has happened: log monitoring, intrusion detection, SIEM alerting, file integrity monitoring.

Controls by function:
  Preventive  Stop it before it happens   (firewall, MFA, encryption)
  Detective   Notice it happening/happened (IDS, log monitoring, CCTV)
  Corrective  Fix/recover after the event  (backups, IR, patching)

Having only preventive controls is a classic audit finding: prevention
ALWAYS eventually fails, detection is how you learn it failed, and
correction is how you recover. Firewall-but-no-monitoring means an
attacker who gets in operates unseen - a detective gap. Defence in
depth requires all three functions layered together.`
  },
  {
    id: 'grc-09',
    title: 'Classify the Control by Nature',
    objective: `SafiPay introduces mandatory security awareness training for all staff - teaching them to spot phishing, handle customer data correctly, and report incidents.

Controls are classed by nature as administrative, technical or physical. Security awareness training is which type?`,
    hint: 'Training is about people, policy and process - not technology and not the physical world. Which category is that?',
    answers: ['administrative', 'administrative control', 'admin', 'administrative controls'],
    xp: 20,
    explanation: `Security awareness training is an ADMINISTRATIVE control - the human-and-paper layer of policies, procedures, training, background checks and segregation of duties. (By function it is preventive: it reduces the chance of a successful attack.)

Controls by nature:
  Administrative  People/policy/process (training, policies, screening)
  Technical       Implemented in technology (MFA, encryption, firewalls)
  Physical        Act in the real world (locks, guards, badge readers, CCTV)

The two classifications combine - every control has both a function and
a nature:
  MFA                       = Preventive  + Technical
  Security awareness        = Preventive  + Administrative
  Server-room badge lock    = Preventive  + Physical
  SIEM alerting             = Detective   + Technical
  CCTV camera               = Detective   + Physical
  Backup/restore            = Corrective  + Technical/Administrative

Being able to place any control in both grids on demand is core GRC.`
  },

  // ── ACT 3: Resilience and the law ─────────────────────────────────────────
  {
    id: 'grc-10',
    title: 'Set the RTO',
    objective: `SafiPay's Business Impact Analysis ranks the live payments-processing engine as the most critical system - every minute it is down means lost transactions and furious customers. The business states that the maximum tolerable downtime for this system is 4 hours.

Which recovery objective does "maximum tolerable DOWNTIME" define, and what is its value here?

Type the value (how long the system may be down).`,
    hint: 'Downtime = how long you can be DOWN = Recovery Time Objective (RTO). The business said 4 hours.',
    answers: ['4 hours', '4', '4h', '4hr', 'four hours', 'rto 4 hours'],
    xp: 20,
    explanation: `Maximum tolerable DOWNTIME is the Recovery Time Objective (RTO). Here RTO = 4 hours: the payments engine must be restored within 4 hours of a failure.

RTO vs RPO - do not confuse them:
  RTO = how long you can be DOWN   (look FORWARD from the failure)
  RPO = how much DATA you can lose (look BACKWARD from the failure)

A 4-hour RTO implies a recovery architecture that can fail over fast -
a hot or warm standby, not a cold rebuild from scratch. Tighter RTOs
cost more, so they are a BUSINESS decision driven by the BIA, not a
value you set to "as fast as possible" for everything.`
  },
  {
    id: 'grc-11',
    title: 'Set the RPO',
    objective: `For the same payments engine, the business states that losing more than 15 minutes of transaction data in a disaster would be unacceptable - customers' money movements must be recoverable to within 15 minutes of the failure.

Which recovery objective does "maximum tolerable DATA LOSS" define, and what is its value here?

Type the value (how much data, in time, may be lost).`,
    hint: 'Data loss = how far back your last recovery point can be = Recovery Point Objective (RPO). The business said 15 minutes.',
    answers: ['15 minutes', '15', '15 min', '15m', 'fifteen minutes', 'rpo 15 minutes'],
    xp: 15,
    explanation: `Maximum tolerable DATA LOSS is the Recovery Point Objective (RPO). Here RPO = 15 minutes: at most 15 minutes of transactions may be lost.

Crucially, a 15-minute RPO CANNOT be met by a nightly backup - a nightly
backup could lose up to 24 hours of data. A 15-minute RPO demands
near-continuous replication (every few minutes) or a database with
point-in-time recovery.

  RTO = 4 hours     -> hot/warm standby to come back fast
  RPO = 15 minutes  -> replicate transactions every few minutes

Both flow independently from the BIA. GRC's job is to make the cost
trade-off explicit: a 15-minute RPO costs real money in replication;
the business decides which systems are worth it.`
  },
  {
    id: 'grc-12',
    title: 'Flag the Breach-Notification Obligation',
    objective: `SafiPay discovers a breach of personal data that poses a real risk to its customers. Under Kenya's Data Protection Act, 2019 (which mirrors GDPR), the organisation must notify the Data Commissioner within a specific maximum timeframe of becoming aware of the breach.

Within how many hours must the breach be notified to the Data Commissioner?`,
    hint: 'The Kenya DPA mirrors the famous GDPR breach-notification deadline. It is the same number of hours as GDPR: 72.',
    answers: ['72 hours', '72', '72 hrs', '72h', 'seventy-two hours', 'within 72 hours'],
    flag: 'GHOST{breach_notify_72_hours}',
    xp: 20,
    explanation: `Kenya's Data Protection Act, 2019 - like GDPR - requires notification of a qualifying personal-data breach to the Data Commissioner (ODPC) within 72 hours of becoming aware, where the breach poses a real risk to data subjects.

Why this drives real engineering and contracts:
  - You must DETECT breaches fast enough to have time to notify.
  - Your incident response plan must include the notification decision
    and who makes it (often the CISO or Data Protection Officer).
  - Vendor contracts must oblige suppliers to tell YOU fast - if a
    critical vendor takes two weeks to report, your 72-hour clock has
    already expired before you even knew.

Kenya context also includes the Computer Misuse and Cybercrimes Act,
2018, which criminalises unauthorised access - the law that defines the
legal line around offensive skills. The difference between a paid
pentest and a crime is written authorisation.`
  },
  {
    id: 'grc-13',
    title: 'Assess the Vendor',
    objective: `SafiPay is onboarding a payroll provider that will hold every employee's bank details and national ID - a critical vendor. Rather than invent your own questions, you want to send a recognised, standardised security questionnaire so you can assess them efficiently and compare them against others.

Name one of the two industry-standard vendor security questionnaires.`,
    hint: 'The two standards are the SIG (Standardized Information Gathering) and the CAIQ (Consensus Assessments Initiative Questionnaire). Either is accepted.',
    answers: ['sig', 'caiq', 'sig questionnaire', 'standardized information gathering', 'consensus assessments initiative questionnaire', 'sig lite'],
    xp: 20,
    explanation: `The two standard vendor questionnaires are the SIG (Standardized Information Gathering, from Shared Assessments) and the CAIQ (Consensus Assessments Initiative Questionnaire, from the Cloud Security Alliance, mapped to the Cloud Controls Matrix).

Standardised questionnaires let you assess vendors efficiently and
compare them on the same questions, instead of every company inventing
bespoke forms.

For a CRITICAL vendor, collect more than a questionnaire:
  - SOC 2 Type II report (read it, do not just file it)
  - ISO 27001 certificate + Statement of Applicability
  - Completed SIG or CAIQ
  - Their sub-processors list (fourth-party risk)
  - A breach-notification commitment faster than your own 72-hour clock
  - Re-collect on a schedule - a clean report from two years ago tells
    you nothing about today.

Outsourcing the function never outsources the accountability.`
  },

  // ── ACT 4: Prove it and report it ─────────────────────────────────────────
  {
    id: 'grc-14',
    title: 'Choose the Evidence',
    objective: `The external auditor says: "You claim access rights are reviewed quarterly. Prove it." A verbal assurance will not satisfy them - they want an artefact that shows the control actually OPERATED across the period.

What is the single best piece of evidence to hand the auditor to prove quarterly access reviews happened?`,
    hint: 'Auditors want proof a control RAN, not a claim. Think: the dated, signed records of each quarterly access review.',
    answers: ['access review records', 'access review logs', 'user access review', 'access review', 'signed access review records', 'quarterly access review records'],
    xp: 20,
    explanation: `The best evidence is the dated, signed access-review records for each quarter - showing who reviewed access, when, which accounts were examined, and what actions were taken (e.g. access removed for leavers).

Evidence is the currency of audit. A CLAIM is "we review access
quarterly." EVIDENCE is the four quarterly records proving it happened.

Claim                       Evidence an auditor accepts
-------------------------   ---------------------------------
"Access reviewed quarterly" Signed quarterly access-review records
"We require MFA"            IdP policy export + sample auth logs
"We patch critical servers" Patch report + dated change tickets
"Staff are trained"        Training completion report with dates
"We can restore backups"   A dated SUCCESSFUL restore-test record

Design evidence IN when you build a control: ask "what artefact will
prove this ran?" If the answer is "nothing," the control is unauditable.`
  },
  {
    id: 'grc-15',
    title: 'Write the Risk-Register Severity',
    objective: `You are adding the unpatched, no-MFA customer database server to the risk register. Using SafiPay's 5x5 matrix (severity = Likelihood x Impact), you rate it:

  Likelihood = 4 (Likely)
  Impact     = 5 (Severe)

That gives a score of 20. On the bands Low (1-4), Medium (5-9), High (10-14), Critical (15-25), what SEVERITY do you record?`,
    hint: 'Score = 4 x 5 = 20. On the bands given, 15-25 is the top band.',
    answers: ['critical', 'critical risk', 'critical severity'],
    xp: 15,
    explanation: `Likelihood 4 x Impact 5 = 20, which falls in the 15-25 band = CRITICAL.

The 5x5 matrix turns two ordinal judgements into a single severity that
non-technical leaders instantly grasp:
  Score 1-4   = Low
  Score 5-9   = Medium
  Score 10-14 = High
  Score 15-25 = Critical

A good risk-register row reads as a decision - risk, owner, likelihood,
impact, score, severity, treatment, status:

  R-001  Customer PII DB breach (unpatched, no MFA)
         Owner: CISO   L:4  I:5  Score:20  CRITICAL
         Treatment: Reduce (MFA, patch, segment, monitor)
         Status: In progress

Every row has exactly ONE accountable owner. Two owners means zero.`
  },
  {
    id: 'grc-16',
    title: 'Pick the SOC 2 Report Type',
    objective: `SafiPay's biggest enterprise customer will not accept a point-in-time snapshot of control design. They demand proof that SafiPay's controls OPERATED EFFECTIVELY across a continuous six-month observation window.

SOC 2 reports come as Type I (design at a point in time) or Type II (operating effectiveness over a period). Which type does the customer require?`,
    hint: 'Design at a point in time = Type I. Operating effectiveness over a period = Type II. The customer wants the "over a period" one.',
    answers: ['type ii', 'type 2', 'soc 2 type ii', 'soc 2 type 2', 'type-ii', 'type two'],
    flag: 'GHOST{soc2_type_two_complete}',
    xp: 20,
    explanation: `The customer requires a SOC 2 TYPE II report - it tests whether controls OPERATED EFFECTIVELY over a period (typically 3-12 months), not just whether they were suitably designed at a single moment.

SOC 2 Type I vs Type II:
  Type I   "Were controls suitably DESIGNED on 30 June?"
           A point-in-time snapshot. Faster, cheaper, proves less.
  Type II  "Did controls OPERATE EFFECTIVELY from 1 Jan to 30 June?"
           A film, not a photo. Slower, costlier, proves far more.

Enterprise customers almost always demand Type II because design
without sustained operation proves nothing about whether you were
actually secure all year. A common path: earn a Type I first to show
design, then run the observation window and earn a Type II.

============================================================
LAB COMPLETE. You classified an asset, quantified risk (SLE/ALE),
chose a treatment, mapped gaps to NIST CSF 2.0 and ISO 27001,
classified controls, set RTO/RPO, flagged the Kenya DPA 72-hour
clock, assessed a vendor, chose audit evidence, scored a register
row and passed the audit. This is the daily work of a GRC
professional - and now you can speak it fluently.`
  },
]

const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

export default function GrcLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_grc-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#8a7a4a' }}>
        <Link href="/" style={{ color: '#8a7a4a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/grc" style={{ color: '#8a7a4a', textDecoration: 'none' }}>GRC</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/grc" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #3a3018', borderRadius: '3px', color: '#8a7a4a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(224,175,104,0.1)', border: '1px solid rgba(224,175,104,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(224,175,104,0.04)', border: '1px solid rgba(224,175,104,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#3a3018', border: p.active ? '2px solid ' + accent : '1px solid #3a3018', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#5a4a2a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#3a3018', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a7a4a' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP &nbsp;·&nbsp; {steps.length} STEPS
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE — LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* Section index */}
      <div style={{ background: 'rgba(224,175,104,0.02)', border: '1px solid rgba(224,175,104,0.08)', borderRadius: '6px', padding: '12px 16px', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ fontSize: '7px', color: '#7a6a3a', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS — THE AUDITOR ARRIVES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '6px' }}>
          {[
            { section: '01–04', title: 'Know what you protect: classify, quantify (SLE/ALE), residual', steps: '4 steps' },
            { section: '05–09', title: 'Treat, map (CSF + ISO 27001) and classify controls', steps: '5 steps' },
            { section: '10–13', title: 'Resilience (RTO/RPO), the Kenya DPA clock, vendor risk', steps: '4 steps' },
            { section: '14–16', title: 'Prove it: evidence, register severity, SOC 2 Type II', steps: '3 steps' },
          ].map(s => (
            <div key={s.section} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '7px', color: accent + '66', flexShrink: 0, minWidth: '30px' }}>{s.section}</span>
              <div>
                <div style={{ fontSize: '7.5px', color: '#9a8a5a' }}>{s.title}</div>
                <div style={{ fontSize: '6.5px', color: '#5a4a2a', marginTop: '1px' }}>{s.steps}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHASE 1: Guided Learning ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(224,175,104,0.1)', border: '1px solid rgba(224,175,104,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a4a2a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED SCENARIO</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>The Auditor Arrives</h1>
          </div>
        </div>

        <p style={{ color: '#7a6a4a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          You are the new security lead at SafiPay, a Nairobi fintech preparing for its first SOC 2 and ISO 27001 audits.
          {' '}{steps.length} steps take you through classifying an asset, quantifying risk with SLE and ALE, choosing a treatment,
          mapping gaps to NIST CSF 2.0 and ISO 27001 Annex A, classifying controls, setting RTO and RPO, flagging the Kenya DPA
          breach clock, assessing a vendor, choosing audit evidence and passing the audit. Read every explanation — they go
          well beyond the answer.
        </p>

        <div style={{ background: 'rgba(224,175,104,0.03)', border: '1px solid rgba(224,175,104,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#7a6a3a', letterSpacing: '0.25em', marginBottom: '8px' }}>SKILLS DEVELOPED</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {[
              'Data classification',
              'Asset valuation',
              'SLE = AV x EF',
              'ALE = SLE x ARO',
              'Inherent vs residual risk',
              'Risk appetite',
              'Risk treatment (4 options)',
              'NIST CSF 2.0 functions',
              'ISO 27001 Annex A mapping',
              'Control functions (prev/det/corr)',
              'Control nature (admin/tech/phys)',
              'RTO vs RPO',
              'Business Impact Analysis',
              'Kenya DPA 2019 72-hour clock',
              'Vendor assessment (SIG/CAIQ)',
              'Audit evidence',
              'Risk register severity',
              'SOC 2 Type I vs II',
            ].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#8a7a3a', background: 'rgba(224,175,104,0.06)', border: '1px solid rgba(224,175,104,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="grc-lab"
          moduleId={moduleId}
          title="The Auditor Arrives"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* ── PHASE 2: Free Lab ── */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(224,175,104,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(224,175,104,0.4)' : '#3a3018'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a4a2a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#9a8a5a' : '#5a4a2a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE GRC WORKSPACE</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#5a4a2a' }}>Open GRC Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(224,175,104,0.04)' : '#0a0803', border: '1px solid ' + (guidedDone ? 'rgba(224,175,104,0.25)' : '#1a1408'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />
            )}
            <div style={{ fontSize: '7px', color: guidedDone ? '#8a7a3a' : '#3a3018', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR OPEN PRACTICE' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#5a4a2a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FREE GRC WORKSPACE
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#7a6a4a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form workspace — practise risk statements, control mappings and audit prep with no guided prompts
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: '2rem' }}>
              {[
                'Draft a risk register row',
                'Compute SLE / ALE',
                'Map gaps to CSF + ISO 27001',
                'Classify any control',
                'Set RTO / RPO',
                'Plan an audit evidence pack',
              ].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#3a3018' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#9a8a5a' : '#3a3018' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em',
                padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(224,175,104,0.6)' : '#3a3018'),
                borderRadius: '6px', background: guidedDone ? 'rgba(224,175,104,0.12)' : 'transparent',
                color: guidedDone ? accent : '#3a3018', cursor: guidedDone ? 'pointer' : 'not-allowed',
                boxShadow: guidedDone ? '0 0 24px rgba(224,175,104,0.18)' : 'none', transition: 'all 0.2s',
              }}
            >
              {guidedDone ? 'LAUNCH FREE GRC WORKSPACE' : 'COMPLETE THE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && (
              <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a3018' }}>
                Complete all {steps.length} guided steps above to unlock the free workspace
              </div>
            )}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#0a0803' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0d0a03', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a7a3a' }}>
                Free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for deeper explanations on any risk, control, framework or audit question.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowKeywords(!showKeywords)}
          style={{ background: 'transparent', border: '1px solid #3a3018', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a7a3a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0, transition: 'all 0.15s' }}
        >
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — GRC FORMULAS, FRAMEWORKS & TERMS
        </button>
        {showKeywords && (
          <div style={{ background: '#0d0a03', border: '1px solid #1f1a0d', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['SLE = AV x EF', 'Single Loss Expectancy = Asset Value x Exposure Factor'],
                ['ALE = SLE x ARO', 'Annualised Loss Expectancy (expected loss per year)'],
                ['Inherent vs residual', 'Risk before controls vs risk remaining after controls'],
                ['Risk appetite', 'Risk level leadership agrees to tolerate'],
                ['Reduce / Transfer / Avoid / Accept', 'The four risk treatments'],
                ['NIST CSF 2.0', 'Govern, Identify, Protect, Detect, Respond, Recover'],
                ['NIST RMF (800-37)', '7 steps: Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor'],
                ['NIST SP 800-53', 'Exhaustive control catalogue (AC, IA, SC families...)'],
                ['CIS Controls v8', '18 prioritised controls; IG1/IG2/IG3 implementation groups'],
                ['ISO 27001:2022', 'Certifiable ISMS; Annex A = 93 controls, 4 themes'],
                ['ISO 31000', 'Principles-based, any-risk management standard'],
                ['FAIR', 'Quantify risk in money: frequency x magnitude'],
                ['Preventive / Detective / Corrective', 'Controls by function'],
                ['Administrative / Technical / Physical', 'Controls by nature'],
                ['RTO', 'Recovery Time Objective — max tolerable downtime'],
                ['RPO', 'Recovery Point Objective — max tolerable data loss'],
                ['BIA', 'Business Impact Analysis — ranks processes by criticality'],
                ['3-2-1 backup', '3 copies, 2 media, 1 off-site (+1 immutable vs ransomware)'],
                ['Kenya DPA 2019', 'ODPC; 72-hour breach notice; data-subject rights'],
                ['Computer Misuse & Cybercrimes Act 2018', 'Criminalises unauthorised access'],
                ['PCI DSS 4.0', '12 requirements for payment card data'],
                ['SOC 2 Type I vs II', 'Design at a point in time vs operation over a period'],
                ['SIG / CAIQ', 'Standard vendor security questionnaires'],
                ['SBOM', 'Software Bill of Materials — components inside software'],
                ['RACI', 'Responsible, Accountable, Consulted, Informed'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#0a0803', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.7rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#7a6a4a', fontSize: '0.68rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1f1a0d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '10px' }}>
        <Link href="/modules/grc" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#8a7a3a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#8a7a3a' }}>ALL MODULES &#8594;</Link>
      </div>
    </div>
  )
}
