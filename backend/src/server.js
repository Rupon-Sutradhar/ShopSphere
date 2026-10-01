// Load environment variables FIRST — before any other module reads process.env.
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/config');

/**
 * Bootstrap the application:
 * 1. Connect to MongoDB.
 * 2. Start the HTTP server.
 *
 * The server only starts AFTER the database connection is established.
 * If MongoDB is unreachable, connectDB() exits the process (see db.js).
 */
const startServer = async () => {
  // Connect to MongoDB first — server won't start if DB is unreachable.
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    console.log(`Health check: http://localhost:${config.port}/api/health`);
  });

  // ── Graceful shutdown ────────────────────────────────────────────────────────
  // In production, SIGTERM is sent by Docker / Kubernetes / PM2 before killing.
  // We close the HTTP server first (stop accepting new connections), then exit.
  const gracefulShutdown = (signal) => {
    console.log(`\n⚠️   ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('🔌  HTTP server closed.');
      process.exit(0);
    });

    // Force-exit if shutdown takes more than 10 s.
    setTimeout(() => {
      console.error('❌  Forced shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // ── Unhandled rejections ─────────────────────────────────────────────────────
  process.on('unhandledRejection', (reason) => {
    console.error('❌  Unhandled Rejection:', reason);
    // Give the server a chance to finish in-flight requests, then exit.
    server.close(() => process.exit(1));
  });
};

startServer();
