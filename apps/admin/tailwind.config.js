/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          bg:      '#0a0e1a',
          surface: '#111827',
          card:    '#1a2236',
          border:  '#2d3748',
          gold:    '#f5c842',
          amber:   '#e8931a',
          text:    '#e2e8f0',
          muted:   '#94a3b8',
          success: '#10b981',
          danger:  '#ef4444',
          warning: '#f59e0b',
          info:    '#3b82f6',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
