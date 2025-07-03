import React from "react";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="px-4 py-10 sm:px-6 lg:px-12">{children}</main>
    </div>
  );
}
