import React, { useState } from "react";
import { Routes } from "react-router-dom";
import RestaurantSidebar from "../sidebar/RestaurantSidebar";
import RestaurantNavbar from "../navbar/RestaurantNavbar";
import { restaurantRoutes } from "../routes/RestaurantRoutes";
import { AnimatePresence, motion } from "framer-motion";

const RestaurantLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isOwnerMode, setIsOwnerMode] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden">
      {/* Navbar */}
      <RestaurantNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        isOwnerMode={isOwnerMode}
        setIsOwnerMode={setIsOwnerMode}
      />

      {/* Overlay (same as Customer) */}
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
      <RestaurantSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        isOwnerMode={isOwnerMode}
      />

      {/* Main content - NO MORE ml-64 OR WIDTH PUSHING */}
      <main className="pt-20 p-4 relative z-10 transition-all duration-300">
        <Routes>{restaurantRoutes(isOwnerMode)}</Routes>
      </main>
    </div>
  );
};

export default RestaurantLayout;


//old
// import React, { useState } from "react";
// import { Routes } from "react-router-dom";
// import RestaurantSidebar from "../sidebar/RestaurantSidebar";
// import RestaurantNavbar from "../navbar/RestaurantNavbar";
// import { restaurantRoutes } from "../routes/RestaurantRoutes";

// const RestaurantLayout = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [isOwnerMode, setIsOwnerMode] = useState(false); // 🔑 Owner Mode toggle

//   return (
//     <div>
//       {/* Top Navbar */}
//       <RestaurantNavbar
//         toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         isOwnerMode={isOwnerMode}
//         setIsOwnerMode={setIsOwnerMode}
//       />

//       {/* Sidebar */}
//       <RestaurantSidebar
//         isOpen={isSidebarOpen}
//         toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         isOwnerMode={isOwnerMode}
//       />

//       {/* Main Content */}
//       <div
//         className={`transition-all duration-300 pt-14 ${
//           isSidebarOpen ? "ml-64" : "ml-16"
//         }`}
//       >
//         <main className="p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">
//           {/* Render restaurant routes here */}
//           <Routes>{restaurantRoutes(isOwnerMode)}</Routes>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default RestaurantLayout;
