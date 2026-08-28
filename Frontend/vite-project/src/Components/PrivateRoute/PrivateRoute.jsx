import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("auth") === "true";
    if (isAuth) {
      setAuth(true);
      return;
    }

    axios
      .get("/checkAuth", { withCredentials: true })
      .then((res) => setAuth(res.data.authenticated))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <p>Loading...</p>;
  if (auth === false) return <Navigate to="/login" replace />;

  return children;
}
