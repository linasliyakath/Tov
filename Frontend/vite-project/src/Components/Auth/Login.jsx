import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
axios.defaults.withCredentials = true;

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );

if (res.data.message === "User Logged In") {

  login({
    name: res.data.name,
    role: res.data.role,
  });

  localStorage.setItem("role", res.data.role);
  localStorage.setItem("name", res.data.name);
  localStorage.setItem("auth", "true");   

  navigate("/userDashboard");
}
 else {
        alert(res.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("Your account has been disabled by the admin.");
      } else {
        alert("Invalid email or password!");
      }
      console.log(error, "login failed");
    }
  };

  return (
    <div className="min-h-[41.5em] p-5 flex items-center justify-center bg-gray">
      <div className="w-full max-w-md p-8 bg-white shadow">
        <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
        <p className="text-gray-500 mb-6">
          Welcome back! Please enter your details.
        </p>

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
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
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

          <div className="flex items-center my-2">
            <div className="grow border-t border-gray-200"></div>
          </div>

          <p className="text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-black hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
