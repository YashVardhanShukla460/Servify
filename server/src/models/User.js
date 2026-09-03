/**
 * User Model
 *
 * WHAT: Represents every registered user in Servify.
 *       Customers, Workers, and Admins are ALL stored here.
 *       The `role` field is what differentiates them.
 *
 * WHY one User model for all roles?
 *   - Login and registration logic is the same for all roles
 *   - Authentication (JWT, cookies, password) is shared
 *   - Workers have a SEPARATE Worker document for profile details
 *
 * RELATIONSHIPS:
 *   User (worker) → has one → Worker profile
 *   User (customer) → has many → Bookings
 *   User (customer) → has many → Addresses
 *   User → has many → Notifications
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,          // MongoDB will create a unique index on email
      lowercase: true,       // Always store email in lowercase
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // select: false means password is NOT returned by default in queries
      // You must explicitly ask for it: User.findOne().select('+password')
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ['customer', 'worker', 'admin'],
        message: 'Role must be customer, worker, or admin',
      },
      default: 'customer',
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number'],
    },

    profileImage: {
      type: String,   // Will store a Cloudinary URL (Phase 17)
      default: null,
    },

    // isActive: false means the user has been suspended by admin
    isActive: {
      type: Boolean,
      default: true,
    },

    // Stores a reset token when user requests password reset (future feature)
    passwordResetToken: String,
    passwordResetExpire: Date,
  },
  {
    // timestamps: true automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
)

// ─── Index ───
// email already has a unique index from `unique: true` above
// This makes login (findOne by email) very fast
userSchema.index({ role: 1, isActive: 1 })

// ─── Pre-save Hook: Hash password before saving ───
// WHAT: This runs automatically BEFORE every .save() call
// WHY:  We never store plain-text passwords. bcrypt hashes them.
//
// The `this` keyword refers to the document being saved.
// We only hash if password was modified (prevents re-hashing on profile updates)
// In modern Mongoose, async pre-hooks do NOT use next() — the returned Promise
// signals Mongoose when the hook is complete. Using next() with async causes
// "next is not a function" because Mongoose doesn't pass it for async hooks.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  // Hash the password with bcrypt (12 salt rounds = secure + not too slow)
  // Salt rounds: higher = more secure but slower. 12 is the industry standard.
  this.password = await bcrypt.hash(this.password, 12)
})

// ─── Instance Method: Compare passwords ───
// WHAT: A method available on every User document
// HOW:  const isMatch = await user.comparePassword(enteredPassword)
// WHY:  bcrypt.compare handles the hashing comparison safely
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// ─── Create and export the model ───
// mongoose.model('User', userSchema) creates a 'users' collection in MongoDB
const User = mongoose.model('User', userSchema)
export default User
