import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  color: String,
  size: String,
  selected: {
    type: Boolean,
    default: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    coupon: {
      code: String,
      discount: Number,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate subtotal
cartSchema.methods.calculateSubtotal = function () {
  return this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

// Calculate total
cartSchema.methods.calculateTotal = function () {
  const subtotal = this.calculateSubtotal();
  const discount = this.coupon?.discount || 0;
  return subtotal + this.shippingCost - discount;
};

// Update cart timestamp
cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const module = mongoose.model("Cart", cartSchema);
