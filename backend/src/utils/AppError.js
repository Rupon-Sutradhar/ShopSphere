/**
 * AppError – Operational error class.
 *
 * Extend the built-in Error so we can attach an HTTP status code.
 * Controllers and services throw AppError for known, intentional errors
 * (e.g. "404 Product not found").  The centralised errorHandler middleware
 * detects these and formats a clean JSON response.
 *
 * Programming errors (bugs) should propagate as plain Errors and produce a 500.
 *
 * Usage:
 *   throw new AppError('Product not found', 404);
 *   next(new AppError('Unauthorized', 401));
 */
class AppError extends Error {
  /**
   * @param {string} message   - Human-readable error message.
   * @param {number} statusCode - HTTP status code (4xx / 5xx).
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // Conventionally, 4xx errors are "operational" (expected user errors);
    // 5xx errors are programming errors or infrastructure failures.
    this.isOperational = statusCode < 500;

    // Capture stack trace excluding this constructor frame.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
