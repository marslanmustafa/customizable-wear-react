import React from 'react';
// import useOtpVerification from './useOtpVerification';
import useOtpVerification from '../hooks/useOtpVerification';

const OtpPage = () => {
  const { otp, loading, error, handleChange, handleSubmit } = useOtpVerification();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xs w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Enter OTP</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Please enter the OTP sent to your email.
        </p>
        {error && (
          <div className="mb-4 text-red-500 text-center">
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex space-x-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                id={`otp-input-${index}`}
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Didn’t receive the OTP?{' '}
            <button
              className="text-indigo-600 hover:text-indigo-700 focus:outline-none"
              onClick={() => alert("Resend OTP logic goes here")}
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
