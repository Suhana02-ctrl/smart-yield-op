/**
 * Type definitions for DeFi Auto Yield Optimizer
 */

export interface Protocol {
  name: string;
  chain: string;
  rewardTokens: string[];
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number;
}

export interface PoolData {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase?: number;
  apyReward?: number;
  rewardTokens?: string[];
}

export interface InvestmentState {
  currentProtocol: string;
  principalAmount: number;
  investedAt: Date;
  rewards: number;
  lastRebalanceAt: Date;
  chainlinkBalance?: number;
}

export interface RebalanceResult {
  triggered: boolean;
  reason?: string;
  fromProtocol?: string;
  toProtocol?: string;
  apyDifference?: number;
  simulatedWithdrawal?: number;
  claimedRewards?: number;
  newDeposit?: number;
}

export interface TriggerEvent {
  type: 'cron' | 'manual';
  timestamp: Date;
  interval?: string;
}

export interface WorkflowContext {
  trigger: TriggerEvent;
  state: InvestmentState;
  results: Record<string, any>;
}

export interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
  logs: string[];
}

export interface GasEstimate {
  estimatedGas: number;
  estimatedCost: number;
  acceptable: boolean;
}

export interface ProtocolComparison {
  protocols: Array<{
    name: string;
    apy: number;
    tvl: number;
  }>;
  bestProtocol: string;
  bestApy: number;
  currentProtocol: string;
  currentApy: number;
  difference: number;
  shouldRebalance: boolean;
}
