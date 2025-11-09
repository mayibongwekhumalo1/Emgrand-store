
import Link from "next/link";
import { Twitter, Facebook, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold text-gray-800">About</h4>
          <ul className="mt-3 text-sm text-gray-600 space-y-2">
            <li><Link href="#">Blog</Link></li>
            <li><Link href="#">Meet The Team</Link></li>
            <li><Link href="#">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800">Support</h4>
          <ul className="mt-3 text-sm text-gray-600 space-y-2">
            <li><Link href="#">Contact Us</Link></li>
            <li><Link href="#">Shipping</Link></li>
            <li><Link href="#">Return</Link></li>
            <li><Link href="#">FAQ</Link></li>
          </ul>
        </div>

        <div className="flex flex-col justify-between">
          <div className="text-sm text-gray-600">Subscribe for updates</div>
          <div className="flex items-center gap-3 mt-2">
            <Twitter className="w-9 h-9 text-gray-900" />
            <Facebook className="w-9 h-9 text-gray-900" />
            <Linkedin className="w-9 h-9 text-gray-900" />
            <Instagram className="w-9 h-9 text-gray-900" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Stuffus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
