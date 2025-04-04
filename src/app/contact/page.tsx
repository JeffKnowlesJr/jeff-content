import { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact | Jeff Knowles Jr.',
  description:
    'Get in touch with Jeff Knowles Jr. for collaboration opportunities, consulting, or just to say hello.'
}

export default function ContactPage() {
  return (
    <div className='min-h-screen py-20 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
            Let&apos;s Connect
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            Whether you have a project in mind, need technical consulting, or
            just want to chat about technology, I&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Form Section */}
        <div className='grid md:grid-cols-2 gap-12'>
          {/* Form */}
          <div className='card p-8'>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className='space-y-8'>
            {/* Quick Contact */}
            <div className='card p-8'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                Quick Contact
              </h2>
              <div className='space-y-4'>
                <a
                  href='mailto:hello@jeffknowlesjr.com'
                  className='flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors'
                >
                  <svg
                    className='w-6 h-6 mr-3'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                  hello@jeffknowlesjr.com
                </a>
                <a
                  href='https://linkedin.com/in/jeffknowlesjr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors'
                >
                  <svg
                    className='w-6 h-6 mr-3'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                  </svg>
                  LinkedIn Profile
                </a>
                <a
                  href='https://github.com/jeffknowlesjr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors'
                >
                  <svg
                    className='w-6 h-6 mr-3'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                  GitHub Profile
                </a>
              </div>
            </div>

            {/* Services */}
            <div className='card p-8'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                Services
              </h2>
              <div className='space-y-4'>
                <div className='flex items-start'>
                  <svg
                    className='w-6 h-6 mr-3 text-primary dark:text-primary-light mt-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      Web Development
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300'>
                      Custom web applications built with modern technologies
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <svg
                    className='w-6 h-6 mr-3 text-primary dark:text-primary-light mt-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'
                    />
                  </svg>
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      Cloud Architecture
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300'>
                      Scalable and secure cloud infrastructure design
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <svg
                    className='w-6 h-6 mr-3 text-primary dark:text-primary-light mt-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                    />
                  </svg>
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      Technical Consulting
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300'>
                      Expert advice on technology stack and architecture
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
