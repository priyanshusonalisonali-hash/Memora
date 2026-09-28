/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FFF9F0',
          200: '#FFF0DB',
          300: '#FFE4C2',
        },
        peach: {
          50: '#FFF5F0',
          100: '#FFE8DC',
          200: '#FFD3BE',
          300: '#FFB799',
          400: '#FF946E',
          500: '#FF7144',
        },
        coral: {
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
        },
        plum: {
          800: '#23163A',
          900: '#140D24',
          950: '#0B0714',
        }
      },
      fontFamily: {
        heading: ['Fredoka', 'Baloo 2', 'sans-serif'],
        sans: ['Outfit', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 25px rgba(244, 63, 94, 0.35)',
        'floating': '0 12px 35px -5px rgba(255, 113, 68, 0.25)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
