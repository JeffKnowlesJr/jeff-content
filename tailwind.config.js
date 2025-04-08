/**
 * Tailwind CSS Configuration
 *
 * This configuration file customizes the Tailwind CSS framework for the project.
 * It includes:
 * - Custom color scheme with CSS variables
 * - Typography settings
 * - Dark mode configuration
 * - Custom font family
 * - Plugin configurations
 */

import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'
import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  // Files to scan for Tailwind classes
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],

  // Enable dark mode using class strategy
  darkMode: ['class', "[class~='dark']"],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Merriweather', ...defaultTheme.fontFamily.serif],
        inter: ['Inter', 'sans-serif']
      },
      colors: {
        primary: {
          light: '#5eead4',
          DEFAULT: '#14b8a6',
          dark: '#0f766e'
        },
        complement: {
          light: '#9ca3af',
          DEFAULT: '#4b5563',
          dark: '#1f2937'
        },
        secondary: {
          light: '#a855f7',
          DEFAULT: '#7e22ce',
          dark: '#6b21a8'
        },
        theme: {
          light: '#ffffff',
          DEFAULT: '#f8fafc',
          dark: '#0f172a'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        },
        'code-blue': '#0a1c2e',
        syntax: {
          base: '#e9e9e9',
          comment: '#6c8bb9',
          punctuation: '#7ec2ff',
          property: '#ff7ea6',
          string: '#25c52e',
          operator: '#67cdff',
          keyword: '#e6ac00',
          function: '#f182fa'
        }
      },
      padding: {
        mobile: '1rem',
        desktop: '2rem'
      }
    }
  },

  // Tailwind CSS plugins
  plugins: [typography, forms, aspectRatio]
}
