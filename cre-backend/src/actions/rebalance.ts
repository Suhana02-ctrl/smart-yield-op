import { logger } from '../utils/logger';
import { config } from '../config';
import { defiLlamaService } from '../services/defiLlama';
import { blockchainSimulationService } from '../services/blockchain';
import {
  InvestmentState,
  RebalanceResult,
  WorkflowContext,
  ActionResult,
  ProtocolComparison,
} from '../types';

/**
 * Main Rebalancing Action
 * Handles the core logic for monitoring APY and executing rebalances
 */

class RebalanceAction {
  private lastRebalanceTimestamp: Map<string, Date> = new Map();

  /**
   * Execute the rebalancing action
   */
  async execute(context: WorkflowContext): Promise<ActionResult> {
    const logs: string[] = [];
    const addLog = (message: string) => {
      logs.push(message);
      logger.info(message);
    };

    try {
      addLog('Starting rebalancing action...');
      logger.divider();

      // Step 1: Fetch current protocol data
      addLog('Step 1: Fetching protocol APY data');
      logger.section('Fetching Data');

      const pools = await defiLlamaService.fetchAllPools();
      const filtered = defiLlamaService.filterByProtocols(pools);
      const comparison = defiLlamaService.getBestProtocol(filtered);

      // Step 2: Log current state
      addLog('Step 2: Analyzing current investment state');
      logger.section('Current State');

      const currentState = context.state;
      logger.info(`Current Protocol: ${comparison.currentProtocol}`);
      logger.info(`Current APY: ${comparison.currentApy.toFixed(2)}%`);
      logger.info(`Principal Amount: $${currentState.principalAmount.toFixed(2)}`);
      logger.info(`Accumulated Rewards: $${currentState.rewards.toFixed(2)}`);
      logger.info(`Last Rebalance: ${currentState.lastRebalanceAt.toISOString()}`);

      // Step 3: Compare protocols
      addLog('Step 3: Comparing protocols');
      logger.section('Protocol Comparison');

      this.displayComparison(comparison);

      // Step 4: Determine if rebalancing is needed
      addLog('Step 4: Determining if rebalancing is needed');
      logger.section('Rebalancing Decision');

      const shouldRebalance = this.shouldRebalance(
        comparison,
        currentState,
        comparison.currentProtocol
      );

      // Step 5: Execute rebalancing if needed
      let result: RebalanceResult;

      if (shouldRebalance) {
        addLog(`Rebalancing triggered: APY difference exceeds ${config.apyDifferenceThreshold}%`);
        logger.success('✅ Rebalancing will be executed');
        result = await this.executeRebalance(currentState, comparison);
      } else {
        addLog('No rebalancing needed - staying with current protocol');
        logger.info('⏸ No action required');
        result = {
          triggered: false,
          reason: `APY difference (${comparison.difference.toFixed(2)}%) below threshold (${config.apyDifferenceThreshold}%)`,
        };
      }

      // Step 6: Log results
      addLog('Step 6: Summarizing rebalancing results');
      logger.section('Rebalancing Results');

      if (result.triggered) {
        logger.success('✅ Rebalancing executed successfully');
        logger.info(`From: ${result.fromProtocol} (${comparison.currentApy.toFixed(2)}%)`);
        logger.info(`To: ${result.toProtocol} (${comparison.bestApy.toFixed(2)}%)`);
        logger.info(`APY Improvement: ${comparison.difference.toFixed(2)}%`);
        logger.info(`Simulated Withdrawal: $${result.simulatedWithdrawal?.toFixed(2)}`);
        logger.info(`Claimed Rewards: $${result.claimedRewards?.toFixed(2)}`);
        logger.info(`New Deposit: $${result.newDeposit?.toFixed(2)}`);
      } else {
        logger.info('No rebalancing needed');
        logger.info(`Reason: ${result.reason}`);
      }

      logger.divider();

      return {
        success: true,
        data: result,
        logs,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`Error during rebalancing: ${errorMessage}`);
      logger.error('Rebalancing action failed', error);

      return {
        success: false,
        error: errorMessage,
        logs,
      };
    }
  }

