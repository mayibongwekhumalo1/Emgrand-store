// components/Hero.tsx
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroImages = [
  "https://res.cloudinary.com/dxrv8lauy/image/upload/v1750773814/samples/shoe.jpg",
  "https://res.cloudinary.com/dxrv8lauy/image/upload/v1733773814/samples/ecommerce/accessories-bag.jpg",
  "https://res.cloudinary.com/dxrv8lauy/image/upload/v1733773814/samples/ecommerce/leather-bag-gray.jpg"
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="relative">
      {/* background image carousel */}
      <div className="h-56 md:h-72 lg:h-96 w-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentImageIndex]}
              alt="hero"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
              sizes="100vw"
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
            />
          </motion.div>
        </AnimatePresence>

        {/* Carousel navigation */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* large "Shop" text overlay */}
        <motion.h1
          className="absolute left-1/2 top-12 md:top-16 transform -translate-x-1/2 text-[120px] md:text-[200px] lg:text-[260px] leading-none font-extrabold text-white opacity-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)] select-none pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Shop
        </motion.h1>
      </div>

      {/* Search & tagline card positioned overlapping hero */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-12 md:-mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Give All You Need</h2>
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
              <input
                className="bg-transparent flex-1 outline-none text-sm"
                placeholder="Search on Stuffus"
              />
              <button className="bg-black text-white px-4 py-1 rounded-full text-sm">Search</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
