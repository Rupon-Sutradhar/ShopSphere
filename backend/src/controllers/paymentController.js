const stripe = require('stripe');
const Order = require('../models/Order');
const { AppError } = require('../utils/AppError');
const config = require('../config/config');

// Initialize stripe here using config
let stripeInstance;
const getStripe = () => {
  if (!stripeInstance && config.stripe.secretKey) {
    stripeInstance = stripe(config.stripe.secretKey);
  }
  return stripeInstance;
};

/**
 * @desc    Create Payment Intent
 * @route   POST /api/payment/create-payment-intent
 * @access  Private
 */
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const stripeClient = getStripe();
    if (!stripeClient) {
      return next(new AppError('Stripe is not configured on the server', 500));
    }

    const { orderId } = req.body;
    if (!orderId) {
      return next(new AppError('Order ID is required', 400));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Optional: check if order belongs to the requesting user
    if (order.user.toString() !== req.user._id.toString()) {
       return next(new AppError('Not authorized to pay for this order', 403));
    }

    if (order.isPaid) {
      return next(new AppError('Order is already paid', 400));
    }

    const amount = Math.round(order.totalPrice * 100);
    if (!Number.isSafeInteger(amount) || amount < 50) {
      return next(new AppError('Order total cannot be processed', 400));
    }

    // Reuse an existing intent so retries or page refreshes cannot create
    // several charges for the same order.
    if (order.paymentIntentId) {
      const existingIntent = await stripeClient.paymentIntents.retrieve(order.paymentIntentId);
      if (!['canceled', 'succeeded'].includes(existingIntent.status)) {
        return res.json({ success: true, clientSecret: existingIntent.client_secret });
      }
    }

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency: 'usd', // Modify as appropriate
      metadata: { orderId: order._id.toString(), userId: req.user._id.toString() },
      receipt_email: req.user.email,
    });

    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Stripe Webhook
 * @route   POST /api/payment/webhook
 * @access  Public
 */
exports.stripeWebhook = async (req, res, next) => {
  const stripeClient = getStripe();
  if (!stripeClient) {
    console.error('Stripe is not configured on the server');
    return res.status(400).send('Stripe is not configured');
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = config.stripe.webhookSecret;
  if (!endpointSecret) {
    return res.status(400).send('Stripe webhook secret is not configured');
  }

  let event;

  try {
    // req.body must be the raw buffer here, so express.raw() should be applied in app.js
    event = stripeClient.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        const order = await Order.findOne({
          _id: orderId,
          paymentIntentId: paymentIntent.id,
        });
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            email_address: paymentIntent.receipt_email || '',
          };
          await order.save();
          console.log(`Order ${orderId} marked as paid from webhook.`);
        } else if (order && order.isPaid) {
          console.log(`Order ${orderId} was already paid. Ignored webhook.`);
        } else {
          console.error(`Order ${orderId} not found for payment_intent.succeeded`);
        }
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    // Don't leak internals to Stripe webhook retries, just ack with an error
    res.status(500).send('Webhook handler error');
  }
};
