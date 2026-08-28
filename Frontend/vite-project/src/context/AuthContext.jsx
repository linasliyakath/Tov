import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);  // <-- STORE USER HERE
  const [loading, setLoading] = useState(true);

  // Check auth status on refresh
  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check local storage first (Fallback for cross-origin cookie blocks)
      const isAuth = localStorage.getItem("auth") === "true";
      const storedName = localStorage.getItem("name");
      const storedRole = localStorage.getItem("role");
      
      if (isAuth) {
        setIsAuthenticated(true);
        setUser({
          name: storedName,
          role: storedRole,
        });
      }

      // 2. Then check with backend to ensure session is truly valid (if cookies work)
      try {
        const res = await axios.get("/checkAuth", {
          withCredentials: true,
        });

        if (res.data.authenticated) {
          setIsAuthenticated(true);
          setUser({
            name: res.data.name,
            role: res.data.role,
          });
          localStorage.setItem("auth", "true");
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("role", res.data.role);
        } else if (!isAuth) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
        // If backend fails but local storage says auth=true, we keep the local state 
        // to avoid logging out just because of a cross-origin cookie block
        if (!isAuth) {
          setIsAuthenticated(false);
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Called after successful login
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);  // store name + role
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
