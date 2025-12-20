import React, { useState, useEffect } from "react";
import { FaCog, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { motion } from "framer-motion";

const AdminSettings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    platformName: "",
    contactEmail: "",
    supportNumber: "",
    deliveryCharge: "",
    taxPercentage: "",
    payoutThreshold: "",
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ⚙️ Fetch Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/admin/settings");
        setSettings(res.data.data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 🔄 General Settings handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const res = await API.put("/admin/settings", settings);
      setMessage("✅ Settings updated successfully!");
      setSettings(res.data.data);
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <motion.div
      className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaCog /> Admin Settings
      </h2>

      {message && (
        <div className="mb-4 text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300 p-3 rounded">
          {message}
        </div>
      )}

      {/* General Settings */}
      <section className="bg-white dark:bg-secondary rounded-xl p-6 shadow mb-8">
        <h4 className="text-lg font-semibold mb-4">⚙️ General Settings</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            "platformName",
            "contactEmail",
            "supportNumber",
            "deliveryCharge",
            "taxPercentage",
            "payoutThreshold",
          ].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={["contactEmail"].includes(field) ? "email" : "text"}
                name={field}
                value={settings[field]}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <span className="font-medium flex items-center gap-2">
            Maintenance Mode
          </span>
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
            className="w-5 h-5 accent-orange-500"
          />
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className={`mt-6 bg-primary text-white px-6 py-2 rounded hover:bg-orange-600 text-sm font-medium ${
            saving && "opacity-70 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      {/* Security / Change Password */}
      <section className="bg-white dark:bg-secondary rounded-xl p-6 shadow mb-8">
        <h4 className="text-lg font-semibold mb-4">
          <FaLock /> Security
        </h4>
        <div
          className="flex justify-between items-center border rounded p-4 hover:shadow transition cursor-pointer"
          onClick={() => navigate("/admin/change-password")} //
        >
          <span>Change Password</span>
          <button className="text-sm text-blue-600 hover:underline">
            Change
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default AdminSettings;

// new but not tested
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaCog,
//   FaLock,
//   FaSave,
//   FaSpinner,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaTimes,
//   FaGlobe,
//   FaEnvelope,
//   FaPhone,
//   FaTruck,
//   FaPercent,
//   FaMoneyBillWave,
//   FaToggleOn,
//   FaToggleOff,
//   FaShieldAlt,
//   FaKey,
//   FaBell,
//   FaPalette,
//   FaDatabase,
//   FaTrash,
//   FaExclamationTriangle,
//   FaServer,
//   FaTools,
//   FaCreditCard,
//   FaFileInvoice,
//   FaUserShield,
//   FaHistory,
//   FaSync,
//   FaEye,
//   FaEyeSlash,
//   FaCheck,
//   FaStore,
//   FaClock,
//   FaMapMarkerAlt,
//   FaLanguage,
//   FaMoon,
//   FaSun,
//   FaDesktop,
//   FaChevronRight,
//   FaInfoCircle,
//   FaDownload,
//   FaUpload,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/axios";

// /* -------------------------------------------------------------- */
// /* MAIN COMPONENT                                                  */
// /* -------------------------------------------------------------- */

// const AdminSettings = () => {
//   const navigate = useNavigate();

//   const [settings, setSettings] = useState({
//     platformName: "",
//     contactEmail: "",
//     supportNumber: "",
//     deliveryCharge: "",
//     taxPercentage: "",
//     payoutThreshold: "",
//     maintenanceMode: false,
//     // Additional settings
//     currency: "INR",
//     timezone: "Asia/Kolkata",
//     language: "en",
//     maxDeliveryRadius: "15",
//     minOrderAmount: "100",
//     commissionRate: "15",
//     // Notification settings
//     emailNotifications: true,
//     pushNotifications: true,
//     orderAlerts: true,
//     marketingEmails: false,
//     weeklyReports: true,
//   });

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [activeTab, setActiveTab] = useState("general");
//   const [notification, setNotification] = useState(null);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [showBackupModal, setShowBackupModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   // Fetch Settings
//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const res = await API.get("/admin/settings");
//         setSettings((prev) => ({ ...prev, ...res.data.data }));
//       } catch (err) {
//         console.error("Error fetching settings:", err);
//         showNotification("error", "Failed to load settings");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSettings((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleToggle = (name) => {
//     setSettings((prev) => ({
//       ...prev,
//       [name]: !prev[name],
//     }));
//   };

//   const handleSaveSettings = async () => {
//     try {
//       setSaving(true);
//       const res = await API.put("/admin/settings", settings);
//       setSettings((prev) => ({ ...prev, ...res.data.data }));
//       showNotification("success", "Settings saved successfully!");
//     } catch (err) {
//       console.error(err);
//       showNotification("error", "Failed to save settings");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const showNotification = (type, message) => {
//     setNotification({ type, message });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   if (loading) return <LoadingState />;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <motion.div
//         className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Notification Toast */}
//         <AnimatePresence>
//           {notification && (
//             <NotificationToast
//               type={notification.type}
//               message={notification.message}
//               onClose={() => setNotification(null)}
//             />
//           )}
//         </AnimatePresence>

//         {/* Hero Header */}
//         <HeroHeader onSave={handleSaveSettings} saving={saving} />

//         {/* Settings Content */}
//         <div className="grid lg:grid-cols-4 gap-8">
//           {/* Sidebar Navigation */}
//           <div className="lg:col-span-1">
//             <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <AnimatePresence mode="wait">
//               {activeTab === "general" && (
//                 <GeneralSettings
//                   key="general"
//                   settings={settings}
//                   handleChange={handleChange}
//                   handleToggle={handleToggle}
//                 />
//               )}
//               {activeTab === "business" && (
//                 <BusinessSettings
//                   key="business"
//                   settings={settings}
//                   handleChange={handleChange}
//                 />
//               )}
//               {activeTab === "notifications" && (
//                 <NotificationSettings
//                   key="notifications"
//                   settings={settings}
//                   handleToggle={handleToggle}
//                 />
//               )}
//               {activeTab === "security" && (
//                 <SecuritySettings
//                   key="security"
//                   onChangePassword={() => setShowPasswordModal(true)}
//                 />
//               )}
//               {activeTab === "system" && (
//                 <SystemSettings
//                   key="system"
//                   settings={settings}
//                   handleToggle={handleToggle}
//                   onBackup={() => setShowBackupModal(true)}
//                 />
//               )}
//               {activeTab === "danger" && (
//                 <DangerZone
//                   key="danger"
//                   onDeleteData={() => setShowDeleteModal(true)}
//                 />
//               )}
//             </AnimatePresence>

//             {/* Save Button */}
//             <motion.div
//               className="mt-8 flex justify-end"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5 }}
//             >
//               <motion.button
//                 onClick={handleSaveSettings}
//                 disabled={saving}
//                 className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 {saving ? (
//                   <>
//                     <FaSpinner className="animate-spin" /> Saving...
//                   </>
//                 ) : (
//                   <>
//                     <FaSave /> Save All Changes
//                   </>
//                 )}
//               </motion.button>
//             </motion.div>
//           </div>
//         </div>

//         {/* Password Change Modal */}
//         <AnimatePresence>
//           {showPasswordModal && (
//             <PasswordChangeModal
//               onClose={() => setShowPasswordModal(false)}
//               onSuccess={() => {
//                 setShowPasswordModal(false);
//                 showNotification("success", "Password changed successfully!");
//               }}
//             />
//           )}
//         </AnimatePresence>

//         {/* Backup Modal */}
//         <AnimatePresence>
//           {showBackupModal && (
//             <BackupModal
//               onClose={() => setShowBackupModal(false)}
//               onSuccess={() => {
//                 setShowBackupModal(false);
//                 showNotification("success", "Backup created successfully!");
//               }}
//             />
//           )}
//         </AnimatePresence>

//         {/* Delete Confirmation Modal */}
//         <AnimatePresence>
//           {showDeleteModal && (
//             <DeleteConfirmModal
//               onClose={() => setShowDeleteModal(false)}
//               onConfirm={() => {
//                 setShowDeleteModal(false);
//                 showNotification("success", "Data cleared successfully!");
//               }}
//             />
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// /* -------------------------------------------------------------- */
// /* COMPONENTS                                                      */
// /* -------------------------------------------------------------- */

// /* Loading State */
// const LoadingState = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//     <motion.div
//       className="text-center"
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//     >
//       <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
//       <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
//         Loading Settings
//       </h3>
//       <p className="text-gray-600 dark:text-gray-400">
//         Fetching configuration...
//       </p>
//     </motion.div>
//   </div>
// );

// /* Notification Toast */
// const NotificationToast = ({ type, message, onClose }) => (
//   <motion.div
//     className="fixed top-6 right-6 z-50"
//     initial={{ opacity: 0, x: 100 }}
//     animate={{ opacity: 1, x: 0 }}
//     exit={{ opacity: 0, x: 100 }}
//   >
//     <div
//       className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border ${
//         type === "success"
//           ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-500/30"
//           : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-500/30"
//       }`}
//     >
//       <div
//         className={`w-10 h-10 rounded-xl flex items-center justify-center ${
//           type === "success" ? "bg-emerald-500" : "bg-red-500"
//         } text-white`}
//       >
//         {type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
//       </div>
//       <p
//         className={`font-semibold ${
//           type === "success"
//             ? "text-emerald-700 dark:text-emerald-400"
//             : "text-red-700 dark:text-red-400"
//         }`}
//       >
//         {message}
//       </p>
//       <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
//         <FaTimes />
//       </button>
//     </div>
//   </motion.div>
// );

// /* Hero Header */
// const HeroHeader = ({ onSave, saving }) => (
//   <motion.div
//     className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-gray-200 dark:border-white/10"
//     initial={{ opacity: 0, y: -20 }}
//     animate={{ opacity: 1, y: 0 }}
//   >
//     {/* Gradient Background */}
//     <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"></div>

//     {/* Pattern Overlay */}
//     <div
//       className="absolute inset-0 opacity-10"
//       style={{
//         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//       }}
//     ></div>

//     {/* Decorative Gear */}
//     <div className="absolute top-6 right-10 opacity-10">
//       <FaCog className="text-white text-7xl animate-spin-slow" />
//     </div>

//     <div className="relative z-10 p-8 md:p-10">
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//         {/* Left */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
//             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
//               <FaCog className="text-white" />
//             </div>
//             <span className="text-white/90 font-semibold">System Configuration</span>
//           </div>

//           <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
//             Admin Settings ⚙️
//           </h1>
//           <p className="text-white/80 text-lg">
//             Configure platform settings and preferences
//           </p>
//         </motion.div>

//         {/* Right */}
//         <motion.div
//           className="flex gap-3"
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           <motion.button
//             onClick={onSave}
//             disabled={saving}
//             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             {saving ? (
//               <>
//                 <FaSpinner className="animate-spin" /> Saving...
//               </>
//             ) : (
//               <>
//                 <FaSave /> Save Changes
//               </>
//             )}
//           </motion.button>
//         </motion.div>
//       </div>
//     </div>
//   </motion.div>
// );

// /* Settings Navigation */
// const SettingsNav = ({ activeTab, setActiveTab }) => {
//   const tabs = [
//     { id: "general", label: "General", icon: <FaGlobe />, color: "blue" },
//     { id: "business", label: "Business", icon: <FaStore />, color: "orange" },
//     { id: "notifications", label: "Notifications", icon: <FaBell />, color: "purple" },
//     { id: "security", label: "Security", icon: <FaShieldAlt />, color: "emerald" },
//     { id: "system", label: "System", icon: <FaServer />, color: "cyan" },
//     { id: "danger", label: "Danger Zone", icon: <FaExclamationTriangle />, color: "red" },
//   ];

//   return (
//     <motion.div
//       className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-4 sticky top-8"
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-3">
//         Settings
//       </h4>
//       <div className="space-y-2">
//         {tabs.map((tab) => (
//           <motion.button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
//               activeTab === tab.id
//                 ? tab.id === "danger"
//                   ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
//                   : "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
//                 : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
//             }`}
//             whileHover={{ x: activeTab === tab.id ? 0 : 5 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             {tab.icon}
//             {tab.label}
//             {activeTab === tab.id && (
//               <FaChevronRight className="ml-auto text-xs" />
//             )}
//           </motion.button>
//         ))}
//       </div>
//     </motion.div>
//   );
// };

// /* General Settings */
// const GeneralSettings = ({ settings, handleChange, handleToggle }) => (
//   <motion.div
//     className="space-y-6"
//     initial={{ opacity: 0, x: 20 }}
//     animate={{ opacity: 1, x: 0 }}
//     exit={{ opacity: 0, x: -20 }}
//   >
//     {/* Platform Info */}
//     <SettingsSection
//       icon={<FaGlobe />}
//       title="Platform Information"
//       description="Basic platform settings"
//       gradient="from-blue-500 to-cyan-600"
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <FormInput
//           label="Platform Name"
//           icon={<FaStore />}
//           name="platformName"
//           value={settings.platformName}
//           onChange={handleChange}
//           placeholder="QuickBite"
//         />
//         <FormInput
//           label="Contact Email"
//           icon={<FaEnvelope />}
//           name="contactEmail"
//           value={settings.contactEmail}
//           onChange={handleChange}
//           placeholder="support@quickbite.com"
//           type="email"
//         />
//         <FormInput
//           label="Support Number"
//           icon={<FaPhone />}
//           name="supportNumber"
//           value={settings.supportNumber}
//           onChange={handleChange}
//           placeholder="+91 98765 43210"
//           type="tel"
//         />
//         <FormSelect
//           label="Default Currency"
//           icon={<FaMoneyBillWave />}
//           name="currency"
//           value={settings.currency}
//           onChange={handleChange}
//           options={[
//             { value: "INR", label: "₹ INR - Indian Rupee" },
//             { value: "USD", label: "$ USD - US Dollar" },
//             { value: "EUR", label: "€ EUR - Euro" },
//           ]}
//         />
//         <FormSelect
//           label="Timezone"
//           icon={<FaClock />}
//           name="timezone"
//           value={settings.timezone}
//           onChange={handleChange}
//           options={[
//             { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
//             { value: "America/New_York", label: "America/New_York (EST)" },
//             { value: "Europe/London", label: "Europe/London (GMT)" },
//           ]}
//         />
//         <FormSelect
//           label="Language"
//           icon={<FaLanguage />}
//           name="language"
//           value={settings.language}
//           onChange={handleChange}
//           options={[
//             { value: "en", label: "English" },
//             { value: "hi", label: "Hindi" },
//             { value: "es", label: "Spanish" },
//           ]}
//         />
//       </div>
//     </SettingsSection>

//     {/* Maintenance Mode */}
//     <SettingsSection
//       icon={<FaTools />}
//       title="Maintenance Mode"
//       description="Control platform availability"
//       gradient="from-amber-500 to-orange-600"
//     >
//       <div className="flex items-center justify-between p-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
//             <FaTools />
//           </div>
//           <div>
//             <p className="font-bold text-gray-900 dark:text-white">
//               Maintenance Mode
//             </p>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               When enabled, users will see a maintenance page
//             </p>
//           </div>
//         </div>
//         <ToggleSwitch
//           checked={settings.maintenanceMode}
//           onChange={() => handleToggle("maintenanceMode")}
//         />
//       </div>

//       {settings.maintenanceMode && (
//         <motion.div
//           className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 flex items-start gap-3"
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: "auto" }}
//         >
//           <FaExclamationTriangle className="text-red-500 text-lg mt-0.5" />
//           <p className="text-sm text-red-700 dark:text-red-400">
//             <strong>Warning:</strong> Maintenance mode is currently active.
//             Users cannot access the platform.
//           </p>
//         </motion.div>
//       )}
//     </SettingsSection>
//   </motion.div>
// );

