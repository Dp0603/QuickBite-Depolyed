// src/utils/scrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Automatically scroll to top whenever the route changes
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
