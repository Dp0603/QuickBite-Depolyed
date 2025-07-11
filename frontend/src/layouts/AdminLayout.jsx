import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../sidebar/AdminSidebar";
import AdminNavbar from "../navbar/AdminNavbar";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
      {/* Fixed Navbar */}
      <AdminNavbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main Content Area */}
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

export default AdminLayout;
