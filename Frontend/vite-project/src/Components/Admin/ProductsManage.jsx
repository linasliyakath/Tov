import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Swal from "sweetalert2";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null,
    stock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    getAllProducts();
    getCategories();
  }, []);

const getAllProducts = async () => {
  try {
    const res = await axios.get("/product/getAllProducts", {
      withCredentials: true,
    });

    // NEWEST FIRST
    const sorted = [...res.data].reverse();

    setProducts(sorted);
  } catch (error) {
    console.log(error, "error fetching products admin side");
  }
};


  const getCategories = async () => {
    try {
      const res = await axios.get("/product/getCategories", {
        withCredentials: true,
      });
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openEditForm = (product) => {
    setEditProduct({
      _id: product._id,
      name: product.name,
      price: product.price,
      category: product.category?._id || "",
      description: product.description,
      image: null,
      stock: product.stock || { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    });
    setShowAddProduct(false);
  };

  // Input handlers
  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleStockChange = (size, value, isEdit = false) => {
    if (isEdit) {
      setEditProduct((prev) => ({
        ...prev,
        stock: { ...prev.stock, [size]: Number(value) },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        stock: { ...prev.stock, [size]: Number(value) },
      }));
    }
  };

  const handleEditInputChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "image") {
      setEditProduct((prev) => ({ ...prev, image: files[0] }));
    } else {
      setEditProduct((prev) => ({ ...prev, [id]: value }));
    }
  };

  // Submit handlers
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("stock", JSON.stringify(formData.stock));
      if (formData.image) data.append("image", formData.image);

      await axios.post("/admin/add", data, {
        withCredentials: true,
      });

      alert("Product added");
      setShowAddProduct(false);
      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        image: null,
        stock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
      });
      getAllProducts();
    } catch (error) {
      console.log(error, "Failed to add product");
      alert("Error adding product");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProduct.category || editProduct.category.trim() === "") {
      alert("Please select a valid category");
      return;
    }
    try {
      const data = new FormData();
      data.append("name", editProduct.name);
      data.append("price", editProduct.price);
      data.append("category", editProduct.category);
      data.append("description", editProduct.description);
      data.append("stock", JSON.stringify(editProduct.stock));
      if (editProduct.image) data.append("image", editProduct.image);

      await axios.put(
        `/admin/updateProduct/${editProduct._id}`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Product updated");
      setEditProduct(null);
      getAllProducts();
    } catch (error) {
      console.error("Failed to update product", error);
      alert("Error updating product");
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`/admin/deleteProductById/${id}`, {
        withCredentials: true,
      });
      Swal.fire({
        title: "Deleted!",
        text: "Product has been removed.",
        icon: "success",
        confirmButtonColor: "#000000",
      });
      getAllProducts();
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Failed to delete product", "error");
    }
  };

  return (
    <div className="pt-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Add Product Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-2xl font-semibold">All Products</h1>
        <button
          onClick={() => {
            setShowAddProduct(!showAddProduct);
            setEditProduct(null);
          }}
          className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
        >
          <span className="text-xl mr-2">+</span>Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showAddProduct && (
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Product</h2>
          <form onSubmit={handleAddProduct}>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                onChange={handleInputChange}
                value={formData.name}
                type="text"
                id="name"
                placeholder="Product name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700 mb-2">
                Price
              </label>
              <input
                value={formData.price}
                onChange={handleInputChange}
                type="number"
                id="price"
                placeholder="Product price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition bg-white"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) &&
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={handleInputChange}
                id="description"
                placeholder="Product description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition resize-none"
              ></textarea>
            </div>

            {/* Image */}
            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 mb-2">
                Image
              </label>
              <input
                onChange={handleInputChange}
                type="file"
                id="image"
                accept="image/*"
                className="w-full text-gray-700"
              />
            </div>

            {/* Stock per size */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Stock Quantities
              </label>
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <div key={size} className="mb-2">
                  <label className="block text-gray-700">{`Size ${size}`}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock[size] || 0}
                    onChange={(e) =>
                      handleStockChange(size, e.target.value)
                    }
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
            >
              Add Product
            </button>
          </form>
        </div>
      )}

      {/* Edit Product Form */}
      {editProduct && (
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
          <form onSubmit={handleUpdateProduct}>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                value={editProduct.name}
                onChange={handleEditInputChange}
                type="text"
                placeholder="Product name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700 mb-2">
                Price
              </label>
              <input
                id="price"
                value={editProduct.price}
                onChange={handleEditInputChange}
                type="number"
                placeholder="Product price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={editProduct.category}
                onChange={handleEditInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition bg-white"
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) &&
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={editProduct.description}
                onChange={handleEditInputChange}
                placeholder="Product description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition resize-none"
              ></textarea>
            </div>

            {/* Image */}
            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 mb-2">
                Image
              </label>
              <input
                onChange={handleEditInputChange}
                type="file"
                id="image"
                accept="image/*"
                className="w-full text-gray-700"
              />
            </div>

            {/* Stock per size */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Stock Quantities
              </label>
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <div key={size} className="mb-2">
                  <label className="block text-gray-700">{`Size ${size}`}</label>
                  <input
                    type="number"
                    min="0"
                    value={editProduct.stock[size] || 0}
                    onChange={(e) =>
                      handleStockChange(size, e.target.value, true)
                    }
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={() => setEditProduct(null)}
              className="w-full mt-2 bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full min-w-[350px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">
                Image
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">
                Price
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">
                Category
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right sm:pr-12"></th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right sm:pr-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No products available
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <img
                      src={`http://localhost:3000${p.image}`}
                      alt={p.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700">
                    {p.name}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold">
                    ${p.price}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700">
                    {p.category?.name}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-right sm:pr-12">
                    <button
                      onClick={() => openEditForm(p)}
                      className="ml-2 px-2 py-1 bg-black text-white rounded hover:bg-gray-900 transition"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-right sm:pr-12">
                    <button
                      onClick={() => deleteProduct(p._id)}
                      aria-label="Delete item"
                      className="relative p-1 bg-transparent cursor-pointer transition-transform duration-200 hover:scale-[1.08] hover:rotate-3 active:scale-[0.96] active:rotate-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
