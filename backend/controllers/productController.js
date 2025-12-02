import { module as Product } from "../models/Product.js";
import { module as Category } from "../models/Category.js";
import { module as Review } from "../models/Review.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr))
      .where("isActive")
      .equals(true);

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query = query.or([
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { brand: searchRegex },
      ]);
    }

    // Category filter
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        query = query.where("category").equals(category._id);
      }
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(query.getFilter());

    query = query.skip(startIndex).limit(limit);

    // Populate category
    query = query.populate("category", "name slug");

    // Execute query
    const products = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "name avatar",
        },
      })
      .populate("createdBy", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment view count (you can add this field to schema)
    // product.views += 1;
    // await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    // Handle image upload
    if (req.files && req.files.length > 0) {
      const images = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
          width: 1500,
          crop: "scale",
        });

        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = images;
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Handle image update
    if (req.files && req.files.length > 0) {
      // Delete old images from cloudinary
      for (const image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }

      // Upload new images
      const images = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
          width: 1500,
          crop: "scale",
        });

        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = images;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete images from cloudinary
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
    })
      .limit(8)
      .populate("category", "name slug");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new arrivals
// @route   GET /api/v1/products/new-arrivals
// @access  Public
export const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort("-createdAt")
      .limit(8)
      .populate("category", "name slug");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/v1/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .limit(4)
      .populate("category", "name slug");

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/v1/products/category/:categorySlug
// @access  Public
export const getProductsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.categorySlug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Get all subcategories
    const subcategories = await Category.find({ parent: category._id });
    const categoryIds = [category._id, ...subcategories.map((sub) => sub._id)];

    const products = await Product.find({
      category: { $in: categoryIds },
      isActive: true,
    }).populate("category", "name slug");

    res.status(200).json({
      success: true,
      count: products.length,
      category,
      subcategories,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
