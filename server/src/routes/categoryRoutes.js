/**
 * Category Routes
 *
 * Public:  GET /api/categories        - list active categories
 *          GET /api/categories/:id    - single category
 *
 * Admin:   GET    /api/categories/admin/all  - all (including inactive)
 *          POST   /api/categories             - create
 *          PATCH  /api/categories/:id         - update
 */

import express from 'express'
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  getAllCategoriesAdmin,
} from '../controllers/categoryController.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/',    getCategories)

// Admin-only route — MUST be before /:id so it doesn't get swallowed by the param route
router.get('/admin/all', requireAuth, requireRole('admin'), getAllCategoriesAdmin)

router.get('/:id', getCategoryById)

// Admin routes
router.post('/',     requireAuth, requireRole('admin'), createCategory)
router.patch('/:id', requireAuth, requireRole('admin'), updateCategory)

export default router
