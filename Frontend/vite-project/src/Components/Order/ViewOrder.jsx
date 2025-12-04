import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";   // ✅ ADDED

const statusColors = {
  Delivered: "text-green-600 bg-green-50",
  Cancelled: "text-red-600 bg-red-50",
  Pending: "text-yellow-600 bg-yellow-50",
};

const ViewOrder = () => {
  const navigate = useNavigate();   // ✅ ADDED
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/order/getOrders");
        setOrders(res.data.reverse());
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to cancel this order?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/order/cancelOrder/${orderId}`);
        setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
        Swal.fire({
          icon: 'success',
          title: 'Order Canceled',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        console.error("Failed to cancel order:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error canceling order',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    }
  };

  return (
<section className="min-h-screen bg-gray-50 py-8 pt-24 font-grotesk">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-8">

        {/* ✅ Back Button Added */}
        <button
          onClick={() => navigate("/userDashboard")}
          className="mb-5 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back
        </button>

        <h1 className="text-2xl md:text-3xl font-semibold mb-7 font-grotesk">
          My Orders
        </h1>

        {loading && (
          <div className="text-center py-8 text-gray-500 font-grotesk">
            Loading...
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-8 text-gray-500 font-grotesk">
            No orders found.
          </div>
        )}

        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border-b pb-6 mb-6 last:border-b-0 font-grotesk"
            >
              <div className="mb-2 flex flex-wrap justify-between items-center">
                <span className="text-base md:text-lg font-semibold text-gray-700">
                  Order #{order._id}
                </span>
                <span
                  className={`px-3 py-1 text-sm rounded font-medium ${
                    statusColors[order.status] ||
                    "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mb-3 text-gray-500 text-sm">
                Placed by: <span className="font-medium">{order.shippingInfo?.name}</span>, {order.email}
              </div>

              <div className="mb-2 text-gray-700 text-sm">
                Address: {order.shippingInfo?.address}
              </div>

              <div className="mb-2 text-gray-700 text-sm">
                Phone: {order.shippingInfo?.phone}
              </div>

              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 items-center p-4 border rounded-lg shadow-sm mb-4 bg-gray-50"
                >
                  <img
                    src={
                      item.product && item.product.image
                        ? `http://localhost:3000${item.product.image}`
                        : "https://via.placeholder.com/80?text=No+Image"
                    }
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div className="grow">
                    <div className="text-base font-semibold">
                      {item.product ? item.product.name : item.name}
                    </div>

                    <div className="text-gray-500 text-sm">
                      Size: {item.size}, Qty: {item.quantity}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className={`mb-2 px-2 py-1 rounded text-xs ${
                        statusColors[order.status] ||
                        "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}

              <div className="text-gray-900 font-semibold text-base mt-2">
                Total Amount: ₹{order.totalAmount}
              </div>

              {order.status !== "delivered" && (
                <button
                  className="ml-1 mt-3 px-6 py-2 bg-black text-white font-grotesk rounded font-medium hover:bg-gray-800 transition"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ViewOrder;
