import Review from '../models/Review.js'
import Booking from '../models/Booking.js'
import { sendSuccess, sendError } from '../utils/response.js'

// ── CREATE REVIEW ─────────────────────────────
export const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body
    const customerId = req.user.userId

    if (!rating || rating < 1 || rating > 5) {
      return sendError(res, 'Please provide a valid rating between 1 and 5.', 400)
    }

    // 1. Verify the booking
    const booking = await Booking.findById(bookingId)
    if (!booking) return sendError(res, 'Booking not found.', 404)
    if (booking.customer.toString() !== customerId) return sendError(res, 'Unauthorized.', 403)
    if (booking.status !== 'completed') return sendError(res, 'You can only review completed bookings.', 400)

    // 2. Check if already reviewed
    const existingReview = await Review.findOne({ booking: bookingId })
    if (existingReview) {
      return sendError(res, 'You have already reviewed this booking.', 400)
    }

    // 3. Create review (Mongoose post-save hook will update Worker rating)
    const review = await Review.create({
      booking: bookingId,
      worker: booking.worker,
      customer: customerId,
      rating,
      comment: comment?.trim()
    })

    return sendSuccess(res, { review }, 'Review submitted successfully.', 201)
  } catch (error) { next(error) }
}

// ── GET WORKER REVIEWS ────────────────────────
export const getWorkerReviews = async (req, res, next) => {
  try {
    const { workerId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const reviews = await Review.find({ worker: workerId })
      .populate('customer', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Review.countDocuments({ worker: workerId })

    return sendSuccess(res, {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) { next(error) }
}
