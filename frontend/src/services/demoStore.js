const PRODUCTS_KEY = 'shopsphere_demo_products';
const CATEGORIES_KEY = 'shopsphere_demo_categories';
const ORDERS_KEY = 'shopsphere_demo_orders';
const USER_KEY = 'shopsphere_demo_user';

const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

const defaultCategories = [
  { _id: 'cat-tech', name: 'Tech & Audio', slug: 'tech-audio' },
  { _id: 'cat-home', name: 'Home & Living', slug: 'home-living' },
  { _id: 'cat-style', name: 'Style & Travel', slug: 'style-travel' },
  { _id: 'cat-wellness', name: 'Wellness', slug: 'wellness' },
];

const defaultProducts = [
  { _id: 'prod-1', title: 'AeroTune Wireless Headphones', description: 'Immersive sound, adaptive noise cancellation, and a 30-hour battery in a refined everyday silhouette.', price: 149, stock: 18, rating: 4.9, numReviews: 124, featured: true, category: defaultCategories[0], images: [{ url: image('photo-1505740420928-5e560c06d30e') }] },
  { _id: 'prod-2', title: 'Orbit Smartwatch', description: 'A lightweight fitness companion with wellness tracking, bright display, and all-day battery life.', price: 199, stock: 12, rating: 4.8, numReviews: 87, featured: true, category: defaultCategories[0], images: [{ url: image('photo-1523275335684-37898b6baf30') }] },
  { _id: 'prod-3', title: 'Luma Desk Lamp', description: 'Warm, adjustable lighting for focused work and calm evenings, with a minimal architectural design.', price: 79, stock: 24, rating: 4.7, numReviews: 63, featured: true, category: defaultCategories[1], images: [{ url: image('photo-1507473885765-e6ed057f782c') }] },
  { _id: 'prod-4', title: 'Cloud Lounge Chair', description: 'A sculptural accent chair with deep comfort and soft, durable upholstery for modern spaces.', price: 289, stock: 7, rating: 4.8, numReviews: 41, featured: false, category: defaultCategories[1], images: [{ url: image('photo-1555041469-a586c61ea9bc') }] },
  { _id: 'prod-5', title: 'Nomad Weekender', description: 'A durable, water-resistant weekender designed for short trips and effortless organization.', price: 118, stock: 15, rating: 4.6, numReviews: 54, featured: true, category: defaultCategories[2], images: [{ url: image('photo-1553062407-98eeb64c6a62') }] },
  { _id: 'prod-6', title: 'Terra Everyday Sneakers', description: 'Cushioned, versatile sneakers made for city walks, commutes, and weekend adventures.', price: 96, stock: 31, rating: 4.7, numReviews: 98, featured: true, category: defaultCategories[2], images: [{ url: image('photo-1542291026-7eec264c27ff') }] },
  { _id: 'prod-7', title: 'Calm Ritual Set', description: 'A considered collection of botanical essentials to make your daily wind-down feel intentional.', price: 64, stock: 20, rating: 4.9, numReviews: 72, featured: false, category: defaultCategories[3], images: [{ url: image('photo-1540555700478-4be289fbecef') }] },
  { _id: 'prod-8', title: 'BrewCraft Pour-Over', description: 'A balanced ceramic pour-over set for a beautiful, consistent morning coffee ritual.', price: 52, stock: 16, rating: 4.8, numReviews: 38, featured: false, category: defaultCategories[1], images: [{ url: image('photo-1495474472287-4d71bcdd2085') }] },
];

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const categories = () => read(CATEGORIES_KEY, defaultCategories);
const products = () => read(PRODUCTS_KEY, defaultProducts);
const withCategory = (product) => ({ ...product, category: typeof product.category === 'string' ? categories().find((item) => item._id === product.category) || { name: 'General' } : product.category });
const response = (data) => ({ data });

