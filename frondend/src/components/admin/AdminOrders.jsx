import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import adminService from "../../services/adminService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { ORDER_STATUS, ORDER_STATUS_COLORS } from "../../utils/constants";
// import Pagination from "../../components/common/Pagination";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
      };
      const data = await adminService.getAllOrders(params);
      setOrders(data.orders);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Manage Orders</h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="h-4 w-4 inline mr-2" />
                Search Orders
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID, customer name, or email"
                className="input-amber"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="h-4 w-4 inline mr-2" />
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-amber"
              >
                <option value="">All Status</option>
                {Object.entries(ORDER_STATUS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                }}
                className="btn-amber-outline w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Order ID
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Customer
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Date
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Total
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-amber-50">
                        <td className="py-4 px-6">
                          <div className="font-mono font-bold">
                            {order.orderId}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium">
                              {order.shippingInfo.firstName}{" "}
                              {order.shippingInfo.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.shippingInfo.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-amber-600">
                            {formatCurrency(order.totalPrice)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`${
                                ORDER_STATUS_COLORS[order.status]
                              } flex items-center px-3 py-1 rounded-full text-sm font-medium`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-2">
                                {ORDER_STATUS[order.status.toUpperCase()]}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <a
                              href={`/admin/orders/${order._id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                            {/* Status Update Dropdown */}
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusUpdate(order._id, e.target.value)
                              }
                              className="px-3 py-1 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                              {Object.entries(ORDER_STATUS).map(
                                ([key, value]) => (
                                  <option key={key} value={key}>
                                    {value}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-amber-100 p-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
