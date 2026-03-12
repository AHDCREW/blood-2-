/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B0000',
        accent: '#FF1744',
        bg: '#0D0D0D',
        surface: '#1A1A1A',
        muted: '#2D2D2D',
        text: '#F5F5F5',
        textMuted: '#A0A0A0',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 23, 68, 0.5)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 24px 8px rgba(255, 23, 68, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%, 28%': { transform: 'scale(1.15)' },
          '21%, 35%': { transform: 'scale(1)' },
        },
        flash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
        heartbeat: 'heartbeat 1.2s ease-in-out infinite',
        flash: 'flash 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
