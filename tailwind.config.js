/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'matrix-green': '#00ff41',
        'matrix-green-bright': '#39ff14',
        'matrix-green-dark': '#00cc33',
        'matrix-bg': '#000000',
        'matrix-bg-light': '#0a0a0a',
      },
      fontFamily: {
        mono: ['"Courier New"', 'monospace'],
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      boxShadow: {
        'matrix-glow': '0 0 20px rgba(0, 255, 65, 0.3)',
        'matrix-glow-lg': '0 0 40px rgba(0, 255, 65, 0.5)',
      },
    },
  },
  plugins: [],
}