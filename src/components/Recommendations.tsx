// components/Recommendations.tsx
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  title: string;
  price: number;
  image?: string;
}

export default function Recommendations({ items }: { items: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;
  const maxIndex = Math.max(0, items.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Explore our recommendations</h3>

        <div className="flex items-center gap-2 text-gray-500">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-2 bg-white rounded-full shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="p-2 bg-white rounded-full shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {visibleItems.map((it, idx) => (
          <motion.div
            key={it._id}
            className="bg-white rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
              <Image
                src={it.image ?? "/images/product-placeholder.png"}
                width={150}
                height={120}
                alt={it.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
              />
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-800">{it.title}</h4>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500">5.0 (2.1k Reviews)</div>
                <div className="font-semibold text-gray-900">${it.price.toFixed(2)}</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  className="flex-1 border border-gray-200 rounded-full py-1 text-xs hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    console.log('Recommendations Add to Cart button clicked for product:', it._id);
                    // TODO: Implement add to cart functionality
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-black text-white rounded-full py-1 px-3 text-xs hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    console.log('Recommendations Buy Now button clicked for product:', it._id);
                    // TODO: Implement buy now functionality
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
