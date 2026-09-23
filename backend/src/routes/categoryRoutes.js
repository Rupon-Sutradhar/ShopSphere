/**
 * Category Routes
 *
 * Defines API routing endpoints for category management:
 * - Public access for browsing categories.
 * - Admin-only restricted access for creation, modification, and deletion.
 *
 * @module routes/categoryRoutes
 */

const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = Router();

/**
 * @route   GET /
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', categoryController.getCategories);

/**
 * @route   GET /:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', categoryController.getCategory);

/**
 * @route   POST /
 * @desc    Create a category
 * @access  Private/Admin
 */
router.post('/', authenticate, authorize('admin'), categoryController.createCategory);

/**
 * @route   PUT /:id
 * @desc    Update a category
 * @access  Private/Admin
 */
router.put('/:id', authenticate, authorize('admin'), categoryController.updateCategory);

/**
 * @route   DELETE /:id
 * @desc    Delete a category
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
