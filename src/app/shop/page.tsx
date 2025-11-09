'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'

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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading products...</div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold mb-4">Filters</h3>

              <div className="space-y-4">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                </select>

                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
                />

                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full p-2 border rounded"
                />

                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="lg:col-span-9">
            <h1 className="text-3xl font-bold mb-8">Shop</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No products found matching your criteria.</p>
              </div>
            )}

            {/* Pagination mock */}
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
              <div>Previous</div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-white shadow rounded">1</div>
                <div className="px-3 py-1 rounded">2</div>
                <div className="px-3 py-1 rounded">3</div>
              </div>
              <div>Next</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}