// /* Business Settings */
// const BusinessSettings = ({ settings, handleChange }) => (
//   <motion.div
//     className="space-y-6"
//     initial={{ opacity: 0, x: 20 }}
//     animate={{ opacity: 1, x: 0 }}
//     exit={{ opacity: 0, x: -20 }}
//   >
//     {/* Delivery Settings */}
//     <SettingsSection
//       icon={<FaTruck />}
//       title="Delivery Configuration"
//       description="Manage delivery fees and radius"
//       gradient="from-orange-500 to-rose-600"
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <FormInput
//           label="Delivery Charge (₹)"
//           icon={<FaTruck />}
//           name="deliveryCharge"
//           value={settings.deliveryCharge}
//           onChange={handleChange}
//           placeholder="30"
//           type="number"
//         />
//         <FormInput
//           label="Max Delivery Radius (km)"
//           icon={<FaMapMarkerAlt />}
//           name="maxDeliveryRadius"
//           value={settings.maxDeliveryRadius}
//           onChange={handleChange}
//           placeholder="15"
//           type="number"
//         />
//         <FormInput
//           label="Minimum Order Amount (₹)"
//           icon={<FaMoneyBillWave />}
//           name="minOrderAmount"
//           value={settings.minOrderAmount}
//           onChange={handleChange}
//           placeholder="100"
//           type="number"
//         />
//       </div>
//     </SettingsSection>

