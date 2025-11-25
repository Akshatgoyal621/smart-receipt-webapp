/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5fbff',
          100: '#e6f3ff',
          200: '#c7e6ff',
          300: '#9fd6ff',
          400: '#66bfff',
          500: '#2196f3',
          600: '#1976d2',
          700: '#135fa9',
          800: '#0f477b',
          900: '#0a2f4f'
        }
      }
    }
  },
  plugins: []
};
