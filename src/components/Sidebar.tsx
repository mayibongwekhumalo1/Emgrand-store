import React from 'react'
import Link from 'next/link'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      )}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="p-4">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ul className="space-y-2">
            <li><Link href="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Home</Link></li>
            <li><Link href="/products" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Products</Link></li>
            <li><Link href="/categories" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Categories</Link></li>
            <li><Link href="/about" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">About</Link></li>
            <li><Link href="/contact" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Contact</Link></li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Sidebar