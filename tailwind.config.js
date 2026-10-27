/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // V2 Dark Roast & Warm Amber Palette
        ground: '#12100e',
        surface: '#1a1714',
        'surface-elevated': '#231f1a',
        raised: '#26221d',
        border: '#2b2520',
        'border-light': '#383129',
        rule: '#26221d',
        ink: {
          DEFAULT: '#ffffff',
          body: '#e7e5e4',
          muted: '#a8a29e',
        },
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          dark: '#b45309',
        },
        warm: {
          dark: '#12100e',
          surface: '#1c1917',
          border: '#292524',
          amber: '#f59e0b',
          gold: '#fbbf24',
        },
        status: {
          positive: '#10b981',
          'positive-bg': '#064e3b',
          negative: '#ef4444',
          'negative-bg': '#881337',
          warning: '#f59e0b',
          'warning-bg': '#78350f',
          chart: '#3b82f6'
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
}
