/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // DESIGN.md — single Action Blue accent. The indigo scale is remapped
        // so every legacy `indigo-*` utility renders the Apple accent ramp.
        indigo: {
          50: '#f5f5f7',   // parchment
          100: '#e8e8ed',
          200: '#d2d2d7',  // translucent chip gray
          300: '#2997ff',  // sky link blue (dark surfaces)
          400: '#2997ff',
          500: '#0071e3',  // focus blue
          600: '#0066cc',  // action blue
          700: '#0058b3',
          800: '#00488f',
          900: '#003a70',
        },
        // DESIGN.md — neutrals remapped to the Apple ink/canvas ramp so
        // legacy `slate-*` utilities stay tonal without file-by-file edits.
        slate: {
          50: '#fafafc',   // pearl
          100: '#f5f5f7',  // parchment
          200: '#e0e0e0',  // hairline
          300: '#d2d2d7',
          400: '#86868b',
          500: '#6e6e73',
          600: '#515154',
          700: '#333333',  // ink muted 80
          800: '#1d1d1f',  // near-black ink
          900: '#000000',  // true black
        },
        action: {
          DEFAULT: '#0066cc',
          focus: '#0071e3',
          ondark: '#2997ff',
        },
        ink: {
          DEFAULT: '#1d1d1f',
          soft: '#333333',
          mute: '#7a7a7a',
        },
        canvas: {
          DEFAULT: '#ffffff',
          parchment: '#f5f5f7',
          pearl: '#fafafc',
        },
        tile: {
          1: '#272729',
          2: '#2a2a2c',
          3: '#252527',
        },
      },
      fontFamily: {
        display: ['"SF Pro Display"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Inter"', 'sans-serif'],
        text: ['"SF Pro Text"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Inter"', 'sans-serif'],
      },
      fontSize: {
        hero: ['56px', { lineHeight: '1.07', letterSpacing: '-0.28px', fontWeight: '600' }],
        tile: ['40px', { lineHeight: '1.1', letterSpacing: '0', fontWeight: '600' }],
        section: ['34px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '600' }],
        lead: ['28px', { lineHeight: '1.14', letterSpacing: '0.196px', fontWeight: '400' }],
        'lead-airy': ['24px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '300' }],
        tagline: ['21px', { lineHeight: '1.19', letterSpacing: '0.231px', fontWeight: '600' }],
        body17: ['17px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '400' }],
      },
      borderRadius: {
        'apple-sm': '8px',
        'apple-md': '11px',
        'apple-lg': '18px',
      },
      spacing: {
        section: '80px',
      },
      boxShadow: {
        // DESIGN.md — the ONE allowed drop shadow: product renders only.
        product: '3px 5px 30px 0 rgba(0, 0, 0, 0.22)',
      },
      maxWidth: {
        proseapple: '980px',
        gridapple: '1440px',
      },
    },
  },
  plugins: [],
}
