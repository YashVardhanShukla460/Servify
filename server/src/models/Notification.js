/**
 * Notification Model
 *
 * WHAT: In-app notifications stored in the database.
 *       Examples:
 *         Customer: "Your booking was accepted by Raj"
 *         Worker:   "You have a new booking request"
 *         Admin:    "A new worker has registered and is awaiting approval"
 *
 * WHY database notifications (not Socket.IO yet)?
 *   Socket.IO requires a persistent connection and more infrastructure.
 *   Database notifications are simpler and work even if the user is offline —
 *   they see their notifications when they log in next.
 *   We can add Socket.IO real-time delivery in Phase 20.
 *
 * RELATIONSHIPS:
 *   Notification.recipient → User._id
 */

import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    // Who receives this notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must have a recipient'],
    },

    // Machine-readable type (for filtering and icons in the UI)
    // e.g. 'booking_accepted', 'booking_rejected', 'new_booking', 'worker_approved'
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: [
        'booking_created',
        'booking_accepted',
        'booking_rejected',
        'booking_cancelled',
        'booking_completed',
        'worker_approved',
        'worker_rejected',
        'new_review',
        'payment_received',
        'general',
      ],
    },

    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },

    // Has the user seen this notification?
    isRead: {
      type: Boolean,
      default: false,
    },

    // Optional: link to the related resource
    // e.g. the booking ID so we can link to /bookings/:id
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // The collection the relatedId refers to
    relatedModel: {
      type: String,
      enum: ['Booking', 'Worker', 'Review', 'Payment', null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// ─── Indexes ───
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 })
// TTL index: automatically delete notifications older than 90 days
// This prevents the notifications collection from growing forever
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }) // 90 days

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
