import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Eagerly load only the things visible on every page
import Navbar from "./Navbar";
import Footer from "./Components/Footer.jsx";

// Lazy-load every route — only downloaded when the user navigates there
const Head         = lazy(() => import("./Components/Intro.jsx"));
const User         = lazy(() => import("./Components/Auth/User.jsx"));
const Login        = lazy(() => import("./Components/Auth/Login.jsx"));
const Register     = lazy(() => import("./Components/Auth/Register.jsx"));
const ProductCard  = lazy(() => import("./Components/Products/ProductCard.jsx"));
const ProductDetails = lazy(() => import("./Components/Products/ProductDetails.jsx"));
const Cart         = lazy(() => import("./Components/Cart/Cart.jsx"));
const Checkout     = lazy(() => import("./Components/Order/Checkout.jsx"));
const ViewOrder    = lazy(() => import("./Components/Order/ViewOrder.jsx"));
const AdminLogin   = lazy(() => import("./Components/Admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./Components/Admin/AdminDashboard.jsx"));
const AdminPrivateRoute = lazy(() => import("./Components/Admin/AdminPrivateRoute.jsx"));
const PrivateRoute = lazy(() => import("./Components/PrivateRoute/PrivateRoute.jsx"));
const NotFound     = lazy(() => import("./Components/NotFound/NotFound.jsx"));

// Tiny page-transition spinner shown while a lazy chunk is downloading
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Navbar />
        </ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"               element={<Head />} />
            <Route path="/category/:categoryId" element={<ProductCard />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/register"       element={<Register />} />
            <Route path="/userDashboard"  element={<User />} />
            <Route path="/admin"          element={<AdminLogin />} />
            <Route path="/product/:id"    element={<ProductDetails />} />

            {/* Redirect /adminDashboard → /adminDashboard/products */}
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
        </Suspense>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
