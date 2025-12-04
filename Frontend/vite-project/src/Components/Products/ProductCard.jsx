import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Link, useParams, useNavigate } from "react-router-dom";

const ProductCard = () => {
  const { categoryId = "all" } = useParams(); // Get category from route param, default to "all"
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryId);
  const [sortOrder, setSortOrder] = useState("none");

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
  }, [categoryId]);

  // Fetch products whenever selectedCategory changes
  useEffect(() => {
    if (selectedCategory === "all") {
      axios
        .get("/product/getAllProducts")
        .then((res) => setProducts(res.data))
        .catch((error) => console.log(error));
    } else {
      axios
        .get(`/product/productsByCategory/${selectedCategory}`)
        .then((res) => setProducts(res.data))
        .catch((error) => console.log(error));
    }
  }, [selectedCategory]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  // Handle category button click: navigate to /userDashboard if "all", else to category route
  const handleCategoryClick = (id) => {
    if (id === "all") {
      navigate("/userDashboard");
    } else {
      navigate(`/category/${id}`);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 py-8 pt-16">
      {/* Added pt-16 to push content below fixed navbar */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Categories Section */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 pb-4 mb-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`px-4 py-2 bg-white shadow-sm border border-gray-200 rounded-md text-sm font-medium transition ${
                selectedCategory === "all"
                  ? "bg-black text-black border-black"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => handleCategoryClick(c._id)}
                className={`px-4 py-2 bg-white shadow-sm border border-gray-200 rounded-md text-sm font-medium transition ${
                  selectedCategory === c._id
                    ? "bg-black text-black border-black"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="w-fit md:w-auto flex mt-2 md:mt-0 md:ml-auto">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm max-w-xs md:max-w-none"
            >
              <option value="none">Sort by</option>
              <option value="asc">Price Low to High</option>
              <option value="desc">Price High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Section */}
        {sortedProducts.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedProducts.map((p) => (
              <Link key={p._id} to={`/product/${p._id}`} className="block">
                <div
                  className="relative bg-white overflow-hidden shadow-sm flex flex-col 
cursor-pointer justify-between h-full
transition-transform duration-300 hover:scale-105 hover:z-30"
                >
                  {" "}
                  <img
                    src={`http://localhost:3000${p.image}`}
                    alt={p.name}
                    className="w-full h-96 object-cover"
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
        )}
      </div>
    </section>
  );
};

export default ProductCard;
