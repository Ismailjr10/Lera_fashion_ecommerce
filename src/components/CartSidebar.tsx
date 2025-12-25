import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { supabase } from '../lib/supabase';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  bust: string;
  waist: string;
  hip: string;
  height: string;
  pantLength: string;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    phone: '',
    address: '',
    bust: '',
    waist: '',
    hip: '',
    height: '',
    pantLength: '',
  });

  useEffect(() => {
    if (step === 'checkout' && user) {
      fetchUserProfile();
    }
  }, [step, user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (data) {
        setFormData({
          name: data.first_name || '',
          phone: data.phone || '',
          address: data.address || '',
          bust: data.bust_size || '',
          waist: data.waist_size || '',
          hip: data.hip_size || '',
          height: data.height || '',
          pantLength: data.pant_length || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatWhatsAppMessage = () => {
    if (items.length === 0) return '';

    const itemsList = items
      .map(item => `- ${item.product.name}${item.selectedColor ? ` (${item.selectedColor})` : ''}${item.selectedSize ? ` - Size: ${item.selectedSize}` : ''} x${item.quantity} = ₦${(item.product.price * item.quantity).toLocaleString()}`)
      .join('%0A');

    const total = getTotalPrice();
    const measurements = `%0A%0A*Measurements:*%0ABust: ${formData.bust || 'Not provided'}%0AWaist: ${formData.waist || 'Not provided'}%0AHips: ${formData.hip || 'Not provided'}%0AHeight: ${formData.height || 'Not provided'}%0APant Length: ${formData.pantLength || 'Not provided'}`;

    const message = `Hi! I'd like to place an order.%0A%0A*Items:*%0A${itemsList}%0A%0A*Customer Information:*%0AName: ${formData.name}%0APhone: ${formData.phone}%0AAddress: ${formData.address}${measurements}%0A%0A*Total: ₦${total.toLocaleString()}*%0A%0APlease confirm availability and arrange delivery. Thank you!`;

    return message;
  };

  const handleCompleteOrder = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill in all contact information');
      return;
    }

    const message = formatWhatsAppMessage();
    const whatsappLink = `https://wa.me/2348012345678?text=${message}`;
    window.open(whatsappLink, '_blank');
    clearCart();
    setStep('cart');
    onClose();
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
          <h2 className="text-xl font-bold text-maroon-900 font-serif">
            {step === 'cart' ? 'Your Cart' : 'Complete Order'}
          </h2>
          <button
            onClick={() => {
              setStep('cart');
              onClose();
            }}
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
        ) : step === 'cart' ? (
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
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => setStep('checkout')}
                className="w-full"
              >
                Proceed to Checkout
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
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h3 className="font-semibold text-maroon-900">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={loading}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100 text-sm resize-none"
                  />
                </div>
              </div>

              <h3 className="font-semibold text-maroon-900 pt-2">Measurements</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Bust
                    </label>
                    <input
                      type="text"
                      value={formData.bust}
                      onChange={(e) => setFormData({ ...formData, bust: e.target.value })}
                      disabled={loading}
                      placeholder="e.g., 34"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Waist
                    </label>
                    <input
                      type="text"
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                      disabled={loading}
                      placeholder="e.g., 28"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Hip
                    </label>
                    <input
                      type="text"
                      value={formData.hip}
                      onChange={(e) => setFormData({ ...formData, hip: e.target.value })}
                      disabled={loading}
                      placeholder="e.g., 36"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      disabled={loading}
                      placeholder="e.g., 170"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100 text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pant Length
                    </label>
                    <input
                      type="text"
                      value={formData.pantLength}
                      onChange={(e) => setFormData({ ...formData, pantLength: e.target.value })}
                      disabled={loading}
                      placeholder="e.g., 32"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 mt-4">
                <div className="text-lg font-bold text-maroon-900">
                  Total: ₦{getTotalPrice().toLocaleString()}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 space-y-3 bg-gray-50">
              <Button
                variant="primary"
                size="lg"
                onClick={handleCompleteOrder}
                disabled={loading}
                className="w-full"
              >
                Complete Order
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => setStep('cart')}
                className="w-full"
              >
                Back to Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
