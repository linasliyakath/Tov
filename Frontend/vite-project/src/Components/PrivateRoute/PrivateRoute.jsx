import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

axios.defaults.withCredentials = true;

export default function PrivateRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios
      .get("/checkAuth", { withCredentials: true })
      .then((res) => setAuth(res.data.authenticated))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <p>Loading...</p>;
  if (auth === false) return <Navigate to="/login" replace />;

  return children;
}
