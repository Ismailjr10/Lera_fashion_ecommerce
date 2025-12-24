import { createContext, useState, useCallback, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../lib/supabase';
import { CartItem, CartContextType } from '../types/cart';

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lera_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lera_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number, color?: string, size?: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.product.stock_quantity) }
            : item
        );
      }

      const newItem: CartItem = {
        id: `${product.id}-${color}-${size}-${Date.now()}`,
        product,
        quantity: Math.min(quantity, product.stock_quantity),
        selectedColor,
        selectedSize,
      };

      return [...prevItems, newItem];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantity: Math.max(1, Math.min(quantity, item.product.stock_quantity)),
          };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
