import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCog,
  FaShoppingCart,
  FaTruck,
  FaUniversity,
  FaLock,
  FaSave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaMoneyBillWave,
  FaClock,
  FaMapMarkerAlt,
  FaPercentage,
  FaKey,
  FaShieldAlt,
  FaCreditCard,
  FaMobile,
  FaFileInvoice,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaBell,
  FaChartLine,
} from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

/* ------------------------------- Toast Component ------------------------------- */
const Toast = ({ toasts, remove }) => (
  <div className="fixed z-[9999] top-6 right-6 flex flex-col gap-3 max-w-md">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl text-white backdrop-blur-md border ${
            t.type === "success"
              ? "bg-emerald-500/95 border-emerald-400"
              : t.type === "error"
              ? "bg-red-500/95 border-red-400"
              : "bg-blue-500/95 border-blue-400"
          }`}
        >
          <div className="pt-0.5 text-xl">{t.icon}</div>
          <div className="flex-1">
            <div className="font-bold text-sm">{t.title}</div>
            {t.message && (
              <div className="text-xs opacity-90 mt-1">{t.message}</div>
            )}
          </div>
          <motion.button
            onClick={() => remove(t.id)}
            className="opacity-80 hover:opacity-100 font-bold text-lg"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ------------------------------- Tab Button ------------------------------- */
const TabButton = ({ active, onClick, icon, label }) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
      active
        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
        : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
    }`}
    whileHover={{ scale: active ? 1 : 1.05, y: active ? 0 : -2 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
    {label}
  </motion.button>
);

/* ------------------------------- Input Components ------------------------------- */
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon,
  placeholder,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-gray-700">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${
          icon ? "pl-10" : "pl-4"
        } pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors font-medium`}
      />
    </div>
  </div>
);

const Checkbox = ({ label, name, checked, onChange, description }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
    <div className="flex items-center h-6">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={!!checked}
        onChange={onChange}
        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
      />
    </div>
    <div className="flex-1">
      <label
        htmlFor={name}
        className="font-bold text-gray-900 cursor-pointer flex items-center gap-2"
      >
        {checked ? (
          <FaToggleOn className="text-emerald-500 text-2xl" />
        ) : (
          <FaToggleOff className="text-gray-400 text-2xl" />
        )}
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  </div>
);

const Select = ({ label, name, value, onChange, options, icon }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-gray-700">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          {icon}
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full ${
          icon ? "pl-10" : "pl-4"
        } pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors font-medium appearance-none bg-white`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
);

/* ------------------------------- Form Section ------------------------------- */
const FormSection = ({
  title,
  icon,
  gradient,
  onSubmit,
  children,
  loading,
}) => (
  <motion.form
    onSubmit={onSubmit}
    className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className={`p-6 bg-gradient-to-r ${gradient} text-white`}>
      <h3 className="text-2xl font-black flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
          {icon}
        </div>
        {title}
      </h3>
    </div>

    <div className="p-6 space-y-6">
      {children}

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Saving Changes...
          </>
        ) : (
          <>
            <FaSave />
            Save Changes
          </>
        )}
      </motion.button>
    </div>
  </motion.form>
);

