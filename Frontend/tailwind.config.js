/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Design tokens mapped to Tailwind
        bg:      '#0B1020',
        surface: '#121A30',
        card:    '#18223F',
        'card-hi': '#1E2A4A',
        border:  'rgba(255,255,255,0.08)',
        primary: { DEFAULT: '#6366F1', hover: '#7577F3' },
        violet:  '#8B5CF6',
        cyan:    '#22D3EE',
        emerald: '#10B981',
        rose:    '#F43F5E',
        amber:   '#F59E0B',
      },
    },
  },
  plugins: [],
}
