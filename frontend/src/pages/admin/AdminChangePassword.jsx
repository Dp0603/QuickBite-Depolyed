import React, { useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const AdminChangePassword = () => {
  const { token, logout } = useContext(AuthContext);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const { currentPassword, newPassword, confirmPassword } = form;

    // 🔐 Basic validation
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

      setMessage({ type: "success", text: "Password changed successfully." });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      // 🔐 Logout if token expired or invalid
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow text-gray-800">
      <h2 className="text-xl font-semibold mb-4">🔒 Change Password</h2>

      {message && (
        <div
          className={`mb-4 p-3 text-sm rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
          value={form.currentPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default AdminChangePassword;

// new but not tested
// import React, { useState, useContext, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaLock,
//   FaKey,
//   FaEye,
//   FaEyeSlash,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaTimes,
//   FaShieldAlt,
//   FaSpinner,
//   FaArrowLeft,
//   FaExclamationTriangle,
//   FaInfoCircle,
//   FaCheck,
//   FaExclamationCircle,
//   FaUserShield,
//   FaHistory,
//   FaLightbulb,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";

// /* -------------------------------------------------------------- */
// /* MAIN COMPONENT                                                  */
// /* -------------------------------------------------------------- */

// const AdminChangePassword = () => {
//   const { token, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });

//   const [loading, setLoading] = useState(false);
//   const [notification, setNotification] = useState(null);
//   const [touched, setTouched] = useState({
//     currentPassword: false,
//     newPassword: false,
//     confirmPassword: false,
//   });

//   // Password strength calculation
//   const passwordStrength = useMemo(() => {
//     const password = form.newPassword;
//     if (!password) return { score: 0, label: "", color: "" };

//     let score = 0;
//     const checks = {
//       length: password.length >= 8,
//       lowercase: /[a-z]/.test(password),
//       uppercase: /[A-Z]/.test(password),
//       numbers: /[0-9]/.test(password),
//       special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
//     };

//     Object.values(checks).forEach((passed) => {
//       if (passed) score++;
//     });

//     if (score <= 1) return { score, label: "Weak", color: "red", checks };
//     if (score <= 2) return { score, label: "Fair", color: "orange", checks };
//     if (score <= 3) return { score, label: "Good", color: "yellow", checks };
//     if (score <= 4) return { score, label: "Strong", color: "emerald", checks };
//     return { score, label: "Very Strong", color: "green", checks };
//   }, [form.newPassword]);

//   // Validation
//   const validation = useMemo(() => {
//     const errors = {};

//     if (touched.currentPassword && !form.currentPassword) {
//       errors.currentPassword = "Current password is required";
//     }

//     if (touched.newPassword) {
//       if (!form.newPassword) {
//         errors.newPassword = "New password is required";
//       } else if (form.newPassword.length < 8) {
//         errors.newPassword = "Password must be at least 8 characters";
//       } else if (form.newPassword === form.currentPassword) {
//         errors.newPassword = "New password must be different from current";
//       }
//     }

//     if (touched.confirmPassword) {
//       if (!form.confirmPassword) {
//         errors.confirmPassword = "Please confirm your password";
//       } else if (form.newPassword !== form.confirmPassword) {
//         errors.confirmPassword = "Passwords do not match";
//       }
//     }

//     return errors;
//   }, [form, touched]);

//   const isFormValid =
//     form.currentPassword &&
//     form.newPassword &&
//     form.confirmPassword &&
//     form.newPassword === form.confirmPassword &&
//     form.newPassword.length >= 8 &&
//     form.newPassword !== form.currentPassword;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleBlur = (field) => {
//     setTouched({ ...touched, [field]: true });
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
//   };

//   const showNotification = (type, text) => {
//     setNotification({ type, text });
//     if (type === "success") {
//       setTimeout(() => setNotification(null), 5000);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setNotification(null);

//     // Mark all fields as touched
//     setTouched({
//       currentPassword: true,
//       newPassword: true,
//       confirmPassword: true,
//     });

//     if (!isFormValid) {
//       return showNotification("error", "Please fix the errors above");
//     }

//     try {
//       setLoading(true);
//       await API.post(
//         "/auth/change-password",
//         {
//           currentPassword: form.currentPassword,
//           newPassword: form.newPassword,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       showNotification("success", "Password changed successfully!");
//       setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
//       setTouched({ currentPassword: false, newPassword: false, confirmPassword: false });

//       // Redirect after success
//       setTimeout(() => {
//         navigate("/admin/settings");
//       }, 2000);
//     } catch (err) {
//       if (err?.response?.status === 401) {
//         logout();
//         return;
//       }

//       showNotification(
//         "error",
//         err?.response?.data?.message || "Failed to change password. Try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <motion.div
//         className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Notification Toast */}
//         <AnimatePresence>
//           {notification && (
//             <NotificationToast
//               type={notification.type}
//               message={notification.text}
//               onClose={() => setNotification(null)}
//             />
//           )}
//         </AnimatePresence>

//         {/* Back Button */}
//         <motion.button
//           onClick={() => navigate("/admin/settings")}
//           className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors"
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           whileHover={{ x: -5 }}
//         >
//           <FaArrowLeft /> Back to Settings
//         </motion.button>

//         <div className="max-w-2xl mx-auto">
//           {/* Hero Header */}
//           <HeroHeader />

//           {/* Main Content */}
//           <div className="grid lg:grid-cols-5 gap-8">
//             {/* Password Form */}
//             <div className="lg:col-span-3">
//               <PasswordForm
//                 form={form}
//                 showPasswords={showPasswords}
//                 validation={validation}
//                 touched={touched}
//                 loading={loading}
//                 isFormValid={isFormValid}
//                 passwordStrength={passwordStrength}
//                 handleChange={handleChange}
//                 handleBlur={handleBlur}
//                 togglePasswordVisibility={togglePasswordVisibility}
//                 handleSubmit={handleSubmit}
//               />
//             </div>

//             {/* Security Tips Sidebar */}
//             <div className="lg:col-span-2">
//               <SecurityTips />
//               <PasswordRequirements passwordStrength={passwordStrength} />
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// /* -------------------------------------------------------------- */
// /* COMPONENTS                                                      */
// /* -------------------------------------------------------------- */

// /* Notification Toast */
// const NotificationToast = ({ type, message, onClose }) => (
//   <motion.div
//     className="fixed top-6 right-6 z-50"
//     initial={{ opacity: 0, x: 100 }}
//     animate={{ opacity: 1, x: 0 }}
//     exit={{ opacity: 0, x: 100 }}
//   >
//     <div
//       className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border ${
//         type === "success"
//           ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-500/30"
//           : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-500/30"
//       }`}
//     >
//       <div
//         className={`w-10 h-10 rounded-xl flex items-center justify-center ${
//           type === "success" ? "bg-emerald-500" : "bg-red-500"
//         } text-white`}
//       >
//         {type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
//       </div>
//       <p
//         className={`font-semibold ${
//           type === "success"
//             ? "text-emerald-700 dark:text-emerald-400"
//             : "text-red-700 dark:text-red-400"
//         }`}
//       >
//         {message}
//       </p>
//       <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
//         <FaTimes />
//       </button>
//     </div>
//   </motion.div>
// );

// /* Hero Header */
// const HeroHeader = () => (
//   <motion.div
//     className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-amber-200 dark:border-white/10"
//     initial={{ opacity: 0, y: -20 }}
//     animate={{ opacity: 1, y: 0 }}
//   >
//     {/* Gradient Background */}
//     <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600"></div>

//     {/* Pattern Overlay */}
//     <div
//       className="absolute inset-0 opacity-10"
//       style={{
//         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//       }}
//     ></div>

//     {/* Decorative Lock Icon */}
//     <div className="absolute top-6 right-10 opacity-20">
//       <FaLock className="text-white text-7xl" />
//     </div>

//     <div className="relative z-10 p-8 md:p-10">
//       <div className="flex items-center gap-4">
//         <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
//           <FaKey className="text-white text-2xl" />
//         </div>
//         <div>
//           <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">
//             Change Password 🔐
//           </h1>
//           <p className="text-white/80 text-lg mt-1">
//             Keep your account secure with a strong password
//           </p>
//         </div>
//       </div>
//     </div>
//   </motion.div>
// );

// /* Password Form */
// const PasswordForm = ({
//   form,
//   showPasswords,
//   validation,
//   touched,
//   loading,
//   isFormValid,
//   passwordStrength,
//   handleChange,
//   handleBlur,
//   togglePasswordVisibility,
//   handleSubmit,
// }) => (
//   <motion.div
//     className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden"
//     initial={{ opacity: 0, x: -20 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ delay: 0.2 }}
//   >
//     {/* Header */}
//     <div className="p-6 border-b border-gray-200 dark:border-white/10">
//       <div className="flex items-center gap-3">
//         <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
//           <FaShieldAlt className="text-white" />
//         </div>
//         <div>
//           <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//             Update Password
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Enter your current and new password
//           </p>
//         </div>
//       </div>
//     </div>

//     {/* Form */}
//     <form onSubmit={handleSubmit} className="p-6 space-y-6">
//       {/* Current Password */}
//       <PasswordInput
//         label="Current Password"
//         name="currentPassword"
//         value={form.currentPassword}
//         placeholder="Enter your current password"
//         show={showPasswords.current}
//         error={touched.currentPassword && validation.currentPassword}
//         onChange={handleChange}
//         onBlur={() => handleBlur("currentPassword")}
//         onToggle={() => togglePasswordVisibility("current")}
//         icon={<FaLock />}
//       />

//       {/* Divider */}
//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="px-4 bg-white dark:bg-slate-900 text-gray-500">
//             New Password
//           </span>
//         </div>
//       </div>

//       {/* New Password */}
//       <PasswordInput
//         label="New Password"
//         name="newPassword"
//         value={form.newPassword}
//         placeholder="Enter your new password"
//         show={showPasswords.new}
//         error={touched.newPassword && validation.newPassword}
//         onChange={handleChange}
//         onBlur={() => handleBlur("newPassword")}
//         onToggle={() => togglePasswordVisibility("new")}
//         icon={<FaKey />}
//       />

//       {/* Password Strength Meter */}
//       {form.newPassword && (
//         <PasswordStrengthMeter strength={passwordStrength} />
//       )}

//       {/* Confirm Password */}
//       <PasswordInput
//         label="Confirm New Password"
//         name="confirmPassword"
//         value={form.confirmPassword}
//         placeholder="Confirm your new password"
//         show={showPasswords.confirm}
//         error={touched.confirmPassword && validation.confirmPassword}
//         success={
//           touched.confirmPassword &&
//           form.confirmPassword &&
//           form.newPassword === form.confirmPassword
//         }
//         onChange={handleChange}
//         onBlur={() => handleBlur("confirmPassword")}
//         onToggle={() => togglePasswordVisibility("confirm")}
//         icon={<FaLock />}
//       />

//       {/* Submit Button */}
//       <motion.button
//         type="submit"
//         disabled={loading || !isFormValid}
//         className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//         whileHover={isFormValid && !loading ? { scale: 1.02 } : {}}
//         whileTap={isFormValid && !loading ? { scale: 0.98 } : {}}
//       >
//         {loading ? (
//           <>
//             <FaSpinner className="animate-spin" /> Updating Password...
//           </>
//         ) : (
//           <>
//             <FaShieldAlt /> Update Password
//           </>
//         )}
//       </motion.button>
//     </form>
//   </motion.div>
// );

// /* Password Input */
// const PasswordInput = ({
//   label,
//   name,
//   value,
//   placeholder,
//   show,
//   error,
//   success,
//   onChange,
//   onBlur,
//   onToggle,
//   icon,
// }) => (
//   <div>
//     <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//       <span className="text-amber-500">{icon}</span> {label}
//     </label>
//     <div className="relative">
//       <input
//         type={show ? "text" : "password"}
//         name={name}
//         value={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         placeholder={placeholder}
//         className={`w-full px-4 py-4 pr-12 rounded-xl border transition-all ${
//           error
//             ? "border-red-300 dark:border-red-500/50 bg-red-50 dark:bg-red-900/10 focus:ring-2 focus:ring-red-500"
//             : success
//             ? "border-emerald-300 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-900/10 focus:ring-2 focus:ring-emerald-500"
//             : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500"
//         } text-gray-900 dark:text-white focus:border-transparent`}
//       />
//       <button
//         type="button"
//         onClick={onToggle}
//         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//       >
//         {show ? <FaEyeSlash /> : <FaEye />}
//       </button>

//       {/* Success Icon */}
//       {success && (
//         <motion.div
//           className="absolute right-12 top-1/2 -translate-y-1/2 text-emerald-500"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//         >
//           <FaCheckCircle />
//         </motion.div>
//       )}
//     </div>

//     {/* Error Message */}
//     <AnimatePresence>
//       {error && (
//         <motion.p
//           className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -10 }}
//         >
//           <FaExclamationCircle /> {error}
//         </motion.p>
//       )}
//     </AnimatePresence>
//   </div>
// );

// /* Password Strength Meter */
// const PasswordStrengthMeter = ({ strength }) => {
//   const colors = {
//     red: "bg-red-500",
//     orange: "bg-orange-500",
//     yellow: "bg-yellow-500",
//     emerald: "bg-emerald-500",
//     green: "bg-green-500",
//   };

//   const bgColors = {
//     red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
//     orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
//     yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
//     emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
//     green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, height: 0 }}
//       animate={{ opacity: 1, height: "auto" }}
//       exit={{ opacity: 0, height: 0 }}
//       className="space-y-3"
//     >
//       {/* Strength Bar */}
//       <div className="flex items-center gap-3">
//         <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
//           <motion.div
//             className={`h-full ${colors[strength.color]} rounded-full`}
//             initial={{ width: 0 }}
//             animate={{ width: `${(strength.score / 5) * 100}%` }}
//             transition={{ duration: 0.3 }}
//           />
//         </div>
//         <span
//           className={`px-3 py-1 rounded-lg text-xs font-bold ${bgColors[strength.color]}`}
//         >
//           {strength.label}
//         </span>
//       </div>

//       {/* Strength Checks */}
//       {strength.checks && (
//         <div className="grid grid-cols-2 gap-2 text-xs">
//           <StrengthCheck passed={strength.checks.length} label="8+ characters" />
//           <StrengthCheck passed={strength.checks.lowercase} label="Lowercase letter" />
//           <StrengthCheck passed={strength.checks.uppercase} label="Uppercase letter" />
//           <StrengthCheck passed={strength.checks.numbers} label="Number" />
//           <StrengthCheck passed={strength.checks.special} label="Special character" />
//         </div>
//       )}
//     </motion.div>
//   );
// };

// const StrengthCheck = ({ passed, label }) => (
//   <div
//     className={`flex items-center gap-2 ${
//       passed ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
//     }`}
//   >
//     {passed ? <FaCheck /> : <FaTimes />}
//     <span>{label}</span>
//   </div>
// );

// /* Security Tips */
// const SecurityTips = () => (
//   <motion.div
//     className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden mb-6"
//     initial={{ opacity: 0, x: 20 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ delay: 0.3 }}
//   >
//     <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
//           <FaLightbulb className="text-white" />
//         </div>
//         <h4 className="font-bold text-gray-900 dark:text-white">
//           Security Tips
//         </h4>
//       </div>
//     </div>

//     <div className="p-5 space-y-4">
//       <TipItem
//         icon={<FaShieldAlt />}
//         text="Use a unique password not used elsewhere"
//         color="emerald"
//       />
//       <TipItem
//         icon={<FaKey />}
//         text="Include numbers, symbols, and mixed case"
//         color="amber"
//       />
//       <TipItem
//         icon={<FaHistory />}
//         text="Change your password every 90 days"
//         color="blue"
//       />
//       <TipItem
//         icon={<FaUserShield />}
//         text="Never share your password with anyone"
//         color="purple"
//       />
//     </div>
//   </motion.div>
// );

// const TipItem = ({ icon, text, color }) => {
//   const colors = {
//     emerald: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
//     amber: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
//     blue: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
//     purple: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
//   };

//   return (
//     <div className="flex items-start gap-3">
//       <div className={`w-8 h-8 rounded-lg ${colors[color]} flex items-center justify-center flex-shrink-0`}>
//         {icon}
//       </div>
//       <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
//     </div>
//   );
// };

// /* Password Requirements */
// const PasswordRequirements = ({ passwordStrength }) => (
//   <motion.div
//     className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden"
//     initial={{ opacity: 0, x: 20 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ delay: 0.4 }}
//   >
//     <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
//           <FaInfoCircle className="text-white" />
//         </div>
//         <h4 className="font-bold text-gray-900 dark:text-white">
//           Requirements
//         </h4>
//       </div>
//     </div>

//     <div className="p-5 space-y-3">
//       <RequirementItem
//         passed={passwordStrength.checks?.length}
//         text="Minimum 8 characters"
//       />
//       <RequirementItem
//         passed={passwordStrength.checks?.lowercase}
//         text="At least one lowercase letter"
//       />
//       <RequirementItem
//         passed={passwordStrength.checks?.uppercase}
//         text="At least one uppercase letter"
//       />
//       <RequirementItem
//         passed={passwordStrength.checks?.numbers}
//         text="At least one number"
//       />
//       <RequirementItem
//         passed={passwordStrength.checks?.special}
//         text="Special character recommended"
//         optional
//       />
//     </div>
//   </motion.div>
// );

// const RequirementItem = ({ passed, text, optional }) => (
//   <div
//     className={`flex items-center gap-3 text-sm ${
//       passed
//         ? "text-emerald-600 dark:text-emerald-400"
//         : optional
//         ? "text-gray-400"
//         : "text-gray-500 dark:text-gray-400"
//     }`}
//   >
//     <div
//       className={`w-5 h-5 rounded-full flex items-center justify-center ${
//         passed
//           ? "bg-emerald-500 text-white"
//           : "bg-gray-200 dark:bg-slate-700"
//       }`}
//     >
//       {passed ? <FaCheck className="text-xs" /> : null}
//     </div>
//     <span>
//       {text}
//       {optional && (
//         <span className="ml-1 text-xs text-gray-400">(optional)</span>
//       )}
//     </span>
//   </div>
// );

// export default AdminChangePassword;
