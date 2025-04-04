'use client'

import { useState } from 'react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      // TODO: Replace with your actual form submission logic
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again later.')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
          className='form-input w-full'
          placeholder='Your name'
        />
      </div>

      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
          className='form-input w-full'
          placeholder='your.email@example.com'
        />
      </div>

      <div>
        <label
          htmlFor='subject'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          Subject
        </label>
        <select
          id='subject'
          name='subject'
          value={formData.subject}
          onChange={handleChange}
          required
          className='form-select w-full text-gray-900 dark:text-white'
        >
          <option value=''>Select a subject</option>
          <option value='project'>Project Inquiry</option>
          <option value='consulting'>Technical Consulting</option>
          <option value='collaboration'>Collaboration</option>
          <option value='other'>Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='message'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          Message
        </label>
        <textarea
          id='message'
          name='message'
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className='form-textarea w-full'
          placeholder='Your message...'
        />
      </div>

      {status === 'error' && (
        <div className='text-red-600 dark:text-red-400 text-sm'>
          {errorMessage}
        </div>
      )}

      {status === 'success' && (
        <div className='text-green-600 dark:text-green-400 text-sm'>
          Thank you for your message! I&apos;ll get back to you soon.
        </div>
      )}

      <button
        type='submit'
        disabled={status === 'submitting'}
        className='btn btn-primary w-full'
      >
        {status === 'submitting' ? (
          <span className='flex items-center justify-center'>
            <svg
              className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  )
}
