/**
 * User Controller
 *
 * @route GET    /api/users/me          - get own profile (auth)
 * @route PATCH  /api/users/me          - update name, phone (auth)
 * @route PATCH  /api/users/me/password - change password (auth)
 */
import User from '../models/User.js'
import { sendSuccess, sendError } from '../utils/response.js'

// ─────────────────────────────────────────────
// GET /api/users/me
// ─────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return sendError(res, 'User not found.', 404)
    return sendSuccess(res, { user })
  } catch (error) { next(error) }
}

// ─────────────────────────────────────────────
// PATCH /api/users/me
// Update name and/or phone — does NOT allow changing email or role
// ─────────────────────────────────────────────
export const updateMe = async (req, res, next) => {
  try {
    const { name, phone } = req.body

    if (name !== undefined && name.trim().length < 2)
      return sendError(res, 'Name must be at least 2 characters.', 400)

    const user = await User.findById(req.user.userId)
    if (!user) return sendError(res, 'User not found.', 404)

    if (name  !== undefined) user.name  = name.trim()
    if (phone !== undefined) user.phone = phone?.trim()

    await user.save()
    return sendSuccess(res, { user }, 'Profile updated successfully.')
  } catch (error) { next(error) }
}

// ─────────────────────────────────────────────
// PATCH /api/users/me/password
// Change password — requires current password for verification
// ─────────────────────────────────────────────
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword)
      return sendError(res, 'Both current and new password are required.', 400)

    if (newPassword.length < 6)
      return sendError(res, 'New password must be at least 6 characters.', 400)

    if (currentPassword === newPassword)
      return sendError(res, 'New password must be different from current password.', 400)

    // Explicitly select password (it has select: false in schema)
    const user = await User.findById(req.user.userId).select('+password')
    if (!user) return sendError(res, 'User not found.', 404)

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) return sendError(res, 'Current password is incorrect.', 401)

    user.password = newPassword  // Pre-save hook will hash it automatically
    await user.save()

    return sendSuccess(res, {}, 'Password changed successfully.')
  } catch (error) { next(error) }
}
