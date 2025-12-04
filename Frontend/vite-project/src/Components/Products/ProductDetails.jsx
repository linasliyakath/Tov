import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Swal from "sweetalert2";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/product/getProductById/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  // Get available stock for selected size
  const availableStock =
    size && product?.stock ? product.stock[size] || 0 : 0;

  // Adjust quantity if it exceeds stock after stock or quantity change
  useEffect(() => {
    if (quantity > availableStock) {
      setQuantity(availableStock > 0 ? availableStock : 1);
    }
  }, [availableStock, quantity]);

  const addToCart = async () => {

    if (!size) return;

    if (quantity > availableStock) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Only ${availableStock} item(s) available in size ${size}`,
      });
      return;
    }

    try {
      await axios.post(
        "/cart/add",
        {
          productId: product._id,
          name: product.name,
          quantity,
          size,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Item added to cart successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      navigate('/login')
    }
  };

  if (!product)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <section className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-full mx-auto bg-white p-6 shadow-md rounded-md flex flex-col md:flex-row gap-10">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/userDashboard")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12h18M3 12l6-6M3 12l6 6"
            />
          </svg>
          <span className="cursor-pointer">Continue shopping</span>
        </button>

        {/* Left Side: Product Image */}
        <div className="md:w-1/2 flex items-center justify-center">
          <img
            src={`http://localhost:3000${product.image}`}
            alt={product.name}
            className="w-full h-auto object-contain rounded"
          />
        </div>

        {/* Right Side: Info + Selections */}
        <div className="md:w-1/2 flex flex-col justify-center space-y-6 px-4">
          <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-xl font-semibold text-gray-900">Price: ${product.price}</p>

          {/* Size Selector */}
          <div>
            <label
              htmlFor="size"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Size
            </label>
            <select
              id="size"
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                setQuantity(1); // reset quantity on size change
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select Size</option>
              {product.sizes &&
                product.sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </div>

          {/* Show stock status */}
          {size && (
            <p
              className={`mt-1 text-sm ${
                availableStock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {availableStock > 0
                ? `In Stock: ${availableStock}`
                : "Out of stock for selected size"}
            </p>
          )}

          {/* Quantity Selector */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="cursor-pointer  w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-lg font-bold hover:bg-gray-200 active:scale-95 transition"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="px-3">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() =>
                  setQuantity((prev) =>
                    availableStock > 0 && prev < availableStock ? prev + 1 : prev
                  )
                }
                className="cursor-pointer w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-lg font-bold hover:bg-gray-200 active:scale-95 transition"
                disabled={availableStock === 0}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            disabled={!size || availableStock === 0}
            className={`w-full h-12 bg-black text-white font-medium rounded hover:bg-black transition-colors duration-300 active:scale-95 ${
              !size || availableStock === 0
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
