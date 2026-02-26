import { logger } from '../utils/logger';
import { config } from '../config';
import { GasEstimate } from '../types';

/**
 * Simulated blockchain service for mock transactions
 * This service does NOT perform real blockchain transactions
 * All operations are logged and simulated for testing purposes
 */

class BlockchainSimulationService {
  private nonce = 1000;
  private simulatedGasPrice = 50; // gwei
  private simulatedGasLimit = 200000; // units

  /**
   * Simulate depositing funds to a protocol
   */
  async simulateDeposit(protocol: string, amount: number): Promise<string> {
    const txHash = this.generateTxHash();
    const gasUsed = this.simulatedGasLimit;
    const gasCost = this.calculateGasCost(gasUsed);

    logger.info(`💰 Simulating deposit to ${protocol}`);
    logger.info(`   Amount: $${amount.toFixed(2)}`);
    logger.info(`   Estimated Gas: ${gasUsed} units`);
    logger.info(`   Estimated Cost: $${gasCost.toFixed(2)}`);
    logger.info(`   Transaction Hash: ${txHash}`);

    // Simulate transaction delay
    await this.simulateDelay(1000);

    logger.success(`✅ Simulated deposit completed successfully`);

    return txHash;
  }

  /**
   * Simulate withdrawing funds from a protocol
   */
  async simulateWithdraw(protocol: string, amount: number): Promise<string> {
    const txHash = this.generateTxHash();
    const gasUsed = this.simulatedGasLimit;
    const gasCost = this.calculateGasCost(gasUsed);

    logger.info(`🔄 Simulating withdrawal from ${protocol}`);
    logger.info(`   Amount: $${amount.toFixed(2)}`);
    logger.info(`   Estimated Gas: ${gasUsed} units`);
    logger.info(`   Estimated Cost: $${gasCost.toFixed(2)}`);
    logger.info(`   Transaction Hash: ${txHash}`);

    // Simulate transaction delay
    await this.simulateDelay(1000);

    logger.success(`✅ Simulated withdrawal completed successfully`);

    return txHash;
  }

  /**
   * Simulate claiming rewards from a protocol
   */
  async simulateClaimRewards(protocol: string): Promise<{ txHash: string; rewards: number }> {
    // Simulate random reward amount (0.5% to 2% of principal)
    const rewardPercentage = 0.5 + Math.random() * 1.5;
    const simulatedRewards = (config.defaultPrincipal * rewardPercentage) / 100;

    const txHash = this.generateTxHash();
    const gasUsed = this.simulatedGasLimit * 0.8; // Claims use less gas
    const gasCost = this.calculateGasCost(gasUsed);

    logger.info(`🎁 Simulating reward claim from ${protocol}`);
    logger.info(`   Estimated Rewards: $${simulatedRewards.toFixed(2)}`);
    logger.info(`   Estimated Gas: ${gasUsed.toFixed(0)} units`);
    logger.info(`   Estimated Cost: $${gasCost.toFixed(2)}`);
    logger.info(`   Transaction Hash: ${txHash}`);

    // Simulate transaction delay
    await this.simulateDelay(800);

    logger.success(`✅ Simulated reward claim completed`);

    return {
      txHash,
      rewards: simulatedRewards,
    };
  }

  /**
   * Estimate gas fees for a transaction
   */
  async estimateGas(operation: 'deposit' | 'withdraw' | 'claim'): Promise<GasEstimate> {
    let gasLimit = this.simulatedGasLimit;

    if (operation === 'claim') {
      gasLimit = this.simulatedGasLimit * 0.8;
    }

    const estimatedCost = this.calculateGasCost(gasLimit);
    const acceptable = estimatedCost < config.gasPriceLimit;

    logger.debug(`Gas estimate for ${operation}:`, {
      gasLimit,
      gasPrice: this.simulatedGasPrice,
      estimatedCost,
      acceptable,
    });

    return {
      estimatedGas: gasLimit,
      estimatedCost,
      acceptable,
    };
  }

  /**
   * Check if gas fees are acceptable
   */
  async isGasAcceptable(): Promise<boolean> {
    const estimate = await this.estimateGas('deposit');
    return estimate.acceptable;
  }

  /**
   * Calculate gas cost in USD
   */
  private calculateGasCost(gasUsed: number): number {
    const gasPriceWei = this.simulatedGasPrice * 1e9; // Convert gwei to wei
    const txCostWei = gasUsed * gasPriceWei;
    const txCostEth = txCostWei / 1e18; // Convert wei to ETH
    const ethPriceUsd = 2000; // Mock ETH price
    return txCostEth * ethPriceUsd;
  }

  /**
   * Generate a mock transaction hash
   */
  private generateTxHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  /**
   * Simulate network delay
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current nonce
   */
  getNonce(): number {
    return this.nonce++;
  }

  /**
   * Reset nonce (for testing)
   */
  resetNonce(): void {
    this.nonce = 1000;
  }
}

export const blockchainSimulationService = new BlockchainSimulationService();
