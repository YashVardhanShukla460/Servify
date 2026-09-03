/**
 * Worker Routes
 *
 * Public:
 *   GET /api/workers          - browse approved workers
 *   GET /api/workers/:id      - public profile
 *
 * Private (worker role):
 *   GET   /api/workers/me                  - own profile
 *   PATCH /api/workers/me                  - update profile
 *   PATCH /api/workers/me/services         - set services offered
 *   PATCH /api/workers/me/availability     - set weekly schedule
 *   PATCH /api/workers/me/pricing          - set pricing per service
 *
 * IMPORTANT: /me routes MUST come before /:id
 * Otherwise Express treats "me" as an ID parameter.
 */

import express from 'express'
import {
  getWorkers,
  getWorkerById,
  getMyWorkerProfile,
  updateMyProfile,
  updateMyServices,
  updateMyAvailability,
  updateMyPricing,
  getPendingWorkers,
  updateWorkerStatus
} from '../controllers/workerController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Admin routes (must be BEFORE /:id to avoid param conflict)
router.get('/admin/pending', requireAuth, requireRole('admin'), getPendingWorkers)
router.patch('/admin/:id/status', requireAuth, requireRole('admin'), updateWorkerStatus)

// ── Public routes ──
router.get('/', getWorkers)

// ── Private worker routes (MUST be before /:id) ──
router.get('/me', requireAuth, requireRole('worker'), getMyWorkerProfile)
router.patch('/me', requireAuth, requireRole('worker'), updateMyProfile)
router.patch('/me/services', requireAuth, requireRole('worker'), updateMyServices)
router.patch('/me/availability', requireAuth, requireRole('worker'), updateMyAvailability)
router.patch('/me/pricing', requireAuth, requireRole('worker'), updateMyPricing)

// ── Public param route (MUST be after /me routes) ──
router.get('/:id', getWorkerById)

export default router
