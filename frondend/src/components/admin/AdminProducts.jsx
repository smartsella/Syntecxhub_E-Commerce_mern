import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react";
import adminService from "../../services/adminService";
import { formatCurrency } from "../../utils/formatters.js";
// import Pagination from "../../components/common/Pagination";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        category: selectedCategory,
      };
      const data = await adminService.getAllProducts(params);
      setProducts(data.products);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await adminService.deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Products</h1>
            <p className="text-gray-600">
              View and manage all products in your store
            </p>
          </div>
          <Link to="/admin/products/new" className="btn-amber mt-4 md:mt-0">
            <Plus className="h-5 w-5 mr-2" />
            Add New Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="h-4 w-4 inline mr-2" />
                Search Products
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, SKU, or description"
                className="input-amber"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="h-4 w-4 inline mr-2" />
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-amber"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="btn-amber-outline w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No products found</p>
              <Link
                to="/admin/products/new"
                className="btn-amber mt-4 inline-block"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Product
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Category
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Price
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Stock
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
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-amber-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                product.images?.[0]?.url || "/placeholder.jpg"
                              }
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">
                                SKU: {product.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="badge-amber">
                            {product.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-amber-600">
                            {formatCurrency(product.price)}
                          </div>
                          {product.discountPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatCurrency(product.discountPrice)}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              product.stock > 10
                                ? "bg-green-100 text-green-800"
                                : product.stock > 0
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <Link
                              to={`/product/${product._id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              target="_blank"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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

export default AdminProducts;
