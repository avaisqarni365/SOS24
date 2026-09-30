/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Kontai24 deep obsidian & dark slate palette
        dark: {
          950: '#07090e',
          900: '#0b0e14', // kontai24 signature theme-color
          850: '#10141d',
          800: '#151b27',
          750: '#1b2332',
          700: '#222c3f',
          600: '#334155',
        },
        // Precision cyber-cyan & waterproofing sapphire
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          neon: '#00f0ff',
        },
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
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'glow-cyan': '0 0 35px -5px rgba(14, 165, 233, 0.35)',
        'glow-cyan-sm': '0 0 20px -3px rgba(14, 165, 233, 0.25)',
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.3)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.07)',
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(14, 165, 233, 0.35)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
        'cyan-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #00f0ff 100%)',
      }
    },
  },
  plugins: [],
};
