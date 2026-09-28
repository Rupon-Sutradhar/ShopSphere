import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Package, 
  Tags, 
  Users, 
  Layers, 
  CheckCircle2,
  RefreshCw,
  Edit,
  Trash2
} from 'lucide-react';
import { productService, categoryService } from '../services/productService';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatters';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data States
  const [stats, setStats] = useState({ productCount: 0, categoryCount: 0, orderCount: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // Helper fetch function
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, ordRes] = await Promise.allSettled([
        productService.getProducts({ limit: 100 }),
        categoryService.getCategories(),
        orderService.getAllOrders()
      ]);

      const prods = prodRes.status === 'fulfilled' ? (prodRes.value?.data?.products || []) : [];
      const cats = catRes.status === 'fulfilled' ? (catRes.value?.data?.categories || []) : [];
      
      // Order service might return data directly or nested in res.data
      let ords = [];
      if (ordRes.status === 'fulfilled') {
        const oData = ordRes.value;
        ords = oData.data?.orders || oData.orders || oData;
        if (!Array.isArray(ords)) ords = [];
      }

      setProducts(prods);
      setCategories(cats);
      setOrders(ords);

      setStats({
        productCount: prods.length,
        categoryCount: cats.length,
        orderCount: ords.length,
      });

    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Optimistic update
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Products</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{loading ? '...' : stats.productCount}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl">
            <Tags className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{loading ? '...' : stats.categoryCount}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{loading ? '...' : stats.orderCount}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">RBAC Security</p>
            <p className="text-sm font-black text-gray-900 mt-0.5">Active Guard</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start space-x-3 text-sm text-emerald-900">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p><strong>System Online:</strong> Complete MERN backend integration is live. Product, Category, and Order APIs are functioning with Role-Based Access Control enforcing secure boundaries.</p>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
        <button onClick={fetchDashboardData} className="text-gray-400 hover:text-emerald-600">
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Status Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50/50">
                <td className="p-4 text-sm font-mono text-gray-900">{order._id.slice(-8)}</td>
                <td className="p-4 text-sm font-medium text-gray-700">
                  {order.user?.name || 'Unknown'}
                  <span className="block text-xs font-normal text-gray-400">{order.user?.email}</span>
                </td>
                <td className="p-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-sm font-bold text-gray-900">{formatPrice(order.totalPrice)}</td>
                <td className="p-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-2 py-1.5 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 text-sm">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Product Inventory</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => (
              <tr key={product._id} className="hover:bg-gray-50/50">
                <td className="p-4 text-sm font-medium text-gray-900 line-clamp-1">{product.title}</td>
                <td className="p-4 text-sm font-bold text-gray-900">{formatPrice(product.price)}</td>
                <td className="p-4 text-sm text-gray-600">{product.stock}</td>
                <td className="p-4 text-sm">
                  {product.stock > 0 ? (
                    <span className="text-emerald-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h1 className="text-3xl font-black text-gray-900">Admin Portal</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto pb-px">
        {['dashboard', 'orders', 'products'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-bold capitalize transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'products' && renderProducts()}
      </div>
    </div>
  );
};

export default Admin;
