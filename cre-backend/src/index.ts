/**
 * DeFi Auto Yield Optimizer - Chainlink CRE Backend
 * Entry point for the workflow execution
 *
 * This module exports the main workflow that can be used with:
 * - CRE simulate command
 * - Manual execution
 * - Scheduled execution
 */

import { logger } from './utils/logger';
import { cronTrigger } from './triggers/cron';
import { yieldOptimizationWorkflow } from './workflows/yieldOptimization';

/**
 * Main execution function
 * This is what gets called when the CRE workflow is triggered
 */
async function main(): Promise<void> {
  try {
    // Initialize workflow
    yieldOptimizationWorkflow.initialize();

    // Start trigger
    cronTrigger.start();
    cronTrigger.logDetails();

    // Execute workflow
    logger.divider();
    const result = await yieldOptimizationWorkflow.execute();

    // Display final summary
    yieldOptimizationWorkflow.displayFinalSummary();

    // Log completion
    if (result.success) {
      logger.success('✅ Workflow execution completed successfully');
    } else {
      logger.error('❌ Workflow execution failed');
      logger.error(`Error: ${result.error}`);
    }

    // Stop trigger
    cronTrigger.stop();
  } catch (error) {
    logger.error('Fatal error in workflow execution', error);
    process.exit(1);
  }
}

/**
 * Export the workflow for CRE use
 * This should be called by the Chainlink Runtime Environment
 */
export async function executeWorkflow() {
  return yieldOptimizationWorkflow;
}

/**
 * Export for manual testing/simulation
 */
export { yieldOptimizationWorkflow, cronTrigger };

// Run if this is the main module
if (require.main === module) {
  main().catch((error) => {
    logger.error('Fatal error', error);
    process.exit(1);
  });
}

export default executeWorkflow;
