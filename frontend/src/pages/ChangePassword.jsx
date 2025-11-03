import React, { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaKey,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ChangePassword = () => {
  const { token, logout } = useContext(AuthContext);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "Very Weak", color: "bg-red-500" },
      { strength: 1, label: "Weak", color: "bg-orange-500" },
      { strength: 2, label: "Fair", color: "bg-yellow-500" },
      { strength: 3, label: "Good", color: "bg-blue-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
      { strength: 5, label: "Very Strong", color: "bg-emerald-500" },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(form.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const { currentPassword, newPassword, confirmPassword } = form;

    if (newPassword !== confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match." });
    }
    if (newPassword.length < 6) {
      return setMessage({
        type: "error",
        text: "New password must be at least 6 characters long.",
      });
    }

    try {
      setLoading(true);
      await API.post(
        "/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({ type: "success", text: "Password changed successfully!" });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      if (err?.response?.status === 401) logout();

      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Failed to change password. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ name, placeholder, field, icon: Icon }) => (
    <div className="relative group">
      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
        {placeholder}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors" />
        <input
          type={showPasswords[field] ? "text" : "password"}
          name={name}
          placeholder="••••••••"
          className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300"
          value={form[name]}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => togglePassword(field)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
        >
          {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Panel - Info Section with Animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-orange-500 to-pink-600 p-8 text-white flex flex-col justify-center"
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl font-bold">Change Password</h1>
            <p className="text-lg opacity-90">
              Secure your account with a strong password that:
            </p>
            <ul className="space-y-3">
              {[
                "Has at least 8 characters",
                "Includes uppercase & lowercase letters",
                "Contains numbers and symbols",
                "Is unique and memorable",
              ].map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <FaCheckCircle className="text-green-300" />
                  {tip}
                </motion.li>
              ))}
            </ul>

            {/* Password Strength Indicator */}
            {form.newPassword && (
              <div className="mt-6">
                <div className="text-sm mb-2">Password Strength</div>
                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${passwordStrength.color}`}
                    style={{
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-sm mt-1 capitalize">
                  {passwordStrength.label}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Panel - Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {message.text}
              </motion.div>
            )}

            <InputField
              name="currentPassword"
              placeholder="Current Password"
              field="current"
              icon={FaLock}
            />
            <InputField
              name="newPassword"
              placeholder="New Password"
              field="new"
              icon={FaKey}
            />
            <InputField
              name="confirmPassword"
              placeholder="Confirm New Password"
              field="confirm"
              icon={FaCheckCircle}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-pink-700 focus:ring-4 focus:ring-orange-500/30 disabled:opacity-50 transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePassword;

// old
// import React, { useState, useContext } from "react";
// import API from "../api/axios";
// import { AuthContext } from "../context/AuthContext";

// const ChangePassword = () => {
//   const { token, logout } = useContext(AuthContext);

//   const [form, setForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(null);

//     const { currentPassword, newPassword, confirmPassword } = form;

//     // 🔐 Basic validation
//     if (newPassword !== confirmPassword) {
//       return setMessage({ type: "error", text: "Passwords do not match." });
//     }
//     if (newPassword.length < 6) {
//       return setMessage({
//         type: "error",
//         text: "New password must be at least 6 characters long.",
//       });
//     }

//     try {
//       setLoading(true);
//       await API.post(
//         "/auth/change-password",
//         { currentPassword, newPassword },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage({ type: "success", text: "Password changed successfully." });
//       setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (err) {
//       // 🔐 Logout if token expired or invalid
//       if (err?.response?.status === 401) logout();

//       setMessage({
//         type: "error",
//         text:
//           err?.response?.data?.message ||
//           "Failed to change password. Try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow text-gray-800">
//       <h2 className="text-xl font-semibold mb-4">🔒 Change Password</h2>

//       {message && (
//         <div
//           className={`mb-4 p-3 text-sm rounded ${
//             message.type === "success"
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {message.text}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="password"
//           name="currentPassword"
//           placeholder="Current Password"
//           className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
//           value={form.currentPassword}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="newPassword"
//           placeholder="New Password"
//           className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
//           value={form.newPassword}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm New Password"
//           className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
//           value={form.confirmPassword}
//           onChange={handleChange}
//           required
//         />

//         <button
//           type="submit"
//           className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? "Updating..." : "Change Password"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChangePassword;