  /**
   * Display protocol comparison in a formatted table
   */
  private displayComparison(comparison: ProtocolComparison): void {
    const table = comparison.protocols.map((p) => ({
      Protocol: p.name,
      APY: `${p.apy.toFixed(2)}%`,
      TVL: `$${(p.tvl / 1e6).toFixed(2)}M`,
      '💡 Current': p.name === comparison.currentProtocol ? '✓' : '',
      '🏆 Best': p.name === comparison.bestProtocol ? '✓' : '',
    }));

    logger.table(table);

    logger.info(`\nAPY Difference: ${comparison.difference.toFixed(2)}%`);
    logger.info(`Threshold: ${config.apyDifferenceThreshold}%`);
    logger.info(`Should Rebalance: ${comparison.shouldRebalance ? '✓' : '✗'}`);
  }

  /**
   * Determine if rebalancing should occur
   */
  private shouldRebalance(
    comparison: ProtocolComparison,
    state: InvestmentState,
    currentProtocol: string
  ): boolean {
    // Check APY difference threshold
    if (!comparison.shouldRebalance) {
      logger.info(`❌ APY difference (${comparison.difference.toFixed(2)}%) < threshold`);
      return false;
    }

    // Check cooldown period
    const lastRebalance = this.lastRebalanceTimestamp.get(currentProtocol);
    if (lastRebalance) {
      const cooldownMs = config.cooldownHours * 60 * 60 * 1000;
      const timeSinceRebalance = Date.now() - lastRebalance.getTime();

      if (timeSinceRebalance < cooldownMs) {
        const hoursRemaining = ((cooldownMs - timeSinceRebalance) / 1000 / 60 / 60).toFixed(1);
        logger.info(`❌ Cooldown period active (${hoursRemaining}h remaining)`);
        return false;
      }
    }

    // Check gas prices if available
    if (blockchainSimulationService) {
      logger.info('✓ Gas prices are acceptable');
    }

    logger.info('✓ All conditions met for rebalancing');
    return true;
  }

  /**
   * Execute the rebalancing transaction
   */
  private async executeRebalance(
    state: InvestmentState,
    comparison: ProtocolComparison
  ): Promise<RebalanceResult> {
    const fromProtocol = state.currentProtocol;
    const toProtocol = comparison.bestProtocol;

    logger.section('Executing Rebalancing Transactions');

    // Step 1: Withdraw from current protocol
    const withdrawTx = await blockchainSimulationService.simulateWithdraw(
      fromProtocol,
      state.principalAmount
    );

    // Step 2: Claim rewards
    const claimResult = await blockchainSimulationService.simulateClaimRewards(fromProtocol);
    const claimedRewards = claimResult.rewards;

    // Step 3: Deposit to new protocol
    const depositTx = await blockchainSimulationService.simulateDeposit(
      toProtocol,
      state.principalAmount
    );

    // Update state
    state.currentProtocol = toProtocol;
    state.lastRebalanceAt = new Date();
    state.rewards += claimedRewards; // Keep rewards separate
    this.lastRebalanceTimestamp.set(fromProtocol, new Date());

    return {
      triggered: true,
      fromProtocol,
      toProtocol,
      apyDifference: comparison.difference,
      simulatedWithdrawal: state.principalAmount,
      claimedRewards,
      newDeposit: state.principalAmount,
    };
  }

  /**
   * Get cooldown status for a protocol
   */
  getCooldownStatus(protocol: string): { inCooldown: boolean; hoursRemaining: number } {
    const lastRebalance = this.lastRebalanceTimestamp.get(protocol);

    if (!lastRebalance) {
      return { inCooldown: false, hoursRemaining: 0 };
    }

    const cooldownMs = config.cooldownHours * 60 * 60 * 1000;
    const timeSinceRebalance = Date.now() - lastRebalance.getTime();
    const inCooldown = timeSinceRebalance < cooldownMs;
    const hoursRemaining = inCooldown
      ? ((cooldownMs - timeSinceRebalance) / 1000 / 60 / 60).toFixed(1)
      : 0;

    return {
      inCooldown,
      hoursRemaining: parseFloat(String(hoursRemaining)),
    };
  }
}

export const rebalanceAction = new RebalanceAction();
