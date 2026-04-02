'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#ff9500'

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
    objective: 'Lambda functions often store secrets in environment variables. In an SSRF/RCE scenario, what AWS API call retrieves a Lambda function\'s configuration including env vars?',
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
  }
]

export default function CloudSecurityLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a4a00' }}>
        <Link href="/" style={{ color: '#7a4a00', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/cloud-security" style={{ color: '#7a4a00', textDecoration: 'none' }}>CLOUD SECURITY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#7a4a00', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-09 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>Cloud Security Lab</h1>
        <p style={{ color: '#8a7a5a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          AWS credential theft, IAM enumeration, S3 misconfigurations, Lambda exploitation, and CloudTrail analysis.
          Complete all 5 steps to earn 145 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #ff950022', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="cloud-security-lab"
        moduleId="cloud-security"
        title="Cloud Security Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
