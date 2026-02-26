/**
 * API Utilities
 * Handles communication with backend
 * Fetches real APY data from DeFi protocols via DefiLlama
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Type for real protocol data from backend
 */
export interface RealProtocol {
  id: string;
  name: string;
  chain: string;
  apy: number;
  tvl: string;
  symbol: string;
}

/**
 * Type for protocols list response
 */
export interface ProtocolsResponse {
  success: boolean;
  count: number;
  data: RealProtocol[];
  error?: string;
}

/**
 * Type for simulation response from backend
 */
export interface SimulationResponse {
  success: boolean;
  data?: {
    protocol: string;
    apy: number;
    rewards: number;
    previousProtocol: string;
    walletAddress?: string;
    transactionSimulated: boolean;
  };
  error?: string;
}

/**
 * Type for simulation result returned to frontend
 */
export interface SimulationResult {
  protocol: string;
  apy: number;
  rewards: number;
  previousProtocol: string;
  walletAddress?: string;
}

/**
 * Fetch real protocols with live APY data from DefiLlama
 * 
 * @param limit - Number of protocols to return (default 10)
 * @param chain - Blockchain to filter by (default "Ethereum")
 * @returns Array of protocols with real APY data
 */
export async function fetchRealProtocols(
  limit: number = 10,
  chain: string = 'Ethereum'
): Promise<RealProtocol[]> {
  try {
    console.log(`📡 Fetching real protocols from ${BACKEND_URL}/api/protocols...`);

    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      chain: chain,
    });

    const response = await fetch(`${BACKEND_URL}/api/protocols?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProtocolsResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch protocols');
    }

    console.log(`✓ Fetched ${data.count} real protocols with live APY data`);
    return data.data || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Real protocols API error:', errorMessage);
    throw new Error(`Failed to fetch real protocols: ${errorMessage}`);
  }
}

/**
 * Fetch protocols that support a specific asset
 * 
 * @param asset - Asset symbol (e.g., "USDC", "ETH", "DAI")
 * @returns Array of protocols supporting the asset with real APY
 */
export async function fetchProtocolsForAsset(asset: string): Promise<RealProtocol[]> {
  try {
    console.log(`📡 Fetching protocols for ${asset} from backend...`);

    const response = await fetch(`${BACKEND_URL}/api/protocols/${asset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProtocolsResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || `Failed to fetch protocols for ${asset}`);
    }

    console.log(`✓ Fetched ${data.count} protocols for ${asset}`);
    return data.data || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Protocols for ${asset} API error:`, errorMessage);
    return [];
  }
}

/**
 * Get current APY for a specific protocol
 * 
 * @param protocolName - Name of the protocol (e.g., "Aave", "Compound")
 * @returns Current APY percentage
 */
export async function fetchProtocolAPY(protocolName: string): Promise<number> {
  try {
    console.log(`📡 Fetching APY for ${protocolName}...`);

    const response = await fetch(`${BACKEND_URL}/api/apy/${protocolName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any = await response.json();

    if (!data.success) {
      throw new Error(data.error || `Failed to fetch APY for ${protocolName}`);
    }

    console.log(`✓ APY for ${protocolName}: ${data.apy}%`);
    return data.apy;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Protocol APY API error:`, errorMessage);
    return 0;
  }
}

/**
 * Run the DeFi yield optimization simulation with real data
 *
 * @param walletAddress - User's wallet address
 * @returns SimulationResult with protocol, real apy, rewards, and previousProtocol
 * @throws Error if simulation fails
 */
export async function runSimulation(walletAddress: string): Promise<SimulationResult> {
  try {
    console.log(`📡 Running simulation with real APY data...`);

    const response = await fetch(`${BACKEND_URL}/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet: walletAddress,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SimulationResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || 'Simulation failed');
    }

    console.log(`✓ Simulation with real data completed:`, data.data);

    return {
      protocol: data.data.protocol,
      apy: data.data.apy,
      rewards: data.data.rewards,
      previousProtocol: data.data.previousProtocol,
      walletAddress: data.data.walletAddress,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Simulation API error:', errorMessage);
    throw new Error(`Failed to run simulation: ${errorMessage}`);
  }
}

/**
 * Check backend health
 * Useful for debugging connection issues
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}
