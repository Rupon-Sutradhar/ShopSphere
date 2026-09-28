import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatters';
import { Loader2, Package, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { paymentService } from '../services/paymentService';
import PaymentForm from '../components/PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrderById(id);
      const orderData = res.data.order;
      setOrder(orderData);
      
      if (!orderData.isPaid) {
        try {
          const payRes = await paymentService.createPaymentIntent(id);
          setClientSecret(payRes.data.clientSecret);
        } catch (payErr) {
          console.error('Failed to initialize payment', payErr);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'This order does not exist or you do not have permission to view it.'}</p>
        <Link to="/orders" className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl text-sm transition-colors">
          View My Orders
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center space-x-2">
            <Package className="h-6 w-6 text-emerald-600" />
            <span>Order Details</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">ID: <span className="font-mono">{order._id}</span></p>
        </div>
        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Order Items</h2>
            <div className="space-y-4 divide-y divide-gray-100">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex space-x-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0" />
                  <div className="flex-1">
                    <Link to={`/products/${item.product._id || item.product}`} className="font-bold text-sm text-gray-900 hover:text-emerald-600 transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {formatPrice(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Shipping Details</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-semibold text-gray-900">Name:</span> {order.shippingAddress.fullName}</p>
                <p><span className="font-semibold text-gray-900">Phone:</span> {order.shippingAddress.phone}</p>
                <p className="mt-2">{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-3xl border border-gray-200 p-6 sm:p-8 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-3 text-sm text-gray-600 pb-4 border-b border-gray-200">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-black text-gray-900 mt-4 mb-6">
              <span>Total</span>
              <span className="text-emerald-600">{formatPrice(order.totalPrice)}</span>
            </div>

            {order.isPaid ? (
              <div className="flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl font-bold">
                <CheckCircle2 className="h-5 w-5" />
                <span>Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
              </div>
            ) : (
              <div className="flex items-center justify-between space-x-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-xl font-bold">
                <AlertCircle className="h-5 w-5" />
                <span>Pending Payment</span>
              </div>
            )}
            
            {!order.isPaid && clientSecret && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Complete Payment</h3>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm orderId={order._id} onSuccess={fetchOrder} />
                </Elements>
              </div>
            )}
            
            {!order.isPaid && !clientSecret && (
              <div className="mt-4 text-xs text-red-500 text-center">
                Payment gateway initialization failed.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
