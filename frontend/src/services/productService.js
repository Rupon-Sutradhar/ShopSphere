import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const res = await api.get('/products', { params });
    return res.data;
  },

  async getProductById(id) {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
};

export const categoryService = {
  async getCategories() {
    const res = await api.get('/categories');
    return res.data;
  },
};
