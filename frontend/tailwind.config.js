/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FF5722",
        secondary: "#222831",
        accent: "#FCEEEB",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.35)", opacity: "0.6" },
        },
      },
      boxShadow: {
        brand: "0 10px 30px rgba(0,0,0,0.12)",
        "brand-lg": "0 18px 40px rgba(0,0,0,0.16)",
      },
    },
  },
  plugins: [
    // Hide scrollbars but keep scroll functionality
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      });
    },
  ],
};
