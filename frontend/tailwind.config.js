/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0b1220',
        foreground: '#e2e8f0',
        primary: {
          DEFAULT: '#7c3aed',
          foreground: '#f8fafc',
        },
        secondary: {
          DEFAULT: '#1d4ed8',
          foreground: '#eff6ff',
        },
        muted: {
          DEFAULT: '#1e293b',
          foreground: '#cbd5e1',
        },
        accent: {
          DEFAULT: '#1d4ed8',
          foreground: '#eff6ff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fef2f2',
        },
        border: '#334155',
        input: '#334155',
        ring: '#a78bfa',
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
