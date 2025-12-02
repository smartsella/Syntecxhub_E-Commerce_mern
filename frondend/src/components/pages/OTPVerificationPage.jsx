import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Clock, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { validateOTP } from "../../utils/validators.js";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage
    const pendingEmail = localStorage.getItem("pendingVerification");
    if (!pendingEmail) {
      navigate("/register");
      return;
    }
    setEmail(pendingEmail);

    // Start timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    pasteData.split("").forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    // Focus last input
    const lastIndex = Math.min(pasteData.length, 5);
    inputRefs.current[lastIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");

    if (!validateOTP(otpString)) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setLoading(true);
    const result = await verifyOTP(email, otpString);
    setLoading(false);

    if (!result.success) {
      setErrors({ general: "Invalid OTP. Please try again." });
    }
  };

  const handleResendOTP = () => {
    if (!canResend) return;

    // Reset timer
    setTimer(300);
    setCanResend(false);

    // Clear OTP
    setOtp(["", "", "", "", "", ""]);
    setErrors({});

    // TODO: Implement resend OTP API call
    // authService.resendOTP(email)
  };

  const maskedEmail = () => {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;

    const maskedLocal =
      local.charAt(0) +
      "*".repeat(local.length - 2) +
      local.charAt(local.length - 1);
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-3 rounded-xl">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a 6-digit code to your email address
          </p>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-gray-700 font-medium">
              <Mail className="inline h-4 w-4 mr-2 text-amber-600" />
              {maskedEmail()}
            </p>
          </div>
        </div>

        <div className="card-amber p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {errors.general}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter the 6-digit verification code
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-14 h-14 text-3xl font-bold text-center border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.otp ? "border-red-500" : "border-amber-200"
                    }`}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="mt-2 text-center text-sm text-red-600">
                  {errors.otp}
                </p>
              )}
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-mono text-lg font-bold">
                  {formatTime(timer)}
                </span>
                <span className="text-gray-500">remaining</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend}
                  className={`font-medium ${
                    canResend
                      ? "text-amber-600 hover:text-amber-500"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {canResend
                    ? "Resend OTP"
                    : "Resend available in " + formatTime(timer)}
                </button>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.some((digit) => !digit)}
              className="w-full btn-amber py-3 text-lg font-semibold"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to registration
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            Having trouble? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="text-amber-600 hover:text-amber-500"
            >
              contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