//     {/* Tax & Commission */}
//     <SettingsSection
//       icon={<FaPercent />}
//       title="Tax & Commission"
//       description="Configure tax and commission rates"
//       gradient="from-emerald-500 to-teal-600"
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <FormInput
//           label="Tax Percentage (%)"
//           icon={<FaPercent />}
//           name="taxPercentage"
//           value={settings.taxPercentage}
//           onChange={handleChange}
//           placeholder="5"
//           type="number"
//         />
//         <FormInput
//           label="Commission Rate (%)"
//           icon={<FaPercent />}
//           name="commissionRate"
//           value={settings.commissionRate}
//           onChange={handleChange}
//           placeholder="15"
//           type="number"
//         />
//       </div>
//     </SettingsSection>

//     {/* Payout Settings */}
//     <SettingsSection
//       icon={<FaCreditCard />}
//       title="Payout Settings"
//       description="Configure restaurant payout thresholds"
//       gradient="from-purple-500 to-indigo-600"
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <FormInput
//           label="Payout Threshold (₹)"
//           icon={<FaMoneyBillWave />}
//           name="payoutThreshold"
//           value={settings.payoutThreshold}
//           onChange={handleChange}
//           placeholder="1000"
//           type="number"
//         />
//       </div>
//     </SettingsSection>
//   </motion.div>
// );

