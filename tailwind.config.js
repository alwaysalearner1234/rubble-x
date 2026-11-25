/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Figma tokens (Skq7zUZGFShDqDajR72UIK / 0-1) ──
        bg:       '#0B1117',   // Obsidian background
        panel:    '#111922',   // Card Surface
        panel2:   '#18222F',   // Surface Raised
        line:     '#263342',   // Border
        muted:    '#94A3B8',   // Text Secondary
        'rx-text':'#F8FAFC',   // Text Primary
        // accent palette
        amber:    '#F59E0B',   // Tactical Amber — primary actions / warnings
        orange:   '#F59E0B',   // alias kept for backwards compat
        cyan:     '#38BDF8',   // Cyan — sensors / trajectory / AI
        green:    '#10B981',   // Emerald — nominal / active
        red:      '#EF4444',   // Alert Red — e-stop / critical
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Arial'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontVariantNumeric: {
        'tabular': 'tabular-nums',
      },
      borderRadius: {
        chip:   '4px',   // chips / badges
        btn:    '8px',   // buttons / inputs
        panel:  '12px',  // panels / cards / modals
      },
    },
  },
  plugins: [],
}
