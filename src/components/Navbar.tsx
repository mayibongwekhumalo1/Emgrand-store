// components/Navbar.tsx
"use client";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-semibold text-gray-900">Stuffus</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/">Beranda</Link>
            <Link href="/shop" className="text-gray-900 font-medium">Shop</Link>
            <Link href="/catalog">Catalog</Link>
            <Link href="/blog">Blog</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
            <Search className="w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-gray-600 placeholder-gray-600"
            />
          </form>

          <Link href="/cart" className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            <span className="sr-only">Cart</span>
          </Link>

          <div className="w-8 h-8 rounded-full bg-gray-200" />
        </div>
      </div>
    </header>
  );
}
