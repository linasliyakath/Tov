import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import Swal from 'sweetalert2'

const Category = () => {
  const [getCategories, setGetCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const handleGetCategories = async () => {
    try {
      const res = await axios.get("/admin/getCategories", {
        withCredentials: true,
      });
      setGetCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  };

const handleAddCategory = async (e) => {
  e.preventDefault();
  if (!newCategory.trim()) return;

  try {
    const res = await axios.post(
      "/admin/addCategory",
      { name: newCategory },
      { withCredentials: true }
    );

    if (res.data.success) {
      Swal.fire("Success!", res.data.message, "success");
      setNewCategory("");
      handleGetCategories();
    } else {
      Swal.fire("Error!", res.data.message, "error");
    }

  } catch (error) {
    console.log(error);
    Swal.fire("Error!", "Something went wrong!", "error");
  }
};
const handleDeleteCategory = async (id) => {
  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: "This category will be removed!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  });

  if (!confirmation.isConfirmed) return;

  try {
    const res = await axios.delete(
      `/admin/deleteCategory/${id}`,
      { withCredentials: true }
    );

    if (!res.data.success) {
      await Swal.fire({
        icon: "error",
        title: "Cannot Delete Category",
        text: res.data.message || "This category has linked products!",
      });
      return; // ⛔ Stop here
    }

    await Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: res.data.message || "Category deleted successfully!",
      timer: 2000,
      showConfirmButton: false,
    });
    handleGetCategories();
    return;

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Server Error",
      text: "Something went wrong!",
    });
    return;
  }
};




  useEffect(() => {
    handleGetCategories();
  }, []);

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Categories</h1>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border px-3 py-2 rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Category
        </button>
      </form>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full min-w-[450px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Category ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Category Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {getCategories.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item._id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                  {item.name}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDeleteCategory(item._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {getCategories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Category;
