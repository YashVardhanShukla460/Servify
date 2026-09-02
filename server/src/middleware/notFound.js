/**
 * notFound middleware — handles routes that do not exist
 *
 * WHAT:
 *   If a request reaches this middleware, no route matched it.
 *   We create an error and pass it to the errorHandler.
 *
 * WHY:
 *   Without this, Express returns an empty response for unknown routes.
 *   This gives the caller a clear, consistent 404 JSON error instead.
 *
 * HOW it works:
 *   It is registered AFTER all real routes in server.js.
 *   Express only reaches it if nothing else matched.
 *
 * Example:
 *   GET /api/nonexistent → { success: false, message: "Route /api/nonexistent not found" }
 */

const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`)
  error.statusCode = 404
  next(error) // Pass to errorHandler
}

export default notFound
