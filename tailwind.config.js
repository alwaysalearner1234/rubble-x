/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ---- Figma design tokens ----
        bg:      '#0B1117',   // deepest background
        panel:   '#111922',   // card/panel surface
        panel2:  '#172330',   // inner card surface
        line:    '#1E3040',   // border/divider
        muted:   '#91a2b3',   // secondary text
        'rx-text': '#edf4f8', // primary text
        // accent
        cyan:    '#38BDF8',   // sky-400 — robot / sensor active
        amber:   '#F59E0B',   // amber-400 — warnings / mode / modal border
        // keep 'orange' alias pointing to amber for existing class usage
        orange:  '#F59E0B',
        red:     '#EF4444',   // red-500 — danger / hazard
        green:   '#10B981',   // emerald-500 — online / success
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Arial'],
      },
    },
  },
  plugins: [],
}
