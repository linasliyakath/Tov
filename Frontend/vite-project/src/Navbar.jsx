import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import axios from "./api/axios";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const debounceRef = useRef();

  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const name = user?.name;
  const role = user?.role;

  // Debounced search function
  const debouncedSearch = useCallback((query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          `/product/search?q=${encodeURIComponent(query)}`
        );
        setSearchResults(response.data.slice(0, 5)); // Show top 5 results
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  // Search on text change
  useEffect(() => {
    debouncedSearch(searchText);
    return () => clearTimeout(debounceRef.current);
  }, [searchText, debouncedSearch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.delete("/admin/logout", { withCredentials: true });
      logout();
      navigate("/");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
    } catch (error) {
      console.log(error);
    }
  };

  const handleResultClick = (productId) => {
    setShowSearch(false);
    setSearchText("");
    setSearchResults([]);
    navigate(`/product/${productId}`);
  };

  return (
    <section
      className="fixed top-0 left-0 right-0 h-12 flex w-screen 
items-center justify-between px-5 font-grotesk bg-white z-999 shadow-md"
    >
      {/* Left side: Cart + Search */}
      <div className="flex items-center gap-4">
        {/* Hide Cart icon for admin */}
        {role !== "admin" && (
          <Link to="/Cart">
            <button>
              <img
                className="h-7 cursor-pointer"
                src="/assets/shopping-bag.png"
                alt="Cart"
              />
            </button>
          </Link>
        )}

        {/* Search container */}
        {/* Search container - hide for admin */}
        {role !== "admin" && (
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => setShowSearch((prev) => !prev)}
              className="flex items-center p-1 -m-1 z-50"
            >
              <img
                className="h-5 cursor-pointer"
                src="/assets/search-interface-symbol (1).png"
                alt="Search"
              />
            </button>

            {showSearch && (
              <>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search products..."
                  className="absolute left-8 top-1/2 transform -translate-y-1/2 w-48 border-b border-gray-300 outline-none bg-white text-sm placeholder-gray-400 py-1 px-2 focus:border-black focus:w-64 transition-all duration-200 z-50"
                  autoFocus
                />

                {(searchResults.length > 0 || loading) && (
                  <div className="absolute left-0 top-full w-64 bg-white border border-gray-200 shadow-lg mt-2 py-2 z-50 max-h-80 overflow-y-auto">
                    {loading && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Searching...
                      </div>
                    )}

                    {searchResults.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleResultClick(product._id)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 flex items-center gap-3"
                      >
                        <img
                          src={`http://localhost:3000${product.image}`}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ${product.price}
                          </div>
                        </div>
                      </button>
                    ))}

                    {searchResults.length === 0 &&
                      !loading &&
                      searchText.length >= 2 && (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No products found
                        </div>
                      )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Logo */}
      <p className="text-2xl font-grotesk">
        <Link to="/">
          <span className="cursor-pointer">TOV</span>
        </Link>
      </p>

      {/* User menu - unchanged */}
      <div className="flex items-center relative">
        {isAuthenticated && name && (
          <span className="mr-2 font-semibold text-gray-700">{name}</span>
        )}
        <button
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <img
            className="h-7 cursor-pointer"
            src="/assets/user-avatar.png"
            alt="User"
          />
        </button>
        {open && (
          <div
            ref={menuRef}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="absolute right-0 top-10 w-40 bg-white shadow-lg rounded-xl py-2 z-50 font-grotesk"
          >
            {!isAuthenticated && (
              <>
                <button className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100">
                  <Link to="/login">Login</Link>
                </button>
                <button className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100">
                  <Link to="/register">Register</Link>
                </button>
              </>
            )}
            {isAuthenticated && (
              <>
                {role === "user" && (
                  <button
                    className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setOpen(false);
                      navigate("/myOrders");
                    }}
                  >
                    My Orders
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Navbar;
