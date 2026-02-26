import axios from 'axios';
import { logger } from '../utils/logger';
import { config } from '../config';
import { PoolData, ProtocolComparison } from '../types';

/**
 * Service to fetch and process DeFi protocol APY data from DefiLlama API
 */

class DefiLlamaService {
  private apiUrl: string;
  private supportedProtocols: string[];

  constructor() {
    this.apiUrl = config.defiLlamaApi;
    this.supportedProtocols = config.supportedProtocols;
  }

  /**
   * Fetch all pools from DefiLlama API
   */
  async fetchAllPools(): Promise<PoolData[]> {
    try {
      logger.info('Fetching all pools from DefiLlama API...');

      const response = await axios.get(this.apiUrl, {
        timeout: 30000,
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from DefiLlama API');
      }

      logger.success(`Fetched ${response.data.length} pools from DefiLlama`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching pools from DefiLlama', error);
      // Return mock data for demonstration
      return this.getMockPoolData();
    }
  }

  /**
   * Filter pools by supported protocols
   */
  filterByProtocols(pools: PoolData[]): PoolData[] {
    logger.info(`Filtering pools by supported protocols: ${this.supportedProtocols.join(', ')}`);

    const filtered = pools.filter((pool) =>
      this.supportedProtocols.some(
        (protocol) =>
          pool.project.toLowerCase().includes(protocol.toLowerCase()) ||
          pool.chain.toLowerCase().includes(protocol.toLowerCase())
      )
    );

    logger.success(`Filtered to ${filtered.length} pools from supported protocols`);
    return filtered;
  }

  /**
   * Get best protocol for a specific chain and asset type
   */
  getBestProtocol(pools: PoolData[], chain: string = 'Ethereum'): ProtocolComparison {
    // Filter by chain
    const chainPools = pools.filter((p) => p.chain.toLowerCase().includes(chain.toLowerCase()));

    if (chainPools.length === 0) {
      logger.warn(`No pools found for chain: ${chain}`);
      return this.getDefaultComparison();
    }

    // Group by protocol and get highest APY for each
    const protocolMap = new Map<string, PoolData>();

    for (const pool of chainPools) {
      const protocol = pool.project;
      const existing = protocolMap.get(protocol);

      if (!existing || (pool.apy || 0) > (existing.apy || 0)) {
        protocolMap.set(protocol, pool);
      }
    }

    // Convert to array and sort by APY
    const protocolList = Array.from(protocolMap.values()).sort(
      (a, b) => (b.apy || 0) - (a.apy || 0)
    );

    if (protocolList.length === 0) {
      return this.getDefaultComparison();
    }

    const bestProtocol = protocolList[0];
    const currentProtocol = 'Aave'; // Default current protocol for simulation
    const currentApy = protocolList.find((p) => p.project === currentProtocol)?.apy || 0;

    const difference = bestProtocol.apy! - currentApy;
    const shouldRebalance = Math.abs(difference) > config.apyDifferenceThreshold;

    return {
      protocols: protocolList.map((p) => ({
        name: p.project,
        apy: p.apy || 0,
        tvl: p.tvlUsd || 0,
      })),
      bestProtocol: bestProtocol.project,
      bestApy: bestProtocol.apy || 0,
      currentProtocol,
      currentApy,
      difference,
      shouldRebalance,
    };
  }

  /**
   * Mock API data for testing (when API fails)
   */
  private getMockPoolData(): PoolData[] {
    logger.info('Using mock pool data (API unavailable)');

    return [
      {
        pool: 'aave-eth-usdc',
        chain: 'Ethereum',
        project: 'Aave',
        symbol: 'USDC',
        tvlUsd: 500000000,
        apy: 4.2,
      },
      {
        pool: 'compound-eth-usdc',
        chain: 'Ethereum',
        project: 'Compound',
        symbol: 'USDC',
        tvlUsd: 400000000,
        apy: 3.8,
      },
      {
        pool: 'yearn-eth-usdc',
        chain: 'Ethereum',
        project: 'Yearn',
        symbol: 'USDC',
        tvlUsd: 300000000,
        apy: 6.5,
      },
      {
        pool: 'beefy-eth-usdc',
        chain: 'Ethereum',
        project: 'Beefy',
        symbol: 'USDC',
        tvlUsd: 250000000,
        apy: 5.9,
      },
      {
        pool: 'harvest-eth-usdc',
        chain: 'Ethereum',
        project: 'Harvest',
        symbol: 'USDC',
        tvlUsd: 150000000,
        apy: 5.2,
      },
    ];
  }

  /**
   * Get default comparison when data is unavailable
   */
  private getDefaultComparison(): ProtocolComparison {
    return {
      protocols: [
        { name: 'Yearn', apy: 6.5, tvl: 300000000 },
        { name: 'Beefy', apy: 5.9, tvl: 250000000 },
        { name: 'Harvest', apy: 5.2, tvl: 150000000 },
        { name: 'Aave', apy: 4.2, tvl: 500000000 },
        { name: 'Compound', apy: 3.8, tvl: 400000000 },
      ],
      bestProtocol: 'Yearn',
      bestApy: 6.5,
      currentProtocol: 'Aave',
      currentApy: 4.2,
      difference: 2.3,
      shouldRebalance: true,
    };
  }
}

export const defiLlamaService = new DefiLlamaService();
