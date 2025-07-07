import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import CustomerSidebar from "../sidebar/CustomerSidebar";
import CustomerNavbar from "../navbar/CustomerNavbar";

const CustomerLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
      {/* Navbar fixed and full width */}
      <CustomerNavbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Sidebar overlays content */}
      <CustomerSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main content with margin-left = w-16 (sidebar closed width) */}
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

export default CustomerLayout;
