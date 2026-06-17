/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0f0f0f',
        ink2: '#3a3a3a',
        ink3: '#888888',
        paper: '#fafaf8',
        paper2: '#f2f1ee',
        accent: '#1a4fff',
        'accent-dim': '#e8eeff',
        line: '#e0ddd7',
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
