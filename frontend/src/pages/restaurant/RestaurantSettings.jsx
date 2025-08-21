import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const RestaurantSettings = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

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

  // Fetch settings
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
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // Generic input handler
  const handleChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Generic submit function
  const submitSettings = async (url, payload, updater) => {
    updater(true);
    try {
      const res = await API.put(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Settings updated successfully");
      fetchSettings();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      updater(false);
    }
  };

  // Submit handlers
  const submitOrderSettings = (e) => {
    e.preventDefault();
    const payload = {
      minOrderValue: orderSettings.minOrderAmount,
      prepTimeMinutes: orderSettings.prepTime,
      maxOrdersPerSlot: orderSettings.maxConcurrentOrders,
      cancelWindowMinutes: orderSettings.autoAcceptOrders ? 0 : 15,
    };
    submitSettings("/restaurants/restaurants/settings/order", payload, (val) =>
      setUpdating((prev) => ({ ...prev, order: val }))
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
      (val) => setUpdating((prev) => ({ ...prev, delivery: val }))
    );
  };

  const submitFinanceSettings = (e) => {
    e.preventDefault();
    submitSettings(
      "/restaurants/restaurants/settings/finance",
      financeSettings,
      (val) => setUpdating((prev) => ({ ...prev, finance: val }))
    );
  };

  const submitSecuritySettings = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword)
      return toast.error("Passwords do not match");

    const payload = {
      currentPassword: securityData.currentPassword,
      newPassword: securityData.newPassword,
    };
    submitSettings(
      "/restaurants/restaurants/settings/security",
      payload,
      (val) => setUpdating((prev) => ({ ...prev, security: val }))
    );
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (loading) return <p className="p-6">Loading settings...</p>;

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">⚙️ Restaurant Settings</h1>

      {/* Order Form */}
      <FormSection
        title="Order Management"
        onSubmit={submitOrderSettings}
        loading={updating.order}
      >
        <Input
          label="Min Order Amount"
          name="minOrderAmount"
          value={orderSettings.minOrderAmount}
          onChange={handleChange(setOrderSettings)}
          type="number"
        />
        <Input
          label="Prep Time (minutes)"
          name="prepTime"
          value={orderSettings.prepTime}
          onChange={handleChange(setOrderSettings)}
          type="number"
        />
        <Input
          label="Max Concurrent Orders"
          name="maxConcurrentOrders"
          value={orderSettings.maxConcurrentOrders}
          onChange={handleChange(setOrderSettings)}
          type="number"
        />
        <Checkbox
          label="Auto Accept Orders"
          name="autoAcceptOrders"
          checked={orderSettings.autoAcceptOrders}
          onChange={handleChange(setOrderSettings)}
        />
      </FormSection>

      {/* Delivery Form */}
      <FormSection
        title="Delivery Preferences"
        onSubmit={submitDeliverySettings}
        loading={updating.delivery}
      >
        <Input
          label="Delivery Radius"
          name="deliveryRadius"
          value={deliverySettings.deliveryRadius}
          onChange={handleChange(setDeliverySettings)}
          type="number"
        />
        <Input
          label="Delivery Fee"
          name="deliveryFee"
          value={deliverySettings.deliveryFee}
          onChange={handleChange(setDeliverySettings)}
          type="number"
        />
        <Checkbox
          label="Allow Pickup"
          name="allowPickup"
          checked={deliverySettings.allowPickup}
          onChange={handleChange(setDeliverySettings)}
        />
      </FormSection>

      {/* Finance Form */}
      <FormSection
        title="Finance & Payouts"
        onSubmit={submitFinanceSettings}
        loading={updating.finance}
      >
        <Input
          label="Bank Account"
          name="bankAccount"
          value={financeSettings.bankAccount}
          onChange={handleChange(setFinanceSettings)}
        />
        <Input
          label="IFSC"
          name="ifsc"
          value={financeSettings.ifsc}
          onChange={handleChange(setFinanceSettings)}
        />
        <Input
          label="UPI ID"
          name="upiId"
          value={financeSettings.upiId}
          onChange={handleChange(setFinanceSettings)}
        />
        <Input
          label="GSTIN"
          name="gstin"
          value={financeSettings.gstin}
          onChange={handleChange(setFinanceSettings)}
        />
        <Select
          label="Payout Frequency"
          name="payoutFrequency"
          value={financeSettings.payoutFrequency}
          onChange={handleChange(setFinanceSettings)}
          options={[
            { label: "Weekly", value: "weekly" },
            { label: "Bi-Weekly", value: "biweekly" },
            { label: "Manual", value: "manual" },
          ]}
        />
        <Select
          label="Preferred Method"
          name="preferredMethod"
          value={financeSettings.preferredMethod}
          onChange={handleChange(setFinanceSettings)}
          options={[
            { label: "Bank", value: "bank" },
            { label: "UPI", value: "upi" },
          ]}
        />
      </FormSection>

      {/* Security Form */}
      <FormSection
        title="Security & Access"
        onSubmit={submitSecuritySettings}
        loading={updating.security}
      >
        <Input
          label="Current Password"
          name="currentPassword"
          type="password"
          value={securityData.currentPassword}
          onChange={handleChange(setSecurityData)}
        />
        <Input
          label="New Password"
          name="newPassword"
          type="password"
          value={securityData.newPassword}
          onChange={handleChange(setSecurityData)}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={securityData.confirmPassword}
          onChange={handleChange(setSecurityData)}
        />
      </FormSection>
    </div>
  );
};

// Reusable Form Section
const FormSection = ({ title, onSubmit, children, loading }) => (
  <form
    onSubmit={onSubmit}
    className="bg-white p-6 rounded-xl shadow space-y-6"
  >
    <h2 className="text-xl font-semibold">{title}</h2>
    {children}
    <button
      type="submit"
      disabled={loading}
      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
    >
      {loading ? "Saving..." : "Save"}
    </button>
  </form>
);

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col">
    <label className="font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className="border p-2 rounded"
    />
  </div>
);

const Checkbox = ({ label, name, checked, onChange }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={!!checked}
      onChange={onChange}
    />
    <label htmlFor={name}>{label}</label>
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border p-2 rounded"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default RestaurantSettings;
