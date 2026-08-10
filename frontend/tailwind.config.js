/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12192B',
        paper: '#F5F6F2',
        vault: {
          DEFAULT: '#0F6657',
          dark: '#0B4B40',
          light: '#E4EFEC',
        },
        brass: {
          DEFAULT: '#B8863A',
          light: '#F3E7D2',
        },
        brick: {
          DEFAULT: '#A8402C',
          light: '#F5E4E0',
        },
        line: '#DCDFD8',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        ledger: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, #DCDFD8 28px)',
      },
    },
  },
  plugins: [],
};
