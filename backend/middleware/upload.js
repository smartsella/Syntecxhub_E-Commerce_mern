import multer from "multer";
import path from "path";
import crypto from "crypto";

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err);
      cb(null, raw.toString("hex") + path.extname(file.originalname));
    });
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (
    !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)
  ) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

// Multiple file upload middleware
export const uploadMultiple = (fieldName, maxCount) => {
  return upload.array(fieldName, maxCount);
};

// Single file upload middleware
export const uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};
