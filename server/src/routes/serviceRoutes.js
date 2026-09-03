/**
 * Service Routes
 *
 * Public:  GET /api/services           - browse/search/filter/sort/paginate
 *          GET /api/services/featured  - featured services
 *          GET /api/services/:id       - single service
 *
 * Admin:   POST  /api/services         - create
 *          PATCH /api/services/:id     - update
 */

import express from 'express'
import {
  getServices,
  getFeaturedServices,
  getServiceById,
  createService,
  updateService,
} from '../controllers/serviceController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Public routes — specific paths BEFORE /:id
router.get('/featured', getFeaturedServices)
router.get('/',         getServices)
router.get('/:id',      getServiceById)

// Admin routes
router.post('/',     requireAuth, requireRole('admin'), createService)
router.patch('/:id', requireAuth, requireRole('admin'), updateService)

export default router
