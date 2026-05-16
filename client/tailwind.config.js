/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'gift-alert': 'gift-alert 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'gift-alert': {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '50%': { transform: 'scale(1.3) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
