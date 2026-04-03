'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#ff9500'
const moduleId = 'cloud-security'
const moduleName = 'Cloud Security'
const moduleNum = '09'
const xpTotal = 275

const steps: LabStep[] = [
  {
    id: 'cloud-01',
    title: 'AWS Credential Discovery',
    objective: 'An attacker gains access to an EC2 instance. What URL retrieves AWS temporary credentials from the metadata service?',
    hint: 'The IMDS URL is 169.254.169.254. The path includes /latest/meta-data/iam/security-credentials/',
    answers: [
      'http://169.254.169.254/latest/meta-data/iam/security-credentials/',
      '169.254.169.254/latest/meta-data/iam/security-credentials/',
      'curl http://169.254.169.254/latest/meta-data/iam/security-credentials/'
    ],
    xp: 25,
    explanation: 'The EC2 Instance Metadata Service (IMDS) at 169.254.169.254 exposes temporary credentials for the attached IAM role. Attackers extract these to pivot to AWS APIs. Mitigation: enforce IMDSv2 (requires session tokens, blocking SSRF exploitation).'
  },
  {
    id: 'cloud-02',
    title: 'IAM Enumeration',
    objective: 'Enumerate what permissions a compromised AWS key has. What tool automates AWS IAM permission enumeration?',
    hint: 'The tool is "enumerate-iam" — runs through hundreds of API calls to find what actions are permitted.',
    answers: ['enumerate-iam', 'pacu', 'ScoutSuite', 'prowler', 'aws iam'],
    xp: 25,
    explanation: 'enumerate-iam --access-key KEY --secret-key SECRET --region us-east-1 tests hundreds of AWS API calls and reports which succeed. This tells you exactly what the compromised key can do without triggering obvious alerts on specific sensitive API calls.'
  },
  {
    id: 'cloud-03',
    title: 'S3 Bucket Misconfiguration',
    objective: 'Check if an S3 bucket allows public access. What AWS CLI command lists bucket contents without authentication?',
    hint: 'Use "aws s3 ls" with --no-sign-request to skip authentication.',
    answers: [
      'aws s3 ls s3://bucketname --no-sign-request',
      'aws s3 ls --no-sign-request',
      's3 ls --no-sign-request'
    ],
    flag: 'FLAG{s3_misconfigured}',
    xp: 30,
    explanation: 'aws s3 ls s3://target-bucket --no-sign-request tests for public read access without credentials. If it lists files, the bucket is publicly readable. Check for: database backups, credentials files, source code, and PII. Report to the bucket owner immediately in a real scenario.'
  },
  {
    id: 'cloud-04',
    title: 'Lambda Environment Variables',
    objective: 'Lambda functions often store secrets in environment variables. What AWS API call retrieves a Lambda function\'s configuration including env vars?',
    hint: 'The AWS CLI command is "aws lambda get-function-configuration"',
    answers: ['aws lambda get-function-configuration', 'get-function-configuration', 'lambda get-function-configuration'],
    xp: 30,
    explanation: 'aws lambda get-function-configuration --function-name FUNC_NAME returns all config including Environment.Variables — where developers often hardcode API keys, database passwords, and JWT secrets. Always use AWS Secrets Manager or Parameter Store instead.'
  },
  {
    id: 'cloud-05',
    title: 'CloudTrail Log Analysis',
    objective: 'CloudTrail logs all AWS API calls. What event name in CloudTrail indicates someone called GetCallerIdentity (used by attackers to check what account they\'re in)?',
    hint: 'CloudTrail eventName matches the API call name exactly.',
    answers: ['GetCallerIdentity', 'getcalleridentity', 'sts:GetCallerIdentity'],
    flag: 'FLAG{cloudtrail_analysed}',
    xp: 35,
    explanation: 'CloudTrail records eventName: GetCallerIdentity — a common first step attackers take to identify the account. Filter CloudTrail with: aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=GetCallerIdentity. Unusual source IPs or user agents indicate compromise.'
  },
  {
    id: 'cloud-06',
    title: 'GCP Metadata Service',
    objective: 'GCP has its own metadata service. What URL retrieves the GCP service account token from inside a VM? (hint: metadata.google.internal with a specific required header)',
    hint: 'The GCP metadata endpoint requires the Metadata-Flavor: Google header. The path is /computeMetadata/v1/instance/service-accounts/default/token',
    answers: [
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      'metadata.google.internal'
    ],
    xp: 25,
    explanation: 'GCP VMs reach the metadata service at http://metadata.google.internal/computeMetadata/v1/ - but unlike AWS IMDS, every request must include the header Metadata-Flavor: Google or it will be rejected with a 403. This server-side check prevents simple SSRF attacks that just follow redirects. The token endpoint returns an OAuth2 access token and expiry for the attached service account. From there, attackers use the token to call Google Cloud APIs: gcloud auth list (identify active accounts), gcloud projects list (enumerate all projects the service account can access), gcloud iam service-accounts list (find other service accounts), and gcloud projects get-iam-policy PROJECT (map all IAM bindings). Service account impersonation is a major privilege escalation path: if your service account has iam.serviceAccountTokenCreator on another account, you can generate tokens for that account with higher privileges.'
  },
  {
    id: 'cloud-07',
    title: 'Azure Managed Identity',
    objective: 'Azure VMs use Managed Identity for credential-free authentication. What URL retrieves Azure access tokens from inside a VM?',
    hint: 'Azure IMDS also lives at 169.254.169.254 but under the /metadata/ path. It requires a Metadata:true header.',
    answers: [
      'http://169.254.169.254/metadata/identity/oauth2/token',
      '169.254.169.254/metadata/identity'
    ],
    xp: 25,
    explanation: 'Azure Instance Metadata Service (IMDS) at http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/ returns a bearer token for the VM managed identity. The required header is Metadata: true - without it the request is rejected. The returned access token can then be used to call Azure Resource Manager APIs. Key commands for post-exploitation: az account list (enumerate subscriptions), az role assignment list --all (find what the identity can access), az keyvault list (find Key Vaults), az keyvault secret list --vault-name VAULT (enumerate secrets), az storage account list (find storage accounts). Managed identities have no password to rotate, so a compromised VM with an over-privileged identity is a high-severity finding.'
  },
  {
    id: 'cloud-08',
    title: 'Kubernetes RBAC Misconfiguration',
    objective: 'A pod has a service account with cluster-admin permissions. What kubectl command lists all secrets across all namespaces?',
    hint: 'Use kubectl get secrets with a flag for all namespaces. There is a short form flag too.',
    answers: [
      'kubectl get secrets --all-namespaces',
      'kubectl get secrets -A'
    ],
    flag: 'FLAG{k8s_secrets_exposed}',
    xp: 30,
    explanation: 'Every pod in Kubernetes automatically receives a service account token mounted at /var/run/secrets/kubernetes.io/serviceaccount/token. If that service account has been granted cluster-admin (or wide RBAC permissions), the pod can call the Kubernetes API server with full privileges. Check your own permissions first: kubectl auth can-i --list shows every allowed verb and resource. From inside a pod, you can curl the API directly using the mounted token and CA cert. kubectl get secrets -A lists all Kubernetes Secrets across every namespace - these often contain database passwords, TLS certificates, image pull credentials, and other service tokens. Namespace breakout technique: if you can create pods, schedule one with hostPID:true or mount the host filesystem to escape the container. Direct etcd access (port 2379) bypasses all RBAC entirely and exposes the entire cluster state including all secrets in plaintext.'
  },
  {
    id: 'cloud-09',
    title: 'Serverless Function Exploitation',
    objective: 'A misconfigured serverless function exposes its source code. AWS Lambda functions can be downloaded if you have lambda:GetFunction. What does the response Code.Location field contain?',
    hint: 'The Code.Location field is a time-limited URL pointing to an S3 location where the deployment package is stored.',
    answers: [
      'presigned s3 url',
      's3 url',
      'download url',
      'pre-signed url'
    ],
    xp: 25,
    explanation: 'aws lambda get-function --function-name FUNC_NAME returns a JSON response where Code.Location is a pre-signed S3 URL valid for approximately 10 minutes. Download the deployment ZIP with curl, then unzip and inspect. Developers frequently hardcode secrets directly in Lambda source code, store credentials in .env files bundled into the ZIP, or rely on environment variables that are also returned by get-function-configuration. Lambda layers (shared code libraries) can also be downloaded with aws lambda get-layer-version-by-arn and often contain shared credentials or internal libraries. VPC configuration leaks in the Lambda response can reveal internal network topology. Additional attack surface: if you have lambda:UpdateFunctionCode, you can replace the function entirely and redirect its execution, intercepting any data it processes including database query results, API responses, and payment information.'
  },
  {
    id: 'cloud-10',
    title: 'Cloud Storage Enumeration',
    objective: 'Enumerate cloud storage buckets via DNS permutation. What tool brute-forces S3 bucket names by trying common permutations of a company name across multiple cloud providers?',
    hint: 'One tool accepts a keyword with -k and checks AWS S3, GCP Storage, and Azure Blobs in a single run.',
    answers: [
      's3scanner',
      'bucket finder',
      'cloud enum',
      'cloudenum',
      'lazys3',
      'gcpbucketbrute'
    ],
    flag: 'FLAG{cloud_storage_enumerated}',
    xp: 30,
    explanation: 'cloud_enum -k companyname automatically generates hundreds of permutations (companyname-dev, companyname-backup, companyname-prod, etc.) and checks each across AWS S3, Google Cloud Storage, and Azure Blob Storage simultaneously. s3scanner takes a list of bucket names and checks each for public read, public write, and authenticated access. lazys3 -w wordlist.txt checks S3 specifically using a custom wordlist. Successful finds frequently contain database backup files (.sql, .dump), credential files (.env, config.yml), source code archives, internal documentation, and customer PII - all representing serious data breaches. Bucket takeover is a related attack: when a DNS CNAME record points to a deleted S3 bucket name, an attacker can register that same bucket name and serve arbitrary content from the victim domain, enabling phishing and asset injection attacks. Always check bucket ACLs with aws s3api get-bucket-acl after discovery.'
  }
]

