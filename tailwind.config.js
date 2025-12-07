/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e', // Green-500 equivalent
        secondary: '#fef08a', // Yellow-200 equivalent
        dark: '#111827', // Gray-900
      }
    },
  },
  plugins: [],
}