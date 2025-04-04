import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemedApp from '@/components/ThemedApp'
import BackgroundAnimation from '@/components/BackgroundAnimation'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather'
})

export const metadata: Metadata = {
  title: {
    template: '%s | Jeff Knowles Jr.',
    default: 'Jeff Knowles Jr. | Software Engineer & Cloud Architect'
  },
  description:
    'Full-stack software engineer and cloud architect specializing in modern web development, AWS, and scalable architectures.',
  metadataBase: new URL('https://jeffknowles.dev'),
  openGraph: {
    title: 'Jeff Knowles Jr.',
    description:
      'Full-stack software engineer and cloud architect specializing in modern web development.',
    url: 'https://jeffknowles.dev',
    siteName: 'Jeff Knowles Jr.',
    locale: 'en_US',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  twitter: {
    title: 'Jeff Knowles Jr.',
    card: 'summary_large_image',
    creator: '@jeffknowlesjr'
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code'
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
