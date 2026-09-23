const { Router } = require('express');
const productController = require('../controllers/productController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = Router();

/**
 * @route   GET /
 * @desc    Get all products
 * @access  Public
 */
router.get('/', productController.getProducts);

/**
 * @route   GET /:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', productController.getProduct);

/**
 * @route   POST /
 * @desc    Create a product
 * @access  Private/Admin
 */
router.post('/', authenticate, authorize('admin'), productController.createProduct);

/**
 * @route   PUT /:id
 * @desc    Update a product
 * @access  Private/Admin
 */
router.put('/:id', authenticate, authorize('admin'), productController.updateProduct);

/**
 * @route   DELETE /:id
 * @desc    Delete a product
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

module.exports = router;