// /* Notification Settings */
// const NotificationSettings = ({ settings, handleToggle }) => (
//   <motion.div
//     className="space-y-6"
//     initial={{ opacity: 0, x: 20 }}
//     animate={{ opacity: 1, x: 0 }}
//     exit={{ opacity: 0, x: -20 }}
//   >
//     <SettingsSection
//       icon={<FaBell />}
//       title="Notification Preferences"
//       description="Control how you receive notifications"
//       gradient="from-purple-500 to-indigo-600"
//     >
//       <div className="space-y-4">
//         <NotificationToggle
//           icon={<FaEnvelope />}
//           title="Email Notifications"
//           description="Receive important updates via email"
//           checked={settings.emailNotifications}
//           onChange={() => handleToggle("emailNotifications")}
//           color="blue"
//         />
//         <NotificationToggle
//           icon={<FaBell />}
//           title="Push Notifications"
//           description="Browser push notifications"
//           checked={settings.pushNotifications}
//           onChange={() => handleToggle("pushNotifications")}
//           color="purple"
//         />
//         <NotificationToggle
//           icon={<FaStore />}
//           title="Order Alerts"
//           description="Get notified about new orders"
//           checked={settings.orderAlerts}
//           onChange={() => handleToggle("orderAlerts")}
//           color="emerald"
//         />
//         <NotificationToggle
//           icon={<FaFileInvoice />}
//           title="Weekly Reports"
//           description="Receive weekly analytics summary"
//           checked={settings.weeklyReports}
//           onChange={() => handleToggle("weeklyReports")}
//           color="orange"
//         />
//         <NotificationToggle
//           icon={<FaGlobe />}
//           title="Marketing Emails"
//           description="Promotional content and updates"
//           checked={settings.marketingEmails}
//           onChange={() => handleToggle("marketingEmails")}
//           color="pink"
//         />
//       </div>
//     </SettingsSection>
//   </motion.div>
// );

