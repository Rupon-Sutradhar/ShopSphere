/**
 * Centralised error-handling middleware.
 *
 * Must be registered LAST in app.js (after all routes) because Express
 * identifies error handlers by their 4-parameter signature: (err, req, res, next).
 *
 * Usage in controllers / services:
 *   const { AppError } = require('../utils/AppError');
 *   throw new AppError('Product not found', 404);
 *   — or —
 *   next(new AppError('Unauthorized', 401));
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Log the full error in non-production environments for easier debugging.
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${err.stack || err.message}`);
  }

  // Operational errors (thrown intentionally via AppError) carry a statusCode.
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Mongoose CastError → 404-style "not found" response.
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Mongoose duplicate key error (e.g. unique email).
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate value for '${field}'. Please use a different value.`,
    });
  }

  // Mongoose validation errors.
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // JWT errors will be handled here in Phase 2.

  // Generic response.
  res.status(statusCode).json({
    success: false,
    message,
    // Only expose stack trace in development.
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
