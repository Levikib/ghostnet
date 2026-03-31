/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        terminal: {
          bg: '#080c0a',
          surface: '#0e1410',
          border: '#1a2e1e',
          green: '#00ff41',
          'green-dim': '#00b32c',
          'green-mute': '#0a4a18',
          amber: '#ffb347',
          'amber-dim': '#cc7a00',
          red: '#ff4136',
          blue: '#00d4ff',
          purple: '#bf5fff',
          text: '#c8d8c8',
          'text-dim': '#5a7a5a',
        }
      },
      animation: {
        'scan': 'scan 4s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'flicker': 'flicker 8s infinite',
        'pulse-green': 'pulse-green 2s infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.8' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.9' },
          '97%': { opacity: '1' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 4px #00ff41' },
          '50%': { boxShadow: '0 0 16px #00ff41, 0 0 32px #00ff4144' },
        }
      }
    },
  },
  plugins: [],
}
