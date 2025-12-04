import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
axios.defaults.withCredentials = true;

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/admin/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.message === "Admin Logged In") {
        // Update AuthContext state for admin
        login({
          name: res.data.admin.name || res.data.admin.email,
          role: "admin",
        });

        navigate("/adminDashboard");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error, "admin login failed");
      alert("Invalid admin credentials!");
    }
  };

  return (
    <div className="min-h-[41.5em] p-5 flex items-center justify-center bg-gray">
      <div className="w-full max-w-md p-8 bg-white shadow">
        <h2 className="text-3xl font-bold mb-2">Admin Login</h2>
        <p className="text-gray-500 mb-6">Please enter your admin credentials.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full px-4 py-2 rounded-md bg-black text-white font-semibold text-lg hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
