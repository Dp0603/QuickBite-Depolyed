import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import RestaurantSidebar from "../sidebar/RestaurantSidebar";
import RestaurantNavbar from "../navbar/RestaurantNavbar";

const RestaurantLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
      {/* Top Navbar */}
      <RestaurantNavbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Sidebar */}
      <RestaurantSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main Content */}
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

export default RestaurantLayout;
