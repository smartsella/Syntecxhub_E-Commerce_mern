import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
  CreditCard,
  Truck,
  Shield,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-amber-900 to-amber-950 text-white mt-20">
      <div className="container-custom">
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-b border-amber-700">
          <div className="text-center">
            <div className="bg-amber-600/20 p-4 rounded-full inline-block mb-4">
              <Truck className="h-8 w-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
            <p className="text-amber-200">On orders over $50</p>
          </div>
          <div className="text-center">
            <div className="bg-amber-600/20 p-4 rounded-full inline-block mb-4">
              <CreditCard className="h-8 w-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
            <p className="text-amber-200">100% secure payment</p>
          </div>
          <div className="text-center">
            <div className="bg-amber-600/20 p-4 rounded-full inline-block mb-4">
              <Shield className="h-8 w-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quality Products</h3>
            <p className="text-amber-200">Authentic products</p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">SN</span>
              </div>
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
                  Shop
                </span>
                <span className="text-white">Now</span>
              </span>
            </div>
            <p className="text-amber-200 mb-6">
              Your one-stop destination for all shopping needs. Quality products
              at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="btn btn-circle bg-amber-800 border-0 hover:bg-amber-700"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="btn btn-circle bg-amber-800 border-0 hover:bg-amber-700"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="btn btn-circle bg-amber-800 border-0 hover:bg-amber-700"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop"
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop?category=electronics"
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=fashion"
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  Fashion
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=home"
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=sports"
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-400 mt-1" />
                <span className="text-amber-200">
                  123 Street, City, Country
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-400" />
                <span className="text-amber-200">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-400" />
                <span className="text-amber-200">support@shopnow.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-2 rounded-l-lg text-gray-900"
                />
                <button className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-4 py-2 rounded-r-lg font-semibold hover:opacity-90 transition-opacity">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-amber-800 py-8 text-center">
          <p className="text-amber-300">
            &copy; {currentYear} ShopNow. Made with{" "}
            <Heart className="inline h-4 w-4 text-red-400" /> All rights
            reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-amber-400">
            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
