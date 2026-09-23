const mongoose = require('mongoose');

/**
 * GET /api/health
 *
 * Returns the operational status of the API and its dependencies.
 * Designed to be used by:
 *   – Load balancers / reverse proxies (simple 200 check)
 *   – Monitoring tools (Uptime Robot, Datadog, etc.)
 *   – Docker / Kubernetes liveness & readiness probes
 */
const getHealth = async (req, res) => {
  // Mongoose readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';

  const healthData = {
    success: true,
    message: 'ShopSphere API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStatus,
    },
  };

  // Return 503 if the database is not connected so load balancers can route away.
  const statusCode = dbState === 1 ? 200 : 503;

  res.status(statusCode).json(healthData);
};

module.exports = { getHealth };
