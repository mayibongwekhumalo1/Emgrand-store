'use client'

import { useState, useEffect } from 'react'
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  })

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await fetch(`http://localhost:5000/api/products?${queryParams}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>

          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="input-field"
          >
            <option value="">All Brands</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Nike">Nike</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="input-field"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="input-field"
          />

          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="input-field"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="card">
            <img
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.brand}</p>
            <div className="flex items-center mb-2">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{product.rating} ({product.reviewCount})</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <Link
                href={`/products/${product._id}`}
                className="btn-primary"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}