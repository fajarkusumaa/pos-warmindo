/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // V2 "Warung 24 Jam" tokens — mirrors the w-* variables in pos-warmindo.pen
        w: {
          paper: '#F5F0E6',
          card: '#FFFDF8',
          ink: '#1C1917',
          'ink-2': '#57534E',
          line: '#E4DACA',
          'line-strong': '#9C917E',
          sunk: '#EDE5D6',
          yolk: '#FFC531',
          'yolk-soft': '#FFF1C7',
          amber: '#D99A00',
          'amber-text': '#8A5A00',
          chili: '#C8321F',
          'chili-soft': '#FBE3DC',
          'chili-text': '#A82A19',
          'chili-deep': '#7A1E12',
          leaf: '#23714A',
          'leaf-soft': '#DDEFE2',
          live: '#4ADE80',
          'toggle-off': '#8F8676',
          night: '#14110E',
          'night-2': '#201B16',
          'night-3': '#2C251E',
          'night-line': '#3A3129',
          'night-text': '#F5F0E6',
          'night-muted': '#A8A29E',
          // Owner sidebar
          'side-raised': '#2A2420',
          'side-avatar': '#3F362E',
          'side-text': '#D6D3D1',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
