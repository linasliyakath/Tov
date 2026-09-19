// Skeleton for the product grid — 8 pulsing card placeholders
const ProductGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white shadow-sm overflow-hidden animate-pulse">
          {/* Image placeholder */}
          <div className="w-full h-96 bg-gray-200" />
          {/* Text placeholders */}
          <div className="px-6 py-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
