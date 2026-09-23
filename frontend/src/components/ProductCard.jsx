import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
  const imageUrl = product.images?.[0]?.url || fallbackImage;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Box */}
      <Link to={`/products/${product._id}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFeatured && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-600 text-white rounded-full shadow-sm">
              Featured
            </span>
          )}
          {product.stock <= 0 && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-red-600 text-white rounded-full shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Add overlay button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`absolute bottom-3 right-3 p-3 rounded-full shadow-md transition-all duration-300 ${
            added
              ? 'bg-emerald-600 text-white scale-110'
              : product.stock <= 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-0 group-hover:opacity-100'
              : 'bg-white text-gray-800 hover:bg-emerald-600 hover:text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
          }`}
          aria-label="Add to cart"
        >
          {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
        </button>
      </Link>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
            {product.category?.name || 'General'}
          </span>
          <Link to={`/products/${product._id}`}>
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mt-1 hover:text-emerald-600 transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-lg font-extrabold text-gray-900">
            {formatPrice(product.price)}
          </span>

          <div className="flex items-center space-x-1 text-amber-500 text-xs font-semibold">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span>{product.rating || '4.5'}</span>
            <span className="text-gray-400 font-normal">({product.numReviews || 0})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
