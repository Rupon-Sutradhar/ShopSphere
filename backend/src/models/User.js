/**
 * User Model
 *
 * Represents an authenticated user (customer or admin) in the ShopSphere platform.
 * Handles credential hashing via bcryptjs and role-based permissions.
 *
 * @module models/User
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Pre-save middleware to automatically hash the user password
 * before saving to the database, only when the password has been modified.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

/**
 * Compares a candidate plain-text password with the hashed password stored in the database.
 * Note: If querying a user for authentication, ensure password is explicitly selected via .select('+password').
 *
 * @param {string} candidatePassword - The plain-text password to compare.
 * @returns {Promise<boolean>} True if the candidate password matches the hashed password, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
