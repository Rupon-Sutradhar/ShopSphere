import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  Share2
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [stockNotice, setStockNotice] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await productService.getProductById(id);
        const data = res?.data?.product;
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    const result = addToCart(product, quantity);
    if (result.success) {
      setAdded(true);
      setStockNotice('');
      setTimeout(() => setAdded(false), 2000);
    } else {
      setStockNotice(result.message || 'Cannot add more than available stock.');
    }
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    const result = addToCart(product, quantity);
    if (result.success) {
      setIsCartOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Item Unavailable</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'Could not locate the requested product.'}</p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
  const images = product.images?.length > 0 ? product.images : [{ url: fallbackImage }];
  const currentImageUrl = images[selectedImage]?.url || fallbackImage;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
        <span>/</span>
        <Link to="/products" className="hover:text-emerald-600">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Visual Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
            <img
              src={currentImageUrl}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === idx ? 'border-emerald-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Specifications & Order Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full">
                {product.category?.name || 'General'}
              </span>

              <div className="flex items-center space-x-1 text-amber-500 text-sm font-semibold">
                <Star className="h-4 w-4 fill-current" />
                <span>{product.rating || '4.8'}</span>
                <span className="text-gray-400 font-normal">({product.numReviews || 0} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black text-gray-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-500 font-medium">Free shipping calculated at checkout</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed border-t border-b border-gray-100 py-4">
              {product.description}
            </p>

            {/* Inventory Status Alert */}
            <div className="flex items-center space-x-2 text-sm">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  product.stock > 5 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                }`}
              />
              <span className="font-semibold text-gray-800">
                {product.stock > 5
                  ? `In Stock (${product.stock} available)`
                  : product.stock > 0
                  ? `Low Stock: Only ${product.stock} left!`
                  : 'Out of Stock'}
              </span>
            </div>

            {stockNotice && (
              <p className="text-xs font-semibold text-red-600">{stockNotice}</p>
            )}
          </div>

          {/* Quantity Selector & CTA Buttons */}
          <div className="space-y-4 pt-4">
            {product.stock > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="px-4 font-bold text-sm text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : product.stock <= 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3.5 px-6 rounded-xl font-bold text-sm bg-gray-900 hover:bg-black text-white shadow-md hover:shadow-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-center">
            <div className="p-3 bg-gray-50 rounded-2xl flex flex-col items-center">
              <Truck className="h-5 w-5 text-emerald-600 mb-1" />
              <span className="text-[11px] font-semibold text-gray-800">Fast Shipping</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl flex flex-col items-center">
              <RotateCcw className="h-5 w-5 text-emerald-600 mb-1" />
              <span className="text-[11px] font-semibold text-gray-800">30-Day Returns</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl flex flex-col items-center">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mb-1" />
              <span className="text-[11px] font-semibold text-gray-800">2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
