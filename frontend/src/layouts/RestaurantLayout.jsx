// src/layouts/RestaurantLayout.jsx
import React from "react";
import RestaurantNavbar from "../components/RestaurantNavbar";
import { Outlet } from "react-router-dom";

const RestaurantLayout = () => {
  return (
    <>
      <RestaurantNavbar />
      <main className="pt-16 px-4">
        <Outlet />
      </main>
    </>
  );
};

export default RestaurantLayout;