// /* Security Settings */
// const SecuritySettings = ({ onChangePassword }) => (
//   <motion.div
//     className="space-y-6"
//     initial={{ opacity: 0, x: 20 }}
//     animate={{ opacity: 1, x: 0 }}
//     exit={{ opacity: 0, x: -20 }}
//   >
//     <SettingsSection
//       icon={<FaShieldAlt />}
//       title="Security Settings"
//       description="Manage account security"
//       gradient="from-emerald-500 to-teal-600"
//     >
//       <div className="space-y-4">
//         {/* Change Password */}
//         <motion.div
//           className="flex items-center justify-between p-5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 cursor-pointer hover:shadow-md transition-all"
//           onClick={onChangePassword}
//           whileHover={{ x: 5 }}
//         >
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
//               <FaKey />
//             </div>
//             <div>
//               <p className="font-bold text-gray-900 dark:text-white">
//                 Change Password
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Update your account password
//               </p>
//             </div>
//           </div>
//           <FaChevronRight className="text-gray-400" />
//         </motion.div>

//         {/* Two-Factor Auth */}
//         <div className="flex items-center justify-between p-5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
//               <FaUserShield />
//             </div>
//             <div>
//               <p className="font-bold text-gray-900 dark:text-white">
//                 Two-Factor Authentication
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Add an extra layer of security
//               </p>
//             </div>
//           </div>
//           <span className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 font-semibold text-sm">
//             Not Enabled
//           </span>
//         </div>

//         {/* Active Sessions */}
//         <div className="flex items-center justify-between p-5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
//               <FaDesktop />
//             </div>
//             <div>
//               <p className="font-bold text-gray-900 dark:text-white">
//                 Active Sessions
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Manage your active login sessions
//               </p>
//             </div>
//           </div>
//           <span className="px-4 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-sm">
//             2 Devices
//           </span>
//         </div>

