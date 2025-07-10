import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DeliverySidebar from "../sidebar/DeliverySidebar";
import DeliveryNavbar from "../navbar/DeliveryNavbar";

const DeliveryLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
      {/* Navbar fixed and full width */}
      <DeliveryNavbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Sidebar overlays content */}
      <DeliverySidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main content area with dynamic margin */}
      <div
        className={`transition-all duration-300 pt-14 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <main className="p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DeliveryLayout;
