import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck, 
  Package, 
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
                Shop<span className="text-emerald-600">Sphere</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                All Products
              </Link>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search products, brands, essentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="h-6 w-6" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-xs h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* User Dropdown / Auth CTA */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold text-gray-700 max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 rounded">
                          Admin
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                    >
                      <User className="h-4 w-4 mr-2.5 text-gray-400" />
                      Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                    >
                      <Package className="h-4 w-4 mr-2.5 text-gray-400" />
                      My Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-emerald-700 font-medium hover:bg-emerald-50"
                      >
                        <ShieldCheck className="h-4 w-4 mr-2.5 text-emerald-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2.5 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-sm hover:shadow transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            </form>

            <div className="flex flex-col space-y-2 pt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-emerald-50 hover:text-emerald-600"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-emerald-50 hover:text-emerald-600"
              >
                All Products
              </Link>

              {!isAuthenticated && (
                <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <LogIn className="h-4 w-4 mr-2" /> Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-emerald-600"
                  >
                    <UserPlus className="h-4 w-4 mr-2" /> Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
