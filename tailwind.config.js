/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b1016',
        panel: '#121b25',
        panel2: '#172330',
        line: '#263746',
        muted: '#91a2b3',
        'rx-text': '#edf4f8',
        cyan: '#48d6e8',
        orange: '#ff9d42',
        red: '#ff5e62',
        green: '#53d69a',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Arial'],
      },
    },
  },
  plugins: [],
}
