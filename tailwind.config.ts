import type { Config } from 'tailwindcss';
import scrollbarPlugin from 'tailwind-scrollbar';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary-rgb, var(--color-primary)) / <alpha-value>)',
        'primary-focus': 'rgb(var(--color-primary-focus-rgb, var(--color-primary-focus)) / <alpha-value>)',
        'primary-content': 'rgb(var(--color-primary-content-rgb, var(--color-primary-content)) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        'secondary-focus': 'rgb(var(--color-secondary-focus) / <alpha-value>)',
        'secondary-content': 'rgb(var(--color-secondary-content) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-focus': 'rgb(var(--color-accent-focus) / <alpha-value>)',
        'accent-content': 'rgb(var(--color-accent-content) / <alpha-value>)',

        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--color-surface-alt) / <alpha-value>)',
        'surface-alt-2': 'rgb(var(--color-surface-alt-2) / <alpha-value>)',
        'surface-border': 'rgb(var(--color-surface-border) / <alpha-value>)',

        'on-surface': 'rgb(var(--color-on-surface) / <alpha-value>)',
        'on-surface-muted': 'rgb(var(--color-on-surface-muted) / <alpha-value>)',
        'on-surface-faint': 'rgb(var(--color-on-surface-faint) / <alpha-value>)',

        error: 'rgb(var(--color-error) / <alpha-value>)',
        'error-content': 'rgb(var(--color-error-content) / <alpha-value>)',
        'error-bg': 'rgb(var(--color-error-bg) / <alpha-value>)',

        success: 'rgb(var(--color-success) / <alpha-value>)',
        'success-content': 'rgb(var(--color-success-content) / <alpha-value>)',

        info: 'rgb(var(--color-info) / <alpha-value>)',
        'info-content': 'rgb(var(--color-info-content) / <alpha-value>)',
        'info-bg': 'rgb(var(--color-info-bg) / <alpha-value>)',

        'cat-copyright': 'rgb(var(--cat-color-copyright) / <alpha-value>)',
        'cat-character': 'rgb(var(--cat-color-character) / <alpha-value>)',
        'cat-general': 'rgb(var(--cat-color-general) / <alpha-value>)',
        'cat-meta': 'rgb(var(--cat-color-meta) / <alpha-value>)',
        'cat-other': 'rgb(var(--cat-color-other) / <alpha-value>)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
            "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
        },
      },
      animation: {
        heartBeat: 'heartBeat 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
    },
  },
  plugins: [
    scrollbarPlugin({ nocompatible: true }),
  ],
};

export default config;