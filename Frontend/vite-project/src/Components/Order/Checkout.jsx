import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "cod",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('/cart/getCart');
        setCart(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCart();
  }, []);

  const totalAmount = cart && cart.items
    ? cart.items.reduce(
        (sum, item) =>
          item.productId && item.productId.price
            ? sum + item.productId.price * item.quantity
            : sum,
        0
      )
    : 0;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleOrderClick = async (e) => {
    e.preventDefault();

    // SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Confirm Order',
      text: 'Are you sure you want to place this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, place order',
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aaa',
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axios.post('/order/placeOrder', {
          ...form,
          total: totalAmount,
        });
        Swal.fire({
          icon: 'success',
          title: 'Order placed successfully!',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        navigate('/userDashboard');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to place order',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Restored bottom padding for general spacing. Top padding remains to clear the fixed navbar. */}
      <section className="min-h-screen bg-gray-50 pt-24 pb-12 md:pt-32 font-grotesk">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row bg-white rounded-lg shadow p-6 md:p-10 gap-8 md:gap-12">
          {/* FORM SIDE */}
          {/* We keep the form here, but the submit button for desktop is *inside* and for mobile is *outside* (in the summary). */}
          <form className="md:w-7/12" onSubmit={handleOrderClick} id="checkout-form">
            <h2 className="text-2xl font-grotesk font-semibold mb-8">PERSONAL INFORMATION</h2>
            <div className="space-y-7 mb-10">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={form.name}
                onChange={handleChange}
                className="border-b border-gray-400 focus:border-black outline-none pb-2 w-full font-grotesk"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                required
                value={form.address}
                onChange={handleChange}
                className="border-b border-gray-400 focus:border-black outline-none pb-2 w-full font-grotesk"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                value={form.phone}
                onChange={handleChange}
                className="border-b border-gray-400 focus:border-black outline-none pb-2 w-full font-grotesk"
              />
            </div>
            <h2 className="text-2xl font-grotesk font-semibold mb-8">PAYMENT</h2>
            <div className="mb-8">
              <label className="flex items-center gap-2 font-medium font-grotesk">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.payment === "cod"}
                  className="accent-black"
                />
                Cash on Delivery (COD)
              </label>
            </div>
            {/* Desktop Button: Keep this button visible only on desktop/md screens. */}
            <button
              type="submit"
              disabled={loading}
              className="hidden md:block w-auto px-8 py-3 bg-black text-white text-lg font-medium rounded hover:bg-gray-800 transition font-grotesk disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            <p className="hidden md:block mt-2 text-xs text-gray-500 text-left font-grotesk">
              By continuing, you agree to the Public Offer and Privacy Policy.
            </p>
          </form>

          {/* CART SUMMARY SIDE */}
          <div className="md:w-5/12 flex flex-col gap-8 font-grotesk">
            <h2 className="text-2xl font-grotesk font-semibold mb-2 md:hidden">ORDER SUMMARY</h2>
            {cart && cart.items && cart.items.length > 0 ? (
              <>
                <div className="space-y-4">
                  {cart.items.map(item => (
                    <div key={item._id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                      <img
                        src={item.productId && item.productId.image
                          ? `http://localhost:3000${item.productId.image}`
                          : "https://via.placeholder.com/64"}
                        alt={item.name}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="grow">
                        <div className="font-grotesk font-medium text-base">{item.name}</div>
                        <div className="text-xs text-gray-500 font-grotesk mt-1">
                          Qty: {item.quantity} | Size: {item.size.toUpperCase()}
                        </div>
                      </div>
                      <div className="font-grotesk text-gray-900 font-semibold text-base whitespace-nowrap">
                        {item.productId && item.productId.price
                          ? `$${(item.productId.price * item.quantity).toFixed(2)}`
                          : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-base space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">$0.00</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t font-grotesk font-bold text-xl">
                    <span>Total Amount:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {/* MOBILE BUTTON: Placed directly under the Total Amount for mobile view */}
                  <div className="mt-6 block md:hidden">
                    <button
                      // The button needs to be linked to the form using the 'form' attribute since it's outside the form structure.
                      form="checkout-form"
                      type="submit"
                      disabled={loading}
                      className="w-full px-8 py-3 bg-black text-white text-lg font-medium rounded hover:bg-gray-800 transition font-grotesk disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleOrderClick}
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                    <p className="mt-2 text-xs text-gray-500 text-center font-grotesk">
                      By continuing, you agree to the Public Offer and Privacy Policy.
                    </p>
                  </div>
                  
                </div>
              </>
            ) : (
              <div className="text-gray-600">Your cart is empty. Please add items to proceed.</div>
            )}
          </div>
        </div>
      </section>
      {/* The sticky mobile bar section has been completely removed. */}
    </>
  );
};
export default Checkout;