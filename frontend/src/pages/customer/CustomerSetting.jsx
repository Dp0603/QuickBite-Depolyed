import React, { useState, useEffect, useContext } from "react";
import {
  FaMoon,
  FaBell,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaLock,
} from "react-icons/fa";
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  // ✅ Fetch the latest user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Keep double "users" in the path to match your backend
        const res = await API.get("/users/users/me");
        const userData = res.data.user;

        setEmail(userData.email || "");
        setPhone(userData.phone || "");
        setUser(userData); // Sync AuthContext
      } catch (err) {
        console.error("❌ Failed to fetch user profile:", err.message);
      }
    };

    fetchProfile();

    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) setDarkMode(storedDarkMode === "true");
  }, [token, setUser]);

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      localStorage.setItem("darkMode", darkMode);

      await API.put(
        `/users/users/${user._id}`,
        { darkMode, notifications },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Preferences saved successfully ✅");
    } catch (err) {
      console.error("❌ Failed to save preferences", err);
      alert("Failed to update preferences.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") {
      alert("You must type DELETE to confirm.");
      return;
    }

    try {
      setDeleting(true);

      if (!user || !user._id) {
        alert("User ID not available.");
        return;
      }

      // Delete user with correct route
      await API.delete(`/users/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Your account has been deleted.");
      logout();
      navigate("/");
    } catch (err) {
      console.error("❌ Failed to delete account:", err);
      alert("Account deletion failed.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeleteInput("");
    }
  };

  const cardClass =
    "flex justify-between items-center bg-white dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition";

  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800 dark:text-white space-y-10">
      <h1 className="text-4xl font-bold text-primary">⚙️ Settings</h1>

      {/* Appearance */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaMoon className="text-primary" />
          Appearance
        </h2>
        <div className={cardClass}>
          <span className="font-medium">Dark Mode</span>
          <button
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              darkMode ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                darkMode ? "translate-x-6" : ""
              }`}
            ></span>
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaBell className="text-primary" />
          Notifications
        </h2>
        <div className={cardClass}>
          <span className="font-medium">Order Updates</span>
          <button
            aria-label="Toggle notifications"
            onClick={() => setNotifications(!notifications)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              notifications ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                notifications ? "translate-x-6" : ""
              }`}
            ></span>
          </button>
        </div>
      </section>

      {/* Contact Info */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaEnvelope className="text-primary" />
            Contact Info
          </h2>
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate("/customer/profile")}
          >
            Edit
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-primary shrink-0" />
            <input
              type="email"
              className="border dark:border-gray-700 rounded px-3 py-2 w-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary cursor-not-allowed"
              value={email}
              disabled
            />
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="text-primary shrink-0" />
            <input
              type="text"
              className="border dark:border-gray-700 rounded px-3 py-2 w-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary cursor-not-allowed"
              value={phone}
              disabled
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaLock className="text-primary" />
          Security
        </h2>
        <div className={cardClass}>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Change Password
          </span>
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate("/customer/change-password")}
          >
            Change
          </button>
        </div>
      </section>

      {/* Save Button */}
      <div className="sticky bottom-4 w-full py-2 bg-white/90 dark:bg-black/60 backdrop-blur rounded-xl shadow-lg z-10">
        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "💾 Save Preferences"}
        </button>
      </div>

      {/* Danger Zone */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
        <p className="text-sm text-red-400">
          Deleting your account is permanent and cannot be undone.
        </p>
        <div className="flex justify-between items-center bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 p-5 rounded-xl border border-red-300 dark:border-red-700 shadow">
          <div className="flex items-center gap-3 text-red-600 font-medium">
            <FaTrash />
            Delete Account
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Delete
          </button>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-red-600">Confirm Deletion</h3>
            <p className="text-gray-700 dark:text-gray-300">
              This will permanently delete your account. This action cannot be
              undone. Please type <strong>DELETE</strong> to confirm.
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteInput("");
                }}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSettings;
