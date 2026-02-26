import { logger } from '../utils/logger';
import { cronTrigger } from '../triggers/cron';
import { rebalanceAction } from '../actions/rebalance';
import { InvestmentState, WorkflowContext, ActionResult, TriggerEvent } from '../types';

/**
 * Main Workflow Definition
 * Orchestrates the trigger -> action execution pipeline
 */

class YieldOptimizationWorkflow {
  private state: InvestmentState;
  private executionCount: number = 0;

  constructor() {
    // Initialize default investment state
    this.state = {
      currentProtocol: 'Aave',
      principalAmount: 10000, // $10,000
      investedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      rewards: 150, // Accumulated rewards
      lastRebalanceAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    };
  }

  /**
   * Initialize the workflow
   */
  initialize(): void {
    logger.header('DeFi Auto Yield Optimizer - CRE Workflow');
    logger.info('Initializing Chainlink Runtime Environment (CRE) workflow...');
    logger.divider();

    // Display configuration
    this.displayConfiguration();

    // Display initial state
    this.displayInitialState();

    logger.divider();
  }

  /**
   * Execute the workflow
   */
  async execute(): Promise<ActionResult> {
    this.executionCount++;

    logger.header(`Workflow Execution #${this.executionCount}`);

    // Step 1: Trigger event
    logger.section('Step 1: Trigger Event');
    const triggerEvent = cronTrigger.createEvent();
    logger.info(`Trigger Type: ${triggerEvent.type}`);
    logger.info(`Schedule: ${triggerEvent.interval || 'N/A'}`);
    logger.info(`Timestamp: ${triggerEvent.timestamp.toISOString()}`);

    // Step 2: Create workflow context
    logger.section('Step 2: Prepare Workflow Context');
    const context = this.createContext(triggerEvent);
    logger.info(`Context created with current state`);

    // Step 3: Execute actions
    logger.section('Step 3: Execute Rebalancing Action');
    const result = await rebalanceAction.execute(context);

    // Step 4: Log results
    logger.section('Step 4: Workflow Execution Summary');
    logger.info(`Execution #${this.executionCount} completed`);
    logger.info(`Success: ${result.success}`);
    logger.info(`Logs: ${result.logs?.length || 0} entries`);

    if (!result.success) {
      logger.error(`Error: ${result.error}`);
    }

    // Step 5: Update state if rebalancing occurred
    if (result.data?.triggered) {
      this.updateState(result.data);
    }

    logger.divider();

    return result;
  }

  /**
   * Create workflow context
   */
  private createContext(trigger: TriggerEvent): WorkflowContext {
    return {
      trigger,
      state: this.state,
      results: {},
    };
  }

  /**
   * Update state based on rebalancing results
   */
  private updateState(data: any): void {
    if (data.triggered && data.toProtocol) {
      this.state.currentProtocol = data.toProtocol;
      this.state.lastRebalanceAt = new Date();
      if (data.claimedRewards) {
        this.state.rewards += data.claimedRewards;
      }
    }
  }

  /**
   * Display current configuration
   */
  private displayConfiguration(): void {
    logger.section('Configuration');

    const configTable = {
      'Supported Protocols': 'Aave, Compound, Yearn, Beefy, Harvest',
      'APY Difference Threshold': `${config.apyDifferenceThreshold}%`,
      'Cooldown Period': `${config.cooldownHours} hours`,
      'Cron Schedule': config.cronSchedule,
      'Simulation Mode': config.simulateMode ? '✓ Enabled' : '✗ Disabled',
      'Log Level': config.logLevel,
    };

    logger.table(configTable);
  }

  /**
   * Display initial investment state
   */
  private displayInitialState(): void {
    logger.section('Initial Investment State');

    const stateTable = {
      'Current Protocol': this.state.currentProtocol,
      'Principal Amount': `$${this.state.principalAmount.toFixed(2)}`,
      'Accumulated Rewards': `$${this.state.rewards.toFixed(2)}`,
      'Invested Since': this.state.investedAt.toISOString(),
      'Last Rebalance': this.state.lastRebalanceAt.toISOString(),
      'Total Value': `$${(this.state.principalAmount + this.state.rewards).toFixed(2)}`,
    };

    logger.table(stateTable);
  }

  /**
   * Get current execution count
   */
  getExecutionCount(): number {
    return this.executionCount;
  }

  /**
   * Get current investment state
   */
  getState(): InvestmentState {
    return { ...this.state };
  }

  /**
   * Get cooldown status
   */
  getCooldownStatus() {
    return rebalanceAction.getCooldownStatus(this.state.currentProtocol);
  }

  /**
   * Display final summary
   */
  displayFinalSummary(): void {
    logger.header('Workflow Execution Summary');

    logger.section('Statistics');
    logger.info(`Total Executions: ${this.executionCount}`);
    logger.info(`Current Protocol: ${this.state.currentProtocol}`);
    logger.info(`Principal: $${this.state.principalAmount.toFixed(2)}`);
    logger.info(`Total Rewards Earned: $${this.state.rewards.toFixed(2)}`);
    logger.info(`Portfolio Value: $${(this.state.principalAmount + this.state.rewards).toFixed(2)}`);

    const cooldownStatus = this.getCooldownStatus();
    logger.section('Cooldown Status');
    logger.info(`In Cooldown: ${cooldownStatus.inCooldown ? '✓' : '✗'}`);
    if (cooldownStatus.inCooldown) {
      logger.info(`Hours Remaining: ${cooldownStatus.hoursRemaining}h`);
    }

    logger.divider();
  }
}

// Import config for use in displayConfiguration
import { config } from '../config';

export const yieldOptimizationWorkflow = new YieldOptimizationWorkflow();
