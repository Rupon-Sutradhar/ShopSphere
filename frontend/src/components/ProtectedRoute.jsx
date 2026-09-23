import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-gray-500">Checking authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and preserve target location for post-login return
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl shadow-sm border border-red-100 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <span className="font-bold text-lg">!</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-sm text-gray-600 mb-6">
          Administrator privileges are required to view this dashboard.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};
