// src/pages/restaurant/RestaurantStaff.jsx
import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import dayjs from "dayjs";

const roles = ["Manager", "Chef", "Cashier", "Delivery"];

const RestaurantStaff = () => {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "restaurant", // ✅ always restaurant
    subRole: "", // ✅ one role only
    active: true,
  });
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  // ---------------- Fetch staff from backend ----------------
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await API.get("/admin/restaurants/staff");
        const normalized = (res.data.staff || []).map((s) => ({
          ...s,
          id: s.id || s._id,
          subRole: s.subRole || "",
          isActive: s.active, // normalize active field 
        }));
        setStaff(normalized);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch staff");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // ---------------- Form input change ----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ---------------- Submit add/edit staff ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStaff) {
        const res = await API.put(
          `/admin/restaurants/staff/${editingStaff.id}`,
          formData
        );
        const updated = {
          ...res.data.staff,
          id: res.data.staff.id || res.data.staff._id,
          isActive: res.data.staff.active,
          subRole: res.data.staff.subRole || "",
        };
        setStaff((prev) =>
          prev.map((s) => (s.id === editingStaff.id ? updated : s))
        );
        toast.success("Staff updated successfully");
      } else {
        const res = await API.post("/admin/restaurants/staff", formData);
        const added = {
          ...res.data.staff,
          id: res.data.staff.id || res.data.staff._id,
          isActive: res.data.staff.active,
          subRole: res.data.staff.subRole || "",
        };
        setStaff((prev) => [...prev, added]);
        toast.success("Staff added successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save staff");
    } finally {
      resetForm();
    }
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      role: member.role,
      subRole: member.subRole || "",
      active: member.isActive,
    });
    setShowForm(true);
  };

  const handleRemove = async (id) => {
    try {
      await API.delete(`/admin/restaurants/staff/${id}`);
      setStaff((prev) => prev.filter((s) => s.id !== id));
      toast.success("Staff removed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove staff");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingStaff(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "restaurant",
      subRole: "",
      active: true,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Restaurant Staff Management
      </h2>

      {/* Staff Table */}
      <div className="overflow-x-auto border rounded-md shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Joined</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center">
                  Loading staff...
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  No staff found.
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-4 py-2 font-medium">{member.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {member.email}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {member.phone || "—"}
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {member.role}
                      {member.subRole ? ` (${member.subRole})` : ""}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        member.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {dayjs(member.createdAt).format("DD MMM YYYY")}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Button */}
      <button
        onClick={() => setShowForm(true)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        + Add Staff
      </button>

      {/* Staff Form */}
      {showForm && (
        <div className="mt-6 p-6 border rounded-md shadow-md max-w-md bg-white dark:bg-gray-900">
          <h3 className="text-xl font-semibold mb-4">
            {editingStaff ? "Edit Staff" : "Add New Staff"}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone || ""}
              onChange={handleChange}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Dropdown for SubRole */}
            <select
              name="subRole"
              value={formData.subRole}
              onChange={handleChange}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r} value={r.toLowerCase()}>
                  {r}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              Active
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={
                  !formData.name || !formData.email || !formData.subRole
                }
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RestaurantStaff;
