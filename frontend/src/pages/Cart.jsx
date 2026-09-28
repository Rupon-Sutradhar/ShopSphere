import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, tax, shipping, total } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
          You haven't added anything to your cart yet. Explore our curated selection of premium products.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">Review your selected items before checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-8">
        {/* Cart Item Rows */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-5"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 rounded-xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
              />

              <div className="flex-1 w-full space-y-1">
                <div className="flex justify-between items-start">
                  <Link
                    to={`/products/${item._id}`}
                    className="text-base font-bold text-gray-900 hover:text-emerald-600 transition-colors"
                  >
                    {item.title}
                  </Link>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs font-medium text-gray-500">{item.category}</p>

                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-sm font-bold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1.5 hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <p className="text-[11px] text-gray-400 font-medium">
                      ({formatPrice(item.price)} each)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 pt-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

            <div className="space-y-3 text-sm text-gray-600 pb-4 border-b border-gray-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-emerald-600 font-medium">
                  Add {formatPrice(50 - subtotal)} more to qualify for Free Shipping!
                </p>
              )}
            </div>

            <div className="flex justify-between text-lg font-extrabold text-gray-900">
              <span>Total Amount</span>
              <span className="text-emerald-600">{formatPrice(total)}</span>
            </div>

            {/* Note on Phase 4 */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800">
              <p className="font-semibold mb-0.5">Phase 4 Active:</p>
              Checkout is now fully integrated.
            </div>

            <Link
              to="/checkout"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/20 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
