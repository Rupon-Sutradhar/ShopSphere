import React from 'react';

export const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm animate-pulse flex flex-col h-full space-y-4">
    <div className="aspect-square bg-gray-200 rounded-xl w-full" />
    <div className="space-y-2 flex-1">
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, idx) => (
      <ProductSkeleton key={idx} />
    ))}
  </div>
);
