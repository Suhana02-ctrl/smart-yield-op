import express from 'express';
import {
  getAllProtocols,
  getProtocolByName,
  compareAPY,
  getBestProtocol,
  refreshProtocolData,
} from '../controllers/protocolController.js';

const router = express.Router();

/**
 * GET /api/protocols
 * Get all available protocols with their current APY rates
 */
router.get('/', getAllProtocols);

/**
 * GET /api/protocols/best
 * Get the best protocol (highest APY) for a specific asset
 * Query: ?asset=USDC
 */
router.get('/best', getBestProtocol);

/**
 * GET /api/protocols/compare/:asset
 * Compare APY for a specific asset across all protocols
 */
router.get('/compare/:asset', compareAPY);

/**
 * GET /api/protocols/:protocolName
 * Get a specific protocol details
 */
router.get('/:protocolName', getProtocolByName);

/**
 * POST /api/protocols/refresh
 * Manually refresh APY data from all protocols
 */
router.post('/refresh', refreshProtocolData);

export default router;
