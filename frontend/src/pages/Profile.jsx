import React from 'react';
import { User, Mail, Shield, Calendar, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-8 border-b border-gray-100">
          <div className="h-20 w-20 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-800 font-extrabold text-2xl flex items-center justify-center shadow-inner">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h1 className="text-2xl font-black text-gray-900">{user?.name}</h1>
              {user?.role === 'admin' && (
                <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <User className="h-4 w-4 mr-2 text-emerald-600" />
              Full Name
            </div>
            <p className="text-base font-bold text-gray-900">{user?.name}</p>
          </div>

          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <Mail className="h-4 w-4 mr-2 text-emerald-600" />
              Email Address
            </div>
            <p className="text-base font-bold text-gray-900">{user?.email}</p>
          </div>

          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <Shield className="h-4 w-4 mr-2 text-emerald-600" />
              Role Permission
            </div>
            <p className="text-base font-bold text-gray-900 capitalize">{user?.role || 'Customer'}</p>
          </div>

          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
              Member Since
            </div>
            <p className="text-base font-bold text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <Link
            to="/orders"
            className="flex-1 py-3 px-4 bg-gray-900 hover:bg-black text-white text-center rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all"
          >
            <Package className="h-4 w-4" />
            <span>View Order History</span>
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <Shield className="h-4 w-4" />
              <span>Open Admin Panel</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
