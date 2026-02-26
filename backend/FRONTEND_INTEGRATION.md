// Frontend Integration Guide
// Place this in your frontend project (src/config/api.js or similar)

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== PROTOCOL ENDPOINTS ====================

export const protocolAPI = {
  /**
   * Get all available protocols
   */
  getAllProtocols: async () => {
    const response = await apiClient.get('/protocols');
    return response.data;
  },

  /**
   * Get a specific protocol
   */
  getProtocol: async (protocolName) => {
    const response = await apiClient.get(`/protocols/${protocolName}`);
    return response.data;
  },

  /**
   * Get best protocol for an asset
   */
  getBestProtocol: async (asset) => {
    const response = await apiClient.get('/protocols/best', {
      params: { asset },
    });
    return response.data;
  },

  /**
   * Compare APY for an asset across all protocols
   */
  compareAPY: async (asset) => {
    const response = await apiClient.get(`/protocols/compare/${asset}`);
    return response.data;
  },

  /**
   * Refresh protocol data
   */
  refreshProtocols: async () => {
    const response = await apiClient.post('/protocols/refresh');
    return response.data;
  },
};

// ==================== INVESTMENT ENDPOINTS ====================

export const investmentAPI = {
  /**
   * Create a new investment
   */
  createInvestment: async (investmentData) => {
    const response = await apiClient.post('/investments', investmentData);
    return response.data;
  },

  /**
   * Get all investments for a user
   */
  getUserInvestments: async (userId) => {
    const response = await apiClient.get(`/investments/${userId}`);
    return response.data;
  },

  /**
   * Get a specific investment
   */
  getInvestment: async (investmentId) => {
    const response = await apiClient.get(`/investments/detail/${investmentId}`);
    return response.data;
  },

  /**
   * Update an investment
   */
  updateInvestment: async (investmentId, data) => {
    const response = await apiClient.put(`/investments/${investmentId}`, data);
    return response.data;
  },

  /**
   * Check if better APY is available
   */
  checkBetterAPY: async (investmentId) => {
    const response = await apiClient.post(
      `/investments/${investmentId}/check-better-apy`
    );
    return response.data;
  },

  /**
   * Delete an investment
   */
  deleteInvestment: async (investmentId) => {
    const response = await apiClient.delete(`/investments/${investmentId}`);
    return response.data;
  },
};

// ==================== USAGE EXAMPLES ====================

/**
 * Example 1: Get best protocol for USDC
 *
 * const result = await protocolAPI.getBestProtocol('USDC');
 * console.log(result.data); // { name: 'Yearn', apy: 6.2, url: '...' }
 */

/**
 * Example 2: Create investment
 *
 * const investment = await investmentAPI.createInvestment({
 *   userId: '0x742d35...',
 *   amount: 1000,
 *   asset: 'USDC',
 *   selectedProtocol: 'Yearn',
 *   apy: 6.2
 * });
 */

/**
 * Example 3: Get user's investments
 *
 * const investments = await investmentAPI.getUserInvestments('0x742d35...');
 * console.log(investments.data); // Array of investments
 */

/**
 * Example 4: Monitor investment
 *
 * const monitoring = await investmentAPI.checkBetterAPY(investmentId);
 * if (monitoring.data.betterAPYFound) {
 *   console.log(`Better APY available at ${monitoring.data.betterProtocol}`);
 * }
 */

export default {
  protocolAPI,
  investmentAPI,
};
