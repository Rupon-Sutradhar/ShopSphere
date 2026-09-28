const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/create-payment-intent', authenticate, createPaymentIntent);

module.exports = router;
