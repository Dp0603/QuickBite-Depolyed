// src/layouts/AdminLayout.jsx
import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <main className="pt-16 px-4">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
