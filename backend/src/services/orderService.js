const Order = require('../models/Order');
const Product = require('../models/Product');
const { AppError } = require('../utils/AppError');

const createOrder = async (userId, items, shippingAddress) => {
  if (!items || items.length === 0) {
    throw new AppError('No order items provided', 400);
  }

  const itemIds = items.map(item => item.product);
  const products = await Product.find({ _id: { $in: itemIds } });

  if (products.length !== itemIds.length) {
    throw new AppError('One or more products not found', 404);
  }

  const productMap = {};
  products.forEach(p => {
    productMap[p._id.toString()] = p;
  });

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = productMap[item.product.toString()];
    
    if (product.stock < item.qty) {
      throw new AppError(`Not enough stock for product ${product.name || item.product}`, 400);
    }

    subtotal += product.price * item.qty;
    
    orderItems.push({
      product: product._id,
      name: product.name,
      qty: item.qty,
      image: item.image || product.image,
      price: product.price, // Using DB price, ignoring frontend price
    });
  }

  const tax = Number((0.08 * subtotal).toFixed(2));
  const shippingPrice = subtotal > 50 ? 0 : 10;
  const totalPrice = Number((subtotal + tax + shippingPrice).toFixed(2));

  const order = new Order({
    user: userId,
    orderItems,
    shippingAddress,
    subtotal,
    tax,
    shippingPrice,
    totalPrice,
  });

  await order.save();

  // Reduce product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.qty }
    });
  }

  return order;
};

const getOrderById = async (orderId, userId, role) => {
  const order = await Order.findById(orderId)
    .populate('user', 'name email')
    .populate('orderItems.product');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check authorization
  if (role !== 'admin' && order.user._id.toString() !== userId.toString()) {
    throw new AppError('Not authorized to view this order', 403);
  }

  return order;
};

const getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId });
  return orders;
};

const getAllOrders = async () => {
  const orders = await Order.find().populate('user', 'id name');
  return orders;
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  
  order.orderStatus = status;
  await order.save();
  
  return order;
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
