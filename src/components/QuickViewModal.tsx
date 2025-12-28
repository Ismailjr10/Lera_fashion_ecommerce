import { useState } from 'react';
import { Product } from '../lib/supabase';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { StarRating } from './StarRating';
import { useProductReviews } from '../hooks/useProductReviews';
import { useCart } from '../context/CartContext';
import { Plus, Minus } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addItem } = useCart();

  // 🚨 CRITICAL FIX: The Hook MUST be called here, unconditionally.
  // We pass (product?.id || '') so it runs even if product is null.
  const { average, count, reviews } = useProductReviews(product?.id || '');

  // 🛑 Logic check: NOW we can check if product exists
  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor || undefined, selectedSize || undefined);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    setQuantity(1);
    setSelectedColor('');
    setSelectedSize('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96 md:h-full">
            <img
              src={product.images[0] || 'https://via.placeholder.com/400x500'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.is_low_stock && (
              <div className="absolute top-4 right-4">
                <Badge text={`Only ${product.stock_quantity} Left!`} variant="low-stock" />
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:border-2 hover:border-maroon-900 transition-all"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-maroon-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <StarRating rating={average} showCount={true} count={count} />
            </div>
            <p className="text-gray-600 text-base leading-relaxed">{product.description}</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-maroon-900">₦{product.price.toLocaleString()}</p>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      selectedColor === color
                        ? 'border-maroon-900 bg-maroon-50 text-maroon-900'
                        : 'border-gray-200 hover:border-maroon-900'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                      selectedSize === size
                        ? 'border-maroon-900 bg-maroon-50 text-maroon-900'
                        : 'border-gray-200 hover:border-maroon-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-6">
             <div className="flex items-center gap-4 mb-4">
               <button 
                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
               >
                 <Minus size={20} />
               </button>
               <span className="font-bold text-xl w-8 text-center">{quantity}</span>
               <button 
                 onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
               >
                 <Plus size={20} />
               </button>
             </div>

            <Button
              variant="primary"
              size="lg"
              className={`w-full ${addedToCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
            >
              {product.stock_quantity === 0 
                ? 'Out of Stock' 
                : addedToCart 
                  ? 'Added to Cart!' 
                  : 'Add to Cart'}
            </Button>
          </div>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-maroon-900 mb-3">Recent Reviews</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="text-sm bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-800">{review.reviewer_name}</span>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-gray-600 mt-1">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}