'use client'

import { useState, useRef, useEffect } from 'react'

// Define interface for form data
interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Form submission function
async function submitContactForm(formData: ContactFormData) {
  try {
    // Ensure we're using the correct API endpoint without trailing slash
    const apiUrl = '/api/contact/submit'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to submit contact form')
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting contact form:', error)
    throw error
  }
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Add a ref to track if a submission is in progress to prevent duplicates
  const isSubmittingRef = useRef(false)
  // Add a submission timestamp to debounce multiple rapid submissions
  const lastSubmitTimeRef = useRef(0)

  // Protect against external script errors (e.g., browser extensions)
  useEffect(() => {
    // Original error handler to catch and prevent extension errors
    const originalOnError = window.onerror

    window.onerror = function (message, source, lineno, colno, error) {
      // Check if the error is from the content script or mutation observer
      if (
        (typeof source === 'string' && source.includes('content-script')) ||
        (typeof message === 'string' && message.includes('MutationObserver'))
      ) {
        console.warn('Suppressed external script error:', { message, source })
        return true // Prevents the error from propagating
      }

      // Fall back to the original handler for other errors
      return originalOnError
        ? originalOnError(message, source, lineno, colno, error)
        : false
    }

    return () => {
      window.onerror = originalOnError
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent multiple rapid submissions (within 2 seconds)
    const now = Date.now()
    if (now - lastSubmitTimeRef.current < 2000) {
      console.log(
        'Preventing duplicate submission - too soon after last submit'
      )
      return
    }

    // Prevent concurrent submissions
    if (isSubmittingRef.current || status === 'submitting') {
      console.log('Submission already in progress, ignoring duplicate submit')
      return
    }

    // Set flags to prevent duplicate submissions
    isSubmittingRef.current = true
    lastSubmitTimeRef.current = now
    setStatus('submitting')
    setErrorMessage('')

    try {
      await submitContactForm(formData)
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again later.'
      )
    } finally {
      // Reset the submitting flag regardless of outcome
      isSubmittingRef.current = false
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
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
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input w-full text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input w-full text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="form-select w-full text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        >
          <option value="">Select a subject</option>
          <option value="project">Project Inquiry</option>
          <option value="consulting">Technical Consulting</option>
          <option value="collaboration">Collaboration</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="form-textarea w-full text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          placeholder="Your message... (Press Ctrl+Enter to send)"
        />
      </div>

      {status === 'error' && (
        <div className="text-red-600 dark:text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      {status === 'success' && (
        <div className="text-green-600 dark:text-green-400 text-sm">
          Thank you for your message! I&apos;ll get back to you soon.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn btn-primary w-full"
      >
        {status === 'submitting' ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
