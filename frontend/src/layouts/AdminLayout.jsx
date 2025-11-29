import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Import new premium Admin components
import AdminSidebar from "../sidebar/AdminSidebar";
import AdminNavbar from "../navbar/AdminNavbar";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden">
      {/* ===================== NAVBAR ===================== */}
      <AdminNavbar toggleSidebar={() => setSidebarOpen((p) => !p)} />

      {/* ===================== BACKDROP OVERLAY ===================== */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ===================== SIDEBAR ===================== */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen((p) => !p)}
      />

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="pt-20 p-4 relative z-10 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import AdminSidebar from "../sidebar/AdminSidebar";
// import AdminNavbar from "../navbar/AdminNavbar";

// const AdminLayout = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div>
//       {/* Fixed Navbar */}
//       <AdminNavbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

//       {/* Sidebar */}
//       <AdminSidebar
//         isOpen={isSidebarOpen}
//         toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//       />

//       {/* Main Content Area */}
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

// export default AdminLayout;
