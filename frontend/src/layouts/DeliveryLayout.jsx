// src/layouts/DeliveryLayout.jsx
import React from "react";
import DeliveryNavbar from "../components/DeliveryNavbar";
import { Outlet } from "react-router-dom";

const DeliveryLayout = () => {
  return (
    <>
      <DeliveryNavbar />
      <main className="pt-16 px-4">
        <Outlet />
      </main>
    </>
  );
};

export default DeliveryLayout;
