import React, { useState, useEffect } from "react";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import adminService from "../../services/adminService";
import { formatCurrency } from "../../utils/formatters";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("today");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await adminService.getDashboardStats();
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  const dashboardStats = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: <DollarSign className="h-6 w-6" />,
      change: "+12.5%",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <Package className="h-6 w-6" />,
      change: "+8.2%",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: <ShoppingBag className="h-6 w-6" />,
      change: "+5.1%",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: <Users className="h-6 w-6" />,
      change: "+15.3%",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "order",
      message: "New order #ORD-2024-12345",
      time: "2 min ago",
    },
    {
      id: 2,
      type: "product",
      message: 'Product "Wireless Headphones" updated',
      time: "15 min ago",
    },
    { id: 3, type: "user", message: "New user registered", time: "1 hour ago" },
    {
      id: 4,
      type: "order",
      message: "Order #ORD-2024-12344 shipped",
      time: "2 hours ago",
    },
    {
      id: 5,
      type: "product",
      message: 'New product added "Smart Watch"',
      time: "3 hours ago",
    },
  ];

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Here's what's happening with your store
            today.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-end mb-6">
          <div className="flex border border-amber-200 rounded-lg overflow-hidden">
            {["today", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium capitalize ${
                  timeRange === range
                    ? "bg-amber-600 text-white"
                    : "text-gray-700 hover:bg-amber-50"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
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
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts and Recent Data */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-amber-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Revenue Overview</h2>
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div className="h-64 flex items-center justify-center bg-amber-50 rounded-lg">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                <p className="text-gray-600">Revenue chart will appear here</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-amber-100 p-6">
            <h2 className="text-xl font-bold mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "order"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "product"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {activity.type === "order" && (
                      <Package className="h-4 w-4" />
                    )}
                    {activity.type === "product" && (
                      <ShoppingBag className="h-4 w-4" />
                    )}
                    {activity.type === "user" && <Users className="h-4 w-4" />}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/products/new"
              className="bg-gradient-to-r from-amber-600 to-orange-500 text-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow"
            >
              <ShoppingBag className="h-8 w-8 mx-auto mb-3" />
              <div className="font-semibold">Add Product</div>
            </a>
            <a
              href="/admin/orders"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow"
            >
              <Package className="h-8 w-8 mx-auto mb-3" />
              <div className="font-semibold">Manage Orders</div>
            </a>
            <a
              href="/admin/users"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow"
            >
              <Users className="h-8 w-8 mx-auto mb-3" />
              <div className="font-semibold">View Users</div>
            </a>
            <a
              href="/admin/settings"
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow"
            >
              <Settings className="h-8 w-8 mx-auto mb-3" />
              <div className="font-semibold">Settings</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
