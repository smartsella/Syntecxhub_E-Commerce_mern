import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Truck,
  Shield,
  RefreshCw,
  Share2,
  Heart,
  ChevronLeft,
} from "lucide-react";
import { useCart } from "..//../context/CartContext.jsx";
// import ProductCard from "../components/products/ProductCard";
// import ReviewSection from "../components/products/ReviewSection";
// import RatingStars from "../components/common/RatingStars";
// import Loader from "../components/common/Loader";
import productService from "../../services/productService.js";
import { formatCurrency, calculateDiscount } from "../../utils/formatters.js";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [productData, relatedData] = await Promise.all([
          productService.getProduct(id),
          productService.getRelatedProducts(id),
        ]);
        setProduct(productData);
        setRelatedProducts(relatedData);
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    const result = await addToCart(product, quantity);
    setAddingToCart(false);

    if (result.success) {
      setQuantity(1);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const discountPercentage = calculateDiscount(
    product?.originalPrice,
    product?.price
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button onClick={() => navigate("/shop")} className="btn-amber">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-amber-600"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Shop
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4 mb-4">
              <img
                src={product.images?.[selectedImage]?.url || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                    selectedImage === index
                      ? "border-amber-500"
                      : "border-gray-200 hover:border-amber-300"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Brand */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="badge-amber">
                {product.category?.name || "Uncategorized"}
              </span>
              <span className="text-sm text-gray-500">
                Brand: <span className="font-medium">{product.brand}</span>
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <RatingStars rating={product.ratings} size="lg" />
                <span className="ml-2 text-gray-700 font-medium">
                  {product.ratings.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-500">
                ({product.numOfReviews} reviews)
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-green-600 font-medium">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-amber-600">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="flex">
                          <span className="text-gray-600 w-1/2">{key}:</span>
                          <span className="font-medium w-1/2">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Quantity & Add to Cart */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Quantity Selector */}
                <div className="flex items-center border border-amber-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-4 py-3 text-gray-600 hover:text-amber-600 disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="px-4 py-3 text-gray-600 hover:text-amber-600 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={
                    addingToCart || product.stock === 0 || isInCart(product._id)
                  }
                  className="btn-amber flex-1 sm:flex-none px-8 py-3 text-lg"
                >
                  {addingToCart
                    ? "Adding..."
                    : isInCart(product._id)
                    ? "Already in Cart"
                    : product.stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => setInWishlist(!inWishlist)}
                  className={`p-3 rounded-full border ${
                    inWishlist
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "border-gray-300 text-gray-600 hover:border-amber-300 hover:text-amber-600"
                  }`}
                >
                  <Heart
                    className={`h-6 w-6 ${inWishlist ? "fill-current" : ""}`}
                  />
                </button>

                {/* Share Button */}
                <button className="p-3 rounded-full border border-gray-300 text-gray-600 hover:border-amber-300 hover:text-amber-600">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-xl">
                <Truck className="h-6 w-6 text-amber-600" />
                <div>
                  <div className="font-semibold">Free Shipping</div>
                  <div className="text-sm text-gray-600">
                    On orders over $50
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-xl">
                <RefreshCw className="h-6 w-6 text-amber-600" />
                <div>
                  <div className="font-semibold">30-Day Returns</div>
                  <div className="text-sm text-gray-600">
                    Easy returns policy
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-xl">
                <Shield className="h-6 w-6 text-amber-600" />
                <div>
                  <div className="font-semibold">2-Year Warranty</div>
                  <div className="text-sm text-gray-600">Product warranty</div>
                </div>
              </div>
            </div>

            {/* SKU & Tags */}
            <div className="text-sm text-gray-600">
              <div className="mb-2">SKU: {product.sku}</div>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
