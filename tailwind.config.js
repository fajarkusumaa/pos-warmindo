/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ground: '#f8f8f8',
        surface: '#ffffff',
        raised: '#eeeeee',
        border: '#e6e6e6',
        rule: '#f0f0f0',
        ink: {
          DEFAULT: '#0a0a0a',
          muted: '#6b6b6b',
        },
        accent: {
          DEFAULT: '#141414',
          hover: '#262626',
        },
        warm: {
          dark: '#12100e',
          surface: '#1c1917',
          border: '#292524',
          amber: '#f59e0b',
        },
        status: {
          positive: '#2e7d32',
          'positive-bg': '#dcfae5',
          negative: '#c4242a',
          'negative-bg': '#ffedea',
          warning: '#92400e',
          'warning-bg': '#fffbeb',
          chart: '#1d5fbf'
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
