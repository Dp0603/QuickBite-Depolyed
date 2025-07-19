import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "leaflet/dist/leaflet.css";
import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import OrderProvider from "./context/OrderContext";
import { ToastProvider } from "./context/ToastContext";
import CustomToaster from "./components/CustomToaster";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <ToastProvider>
              <App />
              <CustomToaster />
            </ToastProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
