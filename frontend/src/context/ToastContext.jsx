import { createContext, useContext } from "react";
import { toast } from "sonner";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showToast = {
    success: (message, options = {}) =>
      toast.success(message, { duration: 3000, ...options }),

    error: (message, options = {}) =>
      toast.error(message, { duration: 4000, ...options }),

    info: (message, options = {}) =>
      toast(message, { duration: 3000, ...options }),
  };

  return (
    <ToastContext.Provider value={showToast}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
