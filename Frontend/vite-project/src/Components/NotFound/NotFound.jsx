import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gray-100 p-5">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-500 text-center mb-6">
        Sorry, the page you're looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
