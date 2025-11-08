import React from 'react'

const Hero: React.FC = () => {
  return (
    <section className="hero bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Emgrand Digital
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Discover amazing products at unbeatable prices
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
          Shop Now
        </button>
      </div>
    </section>
  )
}

export default Hero