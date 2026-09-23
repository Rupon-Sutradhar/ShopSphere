import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Globe, MessageCircle, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Shop<span className="text-emerald-400">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              A modern, production-grade e-commerce destination with premier selections, fast shipping, and seamless checkout.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products" className="hover:text-emerald-400 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-emerald-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-emerald-400 transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=Home" className="hover:text-emerald-400 transition-colors">Home & Living</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-3">
              Subscribe for exclusive flash sales, new releases, and discount vouchers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
          <p className="flex items-center">
            Designed for performance & security
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
