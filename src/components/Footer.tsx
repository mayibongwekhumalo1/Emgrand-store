import React from 'react'
import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Emgrand Digital</h3>
            <p className="text-gray-400">
              Your one-stop shop for all your digital needs. Quality products at affordable prices.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/products?category=electronics" className="text-gray-400 hover:text-white">Electronics</Link></li>
              <li><Link href="/products?category=clothing" className="text-gray-400 hover:text-white">Clothing</Link></li>
              <li><Link href="/products?category=books" className="text-gray-400 hover:text-white">Books</Link></li>
              <li><Link href="/products?category=home" className="text-gray-400 hover:text-white">Home & Garden</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li>123 Digital Street</li>
              <li>Tech City, TC 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@emgranddigital.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 Emgrand Digital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer