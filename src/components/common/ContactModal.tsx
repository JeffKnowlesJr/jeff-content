import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { ContactForm } from '../../components copy/ContactForm'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className='fixed inset-0 z-50 overflow-y-auto'>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className='fixed inset-0 bg-black/50 backdrop-blur-sm'
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className='relative min-h-screen flex items-center justify-center p-4'
        >
          <div className='relative w-full max-w-2xl bg-gradient-to-r from-complement to-complement-dark rounded-xl shadow-2xl'>
            {/* Close button */}
            <button
              onClick={onClose}
              className='absolute top-4 right-4 text-[#52babb]/70 hover:text-[#52babb] transition-colors'
              aria-label='Close modal'
            >
              <i className='fas fa-times text-lg'></i>
            </button>

            {/* Content */}
            <div className='p-8'>
              <h2 className='text-2xl font-bold text-white mb-2'>
                Get in Touch
              </h2>
              <p className='text-gray-200 mb-6'>
                Have a project in mind? Let's discuss how I can help bring your
                ideas to life.
              </p>

              <ContactForm onClose={onClose} />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ContactModal