//         {/* Login History */}
//         <div className="flex items-center justify-between p-5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
//               <FaHistory />
//             </div>
//             <div>
//               <p className="font-bold text-gray-900 dark:text-white">
//                 Login History
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 View recent login activity
//               </p>
//             </div>
//           </div>
//           <FaChevronRight className="text-gray-400" />
//         </div>
//       </div>
//     </SettingsSection>
//   </motion.div>
// );

// /* System Settings */
// const SystemSettings = ({ settings, handleToggle, onBackup }) => (
//   <motion.div
//     className="space-y-6"
//     initial={{ opacity: 0, x: 20 }}
//     animate={{ opacity: 1, x: 0 }}
//     exit={{ opacity: 0, x: -20 }}
//   >
//     {/* Database & Backup */}
//     <SettingsSection
//       icon={<FaDatabase />}
//       title="Database & Backup"
//       description="Manage data backup and restore"
//       gradient="from-cyan-500 to-blue-600"
//     >
//       <div className="space-y-4">
//         {/* Create Backup */}
//         <motion.div
//           className="flex items-center justify-between p-5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10"
//           whileHover={{ x: 5 }}
//         >
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
//               <FaDownload />
//             </div>
//             <div>
//               <p className="font-bold text-gray-900 dark:text-white">
//                 Create Backup
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Download a full database backup
//               </p>
//             </div>
//           </div>
//           <motion.button
//             onClick={onBackup}
//             className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Backup Now
//           </motion.button>
//         </motion.div>

//         {/* Restore */}
//         <div className="flex items-center justify-between p-5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
//               <FaUpload />
//             </div>
//             <div>
//               <p className="font-bold text-gray-900 dark:text-white">
//                 Restore from Backup
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Restore database from a backup file
//               </p>
//             </div>
//           </div>
//           <motion.button
//             className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-all"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Upload
//           </motion.button>
//         </div>
//       </div>
//     </SettingsSection>

//     {/* Cache & Performance */}
//     <SettingsSection
//       icon={<FaServer />}
//       title="Cache & Performance"
//       description="Optimize platform performance"
//       gradient="from-violet-500 to-purple-600"
//     >
//       <div className="space-y-4">
//         <div className="flex items-center justify-between p-5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md">
//               <FaSync />
//             </div>
//             <div>
//               <p className="font-bold text-gray-900 dark:text-white">
//                 Clear Cache
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Clear all cached data
//               </p>
//             </div>
//           </div>
//           <motion.button
//             className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Clear
//           </motion.button>
//         </div>
//       </div>
//     </SettingsSection>
//   </motion.div>
// );

// /* Danger Zone */
// const DangerZone = ({ onDeleteData }) => (
//   <motion.div
//     className="space-y-6"
//     initial={{ opacity: 0, x: 20 }}
//     animate={{ opacity: 1, x: 0 }}
//     exit={{ opacity: 0, x: -20 }}
//   >
//     <SettingsSection
//       icon={<FaExclamationTriangle />}
//       title="Danger Zone"
//       description="Irreversible and destructive actions"
//       gradient="from-red-500 to-rose-600"
//       danger
//     >
//       <div className="space-y-4">
//         {/* Clear Test Data */}
//         <div className="flex items-center justify-between p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-md">
//               <FaTrash />
//             </div>
//             <div>
//               <p className="font-bold text-red-700 dark:text-red-400">
//                 Clear Test Data
//               </p>
//               <p className="text-sm text-red-600 dark:text-red-400/80">
//                 Remove all test orders and dummy data
//               </p>
//             </div>
//           </div>
//           <motion.button
//             onClick={onDeleteData}
//             className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Clear Data
//           </motion.button>
//         </div>

//         {/* Reset Platform */}
//         <div className="flex items-center justify-between p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-md">
//               <FaExclamationTriangle />
//             </div>
//             <div>
//               <p className="font-bold text-red-700 dark:text-red-400">
//                 Reset Platform
//               </p>
//               <p className="text-sm text-red-600 dark:text-red-400/80">
//                 Reset all settings to default values
//               </p>
//             </div>
//           </div>
//           <motion.button
//             className="px-5 py-2.5 rounded-xl border-2 border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-all"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Reset
//           </motion.button>
//         </div>
//       </div>
//     </SettingsSection>
//   </motion.div>
// );

