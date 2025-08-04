import React, { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const ChangePassword = () => {
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

export default ChangePassword;
