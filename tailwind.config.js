/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        maroon: {
          50: '#f5ebe9',
          100: '#e8d1cc',
          200: '#dab3af',
          300: '#cc9592',
          400: '#be7775',
          500: '#b05958',
          600: '#a04f4e',
          700: '#8b4644',
          800: '#76403a',
          900: '#4d2a28',
          950: '#350000',
          DEFAULT: '#800000',
        },
        beige: {
          50: '#fefdfb',
          100: '#fdfcf8',
          200: '#faf8f3',
          300: '#f8f5ed',
          400: '#f6f2e8',
          500: '#f5f5dc',
          600: '#e8e8d0',
          700: '#d4d4ba',
          800: '#c0c0a6',
          900: '#a8a892',
          950: '#8b8b73',
          DEFAULT: '#F5F5DC',
        },
      },
    },
  },
  plugins: [],
};