/* ------------------------------- Info Card ------------------------------- */
const InfoCard = ({ icon, title, description, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-50 to-indigo-50 border-blue-200",
    green: "from-emerald-50 to-teal-50 border-emerald-200",
    amber: "from-amber-50 to-orange-50 border-amber-200",
    purple: "from-purple-50 to-pink-50 border-purple-200",
  };

  return (
    <motion.div
      className={`p-4 rounded-xl bg-gradient-to-br border-2 ${colorClasses[color]}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 mb-1">{title}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------- Main Component ------------------------------- */
const RestaurantSettings = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("order");
  const [toasts, setToasts] = useState([]);

  const [orderSettings, setOrderSettings] = useState({
    minOrderAmount: 0,
    prepTime: 0,
    maxConcurrentOrders: 0,
    autoAcceptOrders: true,
    _id: "",
  });

  const [deliverySettings, setDeliverySettings] = useState({
    deliveryRadius: 0,
    deliveryFee: 0,
    allowPickup: false,
    _id: "",
  });

  const [financeSettings, setFinanceSettings] = useState({
    bankAccount: "",
    ifsc: "",
    upiId: "",
    gstin: "",
    payoutFrequency: "weekly",
    preferredMethod: "bank",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [updating, setUpdating] = useState({
    order: false,
    delivery: false,
    finance: false,
    security: false,
  });

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch Settings --------------------- */
  useEffect(() => {
    fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/restaurants/restaurants/settings/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;

      if (data.orderSettings) {
        const os = data.orderSettings;
        setOrderSettings({
          minOrderAmount: os.minOrderValue ?? 0,
          prepTime: os.prepTimeMinutes ?? 0,
          maxConcurrentOrders: os.maxOrdersPerSlot ?? 0,
          autoAcceptOrders: os.cancelWindowMinutes === 0,
          _id: os._id || "",
        });
      }

      if (data.deliverySettings) {
        const ds = data.deliverySettings;
        setDeliverySettings({
          deliveryRadius: ds.deliveryRadiusKm ?? 0,
          deliveryFee: ds.deliveryChargeFlat ?? 0,
          allowPickup: ds.selfDelivery ?? false,
          _id: ds._id || "",
        });
      }

      if (data.financeSettings) {
        setFinanceSettings({
          bankAccount: data.financeSettings.bankAccount || "",
          ifsc: data.financeSettings.ifsc || "",
          upiId: data.financeSettings.upiId || "",
          gstin: data.financeSettings.gstin || "",
          payoutFrequency: data.financeSettings.payoutFrequency || "weekly",
          preferredMethod: data.financeSettings.preferredMethod || "bank",
        });
      }
    } catch (err) {
      console.error(err);
      pushToast({
        type: "error",
        title: "Failed to load settings",
        message: "Please try again later",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setLoading(false);
    }
  };

  /* --------------------- Generic Handlers --------------------- */
  const handleChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitSettings = async (url, payload, updater, successMessage) => {
    updater(true);
    try {
      const res = await API.put(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      pushToast({
        type: "success",
        title: "Settings Updated",
        message:
          successMessage || res.data.message || "Changes saved successfully",
        icon: <FaCheckCircle />,
      });
      fetchSettings();
    } catch (err) {
      console.error(err);
      pushToast({
        type: "error",
        title: "Update Failed",
        message: err.response?.data?.message || "Failed to update settings",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      updater(false);
    }
  };

  /* --------------------- Submit Handlers --------------------- */
  const submitOrderSettings = (e) => {
    e.preventDefault();
    const payload = {
      minOrderValue: orderSettings.minOrderAmount,
      prepTimeMinutes: orderSettings.prepTime,
      maxOrdersPerSlot: orderSettings.maxConcurrentOrders,
      cancelWindowMinutes: orderSettings.autoAcceptOrders ? 0 : 15,
    };
    submitSettings(
      "/restaurants/restaurants/settings/order",
      payload,
      (val) => setUpdating((prev) => ({ ...prev, order: val })),
      "Order settings updated successfully"
    );
  };

  const submitDeliverySettings = (e) => {
    e.preventDefault();
    const payload = {
      deliveryRadiusKm: deliverySettings.deliveryRadius,
      deliveryChargeFlat: deliverySettings.deliveryFee,
      selfDelivery: deliverySettings.allowPickup,
    };
    submitSettings(
      "/restaurants/restaurants/settings/delivery",
      payload,
      (val) => setUpdating((prev) => ({ ...prev, delivery: val })),
      "Delivery settings updated successfully"
    );
  };

  const submitFinanceSettings = (e) => {
    e.preventDefault();
    submitSettings(
      "/restaurants/restaurants/settings/finance",
      financeSettings,
      (val) => setUpdating((prev) => ({ ...prev, finance: val })),
      "Finance settings updated successfully"
    );
  };

  const submitSecuritySettings = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      pushToast({
        type: "error",
        title: "Password Mismatch",
        message: "New password and confirmation do not match",
        icon: <FaExclamationTriangle />,
      });
      return;
    }

    const payload = {
      currentPassword: securityData.currentPassword,
      newPassword: securityData.newPassword,
    };
    submitSettings(
      "/restaurants/restaurants/settings/security",
      payload,
      (val) => setUpdating((prev) => ({ ...prev, security: val })),
      "Password updated successfully"
    );
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const tabs = [
    { id: "order", label: "Order Management", icon: <FaShoppingCart /> },
    { id: "delivery", label: "Delivery", icon: <FaTruck /> },
    { id: "finance", label: "Finance", icon: <FaUniversity /> },
    { id: "security", label: "Security", icon: <FaLock /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <Toast toasts={toasts} remove={removeToast} />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Premium Header */}
        <motion.div
          className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-rose-200"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10 p-8 md:p-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  ⚙️
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">
                    Restaurant Settings
                  </h1>
                  <p className="text-white/90 text-sm font-medium mt-1">
                    Configure your restaurant preferences and operations
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <LoadingState />
        ) : (
          <AnimatePresence mode="wait">
            {/* Order Settings */}
            {activeTab === "order" && (
              <motion.div
                key="order"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <InfoCard
                  icon="📋"
                  title="Order Management"
                  description="Configure how you want to handle incoming orders, set minimum order values, and manage order capacity"
                  color="blue"
                />

                <FormSection
                  title="Order Settings"
                  icon={<FaShoppingCart />}
                  gradient="from-blue-500 to-cyan-600"
                  onSubmit={submitOrderSettings}
                  loading={updating.order}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Minimum Order Amount"
                      name="minOrderAmount"
                      value={orderSettings.minOrderAmount}
                      onChange={handleChange(setOrderSettings)}
                      type="number"
                      icon={<FaMoneyBillWave />}
                      placeholder="₹0"
                    />
                    <Input
                      label="Preparation Time (minutes)"
                      name="prepTime"
                      value={orderSettings.prepTime}
                      onChange={handleChange(setOrderSettings)}
                      type="number"
                      icon={<FaClock />}
                      placeholder="30"
                    />
                  </div>

                  <Input
                    label="Max Concurrent Orders"
                    name="maxConcurrentOrders"
                    value={orderSettings.maxConcurrentOrders}
                    onChange={handleChange(setOrderSettings)}
                    type="number"
                    icon={<FaChartLine />}
                    placeholder="10"
                  />

                  <Checkbox
                    label="Auto Accept Orders"
                    name="autoAcceptOrders"
                    checked={orderSettings.autoAcceptOrders}
                    onChange={handleChange(setOrderSettings)}
                    description="Automatically accept incoming orders without manual confirmation"
                  />
                </FormSection>
              </motion.div>
            )}

            {/* Delivery Settings */}
            {activeTab === "delivery" && (
              <motion.div
                key="delivery"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <InfoCard
                  icon="🚚"
                  title="Delivery Preferences"
                  description="Set your delivery radius, fees, and pickup options to manage how orders reach your customers"
                  color="green"
                />

                <FormSection
                  title="Delivery Settings"
                  icon={<FaTruck />}
                  gradient="from-emerald-500 to-teal-600"
                  onSubmit={submitDeliverySettings}
                  loading={updating.delivery}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Delivery Radius (km)"
                      name="deliveryRadius"
                      value={deliverySettings.deliveryRadius}
                      onChange={handleChange(setDeliverySettings)}
                      type="number"
                      icon={<FaMapMarkerAlt />}
                      placeholder="5"
                    />
                    <Input
                      label="Delivery Fee (₹)"
                      name="deliveryFee"
                      value={deliverySettings.deliveryFee}
                      onChange={handleChange(setDeliverySettings)}
                      type="number"
                      icon={<FaMoneyBillWave />}
                      placeholder="40"
                    />
                  </div>

                  <Checkbox
                    label="Allow Self Pickup"
                    name="allowPickup"
                    checked={deliverySettings.allowPickup}
                    onChange={handleChange(setDeliverySettings)}
                    description="Enable customers to pick up orders directly from your restaurant"
                  />
                </FormSection>
              </motion.div>
            )}

            {/* Finance Settings */}
            {activeTab === "finance" && (
              <motion.div
                key="finance"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <InfoCard
                  icon="💰"
                  title="Finance & Payouts"
                  description="Manage your banking details, UPI information, and payout preferences securely"
                  color="amber"
                />

                <FormSection
                  title="Financial Settings"
                  icon={<FaUniversity />}
                  gradient="from-amber-500 to-orange-600"
                  onSubmit={submitFinanceSettings}
                  loading={updating.finance}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Bank Account Number"
                      name="bankAccount"
                      value={financeSettings.bankAccount}
                      onChange={handleChange(setFinanceSettings)}
                      icon={<FaUniversity />}
                      placeholder="XXXX XXXX XXXX"
                    />
                    <Input
                      label="IFSC Code"
                      name="ifsc"
                      value={financeSettings.ifsc}
                      onChange={handleChange(setFinanceSettings)}
                      icon={<FaCreditCard />}
                      placeholder="SBIN0001234"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="UPI ID"
                      name="upiId"
                      value={financeSettings.upiId}
                      onChange={handleChange(setFinanceSettings)}
                      icon={<FaMobile />}
                      placeholder="yourname@upi"
                    />
                    <Input
                      label="GSTIN"
                      name="gstin"
                      value={financeSettings.gstin}
                      onChange={handleChange(setFinanceSettings)}
                      icon={<FaFileInvoice />}
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Payout Frequency"
                      name="payoutFrequency"
                      value={financeSettings.payoutFrequency}
                      onChange={handleChange(setFinanceSettings)}
                      icon={<FaClock />}
                      options={[
                        { label: "Weekly", value: "weekly" },
                        { label: "Bi-Weekly", value: "biweekly" },
                        { label: "Manual", value: "manual" },
                      ]}
                    />
                    <Select
                      label="Preferred Payment Method"
                      name="preferredMethod"
                      value={financeSettings.preferredMethod}
                      onChange={handleChange(setFinanceSettings)}
                      icon={<FaMoneyBillWave />}
                      options={[
                        { label: "Bank Transfer", value: "bank" },
                        { label: "UPI", value: "upi" },
                      ]}
                    />
                  </div>
                </FormSection>
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <InfoCard
                  icon="🔐"
                  title="Security & Access"
                  description="Update your password and manage account security settings to keep your restaurant account safe"
                  color="purple"
                />

                <FormSection
                  title="Change Password"
                  icon={<FaLock />}
                  gradient="from-purple-500 to-pink-600"
                  onSubmit={submitSecuritySettings}
                  loading={updating.security}
                >
                  <Input
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={securityData.currentPassword}
                    onChange={handleChange(setSecurityData)}
                    icon={<FaKey />}
                    placeholder="Enter current password"
                  />

                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={securityData.newPassword}
                    onChange={handleChange(setSecurityData)}
                    icon={<FaLock />}
                    placeholder="Enter new password"
                  />

                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={handleChange(setSecurityData)}
                    icon={<FaShieldAlt />}
                    placeholder="Re-enter new password"
                  />

                  <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                      <FaInfoCircle className="text-blue-500 text-xl mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-bold mb-1">Password Requirements:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>At least 8 characters long</li>
                          <li>Include uppercase and lowercase letters</li>
                          <li>Include at least one number</li>
                          <li>Include at least one special character</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </FormSection>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

/* ------------------------------- Sub Components ------------------------------- */

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <motion.div
      className="relative w-16 h-16 mb-4"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
    </motion.div>
    <p className="text-gray-600 font-semibold">Loading settings...</p>
  </div>
);

export default RestaurantSettings;


// import React, { useState, useEffect, useContext } from "react";
// import toast from "react-hot-toast";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";

// const RestaurantSettings = () => {
//   const { token } = useContext(AuthContext);
//   const [loading, setLoading] = useState(true);

//   const [orderSettings, setOrderSettings] = useState({
//     minOrderAmount: 0,
//     prepTime: 0,
//     maxConcurrentOrders: 0,
//     autoAcceptOrders: true,
//     _id: "",
//   });

//   const [deliverySettings, setDeliverySettings] = useState({
//     deliveryRadius: 0,
//     deliveryFee: 0,
//     allowPickup: false,
//     _id: "",
//   });

//   const [financeSettings, setFinanceSettings] = useState({
//     bankAccount: "",
//     ifsc: "",
//     upiId: "",
//     gstin: "",
//     payoutFrequency: "weekly",
//     preferredMethod: "bank",
//   });

//   const [securityData, setSecurityData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [updating, setUpdating] = useState({
//     order: false,
//     delivery: false,
//     finance: false,
//     security: false,
//   });

//   // Fetch settings
//   useEffect(() => {
//     fetchSettings();
//   }, [token]);

//   const fetchSettings = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/restaurants/restaurants/settings/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = res.data;

//       if (data.orderSettings) {
//         const os = data.orderSettings;
//         setOrderSettings({
//           minOrderAmount: os.minOrderValue ?? 0,
//           prepTime: os.prepTimeMinutes ?? 0,
//           maxConcurrentOrders: os.maxOrdersPerSlot ?? 0,
//           autoAcceptOrders: os.cancelWindowMinutes === 0,
//           _id: os._id || "",
//         });
//       }

//       if (data.deliverySettings) {
//         const ds = data.deliverySettings;
//         setDeliverySettings({
//           deliveryRadius: ds.deliveryRadiusKm ?? 0,
//           deliveryFee: ds.deliveryChargeFlat ?? 0,
//           allowPickup: ds.selfDelivery ?? false,
//           _id: ds._id || "",
//         });
//       }

//       if (data.financeSettings) {
//         setFinanceSettings({
//           bankAccount: data.financeSettings.bankAccount || "",
//           ifsc: data.financeSettings.ifsc || "",
//           upiId: data.financeSettings.upiId || "",
//           gstin: data.financeSettings.gstin || "",
//           payoutFrequency: data.financeSettings.payoutFrequency || "weekly",
//           preferredMethod: data.financeSettings.preferredMethod || "bank",
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load settings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generic input handler
//   const handleChange = (setter) => (e) => {
//     const { name, value, type, checked } = e.target;
//     setter((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Generic submit function
//   const submitSettings = async (url, payload, updater) => {
//     updater(true);
//     try {
//       const res = await API.put(url, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success(res.data.message || "Settings updated successfully");
//       fetchSettings();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to update settings");
//     } finally {
//       updater(false);
//     }
//   };

//   // Submit handlers
//   const submitOrderSettings = (e) => {
//     e.preventDefault();
//     const payload = {
//       minOrderValue: orderSettings.minOrderAmount,
//       prepTimeMinutes: orderSettings.prepTime,
//       maxOrdersPerSlot: orderSettings.maxConcurrentOrders,
//       cancelWindowMinutes: orderSettings.autoAcceptOrders ? 0 : 15,
//     };
//     submitSettings("/restaurants/restaurants/settings/order", payload, (val) =>
//       setUpdating((prev) => ({ ...prev, order: val }))
//     );
//   };

//   const submitDeliverySettings = (e) => {
//     e.preventDefault();
//     const payload = {
//       deliveryRadiusKm: deliverySettings.deliveryRadius,
//       deliveryChargeFlat: deliverySettings.deliveryFee,
//       selfDelivery: deliverySettings.allowPickup,
//     };
//     submitSettings(
//       "/restaurants/restaurants/settings/delivery",
//       payload,
//       (val) => setUpdating((prev) => ({ ...prev, delivery: val }))
//     );
//   };

//   const submitFinanceSettings = (e) => {
//     e.preventDefault();
//     submitSettings(
//       "/restaurants/restaurants/settings/finance",
//       financeSettings,
//       (val) => setUpdating((prev) => ({ ...prev, finance: val }))
//     );
//   };

//   const submitSecuritySettings = (e) => {
//     e.preventDefault();
//     if (securityData.newPassword !== securityData.confirmPassword)
//       return toast.error("Passwords do not match");

//     const payload = {
//       currentPassword: securityData.currentPassword,
//       newPassword: securityData.newPassword,
//     };
//     submitSettings(
//       "/restaurants/restaurants/settings/security",
//       payload,
//       (val) => setUpdating((prev) => ({ ...prev, security: val }))
//     );
//     setSecurityData({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });
//   };

//   if (loading) return <p className="p-6">Loading settings...</p>;

//   return (
//     <div className="px-6 py-8 max-w-4xl mx-auto space-y-10">
//       <h1 className="text-3xl font-bold">⚙️ Restaurant Settings</h1>

//       {/* Order Form */}
//       <FormSection
//         title="Order Management"
//         onSubmit={submitOrderSettings}
//         loading={updating.order}
//       >
//         <Input
//           label="Min Order Amount"
//           name="minOrderAmount"
//           value={orderSettings.minOrderAmount}
//           onChange={handleChange(setOrderSettings)}
//           type="number"
//         />
//         <Input
//           label="Prep Time (minutes)"
//           name="prepTime"
//           value={orderSettings.prepTime}
//           onChange={handleChange(setOrderSettings)}
//           type="number"
//         />
//         <Input
//           label="Max Concurrent Orders"
//           name="maxConcurrentOrders"
//           value={orderSettings.maxConcurrentOrders}
//           onChange={handleChange(setOrderSettings)}
//           type="number"
//         />
//         <Checkbox
//           label="Auto Accept Orders"
//           name="autoAcceptOrders"
//           checked={orderSettings.autoAcceptOrders}
//           onChange={handleChange(setOrderSettings)}
//         />
//       </FormSection>

//       {/* Delivery Form */}
//       <FormSection
//         title="Delivery Preferences"
//         onSubmit={submitDeliverySettings}
//         loading={updating.delivery}
//       >
//         <Input
//           label="Delivery Radius"
//           name="deliveryRadius"
//           value={deliverySettings.deliveryRadius}
//           onChange={handleChange(setDeliverySettings)}
//           type="number"
//         />
//         <Input
//           label="Delivery Fee"
//           name="deliveryFee"
//           value={deliverySettings.deliveryFee}
//           onChange={handleChange(setDeliverySettings)}
//           type="number"
//         />
//         <Checkbox
//           label="Allow Pickup"
//           name="allowPickup"
//           checked={deliverySettings.allowPickup}
//           onChange={handleChange(setDeliverySettings)}
//         />
//       </FormSection>

//       {/* Finance Form */}
//       <FormSection
//         title="Finance & Payouts"
//         onSubmit={submitFinanceSettings}
//         loading={updating.finance}
//       >
//         <Input
//           label="Bank Account"
//           name="bankAccount"
//           value={financeSettings.bankAccount}
//           onChange={handleChange(setFinanceSettings)}
//         />
//         <Input
//           label="IFSC"
//           name="ifsc"
//           value={financeSettings.ifsc}
//           onChange={handleChange(setFinanceSettings)}
//         />
//         <Input
//           label="UPI ID"
//           name="upiId"
//           value={financeSettings.upiId}
//           onChange={handleChange(setFinanceSettings)}
//         />
//         <Input
//           label="GSTIN"
//           name="gstin"
//           value={financeSettings.gstin}
//           onChange={handleChange(setFinanceSettings)}
//         />
//         <Select
//           label="Payout Frequency"
//           name="payoutFrequency"
//           value={financeSettings.payoutFrequency}
//           onChange={handleChange(setFinanceSettings)}
//           options={[
//             { label: "Weekly", value: "weekly" },
//             { label: "Bi-Weekly", value: "biweekly" },
//             { label: "Manual", value: "manual" },
//           ]}
//         />
//         <Select
//           label="Preferred Method"
//           name="preferredMethod"
//           value={financeSettings.preferredMethod}
//           onChange={handleChange(setFinanceSettings)}
//           options={[
//             { label: "Bank", value: "bank" },
//             { label: "UPI", value: "upi" },
//           ]}
//         />
//       </FormSection>

//       {/* Security Form */}
//       <FormSection
//         title="Security & Access"
//         onSubmit={submitSecuritySettings}
//         loading={updating.security}
//       >
//         <Input
//           label="Current Password"
//           name="currentPassword"
//           type="password"
//           value={securityData.currentPassword}
//           onChange={handleChange(setSecurityData)}
//         />
//         <Input
//           label="New Password"
//           name="newPassword"
//           type="password"
//           value={securityData.newPassword}
//           onChange={handleChange(setSecurityData)}
//         />
//         <Input
//           label="Confirm Password"
//           name="confirmPassword"
//           type="password"
//           value={securityData.confirmPassword}
//           onChange={handleChange(setSecurityData)}
//         />
//       </FormSection>
//     </div>
//   );
// };

// // Reusable Form Section
// const FormSection = ({ title, onSubmit, children, loading }) => (
//   <form
//     onSubmit={onSubmit}
//     className="bg-white p-6 rounded-xl shadow space-y-6"
//   >
//     <h2 className="text-xl font-semibold">{title}</h2>
//     {children}
//     <button
//       type="submit"
//       disabled={loading}
//       className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
//     >
//       {loading ? "Saving..." : "Save"}
//     </button>
//   </form>
// );

// const Input = ({ label, name, value, onChange, type = "text" }) => (
//   <div className="flex flex-col">
//     <label className="font-medium mb-1">{label}</label>
//     <input
//       type={type}
//       name={name}
//       value={value ?? ""}
//       onChange={onChange}
//       className="border p-2 rounded"
//     />
//   </div>
// );

// const Checkbox = ({ label, name, checked, onChange }) => (
//   <div className="flex items-center space-x-2">
//     <input
//       type="checkbox"
//       id={name}
//       name={name}
//       checked={!!checked}
//       onChange={onChange}
//     />
//     <label htmlFor={name}>{label}</label>
//   </div>
// );

// const Select = ({ label, name, value, onChange, options }) => (
//   <div className="flex flex-col">
//     <label className="font-medium mb-1">{label}</label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="border p-2 rounded"
//     >
//       {options.map((opt) => (
//         <option key={opt.value} value={opt.value}>
//           {opt.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// export default RestaurantSettings;
