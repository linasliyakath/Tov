import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Swal from 'sweetalert2'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

const getAllOrders = async () => {
  setLoading(true);
  try {
    const res = await axios.get("/admin/getOrders", {
      withCredentials: true,
    });

    // newest first
    setOrders(res.data.reverse());
  } catch (error) {
    console.log(error, "error fetching orders admin side");
  }
  setLoading(false);
};


  // UPDATE STATUS
// UPDATE STATUS with SweetAlert2
const handleStatusChange = async (id, newStatus) => {
  const result = await Swal.fire({
    title: "Update Order Status?",
    text: `Change status to "${newStatus}"?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, update!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#000",
  });

  if (!result.isConfirmed) return;

  try {
    await axios.put(
      `/admin/updateStatus/${id}`,
      { status: newStatus },
      { withCredentials: true }
    );

    setOrders((prev) =>
      prev.map((o) =>
        o._id === id ? { ...o, status: newStatus } : o
      )
    );

    Swal.fire({
      title: "Updated!",
      text: "Order status has been changed.",
      icon: "success",
      confirmButtonColor: "#000",
    });
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Failed to update order status",
      icon: "error",
      confirmButtonColor: "#000",
    });
  }
};


  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg overflow-x-auto p-4 sm:p-6">
      <h1 className="text-2xl font-semibold mb-6">All Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No orders found</p>
      ) : (
        <table className="w-full min-w-[350px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                User Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Items
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Shipping Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Total Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-3 text-sm text-gray-700 break-all">
                  {order._id}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700 break-all">
                  {order.email || order.user}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item._id}>
                        {item.name} — Qty: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {order.shippingInfo.name}
                </td>

                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  ${order.totalAmount}
                </td>

                {/* STATUS DROPDOWN */}
                <td className="px-4 py-3 text-sm text-gray-700">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border rounded px-2 py-1 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
