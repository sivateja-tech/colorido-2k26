/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme specific tokens
        dark: {
          bg: '#0A0C10',
          surface: '#11151C',
          elevated: '#181D26',
          highest: '#1E2430',
          border: 'rgba(255,255,255,0.08)',
          'subtle-border': 'rgba(255,255,255,0.05)',
          text: '#F5F7FA',
          'text-secondary': '#A9B1BF',
          muted: '#737C8C',
        },
        // Light theme specific tokens
        light: {
          bg: '#F6F7FA',
          surface: '#FFFFFF',
          'surface-secondary': '#F0F2F6',
          elevated: '#FFFFFF',
          border: '#E1E4EA',
          'subtle-border': '#ECEEF2',
          text: '#171A21',
          'text-secondary': '#5F6878',
          muted: '#858D9B',
        },
        // Brand palette
        brand: {
          purple: '#6D5AE6',
          'purple-hover': '#7B6AEF',
          secondary: '#4D7CFE',
          accent: '#9B8AFB',
          // Light brand variants
          'light-primary': '#5546C7',
          'light-hover': '#493BB5',
          'light-secondary': '#356AE6',
          'light-accent': '#7567D8',
          // Feedback
          success: '#35B779',
          'success-light': '#218A5A',
          warning: '#E5A93D',
          'warning-light': '#A87516',
          error: '#E05D65',
          'error-light': '#C74752',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(109, 90, 230, 0.15)',
        'glow-md': '0 0 25px rgba(109, 90, 230, 0.25)',
        'glow-lg': '0 0 40px rgba(109, 90, 230, 0.35)',
      }
    },
  },
  plugins: [],
}
