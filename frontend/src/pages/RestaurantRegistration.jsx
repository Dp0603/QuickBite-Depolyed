// src/pages/RestaurantRegistration.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { registerUser } from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function RestaurantRegistration() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    password: "",
    restaurantName: "",
    phoneNumber: "",
    address: "",
    latitude: "",
    longitude: "",
    cuisines: "",
    openingHours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
    },
    licenseNumber: "",
    gstNumber: "",
    logo: "",
    coverImage: "",
    gallery: [],
    bankAccount: {
      accountNumber: "",
      ifsc: "",
      holderName: "",
    },
  });

  // ---------------- Handle input changes ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- Step 1 submit (register + send verification email) ----------------
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await registerUser({
        name: formData.ownerName,
        email: formData.email,
        password: formData.password,
        role: "restaurant", // register as restaurant
      });

      toast.success("Verification email sent! Check your inbox.");
      setUserEmail(formData.email);
      setStep("waiting");
      setPolling(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Polling to check email verification ----------------
  useEffect(() => {
    let interval, timeout;
    if (polling && userEmail) {
      interval = setInterval(async () => {
        try {
          const res = await API.get(
            `/auth/check-verification?email=${userEmail}`
          );
          if (res.data.isVerified) {
            clearInterval(interval);
            clearTimeout(timeout);
            setPolling(false);
            toast.success("Email verified! Proceeding to next step.");

            if (res.data.token) {
              localStorage.setItem("token", res.data.token);
              API.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${res.data.token}`;
              setToken(res.data.token);
            }

            if (res.data.user) {
              localStorage.setItem("user", JSON.stringify(res.data.user));
              setUser(res.data.user);
            }

            setStep(2);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 5000);

      timeout = setTimeout(() => {
        clearInterval(interval);
        setPolling(false);
        toast.error("Verification timed out. Please try again.");
        setStep(1);
      }, 5 * 60 * 1000);
    }
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [polling, userEmail]);

  // ---------------- Attach token globally ----------------
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, [token]);

  // ---------------- Step 2 submit (restaurant info) ----------------
  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/restaurants/restaurants/create", {
        name: formData.restaurantName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        cuisines: formData.cuisines.split(","),
      });

      toast.success("Restaurant profile created!");
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Step 3 submit (documents & media) ----------------
  const handleDocsSubmit = (e) => {
    e.preventDefault();
    setStep(4);
  };

  // ---------------- Step 4 submit (bank & review) ----------------
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.put("/restaurants/restaurants/update", {
        licenseNumber: formData.licenseNumber,
        gstNumber: formData.gstNumber,
        logo: formData.logo,
        coverImage: formData.coverImage,
        gallery: formData.gallery,
        bankAccount: formData.bankAccount,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success("Registration completed! Pending admin approval.");
      navigate("/restaurant");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Stepper UI ----------------
  const renderStepper = () => {
    const steps = [
      "Account Info",
      "Restaurant Info",
      "Documents & Media",
      "Bank & Review",
    ];
    return (
      <div className="flex justify-between mb-8">
        {steps.map((label, index) => {
          const stepNum = index + 1;
          return (
            <div
              key={index}
              className={`flex-1 text-center ${
                step === stepNum
                  ? "font-bold text-primary"
                  : step > stepNum
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {step > stepNum ? "✅" : stepNum}. {label}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        {renderStepper()}

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={handleAccountSubmit} className="space-y-4">
            <input
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Owner Name"
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded"
            >
              {loading ? "Processing..." : "Next"}
            </button>
          </form>
        )}

        {/* Waiting */}
        {step === "waiting" && (
          <div className="text-center p-6">
            <p className="mb-4 font-semibold text-lg">
              🕒 Waiting for email verification...
            </p>
            <p>
              A verification link has been sent to <b>{userEmail}</b>. Please
              check your inbox.
            </p>
            <p className="mt-2 text-gray-500">
              This page will automatically proceed once your email is verified.
            </p>
            {polling && (
              <p className="mt-4">⏳ Checking verification status...</p>
            )}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form onSubmit={handleRestaurantSubmit} className="space-y-4">
            <input
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              placeholder="Restaurant Name"
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="cuisines"
              value={formData.cuisines}
              onChange={handleChange}
              placeholder="Cuisines (comma separated)"
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                {loading ? "Saving..." : "Next"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form onSubmit={handleDocsSubmit} className="space-y-4">
            <input
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="License Number"
              className="w-full border p-2 rounded"
            />
            <input
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="GST Number"
              className="w-full border p-2 rounded"
            />
            <input
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="Logo URL"
              className="w-full border p-2 rounded"
            />
            <input
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="Cover Image URL"
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <input
              name="accountNumber"
              value={formData.bankAccount.accountNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bankAccount: {
                    ...prev.bankAccount,
                    accountNumber: e.target.value,
                  },
                }))
              }
              placeholder="Account Number"
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="ifsc"
              value={formData.bankAccount.ifsc}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bankAccount: { ...prev.bankAccount, ifsc: e.target.value },
                }))
              }
              placeholder="IFSC Code"
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="holderName"
              value={formData.bankAccount.holderName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bankAccount: {
                    ...prev.bankAccount,
                    holderName: e.target.value,
                  },
                }))
              }
              placeholder="Account Holder Name"
              required
              className="w-full border p-2 rounded"
            />

            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold">Review:</h3>
              <p>Owner: {formData.ownerName}</p>
              <p>Restaurant: {formData.restaurantName}</p>
              <p>Cuisines: {formData.cuisines}</p>
              <p>Status: Pending Approval</p>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                {loading ? "Submitting..." : "Finish"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
