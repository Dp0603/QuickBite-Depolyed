import React from "react";
import { Toaster } from "sonner";

const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      theme="light"
      toastOptions={{
        className:
          "!rounded-xl !border-l-4 !border-primary !bg-accent !text-secondary",
        style: { fontSize: "0.875rem" },
      }}
    />
  );
};

export default CustomToaster;
