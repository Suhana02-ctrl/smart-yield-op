# CRE Backend - Quick Start Guide

Get your DeFi Auto Yield Optimizer running in 5 minutes!

## 1. Install Dependencies (30 seconds)

```bash
cd cre-backend
npm install
```

## 2. Setup Environment (10 seconds)

```bash
cp .env.example .env
```

That's it! Default values work perfectly for simulation.

## 3. Run the Workflow (2 minutes)

Development mode (watch TypeScript):
```bash
npm run dev
```

Or build & run:
```bash
npm run build
npm start
```

## ✅ You're Done!

The workflow will:
1. ✓ Fetch latest APY data from DefiLlama
2. ✓ Compare 5 major DeFi protocols
3. ✓ Check if rebalancing is needed
4. ✓ Simulate transactions if conditions are met
5. ✓ Display detailed color-coded output

## 📊 What You'll See

```
[CRE] Workflow started...

📌 Current Protocol: Aave (4.2% APY)
📌 Best Protocol: Yearn (6.5% APY)
📌 Difference: 2.3% (exceeds 2% threshold)
📌 Decision: Ready to rebalance...

🔄 Simulating withdrawal from Aave: $10,000
🎁 Simulating claim rewards from Aave: $150
💰 Simulating deposit to Yearn: $10,000

✅ Rebalancing completed successfully
```

## 🔧 Configuration Quick Reference

Edit `.env` to adjust:

```env
APY_DIFFERENCE_THRESHOLD=2.0        # Min % to trigger rebalance
COOLDOWN_HOURS=24                    # Hours between rebalances
GAS_PRICE_LIMIT=100                  # Max acceptable gas fee in USD
LOG_LEVEL=info                       # info, debug, warn, error
```

## 📚 Project Structure

```
src/
├── index.ts                  # Entry point
├── config/                   # Configuration
├── triggers/                 # Cron trigger
├── workflows/                # Main orchestration
├── actions/                  # Rebalancing logic
├── services/                 # API & blockchain
├── types/                    # TypeScript types
└── utils/                    # Logger
```

## 🚀 Use Cases

### Development Testing
```bash
npm run dev
```

### Production Simulation
```bash
npm run build
npm start
```

### TypeScript Checking
```bash
npx tsc --noEmit
```

### Clean Build
```bash
npm run clean
npm run build
```

## 📊 Key Features at a Glance

| Feature | Status |
|---------|--------|
| Fetch live APY data | ✅ DefiLlama API |
| Compare protocols | ✅ 5 protocols |
| Smart rebalancing | ✅ 2% threshold |
| Simulate transactions | ✅ No real txns |
| Cooldown periods | ✅ 24 hours |
| Gas estimation | ✅ Simulated |
| Detailed logging | ✅ Color-coded |
| TypeScript support | ✅ Full type safety |

## 🐛 Troubleshooting

### Command Not Found
```bash
# Make sure you're in cre-backend directory
cd cre-backend
npm install
```

### EACCES Permission Error
```bash
# Run with sudo (not recommended) or fix permissions
sudo npm install
```

### Node Module Issues
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Build Error
```bash
# Check TypeScript version
npm ls typescript

# Rebuild
npm run clean
npm run build
```

## 📁 Generated Files

After running `npm run build`, you'll have:

```
dist/
├── index.js              # Compiled entry point
├── config/
├── triggers/
├── workflows/
├── actions/
├── services/
├── types/
└── utils/
```

## 🔄 Typical Workflow

1. **Starts** → Initialize configuration
2. **Triggers** → Cron event fires
3. **Fetches** → Get APY data from API
4. **Analyzes** → Compare all protocols
5. **Decides** → Check if rebalancing needed
6. **Simulates** → Mock all transactions
7. **Logs** → Display results
8. **Updates** → Save new state
9. **Completes** → Ready for next cycle

## 📈 Example Output

```
══════════════════════════════════════════════════════════════════

 🏆 DeFi Auto Yield Optimizer - CRE Workflow

══════════════════════════════════════════════════════════════════

Configuration:
  Threshold    : 2%
  Cooldown     : 24h
  Protocols    : Aave, Compound, Yearn, Beefy, Harvest
  Mode         : Simulation

Current State:
  Protocol     : Aave
  APY          : 4.2%
  Principal    : $10,000
  Rewards      : $150

Fetching APY Data...
  ✓ Downloaded 1000+ pools
  ✓ Filtered to 150 pools

Protocol Rankings:
  1. Yearn    6.50%  ← BEST
  2. Beefy    5.90%
  3. Harvest  5.20%
  4. Aave     4.20%  ← CURRENT
  5. Compound 3.80%

Rebalancing Analysis:
  Difference : 2.30%
  Threshold  : 2.00%
  Status     : Ready to rebalance
  Cooldown   : Inactive

Simulating Transactions:
  1. Withdraw $10,000 from Aave
     Hash: 0x123abc...
  2. Claim rewards ($150) from Aave
     Hash: 0x456def...
  3. Deposit $10,000 to Yearn
     Hash: 0x789ghi...

Results:
  ✅ Rebalancing successful
  💰 Principal moved: $10,000
  🎁 Rewards claimed: $150
  📈 APY improved: 2.30%

══════════════════════════════════════════════════════════════════
```

## ⚡ Performance Tips

1. **Fast Execution**
   - Typical runtime: 5-10 seconds
   - Most time spent on API calls

2. **Reduce API Wait**
   - Uses cached mock data if API fails
   - Fallback data is always available

3. **Optimize Logs**
   - Reduce log level: `LOG_LEVEL=error`
   - Redirect to file: `npm run dev > output.log`

## 🎯 Next Steps

1. ✅ **Run the workflow** - `npm run dev`
2. ✅ **Review the logs** - Watch the detailed output
3. ✅ **Modify config** - Edit `.env` to test thresholds
4. ✅ **Check code** - Read through `src/` files
5. ✅ **Extend** - Add custom triggers or actions

## 📚 Full Documentation

See `README.md` for complete documentation including:
- Architecture overview
- Type definitions
- Extended configuration
- Production deployment guide
- Troubleshooting

---

**Ready to test?** Start with: `npm run dev`

**Questions?** Check README.md for detailed docs.
