import plugin from 'tailwindcss/plugin';

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
        // Direct User Palette Tokens: #2C3E50, #2980B9, #E67E22, #ECF0F1, #95A5A6
        palette: {
          midnight: '#2C3E50',
          navy: '#2C3E50',
          blue: '#2980B9',
          orange: '#E67E22',
          clouds: '#ECF0F1',
          concrete: '#95A5A6',
        },
        'dark-900': '#1A252F',
        'dark-800': '#2C3E50',
        'dark-700': '#34495E',
        // Dark theme specific tokens
        dark: {
          bg: '#1A252F', // Deep midnight base foundation
          surface: '#2C3E50', // Core Palette #2C3E50
          elevated: '#34495E', // Wet Asphalt complement
          highest: '#3E5871',
          border: 'rgba(149, 165, 166, 0.25)', // Core Palette #95A5A6 (25% opacity)
          'subtle-border': 'rgba(149, 165, 166, 0.15)',
          text: '#ECF0F1', // Core Palette #ECF0F1
          'text-secondary': '#BDC3C7', // Silver light slate complement
          muted: '#95A5A6', // Core Palette #95A5A6
        },
        // Light theme specific tokens
        light: {
          bg: '#ECF0F1', // Core Palette #ECF0F1
          surface: '#FFFFFF',
          'surface-secondary': '#F4F6F7',
          elevated: '#FFFFFF',
          border: 'rgba(149, 165, 166, 0.4)', // Core Palette #95A5A6
          'subtle-border': 'rgba(149, 165, 166, 0.2)',
          text: '#2C3E50', // Core Palette #2C3E50
          'text-secondary': '#34495E',
          muted: '#7F8C8D',
        },
        // Brand palette
        brand: {
          purple: '#2980B9', // Core Palette #2980B9 (Primary brand / buttons / links)
          'purple-hover': '#3498DB', // Bright Peter River hover
          secondary: '#2980B9',
          accent: '#E67E22', // Core Palette #E67E22 (Vibrant festival accent)
          orange: '#E67E22',
          'orange-hover': '#D35400',
          blue: '#2980B9',
          'blue-hover': '#3498DB',
          // Light brand variants
          'light-primary': '#2980B9',
          'light-hover': '#1F618D',
          'light-secondary': '#2980B9',
          'light-accent': '#E67E22',
          // Feedback
          success: '#27AE60',
          'success-light': '#2ECC71',
          warning: '#E67E22', // Core Palette #E67E22
          'warning-light': '#F39C12',
          error: '#E74C3C',
          'error-light': '#C0392B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(41, 128, 185, 0.2)',
        'glow-md': '0 0 25px rgba(41, 128, 185, 0.35)',
        'glow-lg': '0 0 40px rgba(41, 128, 185, 0.45)',
        'glow-orange': '0 0 25px rgba(230, 126, 34, 0.35)',
      }
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('light', ['.light &', '.light&']);
    })
  ],
}
