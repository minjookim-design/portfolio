/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Figma variables: Color/*
        'bg-base': '#000000',
        'text-primary': '#ffffff',
      },
      spacing: {
        // Figma variables: Number/*
        'space-04': '4px',
        'space-24': '24px',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
        serif: ['ChosunIlboMyungjo', 'serif'],
      },
    },
  },
  plugins: [],
}
