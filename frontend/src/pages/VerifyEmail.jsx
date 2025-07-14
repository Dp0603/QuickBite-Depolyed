import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleVerify = async () => {
    setClicked(true);
    try {
      const res = await axios.get(`/api/auth/verify-email/${token}`);
      setMessage(res.data.message || "Email verified!");
      setVerified(true);
    } catch (err) {
      setError(true);
      setMessage(err.response?.data?.message || "Invalid or expired token");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl text-center w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-primary">
          {verified ? "✅ Email Verified" : "🔐 Verify Your Email"}
        </h2>

        {!clicked && (
          <>
            <p className="text-secondary dark:text-gray-300">
              Click below to verify your account
            </p>
            <button
              onClick={handleVerify}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-orange-600 transition"
            >
              Click to Verify Email
            </button>
          </>
        )}

        {clicked && (
          <div>
            <p
              className={`mt-4 text-lg font-medium ${
                error ? "text-red-500" : "text-green-600"
              }`}
            >
              {message}
            </p>

            <Link
              to="/login"
              className="inline-block mt-6 px-5 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
