/**
 * Product Model
 *
 * Represents an item available for purchase in the ShopSphere catalog.
 * Supports categorization, inventory tracking, Cloudinary image references,
 * rating summaries, and indexed queries for price, category, and featured status.
 *
 * @module models/Product
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: [true, 'Image URL is required'],
        },
        public_id: {
          type: String,
        },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, 'Number of reviews cannot be negative'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for query performance (filtering, sorting, and featured catalog queries)
productSchema.index({ price: 1, category: 1, isFeatured: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
