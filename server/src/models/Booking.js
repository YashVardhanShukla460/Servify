/**
 * Booking Model
 *
 * WHAT: The core transaction in Servify.
 *       Records who booked whom, for what service, when, where, and for how much.
 *
 * STATUS FLOW (valid transitions only):
 *
 *   pending   → accepted   (worker accepts)
 *   pending   → rejected   (worker rejects)
 *   pending   → cancelled  (customer cancels before acceptance)
 *   accepted  → in_progress (worker starts the job)
 *   accepted  → cancelled   (customer or worker cancels)
 *   in_progress → completed (worker marks done)
 *
 * IMPORTANT: Invalid transitions are rejected at the service layer (Phase 11).
 * e.g. cannot go from completed → cancelled
 *
 * RELATIONSHIPS:
 *   Booking.customer → User._id
 *   Booking.worker   → Worker._id
 *   Booking.service  → Service._id
 *   Booking.address  → Address._id
 *   Booking.review   → Review._id (set after review is submitted)
 */

import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must have a customer'],
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: [true, 'Booking must have a worker'],
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Booking must have a service'],
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: [true, 'Booking must have a service address'],
    },

    // Date of service (stored as Date, time is in startTime/endTime)
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },

    // Times stored as "HH:MM" strings for simplicity
    // e.g. "14:00" means 2:00 PM
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'],
    },

    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'],
    },

    // Price agreed at time of booking
    // WHY store this separately?
    // Worker might change their pricing later. We preserve the original agreed price.
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // Booking lifecycle status
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'cancelled', 'in_progress', 'completed'],
        message: 'Invalid booking status',
      },
      default: 'pending',
    },

    // Payment lifecycle status
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed', 'refunded'],
        message: 'Invalid payment status',
      },
      default: 'pending',
    },

    // Optional notes from customer (e.g. "Please bring your own tools")
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },

    // Who cancelled and why (for audit trail)
    cancelledBy: {
      type: String,
      enum: ['customer', 'worker', 'admin'],
    },
    cancelReason: {
      type: String,
      trim: true,
      maxlength: [300, 'Cancel reason cannot exceed 300 characters'],
    },

    // Set after customer submits a review
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      default: null,
    },

    // Payment transaction ID (Phase 19)
    paymentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// ─── Indexes ───
bookingSchema.index({ customer: 1, status: 1 })     // Customer dashboard queries
bookingSchema.index({ worker: 1, status: 1 })        // Worker dashboard queries
bookingSchema.index({ worker: 1, date: 1, status: 1 }) // Conflict detection (CRITICAL)
bookingSchema.index({ date: 1 })                     // Date-based queries
bookingSchema.index({ status: 1, createdAt: -1 })    // Admin dashboard

const Booking = mongoose.model('Booking', bookingSchema)
export default Booking
