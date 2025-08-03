import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser._id) {
        console.error("❌ User not found in localStorage");
        return;
      }

      const res = await API.get(`/users/users/${storedUser._id}`);
      const userData = res.data.user;
      setProfile(userData);
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        avatar: userData.avatar || "",
      });
    } catch (err) {
      console.error("❌ Failed to fetch profile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id;

      await API.put(`/users/users/${userId}`, formData);
      alert("✅ Profile updated!");
      setEditing(false);

      // Update localStorage
      const updatedUser = {
        ...storedUser,
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      fetchProfile(); // refetch fresh data
    } catch (err) {
      console.error("❌ Update failed:", err.message);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-white">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-red-500">
        Unable to load profile data. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">
        🙋‍♂️ My Profile
      </h1>

      <div className="bg-white dark:bg-secondary border dark:border-gray-700 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Avatar and Name */}
        <div className="flex items-center space-x-5">
          <img
            src={formData.avatar || "https://i.pravatar.cc/150"}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md object-cover"
          />
          <div>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-xl font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile.email}
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            {editing ? (
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <p className="text-base font-medium">{profile.phone || "N/A"}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
            <p className="text-base font-medium capitalize">{profile.role}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="text-base font-medium">
              {profile.isActive ? "✅ Active" : "❌ Inactive"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Avatar URL
            </p>
            {editing ? (
              <input
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <p className="text-base font-medium text-blue-500 truncate">
                {formData.avatar || "N/A"}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-right pt-6 space-x-3">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow"
              >
                💾 Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition duration-200 shadow-lg"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
