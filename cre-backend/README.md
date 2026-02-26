# DeFi Auto Yield Optimizer - Chainlink CRE Backend

A sophisticated Chainlink Runtime Environment (CRE) based backend for autonomous DeFi yield optimization. This system automatically monitors APY/APR across multiple DeFi protocols and simulates portfolio rebalancing to maximize yields.

## 🎯 Project Overview

This is a **simulation-only** system designed to demonstrate how Chainlink CRE can be used to automate DeFi optimizations. It:

- ✅ Fetches real-time APY data from DefiLlama API
- ✅ Monitors 5 major DeFi protocols (Aave, Compound, Yearn, Beefy, Harvest)
- ✅ Identifies best-performing protocols
- ✅ Simulates portfolio rebalancing (no real transactions)
- ✅ Implements intelligent cooldown periods
- ✅ Tracks gas fees (simulated)
- ✅ Logs all actions with color-coded output

## 📋 Features

### Core Functionality
- **Automated Monitoring**: Cron trigger runs every 10 minutes
- **Real-time APY Data**: Fetches from DefiLlama API
- **Protocol Filtering**: Supports Aave, Compound, Yearn, Beefy, Harvest
- **Smart Rebalancing**: Only switches if APY difference > 2% (configurable)
- **Simulate Transactions**: Mock deposit, withdraw, and claim operations
- **Cooldown System**: 24-hour cooldown between rebalances per protocol

### Advanced Features
- **Gas Fee Estimation**: Simulates and checks gas prices
- **Reward Tracking**: Keeps claimed rewards separate from principal
- **State Management**: Maintains investment state across executions
- **Detailed Logging**: Color-coded logs for each operation step
- **Error Handling**: Graceful error recovery with fallback to mock data

## 🏗️ Project Structure

```
cre-backend/
├── src/
│   ├── index.ts                    # Entry point (exports workflow)
│   ├── config/
│   │   └── index.ts               # Configuration management
│   ├── triggers/
│   │   └── cron.ts                # Cron trigger (every 10 min)
│   ├── workflows/
│   │   └── yieldOptimization.ts   # Main workflow orchestration
│   ├── actions/
│   │   └── rebalance.ts           # Rebalancing logic
│   ├── services/
│   │   ├── defiLlama.ts           # APY data fetching
│   │   └── blockchain.ts          # Transaction simulation
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   └── utils/
│       └── logger.ts              # Logging utility
├── .env.example                   # Environment variables template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
├── .gitignore                     # Git configuration
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js v16+ ([Download](https://nodejs.org))
- npm or yarn
- Git

### Installation

```bash
# Navigate to the cre-backend directory
cd cre-backend

# Install dependencies
npm install
```

### Setup Environment

```bash
# Copy environment template
cp .env.example .env

# (Optional) Edit .env with your values
# Most values have sensible defaults for simulation
```

### Run the Workflow

```bash
# Development mode (with TypeScript compilation)
npm run dev

# Production build + start
npm run build
npm start

# Just build (creates dist/ folder)
npm run build

# Clean build artifacts
npm run clean
```

## 📊 Execution Example

When you run the workflow, you'll see output like:

```
╔════════════════════════════════════════╗
║   DeFi Auto Yield Optimizer - CRE     ║
╚════════════════════════════════════════╝

🔗 [CRE] 2024-02-24T10:30:00Z INFO: Initializing workflow...

📌 Configuration
  LOG LEVEL          | info
  SUPPORTED PROTOCOLS| Aave, Compound, Yearn, Beefy, Harvest
  APY THRESHOLD      | 2%
  COOLDOWN           | 24 hours

📌 Current Investment State
  PROTOCOL           | Aave
  PRINCIPAL          | $10,000.00
  REWARDS            | $150.00
  VALUE              | $10,150.00

══════════════════════════════════════════

📌 Trigger Event
  TYPE               | Cron
  SCHEDULE           | */10 * * * * (every 10 min)

📌 Fetching Protocol Data
  ✓ Fetched 1000+ pools
  ✓ Filtered to 150 from supported protocols

