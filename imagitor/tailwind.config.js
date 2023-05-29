/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  prefix: "tw-",
  important: true,
  corePlugins: {
    preflight: false,
  },
  theme: {
    colors: {
      bg: "#111010",
      secondary: "#1A1A1A",
      contrast: "#078c9e",
      text: "#F8F9FB",
    },
    extend: {
      blur: {
        small: "3px",
      },
    },
  },
  plugins: [],
};
