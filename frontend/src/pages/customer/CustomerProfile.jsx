import React, { useEffect, useState } from "react";
import API from "../../api/axios"; // Adjust path if needed

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/customer/profile"); // ✅ Removed double /api
      setProfile(res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch profile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
        Unable to load profile data.
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🙋‍♂️ My Profile</h1>

      <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow border dark:border-gray-700 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100"
            alt="User"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile.email}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">Phone</p>
          <p className="text-base font-medium">{profile.phone || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">
            Primary Address
          </p>
          <p className="text-base font-medium">
            {profile.address || "Not added yet"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
