/**
 * JWT Utility — generate and verify JSON Web Tokens
 *
 * WHAT is a JWT?
 *   A JWT is a signed string with 3 parts separated by dots:
 *   header.payload.signature
 *
 *   - header:    algorithm used (HS256)
 *   - payload:   data we put inside (userId, role) — NOT secret, just encoded
 *   - signature: proof the token was issued by our server (uses JWT_SECRET)
 *
 * WHY do we put userId and role in the payload?
 *   So every protected request does NOT need a database lookup just to know
 *   who is making the request. We decode the token and get userId + role instantly.
 *
 * HOW it works end to end:
 *   Register/Login → server creates JWT → stores in HTTP-only cookie
 *   Protected request → browser sends cookie → server verifies JWT → reads userId + role
 */

import jwt from 'jsonwebtoken'

/**
 * Generate a JWT token
 * @param {string} userId  - The user's MongoDB _id
 * @param {string} role    - The user's role: 'customer' | 'worker' | 'admin'
 * @returns {string}       - Signed JWT string
 */
export const generateToken = (userId, role) => {
  return jwt.sign(
    // Payload — data stored inside the token
    { userId, role },

    // Secret — used to sign and verify the token
    // If someone tampers with the payload, verification fails
    process.env.JWT_SECRET,

    // Options
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
}

/**
 * Verify and decode a JWT token
 * @param {string} token - The JWT string to verify
 * @returns {object}     - Decoded payload { userId, role, iat, exp }
 * @throws               - Error if token is invalid or expired
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}
