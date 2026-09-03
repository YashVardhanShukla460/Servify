/**
 * Auth Routes — define the URL endpoints for authentication
 *
 * WHAT: Connects URLs to the right controller functions,
 *       with validators and middleware in between.
 *
 * Route pattern:
 *   METHOD  /path  →  [middleware...]  →  controller
 *
 * All routes here are prefixed with /api/auth in server.js
 * So "router.post('/'register')" becomes POST /api/auth/register
 */

import express from 'express'
import { register, login, logout, getMe } from '../controllers/authController.js'
import { validateRegister, validateLogin } from '../validators/authValidators.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// POST /api/auth/register
// Public — no auth needed, but validate the input first
router.post('/register', validateRegister, register)

// POST /api/auth/login
// Public — validate input, then try to log in
router.post('/login', validateLogin, login)

// POST /api/auth/logout
// Private — must be logged in to log out (so we know whose cookie to clear)
router.post('/logout', requireAuth, logout)

// GET /api/auth/me
// Private — returns the currently logged-in user's data
// Used by the React app on page load to restore auth state
router.get('/me', requireAuth, getMe)

export default router
