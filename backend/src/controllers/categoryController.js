/**
 * Category Controller
 *
 * Handles HTTP requests and response orchestration for category management.
 * Dispatches business logic to categoryService and handles errors via centralised middleware.
 *
 * @module controllers/categoryController
 */

const categoryService = require('../services/categoryService');
const { AppError } = require('../utils/AppError');

/**
 * Get all categories sorted alphabetically.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single category by ID.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
exports.getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    res.status(200).json({
      success: true,
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new category.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || (typeof name === 'string' && !name.trim())) {
      throw new AppError('Category name is required', 400);
    }

    const category = await categoryService.createCategory({ name });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing category by ID.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || (typeof name === 'string' && !name.trim())) {
      throw new AppError('Category name is required', 400);
    }

    const category = await categoryService.updateCategory(id, { name });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a category by ID.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
