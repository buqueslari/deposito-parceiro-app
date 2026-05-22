/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Outfit', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        action: {
          DEFAULT: '#0057B7',
          deep: '#003E92',
          light: '#DBEAFE',
        },
        seal: {
          DEFAULT: '#15803D',
          deep: '#166534',
          light: '#DCFCE7',
        },
        ink: { DEFAULT: '#1A1A1A' },
        cream: { DEFAULT: '#FAFAFA' },
        gold: {
          DEFAULT: '#F5A524',
          400: '#F5A524',
          500: '#E08F1A',
          600: '#B4700A',
        },
        danger: {
          DEFAULT: '#B91C1C',
          deep: '#991B1B',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.04), 0 1px 3px rgba(0,0,0,.04)',
        'card-hover': '0 4px 12px -2px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04)',
        cta: '0 1px 0 rgba(255,255,255,.1) inset, 0 2px 8px -1px rgba(0,62,146,.3)',
        'cta-deep': '0 2px 0 rgba(0,0,0,.1), 0 4px 12px -2px rgba(0,62,146,.3)',
        floating: '0 10px 24px -6px rgba(0,0,0,.18), 0 4px 8px rgba(0,0,0,.04)',
        'seal-glow': '0 10px 24px -8px rgba(21,128,61,.5)',
      },
      letterSpacing: {
        carved: '-0.04em',
      },
    },
  },
  plugins: [],
}
