import api from './api';
import { demoCategoryService, demoProductService, isDemoMode } from './demoStore';

export const productService = {
  async getProducts(params = {}) {
    if (isDemoMode) return demoProductService.getProducts(params);
    const res = await api.get('/products', { params });
    return res.data;
  },

  async getProductById(id) {
    if (isDemoMode) return demoProductService.getProductById(id);
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
};

export const categoryService = {
  async getCategories() {
    if (isDemoMode) return demoCategoryService.getCategories();
    const res = await api.get('/categories');
    return res.data;
  },
};
