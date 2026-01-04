import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Icons as inline SVG components
const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const AdminAddUserDrawer = ({ open, mode, user, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "customer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    if (mode !== "add" && e.target.name === "email") return;
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };
  useEffect(() => {
    if (mode === "add") {
      setForm({
        name: "",
        email: "",
        password: "",
        role: "customer",
      });
    } else if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    }
  }, [mode, user]);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // ADD
      if (mode === "add") {
        if (!form.name || !form.email || !form.password) {
          return setError("All fields are required");
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        });

        const data = await res.json();
        const userId = data?.user?._id;
        if (!userId) throw new Error("User ID not returned");

        await fetch(`/api/admin/users/role/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ role: form.role }),
        });
      }

      // EDIT
      if (mode === "edit") {
        await fetch(`/api/admin/users/${user._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: form.name,
            role: form.role,
            ...(form.password && { password: form.password }),
          }),
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const roleColors = {
    customer: "from-blue-500 to-blue-600",
    restaurant: "from-purple-500 to-purple-600",
    admin: "from-red-500 to-red-600",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[460px] bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 z-50 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Gradient header bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            {/* Header */}
            <div className="px-8 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {mode === "add" && "Add New User"}
                    {mode === "edit" && "Edit User"}
                    {mode === "view" && "User Details"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {mode === "add" && "Create a new account and assign role"}
                    {mode === "edit" && "Update user information"}
                    {mode === "view" && "View user information"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:rotate-90"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Form Container */}
            <div className="flex-1 overflow-y-auto px-8 pb-8">
              <div className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <UserIcon />
                    </div>
                    <input
                      disabled={mode === "view"}
                      name="name"
                      placeholder="Enter full name"
                      value={form.name}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                        focusedField === "name"
                          ? "border-blue-500 dark:border-blue-400"
                          : "border-gray-200 dark:border-slate-700"
                      } bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField("")}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <EmailIcon />
                    </div>
                    <input
                      disabled={mode !== "add"}
                      name="email"
                      placeholder="user@example.com"
                      type="email"
                      value={form.email}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                        focusedField === "email"
                          ? "border-blue-500 dark:border-blue-400"
                          : "border-gray-200 dark:border-slate-700"
                      } bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10`}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField("")}
                    />
                  </div>
                </div>

                {/* Password Input */}
                {mode !== "view" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Password {mode === "edit" && "(optional)"}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <LockIcon />
                      </div>
                      <input
                        name="password"
                        type="password"
                        value={form.password}
                        placeholder={
                          mode === "edit"
                            ? "Leave blank to keep current"
                            : "••••••••"
                        }
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                          focusedField === "password"
                            ? "border-blue-500 dark:border-blue-400"
                            : "border-gray-200 dark:border-slate-700"
                        } bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-all`}
                      />
                    </div>
                  </div>
                )}

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    User Role
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                      <ShieldIcon />
                    </div>
                    <select
                      disabled={mode === "view"}
                      name="role"
                      value={form.role}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                        focusedField === "role"
                          ? "border-blue-500 dark:border-blue-400"
                          : "border-gray-200 dark:border-slate-700"
                      } bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer appearance-none`}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("role")}
                      onBlur={() => setFocusedField("")}
                    >
                      <option value="customer">Customer</option>
                      <option value="restaurant">Restaurant Owner</option>
                      <option value="admin">Administrator</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Role Badge Preview */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Preview:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
                        roleColors[form.role]
                      }`}
                    >
                      {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-gray-200 dark:border-slate-700">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  Cancel
                </button>
                {mode !== "view" && (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {mode === "add" ? "Creating..." : "Saving..."}
                      </span>
                    ) : mode === "add" ? (
                      "Create User"
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminAddUserDrawer;
