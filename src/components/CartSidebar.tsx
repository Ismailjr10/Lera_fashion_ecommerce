import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './Button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();

  const formatWhatsAppMessage = () => {
    if (items.length === 0) return '';

    const itemsList = items
      .map(item => `- ${item.product.name}${item.selectedColor ? ` (${item.selectedColor})` : ''}${item.selectedSize ? ` - Size: ${item.selectedSize}` : ''} x${item.quantity} = ₦${(item.product.price * item.quantity).toLocaleString()}`)
      .join('%0A');

    const total = getTotalPrice();
    const message = `Hi! I'd like to place an order for the following items:%0A%0A${itemsList}%0A%0ATotal: ₦${total.toLocaleString()}%0A%0APlease confirm availability and arrange delivery. Thank you!`;

    return message;
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const message = formatWhatsAppMessage();
    const whatsappLink = `https://wa.me/2348012345678?text=${message}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" onClick={onClose} />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-300 flex flex-col overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-maroon-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-gray-600 text-center">Your cart is empty</p>
            <Button variant="secondary" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex gap-4 mb-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-maroon-900 text-sm">{item.product.name}</h3>
                      {item.selectedColor && (
                        <p className="text-xs text-gray-600">Color: {item.selectedColor}</p>
                      )}
                      {item.selectedSize && (
                        <p className="text-xs text-gray-600">Size: {item.selectedSize}</p>
                      )}
                      <p className="text-sm font-bold text-maroon-900 mt-1">
                        ₦{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 w-fit">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold text-maroon-900 min-w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.product.stock_quantity))}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₦{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-maroon-900 font-bold text-lg">
                  <span>Total:</span>
                  <span>₦{getTotalPrice().toLocaleString()}</span>
                </div>
                <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg text-center font-medium">
                  Free Shipping to Abuja & Lagos
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleWhatsAppCheckout}
                className="w-full"
              >
                Checkout via WhatsApp
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={onClose}
                className="w-full"
              >
                Continue Shopping
              </Button>

              <button
                onClick={clearCart}
                className="w-full text-sm text-gray-600 hover:text-red-600 transition-colors py-2"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
