const { Router } = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = Router();

/**
 * @route   POST /api/auth/
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout a user
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

module.exports = router;
