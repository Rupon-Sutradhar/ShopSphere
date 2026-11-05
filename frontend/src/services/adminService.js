import api from './api';
import { demoAdminService, isDemoMode } from './demoStore';

export const adminService = {
  async getDashboard() { if (isDemoMode) return demoAdminService.getDashboard(); const res = await api.get('/admin/dashboard'); return res.data; },
  async getProducts(params = {}) { if (isDemoMode) return demoAdminService.getProducts(params); const res = await api.get('/admin/products', { params }); return res.data; },
  async createProduct(product) { if (isDemoMode) return demoAdminService.createProduct(product); const res = await api.post('/admin/products', product); return res.data; },
  async updateProduct(id, product) { if (isDemoMode) return demoAdminService.updateProduct(id, product); const res = await api.put(`/admin/products/${id}`, product); return res.data; },
  async deleteProduct(id) { if (isDemoMode) return demoAdminService.deleteProduct(id); const res = await api.delete(`/admin/products/${id}`); return res.data; },
  async getCategories() { if (isDemoMode) return demoAdminService.getCategories(); const res = await api.get('/admin/categories'); return res.data; },
  async createCategory(name) { if (isDemoMode) return demoAdminService.createCategory(name); const res = await api.post('/admin/categories', { name }); return res.data; },
  async updateCategory(id, name) { if (isDemoMode) return demoAdminService.updateCategory(id, name); const res = await api.put(`/admin/categories/${id}`, { name }); return res.data; },
  async deleteCategory(id) { if (isDemoMode) return demoAdminService.deleteCategory(id); const res = await api.delete(`/admin/categories/${id}`); return res.data; },
  async getOrders() { if (isDemoMode) return demoAdminService.getOrders(); const res = await api.get('/admin/orders'); return res.data; },
  async updateOrderStatus(id, status) { if (isDemoMode) return demoAdminService.updateOrderStatus(id, status); const res = await api.put(`/admin/orders/${id}/status`, { status }); return res.data; },
};
