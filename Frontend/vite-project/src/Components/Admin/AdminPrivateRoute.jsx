import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../../api/axios";

const AdminPrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:3000/check-session", {
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
  }, []);

  if (loading) return <p>Checking Admin Session...</p>;

  return allowed ? children : <Navigate to="/admin" replace />;
};

export default AdminPrivateRoute;
