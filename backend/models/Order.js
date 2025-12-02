import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
  },
  color: String,
  size: String,
});

const shippingInfoSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const paymentInfoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  paidAt: {
    type: Date,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingInfo: shippingInfoSchema,
    paymentInfo: paymentInfoSchema,
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discount: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: [
        "Processing",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
        "Refunded",
      ],
      default: "Processing",
    },
    deliveredAt: Date,
    cancelledAt: Date,
    trackingNumber: String,
    carrier: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate order ID
orderSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  this.orderId = `ORD-${year}-${randomNum}`;

  next();
});

// Calculate total price before saving
orderSchema.pre("save", function (next) {
  this.totalPrice =
    this.itemsPrice + this.taxPrice + this.shippingPrice - this.discount;
  next();
});

export const module = mongoose.model("Order", orderSchema);
