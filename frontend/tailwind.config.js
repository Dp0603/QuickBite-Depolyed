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
        fadeIn: "fadeIn 0.8s ease-out",
        slideInLeft: "slideInLeft 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
        gradient: "gradient 3s ease-in-out infinite",

        // 💫 Added for QuickBite gradient shimmer backgrounds
        gradientFlow: "gradientFlow 6s ease infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },

        // 💫 Added gradientFlow keyframe for smooth animated gradients
        gradientFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
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
