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
    },
  },
  plugins: [],
};
