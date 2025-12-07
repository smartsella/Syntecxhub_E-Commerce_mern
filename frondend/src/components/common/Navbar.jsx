import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Package,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
// import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const cartCount = getCartCount();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-200 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <button
              className="btn btn-ghost lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  Shop
                </span>
                <span className="text-gray-900">Now</span>
              </span>
            </Link>
          </div>

          {/* Center Nav (Desktop) */}
          <ul className="hidden lg:flex items-center gap-6 text-[15px] font-medium">
            <li>
              <Link to="/" className="hover:text-amber-600 transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/shop" className="hover:text-amber-600 transition">
                Shop
              </Link>
            </li>

            <li className="relative group">
              <span className="cursor-pointer hover:text-amber-600 transition">
                Categories
              </span>
              <ul className="absolute left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition bg-white border border-amber-200 rounded-lg shadow-md w-44 p-2 space-y-1">
                <li>
                  <Link
                    to="/shop?category=electronics"
                    className="block px-3 py-2 hover:bg-amber-50 rounded"
                  >
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?category=fashion"
                    className="block px-3 py-2 hover:bg-amber-50 rounded"
                  >
                    Fashion
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?category=home"
                    className="block px-3 py-2 hover:bg-amber-50 rounded"
                  >
                    Home & Garden
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?category=sports"
                    className="block px-3 py-2 hover:bg-amber-50 rounded"
                  >
                    Sports
                  </Link>
                </li>
              </ul>
            </li>

            {isAdmin && (
              <li>
                <Link to="/admin" className="hover:text-amber-600 transition">
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative btn btn-ghost btn-circle">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="dropdown dropdown-end">
                <div className="btn btn-ghost btn-circle avatar">
                  <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>

                <ul className="dropdown-content mt-3 p-4 shadow-xl bg-white border border-amber-100 rounded-lg w-56">
                  <li className="mb-2">
                    <div className="font-semibold text-gray-800">
                      {user?.name}
                    </div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </li>

                  <li>
                    <Link
                      to="/dashboard"
                      className="py-2 px-3 hover:bg-amber-50 rounded flex items-center"
                    >
                      <User size={16} className="mr-2" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/orders"
                      className="py-2 px-3 hover:bg-amber-50 rounded"
                    >
                      My Orders
                    </Link>
                  </li>

                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className="py-2 px-3 hover:bg-amber-50 rounded text-amber-600 font-medium"
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                  )}

                  <li>
                    <button
                      onClick={handleLogout}
                      className="py-2 px-3 hover:bg-red-50 rounded text-red-500 flex items-center w-full text-left"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 pb-5 bg-white border border-amber-200 rounded-xl shadow-md">
            <div className="p-4 space-y-3">
              <Link
                to="/"
                className="block py-2 px-3 hover:bg-amber-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block py-2 px-3 hover:bg-amber-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>

              <div>
                <div className="text-gray-700 font-medium mb-2">Categories</div>
                <div className="pl-3 space-y-2">
                  <Link
                    to="/shop?category=electronics"
                    className="block py-2 hover:text-amber-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Electronics
                  </Link>
                  <Link
                    to="/shop?category=fashion"
                    className="block py-2 hover:text-amber-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Fashion
                  </Link>
                  <Link
                    to="/shop?category=home"
                    className="block py-2 hover:text-amber-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home & Garden
                  </Link>
                </div>
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-3 px-4 hover:bg-amber-50 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-3 px-4 hover:bg-amber-50 rounded text-amber-600 font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block py-3 px-4 hover:bg-red-50 rounded text-red-500 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-3 px-4 border-2 border-amber-600 text-amber-600 rounded text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
