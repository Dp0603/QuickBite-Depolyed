import React from "react";
import { Toaster, toast as sonnerToast } from "sonner";

export const toast = sonnerToast;

const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        className: "!rounded-2xl !shadow-2xl !backdrop-blur-xl !border-2",
        style: {
          fontSize: "0.875rem",
          fontWeight: "500",
          padding: "16px 20px",
        },
        classNames: {
          success:
            "!bg-gradient-to-r !from-green-50 !to-emerald-50 dark:!from-green-900/30 dark:!to-emerald-900/30 !border-green-400 dark:!border-green-600 !text-green-800 dark:!text-green-200",
          error:
            "!bg-gradient-to-r !from-red-50 !to-rose-50 dark:!from-red-900/30 dark:!to-rose-900/30 !border-red-400 dark:!border-red-600 !text-red-800 dark:!text-red-200",
          warning:
            "!bg-gradient-to-r !from-yellow-50 !to-orange-50 dark:!from-yellow-900/30 dark:!to-orange-900/30 !border-yellow-400 dark:!border-yellow-600 !text-yellow-800 dark:!text-yellow-200",
          info: "!bg-gradient-to-r !from-blue-50 !to-cyan-50 dark:!from-blue-900/30 dark:!to-cyan-900/30 !border-blue-400 dark:!border-blue-600 !text-blue-800 dark:!text-blue-200",
          loading:
            "!bg-gradient-to-r !from-orange-50 !to-pink-50 dark:!from-orange-900/30 dark:!to-pink-900/30 !border-orange-400 dark:!border-orange-600 !text-orange-800 dark:!text-orange-200",
          closeButton:
            "!bg-white/80 dark:!bg-slate-800/80 !border-gray-300 dark:!border-slate-600 hover:!bg-gray-100 dark:hover:!bg-slate-700 !transition-all !duration-200 hover:!scale-110",
          title: "!font-semibold !text-base",
          description: "!text-sm !opacity-90 !mt-1",
          actionButton:
            "!bg-gradient-to-r !from-orange-500 !to-pink-600 !text-white !border-0 hover:!shadow-lg hover:!scale-105 !transition-all !duration-200 !rounded-lg !px-4 !py-2 !font-semibold",
          cancelButton:
            "!bg-gray-200 dark:!bg-slate-700 !text-gray-700 dark:!text-gray-300 !border-0 hover:!bg-gray-300 dark:hover:!bg-slate-600 !transition-all !duration-200 !rounded-lg !px-4 !py-2",
        },
      }}
    />
  );
};

export default CustomToaster;


// old
// import React from "react";
// import { Toaster } from "sonner";

// const CustomToaster = () => {
//   return (
//     <Toaster
//       position="top-right"
//       theme="light"
//       toastOptions={{
//         className:
//           "!rounded-xl !border-l-4 !border-primary !bg-accent !text-secondary",
//         style: { fontSize: "0.875rem" },
//       }}
//     />
//   );
// };

// export default CustomToaster;