// /* Reusable Components */
// const SettingsSection = ({ icon, title, description, gradient, children, danger }) => (
//   <motion.div
//     className={`bg-white dark:bg-slate-900 rounded-2xl shadow-lg border overflow-hidden ${
//       danger
//         ? "border-red-200 dark:border-red-500/30"
//         : "border-gray-200 dark:border-white/10"
//     }`}
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//   >
//     <div className={`p-6 border-b ${danger ? "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-900/10" : "border-gray-200 dark:border-white/10"}`}>
//       <div className="flex items-center gap-3">
//         <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
//           <span className="text-white">{icon}</span>
//         </div>
//         <div>
//           <h3 className={`text-xl font-bold ${danger ? "text-red-700 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
//             {title}
//           </h3>
//           <p className={`text-sm ${danger ? "text-red-600 dark:text-red-400/80" : "text-gray-500 dark:text-gray-400"}`}>
//             {description}
//           </p>
//         </div>
//       </div>
//     </div>
//     <div className="p-6">{children}</div>
//   </motion.div>
// );

// const FormInput = ({ label, icon, name, value, onChange, placeholder, type = "text" }) => (
//   <div>
//     <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//       <span className="text-orange-500">{icon}</span> {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
//     />
//   </div>
// );

// const FormSelect = ({ label, icon, name, value, onChange, options }) => (
//   <div>
//     <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//       <span className="text-orange-500">{icon}</span> {label}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
//     >
//       {options.map((opt) => (
//         <option key={opt.value} value={opt.value}>
//           {opt.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const ToggleSwitch = ({ checked, onChange }) => (
//   <button
//     onClick={onChange}
//     className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
//       checked ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-700"
//     }`}
//   >
//     <span
//       className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
//         checked ? "translate-x-7" : "translate-x-1"
//       }`}
//     />
//   </button>
// );

// const NotificationToggle = ({ icon, title, description, checked, onChange, color }) => {
//   const colors = {
//     blue: "from-blue-500 to-cyan-600",
//     purple: "from-purple-500 to-indigo-600",
//     emerald: "from-emerald-500 to-teal-600",
//     orange: "from-orange-500 to-rose-600",
//     pink: "from-pink-500 to-rose-600",
//   };

//   return (
//     <div className="flex items-center justify-between p-5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
//       <div className="flex items-center gap-4">
//         <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-md`}>
//           {icon}
//         </div>
//         <div>
//           <p className="font-bold text-gray-900 dark:text-white">{title}</p>
//           <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
//         </div>
//       </div>
//       <ToggleSwitch checked={checked} onChange={onChange} />
//     </div>
//   );
// };

// /* Password Change Modal */
// const PasswordChangeModal = ({ onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (formData.newPassword !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (formData.newPassword.length < 8) {
//       setError("Password must be at least 8 characters");
//       return;
//     }

//     setSaving(true);
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       onSuccess();
//     } catch (err) {
//       setError("Failed to change password");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//     >
//       <motion.div
//         className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
//         initial={{ scale: 0.9, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.9, y: 20 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-600">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
//                 <FaKey className="text-xl" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-white">Change Password</h3>
//                 <p className="text-white/80 text-sm">Update your password</p>
//               </div>
//             </div>
//             <motion.button
//               onClick={onClose}
//               className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <FaTimes />
//             </motion.button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {error && (
//             <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-sm">
//               {error}
//             </div>
//           )}

