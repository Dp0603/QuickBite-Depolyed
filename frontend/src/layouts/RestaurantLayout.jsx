import React, { useState } from "react";
import { Routes } from "react-router-dom";
import RestaurantSidebar from "../sidebar/RestaurantSidebar";
import RestaurantNavbar from "../navbar/RestaurantNavbar";
import { restaurantRoutes } from "../routes/RestaurantRoutes";

const RestaurantLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isOwnerMode, setIsOwnerMode] = useState(false); // 🔑 Owner Mode toggle

  return (
    <div>
      {/* Top Navbar */}
      <RestaurantNavbar
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isOwnerMode={isOwnerMode}
        setIsOwnerMode={setIsOwnerMode}
      />

      {/* Sidebar */}
      <RestaurantSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isOwnerMode={isOwnerMode}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 pt-14 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <main className="p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">
          {/* Render restaurant routes here */}
          <Routes>{restaurantRoutes(isOwnerMode)}</Routes>
        </main>
      </div>
    </div>
  );
};

export default RestaurantLayout;
