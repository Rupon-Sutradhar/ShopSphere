const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const config = require('./config/config');
const healthRoutes = require('./routes/healthRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const paymentRoutes = require('./routes/paymentRoutes');
const { stripeWebhook } = require('./controllers/paymentController');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Required when the app is behind Docker/Nginx/a cloud load balancer. It lets
// Express correctly identify HTTPS requests and client IP addresses.
app.set('trust proxy', 1);

// ─── CORS ──────────────────────────────────────────────────────────────────────
// In development we allow the Vite dev server origin.
// In production this list will be restricted to the deployed frontend domain.
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    const allowedOrigins = config.clientOrigin
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error(`CORS policy: origin '${origin}' is not allowed.`));
  },
  credentials: true, // Allow cookies / Authorization headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// NOTE: app.options('*', ...) is NOT used here — Express 5's path-to-regexp
// no longer accepts bare '*' wildcards. Global app.use(cors()) already
// handles OPTIONS pre-flight for every route automatically.

// ─── Production Security ───────────────────────────────────────────────────────
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
app.use('/api', apiLimiter);

// ─── Stripe Webhook ────────────────────────────────────────────────────────────
// Must be mounted before express.json() because Stripe needs the raw body.
// Uses app.post() (not app.use()) because webhooks are always POST and
// stripeWebhook is a terminal handler, not an Express Router.
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// ─── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Cookie Parser ─────────────────────────────────────────────────────────────
// Required now so Phase 2 JWT cookie support works without structural changes.
app.use(cookieParser());

// ─── Request Logging ───────────────────────────────────────────────────────────
// Use 'dev' format in development (colour-coded), 'combined' in production
// (Apache-style, suitable for log aggregation tools).
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/payment', paymentRoutes); // Non-webhook payment routes like create-payment-intent

// Phase 3+ routes will be added here:
// app.use('/api/users',    userRoutes);
// app.use('/api/cart',     cartRoutes);

// ─── 404 Handler ───────────────────────────────────────────────────────────────
// Must come AFTER all routes so only truly unknown routes hit it.
app.use(notFound);

// ─── Centralised Error Handler ─────────────────────────────────────────────────
// Must be the LAST middleware (4-param signature required by Express).
app.use(errorHandler);

module.exports = app;
