import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating between 1 and 5"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Please add a review title"],
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Please add a comment"],
      maxLength: [500, "Comment cannot exceed 500 characters"],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    notHelpful: {
      type: Number,
      default: 0,
    },
    reports: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: String,
        reportedAt: Date,
      },
    ],
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews from same user on same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product rating when review is saved
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        numOfReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratings: stats[0].averageRating,
      numOfReviews: stats[0].numOfReviews,
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratings: 0,
      numOfReviews: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post("remove", function () {
  this.constructor.calculateAverageRating(this.product);
});

export const module = mongoose.model("Review", reviewSchema);
