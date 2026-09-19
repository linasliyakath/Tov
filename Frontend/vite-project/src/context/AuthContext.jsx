import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const storedUser = readStoredUser();
  const hasToken = Boolean(localStorage.getItem("authToken"));
  const [isAuthenticated, setIsAuthenticated] = useState(hasToken && Boolean(storedUser));
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const res = await axios.get("/checkAuth", { withCredentials: true });

        if (res.data.authenticated) {
          const nextUser = {
            id: res.data.id,
            name: res.data.name,
            role: res.data.role,
          };
          setIsAuthenticated(true);
          setUser(nextUser);
          localStorage.setItem("authUser", JSON.stringify(nextUser));
        } else if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("authUser");
        }
      } catch {
        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
