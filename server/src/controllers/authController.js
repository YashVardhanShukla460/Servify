/**
 * Auth Controller — handles register, login, logout, getMe
 *
 * WHAT is a controller?
 *   A controller is the function that handles what happens when a route is matched.
 *   It reads the request, talks to the database, and sends a response.
 *
 * FLOW:
 *   Route → Validator → Controller → Service/Model → Response
 *
 * SECURITY RULES we follow here:
 *   1. Never return the password field in any response
 *   2. Never give a specific error like "email not found" (use generic messages)
 *      Why? Specific messages help attackers enumerate valid emails
 *   3. Always use try/catch and pass errors to next() for the error handler
 */

import User from '../models/User.js'
import Worker from '../models/Worker.js'
import { generateToken } from '../utils/jwt.js'
import { setTokenCookie, clearTokenCookie } from '../utils/cookie.js'
import { sendSuccess, sendError } from '../utils/response.js'

// ─────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'customer', phone } = req.body

    // 1. Check if email is already registered
    //    We do this BEFORE creating the user to give a clear error message.
    //    The DB has a unique index on email, but we check manually for a better error.
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return sendError(res, 'An account with this email already exists.', 409)
      // 409 = Conflict
    }

    // 2. Create the user
    //    NOTE: We do NOT hash the password here.
    //    The User model's pre-save hook (in User.js) does it automatically.
    //    This is the benefit of putting logic in the model.
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone: phone?.trim(),
    })

    // 3. If the user registered as a worker, create their Worker profile automatically
    //    The worker profile starts with status: 'pending' (needs admin approval)
    if (role === 'worker') {
      await Worker.create({ user: user._id })
      // Worker profile is empty for now — they fill it in their dashboard (Phase 8)
    }

    // 4. Generate JWT token with userId and role in the payload
    const token = generateToken(user._id, user.role)

    // 5. Set the token in an HTTP-only cookie
    //    The browser will automatically send this cookie with every future request
    setTokenCookie(res, token)

    // 6. Send response — NEVER include the password
    //    We select specific fields to avoid accidentally leaking sensitive data
    return sendSuccess(
      res,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      },
      role === 'worker'
        ? 'Account created. Your worker profile is pending admin approval.'
        : 'Account created successfully.',
      201 // 201 = Created
    )
  } catch (error) {
    next(error) // Pass to centralized error handler
  }
}

// ─────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // 1. Find user by email
    //    .select('+password') explicitly requests the password field
    //    (it has select: false in the schema, so it's excluded by default)
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select('+password')

    // 2. Check if user exists AND password matches
    //    WHY combine these checks?
    //    If we said "email not found" vs "wrong password" separately,
    //    attackers could enumerate valid emails by trying different ones.
    //    A generic message protects against this.
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 'Invalid email or password.', 401)
      // 401 = Unauthorized
    }

    // 3. Check if account is active (not suspended)
    if (!user.isActive) {
      return sendError(res, 'Your account has been suspended. Please contact support.', 403)
      // 403 = Forbidden
    }

    // 4. Generate token and set cookie
    const token = generateToken(user._id, user.role)
    setTokenCookie(res, token)

    // 5. Send response (no password)
    return sendSuccess(
      res,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      },
      'Logged in successfully.'
    )
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private (requires auth)
// ─────────────────────────────────────────────
export const logout = async (req, res, next) => {
  try {
    // Clear the HTTP-only cookie from the browser
    // This is all we need to do — without the cookie, the user is logged out
    clearTokenCookie(res)

    return sendSuccess(res, {}, 'Logged out successfully.')
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// @desc    Get currently logged-in user
// @route   GET /api/auth/me
// @access  Private (requires auth)
// ─────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    // req.user is set by the requireAuth middleware (see auth.js)
    // It contains the userId decoded from the JWT
    const user = await User.findById(req.user.userId)

    if (!user) {
      return sendError(res, 'User not found.', 404)
    }

    return sendSuccess(res, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}
