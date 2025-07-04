import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import AdminNavbar from "../components/AdminNavbar.jsx";
import CustomerNavbar from "../components/CustomerNavbar.jsx";
import RestaurantNavbar from "../components/RestaurantNavbar.jsx";
import DeliveryNavbar from "../components/DeliveryNavbar.jsx";
import Footer from "../components/Footer";

export default function MainLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect to login if no user
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  // Render different navbar based on user role
  const renderNavbar = () => {
    if (!user) return null;

    switch (user.role) {
      case "admin":
        return <AdminNavbar />;
      case "customer":
        return <CustomerNavbar />;
      case "restaurant":
        return <RestaurantNavbar />;
      case "delivery":
        return <DeliveryNavbar />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderNavbar()}
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
