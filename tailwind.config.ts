import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        evedex: {
          primary: '#8b5cf6',
          secondary: '#6366f1',
          accent: '#3b82f6',
          dark: '#050508',
          card: 'rgba(255,255,255,0.03)',
          'card-hover': 'rgba(255,255,255,0.06)',
          achievement: '#22c55e',
          progress: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-web3': 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(263,83%,58%,0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(239,84%,67%,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(263,70%,55%,0.12) 0px, transparent 50%)',
      },
      boxShadow: {
        neon: '0 0 20px rgba(139, 92, 246, 0.35)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.35)',
        glow: '0 0 40px rgba(99, 102, 241, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(139, 92, 246, 0.35)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
