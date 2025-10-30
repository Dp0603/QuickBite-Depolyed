import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { registerUser } from "../api/axios";
import { useToast } from "../context/ToastContext";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaStore,
  FaPhone,
  FaMapMarkerAlt,
  FaUtensils,
  FaFileAlt,
  FaImage,
  FaUniversity,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await registerUser({
        name: formData.ownerName,
        email: formData.email,
        password: formData.password,
        role: "restaurant",
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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, [token]);

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

  const handleDocsSubmit = (e) => {
    e.preventDefault();
    setStep(4);
  };

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

  const renderStepper = () => {
    const steps = [
      { num: 1, label: "Account", icon: FaUser },
      { num: 2, label: "Restaurant", icon: FaStore },
      { num: 3, label: "Documents", icon: FaFileAlt },
      { num: 4, label: "Bank & Review", icon: FaUniversity },
    ];

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((s, index) => {
            const isActive = step === s.num;
            const isCompleted = typeof step === "number" && step > s.num;
            const Icon = s.icon;

            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"
                        : isActive
                        ? "bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg shadow-orange-500/30 scale-110"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheckCircle className="text-white text-2xl" />
                    ) : (
                      <Icon
                        className={`text-xl ${
                          isActive
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-semibold ${
                      isActive
                        ? "text-orange-600 dark:text-orange-400"
                        : isCompleted
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 rounded-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-orange-500 to-pink-600 transition-all duration-500 ${
                        typeof step === "number" && step > s.num
                          ? "w-full"
                          : "w-0"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors" />
      <input
        {...props}
        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-400/10 dark:bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/10 dark:bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg shadow-orange-500/30 mb-6">
            <FaStore className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
              Restaurant Registration
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Join QuickBite and grow your business
          </p>
        </div>

        {/* Stepper */}
        {renderStepper()}

        {/* Form Container */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-orange-200 dark:border-white/10">
          {/* Step 1: Account Info */}
          {step === 1 && (
            <form onSubmit={handleAccountSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  Owner Name
                </label>
                <InputField
                  icon={FaUser}
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  Email Address
                </label>
                <InputField
                  icon={FaEnvelope}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="owner@restaurant.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  Password
                </label>
                <InputField
                  icon={FaLock}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Next Step</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Waiting for Email Verification */}
          {step === "waiting" && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 mb-6 animate-pulse">
                <FaClock className="text-white text-4xl" />
              </div>

              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Waiting for Email Verification
              </h2>

              <div className="max-w-md mx-auto space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  A verification link has been sent to{" "}
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {userEmail}
                  </span>
                </p>

                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    📧 Please check your inbox and click the verification link
                  </p>
                </div>

                {polling && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">
                      Checking verification status...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Restaurant Info */}
          {step === 2 && (
            <form onSubmit={handleRestaurantSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  Restaurant Name
                </label>
                <InputField
                  icon={FaStore}
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder="The Great Restaurant"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  Phone Number
                </label>
                <InputField
                  icon={FaPhone}
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  Address
                </label>
                <InputField
                  icon={FaMapMarkerAlt}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, City"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  Cuisines (comma separated)
                </label>
                <InputField
                  icon={FaUtensils}
                  name="cuisines"
                  value={formData.cuisines}
                  onChange={handleChange}
                  placeholder="Italian, Chinese, Indian"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaArrowLeft />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Next Step</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Documents & Media */}
          {step === 3 && (
            <form onSubmit={handleDocsSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  License Number
                </label>
                <InputField
                  icon={FaFileAlt}
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="LIC-123456"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  GST Number
                </label>
                <InputField
                  icon={FaFileAlt}
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="GST-123456789"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  Logo URL
                </label>
                <InputField
                  icon={FaImage}
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.jpg"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  Cover Image URL
                </label>
                <InputField
                  icon={FaImage}
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaArrowLeft />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Next Step</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Bank & Review */}
          {step === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  Account Number
                </label>
                <InputField
                  icon={FaUniversity}
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
                  placeholder="1234567890"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  IFSC Code
                </label>
                <InputField
                  icon={FaUniversity}
                  name="ifsc"
                  value={formData.bankAccount.ifsc}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bankAccount: {
                        ...prev.bankAccount,
                        ifsc: e.target.value,
                      },
                    }))
                  }
                  placeholder="ABCD0123456"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                  Account Holder Name
                </label>
                <InputField
                  icon={FaUser}
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
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Review Section */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-500/10 dark:to-pink-500/10 border border-orange-200 dark:border-orange-500/30">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <FaCheckCircle className="text-orange-500" />
                  Review Your Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Owner:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formData.ownerName}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Restaurant:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formData.restaurantName}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Cuisines:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formData.cuisines}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold">
                      <FaClock />
                      Pending Approval
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaArrowLeft />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      <span>Complete Registration</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// old
// src/pages/RestaurantRegistration.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API, { registerUser } from "../api/axios";
// import { useToast } from "../context/ToastContext";

// export default function RestaurantRegistration() {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [polling, setPolling] = useState(false);
//   const [userEmail, setUserEmail] = useState("");
//   const [token, setToken] = useState("");
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const toast = useToast();

//   const [formData, setFormData] = useState({
//     ownerName: "",
//     email: "",
//     password: "",
//     restaurantName: "",
//     phoneNumber: "",
//     address: "",
//     latitude: "",
//     longitude: "",
//     cuisines: "",
//     openingHours: {
//       monday: { open: "", close: "" },
//       tuesday: { open: "", close: "" },
//     },
//     licenseNumber: "",
//     gstNumber: "",
//     logo: "",
//     coverImage: "",
//     gallery: [],
//     bankAccount: {
//       accountNumber: "",
//       ifsc: "",
//       holderName: "",
//     },
//   });

//   // ---------------- Handle input changes ----------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ---------------- Step 1 submit (register + send verification email) ----------------
//   const handleAccountSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await registerUser({
//         name: formData.ownerName,
//         email: formData.email,
//         password: formData.password,
//         role: "restaurant", // register as restaurant
//       });

//       toast.success("Verification email sent! Check your inbox.");
//       setUserEmail(formData.email);
//       setStep("waiting");
//       setPolling(true);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to register");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Polling to check email verification ----------------
//   useEffect(() => {
//     let interval, timeout;
//     if (polling && userEmail) {
//       interval = setInterval(async () => {
//         try {
//           const res = await API.get(
//             `/auth/check-verification?email=${userEmail}`
//           );
//           if (res.data.isVerified) {
//             clearInterval(interval);
//             clearTimeout(timeout);
//             setPolling(false);
//             toast.success("Email verified! Proceeding to next step.");

//             if (res.data.token) {
//               localStorage.setItem("token", res.data.token);
//               API.defaults.headers.common[
//                 "Authorization"
//               ] = `Bearer ${res.data.token}`;
//               setToken(res.data.token);
//             }

//             if (res.data.user) {
//               localStorage.setItem("user", JSON.stringify(res.data.user));
//               setUser(res.data.user);
//             }

//             setStep(2);
//           }
//         } catch (err) {
//           console.error("Polling error:", err);
//         }
//       }, 5000);

//       timeout = setTimeout(() => {
//         clearInterval(interval);
//         setPolling(false);
//         toast.error("Verification timed out. Please try again.");
//         setStep(1);
//       }, 5 * 60 * 1000);
//     }
//     return () => {
//       clearInterval(interval);
//       clearTimeout(timeout);
//     };
//   }, [polling, userEmail]);

//   // ---------------- Attach token globally ----------------
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
//     }
//   }, [token]);

//   // ---------------- Step 2 submit (restaurant info) ----------------
//   const handleRestaurantSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await API.post("/restaurants/restaurants/create", {
//         name: formData.restaurantName,
//         phoneNumber: formData.phoneNumber,
//         address: formData.address,
//         latitude: formData.latitude,
//         longitude: formData.longitude,
//         cuisines: formData.cuisines.split(","),
//       });

//       toast.success("Restaurant profile created!");
//       setStep(3);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to create profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Step 3 submit (documents & media) ----------------
//   const handleDocsSubmit = (e) => {
//     e.preventDefault();
//     setStep(4);
//   };

//   // ---------------- Step 4 submit (bank & review) ----------------
//   const handleFinalSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const { data } = await API.put("/restaurants/restaurants/update", {
//         licenseNumber: formData.licenseNumber,
//         gstNumber: formData.gstNumber,
//         logo: formData.logo,
//         coverImage: formData.coverImage,
//         gallery: formData.gallery,
//         bankAccount: formData.bankAccount,
//       });

//       if (data.token) {
//         localStorage.setItem("token", data.token);
//       }

//       toast.success("Registration completed! Pending admin approval.");
//       navigate("/restaurant");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Submission failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Stepper UI ----------------
//   const renderStepper = () => {
//     const steps = [
//       "Account Info",
//       "Restaurant Info",
//       "Documents & Media",
//       "Bank & Review",
//     ];
//     return (
//       <div className="flex justify-between mb-8">
//         {steps.map((label, index) => {
//           const stepNum = index + 1;
//           return (
//             <div
//               key={index}
//               className={`flex-1 text-center ${
//                 step === stepNum
//                   ? "font-bold text-primary"
//                   : step > stepNum
//                   ? "text-green-600"
//                   : "text-gray-400"
//               }`}
//             >
//               {step > stepNum ? "✅" : stepNum}. {label}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
//         {renderStepper()}

//         {/* Step 1 */}
//         {step === 1 && (
//           <form onSubmit={handleAccountSubmit} className="space-y-4">
//             <input
//               name="ownerName"
//               value={formData.ownerName}
//               onChange={handleChange}
//               placeholder="Owner Name"
//               required
//               className="w-full border p-2 rounded"
//             />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email"
//               required
//               className="w-full border p-2 rounded"
//             />
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password"
//               required
//               className="w-full border p-2 rounded"
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-primary text-white py-2 rounded"
//             >
//               {loading ? "Processing..." : "Next"}
//             </button>
//           </form>
//         )}

//         {/* Waiting */}
//         {step === "waiting" && (
//           <div className="text-center p-6">
//             <p className="mb-4 font-semibold text-lg">
//               🕒 Waiting for email verification...
//             </p>
//             <p>
//               A verification link has been sent to <b>{userEmail}</b>. Please
//               check your inbox.
//             </p>
//             <p className="mt-2 text-gray-500">
//               This page will automatically proceed once your email is verified.
//             </p>
//             {polling && (
//               <p className="mt-4">⏳ Checking verification status...</p>
//             )}
//           </div>
//         )}

//         {/* Step 2 */}
//         {step === 2 && (
//           <form onSubmit={handleRestaurantSubmit} className="space-y-4">
//             <input
//               name="restaurantName"
//               value={formData.restaurantName}
//               onChange={handleChange}
//               placeholder="Restaurant Name"
//               required
//               className="w-full border p-2 rounded"
//             />
//             <input
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               placeholder="Phone Number"
//               required
//               className="w-full border p-2 rounded"
//             />
//             <input
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Address"
//               required
//               className="w-full border p-2 rounded"
//             />
//             <input
//               name="cuisines"
//               value={formData.cuisines}
//               onChange={handleChange}
//               placeholder="Cuisines (comma separated)"
//               className="w-full border p-2 rounded"
//             />
//             <div className="flex justify-between">
//               <button
//                 type="button"
//                 onClick={() => setStep(1)}
//                 className="px-4 py-2 bg-gray-300 rounded"
//               >
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-primary text-white rounded"
//               >
//                 {loading ? "Saving..." : "Next"}
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Step 3 */}
//         {step === 3 && (
//           <form onSubmit={handleDocsSubmit} className="space-y-4">
//             <input
//               name="licenseNumber"
//               value={formData.licenseNumber}
//               onChange={handleChange}
//               placeholder="License Number"
//               className="w-full border p-2 rounded"
//             />
//             <input
//               name="gstNumber"
//               value={formData.gstNumber}
//               onChange={handleChange}
//               placeholder="GST Number"
//               className="w-full border p-2 rounded"
//             />
//             <input
//               name="logo"
//               value={formData.logo}
//               onChange={handleChange}
//               placeholder="Logo URL"
//               className="w-full border p-2 rounded"
//             />
//             <input
//               name="coverImage"
//               value={formData.coverImage}
//               onChange={handleChange}
//               placeholder="Cover Image URL"
//               className="w-full border p-2 rounded"
//             />
//             <div className="flex justify-between">
//               <button
//                 type="button"
//                 onClick={() => setStep(2)}
//                 className="px-4 py-2 bg-gray-300 rounded"
//               >
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-primary text-white rounded"
//               >
//                 Next
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Step 4 */}
//         {step === 4 && (
//           <form onSubmit={handleFinalSubmit} className="space-y-4">
//             <input
//               name="accountNumber"
//               value={formData.bankAccount.accountNumber}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   bankAccount: {
//                     ...prev.bankAccount,
//                     accountNumber: e.target.value,
//                   },
//                 }))
//               }
//               placeholder="Account Number"
//               required
//               className="w-full border p-2 rounded"
//             />
//             <input
//               name="ifsc"
//               value={formData.bankAccount.ifsc}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   bankAccount: { ...prev.bankAccount, ifsc: e.target.value },
//                 }))
//               }
//               placeholder="IFSC Code"
//               required
//               className="w-full border p-2 rounded"
//             />
//             <input
//               name="holderName"
//               value={formData.bankAccount.holderName}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   bankAccount: {
//                     ...prev.bankAccount,
//                     holderName: e.target.value,
//                   },
//                 }))
//               }
//               placeholder="Account Holder Name"
//               required
//               className="w-full border p-2 rounded"
//             />

//             <div className="bg-gray-100 p-4 rounded">
//               <h3 className="font-bold">Review:</h3>
//               <p>Owner: {formData.ownerName}</p>
//               <p>Restaurant: {formData.restaurantName}</p>
//               <p>Cuisines: {formData.cuisines}</p>
//               <p>Status: Pending Approval</p>
//             </div>

//             <div className="flex justify-between">
//               <button
//                 type="button"
//                 onClick={() => setStep(3)}
//                 className="px-4 py-2 bg-gray-300 rounded"
//               >
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-primary text-white rounded"
//               >
//                 {loading ? "Submitting..." : "Finish"}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
