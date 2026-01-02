// import React, { useEffect, useState } from "react";
// import API from "../../api/axios";

// const AdminProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//     avatar: "",
//     isActive: true,
//   });
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);

//   const fetchProfile = async () => {
//     try {
//       const storedUser = JSON.parse(localStorage.getItem("user"));
//       if (!storedUser || !storedUser._id) {
//         console.error("❌ Admin not found in localStorage");
//         return;
//       }

//       const res = await API.get(`/admin/profile/${storedUser._id}`);
//       const adminData = res.data.data || res.data.user; // depending on API structure
//       setProfile(adminData);
//       setFormData({
//         name: adminData.name || "",
//         email: adminData.email || "",
//         phone: adminData.phone || "",
//         role: adminData.role || "",
//         avatar: adminData.avatar || "",
//         isActive: adminData.isActive ?? true,
//       });
//     } catch (err) {
//       console.error("❌ Failed to fetch admin profile:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const storedUser = JSON.parse(localStorage.getItem("user"));
//       const userId = storedUser?._id;

//       await API.put(`/admin/profile/${userId}`, formData);
//       alert("✅ Admin profile updated!");
//       setEditing(false);

//       // Update localStorage
//       const updatedUser = { ...storedUser, ...formData };
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
//         Loading admin profile...
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="p-6 text-center text-red-500">
//         Unable to load admin profile. Please try again later.
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 text-gray-800 dark:text-white max-w-2xl mx-auto">
//       <h1 className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">
//         🛠️ Admin Profile
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
//             {editing ? (
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
//               >
//                 <option value="admin">Admin</option>
//                 <option value="superadmin">Super Admin</option>
//               </select>
//             ) : (
//               <p className="text-base font-medium capitalize">{profile.role}</p>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
//             {editing ? (
//               <input
//                 type="checkbox"
//                 name="isActive"
//                 checked={formData.isActive}
//                 onChange={handleChange}
//                 className="w-5 h-5 accent-blue-500"
//               />
//             ) : (
//               <p className="text-base font-medium">
//                 {profile.isActive ? "✅ Active" : "❌ Inactive"}
//               </p>
//             )}
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

// export default AdminProfile;

// new but not tested
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaCrown,
  FaUserShield,
  FaKey,
  FaSignOutAlt,
  FaHistory,
  FaCog,
  FaBell,
  FaLock,
  FaGlobe,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaIdCard,
  FaSpinner,
  FaExclamationTriangle,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaUpload,
  FaTrash,
  FaMoon,
  FaSun,
  FaDesktop,
} from "react-icons/fa";
import API from "../../api/axios";

