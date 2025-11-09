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

export default function ProductCard({ product }: { product: Product }) {
  console.log('ProductCard rendering with product:', product);
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
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
             className="flex-1 border border-gray-200 rounded-full py-2 text-sm hover:bg-gray-50 transition-colors"
             onClick={() => {
               console.log('Add to Cart button clicked for product:', product._id);
               // TODO: Implement add to cart functionality
             }}
           >
             Add to Cart
           </button>
           <Link
             href={`/checkout?product=${product._id}`}
             className="bg-black text-white rounded-full py-2 px-4 text-sm hover:bg-gray-800 transition-colors"
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
