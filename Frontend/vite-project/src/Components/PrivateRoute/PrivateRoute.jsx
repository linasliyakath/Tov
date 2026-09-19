import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated || user?.role === "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
