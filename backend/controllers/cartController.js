import { module as Cart } from "../models/Cart.js";
import { module as Product } from "../models/Product.js";

// @desc    Get user's cart
// @route   GET /api/v1/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price images stock sku"
    );

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: {
        items: cart.items,
        subtotal: cart.calculateSubtotal(),
        shipping: cart.shippingCost,
        discount: cart.coupon?.discount || 0,
        total: cart.calculateTotal(),
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart/items
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, color, size } = req.body;

    // Check if product exists and is in stock
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than ${product.stock} items`,
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        price:
          product.discountPrice > 0 ? product.discountPrice : product.price,
        color,
        size,
      });
    }

    await cart.save();

    // Populate product details
    await cart.populate("items.product", "name price images stock sku");

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: {
        items: cart.items,
        subtotal: cart.calculateSubtotal(),
        total: cart.calculateTotal(),
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/items/:itemId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Check product stock
    const item = cart.items[itemIndex];
    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate("items.product", "name price images stock sku");

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: {
        items: cart.items,
        subtotal: cart.calculateSubtotal(),
        total: cart.calculateTotal(),
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/items/:itemId
// @access  Private
export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Filter out the item to remove
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();

    await cart.populate("items.product", "name price images stock sku");

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: {
        items: cart.items,
        subtotal: cart.calculateSubtotal(),
        total: cart.calculateTotal(),
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/v1/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: {
        items: [],
        subtotal: 0,
        total: 0,
        itemCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/v1/cart/coupon
// @access  Private
export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    // In a real app, you would validate the coupon from database
    // For now, we'll use a mock coupon
    const validCoupons = {
      WELCOME10: 10, // 10% discount
      SAVE20: 20, // 20% discount
      FREESHIP: 0, // Free shipping
    };

    if (!validCoupons[code]) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const discount = validCoupons[code];
    cart.coupon = { code, discount };
    await cart.save();

    await cart.populate("items.product", "name price images stock sku");

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: {
        items: cart.items,
        subtotal: cart.calculateSubtotal(),
        shipping: cart.shippingCost,
        discount: cart.coupon.discount,
        total: cart.calculateTotal(),
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove coupon from cart
// @route   DELETE /api/v1/cart/coupon
// @access  Private
export const removeCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.coupon = undefined;
    await cart.save();

    await cart.populate("items.product", "name price images stock sku");

    res.status(200).json({
      success: true,
      message: "Coupon removed successfully",
      data: {
        items: cart.items,
        subtotal: cart.calculateSubtotal(),
        shipping: cart.shippingCost,
        discount: 0,
        total: cart.calculateTotal(),
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};
