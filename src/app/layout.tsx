import Script from 'next/script'
import './globals.css'
import { Inter, Merriweather } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import ThemedApp from '@/components/ThemedApp'
import { generateBaseMetadata } from '@/utils/metadata'
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
export const metadata = {
  ...generateBaseMetadata(),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
    other: {
      rel: 'icon',
      url: '/favicon.ico'
    }
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
