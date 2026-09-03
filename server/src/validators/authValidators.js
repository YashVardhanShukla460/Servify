/**
 * Auth Validators — validate register and login request bodies
 *
 * WHAT: Functions that check incoming request data before
 *       the controller handles it.
 *
 * WHY: We never trust the frontend. Anyone can send a raw HTTP
 *      request to our API with bad data. Validation catches it early
 *      and returns a clear error message.
 *
 * HOW: Each validator is an Express middleware function.
 *      If validation fails → sends 400 response immediately.
 *      If validation passes → calls next() to reach the controller.
 *
 * WHY not use a library like express-validator or Joi?
 *   For this scale, manual validation is more transparent and
 *   easier to understand. We can add a library later if complexity grows.
 *   DECISIONS.md covers this choice.
 */

/**
 * Validate registration input
 * Checks: name, email, password, role
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body

  const errors = []

  // ─── Name ───
  if (!name || typeof name !== 'string') {
    errors.push('Name is required')
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  } else if (name.trim().length > 50) {
    errors.push('Name cannot exceed 50 characters')
  }

  // ─── Email ───
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/
  if (!email || typeof email !== 'string') {
    errors.push('Email is required')
  } else if (!emailRegex.test(email.trim())) {
    errors.push('Please provide a valid email address')
  }

  // ─── Password ───
  if (!password || typeof password !== 'string') {
    errors.push('Password is required')
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters')
  } else if (password.length > 128) {
    errors.push('Password is too long')
  }

  // ─── Role ───
  const allowedRoles = ['customer', 'worker']
  // Note: 'admin' is NOT in this list — admins are created manually in the DB
  if (role && !allowedRoles.includes(role)) {
    errors.push('Role must be either customer or worker')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0], // Return the first error (keep it simple)
      errors,             // Also include all errors for frontend
    })
  }

  next()
}

/**
 * Validate login input
 * Checks: email, password
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body
  const errors = []

  if (!email || typeof email !== 'string') {
    errors.push('Email is required')
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    })
  }

  next()
}
