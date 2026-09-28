import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const res = await api.post('/orders', orderData);
    return res.data;
  },

  async getMyOrders() {
    const res = await api.get('/orders/my');
    return res.data;
  },

  async getOrderById(id) {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  async getAllOrders() {
    const res = await api.get('/orders');
    return res.data;
  },

  async updateOrderStatus(id, status) {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data;
  },
};
