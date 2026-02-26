import { logger } from '../utils/logger';
import { config } from '../config';
import { TriggerEvent } from '../types';

/**
 * Cron Trigger for periodic execution
 * Runs every 10 minutes to check and potentially rebalance portfolios
 */

class CronTrigger {
  private schedule: string;
  private isActive: boolean = false;

  constructor() {
    this.schedule = config.cronSchedule;
  }

  /**
   * Create trigger event
   */
  createEvent(): TriggerEvent {
    return {
      type: 'cron',
      timestamp: new Date(),
      interval: this.schedule,
    };
  }

  /**
   * Start the trigger (for simulation)
   */
  start(): void {
    logger.success(`Cron trigger started with schedule: "${this.schedule}"`);
    logger.info('(Running in simulation mode - will execute once)');
    this.isActive = true;
  }

  /**
   * Stop the trigger
   */
  stop(): void {
    logger.info('Cron trigger stopped');
    this.isActive = false;
  }

  /**
   * Check if trigger is active
   */
  getIsActive(): boolean {
    return this.isActive;
  }

  /**
   * Get the schedule pattern
   */
  getSchedule(): string {
    return this.schedule;
  }

  /**
   * Log trigger details
   */
  logDetails(): void {
    logger.section('Trigger Details');
    logger.info(`Type: Cron`);
    logger.info(`Schedule: ${this.schedule} (every 10 minutes)`);
    logger.info(`Active: ${this.isActive}`);
    logger.info(`Next Event: ${new Date().toISOString()}`);
  }
}

export const cronTrigger = new CronTrigger();
