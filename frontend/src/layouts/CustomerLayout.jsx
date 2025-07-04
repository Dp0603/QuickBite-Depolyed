// src/layouts/CustomerLayout.jsx
import React from "react";
import CustomerNavbar from "../components/CustomerNavbar";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#1a1a1a] transition-colors duration-300">
      <CustomerNavbar />
      <main className="flex-1 pt-20 px-4 md:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
