import { Product } from '../lib/supabase';
import { Badge } from './Badge';
import { StarRating } from './StarRating';

interface ProductCardProps {
  product: Product;
  averageRating?: number;
  reviewCount?: number;
  onQuickView: (product: Product) => void;
}

export function ProductCard({
  product,
  averageRating = 4.5,
  reviewCount = 0,
  onQuickView,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div
        className="relative w-full h-80 bg-gray-200 overflow-hidden cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.images[0] || 'https://via.placeholder.com/400x500'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.is_low_stock && (
          <div className="absolute top-4 right-4">
            <Badge text={`Only ${product.stock_quantity} Left!`} variant="low-stock" />
          </div>
        )}
        {!product.is_low_stock && product.stock_quantity > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-maroon-900">
            In Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-maroon-900 truncate mb-2">{product.name}</h3>

        <div className="mb-3">
          <StarRating rating={averageRating} size="sm" showCount={true} count={reviewCount} />
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-maroon-900">₦{product.price.toLocaleString()}</span>
          <button
            onClick={() => onQuickView(product)}
            className="px-4 py-2 bg-maroon-900 text-white rounded-lg hover:bg-maroon-800 transition-colors text-sm font-medium"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
