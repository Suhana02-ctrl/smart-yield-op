import { AppError } from '../middleware/errorHandler.js';
import {
  findBestAPYForAsset,
  checkForBetterAPY,
} from '../utils/apy-fetcher.js';

// In-memory storage (since no DB)
const investments = new Map();
let investmentCounter = 1;

/**
 * POST /invest
 * Create a new investment
 */
export const createInvestment = async (req, res, next) => {
  try {
    const { userId, amount, asset, selectedProtocol, apy } = req.body;

    // Validate required fields
    if (!userId || !amount || !asset || !selectedProtocol || !apy) {
      throw new AppError('Missing required fields', 400);
    }

    // Validate amount
    if (amount <= 0) {
      throw new AppError('Amount must be greater than 0', 400);
    }

    // Create new investment
    const investmentId = `inv_${investmentCounter++}`;
    const investment = {
      _id: investmentId,
      userId,
      amount,
      asset,
      selectedProtocol,
      apy,
      status: 'active',
      investedAt: new Date(),
      lastMonitoredAt: new Date(),
      beaterProtocol: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store in memory
    investments.set(investmentId, investment);

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: investment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /investments
 * Get all investments for a user
 */
export const getUserInvestments = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    const userInvestments = Array.from(investments.values())
      .filter((inv) => inv.userId === userId)
      .sort((a, b) => b.investedAt - a.investedAt);

    res.status(200).json({
      success: true,
      message: 'Investments retrieved successfully',
      count: userInvestments.length,
      data: userInvestments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /investments/:investmentId
 * Get a specific investment
 */
export const getInvestmentById = async (req, res, next) => {
  try {
    const { investmentId } = req.params;

    const investment = investments.get(investmentId);

    if (!investment) {
      throw new AppError('Investment not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Investment retrieved successfully',
      data: investment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /investments/:investmentId
 * Update investment status or notes
 */
export const updateInvestment = async (req, res, next) => {
  try {
    const { investmentId } = req.params;
    const { status, notes } = req.body;

    const investment = investments.get(investmentId);

    if (!investment) {
      throw new AppError('Investment not found', 404);
    }

    if (status) investment.status = status;
    if (notes) investment.notes = notes;
    investment.updatedAt = new Date();

    res.status(200).json({
      success: true,
      message: 'Investment updated successfully',
      data: investment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /investments/:investmentId/check-better-apy
 * Check if a better APY is available for this investment
 */
export const checkBetterAPY = async (req, res, next) => {
  try {
    const { investmentId } = req.params;

    const investment = investments.get(investmentId);

    if (!investment) {
      throw new AppError('Investment not found', 404);
    }

    const result = await checkForBetterAPY(investment);

    // Update lastMonitoredAt
    investment.lastMonitoredAt = new Date();
    if (result.betterAPYFound) {
      investment.beaterProtocol = result.betterProtocol;
    }

    res.status(200).json({
      success: true,
      message:
        result.betterAPYFound
          ? 'Better APY found'
          : 'Current protocol has best APY',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /investments/:investmentId
 * Delete an investment
 */
export const deleteInvestment = async (req, res, next) => {
  try {
    const { investmentId } = req.params;

    const investment = investments.get(investmentId);

    if (!investment) {
      throw new AppError('Investment not found', 404);
    }

    investments.delete(investmentId);

    res.status(200).json({
      success: true,
      message: 'Investment deleted successfully',
      data: investment,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createInvestment,
  getUserInvestments,
  getInvestmentById,
  updateInvestment,
  checkBetterAPY,
  deleteInvestment,
};
