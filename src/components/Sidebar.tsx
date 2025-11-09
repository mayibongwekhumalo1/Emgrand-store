// components/Sidebar.tsx
import { ChevronRight } from "lucide-react";

export default function Sidebar({ isOpen, onClose, onFilterChange }: { isOpen?: boolean; onClose?: () => void; onFilterChange?: (filter: string) => void } = {}) {
   console.log('Sidebar rendering with props:', { isOpen, onClose, onFilterChange });
  return (
    <aside className="w-full md:w-64 lg:w-60">
      <div className="bg-white rounded-xl p-4 shadow-sm sticky top-24">
        <h3 className="font-medium text-gray-800 mb-3">Category</h3>

        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center justify-between p-2 rounded-md bg-gray-50">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-black"
                onChange={() => {
                  console.log('All Product checkbox clicked');
                  onFilterChange?.('All Product');
                }}
              />
              <span>All Product</span>
            </div>
            <span className="text-xs text-gray-400">30</span>
          </li>

          <li className="pl-2">
            <input
              type="checkbox"
              className="accent-black mr-2"
              onChange={() => {
                console.log('For Home checkbox clicked');
                onFilterChange?.('For Home');
              }}
            />
            For Home
          </li>
          <li className="pl-2">
            <input
              type="checkbox"
              className="accent-black mr-2"
              onChange={() => {
                console.log('For Music checkbox clicked');
                onFilterChange?.('For Music');
              }}
            />
            For Music
          </li>
          <li className="pl-2">
            <input
              type="checkbox"
              className="accent-black mr-2"
              onChange={() => {
                console.log('For Phone checkbox clicked');
                onFilterChange?.('For Phone');
              }}
            />
            For Phone
          </li>
          <li className="pl-2">
            <input
              type="checkbox"
              className="accent-black mr-2"
              onChange={() => {
                console.log('For Storage checkbox clicked');
                onFilterChange?.('For Storage');
              }}
            />
            For Storage
          </li>
        </ul>

        <div className="mt-4 border-t pt-3 text-sm text-gray-600">
          <div
            className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded px-2"
            onClick={() => {
              console.log('New Arrival clicked');
              onFilterChange?.('New Arrival');
            }}
          >
            <span>New Arrival</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div
            className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded px-2"
            onClick={() => {
              console.log('Best Seller clicked');
              onFilterChange?.('Best Seller');
            }}
          >
            <span>Best Seller</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div
            className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded px-2"
            onClick={() => {
              console.log('On Discount clicked');
              onFilterChange?.('On Discount');
            }}
          >
            <span>On Discount</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </aside>
  );
}
