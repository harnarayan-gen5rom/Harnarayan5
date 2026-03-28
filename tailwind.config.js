/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#02020a',
          900: '#060612',
          800: '#0d0d20',
          700: '#12122e',
          600: '#1a1a3a',
        },
        accent: {
          cyan:    '#00f5ff',
          violet:  '#9f5cff',
          magenta: '#ff2d87',
          silver:  '#c8d6e5',
        },
        light: {
          bg:   '#f0f2ff',
          card: '#ffffff',
          text: '#0a0a1a',
        },
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 9s ease-in-out infinite',
        'float-fast':    'float 4s ease-in-out infinite',
        'spin-slow':     'spin 20s linear infinite',
        'pulse-glow':    'pulseGlow 3s ease-in-out infinite',
        'shimmer':       'shimmer 2.5s linear infinite',
        'gradient-x':    'gradientX 8s ease infinite',
        'border-spin':   'borderSpin 4s linear infinite',
        'text-reveal':   'textReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up':       'fadeUp 0.7s ease forwards',
        'blob':          'blob 10s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-18px) rotate(1deg)' },
          '66%':      { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,245,255,0.3)' },
          '50%':      { boxShadow: '0 0 50px rgba(0,245,255,0.7), 0 0 80px rgba(159,92,255,0.4)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        borderSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        textReveal: {
          '0%':   { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0%)',   opacity: 1 },
        },
        fadeUp: {
          '0%':   { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)',     opacity: 1 },
        },
        blob: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '33%':      { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '66%':      { borderRadius: '50% 60% 30% 60% / 30% 40% 70% 50%' },
        },
      },
      backgroundSize: {
        '400%': '400%',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-cyan':    '0 0 30px rgba(0,245,255,0.35)',
        'glow-violet':  '0 0 30px rgba(159,92,255,0.35)',
        'glow-magenta': '0 0 30px rgba(255,45,135,0.35)',
        'inner-glow':   'inset 0 0 30px rgba(0,245,255,0.1)',
        'card-dark':    '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover':   '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(159,92,255,0.2)',
      },
    },
  },
  plugins: [],
}
