import mongoose from "mongoose";
import crypto from "crypto";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["email_verification", "password_reset", "login"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create OTP
otpSchema.statics.generateOTP = function (email, purpose) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return this.create({
    email,
    otp,
    purpose,
    expiresAt,
  });
};

// Verify OTP
otpSchema.statics.verifyOTP = async function (email, otp, purpose) {
  const otpRecord = await this.findOne({
    email,
    otp,
    purpose,
    expiresAt: { $gt: Date.now() },
    isUsed: false,
    attempts: { $lt: 3 },
  });

  if (!otpRecord) {
    return { isValid: false, message: "Invalid or expired OTP" };
  }

  // Increment attempts
  otpRecord.attempts += 1;

  if (otpRecord.attempts >= 3) {
    await otpRecord.deleteOne();
    return { isValid: false, message: "Too many attempts. OTP deleted" };
  }

  // Mark as used
  otpRecord.isUsed = true;
  await otpRecord.save();

  return { isValid: true, message: "OTP verified successfully" };
};

// Delete expired OTPs
otpSchema.statics.cleanupExpiredOTPs = async function () {
  await this.deleteMany({
    expiresAt: { $lt: Date.now() },
  });
};

export const module = mongoose.model("OTP", otpSchema);
