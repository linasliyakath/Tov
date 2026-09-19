import React, { useEffect, useState } from "react";
import axios, { getImageUrl } from "../../api/axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import ProductGridSkeleton from "../Skeletons/ProductGridSkeleton";

const ProductCard = () => {
  const { categoryId = "all" } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryId);
  const [sortOrder, setSortOrder] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 8;

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get("/product/getCategories")
      .then((res) => setCategories(res.data))
      .catch((error) => console.log(error));
  }, []);

  // Update selected category when route param changes
  useEffect(() => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  }, [categoryId]);

  // Fetch products whenever selectedCategory changes
  useEffect(() => {
    setLoading(true);
    const url =
      selectedCategory === "all"
        ? "/product/getAllProducts"
        : `/product/productsByCategory/${selectedCategory}`;

    axios
      .get(url)
      .then((res) => setProducts(res.data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryClick = (id) => {
    if (id === "all") {
      navigate("/userDashboard");
    } else {
      navigate(`/category/${id}`);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 py-8 pt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Categories + Sort bar */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 pb-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick("all")}
              className="px-4 py-2 bg-white shadow-sm border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => handleCategoryClick(c._id)}
                className="px-4 py-2 bg-white shadow-sm border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="w-fit md:w-auto flex mt-2 md:mt-0 md:ml-auto">
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm max-w-xs md:max-w-none"
            >
              <option value="none">Sort by</option>
              <option value="asc">Price Low to High</option>
              <option value="desc">Price High to Low</option>
            </select>
          </div>
        </div>

        {/* Products — skeleton while loading */}
        {loading ? (
          <ProductGridSkeleton />
        ) : sortedProducts.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedProducts.map((p, index) => (
                <Link key={p._id} to={`/product/${p._id}`} className="block">
                  <div className="relative bg-white overflow-hidden shadow-sm flex flex-col cursor-pointer justify-between h-full transition-transform duration-300 hover:scale-105 hover:z-30">
                    <img
                      src={getImageUrl(p.image)}
                      alt={p.name}
                      className="w-full h-96 object-cover"
                      loading={index < 4 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <div className="px-6 py-4 flex flex-col grow">
                      <h3 className="text-sm font-normal text-gray-800 mb-2">
                        {p.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-base font-semibold text-gray-900">
                          ${p.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 mb-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium transition flex items-center gap-1.5 ${
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed text-gray-400"
                      : "hover:bg-gray-100 text-gray-800 cursor-pointer"
                  }`}
                >
                  <span className="text-xs">‹</span> Back
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition cursor-pointer min-w-[40px] text-center ${
                      currentPage === page
                        ? "bg-black text-white shadow-sm"
                        : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium transition flex items-center gap-1.5 ${
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed text-gray-400"
                      : "hover:bg-gray-100 text-gray-800 cursor-pointer"
                  }`}
                >
                  Next <span className="text-xs">›</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductCard;
