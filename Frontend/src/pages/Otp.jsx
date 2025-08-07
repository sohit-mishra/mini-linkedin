import React, { useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; 
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length < 6) {
      showError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        email,
        otp,
      });

      showSuccess("OTP Verified 🎉 Redirecting...");

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      showError(error.response?.data?.error || "Invalid OTP, please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-lg shadow-lg md:shadow-[0px_0px_40px_8px_#91838366] 
           space-y-6 w-full max-w-md border-0"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="text-2xl font-semibold text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Enter OTP
        </motion.h2>

        <motion.p
          className="text-sm text-gray-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Enter the 6‑digit code<br />
          sent to <span className="font-medium text-gray-800">{email}</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            className="flex justify-center"
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup className="gap-2">
              {[3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Button type="submit" className="w-full">
            Verify OTP
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
}
