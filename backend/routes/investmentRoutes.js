import express from 'express';
import {
  createInvestment,
  getUserInvestments,
  getInvestmentById,
  updateInvestment,
  checkBetterAPY,
  deleteInvestment,
} from '../controllers/investmentController.js';

const router = express.Router();

/**
 * POST /api/investments
 * Create a new investment
 * Body: { userId, amount, asset, selectedProtocol, apy }
 */
router.post('/', createInvestment);

/**
 * GET /api/investments/:userId
 * Get all investments for a user
 */
router.get('/:userId', getUserInvestments);

/**
 * GET /api/investments/detail/:investmentId
 * Get a specific investment by ID
 */
router.get('/detail/:investmentId', getInvestmentById);

/**
 * PUT /api/investments/:investmentId
 * Update investment status or notes
 * Body: { status, notes }
 */
router.put('/:investmentId', updateInvestment);

/**
 * POST /api/investments/:investmentId/check-better-apy
 * Check if a better APY is available for this investment
 */
router.post('/:investmentId/check-better-apy', checkBetterAPY);

/**
 * DELETE /api/investments/:investmentId
 * Delete an investment
 */
router.delete('/:investmentId', deleteInvestment);

export default router;
