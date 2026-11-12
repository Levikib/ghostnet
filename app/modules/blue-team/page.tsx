'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '@/app/components/ModuleCodex'

const mono = 'JetBrains Mono, monospace'
const accent = '#4dd0e1'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && (
      <div style={{ fontFamily: mono, fontSize: '9px', color: '#4a7a80', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>
        {label}
      </div>
    )}
    <pre style={{
      background: '#040809', border: '1px solid #16282c', borderRadius: '4px',
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
    color: '#26a6b8', marginTop: '2rem', marginBottom: '0.75rem'
  }}>
    &#9658; {children}
  </h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a9c', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
    {children}
  </p>
)

const Note = ({ type, children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: ['#4dd0e1', 'rgba(77,208,225,0.05)', 'NOTE'],
    warn: ['#ffb347', 'rgba(255,179,71,0.05)', 'WARNING'],
    danger: ['#ff4136', 'rgba(255,65,54,0.05)', 'CRITICAL'],
    tip: ['#00ff41', 'rgba(0,255,65,0.05)', 'TIP'],
  }
  const [color, bg, label] = configs[type || 'info']
  return (
    <div style={{
      background: bg, borderLeft: '3px solid ' + color,
      padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0',
      margin: '1.5rem 0', border: '1px solid ' + color + '33', borderLeftColor: color
    }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a9c', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #16282c' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#26a6b8', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #0c181a', background: i % 2 === 0 ? 'transparent' : 'rgba(77,208,225,0.015)' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '8px 12px', color: '#8a9a9c', verticalAlign: 'top' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'soc-defender-mindset',
    title: 'The SOC and the Defender Mindset',
    difficulty: 'BEGINNER',
    readTime: '14 min',
    takeaways: [
      'A SOC is a detection-and-response function, not a room full of screens: people, process and telemetry working together to shorten the time an attacker goes unnoticed.',
      'Tiered models (L1 triage, L2 investigation, L3 hunting and engineering) are still common, but mature SOCs blur the tiers and push automation into L1 work.',
      'MTTD and MTTR only mean something when you define the start and end timestamps precisely and measure them the same way every month.',
      'Alert fatigue is an engineering failure, not an analyst failure: every alert must be actionable, documented and owned, or it should be tuned or deleted.',
      'The defender mindset assumes breach, thinks in attack paths rather than single events, and treats every closed alert as data for improving detections.',
    ],
    content: (
      <div>
        <H3>What a Security Operations Centre Actually Does</H3>
        <P>
          Every offensive module in GHOSTNET ends in the same place: an attacker on a network doing something they should not. This module is about the other side of that story. A Security Operations Centre (SOC) is the function inside an organisation, or provided to it by a managed service, that watches for those attackers, decides which signals are real, and drives the response when they are. It is tempting to picture a dark room with a video wall, but the room is the least important part. A SOC is three things working together: telemetry (the logs and sensor data you collect), people who can interpret that telemetry, and processes that turn interpretation into consistent action.
        </P>
        <P>
          The core loop is simple to state and hard to do well. Collect data from endpoints, servers, network sensors, identity providers and cloud platforms. Run detections against that data. Triage the alerts those detections produce. Investigate the ones that look real. Respond by containing and eradicating the threat. Then feed what you learned back into the detections and the hardening work so the same attack is caught earlier, or blocked outright, next time. Everything else in this module, from Sigma rules to Volatility, is a tool for one stage of that loop.
        </P>

        <H3>Tiers and Roles</H3>
        <P>
          The classic SOC structure splits analysts into tiers by depth of investigation. The model is still widely used for staffing and career paths, even though modern teams increasingly organise around functions (detection engineering, incident response, threat hunting) rather than strict escalation ladders.
        </P>
        <Table
          headers={['Role', 'Main Responsibility', 'Typical Output']}
          rows={[
            ['L1 / Triage analyst', 'Work the alert queue, enrich, decide benign vs suspicious, escalate', 'Closed alerts with notes, escalated tickets'],
            ['L2 / Incident responder', 'Deep investigation, scoping, containment actions, coordination', 'Incident timeline, containment decisions, IR ticket'],
            ['L3 / Threat hunter', 'Proactive hypothesis-driven searches for undetected activity', 'Hunt reports, new detection ideas'],
            ['Detection engineer', 'Write, test, tune and version detections; own detection coverage', 'Rules in a repo, coverage maps, tuning changes'],
            ['Threat intelligence analyst', 'Track adversaries, produce relevant intel, manage IOCs/TTPs', 'Intel reports, curated feeds, hunt leads'],
            ['Forensic analyst', 'Evidence acquisition and analysis of disks, memory and logs', 'Forensic reports, artefact timelines'],
            ['SOC manager / IR lead', 'Staffing, metrics, stakeholder communication, incident command', 'Metrics reports, post-incident reviews'],
          ]}
        />
        <P>
          In a small company one person may wear all of these hats. In a large enterprise or MSSP each may be a team. What matters is that every responsibility has an owner. A detection that nobody owns will decay: the log source changes format, the rule silently stops matching, and nobody notices until the incident review.
        </P>

        <H3>The Alert Lifecycle</H3>
        <P>
          An alert moves through predictable states. Understanding them is how you avoid the two classic failures: closing a real incident as noise, and drowning a real incident in a queue of noise.
        </P>
        <Pre label="ALERT LIFECYCLE IN A TYPICAL SOAR / CASE TOOL">
{`[NEW] --triage--> [IN PROGRESS] --verdict--> [CLOSED: True Positive  -> escalate to incident]
                                        |--> [CLOSED: Benign True Positive (real, but allowed)]
                                        |--> [CLOSED: False Positive  -> tuning ticket raised]
                                        '--> [ESCALATED to L2]  --scoping--> [INCIDENT]

Every closure records: verdict, evidence checked, analyst, time spent.
Those fields are what your metrics and tuning backlog are built from.`}
        </Pre>
        <P>
          Notice the category &quot;benign true positive&quot;. The rule fired correctly, the behaviour really happened, but it was authorised: an administrator ran PsExec during a maintenance window, or a vulnerability scanner triggered a port scan alert. Separating these from false positives (the rule matched something it should not have) matters, because the fix is different. A false positive means the rule logic is wrong. A benign true positive means you need context, such as an allowlist of scanner IPs or a change-ticket lookup.
        </P>

        <H3>Metrics: MTTD, MTTR and Their Traps</H3>
        <P>
          Two metrics dominate SOC reporting. Mean Time To Detect (MTTD) is the average time from when malicious activity begins to when the SOC becomes aware of it. Mean Time To Respond (MTTR, sometimes split into Mean Time To Contain and Mean Time To Recover) is the average time from detection to the threat being contained or resolved. Industry reports such as Mandiant M-Trends track global median dwell time (start of intrusion to detection), which has fallen from over 400 days a decade ago to roughly 10-11 days in recent years, while ransomware operators can go from initial access to encryption in under 24 hours. The gap between those numbers is the whole argument for investing in detection.
        </P>
        <Table
          headers={['Metric', 'Start timestamp', 'End timestamp', 'Common trap']}
          rows={[
            ['MTTD', 'First malicious event (often known only after investigation)', 'First alert or human awareness', 'Only measurable after the fact; easy to fudge by picking a late start'],
            ['MTTA (acknowledge)', 'Alert created', 'Analyst picks it up', 'Gamed by clicking acknowledge without working the alert'],
            ['MTTC (contain)', 'Detection', 'Host isolated / account disabled', 'Ignores partial containment that missed other hosts'],
            ['MTTR (resolve)', 'Detection', 'Incident closed', 'Pressure to close early hides incomplete eradication'],
            ['False positive rate', 'n/a', 'n/a', 'Per-rule rate matters more than the global average'],
          ]}
        />
        <Note type="warn">
          Means are distorted by outliers: one six-month-old intrusion found during a hunt can wreck your MTTD average for the year. Report medians and percentiles (p50, p90) alongside means, and always publish the definitions you used. A metric whose definition changes between quarters is worse than no metric.
        </Note>
        <P>
          Good SOCs also measure things that show coverage and quality rather than speed: the percentage of critical assets sending logs, the number of ATT&amp;CK techniques with at least one tested detection, the share of alerts that are auto-enriched, and how many incidents were found by a hunt or a third party rather than by your own alerts. A rising share of incidents reported by outsiders is a red flag that detection is failing.
        </P>

        <H3>Alert Fatigue</H3>
        <P>
          Alert fatigue is what happens when analysts see so many low-value alerts that they stop investigating carefully. It is the single most common reason real intrusions get closed as noise; post-incident reviews regularly find that the critical alert fired, was looked at for thirty seconds, and was closed because the same rule had produced 400 false positives that month. The fix is engineering discipline, not more staff:
        </P>
        <Table
          headers={['Practice', 'What it means in practice']}
          rows={[
            ['Every alert is actionable', 'If the analyst has no decision to make, it is a report or a dashboard, not an alert'],
            ['Every rule has a runbook', 'What to check, what benign looks like, when to escalate'],
            ['Every rule has an owner', 'Someone reviews its false positive rate monthly'],
            ['Severity reflects impact', 'High means drop everything; if everything is high, nothing is'],
            ['Automate enrichment', 'SOAR adds user, asset, geo-IP, reputation and recent alerts before a human looks'],
            ['Risk-based alerting', 'Low-fidelity signals add risk scores to an entity; alert only when the score crosses a threshold'],
            ['Delete dead rules', 'A rule that has never fired true in a year, and is not covering a critical technique, is cost without value'],
          ]}
        />
        <P>
          Risk-based alerting deserves emphasis. Instead of firing an alert every time someone runs whoami, a rule adds 10 risk points to that user and host. Encoded PowerShell adds 40. A new service install adds 30. When an entity crosses 100 within 24 hours, a single high-fidelity alert fires that lists all the contributing observations. Splunk Enterprise Security, Microsoft Sentinel (via entity behaviour analytics and incident grouping) and Elastic all support variants of this approach.
        </P>

        <H3>AI in the 2026 SOC</H3>
        <P>
          By 2026 most SIEM and EDR vendors ship LLM-based assistants that summarise alerts, draft queries and propose triage verdicts, and many teams run agentic workflows that enrich and pre-triage L1 alerts automatically. These tools genuinely cut toil, but they inherit the quality of the underlying telemetry and they can be confidently wrong. Treat their output as a junior analyst's notes: useful, fast, and always verified against the raw events before an action like disabling an executive's account. Attackers also target these pipelines, for example by planting prompt-injection text in fields an AI assistant will read, such as email subjects or user-agent strings.
        </P>

        <H3>The Defender Mindset</H3>
        <P>
          John Lambert's well-known line is that defenders think in lists while attackers think in graphs. A defender with a list sees ten unrelated medium alerts. An attacker sees a path: phishing email, user workstation, cached admin credential, file server, domain controller. Thinking like a defender means deliberately thinking in graphs too. When you see one suspicious event, ask what must have happened before it for it to be possible, and what the attacker would do next if it is real. Then go and look for those events.
        </P>
        <Pre label="QUESTIONS EVERY ANALYST ASKS ON EVERY ALERT">
{`1. What exactly happened?        (process, user, host, time, command line)
2. Is it expected here?           (baseline: has this host/user done this before?)
3. What happened just before it?  (parent process, logon, email, download)
4. What happened just after it?   (network connections, child processes, new files)
5. Where else has it happened?    (same hash, same domain, same user on other hosts)
6. What is the blast radius?      (privileges of the account, data on the host)
7. What do I do now?              (close with evidence, escalate, or contain)`}
        </Pre>
        <P>
          Finally, assume breach. Prevention will fail eventually: a zero-day, a phished MFA push, a contractor's laptop. A defender who assumes breach invests in visibility and response, practises incident handling before it is needed, and measures success not by &quot;nothing happened&quot; but by how quickly and completely the team found and removed the thing that did.
        </P>
      </div>
    ),
  },
  {
    id: 'logs-that-matter',
    title: 'Logs That Matter',
    difficulty: 'BEGINNER',
    readTime: '18 min',
    labLink: '/modules/blue-team/lab',
    takeaways: [
      'Learn a short list of high-value Windows Security events by heart: 4624/4625 logons, 4688 process creation, 4720 account creation, 4768/4769 Kerberos, 7045 service install and 1102 log cleared.',
      'Default Windows auditing is not enough: enable command-line capture for 4688, PowerShell script block logging (4104), and deploy Sysmon with a maintained configuration.',
      'On Linux, authentication lives in auth.log or secure (or only in the journal on minimal modern installs); auditd gives you execve-level process telemetry.',
      'Network-adjacent logs (DNS, proxy, web server) answer the question every investigation needs: what did this host talk to, and when?',
      'Cloud control planes are logged separately: CloudTrail, Entra ID sign-in and audit logs, and GCP Cloud Audit Logs must be collected deliberately and protected from tampering.',
      'A log you never collected cannot be searched during an incident: logging decisions are detection decisions made in advance.',
    ],
    content: (
      <div>
        <H3>Why Log Selection Is a Security Decision</H3>
        <P>
          Investigations live or die on telemetry. When an incident responder asks &quot;did the attacker run anything on the file server?&quot; the answer is either in a log you collected months ago or it is lost. Collecting everything is unaffordable (SIEM licences are usually priced by ingest volume) and noisy, so defenders choose. This chapter covers the sources that repeatedly prove decisive in real intrusions, what the key fields mean, and the configuration you need so they actually contain useful data.
        </P>
        <Note type="info">
          In this module Windows paths are written with forward slashes (C:/Windows/System32) inside code blocks. On a real system they use backslashes. The meaning is identical.
        </Note>

        <H3>Windows Security Event IDs You Must Know</H3>
        <Table
          headers={['Event ID', 'Log', 'Meaning', 'Why defenders care']}
          rows={[
            ['4624', 'Security', 'Successful logon', 'Who logged on where, how (Logon Type) and from which IP; lateral movement shows up here'],
            ['4625', 'Security', 'Failed logon', 'Brute force and password spraying; Status/SubStatus codes tell you why it failed'],
            ['4672', 'Security', 'Special privileges assigned to new logon', 'Admin-equivalent logons; pair with 4624 to spot privileged sessions'],
            ['4688', 'Security', 'Process created', 'Execution evidence; only useful once command-line auditing is enabled'],
            ['4720', 'Security', 'User account created', 'Persistence via new accounts; should match a ticket'],
            ['4728/4732/4756', 'Security', 'Member added to global/local/universal security group', 'Privilege escalation, e.g. added to Domain Admins'],
            ['4768', 'Security (DC)', 'Kerberos TGT requested', 'AS-REP roasting (pre-auth type 0), logons from odd IPs'],
            ['4769', 'Security (DC)', 'Kerberos service ticket requested', 'Kerberoasting: bursts of requests with encryption type 0x17 (RC4)'],
            ['4776', 'Security (DC)', 'NTLM credential validation', 'NTLM use where Kerberos is expected; spraying over NTLM'],
            ['4698', 'Security', 'Scheduled task created', 'Common persistence mechanism'],
            ['7045', 'System', 'New service installed', 'PsExec-style lateral movement, malware persistence'],
            ['1102', 'Security', 'Audit log cleared', 'Almost never legitimate; a high-severity alert on its own'],
            ['4104', 'PowerShell/Operational', 'Script block logged', 'Captures de-obfuscated PowerShell code as it runs'],
          ]}
        />

        <H3>Reading a 4624 and a 4625</H3>
        <P>
          Logon events carry a Logon Type that tells you how the session was created. Memorise the common ones; they change the meaning of the event completely. A Type 10 logon to a domain controller from a finance workstation is very different from a Type 3 network logon caused by a mapped drive.
        </P>
        <Table
          headers={['Logon Type', 'Name', 'Typical cause']}
          rows={[
            ['2', 'Interactive', 'Keyboard at the console'],
            ['3', 'Network', 'SMB share access, PsExec, WinRM, most lateral movement tools'],
            ['4', 'Batch', 'Scheduled tasks'],
            ['5', 'Service', 'Service started under an account'],
            ['7', 'Unlock', 'Workstation unlocked'],
            ['8', 'NetworkCleartext', 'Credentials sent in cleartext, e.g. IIS basic auth'],
            ['9', 'NewCredentials', 'runas /netonly; also seen with some pass-the-hash tooling'],
            ['10', 'RemoteInteractive', 'RDP'],
            ['11', 'CachedInteractive', 'Logon with cached domain credentials, no DC reachable'],
          ]}
        />
        <Pre label="EVENT 4625 (ABRIDGED) - FAILED LOGON">
{`Log Name:      Security
Event ID:      4625
TimeCreated:   2026-11-03T21:41:07.392Z
Computer:      DC01.corp.example

Account For Which Logon Failed:
    Account Name:        a.patel
    Account Domain:      CORP
Failure Information:
    Failure Reason:      Unknown user name or bad password.
    Status:              0xC000006D
    Sub Status:          0xC000006A        <- correct username, wrong password
Process Information:
    Caller Process Name: -
Network Information:
    Workstation Name:    WS-FIN-042
    Source Network Address: 10.20.30.42
Detailed Authentication Information:
    Logon Type:          3
    Authentication Package: NTLM`}
        </Pre>
        <Table
          headers={['SubStatus', 'Meaning', 'Investigative value']}
          rows={[
            ['0xC0000064', 'User name does not exist', 'Many of these = username enumeration or a stale wordlist'],
            ['0xC000006A', 'Correct user, wrong password', 'The attacker knows valid accounts'],
            ['0xC0000234', 'Account locked out', 'Brute force tripping the lockout policy'],
            ['0xC0000072', 'Account disabled', 'Attempts on old accounts, possibly from leaked lists'],
            ['0xC0000071', 'Password expired', 'Often benign; a user returning from leave'],
            ['0xC0000193', 'Account expired', 'Contractor or leaver accounts being tried'],
          ]}
        />

        <H3>Process Creation: 4688 and Sysmon</H3>
        <P>
          Event 4688 is only enabled when &quot;Audit Process Creation&quot; is on, and it only includes the command line when the policy &quot;Include command line in process creation events&quot; is also enabled. Without that second setting you see that powershell.exe ran, but not what it was told to do, which is the part you need. Sysmon (System Monitor, part of Sysinternals) goes further, adding hashes, parent command lines, network connections and much more. Microsoft has begun shipping Sysmon as a built-in optional Windows feature, which removes the old deployment hurdle, but you still need a good configuration file; community baselines such as SwiftOnSecurity&apos;s and Olaf Hartong&apos;s sysmon-modular are the usual starting points.
        </P>
        <Table
          headers={['Sysmon ID', 'Event', 'Typical detection use']}
          rows={[
            ['1', 'Process creation', 'Command lines, parent-child chains, hashes'],
            ['3', 'Network connection', 'Which process talked to which IP and port'],
            ['7', 'Image loaded', 'DLL side-loading, unsigned modules'],
            ['8', 'CreateRemoteThread', 'Process injection'],
            ['10', 'ProcessAccess', 'Handles opened on lsass.exe (credential dumping)'],
            ['11', 'FileCreate', 'Payloads dropped to disk'],
            ['12/13/14', 'Registry create/set/rename', 'Run keys and other persistence'],
            ['15', 'FileCreateStreamHash', 'Mark-of-the-Web (Zone.Identifier) on downloads'],
            ['17/18', 'Named pipe created/connected', 'C2 frameworks using SMB named pipes'],
            ['22', 'DNS query', 'Per-process DNS, ties domains to binaries'],
            ['23/26', 'File delete (archived/logged)', 'Attacker clean-up'],
            ['25', 'Process tampering', 'Process hollowing and herpaderping'],
          ]}
        />
        <Pre label="SYSMON EVENT ID 1 (ABRIDGED)">
{`EventID:            1
UtcTime:            2026-11-03 21:17:44.118
Computer:           WS-FIN-042.corp.example
Image:              C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe
OriginalFileName:   PowerShell.EXE
CommandLine:        powershell.exe -nop -w hidden -enc SQBFAFgAIAAoAE4AZQB3AC0A...
User:               CORP/m.hale
IntegrityLevel:     Medium
Hashes:             SHA256=9F2C...E1A0
ParentImage:        C:/Windows/explorer.exe
ParentCommandLine:  C:/Windows/Explorer.EXE`}
        </Pre>
        <P>
          Note the OriginalFileName field. It comes from the PE version resource, so it still says PowerShell.EXE if an attacker copies powershell.exe to C:/Users/Public/notepad.exe. Detections keyed on OriginalFileName survive that renaming trick; detections keyed only on Image do not.
        </P>

        <H3>Turning Auditing On Properly</H3>
        <P>
          Many of the events above simply do not exist on a default Windows install. Configure Advanced Audit Policy through Group Policy (Computer Configuration, Windows Settings, Security Settings, Advanced Audit Policy Configuration) rather than the legacy basic categories, and verify the effective result on a real host with auditpol. Also raise the Security log maximum size well above the default, or a busy domain controller will overwrite the evidence you need within hours.
        </P>
        <Pre label="VERIFYING AUDIT POLICY ON A HOST">
{`C:/> auditpol /get /category:"Logon/Logoff","Detailed Tracking","Account Management"

Logon/Logoff
  Logon                                   Success and Failure
  Special Logon                           Success
Detailed Tracking
  Process Creation                        Success
Account Management
  User Account Management                 Success and Failure
  Security Group Management               Success

# Plus, via GPO:
#  Administrative Templates > System > Audit Process Creation >
#     "Include command line in process creation events" = Enabled
#  Administrative Templates > Windows Components > Windows PowerShell >
#     "Turn on PowerShell Script Block Logging" = Enabled`}
        </Pre>
        <P>
          Microsoft&apos;s published audit policy recommendations and the community Windows logging cheat sheets are good baselines. Whatever you choose, document it, because during an incident the first question about a missing event is always whether it was never generated or was generated and lost.
        </P>

        <H3>Linux: auth.log, syslog, journald and auditd</H3>
        <P>
          On Debian and Ubuntu, SSH and sudo activity goes to /var/log/auth.log; on RHEL, Rocky and Alma it is /var/log/secure. Be aware that minimal modern installs (Debian 12 and later, for example) may not install rsyslog at all, in which case those files do not exist and you must read the systemd journal with journalctl or forward it. For process-level visibility, the Linux Audit framework (auditd) can record every execve system call, giving you the Linux equivalent of 4688.
        </P>
        <Pre label="/var/log/auth.log AND auditd EXAMPLES">
{`Nov  3 22:05:13 bastion01 sshd[48211]: Failed password for invalid user oracle from 198.51.100.23 port 51122 ssh2
Nov  3 22:31:02 bastion01 sshd[49007]: Failed password for svc_backup from 10.20.30.42 port 50812 ssh2
Nov  3 22:31:09 bastion01 sshd[49011]: Accepted password for svc_backup from 10.20.30.42 port 50826 ssh2
Nov  3 22:33:40 bastion01 sudo: svc_backup : TTY=pts/1 ; PWD=/home/svc_backup ; USER=root ; COMMAND=/usr/bin/cat /etc/shadow

# auditd rule to log every program execution (64-bit ABI):
-a always,exit -F arch=b64 -S execve -k exec_log

# Query it:
$ ausearch -k exec_log --start today -i | grep -i curl
$ journalctl -u ssh --since "2026-11-03 22:00"`}
        </Pre>

        <H3>Web Server, DNS and Proxy Logs</H3>
        <P>
          Web server access logs reveal exploitation attempts against internet-facing applications: SQL injection strings, path traversal, web shell access (a POST to an image upload folder that returns 200), and scanners. DNS logs are arguably the highest-value network log per byte: almost every piece of malware resolves a domain before it connects, and DNS shows you which internal host asked, even when the payload itself is encrypted. Proxy logs (or secure web gateway logs) show full URLs, user agents and the authenticated user, linking a browsing event to a person.
        </P>
        <Pre label="WEB, DNS AND PROXY LOG LINES">
{`# Nginx access log - web shell being used
203.0.113.50 - - [03/Nov/2026:23:12:01 +0000] "POST /uploads/img/thumb.php HTTP/1.1" 200 312 "-" "Mozilla/5.0"

# Zeek dns.log (selected fields: ts, id.orig_h, query, qtype, answers)
1793740665.204  10.20.30.42  cdn-telemetry.example  A  192.0.2.66

# Proxy log
2026-11-03T21:17:46Z user=m.hale src=10.20.30.42 method=GET url=https://cdn-telemetry.example/s/upd.ps1 status=200 bytes=4821 ua="Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1"`}
        </Pre>
        <P>
          That proxy user agent is worth a second look: a WindowsPowerShell user agent fetching a .ps1 file from a domain nobody has visited before is a strong signal in its own right.
        </P>

        <H3>Cloud Logs</H3>
        <P>
          In cloud environments the most important actions never touch an operating system. Creating an access key, changing a storage bucket policy or disabling logging all happen through the provider&apos;s API, and are recorded in its control-plane audit log. AWS CloudTrail records management events by default for 90 days in Event History, but you need a trail (ideally an organisation trail to a locked-down log archive account) to retain them and to capture data events such as S3 object reads.
        </P>
        <Pre label="CLOUDTRAIL EVENT (ABRIDGED)">
{`{
  "eventTime": "2026-11-04T00:12:51Z",
  "eventSource": "iam.amazonaws.com",
  "eventName": "CreateAccessKey",
  "userIdentity": { "type": "IAMUser", "userName": "ci-deploy" },
  "sourceIPAddress": "203.0.113.77",
  "userAgent": "aws-cli/2.17.0",
  "requestParameters": { "userName": "backup-admin" }
}`}
        </Pre>
        <Table
          headers={['Provider', 'Key log', 'High-signal events']}
          rows={[
            ['AWS', 'CloudTrail (+ GuardDuty findings, VPC Flow Logs)', 'StopLogging, DeleteTrail, CreateAccessKey, AttachUserPolicy, ConsoleLogin without MFA'],
            ['Microsoft', 'Entra ID sign-in and audit logs, Azure Activity Log, Unified Audit Log', 'Risky sign-ins, new app consent grants, MFA method changes, inbox forwarding rules'],
            ['Google Cloud', 'Cloud Audit Logs (Admin Activity, Data Access)', 'SetIamPolicy, service account key creation, sink deletion'],
          ]}
        />
        <Note type="danger">
          Attackers who reach an admin role often try to disable logging first: event 1102 on Windows, StopLogging on CloudTrail, deleting a log sink in GCP. Ship logs off the source quickly, store them where the source admin cannot delete them, and alert on any attempt to stop collection.
        </Note>
      </div>
    ),
  },
  {
    id: 'siem-fundamentals',
    title: 'SIEM Fundamentals',
    difficulty: 'INTERMEDIATE',
    readTime: '17 min',
    labLink: '/modules/blue-team/lab',
    takeaways: [
      'A SIEM pipeline has four jobs: collect, parse, normalise and correlate. Most detection failures trace back to a broken parse or a missing field, not to bad rule logic.',
      'Normalisation to a common schema (Splunk CIM, Elastic ECS, Microsoft ASIM, OCSF) lets one detection work across many log sources.',
      'SPL is a pipeline language (search, then pipe into stats, eval, where); KQL in Kibana is a filter language, while ES|QL and Sentinel KQL are full pipeline languages.',
      'Correlation means joining events across sources and time: a failed-logon burst followed by a success from the same source is far stronger than either event alone.',
      'Always check that data is arriving: a silent log source is the most dangerous kind of false negative.',
    ],
    content: (
      <div>
        <H3>What a SIEM Is For</H3>
        <P>
          A Security Information and Event Management (SIEM) platform is the place where your telemetry from chapter 2 lands, becomes searchable, and gets evaluated against detection rules. Splunk Enterprise Security, Microsoft Sentinel, Elastic Security, Google SecOps (formerly Chronicle), IBM QRadar and open-source stacks such as Wazuh or OpenSearch with Security Analytics all solve the same problem with different trade-offs in cost, query language and scale. Increasingly, organisations also split storage from analytics: cheap data-lake storage for bulk logs, and a SIEM tier for the high-value data that feeds real-time detections.
        </P>
        <P>
          Whatever the product, the pipeline has the same stages. Understanding each one is what lets you debug the most common complaint in any SOC: &quot;why didn&apos;t my rule fire?&quot;
        </P>
        <Pre label="THE SIEM PIPELINE">
{`[Sources]            [Collection]           [Parsing]         [Normalisation]      [Analytics]
Windows EVTX  --->  Agent / WEF / Syslog -> extract fields -> map to schema    -> search, detections,
Sysmon               OTel / API pollers      (timestamp,      (src_ip, user,       correlation, dashboards,
Linux journald       Cloud connectors        host, user...)    process.name ...)   alerts -> case / SOAR
Zeek / firewalls
CloudTrail / Entra   ^ buffering, TLS,       ^ time zone!      ^ CIM / ECS /
                       backpressure            UTC always        ASIM / OCSF`}
        </Pre>

        <H3>Collection</H3>
        <P>
          Collection gets events from the source to the SIEM reliably. On Windows that might be the Splunk Universal Forwarder, the Elastic Agent, the Azure Monitor Agent, or native Windows Event Forwarding (WEF) to a collector server. Linux typically uses rsyslog or syslog-ng, or an agent reading the journal. Network devices send syslog. Cloud and SaaS logs are pulled via APIs or pushed into storage and ingested from there. OpenTelemetry collectors are increasingly used as a vendor-neutral transport layer.
        </P>
        <P>
          The questions that matter at this stage are reliability and integrity. Is the transport encrypted? What happens when the SIEM is unreachable: does the agent buffer, or drop events? Is there a heartbeat so you notice when a source goes quiet? A domain controller that stopped forwarding three weeks ago is invisible in a dashboard of event counts unless you specifically alert on silence.
        </P>

        <H3>Parsing and Normalisation</H3>
        <P>
          Parsing extracts structured fields from raw events: the timestamp, the host, the user, the source IP. Normalisation then maps vendor-specific field names onto a common schema so detections can be written once. A Windows event calls the source address IpAddress, a firewall calls it src, Zeek calls it id.orig_h. A normalised schema calls them all the same thing.
        </P>
        <Table
          headers={['Concept', 'Splunk CIM', 'Elastic ECS', 'Microsoft ASIM', 'OCSF']}
          rows={[
            ['Source IP', 'src / src_ip', 'source.ip', 'SrcIpAddr', 'src_endpoint.ip'],
            ['Destination IP', 'dest / dest_ip', 'destination.ip', 'DstIpAddr', 'dst_endpoint.ip'],
            ['User', 'user', 'user.name', 'TargetUsername / ActorUsername', 'user.name / actor.user.name'],
            ['Process name', 'process_name', 'process.name', 'TargetProcessName', 'process.name'],
            ['Command line', 'process', 'process.command_line', 'TargetProcessCommandLine', 'process.cmd_line'],
            ['Host', 'dest / dvc', 'host.name', 'DvcHostname', 'device.hostname'],
          ]}
        />
        <Note type="warn">
          Timestamps cause more broken correlations than anything else. Store everything in UTC, confirm each source&apos;s time zone at onboarding, and keep clocks synchronised with NTP. A firewall logging in local time without an offset will make an attack sequence appear to happen in the wrong order.
        </Note>

        <H3>Searching: SPL and KQL Side by Side</H3>
        <P>
          Splunk&apos;s Search Processing Language (SPL) is a pipeline language. You start with a search that selects events, then pipe the results through commands that transform them: stats aggregates, eval computes fields, where filters on computed values, table formats output. Elastic offers two main query styles. KQL (Kibana Query Language) is a filter language used in the search bar and in many detection rules; it selects events but does not aggregate. ES|QL, Elastic&apos;s newer piped query language, works much more like SPL. Microsoft Sentinel uses Kusto Query Language, also abbreviated KQL but a different language from Kibana&apos;s: it is a full pipeline language. Always check which KQL someone means.
        </P>
        <Pre label="FAILED LOGONS BY SOURCE - THREE DIALECTS">
{`# Splunk SPL
index=wineventlog sourcetype=XmlWinEventLog EventCode=4625 earliest=-24h
| stats count AS failures, dc(TargetUserName) AS users BY IpAddress
| where failures > 20
| sort - failures

# Elastic - Kibana KQL (filter only; aggregate in a visualisation or rule)
event.code : "4625" and source.ip : 10.20.30.0/24

# Elastic - ES|QL (pipeline, comparable to SPL)
FROM logs-windows.*
| WHERE event.code == "4625" AND @timestamp > NOW() - 24 hours
| STATS failures = COUNT(*), users = COUNT_DISTINCT(user.name) BY source.ip
| WHERE failures > 20
| SORT failures DESC

# Microsoft Sentinel - Kusto KQL
SecurityEvent
| where TimeGenerated > ago(24h) and EventID == 4625
| summarize failures = count(), users = dcount(TargetUserName) by IpAddress
| where failures > 20
| order by failures desc`}
        </Pre>
        <P>
          The distinct-count of users is the clever part. One source failing against one account 500 times is classic brute force. One source failing against 60 different accounts two or three times each is password spraying, which is designed to stay below lockout thresholds. The same query with a different column tells you which attack you are looking at.
        </P>

        <H3>Essential SPL Commands</H3>
        <Table
          headers={['Command', 'Purpose', 'Example']}
          rows={[
            ['stats', 'Aggregate (count, dc, values, min, max)', '| stats count by user, src'],
            ['eval', 'Compute a new field', '| eval hour=strftime(_time, "%H")'],
            ['where', 'Filter on expressions', '| where count > 10'],
            ['table', 'Choose output columns', '| table _time host CommandLine'],
            ['rex', 'Extract a field with a regex at search time', '| rex field=_raw "user=(?<user>[^ ]+)"'],
            ['transaction', 'Group related events (expensive; prefer stats)', '| transaction src maxspan=10m'],
            ['streamstats', 'Running calculations, e.g. time since previous event', '| streamstats current=f last(_time) as prev by host'],
            ['tstats', 'Fast search over accelerated data models', '| tstats count from datamodel=Authentication by Authentication.src'],
            ['lookup', 'Enrich from a CSV or KV store', '| lookup asset_inventory ip AS src OUTPUT owner'],
          ]}
        />

        <H3>Correlation</H3>
        <P>
          Single events rarely prove anything. Correlation is how a SIEM turns weak signals into strong ones by joining events across sources and time. The classic example is a burst of failed logons followed by a successful logon from the same source, which suggests the brute force worked. Another is a process creation on an endpoint followed within seconds by a DNS query for a newly registered domain and an outbound connection from the same process.
        </P>
        <Pre label="CORRELATION: FAILURES FOLLOWED BY SUCCESS (SPL)">
{`index=wineventlog (EventCode=4625 OR EventCode=4624) Logon_Type=3
| eval outcome=if(EventCode=4624, "success", "failure")
| bin _time span=15m
| stats count(eval(outcome="failure")) AS failures,
        count(eval(outcome="success")) AS successes,
        values(TargetUserName) AS accounts
        BY _time, IpAddress
| where failures >= 20 AND successes >= 1`}
        </Pre>
        <Pre label="RESULT">
{`_time                 IpAddress     failures  successes  accounts
2026-11-03 21:30:00   10.20.30.42   126       1          a.patel b.osei ... svc_backup (63 values)`}
        </Pre>
        <P>
          Correlation also happens at the entity level. Modern SIEMs build entity timelines for users and hosts and use risk scoring (chapter 1) so that ten low-severity observations about one host over a day add up to a single high-confidence alert. Sigma&apos;s correlation rules (part of the Sigma 2.0 specification, covered in chapter 4) let you express event-count, value-count and temporal correlations in a vendor-neutral way.
        </P>

        <H3>Data Health: Watching the Watchers</H3>
        <P>
          Your detections are only as good as the data under them. Mature teams treat data health as a first-class detection: alert when a critical source sends zero events for longer than expected, when event volume drops sharply, or when a parser starts producing events with empty key fields. A simple daily search comparing each host&apos;s last-seen time against an asset inventory catches more silent failures than any vendor dashboard.
        </P>
        <Pre label="SILENT SOURCE DETECTION (SPL)">
{`| tstats latest(_time) AS last_seen WHERE index=* BY host, sourcetype
| eval hours_silent = round((now() - last_seen) / 3600, 1)
| lookup critical_assets host OUTPUT tier
| where tier="crown_jewel" AND hours_silent > 2
| table host sourcetype hours_silent`}
        </Pre>
        <Note type="tip">
          When you onboard any new log source, write down three things: the exact search that shows its raw events, the fields your detections depend on, and the expected events per hour. That one note saves hours the first time the source breaks.
        </Note>

        <H3>Cost and Retention</H3>
        <P>
          SIEM economics shape detection strategy. Verbose sources such as firewall allow logs or full Sysmon on every workstation can dominate the bill. Common approaches are to filter or summarise at the edge (drop low-value fields, sample allowed traffic), route bulk data to cheaper storage tiers that are searchable but slower, and keep high-value sources (identity, EDR, DNS, cloud control plane) hot. Retention should be driven by investigation needs and regulation, not habit: given that intrusions are often discovered weeks after they start, 90 days hot and at least 12 months searchable is a common baseline.
        </P>
      </div>
    ),
  },
  {
    id: 'detection-engineering',
    title: 'Detection Engineering',
    difficulty: 'INTERMEDIATE',
    readTime: '19 min',
    labLink: '/modules/blue-team/lab',
    takeaways: [
      'Sigma is the vendor-neutral format for log detections: logsource says where to look, detection says what to match, condition says how to combine it, and pySigma converts it to SPL, KQL, ES|QL and more.',
      'Detect behaviour that is costly for the attacker to change (encoded PowerShell from Office, LSASS access) rather than strings that are free to change (a file name or a single hash).',
      'Tuning is a precise operation: add narrow, documented filters for known-benign cases; never widen exclusions until the alert simply stops firing.',
      'Detection-as-code means rules live in Git, are peer reviewed, have tests that replay true-positive and benign samples, and deploy through CI like software.',
      'Map every detection to MITRE ATT&CK. Since v18, ATT&CK describes detection as Detection Strategies and Analytics per technique, which is a useful model for documenting your own coverage.',
    ],
    content: (
      <div>
        <H3>From Ad-Hoc Searches to Engineering</H3>
        <P>
          Detection engineering is the discipline of turning knowledge about attacker behaviour into reliable, maintainable alerts. The word &quot;engineering&quot; is deliberate. A search an analyst wrote once during an incident is not a detection. A detection has a clear purpose, documented logic, known false positives, a test that proves it fires, an owner, and a version history. This chapter walks through that lifecycle using Sigma, the open standard most teams use to write portable detections.
        </P>
        <Pre label="THE DETECTION LIFECYCLE">
{`  idea / intel / incident / hunt finding
              |
              v
  1. Research   - how does the technique work? what telemetry does it leave?
  2. Write      - Sigma (or native) rule, mapped to ATT&CK
  3. Test       - replay true-positive samples; run against 30 days of real data
  4. Tune       - add narrow filters for benign matches; set severity
  5. Deploy     - merge to main -> CI converts and pushes to the SIEM
  6. Monitor    - track volume, FP rate, analyst feedback
  7. Retire / revise when the environment or technique changes`}
        </Pre>

        <H3>Anatomy of a Sigma Rule</H3>
        <P>
          Sigma rules are YAML documents. The logsource block describes the kind of data (for example category process_creation on product windows) without naming a vendor; backends and processing pipelines map that to real indexes and field names. The detection block contains named selections and filters, and a condition expression that combines them. Below is a rule for the exact behaviour you will investigate in this module&apos;s lab: PowerShell launched with an encoded command and hidden window.
        </P>
        <Pre label="SIGMA RULE: ENCODED, HIDDEN POWERSHELL">
{`title: Hidden PowerShell With Encoded Command
id: 3b6c1d0e-8f2a-4c47-9d61-2a7e5c9b0f11
status: experimental
description: >
  Detects powershell.exe or pwsh.exe started with an encoded command
  and a hidden window, a common pattern in phishing payloads and loaders.
references:
  - https://attack.mitre.org/techniques/T1059/001/
author: GHOSTNET Blue Team
date: 2026-11-04
tags:
  - attack.execution
  - attack.t1059.001
  - attack.defense-evasion
  - attack.t1027.010
logsource:
  category: process_creation
  product: windows
detection:
  selection_img:
    - OriginalFileName:
        - 'PowerShell.EXE'
        - 'pwsh.dll'
  selection_enc:
    CommandLine|contains|windash:
      - ' -e '
      - ' -en '
      - ' -enc '
      - ' -encodedcommand '
  selection_hidden:
    CommandLine|contains|windash:
      - ' -w hidden'
      - ' -windowstyle hidden'
  filter_main_sccm:
    ParentImage|endswith: '/CCM/CcmExec.exe'
  condition: all of selection_* and not 1 of filter_main_*
falsepositives:
  - Some legitimate management agents launch encoded PowerShell; filter by parent and signer after review
level: high`}
        </Pre>
        <Table
          headers={['Element', 'Meaning']}
          rows={[
            ['id', 'A UUID that never changes, even when the title does; used for tracking and deduplication'],
            ['status', 'stable, test, experimental, deprecated or unsupported; signals maturity'],
            ['tags', 'ATT&CK tactics and techniques in lowercase, e.g. attack.t1059.001'],
            ['logsource', 'Abstract data type (category/product/service); the backend maps it to real indexes'],
            ['contains / endswith / startswith', 'Value modifiers; matching is case-insensitive by default'],
            ['windash', 'Also matches the same flag written with /, en dash, em dash or horizontal bar, defeating -enc vs /enc tricks'],
            ['all of selection_*', 'Every selection whose name starts with selection_ must match'],
            ['1 of filter_*', 'Any one filter matching excludes the event'],
            ['falsepositives / level', 'Guidance for the analyst and severity: informational, low, medium, high, critical'],
          ]}
        />
        <Note type="info">
          The filter above uses endswith with a forward slash only because this page writes Windows paths that way. In a real rule you write the backslash path, for example the CcmExec.exe full path under C:/Windows/CCM written with backslashes.
        </Note>

        <H3>Converting Sigma</H3>
        <P>
          The reference tooling is pySigma and its command-line front end sigma-cli. You choose a target backend (Splunk, Elasticsearch, Microsoft Sentinel / Defender KQL, and many others) and one or more processing pipelines that rename fields to match your data, for example the Sysmon pipeline or an ECS pipeline.
        </P>
        <Pre label="SIGMA-CLI CONVERSION">
{`$ pip install sigma-cli
$ sigma plugin install splunk
$ sigma convert -t splunk -p sysmon rules/proc_creation_win_powershell_enc_hidden.yml

OriginalFileName IN ("PowerShell.EXE", "pwsh.dll") CommandLine IN ("* -e *", "* /e *", ... ) ...

$ sigma plugin install elasticsearch
$ sigma convert -t esql -p ecs_windows rules/proc_creation_win_powershell_enc_hidden.yml`}
        </Pre>
        <P>
          Sigma 2.0 also added correlation rules (event_count, value_count, temporal and their ordered variants), so a password-spraying rule can be expressed as &quot;more than 20 distinct target users with failed logons from one source in 10 minutes&quot; without writing vendor-specific aggregation.
        </P>

        <H3>True Positives, False Positives and Everything in Between</H3>
        <Table
          headers={['Outcome', 'Rule fired?', 'Malicious?', 'Action']}
          rows={[
            ['True positive', 'Yes', 'Yes', 'Escalate and respond'],
            ['Benign true positive', 'Yes', 'Real behaviour, but authorised', 'Add context or a narrow allowlist; keep the rule'],
            ['False positive', 'Yes', 'No - logic matched the wrong thing', 'Fix the logic'],
            ['False negative', 'No', 'Yes', 'The dangerous one: found by hunts, purple teams and incident reviews'],
            ['True negative', 'No', 'No', 'Working as intended'],
          ]}
        />
        <P>
          Precision is the share of alerts that are true positives; recall is the share of real attacks the rule catches. You can always get perfect recall with a rule that fires on everything, and perfect precision with a rule that never fires. Detection engineering is the work of finding the useful middle and documenting where it sits.
        </P>

        <H3>Tuning Without Blinding Yourself</H3>
        <P>
          Tuning is where many detections quietly die. The analyst sees the rule firing on a backup agent, adds an exclusion for the whole backup server, then for the whole subnet, and six months later an attacker who lands on that subnet is invisible. Good tuning is narrow and specific: exclude this exact parent process with this exact signer running this exact command-line pattern, record why, and set a review date.
        </P>
        <Pre label="BAD VS GOOD EXCLUSION">
{`# BAD - excludes every PowerShell on the host, forever
filter_backup:
  Computer: 'BKP01.corp.example'

# GOOD - excludes one known parent + one known script, documented
filter_main_veeam:
  ParentImage|endswith: '/Veeam/Backup and Replication/Backup/Veeam.Backup.Manager.exe'
  CommandLine|contains: 'Get-VBRJob'
# reviewed: 2026-10-14 by j.ndungu, ticket CHG-4471, re-review 2027-04-14`}
        </Pre>

        <H3>Detecting Behaviour, Not Strings</H3>
        <P>
          David Bianco&apos;s Pyramid of Pain (chapter 10) explains why some detections age well and others die in a week. A rule matching the hash of one malware sample breaks the moment the attacker recompiles. A rule matching the file name breaks when they rename it. A rule matching the behaviour, such as any process opening lsass.exe with memory-read access rights that is not a known security tool, survives tool changes because the attacker still needs to read LSASS memory to steal credentials that way. Aim for detections at the technique level, then layer narrower, higher-fidelity rules for specific tools on top.
        </P>

        <H3>Detection-as-Code</H3>
        <P>
          Detection-as-code applies software engineering practice to rules. Rules live in a Git repository. Every change is a pull request reviewed by another engineer. Continuous integration validates the YAML, checks for required fields (ATT&amp;CK tags, falsepositives, owner), converts rules for each target SIEM, and runs unit tests that replay stored sample events: each rule must fire on its true-positive samples and stay silent on its benign samples. Merging to the main branch deploys. Atomic Red Team or a breach-and-attack-simulation tool can then run the technique for real in a test environment to prove the full pipeline works end to end.
        </P>
        <Pre label="REPO LAYOUT">
{`detections/
  rules/windows/process_creation/proc_creation_win_powershell_enc_hidden.yml
  tests/proc_creation_win_powershell_enc_hidden/
      tp_phishing_lnk.json      # must match
      fp_sccm_client.json       # must NOT match
  pipelines/corp_windows.yml    # field mappings for our SIEM
  .github/workflows/ci.yml      # sigma check -> convert -> test -> deploy`}
        </Pre>

        <H3>Mapping to MITRE ATT&amp;CK and the v18 Detection Model</H3>
        <P>
          MITRE ATT&amp;CK catalogues adversary tactics (the why: Initial Access, Execution, Persistence and so on) and techniques (the how, such as T1059.001 PowerShell). Tagging every rule with techniques lets you build coverage heatmaps in ATT&amp;CK Navigator and answer the management question &quot;could we detect what that ransomware group does?&quot;.
        </P>
        <P>
          ATT&amp;CK v18, released in October 2025, reworked how detection is described. The older free-text detection notes and data-source lists on technique pages were replaced by structured Detection Strategies: each technique links to one or more strategies, each strategy is implemented by platform-specific Analytics, and each analytic names the log sources and data components it needs plus the tunable parameters (thresholds, time windows) a defender is expected to adjust. That is essentially the detection-as-code mindset expressed by MITRE, and it is a good template for documenting your own rules: behaviour to detect, telemetry required, logic, and what you can tune.
        </P>
        <Table
          headers={['Coverage question', 'How to answer it honestly']}
          rows={[
            ['Do we have a rule for T1059.001?', 'Count only rules that are deployed, tested and have the required data flowing'],
            ['Is the coverage good?', 'One weak string match is not coverage; record confidence per technique'],
            ['Can we see the technique at all?', 'Check the data components the ATT&CK analytic needs against what you collect'],
            ['Does it actually fire?', 'Validate with Atomic Red Team or purple team exercises on a schedule'],
          ]}
        />
        <Note type="tip">
          Green squares on a heatmap are a vanity metric unless each one is backed by a test. Track &quot;last validated&quot; dates per technique and treat anything older than a quarter as unknown.
        </Note>
      </div>
    ),
  },
  {
    id: 'threat-hunting',
    title: 'Threat Hunting',
    difficulty: 'INTERMEDIATE',
    readTime: '17 min',
    labLink: '/modules/blue-team/lab',
    takeaways: [
      'Threat hunting is the proactive, human-led search for attacker activity that existing detections missed; it starts from the assumption that something is already inside.',
      'A good hunt begins with a testable hypothesis grounded in intel, ATT&CK techniques or a known gap, and ends with a documented result, even when the result is "nothing found".',
      'Stacking (counting values and studying the rare ones) is the most powerful and simplest hunting technique: attackers live in the long tail.',
      'Beacons give themselves away through regularity: consistent intervals, consistent byte sizes and long-lived connection patterns, even when jitter is added.',
      'LOLBins (certutil, mshta, rundll32, regsvr32 and friends) are signed system tools abused by attackers; hunt for unusual parents, arguments and network activity rather than their mere use.',
    ],
    content: (
      <div>
        <H3>What Hunting Is and Is Not</H3>
        <P>
          Alerts are the SOC waiting for a known pattern to appear. Threat hunting is a person going looking for patterns nobody has written a rule for yet. The premise is uncomfortable but realistic: some attacker activity in your environment has not triggered any detection, either because the technique is new to you, the rule is broken, or the attacker deliberately avoided it. Hunting finds that activity, and just as importantly, every hunt either produces a new detection or confirms an area of real coverage.
        </P>
        <P>
          Hunting is not running a list of IOCs from last week&apos;s threat report through the SIEM. That is useful work (often called IOC sweeping) but it only finds attackers who reused exactly the same infrastructure. A hunt is driven by behaviour: &quot;if an attacker were doing X here, what would it look like in our data, and can I find it?&quot;
        </P>

        <H3>Hypothesis-Driven Hunting</H3>
        <P>
          Structured frameworks help make hunts repeatable. The PEAK framework (Prepare, Execute, Act with Knowledge) describes three hunt types: hypothesis-driven hunts, baseline hunts that characterise normal and look for deviations, and model-assisted hunts that use machine learning or statistics. TaHiTI, from the Dutch financial sector, is another widely used methodology. They share the same core: pick a hypothesis, decide which data proves or disproves it, run the analysis, and act on the result.
        </P>
        <Table
          headers={['Hypothesis source', 'Example hypothesis']}
          rows={[
            ['Threat intel', 'A ransomware affiliate targeting our sector uses AnyDesk for persistence; is AnyDesk running anywhere it is not approved?'],
            ['ATT&CK gap', 'We have no detection for T1053.005 scheduled tasks; are any tasks running binaries from user-writable paths?'],
            ['Incident lesson', 'Last incident used a renamed rclone for exfiltration; are any processes making large uploads to cloud storage APIs?'],
            ['Crown jewels', 'If someone wanted the payroll database, which accounts and hosts would they need, and are any behaving oddly?'],
            ['Anomaly', 'Workstations should not talk SMB to each other; which ones do?'],
          ]}
        />
        <Pre label="HUNT RECORD TEMPLATE">
{`Hunt ID:      H-2026-031
Hypothesis:   An attacker has established C2 beaconing over HTTPS from a workstation
ATT&CK:       T1071.001 (Web Protocols), T1573 (Encrypted Channel)
Data:         Zeek conn.log + ssl.log, proxy logs, Sysmon EID 3 - last 14 days
Method:       Interval regularity per (src, dst) pair; rare-destination stacking
Findings:     1 confirmed (WS-FIN-042 -> 192.0.2.66, ~60s interval) -> escalated IR-2026-118
              3 benign (two update agents, one monitoring tool) -> documented
Outcome:      New detection DET-212 (low-prevalence destination + regular interval)
Data gaps:    Branch office proxies not forwarding logs - ticket raised`}
        </Pre>

        <H3>Stacking: Living in the Long Tail</H3>
        <P>
          Stacking, also called frequency analysis or least-frequency-of-occurrence, means counting how often each value appears across your estate and studying the rarest. Legitimate software tends to be everywhere: the same browser, the same agents, the same services on thousands of machines. Malware and attacker tools tend to be on one or two. Sort by count ascending and the interesting things float to the top.
        </P>
        <Pre label="STACKING SERVICES INSTALLED ACROSS THE FLEET (SPL)">
{`index=wineventlog EventCode=7045 earliest=-30d
| stats dc(host) AS hosts, values(host) AS where, values(ImagePath) AS path BY ServiceName
| where hosts <= 2
| sort hosts`}
        </Pre>
        <Pre label="RESULT">
{`ServiceName   hosts  where        path
UpdSvc        1      WS-FIN-042   C:/ProgramData/UpdSvc/updsvc.exe
PSEXESVC      2      SRV-APP-03   %SystemRoot%/PSEXESVC.exe
                     SRV-APP-07
vmtools-ext   2      ...          ...`}
        </Pre>
        <P>
          Two of those rows deserve investigation. UpdSvc is a vaguely named service that exists on exactly one workstation and runs from ProgramData, a classic malware location. PSEXESVC means PsExec was used; that may be legitimate admin work, so check change records. The same technique works on scheduled task names, autorun registry values, parent-child process pairs, user agents, JA4 TLS fingerprints and DLLs loaded by svchost.
        </P>

        <H3>Beaconing Detection</H3>
        <P>
          Most implants check in with their command-and-control server on a schedule: every 60 seconds, every 5 minutes, every hour. Operators add jitter (randomising each sleep by, say, plus or minus 20 percent) to avoid perfectly regular patterns, but even jittered beacons are far more regular than human browsing. Hunting for beacons means grouping connections by source and destination, computing the time between connections, and measuring how consistent those gaps are. Open-source tools such as RITA (Real Intelligence Threat Analytics) automate this over Zeek logs, scoring each pair on interval regularity, data size consistency and connection count.
        </P>
        <Pre label="BEACON SCORING (SPL)">
{`index=zeek sourcetype=zeek_conn earliest=-24h dest_port=443
| sort 0 src_ip dest_ip _time
| streamstats current=f last(_time) AS prev_time BY src_ip dest_ip
| eval delta = _time - prev_time
| stats count AS conns, avg(delta) AS avg_gap, stdev(delta) AS sd_gap,
        avg(bytes_out) AS avg_out, stdev(bytes_out) AS sd_out BY src_ip dest_ip
| where conns > 200
| eval cv = round(sd_gap / avg_gap, 3)
| where cv < 0.25
| sort cv`}
        </Pre>
        <Pre label="RESULT">
{`src_ip        dest_ip       conns  avg_gap  sd_gap  cv     avg_out
10.20.30.42   192.0.2.66    1421   60.4     6.1     0.101  318
10.20.12.9    198.51.100.8  288    300.0    0.4     0.001  1204    <- AV update server (benign)`}
        </Pre>
        <P>
          The coefficient of variation (standard deviation divided by mean) is the key number: close to zero means machine-like regularity. Legitimate software beacons too, which is why prevalence matters. If 4,000 hosts all talk to the same destination every five minutes, it is almost certainly an update or telemetry service. If one host does, and the domain was first seen in your environment yesterday, it deserves a close look.
        </P>
        <Note type="warn">
          Sophisticated C2 increasingly hides inside popular cloud services (collaboration APIs, cloud storage, CDN-fronted domains) and can use long sleeps of hours or days. Beacon analysis needs long time windows and should be combined with process-level telemetry such as Sysmon EID 3 or EDR network events, which tell you which binary made the connection.
        </Note>

        <H3>Living Off the Land: LOLBins</H3>
        <P>
          Living-off-the-land binaries are legitimate, signed tools that ship with the operating system and can be abused to download files, execute code or bypass application controls. Because they are trusted and present everywhere, blocking them outright is often impossible, and their use alone is not suspicious. The LOLBAS project documents Windows examples and GTFOBins documents Unix ones. Hunt for unusual parents, unusual arguments, and network activity from binaries that rarely make connections.
        </P>
        <Table
          headers={['Binary', 'Abuse', 'Hunt for']}
          rows={[
            ['certutil.exe', 'Download files, base64 decode', '-urlcache -f http..., -decode, especially from Office or script parents'],
            ['mshta.exe', 'Run HTA / inline VBScript or JScript', 'Any network connection; URLs or javascript: in the command line'],
            ['rundll32.exe', 'Execute exported DLL functions', 'DLLs from user-writable paths; no arguments at all (common for injected beacons)'],
            ['regsvr32.exe', 'Squiblydoo: /i: with a remote scriptlet and scrobj.dll', '/i:http and scrobj.dll in the command line'],
            ['msbuild.exe', 'Compile and run inline C# tasks', 'Execution outside developer machines'],
            ['bitsadmin.exe', 'Background downloads, persistence via jobs', '/transfer or /addfile with external URLs'],
            ['wmic.exe', 'Remote execution, process create', 'process call create; note WMIC is being removed from Windows 11, so any use is now rarer and more notable'],
            ['curl / wget (Linux)', 'Download second stages', 'Piped into sh or bash; execution from /tmp or /dev/shm'],
          ]}
        />

        <H3>Three Example Hunts</H3>
        <Pre label="HUNT 1 - OFFICE APPS SPAWNING SHELLS (SPL, SYSMON EID 1)">
{`index=sysmon EventCode=1
  ParentImage IN ("*winword.exe","*excel.exe","*powerpnt.exe","*outlook.exe","*onenote.exe")
  Image IN ("*powershell.exe","*pwsh.exe","*cmd.exe","*wscript.exe","*cscript.exe","*mshta.exe","*rundll32.exe")
| stats count values(CommandLine) AS cmd BY host, ParentImage, Image`}
        </Pre>
        <Pre label="HUNT 2 - LSASS ACCESS BY UNEXPECTED PROCESSES (SPL, SYSMON EID 10)">
{`index=sysmon EventCode=10 TargetImage="*lsass.exe"
  GrantedAccess IN ("0x1010","0x1410","0x1438","0x143a","0x1fffff")
| stats count dc(host) AS hosts BY SourceImage
| where hosts < 5`}
        </Pre>
        <Pre label="HUNT 3 - EXECUTION FROM USER-WRITABLE PATHS (ES|QL)">
{`FROM logs-endpoint.events.process-*
| WHERE event.type == "start"
  AND (process.executable LIKE "*AppData*Temp*" OR process.executable LIKE "*Users*Public*"
       OR process.executable LIKE "*ProgramData*")
| STATS hosts = COUNT_DISTINCT(host.name) BY process.executable, process.code_signature.trusted
| WHERE hosts <= 3
| SORT hosts ASC`}
        </Pre>
        <P>
          Each of these produces a short list of candidates rather than a verdict. The hunter&apos;s job is to work through that list with the analyst questions from chapter 1, close the benign items with notes, escalate the suspicious ones, and convert whatever pattern proved useful into a scheduled detection so the next occurrence is caught automatically.
        </P>
      </div>
    ),
  },
  {
    id: 'network-defence',
    title: 'Network Defence',
    difficulty: 'INTERMEDIATE',
    readTime: '17 min',
    takeaways: [
      'A Suricata or Snort rule has a header (action, protocol, source, port, direction, destination, port) and options in parentheses; sid and rev identify and version it.',
      'Use sticky buffers (http.uri, http.user_agent, tls.sni, dns.query) so content matches look in the right field, and flow keywords so rules only inspect the relevant direction.',
      'Zeek turns packets into rich transaction logs (conn, dns, http, ssl, files, x509, notice) that are ideal for hunting and investigation even when payloads are encrypted.',
      'NetFlow and IPFIX give cheap, wide coverage of who talked to whom, how much and for how long, without payloads.',
      'Segmentation turns detection opportunities into hard barriers: workstations should not reach each other or the domain controllers on arbitrary ports, and east-west traffic should be logged.',
    ],
    content: (
      <div>
        <H3>Why Network Visibility Still Matters</H3>
        <P>
          With most traffic encrypted and endpoints running EDR, some argue network monitoring is obsolete. Incident responders disagree. The network is the one place every attacker must cross: to receive commands, to move laterally and to exfiltrate data. Devices that cannot run an agent (printers, IP phones, OT controllers, hypervisors, VPN appliances) are often the initial foothold, and the network is the only place you can see them. Network sensors also keep working when an attacker has disabled or blinded the EDR on a host. Encryption hides payloads, but metadata such as who connected to whom, when, how often, how much data and which TLS fingerprint was used remains extremely revealing.
        </P>

        <H3>IDS and IPS: Suricata and Snort</H3>
        <P>
          An Intrusion Detection System (IDS) inspects traffic and raises alerts; an Intrusion Prevention System (IPS) sits inline and can drop matching traffic. Suricata (now in its 8.x series) and Snort 3 are the dominant open-source engines, and both use a closely related rule language. Commercial NGFWs and NDR products embed similar engines. Suricata also produces structured EVE JSON logs for alerts and for protocol transactions (HTTP, DNS, TLS, flows), making it a metadata sensor as well as an alerting engine.
        </P>
        <Pre label="SURICATA RULE ANATOMY">
{`action  proto  source        sport  dir  destination    dport
alert   http   $HOME_NET     any    ->   $EXTERNAL_NET  any   (
    msg:"GHOSTNET - PowerShell UA fetching .ps1 from rare domain";
    flow:established,to_server;
    http.method; content:"GET";
    http.uri; content:".ps1"; endswith; nocase;
    http.user_agent; content:"WindowsPowerShell/"; nocase;
    classtype:trojan-activity;
    reference:url,attack.mitre.org/techniques/T1059/001/;
    metadata:mitre_technique_id T1059.001, created_at 2026_11_04;
    sid:9000101; rev:1;
)`}
        </Pre>
        <Table
          headers={['Part', 'Meaning']}
          rows={[
            ['action', 'alert, pass, drop, reject (drop/reject only take effect inline in IPS mode)'],
            ['proto', 'tcp, udp, icmp, ip, or an app-layer protocol such as http, tls, dns, smb'],
            ['$HOME_NET / $EXTERNAL_NET', 'Variables from suricata.yaml; getting HOME_NET right is essential'],
            ['-> / <>', 'Direction: one-way or bidirectional'],
            ['msg', 'The alert text analysts will see'],
            ['flow', 'established, to_server / to_client: limits inspection to the right side of a session'],
            ['sticky buffers', 'http.uri, http.user_agent, tls.sni, dns.query, file.data: the following content applies to that field'],
            ['content + modifiers', 'Byte or string match; nocase, startswith, endswith, depth, offset, distance, within'],
            ['pcre', 'Regular expression; powerful but slow, so pair it with a content pre-filter'],
            ['sid / rev', 'Unique signature ID and revision; local rules conventionally use 1000000+ ranges'],
          ]}
        />
        <Pre label="MORE RULE EXAMPLES">
{`# DNS query to a known C2 domain (from threat intel)
alert dns $HOME_NET any -> any any (msg:"GHOSTNET - DNS query for cdn-telemetry.example";
    dns.query; content:"cdn-telemetry.example"; nocase; endswith;
    sid:9000102; rev:1;)

# TLS session to the same domain via SNI (works without decrypting)
alert tls $HOME_NET any -> $EXTERNAL_NET 443 (msg:"GHOSTNET - TLS SNI cdn-telemetry.example";
    flow:established,to_server; tls.sni; content:"cdn-telemetry.example"; nocase; endswith;
    sid:9000103; rev:1;)

# Threshold: SSH brute force against internal servers
alert tcp any any -> $HOME_NET 22 (msg:"GHOSTNET - Possible SSH brute force";
    flow:to_server; flags:S,12;
    threshold:type both, track by_src, count 30, seconds 60;
    sid:9000104; rev:1;)`}
        </Pre>
        <Note type="warn">
          Encrypted Client Hello (ECH) is being deployed by major browsers and CDNs. Where it is used, the real SNI is encrypted and only the outer, public name of the CDN is visible. SNI-based rules remain valuable for most malware today, but plan for a future where DNS logs (from your own resolvers) and endpoint telemetry carry more of the load.
        </Note>
        <P>
          Rule sets such as Emerging Threats Open and ET Pro, Snort&apos;s Talos rules, and Abuse.ch feeds provide thousands of maintained signatures. Running them untuned on a busy network generates enormous noise; start with categories relevant to your environment, disable rules for software you do not run, and suppress known-benign hosts precisely using suppress or threshold configuration rather than disabling whole rules.
        </P>

        <H3>Zeek: Network Transaction Logs</H3>
        <P>
          Zeek (formerly Bro) does not primarily alert. It parses traffic and writes a detailed log for every connection and protocol transaction, which makes it the best friend of hunters and incident responders. Every connection gets a unique uid that links its entries across all the logs, and Zeek can also emit the Community ID flow hash so you can pivot between Zeek, Suricata and EDR records of the same connection.
        </P>
        <Table
          headers={['Log', 'Contents', 'Typical question it answers']}
          rows={[
            ['conn.log', 'Every TCP/UDP/ICMP flow: endpoints, ports, duration, bytes, connection state', 'Did this host talk to that IP, and how much data moved?'],
            ['dns.log', 'Queries, types, answers, response codes', 'Which host resolved the C2 domain first?'],
            ['http.log', 'Method, host, URI, user agent, status, MIME types', 'What was downloaded over cleartext HTTP?'],
            ['ssl.log', 'TLS version, SNI, cipher, certificate chain links, JA3/JA4 when enabled', 'Which hosts negotiated TLS with this fingerprint?'],
            ['x509.log', 'Certificate subject, issuer, validity', 'Self-signed or freshly issued certs on odd domains'],
            ['files.log', 'Files seen in traffic, MIME type, hashes', 'Did an executable cross the network?'],
            ['notice.log / weird.log', 'Zeek script detections and protocol anomalies', 'Scans, invalid certs, protocol violations'],
          ]}
        />
        <Pre label="ZEEK conn.log ENTRIES (TSV, SELECTED FIELDS)">
{`#fields ts               uid                 id.orig_h    id.orig_p id.resp_h   id.resp_p proto service duration orig_bytes resp_bytes conn_state
1793740665.61  CwQ1sU3yE9aWb7xLk  10.20.30.42  50211     192.0.2.66  443       tcp   ssl     0.412    318        1460       SF
1793740724.88  C8pJvR1nT0eXq2Mzd  10.20.30.42  50219     192.0.2.66  443       tcp   ssl     0.398    322        1460       SF
1793740785.02  CkL7tH5aZ2fYw9Pqe  10.20.30.42  50227     192.0.2.66  443       tcp   ssl     0.405    318        1460       SF

$ zeek-cut ts id.orig_h id.resp_h query < dns.log | grep cdn-telemetry.example`}
        </Pre>
        <P>
          Look at those three lines: the same internal host, the same destination, gaps of roughly 60 seconds, near-identical byte counts. That is the beacon pattern from chapter 5, visible without decrypting a single packet. On the TLS side, JA3 client fingerprints lost much of their stability after browsers began randomising TLS extension order in 2023; JA4 and the wider JA4+ family (JA4S for servers, JA4H for HTTP clients, JA4X for certificates) were designed to be robust to that and are now widely supported in Zeek, Suricata and commercial tools.
        </P>

        <H3>NetFlow and IPFIX</H3>
        <P>
          Flow records summarise conversations: source and destination addresses and ports, protocol, start time, duration, packets and bytes. Routers, switches, firewalls and cloud platforms (AWS VPC Flow Logs, Azure VNet flow logs, GCP VPC Flow Logs) can export them cheaply at scale. They have no payload and no hostnames, but they cover places where deploying a full sensor is impractical and are invaluable for scoping: once you know the C2 IP, flow data tells you every internal host that ever talked to it, going back as far as you retain flows.
        </P>
        <Pre label="VPC FLOW LOG RECORD (DEFAULT FORMAT)">
{`version account-id   interface-id          srcaddr      dstaddr       srcport dstport protocol packets bytes    start      end        action log-status
2       111122223333 eni-0a1b2c3d4e5f6a7b8 10.0.4.17    198.51.100.9  49822   443     6        8211    48211044 1793746000 1793746060 ACCEPT OK`}
        </Pre>
        <P>
          Nearly 48 MB outbound in one minute from an application server to an unfamiliar address is the shape exfiltration takes in flow data. Flow-based detections focus on volume anomalies, new external destinations, unusual ports, and internal hosts suddenly talking to many peers (scanning or worm-like spread).
        </P>

        <H3>Segmentation and Architecture</H3>
        <P>
          Detection tells you an attacker is moving; segmentation stops them. Most lateral movement relies on workstations being able to reach other workstations over SMB, RPC, WinRM and RDP, and on everything being able to reach domain controllers on every port. Restricting that traffic removes whole classes of attack and makes the remaining attempts noisy.
        </P>
        <Table
          headers={['Control', 'Effect']}
          rows={[
            ['Block workstation-to-workstation SMB/RPC/WinRM/RDP (host firewall + network ACL)', 'Breaks most worm-style and PsExec-style spread between user machines'],
            ['Tiered admin model with Privileged Access Workstations', 'Domain admin credentials never touch user workstations, so they cannot be stolen there'],
            ['Management interfaces on a separate network', 'Hypervisor, iLO/iDRAC and switch management unreachable from user VLANs'],
            ['Egress filtering through an authenticated proxy', 'Malware without proxy awareness fails; everything else is logged with a user name'],
            ['DNS only via internal resolvers (block outbound 53/853, monitor DoH)', 'All lookups are logged and can be sinkholed'],
            ['Microsegmentation / zero trust policies', 'Workload-to-workload allowlists in data centres and cloud'],
          ]}
        />
        <Note type="tip">
          Every block rule is also a detection opportunity. Log denied east-west connections and alert on bursts: a workstation that suddenly tries SMB to 200 peers and gets denied is almost always malware or an attacker scanning, and the denial has already contained it.
        </Note>
      </div>
    ),
  },
  {
    id: 'endpoint-defence',
    title: 'Endpoint Defence',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    labLink: '/modules/blue-team/lab',
    takeaways: [
      'EDR combines continuous telemetry (process, file, registry, network, module loads) with behavioural detection and remote response actions such as isolation, process kill and file collection.',
      'EDR telemetry is a process tree with context: always read the parent, the command line, the signer and what the process did next.',
      'Hardening shrinks what EDR has to catch: Attack Surface Reduction rules, App Control for Business or AppLocker, macro and script controls, and removing local admin rights.',
      'Windows LAPS gives every machine a unique, rotated local admin password, killing the "same local admin everywhere" lateral movement path.',
      'Credential Guard and LSA protection make credential theft from LSASS much harder; combine them with monitoring for LSASS access because attackers adapt.',
      'Attackers increasingly target the EDR itself (BYOVD, tampering, unprotected hosts); alert on sensor health and enable tamper protection.',
    ],
    content: (
      <div>
        <H3>From Antivirus to EDR and XDR</H3>
        <P>
          Traditional antivirus asked one question about a file: is it known bad? Endpoint Detection and Response (EDR) asks a much richer set of questions about behaviour over time: what started this process, what did it do, who did it talk to, and does that sequence look like an attack? Products such as Microsoft Defender for Endpoint, CrowdStrike Falcon, SentinelOne, Elastic Defend and others install a kernel-level or system-extension sensor that records activity, applies local detection logic (including machine-learning models and behavioural rules), and streams telemetry to a cloud console where analysts investigate and act. XDR extends the same idea across email, identity, cloud and network data so that an incident is presented as one story rather than several product alerts.
        </P>
        <Table
          headers={['Capability', 'What it gives the defender']}
          rows={[
            ['Telemetry', 'Process creation with full command lines, file writes, registry changes, network connections, DLL loads, script content (via AMSI)'],
            ['Prevention', 'Blocks known malware, exploit techniques, ransomware behaviour, credential theft attempts'],
            ['Behavioural detection', 'Alerts on sequences such as Office spawning PowerShell that then connects out'],
            ['Investigation', 'Process trees, timelines, prevalence of a file across the fleet'],
            ['Response', 'Isolate host, kill process, quarantine file, collect forensic package, live response shell'],
            ['Hunting', 'Query raw telemetry across all endpoints (e.g. Defender Advanced Hunting in KQL)'],
          ]}
        />

        <H3>What EDR Telemetry Looks Like</H3>
        <P>
          Each vendor has its own schema, but the shape is consistent. Below is an EDR process event in a normalised, ECS-like format, followed by a typical process tree an analyst would see in the console for the intrusion used in this module&apos;s lab.
        </P>
        <Pre label="EDR PROCESS EVENT (ECS-STYLE JSON)">
{`{
  "@timestamp": "2026-11-03T21:17:44.118Z",
  "event": { "category": "process", "type": "start", "action": "exec" },
  "host": { "name": "WS-FIN-042", "ip": ["10.20.30.42"] },
  "user": { "domain": "CORP", "name": "m.hale" },
  "process": {
    "pid": 7312,
    "executable": "C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe",
    "command_line": "powershell.exe -nop -w hidden -enc SQBFAFgAIAAoAE4AZQB3AC0A...",
    "hash": { "sha256": "9f2c...e1a0" },
    "code_signature": { "subject_name": "Microsoft Windows", "trusted": true },
    "parent": { "pid": 4120, "name": "explorer.exe" }
  },
  "file": { "origin_url": "zip://Invoice_Q4.zip/Invoice_Q4.pdf.lnk" }
}`}
        </Pre>
        <Pre label="PROCESS TREE AS SHOWN IN AN EDR CONSOLE">
{`explorer.exe (4120)  user=CORP/m.hale
 '-- powershell.exe (7312)  -nop -w hidden -enc SQBFAFgA...        [ALERT: Suspicious PowerShell]
      |-- network: cdn-telemetry.example (192.0.2.66:443)            [first seen in org: today]
      |-- file write: C:/ProgramData/UpdSvc/updsvc.exe               [unsigned, prevalence 1]
      '-- sc.exe (7790)  create UpdSvc binPath= C:/ProgramData/UpdSvc/updsvc.exe start= auto
           '-- (services.exe) updsvc.exe (8012)
                |-- network: 192.0.2.66:443 every ~60s
                '-- net.exe (8120)  group "Domain Admins" /domain     [discovery]`}
        </Pre>
        <P>
          Read trees from the top. The signed Microsoft binary powershell.exe is not the problem by itself; the problem is the context: a user shell launching hidden, encoded PowerShell from a shortcut inside a ZIP, which then reaches a domain the organisation has never seen, drops an unsigned binary that exists on one machine in the fleet, and installs it as a service. Prevalence (how many hosts have seen this file or domain) is one of the most useful fields an EDR provides.
        </P>

        <H3>Hardening: Shrinking the Attack Surface</H3>
        <P>
          Every technique you prevent is one you do not have to detect. Hardening is unglamorous but it is where the largest risk reductions usually come from.
        </P>
        <Table
          headers={['Control', 'What it stops', 'Notes']}
          rows={[
            ['Remove local admin rights from users', 'Most persistence, driver loading, credential dumping', 'Use a privilege management tool for exceptions'],
            ['Attack Surface Reduction (ASR) rules', 'Office child processes, credential stealing from LSASS, executable content from email, obfuscated scripts, PSExec/WMI process creation', 'Start in audit mode, review, then block'],
            ['Block macros from the internet', 'Classic macro phishing', 'Default in Microsoft 365 since 2022; attackers moved to LNK, ISO, OneNote and HTML smuggling'],
            ['Mark-of-the-Web handling and SmartScreen', 'Downloaded files running without warning', 'Watch for container formats that drop MotW'],
            ['PowerShell Constrained Language Mode + script block logging', 'Many offensive PowerShell tools', 'CLM is enforced automatically under App Control'],
            ['Disable or restrict legacy protocols', 'LLMNR/NBT-NS poisoning, NTLM relay, SMBv1', 'Require SMB signing; LDAP signing and channel binding'],
            ['Patch and remove unused software', 'Exploit-based initial access and privilege escalation', 'Prioritise known-exploited vulnerabilities (CISA KEV)'],
          ]}
        />

        <H3>Application Allowlisting</H3>
        <P>
          Allowlisting flips the model: instead of blocking known bad, only approved code may run. On Windows the modern option is App Control for Business (formerly Windows Defender Application Control, WDAC), which enforces policy in the kernel and can trust code by publisher certificate, file hash, path or the Intelligent Security Graph reputation service. AppLocker is older and easier to deploy but weaker, because it is enforced in user mode and is not treated by Microsoft as a security boundary. On Linux, fapolicyd and SELinux or AppArmor play similar roles. Even a partial policy, such as blocking execution from user-writable paths like AppData, Temp, Downloads and ProgramData unless signed by trusted publishers, defeats a large share of commodity malware.
        </P>
        <Note type="info">
          Microsoft maintains a recommended block list of signed binaries that can be abused to bypass App Control (for example certain versions of msbuild.exe or debugging tools) and a vulnerable driver block list. Merge both into your policy; attackers know exactly which signed files slip through naive allowlists.
        </Note>

        <H3>Windows LAPS</H3>
        <P>
          For years many organisations imaged every workstation with the same local administrator password. An attacker who dumped one machine&apos;s local SAM hash could pass it to every other machine. Windows LAPS (Local Administrator Password Solution), built into Windows since the April 2023 updates and replacing the older downloadable &quot;legacy LAPS&quot;, sets a unique random password per device, rotates it on a schedule or after use, and stores it in Active Directory or Entra ID with access controlled by permissions. It can also back up the Directory Services Restore Mode password on domain controllers and encrypt stored passwords. Monitor who reads LAPS passwords: a burst of reads by one account is a strong signal of an attacker harvesting them.
        </P>
        <Pre label="CHECK LAPS STATUS AND AUDIT READS">
{`PS> Get-LapsADPassword -Identity WS-FIN-042 -AsPlainText
ComputerName        : WS-FIN-042
Account             : Administrator
Password            : (redacted)
PasswordUpdateTime  : 2026-10-28 03:12:44
ExpirationTimestamp : 2026-11-27 03:12:44
Source              : EncryptedPassword

# On DCs, enable "Audit Directory Service Access" and watch event 4662
# for reads of the msLAPS-EncryptedPassword attribute by unexpected accounts.`}
        </Pre>

        <H3>Credential Guard and LSA Protection</H3>
        <P>
          Credential theft from LSASS memory (the Mimikatz family of techniques covered in the Active Directory module) is the engine of most domain compromises. Credential Guard uses virtualization-based security to move NTLM hashes and Kerberos secrets into an isolated process (LSAIso) that even a SYSTEM-level attacker cannot read directly. It is enabled by default on eligible, domain-joined Windows 11 Enterprise and Education devices from version 22H2 onward, and on suitable Windows Server 2025 systems. LSA protection (RunAsPPL) runs LSASS as a protected process so that unsigned code cannot open it for memory reads, and recent Windows 11 releases enable it by default on new installs.
        </P>
        <P>
          Neither is a silver bullet. Credential Guard does not protect credentials typed into a compromised session (keyloggers, fake prompts), Kerberos tickets already issued can still be abused, and attackers with kernel access via a vulnerable signed driver can disable protections. Keep the Sysmon EID 10 and ASR &quot;block credential stealing from LSASS&quot; detections in place even after enabling both.
        </P>

        <H3>Protecting the Sensor</H3>
        <P>
          Ransomware crews now routinely try to blind EDR before deploying payloads. Common methods are Bring Your Own Vulnerable Driver (BYOVD: loading a legitimately signed but vulnerable driver to kill security processes from the kernel), abusing uninstallers with stolen admin credentials, adding broad exclusions, or simply operating from hosts with no agent (unmanaged servers, VPN appliances, hypervisors).
        </P>
        <Table
          headers={['Defence', 'Detection signal']}
          rows={[
            ['Enable tamper protection and uninstall passwords', 'Console alert on tamper attempt'],
            ['Vulnerable driver block list / HVCI (memory integrity)', 'Sysmon EID 6 driver load of a known-vulnerable driver'],
            ['Sensor health monitoring', 'Host stops reporting while still seen on the network (DHCP, Zeek, flow logs)'],
            ['Exclusion change auditing', 'Defender event 5007 configuration change adding exclusions'],
            ['Coverage reconciliation', 'Weekly diff of asset inventory vs EDR-enrolled hosts'],
          ]}
        />
        <Note type="danger">
          An EDR that is installed on 92 percent of hosts protects 92 percent of hosts. Attackers actively search for the other 8 percent. Coverage gaps are findings in their own right and belong on the risk register.
        </Note>
      </div>
    ),
  },
  {
    id: 'incident-response-lifecycle',
    title: 'The Incident Response Lifecycle',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/blue-team/lab',
    takeaways: [
      'NIST SP 800-61 Revision 3 (April 2025) frames incident response through the CSF 2.0 functions; SANS PICERL (Preparation, Identification, Containment, Eradication, Recovery, Lessons learned) remains the practical working model.',
      'Triage answers three questions fast: is it real, how bad is it, and how far has it spread? Severity drives who gets woken up and which playbook runs.',
      'Containment is a trade-off between stopping harm and tipping off the attacker; scope first where you safely can, then contain everything at once.',
      'Eradication must remove every foothold (accounts, persistence, implants, stolen credentials), or recovery simply hands the environment back to the attacker.',
      'Chain of custody and careful notes make evidence usable later; communication must run out of band if the attacker may be reading email or chat.',
    ],
    content: (
      <div>
        <H3>Frameworks: NIST 800-61r3 and PICERL</H3>
        <P>
          Incident response (IR) is the structured process an organisation follows from the moment a possible security incident is noticed until it is fully resolved and lessons are applied. For nearly two decades the reference was NIST SP 800-61 with its four-phase lifecycle: Preparation; Detection and Analysis; Containment, Eradication and Recovery; and Post-Incident Activity. In April 2025 NIST published Revision 3, which re-frames incident response as part of overall cybersecurity risk management using the six Cybersecurity Framework 2.0 functions: Govern, Identify, Protect, Detect, Respond and Recover. Preparation is now spread across Govern, Identify and Protect, and improvement is treated as continuous rather than as a final phase.
        </P>
        <P>
          On the ground, most responders still think in the SANS PICERL steps because they map neatly to what you actually do during an incident. The two models are compatible: PICERL describes the response workflow, and 800-61r3 describes how that workflow fits into the organisation&apos;s wider risk programme.
        </P>
        <Table
          headers={['PICERL phase', 'Key activities', 'CSF 2.0 function (800-61r3)']}
          rows={[
            ['Preparation', 'IR plan, roles, playbooks, tooling, logging, contact lists, exercises, retainers', 'Govern, Identify, Protect'],
            ['Identification', 'Detect, triage, validate, declare incident, assign severity, begin scoping', 'Detect'],
            ['Containment', 'Stop the spread: isolate hosts, disable accounts, block indicators', 'Respond'],
            ['Eradication', 'Remove malware, persistence, attacker accounts; reset credentials; fix root cause', 'Respond'],
            ['Recovery', 'Restore systems from known-good sources, monitor closely, return to service', 'Recover'],
            ['Lessons learned', 'Blameless review, detection and control improvements, update playbooks', 'Identify (Improvement), continuous'],
          ]}
        />

        <H3>Preparation: The Phase That Decides Everything</H3>
        <P>
          Incidents are won or lost before they start. The questions you do not want to answer for the first time at 03:00 are: who has authority to take the payment system offline? What is the out-of-band phone bridge if email is compromised? Where are the offline backups and has anyone tested restoring them? Which external IR firm is on retainer, and what is the number? Preparation also means the technical groundwork from earlier chapters: logs retained long enough, EDR deployed everywhere, accurate asset inventory, and tabletop exercises in which leadership has practised making decisions under uncertainty.
        </P>

        <H3>Playbooks</H3>
        <P>
          A playbook is a pre-agreed set of steps for a specific incident type: phishing, ransomware, business email compromise, compromised cloud credentials, insider data theft. Playbooks encode decisions in advance, which reduces panic and inconsistency. SOAR platforms automate the mechanical parts (enrichment, ticket creation, blocking an indicator) while leaving judgement calls to humans.
        </P>
        <Pre label="PLAYBOOK EXCERPT: SUSPECTED PHISHING WITH PAYLOAD EXECUTION">
{`TRIGGER: user report or EDR alert linking an email attachment to process execution

1. Validate   - pull the message (headers, sender, attachments, URLs); detonate in sandbox
2. Scope mail - search all mailboxes for same sender / subject / attachment hash
              - purge matching messages (record count and recipients)
3. Scope exec - EDR: which recipients opened it? prevalence of child processes / hashes
4. Contain    - isolate hosts with confirmed execution (EDR network containment)
              - revoke sessions + reset passwords for affected users; review MFA methods
              - block sender domain, URLs, C2 domains/IPs at mail gateway, proxy, DNS, firewall
5. Escalate   - if lateral movement or privileged accounts are involved -> MAJOR INCIDENT
6. Evidence   - collect memory + triage package BEFORE reimaging (see chapter 9)
7. Eradicate  - reimage hosts; remove persistence; confirm no new beacons for 72h
8. Notify     - IR lead decides on legal / privacy / regulator notification
9. Close      - timeline, root cause, detections added, lessons learned`}
        </Pre>

        <H3>Triage and Severity</H3>
        <P>
          Triage is rapid assessment. Within minutes you want a working answer to three questions: is this real (true positive), how bad is it (impact and privileges involved), and how far has it spread (one host, one user, or many)? Severity levels should be defined in the IR plan with concrete criteria so the call does not depend on who is on shift.
        </P>
        <Table
          headers={['Severity', 'Example criteria', 'Response expectation']}
          rows={[
            ['SEV-1 / Critical', 'Active ransomware, domain admin compromise, confirmed data exfiltration of regulated data', 'Immediate, 24x7, IR lead + executives + legal'],
            ['SEV-2 / High', 'Confirmed hands-on-keyboard intrusion on multiple hosts, compromised privileged account', 'Within 1 hour, dedicated responders'],
            ['SEV-3 / Medium', 'Single host malware executed and contained, credential phish with no evidence of use', 'Same business day'],
            ['SEV-4 / Low', 'Blocked malware, policy violations, unsuccessful attacks', 'Normal queue'],
          ]}
        />

        <H3>Containment: Choices and Trade-offs</H3>
        <P>
          Containment stops the attacker causing further harm. It sounds obvious to isolate every affected host the moment you see it, but experienced responders weigh that against scoping. If you isolate one workstation while the attacker already has three other footholds and a domain admin password, you have told them you are onto them, and they may accelerate: deploying ransomware early, destroying evidence, or switching to infrastructure you do not yet know about. In those cases the team may monitor for a short, deliberate period to identify all footholds, then contain everything simultaneously.
        </P>
        <Note type="danger">
          Monitoring instead of containing is a risk decision, not an analyst preference. It must be approved by the IR lead and time-boxed. If the attacker is actively encrypting, exfiltrating regulated data or touching safety systems, contain immediately.
        </Note>
        <Table
          headers={['Containment action', 'Speed', 'Side effects']}
          rows={[
            ['EDR network isolation', 'Seconds', 'Host keeps talking only to the EDR cloud; remote evidence collection still works'],
            ['Disable account + revoke sessions/tokens', 'Minutes', 'Must also revoke refresh tokens and cloud sessions, not just reset the password'],
            ['Block IOC at DNS/proxy/firewall', 'Minutes', 'Attacker may have backup C2; blocking can tip them off'],
            ['Reset krbtgt twice (domain compromise)', 'Hours, planned', 'Invalidates golden tickets; must respect replication time between resets'],
            ['Pull network cable / power off', 'Immediate', 'Power off destroys volatile memory evidence; prefer isolation'],
            ['Segment or shut down a whole network zone', 'Variable', 'Business impact; requires executive decision'],
          ]}
        />

        <H3>Eradication and Recovery</H3>
        <P>
          Eradication removes every trace of attacker access: implants, persistence (services, scheduled tasks, run keys, WMI subscriptions, web shells), rogue accounts, malicious OAuth app grants and mailbox rules, and above all stolen credentials. Any credential that touched a compromised host should be considered exposed. In a domain compromise that may mean resetting service account passwords, rotating secrets in automation, and resetting the krbtgt account twice. The root cause must also be fixed; reimaging a phished workstation without addressing why the payload could execute invites a repeat.
        </P>
        <P>
          Recovery restores systems from known-good sources (gold images, verified backups taken before the intrusion began) and returns them to service in stages, with heightened monitoring for re-infection. This is where accurate scoping pays off: restoring from a backup taken after the attacker planted persistence just restores the attacker.
        </P>

        <H3>Chain of Custody and Note-Taking</H3>
        <P>
          Any incident may end up in court, in front of a regulator, or in an insurance claim. Evidence is only useful if you can show where it came from and that it has not been altered. Chain of custody is the documented, unbroken record of who collected each item, when, how, where it has been stored, and every person who handled it. Hashing evidence at acquisition and verifying the hash on every transfer proves integrity.
        </P>
        <Pre label="CHAIN OF CUSTODY RECORD">
{`Evidence ID:    IR-2026-118-E003
Description:    Memory image, WS-FIN-042 (Dell Latitude, asset tag 08841)
Acquired by:    J. Ndungu (IR) using WinPmem via EDR live response
Acquired at:    2026-11-03 23:02 UTC
SHA-256:        4b1e0c7a9d...(64 hex)...f2
Storage:        Evidence vault share /ir/2026-118/ (write-once), copy on encrypted drive locker B2
Transfers:      2026-11-04 08:15 UTC  J. Ndungu -> A. Kariuki (forensics)  hash verified OK`}
        </Pre>
        <P>
          Keep a running incident log from the first minute: timestamp (UTC), who, what was observed, what action was taken and why. These notes become the timeline in the final report and protect responders when decisions are reviewed later.
        </P>

        <H3>Communication</H3>
        <P>
          Assume the attacker can read your email and chat if they have domain or tenant admin rights. Move incident communications to an out-of-band channel prepared in advance (a separate tenant, a secure messaging app on personal devices, a phone bridge). Keep the circle need-to-know, use incident code names, and route all external statements through communications and legal.
        </P>
        <Table
          headers={['Audience', 'What they need', 'Typical owner']}
          rows={[
            ['Executives', 'Business impact, decisions required, next update time', 'IR lead / CISO'],
            ['Legal and privacy', 'Facts for notification decisions; privilege considerations', 'IR lead'],
            ['Regulators', 'Timely notice: e.g. GDPR 72 hours; NIS2 early warning within 24 hours and notification within 72 hours; SEC Form 8-K within four business days of determining materiality', 'Legal / DPO'],
            ['Cyber insurer', 'Early notice; often mandates approved IR firms', 'Risk / legal'],
            ['Staff and customers', 'Clear, honest, actionable guidance', 'Communications'],
            ['Law enforcement', 'Indicators, impact, evidence on request', 'Legal'],
          ]}
        />
        <Note type="tip">
          Agree a fixed update rhythm (for example every two hours during a SEV-1) and stick to it even when there is nothing new. Predictable updates reduce the pressure on responders from people asking for status.
        </Note>
      </div>
    ),
  },
  {
    id: 'digital-forensics',
    title: 'Digital Forensics Essentials',
    difficulty: 'INTERMEDIATE',
    readTime: '19 min',
    labLink: '/modules/blue-team/lab',
    takeaways: [
      'Collect evidence in order of volatility (RFC 3227): memory and live network state first, disk next, logs and backups last. Never power off a live suspect host before capturing memory unless it is actively causing harm.',
      'Hash every acquisition and work on copies; a forensic image you cannot prove is unaltered has little value.',
      'Volatility 3 recovers processes, network connections, command lines and injected code from memory; compare pslist with psscan and look for odd parents, paths and connections.',
      'KAPE and Velociraptor collect targeted triage artefacts in minutes, which is usually more valuable early in an incident than a full disk image.',
      'Know what each Windows artefact actually proves: Prefetch strongly indicates execution, Shimcache and Amcache mainly show presence, LNK files and jump lists show files a user opened.',
      'Timelines turn thousands of artefacts into a story; normalise to UTC and corroborate each key event with at least two independent sources.',
    ],
    content: (
      <div>
        <H3>Forensics in Incident Response</H3>
        <P>
          Digital forensics answers the detailed questions that alerts and logs leave open. What exactly did the malware do on this host? Did the attacker access the HR share? When did they first arrive? Was data staged for exfiltration? In an incident context, speed matters more than courtroom completeness, so responders favour fast, targeted collection (triage) over imaging every disk, while still following practices that keep evidence defensible: documented acquisition, hashing, and chain of custody from chapter 8.
        </P>

        <H3>Order of Volatility</H3>
        <P>
          RFC 3227 sets out the principle: collect the most volatile evidence first, because it disappears soonest. Memory changes every millisecond and is lost entirely at power-off; a disk survives a reboot; an archived log may survive for years.
        </P>
        <Table
          headers={['Order', 'Evidence', 'Lifetime', 'How to collect']}
          rows={[
            ['1', 'CPU registers, cache', 'Nanoseconds', 'Not practical in IR'],
            ['2', 'RAM: processes, network connections, keys, injected code', 'Lost at shutdown', 'WinPmem, DumpIt, Magnet RAM Capture, EDR live response; LiME or AVML on Linux'],
            ['3', 'Live network state, ARP and routing caches, logged-on sessions', 'Seconds to minutes', 'netstat, EDR, live response scripts'],
            ['4', 'Temporary file systems, swap, pagefile, hiberfil', 'Until overwritten', 'Triage collection'],
            ['5', 'Disk', 'Until overwritten or wiped', 'Triage (KAPE, Velociraptor) or full image (FTK Imager, ewfacquire, dc3dd)'],
            ['6', 'Remote logs, SIEM, monitoring data', 'Retention period', 'SIEM export, cloud log export'],
            ['7', 'Backups, archival media', 'Long term', 'Restore to an isolated system'],
          ]}
        />
        <Note type="warn">
          Every action on a live system changes it. Running tools writes to memory and disk, so use trusted tools from external media or your EDR, record exactly what you ran and when, and prefer one well-documented collection over repeated ad-hoc commands.
        </Note>

        <H3>Memory Capture and Disk Images</H3>
        <P>
          Memory acquisition tools write a raw image of physical RAM to a file, typically the size of installed memory. On a 32 GB laptop that is a 32 GB file, so plan for external storage or network streaming. Many EDR platforms can trigger a memory capture remotely, which is often the fastest option for an isolated host. For disks, a full forensic image (E01 format records hashes and case metadata; raw dd images are simpler) captures every sector, including unallocated space where deleted files linger. With modern full-disk encryption, capture the image while the system is running and unlocked, or make sure you have the BitLocker recovery key, otherwise the image is unreadable.
        </P>
        <Pre label="ACQUISITION AND VERIFICATION">
{`# Windows memory capture (run from trusted external media, admin shell)
E:/tools> winpmem_mini_x64.exe E:/evidence/WS-FIN-042.mem

# Linux memory capture with AVML
$ sudo ./avml /mnt/evidence/srv-web01.lime

# Full disk image with ewfacquire (E01, embedded MD5/SHA1)
$ sudo ewfacquire -t /mnt/evidence/ws-fin-042 -c fast -D "IR-2026-118 WS-FIN-042" /dev/sdb

# Hash and record immediately
$ sha256sum /mnt/evidence/WS-FIN-042.mem | tee -a /mnt/evidence/hashes.txt
4b1e0c7a9d...f2  /mnt/evidence/WS-FIN-042.mem`}
        </Pre>

        <H3>Volatility 3 Basics</H3>
        <P>
          Volatility is the standard open-source memory analysis framework. Volatility 3 is a complete rewrite in Python 3 that replaced the old profile system with symbol tables, which it can download automatically from Microsoft&apos;s symbol server for Windows images (or load from offline symbol packs). It reached feature parity with Volatility 2 in 2025, and Volatility 2 is no longer maintained. Plugins are named by operating system: windows.pslist, linux.pslist, mac.pslist.
        </P>
        <Table
          headers={['Plugin', 'What it shows', 'Why it matters']}
          rows={[
            ['windows.info', 'OS version, build, kernel base, capture time', 'Confirms the image is readable and which system it is'],
            ['windows.pslist', 'Processes from the active process linked list', 'Fast overview; misses unlinked (hidden) processes'],
            ['windows.psscan', 'Processes found by scanning memory for process structures', 'Finds hidden and recently exited processes; diff against pslist'],
            ['windows.pstree', 'Parent-child process tree', 'Spot odd parents, e.g. explorer.exe spawning hidden PowerShell'],
            ['windows.cmdline', 'Command line of each process', 'Recovers encoded PowerShell, paths, arguments'],
            ['windows.netscan', 'TCP/UDP endpoints and listeners with owning PID', 'Links C2 connections to processes'],
            ['windows.malfind', 'Memory regions that are executable, private and look injected', 'Process injection, shellcode, reflective DLLs'],
            ['windows.svcscan', 'Services from the service control manager', 'Malicious services and their binary paths'],
            ['windows.dlllist / windows.handles', 'Loaded modules and open handles per process', 'Side-loaded DLLs, handles to lsass.exe'],
            ['windows.dumpfiles', 'Extracts cached files from memory', 'Recover the malware binary for hashing and analysis'],
          ]}
        />
        <Pre label="VOLATILITY 3 SESSION">
{`$ vol -f WS-FIN-042.mem windows.pslist
PID   PPID  ImageFileName    Offset(V)       Threads Handles SessionId Wow64 CreateTime
4     0     System           0xa48c1c086040  198     -       N/A       False 2026-11-03 07:58:12
...
4120  4092  explorer.exe     0xa48c22b1e080  82      -       1         False 2026-11-03 08:04:51
7312  4120  powershell.exe   0xa48c25c3a300  14      -       1         False 2026-11-03 21:17:44
8012  688   updsvc.exe       0xa48c26a17080  6       -       0         False 2026-11-03 21:19:03

$ vol -f WS-FIN-042.mem windows.netscan | grep -E "7312|8012"
Offset          Proto  LocalAddr    LocalPort ForeignAddr  ForeignPort State        PID   Owner
0xa48c2611b010  TCPv4  10.20.30.42  50227     192.0.2.66   443         ESTABLISHED  8012  updsvc.exe
0xa48c25f0e4a0  TCPv4  10.20.30.42  50133     192.0.2.66   443         CLOSED       7312  powershell.e

$ vol -f WS-FIN-042.mem windows.malfind --pid 8012`}
        </Pre>
        <P>
          Read the output like an analyst. PID 688 is services.exe on this system, so updsvc.exe is running as a service. It is the process holding the established connection to the C2 address. The PowerShell process that started the chain is still present, with a closed connection to the same IP. Running windows.cmdline next would recover the full encoded command, and windows.dumpfiles could extract the updsvc.exe image for hashing and malware analysis (see the Malware Analysis module).
        </P>

        <H3>Triage Collection with KAPE and Velociraptor</H3>
        <P>
          A full disk image of a 1 TB laptop can take hours to acquire and days to process. Triage collection grabs the few gigabytes of artefacts that answer most questions: registry hives, event logs, Prefetch, Amcache, the MFT and USN journal, browser databases, LNK files and jump lists, scheduled tasks, and SRUM. KAPE (Kroll Artifact Parser and Extractor) does this with Targets (what to collect) and Modules (what to run on it, for example Eric Zimmerman&apos;s parsers). Velociraptor does the same and more at fleet scale, using VQL queries pushed to agents, which makes it ideal for scoping: &quot;which of our 5,000 hosts have a service called UpdSvc?&quot;
        </P>
        <Pre label="KAPE TRIAGE + PARSING">
{`kape.exe --tsource C: --tdest E:/kape/tout --target !SANS_Triage --vhdx WS-FIN-042 ^
         --mdest E:/kape/mout --module !EZParser

# Outputs: CSVs from PECmd (Prefetch), AmcacheParser, AppCompatCacheParser (Shimcache),
# LECmd (LNK), JLECmd (jump lists), EvtxECmd (event logs), MFTECmd ($MFT, $J), RECmd (registry)`}
        </Pre>

        <H3>Windows Artefacts and What They Prove</H3>
        <P>
          A common mistake is treating every artefact as proof of execution. Each one has specific semantics, and the courts and your colleagues will expect you to know them. Paths below are written with forward slashes.
        </P>
        <Table
          headers={['Artefact', 'Location', 'What it tells you', 'Caveats']}
          rows={[
            ['Prefetch', 'C:/Windows/Prefetch/*.pf', 'Program executed: run count, up to 8 last run times, files and directories referenced', 'Often disabled on servers; limited number of entries kept'],
            ['Amcache', 'C:/Windows/AppCompat/Programs/Amcache.hve', 'File path, SHA-1 hash, size, publisher of programs present', 'Indicates presence, not reliably execution; great for recovering a hash of a deleted file'],
            ['Shimcache (AppCompatCache)', 'SYSTEM hive: CurrentControlSet/Control/Session Manager/AppCompatCache', 'File paths and last-modified times seen by the compatibility engine', 'No execution flag on Windows 10/11; written at shutdown, so live systems lag'],
            ['LNK files', 'C:/Users/<user>/AppData/Roaming/Microsoft/Windows/Recent/', 'Files a user opened: target path, target timestamps, volume serial, device name', 'Also created when malicious LNKs are opened from ZIPs'],
            ['Jump lists', '.../Recent/AutomaticDestinations/', 'Per-application recently opened files', 'App ID mapping needed'],
            ['Browser history', 'Chrome/Edge: .../User Data/Default/History (SQLite); Firefox: places.sqlite', 'URLs visited, downloads, timestamps', 'Chromium uses microseconds since 1601; Firefox microseconds since 1970'],
            ['SRUM', 'C:/Windows/System32/sru/SRUDB.dat', 'Per-application network bytes and resource use over ~30-60 days', 'Hourly granularity'],
            ['$MFT and $UsnJrnl:$J', 'NTFS metadata', 'File creation, rename, deletion history', 'Compare $STANDARD_INFORMATION and $FILE_NAME times to spot timestomping'],
            ['Event logs', 'C:/Windows/System32/winevt/Logs/*.evtx', 'Logons, services, tasks, PowerShell, Defender', 'May be cleared (look for 1102 and gaps)'],
          ]}
        />

        <H3>Building a Timeline</H3>
        <P>
          A timeline merges artefacts from many sources into one chronological view. You can build a targeted one by hand in a spreadsheet from the parsed CSVs, or a super-timeline with Plaso (log2timeline.py to extract, psort.py to sort and filter) and review it in Timeline Explorer. Normalise everything to UTC, focus on a window around known malicious events (a pivot point), and corroborate each important event with a second, independent source.
        </P>
        <Pre label="TARGETED TIMELINE - WS-FIN-042 (UTC)">
{`2026-11-03 21:02:10  Mail gateway   m.hale receives "Q4 invoice overdue" with Invoice_Q4.zip
2026-11-03 21:17:39  LNK (LECmd)    Invoice_Q4.pdf.lnk opened from Temp ZIP extraction folder
2026-11-03 21:17:44  Sysmon 1/4688  powershell.exe -nop -w hidden -enc ... (parent explorer.exe)
2026-11-03 21:17:46  Proxy          GET https://cdn-telemetry.example/s/upd.ps1  (PowerShell UA)
2026-11-03 21:18:58  $MFT / Sysmon 11  C:/ProgramData/UpdSvc/updsvc.exe created
2026-11-03 21:19:02  System 7045    Service "UpdSvc" installed, auto start
2026-11-03 21:19:03  Prefetch       UPDSVC.EXE-1F3A2B4C.pf first run
2026-11-03 21:19:05  Zeek conn      Beaconing to 192.0.2.66:443 every ~60s begins
2026-11-03 21:40:12  DC01 4625 x126 Password spray from 10.20.30.42 (63 accounts)
2026-11-03 21:43:51  DC01 4624      svc_backup logon type 3 from 10.20.30.42
2026-11-03 22:31:09  bastion01      Accepted password for svc_backup from 10.20.30.42`}
        </Pre>
        <Note type="tip">
          Write the timeline as you go, not at the end. Each confirmed entry generates new pivots: a new account, a new host, a new hash. That iterative loop of pivot, confirm, record is what scoping actually is.
        </Note>
      </div>
    ),
  },
  {
    id: 'threat-intel-putting-it-together',
    title: 'Threat Intelligence and Putting It Together',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/blue-team/lab',
    takeaways: [
      'IOCs (hashes, IPs, domains) are cheap for attackers to change and expire quickly; TTPs (how the attacker operates) are expensive to change and make the most durable detections.',
      'The Pyramid of Pain ranks indicator types by how much it hurts the adversary when you detect them, from hash values at the bottom to TTPs at the top.',
      'STIX 2.1 is the language for describing threat intelligence and TAXII 2.1 is the protocol for exchanging it; MISP is the most widely used open-source platform for storing and sharing it.',
      'An incident report must serve two audiences: a short executive summary of impact and decisions, and a precise technical body with timeline, root cause, IOCs, TTPs and recommendations.',
      'Purple teaming closes the loop: emulate a technique, check whether it was logged, detected and responded to, fix the gap, and repeat.',
    ],
    content: (
      <div>
        <H3>What Threat Intelligence Is (and Is Not)</H3>
        <P>
          Threat intelligence is analysed information about adversaries that helps a specific organisation make better decisions. The emphasis on &quot;analysed&quot; and &quot;specific&quot; matters. A raw feed of 400,000 IP addresses is data, not intelligence. A one-page assessment that says &quot;a financially motivated group is phishing East African logistics firms with invoice-themed LNK files, here is how their loader behaves, and here are three detections to deploy this week&quot; is intelligence.
        </P>
        <Table
          headers={['Level', 'Audience', 'Example']}
          rows={[
            ['Strategic', 'Executives, board', 'Ransomware against our sector rose sharply this year; recommended investment in backup resilience'],
            ['Operational', 'IR leads, SOC managers', 'Campaign details: who is targeted, timing, objectives, infrastructure patterns'],
            ['Tactical', 'Detection engineers, hunters', 'TTPs mapped to ATT&CK, behaviour of the loader, Sigma and Suricata rules'],
            ['Technical', 'Automated controls', 'IOCs: hashes, domains, IPs, URLs with confidence and expiry'],
          ]}
        />

        <H3>IOCs vs TTPs</H3>
        <P>
          Indicators of Compromise (IOCs) are observable artefacts associated with malicious activity: file hashes, IP addresses, domains, URLs, email sender addresses, mutex names. They are precise, easy to automate, and useful for quick sweeps and blocking. They are also fragile. An attacker can recompile malware to get a new hash in seconds and rotate domains and IPs for a few dollars, and shared infrastructure (CDNs, cloud hosting) means blocking an IP can hit legitimate traffic.
        </P>
        <P>
          Tactics, Techniques and Procedures (TTPs) describe how an adversary operates: initial access through LNK files in ZIP attachments, execution through hidden encoded PowerShell, persistence through a service in ProgramData, credential access through password spraying, and so on. Changing TTPs requires the attacker to retool, retrain and accept new risks. That is why detections built on TTPs, like the Sigma rule in chapter 4, remain useful long after the original campaign&apos;s IOCs have expired.
        </P>

        <H3>The Pyramid of Pain</H3>
        <P>
          David Bianco&apos;s Pyramid of Pain (2013) is the classic model. Each level up is harder for the attacker to change, so detecting and denying it causes them more pain.
        </P>
        <Pre label="THE PYRAMID OF PAIN (TOP = MOST PAIN FOR THE ADVERSARY)">
{`                 +-----------+
                 |   TTPs    |   TOUGH        - must change how they operate
               +---------------+
               |     Tools     |   CHALLENGING  - must find, buy or build new tools
           +-----------------------+
           | Network/Host Artifacts|   ANNOYING     - URI patterns, service names, UA strings
         +---------------------------+
         |       Domain Names        |   SIMPLE       - register a new domain
       +-------------------------------+
       |         IP Addresses          |   EASY         - move to new hosting
     +-----------------------------------+
     |           Hash Values             |   TRIVIAL      - recompile or pad the file
     +-----------------------------------+`}
        </Pre>
        <P>
          Notice where the lab&apos;s artefacts sit. The updsvc.exe hash and the 192.0.2.66 address are near the bottom: block them, but expect them to change. The service name UpdSvc in ProgramData and the PowerShell user agent fetching a .ps1 are host and network artefacts in the middle. The behaviour, hidden encoded PowerShell launched from a shortcut and followed by service creation, is a TTP at the top, and it is what the Sigma rule in chapter 4 targets.
        </P>

        <H3>STIX, TAXII and MISP</H3>
        <P>
          STIX 2.1 (Structured Threat Information Expression) is an OASIS standard JSON format for describing threat intelligence as objects and relationships: indicators, malware, threat actors, campaigns, attack patterns (which reference ATT&amp;CK), observed data, sightings and more. TAXII 2.1 is the companion HTTPS protocol for publishing and consuming collections of STIX objects. Together they let a SIEM, TIP or EDR pull intelligence from a sharing community automatically.
        </P>
        <Pre label="STIX 2.1 INDICATOR AND RELATIONSHIP (ABRIDGED)">
{`{
  "type": "indicator",
  "spec_version": "2.1",
  "id": "indicator--6c1a6b0e-2d4f-4b8e-9a51-7f0d3c2e9b14",
  "created": "2026-11-04T09:12:00.000Z",
  "modified": "2026-11-04T09:12:00.000Z",
  "name": "GreyFinch C2 domain",
  "pattern": "[domain-name:value = 'cdn-telemetry.example']",
  "pattern_type": "stix",
  "valid_from": "2026-11-04T09:12:00Z",
  "valid_until": "2027-02-04T00:00:00Z",
  "confidence": 85,
  "labels": ["malicious-activity"]
}
{
  "type": "relationship",
  "relationship_type": "indicates",
  "source_ref": "indicator--6c1a6b0e-2d4f-4b8e-9a51-7f0d3c2e9b14",
  "target_ref": "malware--0b3e9c55-1f6d-4a8e-b2c7-9d4e1a6f3c20"
}`}
        </Pre>
        <P>
          MISP (Malware Information Sharing Platform) is the most widely used open-source threat intelligence platform. It stores events (an incident or campaign) containing attributes (individual indicators) and objects, supports tagging with taxonomies such as TLP (Traffic Light Protocol, now version 2.0 with TLP:CLEAR, GREEN, AMBER, AMBER+STRICT and RED) and galaxies (actor and ATT&amp;CK clusters), correlates new indicators against everything already stored, and synchronises with other MISP instances in sharing communities such as national CERTs and sector ISACs. It also exposes STIX and TAXII interfaces and a REST API that SIEMs and SOAR tools query during enrichment.
        </P>
        <Pre label="QUERYING MISP DURING TRIAGE (PyMISP)">
{`from pymisp import PyMISP
misp = PyMISP("https://misp.corp.example", API_KEY, ssl=True)
hits = misp.search(controller="attributes", value="cdn-telemetry.example", include_context=True)
for a in hits["Attribute"]:
    print(a["Event"]["info"], a["type"], a["category"], a.get("Tag", []))

# GreyFinch - invoice LNK campaign (Nov 2026)  domain  Network activity  [tlp:amber, misp-galaxy:mitre-attack-pattern="T1204.002"]`}
        </Pre>
        <P>
          Always attach context to indicators: first and last seen dates, confidence, source, and an expiry. Stale indicators are a major source of false positives; an IP used for C2 six months ago may now host an innocent website.
        </P>

        <H3>Writing an Incident Report</H3>
        <P>
          The final report is what remains of an incident when everyone has gone back to normal work. It informs executives, satisfies regulators and insurers, and drives the improvement backlog. Write for two audiences: a one-page executive summary in plain language, and a technical body detailed enough for another responder to reproduce your conclusions.
        </P>
        <Pre label="INCIDENT REPORT STRUCTURE">
{`IR-2026-118  |  TLP:AMBER  |  Final  |  2026-11-12

1. Executive summary
   - What happened, in three sentences. Business impact. Is it over?
   - Key decisions taken and decisions still needed.
2. Scope and impact
   - Hosts, accounts and data affected; data exfiltration assessment (confirmed / not / unknown)
3. Timeline (UTC)
   - First malicious event, detection, containment, eradication, recovery milestones
4. Technical analysis
   - Initial access, execution, persistence, credential access, lateral movement, C2, actions on objectives
   - Each stage mapped to ATT&CK, with evidence references (E001, E002 ...)
5. Root cause and contributing factors
   - e.g. LNK in ZIP not blocked; svc_backup password weak and not in a privileged tier; no MFA on bastion
6. Indicators of compromise (appendix, also shared as STIX / MISP event)
7. Metrics: time to detect, time to contain, time to recover
8. Recommendations - owner, priority, due date for each
9. Lessons learned (blameless): what went well, what did not, what we will change`}
        </Pre>
        <Note type="tip">
          State your confidence. &quot;We assess with high confidence that no data left the network, based on complete proxy and flow logs for the period&quot; is far more useful than &quot;no exfiltration occurred&quot;, and it is honest about what the evidence can support.
        </Note>

        <H3>Purple Teaming with GHOSTNET</H3>
        <P>
          Purple teaming means red and blue working together, in the open, to improve detection and response. Instead of a red team running a covert engagement and handing over a report months later, the two teams sit together: the red side executes a technique, the blue side checks whether it was logged, whether a detection fired, and whether the response would have worked; then they fix gaps and run it again. Tools such as Atomic Red Team (small, mapped tests per ATT&amp;CK technique), MITRE Caldera (automated adversary emulation) and published adversary emulation plans make this repeatable.
        </P>
        <P>
          GHOSTNET&apos;s offensive modules are your red-side syllabus. Pair each one with the defensive question it raises:
        </P>
        <Table
          headers={['Offensive module', 'Technique to emulate', 'Blue-side check']}
          rows={[
            ['MOD-05 Active Directory', 'Kerberoasting, DCSync', '4769 with RC4 (0x17) bursts; 4662 replication rights from a non-DC'],
            ['MOD-10 Social Engineering', 'Phishing with LNK/HTML smuggling payloads', 'Mail gateway verdicts, Office/explorer child process detections'],
            ['MOD-11 Red Team Operations', 'C2 beaconing, EDR evasion', 'Beacon hunting (chapter 5), sensor tamper alerts (chapter 7)'],
            ['MOD-07 Malware Analysis', 'Persistence via services and run keys', '7045 / Sysmon 13 rules; YARA on dropped binaries'],
            ['MOD-08 Network Attacks', 'LLMNR poisoning, scanning', 'Zeek and Suricata alerts; denied east-west connection bursts'],
            ['MOD-09 Cloud Security', 'Access key abuse, logging disabled', 'CloudTrail CreateAccessKey and StopLogging detections'],
          ]}
        />
        <Pre label="A PURPLE TEAM TEST CARD">
{`Test:        T1059.001 - encoded hidden PowerShell from explorer.exe
Execute:     Invoke-AtomicTest T1059.001 -ShowDetailsBrief, then run the encoded-command test (or a scripted LNK in a lab VM)
Expected:    Sysmon 1 + 4688 logged | Sigma rule fires (high) | EDR alert | SOAR enriches
Observed:    Logged YES | Sigma YES (4 min latency) | EDR YES | SOAR enrichment FAILED (API key expired)
Action:      Rotate SOAR key; add data-health check for enrichment failures; retest 2026-11-18`}
        </Pre>

        <H3>Putting It All Together</H3>
        <P>
          Step back and the chapters form a single loop. You collect the right logs (chapter 2) into a SIEM that parses and correlates them (chapter 3). Detection engineering turns attacker behaviour into tested rules (chapter 4), and hunting finds what the rules miss (chapter 5). Network and endpoint controls both prevent attacks and generate telemetry (chapters 6 and 7). When something gets through, the IR process contains and removes it (chapter 8), forensics explains exactly what happened (chapter 9), and intelligence plus purple teaming feed those lessons back into better logging, rules and hardening (chapter 10). Run that loop continuously and every intrusion, real or emulated, makes the next one harder. Now go and work a night shift: the lab drops you into exactly this intrusion, one alert at a time.
        </P>
      </div>
    ),
  },
]

export default function BlueTeamPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem',
        fontFamily: mono, fontSize: '0.7rem', color: '#4a7a80'
      }}>
        <Link href="/" style={{ color: '#4a7a80', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-14 // BLUE TEAM &amp; INCIDENT RESPONSE</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/modules/mobile-security" style={{
            fontFamily: mono, fontSize: '0.65rem', color: '#4a7a80',
            textDecoration: 'none', letterSpacing: '0.05em'
          }}>
            &#8592; MOD-13: MOBILE SECURITY
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontFamily: mono, fontSize: '9px', letterSpacing: '0.2em',
          color: '#4a7a80', textTransform: 'uppercase', marginBottom: '0.5rem'
        }}>
          MODULE 14 &middot; BLUE TEAM
        </div>
        <h1 style={{
          fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent,
          margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(77,208,225,0.4)'
        }}>
          BLUE TEAM &amp; INCIDENT RESPONSE
        </h1>
        <p style={{ color: '#4a7a80', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>
          SOC operations &middot; Logs &middot; SIEM &middot; Detection engineering &middot; Threat hunting &middot; Network &amp; endpoint defence &middot; Incident response &middot; Forensics &middot; Threat intel
        </p>
      </div>

      {/* Chapter overview stats */}
      <div className="module-stat-grid">
        {[
          ['10', 'CHAPTERS'],
          ['~3.5hr', 'TOTAL READ'],
          ['INTERMEDIATE', 'DIFFICULTY'],
          ['MOD-14', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(77,208,225,0.04)', border: '1px solid rgba(77,208,225,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#1a4a50', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <ModuleCodex moduleId="blue-team" accent={accent} chapters={chapters} />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #0a1e22' }}>
        <div style={{ background: 'rgba(77,208,225,0.04)', border: '1px solid rgba(77,208,225,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#1a4a50', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-14 Interactive Lab: Operation Night Shift</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#1a4a50', marginBottom: '1.5rem' }}>20 steps &middot; 450 XP &middot; Alert triage &middot; SIEM queries &middot; Memory forensics</div>
          <Link href="/modules/blue-team/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(77,208,225,0.6)', borderRadius: '6px', background: 'rgba(77,208,225,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(77,208,225,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Link href="/modules/mobile-security" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#1a4a50' }}>&#8592; MOD-13: MOBILE SECURITY</Link>
        </div>
      </div>
    </div>
  )
}
