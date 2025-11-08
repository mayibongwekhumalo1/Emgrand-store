import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Our E-Commerce Store
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing products at great prices
        </p>
        <div className="space-x-4">
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Shop Now
          </Link>
          <Link
            href="/auth/login"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
          <p className="text-gray-600">We offer only the highest quality products from trusted brands.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
          <p className="text-gray-600">Quick and reliable shipping to get your orders to you as soon as possible.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
          <p className="text-gray-600">Safe and secure payment processing with multiple payment options.</p>
        </div>
      </div>
    </main>
  )
}
