/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ACCA warm neutrals
        sand: {
          50: '#faf9f7',
          100: '#f5f3ef',
          200: '#eeebe5',
          300: '#e3dfd6',
          400: '#d4cec3',
          500: '#b8b0a2',
          600: '#9a9184',
          700: '#7d7568',
          800: '#5c564c',
          900: '#3d3930',
        },
        // ACCA warm accent & terracotta masonry
        accent: {
          50: '#fdf8f3',
          100: '#f9efe4',
          200: '#f2ddc6',
          300: '#e8c49e',
          400: '#dba673',
          500: '#d18d4e',
          600: '#c47a3a',
          700: '#a36230',
          800: '#834f2c',
          900: '#6b4127',
        },
        // Waterproofing & damp control sapphire
        hydro: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        success: {
          500: '#2d9d5c',
          600: '#1f7f48',
        }
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'glow-hydro': '0 0 25px -5px rgba(14, 165, 233, 0.3)',
        'glow-accent': '0 0 25px -5px rgba(196, 122, 58, 0.3)',
      },
    },
  },
  plugins: [],
};