/* -------------------------------------------------------------- */
/* MAIN COMPONENT                                                  */
/* -------------------------------------------------------------- */

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser._id) {
        console.error("❌ Admin not found in localStorage");
        return;
      }

      const res = await API.get(`/admin/profile/${storedUser._id}`);
      const adminData = res.data.data || res.data.user;
      setProfile(adminData);
      setFormData({
        name: adminData.name || "",
        email: adminData.email || "",
        phone: adminData.phone || "",
        role: adminData.role || "",
        avatar: adminData.avatar || "",
        isActive: adminData.isActive ?? true,
      });
    } catch (err) {
      console.error("❌ Failed to fetch admin profile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id;

      await API.put(`/admin/profile/${userId}`, formData);

      // Update localStorage
      const updatedUser = { ...storedUser, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setEditing(false);
      showNotification("success", "Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      console.error("❌ Update failed:", err.message);
      showNotification("error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <LoadingState />;
  if (!profile) return <ErrorState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <NotificationToast
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          )}
        </AnimatePresence>

        {/* Hero Header */}
        <HeroHeader profile={profile} formData={formData} />

        {/* Profile Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <ProfileCard
              profile={profile}
              formData={formData}
              editing={editing}
              onEditAvatar={() => setShowAvatarModal(true)}
            />

            <QuickStats profile={profile} />

            <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <ProfileDetails
                  key="profile"
                  profile={profile}
                  formData={formData}
                  editing={editing}
                  saving={saving}
                  handleChange={handleChange}
                  handleUpdate={handleUpdate}
                  setEditing={setEditing}
                />
              )}
              {activeTab === "security" && (
                <SecuritySettings
                  key="security"
                  onChangePassword={() => setShowPasswordModal(true)}
                />
              )}
              {activeTab === "activity" && <ActivityLog key="activity" />}
              {activeTab === "preferences" && <Preferences key="preferences" />}
            </AnimatePresence>
          </div>
        </div>

        {/* Password Change Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <PasswordChangeModal
              onClose={() => setShowPasswordModal(false)}
              onSuccess={() => {
                setShowPasswordModal(false);
                showNotification("success", "Password changed successfully!");
              }}
            />
          )}
        </AnimatePresence>

        {/* Avatar Upload Modal */}
        <AnimatePresence>
          {showAvatarModal && (
            <AvatarUploadModal
              currentAvatar={formData.avatar}
              onClose={() => setShowAvatarModal(false)}
              onUpload={(avatar) => {
                setFormData((prev) => ({ ...prev, avatar }));
                setShowAvatarModal(false);
                showNotification("success", "Avatar updated!");
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------- */
/* COMPONENTS                                                      */
/* -------------------------------------------------------------- */

/* Loading State */
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Loading Profile
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Fetching your admin profile...
      </p>
    </motion.div>
  </div>
);

/* Error State */
const ErrorState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
    <motion.div
      className="text-center max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-red-200 dark:border-red-500/30"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
        <FaExclamationTriangle className="text-4xl text-red-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Profile Not Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Unable to load admin profile. Please try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
      >
        Try Again
      </button>
    </motion.div>
  </div>
);

/* Notification Toast */
const NotificationToast = ({ type, message, onClose }) => (
  <motion.div
    className="fixed top-6 right-6 z-50"
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
  >
    <div
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border ${
        type === "success"
          ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-500/30"
          : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-500/30"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          type === "success"
            ? "bg-emerald-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
      </div>
      <p
        className={`font-semibold ${
          type === "success"
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-red-700 dark:text-red-400"
        }`}
      >
        {message}
      </p>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <FaTimes />
      </button>
    </div>
  </motion.div>
);

/* Hero Header */
const HeroHeader = ({ profile, formData }) => (
  <motion.div
    className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-blue-200 dark:border-white/10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>

    {/* Pattern Overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    ></div>

    <div className="relative z-10 p-8 md:p-10">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/20 backdrop-blur-sm p-1 shadow-xl">
            <img
              src={formData.avatar || "https://i.pravatar.cc/150"}
              alt="Avatar"
              className="w-full h-full rounded-xl object-cover"
            />
          </div>
          {profile.isActive && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 flex items-center justify-center">
              <FaCheck className="text-white text-xs" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
              {profile.name}
            </h1>
            {profile.role === "superadmin" && (
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-200 text-sm font-bold flex items-center gap-1">
                <FaCrown /> Super Admin
              </span>
            )}
          </div>
          <p className="text-white/80 text-lg mb-4">{profile.email}</p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm">
              <FaUserShield /> {profile.role?.toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm">
              <FaCalendarAlt /> Joined{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                profile.isActive
                  ? "bg-emerald-400/20 border border-emerald-400/50 text-emerald-200"
                  : "bg-red-400/20 border border-red-400/50 text-red-200"
              }`}
            >
              {profile.isActive ? (
                <>
                  <FaCheckCircle /> Active
                </>
              ) : (
                <>
                  <FaTimesCircle /> Inactive
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

/* Profile Card */
const ProfileCard = ({ profile, formData, editing, onEditAvatar }) => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-6 mb-6"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="text-center">
      {/* Avatar with Edit Button */}
      <div className="relative inline-block mb-4">
        <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-blue-500/20">
          <img
            src={formData.avatar || "https://i.pravatar.cc/150"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <motion.button
          onClick={onEditAvatar}
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaCamera />
        </motion.button>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
        {profile.name}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-3">{profile.email}</p>

      {/* Role Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm">
        {profile.role === "superadmin" ? <FaCrown /> : <FaUserShield />}
        {profile.role?.toUpperCase()}
      </div>
    </div>
  </motion.div>
);

/* Quick Stats */
const QuickStats = ({ profile }) => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-6 mb-6"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
  >
    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <FaHistory className="text-blue-500" /> Account Overview
    </h4>

    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Account Status
        </span>
        <span
          className={`px-3 py-1 rounded-lg text-xs font-bold ${
            profile.isActive
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          {profile.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Last Login
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Today, 10:30 AM
        </span>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Member Since
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {new Date(profile.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  </motion.div>
);

/* Navigation Tabs */
const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "security", label: "Security", icon: <FaLock /> },
    { id: "activity", label: "Activity", icon: <FaHistory /> },
    { id: "preferences", label: "Preferences", icon: <FaCog /> },
  ];

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="space-y-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
            whileHover={{ x: activeTab === tab.id ? 0 : 5 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

/* Profile Details */
const ProfileDetails = ({
  profile,
  formData,
  editing,
  saving,
  handleChange,
  handleUpdate,
  setEditing,
}) => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    {/* Header */}
    <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <FaIdCard className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Personal Information
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your profile details
          </p>
        </div>
      </div>

      {!editing ? (
        <motion.button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaEdit /> Edit Profile
        </motion.button>
      ) : (
        <div className="flex gap-2">
          <motion.button
            onClick={() => setEditing(false)}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleUpdate}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <FaSave /> Save Changes
              </>
            )}
          </motion.button>
        </div>
      )}
    </div>

    {/* Form */}
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <FormField
          label="Full Name"
          icon={<FaUser />}
          name="name"
          value={formData.name}
          editing={editing}
          onChange={handleChange}
          placeholder="Enter your name"
        />

        {/* Email */}
        <FormField
          label="Email Address"
          icon={<FaEnvelope />}
          name="email"
          value={formData.email}
          editing={editing}
          onChange={handleChange}
          placeholder="Enter your email"
          type="email"
        />

        {/* Phone */}
        <FormField
          label="Phone Number"
          icon={<FaPhone />}
          name="phone"
          value={formData.phone}
          editing={editing}
          onChange={handleChange}
          placeholder="Enter your phone"
          type="tel"
        />

        {/* Role */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FaShieldAlt className="text-blue-500" /> Role
          </label>
          {editing ? (
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          ) : (
            <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
              <p className="text-gray-900 dark:text-white font-medium capitalize">
                {formData.role}
              </p>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FaCheckCircle className="text-blue-500" /> Account Status
          </label>
          {editing ? (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
              </label>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {formData.isActive
                  ? "Account is Active"
                  : "Account is Inactive"}
              </span>
            </div>
          ) : (
            <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 flex items-center gap-3">
              {formData.isActive ? (
                <>
                  <FaCheckCircle className="text-emerald-500 text-xl" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    Active
                  </span>
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-red-500 text-xl" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    Inactive
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Avatar URL */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FaCamera className="text-blue-500" /> Avatar URL
          </label>
          {editing ? (
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="Enter avatar URL or upload"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          ) : (
            <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
              <p className="text-blue-500 truncate">
                {formData.avatar || "No avatar set"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

/* Form Field Component */
const FormField = ({
  label,
  icon,
  name,
  value,
  editing,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      <span className="text-blue-500">{icon}</span> {label}
    </label>
    {editing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    ) : (
      <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
        <p className="text-gray-900 dark:text-white font-medium">
          {value || "N/A"}
        </p>
      </div>
    )}
  </div>
);

/* Security Settings */
const SecuritySettings = ({ onChangePassword }) => (
  <motion.div
    className="space-y-6"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    {/* Password Section */}
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
            <FaKey className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Password & Security
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your password and security settings
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Change Password */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
              <FaLock />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Change Password
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last changed 30 days ago
              </p>
            </div>
          </div>
          <motion.button
            onClick={onChangePassword}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Change
          </motion.button>
        </div>

        {/* Two-Factor Auth */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <FaShieldAlt />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add an extra layer of security
              </p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 font-semibold text-sm">
            Not Enabled
          </span>
        </div>

        {/* Active Sessions */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <FaDesktop />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Active Sessions
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your active login sessions
              </p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-sm">
            2 Devices
          </span>
        </div>
      </div>
    </div>

    {/* Danger Zone */}
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-red-200 dark:border-red-500/30 overflow-hidden">
      <div className="p-6 border-b border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-900/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
            <FaExclamationTriangle className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-700 dark:text-red-400">
              Danger Zone
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400/80">
              Irreversible actions
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30">
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">
              Delete Account
            </p>
            <p className="text-sm text-red-600 dark:text-red-400/80">
              Permanently delete your admin account
            </p>
          </div>
          <motion.button
            className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete Account
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

/* Activity Log */
const ActivityLog = () => {
  const activities = [
    {
      id: 1,
      action: "Logged in",
      device: "Chrome on Windows",
      time: "Today, 10:30 AM",
      icon: <FaSignOutAlt />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 2,
      action: "Updated profile",
      device: "Chrome on Windows",
      time: "Yesterday, 3:45 PM",
      icon: <FaEdit />,
      color: "from-amber-500 to-orange-600",
    },
    {
      id: 3,
      action: "Changed password",
      device: "Safari on iPhone",
      time: "3 days ago",
      icon: <FaKey />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: 4,
      action: "Approved restaurant",
      device: "Chrome on Windows",
      time: "5 days ago",
      icon: <FaCheckCircle />,
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: 5,
      action: "Logged in",
      device: "Firefox on macOS",
      time: "1 week ago",
      icon: <FaSignOutAlt />,
      color: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="p-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <FaHistory className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Activity Log
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your recent account activity
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center text-white shadow-md`}
              >
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.device}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* Preferences */
const Preferences = () => (
  <motion.div
    className="space-y-6"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    {/* Appearance */}
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <FaCog className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Appearance
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Customize your dashboard look
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Theme */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white shadow-md">
              <FaMoon />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Dark Mode
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle dark/light theme
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>
    </div>

    {/* Notifications */}
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <FaBell className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage notification preferences
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <PreferenceToggle
          title="Email Notifications"
          description="Receive email updates"
          defaultChecked
        />
        <PreferenceToggle
          title="Push Notifications"
          description="Browser push notifications"
          defaultChecked
        />
        <PreferenceToggle
          title="Order Alerts"
          description="Get notified about new orders"
          defaultChecked
        />
        <PreferenceToggle
          title="Marketing Emails"
          description="Promotional content and updates"
        />
      </div>
    </div>
  </motion.div>
);

const PreferenceToggle = ({ title, description, defaultChecked }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
    <div>
      <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        defaultChecked={defaultChecked}
      />
      <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
    </label>
  </div>
);

/* Password Change Modal */
const PasswordChangeModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      // API call to change password
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated
      onSuccess();
    } catch (err) {
      setError("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <FaKey className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Change Password
                </h3>
                <p className="text-white/80 text-sm">Update your password</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes />
            </motion.button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <PasswordInput
            label="Current Password"
            value={formData.currentPassword}
            onChange={(e) =>
              setFormData({ ...formData, currentPassword: e.target.value })
            }
            show={showPasswords.current}
            onToggle={() =>
              setShowPasswords({
                ...showPasswords,
                current: !showPasswords.current,
              })
            }
          />

          <PasswordInput
            label="New Password"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            show={showPasswords.new}
            onToggle={() =>
              setShowPasswords({ ...showPasswords, new: !showPasswords.new })
            }
          />

          <PasswordInput
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            show={showPasswords.confirm}
            onToggle={() =>
              setShowPasswords({
                ...showPasswords,
                confirm: !showPasswords.confirm,
              })
            }
          />

          <div className="flex gap-3 pt-4">
            <motion.button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              whileHover={!saving ? { scale: 1.02 } : {}}
              whileTap={!saving ? { scale: 0.98 } : {}}
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <FaCheck /> Update Password
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const PasswordInput = ({ label, value, onChange, show, onToggle }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
        required
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  </div>
);

/* Avatar Upload Modal */
const AvatarUploadModal = ({ currentAvatar, onClose, onUpload }) => {
  const [preview, setPreview] = useState(currentAvatar);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onUpload(preview);
    setUploading(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <FaCamera className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Update Avatar</h3>
                <p className="text-white/80 text-sm">
                  Upload a new profile picture
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-blue-500/20">
                <img
                  src={preview || "https://i.pravatar.cc/150"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold hover:border-blue-500 hover:text-blue-500 transition-all mb-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaUpload /> Choose Image
          </motion.button>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              onClick={handleUpload}
              disabled={uploading || !preview}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              whileHover={!uploading ? { scale: 1.02 } : {}}
              whileTap={!uploading ? { scale: 0.98 } : {}}
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <FaCheck /> Save Avatar
                </>
              )}
            </motion.button>
            <motion.button
              onClick={() => setPreview("")}
              className="px-4 py-4 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaTrash />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile;
