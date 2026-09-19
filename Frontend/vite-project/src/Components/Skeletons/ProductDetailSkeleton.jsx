// Skeleton for the product detail page
const ProductDetailSkeleton = () => {
  return (
    <section className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-full mx-auto bg-white p-6 shadow-md rounded-md flex flex-col md:flex-row gap-10 animate-pulse">
        {/* Image placeholder */}
        <div className="md:w-1/2 bg-gray-200 rounded min-h-[400px]" />

        {/* Info placeholder */}
        <div className="md:w-1/2 flex flex-col justify-center space-y-6 px-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          {/* Size selector placeholder */}
          <div className="h-10 bg-gray-200 rounded w-full" />
          {/* Quantity placeholder */}
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          {/* Button placeholder */}
          <div className="h-12 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </section>
  );
};

export default ProductDetailSkeleton;
