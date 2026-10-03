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
        // Theme-aware brand palette: RGB channels from globals.css, so the
        // same class works in light and dark and takes opacity modifiers.
        landing: {
          ink: 'rgb(var(--c-ink) / <alpha-value>)',
          ink2: 'rgb(var(--c-ink2) / <alpha-value>)',
          ink3: 'rgb(var(--c-ink3) / <alpha-value>)',
          bone: 'rgb(var(--c-bone) / <alpha-value>)',
          bone2: 'rgb(var(--c-bone2) / <alpha-value>)',
          mint: 'rgb(var(--c-mint) / <alpha-value>)',
          emerald: 'rgb(var(--c-emerald) / <alpha-value>)',
          text: '#050807',
          darkText: '#050807',
        },
        line: 'rgb(var(--c-line) / <alpha-value>)',
      },
      fontFamily: {
        latex: ['var(--font-latex)', '"Latin Modern Roman"', '"Computer Modern"', '"TeX Gyre Termes"', 'Georgia', 'serif'],
        editorial: ['var(--font-latex)', '"Latin Modern Roman"', '"Computer Modern"', '"TeX Gyre Termes"', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', '"IBM Plex Sans Ext"', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.375rem',
      },
      boxShadow: {
        'mint-glow': '0 0 35px -5px rgba(98, 196, 172, 0.25)',
        'emerald-glow': '0 0 25px -4px rgba(63, 154, 135, 0.25)',
        'card': '0 4px 24px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
};
