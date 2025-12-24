import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { Product } from '../lib/supabase';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export function SearchOverlay({ isOpen, onClose, onSelectProduct }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const { searchProducts } = useProducts();
  const results = query.length > 0 ? searchProducts(query) : [];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product);
    setQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="relative flex flex-col h-full">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <Search size={24} className="text-maroon-900 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1 text-lg outline-none border-none"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-2xl mx-auto">
            {query.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p>Enter a product name or keyword to search</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p>No products found for "{query}"</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors flex gap-4 text-left"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-maroon-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
                      <p className="text-lg font-bold text-maroon-900 mt-2">₦{product.price.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
