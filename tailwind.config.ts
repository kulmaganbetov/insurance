import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0F172A',
        'bg-card': '#1E293B',
        'bg-card-hover': '#273449',
        'accent-green': '#10B981',
        'accent-blue': '#3B82F6',
        'risk-low': '#10B981',
        'risk-medium': '#F59E0B',
        'risk-high': '#EF4444',
        'risk-critical': '#7C3AED',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
