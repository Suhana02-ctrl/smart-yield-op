// Utility to fetch APY/APR data from multiple DeFi protocols
// In production, these would fetch from actual APIs

/**
 * Mock APY data for different protocols
 * In a real application, you'd fetch this from actual DeFi APIs
 */
export const mockProtocolData = {
  Aave: {
    name: 'Aave',
    url: 'https://aave.com',
    description: 'Decentralized lending protocol',
    assets: {
      USDC: 5.2,
      USDT: 5.1,
      DAI: 4.9,
      ETH: 2.3,
      WETH: 2.3,
    },
    dataSource: 'aave-api',
  },
  Compound: {
    name: 'Compound',
    url: 'https://compound.finance',
    description: 'Algorithmic money market protocol',
    assets: {
      USDC: 4.8,
      USDT: 4.7,
      DAI: 4.5,
      ETH: 2.1,
      WETH: 2.1,
    },
    dataSource: 'compound-api',
  },
  Yearn: {
    name: 'Yearn',
    url: 'https://yearn.finance',
    description: 'Yield farming optimizer',
    assets: {
      USDC: 6.2,
      USDT: 6.0,
      DAI: 5.8,
      ETH: 3.2,
      WETH: 3.2,
    },
    dataSource: 'yearn-api',
  },
  Beefy: {
    name: 'Beefy',
    url: 'https://beefy.finance',
    description: 'Yield farming optimizer on multiple chains',
    assets: {
      USDC: 5.9,
      USDT: 5.7,
      DAI: 5.5,
      ETH: 3.0,
      WETH: 3.0,
    },
    dataSource: 'beefy-api',
  },
};

/**
 * Fetch APY data for a specific protocol
 * @param {string} protocolName - Name of the protocol
 * @returns {Object} Protocol data with APY rates
 */
export const fetchProtocolAPY = async (protocolName) => {
  try {
    // Mock implementation - replace with real API calls
    const data = mockProtocolData[protocolName];

    if (!data) {
      throw new Error(`Protocol ${protocolName} not found`);
    }

    return {
      ...data,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error(`Error fetching APY for ${protocolName}:`, error.message);
    throw error;
  }
};

/**
 * Fetch APY data for all protocols
 * @returns {Array} Array of all protocol data
 */
export const fetchAllProtocolAPY = async () => {
  try {
    const protocols = Object.keys(mockProtocolData);
    const protocolDataArray = [];

    for (const protocol of protocols) {
      const data = await fetchProtocolAPY(protocol);
      protocolDataArray.push(data);
    }

    return protocolDataArray;
  } catch (error) {
    console.error('Error fetching all APY data:', error.message);
    throw error;
  }
};

/**
 * Find the best APY for a specific asset across all protocols
 * @param {string} asset - Asset name (e.g., 'USDC')
 * @returns {Object} Best protocol with highest APY for that asset
 */
export const findBestAPYForAsset = async (asset) => {
  try {
    const protocolsData = await fetchAllProtocolAPY();
    let bestProtocol = null;
    let highestAPY = -1;

    for (const protocol of protocolsData) {
      const apy = protocol.assets[asset];
      if (apy && apy > highestAPY) {
        highestAPY = apy;
        bestProtocol = {
          name: protocol.name,
          apy: apy,
          url: protocol.url,
        };
      }
    }

    if (!bestProtocol) {
      throw new Error(`Asset ${asset} not found in any protocol`);
    }

    return bestProtocol;
  } catch (error) {
    console.error(`Error finding best APY for ${asset}:`, error.message);
    throw error;
  }
};

/**
 * Compare APY across all protocols for a specific asset
 * @param {string} asset - Asset name (e.g., 'USDC')
 * @returns {Array} Sorted array of protocols with APY (highest first)
 */
export const compareAPYForAsset = async (asset) => {
  try {
    const protocolsData = await fetchAllProtocolAPY();
    const comparison = [];

    for (const protocol of protocolsData) {
      const apy = protocol.assets[asset];
      if (apy) {
        comparison.push({
          protocol: protocol.name,
          apy: apy,
          url: protocol.url,
          description: protocol.description,
        });
      }
    }

    if (comparison.length === 0) {
      throw new Error(`Asset ${asset} not found in any protocol`);
    }

    // Sort by APY (highest first)
    comparison.sort((a, b) => b.apy - a.apy);

    return comparison;
  } catch (error) {
    console.error(`Error comparing APY for ${asset}:`, error.message);
    throw error;
  }
};

/**
 * Check if a better APY is available for an investment
 * @param {Object} investment - Investment object with asset and currentAPY
 * @returns {Object} Result with betterAPYFound flag and details
 */
export const checkForBetterAPY = async (investment) => {
  try {
    const bestProtocol = await findBestAPYForAsset(investment.asset);

    if (bestProtocol.apy > investment.apy) {
      return {
        betterAPYFound: true,
        currentAPY: investment.apy,
        currentProtocol: investment.selectedProtocol,
        betterAPY: bestProtocol.apy,
        betterProtocol: bestProtocol.name,
        apyImprovement: (bestProtocol.apy - investment.apy).toFixed(2),
      };
    }

    return {
      betterAPYFound: false,
      currentAPY: investment.apy,
      currentProtocol: investment.selectedProtocol,
    };
  } catch (error) {
    console.error('Error checking for better APY:', error.message);
    throw error;
  }
};

export default {
  fetchProtocolAPY,
  fetchAllProtocolAPY,
  findBestAPYForAsset,
  compareAPYForAsset,
  checkForBetterAPY,
};
