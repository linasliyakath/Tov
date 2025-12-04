import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const handleCart = async () => {
    try {
      const res = await axios.get('/cart/getCart');
      setCart(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    try {
      // Ensure quantity is not less than 1
      if (quantity < 1) return;
      
      await axios.put('/cart/updateCart', { productId, size, quantity });
      handleCart();
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (productId, size) => {
    try {
      await axios.delete('/cart/remove', { data: { productId, size } });
      handleCart();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCart();
  }, []);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <section className="min-h-screen bg-gray-50 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-10">My Cart</h1>
          <div className="bg-white rounded-lg shadow p-10 text-center text-gray-700 text-lg">
            Your cart is currently empty.
          </div>
        </div>
      </section>
    );
  }

  // Example: total calculation
  const cartTotal = cart.items.reduce((sum, item) => (
    item.productId && item.productId.price
      ? sum + item.productId.price * item.quantity
      : sum
  ), 0);

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">My Cart</h1>
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium text-sm md:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Continue shopping</span>
          </button>
        </div>

        {/* Table header (visible only on md screens and up) */}
        <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 text-gray-500 font-semibold text-sm">
          <div className="col-span-5">PRODUCT</div>
          <div className="col-span-2">PRICE</div>
          <div className="col-span-2">QTY</div>
          <div className="col-span-2 text-right">TOTAL</div>
          <div className="col-span-1"></div>
        </div>

        {/* Cart Items */}
        <div className="divide-y divide-gray-200">
          {cart.items.map((item) => (
            <div
              key={item._id}
              // Stack on mobile, use grid on desktop
              className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-4 items-center py-6"
            >
              {/* Product Info (col-span-full on mobile, col-span-5 on md) */}
              <div className="col-span-full md:col-span-5 flex items-center space-x-4">
                <img
                  alt={item.name}
                  src={item.productId && item.productId.image
                    ? `http://localhost:3000${item.productId.image}`
                    : 'https://via.placeholder.com/80'}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <div className="font-semibold text-base">{item.name}</div>
                  <div className="text-sm text-gray-600">Size: {item.size ? item.size.toUpperCase() : 'N/A'}</div>
                  {/* Price/Total on mobile */}
                  <div className="md:hidden mt-2 flex items-center space-x-4 text-sm">
                    <span className="font-medium text-gray-700">Price: ${item.productId ? item.productId.price.toFixed(2) : 'N/A'}</span>
                    <span className="font-semibold text-gray-900">Total: ${item.productId ? (item.productId.price * item.quantity).toFixed(2) : 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Price (col-span-2 on md - hidden on mobile as it's grouped above) */}
              <div className="hidden md:block md:col-span-2 font-medium text-gray-700 text-sm">
                ${item.productId ? item.productId.price.toFixed(2) : 'N/A'}
              </div>
              
              {/* Quantity (col-span-full on mobile, col-span-2 on md) */}
              <div className="col-span-full flex justify-between items-center md:col-span-2">
                <span className="text-sm font-medium text-gray-700 md:hidden">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded w-24 h-8 text-gray-700">
                  <button
                    disabled={item.quantity <= 1}
                    className="flex-1 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => updateQuantity(item.productId._id || item.productId, item.size, item.quantity - 1)}
                  >
                    –
                  </button>
                  <div className="flex-1 text-center">{item.quantity}</div>
                  <button
                    className="flex-1 hover:bg-gray-200"
                    onClick={() => updateQuantity(item.productId._id || item.productId, item.size, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total (col-span-2 on md - hidden on mobile as it's grouped with price) */}
              <div className="hidden md:block md:col-span-2 font-semibold text-gray-900 text-right">
                ${item.productId ? (item.productId.price * item.quantity).toFixed(2) : 'N/A'}
              </div>

              {/* Remove Button (col-span-full on mobile, col-span-1 on md) */}
              <div className="col-span-full flex justify-end md:col-span-1">
                <button
                  className="text-red-500 hover:text-red-700 font-medium text-sm p-1" // Adjusted styling for a text button
                  onClick={() => removeItem(item.productId._id || item.productId, item.size)}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Proceed to Checkout Button */}
        <div className="flex flex-col md:flex-row justify-end items-center mt-8 pt-4 border-t border-gray-200">
          <div className="text-xl font-semibold text-gray-800 mr-0 mb-4 md:mr-6 md:mb-0">
            Total: <span className="text-black">${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full md:w-auto px-8 py-3 bg-black text-white text-lg font-semibold rounded hover:bg-gray-800 transition-colors active:scale-95"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;