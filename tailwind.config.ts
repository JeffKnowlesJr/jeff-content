import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: '500'
            },
            strong: {
              color: 'inherit',
              fontWeight: '600'
            },
            code: {
              color: 'inherit',
              backgroundColor: 'rgb(0 0 0 / 0.05)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            pre: {
              color: 'inherit',
              backgroundColor: 'rgb(0 0 0 / 0.05)',
              padding: '1em',
              borderRadius: '0.5rem'
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0'
            }
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}

export default config
