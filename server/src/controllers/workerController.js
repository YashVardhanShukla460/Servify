/**
 * Worker Controller
 *
 * Public routes (anyone):
 *   GET /api/workers          — browse approved workers with filters
 *   GET /api/workers/:id      — full public profile for a single worker
 *
 * Private routes (worker only):
 *   GET   /api/workers/me               — view own profile
 *   PATCH /api/workers/me               — update bio, skills, areas
 *   PATCH /api/workers/me/availability  — update weekly schedule
 *   PATCH /api/workers/me/pricing       — update pricing for each service
 *   PATCH /api/workers/me/services      — add/remove services offered
 */

import Worker from '../models/Worker.js'
import User   from '../models/User.js'
import Review from '../models/Review.js'
import { sendSuccess, sendError } from '../utils/response.js'

// ─────────────────────────────────────────────
// GET /api/workers  — Public
// Browse approved workers with optional filters
//
// Query params:
//   service    — filter by Service ObjectId
//   area       — filter by service area string (case-insensitive)
//   minRating  — minimum rating (e.g. 4)
//   sort       — rating_desc (default) | newest | price_asc
//   page, limit
// ─────────────────────────────────────────────
export const getWorkers = async (req, res, next) => {
  try {
    const {
      service,
      area,
      minRating,
      sort  = 'rating_desc',
      page  = 1,
      limit = 12,
    } = req.query

    // Only show approved workers to the public
    const filter = { status: 'approved' }

    if (service) {
      filter.services = service  // MongoDB: checks if service ID is in the array
    }

    if (area?.trim()) {
      // Case-insensitive partial match on the serviceAreas array
      filter.serviceAreas = { $regex: area.trim(), $options: 'i' }
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) }
    }

    // Sort options
    const sortMap = {
      rating_desc: { rating: -1, totalReviews: -1 },
      newest:      { createdAt: -1 },
      price_asc:   { 'pricing.0.price': 1 },  // Sort by first pricing entry
    }
    const sortBy = sortMap[sort] || sortMap.rating_desc

    const pageNum  = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
    const skip     = (pageNum - 1) * limitNum

    const [workers, total] = await Promise.all([
      Worker.find(filter)
        .populate('user', 'name profileImage')         // Join user: name + avatar
        .populate('services', 'name category basePrice') // Join services
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Worker.countDocuments(filter),
    ])

    return sendSuccess(res, {
      workers,
      pagination: {
        total,
        page:       pageNum,
        limit:      limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext:    pageNum < Math.ceil(total / limitNum),
        hasPrev:    pageNum > 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// GET /api/workers/me  — Worker (private)
// Worker views their own full profile
// ─────────────────────────────────────────────
export const getMyWorkerProfile = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ user: req.user.userId })
      .populate('user',     'name email phone profileImage')
      .populate('services', 'name category basePrice duration')
      .populate({ path: 'pricing.service', select: 'name' })

    if (!worker) {
      return sendError(res, 'Worker profile not found.', 404)
    }

    return sendSuccess(res, { worker })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// GET /api/workers/:id  — Public
// Full public worker profile (for the worker profile page)
// ─────────────────────────────────────────────
export const getWorkerById = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('user',     'name profileImage createdAt')
      .populate({
        path:     'services',
        select:   'name description basePrice duration includes',
        populate: { path: 'category', select: 'name icon' },
      })
      .populate({ path: 'pricing.service', select: 'name' })
      .lean()

    if (!worker) {
      return sendError(res, 'Worker not found.', 404)
    }

    if (worker.status !== 'approved') {
      return sendError(res, 'This worker profile is not available.', 404)
    }

    // Fetch the worker's recent reviews (last 10)
    const reviews = await Review.find({ worker: worker._id })
      .populate('customer', 'name profileImage')
      .populate('service',  'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    return sendSuccess(res, { worker, reviews })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// PATCH /api/workers/me  — Worker (private)
// Update bio, experience, skills, service areas
// ─────────────────────────────────────────────
export const updateMyProfile = async (req, res, next) => {
  try {
    const { bio, experience, skills, serviceAreas } = req.body

    const worker = await Worker.findOne({ user: req.user.userId })
    if (!worker) return sendError(res, 'Worker profile not found.', 404)

    if (bio          !== undefined) worker.bio          = bio.trim()
    if (experience   !== undefined) worker.experience   = Number(experience)
    if (skills       !== undefined) worker.skills       = Array.isArray(skills) ? skills : []
    if (serviceAreas !== undefined) worker.serviceAreas = Array.isArray(serviceAreas) ? serviceAreas : []

    await worker.save()
    await worker.populate('user', 'name email phone profileImage')
    await worker.populate('services', 'name category basePrice')

    return sendSuccess(res, { worker }, 'Profile updated successfully.')
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// PATCH /api/workers/me/services  — Worker (private)
// Add or remove services the worker offers
// Body: { serviceIds: ['id1', 'id2', ...] }
// ─────────────────────────────────────────────
export const updateMyServices = async (req, res, next) => {
  try {
    const { serviceIds } = req.body

    if (!Array.isArray(serviceIds)) {
      return sendError(res, 'serviceIds must be an array of Service IDs.', 400)
    }

    const worker = await Worker.findOne({ user: req.user.userId })
    if (!worker) return sendError(res, 'Worker profile not found.', 404)

    worker.services = serviceIds
    await worker.save()

    return sendSuccess(res, { services: worker.services }, 'Services updated.')
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// PATCH /api/workers/me/availability  — Worker (private)
// Update weekly availability schedule
//
// Body example:
// {
//   monday:    { isAvailable: true,  slots: [{ start: "09:00", end: "17:00" }] },
//   tuesday:   { isAvailable: false, slots: [] },
//   ...
// }
// ─────────────────────────────────────────────
export const updateMyAvailability = async (req, res, next) => {
  try {
    const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

    const worker = await Worker.findOne({ user: req.user.userId })
    if (!worker) return sendError(res, 'Worker profile not found.', 404)

    // Only update days that were included in the request
    for (const day of days) {
      if (req.body[day] !== undefined) {
        const { isAvailable, slots } = req.body[day]

        // Validate slot format
        if (isAvailable && Array.isArray(slots)) {
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
          for (const slot of slots) {
            if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
              return sendError(res, `Invalid time format in ${day} slots. Use HH:MM.`, 400)
            }
            if (slot.start >= slot.end) {
              return sendError(res, `In ${day}: start time must be before end time.`, 400)
            }
          }
        }

        worker.availability[day] = {
          isAvailable: Boolean(isAvailable),
          slots: isAvailable && Array.isArray(slots) ? slots : [],
        }
      }
    }

    await worker.save()
    return sendSuccess(res, { availability: worker.availability }, 'Availability updated.')
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// PATCH /api/workers/me/pricing  — Worker (private)
// Update pricing for each service the worker offers
//
// Body: { pricing: [{ service: 'id', price: 799, unit: 'per visit' }] }
// ─────────────────────────────────────────────
export const updateMyPricing = async (req, res, next) => {
  try {
    const { pricing } = req.body

    if (!Array.isArray(pricing)) {
      return sendError(res, 'pricing must be an array.', 400)
    }

    // Validate each pricing entry
    for (const p of pricing) {
      if (!p.service)     return sendError(res, 'Each pricing entry needs a service ID.', 400)
      if (p.price < 0)    return sendError(res, 'Price cannot be negative.', 400)
    }

    const worker = await Worker.findOne({ user: req.user.userId })
    if (!worker) return sendError(res, 'Worker profile not found.', 404)

    worker.pricing = pricing
    await worker.save()

    return sendSuccess(res, { pricing: worker.pricing }, 'Pricing updated.')
  } catch (error) {
    next(error)
  }
}
