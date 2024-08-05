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
        blue: {
          600: '#2563eb',
          700: '#1d4ed8',
        },
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
      },
    },
  },
  plugins: [],
};

export default config;