const orderService = require('../services/orderService');

const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress } = req.body;
    // Assuming req.user is set by the protect auth middleware
    const order = await orderService.createOrder(req.user.id, orderItems, shippingAddress);
    res.status(201).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
