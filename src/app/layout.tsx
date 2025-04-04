import { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import ThemedApp from '@/components/ThemedApp'
import { generateWebsiteSchema } from '@/utils/schema'

// Define fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-merriweather'
})

// Generate website schema for JSON-LD
const jsonLd = generateWebsiteSchema()

// Define global metadata
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://jeffknowlesjr.com'
  ),
  title: {
    template: '%s | Jeff Knowles Jr',
    default: 'Jeff Knowles Jr - Portfolio & Blog'
  },
  description:
    'Personal portfolio and blog showcasing web development projects, technical articles, and professional services by Jeff Knowles Jr.',
  keywords: [
    'web development',
    'frontend',
    'backend',
    'full-stack',
    'react',
    'nextjs',
    'javascript',
    'typescript',
    'portfolio',
    'blog'
  ],
  authors: [{ name: 'Jeff Knowles Jr', url: 'https://jeffknowlesjr.com' }],
  creator: 'Jeff Knowles Jr',
  publisher: 'Jeff Knowles Jr',
  formatDetection: {
    email: true,
    address: true,
    telephone: true
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jeffknowlesjr.com',
    title: 'Jeff Knowles Jr - Portfolio & Blog',
    description:
      'Personal portfolio and blog showcasing web development projects, technical articles, and professional services.',
    siteName: 'Jeff Knowles Jr'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${inter.variable} ${merriweather.variable}`}
    >
      <head>
        <Script
          id='website-jsonld'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className='bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans'
        suppressHydrationWarning
      >
        <ThemedApp>
          <div className='relative min-h-screen flex flex-col'>
            <BackgroundAnimation />
            <Header />
            <main className='flex-grow w-full'>{children}</main>
            <Footer />
          </div>
        </ThemedApp>
      </body>
    </html>
  )
}
