/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F8F5EE',
          soft: '#EFE9DC',
          line: '#E0D7C2',
          deep: '#E6DECC',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          soft: '#2A2A28',
          muted: '#6B675F',
          line: '#D5CDB8',
        },
        sage: {
          DEFAULT: '#6B8E7F',
          deep: '#4A6B5C',
          light: '#8FB3A1',
          tint: '#D6E3DC',
          mist: '#EAF1ED',
        },
        clay: {
          DEFAULT: '#C77B5A',
          dark: '#A85B3A',
          light: '#D99A7C',
          tint: '#F0DBCB',
        },
        cobalt: {
          DEFAULT: '#2B5EA7',
          deep: '#1E4280',
          light: '#4A82C9',
          tint: '#C3D6F2',
          mist: '#E8F0FB',
        },
        turquoise: {
          DEFAULT: '#1B8B9E',
          deep: '#126B7C',
          light: '#3FB0C2',
          tint: '#C8E8EF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
