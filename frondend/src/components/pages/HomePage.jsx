import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Shield,
  Truck,
  Clock,
  TrendingUp,
} from "lucide-react";
// import ProductCard from "../components/products/ProductCard";
// import CategoryCard from "../components/products/CategoryCard";
import productService from "../../services/productService.js";
import { CATEGORIES } from "../../utils/constants.js";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [featured, newProducts] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getNewArrivals(),
        ]);
        setFeaturedProducts(featured);
        setNewArrivals(newProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const features = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Free Shipping",
      description: "On orders over $50",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Payment",
      description: "100% secure payment",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Dedicated support",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Quality Products",
      description: "Authentic products",
      color: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="block">Discover Amazing</span>
                <span className="block bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  Products Online
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Shop the latest trends in electronics, fashion, home decor, and
                more. Quality products at unbeatable prices with fast delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop" className="btn-amber group">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/categories" className="btn-amber-outline">
                  Browse Categories
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Shopping"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 bg-gradient-to-r from-amber-600 to-orange-500 text-white p-4 rounded-xl shadow-xl">
                <div className="text-2xl font-bold">50% OFF</div>
                <div className="text-sm">Summer Sale</div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-amber-200">
                <div className="flex items-center">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <div className="ml-2">
                    <div className="font-bold">4.8/5</div>
                    <div className="text-sm text-gray-500">Customer Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Why Choose Us</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We provide the best shopping experience with premium services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card-amber p-6 text-center">
                <div
                  className={`bg-gradient-to-r ${feature.color} p-3 rounded-full inline-block mb-4`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="mb-2">Shop by Category</h2>
              <p className="text-gray-600">Browse products by category</p>
            </div>
            <Link to="/shop" className="btn-amber-outline">
              View All Categories
            </Link>
          </div>
          {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div> */}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="mb-2">Featured Products</h2>
              <p className="text-gray-600">Our most popular products</p>
            </div>
            <Link to="/shop" className="btn-amber-outline">
              View All Products
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-amber animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="mb-2">New Arrivals</h2>
              <p className="text-gray-600">Recently added products</p>
            </div>
            <Link to="/shop?sort=newest" className="btn-amber-outline">
              Shop New Arrivals
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-amber animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get 20% Off Your First Order
              </h2>
              <p className="text-amber-100 mb-8 max-w-2xl mx-auto text-lg">
                Subscribe to our newsletter and get exclusive deals, new
                arrivals, and special offers
              </p>
              <div className="flex max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-6 py-3 rounded-l-xl text-gray-900 focus:outline-none"
                />
                <button className="bg-white text-amber-600 font-semibold px-8 py-3 rounded-r-xl hover:bg-amber-50 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-24 translate-y-24"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
