import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../utils/config";

// const apiUrl = import.meta.env.VITE_API_BASE_URL; 
const useOtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpCode = otp.join("");

    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/signup/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ otp: otpCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("OTP Verified Successfully");



        // Redirect based on role
        const userRole = data.user?.role; // Safely access the role property
        if (userRole === "seller") {
          navigate("/seller");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while verifying the OTP");
    } finally {
      setLoading(false);
    }
  };

  return { otp, loading, error, handleChange, handleSubmit };
};

export default useOtpVerification;
