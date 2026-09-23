/**
 * Centralised application configuration.
 *
 * All environment-derived values are read ONCE here and exported as a
 * plain object. This prevents process.env lookups from being scattered
 * across the codebase and makes it easy to add validation later.
 */
const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  // ── Phase 2 placeholders ──────────────────────────────────────────────────
  // jwt: {
  //   secret: process.env.JWT_SECRET,
  //   expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // },

  // ── Phase 2+ placeholders ─────────────────────────────────────────────────
  // cloudinary: {
  //   cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  //   apiKey: process.env.CLOUDINARY_API_KEY,
  //   apiSecret: process.env.CLOUDINARY_API_SECRET,
  // },

  // ── Phase 5 placeholders ──────────────────────────────────────────────────
  // stripe: {
  //   secretKey: process.env.STRIPE_SECRET_KEY,
  //   webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  // },
};

module.exports = config;
