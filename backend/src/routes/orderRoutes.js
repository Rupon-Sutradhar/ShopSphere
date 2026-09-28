const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate);

router
  .route('/')
  .post(orderController.createOrder)
  .get(authorize('admin'), orderController.getAllOrders);

router
  .route('/my')
  .get(orderController.getMyOrders);

router
  .route('/:id')
  .get(orderController.getOrderById);

router
  .route('/:id/status')
  .put(authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
