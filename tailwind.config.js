/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1152d4',
          light: '#4a7ce6',
          dark: '#0d3ca0',
        },
        background: {
          light: '#f6f6f8',
          dark: '#101622',
        },
        surface: {
          light: '#ffffff',
          dark: '#1a2332',
        },
        text: {
          light: '#1a1a1a',
          dark: '#e5e5e5',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif"', 'Georgia', 'serif'],
        sans: ['"Noto Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'mobile': '28rem', // 448px - primary mobile container
        'desktop': '80rem', // 1280px - desktop container
        'desktop-reading': '56rem', // 896px - comfortable reading width
      },
      spacing: {
        'safe-bottom': 'calc(env(safe-area-inset-bottom) + 4rem)', // iOS safe area + bottom nav
        'safe': 'env(safe-area-inset-bottom, 1.5rem)', // iOS safe area or 1.5rem fallback
      },
      keyframes: {
        'slide-up': {
          'from': { transform: 'translateY(100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out'
      }
    },
  },
  plugins: [],
}
