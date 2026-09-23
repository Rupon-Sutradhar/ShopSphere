import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, ShoppingBag, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    const res = await login(data);
    setSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setServerError(res.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to your ShopSphere account</p>
        </div>

        {serverError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs font-semibold text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email',
                },
              })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-emerald-600 hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
