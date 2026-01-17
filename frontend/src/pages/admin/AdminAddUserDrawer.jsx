import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaTimes,
  FaChevronDown,
  FaCheckCircle,
  FaUserShield,
  FaStore,
  FaUserCircle,
} from "react-icons/fa";
import API from "../../api/axios";

const ROLE_STYLES = {
  customer: {
    container: "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20",
    icon: "bg-blue-500 text-white shadow-lg",
    text: "text-blue-600 dark:text-blue-400",
    check: "text-blue-500",
  },
  restaurant: {
    container: "border-orange-500 bg-orange-50/50 dark:bg-orange-900/20",
    icon: "bg-orange-500 text-white shadow-lg",
    text: "text-orange-600 dark:text-orange-400",
    check: "text-orange-500",
  },
  admin: {
    container: "border-purple-500 bg-purple-50/50 dark:bg-purple-900/20",
    icon: "bg-purple-500 text-white shadow-lg",
    text: "text-purple-600 dark:text-purple-400",
    check: "text-purple-500",
  },
};

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
      setForm({ name: "", email: "", password: "", role: "customer" });
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

      // ADD USER
      if (mode === "add") {
        const res = await API.post("/auth/register", form);

        const userId = res.data?.user?._id;

        // Update role if not customer
        if (userId && form.role !== "customer") {
          await API.put(`/admin/users/role/${userId}`, {
            role: form.role,
          });
        }
      }

      // EDIT USER
      if (mode === "edit") {
        await API.put(`/admin/users/${user._id}`, {
          name: form.name,
          role: form.role,
          ...(form.password && { password: form.password }),
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      id: "customer",
      label: "Customer",
      icon: FaUserCircle,
      desc: "Can browse and place orders",
      color: "blue",
    },
    {
      id: "restaurant",
      label: "Restaurant",
      icon: FaStore,
      desc: "Manage menus and incoming orders",
      color: "orange",
    },
    {
      id: "admin",
      label: "Admin",
      icon: FaUserShield,
      desc: "Full access to system settings",
      color: "purple",
    },
  ];

  const containerVariants = {
    hidden: {
      x: "100%",
      transition: { type: "spring", damping: 35, stiffness: 300 },
    },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        damping: 35,
        stiffness: 300,
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white dark:bg-slate-900 z-[70] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Top Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600" />

            {/* Header */}
            <div className="p-8 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3"
                  >
                    User Management
                  </motion.span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {mode === "add"
                      ? "Create User"
                      : mode === "edit"
                      ? "Edit Profile"
                      : "User Info"}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <FaTimes size={20} />
                </motion.button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
              <div className="space-y-6">
                {/* Input Component Wrapper */}
                {[
                  {
                    id: "name",
                    label: "Full Name",
                    icon: FaUser,
                    type: "text",
                    placeholder: "John Doe",
                    disabled: mode === "view",
                  },
                  {
                    id: "email",
                    label: "Email Address",
                    icon: FaEnvelope,
                    type: "email",
                    placeholder: "john@example.com",
                    disabled: mode !== "add",
                  },
                  {
                    id: "password",
                    label: mode === "edit" ? "Update Password" : "Password",
                    icon: FaLock,
                    type: "password",
                    placeholder: "••••••••",
                    disabled: mode === "view",
                    hide: mode === "view",
                  },
                ].map(
                  (field) =>
                    !field.hide && (
                      <motion.div key={field.id} variants={itemVariants}>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                          {field.label}
                        </label>
                        <div className="relative group">
                          <div
                            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                              focusedField === field.id
                                ? "text-blue-500"
                                : "text-slate-400"
                            }`}
                          >
                            <field.icon />
                          </div>
                          <input
                            type={field.type}
                            name={field.id}
                            value={form[field.id]}
                            onChange={handleChange}
                            disabled={field.disabled}
                            onFocus={() => setFocusedField(field.id)}
                            onBlur={() => setFocusedField("")}
                            placeholder={field.placeholder}
                            className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 outline-none
                          ${
                            field.disabled
                              ? "bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed border-slate-100 dark:border-slate-800"
                              : focusedField === field.id
                              ? "border-blue-500 bg-white dark:bg-slate-900 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                              : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700"
                          }
                          text-slate-900 dark:text-white font-medium`}
                          />
                        </div>
                      </motion.div>
                    )
                )}

                {/* Modern Role Selection */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                    Assign Account Role
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {roleOptions.map((role) => (
                      <button
                        key={role.id}
                        disabled={mode === "view"}
                        onClick={() => setForm({ ...form, role: role.id })}
                        className={`relative flex items-center p-4 rounded-2xl border-2 transition-all duration-200
  ${
    form.role === role.id
      ? ROLE_STYLES[role.id].container
      : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
  }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
  ${
    form.role === role.id
      ? ROLE_STYLES[role.id].icon
      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
  }`}
                        >
                          <role.icon size={20} />
                        </div>
                        <div className="ml-4 text-left">
                          <p
                            className={`font-bold text-sm ${
                              form.role === role.id
                                ? ROLE_STYLES[role.id].text
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {role.label}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {role.desc}
                          </p>
                        </div>
                        {form.role === role.id && (
                          <motion.div
                            layoutId="activeCheck"
                            className={`absolute right-4 ${
                              ROLE_STYLES[role.id].check
                            }`}
                          >
                            <FaCheckCircle size={20} />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Premium Error Card */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center gap-3 text-red-600 dark:text-red-400"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                        <FaTimes size={12} />
                      </div>
                      <p className="text-xs font-bold">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Premium Footer */}
            <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </motion.button>

                {mode !== "view" && (
                  <motion.button
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[1.5] relative overflow-hidden px-6 py-4 rounded-2xl font-bold text-white shadow-xl shadow-blue-500/25 disabled:opacity-70 disabled:translate-y-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                    <span className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : mode === "add" ? (
                        "Launch Account"
                      ) : (
                        "Sync Changes"
                      )}
                    </span>
                  </motion.button>
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
