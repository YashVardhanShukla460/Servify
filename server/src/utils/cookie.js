/**
 * Cookie Utility — set and clear the JWT cookie
 *
 * WHAT is an HTTP-only cookie?
 *   A cookie with the `httpOnly` flag set. JavaScript running in the browser
 *   CANNOT read it (document.cookie won't show it). Only the browser itself
 *   sends it automatically with every request to the same domain.
 *
 * Cookie security flags explained:
 *
 *   httpOnly:  true   → JavaScript can't access it (prevents XSS theft)
 *   secure:    true   → Only sent over HTTPS (set true in production)
 *   sameSite: 'strict'→ Cookie is only sent to same-site requests (prevents CSRF)
 *   maxAge:          → How long the cookie lives (in milliseconds)
 *
 * WHY 7 days?
 *   Long enough that users don't have to log in constantly.
 *   Short enough that a stolen cookie expires quickly.
 */

const COOKIE_NAME = 'servify_token'

// 7 days in milliseconds
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

/**
 * Set JWT token in an HTTP-only cookie
 * @param {object} res   - Express response object
 * @param {string} token - JWT string to store
 */
export const setTokenCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: COOKIE_MAX_AGE,
  })
}

/**
 * Clear the JWT cookie (used on logout)
 * @param {object} res - Express response object
 */
export const clearTokenCookie = (res) => {
  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 0, // Expire immediately
  })
}

export { COOKIE_NAME }
