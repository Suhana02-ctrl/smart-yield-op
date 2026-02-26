# CRE Integration & Extension Guide

This guide explains how to use this backend with Chainlink Runtime Environment and how to extend it.

## 🔗 Using with Chainlink CRE

### CRE CLI Commands

The workflow is compatible with Chainlink CRE CLI. Here are typical commands:

```bash
# Simulate the workflow locally
cre simulate src/index.ts

# Deploy to Chainlink (not included in this demo)
cre deploy --contract MyOptimizer --chain ethereum

# Test with custom parameters
cre simulate src/index.ts --params "threshold=5.0,cooldown=12"
```

### CRE Simulation Output

When simulating with CRE, the console output shows:

```
[CRE] Starting simulation...
[Simulation] Trigger: Cron
[Simulation] Schedule: */10 * * * *
[Simulation] Executing: workflows/yieldOptimization.ts
[Output] (All console logs appear here)
[Simulation] Status: SUCCESS
[Simulation] Duration: 2.3s
```

## 📦 Exported Functions

The `src/index.ts` exports these for CRE:

```typescript
// Main workflow export
export async function executeWorkflow() {
  return yieldOptimizationWorkflow;
}

// For manual testing
export { yieldOptimizationWorkflow, cronTrigger };
```

## 🛠️ Extension Guide

### Adding a New Action

1. Create new action file:

```typescript
// src/actions/monitoring.ts

import { logger } from '../utils/logger';
import { ActionResult } from '../types';

export class MonitoringAction {
  async execute(): Promise<ActionResult> {
    logger.info('Monitoring action started');
    
    // Your logic here
    
    return {
      success: true,
      data: { /* results */ },
      logs: [],
    };
  }
}

export const monitoringAction = new MonitoringAction();
```

2. Add to workflow:

```typescript
// src/workflows/yieldOptimization.ts

import { monitoringAction } from '../actions/monitoring';

async execute(): Promise<ActionResult> {
  // ... existing code ...
  
  // Add new action
  const monitoringResult = await monitoringAction.execute();
  
  // ... rest of code ...
}
```

### Adding a New Trigger

1. Create trigger file:

```typescript
// src/triggers/events.ts

import { logger } from '../utils/logger';
import { TriggerEvent } from '../types';

export class EventTrigger {
  createEvent(): TriggerEvent {
    return {
      type: 'event',
      timestamp: new Date(),
      // custom properties
    };
  }
}

export const eventTrigger = new EventTrigger();
```

2. Use in workflow:

```typescript
// src/workflows/yieldOptimization.ts

import { eventTrigger } from '../triggers/events';

const event = eventTrigger.createEvent();
```

### Adding a New Service

1. Create service:

```typescript
// src/services/tokenPrices.ts

import axios from 'axios';
import { logger } from '../utils/logger';

class TokenPriceService {
  async fetchPrices(tokens: string[]): Promise<Record<string, number>> {
    // Implementation
  }
}

export const tokenPriceService = new TokenPriceService();
```

2. Use in your action:

```typescript
// src/actions/yourAction.ts

import { tokenPriceService } from '../services/tokenPrices';

const prices = await tokenPriceService.fetchPrices(['ETH', 'USDC']);
```

### Adding New Configuration Options

1. Update `.env.example`:

```env
# In .env.example
MY_NEW_CONFIG=value
```

2. Update `src/config/index.ts`:

```typescript
export const config = {
  // ... existing config ...
  myNewConfig: process.env.MY_NEW_CONFIG || 'default_value',
};
```

3. Use in code:

```typescript
import { config } from './config';

const value = config.myNewConfig;
```

## 🔌 Integration Examples

### Example 1: Add Price Alert Action

```typescript
// src/actions/priceAlert.ts

import { logger } from '../utils/logger';
import { ActionResult } from '../types';

export class PriceAlertAction {
  async execute(protocol: string, threshold: number): Promise<ActionResult> {
    logger.section('Price Alert Check');
    
    // Fetch current price
    const price = await this.fetchPrice(protocol);
    
    // Check threshold
    if (price < threshold) {
      logger.warn(`⚠️ Price alert: ${protocol} below ${threshold}`);
      return {
        success: true,
        data: { alert: true, price },
        logs: [`Price alert triggered for ${protocol}`],
      };
    }
    
    return {
      success: true,
      data: { alert: false, price },
      logs: [`Price is healthy for ${protocol}`],
    };
  }

  private async fetchPrice(protocol: string): Promise<number> {
    // Mock price
    return Math.random() * 100;
  }
}
```

### Example 2: Add Risk Analysis

