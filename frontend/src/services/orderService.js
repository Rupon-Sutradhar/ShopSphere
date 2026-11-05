import api from './api';
import { demoOrderService, isDemoMode } from './demoStore';

export const orderService = {
  async createOrder(orderData) {
    if (isDemoMode) return demoOrderService.createOrder(orderData);
    const res = await api.post('/orders', orderData);
    return res.data;
  },

  async getMyOrders() {
    if (isDemoMode) return demoOrderService.getMyOrders();
    const res = await api.get('/orders/my');
    return res.data;
  },

  async getOrderById(id) {
    if (isDemoMode) return demoOrderService.getOrderById(id);
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  async getAllOrders() {
    if (isDemoMode) return demoOrderService.getAllOrders();
    const res = await api.get('/orders');
    return res.data;
  },

  async updateOrderStatus(id, status) {
    if (isDemoMode) return demoOrderService.updateOrderStatus(id, status);
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data;
  },
};
