import { createContext, useContext } from "react";
import { toast } from "../components/CustomToaster";
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showToast = {
    // ✅ Success toast
    success: (message, options = {}) =>
      toast.success(message, { duration: 3000, ...options }),

    // ❌ Error toast
    error: (message, options = {}) =>
      toast.error(message, { duration: 4000, ...options }),

    // ⚠️ Warning toast
    warning: (message, options = {}) =>
      toast.warning(message, { duration: 4000, ...options }),

    // ℹ️ Info toast (default)
    info: (message, options = {}) =>
      toast(message, { duration: 3000, ...options }),
  };

  return (
    <ToastContext.Provider value={showToast}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
