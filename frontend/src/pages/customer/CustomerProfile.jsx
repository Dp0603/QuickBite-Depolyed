import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { motion } from "framer-motion";
import { FaEdit, FaSave, FaTimes, FaUserAlt } from "react-icons/fa";

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser._id) return;

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
    setSaving(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id;

      await API.put(`/users/users/${userId}`, formData);
      setEditing(false);
      const updatedUser = {
        ...storedUser,
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      fetchProfile();
    } catch (err) {
      console.error("❌ Update failed:", err.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-700 dark:text-white text-lg animate-pulse">
        Loading your profile...
      </div>
    );

  if (!profile)
    return (
      <div className="p-6 text-center text-red-500">
        Unable to load profile. Please try again.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 px-4"
    >
      <div className="max-w-3xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-2xl rounded-3xl p-8 space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-pink-400/10 to-orange-400/10 animate-gradientFlow"></div>

        {/* Header */}
        <div className="relative z-10 text-center mb-6">
          <h1 className="text-4xl font-black bg-gradient-to-r from-orange-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-gradientFlow">
            🙋‍♂️ My Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your QuickBite account details
          </p>
        </div>

        {/* Avatar Section */}
        <motion.div
          className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start sm:justify-start gap-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative group">
            <img
              src={formData.avatar || "https://i.pravatar.cc/150"}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-orange-500 shadow-lg object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {editing && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <FaUserAlt className="text-white text-2xl" />
              </div>
            )}
          </div>
          <div>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-2xl font-semibold bg-transparent border-b-2 border-gray-300 focus:border-orange-500 transition-all outline-none"
              />
            ) : (
              <h2 className="text-3xl font-semibold">{profile.name}</h2>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {profile.email}
            </p>
          </div>
        </motion.div>

        {/* Details Grid */}
        <motion.div
          className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Phone */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Phone
            </p>
            {editing ? (
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none text-base"
              />
            ) : (
              <p className="text-lg font-medium">{profile.phone || "N/A"}</p>
            )}
          </div>

          {/* Role */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Role
            </p>
            <p className="text-lg font-medium capitalize">{profile.role}</p>
          </div>

          {/* Status */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Account Status
            </p>
            <p className="text-lg font-medium">
              {profile.isActive ? (
                <span className="text-green-600 dark:text-green-400">
                  ✅ Active
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400">
                  ❌ Inactive
                </span>
              )}
            </p>
          </div>

          {/* Avatar URL */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Avatar URL
            </p>
            {editing ? (
              <input
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none text-sm truncate"
              />
            ) : (
              <p className="text-sm text-blue-600 dark:text-blue-400 truncate">
                {formData.avatar || "N/A"}
              </p>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="relative z-10 flex justify-end gap-4 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all shadow-md ${
                  saving
                    ? "bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-[length:200%_100%] animate-shimmer cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:brightness-110"
                }`}
              >
                <FaSave />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CustomerProfile;

//old
// import React, { useEffect, useState } from "react";
// import API from "../../api/axios";

// const CustomerProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [formData, setFormData] = useState({ name: "", phone: "", avatar: "" });
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);

//   const fetchProfile = async () => {
//     try {
//       const storedUser = JSON.parse(localStorage.getItem("user"));
//       if (!storedUser || !storedUser._id) {
//         console.error("❌ User not found in localStorage");
//         return;
//       }

//       const res = await API.get(`/users/users/${storedUser._id}`);
//       const userData = res.data.user;
//       setProfile(userData);
//       setFormData({
//         name: userData.name || "",
//         phone: userData.phone || "",
//         avatar: userData.avatar || "",
//       });
//     } catch (err) {
//       console.error("❌ Failed to fetch profile:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const storedUser = JSON.parse(localStorage.getItem("user"));
//       const userId = storedUser?._id;

//       await API.put(`/users/users/${userId}`, formData);
//       alert("✅ Profile updated!");
//       setEditing(false);

//       // Update localStorage
//       const updatedUser = {
//         ...storedUser,
//         name: formData.name,
//         phone: formData.phone,
//         avatar: formData.avatar,
//       };
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       fetchProfile(); // refetch fresh data
//     } catch (err) {
//       console.error("❌ Update failed:", err.message);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 text-center text-gray-700 dark:text-white">
//         Loading profile...
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="p-6 text-center text-red-500">
//         Unable to load profile data. Please try again later.
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 text-gray-800 dark:text-white max-w-2xl mx-auto">
//       <h1 className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">
//         🙋‍♂️ My Profile
//       </h1>

//       <div className="bg-white dark:bg-secondary border dark:border-gray-700 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6">
//         {/* Avatar and Name */}
//         <div className="flex items-center space-x-5">
//           <img
//             src={formData.avatar || "https://i.pravatar.cc/150"}
//             alt="Avatar"
//             className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md object-cover"
//           />
//           <div>
//             {editing ? (
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="text-xl font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
//               />
//             ) : (
//               <h2 className="text-2xl font-semibold">{profile.name}</h2>
//             )}
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {profile.email}
//             </p>
//           </div>
//         </div>

//         {/* Profile Details */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
//           <div>
//             <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
//             {editing ? (
//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
//               />
//             ) : (
//               <p className="text-base font-medium">{profile.phone || "N/A"}</p>
//             )}
//           </div>

//           <div>
//             <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
//             <p className="text-base font-medium capitalize">{profile.role}</p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
//             <p className="text-base font-medium">
//               {profile.isActive ? "✅ Active" : "❌ Inactive"}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Avatar URL
//             </p>
//             {editing ? (
//               <input
//                 name="avatar"
//                 value={formData.avatar}
//                 onChange={handleChange}
//                 className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
//               />
//             ) : (
//               <p className="text-base font-medium text-blue-500 truncate">
//                 {formData.avatar || "N/A"}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="text-right pt-6 space-x-3">
//           {editing ? (
//             <>
//               <button
//                 onClick={() => setEditing(false)}
//                 className="px-4 py-2 border rounded text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow"
//               >
//                 💾 Save
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => setEditing(true)}
//               className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition duration-200 shadow-lg"
//             >
//               ✏️ Edit Profile
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerProfile;
