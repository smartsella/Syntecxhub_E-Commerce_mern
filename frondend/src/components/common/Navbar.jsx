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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-amber-100">
      <div className="container-custom">
        <div className="navbar py-4">
          {/* Mobile Menu Button */}
          <div className="navbar-start">
            <button
              className="btn btn-ghost lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="ml-2">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    Shop
                  </span>
                  <span className="text-gray-800">Now</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 space-x-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-amber-600 font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-gray-700 hover:text-amber-600 font-medium"
                >
                  Shop
                </Link>
              </li>
              <li>
                <details>
                  <summary className="text-gray-700 hover:text-amber-600 font-medium">
                    Categories
                  </summary>
                  <ul className="p-2 bg-white shadow-xl border border-amber-100 rounded-lg w-48">
                    <li>
                      <Link
                        to="/shop?category=electronics"
                        className="hover:text-amber-600"
                      >
                        Electronics
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?category=fashion"
                        className="hover:text-amber-600"
                      >
                        Fashion
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?category=home"
                        className="hover:text-amber-600"
                      >
                        Home & Garden
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?category=sports"
                        className="hover:text-amber-600"
                      >
                        Sports
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-amber-600 font-medium"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Search Bar (Desktop) */}
          {/* <div className="navbar-center hidden lg:flex flex-1 max-w-xl mx-4">
            <SearchBar />
          </div> */}

          {/* User Actions */}
          <div className="navbar-end space-x-2">
            {/* Search (Mobile) */}
            <div className="dropdown dropdown-end lg:hidden">
              <button className="btn btn-ghost btn-circle">
                <Search size={20} />
              </button>
              {/* <div className="dropdown-content mt-3 p-4 shadow-xl bg-white border border-amber-100 rounded-box w-80">
                <SearchBar />
              </div> */}
            </div>

            {/* Cart */}
            <Link to="/cart" className="btn btn-ghost btn-circle relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="dropdown dropdown-end">
                <div className="btn btn-ghost btn-circle avatar">
                  <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <ul className="dropdown-content mt-3 p-4 shadow-xl bg-white border border-amber-100 rounded-box w-56">
                  <li className="p-2">
                    <div className="font-semibold text-gray-800">
                      {user?.name}
                    </div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </li>
                  <div className="divider my-2"></div>
                  <li>
                    <Link
                      to="/dashboard"
                      className="py-2 px-3 hover:bg-amber-50 rounded-lg flex items-center"
                    >
                      <User size={16} className="mr-2" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/orders"
                      className="py-2 px-3 hover:bg-amber-50 rounded-lg"
                    >
                      My Orders
                    </Link>
                  </li>
                  {isAdmin && (
                    <>
                      <div className="divider my-2"></div>
                      <li>
                        <Link
                          to="/admin"
                          className="py-2 px-3 hover:bg-amber-50 rounded-lg text-amber-600 font-medium"
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                    </>
                  )}
                  <div className="divider my-2"></div>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="py-2 px-3 hover:bg-red-50 rounded-lg text-red-500 w-full text-left flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn-amber">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 pb-6 bg-white border border-amber-100 rounded-xl shadow-lg">
            <div className="p-4 space-y-3">
              <Link
                to="/"
                className="block py-3 px-4 hover:bg-amber-50 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block py-3 px-4 hover:bg-amber-50 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <div className="px-4">
                <div className="font-medium text-gray-700 mb-2">Categories</div>
                <div className="pl-4 space-y-2">
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
                  <div className="divider"></div>
                  <Link
                    to="/dashboard"
                    className="block py-3 px-4 hover:bg-amber-50 rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-3 px-4 hover:bg-amber-50 rounded-lg font-medium text-amber-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block py-3 px-4 hover:bg-red-50 rounded-lg font-medium text-red-500 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="divider"></div>
                  <Link
                    to="/login"
                    className="block py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-3 px-4 border-2 border-amber-600 text-amber-600 rounded-lg font-medium text-center"
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
