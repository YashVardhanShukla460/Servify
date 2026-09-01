/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind WHERE to look for class names
  // It scans these files and includes only the CSS classes you actually used
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom Servify brand colors
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        brand: {
          primary: '#2563eb',   // Servify blue
          secondary: '#f59e0b', // Servify amber
          dark: '#1e293b',      // Dark text
          light: '#f8fafc',     // Light background
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
