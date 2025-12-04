import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Category from "./CategoryManage";
import Products from "./ProductsManage";
import Orders from "./OrdersManage";
import UsersManage from "./UsersManage";

const AdminDashboard = () => {
  const { section } = useParams();
  
  const navigate = useNavigate();

  const activeSection = section || "products"; // default to "products"

  const handleClick = (sectionName) => {
    navigate(`/adminDashboard/${sectionName.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 md:flex-row pt-16"> 
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-100 text-black flex flex-col">
        <h2 className="text-2xl font-bold p-6 border-b border-gray-300">Admin</h2>
        <nav className="flex flex-row md:flex-col mt-4 overflow-x-auto md:overflow-visible">
          {["Products", "Orders", "Users", "Categories"].map((sectionName) => (
            <button
              key={sectionName}
              className={`text-left px-6 py-3 hover:bg-white transition ${
                activeSection === sectionName.toLowerCase()
                  ? "bg-white font-semibold"
                  : ""
              }`}
              onClick={() => handleClick(sectionName)}
            >
              {sectionName}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6">
        {activeSection === "products" && <Products />}
        {activeSection === "orders" && <Orders />}
        {activeSection === "users" && <UsersManage />}
        {activeSection === "categories" && <Category />}
      </main>
    </div>
  );
};

export default AdminDashboard;
