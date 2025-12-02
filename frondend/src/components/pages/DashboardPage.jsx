import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Package,
  CreditCard,
  Settings,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Edit,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import orderService from "../../services/orderService.js";
import { formatCurrency, formatDate } from "../../utils/formatters.js";
import { ORDER_STATUS, ORDER_STATUS_COLORS } from "../../utils/constants.js";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await orderService.getOrders({ limit: 5 });
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: <Package className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Spent",
      value: formatCurrency(
        orders.reduce((total, order) => total + order.totalPrice, 0)
      ),
      icon: <CreditCard className="h-8 w-8" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Pending Orders",
      value: orders.filter((o) => o.status === "pending").length,
      icon: <Package className="h-8 w-8" />,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Completed Orders",
      value: orders.filter((o) => o.status === "delivered").length,
      icon: <Package className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Here's what's happening with your
            account.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 sticky top-24">
              {/* Profile Summary */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
                <div className="mt-3">
                  <span className="badge-amber">
                    {user?.role === "admin" ? "Admin" : "Customer"}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    activeTab === "overview"
                      ? "bg-amber-100 text-amber-600 font-semibold"
                      : "text-gray-700 hover:bg-amber-50"
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    activeTab === "orders"
                      ? "bg-amber-100 text-amber-600 font-semibold"
                      : "text-gray-700 hover:bg-amber-50"
                  }`}
                >
                  <Package className="h-5 w-5 mr-3" />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    activeTab === "addresses"
                      ? "bg-amber-100 text-amber-600 font-semibold"
                      : "text-gray-700 hover:bg-amber-50"
                  }`}
                >
                  <MapPin className="h-5 w-5 mr-3" />
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    activeTab === "settings"
                      ? "bg-amber-100 text-amber-600 font-semibold"
                      : "text-gray-700 hover:bg-amber-50"
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Account Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 rounded-lg flex items-center text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm border border-amber-100 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}
                        >
                          <div className="text-white">{stat.icon}</div>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                      <p className="text-gray-600">{stat.title}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Recent Orders</h2>
                    <Link
                      to="/dashboard/orders"
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      View All
                    </Link>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No orders yet</p>
                      <Link to="/shop" className="btn-amber mt-4 inline-block">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-amber-100">
                            <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                              Order ID
                            </th>
                            <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                              Date
                            </th>
                            <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                              Total
                            </th>
                            <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr
                              key={order._id}
                              className="border-b border-amber-50 hover:bg-amber-50"
                            >
                              <td className="py-4 px-4">
                                <div className="font-medium">
                                  {order.orderId}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                {formatDate(order.createdAt)}
                              </td>
                              <td className="py-4 px-4 font-semibold">
                                {formatCurrency(order.totalPrice)}
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className={`badge ${
                                    ORDER_STATUS_COLORS[order.status]
                                  }`}
                                >
                                  {ORDER_STATUS[order.status.toUpperCase()]}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <Link
                                  to={`/order/${order._id}`}
                                  className="text-amber-600 hover:text-amber-700 font-medium"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Account Information */}
                <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
                  <h2 className="text-xl font-bold mb-6">
                    Account Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-amber-600" />
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Full Name</div>
                          <div className="font-medium">{user?.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <div className="font-medium">{user?.email}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Phone</div>
                          <div className="font-medium">
                            {user?.phone || "Not set"}
                          </div>
                        </div>
                      </div>
                      <button className="btn-amber-outline mt-4">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                        Default Shipping Address
                      </h3>
                      {user?.shippingAddress ? (
                        <div className="space-y-3">
                          <div className="font-medium">
                            {user.shippingAddress.street}
                          </div>
                          <div>
                            {user.shippingAddress.city},{" "}
                            {user.shippingAddress.state}{" "}
                            {user.shippingAddress.zipCode}
                          </div>
                          <div>{user.shippingAddress.country}</div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {user.phone}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600">No address saved</p>
                      )}
                      <button className="btn-amber-outline mt-4">
                        <Edit className="h-4 w-4 mr-2" />
                        Manage Addresses
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
                <h2 className="text-xl font-bold mb-6">My Orders</h2>
                {/* Orders content would go here */}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
                <h2 className="text-xl font-bold mb-6">My Addresses</h2>
                {/* Addresses content would go here */}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
                <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                {/* Settings content would go here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
