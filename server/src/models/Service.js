/**
 * Service Model
 *
 * WHAT: A specific service a customer can book.
 *       Example: "Deep Home Cleaning" (under Cleaning category)
 *                "Fan Installation" (under Electrical category)
 *
 * RELATIONSHIPS:
 *   Service.category → references Category._id
 *   Service is referenced by: Worker.services, Booking.service, Review.service
 */

import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema(
  {
    // Which category this service belongs to
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Service must belong to a category'],
    },

    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      maxlength: [100, 'Service name cannot exceed 100 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    // Starting price — workers set their own prices (Worker.pricing)
    // This is a reference/display price shown on the browse page
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // Estimated duration in minutes
    // e.g. Deep Cleaning = 180 minutes (3 hours)
    duration: {
      type: Number,
      min: [15, 'Duration must be at least 15 minutes'],
      default: 60,
    },

    // Image for the service card (Cloudinary URL, Phase 17)
    image: {
      type: String,
      default: null,
    },

    // isActive: false = hidden from customers
    isActive: {
      type: Boolean,
      default: true,
    },

    // isFeatured: true = shown in featured section on homepage
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // What is included in this service (bullet points)
    // e.g. ["Kitchen cleaning", "Bathroom cleaning", "Living room vacuuming"]
    includes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    // Add virtual fields when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ─── Indexes for search/filter performance ───
serviceSchema.index({ category: 1, isActive: 1 })
serviceSchema.index({ isActive: 1, isFeatured: 1 })
serviceSchema.index({ basePrice: 1 })
// Text index: allows full-text search on name and description
// Used for: GET /api/services?search=cleaning
serviceSchema.index({ name: 'text', description: 'text' })

const Service = mongoose.model('Service', serviceSchema)
export default Service
