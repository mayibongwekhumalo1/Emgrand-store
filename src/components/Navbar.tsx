import React from 'react'
import Link from 'next/link'

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Emgrand Digital
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800">Home</Link>
          <Link href="/products" className="text-gray-600 hover:text-gray-800">Products</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-800">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-800">Contact</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
            </svg>
          </Link>
          <Link href="/account" className="text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar