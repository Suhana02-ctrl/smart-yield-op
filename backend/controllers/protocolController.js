import {
  fetchAllProtocolAPY,
  findBestAPYForAsset,
  compareAPYForAsset,
} from '../utils/apy-fetcher.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * GET /protocols
 * Get all available protocols with their current APY rates
 */
export const getAllProtocols = async (req, res, next) => {
  try {
    // Fetch fresh data (no database storage)
    const freshData = await fetchAllProtocolAPY();

    const protocolsResponse = freshData.map((p) => ({
      name: p.name,
      assets: p.assets,
      description: p.description,
      url: p.url,
      lastUpdated: p.lastUpdated,
      dataSource: p.dataSource,
    }));

    res.status(200).json({
      success: true,
      message: 'All protocols retrieved successfully',
      count: protocolsResponse.length,
      data: protocolsResponse,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /protocols/:protocolName
 * Get a specific protocol details
 */
export const getProtocolByName = async (req, res, next) => {
  try {
    const { protocolName } = req.params;

    const allProtocols = await fetchAllProtocolAPY();
    const protocol = allProtocols.find((p) => p.name === protocolName);

    if (!protocol) {
      throw new AppError('Protocol not found', 404);
    }

    const response = {
      name: protocol.name,
      assets: protocol.assets,
      description: protocol.description,
      url: protocol.url,
      lastUpdated: protocol.lastUpdated,
      dataSource: protocol.dataSource,
    };

    res.status(200).json({
      success: true,
      message: `${protocolName} protocol retrieved successfully`,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /protocols/compare/:asset
 * Compare APY for a specific asset across all protocols
 */
export const compareAPY = async (req, res, next) => {
  try {
    const { asset } = req.params;

    if (!asset) {
      throw new AppError('Asset parameter is required', 400);
    }

    const comparison = await compareAPYForAsset(asset);

    res.status(200).json({
      success: true,
      message: `APY comparison for ${asset} retrieved successfully`,
      asset: asset,
      count: comparison.length,
      bestProtocol: comparison[0], // Highest APY
      data: comparison,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /best
 * Get the best protocol (highest APY) for a specific asset
 */
export const getBestProtocol = async (req, res, next) => {
  try {
    const { asset } = req.query;

    if (!asset) {
      throw new AppError('Asset query parameter is required', 400);
    }

    const bestProtocol = await findBestAPYForAsset(asset);

    res.status(200).json({
      success: true,
      message: `Best protocol found for ${asset}`,
      asset: asset,
      data: bestProtocol,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /protocols/refresh
 * Manually refresh APY data from all protocols
 * (In production, this would be called by a scheduled job)
 */
export const refreshProtocolData = async (req, res, next) => {
  try {
    const freshData = await fetchAllProtocolAPY();

    const protocolsResponse = freshData.map((p) => ({
      name: p.name,
      assets: p.assets,
      description: p.description,
      url: p.url,
      lastUpdated: p.lastUpdated,
      dataSource: p.dataSource,
    }));

    res.status(200).json({
      success: true,
      message: 'Protocol data refreshed successfully',
      count: protocolsResponse.length,
      data: protocolsResponse,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProtocols,
  getProtocolByName,
  compareAPY,
  getBestProtocol,
  refreshProtocolData,
};
