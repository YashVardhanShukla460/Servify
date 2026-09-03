import express from 'express'
import {
  createBooking, getCustomerBookings, getWorkerBookings, updateBookingStatus
} from '../controllers/bookingController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth)

// Customer routes
router.post('/', requireRole('customer'), createBooking)
router.get('/customer', requireRole('customer'), getCustomerBookings)

// Worker routes
router.get('/worker', requireRole('worker'), getWorkerBookings)

// Shared route (permissions handled in controller)
router.patch('/:id/status', updateBookingStatus)

export default router
