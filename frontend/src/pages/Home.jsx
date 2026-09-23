import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw, TrendingUp } from 'lucide-react';
import { productService, categoryService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductSkeleton';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.allSettled([
          productService.getProducts({ limit: 8, sort: 'newest' }),
          categoryService.getCategories(),
        ]);

        if (prodRes.status === 'fulfilled') {
          setFeaturedProducts(prodRes.value?.data?.products || []);
        }
        if (catRes.status === 'fulfilled') {
          setCategories(catRes.value?.data?.categories || []);
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-gray-900 to-gray-950 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen Full Stack E-Commerce</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Elevate Your Everyday <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Shopping Experience
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
              Discover curated luxury essentials, cutting-edge electronics, and high-quality lifestyle gear with secure checkout and lightning delivery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2 group transition-all"
              >
                <span>Shop Collection</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products?sort=price_asc"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all text-center"
              >
                Browse Deals
              </Link>
            </div>
          </div>

          <div className="relative mx-auto lg:mx-0 max-w-md lg:max-w-none">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80"
                alt="ShopSphere Hero Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Spring Arrival</span>
                  <h3 className="text-xl font-bold text-white mt-1">Premium Crafted Essentials</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Free Express Delivery</h4>
              <p className="text-xs text-gray-500 mt-0.5">On orders over $50</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Secure Payments</h4>
              <p className="text-xs text-gray-500 mt-0.5">Encrypted transactions</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">30-Day Easy Returns</h4>
              <p className="text-xs text-gray-500 mt-0.5">Hassle-free money back</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Verified Quality</h4>
              <p className="text-xs text-gray-500 mt-0.5">Authentic guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Slider */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Featured Categories</h2>
              <p className="text-sm text-gray-500 mt-1">Browse items handpicked for your lifestyle</p>
            </div>
            <Link to="/products" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat._id)}`}
                className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                  {cat.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Trending Products</h2>
            <p className="text-sm text-gray-500 mt-1">Top-rated items loved by thousands</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            See all products <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : featuredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-lg mx-auto">
            <h3 className="text-base font-bold text-gray-900 mb-1">No products found yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Connect to MongoDB to see your live catalog or add sample products via the Admin dashboard.
            </p>
            <Link
              to="/products"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
