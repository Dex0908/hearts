/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          gold:    '#f5c842',
          amber:   '#e8931a',
          ember:   '#c0440a',
          dusk:    '#1a0f2e',
          deep:    '#0d0820',
          void:    '#060412',
          mist:    '#8fa8c8',
          light:   '#e8d5b0',
          glow:    '#ffeaa0',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        body:    ['Lato', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'candle-glow': 'radial-gradient(ellipse at center, #f5c84220 0%, transparent 70%)',
        'sky-gradient': 'linear-gradient(180deg, #060412 0%, #0d0820 40%, #1a0f2e 100%)',
        'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'candle': '0 0 30px rgba(245, 200, 66, 0.3), 0 0 60px rgba(245, 200, 66, 0.1)',
        'candle-sm': '0 0 15px rgba(245, 200, 66, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'deep': '0 20px 60px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'flicker': 'flicker 3s ease-in-out infinite',
        'float':   'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.85' },
          '25%, 75%': { opacity: '0.95' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245,200,66,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(245,200,66,0.6)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
