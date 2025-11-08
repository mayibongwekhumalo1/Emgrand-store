import React from 'react'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  brand: string
  rating: number
  reviewCount: number
}

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={product.images[0] || '/placeholder.jpg'}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.brand}</p>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500">★</span>
          <span className="ml-1 text-sm">{product.rating} ({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-green-600">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Link
            href={`/products/${product._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard