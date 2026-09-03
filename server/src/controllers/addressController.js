/**
 * Address Controller
 *
 * @route GET    /api/addresses         - list my saved addresses
 * @route POST   /api/addresses         - add new address
 * @route PATCH  /api/addresses/:id     - update address
 * @route DELETE /api/addresses/:id     - delete address
 * @route PATCH  /api/addresses/:id/default - set as default
 */
import Address from '../models/Address.js'
import { sendSuccess, sendError } from '../utils/response.js'

// ── GET /api/addresses ──────────────────────
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user.userId })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean()
    return sendSuccess(res, { addresses, count: addresses.length })
  } catch (error) { next(error) }
}

// ── POST /api/addresses ──────────────────────
export const addAddress = async (req, res, next) => {
  try {
    const { label, addressLine1, addressLine2, city, state, pincode } = req.body

    if (!addressLine1?.trim()) return sendError(res, 'Address line 1 is required.', 400)
    if (!city?.trim())         return sendError(res, 'City is required.', 400)
    if (!state?.trim())        return sendError(res, 'State is required.', 400)
    if (!pincode)              return sendError(res, 'Pincode is required.', 400)
    if (!/^\d{6}$/.test(String(pincode))) return sendError(res, 'Pincode must be 6 digits.', 400)

    // Check if this is the user's first address — make it default automatically
    const existingCount = await Address.countDocuments({ user: req.user.userId })
    const isFirstAddress = existingCount === 0

    const address = await Address.create({
      user:         req.user.userId,
      label:        label || 'Home',
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim(),
      city:         city.trim(),
      state:        state.trim(),
      pincode:      String(pincode),
      isDefault:    isFirstAddress,
    })

    return sendSuccess(res, { address }, 'Address saved successfully.', 201)
  } catch (error) { next(error) }
}

// ── PATCH /api/addresses/:id ─────────────────
export const updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user.userId })
    if (!address) return sendError(res, 'Address not found.', 404)

    const { label, addressLine1, addressLine2, city, state, pincode } = req.body
    if (label        !== undefined) address.label        = label
    if (addressLine1 !== undefined) address.addressLine1 = addressLine1.trim()
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2?.trim()
    if (city         !== undefined) address.city         = city.trim()
    if (state        !== undefined) address.state        = state.trim()
    if (pincode      !== undefined) {
      if (!/^\d{6}$/.test(String(pincode))) return sendError(res, 'Pincode must be 6 digits.', 400)
      address.pincode = String(pincode)
    }

    await address.save()
    return sendSuccess(res, { address }, 'Address updated.')
  } catch (error) { next(error) }
}

// ── DELETE /api/addresses/:id ────────────────
export const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user.userId })
    if (!address) return sendError(res, 'Address not found.', 404)

    const wasDefault = address.isDefault
    await address.deleteOne()

    // If we deleted the default, make the most recent remaining address the new default
    if (wasDefault) {
      const next = await Address.findOne({ user: req.user.userId }).sort({ createdAt: -1 })
      if (next) { next.isDefault = true; await next.save() }
    }

    return sendSuccess(res, {}, 'Address deleted.')
  } catch (error) { next(error) }
}

// ── PATCH /api/addresses/:id/default ─────────
export const setDefaultAddress = async (req, res, next) => {
  try {
    // First un-set all defaults for this user
    await Address.updateMany({ user: req.user.userId }, { isDefault: false })

    // Then set the chosen one as default
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { isDefault: true },
      { new: true }
    )
    if (!address) return sendError(res, 'Address not found.', 404)

    return sendSuccess(res, { address }, 'Default address updated.')
  } catch (error) { next(error) }
}
