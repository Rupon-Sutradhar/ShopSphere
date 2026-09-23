const productService = require('../services/productService');
const { AppError } = require('../utils/AppError');

exports.getProducts = async (req, res, next) => {
  try {
    const { page, limit, search, category, sort, minPrice, maxPrice } = req.query;

    const queryParams = {
      search,
      category,
      sort
    };

    if (page) {
      const parsedPage = parseInt(page, 10);
      if (!Number.isNaN(parsedPage)) queryParams.page = parsedPage;
    }

    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!Number.isNaN(parsedLimit)) queryParams.limit = parsedLimit;
    }

    if (minPrice !== undefined) {
      const parsedMinPrice = parseFloat(minPrice);
      if (!Number.isNaN(parsedMinPrice)) queryParams.minPrice = parsedMinPrice;
    }

    if (maxPrice !== undefined) {
      const parsedMaxPrice = parseFloat(maxPrice);
      if (!Number.isNaN(parsedMaxPrice)) queryParams.maxPrice = parsedMaxPrice;
    }

    const { products, pagination } = await productService.getAllProducts(queryParams);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    res.status(200).json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, stock, images, isFeatured } = req.body;

    if (!title || !description || price === undefined || !category) {
      throw new AppError('Missing required fields: title, description, price, category', 400);
    }

    if (price < 0) {
      throw new AppError('Price cannot be negative', 400);
    }

    if (stock !== undefined && stock < 0) {
      throw new AppError('Stock cannot be negative', 400);
    }

    const productData = { title, description, price, category, stock, images, isFeatured };
    const product = await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.price !== undefined && updateData.price < 0) {
      throw new AppError('Price cannot be negative', 400);
    }

    if (updateData.stock !== undefined && updateData.stock < 0) {
      throw new AppError('Stock cannot be negative', 400);
    }

    const product = await productService.updateProduct(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
