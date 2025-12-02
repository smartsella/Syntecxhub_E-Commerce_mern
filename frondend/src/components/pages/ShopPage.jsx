import React, { useState, useEffect } from "react";
import { Filter, Grid, List, ChevronDown, X } from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import FilterSidebar from "../components/products/FilterSidebar";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import productService from "../services/productService";
import { SORT_OPTIONS } from "../utils/constants";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters state
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    page: 1,
    limit: 12,
    search: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(filters),
          productService.getCategories(),
        ]);

        setProducts(productsData.data);
        setTotalProducts(
          productsData.pagination?.total || productsData.data.length
        );
        setCategories(categoriesData);

        // Extract brands from products
        const uniqueBrands = [
          ...new Set(productsData.data.map((p) => p.brand)),
        ];
        setBrands(uniqueBrands.map((brand) => ({ name: brand })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePriceChange = (min, max) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min || "",
      maxPrice: max || "",
      page: 1,
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => ({ ...prev, category: categoryId, page: 1 }));
  };

  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
      page: 1,
      limit: 12,
      search: "",
    });
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shop Products</h1>
          <p className="text-gray-600">Discover our wide range of products</p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-amber-outline w-full flex items-center justify-center"
          >
            <Filter className="h-5 w-5 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              categories={categories}
              brands={brands}
              filters={filters}
              onFilterChange={handleFilterChange}
              onPriceChange={handlePriceChange}
              onCategoryChange={handleCategoryChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mb-6">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(false)}
                  className="absolute top-4 right-4 z-10 btn btn-circle btn-sm btn-ghost"
                >
                  <X className="h-5 w-5" />
                </button>
                <FilterSidebar
                  categories={categories}
                  brands={brands}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onPriceChange={handlePriceChange}
                  onCategoryChange={handleCategoryChange}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {(filters.page - 1) * filters.limit + 1} -{" "}
                  {Math.min(filters.page * filters.limit, totalProducts)} of{" "}
                  {totalProducts} products
                </div>

                <div className="flex items-center space-x-4">
                  {/* View Toggle */}
                  <div className="flex border border-amber-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-amber-100 text-amber-600"
                          : "text-gray-600"
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-amber-100 text-amber-600"
                          : "text-gray-600"
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      className="btn btn-outline border-amber-200 text-gray-700"
                    >
                      Sort:{" "}
                      {
                        SORT_OPTIONS.find((opt) => opt.value === filters.sort)
                          ?.label
                      }
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </div>
                    <ul className="dropdown-content mt-2 p-2 shadow bg-white border border-amber-100 rounded-box w-52">
                      {SORT_OPTIONS.map((option) => (
                        <li key={option.value}>
                          <button
                            onClick={() =>
                              handleFilterChange("sort", option.value)
                            }
                            className={`w-full text-left px-4 py-2 rounded hover:bg-amber-50 ${
                              filters.sort === option.value
                                ? "bg-amber-100 text-amber-600"
                                : ""
                            }`}
                          >
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category ||
              filters.minPrice ||
              filters.maxPrice ||
              filters.search) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <span className="badge-amber">
                      Search: {filters.search}
                      <button
                        onClick={() => handleFilterChange("search", "")}
                        className="ml-2 hover:text-amber-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="badge-amber">
                      Category:{" "}
                      {categories.find((c) => c._id === filters.category)?.name}
                      <button
                        onClick={() => handleFilterChange("category", "")}
                        className="ml-2 hover:text-amber-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="badge-amber">
                      Price: ${filters.minPrice || "0"} - $
                      {filters.maxPrice || "∞"}
                      <button
                        onClick={() => {
                          handleFilterChange("minPrice", "");
                          handleFilterChange("maxPrice", "");
                        }}
                        className="ml-2 hover:text-amber-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="h-12 w-12 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search term
                </p>
                <button onClick={clearFilters} className="btn-amber">
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {products.map((product) => (
                  <div key={product._id} className="card-amber">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4">
                        <img
                          src={product.images?.[0]?.url || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-48 md:h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                        />
                      </div>
                      <div className="md:w-3/4 p-6">
                        <div className="flex flex-col h-full">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold">
                                {product.name}
                              </h3>
                              <span className="text-2xl font-bold text-amber-600">
                                ${product.discountPrice || product.price}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                  Brand:{" "}
                                  <span className="font-medium">
                                    {product.brand}
                                  </span>
                                </span>
                                <span className="text-sm text-gray-500">
                                  Stock:{" "}
                                  <span className="font-medium">
                                    {product.stock}
                                  </span>
                                </span>
                              </div>
                              <button className="btn-amber">Add to Cart</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalProducts > filters.limit && (
              <div className="mt-12">
                <Pagination
                  currentPage={filters.page}
                  totalPages={Math.ceil(totalProducts / filters.limit)}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
