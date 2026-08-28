import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const AdminPrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      const storedAdmin = localStorage.getItem("adminUser");
      if (storedAdmin || (user && user.role === "admin")) {
        setAllowed(true);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/check-session", {
          withCredentials: true,
        });

        if (res.data.loggedInAs === "admin") {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      } catch (err) {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [user]);

  if (loading) return <p>Checking Admin Session...</p>;

  return allowed ? children : <Navigate to="/admin" replace />;
};

export default AdminPrivateRoute;