```typescript
// src/actions/riskAnalysis.ts

import { logger } from '../utils/logger';
import { InvestmentState, ActionResult } from '../types';

export class RiskAnalysisAction {
  async execute(state: InvestmentState): Promise<ActionResult> {
    logger.section('Risk Analysis');
    
    const diversification = this.checkDiversification(state);
    const concentration = this.checkConcentration(state);
    const volatility = this.checkVolatility(state);
    
    const risk = {
      diversification,
      concentration,
      volatility,
      overallRisk: this.calculateRisk(diversification, concentration, volatility),
    };
    
    return {
      success: true,
      data: risk,
      logs: [`Risk score: ${risk.overallRisk}/100`],
    };
  }

  private checkDiversification(state: InvestmentState): number {
    // Analysis logic
    return 75;
  }

  private checkConcentration(state: InvestmentState): number {
    // Analysis logic
    return 60;
  }

  private checkVolatility(state: InvestmentState): number {
    // Analysis logic
    return 50;
  }

  private calculateRisk(d: number, c: number, v: number): number {
    return (d + c + v) / 3;
  }
}
```

### Example 3: Add Multiple Protocol Support

```typescript
// Extend src/config/index.ts

export const config = {
  // ... existing ...
  
  // Support multiple chains
  supportedChains: ['Ethereum', 'Polygon', 'Arbitrum'],
  
  // Per-chain protocols
  chainProtocols: {
    'Ethereum': ['Aave', 'Compound', 'Yearn', 'Beefy', 'Harvest'],
    'Polygon': ['Aave', 'Compound', 'Yearn'],
    'Arbitrum': ['Aave', 'Yearn'],
  },
};
```

## 📝 Custom Logging

Use the logger in your actions:

```typescript
import { logger } from '../utils/logger';

// Different log levels
logger.debug('Debug info');      // Cyan
logger.info('Information');      // Blue
logger.warn('Warning');          // Yellow
logger.error('Error occurred');  // Red
logger.success('Success!');      // Green

// Formatted output
logger.section('My Section');    // Formatted section header
logger.divider();                // Visual divider
logger.table(data);              // Table output
logger.header('My Header');      // Large header
```

## 🧪 Testing Your Extensions

### Test a New Action

```typescript
// Create a simple test file
import { yourAction } from './src/actions/yourAction';

async function test() {
  const result = await yourAction.execute();
  console.log(result);
}

test();
```

Run with:
```bash
npx ts-node test.ts
```

### Test Configuration Changes

```bash
# Update .env
echo "MY_CONFIG=test_value" >> .env

# Run
npm run dev
```

## 🚀 Production Deployment Considerations

### Before Deploying to Production

1. **Test Thoroughly**
   - Run multiple simulation cycles
   - Test with different market conditions
   - Verify all edge cases

2. **Add Security**
   - Implement wallet authentication
   - Add transaction signing
   - Use hardware wallet support

3. **Add Monitoring**
   - Send alerts to Discord/Telegram
   - Log to external monitoring service
   - Track gas spending

4. **Add Fallbacks**
   - Retry failed API calls
   - Use multiple data sources
   - Handle network failures

### Example: Add Real Blockchain Support

```typescript
// src/services/realBlockchain.ts

import { ethers } from 'ethers';
import { logger } from '../utils/logger';

export class RealBlockchainService {
  private provider: ethers.Provider;
  private signer: ethers.Signer;

  async deposit(protocol: string, amount: number): Promise<string> {
    // Real blockchain implementation
    logger.info(`Depositing $${amount} to ${protocol}`);
    
    // TODO: Implement actual contract interaction
    
    return 'tx_hash';
  }

  async withdraw(protocol: string, amount: number): Promise<string> {
    // Real blockchain implementation
    logger.info(`Withdrawing $${amount} from ${protocol}`);
    
    // TODO: Implement actual contract interaction
    
    return 'tx_hash';
  }
}
```

## 📊 Advanced Configuration

### Multi-Asset Support

```typescript
// src/config/assets.ts

export const assetConfig = {
  supportedAssets: ['USDC', 'USDT', 'DAI', 'ETH', 'WETH'],
  
  priceFeeds: {
    USDC: 'chainlink-usd-feed',
    USDT: 'chainlink-usd-feed',
    DAI: 'chainlink-usd-feed',
    ETH: 'chainlink-eth-feed',
    WETH: 'chainlink-eth-feed',
  },
  
  riskLevels: {
    USDC: 'low',      // Stablecoin
    USDT: 'low',      // Stablecoin
    DAI: 'low',       // Stablecoin
    ETH: 'medium',    // Volatile
    WETH: 'medium',   // Volatile
  },
};
```

## 🔄 Workflow Composition

Create complex workflows by composing actions:

```typescript
// src/workflows/advancedYieldOptimization.ts

export class AdvancedWorkflow {
  async execute(): Promise<void> {
    // Run multiple actions in sequence
    
    const riskAnalysis = await riskAnalysisAction.execute(state);
    const priceAlert = await priceAlertAction.execute(protocol, threshold);
    const rebalance = await rebalanceAction.execute(context);
    const notify = await notificationAction.execute(results);
    
    // Combine results
    const finalResult = {
      risk: riskAnalysis,
      alerts: priceAlert,
      rebalancing: rebalance,
      notifications: notify,
    };
    
    return finalResult;
  }
}
```

## 📚 Resources

- [CRE Documentation](https://docs.chain.link/chainlink-automation)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

**Ready to extend?** Start by creating a new action in `src/actions/`!
