import React from 'react'
import { motion } from 'framer-motion'

const Hero: React.FC = () => {
  return (
    <section className='text-white py-20'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row items-center'>
          <div className='md:w-1/2 mb-10 md:mb-0'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-5xl font-bold leading-tight mb-4'
            >
              Building Scalable Solutions & Data-Driven Insights
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-xl md:pr-10 opacity-90 mb-8'
            >
              Specializing in modern web workflows, microservice architecture,
              and full-stack JavaScript development. Let's build something
              amazing together.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='flex flex-wrap gap-4'
            >
              <a
                href='#projects'
                className='bg-white text-primary hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 inline-flex items-center'
              >
                <span>View Projects</span>
                <i className='fas fa-arrow-right ml-2'></i>
              </a>
              <a
                href='https://github.com/jeffknowlesjr'
                target='_blank'
                rel='noopener noreferrer'
                className='bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-3 px-6 rounded-lg transition duration-300'
              >
                <i className='fab fa-github mr-2'></i> GitHub Profile
              </a>
            </motion.div>
          </div>
          <div className='md:w-1/2'>
            <div className='grid grid-cols-2 gap-4'>
              {[
                {
                  icon: '💻',
                  title: 'Full Stack Dev',
                  description: 'Modern web workflows & architecture'
                },
                {
                  icon: '📊',
                  title: 'Data Analytics',
                  description: 'Google Analytics & Data Insights'
                },
                {
                  icon: '☁️',
                  title: 'AWS & Microservices',
                  description: 'Cloud solutions & serverless architecture'
                },
                {
                  icon: '🌊',
                  title: 'Webflow',
                  description: 'Custom designs & development'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 * (index + 3) }}
                  className='bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300'
                >
                  <div className='text-4xl mb-2'>{item.icon}</div>
                  <h3 className='text-xl font-bold mb-1'>{item.title}</h3>
                  <p className='opacity-90'>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
