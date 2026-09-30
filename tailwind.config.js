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
        // Kontai24 Exact Official Palette
        landing: {
          ink: '#0e1310',       // rgb(14 19 16) - Deep Forest Ink background
          ink2: '#141b17',      // rgb(20 27 23) - Elevated Card background
          ink3: '#1b241f',      // rgb(27 36 31) - Hover Card background
          bone: '#f3f1ec',      // rgb(243 241 236) - Warm Bone White
          bone2: '#ece9e2',     // rgb(236 233 226) - Muted Bone
          mint: '#62c4ac',      // rgb(98 196 172) - Signature Luminous Mint
          emerald: '#3f9a87',   // rgb(63 154 135) - Precision Emerald Green
          text: '#444945',      // rgb(68 73 69) - Body text on bone
          darkText: '#1a1d1b',  // rgb(26 29 27) - Headings on bone
        },
      },
      fontFamily: {
        editorial: ['var(--font-editorial)', 'Newsreader', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', '-apple-system', 'sans-serif'],
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
