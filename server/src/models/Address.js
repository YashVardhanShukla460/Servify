/**
 * Address Model
 *
 * WHAT: Saved addresses belonging to a customer.
 *       When booking, the customer picks one of their saved addresses.
 *
 * RELATIONSHIPS:
 *   Address.user → references User._id
 *   Booking.address → references Address._id
 */

import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    // Owner of this address
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Address must belong to a user'],
    },

    // Label for easy identification: "Home", "Office", "Parents' House"
    label: {
      type: String,
      trim: true,
      maxlength: [30, 'Label cannot exceed 30 characters'],
      default: 'Home',
    },

    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      trim: true,
      maxlength: [200, 'Address line 1 cannot exceed 200 characters'],
    },

    addressLine2: {
      type: String,
      trim: true,
      maxlength: [200, 'Address line 2 cannot exceed 200 characters'],
    },

    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },

    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },

    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode'],
    },

    // Only one address can be the default at a time
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Fast lookup of all addresses for a user
addressSchema.index({ user: 1 })

const Address = mongoose.model('Address', addressSchema)
export default Address
