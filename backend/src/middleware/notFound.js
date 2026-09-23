/**
 * 404 Not-Found handler.
 *
 * Catches any request that falls through all registered routes and
 * returns a structured JSON error rather than Express's default HTML page.
 *
 * Must be registered AFTER all routes but BEFORE the error handler.
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;
