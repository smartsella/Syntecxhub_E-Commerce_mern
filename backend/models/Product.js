import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      maxLength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
      maxLength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      default: 0.0,
    },
    discountPrice: {
      type: Number,
      default: 0.0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    colors: [String],
    sizes: [String],
    tags: [String],
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    specifications: {
      type: Map,
      of: String,
    },
    features: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create slug from name
productSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  next();
});

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.discountPrice && this.price > this.discountPrice) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for final price
productSchema.virtual("finalPrice").get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

// Indexes for better performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, brand: 1, price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

export const module = mongoose.model("Product", productSchema);
