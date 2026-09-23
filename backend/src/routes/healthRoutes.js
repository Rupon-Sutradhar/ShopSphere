const { Router } = require('express');
const { getHealth } = require('../controllers/healthController');

const router = Router();

/**
 * @route   GET /api/health
 * @desc    API health check — confirms the server and DB are operational
 * @access  Public
 */
router.get('/', getHealth);

module.exports = router;
