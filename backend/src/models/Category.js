/**
 * Category Model
 *
 * Represents a product category in the ShopSphere catalog.
 * Slugs are automatically generated from the category name prior to validation.
 *
 * @module models/Category
 */

const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Pre-validate middleware to automatically generate a URL-friendly slug
 * from the category name using 'slugify' (lowercase, strict mode).
 */
categorySchema.pre('validate', function () {
  if (this.name && (!this.slug || (this.isModified('name') && !this.isModified('slug')))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

/**
 * Virtual populate for products associated with this category.
 */
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
