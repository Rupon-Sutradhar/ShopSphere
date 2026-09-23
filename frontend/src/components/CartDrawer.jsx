import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    shipping,
    total,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                {cartItems.length} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Your cart is empty</h3>
                <p className="text-sm text-gray-500 max-w-xs mb-6">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="py-4 flex space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-20 rounded-xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/products/${item._id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-semibold text-gray-900 truncate hover:text-emerald-600"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Sales Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-600 font-semibold">Free</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-emerald-600">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Go to Checkout Cart</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 text-center text-xs text-gray-500 hover:text-gray-700 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
