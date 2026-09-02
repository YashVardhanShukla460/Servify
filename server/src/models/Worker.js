/**
 * Worker Model
 *
 * WHAT: Extended profile for users with role = "worker".
 *       Every worker has ONE User document + ONE Worker document.
 *
 * WHY keep this separate from User?
 *   - Worker profiles are large and complex (availability, pricing, skills...)
 *   - Customers don't need any of these fields
 *   - Keeps the User model clean and simple
 *   - Admin can query workers independently
 *
 * RELATIONSHIPS:
 *   Worker.user  → references User._id  (the worker's login account)
 *   Worker.services → references Service._id (services they offer)
 */

import mongoose from 'mongoose'

// ─── Sub-schemas (embedded objects) ───

// A single time slot: e.g. { start: "09:00", end: "13:00" }
const timeSlotSchema = new mongoose.Schema(
  {
    start: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format (e.g. 09:00)'],
    },
    end: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format (e.g. 17:00)'],
    },
  },
  { _id: false } // Don't create an _id for each time slot
)

// One day's availability: isAvailable true/false + list of time slots
const dayAvailabilitySchema = new mongoose.Schema(
  {
    isAvailable: { type: Boolean, default: false },
    slots: [timeSlotSchema],
  },
  { _id: false }
)

// Pricing for a specific service
const pricingSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    // unit: "per hour", "per visit", "per session", etc.
    unit: {
      type: String,
      default: 'per visit',
      trim: true,
    },
  },
  { _id: false }
)

// ─── Main Worker Schema ───
const workerSchema = new mongoose.Schema(
  {
    // Reference to the User document (the worker's login account)
    // This is how we "join" Worker + User data
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Worker must be linked to a user account'],
      unique: true, // One worker profile per user
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },

    // Years of experience
    experience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience seems too high'],
      default: 0,
    },

    skills: {
      type: [String], // Array of strings e.g. ["plumbing", "pipe fitting"]
      default: [],
    },

    // Which services this worker offers (references to Service documents)
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],

    // Price the worker charges per service
    pricing: [pricingSchema],

    // Cities/areas where the worker is available
    // e.g. ["Noida", "Greater Noida", "Delhi NCR"]
    serviceAreas: {
      type: [String],
      default: [],
    },

    // Weekly availability schedule
    // WHY embedded? Availability is always loaded with the worker.
    // We never query availability independently.
    availability: {
      monday:    { type: dayAvailabilitySchema, default: () => ({ isAvailable: false, slots: [] }) },
      tuesday:   { type: dayAvailabilitySchema, default: () => ({ isAvailable: false, slots: [] }) },
      wednesday: { type: dayAvailabilitySchema, default: () => ({ isAvailable: false, slots: [] }) },
      thursday:  { type: dayAvailabilitySchema, default: () => ({ isAvailable: false, slots: [] }) },
      friday:    { type: dayAvailabilitySchema, default: () => ({ isAvailable: false, slots: [] }) },
      saturday:  { type: dayAvailabilitySchema, default: () => ({ isAvailable: false, slots: [] }) },
      sunday:    { type: dayAvailabilitySchema, default: () => ({ isAvailable: false, slots: [] }) },
    },

    // Calculated from reviews — updated whenever a new review is added
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    profileImage: {
      type: String, // Cloudinary URL (Phase 17)
      default: null,
    },

    // Admin approval status — CRITICAL for the worker onboarding flow
    // New workers start as 'pending'. Admin must approve before they get bookings.
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'suspended'],
        message: 'Status must be pending, approved, rejected, or suspended',
      },
      default: 'pending',
    },

    // Reason if rejected or suspended (so worker knows why)
    statusReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// ─── Indexes ───
workerSchema.index({ user: 1 })               // Fast lookup by user ID
workerSchema.index({ status: 1 })             // Admin queries pending workers
workerSchema.index({ rating: -1 })            // Sort by rating (descending)
workerSchema.index({ serviceAreas: 1 })       // Filter by location
workerSchema.index({ services: 1 })           // Filter by service type

const Worker = mongoose.model('Worker', workerSchema)
export default Worker
