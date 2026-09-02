/**
 * Category Model
 *
 * WHAT: Broad groupings of services.
 *       Example categories: Cleaning, Electrical, Plumbing, Beauty
 *
 * RELATIONSHIPS:
 *   Category → has many → Services
 *   (Service.category references Category._id)
 */

import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },

    // Icon identifier — can be an emoji, icon class name, or image URL
    icon: {
      type: String,
      trim: true,
    },

    // Image for the category card (URL, Cloudinary in Phase 17)
    image: {
      type: String,
      default: null,
    },

    // isActive: false = hidden from customers (soft delete)
    // Admin can disable a category without losing data
    isActive: {
      type: Boolean,
      default: true,
    },

    // Display order on the homepage
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

categorySchema.index({ isActive: 1, sortOrder: 1 })

const Category = mongoose.model('Category', categorySchema)
export default Category
