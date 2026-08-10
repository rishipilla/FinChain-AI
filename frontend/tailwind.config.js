/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#0b1220',
          panel: '#101a2c',
          card: '#111d33',
          border: '#1f2c45',
        },
        brand: {
          teal: '#2dd4bf',
          green: '#22c55e',
          red: '#ef4444',
          blue: '#3b82f6',
          gold: '#f59e0b',
          purple: '#a855f7',
          cyan: '#06b6d4',
          pink: '#ec4899',
          gray: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
