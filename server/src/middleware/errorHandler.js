/**
 * Centralized Error Handler — catches ALL unhandled errors in Express
 *
 * WHAT:
 *   A special Express middleware with 4 parameters (err, req, res, next).
 *   Express knows this is an error handler because of the 4th parameter.
 *
 * WHY:
 *   Without this, every single controller would need its own try/catch
 *   and its own error response logic. That leads to inconsistent responses
 *   and duplicated code.
 *
 *   WITH this: every controller can just call next(error) and this handler
 *   takes care of the rest.
 *
 * HOW it fits in the request lifecycle:
 *   Request
 *     -> Middleware stack
 *     -> Controller (throws error or calls next(error))
 *     -> errorHandler (catches it, sends safe response)
 *
 * SECURITY: We NEVER expose stack traces in production.
 * Stack traces reveal your file structure and internal code to attackers.
 */

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging (server-side only)
  console.error(`[ERROR] ${err.message}`)
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }

  // Default error values
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // ─── Handle specific MongoDB/Mongoose error types ───

  // Mongoose validation error (e.g. required field missing)
  // Example: new User({}) without required fields
  if (err.name === 'ValidationError') {
    statusCode = 400
    // Collect all validation messages into one readable string
    message = Object.values(err.errors).map((e) => e.message).join(', ')
  }

  // MongoDB duplicate key error (e.g. email already exists)
  // Error code 11000 = duplicate key in MongoDB
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue)[0]
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
  }

  // Mongoose bad ObjectId (e.g. /api/users/not-a-valid-id)
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  // JWT errors (handled in auth middleware, but belt-and-suspenders)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token. Please log in again.'
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Your session has expired. Please log in again.'
  }

  // ─── Send the response ───
  return res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace in development (never in production)
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export default errorHandler
