import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Components/Auth/Login.jsx";
import Register from "./Components/Auth/Register.jsx";
import Head from "./Components/Intro.jsx";
import User from "./Components/Auth/User.jsx";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute.jsx";
import AdminLogin from "./Components/Admin/AdminLogin.jsx";
import AdminDashboard from "./Components/Admin/AdminDashboard.jsx";
import AdminPrivateRoute from "./Components/Admin/AdminPrivateRoute.jsx";
import Cart from "./Components/Cart/Cart.jsx";
import ProductDetails from "./Components/Products/ProductDetails.jsx";
import Footer from "./Components/Footer.jsx";
import Checkout from "./Components/Order/Checkout.jsx";
import ViewOrder from "./Components/Order/ViewOrder.jsx";
import ProductCard from "./Components/Products/ProductCard.jsx";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary.jsx";
import {AuthProvider} from './context/AuthContext.jsx'
import NotFound from "./Components/NotFound/NotFound.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          {" "}
          <Navbar />{" "}
        </ErrorBoundary>
        <Routes>
          <Route path="/" element={<Head />} />
          <Route path="/category/:categoryId" element={<ProductCard />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userDashboard" element={<User />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Redirect /adminDashboard to /adminDashboard/products */}
          <Route
            path="/adminDashboard"
            element={<Navigate to="/adminDashboard/products" replace />}
          />
          <Route
            path="/adminDashboard/:section"
            element={
              <AdminPrivateRoute>
                <AdminDashboard />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="/Cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route
            path="/Checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/myOrders"
            element={
              <PrivateRoute>
                <ViewOrder />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
