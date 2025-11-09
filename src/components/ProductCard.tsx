// components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
};

export default function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: () => void }) {
  console.log('ProductCard rendering with product:', product);
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative bg-gray-50 rounded-lg h-40 flex items-center justify-center overflow-hidden">
        <Image
          src={product.images?.[0] ?? "/images/product-placeholder.png"}
          alt={product.name}
          width={200}
          height={200}
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
        />
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={onQuickView}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title="Quick View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors" title="Add to Wishlist">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
        {/* Sale Badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-medium text-gray-800">{product.name}</h4>
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>{product.rating ?? 4.8}</span>
            <span className="text-xs text-gray-400">({product.reviewCount ?? 0})</span>
          </div>

          <div className="text-gray-900 font-semibold">${product.price.toFixed(2)}</div>
        </div>

        <div className="mt-3 flex items-center gap-3">
           <button
             className="flex-1 border border-gray-200 rounded-full py-2 text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
             onClick={() => {
               console.log('Add to Cart button clicked for product:', product._id);
               // TODO: Implement add to cart functionality
             }}
           >
             Add to Cart
           </button>
           <Link
             href={`/checkout?product=${product._id}`}
             className="bg-black text-white rounded-full py-2 px-4 text-sm hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
             onClick={(e) => {
               console.log('Buy Now link clicked for product:', product._id);
               // Allow default navigation
             }}
           >
             Buy Now
           </Link>
         </div>
      </div>
    </div>
  );
}
