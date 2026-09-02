/**
 * Response helpers — standardize all API responses
 *
 * WHAT: Helper functions that return consistent JSON responses.
 *
 * WHY: Without these, every controller would write slightly different
 *      response formats. With helpers, every response looks like:
 *        { success: true, data: {...} }
 *        { success: false, message: "..." }
 *
 * INTERVIEW TIP: Consistent API responses make frontend handling easier
 * and make your API easier to document and test.
 *
 * HOW to use in a controller:
 *   import { sendSuccess, sendError } from '../utils/response.js'
 *   sendSuccess(res, { user }, 'Logged in successfully', 200)
 *   sendError(res, 'Invalid credentials', 401)
 */

/**
 * Send a successful response
 * @param {object} res     - Express response object
 * @param {object} data    - Data payload to send back
 * @param {string} message - Optional success message
 * @param {number} status  - HTTP status code (default: 200)
 */
export const sendSuccess = (res, data = {}, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    ...data,
  })
}

/**
 * Send an error response
 * @param {object} res     - Express response object
 * @param {string} message - Error message (safe to show to user)
 * @param {number} status  - HTTP status code (default: 500)
 */
export const sendError = (res, message = 'Server Error', status = 500) => {
  return res.status(status).json({
    success: false,
    message,
  })
}