export const demoProductService = {
  async getProducts(params = {}) {
    let result = products().map(withCategory);
    if (params.search) result = result.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(params.search.toLowerCase()));
    if (params.category) result = result.filter((item) => item.category?._id === params.category);
    if (params.minPrice) result = result.filter((item) => item.price >= Number(params.minPrice));
    if (params.maxPrice) result = result.filter((item) => item.price <= Number(params.maxPrice));
    if (params.sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    if (params.sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    if (params.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    const page = Number(params.page || 1);
    const limit = Number(params.limit || 12);
    return response({ products: result.slice((page - 1) * limit, page * limit), pagination: { page, pages: Math.max(1, Math.ceil(result.length / limit)), total: result.length } });
  },
  async getProductById(id) { const product = products().map(withCategory).find((item) => item._id === id); if (!product) throw new Error('Product not found'); return response({ product }); },
};

export const demoCategoryService = { async getCategories() { return response({ categories: categories() }); } };

export const demoAuthService = {
  async register({ name, email }) { const user = { _id: `user-${Date.now()}`, name, email, role: email.toLowerCase().includes('admin') ? 'admin' : 'customer' }; write(USER_KEY, user); return response({ user }); },
  async login({ email }) { const user = { _id: `user-${email}`, name: email.split('@')[0], email, role: email.toLowerCase().includes('admin') ? 'admin' : 'customer' }; write(USER_KEY, user); return response({ user }); },
  async logout() { localStorage.removeItem(USER_KEY); return response({}); },
  async getMe() { const user = read(USER_KEY, null); if (!user) throw new Error('Not authenticated'); return response({ user }); },
};

const orderFor = (items, shippingAddress, user) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shippingPrice = subtotal >= 50 ? 0 : 9.99;
  return { _id: `demo-order-${Date.now()}`, user, orderItems: items, shippingAddress, subtotal, tax, shippingPrice, totalPrice: subtotal + tax + shippingPrice, orderStatus: 'Processing', isPaid: true, paidAt: new Date().toISOString(), createdAt: new Date().toISOString() };
};

export const demoOrderService = {
  async createOrder({ orderItems, shippingAddress }) { const order = orderFor(orderItems, shippingAddress, read(USER_KEY, { name: 'Demo Shopper', email: 'demo@shopsphere.app' })); const all = read(ORDERS_KEY, []); write(ORDERS_KEY, [order, ...all]); return response({ order }); },
  async getMyOrders() { return response({ orders: read(ORDERS_KEY, []) }); },
  async getOrderById(id) { const order = read(ORDERS_KEY, []).find((item) => item._id === id); if (!order) throw new Error('Order not found'); return response({ order }); },
  async getAllOrders() { return response({ orders: read(ORDERS_KEY, []) }); },
  async updateOrderStatus(id, status) { const all = read(ORDERS_KEY, []).map((item) => item._id === id ? { ...item, orderStatus: status } : item); write(ORDERS_KEY, all); return response({ order: all.find((item) => item._id === id) }); },
};

export const demoAdminService = {
  async getDashboard() { const allOrders = read(ORDERS_KEY, []); const allProducts = products(); return response({ metrics: { productCount: allProducts.length, categoryCount: categories().length, orderCount: allOrders.length, paidOrderCount: allOrders.filter((item) => item.isPaid).length, revenue: allOrders.filter((item) => item.isPaid).reduce((sum, item) => sum + item.totalPrice, 0) }, orderStatuses: allOrders.reduce((result, item) => ({ ...result, [item.orderStatus]: (result[item.orderStatus] || 0) + 1 }), {}), recentOrders: allOrders.slice(0, 5) }); },
  async getProducts(params = {}) { return demoProductService.getProducts({ ...params, limit: 10 }); },
  async createProduct(product) { const next = { ...product, _id: `prod-${Date.now()}`, category: categories().find((item) => item._id === product.category) || categories()[0], images: [] }; write(PRODUCTS_KEY, [...products(), next]); return response({ product: next }); },
  async updateProduct(id, changes) { const next = products().map((item) => item._id === id ? { ...item, ...changes, category: categories().find((cat) => cat._id === changes.category) || item.category } : item); write(PRODUCTS_KEY, next); return response({ product: next.find((item) => item._id === id) }); },
  async deleteProduct(id) { write(PRODUCTS_KEY, products().filter((item) => item._id !== id)); return response({}); },
  async getCategories() { return demoCategoryService.getCategories(); },
  async createCategory(name) { const category = { _id: `cat-${Date.now()}`, name, slug: name.toLowerCase().replace(/\s+/g, '-') }; write(CATEGORIES_KEY, [...categories(), category]); return response({ category }); },
  async updateCategory(id, name) { const next = categories().map((item) => item._id === id ? { ...item, name, slug: name.toLowerCase().replace(/\s+/g, '-') } : item); write(CATEGORIES_KEY, next); return response({ category: next.find((item) => item._id === id) }); },
  async deleteCategory(id) { write(CATEGORIES_KEY, categories().filter((item) => item._id !== id)); return response({}); },
  async getOrders() { return demoOrderService.getAllOrders(); },
  async updateOrderStatus(id, status) { return demoOrderService.updateOrderStatus(id, status); },
};

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
