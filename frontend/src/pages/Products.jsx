import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, X } from 'lucide-react';
import { productService, categoryService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductSkeleton';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL search params state
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local filter states
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(res?.data?.categories || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: pageParam,
          limit: 12,
          sort: sortParam,
        };

        if (searchQuery) params.search = searchQuery;
        if (categoryParam) params.category = categoryParam;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await productService.getProducts(params);
        setProducts(res?.data?.products || []);
        setPagination(res?.data?.pagination || { page: 1, pages: 1, total: 0 });
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryParam, sortParam, pageParam, minPrice, maxPrice]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPrice) newParams.set('minPrice', minPrice);
    else newParams.delete('minPrice');

    if (maxPrice) newParams.set('maxPrice', maxPrice);
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  const clearAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {products.length} of {pagination.total || products.length} available items
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">Sort:</span>
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        {/* Sidebar Filters Desktop */}
        <aside className="hidden md:block space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="font-bold text-gray-900 text-sm flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2 text-emerald-600" />
                Filters
              </span>
              {(categoryParam || minPrice || maxPrice || searchQuery) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Category
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    !categoryParam
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateParam('category', cat._id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      categoryParam === cat._id
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Form */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Price Range ($)
              </h3>
              <form onSubmit={handlePriceApply} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gray-900 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Apply Price
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Product Grid Content */}
        <section className="md:col-span-3">
          {loading ? (
            <ProductGridSkeleton count={9} />
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center text-red-600">
              <p className="font-semibold">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No products match your criteria</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Try loosening your filters or searching with different keywords.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-6 border-t border-gray-100">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => updateParam('page', (pagination.page - 1).toString())}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-gray-700 px-3">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => updateParam('page', (pagination.page + 1).toString())}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;