export default function CloudSecurityLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_cloud-security-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a4a00' }}>
        <Link href="/" style={{ color: '#7a4a00', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/cloud-security" style={{ color: '#7a4a00', textDecoration: 'none' }}>CLOUD SECURITY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/cloud-security" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #3a2000', borderRadius: '3px', color: '#7a4a00', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(255,149,0,0.04)', border: '1px solid rgba(255,149,0,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#3a2000', border: p.active ? '2px solid ' + accent : '1px solid #3a2000', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#5a3a00', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#3a2000', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a6a40' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP AVAILABLE
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE — LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* PHASE 1 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a3a00', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Cloud Security Lab</h1>
          </div>
        </div>

        <p style={{ color: '#8a7a5a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          AWS credential theft, IAM enumeration, S3 misconfigurations, Lambda exploitation, CloudTrail analysis, GCP metadata, Azure Managed Identity, Kubernetes RBAC, and cloud storage enumeration.
          Type real commands, earn XP, and capture flags. Complete all 10 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(255,149,0,0.03)', border: '1px solid rgba(255,149,0,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#3a2000', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['EC2 IMDS exploitation', 'IAM privilege escalation', 'S3 bucket misconfig', 'Lambda secrets', 'CloudTrail analysis', 'SSRF to IMDS', 'Pacu framework', 'AWS CLI weaponization'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#8a6a40', background: 'rgba(255,149,0,0.06)', border: '1px solid rgba(255,149,0,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="cloud-security-lab"
          moduleId={moduleId}
          title="Cloud Security Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(255,149,0,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(255,149,0,0.4)' : '#3a2000'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a3a00', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#8a6a40' : '#5a3a00', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#5a3a00' }}>Full Cloud Security Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(255,149,0,0.04)' : '#080500', border: '1px solid ' + (guidedDone ? 'rgba(255,149,0,0.25)' : '#1a1000'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#8a6a40' : '#3a2000', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#5a3a00', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#8a6a40', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Cloud Security
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a3a00', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['AWS CLI commands', 'Pacu exploitation', 'IAM policy analysis', 'S3 enumeration', 'Lambda inspection', 'CloudTrail forensics'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#3a2000' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#8a6a40' : '#3a2000' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(255,149,0,0.6)' : '#3a2000'), borderRadius: '6px', background: guidedDone ? 'rgba(255,149,0,0.12)' : 'transparent', color: guidedDone ? accent : '#3a2000', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(255,149,0,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a2000' }}>Complete all 10 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#080500' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0a0700', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a3a00' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any cloud security technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #3a2000', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a3a00', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — CLOUD ATTACK COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#080500', border: '1px solid #1a1000', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['curl http://169.254.169.254/latest/meta-data/iam/security-credentials/', 'Steal IAM role credentials via IMDS'],
                ['aws sts get-caller-identity', 'Check which account/role you have'],
                ['aws s3 ls s3://bucket --no-sign-request', 'Test public S3 bucket access'],
                ['aws iam list-attached-user-policies --user-name USER', 'List policies for a user'],
                ['enumerate-iam --access-key KEY --secret-key SEC', 'Auto-enumerate all IAM permissions'],
                ['aws lambda get-function-configuration --function-name FUNC', 'Get Lambda env vars'],
                ['aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=GetCallerIdentity', 'Search CloudTrail logs'],
                ['pacu', 'AWS exploitation framework'],
                ['ScoutSuite --provider aws', 'Cloud security posture audit'],
                ['prowler -M csv', 'AWS security benchmark checks'],
                ['aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,PublicIpAddress]"', 'List all EC2 instances'],
                ['aws secretsmanager list-secrets', 'Enumerate Secrets Manager entries'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#060300', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#8a6a40', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1a1000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/cloud-security" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a3a00' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/social-engineering/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a3a00' }}>MOD-10 SOCIAL ENGINEERING LAB &#8594;</Link>
      </div>
    </div>
  )
}