📌 Protocol Comparison
  PROTOCOL    | APY      | TVL
  Yearn       | 6.50%    | $300.0M      ✓ BEST
  Beefy       | 5.90%    | $250.0M
  Harvest     | 5.20%    | $150.0M
  Aave        | 4.20%    | $500.0M      ✓ CURRENT
  Compound    | 3.80%    | $400.0M

📌 Rebalancing Decision
  APY Difference    | 2.30%
  Threshold         | 2.00%
  Cooldown Status   | Active (waiting)
  Decision          | Postponed

══════════════════════════════════════════
🔗 [CRE] 2024-02-24T10:30:05Z SUCCESS: Workflow completed
```

## 🔧 Configuration

All configuration is in `.env`:

```env
# Blockchain (for reference, not used in simulation)
PRIVATE_KEY=0x0000...
RPC_URL=https://eth-sepolia...

# API
DEFI_LLAMA_API=https://yields.llama.fi/pools

# Rebalancing
APY_DIFFERENCE_THRESHOLD=2.0      # Only rebalance if diff > 2%
COOLDOWN_HOURS=24                 # Cooldown between rebalances
GAS_PRICE_LIMIT=100               # Max gas price in USD

# Execution
LOG_LEVEL=info
SIMULATE_MODE=true                # Always true for simulation
```

## 📈 How It Works

### 1. **Trigger Event** (Cron: Every 10 minutes)
- Cron scheduler emits trigger event
- Workflow context is created

### 2. **Fetch APY Data**
- DefiLlama API returns current pool data
- Data is filtered by supported protocols
- Best protocol is identified

### 3. **Compare Protocols**
```
Current:  Aave   - 4.2%
Best:     Yearn  - 6.5%
Diff:     2.3%   > 2% threshold ✓

