import React, { useState } from 'react'

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMessage('Thank you for subscribing!')
        setEmail('')
      } else {
        setMessage('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="py-12 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-xl mb-8">Subscribe to our newsletter for the latest deals and products</p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-l-lg text-gray-900"
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-r-lg font-semibold hover:bg-yellow-400 transition duration-300"
            >
              Subscribe
            </button>
          </div>
        </form>
        {message && (
          <p className="mt-4 text-lg">{message}</p>
        )}
      </div>
    </section>
  )
}

export default Newsletter