//           {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
//             <div key={field}>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 {field === "currentPassword"
//                   ? "Current Password"
//                   : field === "newPassword"
//                   ? "New Password"
//                   : "Confirm New Password"}
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPasswords[field.replace("Password", "")] ? "text" : "password"}
//                   value={formData[field]}
//                   onChange={(e) =>
//                     setFormData({ ...formData, [field]: e.target.value })
//                   }
//                   className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setShowPasswords({
//                       ...showPasswords,
//                       [field.replace("Password", "")]:
//                         !showPasswords[field.replace("Password", "")],
//                     })
//                   }
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPasswords[field.replace("Password", "")] ? (
//                     <FaEyeSlash />
//                   ) : (
//                     <FaEye />
//                   )}
//                 </button>
//               </div>
//             </div>
//           ))}

//           <motion.button
//             type="submit"
//             disabled={saving}
//             className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
//             whileHover={!saving ? { scale: 1.02 } : {}}
//             whileTap={!saving ? { scale: 0.98 } : {}}
//           >
//             {saving ? (
//               <>
//                 <FaSpinner className="animate-spin" /> Updating...
//               </>
//             ) : (
//               <>
//                 <FaCheck /> Update Password
//               </>
//             )}
//           </motion.button>
//         </form>
//       </motion.div>
//     </motion.div>
//   );
// };

// /* Backup Modal */
// const BackupModal = ({ onClose, onSuccess }) => {
//   const [creating, setCreating] = useState(false);

//   const handleBackup = async () => {
//     setCreating(true);
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     onSuccess();
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//     >
//       <motion.div
//         className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
//         initial={{ scale: 0.9, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.9, y: 20 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-6 bg-gradient-to-r from-cyan-500 to-blue-600">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
//                 <FaDatabase className="text-xl" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-white">Create Backup</h3>
//                 <p className="text-white/80 text-sm">Download database backup</p>
//               </div>
//             </div>
//             <motion.button
//               onClick={onClose}
//               className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <FaTimes />
//             </motion.button>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="text-center mb-6">
//             <div className="w-20 h-20 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mx-auto mb-4">
//               <FaDownload className="text-4xl text-cyan-500" />
//             </div>
//             <p className="text-gray-600 dark:text-gray-400">
//               This will create a complete backup of your database including all
//               orders, users, and settings.
//             </p>
//           </div>

//           <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 mb-6">
//             <div className="flex items-start gap-3">
//               <FaInfoCircle className="text-blue-500 text-lg mt-0.5" />
//               <p className="text-sm text-blue-700 dark:text-blue-400">
//                 Backup files are encrypted and stored securely. You can restore
//                 from this backup at any time.
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <motion.button
//               onClick={handleBackup}
//               disabled={creating}
//               className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
//               whileHover={!creating ? { scale: 1.02 } : {}}
//               whileTap={!creating ? { scale: 0.98 } : {}}
//             >
//               {creating ? (
//                 <>
//                   <FaSpinner className="animate-spin" /> Creating...
//                 </>
//               ) : (
//                 <>
//                   <FaDownload /> Create Backup
//                 </>
//               )}
//             </motion.button>
//             <motion.button
//               onClick={onClose}
//               className="px-6 py-4 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               Cancel
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// /* Delete Confirmation Modal */
// const DeleteConfirmModal = ({ onClose, onConfirm }) => {
//   const [confirmText, setConfirmText] = useState("");
//   const [deleting, setDeleting] = useState(false);

//   const handleDelete = async () => {
//     if (confirmText !== "DELETE") return;
//     setDeleting(true);
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     onConfirm();
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//     >
//       <motion.div
//         className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-red-200 dark:border-red-500/30 overflow-hidden"
//         initial={{ scale: 0.9, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.9, y: 20 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-6 bg-gradient-to-r from-red-500 to-rose-600">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
//                 <FaExclamationTriangle className="text-xl" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-white">Delete Data</h3>
//                 <p className="text-white/80 text-sm">This action is irreversible</p>
//               </div>
//             </div>
//             <motion.button
//               onClick={onClose}
//               className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <FaTimes />
//             </motion.button>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="text-center mb-6">
//             <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
//               <FaTrash className="text-4xl text-red-500" />
//             </div>
//             <p className="text-gray-600 dark:text-gray-400 mb-4">
//               This will permanently delete all test data including orders,
//               reviews, and transactions.
//             </p>
//           </div>

//           <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 mb-6">
//             <div className="flex items-start gap-3">
//               <FaExclamationTriangle className="text-red-500 text-lg mt-0.5" />
//               <p className="text-sm text-red-700 dark:text-red-400">
//                 <strong>Warning:</strong> This action cannot be undone. All
//                 deleted data will be permanently lost.
//               </p>
//             </div>
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Type <strong>DELETE</strong> to confirm
//             </label>
//             <input
//               type="text"
//               value={confirmText}
//               onChange={(e) => setConfirmText(e.target.value)}
//               placeholder="DELETE"
//               className="w-full px-4 py-3 rounded-xl border border-red-200 dark:border-red-500/30 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
//             />
//           </div>

//           <div className="flex gap-3">
//             <motion.button
//               onClick={handleDelete}
//               disabled={confirmText !== "DELETE" || deleting}
//               className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-red-500 text-white font-bold shadow-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               whileHover={confirmText === "DELETE" && !deleting ? { scale: 1.02 } : {}}
//               whileTap={confirmText === "DELETE" && !deleting ? { scale: 0.98 } : {}}
//             >
//               {deleting ? (
//                 <>
//                   <FaSpinner className="animate-spin" /> Deleting...
//                 </>
//               ) : (
//                 <>
//                   <FaTrash /> Delete Data
//                 </>
//               )}
//             </motion.button>
//             <motion.button
//               onClick={onClose}
//               className="px-6 py-4 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               Cancel
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default AdminSettings;
