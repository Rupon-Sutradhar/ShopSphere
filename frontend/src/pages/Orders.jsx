import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ArrowRight, ShoppingBag } from 'lucide-react';

const Orders = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Package className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Order placement, tracking, and purchase records will be connected in Phase 4 during backend checkout integration.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-full">
          <Clock className="h-4 w-4" />
          <span>Scheduled for Phase 4: Order System & Checkout</span>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Browse Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Orders;