Decision: Compare with cooldown
```

### 4. **Check Conditions**
- ✓ APY difference exceeds threshold
- ✓ No cooldown period active
- ✓ Gas fees acceptable
- → Proceed with rebalancing

### 5. **Simulate Transactions**
```
1. Withdraw $10,000 from Aave
2. Claim rewards ($150) from Aave
3. Deposit $10,000 to Yearn
4. Store rewards separately
```

### 6. **Update State**
- Update current protocol to Yearn
- Log last rebalance timestamp
- Track claimed rewards

### 7. **Output Results**
- Log all transactions
- Display updated portfolio
- Show APY improvement

## 🛠️ Service Architecture

### DefiLlama Service
Fetches and processes APY data:
- `fetchAllPools()` - Get all pools from API
- `filterByProtocols()` - Filter by supported protocols
- `getBestProtocol()` - Find best protocol for asset

### Blockchain Simulation Service
Mocks blockchain transactions:
- `simulateDeposit()` - Mock deposit operation
- `simulateWithdraw()` - Mock withdrawal operation
- `simulateClaimRewards()` - Mock reward claiming
- `estimateGas()` - Simulate gas calculation

### Rebalance Action
Core rebalancing logic:
- `execute()` - Main entry point
- `shouldRebalance()` - Determine if rebalancing is needed
- `executeRebalance()` - Perform the rebalancing simulation

### Workflow Orchestrator
Connects all components:
- `initialize()` - Setup and display config
- `execute()` - Run the workflow
- `getState()` - Get current investment state

## 📊 Data Types

### InvestmentState
```typescript
{
  currentProtocol: string;      // e.g., "Aave"
  principalAmount: number;      // e.g., 10000
  investedAt: Date;             // When invested
  rewards: number;              // Accumulated rewards
  lastRebalanceAt: Date;        // Last rebalance time
  chainlinkBalance?: number;    // LINK token balance
}
```

### RebalanceResult
```typescript
{
  triggered: boolean;           // Did rebalancing happen?
  fromProtocol?: string;        // e.g., "Aave"
  toProtocol?: string;          // e.g., "Yearn"
  apyDifference?: number;       // APY improvement
  claimedRewards?: number;      // Amount claimed
  newDeposit?: number;          // Amount deposited
}
```

## 🔍 API Fallback

If DefiLlama API is unavailable, the system uses hardcoded mock data:

```typescript
Protocol  | APY   | TVL
Aave      | 4.2%  | $500M
Compound  | 3.8%  | $400M
Yearn     | 6.5%  | $300M
Beefy     | 5.9%  | $250M
Harvest   | 5.2%  | $150M
```

## 🔐 Security Considerations

### This is Simulation Only
- ❌ NO real blockchain transactions
- ❌ NO real fund transfers
- ❌ NO real private key usage
- ✅ Safe for testing and demonstration

### For Production Deployment
Before deploying to production, add:
1. **Authentication** - Verify transaction sender
2. **Rate Limiting** - Prevent spam rebalancing
3. **Slippage Protection** - Check price impact
4. **Multi-sig Approval** - Require multiple signatures
5. **Pause Mechanism** - Emergency stop functionality
6. **Upgrade Pattern** - Contract upgrade capability

## 📝 Logging

All operations are logged with color-coded output:

- 🔵 **INFO**: General information
- 🟢 **SUCCESS**: Successful operations
- 🟡 **WARN**: Warnings
- 🔴 **ERROR**: Errors
- 🔘 **DEBUG**: Debug information

## 🧪 Testing

### Run Single Execution

```bash
npm run dev
```

This runs the workflow once with:
1. Fetch latest APY data
2. Compare protocols
3. Check rebalancing conditions
4. Simulate transactions if needed
5. Display results

### Monitor Protocols

Check which protocols are currently available:

```bash
# Edit src/index.ts to add debug output
npm run dev
```

## 🚀 Extending the System

### Add a New Protocol

1. Update `config.ts`:
```typescript
supportedProtocols: ['Aave', 'Compound', 'Yearn', 'Beefy', 'Harvest', 'Lido']
```

2. Update mock data in `defiLlama.ts`:
```typescript
{
  pool: 'lido-eth-steth',
  chain: 'Ethereum',
  project: 'Lido',
  symbol: 'stETH',
  tvlUsd: 20000000000,
  apy: 3.5,
}
```

### Custom Trigger Schedule

Edit `.env`:
```env
# Change from every 10 minutes to every 1 hour
CRON_SCHEDULE=0 * * * *
```

### Adjust Rebalancing Threshold

Edit `.env`:
```env
# Only rebalance if APY difference > 5%
APY_DIFFERENCE_THRESHOLD=5.0
```

## 📚 TypeScript Types

Full type definitions in `src/types/index.ts`:
- `Protocol` - Protocol data structure
- `PoolData` - Pool information from API
- `InvestmentState` - Current investment state
- `RebalanceResult` - Result of rebalancing
- `TriggerEvent` - Trigger event data
- `WorkflowContext` - Workflow execution context
- `ActionResult` - Action execution result
- `GasEstimate` - Gas fee estimation

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
npm run clean
npm run build
```

### Dependencies Not Installing

```bash
# Use npm ci for clean install
npm ci
```

### TypeScript Errors

```bash
# Check TypeScript compilation
npx tsc --noEmit
```

### Missing Environment Variables

```bash
# Ensure .env exists and has required values
cp .env.example .env
```

## 📋 Requirements Met

✅ Project structure with triggers, workflows, actions  
✅ Cron trigger runs every 10 minutes  
✅ Workflow connects trigger to main logic  
✅ Fetch APY from DefiLlama API  
✅ Filter 5 protocols (Aave, Compound, Beefy, Yearn, Harvest)  
✅ Sort by highest APY  
✅ Simulate deposit/withdraw/claim  
✅ 2% APY difference threshold  
✅ Separate rewards from principal  
✅ Color-coded logging  
✅ TypeScript implementation  
✅ Clean modular structure  
✅ Error handling  
✅ Entry point exports workflow  
✅ Gas fee checking & cooldown period  

## 🎓 Learning Resources

- [Chainlink CRE Documentation](https://docs.chain.link/chainlink-automation/guides/running-chainlink-automation)
- [DefiLlama API Docs](https://docs.llama.fi/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT

## 🤝 Contributing

This is a demonstration project. Modifications are welcome for educational purposes.

## 📞 Support

For issues or questions:
1. Check `.env` configuration
2. Review build output
3. Check logs in terminal
4. Verify Node.js and npm versions

---

**Status**: ✅ Complete and Ready for Testing  
**Version**: 1.0.0  
**Date**: February 24, 2026

Made with ❤️ for DeFi automation
