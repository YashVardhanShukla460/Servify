import express from 'express'
import { createReview, getWorkerReviews } from '../controllers/reviewController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Public route to view reviews
router.get('/worker/:workerId', getWorkerReviews)

// Protected route to create review
router.post('/', requireAuth, requireRole('customer'), createReview)

export default router
