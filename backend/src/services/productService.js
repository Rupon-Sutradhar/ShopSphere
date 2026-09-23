const mongoose = require('mongoose');
const Product = require('../models/Product');
const { AppError } = require('../utils/AppError');

class ProductService {
  async getAllProducts({ page = 1, limit = 10, search, category, sort, minPrice, maxPrice }) {
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    let sortOptions = { createdAt: -1 }; // default
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };
    else if (sort === 'oldest') sortOptions = { createdAt: 1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug');

    const total = await Product.countDocuments(filter);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getProductById(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await Product.findById(productId).populate('category', 'name slug');
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async createProduct(productData) {
    const product = await Product.create(productData);
    return await product.populate('category');
  }

  async updateProduct(productId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true
    }).populate('category');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async deleteProduct(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }
}

module.exports = new ProductService();
