import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['SF Pro Display', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        purple: {
          600: '#9333ea',
          700: '#7e22ce',
        },
        yellow: {
          600: '#ca8a04',
          400: '#facc15',
        },
        green: {
          600: '#16a34a',
          400: '#4ade80',
        },
        navy: {
          900: '#0A192F',
          800: '#112240',
          700: '#1E3A5F',
          600: '#2A4A73',
        },
        blue: {
          900: '#1E3A8A',
          800: '#1E40AF',
          700: '#1D4ED8',
          600: '#2563EB',
          400: '#60A5FA',
          300: '#93C5FD',
          200: '#BFDBFE',
          100: '#DBEAFE',
        },
      },
    },
  },
  plugins: [],
};

export default config;