/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "lofi-beige": "#F5E8C7",
        "lofi-sunset": "#FFB997",
        "lofi-brown": "#8B5A2B",
        "lofi-shadow": "#D3B88C",
      },
      backgroundImage: {
        "paper-texture": "url('/paper-texture.jpg')",
      },
    },
  },
  plugins: [],
};