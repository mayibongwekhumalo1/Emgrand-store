import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

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

const Recommendations: React.FC = () => {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendedProducts()
  }, [])

  const fetchRecommendedProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products?limit=4&sort=rating')
      const data = await response.json()
      setRecommendedProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching recommended products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Recommended for You</h2>
          <div className="text-center">Loading recommendations...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {recommendedProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No recommendations available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Recommendations