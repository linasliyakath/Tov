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
      try {
        const res = await axios.get("/checkAuth", {
          withCredentials: true,
        });

        setIsAuthenticated(res.data.authenticated);

        if (res.data.authenticated) {
          setUser({
            name: res.data.name,
            role: res.data.role,
          });
        } else {
          setUser(null);
        }

      } catch {
        setIsAuthenticated(false);
        setUser(null);
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
