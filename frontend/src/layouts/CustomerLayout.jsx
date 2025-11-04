import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CustomerSidebar from "../sidebar/CustomerSidebar";
import CustomerNavbar from "../navbar/CustomerNavbar";

const CustomerLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden">
      {/* Premium Navbar */}
      <CustomerNavbar toggleSidebar={() => setSidebarOpen((p) => !p)} />

      {/* Overlay background with fade + slight blur */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <CustomerSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen((p) => !p)}
      />

      {/* Main content */}
      <main className="pt-20 p-4 relative z-10 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;

// old
// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import CustomerSidebar from "../sidebar/CustomerSidebar";
// import CustomerNavbar from "../navbar/CustomerNavbar";

// const CustomerLayout = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div>
//       {/* Navbar fixed and full width */}
//       <CustomerNavbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

//       {/* Sidebar overlays content */}
//       <CustomerSidebar
//         isOpen={isSidebarOpen}
//         toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//       />

//       {/* Main content with margin-left = w-16 (sidebar closed width) */}
//       <div
//         className={`transition-all duration-300 pt-14 ${
//           isSidebarOpen ? "ml-64" : "ml-16"
//         }`}
//       >
//         <main className="p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default CustomerLayout;
