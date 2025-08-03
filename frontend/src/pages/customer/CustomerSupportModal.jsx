import React, { useState } from "react";
import API from "../../api/axios";

const CustomerSupportModal = ({ order, onClose }) => {
  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!issueType) return alert("Please select an issue type");

    try {
      setSubmitting(true);

      await API.post("/support/submit", {
        orderId: order._id,
        issue: issueType,
        message,
      });

      alert("✅ Your support request has been submitted!");
      onClose();
    } catch (err) {
      console.error("❌ Error submitting support request:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-0 backdrop-blur-md">
      <div className="bg-white dark:bg-secondary w-full max-w-md rounded-xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 text-primary">
          🆘 Help with Your Order
        </h2>

        <label className="block text-sm font-medium mb-1">Issue Type</label>
        <select
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="">-- Select an issue --</option>
          <option value="late">Order is Late</option>
          <option value="missing">Missing Item</option>
          <option value="wrong">Wrong Order</option>
          <option value="quality">Food Quality Issue</option>
          <option value="other">Other</option>
        </select>

        <label className="block text-sm font-medium mb-1">
          Details (optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 mb-4"
          placeholder="Describe your issue..."
        ></textarea>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-primary text-white py-2 rounded hover:bg-orange-600 transition disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Support Request"}
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportModal;
