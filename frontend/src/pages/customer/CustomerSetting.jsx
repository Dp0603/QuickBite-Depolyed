import React, { useState, useEffect, useContext, useRef } from "react";
import {
  FaMoon,
  FaSun,
  FaBell,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUser,
  FaShieldAlt,
  FaPalette,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEdit,
  FaKey,
  FaCog,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CustomerSettings = () => {
  const { user, token, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Save CTA visibility
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const idleTimer = useRef(null);
  const lastScrollY = useRef(0);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/users/me");
        const userData = res.data.user;
        setEmail(userData.email || "");
        setPhone(userData.phone || "");
        setUser(userData);
        // If backend stores preference, hydrate:
        if (typeof userData.darkMode === "boolean")
          setDarkMode(userData.darkMode);
        if (typeof userData.notifications === "boolean")
          setNotifications(userData.notifications);
      } catch (err) {
        console.error("❌ Failed to fetch user profile:", err?.message || err);
      }
    };

    fetchProfile();

    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) setDarkMode(storedDarkMode === "true");
  }, [token, setUser]);

  // Apply dark mode to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Slide-up Save button logic: show when scrolling down; hide after 3s idle
  useEffect(() => {
    const onActivity = () => {
      // If already visible, just reset idle timer
      setShowSaveButton(true);
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setShowSaveButton(false), 3000);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastScrollY.current;
      lastScrollY.current = y;

      if (goingDown && y > 200) {
        setShowSaveButton(true);
        onActivity();
      } else if (y < 120) {
        setShowSaveButton(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onActivity);
    window.addEventListener("keydown", onActivity);
    window.addEventListener("click", onActivity);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("click", onActivity);
      clearTimeout(idleTimer.current);
    };
  }, []);

  // Save Preferences
  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      localStorage.setItem("darkMode", darkMode);

      await API.put(
        `/users/users/${user?._id}`,
        { darkMode, notifications },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2500);
    } catch (err) {
      console.error("❌ Failed to save preferences", err);
      alert("Failed to update preferences.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    setDeleteError("");

    if (deleteInput !== "DELETE") {
      setDeleteError("Type DELETE exactly to confirm.");
      return;
    }

    try {
      setDeleting(true);

      if (!user || !user._id) {
        setDeleteError("User ID not available. Please re-login and try again.");
        setDeleting(false);
        return;
      }

      await API.delete(`/users/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Success
      setShowDeleteModal(false);
      setDeleting(false);
      setDeleteInput("");
      alert("Your account has been deleted.");
      logout();
      navigate("/");
    } catch (err) {
      console.error("❌ Failed to delete account:", err);
      setDeleteError(
        err?.response?.data?.message ||
          "Account deletion failed. Please try again."
      );
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-800 dark:text-white">
      <motion.div
        className="px-6 sm:px-10 lg:px-16 py-10 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="text-orange-500"
            >
              <FaCog size={26} />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
            Manage your preferences and security settings
          </p>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-2xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-500/30 flex items-center gap-3"
            >
              <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
              <span className="font-semibold text-green-700 dark:text-green-300">
                Preferences saved successfully!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Appearance */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-md">
                <FaPalette />
              </div>
              <h2 className="text-2xl font-black">Appearance</h2>
            </div>
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <FaMoon className="text-purple-600" />
                ) : (
                  <FaSun className="text-yellow-500" />
                )}
                <div>
                  <p className="font-bold">Dark Mode</p>
                  <p className="text-sm text-gray-500">
                    {darkMode ? "Dark theme active" : "Light theme active"}
                  </p>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                  darkMode
                    ? "bg-gradient-to-r from-purple-500 to-pink-600"
                    : "bg-gray-300"
                } hover:ring-2 hover:ring-orange-200`}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: darkMode ? 24 : 0 }}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
                <FaBell />
              </div>
              <h2 className="text-2xl font-black">Notifications</h2>
            </div>
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <FaBell className="text-blue-600" />
                <div>
                  <p className="font-bold">Order Updates</p>
                  <p className="text-sm text-gray-500">
                    Get notified about your orders
                  </p>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                  notifications
                    ? "bg-gradient-to-r from-orange-500 to-pink-600"
                    : "bg-gray-300"
                } hover:ring-2 hover:ring-orange-200`}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: notifications ? 24 : 0 }}
                />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Contact Info + Security */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Contact Info */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center">
                  <FaUser />
                </div>
                <h2 className="text-2xl font-black">Contact Info</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate("/customer/profile")}
                className="text-sm text-blue-600 hover:underline"
              >
                <FaEdit className="inline mr-1" /> Edit
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <FaEnvelope className="inline text-orange-500 mr-2" />
              {email || "Not set"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <FaPhone className="inline text-green-500 mr-2" />
              {phone || "Not set"}
            </p>
          </motion.div>

          {/* Security */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center">
                  <FaShieldAlt />
                </div>
                <h2 className="text-2xl font-black">Security</h2>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <div>
                <p className="font-bold">Password</p>
                <p className="text-sm text-gray-500">••••••••</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/customer/change-password")}
                className="text-purple-600 font-semibold hover:underline"
              >
                <FaKey className="inline mr-1" /> Change
              </button>
            </div>
          </motion.div>
        </div>

        {/* Danger Zone */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-red-300 dark:border-red-500/40 shadow-md hover:shadow-xl transition mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center">
              <FaExclamationTriangle />
            </div>
            <h2 className="text-2xl font-black text-red-600 dark:text-red-400">
              Danger Zone
            </h2>
          </div>
          <p className="text-red-600 dark:text-red-400 mb-4">
            Deleting your account is permanent and cannot be undone.
          </p>
          <button
            type="button"
            onClick={() => {
              setDeleteError("");
              setDeleteInput("");
              setShowDeleteModal(true);
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold hover:shadow-lg transition"
          >
            Delete My Account
          </button>
        </motion.div>

        {/* Account Insights (Bottom) */}
        <div className="grid md:grid-cols-2 gap-6 mb-24">
          {/* Privacy Tip */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-300 dark:border-blue-500/30 shadow-md">
            <div className="flex items-start gap-3">
              <FaShieldAlt className="text-blue-600 text-xl mt-1" />
              <div>
                <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-1">
                  Privacy Tip
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Your personal data is never shared with third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-300 dark:border-green-500/30 shadow-md">
            <h3 className="font-bold text-green-700 dark:text-green-300 mb-2">
              Account Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Email Verified</span>
                <FaCheckCircle className="text-green-600 dark:text-green-400" />
              </div>
              <div className="flex items-center justify-between">
                <span>Phone Verified</span>
                <FaCheckCircle className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Slide-up Save Preferences Button */}
        <AnimatePresence>
          {showSaveButton && (
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="fixed inset-x-0 bottom-6 z-50"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }} // iOS safe area
            >
              <div className="flex justify-center">
                <motion.button
                  type="button"
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: saving ? 1 : 1.05 }}
                  whileTap={{ scale: saving ? 1 : 0.95 }}
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Save Preferences
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-orange-200 dark:border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Delete Account?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This action cannot be undone. Type <b>DELETE</b> to confirm.
                </p>
              </div>

              <input
                type="text"
                value={deleteInput}
                onChange={(e) => {
                  setDeleteInput(e.target.value);
                  setDeleteError("");
                }}
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-3 mb-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
              />
              {deleteError && (
                <p className="text-red-500 text-sm mb-3">{deleteError}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteInput !== "DELETE"}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerSettings;

//old
// import React, { useState, useEffect, useContext } from "react";
// import {
//   FaMoon,
//   FaBell,
//   FaTrash,
//   FaEnvelope,
//   FaPhone,
//   FaLock,
// } from "react-icons/fa";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const CustomerSettings = () => {
//   const { user, token, logout, setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [darkMode, setDarkMode] = useState(false);
//   const [notifications, setNotifications] = useState(true);
//   const [email, setEmail] = useState(user?.email || "");
//   const [phone, setPhone] = useState(user?.phone || "");
//   const [saving, setSaving] = useState(false);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteInput, setDeleteInput] = useState("");
//   const [deleting, setDeleting] = useState(false);

//   // ✅ Fetch the latest user profile on mount
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         // Keep double "users" in the path to match your backend
//         const res = await API.get("/users/users/me");
//         const userData = res.data.user;

//         setEmail(userData.email || "");
//         setPhone(userData.phone || "");
//         setUser(userData); // Sync AuthContext
//       } catch (err) {
//         console.error("❌ Failed to fetch user profile:", err.message);
//       }
//     };

//     fetchProfile();

//     const storedDarkMode = localStorage.getItem("darkMode");
//     if (storedDarkMode !== null) setDarkMode(storedDarkMode === "true");
//   }, [token, setUser]);

//   const handleSavePreferences = async () => {
//     setSaving(true);
//     try {
//       localStorage.setItem("darkMode", darkMode);

//       await API.put(
//         `/users/users/${user._id}`,
//         { darkMode, notifications },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Preferences saved successfully ✅");
//     } catch (err) {
//       console.error("❌ Failed to save preferences", err);
//       alert("Failed to update preferences.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (deleteInput !== "DELETE") {
//       alert("You must type DELETE to confirm.");
//       return;
//     }

//     try {
//       setDeleting(true);

//       if (!user || !user._id) {
//         alert("User ID not available.");
//         return;
//       }

//       // Delete user with correct route
//       await API.delete(`/users/users/${user._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert("Your account has been deleted.");
//       logout();
//       navigate("/");
//     } catch (err) {
//       console.error("❌ Failed to delete account:", err);
//       alert("Account deletion failed.");
//     } finally {
//       setDeleting(false);
//       setShowDeleteModal(false);
//       setDeleteInput("");
//     }
//   };

//   const cardClass =
//     "flex justify-between items-center bg-white dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition";

//   return (
//     <div className="p-6 max-w-3xl mx-auto text-gray-800 dark:text-white space-y-10">
//       <h1 className="text-4xl font-bold text-primary">⚙️ Settings</h1>

//       {/* Appearance */}
//       <section className="space-y-3">
//         <h2 className="text-xl font-semibold flex items-center gap-2">
//           <FaMoon className="text-primary" />
//           Appearance
//         </h2>
//         <div className={cardClass}>
//           <span className="font-medium">Dark Mode</span>
//           <button
//             aria-label="Toggle dark mode"
//             onClick={() => setDarkMode(!darkMode)}
//             className={`relative w-12 h-6 rounded-full transition-colors ${
//               darkMode ? "bg-blue-600" : "bg-gray-300"
//             }`}
//           >
//             <span
//               className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//                 darkMode ? "translate-x-6" : ""
//               }`}
//             ></span>
//           </button>
//         </div>
//       </section>

//       {/* Notifications */}
//       <section className="space-y-3">
//         <h2 className="text-xl font-semibold flex items-center gap-2">
//           <FaBell className="text-primary" />
//           Notifications
//         </h2>
//         <div className={cardClass}>
//           <span className="font-medium">Order Updates</span>
//           <button
//             aria-label="Toggle notifications"
//             onClick={() => setNotifications(!notifications)}
//             className={`relative w-12 h-6 rounded-full transition-colors ${
//               notifications ? "bg-blue-600" : "bg-gray-300"
//             }`}
//           >
//             <span
//               className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//                 notifications ? "translate-x-6" : ""
//               }`}
//             ></span>
//           </button>
//         </div>
//       </section>

//       {/* Contact Info */}
//       <section className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-semibold flex items-center gap-2">
//             <FaEnvelope className="text-primary" />
//             Contact Info
//           </h2>
//           <button
//             className="text-sm text-blue-600 hover:underline"
//             onClick={() => navigate("/customer/profile")}
//           >
//             Edit
//           </button>
//         </div>
//         <div className="space-y-3">
//           <div className="flex items-center gap-3">
//             <FaEnvelope className="text-primary shrink-0" />
//             <input
//               type="email"
//               className="border dark:border-gray-700 rounded px-3 py-2 w-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary cursor-not-allowed"
//               value={email}
//               disabled
//             />
//           </div>
//           <div className="flex items-center gap-3">
//             <FaPhone className="text-primary shrink-0" />
//             <input
//               type="text"
//               className="border dark:border-gray-700 rounded px-3 py-2 w-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary cursor-not-allowed"
//               value={phone}
//               disabled
//             />
//           </div>
//         </div>
//       </section>

//       {/* Security */}
//       <section className="space-y-3">
//         <h2 className="text-xl font-semibold flex items-center gap-2">
//           <FaLock className="text-primary" />
//           Security
//         </h2>
//         <div className={cardClass}>
//           <span className="text-gray-700 dark:text-gray-300 font-medium">
//             Change Password
//           </span>
//           <button
//             className="text-sm text-blue-600 hover:underline"
//             onClick={() => navigate("/customer/change-password")}
//           >
//             Change
//           </button>
//         </div>
//       </section>

//       {/* Save Button */}
//       <div className="sticky bottom-4 w-full py-2 bg-white/90 dark:bg-black/60 backdrop-blur rounded-xl shadow-lg z-10">
//         <button
//           onClick={handleSavePreferences}
//           disabled={saving}
//           className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
//         >
//           {saving ? "Saving..." : "💾 Save Preferences"}
//         </button>
//       </div>

//       {/* Danger Zone */}
//       <section className="space-y-3">
//         <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
//         <p className="text-sm text-red-400">
//           Deleting your account is permanent and cannot be undone.
//         </p>
//         <div className="flex justify-between items-center bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 p-5 rounded-xl border border-red-300 dark:border-red-700 shadow">
//           <div className="flex items-center gap-3 text-red-600 font-medium">
//             <FaTrash />
//             Delete Account
//           </div>
//           <button
//             onClick={() => setShowDeleteModal(true)}
//             className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
//           >
//             Delete
//           </button>
//         </div>
//       </section>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//           <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4 shadow-xl">
//             <h3 className="text-xl font-bold text-red-600">Confirm Deletion</h3>
//             <p className="text-gray-700 dark:text-gray-300">
//               This will permanently delete your account. This action cannot be
//               undone. Please type <strong>DELETE</strong> to confirm.
//             </p>
//             <input
//               type="text"
//               value={deleteInput}
//               onChange={(e) => setDeleteInput(e.target.value)}
//               placeholder="Type DELETE to confirm"
//               className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
//             />
//             <div className="flex justify-end gap-3 pt-2">
//               <button
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setDeleteInput("");
//                 }}
//                 className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteAccount}
//                 disabled={deleting}
//                 className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60"
//               >
//                 {deleting ? "Deleting..." : "Confirm Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerSettings;
