
"use client"

import Hero from '@/components/Hero';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import Recommendations from "@/components/Recommendations";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

export default function Home() {
   const [products, setProducts] = useState<Product[]>([])
   const [loading, setLoading] = useState(true)
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);

   useEffect(() => {
     fetchProducts()
   }, [])

   const fetchProducts = async () => {
     try {
       const response = await fetch(`http://localhost:5000/api/products`)
       const data = await response.json()
       setProducts(data.products || [])
     } catch (error) {
       console.error('Error fetching products:', error)
     } finally {
       setLoading(false)
     }
   }

   // Filter products based on selected filters
   const filteredProducts = selectedFilters.length === 0
     ? products
     : products.filter(product => {
         if (selectedFilters.includes('All Product')) return true;
         if (selectedFilters.includes('For Home') && product.category === 'Home') return true;
         if (selectedFilters.includes('For Music') && product.category === 'Electronics') return true;
         if (selectedFilters.includes('For Phone') && product.category === 'Electronics') return true;
         if (selectedFilters.includes('For Storage') && product.category === 'Electronics') return true;
         if (selectedFilters.includes('New Arrival')) return product.rating > 4.5;
         if (selectedFilters.includes('Best Seller')) return product.reviewCount > 200;
         if (selectedFilters.includes('On Discount')) return product.originalPrice && product.originalPrice > product.price;
         return false;
       });

   // Paginate products
   const productsPerPage = 9;
   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
   const startIndex = (currentPage - 1) * productsPerPage;
   const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

   useEffect(() => {
     console.log('Home component mounted');
     console.log('Products:', products);
     console.log('Products length:', products?.length);
     if (products && products.length > 0) {
       console.log('First product:', products[0]);
     }
     console.log('Initial sidebarOpen state:', sidebarOpen);
     console.log('Initial selectedFilters:', selectedFilters);
     console.log('Initial currentPage:', currentPage);
   }, [products, sidebarOpen, selectedFilters, currentPage]);

   useEffect(() => {
     console.log('Filters changed:', selectedFilters);
     console.log('Filtered products count:', filteredProducts.length);
     console.log('Total pages:', totalPages);
   }, [selectedFilters, filteredProducts.length, totalPages]);

   const handleFilterChange = (filter: string) => {
     console.log('Filter change attempted:', filter);
     console.log('Current filters before change:', selectedFilters);
     setSelectedFilters(prev => {
       const newFilters = prev.includes(filter)
         ? prev.filter(f => f !== filter)
         : [...prev, filter];
       console.log('New filters after change:', newFilters);
       return newFilters;
     });
     setCurrentPage(1); // Reset to first page when filters change
   };

   const handlePageChange = (page: number) => {
     console.log('Page change attempted:', page);
     console.log('Current page before change:', currentPage);
     setCurrentPage(page);
     console.log('Page changed to:', page);
   };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Navbar />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Hero products={products} />
      </motion.div>

      <motion.main
        className="max-w-7xl mx-auto px-4 lg:px-8 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onFilterChange={handleFilterChange} />
          </motion.div>

          {/* Product grid */}
          <motion.div
            className="lg:col-span-9"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((p, index) => (
                <motion.div
                  key={p._id + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>

            {/* Pagination mock */}
            <motion.div
              className="mt-6 flex items-center justify-between text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <button
                onClick={() => {
                  console.log('Previous button clicked');
                  handlePageChange(Math.max(1, currentPage - 1));
                }}
                className="hover:text-gray-700 cursor-pointer"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => {
                      console.log(`Page ${page} button clicked`);
                      handlePageChange(page);
                    }}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      currentPage === page ? 'bg-black text-white' : 'bg-white shadow hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  console.log('Next button clicked');
                  handlePageChange(Math.min(totalPages, currentPage + 1));
                }}
                className="hover:text-gray-700 cursor-pointer"
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <Recommendations items={products.slice(0, 4)} />
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <Newsletter />
        </motion.div>

      </motion.main>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <Footer />
      </motion.div>
    </>
  );
}
