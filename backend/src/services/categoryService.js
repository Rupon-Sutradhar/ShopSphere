/**
 * Category Service
 *
 * Handles database operations and business logic for product categories,
 * including slug generation, duplicate detection, and integrity checks
 * preventing deletion of categories associated with active products.
 *
 * @module services/categoryService
 */

const mongoose = require('mongoose');
const slugify = require('slugify');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { AppError } = require('../utils/AppError');

class CategoryService {
  /**
   * Retrieve all categories sorted by name ascending.
   *
   * @returns {Promise<Array>} Array of category documents.
   */
  async getAllCategories() {
    const categories = await Category.find().sort({ name: 1 });
    return categories;
  }

  /**
   * Retrieve a single category by its ID.
   *
   * @param {string} categoryId - MongoDB ObjectId string.
   * @returns {Promise<Object>} The found category document.
   * @throws {AppError} 400 if ID is invalid, 404 if not found.
   */
  async getCategoryById(categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new AppError('Invalid category ID', 400);
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  /**
   * Create a new category after ensuring name uniqueness (case-insensitive).
   *
   * @param {Object} categoryData
   * @param {string} categoryData.name - Category display name.
   * @returns {Promise<Object>} Newly created category document.
   * @throws {AppError} 409 if category name already exists.
   */
  async createCategory({ name }) {
    const trimmedName = name.trim();
    const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') },
    });

    if (existingCategory) {
      throw new AppError('Category already exists', 409);
    }

    const category = await Category.create({ name: trimmedName });
    return category;
  }

  /**
   * Update a category by ID, ensuring uniqueness among other categories.
   *
   * @param {string} categoryId - MongoDB ObjectId string.
   * @param {Object} updateData
   * @param {string} updateData.name - Updated category name.
   * @returns {Promise<Object>} Updated category document.
   * @throws {AppError} 400 if invalid ID, 409 if duplicate name, 404 if not found.
   */
  async updateCategory(categoryId, { name }) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new AppError('Invalid category ID', 400);
    }

    const updateFields = {};

    if (name !== undefined) {
      const trimmedName = name.trim();
      const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${escapedName}$`, 'i') },
        _id: { $ne: categoryId },
      });

      if (existingCategory) {
        throw new AppError('Category already exists', 409);
      }

      updateFields.name = trimmedName;
      updateFields.slug = slugify(trimmedName, { lower: true, strict: true });
    }

    const category = await Category.findByIdAndUpdate(categoryId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  /**
   * Delete a category by ID after verifying no products reference it.
   *
   * @param {string} categoryId - MongoDB ObjectId string.
   * @returns {Promise<Object>} The deleted category document.
   * @throws {AppError} 400 if invalid ID or products exist, 404 if not found.
   */
  async deleteCategory(categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new AppError('Invalid category ID', 400);
    }

    const productCount = await Product.countDocuments({ category: categoryId });
    if (productCount > 0) {
      throw new AppError(
        'Cannot delete category with existing products. Remove or reassign products first.',
        400
      );
    }

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }
}

module.exports = new CategoryService();
