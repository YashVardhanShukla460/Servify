/**
 * Review Model
 *
 * WHAT: A customer's rating and comment after a completed booking.
 *
 * RULES (enforced at both model and service level):
 *   1. Only customers can write reviews
 *   2. Only after the booking is "completed"
 *   3. Only ONE review per booking (unique index on booking field)
 *   4. After a review is saved, the Worker's average rating is recalculated
 *
 * RELATIONSHIPS:
 *   Review.booking  → Booking._id (unique — one review per booking)
 *   Review.customer → User._id
 *   Review.worker   → Worker._id
 *   Review.service  → Service._id
 */

import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    // The booking this review is for
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Review must be linked to a booking'],
      unique: true, // ONE review per booking — enforced at DB level
    },

    // Who wrote the review
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must have an author'],
    },

    // Who received the review
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: [true, 'Review must be for a worker'],
    },

    // What service was reviewed
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Review must be linked to a service'],
    },

    // Rating: 1 to 5 stars
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },

    // Written feedback
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
)

// ─── Post-save Hook: Update Worker's average rating ───
// WHAT: After a review is saved, recalculate the worker's rating
// WHY:  We want Worker.rating to always reflect the real average
//
// This is a "post" hook — runs AFTER the document is saved successfully
reviewSchema.post('save', async function () {
  try {
    // Import Worker here to avoid circular imports at the top of the file
    const Worker = mongoose.model('Worker')

    // Aggregate: find all reviews for this worker and compute the average
    const stats = await mongoose.model('Review').aggregate([
      { $match: { worker: this.worker } },          // Filter reviews for this worker
      {
        $group: {
          _id: '$worker',
          avgRating: { $avg: '$rating' },            // Calculate average
          count: { $sum: 1 },                        // Count total reviews
        },
      },
    ])

    if (stats.length > 0) {
      await Worker.findByIdAndUpdate(this.worker, {
        rating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
        totalReviews: stats[0].count,
      })
    }
  } catch (err) {
    console.error('[Review] Failed to update worker rating:', err.message)
  }
})

// ─── Indexes ───
// booking already has unique index from the schema definition
reviewSchema.index({ worker: 1, createdAt: -1 })  // Worker's reviews page
reviewSchema.index({ customer: 1 })               // Customer's reviews

const Review = mongoose.model('Review', reviewSchema)
export default Review
