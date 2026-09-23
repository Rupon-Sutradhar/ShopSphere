const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const config = require('./config/config');
const healthRoutes = require('./routes/healthRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

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
app.options('*', cors(corsOptions)); // Pre-flight for all routes

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

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);

// Phase 2+ routes will be added here:
// app.use('/api/auth',     authRoutes);
// app.use('/api/users',    userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/cart',     cartRoutes);
// app.use('/api/orders',   orderRoutes);

// ─── 404 Handler ───────────────────────────────────────────────────────────────
// Must come AFTER all routes so only truly unknown routes hit it.
app.use(notFound);

// ─── Centralised Error Handler ─────────────────────────────────────────────────
// Must be the LAST middleware (4-param signature required by Express).
app.use(errorHandler);

module.exports = app;
