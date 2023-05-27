/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],

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
  plugins: [
    require('flowbite/plugin')
  ],
  
}

