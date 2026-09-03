/**
 * Service Controller
 *
 * Public routes:
 *   GET /api/services               - browse with search, filter, sort, paginate
 *   GET /api/services/featured      - featured services for homepage
 *   GET /api/services/:id           - single service detail
 *
 * Admin routes:
 *   POST  /api/services             - create service
 *   PATCH /api/services/:id         - update service
 */

import Service  from '../models/Service.js'
import Category from '../models/Category.js'
import { sendSuccess, sendError } from '../utils/response.js'

// ─────────────────────────────────────────────
// GET /api/services — Public (browse, search, filter, sort, paginate)
//
// Supported query params:
//   search     — text search on name/description
//   category   — filter by category ObjectId
//   minPrice   — filter price >= minPrice
//   maxPrice   — filter price <= maxPrice
//   isFeatured — true/false
//   sort       — price_asc | price_desc | newest | name_asc
//   page       — page number (default: 1)
//   limit      — results per page (default: 12, max: 50)
// ─────────────────────────────────────────────
export const getServices = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      isFeatured,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query

    // ── Build the filter object ──
    // We start with isActive: true (customers only see active services)
    const filter = { isActive: true }

    // Text search across name and description
    // Uses the text index we created on the Service schema
    if (search?.trim()) {
      filter.$text = { $search: search.trim() }
    }

    // Filter by category
    if (category) {
      filter.category = category
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.basePrice = {}
      if (minPrice !== undefined) filter.basePrice.$gte = Number(minPrice)
      if (maxPrice !== undefined) filter.basePrice.$lte = Number(maxPrice)
    }

    // Featured services only
    if (isFeatured === 'true') {
      filter.isFeatured = true
    }

    // ── Build the sort object ──
    // MongoDB sort: 1 = ascending, -1 = descending
    const sortOptions = {
      price_asc:  { basePrice:  1 },
      price_desc: { basePrice: -1 },
      name_asc:   { name:       1 },
      newest:     { createdAt: -1 },
    }
    const sortBy = sortOptions[sort] || sortOptions.newest

    // ── Pagination ──
    // WHAT is pagination?
    //   Instead of returning 1000 services at once, we return 12 at a time.
    //   "skip" tells MongoDB how many to skip (page 2 skips the first 12).
    const pageNum  = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
    const skip     = (pageNum - 1) * limitNum

    // ── Run the query ──
    // Run count and data queries in PARALLEL for performance
    const [services, total] = await Promise.all([
      Service.find(filter)
        .populate('category', 'name icon')  // Join category name and icon
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Service.countDocuments(filter),
    ])

    return sendSuccess(res, {
      services,
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
// GET /api/services/featured — Public
// Returns featured services for the homepage
// ─────────────────────────────────────────────
export const getFeaturedServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true, isFeatured: true })
      .populate('category', 'name icon')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()

    return sendSuccess(res, { services, count: services.length })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// GET /api/services/:id — Public
// ─────────────────────────────────────────────
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('category', 'name icon description')
      .lean()

    if (!service) {
      return sendError(res, 'Service not found.', 404)
    }

    if (!service.isActive) {
      return sendError(res, 'This service is no longer available.', 404)
    }

    return sendSuccess(res, { service })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// POST /api/services — Admin only
// ─────────────────────────────────────────────
export const createService = async (req, res, next) => {
  try {
    const { name, description, category, basePrice, duration, image, isFeatured, includes } = req.body

    // Validate required fields
    if (!name?.trim()) return sendError(res, 'Service name is required.', 400)
    if (!category)     return sendError(res, 'Category is required.', 400)
    if (basePrice === undefined || basePrice < 0)
      return sendError(res, 'A valid base price is required.', 400)

    // Verify the category exists and is active
    const categoryDoc = await Category.findById(category)
    if (!categoryDoc || !categoryDoc.isActive) {
      return sendError(res, 'Invalid or inactive category.', 400)
    }

    const service = await Service.create({
      name:        name.trim(),
      description: description?.trim(),
      category,
      basePrice:   Number(basePrice),
      duration:    duration ? Number(duration) : 60,
      image:       image?.trim(),
      isFeatured:  isFeatured === true || isFeatured === 'true',
      includes:    Array.isArray(includes) ? includes : [],
    })

    const populated = await service.populate('category', 'name icon')

    return sendSuccess(res, { service: populated }, 'Service created successfully.', 201)
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// PATCH /api/services/:id — Admin only
// ─────────────────────────────────────────────
export const updateService = async (req, res, next) => {
  try {
    const { name, description, category, basePrice, duration, image, isActive, isFeatured, includes } = req.body

    const service = await Service.findById(req.params.id)
    if (!service) return sendError(res, 'Service not found.', 404)

    if (name        !== undefined) service.name        = name.trim()
    if (description !== undefined) service.description = description.trim()
    if (category    !== undefined) service.category    = category
    if (basePrice   !== undefined) service.basePrice   = Number(basePrice)
    if (duration    !== undefined) service.duration    = Number(duration)
    if (image       !== undefined) service.image       = image
    if (isActive    !== undefined) service.isActive    = isActive
    if (isFeatured  !== undefined) service.isFeatured  = isFeatured
    if (includes    !== undefined) service.includes    = includes

    await service.save()
    await service.populate('category', 'name icon')

    return sendSuccess(res, { service }, 'Service updated successfully.')
  } catch (error) {
    next(error)
  }
}
