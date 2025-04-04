import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { submitContactForm } from '../../services/api'

interface WorkRequestFormProps {
  cardTitle: string
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  projectType: string
  description: string
}

const WorkRequestForm: React.FC<WorkRequestFormProps> = ({
  cardTitle,
  onClose
}) => {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    projectType: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Define theme-aware colors
  const bgColor = theme === 'dark' ? 'bg-[#282c34]' : 'bg-[#f8f5f0]'
  const inputBgColor = theme === 'dark' ? 'bg-[#1e2127]' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800'
  const labelColor = 'text-[#52babb]'
  const placeholderColor =
    theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500'
  const borderColor = 'border-[#52babb]/20'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Check if environment variables are loaded
    const config = {
      endpoint: import.meta.env.VITE_APPSYNC_ENDPOINT,
      region: import.meta.env.VITE_AWS_REGION,
      apiKey: import.meta.env.VITE_APPSYNC_API_KEY
    }

    console.log('Form submission started with config:', {
      hasEndpoint: !!config.endpoint,
      hasApiKey: !!config.apiKey,
      region: config.region
    })

    if (!config.endpoint || !config.apiKey) {
      console.error('API configuration is missing:', {
        hasEndpoint: !!config.endpoint,
        hasApiKey: !!config.apiKey
      })
      setError(
        'API configuration is missing. Please check your environment variables.'
      )
      setIsSubmitting(false)
      return
    }

    try {
      const formInput = {
        name: formData.name,
        email: formData.email,
        message: `Project Type: ${formData.projectType}\n\nDescription: ${formData.description}`
      }

      console.log('Submitting form with data:', {
        name: formInput.name,
        email: formInput.email.substring(0, 3) + '...',
        messageLength: formInput.message.length
      })

      const result = await submitContactForm(formInput)
      console.log('Submission successful with result ID:', result.id)

      setFormData({ name: '', email: '', projectType: '', description: '' })
      setIsSubmitting(false)
      setIsSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting form:', error)

      let errorMessage = 'Failed to submit form. Please try again.'

      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
        errorMessage = error.message
      }

      // Check for network issues
      if (!navigator.onLine) {
        errorMessage =
          'You appear to be offline. Please check your internet connection and try again.'
      }

      setError(errorMessage)
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div
      className={`${bgColor} rounded-xl border ${borderColor} p-6 transition-colors duration-300`}
    >
      <div className='flex justify-between items-center mb-6'>
        <h3 className={`text-xl ${textColor} font-semibold transition-colors`}>
          Request Work: {cardTitle}
        </h3>
        <button
          onClick={onClose}
          className='text-[#52babb]/70 hover:text-[#52babb] transition-colors'
          aria-label='Close form'
        >
          <i className='fas fa-times text-lg'></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='name' className={`block ${labelColor} mb-2`}>
            Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            required
            value={formData.name}
            onChange={handleChange}
            className={`w-full ${inputBgColor} ${textColor} border ${borderColor} rounded-lg p-3 focus:border-[#52babb] focus:outline-none transition-colors ${placeholderColor}`}
            placeholder='Your name'
          />
        </div>

        <div>
          <label htmlFor='email' className={`block ${labelColor} mb-2`}>
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            required
            value={formData.email}
            onChange={handleChange}
            className={`w-full ${inputBgColor} ${textColor} border ${borderColor} rounded-lg p-3 focus:border-[#52babb] focus:outline-none transition-colors ${placeholderColor}`}
            placeholder='your@email.com'
          />
        </div>

        <div>
          <label htmlFor='projectType' className={`block ${labelColor} mb-2`}>
            Project Type
          </label>
          <select
            id='projectType'
            name='projectType'
            required
            value={formData.projectType}
            onChange={handleChange}
            className={`w-full ${inputBgColor} ${textColor} border ${borderColor} rounded-lg p-3 focus:border-[#52babb] focus:outline-none transition-colors`}
          >
            <option value=''>Select a project type</option>
            <option value='Full Website'>Full Website</option>
            <option value='Feature Development'>Feature Development</option>
            <option value='UI/UX Design'>UI/UX Design</option>
            <option value='Performance Optimization'>
              Performance Optimization
            </option>
            <option value='Cloud Integration'>Cloud Integration</option>
            <option value='Other'>Other</option>
          </select>
        </div>

        <div>
          <label htmlFor='description' className={`block ${labelColor} mb-2`}>
            Project Description
          </label>
          <textarea
            id='description'
            name='description'
            required
            value={formData.description}
            onChange={handleChange}
            className={`w-full ${inputBgColor} ${textColor} border ${borderColor} rounded-lg p-3 focus:border-[#52babb] focus:outline-none transition-colors min-h-[120px] ${placeholderColor}`}
            placeholder='Describe your project or requirements...'
          />
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isSubmitting
              ? 'bg-[#52babb]/50 cursor-not-allowed'
              : 'bg-[#52babb] hover:bg-[#52babb]/90'
          } text-white`}
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center'>
              <i className='fas fa-circle-notch fa-spin mr-2'></i>
              Sending...
            </span>
          ) : (
            'Send Request'
          )}
        </button>

        {isSuccess && (
          <div className='text-green-400 text-center mt-4'>
            Request sent successfully! We'll be in touch soon.
          </div>
        )}
        {error && <div className='text-red-400 text-center mt-4'>{error}</div>}
      </form>
    </div>
  )
}

export default WorkRequestForm
