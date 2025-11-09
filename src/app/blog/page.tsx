'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  image: string
  category: string
  readTime: number
}

const sampleBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of E-commerce: Trends to Watch in 2024',
    excerpt: 'Explore the latest trends shaping the e-commerce landscape, from AI-powered personalization to sustainable shopping practices.',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    image: '/blog/ecommerce-trends.jpg',
    category: 'E-commerce',
    readTime: 5
  },
  {
    id: '2',
    title: 'Building a Sustainable Fashion Brand: Lessons Learned',
    excerpt: 'How Stuffus implemented eco-friendly practices and what we learned along the way.',
    author: 'Mike Chen',
    date: '2024-01-10',
    image: '/blog/sustainable-fashion.jpg',
    category: 'Sustainability',
    readTime: 7
  },
  {
    id: '3',
    title: 'Customer Experience: The Key to Online Success',
    excerpt: 'Why focusing on customer experience can make or break your online business.',
    author: 'Emma Davis',
    date: '2024-01-05',
    image: '/blog/customer-experience.jpg',
    category: 'Business',
    readTime: 4
  },
  {
    id: '4',
    title: 'Tech Innovations in Retail: What\'s Next?',
    excerpt: 'From AR try-ons to smart inventory management, discover the tech transforming retail.',
    author: 'Alex Rodriguez',
    date: '2023-12-28',
    image: '/blog/tech-retail.jpg',
    category: 'Technology',
    readTime: 6
  },
  {
    id: '5',
    title: 'The Art of Product Photography',
    excerpt: 'Tips and tricks for creating stunning product photos that drive sales.',
    author: 'Lisa Wang',
    date: '2023-12-20',
    image: '/blog/product-photography.jpg',
    category: 'Photography',
    readTime: 8
  },
  {
    id: '6',
    title: 'Understanding Consumer Behavior in the Digital Age',
    excerpt: 'Insights into how modern consumers shop and what influences their purchasing decisions.',
    author: 'David Kim',
    date: '2023-12-15',
    image: '/blog/consumer-behavior.jpg',
    category: 'Marketing',
    readTime: 6
  }
]

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(sampleBlogPosts)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(posts.map(post => post.category)))]

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(post => post.category === selectedCategory)

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, trends, and stories from the world of e-commerce and retail
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg'
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white bg-opacity-90 text-gray-900 px-2 py-1 rounded text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} min read</span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  <Link href={`/blog/${post.id}`} className="hover:text-gray-700">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.id}`}
                  className="text-gray-900 font-medium hover:text-gray-700 inline-flex items-center"
                >
                  Read more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts found in this category.</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Subscribe to our newsletter for the latest insights and trends in e-commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}