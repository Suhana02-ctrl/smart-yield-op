import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration for the DeFi Auto Yield Optimizer
 */

export const config = {
  // Blockchain
  privateKey: process.env.PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001',
  rpcUrl: process.env.RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo',

  // API endpoints
  defiLlamaApi: process.env.DEFI_LLAMA_API || 'https://yields.llama.fi/pools',

  // Rebalancing thresholds
  apyDifferenceThreshold: parseFloat(process.env.APY_DIFFERENCE_THRESHOLD || '2.0'),
  cooldownHours: parseInt(process.env.COOLDOWN_HOURS || '24'),
  gasPriceLimit: parseInt(process.env.GAS_PRICE_LIMIT || '100'),

  // Supported protocols
  supportedProtocols: ['Aave', 'Compound', 'Yearn', 'Beefy', 'Harvest'],

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Simulation
  simulateMode: process.env.SIMULATE_MODE !== 'false',

  // Cron schedule (every 10 minutes)
  cronSchedule: '*/10 * * * *',

  // Default investment amount (for simulation)
  defaultPrincipal: 10000, // $10,000
};

export default config;
