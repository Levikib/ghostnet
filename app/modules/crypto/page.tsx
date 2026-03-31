'use client'
import React from 'react'
import Link from 'next/link'

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: '#ffb347', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ color: '#3a2800', fontSize: '0.8rem' }}>//</span> {children}
  </h2>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: '#cc7a00', marginTop: '2rem', marginBottom: '0.75rem' }}>▸ {children}</h3>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #2e1e00', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#ffb347', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const Alert = ({ type, children }: { type: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const c: Record<string, [string, string, string]> = {
    info:   ['#ffb347', 'rgba(255,179,71,0.05)',  'NOTE'],
    warn:   ['#ff4136', 'rgba(255,65,54,0.05)',   'WARNING'],
    danger: ['#ff4136', 'rgba(255,65,54,0.07)',   'CRITICAL'],
    tip:    ['#00ff41', 'rgba(0,255,65,0.04)',    'PRO TIP'],
  }
  const [color, bg, label] = c[type]
  return (
    <div style={{ background: bg, borderLeft: `3px solid ${color}`, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.5rem 0', border: `1px solid ${color}33`, borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #2e1e00' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#cc7a00', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #1a1000', background: i % 2 === 0 ? 'transparent' : 'rgba(255,179,71,0.02)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default function CryptoModule() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <span style={{ color: '#ffb347' }}>MOD-03 // CRYPTO & BLOCKCHAIN SECURITY</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.3)', borderRadius: '3px', color: '#ffb347', fontSize: '8px', letterSpacing: '0.15em' }}>CONCEPT</span>
          <Link href="/modules/crypto/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.15em' }}>LAB →</Link>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 03 · CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#ffb347', margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(255,179,71,0.35)' }}>CRYPTO & BLOCKCHAIN SECURITY</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', lineHeight: 1.6 }}>
          Blockchain architecture · Transaction forensics · Smart contract auditing · DeFi exploits · On-chain tracing · Privacy coins
        </p>
      </div>

      {/* TOC */}
      <div style={{ background: '#0e1005', border: '1px solid #2e1e00', borderRadius: '6px', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>TABLE OF CONTENTS</div>
        {[
          '01 — Blockchain Fundamentals: How It Actually Works',
          '02 — Transaction Anatomy & The UTXO Model',
          '03 — Blockchain Forensics: Tracing Funds On-Chain',
          '04 — Wallet Types, Keys & Address Analysis',
          '05 — Smart Contracts: Architecture & Vulnerability Classes',
          '06 — Smart Contract Auditing Methodology',
          '07 — DeFi Architecture & Exploit Patterns',
          '08 — Real DeFi Exploits — Case Studies',
          '09 — Privacy Coins & Mixing Techniques',
          '10 — Chainalysis, TRM Labs & Forensic Tooling',
          '11 — NFT Security & Marketplace Exploits',
          '12 — Crypto Exchange Security & API Vulnerabilities',
        ].map((item, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', padding: '3px 0', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#3a2800' }}>›</span><span>{item}</span>
          </div>
        ))}
      </div>

      {/* 01 */}
      <H2>01 — Blockchain Fundamentals: How It Actually Works</H2>
      <P>A blockchain is a distributed, append-only ledger maintained by a network of nodes. Every transaction is cryptographically linked to the previous one, forming an immutable chain. Understanding this structure is the foundation of both blockchain security research and forensic analysis.</P>

      <H3>The Block Structure</H3>
      <Pre label="// ANATOMY OF A BITCOIN BLOCK">{`BLOCK HEADER (80 bytes)
├── Version          (4 bytes)  — protocol version
├── Previous Hash    (32 bytes) — SHA256(SHA256(prev header)) — links chain
├── Merkle Root      (32 bytes) — hash of all transactions in this block
├── Timestamp        (4 bytes)  — unix time
├── Bits             (4 bytes)  — encoded difficulty target
└── Nonce            (4 bytes)  — miners increment this to find valid hash

BLOCK BODY
└── Transactions[]
    ├── Transaction 1 (coinbase — miner reward)
    ├── Transaction 2
    └── ... up to ~2,700 transactions (1MB limit for Bitcoin)

// KEY INSIGHT FOR FORENSICS:
// Every block is identified by SHA256(SHA256(block_header))
// Previous Hash creates the chain — changing any block invalidates all after it
// This is why blockchain data is immutable without controlling 51% of hashpower`}</Pre>

      <H3>Consensus Mechanisms</H3>
      <Table headers={['MECHANISM', 'HOW IT WORKS', 'CHAINS', 'SECURITY IMPLICATIONS']} rows={[
        ['Proof of Work (PoW)', 'Miners compete to find a nonce making block hash below target', 'Bitcoin, Litecoin', '51% attack requires >50% of global hashrate — expensive but theoretically possible for small chains'],
        ['Proof of Stake (PoS)', 'Validators stake tokens as collateral, selected proportionally', 'Ethereum, Cardano, Solana', '51% attack requires >50% of staked tokens — economic rather than computational cost'],
        ['Delegated PoS (DPoS)', 'Token holders vote for a fixed set of validators', 'EOS, TRON', 'Smaller validator set — cartel risk, easier to compromise fewer nodes'],
        ['Proof of Authority (PoA)', 'Pre-approved validators sign blocks', 'Many private/enterprise chains', 'Centralised by design — validators are known and trusted'],
      ]} />

      <Pre label="// 51% ATTACK — HOW IT WORKS">{`# Theory: if you control >50% of mining/staking power:
# 1. Mine blocks privately (not broadcast)
# 2. Execute a transaction on the public chain (deposit to exchange)
# 3. When your private chain is longer than public chain → broadcast it
# 4. Public chain reorganises to your longer chain
# 5. Your deposit transaction is erased — you spent the same coins twice
# This is "double spending"

# Real examples of 51% attacks:
# Ethereum Classic (ETC) — attacked 3 times in 2020
# Bitcoin Gold (BTG) — attacked 2018, 2020
# Bitcoin SV (BSV) — attacked 2021
# Vertcoin — attacked 2018

# Why Bitcoin is safe: attack cost = billions in hardware + electricity
# Nicehash attack cost calculator: https://www.crypto51.app`}</Pre>

      {/* 02 */}
      <H2>02 — Transaction Anatomy & The UTXO Model</H2>
      <P>Bitcoin uses the Unspent Transaction Output (UTXO) model. Every coin you own is actually a collection of unspent outputs from previous transactions. Understanding this model is essential for forensic tracing.</P>

      <Pre label="// UTXO MODEL — HOW BITCOIN TRANSACTIONS WORK">{`# A UTXO is a chunk of Bitcoin assigned to an address.
# To spend it, you create a transaction that:
# 1. References the UTXO as input (proving ownership with a signature)
# 2. Creates new UTXOs as outputs (to recipient + change back to you)

# Example: Alice wants to send 0.5 BTC to Bob

INPUT:
  UTXO: tx_hash:0  (Alice's 1 BTC UTXO from a previous transaction)
  Signature: Alice signs with her private key (proves ownership)

OUTPUT 1: 0.5 BTC → Bob's address
OUTPUT 2: 0.4999 BTC → Alice's change address  (new UTXO for Alice)
FEE: 0.0001 BTC → miner

# After this transaction:
# Alice's original 1 BTC UTXO is CONSUMED (spent)
# Two new UTXOs exist: Bob's 0.5 BTC, Alice's 0.4999 BTC
# The fee is implicitly: sum(inputs) - sum(outputs) → goes to miner

# FORENSIC IMPLICATION:
# Every UTXO traces back to a coinbase transaction (mined coin)
# Every spend creates an auditable link on the blockchain
# Nothing is deleted — the entire history is permanent and public`}</Pre>

      <H3>Ethereum Account Model</H3>
      <Pre label="// ETHEREUM — ACCOUNT-BASED MODEL (different from UTXO)">{`# Ethereum uses accounts with balances, like a bank:
# External Owned Account (EOA): controlled by private key
# Contract Account: controlled by code

# ETH Transaction:
{
  "from": "0xSenderAddress",
  "to": "0xRecipientOrContract",
  "value": "1000000000000000000",  // 1 ETH in wei (10^18)
  "gas": 21000,                    // gas limit
  "gasPrice": "20000000000",       // 20 Gwei per gas unit
  "nonce": 42,                     // prevents replay attacks
  "data": "0x",                    // empty for ETH transfer; ABI-encoded for contract calls
  "v", "r", "s": ...              // ECDSA signature components
}

# NONCE: sequential counter per address — prevents replaying transactions
# If nonce 42 is used, attacker cannot rebroadcast the same transaction
# FORENSIC: nonce reveals how many transactions an address has sent

# ERC-20 Token Transfer:
# "to" = contract address (e.g. USDT contract)
# "value" = 0 ETH (no ETH moves)
# "data" = ABI-encoded: transfer(recipientAddress, amount)
# Tokens move inside the contract's internal ledger`}</Pre>

      {/* 03 */}
      <H2>03 — Blockchain Forensics: Tracing Funds On-Chain</H2>
      <P>Blockchain forensics is the process of tracing cryptocurrency flows to identify the origin, destination, and ownership of funds. Because blockchain data is public and immutable, every transaction is traceable — anonymity comes from obscuring identity, not hiding transactions.</P>

      <H3>Core Tracing Techniques</H3>
      <Table headers={['TECHNIQUE', 'HOW IT WORKS', 'APPLIES TO']} rows={[
        ['Common Input Ownership', 'If multiple inputs fund one transaction, they are likely owned by the same entity', 'Bitcoin UTXO'],
        ['Change Address Identification', 'Identify which output is "change" returned to sender vs payment', 'Bitcoin UTXO'],
        ['Transaction Graph Analysis', 'Build directed graph of fund flows across addresses', 'All chains'],
        ['Dust Attack Analysis', 'Tiny amounts sent to many wallets to link them when spent together', 'Bitcoin/UTXO chains'],
        ['Address Clustering', 'Group addresses controlled by same entity via heuristics', 'All chains'],
        ['Exchange Deposit Tracking', 'Identify when funds hit a KYC exchange — identity link possible', 'All chains'],
        ['Smart Contract Interaction', 'Trace through DeFi protocol flows to identify entry/exit points', 'EVM chains'],
      ]} />

      <Pre label="// HANDS-ON: TRACE A BITCOIN TRANSACTION">{`# Tools for manual tracing (all free, no account needed):
# https://blockchair.com    — multi-chain, excellent for tracing
# https://oxt.me            — Bitcoin UTXO graph visualisation
# https://bitinfocharts.com — address clustering + exchange labelling
# https://explorer.btc.com  — clean transaction viewer

# Python: query Bitcoin blockchain via API
pip install requests

import requests

def get_address_info(address):
    url = f"https://blockchair.com/bitcoin/dashboards/address/{address}"
    r = requests.get(url, params={"key": ""})  # free tier
    data = r.json()["data"][address]
    print(f"Balance: {data['address']['balance']} satoshi")
    print(f"Received: {data['address']['received']}")
    print(f"Transactions: {data['address']['transaction_count']}")
    return data

def get_tx_info(txid):
    url = f"https://blockchair.com/bitcoin/dashboards/transaction/{txid}"
    r = requests.get(url)
    tx = r.json()["data"][txid]["transaction"]
    inputs = r.json()["data"][txid]["inputs"]
    outputs = r.json()["data"][txid]["outputs"]
    print(f"Block: {tx['block_id']}")
    print(f"Fee: {tx['fee']} satoshi")
    for inp in inputs:
        print(f"  IN: {inp['recipient']} → {inp['value']} sat")
    for out in outputs:
        print(f"  OUT: {out['recipient']} ← {out['value']} sat")

# Start tracing from a known address:
get_address_info("1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf8N")  # Genesis block address`}</Pre>

      <H3>Exchange Address Identification</H3>
      <Pre label="// HOW TO IDENTIFY EXCHANGE WALLETS">{`# Exchanges have identifiable patterns:
# 1. Very high transaction volume (thousands/day)
# 2. Many small deposits, large withdrawals (or vice versa)
# 3. Known labelled addresses in blockchain explorers
# 4. CoinJoin avoidance — exchanges reject mixed coins

# Labelled exchange addresses:
# Etherscan labels: https://etherscan.io/accounts/label/exchange
# Bitquery: https://explorer.bitquery.io
# WalletExplorer: https://www.walletexplorer.com (Bitcoin)
# Crystal Blockchain: https://crystalblockchain.com (commercial)

# Why this matters for forensics:
# Once funds hit an exchange → KYC data links to real identity
# Law enforcement can subpoena exchange records
# This is how most crypto-related crimes are ultimately solved

# Example trace path:
# Crime wallet → 3 hops through mixers → exchange deposit address
# Exchange subpoena → real name/ID/IP address of depositor`}</Pre>

      {/* 04 */}
      <H2>04 — Wallet Types, Keys & Address Analysis</H2>

      <H3>Key Cryptography</H3>
      <Pre label="// BITCOIN KEY HIERARCHY">{`# Private Key: 256-bit random number
# This IS your Bitcoin. Whoever has this can spend the funds.
# Example (WIF format): 5HueCGU8rMjxECyDialwujzvDEnBVE3a4...

# Public Key: derived from private key via elliptic curve multiplication
# ECDSA curve secp256k1: PublicKey = PrivateKey × G
# This is a one-way function — cannot reverse to get private key

# Bitcoin Address: derived from public key
# Steps: PublicKey → SHA256 → RIPEMD160 → Base58Check encoding
# Result: 1A1zP1... (Legacy P2PKH)
#    Or:  3J98t1...  (P2SH - pay to script hash)
#    Or:  bc1q...    (Bech32 - native segwit)

# HD Wallets (BIP32/39/44) - deterministic key generation:
# Seed phrase (12/24 words) → master private key
# master key → child keys → grandchild keys (infinite derivation)
# m/44'/0'/0'/0/0  = first Bitcoin address
# m/44'/60'/0'/0/0 = first Ethereum address
# ONE seed phrase → controls ALL addresses across ALL chains

# FORENSIC IMPLICATION:
# If you find one address from an HD wallet, all other addresses
# from the same seed are controlled by the same entity
# Blockchain analytics tools cluster HD wallet addresses automatically`}</Pre>

      <H3>Address Type Identification</H3>
      <Table headers={['FORMAT', 'PREFIX', 'TYPE', 'NOTES']} rows={[
        ['1...', '1', 'Bitcoin P2PKH (Legacy)', 'Oldest format, still widely used'],
        ['3...', '3', 'Bitcoin P2SH', 'Multisig and scripts — could be exchange cold wallet'],
        ['bc1q...', 'bc1q', 'Bitcoin Bech32 (SegWit)', 'Modern format, lower fees'],
        ['bc1p...', 'bc1p', 'Bitcoin Taproot', 'Latest, enhanced privacy'],
        ['0x...', '0x', 'Ethereum/EVM', '20 bytes hex — same address works on ETH, BSC, Polygon etc'],
        ['T...', 'T', 'Tron', 'Base58 encoded 21-byte address'],
        ['addr1...', 'addr1', 'Cardano (Bech32)', 'Shelley era addresses'],
        ['r...', 'r', 'XRP/Ripple', 'Base58Check encoded'],
      ]} />

      {/* 05 */}
      <H2>05 — Smart Contracts: Architecture & Vulnerability Classes</H2>
      <P>Smart contracts are programs deployed on the blockchain that execute automatically when conditions are met. They are immutable once deployed, hold real funds, and interact with each other — making vulnerabilities extremely high stakes. A single bug can drain millions with no recourse.</P>

      <H3>Solidity Contract Structure</H3>
      <Pre label="// ANATOMY OF A SOLIDITY CONTRACT">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VaultExample {
    // STATE VARIABLES — stored permanently on blockchain
    address public owner;
    mapping(address => uint256) public balances;  // user → balance
    uint256 public totalDeposited;

    // EVENTS — logged to blockchain, searchable
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    // MODIFIERS — reusable access control
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;  // function body executes here
    }

    constructor() {
        owner = msg.sender;  // deployer becomes owner
    }

    // PAYABLE function — can receive ETH
    function deposit() external payable {
        require(msg.value > 0, "Must send ETH");
        balances[msg.sender] += msg.value;
        totalDeposited += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        // SENDS ETH to caller — this is where vulnerabilities live
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdrawal(msg.sender, amount);
    }
}`}</Pre>

      <H3>Critical Vulnerability Classes</H3>
      <Table headers={['VULNERABILITY', 'DESCRIPTION', 'IMPACT', 'FAMOUS EXAMPLE']} rows={[
        ['Reentrancy', 'External call before state update allows recursive drain', 'Complete fund drain', 'The DAO hack — $60M, 2016'],
        ['Integer Overflow/Underflow', 'Pre-0.8.0: arithmetic wraps around (uint max + 1 = 0)', 'Token minting, balance manipulation', 'BEC Token — $1B market cap destroyed, 2018'],
        ['Access Control', 'Missing onlyOwner or incorrect permission checks', 'Admin functions exposed to anyone', 'Parity Multisig freeze — $150M, 2017'],
        ['Flash Loan Attack', 'Borrow massive capital, manipulate prices, repay in one tx', 'Oracle manipulation, protocol drain', 'bZx — $1M, 2020; Cream Finance — $130M, 2021'],
        ['Oracle Manipulation', 'Manipulate price feed to exploit dependent contracts', 'Liquidation abuse, undercollateralised borrowing', 'Mango Markets — $117M, 2022'],
        ['Unchecked Return Values', 'Not verifying if .transfer() or .call() succeeded', 'Silent failures, stuck funds', 'Multiple projects'],
        ['tx.origin Authentication', 'Using tx.origin instead of msg.sender for auth', 'Phishing via proxy contracts', 'Multiple wallet contracts'],
        ['Delegatecall Vulnerability', 'Storage slot collision via delegatecall in proxies', 'Storage corruption, ownership takeover', 'Parity Multisig — $30M, 2017'],
        ['Front-running (MEV)', 'Miners/bots see pending txs and insert their own first', 'Sandwich attacks, arbitrage extraction', 'Systemic across all DEXs'],
        ['Signature Replay', 'Valid signed messages reused on other chains or contracts', 'Unauthorised operations', 'Multiple bridge exploits'],
      ]} />

      <H3>Reentrancy — Deep Dive</H3>
      <Pre label="// REENTRANCY ATTACK — THE MOST FAMOUS SMART CONTRACT VULNERABILITY">{`// VULNERABLE CONTRACT:
contract VulnerableBank {
    mapping(address => uint) public balances;

    function deposit() public payable { balances[msg.sender] += msg.value; }

    function withdraw() public {
        uint amount = balances[msg.sender];
        require(amount > 0);
        
        // BUG: sends ETH BEFORE updating balance
        (bool success,) = msg.sender.call{value: amount}("");  // ← triggers attacker's fallback
        require(success);
        
        balances[msg.sender] = 0;  // too late — attacker already re-entered
    }
}

// ATTACKER CONTRACT:
contract Attacker {
    VulnerableBank public bank;
    uint public attackCount;

    constructor(address _bank) { bank = VulnerableBank(_bank); }

    function attack() external payable {
        bank.deposit{value: msg.value}();
        bank.withdraw();
    }

    // Called every time this contract receives ETH
    receive() external payable {
        attackCount++;
        if (attackCount < 10 && address(bank).balance >= 1 ether) {
            bank.withdraw();  // re-enter before balance is zeroed!
        }
    }
}

// TIMELINE OF THE ATTACK:
// 1. Attacker deposits 1 ETH
// 2. Attacker calls withdraw()
// 3. Bank sends 1 ETH → triggers Attacker.receive()
// 4. receive() calls withdraw() AGAIN (balance still shows 1 ETH)
// 5. Bank sends another 1 ETH → receive() called again
// 6. Repeat until bank is drained
// 7. Finally: balances[attacker] = 0 (but 10 ETH already gone)

// FIX — Checks-Effects-Interactions pattern:
function safeWithdraw() public {
    uint amount = balances[msg.sender];
    require(amount > 0);
    balances[msg.sender] = 0;      // UPDATE STATE FIRST
    (bool success,) = msg.sender.call{value: amount}("");  // THEN interact
    require(success);
}`}</Pre>

      {/* 06 */}
      <H2>06 — Smart Contract Auditing Methodology</H2>
      <P>Smart contract auditing is the process of systematically reviewing contract code to identify vulnerabilities before deployment. A single audit engagement can pay $20,000–$500,000+. Your engineering background makes you well-positioned to enter this field.</P>

      <H3>Audit Tooling</H3>
      <Pre label="// ESSENTIAL SMART CONTRACT SECURITY TOOLS">{`# Slither — static analysis framework (Trail of Bits)
pip install slither-analyzer
slither contract.sol
slither . --print human-summary
slither . --detect reentrancy-eth,uninitialized-state

# Mythril — symbolic execution vulnerability scanner
pip install mythril
myth analyze contract.sol
myth analyze --address 0xContractAddress --infura-id YOUR_ID

# Echidna — property-based fuzzer (Trail of Bits)
# Install: https://github.com/crytic/echidna
echidna-test contract.sol --contract MyContract

# Foundry — development + testing framework with security features
curl -L https://foundry.paradigm.xyz | bash
foundryup
forge init my_audit
forge test -vvvv             # verbose test output
forge coverage               # code coverage report

# Hardhat + hardhat-gas-reporter
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat test

# Manticore — symbolic execution (Trail of Bits)
pip install manticore
manticore contract.sol`}</Pre>

      <H3>Audit Checklist</H3>
      <Pre label="// SYSTEMATIC AUDIT APPROACH">{`# PHASE 1: SCOPE & UNDERSTANDING
[ ] Read all documentation, whitepapers, READMEs
[ ] Understand the intended business logic
[ ] Map all entry points (public/external functions)
[ ] Identify all assets held (ETH, tokens, NFTs)
[ ] Note all privilege levels (owner, admin, user)

# PHASE 2: AUTOMATED SCANNING
[ ] Run Slither → review all detectors output
[ ] Run Mythril → check for common vulnerability patterns
[ ] Run Echidna → define invariants and fuzz
[ ] Check code coverage of existing tests

# PHASE 3: MANUAL REVIEW — CHECK EACH:
[ ] Access control: every privileged function protected?
[ ] Reentrancy: all external calls follow CEI pattern?
[ ] Integer arithmetic: SafeMath or Solidity 0.8+?
[ ] Input validation: all user inputs sanitised?
[ ] Oracle usage: price feeds from reliable sources?
[ ] Upgrade patterns: proxy storage slot collisions?
[ ] Signature verification: nonce/chainId in signed data?
[ ] Token handling: correct ERC standards followed?
[ ] Event emissions: all state changes emit events?
[ ] Gas limits: unbounded loops possible?

# PHASE 4: BUSINESS LOGIC REVIEW
[ ] Can the math be manipulated (flash loans)?
[ ] Are there economic incentives to attack?
[ ] What happens if price goes to zero or infinity?
[ ] What happens with 1 wei or max uint256 amounts?
[ ] Edge cases: first depositor, last withdrawer, empty pool

# PHASE 5: REPORTING
[ ] Severity classification: Critical/High/Medium/Low/Info
[ ] PoC exploit code for all Critical/High findings
[ ] Recommended fix for each finding
[ ] Executive summary with overall risk rating`}</Pre>

      {/* 07 */}
      <H2>07 — DeFi Architecture & Exploit Patterns</H2>
      <P>Decentralised Finance (DeFi) protocols are composable smart contracts managing billions of dollars. Their interconnected nature creates complex attack surfaces — a vulnerability in one protocol can cascade through the entire ecosystem in a single transaction.</P>

      <H3>Core DeFi Primitives</H3>
      <Table headers={['PRIMITIVE', 'WHAT IT DOES', 'KEY CONTRACTS', 'ATTACK SURFACE']} rows={[
        ['DEX (AMM)', 'Token swaps via liquidity pools using x*y=k formula', 'Uniswap, Curve, Balancer', 'Price manipulation, sandwich attacks, liquidity drain'],
        ['Lending Protocol', 'Deposit collateral, borrow against it', 'Aave, Compound, MakerDAO', 'Oracle manipulation, liquidation abuse, undercollateralised borrows'],
        ['Flash Loans', 'Borrow unlimited capital with no collateral — must repay in same tx', 'Aave, dYdX, Uniswap V3', 'Capital for price manipulation attacks, arbitrage extraction'],
        ['Bridges', 'Move assets between blockchains', 'Ronin, Wormhole, Hop', 'Signature validation bugs, relayer compromise, replay attacks'],
        ['Yield Aggregators', 'Auto-compound yields across protocols', 'Yearn, Beefy, Convex', 'Strategy manipulation, underlying protocol risk'],
        ['Stablecoins', 'Price-pegged tokens (algorithmic or collateral-backed)', 'USDC, DAI, FRAX', 'Depeg events, collateral oracle manipulation'],
      ]} />

      <H3>Flash Loan Attack Anatomy</H3>
      <Pre label="// FLASH LOAN ATTACK — HOW IT WORKS (one atomic transaction)">{`// Everything below happens in ONE Ethereum transaction:

contract FlashLoanAttacker {
    function executeAttack() external {
        // Step 1: Borrow 10,000 ETH from Aave with NO collateral
        aave.flashLoan(address(this), WETH, 10_000 ether, "");
        // Aave calls back executeOperation() below
    }

    function executeOperation(
        address asset, uint256 amount, uint256 premium, ...
    ) external returns (bool) {
        
        // Step 2: Use 10,000 ETH to manipulate a price
        // Buy massive amount of TOKEN on small DEX → price skyrockets
        uniswapSmall.swapExactETHForTokens{value: 10_000 ether}(...);
        
        // Step 3: Exploit a protocol that uses this DEX as price oracle
        // Protocol thinks TOKEN is worth 100x — borrow against fake price
        vulnerableProtocol.depositCollateral(TOKEN_balance);
        vulnerableProtocol.borrow(USDC, 50_000_000);  // borrow $50M USDC
        
        // Step 4: Sell TOKEN back on DEX (price crashes again)
        uniswapSmall.swapExactTokensForETH(TOKEN_balance, ...);
        
        // Step 5: Repay flash loan + fee
        WETH.approve(address(aave), amount + premium);
        
        // Net result: Started with 0 capital, ended with $50M USDC profit
        return true;
    }
}

// WHY THIS IS POSSIBLE:
// Ethereum transactions are atomic — all steps succeed or all revert
// Flash loan fee is ~0.09% — cost to attempt: near zero
// If attack fails → entire tx reverts, attacker loses only gas fees
// This means attackers can try complex attacks with zero capital at risk`}</Pre>

      {/* 08 */}
      <H2>08 — Real DeFi Exploits — Case Studies</H2>

      <Table headers={['PROTOCOL', 'DATE', 'AMOUNT', 'VECTOR', 'ROOT CAUSE']} rows={[
        ['The DAO', 'June 2016', '$60M ETH', 'Reentrancy', 'Recursive withdraw before balance update — led to Ethereum hard fork'],
        ['Poly Network', 'Aug 2021', '$611M', 'Access Control', 'Attacker called privileged function by passing malicious contract as "keeper"'],
        ['Ronin Bridge', 'Mar 2022', '$625M', 'Compromised keys', 'Attacker obtained 5 of 9 validator private keys (4 via Sky Mavis hack)'],
        ['Wormhole Bridge', 'Feb 2022', '$320M', 'Signature bypass', 'Deprecated verify function allowed forging guardian signatures'],
        ['Nomad Bridge', 'Aug 2022', '$190M', 'Improper validation', 'Zero value treated as valid root — anyone could copy/replay transactions'],
        ['Mango Markets', 'Oct 2022', '$117M', 'Oracle manipulation', 'Attacker manipulated MNGO token price using own capital, then borrowed against inflated value'],
        ['Euler Finance', 'Mar 2023', '$197M', 'Flawed liquidation logic', 'Missing health check in donation function enabled undercollateralised positions'],
        ['Curve Finance', 'Jul 2023', '$47M', 'Compiler reentrancy bug', 'Vyper compiler versions 0.2.15-0.3.0 had broken reentrancy lock implementation'],
        ['KyberSwap', 'Nov 2023', '$47M', 'Tick boundary exploit', 'Precision maths edge case in concentrated liquidity at specific tick crossings'],
      ]} />

      <Alert type="tip">Every major DeFi exploit is fully visible on-chain. Study them by reading the transaction traces on Tenderly or Phalcon Explorer. These are the best free security research resources available — real attacks, real code, real money.</Alert>

      {/* 09 */}
      <H2>09 — Privacy Coins & Mixing Techniques</H2>
      <P>Understanding privacy-enhancing technologies is essential for blockchain forensics — both to understand how investigators trace funds through them, and how they fail.</P>

      <H3>Privacy Coin Technologies</H3>
      <Table headers={['TECHNOLOGY', 'HOW IT WORKS', 'CHAIN', 'FORENSIC STATUS']} rows={[
        ['Ring Signatures', 'Transaction signed by one of N possible signers — hides true sender among decoys', 'Monero', 'Statistical analysis can reduce anonymity set; chain analysis firms claim partial deanonymisation'],
        ['Stealth Addresses', 'Recipient generates one-time address for each transaction — breaks address linkage', 'Monero, some ETH protocols', 'Effective against passive analysis; active targeted attacks possible'],
        ['Confidential Transactions (RingCT)', 'Transaction amounts hidden using Pedersen commitments — only parties know amounts', 'Monero', 'Amounts hidden; timing analysis still possible'],
        ['zk-SNARKs', 'Zero-knowledge proofs: prove knowledge without revealing data', 'Zcash (shielded), Aztec', 'Theoretically strong; most Zcash users use transparent pool'],
        ['CoinJoin', 'Multiple parties combine inputs/outputs — breaks transaction graph', 'Bitcoin (Wasabi, JoinMarket)', 'Chainalysis claims ability to trace through; not fully broken but reduced confidence'],
        ['Tornado Cash', 'Smart contract mixer using zkSNARKs on Ethereum', 'Ethereum', 'OFAC sanctioned Aug 2022; deposit-note timing analysis used to trace some flows'],
      ]} />

      <Pre label="// HOW INVESTIGATORS TRACE THROUGH MIXERS">{`# Tornado Cash example (before sanctions):
# Users deposit 1 ETH → get a "note" (secret)
# Wait period (longer = better anonymity)
# Submit note → withdraw 1 ETH to fresh address
# If 1,000 people deposit 1 ETH, which withdrawal is yours?

# Known deanonymisation techniques:
# 1. Timing correlation: deposit at 2:37AM, withdraw at 2:41AM → small anonymity set
# 2. Gas price patterns: unique gas settings link deposit/withdraw
# 3. Amount correlation: unique amounts (1.00001 ETH) narrow the set
# 4. Blockchain note exposure: if note is broadcast unencryptedly → linked
# 5. Relayer analysis: same relayer used for deposit and withdraw
# 6. Heuristic: only deposits with matching amounts eligible → deterministic

# Chainalysis approach (claimed):
# Statistical matching of input/output timing and amounts
# Exchange KYC at entry/exit points
# Graph analysis of addresses interacting with contract

# Real forensic outcome:
# Tornado Cash traced in Ronin Bridge hack — attacker made timing mistakes
# Most small-scale users successfully maintain anonymity if patient`}</Pre>

      {/* 10 */}
      <H2>10 — Chainalysis, TRM Labs & Forensic Tooling</H2>
      <P>Commercial blockchain analytics firms provide the tooling used by law enforcement, exchanges, and compliance teams globally. Understanding their methodology is as important as understanding the blockchain itself.</P>

      <Table headers={['TOOL', 'PRIMARY USE', 'USED BY', 'FREE ACCESS']} rows={[
        ['Chainalysis Reactor', 'Transaction graph investigation', 'FBI, Europol, IRS-CI', 'No — enterprise pricing'],
        ['Chainalysis KYT', 'Real-time transaction monitoring for exchanges', 'Exchanges, VASPs', 'No'],
        ['TRM Labs', 'Blockchain intelligence + compliance', 'Banks, exchanges, LE', 'No'],
        ['Elliptic', 'Risk scoring + investigation', 'Financial institutions', 'No'],
        ['Crystal Blockchain', 'Address risk scoring + investigation', 'Exchanges', 'No'],
        ['Etherscan', 'Ethereum block explorer + labels', 'Everyone', 'Yes'],
        ['Blockchair', 'Multi-chain explorer with analytics', 'Everyone', 'Freemium'],
        ['OXT', 'Bitcoin UTXO graph analysis', 'Researchers', 'Yes — limited'],
        ['Breadcrumbs', 'On-chain investigation tool', 'Security researchers', 'Freemium'],
        ['Phalcon Explorer', 'DeFi transaction simulation + tracing', 'Smart contract auditors', 'Yes'],
        ['Tenderly', 'EVM transaction debugger + fork simulation', 'Developers, auditors', 'Freemium'],
      ]} />

      <Pre label="// FREE FORENSIC WORKFLOW — NO PAID TOOLS NEEDED">{`# Full investigation using free tools:

# 1. Start: suspicious address or transaction
ADDR="0xSuspectAddress"

# 2. Etherscan — get full history
# https://etherscan.io/address/\\${ADDR}
# Check: token holdings, transaction history, contract interactions

# 3. Blockchair — cross-chain check (same entity may use multiple chains)
curl "https://api.blockchair.com/cross-chain/search?q=$ADDR" 

# 4. MistTrack (by SlowMist) — free risk score + entity labels
# https://misttrack.io

# 5. Breadcrumbs — visual graph of fund flows
# https://www.breadcrumbs.app

# 6. Check for exchange exposure
# Does the address interact with known exchange contracts?
# Etherscan labels show "Binance", "Coinbase" etc on known addresses

# 7. Tenderly — simulate or replay transactions
# https://tenderly.co
# Paste any tx hash → full execution trace → see exactly what happened

# 8. DeFi-specific: Phalcon
# https://explorer.phalcon.xyz
# Paste a DeFi exploit tx → full call tree + fund flows visualised`}</Pre>

      {/* 11 */}
      <H2>11 — NFT Security & Marketplace Exploits</H2>

      <Pre label="// NFT CONTRACT VULNERABILITIES">{`# Common NFT (ERC-721) vulnerabilities:

# 1. Reentrancy via _safeMint / safeTransferFrom
# _safeMint calls onERC721Received on recipient contracts
# Attacker contract re-enters mint in onERC721Received → mints unlimited NFTs

# 2. Weak randomness for mint/reveal
# Using block.timestamp or blockhash as RNG → miners can manipulate
# Fix: Chainlink VRF for verifiable randomness

# 3. Signature replay attacks
# Off-chain whitelist signatures with no nonce/chainId
# Signature from ETH mainnet reused on other chain

# 4. OpenSea / Blur platform-level exploits:
# Cancelled listings still valid → attacker front-runs accept
# Zero-price listing + transfer exploit (stolen NFT listings)
# Off-chain order book manipulation

# 5. Royalty bypass
# Most marketplaces allow bypassing royalties via P2P transfer
# Then sell on royalty-exempt marketplace (Blur, SudoSwap)

# NFT Scams (common patterns):
# Rug pull: team abandons project after mint (check contract: is there a rug function?)
# Fake reveal: metadata never updated to final art
# Copycat collections: identical art, different contract
# Discord compromise → malicious mint link`}</Pre>

      {/* 12 */}
      <H2>12 — Crypto Exchange Security & API Vulnerabilities</H2>

      <Pre label="// EXCHANGE API SECURITY">{`# Exchange APIs are high-value targets — they control real money

# Common API vulnerabilities:
# 1. API key exposure in code (GitHub dorking)
# Google: site:github.com "BINANCE_API_KEY" OR "binance_api_secret"
# Google: site:github.com "exchange" "api_key" "api_secret" .env

# 2. Insufficient API key permissions
# Keys with withdrawal permissions when only trading needed
# No IP whitelist on withdrawal-capable keys

# 3. Time-based replay attacks on HMAC signatures
# If exchange doesn't strictly validate timestamp → replay window

# 4. Race conditions in order execution
# Submit many identical orders rapidly → race to fill

# 5. HTTP parameter pollution on trading endpoints

# CCXT — unified crypto exchange library for research
pip install ccxt

import ccxt
# Read-only market data (no API key needed):
binance = ccxt.binance()
markets = binance.load_markets()
ticker = binance.fetch_ticker('BTC/USDT')
orderbook = binance.fetch_order_book('ETH/USDT', limit=20)

# With API key (paper trading / testnet recommended):
exchange = ccxt.binance({
    'apiKey': 'YOUR_KEY',
    'secret': 'YOUR_SECRET',
    'options': {'defaultType': 'future'},
})
balance = exchange.fetch_balance()
orders = exchange.fetch_open_orders('BTC/USDT')`}</Pre>

      {/* Footer */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #2e1e00', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/modules/osint" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← MOD-02: OSINT</Link>
        <Link href="/modules/crypto/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#ffb347', padding: '8px 20px', border: '1px solid rgba(255,179,71,0.4)', borderRadius: '4px', background: 'rgba(255,179,71,0.06)' }}>
          PROCEED TO LAB → MOD-03-LAB
        </Link>
      </div>
    </div>
  )
}
