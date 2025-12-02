import { module as User } from "../models/User.js";
import { module as OTP } from "../models/OTP.js";
import { module as sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"; // built-in, no npm package needed

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Generate OTP
    const otp = await OTP.generateOTP(email, "email_verification");

    // Send verification email with OTP
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verify-email/${verificationToken}`;

    const message = `
            <h1>Email Verification</h1>
            <p>Please use the following OTP to verify your email:</p>
            <h2>${otp.otp}</h2>
            <p>This OTP will expire in 10 minutes.</p>
            <p>Or click the link below to verify your email:</p>
            <a href="${verificationUrl}" clicktracking=off>${verificationUrl}</a>
        `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Email Verification OTP",
        message,
      });

      res.status(201).json({
        success: true,
        message:
          "Registration successful. Please check your email for verification OTP.",
        data: {
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/v1/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, purpose } = req.body;

    // Verify OTP
    const result = await OTP.verifyOTP(email, otp, purpose);

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // If email verification, mark user as verified
    if (purpose === "email_verification") {
      const user = await User.findOne({ email });
      if (user) {
        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(401).json({
        success: false,
        message: "Account is temporarily locked. Please try again later.",
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment login attempts
      await user.incrementLoginAttempts();

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = Date.now();
    await user.save();

    // Create token
    const token = user.getJwtToken();

    // Options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res
      .status(200)
      .cookie("token", token, options)
      .json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist")
      .select("-password");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });
    }

    // Generate OTP for password reset
    const otp = await OTP.generateOTP(user.email, "password_reset");

    // Send email with OTP
    const message = `
            <h1>Password Reset OTP</h1>
            <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
            <p>Please use the following OTP to reset your password:</p>
            <h2>${otp.otp}</h2>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to email",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    // Verify OTP
    const result = await OTP.verifyOTP(email, otp, "password_reset");

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // Find user and update password
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send confirmation email
    const message = `
            <h1>Password Changed Successfully</h1>
            <p>Your password has been successfully changed.</p>
            <p>If you did not make this change, please contact our support team immediately.</p>
        `;

    await sendEmail({
      email: user.email,
      subject: "Password Changed Successfully",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
export const updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    // Send email notification
    const message = `
            <h1>Password Updated</h1>
            <p>Your password has been successfully updated.</p>
            <p>If you did not make this change, please contact our support team immediately.</p>
        `;

    await sendEmail({
      email: user.email,
      subject: "Password Updated",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
