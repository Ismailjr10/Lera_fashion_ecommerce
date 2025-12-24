import { useState, useMemo } from 'react';
import { Product } from '../lib/supabase';
import { ProductCard } from './ProductCard';
import { useProducts } from '../context/ProductsContext';
import { useProductReviews } from '../hooks/useProductReviews';
import { ChevronDown } from 'lucide-react';

interface ShopPageProps {
  onQuickView: (product: Product) => void;
}

export function ShopPage({ onQuickView }: ShopPageProps) {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedColor, setSelectedColor] = useState('');

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedColor) {
      filtered = filtered.filter(p => p.colors.includes(selectedColor));
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.is_low_stock ? 1 : 0) - (a.is_low_stock ? 1 : 0));
    }

    return filtered;
  }, [products, selectedCategory, priceRange, sortBy, selectedColor]);

  const activeFiltersCount = [selectedCategory, selectedColor, priceRange[0] > 0 || priceRange[1] < 50000].filter(Boolean).length;

  const allColors = Array.from(new Set(products.flatMap(p => p.colors)));
  const categories = ['Abaya', 'Kaftan', 'Hijab'];

  return (
    <div id="shop" className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-maroon-900 mb-2">Shop Collection</h1>
        <p className="text-gray-600 mb-8">Discover our curated selection of luxury modest fashion</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-6 sticky top-24">
              <div>
                <h3 className="font-bold text-maroon-900 mb-4 text-lg">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setPriceRange([0, 50000]);
                      setSelectedColor('');
                      setSortBy('featured');
                    }}
                    className="text-sm text-maroon-900 hover:underline mb-4"
                  >
                    Clear All ({activeFiltersCount})
                  </button>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4 text-maroon-900"
                    />
                    <span className="text-gray-700">All</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4 text-maroon-900"
                      />
                      <span className="text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Min: ₦{priceRange[0].toLocaleString()}</label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-maroon-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Max: ₦{priceRange[1].toLocaleString()}</label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-maroon-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Color</h4>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900"
                >
                  <option value="">All Colors</option>
                  {allColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 appearance-none pr-8"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-2 top-3 text-gray-600 pointer-events-none" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No products match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const { average, count } = useProductReviews(product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      averageRating={average}
                      reviewCount={count}
                      onQuickView={onQuickView}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
