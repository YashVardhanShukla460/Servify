/**
 * Auth Middleware — protect routes that require login
 *
 * WHAT: Middleware that verifies the JWT cookie on every protected request.
 *
 * WHY middleware instead of checking in every controller?
 *   Without middleware, every controller would need to copy-paste
 *   the same cookie-reading and JWT-verification code.
 *   With middleware, you write it once and apply it to any route.
 *
 * HOW to use on a route:
 *   router.get('/profile', requireAuth, getProfile)
 *   router.post('/bookings', requireAuth, requireRole('customer'), createBooking)
 *
 * WHAT gets added to req?
 *   req.user = { userId: '...', role: 'customer' }
 *   Controllers can then use req.user.userId to find the current user.
 */

import { verifyToken } from '../utils/jwt.js'
import { COOKIE_NAME } from '../utils/cookie.js'
import { sendError } from '../utils/response.js'

// ─────────────────────────────────────────────
// requireAuth — checks that user is logged in
// ─────────────────────────────────────────────
export const requireAuth = (req, res, next) => {
  try {
    // 1. Read the token from the HTTP-only cookie
    const token = req.cookies[COOKIE_NAME]

    if (!token) {
      return sendError(res, 'You must be logged in to access this resource.', 401)
    }

    // 2. Verify the token with our secret
    //    This checks:
    //      - Was this token signed by OUR server? (not forged)
    //      - Has it expired?
    //    If either check fails, verifyToken throws an error
    const decoded = verifyToken(token)

    // 3. Attach decoded payload to req.user
    //    Now any controller that comes after this middleware
    //    can access req.user.userId and req.user.role
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    }

    next() // Everything is fine — proceed to the controller
  } catch (error) {
    // JWT errors: JsonWebTokenError, TokenExpiredError
    // The errorHandler will convert these to proper 401 responses
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Your session has expired. Please log in again.', 401)
    }
    return sendError(res, 'Invalid authentication token. Please log in again.', 401)
  }
}

// ─────────────────────────────────────────────
// requireRole — checks that user has a specific role
// MUST be used AFTER requireAuth (needs req.user to exist)
// ─────────────────────────────────────────────
export const requireRole = (...roles) => {
  return (req, res, next) => {
    // req.user is set by requireAuth — if this runs without requireAuth first,
    // req.user will be undefined and this will crash. Always chain them.
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401)
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. This action requires one of these roles: ${roles.join(', ')}.`,
        403 // 403 = Forbidden (authenticated but not authorized)
      )
    }

    next()
  }
}
